'use client';
import {useEffect,useRef,useState} from 'react';
import {Mic,Square} from 'lucide-react';
export default function SiaVoice({language,onTranscript,onListeningChange,onNotice,disabled=false}){
 const hi=language==='hi',recognizer=useRef(null),timer=useRef(null),callbacks=useRef({});
 callbacks.current={onTranscript,onListeningChange,onNotice};
 const [supported,setSupported]=useState(false),[listening,setListening]=useState(false);
 function finish(){clearTimeout(timer.current);recognizer.current=null;setListening(false);callbacks.current.onListeningChange?.(false);}
 function stop(){recognizer.current?.abort();finish();}
 useEffect(()=>{
  const available=Boolean(window.SpeechRecognition||window.webkitSpeechRecognition);setSupported(available);
  if(!available)callbacks.current.onNotice?.(hi?'इस ब्राउज़र में माइक उपलब्ध नहीं है। अपनी बात टाइप कर सकते हैं।':'Voice input is unavailable in this browser. You can still type.');
  return()=>{clearTimeout(timer.current);const current=recognizer.current;if(current){current.onresult=null;current.onerror=null;current.onend=null;current.abort();}};
 },[]);
 useEffect(()=>{if(disabled&&recognizer.current)stop();},[disabled]);
 function start(){
  if(listening){stop();return;}
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Recognition||disabled)return;
  const recognition=new Recognition();recognizer.current=recognition;
  recognition.lang=hi?'hi-IN':'en-IN';recognition.continuous=false;recognition.interimResults=false;recognition.maxAlternatives=1;
  recognition.onresult=event=>{if(recognizer.current!==recognition)return;const text=event.results?.[0]?.[0]?.transcript;if(typeof text==='string'&&text.trim())callbacks.current.onTranscript?.(text.trim());};
  recognition.onerror=event=>{if(recognizer.current!==recognition)return;callbacks.current.onNotice?.(event.error==='not-allowed'?(hi?'माइक की अनुमति नहीं मिली। आप टाइप करके भेज सकते हैं।':'Microphone permission was not granted. You can type instead.'):(hi?'आवाज़ समझ नहीं आई। दोबारा बोलें या टाइप करें।':'Could not recognise speech. Try again or type.'));finish();};
  recognition.onend=()=>{if(recognizer.current===recognition)finish();};
  try{recognition.start();setListening(true);callbacks.current.onListeningChange?.(true);callbacks.current.onNotice?.('');timer.current=setTimeout(stop,30000);}catch{finish();callbacks.current.onNotice?.(hi?'माइक शुरू नहीं हुआ। अपनी बात टाइप कर सकते हैं।':'Voice could not start. You can still type.');}
 }
 const label=listening?(hi?'माइक रोकें':'Stop microphone'):(hi?'बोलकर अपनी समस्या लिखें':'Speak your problem');
 return <button type="button" className={'sia-mic'+(listening?' is-listening':'')} onClick={start} disabled={!supported||disabled} aria-label={label} title={label} aria-pressed={listening}>{listening?<Square size={18}/>:<Mic size={20}/>}</button>;
}
