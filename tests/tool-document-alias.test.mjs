import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { PUBLIC_TOOL_METADATA } from '../src/tool-metadata.js';

// Evaluate the actual routing functions and tool registry, not a copied parser.
// No component is mounted and no API/network dependency is available in the VM.
const source = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const registry = source.match(/^const INVENTORY_TOOL_COPY = \{[\s\S]*?^\};/m)?.[0];
assert.ok(registry, 'real tool registry must be present');
const names = ['parseLeadMagnetPath', 'parseToolHomePath', 'getPageConfig'];
const functions = names.map(name => {
  const definition = source.match(new RegExp(`^function ${name}\\([^)]*\\) \\{[\\s\\S]*?^\\}`, 'm'))?.[0];
  assert.ok(definition, `real ${name} must be present`);
  return definition;
});
const routes = vm.runInNewContext(`${registry}\n${functions.join('\n')}\n({ ${names.join(', ')} })`, {
  PUBLIC_TOOL_METADATA,
  LEGAL_LINK: '/aviso-legal',
  PRIVACY_LINK: '/privacidad',
  DEFAULT_META_TITLE: 'test default title',
  DEFAULT_META_DESCRIPTION: 'test default description',
  fetch() { assert.fail('routing must not request the API'); },
});

const slugs = ['stockout-leak-score', 'discount-depth-analyzer'];

// Browser location.pathname excludes the query and fragment; preserve that
// boundary instead of making getPageConfig parse a full URL it never receives.
function configForUrl(path) {
  return routes.getPageConfig(new URL(path, 'https://velz.io').pathname);
}
for (const slug of slugs) {
  test(`document alias resolves to the public home: ${slug}`, () => {
    const config = routes.getPageConfig(`/tools/${slug}/index.html`);
    assert.equal(config.key, 'tool-home');
    assert.equal(config.toolHomeRoute.toolSlug, slug);
    assert.equal(config.leadMagnetRoute, undefined, 'document alias must never become an API token');
    assert.equal(config.canonical, `https://velz.io/tools/${slug}`);
    assert.equal(config.title, PUBLIC_TOOL_METADATA[slug].title);
    assert.equal(config.description, PUBLIC_TOOL_METADATA[slug].description);
  });

  for (const suffix of ['', '/', '?utm_source=test', '/?utm_source=test#cta', '/index.html?utm_source=test#cta']) {
    test(`public home keeps its canonical and has no token: ${slug}${suffix}`, () => {
      const config = configForUrl(`/tools/${slug}${suffix}`);
      assert.equal(config.key, 'tool-home');
      assert.equal(config.toolHomeRoute.toolSlug, slug);
      assert.equal(config.leadMagnetRoute, undefined);
      assert.equal(config.canonical, `https://velz.io/tools/${slug}`);
    });
  }

  for (const token of ['normal-token_123', 'opaque%20token', 'index.html-token', '%69ndex.html', 'INDEX.HTML']) {
    for (const suffix of ['', '/', '?utm_source=test#cta']) {
      test(`real diagnostic token stays private: ${slug}/${token}${suffix}`, () => {
        const pathname = new URL(`/tools/${slug}/${token}${suffix}`, 'https://velz.io').pathname;
        const parsed = routes.parseLeadMagnetPath(pathname);
        assert.equal(parsed.toolSlug, slug);
        assert.equal(parsed.token, decodeURIComponent(token));
        const config = routes.getPageConfig(pathname);
        assert.equal(config.key, 'lead-magnet');
        assert.equal(config.leadMagnetRoute.token, parsed.token);
        assert.equal(config.toolHomeRoute, undefined);
        assert.equal(config.canonical, `https://velz.io/tools/${slug}/${encodeURIComponent(parsed.token)}`);
      });
    }
  }

  test(`the low-level token parser remains unchanged: ${slug}`, () => {
    assert.equal(routes.parseLeadMagnetPath(`/tools/${slug}/index.html`).token, 'index.html');
    assert.equal(routes.parseLeadMagnetPath(`/tools/${slug}`), null);
    assert.equal(routes.parseToolHomePath(`/tools/${slug}/`).toolSlug, slug);
    assert.equal(routes.parseToolHomePath(`/tools/${slug}/index.html`), null);
    assert.equal(routes.getPageConfig(`/tools/${slug}/index.html/`).key, 'lead-magnet', 'only the exact static document alias is normalized');
  });
}

for (const [pathname, expected] of [
  ['/', 'landing'], ['/aviso-legal', 'legal'], ['/privacidad', 'privacy'],
  ['/index.html', 'landing'], ['/tools/unknown', 'landing'],
  ['/tools/unknown/index.html', 'lead-magnet'],
  ['/tools/stockout-leak-score/nested/index.html', 'landing'],
]) {
  test(`unrelated routes keep their behavior: ${pathname}`, () => {
    assert.equal(routes.getPageConfig(pathname).key, expected);
  });
}
