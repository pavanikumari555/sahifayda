// Shared by the composer and endpoint. Conversation text is not database content.
export const questionLimit=600;
// Infer from the user's words, never from an assistant reply or page navigation.
// Short neutral replies (amounts, names, yes/no) retain the conversation's style.
export function replyStyle(text,previous='en'){
 const value=String(text||'').trim().toLowerCase();
 if(/^(?:earlier preferences in this chat)/.test(value))return previous;
 if(/\b(?:reply|answer|respond|explain)\s+(?:to me\s+)?in\s+english\b|\benglish\s+(?:me|mein)\s+(?:batao|btao|bolo|samjhao)\b/.test(value))return 'en';
 if(/[\u0900-\u097f]/.test(value))return 'hi';
 if(/\b(mujhe|mujko|mujhko|muje|meri|mera|mere|hai|hu|hun|hoon|hain|haan|han|nhi|nahi|nahin|chahiye|chaiye|lena|karna|krna|kr|karta|karti|btao|batao|hoga|kaise|kaisa|kya|kitna|kitne|kyun|kyu|paise|paisa|samjhao|chahie|chahiey|aap|aapko|karu|karun|liye|chahata|chahta)\b/.test(value))return 'roman';
 if(/\b(i|i'm|i’ve|i'd|my|we|our|please|need|want|would|could|can|should|how|what|which|why|explain|tell|is|are|have|has|without|because|looking|prefer|for|with)\b/.test(value))return 'en';
 return previous==='hi'||previous==='roman'?previous:'en';
}
export function conversationStyle(question,history=[],fallback='en'){
 let style=fallback==='hi'?'hi':'en';
 for(const item of history)if(item?.role==='user')style=replyStyle(item.content,style);
 return replyStyle(question,style);
}
export function privateDetails(text){
 return /[\w.+-]+@[\w.-]+\.[a-z]{2,}|\b[A-Z]{5}\d{4}[A-Z]\b|\b(?:\d[ -]?){12,19}\b|\b(?:\+?91[ -]?)?[6-9]\d{9}\b|(?:otp|pin|cvv|password|ओटीपी|पिन|पासवर्ड)\s*(?:is|hai|है|:|=)?\s*[0-9]{3,8}/i.test(text);
}
export function validateQuestion(value,max=questionLimit,min=3){
 const shortReply=typeof value==='string'&&max===questionLimit&&min===3&&/^(?:ha|no|ok|0|जी|हाँ|हां)$/i.test(value.trim());
 if(typeof value!=='string'||value.trim().length<min&&!shortReply||value.length>max)throw Error('length');
 const text=value.trim();
 if(privateDetails(text))throw Error('private');
 return text;
}
export function readConversation(body){
 const question=validateQuestion(body.question);
 if(body.history!==undefined&&!Array.isArray(body.history))throw Error('history');
 const history=body.history||[];
 if(history.length>4)throw Error('history');
 return {question,history:history.map(message=>{
  if(!message||typeof message!=='object'||Array.isArray(message)||Object.keys(message).some(k=>!['role','content'].includes(k))||!['user','assistant'].includes(message.role))throw Error('history');
  return {role:message.role,content:validateQuestion(message.content,message.role==='user'?questionLimit:1800,1)};
 })};
}
