import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const articlePath = 'guias/datos-marketing-mix-modeling/index.html';
const title = '¿Está tu empresa preparada para un Marketing Mix Modeling?';

test('article is real, indexable Spanish HTML with its own metadata and approved content', () => {
  assert.ok(existsSync(articlePath), 'missing static article HTML');
  const html = read(articlePath);
  assert.match(html, /<html lang="es">/);
  assert.match(html, /<title>Datos para un Marketing Mix Modeling: ¿estás preparado\? \| velz<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/velz.io\/guias\/datos-marketing-mix-modeling"/);
  assert.ok(html.includes(`<h1>${title}</h1>`));
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.match(html, /<table>/);
  assert.match(html, /Ejemplo sintético: no representa a un cliente, una auditoría ni un resultado de velz/);
  assert.match(html, /No confundas un cero con un dato perdido/);
  assert.match(html, /1 M€ gastado al año/);
  assert.match(html, /href="\/#cta"[^>]*>Agenda una llamada con velz/);
  assert.doesNotMatch(html, /#contacto|datePublished|dateModified|name="author"|noindex|<script/);
  assert.doesNotMatch(html, /Ficha editorial|Control previo a publicación|Justificación SEO\/AEO/);
  for (const url of [
    'https://developers.google.com/meridian/docs/pre-modeling/collect-data',
    'https://developers.google.com/meridian/docs/pre-modeling/amount-data-needed',
    'https://developers.google.com/meridian/docs/causal-inference/causal-graph',
    'https://facebookexperimental.github.io/Robyn/docs/analysts-guide-to-MMM/',
    'https://velz.io/',
  ]) assert.ok(html.includes(`href="${url}"`), `missing reference: ${url}`);
  for (const number of [1, 2, 3, 4]) {
    assert.ok(html.includes(`href="#fuente-${number}"`));
    assert.ok(html.includes(`id="fuente-${number}"`));
  }
});

test('guide index links to the article and homepage CTA, not a catch-all article', () => {
  assert.ok(existsSync('guias/index.html'), 'missing guide index HTML');
  const html = read('guias/index.html');
  assert.match(html, /rel="canonical" href="https:\/\/velz.io\/guias"/);
  assert.match(html, /<title>Guías de marketing y datos \| velz<\/title>/);
  assert.match(html, /href="\/guias\/datos-marketing-mix-modeling"/);
  assert.match(html, /href="\/#cta"/);
  assert.doesNotMatch(html, /<script|<article[^>]*>[\s\S]*<table>/);
});

test('homepage source does not load guide-specific code or styles', () => {
  // Historical byte/pixel parity is PR evidence, not a permanent freeze on
  // future landing edits or a dependency on objects absent in shallow CI clones.
  for (const path of ['index.html', 'src/App.jsx', 'src/main.jsx', 'src/styles.css', 'styles.css']) {
    assert.doesNotMatch(read(path), /guides\.css|from\s+["'][^"']*guias\//, `guide resources leaked into homepage: ${path}`);
  }
});
