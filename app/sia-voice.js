'use client';
import {useEffect,useRef,useState} from 'react';
import {Mic,Square} from 'lucide-react';
import {createSpeechInput} from '../lib/speech-input.mjs';
export default function SiaVoice({language,onTranscript,onListeningChange,onNotice,disabled=false}){
 const hi=language==='hi',session=useRef(null),callbacks=useRef({});
 callbacks.current={onTranscript,onListeningChange,onNotice};
 const [supported,setSupported]=useState(false),[listening,setListening]=useState(false);
 useEffect(()=>{
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;setSupported(Boolean(Recognition));
  if(!Recognition){callbacks.current.onNotice?.(hi?'इस ब्राउज़र में माइक उपलब्ध नहीं है। अपनी बात टाइप कर सकते हैं।':'Voice input is unavailable in this browser. You can still type.');return;}
  session.current=createSpeechInput({createRecognition:()=>{const rec=new Recognition();rec.lang=hi?'hi-IN':'en-IN';return rec;},
   onText:text=>callbacks.current.onTranscript?.(text),
   onState:value=>{setListening(value);callbacks.current.onListeningChange?.(value);},
   onPreview:text=>callbacks.current.onNotice?.(text),
   onError:code=>callbacks.current.onNotice?.(['not-allowed','service-not-allowed'].includes(code)?(hi?'माइक की अनुमति नहीं मिली। आप टाइप कर सकते हैं।':'Microphone permission was not granted. You can type instead.'):code==='empty'?(hi?'आवाज़ नहीं मिली। फिर माइक दबाएँ या टाइप करें।':'No speech was detected. Tap the mic again or type.'):(hi?'माइक रुक गया। मिली हुई बात बॉक्स में है; बाकी टाइप करें या माइक फिर दबाएँ।':'The mic stopped. Recognised words are in the box; type the rest or tap the mic again.'))
  });
  return()=>{session.current?.dispose();session.current=null;};
 },[hi]);
 useEffect(()=>{if(disabled)session.current?.stop();},[disabled]);
 const label=listening?(hi?'माइक रोकें':'Stop microphone'):(hi?'बोलकर अपनी समस्या लिखें':'Speak your problem');
 return <button type="button" className={'sia-mic'+(listening?' is-listening':'')} onClick={()=>{if(listening)session.current?.stop();else if(!disabled)session.current?.start();}} disabled={!supported||disabled} aria-label={label} title={label} aria-pressed={listening}>{listening?<Square size={18}/>:<Mic size={20}/>}</button>;
}
