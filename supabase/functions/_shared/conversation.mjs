// Shared by the composer and endpoint. Conversation text is not database content.
export const questionLimit=600;
export function privateDetails(text){
 return /[\w.+-]+@[\w.-]+\.[a-z]{2,}|\b[A-Z]{5}\d{4}[A-Z]\b|\b(?:\d[ -]?){12,19}\b|\b(?:\+?91[ -]?)?[6-9]\d{9}\b|(?:otp|pin|cvv|password|ओटीपी|पिन|पासवर्ड)\s*(?:is|hai|है|:|=)?\s*[0-9]{3,8}/i.test(text);
}
export function validateQuestion(value,max=questionLimit,min=3){
 if(typeof value!=='string'||value.trim().length<min||value.length>max)throw Error('length');
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
