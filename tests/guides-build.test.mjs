import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');
const slug = 'datos-marketing-mix-modeling';
const slugs = [slug, 'atribucion-mmm-experimentos', 'interpretar-resultados-mmm'];
const routes = ['guias', ...slugs.map(slug => `guias/${slug}`)];

test('build emits four standalone guide documents, with scoped CSS and only the analytics script', () => {
  for (const route of routes) {
    const file = `dist/${route}/index.html`;
    assert.ok(existsSync(file), `missing built page ${file}; run npm run build first`);
    const html = read(file);
    assert.ok(html.includes(`rel="canonical" href="https://velz.io/${route}"`));
    assert.match(html, /<h1>/);
    assert.doesNotMatch(html, /<div id="root"><\/div>/);
    const scripts = (html.match(/<script\b[^>]*>/g) || []).filter(tag => !tag.includes('application/ld+json'));
    assert.equal(scripts.length, 1, 'guides load only the analytics module');
    assert.match(scripts[0], /type="module"[^>]*src="\/assets\/[^"]+\.js"/);
    const css = html.match(/href="(\/assets\/[^\"]+\.css)"/);
    assert.ok(css, 'missing built stylesheet');
    assert.ok(existsSync(`dist${css[1]}`));
    assert.ok(!read('dist/index.html').includes(css[1]), 'guide CSS leaked into landing');
  }
  const article = read(`dist/guias/${slug}/index.html`);
  assert.match(article, /No confundas un cero con un dato perdido/);
  assert.match(article, /href="\/#cta"/);
});

test('sitemap adds the four public guide URLs and preserves existing entries', () => {
  const sitemap = read('dist/sitemap.xml');
  for (const path of ['', 'tools/stockout-leak-score', 'tools/discount-depth-analyzer', 'aviso-legal', 'privacidad', ...routes]) {
    assert.ok(sitemap.includes(`<loc>https://velz.io/${path}</loc>`), `missing sitemap URL ${path}`);
  }
  assert.doesNotMatch(sitemap, /token|guias\/404/);
});

test('snapshot route allowlist never crawls tools, tokens or guides into the SPA', () => {
  const config = JSON.parse(read('package.json')).reactSnap;
  assert.equal(config.crawl, false, 'react-snap must not discover tokenized/tool routes');
  assert.deepEqual(config.include, ['/'], 'only preserve pre-existing homepage snapshot scope');
  assert.equal(existsSync('dist/tools'), false);
  assert.doesNotMatch(read('dist/index.html'), /Está tu empresa preparada para un Marketing Mix Modeling/);
});

test('preview serves all four guide documents and unknown paths never return the article', async () => {
  const { preview } = await import('vite');
  const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
  try {
    const base = `http://127.0.0.1:${server.httpServer.address().port}`;
    for (const route of routes.map(route => `/${route}`)) {
      const response = await fetch(`${base}${route}`);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.ok(html.includes(`rel="canonical" href="https://velz.io${route}"`));
      assert.ok(html.includes('href="/#cta"'));
      assert.equal(new URL('/#cta', `${base}${route}`).pathname, '/');
    }
    for (const route of ['/guias/no-existe', ...slugs.map(slug => `/guias/${slug}/no-existe`)]) {
      const response = await fetch(`${base}${route}`);
      assert.equal(response.status, 404, `unknown guide must be 404: ${route}`);
      const html = await response.text();
      assert.match(html, /noindex/);
      assert.doesNotMatch(html, /No confundas un cero|Ejemplo sintético|<title>Datos para un Marketing Mix/);
    }
  } finally {
    await new Promise(resolve => server.httpServer.close(resolve));
  }
});

test('unknown guide paths have a scoped 404 instead of serving the article', () => {
  const config = read('netlify.toml');
  const guard = config.indexOf('from = "/guias/*"');
  for (const route of routes.map(route => `/${route}`)) {
    const exact = config.indexOf(`from = "${route}"`);
    assert.ok(exact >= 0 && exact < guard, `missing explicit document route ${route}`);
    assert.ok(config.slice(exact, guard).includes(`to = "${route}/index.html"`));
  }
  assert.ok(guard >= 0, 'missing scoped unknown-guide fallback');
  assert.ok(guard < config.indexOf('from = "/*"'), '404 must precede SPA catch-all');
  assert.match(config.slice(guard, config.indexOf('from = "/*"')), /to = "\/guias\/404.html"\s+status = 404/);
  const html = read('dist/guias/404.html');
  assert.match(html, /noindex/);
  assert.match(html, /href="\/guias"/);
  assert.doesNotMatch(html, /Está tu empresa preparada|collect-data/);
  assert.deepEqual(readdirSync('dist/guias').sort(), ['404.html', ...slugs, 'index.html'].sort());
});
