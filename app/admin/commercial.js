'use client';
import {useEffect,useState} from 'react';
import {categories} from '../../lib/partners.mjs';
import {freshPartner,partnerPresets as basePartnerPresets,applyPartnerPreset,savedPartnerPreset,findPartnerPreset,customPartnerDefaults,permissionReference,fillPermissionReference} from '../../lib/partner-presets.mjs';
import PartnerReports from './partner-reports';
import PartnerActivity from './partner-activity';
import {expiryChoices,expiryForHours,expiryToIso,partnerAvailability} from '../../lib/partner-expiry.mjs';
import {directoryProduct,directoryPath,productIsCurrent} from '../../lib/product-directory.mjs';
import '../partners.css';

export default function CommercialAdmin({request,owner}){
 const [rows,setRows]=useState([]),[form,setForm]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[filter,setFilter]=useState('all');
 const [preset,setPreset]=useState(''),[advanced,setAdvanced]=useState(false);
 const [expiryChoice,setExpiryChoice]=useState('never'),[clock,setClock]=useState(()=>new Date());
 const [products,setProducts]=useState([]);
 const catalog=Object.fromEntries(products.map(p=>[p.id,p]));
 const productPath=(id,language)=>catalog[id]?directoryPath(id,catalog[id].category,language):'/products/';
 const partnerPresets=Object.fromEntries(products.map(p=>[p.id,{id:p.id,name:p.name,category:p.category,product_key:p.id,partner:p.name,title_en:p.name,title_hi:p.name,description_en:p.details.variant.en.slice(0,500),description_hi:p.details.variant.hi.slice(0,500),terms_url:p.url,reviewed_on:p.reviewedOn}]));
 const availability=row=>row.product_key&&!productIsCurrent(catalog[row.product_key],clock)?{label:'Product paused / review due / unavailable'}:partnerAvailability(row,clock);
 const load=async()=>{const result=await request('partners-list');setRows(result.links);};
 useEffect(()=>{load().catch(()=>setError('Could not load partner links. Refresh this section.'));},[]);
 useEffect(()=>{request('products-list').then(data=>setProducts(data.products.map(directoryProduct))).catch(()=>setError('Could not load product mapping. Open Products & information to review it.'));},[]);
 useEffect(()=>{const timer=setInterval(()=>setClock(new Date()),15000);return()=>clearInterval(timer);},[]);
 const edit=item=>{setForm(fillPermissionReference({...item,expires_at:item.expires_at?new Date(item.expires_at).toISOString().slice(0,16):''}));setExpiryChoice(item.expires_at?'custom':'never');setPreset(item.product_key||findPartnerPreset(item.partner));setAdvanced(false);setError('');setNotice('');};
 const field=(key,value)=>setForm(current=>{
  const next={...current,[key]:value};
  if(['partner','terms_url','state'].includes(key)&&(!current.approval_note?.trim()||current.approval_note===permissionReference(current)))next.approval_note=permissionReference(next);
  return next;
 });
 const choosePreset=value=>{
  setPreset(value);setError('');setExpiryChoice('never');
  if(value.startsWith('saved:')){const saved=rows.find(row=>row.id===value.slice(6));if(saved)setForm(current=>savedPartnerPreset(current,saved));}
  else if(value)setForm(current=>{const {id,name,...fields}=partnerPresets[value];return fillPermissionReference({...freshPartner(),...(current?.id?{id:current.id,revision:current.revision}:{}),...fields});});
  else setForm(current=>({...freshPartner(),...(current?.id?{id:current.id,revision:current.revision}:{})}));
 };
 const completeName=()=>{
  if(form.id)return;const match=findPartnerPreset(form.partner);
  if(match&&!preset){
   const defaults=applyPartnerPreset(null,match);setPreset(match);
   setForm(current=>({...defaults,...Object.fromEntries(Object.entries(current).filter(([,v])=>v!=='')),category:defaults.category,product_key:defaults.product_key}));
  }else setForm(current=>fillPermissionReference(customPartnerDefaults(current)));
 };
 async function save(event){
  event.preventDefault();setError('');setNotice('');
  if(form.state==='active'&&(!form.promotion_approved||form.approval_note.trim().length<10)){setError('Publish karne ke liye website-promotion permission confirm karein aur uska source/note likhein. Ya abhi Save draft karein.');return;}
  setBusy(true);
  try{await request('save-partner',{...form,expires_at:expiryToIso(form.expires_at)});await load();setForm(null);setNotice('Saved. Drafts stay private. Approved, active, current links appear on the website.');}
  catch(error){setError(error.message);}finally{setBusy(false);}
 }
 return <>
  <section className="admin-section">
   <div className="admin-section-heading"><h2>Partners & commercial links</h2>{owner&&<button className="admin-primary" onClick={()=>edit({...freshPartner(),category:filter==='all'?'demat':filter})}>+ Add link</button>}</div>
   <p className="admin-help">Product चुनें → अपना referral / affiliate link paste करें → save करें। नाम, category, bilingual wording और available official source अपने आप भरेंगे। Details कभी भी edit कर सकते हैं।</p>
   <label>Filter category<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All products</option>{Object.entries(categories).map(([id,name])=><option value={id} key={id}>{name[0]}</option>)}</select></label>
   {rows.filter(row=>filter==='all'||row.category===filter).map(row=><article className="admin-link-summary" key={row.id}><div><strong>{row.title_en}</strong><small>{row.partner} · {categories[row.category]?.[0]} · {row.kind} · {availability(row).label} · revision {row.revision} · SIA product: {catalog[row.product_key]?.name||'general partner list'}</small><small>Reviewed {row.reviewed_on}{row.expires_at?' · ends '+new Date(row.expires_at).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})+' IST':' · no fixed expiry'}</small></div>{owner&&<div><button className="admin-secondary" onClick={()=>edit(row)}>Edit / pause / archive</button> <button className="admin-secondary" onClick={()=>edit({...row,id:undefined,revision:undefined,state:'draft',promotion_approved:false,approval_note:''})}>Duplicate draft</button></div>}</article>)}
   {!rows.length&&<p className="admin-help">No links added yet. A draft is private until you choose to publish.</p>}
  </section>
  {form&&owner&&<section className="admin-section partner-quick-editor">
   <h2>{form.id?'Edit partner link':'Add a partner link'}</h2>
   <form onSubmit={save} onInvalidCapture={()=>setAdvanced(true)}>
    <div className="admin-form-grid">
     <label>1. Product / partner चुनें<select value={preset} onChange={e=>choosePreset(e.target.value)}>
      <option value="">Other / custom product</option>
      {Object.entries(categories).map(([category,names])=><optgroup key={category} label={names[0]}>{Object.values(partnerPresets).filter(p=>p.category===category).map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</optgroup>)}
      {rows.length>0&&<optgroup label="Reuse your saved details">{rows.map(row=><option key={row.id} value={'saved:'+row.id}>{row.title_en} — {categories[row.category]?.[0]}</option>)}</optgroup>}
     </select><small>Product बदलने पर पुराना link और permission हटेंगे; नए product का link paste करें।</small></label>
     <label>2. आपका referral / affiliate HTTPS link<input required type="url" maxLength={2000} value={form.destination_url} onChange={e=>field('destination_url',e.target.value)} placeholder="App / partner से मिला अपना link paste करें"/></label>
     {!preset&&<><label>Partner / programme<input required maxLength={100} value={form.partner} onBlur={completeName} onChange={e=>field('partner',e.target.value)} placeholder="जैसे Angel One"/></label><label>Product category<select value={form.category} onChange={e=>setForm(current=>({...current,category:e.target.value,product_key:'',eligibility_tag:'not_assessed'}))}>{Object.entries(categories).map(([id,name])=><option key={id} value={id}>{name[0]}</option>)}</select></label></>}
    </div>
    <div className="admin-form-grid"><label>Link validity / लिंक कब तक चले<select value={expiryChoice} onChange={e=>{const value=e.target.value;setExpiryChoice(value);if(value!=='custom')field('expires_at',expiryForHours(value));}}>{Object.entries(expiryChoices).map(([id,label])=><option value={id} key={id}>{label}</option>)}</select><small>24/48/72 hours starts when you select it. If the provider issued this link earlier, use its actual earlier expiry.</small></label>{expiryChoice!=='never'&&<label>Exact expiry — UTC<input type="datetime-local" required value={form.expires_at||''} onChange={e=>{setExpiryChoice('custom');field('expires_at',e.target.value);}}/><small>{form.expires_at?'India time: '+new Date(form.expires_at+'Z').toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})+' IST':'Enter the provider’s expiry in UTC.'}</small></label>}</div><p className="admin-help">Expiry removes the link automatically; it does not extend the provider’s own validity. Never expire means no local time limit; current review and provider permission are still required. Click history stays available.</p>
    {preset&&<div className="partner-autofill-summary"><strong>{form.title_en}</strong><p>{categories[form.category]?.[0]} · {form.kind} · {form.product_key?'SIA + product library में exact product से जुड़ेगा':'General Partners list; इस product की reviewed SIA comparison entry अभी नहीं है।'}</p><p>Details auto-filled हैं। नीचे “Edit auto-filled details” खोलकर कुछ भी बदल सकते हैं।</p></div>}
    {!preset&&<label>Official product / programme terms HTTPS URL<input required type="url" maxLength={2000} value={form.terms_url} onChange={e=>field('terms_url',e.target.value)} placeholder="Unknown provider: इसका official terms link दें"/></label>}
    <details className="partner-editor-preview" open={advanced} onToggle={e=>setAdvanced(e.currentTarget.open)}>
     <summary>Edit auto-filled details / भरी हुई जानकारी बदलें</summary>
     <div className="admin-form-grid">
      <label>Partner / programme<input required maxLength={100} value={form.partner} onChange={e=>field('partner',e.target.value)}/></label>
      <label>Link type<select value={form.kind} onChange={e=>field('kind',e.target.value)}><option value="affiliate">Affiliate</option><option value="referral">Referral</option></select></label>
      <label>Product category<select value={form.category} onChange={e=>{setPreset('');setForm(current=>({...current,category:e.target.value,product_key:'',eligibility_tag:'not_assessed'}));}}>{Object.entries(categories).map(([id,name])=><option key={id} value={id}>{name[0]}</option>)}</select></label>
      <label>Exact product for SIA / सही उत्पाद<select value={form.product_key||''} onChange={e=>e.target.value?choosePreset(e.target.value):field('product_key','')}><option value="">Unmapped — general partner list only</option>{Object.values(catalog).filter(product=>product.category===form.category).map(product=><option key={product.id} value={product.id}>{product.name}</option>)}</select><small>{form.product_key?catalog[form.product_key]?.details.variant.en:'Only a reviewed exact product can attach to SIA comparisons.'}</small></label>
      {[['title_en','Title — English',120],['title_hi','शीर्षक — हिन्दी',120],['terms_url','Official product / programme terms HTTPS URL',2000]].map(([key,label,max])=><label key={key}>{label}<input required type={key.endsWith('url')?'url':'text'} maxLength={max} value={form[key]} onChange={e=>field(key,e.target.value)}/></label>)}
      {[['description_en','Description — English'],['description_hi','जानकारी — हिन्दी'],['disclosure_en','Commission / referral disclosure — English'],['disclosure_hi','कमीशन / रेफ़रल खुलासा — हिन्दी']].map(([key,label])=><label key={key}>{label}<textarea required={key.startsWith('disclosure')} minLength={key.startsWith('disclosure')?20:0} maxLength={600} value={form[key]} onChange={e=>field(key,e.target.value)}/></label>)}
      <label>Reviewed credit-card route tag<select value={form.eligibility_tag||'not_assessed'} onChange={e=>field('eligibility_tag',e.target.value)}><option value="not_assessed">Not assessed — general catalogue only</option><option value="fd_backed">FD-backed — verify current official terms</option><option value="income_based">Income-based — verify current official terms</option></select></label>
      <label>Attribution parameter (optional, only if partner permits)<input maxLength={40} value={form.tracking_param||''} onChange={e=>field('tracking_param',e.target.value)} placeholder="e.g. subid — leave blank unless supported"/></label>
      <label>Terms reviewed on — confirm before publishing<input required type="date" value={form.reviewed_on} max={new Date().toISOString().slice(0,10)} onChange={e=>field('reviewed_on',e.target.value)}/></label>
      <label>Display order (0 first)<input required type="number" min={0} max={9999} value={form.sort_order} onChange={e=>field('sort_order',Number(e.target.value))}/></label>
     </div>
     <p className="admin-help">Template में referral reward, approval या expiry का अनुमान नहीं लगाया जाता। Official source से आपके programme के special terms अलग हों तो उन्हें बदलें। Adding a link never changes comparison ranking.</p>
    </details>
    <label className="partner-state">3. Save / publish<select value={form.state} onChange={e=>field('state',e.target.value)}><option value="draft">Draft — save privately for now</option><option value="active">Active — publish after permission check</option><option value="paused">Paused — remove from public list</option><option value="archived">Archived — remove, keep history</option></select></label>
    {form.state==='active'&&<div className="partner-publish-check">
     <p className="admin-help">एक बार आपकी website पर promotion की permission और terms confirm करें। Personal app referral अपने आप website permission नहीं है।</p>
     <label>Permission source / review note — auto-filled, editable<textarea required minLength={10} maxLength={1200} value={form.approval_note} onChange={e=>field('approval_note',e.target.value)}/></label>
     <p className="admin-help">Official reference अपने आप भरा है। आपके programme की अलग approval या शर्तें हों तो edit करें; नीचे permission की पुष्टि आप करें।</p>
     <label className="admin-check"><input type="checkbox" required checked={form.promotion_approved} onChange={e=>field('promotion_approved',e.target.checked)}/><span>I checked that this programme permits promotion on this website and that the wording, review date and offer terms are current.</span></label>
    </div>}
    <details className="partner-editor-preview"><summary>Preview public wording</summary><strong>{form.title_en} / {form.title_hi}</strong><p>{form.description_en}</p><p>{form.description_hi}</p><p>{form.disclosure_en}</p><p>{form.disclosure_hi}</p><p>{form.destination_url}</p>{form.product_key&&<p>Product page: <a href={productPath(form.product_key,'en')} target="_blank" rel="noopener noreferrer">{catalog[form.product_key]?.name} ↗</a></p>}</details>
    <p className="admin-help">Logged-in owner session से save होगा; password दोबारा नहीं चाहिए। Session खत्म होने पर sign in करें।</p>
    <button className="admin-primary" disabled={busy}>{busy?'Saving…':form.state==='draft'?'Save draft':form.state==='active'?'Save & publish':'Save link'}</button> <button type="button" className="admin-secondary" disabled={busy} onClick={()=>setForm(null)}>Cancel</button>
   </form>
  </section>}
  {error&&<p className="admin-alert" role="alert">{error}</p>}{notice&&<p className="admin-notice" role="status">{notice}</p>}
  <PartnerActivity request={request} owner={owner}/>
  <details className="admin-section"><summary>Optional manual earnings / provider-app notes</summary><p className="admin-help">Aap apne provider app mein results dekh sakte hain. Neeche entry/import sirf tab karein jab website mein bhi apna manual hisaab rakhna ho; koi provider API required nahi hai.</p><PartnerReports request={request} owner={owner}/></details>
 </>;
}
