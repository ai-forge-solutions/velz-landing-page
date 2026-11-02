import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const guidePages = ['guias/index.html', ...['datos-marketing-mix-modeling', 'atribucion-mmm-experimentos', 'interpretar-resultados-mmm'].map(slug => `guias/${slug}/index.html`)];

test('landing head targets MMM search intent and ships valid JSON-LD', () => {
  const html = read('index.html');
  assert.match(html, /<title>Marketing Mix Modeling y medición de medios \| velz<\/title>/);
  assert.match(read('src/App.jsx'), /DEFAULT_META_TITLE = "Marketing Mix Modeling y medición de medios \| velz"/);
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const org = graph.find(node => [].concat(node['@type']).includes('Organization'));
  assert.equal(org['@id'], 'https://velz.io/#organization');
  assert.deepEqual(org.hasOfferCatalog.itemListElement.map(offer => offer.itemOffered.name), ['Marketing Mix Modeling (MMM)', 'Momentum']);
  assert.ok(graph.some(node => node['@type'] === 'Person' && node.name === 'Miguel Carmona'));
});

test('every public document links real favicons and guides have social cards', () => {
  for (const file of ['favicon.ico', 'favicon.svg', 'favicon-48x48.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'site.webmanifest']) {
    assert.ok(existsSync(`public/${file}`), `missing public/${file}`);
  }
  for (const page of ['index.html', 'guias/404.html', ...guidePages]) {
    const html = read(page);
    assert.match(html, /<link rel="icon" href="\/favicon\.ico"/, page);
    assert.match(html, /<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml"/, page);
  }
  for (const page of guidePages) {
    const html = read(page);
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
    assert.ok(html.includes(`<meta property="og:url" content="${canonical}" />`), page);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/);
  }
});

test('guides cross-link each other outside the frozen article body', () => {
  for (const page of guidePages.slice(1)) {
    const html = read(page);
    const related = html.match(/<nav class="guide-related"[\s\S]*?<\/nav>/);
    assert.ok(related, `missing related guides in ${page}`);
    assert.ok(html.indexOf(related[0]) > html.indexOf('</article>'));
    assert.equal((related[0].match(/href="\/guias\//g) || []).length, 2);
  }
  assert.equal((read('src/App.jsx').match(/href=\{GUIDES_LINK\}/g) || []).length, 2, 'landing and legal footers link to /guias');
});

test('unknown paths are real 404s and hashed assets are cached immutably', () => {
  const config = read('netlify.toml');
  const catchAll = config.indexOf('from = "/*"');
  assert.match(config.slice(catchAll, catchAll + 80), /to = "\/index.html"\s+status = 404/);
  for (const route of ['/aviso-legal', '/privacidad', '/tools/*']) {
    const at = config.indexOf(`from = "${route}"`);
    assert.ok(at >= 0 && at < catchAll, `SPA route ${route} must precede the 404 catch-all`);
  }
  assert.match(config, /for = "\/assets\/\*"\s+\[headers\.values\]\s+Cache-Control = "public, max-age=31536000, immutable"/);
});

test('llms.txt and IndexNow key are published and consistent', () => {
  const llms = read('public/llms.txt');
  assert.match(llms, /^# velz\n\n> /);
  for (const loc of read('public/sitemap.xml').matchAll(/<loc>(https:\/\/velz\.io\/guias\/[^<]+)<\/loc>/g)) {
    assert.ok(llms.includes(`(${loc[1]})`), `llms.txt misses ${loc[1]}`);
  }
  const key = read('netlify/plugins/indexnow/index.js').match(/const KEY = "([0-9a-f]{32})"/)[1];
  assert.equal(read(`public/${key}.txt`), key);
  assert.match(read('netlify.toml'), /package = "\/netlify\/plugins\/indexnow"/);
});

test('crawler logger never stores private tokens and ignores humans', async () => {
  const source = read('netlify/edge-functions/ai-crawlers.js');
  assert.match(source, /\[token\]/);
  assert.match(source, /onError: "bypass"/);
  const inserts = [];
  globalThis.Netlify = { env: { get: name => ({ SUPABASE_URL: 'https://db.example', SUPABASE_SERVICE_ROLE_KEY: 'k' })[name] } };
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => { inserts.push({ url, body: JSON.parse(init.body) }); return new Response(null, { status: 201 }); };
  try {
    const { default: handler } = await import('../netlify/edge-functions/ai-crawlers.js');
    const context = { next: async () => new Response('ok', { status: 200 }), geo: { country: { code: 'US' } } };
    const human = await handler(new Request('https://velz.io/guias', { headers: { 'user-agent': 'Mozilla/5.0 Safari' } }), context);
    assert.equal(human, undefined, 'humans pass through without context.next()');
    await handler(new Request('https://velz.io/tools/stockout-leak-score/secret-abc', { headers: { 'user-agent': 'Mozilla/5.0 AppleWebKit/537.36; compatible; ChatGPT-User/1.0; +https://openai.com/bot' } }), context);
    assert.equal(inserts.length, 1);
    assert.equal(inserts[0].url, 'https://db.example/rest/v1/crawler_hits');
    assert.deepEqual({ ...inserts[0].body, user_agent: undefined }, { bot: 'ChatGPT-User', bot_operator: 'OpenAI', bot_purpose: 'user_request', path: '/tools/stockout-leak-score/[token]', status: 200, country: 'US', user_agent: undefined });
  } finally {
    globalThis.fetch = realFetch;
    delete globalThis.Netlify;
  }
});
