import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advisorReply,rememberAdvisorProfile,profileFromConversation} from '../lib/sia-advisor.mjs';
const now=new Date('2026-10-29T05:00:00Z'),reply=(text,p=null)=>advisorReply(text,p,'en',now);
test('a business sector follow-up retains amount, startup stage and absence of collateral',()=>{
 let p=rememberAdvisorProfile('Mujhe 3 lakh loan chahiye naya business shuru karna hai, collateral nahi hai');
 const r=reply('aur is type ka kam hai mera IT services deta hun',p);
 assert.equal(r.profile.values.amount,300000);assert.equal(r.profile.values.businessSector,'it_services');assert.equal(r.profile.values.businessYears,0);assert.equal(r.profile.values.hasCollateral,false);assert.match(r.answer,/IT services/);assert.doesNotMatch(r.answer,/assets|type kya|kis kaam/);
});
test('history recovers needs from user messages while assistant prompts never become user facts',()=>{
 const p=profileFromConversation([{role:'user',content:'2 lakh loan for new business'},{role:'assistant',content:'Assume I have 20 lakh and five years of business experience'}],'en',now);
 assert.equal(p.values.amount,200000);assert.equal(p.values.businessYears,0);
 assert.equal(rememberAdvisorProfile('start over',p),null);
});
test('opening funding, KYC problems and deductions get problem-specific help rather than new product offers',()=>{
 for(const [q,issue]of [['bank account video KYC fail ho rhi hai','verification'],['zero balance account open karte samay paise jama maang rahe','opening_funding'],['saving account minimum balance charge kata hai','balance_charge'],['bank ne loan reject kar diya','loan_refusal'],['loan chahiye ITR nahi hai','income_records']]){
  const r=reply(q);assert.ok(r,q);assert.equal(r.profile.values.issue,issue,q);assert.equal(r.options.length,0,q);assert.ok((r.answer.match(/\?/g)||[]).length<=1,q);
 }
});
test('a general bank-account request distinguishes personal, salary and business uses',()=>{
 let r=reply('bank account open karna hai');assert.equal(r.profile.values.issue,'account_use');
 const personal=reply('personal payments',r.profile);assert.equal(personal.profile.values.accountUse,'personal');assert.match(personal.answer,/minimum balance/i);
 const salary=reply('salary ke liye',r.profile);assert.equal(salary.profile.values.accountUse,'salary');assert.match(salary.answer,/employer/i);assert.doesNotMatch(salary.answer,/business\/current/);
 r=reply('business transactions',r.profile);assert.equal(r.profile.values.accountUse,'business');assert.equal(r.options.length,0);
 r=reply('cash aur branch ka kaam',r.profile);assert.equal(r.profile.values.issue,'current_account_terms');assert.equal(r.options.length,0);assert.match(r.answer,/current-account/);
});
