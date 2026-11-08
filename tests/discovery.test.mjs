import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const section = (text, heading) => text.split(`## ${heading}\n`)[1]?.split('\n## ')[0] ?? '';

test('llms distinguishes the factual offer from static editorial service context', () => {
  const llms = read('public/llms.txt');
  const services = section(llms, 'Servicios');
  assert.doesNotMatch(llms, /https:\/\/velz\.io\/(?:#(?:servicios|cta)|about|contacto|tools)/, 'do not invent routes or use CSR anchors as primary service documentation');
  assert.match(services, /oferta comercial.*páginas de servicio/);
  assert.match(services, /guías.*editorial/);
  assert.match(services, /Marketing Mix Modeling \(MMM\).*1 M€.*inversión anual en medios/);
  assert.match(services, /Momentum.*medio, campaña y anuncio.*diario.*canales/);
  const links = [...services.matchAll(/\[([^\]]+)\]\((https:\/\/velz\.io[^)]+)\)/g)];
  assert.ok(links.length >= 2, 'both services need relevant editorial reading');
  for (const [, label, url] of links) {
    if (url.includes('/guias/')) assert.match(label, /[Gg]uía|[Cc]ontexto|[Ll]ectura/, 'guide links must not impersonate service pages');
    else assert.match(url, /^https:\/\/velz\.io\/servicios\/(marketing-mix-modeling|momentum)$/);
    assert.match(read(`${new URL(url).pathname.slice(1)}/index.html`), /<h1\b/);
  }
  assert.ok(services.includes('(https://velz.io/guias/datos-marketing-mix-modeling)'), 'MMM readiness and service context');
  assert.ok(services.includes('(https://velz.io/guias/atribucion-mmm-experimentos)'), 'daily optimization versus strategic measurement context');
  assert.match(llms, /miguel@velz\.io/);
});

test('llms prioritizes the static guide index and every sitemap guide under Guías', () => {
  const llms = read('public/llms.txt');
  const guides = section(llms, 'Guías');
  assert.ok(llms.indexOf('## Guías') < llms.indexOf('## Servicios'), 'static editorial sources come before the commercial summary');
  for (const [, url] of read('public/sitemap.xml').matchAll(/<loc>(https:\/\/velz\.io\/guias[^<]*)<\/loc>/g)) {
    assert.ok(guides.includes(`(${url})`), `guide missing from Guías: ${url}`);
    const path = new URL(url).pathname;
    const html = read(`${path.slice(1)}/index.html`);
    const canonical = html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*>/)?.[0];
    assert.ok(canonical?.includes(`href="${url}"`), `guide must be a real canonical static document: ${url}`);
    assert.match(html, /<h1>/);
    assert.ok(!section(llms, 'Optional').includes(`(${url})`), `editorial source must not be optional: ${url}`);
  }
});
