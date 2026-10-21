import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import worker from '../worker/index.js';
const source=await readFile(new URL('./check-providers.mjs',import.meta.url),'utf8');
const ctx={};vm.createContext(ctx);vm.runInContext(source.match(/const valid=([^\n]+);/)[0]+';result=valid;',ctx);const base=JSON.parse(JSON.stringify(ctx.result));
const original=globalThis.fetch;
const request=()=>new Request('https://demo.test/api/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({provider:'deepseek',key:'test-placeholder',text:'测试',model:'deepseek-flash'})});
async function run(content,finish_reason='stop'){globalThis.fetch=async()=>Response.json({choices:[{finish_reason,message:{content}}]});const r=await worker.fetch(request(),{});return {status:r.status,data:await r.json()}}
try{let p=structuredClone(base);p.C='0.9';p.matchedRuleIds=[4];p.vui.delay=0;p.delay=0;p.D=.2;delete p.evidence;delete p.adaptation;let r=await run(JSON.stringify(p));assert.equal(r.status,200);assert.equal(r.data.C,.9);assert.equal(r.data.vui.delay,12);assert.equal(r.data.delay,12);assert.equal(r.data.evidence['车外环境'],'未知（模型未提供）');assert.deepEqual(r.data.matchedRuleIds,['4']);
r=await run('```json\n'+JSON.stringify(base)+'\n```');assert.equal(r.status,200);
r=await run('{}','length');assert.equal(r.data.code,'MODEL_TRUNCATED');r=await run('');assert.equal(r.data.code,'MODEL_EMPTY');r=await run('{oops');assert.equal(r.data.code,'MODEL_JSON');
p=structuredClone(base);delete p.C;r=await run(JSON.stringify(p));assert.equal(r.status,502);assert.equal(r.data.code,'MODEL_FIELD');assert.match(r.data.error,/C评分/);
p=structuredClone(base);p.vui={when:'after-trigger',reason:'忙',trigger:'通话结束',delay:0};r=await run(JSON.stringify(p));assert.equal(r.status,502);assert.match(r.data.error,/vui.delay/);
globalThis.fetch=async()=>{throw new TypeError('fetch failed')};r=await worker.fetch(request(),{});assert.match((await r.json()).error,/连接模型供应商失败/);
console.log('Output normalization, critical field rejection, fenced JSON, truncation, empty output and network diagnostics passed');
}finally{globalThis.fetch=original}
