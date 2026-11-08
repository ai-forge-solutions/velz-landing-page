import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { build } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));

test('postbuild invokes Node SSR unconditionally on Netlify and other hosts', async () => {
  const script = await readFile(path.join(root, 'scripts/postbuild.cjs'), 'utf8');
  assert.match(script, /render-home\.mjs/);
  assert.doesNotMatch(script, /react-snap|process\.env\.NETLIFY|npx/);
});

async function withShell(contents, run) {
  await mkdir(path.join(root, 'node_modules/.cache'), { recursive: true });
  const outDir = await mkdtemp(path.join(root, 'node_modules/.cache/home-shell-test-'));
  try {
    await writeFile(path.join(outDir, 'index.html'), contents);
    await run(outDir);
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
}

test('missing Formspree ID fails clearly without modifying the shell or leaving SSR bundles', async () => {
  const { renderHome } = await import('../scripts/render-home.mjs');
  const oldId = process.env.VITE_FORMSPREE_FORM_ID;
  const cache = path.join(root, 'node_modules/.cache');
  await withShell('<html><div id="root"></div></html>', async outDir => {
    const before = await readdir(cache);
    try {
      process.env.VITE_FORMSPREE_FORM_ID = '';
      await assert.rejects(renderHome({ root, outDir }), /requires VITE_FORMSPREE_FORM_ID/);
      assert.equal(await readFile(path.join(outDir, 'index.html'), 'utf8'), '<html><div id="root"></div></html>');
      assert.deepEqual(await readdir(cache), before);
    } finally {
      if (oldId === undefined) delete process.env.VITE_FORMSPREE_FORM_ID;
      else process.env.VITE_FORMSPREE_FORM_ID = oldId;
    }
  });
});

test('rejects a missing or nonempty root instead of destroying an existing document', async () => {
  const { renderHome } = await import('../scripts/render-home.mjs');
  for (const shell of ['<h1>No root</h1>', '<div id="root"><p>Unowned content</p></div>']) {
    await withShell(shell, async outDir => {
      await assert.rejects(renderHome({ root, outDir }), /exactly one empty #root/);
      assert.equal(await readFile(path.join(outDir, 'index.html'), 'utf8'), shell);
    });
  }
});

test('real home SSR preserves the client shell and asset URLs without browser/network globals', async () => {
  const { renderHome } = await import('../scripts/render-home.mjs');
  const work = await mkdtemp(path.join(root, 'node_modules/.cache/home-test-'));
  const oldFormId = process.env.VITE_FORMSPREE_FORM_ID;
  const originalFetch = globalThis.fetch;
  try {
    process.env.VITE_FORMSPREE_FORM_ID = 'local-test-only';
    const outDir = path.join(work, 'client');
    // An isolated real client build, never the shared dist or npm build lifecycle.
    await build({ root, logLevel: 'error', build: { outDir, emptyOutDir: true,
      rollupOptions: { input: path.join(root, 'index.html') } } });
    const index = path.join(outDir, 'index.html');
    const shell = await readFile(index, 'utf8');
    const untouched = path.join(outDir, 'other.html');
    await writeFile(untouched, '<h1>Untouched route</h1>');
    const assetsBefore = await readdir(path.join(outDir, 'assets'));
    globalThis.fetch = () => { throw new Error('Build attempted network access'); };
    assert.equal(typeof globalThis.window, 'undefined');
    assert.equal(typeof globalThis.document, 'undefined');
    const result = await renderHome({ root, outDir });
    assert.deepEqual(result.legal.map(page => page.pathname), ['/privacidad', '/aviso-legal']);
    assert.ok(result.legal.every(page => page.markupBytes > 0 && page.file.endsWith('.html')));
    const html = await readFile(index, 'utf8');
    assert.match(html, /<h1\b/);
    assert.match(html, /id="cta"/);
    assert.match(html, /<form\b/);
    assert.match(html, /Marketing Mix Modeling/);
    assert.equal(html.slice(0, html.indexOf('<div id="root"')), shell.slice(0, shell.indexOf('<div id="root"')));
    assert.equal(html.slice(html.lastIndexOf('</div>') + 6), shell.slice(shell.lastIndexOf('</div>') + 6));
    assert.equal(await readFile(untouched, 'utf8'), '<h1>Untouched route</h1>');
    assert.deepEqual(await readdir(path.join(outDir, 'assets')), assetsBefore);
    const image = html.match(/src="([^"]*miguel-headshot[^"]*)"/);
    assert.ok(image, 'SSR includes the existing imported image');
    assert.ok(assetsBefore.includes(path.basename(image[1])), 'SSR asset matches a real client emitted asset');
    await renderHome({ root, outDir });
    assert.equal(await readFile(index, 'utf8'), html, 'Repeat rendering is idempotent');
    assert.equal(typeof globalThis.window, 'undefined');
    assert.equal(typeof globalThis.document, 'undefined');
  } finally {
    globalThis.fetch = originalFetch;
    if (oldFormId === undefined) delete process.env.VITE_FORMSPREE_FORM_ID;
    else process.env.VITE_FORMSPREE_FORM_ID = oldFormId;
    await rm(work, { recursive: true, force: true });
  }
});
