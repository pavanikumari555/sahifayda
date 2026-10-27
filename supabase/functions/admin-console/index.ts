// Auth/session verification happens here; the login action validates credentials itself.
// Never return service keys, password values, raw provider errors or refresh tokens.
const URL_BASE=Deno.env.get('SUPABASE_URL')!;
const SERVICE=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON=Deno.env.get('SUPABASE_ANON_KEY')!;
const allowed=new Set(['http://127.0.0.1:3100','http://127.0.0.1:3102','http://localhost:3100','http://localhost:3102']);
const productionOrigin=Deno.env.get('ADMIN_APP_ORIGIN');
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
async function readBody(req:Request){
 if(!req.headers.get('content-type')?.startsWith('application/json'))throw new Failure(415,'JSON is required.');
 const reader=req.body?.getReader();if(!reader)throw new Failure(400,'Missing request.');
 let total=0;const chunks=[];while(true){const {value,done}=await reader.read();if(done)break;total+=value.length;if(total>6000){await reader.cancel();throw new Failure(413,'Request too large.');}chunks.push(value);}
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
   if(body.id==='sia'&&body.state==='active')throw new Failure(409,'Live SIA cannot start until an AI provider and execution controls are configured.');
   for(const field of ['message_en','message_hi'])if(typeof body[field]!=='string'||!body[field].trim()||body[field].length>1000)throw new Failure(400,'Enter both messages, up to 1000 characters each.');
   const changed=requireSuccess(await upstream(`/rest/v1/service_status?id=eq.${body.id}`,'PATCH',{state:body.state,message_en:body.message_en.trim(),message_hi:body.message_hi.trim()},token,false));
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
