import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {stripTypeScriptTypes} from 'node:module';
import {providerReply,configured} from '../supabase/functions/_shared/sia.mjs';
import {catalog} from '../supabase/functions/_shared/reviewed-products.mjs';
const source=stripTypeScriptTypes((await readFile(new URL('../supabase/functions/admin-console/index.ts',import.meta.url),'utf8')).replace(/^import .*?;\r?\n/gm,''),{mode:'transform'});
function app(fetcher){let handler;const env={SUPABASE_URL:'https://previewcheck.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'test-service-key',SUPABASE_ANON_KEY:'test-anon-key'};runInNewContext(source,{providerReply,configured,catalog,Deno:{env:{get:key=>env[key]},serve:fn=>handler=fn},URL,Response,Request,AbortSignal,Set,Date,JSON,Uint8Array,TextDecoder,fetch:fetcher});return async(body,token,origin='http://127.0.0.1:3102')=>{const response=await handler(new Request('https://previewcheck.supabase.co/functions/v1/admin-console',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)}));return {status:response.status,data:await response.json()};};}
const json=(data,status=200)=>new Response(JSON.stringify(data),{status});
const partner={partner:'Reviewed partner',kind:'affiliate',category:'credit_card',title_en:'Example card information',title_hi:'उदाहरण कार्ड की जानकारी',description_en:'Read fees and eligibility.',description_hi:'शुल्क और पात्रता पढ़ें।',destination_url:'https://partner.com/product?ref=public-code',terms_url:'https://partner.com/terms',disclosure_en:'We may receive a commission through this commercial link.',disclosure_hi:'इस व्यावसायिक लिंक से हमें कमीशन मिल सकता है।',promotion_approved:false,approval_note:'',reviewed_on:new Date().toISOString().slice(0,10),expires_at:null,sort_order:100,state:'draft',current_password:'test-current-password'};
function ownerApp(fetcher){return app(async(url,options)=>{
 if(url.endsWith('/auth/v1/user'))return json({id:'owner-user',email:'owner@example.invalid'});
 if(url.includes('/rpc/admin_context'))return json([{id:'account-id',user_id:'owner-user',username:'owner',role:'owner'}]);
 return fetcher(url,options);
});}
test('commercial links require owner access, even when the manager has a valid session',async()=>{
 const call=app(async url=>url.endsWith('/auth/v1/user')?json({id:'manager'}):json([{id:'id',user_id:'manager',role:'manager'}]));
 assert.equal((await call({action:'save-partner',...partner},'manager-token')).status,403);
});

test('partner saves use the verified owner session without asking for or verifying a password again',async()=>{
 const calls=[];
 const call=ownerApp(async(url,options)=>{calls.push(url);if(url.includes('/partner_links'))return json([{...JSON.parse(options.body),id:'11111111-1111-1111-1111-111111111111'}]);throw Error('Unexpected call, including password authentication');});
 const {current_password,...fields}=partner;
 assert.equal((await call({action:'save-partner',...fields},'owner-token')).status,200);
 assert.equal(calls.some(url=>url.includes('/auth/v1/token')||url.includes('/take_admin_login_slot')),false);
 const signedOut=app(()=>{throw Error('Signed-out request must stop before upstream work');});
 assert.equal((await signedOut({action:'save-partner',...fields})).status,401);
 const expired=app(async url=>url.endsWith('/auth/v1/user')?json({error:'expired'},401):json([]));
 assert.equal((await expired({action:'save-partner',...fields},'expired-token')).status,401);
 const disabled=app(async url=>url.endsWith('/auth/v1/user')?json({id:'owner-user'}):json([]));
 assert.equal((await disabled({action:'save-partner',...fields},'disabled-owner-token')).status,403);
});
test('unapproved, expired and stale financial offers cannot be activated',async()=>{
 const call=ownerApp(()=>{throw Error('Invalid offers must not be written');});
 for(const item of [{...partner,state:'active'},{...partner,state:'active',promotion_approved:true,approval_note:'Verified website approval',expires_at:'2020-01-01T00:00:00Z'},{...partner,state:'active',promotion_approved:true,approval_note:'Verified website approval',reviewed_on:'2020-01-01'}])assert.equal((await call({action:'save-partner',...item},'owner-token')).status,400);
});
test('commercial URLs reject credentials, private addresses, shorteners and unsafe schemes',async()=>{
 const call=ownerApp(()=>{throw Error('Unsafe destinations must not be written');});
 for(const destination_url of ['javascript:alert(1)','https://user:secret@partner.com','https://127.0.0.1/path','https://[::1]/','https://partner.local/','https://bit.ly/example','https://partner.com/?api_key=secret'])assert.equal((await call({action:'save-partner',...partner,destination_url},'owner-token')).status,400);
});
test('stale partner revisions cannot overwrite a later edit',async()=>{
 let changes=0;
 const call=ownerApp(async(url,options)=>{
  if(url.includes('/take_admin_login_slot'))return json(true);
  if(url.includes('/auth/v1/token'))return json({user:{id:'owner-user'},access_token:'temporary-auth'});
  if(url.includes('/auth/v1/logout'))return json({});
  if(url.includes('/partner_links?')){changes++;assert.match(url,/revision=eq.2/);assert.equal(JSON.parse(options.body).updated_by,'owner-user');return json([]);}
  throw Error('Unexpected call');
 });
 const result=await call({action:'save-partner',...partner,id:'11111111-1111-1111-1111-111111111111',revision:2},'owner-token');
 assert.equal(result.status,409);assert.equal(changes,1);
});
test('owners can bind a referral to an exact product, while wrong-category and unknown mappings are rejected',async()=>{
 let saved;
 const call=ownerApp(async(url,options)=>{if(url.includes('/take_admin_login_slot'))return json(true);if(url.includes('/auth/v1/token'))return json({user:{id:'owner-user'},access_token:'temporary-auth'});if(url.includes('/auth/v1/logout'))return json({});if(url.includes('/partner_links')){saved=JSON.parse(options.body);return json([{...saved,id:'11111111-1111-1111-1111-111111111111'}]);}throw Error('Unexpected call');});
 assert.equal((await call({action:'save-partner',...partner,category:'demat',product_key:'flattrade'},'owner-token')).status,200);assert.equal(saved.product_key,'flattrade');
 for(const product_key of ['__proto__','missing-product','kotak'])assert.equal((await call({action:'save-partner',...partner,category:'demat',product_key},'owner-token')).status,400);
});

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
