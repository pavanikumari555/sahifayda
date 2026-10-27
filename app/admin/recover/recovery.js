'use client';
import {useEffect,useRef,useState} from 'react';
import {recoveryFragment} from '../../../lib/admin-recovery.mjs';
import '../panel.css';
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
async function adminApi(body,token){
 const response=await fetch(url+'/functions/v1/admin-console',{method:'POST',headers:{apikey:key,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(20000)});
 const data=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(data.error||'The recovery service is unavailable.');
 return data;
}
export default function Recovery(){
 const started=useRef(false);
 const [session,setSession]=useState(null),[username,setUsername]=useState(''),[password,setPassword]=useState(''),[repeat,setRepeat]=useState('');
 const [busy,setBusy]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState(''),[complete,setComplete]=useState(false);
 useEffect(()=>{
  if(started.current)return;started.current=true;
  const hadLink=Boolean(window.location.hash||window.location.search);
  const recovered=recoveryFragment(window.location.hash);
  // Remove bearer/refresh tokens before any API request; never persist them.
  if(window.location.hash||window.location.search)window.history.replaceState(null,'',window.location.pathname);
  if(!recovered){if(hadLink)setError('यह लिंक अमान्य, पुराना या इस्तेमाल हो चुका है। Gmail में सबसे नई Reset your password ईमेल खोलें; पुराने लिंक को दोबारा न खोलें।');setBusy(false);return;}
  adminApi({action:'dashboard'},recovered.token).then(data=>{setUsername(data.account.username);setSession(recovered);}).catch(()=>setError('This recovery link is invalid, expired, or the account has no active admin access. Request a fresh link.')).finally(()=>setBusy(false));
 },[]);
 useEffect(()=>{if(!session)return;const timer=setTimeout(()=>{setSession(null);setPassword('');setRepeat('');setError('The recovery session expired. Request a fresh link.');},Math.max(0,session.expiresAt-Date.now()));return()=>clearTimeout(timer);},[session]);
 async function requestLink(e){e.preventDefault();setBusy(true);setError('');setNotice('');try{await adminApi({action:'request-recovery',username});setNotice('Request received — email delivery is not confirmed. Open only the newest Reset password email. Repeated requests can hit the email limit. / अनुरोध मिला है; यह ईमेल भेजे जाने की पुष्टि नहीं है। सबसे नई ईमेल का लिंक खोलें। बार-बार अनुरोध न करें।');}catch(e){setError(e.message);}finally{setBusy(false);}}
 async function resetPassword(e){
  e.preventDefault();setError('');setNotice('');
  if(password!==repeat){setError('Both passwords must match.');return;}
  if(password.length<12||password.length>256){setError('Use 12 to 256 characters.');return;}
  if(!session||session.expiresAt<=Date.now()){setSession(null);setError('Request a fresh recovery link.');return;}
  setBusy(true);
  try{
   const response=await fetch(url+'/auth/v1/user',{method:'PUT',headers:{apikey:key,Authorization:'Bearer '+session.token,'Content-Type':'application/json'},body:JSON.stringify({password}),cache:'no-store',signal:AbortSignal.timeout(20000)});
   if(!response.ok)throw new Error('Password could not be changed. Use a different strong password, or request a fresh recovery link.');
   setPassword('');setRepeat('');setComplete(true);
   try{const signedOut=await fetch(url+'/auth/v1/logout?scope=global',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+session.token},cache:'no-store',signal:AbortSignal.timeout(15000)});setNotice(signedOut.ok?'Password updated. All Auth sessions have been signed out. Sign in with your username and new password.':'Password updated. Global sign-out could not be confirmed; ask the owner to review active sessions.');}catch{setNotice('Password updated. Global sign-out could not be confirmed; ask the owner to review active sessions.');}
   setSession(null);
  }catch(e){setError(e.message);}finally{setPassword('');setRepeat('');setBusy(false);}
 }
 return <main className="admin-login-page"><section className="admin-login-card"><a className="admin-logo" href="/admin/">SahiFayda <small>ADMIN</small></a><div className="admin-login-heading"><h1>{session?'Set a new password':'Account recovery'}</h1><p>{session?`Account: ${username}`:'यह नया लिंक माँगने का पेज है। ईमेल का सही लिंक खुलने पर यहाँ New password और Confirm new password दिखेंगे।'}</p></div>{!complete&&(session?<form onSubmit={resetPassword}><label>New password<input required type="password" minLength={12} maxLength={256} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><label>Confirm new password<input required type="password" minLength={12} maxLength={256} autoComplete="new-password" value={repeat} onChange={e=>setRepeat(e.target.value)}/></label><button className="admin-primary" disabled={busy}>Update password</button></form>:<form onSubmit={requestLink}><label>Username<input required maxLength={40} autoComplete="username" autoCapitalize="none" spellCheck={false} value={username} onChange={e=>setUsername(e.target.value)}/></label><button className="admin-primary" disabled={busy}>{busy?'Checking…':'Send recovery link'}</button></form>)}{error&&<p className="admin-alert" role="alert">{error}</p>}{notice&&<p className="admin-notice" role="status">{notice}</p>}<p className="admin-help">Recovery emails use the account’s current verified email. Only open a link you requested. Never share the link or your password in chat. / लिंक और पासवर्ड किसी से साझा न करें।</p><a className="admin-back" href="/admin/">← Back to admin sign in</a></section></main>;
}

