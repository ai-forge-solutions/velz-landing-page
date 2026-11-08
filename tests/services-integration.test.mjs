import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');const slugs=['marketing-mix-modeling','momentum'];
test('service routes are explicit MPA/Netlify documents and indexed in discovery',()=>{
 for(const slug of slugs){const url=`https://velz.io/servicios/${slug}`;
  assert.ok(read('vite.config.js').includes(`servicios/${slug}/index.html`));
  assert.ok(read('netlify.toml').includes(`from = "/servicios/${slug}"`));
  assert.ok(read('public/sitemap.xml').includes(`<loc>${url}</loc>`));
  assert.ok(read('public/llms.txt').includes(`(${url})`));
 }
});
test('every guide has service paths outside the immutable article and index links services',()=>{
 for(const slug of ['datos-marketing-mix-modeling','atribucion-mmm-experimentos','interpretar-resultados-mmm','test-incrementalidad-geo-lift-holdout','meridian-vs-robyn-vs-pymc-marketing','proveedor-marketing-mix-modeling-precio','rentabilidad-promociones-descuentos-ecommerce']){
  const s=read(`guias/${slug}/index.html`);const end=s.indexOf('</article>');for(const service of slugs)assert.ok(s.indexOf(`href="/servicios/${service}"`,end)>end);
 }
 for(const slug of slugs)assert.ok(read('guias/index.html').includes(`href="/servicios/${slug}"`));
});
test('homepage factual graph connects services to existing founder/about section',()=>{
 const graph=JSON.parse(read('index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 const org=graph.find(x=>[].concat(x['@type']).includes('Organization'));
 assert.deepEqual(org.hasOfferCatalog.itemListElement.map(x=>x.itemOffered.url).sort(),slugs.map(x=>`https://velz.io/servicios/${x}`).sort());
 assert.equal(graph.find(x=>x['@type']==='Person').url,'https://velz.io/#nosotros');
});
