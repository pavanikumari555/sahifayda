import {test} from 'node:test';import assert from 'node:assert/strict';
import {directorySeed} from '../supabase/functions/_shared/directory-seed.mjs';
import {directoryProduct,validateDirectoryProduct,productIsCurrent} from '../lib/product-directory.mjs';
import {safePartnerUrl,matchesProductPartner} from '../lib/partners.mjs';
import {advisorReply} from '../lib/sia-advisor.mjs';
import {applyDirectoryResult} from '../supabase/functions/_shared/directory-advisor.mjs';
const now=new Date('2026-10-29T12:00:00Z'),products=directorySeed.filter(p=>p.state==='active').map(directoryProduct);
test('every seed is source-backed bilingual information and only Myntra remains draft',()=>{
 assert.equal(directorySeed.length,34);assert.deepEqual(directorySeed.filter(p=>p.state==='draft').map(p=>p.id),['myntra_shopping']);
 for(const p of directorySeed){assert.doesNotThrow(()=>validateDirectoryProduct(p,safePartnerUrl,now));assert.ok(p.content.details.sources.length);}
 assert.equal(productIsCurrent(products[0],new Date('2027-01-01')),false);
});
test('type-first loan questions retain spoken amount and do not repeat known details',()=>{
 const a=advisorReply('mujhe paanch lakh ka loan chahiye',null,'hi',now,[],products);
 assert.equal(a.profile.pending,'purpose');assert.equal(a.profile.values.amount,500000);
 const b=advisorReply('personal loan',a.profile,'hi',now,[],products);
 assert.equal(b.profile.values.amount,500000);assert.equal(b.profile.values.purpose,'personal');assert.ok(b.options.some(p=>p.id==='icici_personal'));
});
test('disabled named products cannot reappear through static fallbacks or mapped links',()=>{
 const active=products.filter(p=>p.id!=='amazon');
 const a=advisorReply('Amazon Pay ICICI ki full fees batao',null,'hi',now,[],active);
 assert.deepEqual(a.options,[]);assert.doesNotMatch(a.answer,/joining.*0|annual.*0|fee.*0/i);
 const p={...products.find(p=>p.id==='kotak'),state:'paused'};
 assert.equal(matchesProductPartner({product_key:p.id,category:p.category,kind:'referral',destination_url:p.url,terms_url:p.url,reviewed_on:'2026-10-29'},p.id,now,p),false);
});
test('paused named loan products are removed from automatically refreshed rate cards',()=>{
 const r=applyDirectoryResult({answer:'ICICI comparison',options:[],loanOptions:[{id:'icici-personal'},{id:'hdfc-personal'}],profile:{category:'loan',style:'en',values:{purpose:'personal'}}},products.filter(p=>p.id!=='icici_personal'),now);
 assert.deepEqual(r.loanOptions.map(p=>p.id),['hdfc-personal']);assert.doesNotMatch(r.answer,/ICICI/);assert.equal(r.options.some(p=>p.id==='icici_personal'),false);
});
test('new reviewed brokers can enter SIA fee comparisons without a source-code preset',()=>{
 const source=products.find(p=>p.id==='flattrade');const custom={...source,id:'custom_broker',name:'Synthetic broker for unit test',revision:2,details:{...source.details,brokerage:{...source.details.brokerage,options:1}}};
 const r=advisorReply('demat F&O low brokerage',null,'en',now,[],[...products,custom]);
 assert.ok(r.options.some(p=>p.id==='custom_broker'));assert.equal(r.options[0].id,'flattrade');
});
test('shopping follow-up remembers budget and does not repeat the existing-card question',()=>{
 const a=advisorReply('mera budget 30k hai mobile lena hai',null,'hi',now,[],products);
 const b=advisorReply('Amazon par, mere paas ICICI card hai',a.profile,'hi',now,[],products);
 assert.equal(b.profile.values.budget,30000);assert.equal(b.profile.values.merchant,'amazon');assert.equal(b.profile.pending,'exactCard');assert.match(b.answer,/exact icici card variant/i);assert.ok(b.options.some(p=>p.id==='amazon_shopping'));assert.doesNotMatch(b.answer,/kaunsa credit card hai/);
});
