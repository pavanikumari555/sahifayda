import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {providerReply,routedReply,providerFailureCode} from '../supabase/functions/_shared/sia.mjs';
const config={primary_provider:'groq',fallback_enabled:true,groq_model:'openai/gpt-oss-20b',gemini_model:'gemini-2.5-flash-lite'};
const env={GROQ_API_KEY:'private-groq',GEMINI_API_KEY:'private-gemini'};

test('SIA database helper handles empty NULL/void RPC responses and rejects failures',async()=>{
 const source=await readFile(new URL('../supabase/functions/sia-guide/index.ts',import.meta.url),'utf8');
 const helper=source.slice(source.indexOf('async function db('),source.indexOf('async function active(')).replace('path:string,body?:unknown','path,body');
 const make=new Function('fetch','base','service',helper+';return db;');
 for(const [body,expected] of [['',null],['null',null],['true',true],['{"answer":"cached"}',{answer:'cached'}]]){
  const db=make(async()=>new Response(body),'https://example.test','test-only');
  assert.deepEqual(await db('rpc/test',{}),expected);
 }
 await assert.rejects(make(async()=>new Response('private failure',{status:500}),'https://example.test','test-only')('rpc/test',{}),{message:'Database unavailable'});
 await assert.rejects(make(async()=>new Response('invalid json'),'https://example.test','test-only')('rpc/test',{}),SyntaxError);
});
test('Gemini gets only server-owned topic content, never arbitrary input',async()=>{
 let body;
 const result=await providerReply('gemini',config,env,'upi','hi',async(url,options)=>{
  assert.equal(url.includes('private-gemini'),false);
  assert.equal(options.headers['x-goog-api-key'],'private-gemini');
  body=JSON.parse(options.body);
  return new Response(JSON.stringify({candidates:[{content:{parts:[{text:'भुगतान की स्थिति अपने ऐप में देखें।'}]}}]}));
 });
 assert.match(result,/भुगतान/);assert.match(JSON.stringify(body),/UPI/);
 assert.equal(body.contents.length,1);
 await assert.rejects(providerReply('gemini',config,env,'my-private-question','hi',()=>{throw Error('Must not be sent');}));
});
test('routing uses at most one call per provider and never returns provider error details',async()=>{
 const calls=[];
 const result=await routedReply(config,env,'budget','en',async(url)=>{calls.push(url);return url.includes('groq')?new Response('private-provider-error',{status:429}):new Response(JSON.stringify({candidates:[{content:{parts:[{text:'Review your approximate monthly budget.'}]}}]}));});
 assert.equal(calls.length,2);assert.equal(result.provider,'gemini');assert.doesNotMatch(JSON.stringify(result),/private-/);
 let count=0;
 assert.equal(await routedReply({...config,fallback_enabled:false},env,'budget','en',async()=>{count++;return new Response('{}',{status:503});}),null);
 assert.equal(count,1);
});
test('missing secrets never call a provider and invalid output falls back safely',async()=>{
 assert.equal(await routedReply(config,{},'budget','en',()=>{throw Error('Must not call');}),null);
 assert.equal(await routedReply(config,env,'budget','en',async()=>new Response('{}')),null);
});
test('failure diagnostics classify only safe codes and never include prompts or private provider text',async()=>{
 const failures=[];await routedReply({...config,fallback_enabled:false},env,'budget','en',async()=>new Response('private provider payload',{status:429}),null,reason=>failures.push(reason));
 assert.deepEqual(failures,[{provider:'groq',code:'busy'}]);assert.equal(providerFailureCode(new Error('secret-test-provider-key')),'unavailable');assert.equal(providerFailureCode(new DOMException('private timeout','TimeoutError')),'timeout');assert.equal(providerFailureCode(new Error('Unsupported contextual claim')),'answer_check');
});
