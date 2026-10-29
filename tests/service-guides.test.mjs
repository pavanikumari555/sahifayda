import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advisorReply} from '../lib/sia-advisor.mjs';
import {guides,guideSlugs} from '../lib/guides.mjs';
import {readingGuideFor} from '../lib/sia-reading-guide.mjs';
const reply=(q,p=null)=>advisorReply(q,p,'hi',new Date('2026-10-28'));
test('a fee limit with no matching cards does not announce nonexistent options',()=>{
 for(const language of ['en','hi','roman']){
  const r=advisorReply('credit card for online shopping annual fee max 100',null,language,new Date('2026-10-29'));
  assert.equal(r.options.length,0);assert.match(r.answer,/None of|कोई विकल्प नहीं|koi option nahi/);assert.match(r.links[0].url,/credit-card/);
 }
});
test('explanation reading links follow the current topic after another service',()=>{
 const p=reply('health insurance chahiye').profile;
 for(const q of ['What is APR?','ब्याज क्या होता है?','explain interest'])assert.equal(readingGuideFor(q,p),'loan-options');
 for(const q of ['मुद्रा लोन क्या होता है?','What is MUDRA?'])assert.equal(readingGuideFor(q,p),'business-loan');
 assert.equal(readingGuideFor('EMI kya hai',p),'emi-total-cost');
 assert.equal(readingGuideFor('credit card kya hai',p),'credit-card');
 assert.equal(readingGuideFor('waiting period kya hai',p),'insurance-basics');
});
test('exact 10 lakh then business preserves amount and never repeats purpose',()=>{
 let r=reply('मुझे 10 लाख का लोन चाहिए तो मुझे बताओ कि मैं क्या करूं');assert.equal(r.profile.values.amount,1000000);
 r=reply('बिजनेस लोन चाहिए',r.profile);assert.equal(r.profile.values.amount,1000000);assert.equal(r.profile.values.purpose,'business');assert.equal(r.profile.pending,'businessAge');
 r=reply('नया कारोबार',r.profile);assert.equal(r.profile.values.amount,1000000);assert.match(r.answer,/मुद्रा/);assert.doesNotMatch(r.answer,/किस काम|घर, पढ़ाई|निजी ज़रूरत\?/);assert.match(r.links[0].url,/business-loan/);assert.equal(r.options.length,0);assert.ok(r.answer.length<400);
 for(const q of ['business loan chahiye','व्यापार के लिए लोन','कारोबार के लिए ऋण','बिज़नेस लोन'])assert.equal(reply(q).profile.values.purpose,'business');
});
test('a natural loan conversation asks amount then purpose and remembers both',()=>{
 let r=reply('मुझे लोन लेना है');assert.equal(r.profile.pending,'amount');assert.match(r.answer,/कितनी रकम/);
 r=reply('पांच लाख',r.profile);assert.equal(r.profile.values.amount,500000);assert.equal(r.profile.pending,'purpose');
 r=reply('personal',r.profile);assert.equal(r.profile.values.purpose,'personal');assert.equal(r.profile.values.amount,500000);assert.equal(r.profile.pending,null);
 for(const q of ['home loan chahiye','education loan chahiye','car loan chahiye','personal loan chahiye'])assert.equal(reply(q).profile.pending,'amount');
});
test('general demat gives immediate examples and insurance follows the selected type',()=>{
 const d=reply('demat account chahiye');assert.deepEqual(d.options.map(o=>o.id),['angelone','zerodha']);assert.equal(d.profile.pending,null);assert.match(d.links[0].url,/demat-account/);
 let i=reply('insurance chahiye');i=reply('health',i.profile);i=reply('family',i.profile);assert.match(i.answer,/hospital|अस्पताल/);assert.doesNotMatch(i.answer,/टर्म जीवन|motor/);assert.equal(i.options.length,0);assert.equal(i.profile.pending,null);
});
test('unrelated questions are not hijacked by a previous service',()=>{
 for(const q of ['why is the sky blue','explain minimum due','My UPI payment is pending'])assert.equal(reply(q,reply('credit card').profile),null);
 for(const q of ['मुद्रा लोन क्या होता है?','What is a demat account?','insurance ka matlab kya hota hai'])assert.equal(reply(q),null);
});
test('all nine articles have bilingual practical content; business conditions remain explicit',()=>{
 assert.equal(guideSlugs.length,9);
 for(const slug of guideSlugs){const g=guides[slug];for(const lang of ['en','hi']){assert.ok(g[lang].title);assert.ok(g[lang].sections.length>=3);assert.ok(g[lang].faq.length>=2);}for(const s of g.sources)assert.equal(new URL(s.url).protocol,'https:');}
 assert.match(guides['business-loan'].en.sections[1][1],/successfully repaid/);assert.match(guides['business-loan'].hi.sections[0][1],/मंज़ूरी.*नहीं/);
});
