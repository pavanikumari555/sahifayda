import {test} from 'node:test';
import assert from 'node:assert/strict';
import {replyStyle,conversationStyle} from '../supabase/functions/_shared/conversation.mjs';
import {advisorReply} from '../lib/sia-advisor.mjs';
import {providerReply} from '../supabase/functions/_shared/sia.mjs';
import {speechRecognitionLanguage} from '../lib/speech-input.mjs';

test('each clear user message changes reply language independently of the page or earlier language',()=>{
 for(const previous of ['en','hi','roman']){
  assert.equal(replyStyle('मुझे लोन चाहिए',previous),'hi');
  assert.equal(replyStyle('mujhe loan chahiye',previous),'roman');
  assert.equal(replyStyle('I need a loan for my business',previous),'en');
 }
 const history=[{role:'user',content:'mujhe loan chahiye'},{role:'assistant',content:'How much do you need?'}];
 assert.equal(conversationStyle('300000',history,'en'),'roman');
 assert.equal(conversationStyle('I need it for my business',history,'hi'),'en');
 assert.equal(conversationStyle('300000',[{role:'assistant',content:'मुझे लोन चाहिए'}],'en'),'en');
});

test('reviewed loan replies switch Hindi to English to Hinglish without forgetting the amount',()=>{
 let r=advisorReply('मुझे 3 लाख लोन चाहिए',null,'en');
 assert.equal(r.profile.style,'hi');assert.match(r.answer,/[\u0900-\u097f]/);
 r=advisorReply('I need it for my business',r.profile,'hi');
 assert.equal(r.profile.style,'en');assert.equal(r.profile.values.amount,300000);assert.doesNotMatch(r.answer,/[\u0900-\u097f]/);assert.match(r.answer,/business/i);
 r=advisorReply('mera naya business hai IT services deta hun',r.profile,'en');
 assert.equal(r.profile.style,'roman');assert.equal(r.profile.values.amount,300000);assert.match(r.answer,/business|kaam/);assert.doesNotMatch(r.answer,/[\u0900-\u097f]/);
});

test('AI language uses the latest user sentence and preserves Hindi on amount-only follow-ups',async()=>{
 for(const provider of ['groq','gemini'])for(const [question,history,expected] of [
  ['Explain how APR works',[{role:'user',content:'mujhe loan chahiye'}],'Reply in simple English.'],
  ['300000',[{role:'user',content:'मुझे लोन चाहिए'}],'Reply in simple Hindi Devanagari.'],
  ['kaise samjhu',[],'Reply in Roman-script Hinglish, without Devanagari.']
 ]){
  let body;
  await providerReply(provider,{groq_model:'test',gemini_model:'test'},{GROQ_API_KEY:'test',GEMINI_API_KEY:'test'},'conversation','hi',async(url,options)=>{
   body=JSON.parse(options.body);const answer='Check the published terms with the official lender before proceeding.';
   return Response.json(provider==='groq'?{choices:[{message:{content:answer}}]}:{candidates:[{content:{parts:[{text:answer}]}}]});
  },{question,history});
  const system=provider==='groq'?body.messages[0].content:body.systemInstruction.parts[0].text;
  assert.ok(system.includes(expected),provider+' '+question);
 }
});

test('recognition locale adapts automatically from conversation then browser without an auto pseudo-locale',()=>{
 assert.equal(speechRecognitionLanguage('roman',['en-US']),'hi-IN');
 assert.equal(speechRecognitionLanguage('en',['hi-IN']),'en-IN');
 assert.equal(speechRecognitionLanguage(undefined,['hi-IN','en-US']),'hi-IN');
 assert.equal(speechRecognitionLanguage(undefined,['fr-FR','en-GB']),'en-IN');
 assert.equal(speechRecognitionLanguage(undefined,[],'hi'),'hi-IN');
});
