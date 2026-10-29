import {test} from 'node:test';
import assert from 'node:assert/strict';
import {financeSourceById,extractFinanceRecord,loanComparisons,financePromptFacts} from '../supabase/functions/_shared/finance-sources.mjs';
import {advisorReply} from '../lib/sia-advisor.mjs';
const now=new Date('2026-10-29T06:00:00Z');
const fixture=(id,min=9.99)=>{
 const s=financeSourceById[id],text='x'.repeat(600)+(id==='icici-personal'?` Latest Personal Loan Interest Rates and Charges Personal Loan interest rates Between ${min}% and 16.50% per annum Processing Charges Up to 2% of the loan amount (non-refundable) + applicable taxes Personal Loan of up to ₹50 lakh`:` Fees & Charges Rate of Interest: ${min}% - 24.00% (Fixed Rate) Loan Processing Charges: Up to ₹ 6,500/- + GST Note: Get ${min}%* p.a. on ₹15 lakh+ Loan Up to ₹1 Crore`);
 return {id,category:'loan',title:s.name,source_url:s.url,status:'verified',checked_at:now.toISOString(),...extractFinanceRecord(s,text)};
};
test('rate/fee extraction requires matching official labels and preserves floor amount conditions',()=>{
 const h=fixture('hdfc-personal');assert.equal(h.facts.floor_min_amount,1500000);assert.equal(h.facts.fee_max,6500);assert.equal(h.facts.max_amount,10000000);
 const i=fixture('icici-personal');assert.equal(i.facts.rate_max,16.5);assert.equal(i.facts.fee_unit,'percent');assert.equal(i.facts.max_amount,5000000);
 assert.throws(()=>extractFinanceRecord(financeSourceById['icici-personal'],'x'.repeat(600)+' rate 7%'),/section/);
 assert.throws(()=>extractFinanceRecord(financeSourceById['hdfc-personal'],'x'.repeat(600)+'Fees & Charges Rate of Interest: 7% - 9% (Fixed Rate)'),/review/);
});
test('business-loan rates stay separate from personal loans and new businesses',()=>{
 const s=financeSourceById['hdfc-business'],text='x'.repeat(600)+' Rack Interest Rate Range- Minimum 10.75% and maximum 22.50% Loan Processing Charges- Tenure Up to 2.00%* of the loan amount Employment: 3 years in current business, 5 years business experience Turnover: ≥ ₹40 lakh Avail of a loan up to ₹75 lakh (up to ₹1 Crore in select locations)';
 const row={id:s.id,category:'loan',title:s.name,source_url:s.url,status:'verified',checked_at:now.toISOString(),...extractFinanceRecord(s,text)};
 assert.equal(row.facts.max_amount,7500000);assert.equal(row.facts.business_min_years,3);assert.equal(row.facts.turnover_min,4000000);
 let r=advisorReply('मुझे 10 लाख का बिजनेस लोन चाहिए',null,'hi',now,[row]);assert.equal(r.profile.pending,'businessAge');
 r=advisorReply('3 साल से कारोबार चल रहा है',r.profile,'hi',now,[row]);assert.equal(r.loanOptions[0].id,'hdfc-business');
 assert.equal(loanComparisons([row],{values:{purpose:'business',amount:1000000,businessYears:0}},now).length,0);
 assert.equal(loanComparisons([row],{values:{purpose:'personal',amount:1000000,businessYears:3}},now).length,0);
});
test('loan comparisons reject stale, failed, wrong-purpose and amount-inapplicable observations',()=>{
 const records=[fixture('hdfc-personal',8),fixture('icici-personal')],profile={values:{purpose:'personal',amount:500000}};
 assert.deepEqual(loanComparisons(records,profile,now).map(r=>r.id),['icici-personal']);
 profile.values.amount=2000000;assert.equal(loanComparisons(records,profile,now)[0].id,'hdfc-personal');
 profile.values.purpose='business';assert.equal(loanComparisons(records,profile,now).length,0);
 profile.values.purpose='personal';assert.equal(loanComparisons(records.map(r=>({...r,status:'review_due'})),profile,now).length,0);
 assert.equal(loanComparisons(records,profile,new Date('2026-11-01')).length,0);
 profile.values.amount=20000000;assert.equal(loanComparisons(records,profile,now).length,0);
 assert.equal(loanComparisons(records.map(r=>({...r,source_url:'https://attacker.test/'})),profile,now).length,0);
});
test('the exact loan conversation reaches source-backed comparisons and accepts a later rate refresh',()=>{
 let r=advisorReply('मुझे लोन लेना है',null,'hi',now);r=advisorReply('5 लाख',r.profile,'hi',now);r=advisorReply('personal loan',r.profile,'hi',now,[fixture('icici-personal')]);
 assert.equal(r.profile.values.amount,500000);assert.equal(r.loanOptions[0].facts.rate_min,9.99);assert.match(r.answer,/9.99%/);assert.doesNotMatch(r.answer,/कितनी रकम|किस काम/);
 r=advisorReply('rate batao',r.profile,'hi',now,[fixture('icici-personal',10.25)]);assert.equal(r.loanOptions[0].facts.rate_min,10.25);
 const prompt=financePromptFacts([fixture('icici-personal')],now);assert.match(prompt,/9.99%/);assert.doesNotMatch(prompt,/https:|x{30}/);
});
