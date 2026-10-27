import {robotsAllows,sourceText} from '../_shared/source-rules.mjs';
import {providerReply,configured} from '../_shared/sia.mjs';
const base=Deno.env.get('SUPABASE_URL')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const hosts=new Set(['www.idfcfirst.bank.in','www.hdfc.bank.in','www.npci.org.in','console.groq.com','ai.google.dev']);
async function db(path:string,method='GET',body?:unknown){const r=await fetch(base+'/rest/v1/'+path,{method,headers:{apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json',Prefer:'return=representation'},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('Database unavailable');return r.json();}
async function fetchText(address:string,limit:number){
 let url=new URL(address);
 for(let hop=0;hop<4;hop++){
  if(url.protocol!=='https:'||url.username||url.password||url.port||!hosts.has(url.hostname))throw Error('Unapproved source destination');
  const response=await fetch(url,{redirect:'manual',headers:{'User-Agent':'SahiFaydaSourceMonitor/1.0'},signal:AbortSignal.timeout(10000)});
  if([301,302,303,307,308].includes(response.status)){const next=response.headers.get('location');if(!next)throw Error('Redirect unavailable');url=new URL(next,url);continue;}
  if(!response.ok)return {status:response.status,text:''};
  const reader=response.body?.getReader();if(!reader)throw Error('No source body');let text='',size=0;const decoder=new TextDecoder();while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw Error('Source exceeds bounded read');}text+=decoder.decode(value,{stream:true});}return {status:response.status,text};
 }
 throw Error('Too many source redirects');
}
async function check(source:any){
 let status='error',hash=source.content_hash,excerpt=source.excerpt,summary='The source could not be checked. Existing product rules were not changed.';
 try{
  const url=new URL(source.source_url),robots=await fetchText(url.origin+'/robots.txt',128000);
  if(robots.status!==404&&(robots.status!==200||!robotsAllows(robots.text,url.pathname+url.search))){status='blocked';summary='Robots permission unavailable or disallowed. No source page fetched.';}
  else{
   const response=await fetchText(source.source_url,750000);if(response.status!==200)throw Error('Source unavailable');
   const text=sourceText(response.text);if(text.length<500)throw Error('Source has no sufficient readable text');
   const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));hash=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');excerpt=text.slice(0,2000);
   status=!source.content_hash?'baseline':hash!==source.content_hash?'changed':'unchanged';
   summary=status==='baseline'?'First readable observation saved. No change has been established.':status==='changed'?'Readable page text changed. This may include navigation or layout text; it is not proof of changed fees, eligibility or policy. Review the official source before changing product guidance.':'No change in the monitored readable text.';
  }
 }catch(error){status='error';summary='Source check failed: '+(error instanceof Error?error.message.slice(0,160):'unavailable')+'. No product rules were updated.';}
 await db('source_watch?id=eq.'+source.id,'PATCH',{content_hash:hash,excerpt,check_status:status,last_checked:new Date().toISOString()});
 if(status==='changed'||status!==source.check_status&&status!=='unchanged')await db('source_alerts','POST',{source_id:source.id,kind:status,summary});
 return {label:source.label,status,summary};
}
async function providerHealth(force:boolean){
 const config=(await db('sia_config?id=eq.true&select=*'))[0];
 if(!config?.free_accounts_confirmed)return {reason:'free_tier_confirmation_needed'};
 if(!force&&config.last_tested_at&&Date.now()-Date.parse(config.last_tested_at)<86400000)return {reason:'recently_tested'};
 if(await db('rpc/take_admin_login_slot','POST',{p_key:'system-provider-health'})!==true)return {reason:'test_rate_limit'};
 const env={GROQ_API_KEY:Deno.env.get('GROQ_API_KEY'),GEMINI_API_KEY:Deno.env.get('GEMINI_API_KEY')},checks:any={};
 for(const provider of ['groq','gemini']){if(!configured(provider,env)){checks[provider]='missing_key';continue;}try{await providerReply(provider,config,env,'budget','hi');checks[provider]='passed';}catch(error){checks[provider]=error instanceof Error&&/^provider_http_\d{3}$/.test(error.message)?error.message:'failed';}}
 const primaryPassed=checks[config.primary_provider]==='passed';
 await db('sia_config?id=eq.true','PATCH',{last_test_ok:primaryPassed,last_tested_at:new Date().toISOString(),provider_checks:checks});
 if(!primaryPassed)await db('service_status?id=eq.sia','PATCH',{state:'paused'});
 await db('admin_activity','POST',{actor_username:'system',action:'sia.provider_health',target:'sia',details:checks});return checks;
}
Deno.serve(async req=>{
 const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
 if(req.method!=='POST')return reply({error:'POST required'},405);
 try{
  const bearer=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,''),token=req.headers.get('x-job-token')||'';
  if(bearer!==service&&(!/^[a-f0-9]{64}$/.test(token)||await db('rpc/verify_source_job_token','POST',{p_token:token})!==true))return reply({error:'Not authorised'},401);
  const settings=(await db('source_watch_settings?id=eq.true&select=enabled'))[0];
  if(!settings?.enabled)return reply({ok:true,reason:'paused_or_recently_run'});
  const body=await req.json().catch(()=>({}));
  const health=await providerHealth(body.check_providers===true);
  if(body.check_providers===true)return reply({ok:true,provider_health:health});
  if(await db('rpc/claim_source_watch','POST',{})!==true)return reply({ok:true,reason:'paused_or_recently_run'});
  await db('rpc/create_daily_marketing_draft','POST',{});
  const sources=await db('source_watch?enabled=eq.true&select=*&limit=5');
  const results=await Promise.all(sources.map(check));return reply({ok:true,provider_health:health,results});
 }catch{return reply({error:'The source-check job needs review in the admin/logs.'},503);}
});
