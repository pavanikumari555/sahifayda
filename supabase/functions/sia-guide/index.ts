import {validChatClientId,quotaIdentifier} from '../_shared/client-identity.mjs';
import {readConversation} from '../_shared/conversation.mjs';
import {compareAprQuotes} from '../_shared/quote-comparison.mjs';
import {mentionedProductIds} from '../_shared/reviewed-products.mjs';
import {answerVersion,topics,routedReply} from '../_shared/sia.mjs';
import {financePromptFacts} from '../_shared/finance-sources.mjs';
const base=Deno.env.get('SUPABASE_URL')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const allowed=new Set(['http://127.0.0.1:3100','http://127.0.0.1:3102','http://localhost:3100','http://localhost:3102']);
const production=(Deno.env.get('ADMIN_APP_ORIGIN')||'https://sahifayda.pages.dev');if(production?.startsWith('https://'))allowed.add(new URL(production).origin);
const env={GROQ_API_KEY:Deno.env.get('GROQ_API_KEY'),GEMINI_API_KEY:Deno.env.get('GEMINI_API_KEY')};
async function db(path:string,body?:unknown){const r=await fetch(base+'/rest/v1/'+path,{method:body===undefined?'GET':'POST',headers:{apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error('Database unavailable');const text=await r.text();return text?JSON.parse(text):null;}
async function active(){const rows=await db('service_status?id=eq.sia&select=state');return rows?.[0]?.state==='active';}
Deno.serve(async req=>{
 const origin=req.headers.get('origin')||'';
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':allowed.has(origin)?origin:'null','Access-Control-Allow-Headers':'apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS',Vary:'Origin'};
 const reply=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers});
 if(!allowed.has(origin))return reply({error:'Origin not allowed'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return reply({error:'POST required'},405);
 try{
  if(!req.headers.get('content-type')?.startsWith('application/json'))return reply({error:'JSON required'},415);
  const reader=req.body?.getReader();if(!reader)return reply({error:'Missing request'},400);
  let raw='',size=0;const decoder=new TextDecoder();while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>20000){await reader.cancel();return reply({error:'Request too large'},413);}raw+=decoder.decode(value,{stream:true});}
  let body;try{body=JSON.parse(raw);}catch{return reply({error:'Invalid request'},400);}
  if(!body||Array.isArray(body)||typeof body!=='object'||Object.keys(body).some(k=>!['topic','language','question','history','client_id'].includes(k))||!['hi','en'].includes(body.language))return reply({error:'Invalid request'},400);
  if(body.client_id!==undefined&&!validChatClientId(body.client_id))return reply({error:'Invalid chat session'},400);
  let conversation=null;
  if(Object.hasOwn(body,'question')){try{conversation=readConversation(body);}catch(error){return reply({error:'Check your message',code:error instanceof Error?error.message:'invalid'},400);}}
  else if(!Object.hasOwn(topics,body.topic)||body.history!==undefined)return reply({error:'Choose an available topic'},400);
  const [isActive,configs]=await Promise.all([active(),db('sia_config?id=eq.true&select=*')]);
  if(!isActive)return reply({mode:'guide',reason:'paused'});
  const quoteComparison=conversation&&compareAprQuotes(conversation.question,body.language);
  if(quoteComparison)return reply({mode:'reviewed',...quoteComparison});
  const config=configs[0];
  if(!config?.free_accounts_confirmed)return reply({mode:'guide',reason:'setup'});
  // Salted daily pseudonym; raw addresses/prompts never enter the database.
  const address=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'shared';
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(service+new Date().toISOString().slice(0,10)+quotaIdentifier(address,body.client_id)));
  const client=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  if(await db('rpc/reserve_sia_request',{p_client:client})!==true)return reply({mode:'guide',reason:'limit'});
  if(conversation){
   const observations=await db('finance_knowledge?status=eq.verified&category=eq.loan&select=id,category,source_url,status,facts,checked_at').catch(()=>[]);
   conversation={...conversation,officialFacts:financePromptFacts(observations)};
   const result=await routedReply(config,env,'conversation',body.language,fetch,conversation);
   const [,stillActive]=await Promise.all([db('rpc/finish_sia_request',{p_success:Boolean(result)}),active()]);
   if(!stillActive)return reply({mode:'guide',reason:'paused'});
   return result?reply({mode:'ai',...result,product_ids:mentionedProductIds(result.answer)}):reply({mode:'guide',reason:'provider'});
  }
  const cacheDigest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify([answerVersion,body.topic,body.language,topics[body.topic].facts,config.primary_provider,config.groq_model,config.gemini_model,config.updated_at])));
  const cacheKey=Array.from(new Uint8Array(cacheDigest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  const cached=await db('rpc/read_sia_cache',{p_key:cacheKey});
  if(cached){await db('rpc/finish_sia_request',{p_success:true});if(!await active())return reply({mode:'guide',reason:'paused'});return reply({mode:'ai',...cached,cached:true});}
  const result=await routedReply(config,env,body.topic,body.language);
  if(result)await db('rpc/write_sia_cache',{p_key:cacheKey,p_answer:result.answer,p_provider:result.provider});
  await db('rpc/finish_sia_request',{p_success:Boolean(result)});
  if(!await active())return reply({mode:'guide',reason:'paused'});
  return result?reply({mode:'ai',...result}):reply({mode:'guide',reason:'provider'});
 }catch{return reply({mode:'guide',reason:'unavailable'});}
});
