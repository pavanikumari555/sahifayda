'use client';
import {useEffect,useState} from 'react';

export default function InstallApp({hi=false}) {
 const [prompt,setPrompt]=useState(null),[installed,setInstalled]=useState(false),[busy,setBusy]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{
  const standalone=()=>setInstalled(window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true);
  const capture=event=>{event.preventDefault();setPrompt(event);};
  const done=()=>{setInstalled(true);setPrompt(null);};
  standalone();window.addEventListener('beforeinstallprompt',capture);window.addEventListener('appinstalled',done);
  return()=>{window.removeEventListener('beforeinstallprompt',capture);window.removeEventListener('appinstalled',done);};
 },[]);
 async function install(){
  if(!prompt||busy)return;setBusy(true);setFailed(false);
  try{await prompt.prompt();await prompt.userChoice;}catch{setFailed(true);}finally{setPrompt(null);setBusy(false);}
 }
 if(installed)return null;
 return <div className="install-app">
  <strong>{hi?'SahiFayda को ऐप की तरह खोलें':'Open SahiFayda like an app'}</strong>
  {prompt&&<button type="button" onClick={install} disabled={busy}>{hi?'ऐप इंस्टॉल करें':'Install app'}</button>}
  <details><summary>{hi?'होम स्क्रीन पर जोड़ने का तरीका':'How to add to your home screen'}</summary><p>{hi?'Android/Chrome: ब्राउज़र मेन्यू में “ऐप इंस्टॉल करें” या “होम स्क्रीन पर जोड़ें” चुनें। iPhone/iPad: Safari में Share → Add to Home Screen चुनें। विकल्प ब्राउज़र और डिवाइस पर निर्भर है।':'Android/Chrome: choose “Install app” or “Add to Home screen” in the browser menu. iPhone/iPad: in Safari, use Share → Add to Home Screen. Availability depends on your browser and device.'}</p></details>
  <p>{hi?'इंटरनेट ज़रूरी है। ब्राउज़र में भी इस्तेमाल कर सकते हैं।':'Internet required. You can also keep using your browser.'}</p>
  {failed&&<p role="status">{hi?'ब्राउज़र मेन्यू से दोबारा कोशिश करें।':'Try again using your browser menu.'}</p>}
 </div>;
}
