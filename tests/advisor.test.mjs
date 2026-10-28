import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advisorReply,advisorContext,intentOf,catalog} from '../lib/sia-advisor.mjs';
const date=new Date('2026-10-28T12:00:00Z');
const reply=(q,p=null,language='hi')=>advisorReply(q,p,language,date);
function chat(lines,language='hi'){let r;for(const q of lines){r=reply(q,r?.profile,language);assert.ok(r,`No guided reply for: ${q}`);}return r;}
test('the user’s exact 30000-income journey remembers income and reaches sourced options without network calls',()=>{
 let r=reply('mujhe credit card lena hai meri income 30000 rs per month hai to mere liye credit card btao');
 assert.equal(r.profile.values.income,30000);assert.equal(r.profile.pending,'use');assert.match(r.answer,/30,000/);
 r=reply('Amazon shopping ke liye',r.profile);assert.equal(r.profile.pending,'fee');assert.equal(r.profile.values.income,30000);
 r=reply('annual fee nahi deni',r.profile);assert.equal(r.profile.pending,'repay');
 r=reply('haan poora bill time par bhar dunga',r.profile);assert.deepEqual(r.options.map(o=>o.id),['amazon']);assert.match(r.options[0].caution,/Invite-only/);assert.match(r.options[0].reason,/Amazon/);assert.match(r.options[0].url,/^https:\/\/www.icici.bank.in\//);assert.equal(r.profile.values.income,30000);
 assert.equal(advisorContext(r.profile).includes('30000'),true);
});
test('already supplied preferences skip questions; corrections replace older preferences',()=>{
 let r=reply('I want a credit card for online shopping, fee is okay and I can pay the full bill on time',null,'en');
 assert.equal(r.profile.pending,null);assert.deepEqual(r.options.map(o=>o.id),['sbi','hdfc']);
 r=reply('No annual fee please',r.profile,'en');assert.equal(r.profile.values.fee,'free');assert.ok(r.options.every(o=>o.fee===0));
 r=reply('Actually my salary is 45000',r.profile,'en');assert.equal(r.profile.values.income,45000);
 r=reply('meri income 45000 nahi 40000 hai',r.profile);assert.equal(r.profile.values.income,40000);
 const variable=reply('Credit card chahiye meri income fixed nahi hai 30000 per month');assert.equal(variable.profile.values.income,30000);
});
test('ambiguous fee answers do not invent a paid-card preference and explicit caps filter fees',()=>{
 let r=chat(['credit card for online shopping']);r=reply('haan',r.profile);assert.equal(r.profile.pending,'fee');assert.equal(r.profile.values.fee,undefined);
 r=reply('500 rs tak annual fee chalegi',r.profile);r=reply('haan',r.profile);assert.equal(r.profile.values.maxFee,500);assert.deepEqual(r.options.map(o=>o.id),['hdfc']);
});
test('zero income, inability to repay and unsupported use cases do not produce inappropriate reward-card lists',()=>{
 for(const q of ['Credit card chahiye income nahi hai','Credit card for online shopping, annual fee okay, cannot pay full bill'])assert.equal(reply(q).options.length,0);
 const r=reply('Credit card petrol ke liye, fees okay, full bill pay karunga');assert.equal(r.options.length,0);assert.match(r.answer,/fuel|petrol|पेट्रोल/);
});
test('savings interview uses its own fields and changes order by branch/digital preference',()=>{
 let r=chat(['Mujhe saving account open karna hai','zero balance','app aur UPI use karunga']);
 assert.deepEqual(r.options.map(o=>o.id),['kotak','basic']);assert.match(r.options[0].cost,/2,000/);assert.match(r.options[1].caution,/BSBDA/);assert.equal(r.profile.values.repay,undefined);
 r=reply('branch aur cash services chahiye',r.profile);assert.equal(r.options[0].id,'basic');
 r=reply('ab credit card chahiye',r.profile);assert.equal(r.profile.category,'card');assert.equal(r.profile.values.balance,undefined);
});
test('Hindi numerals and short natural answers work without forcing a form',()=>{
 let r=reply('मुझे क्रेडिट कार्ड चाहिए मेरी आय ३०००० रुपये महीना है');assert.equal(r.profile.values.income,30000);assert.equal(r.profile.style,'hi');
 r=reply('ऑनलाइन खरीदारी',r.profile);r=reply('फीस नहीं देनी',r.profile);r=reply('हाँ',r.profile);assert.ok(r.options.length>0);
 const s=chat(['saving account','0','digital']);assert.equal(s.profile.values.balance,'zero');assert.equal(s.options[0].id,'kotak');
});
test('demat, loan and insurance use relevant questions and disclose quote coverage honestly',()=>{
 const d=chat(['Demat account chahiye','Long term investing','zero maintenance']);assert.equal(d.options[0].id,'groww');assert.equal(d.options[1].id,'zerodha');
 const l=chat(['Mujhe loan chahiye','personal need','200000','5000']);assert.equal(l.profile.values.amount,200000);assert.equal(l.profile.values.budget,5000);assert.match(l.answer,/APR/);assert.equal(l.options.length,0);
 const comparison=reply('Compare lender A APR 12% and lender B APR 14%, same tenure',l.profile);assert.match(comparison.answer,/12%/);assert.match(comparison.answer,/do not add|दोबारा|do baar/);assert.equal(comparison.links.length,1);
 const i=chat(['insurance chahiye','health','family','premium budget kam ho']);assert.equal(i.profile.values.type,'health');assert.equal(i.profile.values.cover,'family');assert.match(i.answer,/reviewed policy|रिव्यू/);assert.equal(i.options.length,0);
});
test('privacy, stale reviews, reset and unrelated issues cannot silently turn into product recommendations',()=>{
 assert.throws(()=>reply('credit card phone 9876543210'),/private/);
 assert.equal(intentOf('My credit card was stolen'),null);
 const r=chat(['Credit card Amazon ke liye','no annual fee','haan']);
 assert.equal(reply('My UPI payment is pending',r.profile),null);
 assert.equal(reply('explain what minimum due means',r.profile),null);
 assert.equal(reply('start over',r.profile).profile,null);
 const stale=advisorReply('credit card',r.profile,'en',new Date('2026-12-01'));assert.equal(stale.options.length,0);assert.match(stale.answer,/fresh review|नया रिव्यू|fresh/);
 for(const item of Object.values(catalog))assert.equal(new URL(item.url).protocol,'https:');
});
