import {test} from 'node:test';
import assert from 'node:assert/strict';
import {providerReply,routedReply} from '../supabase/functions/_shared/sia.mjs';
const config={primary_provider:'groq',fallback_enabled:true,groq_model:'openai/gpt-oss-20b',gemini_model:'gemini-2.5-flash-lite'};
const env={GROQ_API_KEY:'private-groq',GEMINI_API_KEY:'private-gemini'};
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
