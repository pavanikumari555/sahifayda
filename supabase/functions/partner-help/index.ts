import {validatePartnerHelp} from '../_shared/partner-help.mjs';
const base=Deno.env.get('SUPABASE_URL')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const allowed=new Set(['http://127.0.0.1:3100','http://127.0.0.1:3102','http://localhost:3100','http://localhost:3102']);
const production=Deno.env.get('ADMIN_APP_ORIGIN')||'https://sahifayda.pages.dev';if(production.startsWith('https:'))allowed.add(new URL(production).origin);
async function db(fn:string,body:unknown){const r=await fetch(base+'/rest/v1/rpc/'+fn,{method:'POST',headers:{apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error('unavailable');return r.json();}
Deno.serve(async req=>{
 const origin=req.headers.get('origin')||'',headers={'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':allowed.has(origin)?origin:'null','Access-Control-Allow-Headers':'apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS',Vary:'Origin'};
 const reply=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers});
 if(!allowed.has(origin))return reply({error:'Origin not allowed'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});if(req.method!=='POST')return reply({error:'POST required'},405);
 try{
  if(!req.headers.get('content-type')?.startsWith('application/json'))return reply({error:'JSON required'},415);
  const reader=req.body?.getReader();if(!reader)return reply({error:'Missing request'},400);let raw='',size=0;const decoder=new TextDecoder();while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>2400){await reader.cancel();return reply({error:'Request too large'},413);}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();
  let fields;try{fields=validatePartnerHelp(JSON.parse(raw));}catch(error){return reply({error:error instanceof Error?error.message:'Check the request.'},400);}
  const address=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'shared';
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(service+new Date().toISOString().slice(0,10)+address));
  const client=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  if(await db('take_admin_login_slot',{p_key:'partner-help:'+client})!==true)return reply({error:'Too many requests. Please wait a few minutes.'},429);
  const reference=await db('create_partner_help_request',fields);if(!reference)return reply({error:'This application link is no longer available. Refresh the page.'},404);
  return reply({ok:true,reference});
 }catch{return reply({error:'Your request could not be saved. Please retry.'},503);}
});
