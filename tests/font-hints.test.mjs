import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
test('static first paint preloads the same Latin body/display webfonts with CORS',()=>{
 const s=readFileSync('index.html','utf8');for(const font of ['hankengrotesk','newsreader']){
 const link=(s.match(/<link\b[^>]*>/g)||[]).find(x=>x.includes('rel="preload"')&&x.includes(`/s/${font}/`));assert.ok(link,font);assert.ok(link.includes('as="font"')&&link.includes('type="font/woff2"')&&link.includes('crossorigin'));
 }
});
