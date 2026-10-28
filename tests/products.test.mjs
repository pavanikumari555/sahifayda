import {test} from 'node:test';import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';import {stripTypeScriptTypes} from 'node:module';import {runInNewContext} from 'node:vm';
import {catalog,currentProduct,productPath,mentionedProductIds} from '../supabase/functions/_shared/reviewed-products.mjs';
import {costLabels} from '../supabase/functions/_shared/product-details.mjs';
import {advisorReply} from '../lib/sia-advisor.mjs';import {matchesProductPartner,partnerDestination} from '../lib/partners.mjs';
const now=new Date('2026-10-28T12:00:00Z'),reply=(q,p=null)=>advisorReply(q,p,'hi',now);
const partner={id:'11111111-1111-4111-8111-111111111111',product_key:'flattrade',category:'demat',kind:'referral',state:'active',promotion_approved:true,reviewed_on:'2026-10-28',expires_at:null,destination_url:'https://flattrade.in/open?ref=synthetic',terms_url:'https://flattrade.in/charges/'};
test('the user’s exact F&O and misspelled brokerage question matches ongoing zero, trial and low-cost alternatives',()=>{
 const r=reply('mujhe future option me trade krna hai isliye demate account open krna chahta hu mujhe aisa demate account btao jo future option me brokrage charge zero leta ho');
 assert.equal(r.profile.values.use,'fno');assert.equal(r.profile.values.fee,'zero_brokerage');assert.deepEqual(r.options.map(o=>o.id),['flattrade','mstock','shoonya']);
 assert.equal(r.options.some(o=>o.id==='groww'||o.id==='zerodha'),false);assert.match(r.options[0].reason,/ongoing/);assert.match(r.options[1].reason,/Temporary/);
 assert.equal(catalog.flattrade.details.brokerage.options,0);assert.equal(catalog.flattrade.details.brokerage.opening,200);assert.equal(catalog.mstock.details.brokerage.trialDays,30);assert.equal(catalog.mstock.details.brokerage.options,10);assert.equal(catalog.shoonya.details.brokerage.options,5);
});
test('delivery, intraday, F&O, opening cost and vague trading are not conflated',()=>{
 assert.equal(reply('F&O trading zero brokerage and zero opening fee').options.some(o=>o.id==='flattrade'),false);
 const vague=reply('demat for trading');assert.equal(vague.profile.pending,'use');assert.equal(vague.options.length,0);
 const holding=reply('future ke liye long term investing demat zero maintenance');assert.equal(holding.profile.values.use,'holding');
 const intra=reply('demat intraday zero brokerage');assert.equal(intra.profile.values.use,'intraday');assert.equal(intra.options[0].id,'flattrade');
 const fixed=reply('delivery investing zero maintenance',reply('F&O trading zero brokerage').profile);assert.equal(fixed.profile.values.use,'holding');assert.notEqual(fixed.options[0].id,'mstock');
 const original=reply('F&O zero brokerage');const followup=reply('brokerage aur charges ki poori info do',original.profile);assert.equal(followup.profile.values.zeroBrokerage,true);assert.equal(followup.options[0].id,'flattrade');
 const amc=reply('annual maintenance bhi zero chahiye',original.profile);assert.equal(amc.profile.values.zeroBrokerage,true);assert.equal(amc.options[0].id,'flattrade');
 const named=reply('m.Stock ki puri information aur fees btao');assert.equal(named.expanded,true);assert.deepEqual(named.options.map(o=>o.id),['mstock']);
});
test('detailed savings information includes distinct funding, fee, interest, cash and eligibility conditions',()=>{
 const r=reply('mujhe saving account open karna hai minimum zero balance app UPI ke liye puri jaankari do');assert.equal(r.options[0].id,'kotak');assert.equal(r.expanded,true);
 const d=catalog.kotak.details;for(const key of ['balance','funding','physical','virtual','interest','cash','transfers'])assert.ok(d.costs[key].en&&d.costs[key].hi);
 assert.match(d.costs.funding.en,/not a joining fee/);assert.match(d.costs.physical.en,/399/);assert.match(catalog.basic.details.costs.cash.en,/Four cash/);assert.match(catalog.basic.details.limits[0].en,/any bank/);
});
test('every public detail and AI fact comes from the same dated product record with bilingual labels and official sources',()=>{
 for(const product of Object.values(catalog)){
  assert.ok(product.details.sources.length);assert.ok(product.details.howTo.length);assert.ok(product.details.limits.length);
  for(const [key,value] of Object.entries(product.details.costs)){assert.ok(costLabels[key].hi);assert.ok(value.en&&value.hi);assert.ok(product.facts.includes(value.en));}
  for(const source of product.details.sources)assert.equal(new URL(source.url).protocol,'https:');
  assert.match(productPath(product.id,'hi'),/^\/hi\/products\/.+\/#/);
 }
 assert.equal(currentProduct('__proto__',now),null);assert.equal(currentProduct('flattrade',new Date('2026-12-01')),null);
});
test('AI mentions attach only current known product records, in mention order, without inventing a referral product',()=>{
 assert.deepEqual(mentionedProductIds('m.Stock is a trial; Flattrade has an ongoing tariff; Shoonya is a paid alternative.',now),['mstock','flattrade','shoonya']);
 assert.deepEqual(mentionedProductIds('Unknown broker X has free trading',now),[]);assert.deepEqual(mentionedProductIds('Flattrade',new Date('2026-12-01')),[]);
});
test('referrals match exact product/category and current approval, independently of commercial sort order',()=>{
 assert.equal(matchesProductPartner(partner,'flattrade',now),true);
 for(const changed of [{product_key:'mstock'},{category:'savings_account'},{state:'draft'},{promotion_approved:false},{reviewed_on:'2020-01-01'},{reviewed_on:'2027-01-01'},{expires_at:'2026-10-27'},{destination_url:'javascript:bad()'},{product_key:null}])assert.equal(matchesProductPartner({...partner,...changed},'flattrade',now),false,JSON.stringify(changed));
 const a=reply('F&O zero brokerage').options.map(o=>o.id);assert.deepEqual(a,reply('F&O zero brokerage').options.map(o=>o.id));
});
test('a product referral click carries its exact mapping and refuses changed destinations',async()=>{
 const original=globalThis.fetch;let sent;
 try{globalThis.fetch=async(url,options)=>{sent=JSON.parse(options.body);return Response.json({original:partner.destination_url,destination:partner.destination_url});};assert.equal(await partnerDestination(partner,'flattrade'),partner.destination_url);assert.equal(sent.product_key,'flattrade');
  globalThis.fetch=async()=>Response.json({original:'https://other-provider.com/',destination:'https://other-provider.com/'});await assert.rejects(partnerDestination(partner,'flattrade'),/changed/);
 }finally{globalThis.fetch=original;}
});
const source=stripTypeScriptTypes(await readFile(new URL('../supabase/functions/partner-click/index.ts',import.meta.url),'utf8'),{mode:'transform'});
function clickEndpoint(resolved){let handler;const calls=[];runInNewContext(source,{Deno:{env:{get:key=>({SUPABASE_URL:'https://test.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'test-only'}[key])},serve:fn=>handler=fn},Set,URL,Response,Request,AbortSignal,TextDecoder,TextEncoder,Date,JSON,Object,Array,Uint8Array,crypto:globalThis.crypto,fetch:async(url,options)=>{calls.push({url,body:JSON.parse(options.body||'null')});if(url.includes('/take_admin_login_slot'))return Response.json(true);if(url.includes('/resolve_partner_product_link'))return Response.json(resolved);throw Error('Unexpected call');}});return {calls,async send(body,origin='https://sahifayda.pages.dev'){const response=await handler(new Request('https://test.supabase.co/functions/v1/partner-click',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)}));return {status:response.status,data:await response.json()};}};}
test('real click endpoint uses atomic mapping resolution and fails closed for paused/remapped links',async()=>{
 const body={id:partner.id,event_id:'22222222-2222-4222-8222-222222222222',product_key:'flattrade'},app=clickEndpoint({...partner,tracking_param:''});
 assert.equal((await app.send(body)).status,200);assert.equal(app.calls.find(c=>c.url.includes('/resolve_partner_product_link')).body.p_product_key,'flattrade');assert.equal(app.calls.some(c=>c.url.includes('/partner_links?')),false);
 assert.equal((await clickEndpoint(null).send(body)).status,404);assert.equal((await clickEndpoint(null).send({...body,product_key:'../bad'})).status,400);assert.equal((await clickEndpoint(null).send(body,'https://attacker.invalid')).status,403);
});
