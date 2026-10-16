import vm from 'node:vm';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
const html=await(await worker.fetch(new Request('https://demo.test/'),{})).text();
const app=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const code=app.slice(app.indexOf('function arbitrate(p)'),app.indexOf('function resetTransport()'));
const sandbox={plan:null};vm.createContext(sandbox);vm.runInContext(code,sandbox);
function evaluate(overrides){sandbox.plan={C:.9,P:.3,T:.3,D:.95,quiet:false,vui:{when:'now',reason:'需要听',trigger:'听觉可用',delay:18},delay:12,trigger:'通过路口',transition:'none',...overrides};vm.runInContext('plan=arbitrate(plan); var resultFrames=buildFrames()',sandbox);return {plan:sandbox.plan,frames:sandbox.resultFrames}}
let r=evaluate({});assert.equal(r.plan.target,'weak');assert.equal(r.plan.policy,'now');assert.equal(r.frames.length,1);assert.equal(r.frames[0].D,0);assert.equal(r.frames[0].voice,true);
r=evaluate({P:.9,vui:{when:'off',reason:'不需要听',trigger:'',delay:12},D:.2});assert.equal(r.plan.target,'strong');assert.equal(r.frames[0].voice,false);
r=evaluate({P:.9});assert.equal(r.plan.policy,'later');assert.equal(r.frames[0].mode,'none');assert.equal(r.frames[0].voice,true);
r=evaluate({vui:{when:'after-trigger',reason:'稍后适合听',trigger:'通话结束',delay:18}});assert.equal(r.plan.policy,'now');assert.equal(r.frames[0].mode,'weak');assert.equal(r.frames[0].voice,false);assert.equal(r.frames[1].at,18);assert.equal(r.frames[1].mode,'weak');assert.equal(r.frames[1].voice,true);
r=evaluate({P:.9,D:.6});assert.equal(r.plan.policy,'weak-first');assert.equal(r.frames[0].D,0);
r=evaluate({quiet:true});assert.equal(r.plan.vui.when,'off');assert.equal(r.frames.some(f=>f.voice),false);
r=evaluate({C:.2});assert.equal(r.plan.policy,'none');assert.equal(r.frames.some(f=>f.voice),false);
console.log('Weak D=0, strong D arbitration, weak speech, strong silence, independent VUI timing and quiet suppression passed');
