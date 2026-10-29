// One explicit microphone session; no auto-send and no transcript persistence.
export function mergeSpeechSegments(segments){
 const words=[],key=word=>word.toLocaleLowerCase().replace(/[\p{P}\p{S}]/gu,'');
 for(const segment of segments){
  const next=String(segment||'').trim().split(/\s+/).filter(Boolean);if(!next.length)continue;
  let overlap=0;
  for(let n=Math.min(words.length,next.length);n>0;n--){
   if(next.slice(0,n).every((word,i)=>key(word)===key(words[words.length-n+i]))){overlap=n;break;}
  }
  words.push(...next.slice(overlap));
 }
 return words.join(' ');
}
export function createSpeechInput({createRecognition,onText,onState,onPreview=()=>{},onError=()=>{},schedule=setTimeout,cancel=clearTimeout,silenceMs=8000,maxMs=60000}){
 let current=null,wanted=false,active=false,stopping=false,parts=[],run='',idle=null,limit=null,retry=null,flush=null,restarts=0;
 const clear=()=>{for(const id of [idle,limit,retry,flush])if(id!==null)cancel(id);idle=limit=retry=flush=null;};
 const text=()=>mergeSpeechSegments([...parts,run]);
 function detach(rec){if(!rec)return;rec.onresult=rec.onend=rec.onerror=rec.onspeechstart=rec.onspeechend=null;try{rec.abort();}catch{}}
 function finish(deliver=true,notify=true){
  if(!active)return;const value=text();clear();const rec=current;current=null;wanted=false;active=false;stopping=false;detach(rec);
  if(notify){onState(false);onPreview('');if(deliver&&value)onText(value);else if(deliver)onError('empty');}
 }
 function stop(){
  if(!active||stopping)return;wanted=false;stopping=true;
  for(const id of [idle,limit,retry])if(id!==null)cancel(id);idle=limit=retry=null;
  // stop(), rather than abort(), gives the engine a chance to return its last words.
  flush=schedule(()=>finish(),1500);
  if(current){try{current.stop();}catch{finish();}}else finish();
 }
 const armSilence=()=>{if(idle!==null)cancel(idle);idle=schedule(stop,silenceMs);};
 function open(){
  if(!wanted)return;
  let rec;try{rec=createRecognition();}catch{finish();onError('start');return;}
  current=rec;run='';rec.continuous=true;rec.interimResults=true;rec.maxAlternatives=1;
  rec.onresult=event=>{
   if(current!==rec||!active)return;
   // Android engines can repeat cumulative phrases in successive result slots.
   // Rebuild the current hypothesis, merging overlap rather than appending it.
   run=mergeSpeechSegments(Array.from(event.results||[]).map(result=>result?.[0]?.transcript||''));
   if(run){restarts=0;onPreview(text());if(wanted)armSilence();}
  };
  rec.onspeechstart=()=>{if(current===rec&&wanted&&idle!==null){cancel(idle);idle=null;}};
  rec.onspeechend=()=>{if(current===rec&&wanted)armSilence();};
  rec.onerror=event=>{
   if(current!==rec)return;
   if(event.error==='no-speech'&&wanted)return;
   const reason=event.error;finish();if(reason!=='aborted')onError(reason||'speech');
  };
  rec.onend=()=>{
   if(current!==rec)return;
   if(!wanted){finish();return;}
   if(run)parts.push(run);run='';current=null;detach(rec);
   if(++restarts>3){finish();onError('ended');return;}
   // Some mobile engines end on a short pause even in continuous mode.
   // Resume only within the same user-started session, bounded by silence and total timers.
   retry=schedule(()=>{retry=null;open();},250);
  };
  try{rec.start();}catch{finish();onError('start');}
 }
 return {
  start(){if(active)return;active=true;wanted=true;stopping=false;parts=[];run='';restarts=0;onState(true);onPreview('');armSilence();limit=schedule(stop,maxMs);open();},
  stop,
  dispose(){finish(false,false);},
  get active(){return active;}
 };
}
