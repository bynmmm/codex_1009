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
r=evaluate({P:.9});assert.equal(r.plan.policy,'weak-first');assert.equal(r.frames[0].mode,'weak');assert.equal(r.frames[0].voice,false);
r=evaluate({vui:{when:'after-trigger',reason:'稍后适合听',trigger:'通话结束',delay:18}});assert.equal(r.plan.policy,'now');assert.equal(r.frames[0].mode,'weak');assert.equal(r.frames[0].voice,false);assert.equal(r.frames[1].at,18);assert.equal(r.frames[1].mode,'weak');assert.equal(r.frames[1].voice,true);
r=evaluate({P:.9,D:.6});assert.equal(r.plan.policy,'weak-first');assert.equal(r.frames[0].D,0);
r=evaluate({quiet:true});assert.equal(r.plan.vui.when,'off');assert.equal(r.frames.some(f=>f.voice),false);
r=evaluate({C:.2});assert.equal(r.plan.policy,'none');assert.equal(r.frames.some(f=>f.voice),false);
console.log('Weak D=0, strong D arbitration, weak speech, strong silence, independent VUI timing and quiet suppression passed');
r=evaluate({C:.85,P:.8,T:.55,D:.9,vui:{when:'after-trigger',reason:'导航占用听觉',trigger:'通过路口且导航结束',delay:12}});assert.equal(r.plan.policy,'weak-first');assert.equal(r.plan.D,.9);assert.equal(r.frames[0].D,0);assert.equal(r.frames[0].voice,false);assert.equal(r.frames[1].voice,true);assert.equal(r.frames[1].D,.2);
const states={scoreD:'0.90'};const element={classList:{add(){},remove(){},toggle(){}},style:{},disabled:false};
const view={plan:r.plan,speechActive:false,active:true,$:()=>element,text:(id,t)=>states[id]=t,document:{documentElement:{style:{setProperty(){}}}},rec(){},silence(){},voice(){}};
vm.createContext(view);vm.runInContext(app.slice(app.indexOf('function renderFrame('),app.indexOf('function nodes(')),view);view.renderFrame(r.frames[1],false);assert.equal(states.scoreD,'0.90');assert.ok(states.nodeDisturbance.includes('0.20'));assert.ok(states.nodeDisturbance.includes('0.90'));
console.log('Rain/junction calibrated policy and immutable initial D during timeline playback passed');

r=evaluate({C:.85,P:.50,T:.45,D:.2,vui:{when:'now',reason:'需要听',trigger:'',delay:12}});assert.equal(r.plan.target,'weak');assert.equal(r.frames[0].mode,'weak');assert.equal(r.frames[0].voice,true);
r=evaluate({C:.85,P:.85,T:.55,D:.90,vui:{when:'now',reason:'安全建议',trigger:'',delay:12}});assert.equal(r.frames[0].mode,'weak');assert.equal(r.frames[0].voice,false);assert.equal(r.frames[1].mode,'strong');assert.equal(r.frames[1].voice,true);assert.equal(r.plan.D,.9);console.log('Comfort weak+VUI and safety silent-weak-first policy passed');
r=evaluate({C:.9,P:.45,T:.4,D:.25,presentation:{surface:'fullscreen-video',choice:'compact',strongLayout:'compact',reason:'弱提示不可见'},vui:{when:'off',reason:'不打断影片声音',trigger:'',delay:12}});assert.equal(r.plan.P,.45);assert.equal(r.plan.importanceTarget,'weak');assert.equal(r.plan.target,'strong');assert.equal(r.frames[0].mode,'strong');assert.equal(r.frames[0].voice,false);
r=evaluate({C:.9,P:.45,T:.4,D:.25,presentation:{surface:'fullscreen-video',choice:'voice-only',strongLayout:'compact',reason:'仅语音提醒'},vui:{when:'now',reason:'用户需要听',trigger:'',delay:12}});assert.equal(r.frames[0].mode,'none');assert.equal(r.frames[0].voice,true);assert.equal(r.plan.policy,'now');
r=evaluate({C:.9,P:.45,T:.4,D:.25,presentation:{surface:'map',choice:'standard',strongLayout:'compact',reason:'无需配图'}});assert.equal(r.frames[0].mode,'weak');
r=evaluate({C:.3,P:.45,T:.4,D:.25,presentation:{surface:'fullscreen-video',choice:'compact',strongLayout:'compact',reason:'证据不足'}});assert.equal(r.frames[0].mode,'none');assert.equal(r.frames[0].voice,false);
console.log('Fullscreen visibility escalation, compact layout, voice-only and low confidence gating passed');
