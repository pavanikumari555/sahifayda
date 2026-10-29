import {test} from 'node:test';
import assert from 'node:assert/strict';
import {directorySeed} from '../supabase/functions/_shared/directory-seed.mjs';
import {directoryProduct} from '../lib/product-directory.mjs';
import {advisorReply,advisorContext,profileFromConversation} from '../lib/sia-advisor.mjs';
import {brainReply,brainPromptFacts,retrieveBrainProducts} from '../supabase/functions/_shared/sia-brain.mjs';
import {serviceGuides} from '../supabase/functions/_shared/service-guides.mjs';
const now=new Date('2026-10-29T12:00:00Z'),products=directorySeed.filter(p=>p.state==='active').map(directoryProduct);
const answer=(q,p=null,rows=products)=>advisorReply(q,p,'en',now,[],rows);

test('frequent questions answer directly from shared knowledge in English, Hindi and Hinglish',()=>{
 const cases=[['What is APR?','apr'],['APR kya hota hai','apr'],['APR क्या है','apr'],['minimum due bharu to kya hoga','minimum-due'],['UPI pending hai paise kat gaye','upi-pending'],['जीरो बैलेंस का मतलब क्या है','zero-balance'],['FD secured card kya hota hai','secured-card'],['AMC kya hai','demat-costs'],['health aur term insurance mein farq kya hai','insurance-types'],['saving account kya hota hai','savings-meaning'],['What is a demat account?','demat-meaning'],['health insurance kya hai','product-meaning']];
 for(const [q,id]of cases){const r=answer(q);assert.equal(r?.brain,id,q);assert.ok(r.answer.length>30);assert.equal(r.options.length,id==='product-meaning'?1:0);const slug=r.links[0].url.split('/').filter(Boolean).at(-1);assert.ok(id==='product-meaning'||serviceGuides[slug]||slug==='upi-payment-pending',r.links[0].url);}
 assert.doesNotMatch(answer('APR kya hota hai').answer,/[\u0900-\u097f]/);
 assert.match(answer('APR क्या है').answer,/[\u0900-\u097f]/);
});

test('named fee questions return the requested current fact rather than a generic interview',()=>{
 for(const q of ['Kotak 811 debit card charge kitna hai','कोटक 811 डेबिट कार्ड की फीस क्या है']){
  const r=answer(q);assert.equal(r.brain,'product-facts');assert.deepEqual(r.options.map(p=>p.id),['kotak']);assert.ok(r.answer.includes(products.find(p=>p.id==='kotak').details.costs.physical[r.profile.style==='hi'?'hi':'en']));
 }
 for(const q of ['Angle One intraday brokerage kitni hai','एंजेल वन इंट्राडे ब्रोकरेज क्या है'])assert.deepEqual(answer(q).options.map(p=>p.id),['angelone']);
 const card=answer('Amazon Pay ICICI annual fee kya hai');assert.deepEqual(card.options.map(p=>p.id),['amazon']);assert.match(card.answer,/Annual fee ₹0/);
 const changed=products.map(p=>p.id==='amazon'?{...p,revision:7,details:{...p.details,costs:{...p.details.costs,annual:{en:'Synthetic changed annual fee for this test',hi:'इस परीक्षण की बदली फीस'}}}}:p);
 assert.match(answer('Amazon Pay ICICI annual fee kya hai',null,changed).answer,/Synthetic changed annual/);
});

test('follow-up pronouns refer to shown products and a new topic clears irrelevant preferences',()=>{
 const first=answer('Kotak 811 debit card charge kitna hai');
 const next=answer('isme interest kitna hai',first.profile);assert.equal(next.brain,'product-facts');assert.deepEqual(next.profile.productIds,['kotak']);assert.match(next.answer,/Savings interest/);
 const loan=answer('mujhe 5 lakh loan chahiye');
 const card=answer('minimum due kya hota hai',loan.profile);assert.equal(card.profile.category,'card');assert.equal(card.profile.values.amount,undefined);
 const savings=answer('zero balance savings account chahiye');assert.ok(savings.profile.productIds.includes('kotak'));
 assert.equal(answer('isme debit card charge kitna hai',savings.profile).brain,'product-facts');
});

test('a named broker opening stays with that broker and an ambiguous brokerage question asks its segment once',()=>{
 const opening=answer('Angel One account open karna hai');assert.equal(opening.brain,'product-opening');assert.equal(opening.profile.category,'demat');assert.deepEqual(opening.options.map(p=>p.id),['angelone']);
 const first=answer('Flattrade brokerage kitna hai');assert.equal(first.profile.pending,'use');assert.equal(first.brain,'brokerage-segment');
 const next=answer('intraday',first.profile);assert.equal(next.brain,'product-facts');assert.deepEqual(next.options.map(p=>p.id),['flattrade']);assert.match(next.answer,/Equity intraday brokerage/);
});

test('unconfirmed, paused and stale product facts cannot become definite answers',()=>{
 const wow=answer('FIRST WOW UPI pe chalta hai kya');assert.match(wow.answer,/not confirmed|confirm nahi/);assert.doesNotMatch(wow.answer,/supports merchant UPI|UPI chalta hai/);
 for(const rows of [products.filter(p=>p.id!=='kotak'),products.map(p=>p.id==='kotak'?{...p,state:'paused'}:p),products.map(p=>p.id==='kotak'?{...p,reviewUntil:'2020-01-01'}:p)]){
  const r=brainReply('Kotak811 debit card charge kitna hai',null,null,'en',now,rows);assert.equal(r,null);
  assert.equal(brainPromptFacts('Kotak811 charges',null,rows,now).includes('Kotak811'),false);
 }
 assert.equal(answer('saving account video KYC failed').profile.values.issue,'verification');
 assert.equal(answer('insurance claim rejected, what should I do?'),null);
});

test('public knowledge retrieval limits the prompt to relevant current records',()=>{
 const rows=retrieveBrainProducts('Flattrade F&O charges',null,products,now);assert.equal(rows[0].id,'flattrade');assert.ok(rows.length<=6);assert.equal(rows.some(p=>p.category==='shopping'),false);
 const facts=brainPromptFacts('Kotak811 debit card fee',null,products,now);assert.match(facts,/Kotak811/);assert.ok(facts.length<12001);assert.doesNotMatch(facts,/Amazon shopping/);
});

test('uncovered agricultural underwriting never invents document periods, insurance or approval rules',()=>{
 const r=answer('How does a bank assess seasonal farm income for a variable repayment schedule?');assert.equal(r.brain,'coverage-gap');assert.match(r.answer,/do not have reviewed bank-specific/);assert.doesNotMatch(r.answer,/last 2|last 3|crop.yield guarantee/);assert.equal(r.options.length,0);
});

test('fast card-opening routes preserve explicit lack-of-income and repayment protections',()=>{
 const r=answer('FD secured credit card chahiye, income nahi hai');assert.equal(r.brain,'repayment-risk');assert.equal(r.options.length,0);assert.match(r.answer,/poora card bill/);
 const again=answer('FIRST WOW account open karna hai',r.profile);assert.equal(again.brain,'repayment-risk');assert.equal(again.options.length,0);
});

test('server memory retains shopping, pending fields and exact product references without truncated JSON',()=>{
 const profile={category:'shopping',style:'roman',pending:'existingCard',productIds:['amazon_shopping'],values:{budget:30000,merchant:'amazon',item:'mobile',hasCard:false}};
 const recovered=profileFromConversation([{role:'user',content:advisorContext(profile)}],'en',now);
 assert.equal(recovered.category,'shopping');assert.equal(recovered.values.budget,30000);assert.equal(recovered.values.hasCard,false);assert.equal(recovered.pending,'existingCard');assert.equal(recovered.style,'roman');assert.deepEqual(recovered.productIds,['amazon_shopping']);
 const p=answer('Kotak811 debit card charge kitna hai').profile;
 assert.equal(answer('isme interest kitna hai',profileFromConversation([{role:'user',content:advisorContext(p)}],'en',now)).brain,'product-facts');
});
