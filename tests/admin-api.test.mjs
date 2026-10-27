import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {stripTypeScriptTypes} from 'node:module';
const source=stripTypeScriptTypes(await readFile(new URL('../supabase/functions/admin-console/index.ts',import.meta.url),'utf8'),{mode:'transform'});
function app(fetcher){let handler;const env={SUPABASE_URL:'https://previewcheck.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'test-service-key',SUPABASE_ANON_KEY:'test-anon-key'};runInNewContext(source,{Deno:{env:{get:key=>env[key]},serve:fn=>handler=fn},URL,Response,Request,AbortSignal,Set,Date,JSON,Uint8Array,TextDecoder,fetch:fetcher});return async(body,token,origin='http://127.0.0.1:3102')=>{const response=await handler(new Request('https://previewcheck.supabase.co/functions/v1/admin-console',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)}));return {status:response.status,data:await response.json()};};}
const json=(data,status=200)=>new Response(JSON.stringify(data),{status});

test('recovery response never reveals membership, email or provider failure',async()=>{
 let expected;
 for(const mode of ['enabled','disabled','unknown','delivery-failed']){
  let deliveries=0;
  const call=app(async(url,options)=>{
   if(url.includes('/admin_accounts'))return json(mode==='unknown'?[]:[{id:'account-id',user_id:'auth-user',username:'singhal',enabled:mode!=='disabled'}]);
   if(url.includes('/take_admin_login_slot'))return json(true);
   if(url.includes('/auth/v1/admin/users/'))return json({email:'current-private@example.invalid'});
   if(url.includes('/auth/v1/recover?')){
    deliveries++;
    assert.equal(new URL(url).searchParams.get('redirect_to'),'http://127.0.0.1:3102/admin/recover/');
    assert.equal(JSON.parse(options.body).email,'current-private@example.invalid');
    assert.equal(options.headers.apikey,'test-anon-key');
    return json(mode==='delivery-failed'?{message:'private-provider-failure'}:{},mode==='delivery-failed'?422:200);
   }
   if(url.includes('/admin_activity'))return json([]);
   throw Error('Unexpected upstream call');
  });
  const result=await call({action:'request-recovery',username:'singhal'});
  assert.equal(result.status,200);
  expected??=result.data;
  assert.deepEqual(result.data,expected);
  assert.doesNotMatch(JSON.stringify(result.data),/current-private|private-provider|auth-user|access_token/);
  assert.equal(deliveries,mode==='enabled'||mode==='delivery-failed'?1:0);
 }
});

test('recovery respects server rate limiting before sending mail',async()=>{
 const call=app(async url=>{
  if(url.includes('/admin_accounts'))return json([{id:'account-id',user_id:'auth-user',enabled:true}]);
  if(url.includes('/take_admin_login_slot'))return json(false);
  throw Error('No email should be sent');
 });
 assert.equal((await call({action:'request-recovery',username:'singhal'})).status,429);
});
test('admin operations reject untrusted origins without touching Auth or the database',async()=>{
 const call=app(()=>{throw Error('Must not call upstream');});
 assert.equal((await call({action:'dashboard'},undefined,'https://attacker.example')).status,403);
});
test('missing or invalid credentials never expose an admin dashboard',async()=>{
 const call=app(async()=>json({error:'invalid token'},401));
 assert.equal((await call({action:'dashboard'})).status,401);
 assert.equal((await call({action:'dashboard'},'bad-token')).status,401);
});
test('a valid Auth user without active admin membership is denied',async()=>{
 const call=app(async url=>url.includes('/auth/v1/user')?json({id:'ordinary-user'}):json([]));
 assert.equal((await call({action:'dashboard'},'valid-auth-token')).status,403);
});
test('managers cannot create accounts even with a valid admin session',async()=>{
 const call=app(async url=>{
  if(url.includes('/auth/v1/user'))return json({id:'manager-user',email:'manager@example.invalid'});
  if(url.includes('/rpc/admin_context'))return json([{id:'manager-id',user_id:'manager-user',username:'manager',role:'manager',must_change_password:false}]);
  throw Error('Privileged provisioning must not be called');
 });
 assert.equal((await call({action:'create-user',username:'another'},'manager-token')).status,403);
});
test('temporary-password accounts cannot manage tools',async()=>{
 const call=app(async url=>url.includes('/auth/v1/user')?json({id:'new-manager'}):json([{id:'id',user_id:'new-manager',username:'newmanager',role:'manager',must_change_password:true}]));
 assert.equal((await call({action:'update-service',id:'monthly',state:'paused'},'valid-token')).status,403);
});
test('live SIA cannot be activated before its provider/execution setup',async()=>{
 const call=app(async url=>url.includes('/auth/v1/user')?json({id:'owner'}):json([{id:'id',user_id:'owner',username:'owner',role:'owner',must_change_password:false}]));
 assert.equal((await call({action:'update-service',id:'sia',state:'active'},'owner-token')).status,409);
});
test('wrong-password login returns a generic error with no email, tokens or provider details',async()=>{
 const call=app(async url=>{
  if(url.includes('/admin_accounts'))return json([{id:'id',username:'singhal',user_id:null,recovery_email:'private@example.invalid',enabled:true}]);
  if(url.includes('/take_admin_login_slot'))return json(true);
  return json({message:'provider secret error'},400);
 });
 const response=await call({action:'login',username:'singhal',password:'not-the-password'});
 assert.equal(response.status,401);
 assert.doesNotMatch(JSON.stringify(response.data),/private@|provider secret|access_token|service.key/);
});
