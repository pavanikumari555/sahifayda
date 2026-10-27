const base=Deno.env.get('SUPABASE_URL')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const allowed=new Set(['http://127.0.0.1:3100','http://127.0.0.1:3102','http://localhost:3100','http://localhost:3102']);
const production=Deno.env.get('ADMIN_APP_ORIGIN');if(production?.startsWith('https://'))allowed.add(new URL(production).origin);
const uuid=(v:unknown)=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
async function db(path:string,body?:unknown){const r=await fetch(base+'/rest/v1/'+path,{method:body===undefined?'GET':'POST',headers:{apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error('Unavailable');return r.json();}
Deno.serve(async req=>{
 const origin=req.headers.get('origin')||'',headers={'Content-Type':'application/json','Cache-Control':'no-store','Referrer-Policy':'no-referrer','Access-Control-Allow-Origin':allowed.has(origin)?origin:'null','Access-Control-Allow-Headers':'apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS',Vary:'Origin'};
 const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
 if(!allowed.has(origin))return reply({error:'Origin not allowed'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return reply({error:'POST required'},405);
 try{
  if(!req.headers.get('content-type')?.startsWith('application/json'))return reply({error:'JSON required'},415);
  const reader=req.body?.getReader();if(!reader)return reply({error:'Missing request'},400);
  let raw='',size=0;const decoder=new TextDecoder();while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>300){await reader.cancel();return reply({error:'Request too large'},413);}raw+=decoder.decode(value,{stream:true});}
  let body;try{body=JSON.parse(raw);}catch{return reply({error:'Invalid request'},400);}
  if(!body||Array.isArray(body)||!uuid(body.id)||!uuid(body.event_id)||Object.keys(body).some(key=>!['id','event_id'].includes(key)))return reply({error:'Invalid link request'},400);
  const address=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'shared';
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(service+new Date().toISOString().slice(0,10)+address));
  const client=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  if(await db('rpc/take_admin_login_slot',{p_key:'partner-click:'+client})!==true)return reply({error:'Too many link requests. Please wait a few minutes.'},429);
  const row=(await db('partner_links?id=eq.'+body.id+'&select=id,destination_url,tracking_param'))[0];
  if(!row||await db('rpc/record_partner_click',{p_link:body.id,p_event:body.event_id})!==true)return reply({error:'This link is no longer available.'},404);
  const target=new URL(row.destination_url);
  if(target.protocol!=='https:'||target.username||target.password)return reply({error:'Invalid destination'},503);
  if(row.tracking_param)target.searchParams.set(row.tracking_param,body.event_id);
  return reply({destination:target.href,original:row.destination_url});
 }catch{return reply({error:'The link could not be checked. Please try again.'},503);}
});
