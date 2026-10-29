export function robotsAllows(text,path,agent='sahifaydasourcemonitor'){
 const groups=[];let group=null,hasRules=false;
 for(const raw of text.split(/\r?\n/)){
  const line=raw.split('#')[0].trim(),colon=line.indexOf(':');if(colon<0)continue;
  const key=line.slice(0,colon).trim().toLowerCase(),value=line.slice(colon+1).trim();
  if(key==='user-agent'){if(!group||hasRules){group={agents:[],rules:[]};groups.push(group);hasRules=false;}group.agents.push(value.toLowerCase());}
  else if(group&&['allow','disallow'].includes(key)){group.rules.push({allow:key==='allow',path:value});hasRules=true;}
 }
 const relevant=groups.map(g=>({...g,specificity:Math.max(-1,...g.agents.map(a=>a==='*'?0:agent.includes(a)?a.length:-1))}));
 const specificity=Math.max(-1,...relevant.map(g=>g.specificity));let match={length:-1,allow:true};
 for(const group of relevant.filter(g=>g.specificity===specificity&&specificity>=0))for(const rule of group.rules){
  if(!rule.path)continue;
  const end=rule.path.endsWith('$'),pattern=rule.path.replace(/\$$/,'').split('*').map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*');
  if(new RegExp('^'+pattern+(end?'$':'')).test(path)){const length=rule.path.replaceAll('*','').length;if(length>match.length||length===match.length&&rule.allow)match={length,allow:rule.allow};}
 }
 return match.allow;
}
export function sourceText(html){return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<!--[\s\S]*?-->/g,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/\s+/g,' ').trim().slice(0,100000);}

// These two approved bank pages include large navigation/script payloads.
// Keep a hard byte cap; never hash a silently truncated page as a full observation.
export function sourceReadLimit(address){
 return ['www.hdfc.bank.in','www.idfcfirst.bank.in'].includes(new URL(address).hostname)?3000000:750000;
}
export async function readBoundedSourceBody(response,limit){
 const reader=response.body?.getReader();if(!reader)throw Error('No source body');
 let text='',size=0;const decoder=new TextDecoder();
 try{
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw Error('Source exceeds bounded read');}text+=decoder.decode(value,{stream:true});}
  return text+decoder.decode();
 }finally{reader.releaseLock();}
}
