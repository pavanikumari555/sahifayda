import {observationUpdate} from '../_shared/finance-sync.mjs';
import {financeSources,extractFinanceRecord} from '../_shared/finance-sources.mjs';
import {robotsAllows,sourceText,readBoundedSourceBody} from '../_shared/source-rules.mjs';
const base=Deno.env.get('SUPABASE_URL')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const origins=new Set(financeSources.map(s=>new URL(s.url).origin));
async function db(path:string,method='GET',body?:unknown){
 const r=await fetch(base+'/rest/v1/'+path,{method,headers:{apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json',Prefer:'return=representation,resolution=merge-duplicates'},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(10000)});
 if(!r.ok)throw Error('Finance data unavailable');return r.json();
}
async function read(url:string,limit:number){
 let address=new URL(url);
 for(let hop=0;hop<4;hop++){
  if(address.protocol!=='https:'||!origins.has(address.origin)||address.username||address.password||address.port)throw Error('Unapproved official source');
  const r=await fetch(address,{redirect:'manual',headers:{'User-Agent':'SahiFaydaSourceMonitor/1.0'},signal:AbortSignal.timeout(10000)});
  if([301,302,303,307,308].includes(r.status)){const next=r.headers.get('location');await r.body?.cancel();if(!next)throw Error('Missing redirect');address=new URL(next,address);continue;}
  if(r.status!==200){await r.body?.cancel();return {status:r.status,text:''};}
  return {status:r.status,text:await readBoundedSourceBody(r,limit)};
 }
 throw Error('Too many redirects');
}
async function run(){
 const previous=await db('finance_knowledge?select=*'),old=new Map(previous.map((r:any)=>[r.id,r]));
 const robots=new Map<string,Promise<{status:number,text:string}>>();
 const work=[...financeSources],results:any[]=[];
 await Promise.all(Array.from({length:3},async()=>{
  while(work.length){
   const source=work.shift()!,prior:any=old.get(source.id),attempted=new Date().toISOString();
   try{
    const u=new URL(source.url);if(!robots.has(u.origin))robots.set(u.origin,read(u.origin+'/robots.txt',128000));
    const permission=await robots.get(u.origin)!;
    if(permission.status!==404&&(permission.status!==200||!robotsAllows(permission.text,u.pathname+u.search)))throw Error('Robots permission unavailable or disallowed');
    const page=await read(source.url,3000000);if(page.status!==200)throw Error('Official source HTTP '+page.status);
    const text=sourceText(page.text),parsed=extractFinanceRecord(source,text);
    const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))).map(b=>b.toString(16).padStart(2,'0')).join('');
    const update=observationUpdate(source,prior,parsed,digest,attempted);
    await db('finance_knowledge?on_conflict=id','POST',update);
    results.push({id:source.id,status:update.status,revision:update.revision});
   }catch(error){
    const message=error instanceof Error?error.message.slice(0,180):'Check unavailable';
    if(prior)await db('finance_knowledge?id=eq.'+source.id,'PATCH',{status:'review_due',last_attempt_at:attempted,issue:message});
    else await db('finance_knowledge','POST',{id:source.id,category:source.category,title:source.name,source_url:source.url,status:'review_due',last_attempt_at:attempted,issue:message});
    results.push({id:source.id,status:'review_due'});
   }
  }
 }));
 await db('admin_activity','POST',{actor_username:'system',action:'finance.official_refresh',target:'finance_knowledge',details:{verified:results.filter(r=>r.status==='verified').length,review_due:results.filter(r=>r.status==='review_due').length}});
 return results;
}
Deno.serve(async req=>{
 const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
 if(req.method==='GET'){
  try{
   const rows=await db('finance_knowledge?select=id,status,last_attempt_at&limit=100');
   const expected=financeSources.map(s=>rows.find((r:any)=>r.id===s.id));
   const fresh=expected.every((r:any)=>r&&Date.now()-Date.parse(r.last_attempt_at)>=0&&Date.now()-Date.parse(r.last_attempt_at)<48*3600000);
   return reply({ok:fresh,coverage:financeSources.length,observed:expected.filter(Boolean).length,review_due:expected.filter((r:any)=>r?.status==='review_due').length,meaning:'Fresh attempts are not proof of verified offers.'},fresh?200:503);
  }catch{return reply({ok:false,error:'Refresh status unavailable'},503);}
 }
 if(req.method!=='POST')return reply({error:'POST required'},405);
 try{
  const token=req.headers.get('x-job-token')||'',bearer=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
  if(bearer!==service&&(!/^[a-f0-9]{64}$/.test(token)||await db('rpc/verify_source_job_token','POST',{p_token:token})!==true))return reply({error:'Not authorised'},401);
  const settings=(await db('source_watch_settings?id=eq.true&select=enabled'))[0];
  if(!settings?.enabled)return reply({ok:true,reason:'paused'});
  if(await db('rpc/take_admin_login_slot','POST',{p_key:'system-finance-refresh'})!==true)return reply({error:'Try later'},429);
  return reply({ok:true,results:await run()});
 }catch{return reply({error:'Finance refresh needs review'},503);}
});
