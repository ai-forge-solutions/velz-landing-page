import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
// Fechas y autoría del contenido aprobado, no la fecha de ejecución del test.
const guides = {
  'atribucion-mmm-experimentos': ['2026-11-01', 'Miguel Carmona', 'Person'],
  'datos-marketing-mix-modeling': ['2026-11-01', 'Miguel Carmona', 'Person'],
  'interpretar-resultados-mmm': ['2026-11-01', 'Miguel Carmona', 'Person'],
  'meridian-vs-robyn-vs-pymc-marketing': ['2026-11-08', 'velz', 'Organization'],
  'proveedor-marketing-mix-modeling-precio': ['2026-11-08', 'velz', 'Organization'],
  'rentabilidad-promociones-descuentos-ecommerce': ['2026-11-08', 'velz', 'Organization'],
  'test-incrementalidad-geo-lift-holdout': ['2026-11-08', 'velz', 'Organization'],
};
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k, v]));
const text = html => html.replace(/<[^>]*>/g, '').trim();
function objects(value) {
  if (!value || typeof value !== 'object') return [];
  return [value, ...Object.values(value).flatMap(objects)];
}
function load(slug) {
  const html = readFileSync(new URL(`guias/${slug}/index.html`, root), 'utf8');
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(([, attributes]) => attrs(attributes).type === 'application/ld+json');
  assert.ok(scripts.length, 'Debe existir JSON-LD');
  const nodes = scripts.flatMap(([, , json]) => objects(JSON.parse(json)));
  const articles = nodes.filter(node => ['Article', 'BlogPosting'].includes(node['@type']));
  assert.equal(articles.length, 1, 'Un solo artículo por documento');
  const meta = property => [...html.matchAll(/<meta\b[^>]*>/g)]
    .map(([tag]) => attrs(tag)).find(tag => tag.property === property)?.content;
  const canonical = [...html.matchAll(/<link\b[^>]*>/g)]
    .map(([tag]) => attrs(tag)).find(tag => tag.rel === 'canonical')?.href;
  const resolve = ref => nodes.find(node => node['@id'] === ref?.['@id'] && node['@type']);
  return { html, nodes, article: articles[0], meta, canonical, resolve };
}

test('El contrato cubre exactamente las siete guías publicadas', () => {
  const directories = readdirSync(new URL('guias/', root), { withFileTypes: true })
    .filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
  assert.deepEqual(directories, Object.keys(guides).sort());
});

for (const [slug, [date, authorName, authorType]] of Object.entries(guides)) {
  test(`${slug}: BlogPosting coherente con contenido y entidades resolubles`, () => {
    const { html, nodes, article, meta, canonical, resolve } = load(slug);
    assert.equal(article['@type'], 'BlogPosting');
    assert.equal(article['@id'], `${canonical}#article`);
    assert.equal(article.headline, text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1]));
    assert.equal(article.inLanguage, attrs(html.match(/<html\b[^>]*>/)[0]).lang);
    assert.equal(article.datePublished, date);
    assert.equal(article.dateModified, date);
    assert.equal(article.datePublished, meta('article:published_time'));
    assert.equal(article.dateModified, meta('article:modified_time'));
    const byline = html.match(/<p class="guide-byline">([\s\S]*?)<\/p>/)[1];
    assert.ok(text(byline).startsWith(`${authorName}${authorType === 'Person' ? ', fundador de velz' : ' ·'}`));
    assert.equal(attrs(byline.match(/<time\b[^>]*>/)[0]).datetime, date);
    assert.equal(meta('article:author'), authorName);
    const author = resolve(article.author);
    assert.ok(author, 'El @id del autor resuelve en este documento');
    assert.equal(author['@type'], authorType);
    assert.equal(author.name, authorName);
    assert.equal(author['@id'], `https://velz.io/#${authorType === 'Person' ? 'miguel-carmona' : 'organization'}`);
    const publisher = resolve(article.publisher);
    assert.equal(publisher?.['@type'], 'Organization');
    assert.equal(publisher.name, 'velz');
    assert.equal(publisher['@id'], 'https://velz.io/#organization');
    assert.equal(publisher.url, 'https://velz.io/');
    assert.equal(resolve(article.mainEntityOfPage)?.['@type'], 'WebPage');
    assert.equal(article.mainEntityOfPage['@id'], canonical);
    assert.equal(resolve(article.isPartOf)?.['@type'], 'WebSite');
    for (const node of nodes) {
      if (node['@id']) assert.ok(resolve(node), `Referencia sin definición local: ${node['@id']}`);
      for (const key of ['reviewedBy', 'editor', 'hasCredential', 'award']) {
        assert.ok(!(key in node), `No inventar revisión ni credenciales: ${key}`);
      }
    }
    if (authorType === 'Organization') {
      assert.ok(!nodes.some(node => node['@type'] === 'Person'), 'No atribuir a personas las nuevas guías');
    }
  });
}
