import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { build, preview } from 'vite';
import { renderHome } from '../scripts/render-home.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const routes = ['/privacidad', '/aviso-legal'];

test('real renderer emits legal bodies and route metadata; preview and Netlify serve their own documents', async () => {
  const work = await mkdtemp(path.join(root, 'node_modules/.cache/legal-test-'));
  const oldId = process.env.VITE_FORMSPREE_FORM_ID;
  let server;
  try {
    process.env.VITE_FORMSPREE_FORM_ID = 'local-test-only';
    const outDir = path.join(work, 'client');
    await build({ root, logLevel: 'error', build: { outDir, emptyOutDir: true,
      rollupOptions: { input: { main: path.join(root, 'index.html'), notFound: path.join(root, '404.html') } } } });
    const shell = await readFile(path.join(outDir, 'index.html'), 'utf8');
    await renderHome({ root, outDir });
    const entry = path.join(root, 'src/entry-server.jsx');
    const ssrDir = path.join(work, 'server');
    await build({ root, logLevel: 'error', publicDir: false, build: { ssr: entry, outDir: ssrDir,
      rollupOptions: { input: entry, output: { format: 'es', entryFileNames: 'entry.mjs' } } } });
    const { render, getPageConfig } = await import(pathToFileURL(path.join(ssrDir, 'entry.mjs')).href);
    for (const invalid of ['/tools/stockout-leak-score', '/tools/stockout-leak-score/private-token', '/unknown', '/privacidad/', '/aviso-legal.html']) {
      assert.throws(() => render(invalid), /unsupported|allowlist/i);
    }
    assert.match(render('/'), /<h1\b/);
    server = await preview({ root, logLevel: 'error', build: { outDir }, preview: { host: '127.0.0.1', port: 0 } });
    const base = `http://127.0.0.1:${server.httpServer.address().port}`;
    const netlify = await readFile(path.join(root, 'netlify.toml'), 'utf8');
    for (const route of routes) {
      const page = getPageConfig(route);
      const html = await readFile(path.join(outDir, `${route.slice(1)}.html`), 'utf8');
      assert.ok(html.includes(render(route)), 'document contains the same App tree rendered for its own path');
      assert.match(html, route === '/privacidad' ? /Política de privacidad/ : /Aviso legal/);
      assert.doesNotMatch(html, /id="cta"|"@type": "OfferCatalog"|https:\/\/velz.io\/#webpage/);
      assert.ok(html.includes(`<title>${page.title}</title>`));
      assert.ok(html.includes(`href="${page.canonical}"`));
      for (const key of ['description', 'og:title', 'og:description', 'og:url', 'twitter:title', 'twitter:description']) {
        const value = key.includes('title') ? page.title : key === 'og:url' ? page.canonical : page.description;
        assert.ok(html.includes(`${key}" content="${value}"`), `${route}: ${key}`);
      }
      assert.deepEqual([...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="(\/assets\/[^\"]+)"/g)].map(m => m[1]),
        [...shell.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="(\/assets\/[^\"]+)"/g)].map(m => m[1]));
      const response = await fetch(`${base}${route}`);
      assert.equal(response.status, 200);
      assert.equal(await response.text(), html);
      assert.match(netlify, new RegExp(`from = "${route}"\\s+to = "${route}\\.html"\\s+status = 200`));
    }
    assert.equal((await fetch(`${base}/privacidad-extra`)).status, 404);
    const firstLegal = await readFile(path.join(outDir, 'privacidad.html'), 'utf8');
    await renderHome({ root, outDir });
    assert.equal(await readFile(path.join(outDir, 'privacidad.html'), 'utf8'), firstLegal);
  } finally {
    if (server) await new Promise(resolve => server.httpServer.close(resolve));
    if (oldId === undefined) delete process.env.VITE_FORMSPREE_FORM_ID;
    else process.env.VITE_FORMSPREE_FORM_ID = oldId;
    await rm(work, { recursive: true, force: true });
  }
});
