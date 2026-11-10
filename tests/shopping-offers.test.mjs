import test from 'node:test';
import assert from 'node:assert/strict';
import {rankShoppingOffers,shoppingPreferences,validShoppingOffer} from '../supabase/functions/_shared/shopping-offers.mjs';
import {directoryJourney} from '../supabase/functions/_shared/directory-advisor.mjs';
import {extractCardTerms} from '../supabase/functions/_shared/card-sources.mjs';
import {advisorContext,profileFromConversation,rememberAdvisorProfile} from '../supabase/functions/_shared/sia-advisor.mjs';
const now=new Date('2026-11-10T08:00:00Z'),url='https://bank.example/official-terms';
const offer={id:'ordinary',merchant:'amazon',item:'mobile',payment:'full',membership:'any',startsAt:'2026-11-01T00:00:00Z',endsAt:'2026-11-12T00:00:00Z',minSpend:10000,cashbackRate:5,cashbackCap:2000,discountRate:0,discountCap:0,transactionCost:0,newCardCost:1180,stackable:false,models:[],sourceUrl:url,conditions:{en:'Synthetic fixture only; eligibility and remaining cap apply.',hi:'केवल परीक्षण का उदाहरण; पात्रता और बची हुई सीमा लागू है।'}};
const product=(id,o)=>({id,name:id,category:'credit_card',state:'active',reviewedOn:'2026-11-01',reviewUntil:'2026-11-27',details:{sources:[{url}],shoppingOffers:[o]}});
const context={price:30000,item:'mobile',merchant:'amazon',payment:'full',existingCards:['five','ten'],existingOnly:true,prime:false,remainingCaps:{five:2000,ten:500}};
test('30000 mobile ranks actual net benefit, not headline percentage or commission',()=>{
 const a=product('five',offer),b=product('ten',{...offer,cashbackRate:10,cashbackCap:500});
 const r=rankShoppingOffers([b,a],context,now).ranked;assert.equal(r[0].productId,'five');assert.equal(r[0].netSaving,1500);assert.equal(r[1].netSaving,500);assert.equal(r[0].payToday,30000);
 const after=rankShoppingOffers([a],{...context,remainingCaps:{five:100}},now).ranked;assert.equal(after[0].cashback,100);
});
test('offer expiry, source review, membership, EMI, model and minimum purchase cannot be bypassed',()=>{
 for(const patch of [{endsAt:now.toISOString()},{startsAt:'2026-11-11'},{membership:'prime'},{payment:'emi'},{models:['Exact Phone X']},{minSpend:40000}])assert.equal(rankShoppingOffers([product('five',{...offer,...patch})],context,now).ranked.length,0);
 for(const patch of [{state:'paused'},{sourceReviewDue:true},{reviewUntil:'2026-11-09'}])assert.equal(rankShoppingOffers([{...product('five',offer),...patch}],context,now).ranked.length,0);
 assert.equal(validShoppingOffer({...offer,sourceUrl:'https://other.example/'},[{url}]),false);
});
test('new-card costs and unused statement caps are never silently assumed zero',()=>{
 assert.equal(rankShoppingOffers([product('five',offer)],{...context,remainingCaps:{}},now).unpriced[0].reason,'remaining_cap_needed');
 const r=rankShoppingOffers([product('five',offer)],{...context,existingCards:[],existingOnly:false},now).ranked[0];assert.equal(r.fee,1180);assert.equal(r.netSaving,320);
 assert.equal(rankShoppingOffers([product('five',{...offer,newCardCost:null})],{...context,existingCards:[],existingOnly:false},now).unpriced[0].reason,'new_card_cost_unknown');
});
test('discount and rewards remain alternative routes unless explicit stacking is allowed',()=>{
 const p=product('five',{...offer,discountRate:10,discountCap:1500});
 let r=rankShoppingOffers([p],context,now).ranked[0];assert.equal(r.netSaving,1500);assert.equal(r.cashback,0);
 p.details.shoppingOffers[0].stackable=true;r=rankShoppingOffers([p],context,now).ranked[0];assert.equal(r.cashback,1425);assert.equal(r.netSaving,2925);
 p.details.shoppingOffers.push({...offer,id:'second'});assert.equal(rankShoppingOffers([p],context,now).ranked.length,1);
});
test('shopping remembers budget across card, Prime, payment and remaining-cap follow-ups',()=>{
 let v=shoppingPreferences('mera budget 30k hai mobile kharidna hai');v=shoppingPreferences('Amazon par mere paas SBI Cashback card hai',v);v=shoppingPreferences('full payment, remaining cap 500',v);
 assert.equal(v.budget,30000);assert.equal(v.remainingCaps.sbi,500);assert.deepEqual(v.existingCards,['sbi']);
 const remembered=rememberAdvisorProfile('remaining cap 500',{category:'shopping',values:v},'hi');assert.equal(remembered.category,'shopping');assert.equal(remembered.values.budget,30000);
 const history=[{role:'user',content:advisorContext({category:'shopping',style:'roman',values:{...v,prime:false}})}];
 const p=profileFromConversation(history,'hi',now);assert.equal(p.values.payment,'full');assert.equal(p.values.prime,false);assert.equal(p.values.remainingCaps.sbi,500);
 const short=shoppingPreferences('SBI Cashback',{budget:30000,merchant:'amazon'});assert.deepEqual(short.existingCards,['sbi']);
 const cross=shoppingPreferences('Flipkart pe, mere paas Amazon Pay ICICI card hai, prime nahi',{budget:30000});assert.equal(cross.merchant,'flipkart');assert.deepEqual(cross.existingCards,['amazon']);assert.equal(cross.prime,false);
});
test('SIA uses the same ranked amounts and does not repeat a known budget',()=>{
 const p=product('five',offer);p.name='Reviewed Card';p.aliases=[];
 const r=directoryJourney('best cashback batao',{category:'shopping',values:{budget:30000,item:'mobile',merchant:'amazon',hasCard:true,existingCards:['five'],payment:'full',prime:false,remainingCaps:{five:2000}}},'hi',now,[p]);
 assert.match(r.answer,/1,500/);assert.match(r.answer,/30,000/);assert.equal(r.options[0].id,'five');assert.equal(r.profile.pending,null);
});
test('current SBI parser reads separate online and aggregate caps; absent cap fails closed',()=>{
 const text='You earn card cashback of 5% on online transactions. The maximum cashback that may be earned on online transactions in a statement cycle is Rs. 2,000. Under no circumstances shall the aggregate cashback in a single statement cycle exceed Rs. 4,000.';
 const f=extractCardTerms({parser:'sbi-cashback'},text);assert.equal(f.onlineRate,5);assert.equal(f.onlineCap,2000);assert.equal(f.totalCap,4000);
 assert.throws(()=>extractCardTerms({parser:'sbi-cashback'},text.replace('Rs. 2,000','unknown')),/review/);
});
