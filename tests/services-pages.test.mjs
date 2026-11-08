import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const pages = [
  { slug: 'marketing-mix-modeling', key: 'mmm', name: 'Marketing Mix Modeling', id: 'https://velz.io/#mmm' },
  { slug: 'momentum', key: 'momentum', name: 'Momentum', id: 'https://velz.io/#momentum' },
];

for (const page of pages) {
  test(`${page.slug}: documento comercial completo sin depender de React`, () => {
    const path = `servicios/${page.slug}/index.html`;
    assert.ok(existsSync(new URL(path, root)), `${path} debe existir`);
    const html = read(path);
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /<html lang="es">/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes(page.name));
    for (const id of ['decision', 'encaje', 'forma-de-trabajo', 'limites', 'lecturas', 'contacto']) {
      assert.ok(html.includes(`id="${id}"`), `falta sección ${id}`);
    }
    assert.ok(html.includes(`href="/?servicio=${page.key}#cta"`));
    assert.ok(html.includes('href="/#nosotros"'));
    assert.ok(html.includes('href="/privacidad" data-cookie-settings'));
    assert.match(html, /<main id="contenido">/);
    assert.match(html, /href="#contenido"/);
    assert.match(html, /href="\/servicios\/services\.css"/);
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
    assert.equal(scripts.length, 2, 'solo JSON-LD y analytics');
    assert.equal(scripts.filter(([, attrs]) => attrs.includes('type="module"') && attrs.includes('src="/src/analytics.js"')).length, 1);
    assert.doesNotMatch(html, /main\.jsx|createRoot|id="root"|\/sobre-mi|testimonio|caso de éxito|garantizamos|\b10x\b/i);
    assert.match(html, /a concretar/i);
    assert.match(html, /no (?:se )?garantiza/i);
    if (page.key === 'mmm') assert.match(html, /1 M€ de inversión anual en medios/);
    else {
      assert.match(html, /actualización diaria/i);
      assert.match(html, /optimización automática/i);
      assert.doesNotMatch(html, /1 M€/);
    }
    const guides = [...html.matchAll(/href="(\/guias\/[^"#?]+)"/g)];
    assert.ok(guides.length >= 2, 'lecturas relevantes');
    for (const [, href] of guides) assert.ok(existsSync(new URL(`${href.slice(1)}/index.html`, root)), `guía inexistente: ${href}`);
  });
}

for (const page of pages) {
  test(`${page.slug}: SEO social y Service ligados a las identidades reales`, () => {
    const html = read(`servicios/${page.slug}/index.html`);
    const canonical = `https://velz.io/servicios/${page.slug}`;
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    const description = html.match(/name="description" content="([^"]+)"/)[1];
    for (const [kind, key, value] of [
      ['property', 'og:type', 'website'], ['property', 'og:locale', 'es_ES'],
      ['property', 'og:site_name', 'velz'], ['property', 'og:url', canonical],
      ['property', 'og:title', title], ['property', 'og:description', description],
      ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', title],
      ['name', 'twitter:description', description],
      ['property', 'og:image', 'https://velz.io/og/velz-symbol-1200x630.png'],
      ['name', 'twitter:image', 'https://velz.io/og/velz-symbol-1200x630.png'],
    ]) assert.ok(html.includes(`${kind}="${key}" content="${value}"`), `falta ${key}`);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const homeGraph = JSON.parse(read('index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const homeOrg = homeGraph.find((node) => node['@id'] === 'https://velz.io/#organization');
    const homeService = homeOrg.hasOfferCatalog.itemListElement.find((node) => node.itemOffered['@id'] === page.id).itemOffered;
    const service = graph.find((node) => node['@type'] === 'Service');
    assert.equal(service['@id'], page.id);
    assert.equal(service.description, homeService.description);
    assert.equal(service.serviceType, homeService.serviceType);
    assert.deepEqual(service.provider, homeService.provider);
    assert.equal(service.url, canonical);
    assert.deepEqual(graph.find((node) => node['@type'] === 'Person'), homeGraph.find((node) => node['@type'] === 'Person'));
    const org = graph.find((node) => node['@type'] === 'Organization');
    for (const key of ['@id', 'name', 'url', 'logo', 'founder']) assert.deepEqual(org[key], homeOrg[key]);
    assert.deepEqual(graph.find((node) => node['@type'] === 'WebPage').mainEntity, { '@id': page.id });
    assert.doesNotMatch(JSON.stringify(graph), /aggregateRating|review|award|hasCredential|price|Offer/);
  });
}

test('CSS independiente: tokens velz, targets táctiles, foco y móvil sin importar la landing', () => {
  assert.ok(existsSync(new URL('servicios/services.css', root)), 'falta CSS propio');
  const css = read('servicios/services.css');
  for (const token of ['colors', 'typography', 'spacing', 'elevation']) assert.ok(css.includes(`../tokens/${token}.css`));
  assert.match(css, /a\s*\{[^}]*min-height:\s*44px/s);
  assert.match(css, /a:focus-visible/);
  assert.match(css, /\.skip-link:focus/);
  assert.match(css, /@media\s*\(max-width:\s*600px\)/);
  assert.match(css, /flex-wrap:\s*wrap/);
  assert.doesNotMatch(css, /src\/styles|\.\.\/styles\.css|#[\da-f]{3,8}\b|gradient\(/i);
  const declared = [...css.matchAll(/var\((--[\w-]+)/g)].map((match) => match[1]);
  const tokens = ['colors', 'typography', 'spacing', 'elevation'].map((name) => read(`tokens/${name}.css`)).join('\n');
  for (const token of declared) assert.ok(tokens.includes(`${token}:`), `token desconocido: ${token}`);
});
