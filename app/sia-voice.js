'use client';
import {useEffect,useRef,useState} from 'react';
import {Mic,Square,Volume2} from 'lucide-react';
import {voiceTopic} from '../lib/voice-topic.mjs';
export default function SiaVoice({language,onTopic,answer}){
 const hi=language==='hi',recognizer=useRef(null),speech=useRef(null),timer=useRef(null);
 const [supported,setSupported]=useState(false),[canSpeak,setCanSpeak]=useState(false),[listening,setListening]=useState(false),[speaking,setSpeaking]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{setSupported(Boolean(window.SpeechRecognition||window.webkitSpeechRecognition));setCanSpeak(Boolean(window.speechSynthesis&&window.SpeechSynthesisUtterance));return()=>{recognizer.current?.abort();clearTimeout(timer.current);if(speech.current)window.speechSynthesis?.cancel();};},[]);
 function stop(){recognizer.current?.abort();clearTimeout(timer.current);setListening(false);}
 function start(){
  if(listening){stop();return;}
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Recognition)return;
  const recognition=new Recognition();recognizer.current=recognition;recognition.lang=hi?'hi-IN':'en-IN';recognition.continuous=false;recognition.interimResults=false;recognition.maxAlternatives=1;setMessage('');
  recognition.onresult=event=>{const selected=voiceTopic(event.results?.[0]?.[0]?.transcript);if(selected){onTopic(selected);setMessage(hi?'विषय चुना गया है। नीचे “समझाएँ” दबाएँ।':'Topic selected. Press Explain this below.');}else setMessage(hi?'विषय समझ नहीं आया। बजट, EMI, कार्ड बिल, UPI या रेफ़रल बोलें; या सूची से चुनें।':'Topic not recognised. Say budget, EMI, card bill, UPI or referral; or choose from the list.');};
  recognition.onerror=event=>{setMessage(event.error==='not-allowed'?(hi?'माइक की अनुमति नहीं मिली। सूची से विषय चुन सकते हैं।':'Microphone permission was not granted. You can choose a topic from the list.'):(hi?'आवाज़ समझ नहीं पाए। दोबारा कोशिश करें या सूची से चुनें।':'Could not recognise speech. Try again or use the topic list.'));setListening(false);};
  recognition.onend=()=>{clearTimeout(timer.current);setListening(false);};
  try{recognition.start();setListening(true);timer.current=setTimeout(stop,15000);}catch{setListening(false);setMessage(hi?'इस ब्राउज़र में वॉइस शुरू नहीं हो सकी।':'Voice could not start in this browser.');}
 }
 function read(){
  if(speaking){window.speechSynthesis.cancel();setSpeaking(false);return;}
  if(!answer||!canSpeak)return;const utterance=new SpeechSynthesisUtterance(answer);utterance.lang=hi?'hi-IN':'en-IN';
  const voices=window.speechSynthesis.getVoices(),voice=voices.find(v=>v.lang.toLowerCase()===utterance.lang.toLowerCase())||voices.find(v=>v.lang.toLowerCase().startsWith(hi?'hi':'en'));
  if(voice)utterance.voice=voice;speech.current=utterance;utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>{setSpeaking(false);setMessage(hi?'जवाब की आवाज़ उपलब्ध नहीं है; नीचे पढ़ सकते हैं।':'Audio playback is unavailable; the answer remains readable below.');};window.speechSynthesis.cancel();setSpeaking(true);window.speechSynthesis.speak(utterance);
 }
 useEffect(()=>{if(speech.current){window.speechSynthesis?.cancel();speech.current=null;setSpeaking(false);}},[answer]);
 return <div className="sia-voice"><div className="sia-voice-actions"><button type="button" className="admin-secondary" onClick={start} disabled={!supported} aria-pressed={listening}>{listening?<Square size={15}/>:<Mic size={15}/>} {listening?(hi?'सुनना रोकें':'Stop listening'):(hi?'बोलकर विषय चुनें':'Speak your question')}</button>{answer&&canSpeak&&<button type="button" className="admin-secondary" onClick={read} aria-pressed={speaking}>{speaking?<Square size={15}/>:<Volume2 size={15}/>} {speaking?(hi?'आवाज़ रोकें':'Stop audio'):(hi?'जवाब सुनें':'Listen to answer')}</button>}</div><p className="note">{supported?(hi?'माइक केवल आपके दबाने और अनुमति देने पर चालू होगा। Chrome/आपकी वॉइस सेवा ऑडियो अपने सर्वर पर प्रोसेस कर सकती है। नाम, रकम, बैंक विवरण, PIN या OTP न बोलें। सहीफ़ायदा ऑडियो/ट्रांसक्रिप्ट नहीं सहेजता; AI को सिर्फ़ चुना विषय जाता है।':'The microphone starts only when you press the button and grant permission. Chrome/your speech service may process audio on its servers. Do not speak names, amounts, bank details, PINs or OTPs. SahiFayda does not save audio/transcripts; only the chosen topic goes to AI.'):(hi?'इस ब्राउज़र में बोलकर पूछना उपलब्ध नहीं है। नीचे विषय चुनें; उपलब्ध होने पर जवाब सुन सकते हैं।':'Speech input is not supported in this browser. Choose a topic below; answer playback is available where supported.')}</p>{listening&&<p className="note" role="status">{hi?'सुन रहे हैं… अधिकतम 15 सेकंड':'Listening… up to 15 seconds'}</p>}{message&&<p className="note" role="status">{message}</p>}</div>;
}
