import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig } from '../lib/site-config.mjs';
import { serviceStatus } from '../lib/status.mjs';

test('previews cannot accidentally become indexable without a real approved origin',()=>{
 assert.deepEqual(siteConfig({}),{indexable:false,origin:undefined});
 assert.throws(()=>siteConfig({SAHIFAYDA_INDEXABLE:'true'}));
 for(const bad of ['http://sahifayda.com','https://localhost','https://127.0.0.1','https://sahifayda.com/other','https://user:password@sahifayda.com','https://sahifayda.com/?evil=1','https://sahifayda.com:8080']) assert.throws(()=>siteConfig({SAHIFAYDA_INDEXABLE:'true',SAHIFAYDA_PUBLIC_SITE_URL:bad}));
 const launch=siteConfig({SAHIFAYDA_INDEXABLE:'true',SAHIFAYDA_PUBLIC_SITE_URL:'https://sahifayda.com'});
 assert.equal(launch.indexable,true);
 assert.equal(launch.origin,'https://sahifayda.com');
});
test('unknown service IDs are rejected before any remote request',async()=>{
 await assert.rejects(serviceStatus('monthly&select=*'),/Unknown service/);
 await assert.rejects(serviceStatus('__proto__'),/Unknown service/);
});
test('unexpected remote data cannot silently mark a paused or unknown service active',async()=>{
 const priorFetch=globalThis.fetch;
 const oldUrl=process.env.NEXT_PUBLIC_SUPABASE_URL,oldKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 process.env.NEXT_PUBLIC_SUPABASE_URL='https://previewcheck.supabase.co';process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='sb_publishable_test';
 try{
  for(const data of [{},[],[{state:'bogus',message_en:'x',message_hi:'x'}],[{state:'active',message_en:null,message_hi:'x'}]]){
   globalThis.fetch=async()=>({ok:true,json:async()=>data});
   await assert.rejects(serviceStatus('monthly'),/unavailable/);
  }
  globalThis.fetch=async()=>({ok:true,json:async()=>[{state:'paused',message_en:'Paused',message_hi:'अभी बंद है'}]});
  assert.equal((await serviceStatus('monthly')).state,'paused');
 }finally{
  globalThis.fetch=priorFetch;
  if(oldUrl===undefined)delete process.env.NEXT_PUBLIC_SUPABASE_URL;else process.env.NEXT_PUBLIC_SUPABASE_URL=oldUrl;
  if(oldKey===undefined)delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=oldKey;
 }
});
