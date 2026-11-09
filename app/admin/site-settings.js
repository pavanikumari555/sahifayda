'use client';
import {useEffect,useState} from 'react';
import {ArrowRight,RefreshCw} from 'lucide-react';
import {siteSettingsDefaults,homeSections,homeTools} from '../../lib/site-settings.mjs';

const sectionNames={services:'Service shortcuts (8 services)',tools:'Free calculators',updates:'Checked rates & sources (SIA daily check)',steps:'How it works',guides:'Simple guides',partners:'Application options (partner links)',promise:'Our promise',faq:'Common questions'};
const toolNames={home_loan:'Home loan or rent',emergency_fund:'Emergency fund',debt_trap:'Credit card bill',card_offers:'Card offers on shopping',student_cards:'First credit card',car_vs_uber:'Car or cab'};

// Owner-only homepage controls. Saved settings apply on the next visitor page load.
export default function SiteSettings({request,owner}){
 const [form,setForm]=useState(null),[revision,setRevision]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 async function load(){setError('');const data=await request('site-settings');setForm(data.settings||siteSettingsDefaults());setRevision(data.revision);}
 useEffect(()=>{load().catch(e=>setError(e.message));},[]);// eslint-disable-line react-hooks/exhaustive-deps
 if(!form)return <section className="admin-section"><h2>Homepage & design</h2>{error?<p className="admin-alert" role="alert">{error} If this is the first time, run supabase/changes/site_settings.sql and deploy admin-console.</p>:<p className="admin-help">Loading…</p>}</section>;
 const set=(group,key,value)=>setForm({...form,[group]:{...form[group],[key]:value}});
 const setExample=(language,index,key,value)=>{const list=[...form.examples[language]];list[index]={...list[index],[key]:value};setForm({...form,examples:{...form.examples,[language]:list}});};
 async function save(event){
  event.preventDefault();setBusy(true);setError('');setNotice('');
  try{const result=await request('save-site-settings',{settings:form,revision});setRevision(result.revision);setNotice(result.message);}
  catch(e){setError(e.message);}finally{setBusy(false);}
 }
 return <form onSubmit={save}>
  <section className="admin-section">
   <span className="admin-eyebrow">HOMEPAGE & DESIGN</span>
   <h2>What visitors see first</h2>
   <p className="admin-help">Empty text fields use the built-in reviewed wording. Changes apply on the next page load without a rebuild. Financial facts, rates and partner links are edited in Products and Partners, not here.</p>
   <h3 className="admin-sub">Announcement bar</h3>
   <label className="admin-check"><input type="checkbox" checked={form.announcement.enabled} disabled={!owner} onChange={e=>set('announcement','enabled',e.target.checked)}/>Show the announcement bar at the top of the homepage</label>
   <div className="admin-form-grid">
    <label>Announcement — English<input maxLength={200} value={form.announcement.en} disabled={!owner} onChange={e=>set('announcement','en',e.target.value)}/></label>
    <label>Announcement — हिन्दी<input maxLength={200} value={form.announcement.hi} disabled={!owner} onChange={e=>set('announcement','hi',e.target.value)}/></label>
    <label>Optional link (website path)<input maxLength={160} placeholder="/products/ or /#tools" value={form.announcement.url} disabled={!owner} onChange={e=>set('announcement','url',e.target.value)}/></label>
   </div>
   <h3 className="admin-sub">Headline</h3>
   <div className="admin-form-grid">
    <label>Headline — English<input maxLength={120} placeholder="Money decisions, made simple." value={form.hero.title_en} disabled={!owner} onChange={e=>set('hero','title_en',e.target.value)}/></label>
    <label>Headline — हिन्दी<input maxLength={120} placeholder="पैसों के फ़ैसले, अब आसान।" value={form.hero.title_hi} disabled={!owner} onChange={e=>set('hero','title_hi',e.target.value)}/></label>
    <label>Sub-heading — English<textarea maxLength={300} value={form.hero.subtitle_en} disabled={!owner} onChange={e=>set('hero','subtitle_en',e.target.value)}/></label>
    <label>Sub-heading — हिन्दी<textarea maxLength={300} value={form.hero.subtitle_hi} disabled={!owner} onChange={e=>set('hero','subtitle_hi',e.target.value)}/></label>
   </div>
  </section>
  <section className="admin-section">
   <h2>Example questions under the SIA chat box</h2>
   <p className="admin-help">Up to 6 per language. A visitor tap sends the question to SIA. Leave empty to use the built-in examples. Keep to topics SIA covers (accounts, cards, loans, demat, insurance, shopping).</p>
   {['en','hi'].map(language=><div key={language}>
    <h3 className="admin-sub">{language==='en'?'English':'हिन्दी'}</h3>
    {form.examples[language].map((item,index)=><div className="admin-form-grid" key={index}>
     <label>Chip label<input maxLength={40} required value={item.label} disabled={!owner} onChange={e=>setExample(language,index,'label',e.target.value)}/></label>
     <label>Question sent to SIA<input maxLength={300} required value={item.question} disabled={!owner} onChange={e=>setExample(language,index,'question',e.target.value)}/></label>
     {owner&&<div className="admin-form-end"><button type="button" className="admin-secondary" onClick={()=>setForm({...form,examples:{...form.examples,[language]:form.examples[language].filter((_,i)=>i!==index)}})}>Remove</button></div>}
    </div>)}
    {owner&&form.examples[language].length<6&&<button type="button" className="admin-secondary" onClick={()=>setForm({...form,examples:{...form.examples,[language]:[...form.examples[language],{label:'',question:''}]}})}>+ Add example</button>}
   </div>)}
  </section>
  <section className="admin-section">
   <h2>Homepage sections</h2>
   <p className="admin-help">The SIA chat box at the top, the header and the footer always stay visible.</p>
   <div className="admin-switch-grid">{homeSections.map(key=><label className="admin-check" key={key}><input type="checkbox" checked={form.sections[key]} disabled={!owner} onChange={e=>set('sections',key,e.target.checked)}/>{sectionNames[key]}</label>)}</div>
   <h2 style={{marginTop:24}}>Calculators shown on the homepage</h2>
   <p className="admin-help">Hidden calculators leave the homepage grid only; their dedicated pages keep working.</p>
   <div className="admin-switch-grid">{homeTools.map(key=><label className="admin-check" key={key}><input type="checkbox" checked={form.tools[key]} disabled={!owner} onChange={e=>set('tools',key,e.target.checked)}/>{toolNames[key]}</label>)}</div>
  </section>
  {error&&<p className="admin-alert" role="alert">{error}</p>}
  {notice&&<p className="admin-notice" role="status">{notice}</p>}
  {owner?<div className="admin-actions-row"><button className="admin-primary" disabled={busy}>{busy?'Saving…':'Save homepage settings'}<ArrowRight size={16}/></button><button type="button" className="admin-secondary" disabled={busy} onClick={()=>load().catch(e=>setError(e.message))}><RefreshCw size={15}/>Reload</button><a className="admin-secondary" href="/" target="_blank" rel="noreferrer">Preview homepage</a></div>:<p className="admin-help">Only an owner can change homepage settings.</p>}
 </form>;
}
