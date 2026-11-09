import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateSiteSettings,siteSettingsDefaults,homeSections,homeTools} from '../supabase/functions/_shared/site-settings.mjs';
import {readSiteSettings} from '../lib/site-settings.mjs';

test('defaults show every section and calculator with no announcement',()=>{
 const d=siteSettingsDefaults();
 assert.equal(d.announcement.enabled,false);
 assert.ok(homeSections.every(k=>d.sections[k]===true));
 assert.ok(homeTools.every(k=>d.tools[k]===true));
});
test('valid owner settings are cleaned and kept',()=>{
 const v=validateSiteSettings({announcement:{enabled:true,en:' New guide ',hi:'नई गाइड',url:'/guides/'},sections:{faq:false},tools:{car_vs_uber:false},examples:{en:[{label:'Zero balance',question:'zero balance account'}],hi:[]}});
 assert.equal(v.announcement.en,'New guide');
 assert.equal(v.sections.faq,false);assert.equal(v.sections.tools,true);
 assert.equal(v.tools.car_vs_uber,false);assert.equal(v.tools.home_loan,true);
 assert.equal(v.examples.en.length,1);
});
test('unsafe or incomplete settings are rejected',()=>{
 assert.throws(()=>validateSiteSettings({announcement:{enabled:true,en:'x',hi:'',url:''}}),/English and Hindi/);
 for(const url of ['https://evil.example','javascript:alert(1)','//evil.com'])assert.throws(()=>validateSiteSettings({announcement:{url}}),/website path/);
 assert.throws(()=>validateSiteSettings({examples:{en:Array.from({length:7},()=>({label:'a',question:'abc'}))}}),/up to 6/);
 assert.throws(()=>validateSiteSettings({sections:{faq:'no'}}),/on or off/);
 assert.throws(()=>validateSiteSettings({hero:{title_en:'x'.repeat(121)}}),/120/);
 assert.throws(()=>validateSiteSettings([]),/object/);
});
test('the homepage falls back to defaults when settings cannot be read',async()=>{
 const oldUrl=process.env.NEXT_PUBLIC_SUPABASE_URL,oldKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 process.env.NEXT_PUBLIC_SUPABASE_URL='https://previewcheck.supabase.co';process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='sb_publishable_test';
 try{
  assert.deepEqual(await readSiteSettings(async()=>({ok:false})),siteSettingsDefaults());
  assert.deepEqual(await readSiteSettings(async()=>{throw Error('offline');}),siteSettingsDefaults());
  assert.deepEqual(await readSiteSettings(async()=>({ok:true,json:async()=>[{content:{announcement:{url:'https://evil.example'}}}]})),siteSettingsDefaults());
  const live=await readSiteSettings(async()=>({ok:true,json:async()=>[{content:{sections:{partners:false}}}]}));
  assert.equal(live.sections.partners,false);
 }finally{
  if(oldUrl===undefined)delete process.env.NEXT_PUBLIC_SUPABASE_URL;else process.env.NEXT_PUBLIC_SUPABASE_URL=oldUrl;
  if(oldKey===undefined)delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=oldKey;
 }
});
