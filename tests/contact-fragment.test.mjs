import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { transformSync } from 'esbuild';
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';

// Execute the real App, not a copied scroll helper. Hook/DOM doubles model
// the failing seam: the document loads before React commits the CTA element.
const { code } = transformSync(readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8'), {
  loader: 'jsx', format: 'cjs', jsx: 'automatic',
  define: { 'import.meta.env.VITE_FORMSPREE_FORM_ID': '"test-form"' },
});

function mountApp({ pathname = '/', hash = '#cta', reducedMotion = false, strictMode = false } = {}) {
  const effects = [];
  const scrolls = [];
  const listeners = [];
  const elements = new Map();
  let committed = false;
  const hooks = {
    ...React,
    useState: initial => [initial, () => {}],
    useMemo: factory => factory(),
    useRef: initial => ({ current: initial }),
    useEffect: effect => effects.push(effect),
  };
  const window = {
    location: { pathname, hash }, scrollY: 0, React,
    addEventListener: event => listeners.push(event),
    removeEventListener() {},
  };
  const document = {
    title: '',
    querySelector: () => null,
    createElement: () => ({ setAttribute() {} }),
    head: { appendChild() {} },
    getElementById: id => elements.get(id) ?? null,
  };
  const module = { exports: {} };
  vm.runInNewContext(code, {
    module, exports: module.exports, window, document,
    navigator: { userAgent: 'node-test' },
    require(specifier) {
      if (specifier === 'react') return hooks;
      if (specifier === 'react/jsx-runtime') return jsxRuntime;
      if (specifier === 'framer-motion') return { motion: new Proxy({}, { get: (_, tag) => tag }), useReducedMotion: () => reducedMotion };
      if (specifier === '@formspree/react') return { useForm: () => [{}, () => {}], ValidationError: () => null };
      if (specifier.includes('aurora-background')) return { AuroraBackground: () => null };
      if (specifier === './analytics') return { track: () => {} };
      if (specifier.includes('.svg?raw')) return '<svg />';
      if (specifier.endsWith('.webp')) return 'headshot.webp';
      throw new Error(`Unexpected App dependency: ${specifier}`);
    },
  });
  assert.equal(document.getElementById('cta'), null, 'native fragment lookup precedes the React commit');
  const tree = module.exports.default();
  function commit(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(commit);
    if (node.props?.id) elements.set(node.props.id, {
      scrollIntoView(options) {
        assert.ok(committed, 'scroll must run after the CTA has committed');
        scrolls.push({ id: node.props.id, ...options });
        window.scrollY = 7000;
      },
    });
    commit(node.props?.children);
  }
  commit(tree);
  committed = true;
  const cleanups = effects.map(effect => effect());
  if (strictMode) {
    cleanups.forEach(cleanup => cleanup?.());
    effects.forEach(effect => effect());
  }
  return { scrolls, window, listeners };
}

test('initial /#cta recovers the missed native fragment after App commits', () => {
  const { scrolls, window } = mountApp();
  assert.equal(scrolls.length, 1, 'initial /#cta must scroll to the newly committed CTA');
  assert.equal(scrolls[0].id, 'cta');
  assert.ok(window.scrollY > 0, 'the initial fragment must not remain at scrollY=0');
});

for (const reducedMotion of [false, true]) {
  test(`initial fragment uses an instant jump (reduced motion: ${reducedMotion})`, () => {
    const { scrolls } = mountApp({ reducedMotion });
    assert.equal(scrolls[0].behavior, 'instant', 'do not inherit CSS smooth scrolling, even with reduced motion');
    assert.equal(scrolls[0].block, 'start');
  });
}

for (const hash of ['', '#hero', '#servicios', '#CTA']) {
  test(`does not force a scroll for ${JSON.stringify(hash)}`, () => {
    const { scrolls, window } = mountApp({ hash });
    assert.equal(scrolls.length, 0);
    assert.equal(window.scrollY, 0);
  });
}

for (const pathname of ['/aviso-legal', '/privacidad', '/tools/stockout-leak-score', '/tools/stockout-leak-score/token', '/unknown']) {
  test(`does not recover CTA fragments outside root: ${pathname}`, () => {
    assert.equal(mountApp({ pathname }).scrolls.length, 0);
  });
}

test('StrictMode effect replay is idempotent and adds no fragment listeners', () => {
  const { scrolls, window, listeners } = mountApp({ strictMode: true });
  assert.equal(scrolls.length, 2, 'synchronous setup can safely replay without pending work');
  assert.ok(scrolls.every(scroll => scroll.id === 'cta' && scroll.behavior === 'instant'));
  assert.equal(window.scrollY, 7000);
  assert.deepEqual(listeners, ['scroll', 'scroll'], 'only the pre-existing nav scroll effect registers listeners');
});
