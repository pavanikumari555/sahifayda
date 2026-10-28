const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const validChatClientId=value=>typeof value==='string'&&uuid.test(value);
// A guest-session fairness bucket, not authentication. The DB global cap remains authoritative.
export function quotaIdentifier(address,clientId){
 if(clientId===undefined)return address||'shared'; // Preserve legacy client limits.
 if(!validChatClientId(clientId))throw Error('client');
 return 'chat-session:'+clientId.toLowerCase();
}
export function chatSessionId(storage,createId){
 let id;
 try{id=storage?.getItem('sahifayda-chat-session');}catch{}
 if(validChatClientId(id))return id;
 id=createId();
 if(!validChatClientId(id))throw Error('client');
 try{storage?.setItem('sahifayda-chat-session',id);}catch{}
 return id;
}
