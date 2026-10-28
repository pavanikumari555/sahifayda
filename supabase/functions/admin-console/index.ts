import {providerReply,configured} from '../_shared/sia.mjs';
import {catalog} from '../_shared/reviewed-products.mjs';
// Auth/session verification happens here; the login action validates credentials itself.
// Never return service keys, password values, raw provider errors or refresh tokens.
const URL_BASE=Deno.env.get('SUPABASE_URL')!;
const SERVICE=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON=Deno.env.get('SUPABASE_ANON_KEY')!;
const allowed=new Set(['http://127.0.0.1:3100','http://127.0.0.1:3102','http://localhost:3100','http://localhost:3102']);
const productionOrigin=(Deno.env.get('ADMIN_APP_ORIGIN')||'https://sahifayda.pages.dev');
if(productionOrigin?.startsWith('https://'))allowed.add(new URL(productionOrigin).origin);
class Failure extends Error { constructor(public status:number,message:string){super(message);} }
async function upstream(path:string,method='GET',body?:unknown,token=SERVICE,privileged=true){
 const res=await fetch(URL_BASE+path,{method,headers:{apikey:privileged?SERVICE:ANON,Authorization:`Bearer ${token}`,'Content-Type':'application/json',Prefer:'return=representation'},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(12000)});
 const data=await res.json().catch(()=>null);
 return {ok:res.ok,status:res.status,data};
}
function requireSuccess(result:{ok:boolean,data:any},message='The request could not be completed.'){if(!result.ok)throw new Failure(400,message);return result.data;}
async function log(who:any,action:string,target:string,details:unknown={}){requireSuccess(await upstream('/rest/v1/admin_activity','POST',{actor_id:who.user_id,actor_username:who.username,action,target,details}),'The change was made but its activity record could not be saved.');}
async function slot(key:string){const data=requireSuccess(await upstream('/rest/v1/rpc/take_admin_login_slot','POST',{p_key:key}));if(data!==true)throw new Failure(429,'Too many attempts. Wait five minutes and try again.');}
function validPassword(v:unknown){return typeof v==='string'&&v.length>=12&&v.length<=256;}
function validUsername(v:unknown){return typeof v==='string'&&/^[a-z0-9][a-z0-9_.-]{2,39}$/.test(v);}
function validEmail(v:unknown){return typeof v==='string'&&v.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);}
const aiEnv={GROQ_API_KEY:Deno.env.get('GROQ_API_KEY'),GEMINI_API_KEY:Deno.env.get('GEMINI_API_KEY')};
const uuid=(v:unknown)=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
function publicUrl(value:unknown){
 if(typeof value!=='string'||value.length>2000||/[\s\\]/.test(value))throw new Failure(400,'Use a complete public HTTPS URL.');
 let u;try{u=new URL(value);}catch{throw new Failure(400,'Use a valid HTTPS URL.');}
 if(u.protocol!=='https:'||u.username||u.password||u.port||!u.hostname.includes('.')||/^[\d.]+$/.test(u.hostname)||/[:\[\]]/.test(u.hostname)||/\.(localhost|local|internal|invalid|test|example)$/.test(u.hostname)||['localhost','bit.ly','t.co','tinyurl.com','rb.gy'].includes(u.hostname)||[...u.searchParams.keys()].some(k=>/^(api_?key|access_token|refresh_token|password|secret)$/i.test(k)))throw new Failure(400,'Use a direct public HTTPS partner URL without credentials or URL shorteners.');
 return u.href;
}
function partnerFields(body:any){
 const value:any={};
 for(const [key,max,min] of [['partner',100,1],['title_en',120,1],['title_hi',120,1],['description_en',600,0],['description_hi',600,0],['disclosure_en',600,20],['disclosure_hi',600,20],['approval_note',1200,0]] as const){if(typeof body[key]!=='string'||body[key].trim().length<min||body[key].length>max)throw new Failure(400,'Check the bilingual titles, disclosures and field lengths.');value[key]=body[key].trim();}
 if(!['affiliate','referral'].includes(body.kind)||!['draft','active','paused','archived'].includes(body.state)||typeof body.promotion_approved!=='boolean'||!Number.isInteger(body.sort_order)||body.sort_order<0||body.sort_order>9999)throw new Failure(400,'Check link type, state and display order.');
 if(!['credit_card','savings_account','loan','demat','insurance','other'].includes(body.category))throw new Failure(400,'Choose a product category.');
 if(body.product_key!==undefined&&body.product_key!==null&&body.product_key!==''&&(typeof body.product_key!=='string'||!Object.hasOwn(catalog,body.product_key)||catalog[body.product_key].category!==body.category))throw new Failure(400,'Choose the exact reviewed product in this category.');
 value.product_key=body.product_key||null;
 if(body.tracking_param!==undefined&&(typeof body.tracking_param!=='string'||body.tracking_param!==''&&!/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(body.tracking_param)))throw new Failure(400,'Use an optional approved attribution parameter name.');
 value.tracking_param=body.tracking_param||'';
 if(body.eligibility_tag!==undefined&&!['not_assessed','fd_backed','income_based'].includes(body.eligibility_tag))throw new Failure(400,'Choose a reviewed card-route tag.');
 value.eligibility_tag=body.eligibility_tag||'not_assessed';
 Object.assign(value,{category:body.category,kind:body.kind,state:body.state,promotion_approved:body.promotion_approved,sort_order:body.sort_order,destination_url:publicUrl(body.destination_url),terms_url:publicUrl(body.terms_url)});
 if(!/^\d{4}-\d{2}-\d{2}$/.test(body.reviewed_on||''))throw new Failure(400,'Enter the terms review date.');
 const reviewed=Date.parse(body.reviewed_on+'T00:00:00Z'),today=Date.parse(new Date().toISOString().slice(0,10)+'T00:00:00Z');
 if(!Number.isFinite(reviewed)||new Date(reviewed).toISOString().slice(0,10)!==body.reviewed_on||reviewed>today)throw new Failure(400,'The review date must be valid and cannot be in the future.');
 if(body.expires_at&&!Number.isFinite(Date.parse(body.expires_at)))throw new Failure(400,'Enter a valid expiry date.');
 value.reviewed_on=body.reviewed_on;value.expires_at=body.expires_at?new Date(body.expires_at).toISOString():null;
 if(value.state==='active'&&(!value.promotion_approved||value.approval_note.length<10||today-reviewed>90*86400000||value.expires_at&&Date.parse(value.expires_at)<=Date.now()))throw new Failure(400,'Publishing requires current website-promotion approval, an approval note and an unexpired reviewed offer.');
 return value;
}
async function readBody(req:Request){
 if(!req.headers.get('content-type')?.startsWith('application/json'))throw new Failure(415,'JSON is required.');
 const reader=req.body?.getReader();if(!reader)throw new Failure(400,'Missing request.');
 let total=0;const chunks=[];while(true){const {value,done}=await reader.read();if(done)break;total+=value.length;if(total>14000){await reader.cancel();throw new Failure(413,'Request too large.');}chunks.push(value);}
 const bytes=new Uint8Array(total);let offset=0;for(const value of chunks){bytes.set(value,offset);offset+=value.length;}
 try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw new Failure(400,'Invalid request.');}
}
async function currentUser(token:string){const r=await upstream('/auth/v1/user','GET',undefined,token,false);if(!r.ok||!r.data?.id)throw new Failure(401,'Please sign in again.');return r.data;}
async function context(token:string){const r=await upstream('/rest/v1/rpc/admin_context','POST',{},token,false);if(!r.ok||!r.data?.[0])throw new Failure(403,'This account does not have active admin access.');return r.data[0];}
async function reauthenticate(user:any,password:unknown,accountId:string){
 if(typeof password!=='string'||password.length>256)throw new Failure(400,'Enter your current password.');
 await slot(accountId);
 const r=await upstream('/auth/v1/token?grant_type=password','POST',{email:user.email,password},ANON,false);
 if(!r.ok||r.data?.user?.id!==user.id)throw new Failure(401,'Your current password could not be verified.');
 await upstream('/auth/v1/logout?scope=local','POST',{},r.data.access_token,false);
}
Deno.serve(async(req)=>{
 const origin=req.headers.get('origin')||'';
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Access-Control-Allow-Origin':allowed.has(origin)?origin:'null','Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS',Vary:'Origin'};
 const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(!allowed.has(origin))return reply({error:'Origin not allowed.'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return reply({error:'Method not allowed.'},405);
 try{
  const body=await readBody(req);
  if(!body||typeof body!=='object'||Array.isArray(body))throw new Failure(400,'Invalid request.');
  const action=body.action;
  if(action==='request-recovery'){
   const username=String(body.username||'').trim().toLowerCase();
   const message='Request received. If this is an enabled admin account and email delivery is available, a recovery link will arrive at its current email. Check Inbox and Spam.';
   if(!validUsername(username))return reply({ok:true,message});
   const profiles=requireSuccess(await upstream(`/rest/v1/admin_accounts?username=eq.${encodeURIComponent(username)}&select=id,user_id,username,enabled&limit=1`));
   const profile=profiles[0];await slot('recovery:'+(profile?.id||'unknown'));
   if(profile?.enabled&&profile.user_id){
    const existing=requireSuccess(await upstream('/auth/v1/admin/users/'+profile.user_id));
    const sent=await upstream('/auth/v1/recover?redirect_to='+encodeURIComponent(origin+'/admin/recover/'),'POST',{email:existing.email},ANON,false);
    await log(profile,sent.ok?'recovery.requested':'recovery.delivery_failed',profile.username,{provider_status:sent.status});
   }
   return reply({ok:true,message});
  }
  if(action==='login'){
   const username=String(body.username||'').trim().toLowerCase();
   if(!validUsername(username)||typeof body.password!=='string'||body.password.length>256)throw new Failure(401,'Username or password is incorrect.');
   const profiles=requireSuccess(await upstream(`/rest/v1/admin_accounts?username=eq.${encodeURIComponent(username)}&select=*&limit=1`));
   const profile=profiles[0];await slot(profile?.id||'unknown');
   if(!profile?.enabled)throw new Failure(401,'Username or password is incorrect.');
   let email=profile.recovery_email;
   if(profile.user_id){const existing=requireSuccess(await upstream('/auth/v1/admin/users/'+profile.user_id));email=existing.email;}
   const signed=await upstream('/auth/v1/token?grant_type=password','POST',{email,password:body.password},ANON,false);
   if(!signed.ok||!signed.data?.user?.id)throw new Failure(401,'Username or password is incorrect, or the account setup is incomplete.');
   const user=signed.data.user;
   if(profile.user_id&&profile.user_id!==user.id)throw new Failure(401,'Username or password is incorrect.');
   if(!profile.user_id){
    const linked=requireSuccess(await upstream(`/rest/v1/admin_accounts?id=eq.${profile.id}&user_id=is.null`,'PATCH',{user_id:user.id}));
    if(!linked.length)throw new Failure(409,'Account setup changed. Please sign in again.');
   }
   if(body.password.length<12)requireSuccess(await upstream(`/rest/v1/admin_accounts?id=eq.${profile.id}`,'PATCH',{must_change_password:true}));
   const who=await context(signed.data.access_token);
   await log(who,'session.signed_in',who.username);
   return reply({access_token:signed.data.access_token,expires_at:Math.floor(Date.now()/1000)+Math.min(signed.data.expires_in,1800),username:who.username});
  }
  const token=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
  if(!token||token.length>5000)throw new Failure(401,'Please sign in.');
  const user=await currentUser(token),who=await context(token);
  if(action==='logout'){await log(who,'session.signed_out',who.username);requireSuccess(await upstream('/auth/v1/logout?scope=local','POST',{},token,false));return reply({ok:true});}
  if(who.must_change_password&&!['dashboard','change-password'].includes(action))throw new Failure(403,'Change your temporary password first.');
  if(action==='source-status')return reply({settings:requireSuccess(await upstream('/rest/v1/source_watch_settings?select=*'))[0],sources:requireSuccess(await upstream('/rest/v1/source_watch?select=id,label,source_url,enabled,last_checked,check_status&order=label')),alerts:requireSuccess(await upstream('/rest/v1/source_alerts?select=*&order=created_at.desc&limit=60'))});
  if(action==='set-source-watch'){
   if(who.role!=='owner'||typeof body.enabled!=='boolean')throw new Failure(403,'Only an owner can change the daily source job.');
   requireSuccess(await upstream('/rest/v1/source_watch_settings?id=eq.true','PATCH',{enabled:body.enabled}));await log(who,'source.job_changed','daily',{enabled:body.enabled});return reply({ok:true});
  }
  if(action==='run-source-watch'){
   if(who.role!=='owner')throw new Failure(403,'Only an owner can run source checks.');
   const response=await fetch(URL_BASE+'/functions/v1/source-watch',{method:'POST',headers:{Authorization:'Bearer '+SERVICE,'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(65000)});
   if(!response.ok)throw new Failure(503,'Source job failed. Review its logs/status.');return reply(await response.json());
  }
  if(action==='review-source-alert'){
   if(who.role!=='owner'||!Number.isSafeInteger(body.id)||body.id<1)throw new Failure(403,'Only an owner can review a source alert.');
   requireSuccess(await upstream('/rest/v1/source_alerts?id=eq.'+body.id,'PATCH',{reviewed_at:new Date().toISOString(),reviewed_by:who.user_id}));await log(who,'source.alert_reviewed',String(body.id));return reply({ok:true});
  }
  if(action==='marketing-list')return reply({posts:requireSuccess(await upstream('/rest/v1/marketing_posts?select=*&order=day.desc&limit=40'))});
  if(action==='make-daily-post'){
   if(who.role!=='owner')throw new Failure(403,'Only an owner can generate a daily draft.');
   const id=requireSuccess(await upstream('/rest/v1/rpc/create_daily_marketing_draft','POST',{}));await log(who,'marketing.draft_requested','daily');return reply({ok:true,created:Boolean(id),message:id?'Today’s draft created.':'Today’s draft already exists. Edit it below; duplicate drafts were not created.'});
  }
  if(action==='save-marketing-post'){
   if(who.role!=='owner'||!uuid(body.id)||!Number.isInteger(body.revision))throw new Failure(403,'Only an owner can review a saved post.');
   const fields:any={};for(const key of ['title_en','title_hi','body_en','body_hi']){if(typeof body[key]!=='string'||body[key].trim().length<3||body[key].length>(key.startsWith('title')?140:700))throw new Failure(400,'Use concise bilingual titles and copy.');fields[key]=body[key].trim();}
   if(!['draft','approved','archived'].includes(body.state)||!Number.isInteger(body.palette)||body.palette<0||body.palette>3||!Number.isInteger(body.layout)||body.layout<0||body.layout>2)throw new Failure(400,'Choose a valid state, palette and layout.');
   Object.assign(fields,{state:body.state,palette:body.palette,layout:body.layout,updated_by:who.user_id});
   const rows=requireSuccess(await upstream('/rest/v1/marketing_posts?id=eq.'+body.id+'&revision=eq.'+body.revision,'PATCH',fields));if(!rows.length)throw new Failure(409,'This post changed. Refresh before editing.');return reply({ok:true,message:'Post saved for manual download/review. No social post was published.'});
  }
  if(action==='editorial-list')return reply({ideas:requireSuccess(await upstream('/rest/v1/editorial_queue?select=*&order=updated_at.desc&limit=200'))});
  if(action==='save-editorial'){
   if(who.role!=='owner')throw new Failure(403,'Only an owner can approve editorial changes.');
   if(!['keyword','market_gap','correction','feature'].includes(body.kind)||!['idea','researching','approved','implemented','rejected'].includes(body.state)||typeof body.title!=='string'||body.title.trim().length<3||body.title.length>160||typeof body.intent!=='string'||body.intent.trim().length<10||body.intent.length>1200||typeof body.evidence_note!=='string'||body.evidence_note.length>2000||typeof body.result_path!=='string'||body.result_path.length>200||body.result_path&&!/^\/(hi\/)?guides\/[a-z0-9-]+\/$/.test(body.result_path))throw new Failure(400,'Check the idea, evidence and resulting guide path.');
   const evidence=body.evidence_url?publicUrl(body.evidence_url):'';
   if(['approved','implemented'].includes(body.state)&&(!evidence||body.evidence_note.trim().length<20))throw new Failure(400,'Approval needs a source and a clear evidence/review note. Keyword volume must remain unknown unless sourced.');
   if(body.state==='implemented'&&!body.result_path)throw new Failure(400,'Record the built guide path before marking implemented. This does not deploy a website.');
   const values={kind:body.kind,title:body.title.trim(),intent:body.intent.trim(),evidence_url:evidence,evidence_note:body.evidence_note.trim(),state:body.state,result_path:body.result_path,updated_by:who.user_id};
   if(body.id){if(!uuid(body.id)||!Number.isInteger(body.revision))throw new Failure(400,'Reload this idea.');const rows=requireSuccess(await upstream('/rest/v1/editorial_queue?id=eq.'+body.id+'&revision=eq.'+body.revision,'PATCH',values));if(!rows.length)throw new Failure(409,'The idea changed. Refresh before saving.');}
   else requireSuccess(await upstream('/rest/v1/editorial_queue','POST',values));
   return reply({ok:true,message:'Research record saved. This records a reviewed idea; it does not train a model or publish a page.'});
  }
  if(action==='partners-list')return reply({links:requireSuccess(await upstream('/rest/v1/partner_links?select=*&order=sort_order,updated_at.desc&limit=100')),performance:requireSuccess(await upstream('/rest/v1/rpc/partner_performance','POST',{})),reports:requireSuccess(await upstream('/rest/v1/partner_reports?select=*&order=updated_at.desc&limit=200'))});
  if(action==='save-partner-report'){
   if(who.role!=='owner')throw new Failure(403,'Only an owner can record partner conversions.');
   if(!uuid(body.link_id)||typeof body.report_ref!=='string'||body.report_ref.trim().length<3||body.report_ref.length>120||typeof body.source_note!=='string'||body.source_note.trim().length<10||body.source_note.length>1200||!['account_opened','card_issued','loan_disbursed','policy_issued','other'].includes(body.event_type)||!['pending','approved','rejected'].includes(body.status)||!Number.isInteger(body.conversion_count)||body.conversion_count<0||body.conversion_count>1000000||typeof body.commission_inr!=='number'||!Number.isFinite(body.commission_inr)||body.commission_inr<0||body.commission_inr>100000000)throw new Failure(400,'Check the report reference, source, event type, counts and commission.');
   for(const key of ['period_start','period_end','reported_on'])if(!/^\d{4}-\d{2}-\d{2}$/.test(body[key]||'')||!Number.isFinite(Date.parse(body[key]))||new Date(body[key]).toISOString().slice(0,10)!==body[key])throw new Failure(400,'Enter valid report dates.');
   const today=new Date().toISOString().slice(0,10);if(body.period_end<body.period_start||body.reported_on>today||body.period_end>today)throw new Failure(400,'Check the report period; future results cannot be recorded.');
   const data={link_id:body.link_id,report_ref:body.report_ref.trim(),event_type:body.event_type,status:body.status,conversion_count:body.conversion_count,commission_inr:body.commission_inr,period_start:body.period_start,period_end:body.period_end,reported_on:body.reported_on,source_note:body.source_note.trim(),updated_by:who.user_id};
   if(body.id){if(!uuid(body.id)||!Number.isInteger(body.revision))throw new Failure(400,'Reload the report.');const rows=requireSuccess(await upstream('/rest/v1/partner_reports?id=eq.'+body.id+'&revision=eq.'+body.revision,'PATCH',data),'The report could not be updated. Check the reference.');if(!rows.length)throw new Failure(409,'Report changed. Refresh before editing.');}
   else requireSuccess(await upstream('/rest/v1/partner_reports','POST',data),'The report could not be saved. That link/reference may already exist; edit its existing report to avoid double counting.');
   return reply({ok:true,message:'Partner-reported results saved. These are not inferred from clicks or confirmed payouts.'});
  }
  if(action==='save-partner'){
   if(who.role!=='owner')throw new Failure(403,'Only an owner can change commercial links.');
   const values=partnerFields(body);await reauthenticate(user,body.current_password,who.id);
   values.updated_by=who.user_id;
   if(body.id){
    if(!uuid(body.id)||!Number.isInteger(body.revision))throw new Failure(400,'Reload this link before editing.');
    const rows=requireSuccess(await upstream('/rest/v1/partner_links?id=eq.'+body.id+'&revision=eq.'+body.revision,'PATCH',values));
    if(!rows.length)throw new Failure(409,'This link changed in another tab. Refresh before saving.');
    return reply({ok:true,link:rows[0]});
   }
   return reply({ok:true,link:requireSuccess(await upstream('/rest/v1/partner_links','POST',values))[0]});
  }
  if(action==='ai-settings'){
   return reply({settings:requireSuccess(await upstream('/rest/v1/sia_config?id=eq.true&select=*'))[0],keys:{groq:configured('groq',aiEnv),gemini:configured('gemini',aiEnv)},usage:requireSuccess(await upstream('/rest/v1/rpc/sia_usage_today','POST',{}))[0]||{attempts:0,responses:0,failures:0}});
  }
  if(action==='save-ai-settings'){
   if(who.role!=='owner')throw new Failure(403,'Only an owner can configure AI routing.');
   if(!['groq','gemini'].includes(body.primary_provider)||typeof body.fallback_enabled!=='boolean'||typeof body.free_accounts_confirmed!=='boolean'||!Number.isInteger(body.daily_limit)||body.daily_limit<1||body.daily_limit>500||!['openai/gpt-oss-20b','openai/gpt-oss-120b','qwen/qwen3.8-27b'].includes(body.groq_model)||!['gemini-2.5-flash-lite','gemini-3.1-flash-lite'].includes(body.gemini_model))throw new Failure(400,'Choose supported models and a daily cap from 1 to 500.');
   requireSuccess(await upstream('/rest/v1/sia_config?id=eq.true','PATCH',{primary_provider:body.primary_provider,fallback_enabled:body.fallback_enabled,groq_model:body.groq_model,gemini_model:body.gemini_model,daily_limit:body.daily_limit,free_accounts_confirmed:body.free_accounts_confirmed,last_test_ok:false,last_tested_at:null,updated_at:new Date().toISOString()}));
   requireSuccess(await upstream('/rest/v1/service_status?id=eq.sia','PATCH',{state:'paused'}));
   await log(who,'sia.settings_updated','sia',{primary:body.primary_provider,daily_limit:body.daily_limit});
   return reply({ok:true,message:'Settings saved. Live SIA is paused until provider tests pass and you activate it.'});
  }
  if(action==='test-ai'){
   if(who.role!=='owner')throw new Failure(403,'Only an owner can run provider checks.');
   await slot('ai-test:'+who.id);
   const config=requireSuccess(await upstream('/rest/v1/sia_config?id=eq.true&select=*'))[0];
   if(!config.free_accounts_confirmed)throw new Failure(409,'Confirm that these accounts use free API tiers before testing.');
   const checks:any={};
   for(const provider of ['groq','gemini']){if(!configured(provider,aiEnv)){checks[provider]='missing_key';continue;}try{await providerReply(provider,config,aiEnv,'budget','hi');checks[provider]='passed';}catch(error){checks[provider]=error instanceof Error&&/^provider_http_\d{3}$/.test(error.message)?error.message:'failed';}}
   const passed=checks[config.primary_provider]==='passed';
   requireSuccess(await upstream('/rest/v1/sia_config?id=eq.true','PATCH',{last_test_ok:passed,last_tested_at:new Date().toISOString(),provider_checks:checks}));
   await log(who,'sia.provider_test','sia',checks);return reply({ok:true,checks,message:passed?'Primary provider test passed. You may activate live SIA in Tools & availability.':'Primary provider did not pass. Check the saved secret, model access and free quota; live SIA stays paused.'});
  }
  if(action==='dashboard'){
   const response:any={account:{...who,email:user.email,pending_email:user.new_email||null}};
   if(who.must_change_password)return reply(response);
   const [services,activity]=await Promise.all([upstream('/rest/v1/service_status?select=*&order=id','GET',undefined,token,false),upstream('/rest/v1/admin_activity?select=*&order=occurred_at.desc&limit=30','GET',undefined,token,false)]);
   response.services=requireSuccess(services);response.activity=requireSuccess(activity);
   if(who.role==='owner')response.users=requireSuccess(await upstream('/rest/v1/admin_accounts?select=id,username,role,enabled,must_change_password,created_at&order=created_at'));
   return reply(response);
  }
  if(action==='update-service'){
   if(!['monthly','compare','guidance','sia'].includes(body.id)||!['active','paused','hidden'].includes(body.state))throw new Failure(400,'Choose a valid tool state.');
   if(body.id==='sia'&&body.state==='active'){
    if(who.role!=='owner')throw new Failure(403,'Only an owner can activate live AI.');
    const config=requireSuccess(await upstream('/rest/v1/sia_config?id=eq.true&select=*'))[0];
    if(!config?.free_accounts_confirmed||!config.last_test_ok||!config.last_tested_at||Date.now()-Date.parse(config.last_tested_at)>86400000||!configured(config.primary_provider,aiEnv))throw new Failure(409,'Configure the free provider and pass its test before activating live SIA.');
   }
   for(const field of ['message_en','message_hi'])if(typeof body[field]!=='string'||!body[field].trim()||body[field].length>1000)throw new Failure(400,'Enter both messages, up to 1000 characters each.');
   const changed=requireSuccess(await upstream(`/rest/v1/service_status?id=eq.${body.id}`,'PATCH',{state:body.state,message_en:body.message_en.trim(),message_hi:body.message_hi.trim()},body.id==='sia'?SERVICE:token,body.id==='sia'));
   if(body.id==='sia')await log(who,'sia.availability_changed','sia',{state:body.state});
   if(!changed.length)throw new Failure(403,'Your access changed. Please sign in again.');
   return reply({ok:true});
  }
  if(action==='change-password'){
   if(!validPassword(body.new_password))throw new Failure(400,'Use a new password with 12 to 256 characters.');
   await reauthenticate(user,body.current_password,who.id);
   requireSuccess(await upstream('/auth/v1/user','PUT',{password:body.new_password,current_password:body.current_password},token,false),'The password could not be changed. Check the provider requirements.');
   requireSuccess(await upstream(`/rest/v1/admin_accounts?id=eq.${who.id}`,'PATCH',{must_change_password:false}));
   await log(who,'account.password_changed',who.username);return reply({ok:true});
  }
  if(action==='change-email'){
   const email=String(body.email||'').trim().toLowerCase();if(!validEmail(email))throw new Failure(400,'Enter a valid email address.');
   await reauthenticate(user,body.current_password,who.id);
   requireSuccess(await upstream('/auth/v1/user?redirect_to='+encodeURIComponent(origin+'/admin/'),'PUT',{email},token,false),'The email change request could not be sent.');
   await log(who,'account.email_change_requested',who.username);
   return reply({ok:true,message:'Check the confirmation messages from Supabase. The new email is not active until the required confirmations are complete.'});
  }
  if(action==='create-user'){
   if(who.role!=='owner')throw new Failure(403,'Only an owner can add managers.');
   const username=String(body.username||'').trim().toLowerCase(),email=String(body.email||'').trim().toLowerCase();
   if(!validUsername(username)||!validEmail(email)||!['owner','manager'].includes(body.role)||!validPassword(body.temporary_password))throw new Failure(400,'Check username, email, role and the 12-character minimum temporary password.');
   await reauthenticate(user,body.current_password,who.id);
   const existing=requireSuccess(await upstream(`/rest/v1/admin_accounts?username=eq.${encodeURIComponent(username)}&select=id&limit=1`));if(existing.length)throw new Failure(409,'Choose a different username.');
   const created=requireSuccess(await upstream('/auth/v1/admin/users','POST',{email,password:body.temporary_password,email_confirm:true}),'The account could not be created. It may already exist.');
   if(!created.id)throw new Failure(500,'Account provisioning needs review.');
   requireSuccess(await upstream('/rest/v1/admin_accounts','POST',{user_id:created.id,username,recovery_email:email,role:body.role,must_change_password:true}),'The Auth account exists but admin access could not be added. Contact the owner before retrying.');
   await log(who,'account.created',username,{role:body.role});return reply({ok:true,message:'Account added. Share the temporary password privately. The user must change it at first login.'});
  }
  if(action==='set-user-enabled'){
   if(who.role!=='owner')throw new Failure(403,'Only an owner can change user access.');
   if(typeof body.id!=='string'||! /^[0-9a-f-]{36}$/i.test(body.id)||typeof body.enabled!=='boolean'||body.id===who.id)throw new Failure(400,'Choose another account. You cannot disable yourself.');
   await reauthenticate(user,body.current_password,who.id);
   requireSuccess(await upstream('/rest/v1/rpc/set_admin_enabled','POST',{p_id:body.id,p_enabled:body.enabled}),'This change is not allowed. The last owner must stay enabled.');
   await log(who,body.enabled?'account.enabled':'account.disabled',body.id);return reply({ok:true});
  }
  throw new Failure(400,'Unknown action.');
 }catch(error){return reply({error:error instanceof Failure?error.message:'The service is temporarily unavailable. Try again.'},error instanceof Failure?error.status:503);}
});
