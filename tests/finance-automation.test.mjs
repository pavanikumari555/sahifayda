import test from 'node:test';
import assert from 'node:assert/strict';
import {financeSourceById,extractFinanceRecord} from '../supabase/functions/_shared/finance-sources.mjs';
import {observationUpdate,approvalUpdate} from '../supabase/functions/_shared/finance-sync.mjs';
import {liveFdCards,applySourceObservations} from '../supabase/functions/_shared/live-card-data.mjs';
import {productIsCurrent} from '../supabase/functions/_shared/product-directory.mjs';
import {financeSources} from '../supabase/functions/_shared/finance-sources.mjs';
import {robotsAllows,sourceText,readBoundedSourceBody} from '../supabase/functions/_shared/source-rules.mjs';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {stripTypeScriptTypes} from 'node:module';
const source=financeSourceById['idfc-fd-source'],now=new Date('2026-11-10T08:00:00Z'),hash='a'.repeat(64),changed='b'.repeat(64);
const text='Context '.repeat(80)+'What is the minimum FD FIRST WOW! needs minimum deposit of ₹20,000. FIRST EA₹N requires a fixed deposit of minimum amount of ₹ 5,000. 18 years of age or older. There is no joining, membership, or annual fee for WOW. The joining fee is ₹499 + GST, and the annual fee (from the second year onwards) is ₹499 + GST.';
test('FD parser keeps exact variants and rejects absent fees or eligibility conditions',()=>{
 const p=extractFinanceRecord(source,text);assert.equal(p.facts.cards[0].minFd,20000);assert.equal(p.facts.cards[1].minFd,5000);
 assert.throws(()=>extractFinanceRecord(source,text.replace('annual fee (from the second year onwards) is ₹499 + GST','annual fee varies')),/review/);
 assert.throws(()=>extractFinanceRecord(source,text.replace('18 years of age','21 years of age')),/review/);
});
test('new/changed card observations stay pending across runs until exact owner approval',()=>{
 const parsed=extractFinanceRecord(source,text),first=observationUpdate(source,null,parsed,hash,now.toISOString());
 assert.equal(first.status,'review_due');assert.equal(first.checked_at,null);
 const repeated=observationUpdate(source,first,parsed,hash,now.toISOString());assert.equal(repeated.status,'review_due');
 const approved={...first,...approvalUpdate(first,source,first.revision,hash,now)};
 assert.equal(observationUpdate(source,approved,parsed,hash,now.toISOString()).status,'verified');
 const next=observationUpdate(source,approved,parsed,changed,now.toISOString());assert.equal(next.status,'review_due');
 assert.equal(observationUpdate(source,next,parsed,changed,now.toISOString()).status,'review_due');
 assert.throws(()=>approvalUpdate(next,source,approved.revision,hash,now),/Reload/);
 assert.throws(()=>approvalUpdate(next,source,next.revision,changed,new Date('2026-11-13')),/Reload/);
});
test('calculator matching fails closed for missing, failed, stale or tampered sources',()=>{
 const parsed=extractFinanceRecord(source,text),pending=observationUpdate(source,null,parsed,hash,now.toISOString());
 const row={...pending,...approvalUpdate(pending,source,1,hash,now)};
 assert.equal(liveFdCards([row],5000,now)[0].id,'idfc-first-earn');
 assert.equal(liveFdCards([row],20000,now).length,2);
 for(const bad of [{...row,status:'review_due'},{...row,source_url:'https://attacker.test/'},{...row,checked_at:'2026-11-07'}])assert.deepEqual(liveFdCards([bad],20000,now),[]);
 assert.deepEqual(liveFdCards([],20000,now),[]);assert.deepEqual(liveFdCards([row],NaN,now),[]);
 const product={id:'idfc_first_wow',state:'active',reviewedOn:'2026-11-01',reviewUntil:'2026-11-27'};
 assert.equal(productIsCurrent(applySourceObservations([product],[{...row,status:'review_due'}],now)[0],now),false);
});
test('complete supported loan fields still refresh automatically',()=>{
 const s=financeSourceById['hdfc-personal'];
 assert.equal(observationUpdate(s,null,{facts:{kind:'loan_rate',rate_min:10},excerpt:'supported fixture'},hash,now.toISOString()).status,'verified');
});
const endpointSource=stripTypeScriptTypes((await readFile(new URL('../supabase/functions/finance-refresh/index.ts',import.meta.url),'utf8')).replace(/^import .*;\r?\n/gm,''),{mode:'transform'});
test('refresh requires a real job credential; public health only exposes bounded freshness counts',async()=>{
 let handler,calls=0,missing=false;
 runInNewContext(endpointSource,{financeSources,extractFinanceRecord,observationUpdate,robotsAllows,sourceText,readBoundedSourceBody,URL,Response,AbortSignal,TextEncoder,crypto:globalThis.crypto,Deno:{env:{get:k=>({SUPABASE_URL:'https://fixture.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'test-private-service'}[k])},serve:fn=>handler=fn},fetch:async url=>{
  calls++;assert.match(url,/finance_knowledge\?select=id,status,last_attempt_at/);
  return Response.json(financeSources.slice(missing?1:0).map(s=>({id:s.id,status:'review_due',last_attempt_at:new Date().toISOString()})));
 }});
 let response=await handler(new Request('https://fixture.supabase.co',{method:'POST'}));assert.equal(response.status,401);assert.equal(calls,0);
 response=await handler(new Request('https://fixture.supabase.co'));assert.equal(response.status,200);
 const health=await response.json();assert.equal(health.coverage,17);assert.equal(health.review_due,17);assert.equal(JSON.stringify(health).includes('test-private'),false);
 missing=true;response=await handler(new Request('https://fixture.supabase.co'));assert.equal(response.status,503);
});
