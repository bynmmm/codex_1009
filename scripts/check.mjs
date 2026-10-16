import worker from '../worker/index.js';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const r=await worker.fetch(new Request('https://test.local/'),{});const html=await r.text();assert.equal(r.status,200);new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
const bad=await worker.fetch(new Request('https://test.local/api/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}),{});assert.equal(bad.status,400);
const cross=await worker.fetch(new Request('https://test.local/api/plan',{method:'POST',headers:{Origin:'https://other.local'},body:'{}'}),{});assert.equal(cross.status,403);
console.log('Page, browser script syntax, missing credentials and origin checks passed');
