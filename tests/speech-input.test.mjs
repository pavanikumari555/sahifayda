import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSpeechInput,mergeSpeechSegments} from '../lib/speech-input.mjs';
function fixture(){
 let time=0,next=0;const jobs=new Map(),runs=[],texts=[],states=[],previews=[],errors=[];
 const schedule=(fn,ms)=>{jobs.set(++next,{at:time+ms,fn});return next;};
 const cancel=id=>jobs.delete(id);
 const tick=ms=>{const target=time+ms;while(true){const due=[...jobs].filter(([,v])=>v.at<=target).sort((a,b)=>a[1].at-b[1].at)[0];if(!due)break;time=due[1].at;jobs.delete(due[0]);due[1].fn();}time=target;};
 const session=createSpeechInput({schedule,cancel,createRecognition:()=>{const rec={start(){},stop(){this.onend?.();},abort(){}};runs.push(rec);return rec;},onText:text=>texts.push(text),onState:s=>states.push(s),onPreview:t=>previews.push(t),onError:e=>errors.push(e)});
 const result=(phrases)=>runs.at(-1).onresult({results:phrases.map(transcript=>[{transcript}])});
 return {session,runs,texts,states,previews,errors,tick,result,jobs};
}
test('short speech pauses and engine restarts retain words; stop delivers once, never during dictation',()=>{
 const f=fixture();f.session.start();assert.equal(f.runs[0].continuous,true);assert.equal(f.runs[0].interimResults,true);
 f.result(['मुझे जीरो बैलेंस']);f.runs[0].onspeechend();f.tick(1000);assert.equal(f.session.active,true);assert.deepEqual(f.texts,[]);
 f.runs[0].onend();f.tick(250);assert.equal(f.runs.length,2);
 f.result(['सेविंग अकाउंट चाहिए']);f.session.stop();
 assert.deepEqual(f.texts,['मुझे जीरो बैलेंस सेविंग अकाउंट चाहिए']);assert.equal(f.session.active,false);assert.equal(f.jobs.size,0);
});
test('cumulative interim revisions do not repeat earlier words and manual stop keeps the last partial words',()=>{
 const f=fixture();f.session.start();f.result(['mujhe']);f.result(['mujhe zero balance']);f.result(['mujhe zero balance','account chahiye']);f.session.stop();
 assert.deepEqual(f.texts,['mujhe zero balance account chahiye']);f.tick(100000);assert.equal(f.texts.length,1);
});
test('Android repeated cumulative result slots and restart replays are delivered only once',()=>{
 const f=fixture();f.session.start();
 f.result(['मुझे','मुझे लोन','मुझे लोन लेना है','मुझे लोन लेना है']);
 assert.equal(f.previews.at(-1),'मुझे लोन लेना है');assert.deepEqual(f.texts,[]);
 f.runs.at(-1).onend();f.tick(250);
 f.result(['मुझे लोन लेना है','लेना है बिजनेस के लिए']);f.session.stop();
 assert.deepEqual(f.texts,['मुझे लोन लेना है बिजनेस के लिए']);
 assert.equal(mergeSpeechSegments(['नहीं नहीं, मुझे लोन नहीं चाहिए']),'नहीं नहीं, मुझे लोन नहीं चाहिए');
 assert.equal(mergeSpeechSegments(['I need a loan.','a loan for business']),'I need a loan. for business');
});
test('eight seconds of silence stop recording, while the sixty-second cap bounds continuous speech',()=>{
 const f=fixture();f.session.start();f.result(['hello']);f.tick(7999);assert.equal(f.session.active,true);f.tick(1);assert.equal(f.session.active,false);
 f.session.start();f.result(['next']);f.runs.at(-1).onspeechstart();f.tick(60000);assert.equal(f.session.active,false);assert.deepEqual(f.texts,['hello','next']);
});
test('denied permissions never loop and unmount drops pending callbacks without a transcript or state update',()=>{
 const f=fixture();f.session.start();f.runs[0].onerror({error:'not-allowed'});f.tick(10000);assert.equal(f.runs.length,1);assert.equal(f.errors.at(-1),'not-allowed');
 f.session.start();f.result(['temporary speech']);const count=f.states.length;f.session.dispose();f.tick(100000);assert.deepEqual(f.texts,[]);assert.equal(f.states.length,count);assert.equal(f.jobs.size,0);
});
