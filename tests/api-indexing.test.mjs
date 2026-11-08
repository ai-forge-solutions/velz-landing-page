import test from 'node:test';
import assert from 'node:assert/strict';
import {handler} from '../netlify/functions/lead-magnets.js';
test('actual API response emits noindex and nosniff without relying on static host headers',async()=>{
 const r=await handler({httpMethod:'GET',path:'/api/lead-magnets/',queryStringParameters:{}});
 assert.equal(r.statusCode,400);assert.equal(r.headers['x-robots-tag'],'noindex');assert.equal(r.headers['x-content-type-options'],'nosniff');
 assert.equal(r.headers['cache-control'],'no-store');
});
