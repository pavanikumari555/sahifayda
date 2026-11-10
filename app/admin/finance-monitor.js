'use client';
import {useEffect,useState} from 'react';
export default function FinanceMonitor({request,owner}) {
 const [rows,setRows]=useState([]),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notes,setNotes]=useState({});
 const load=()=>request('finance-status').then(data=>setRows(data.rows));
 useEffect(()=>{load().catch(e=>setError(e.message));},[]);
 async function run(action,fields={}){setBusy(true);setError('');try{await request(action,fields);await load();}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <section className="admin-section"><h2>Finance data & review queue</h2>
  <p className="admin-help">Daily at 10:10 AM IST. Three supported loan parsers update complete extracted fields automatically. Card/other page changes require review; repeated unchanged checks never approve a pending change. A successful fetch alone does not verify a product. Source checks do not renew catalogue review dates or affiliate permissions.</p>
  {owner&&<button type="button" className="admin-primary" disabled={busy} onClick={()=>run('run-finance-refresh')}>{busy?'Checking…':'Check official finance sources now'}</button>}
  <p role="status">{rows.filter(r=>r.status==='review_due').length} sources need review. {busy?'Work is in progress…':''}</p>
  {rows.map(row=><article className="admin-link-summary" key={row.id}><div>
   <h3>{row.title}</h3><p>{row.status} · {row.issue||'Latest supported check passed'}</p>
   <small>Last attempt: {new Date(row.last_attempt_at).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})} · Last accepted: {row.checked_at?new Date(row.checked_at).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}):'None'}</small>
   <p><a href={row.source_url} target="_blank" rel="noopener noreferrer">Read complete official terms ↗</a></p>
   <details><summary>Accepted data and proposed data</summary><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(row.facts,null,2)}</pre></details>
   {owner&&row.status==='review_due'&&row.facts?.candidate&&row.issue?.startsWith('Source observation needs review;')&&<form onSubmit={e=>{e.preventDefault();run('approve-finance-observation',{id:row.id,revision:row.revision,hash:row.content_hash,note:notes[row.id]||''});}}>
    <label>Review note: confirm variant, fees, exclusions, caps, dates and conflicting terms<textarea required minLength={20} maxLength={1000} value={notes[row.id]||''} onChange={e=>setNotes({...notes,[row.id]:e.target.value})}/></label>
    <p className="admin-help">Approval accepts this exact source observation. Edit the product catalogue separately if its description, restrictions or review dates need changing. Never approve a limited offer without complete terms.</p>
    <button type="submit" className="admin-secondary" disabled={busy}>Accept this exact reviewed observation</button>
   </form>}
  </div></article>)}
  {error&&<p role="alert" className="admin-alert">{error}</p>}
 </section>;
}
