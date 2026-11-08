import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {PUBLIC_TOOL_METADATA} from '../src/tool-metadata.js';
const read=p=>readFileSync(p,'utf8');
const slugs=['stockout-leak-score','discount-depth-analyzer'];

test('public tools have initial route-specific metadata and temporary noindex',()=>{
 for(const slug of slugs){
  const html=read(`tools/${slug}/index.html`);
  assert.ok(html.includes(`href="https://velz.io/tools/${slug}"`));
  assert.ok(html.includes(`<title>${PUBLIC_TOOL_METADATA[slug].title}</title>`));
  assert.ok(html.includes(`content="${PUBLIC_TOOL_METADATA[slug].description}"`));
  assert.match(html,/<meta name="robots" content="noindex, follow"/);
  assert.ok(!html.includes('Marketing Mix Modeling y medición de medios | velz'));
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(graph.url,`https://velz.io/tools/${slug}`);
  assert.match(html,/src="\/src\/main.jsx"/);
 }
});
test('private diagnostic entry never inherits homepage canonical or schema',()=>{
 const html=read('diagnostico.html');assert.match(html,/noindex/);
 assert.ok(!html.includes('rel="canonical"'));assert.ok(!html.includes('application/ld+json'));
 assert.ok(!html.includes('Marketing Mix Modeling y medición de medios | velz'));
});
test('global 404 is useful, noindex, script-free and not the app shell',()=>{
 const html=read('404.html');assert.match(html,/<h1>Página no encontrada<\/h1>/);assert.match(html,/noindex/);
 assert.match(html,/href="\/guias"/);assert.ok(!html.includes('id="root"'));assert.ok(!html.includes('/src/main.jsx'));
 const cfg=read('netlify.toml');assert.match(cfg,/from = "\/\*"\s+to = "\/404.html"\s+status = 404/);
});
test('security headers are low risk, with index protection for all tools and APIs',()=>{
 const cfg=read('netlify.toml');
 for(const text of ['X-Content-Type-Options = "nosniff"','X-Frame-Options = "DENY"','Referrer-Policy = "strict-origin-when-cross-origin"','Permissions-Policy = "camera=(), microphone=(), geolocation=()"']) assert.ok(cfg.includes(text),text);
 assert.match(cfg,/for = "\/tools\/\*"[\s\S]*?X-Robots-Tag = "noindex, follow"/);
 assert.ok(!cfg.includes('Content-Security-Policy ='), 'do not ship untested blocking CSP');
});
test('Vite preview returns useful 404 and correct initial tool metadata without breaking routes',async()=>{
 if(!existsSync('dist/404.html'))assert.fail('build required');
 const {preview}=await import('vite');const server=await preview({preview:{host:'127.0.0.1',port:0,open:false}});
 const base=`http://127.0.0.1:${server.httpServer.address().port}`;
 try{
  for(const p of ['/missing-quickwin','/deep/missing','/tools','/tools/unknown','/%not-encoded','/tools/stockout-leak-score/a/b']){
   const r=await fetch(base+p);assert.equal(r.status,404,p);assert.match(await r.text(),/noindex/);
  }
  for(const slug of slugs){const r=await fetch(`${base}/tools/${slug}`);assert.equal(r.status,200);assert.ok((await r.text()).includes(`https://velz.io/tools/${slug}`));}
  for(const p of ['/','/aviso-legal','/privacidad','/assets/does-not-exist.js']){
   const r=await fetch(base+p);assert.equal(r.status,p.startsWith('/assets/')?404:200,p);
  }
  const r=await fetch(`${base}/tools/stockout-leak-score/test-quickwin-nonexistent`);assert.equal(r.status,200);assert.match(await r.text(),/noindex/);
 }finally{await new Promise(resolve=>server.httpServer.close(resolve));}
});
