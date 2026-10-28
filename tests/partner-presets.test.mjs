import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {stripTypeScriptTypes} from 'node:module';
import {catalog} from '../supabase/functions/_shared/reviewed-products.mjs';
import {safePartnerUrl} from '../lib/partners.mjs';
import {freshPartner,partnerPresets,applyPartnerPreset,savedPartnerPreset,findPartnerPreset,customPartnerDefaults} from '../lib/partner-presets.mjs';

const now=new Date('2026-10-28T12:00:00Z');
const source=stripTypeScriptTypes((await readFile(new URL('../supabase/functions/admin-console/index.ts',import.meta.url),'utf8')).replace(/^import .*?;\r?\n/gm,''),{mode:'transform'});
const context={catalog,Deno:{env:{get:()=>''},serve:()=>{}},URL,Set,Date,JSON,AbortSignal,Uint8Array,TextDecoder};
runInNewContext(source,context);

test('every built-in shortcut produces a server-valid draft with only a destination added',()=>{
 for(const preset of Object.values(partnerPresets)){
  const form=applyPartnerPreset(null,preset.id,now);
  const validated=context.partnerFields({...form,destination_url:'https://partner.com/ref/synthetic',expires_at:null});
  assert.equal(validated.state,'draft');assert.equal(validated.promotion_approved,false);
  assert.ok(safePartnerUrl(form.terms_url));assert.ok(form.description_en&&form.description_hi);
  if(form.product_key)assert.equal(catalog[form.product_key].category,form.category);
  assert.throws(()=>context.partnerFields({...form,destination_url:'https://partner.com/ref/synthetic',expires_at:null,state:'active'}),/approval/);
 }
 assert.equal(findPartnerPreset('Angle one'),'angelone');
 assert.equal(applyPartnerPreset(null,'angelone',now).product_key,'');
});

test('changing products clears old destination, permission, offer and attribution while keeping edit revision',()=>{
 const old={...freshPartner(now),id:'existing-row',revision:7,destination_url:'https://partner.com/old',promotion_approved:true,approval_note:'old permission',expires_at:'2026-11-01',tracking_param:'oldtag',state:'active',eligibility_tag:'fd_backed'};
 const next=applyPartnerPreset(old,'flattrade',now);
 assert.equal(next.id,old.id);assert.equal(next.revision,7);
 for(const key of ['destination_url','approval_note','expires_at','tracking_param'])assert.equal(next[key],'');
 assert.equal(next.promotion_approved,false);assert.equal(next.state,'draft');assert.equal(next.eligibility_tag,'not_assessed');
 assert.equal(next.product_key,'flattrade');assert.equal(next.category,'demat');
});

test('saved custom templates work across all categories without copying private approval or destination',()=>{
 for(const category of ['credit_card','savings_account','loan','demat','insurance','other']){
  const saved=customPartnerDefaults({...freshPartner(now),category,partner:'Owner custom product',terms_url:'https://partner.com/terms',title_hi:'मेरी बदली हुई जानकारी',destination_url:'https://partner.com/old',promotion_approved:true,approval_note:'prior permission',expires_at:'2027-01-01',current_password:'must-not-copy',state:'active'});
  const next=savedPartnerPreset(null,saved,now);
  assert.equal(next.category,category);assert.equal(next.title_hi,'मेरी बदली हुई जानकारी');assert.ok(next.title_en);
  assert.equal(next.destination_url,'');assert.equal(next.promotion_approved,false);assert.equal(next.approval_note,'');assert.equal(next.expires_at,'');assert.equal(next.current_password,undefined);
  context.partnerFields({...next,destination_url:'https://partner.com/new',expires_at:null});
 }
});
