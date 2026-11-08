import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import{readFileSync}from'node:fs';
test('static document entrance motion is disabled on server and marked HTML, not normal CSR tools',()=>{
 const source=readFileSync('src/App.jsx','utf8');const match=source.match(/function isStaticDocument\(\) \{[\s\S]*?\n\}/);assert.ok(match,'server-visible content requires an explicit static document guard');
 const check=ctx=>vm.runInNewContext(match[0]+';isStaticDocument()',ctx);assert.equal(check({}),true);
 assert.equal(check({window:{},document:{getElementById:()=>({hasAttribute:()=>true})}}),true);
 assert.equal(check({window:{},document:{getElementById:()=>({hasAttribute:()=>false})}}),false);
 assert.match(readFileSync('index.html','utf8'),/<div id="root" data-prerendered="true"><\/div>/);
 assert.equal((source.match(/initial=\{skipEntranceMotion \?/g)||[]).length,2);
});
