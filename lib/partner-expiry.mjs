export const expiryChoices={never:'Never expire',24:'24 hours from now',48:'48 hours from now',72:'72 hours from now',custom:'Custom date and time'};
export function expiryForHours(value,now=new Date()){
 if(value==='never')return '';
 const hours=Number(value);if(![24,48,72].includes(hours))throw Error('Choose 24, 48 or 72 hours.');
 return new Date(now.getTime()+hours*3600000).toISOString().slice(0,16);
}
export function expiryToIso(value){
 if(!value)return null;
 if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))throw Error('Enter a valid UTC expiry.');
 const date=new Date(value+'Z');if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,16)!==value)throw Error('Enter a valid UTC expiry.');
 return date.toISOString();
}
export function partnerAvailability(row,now=new Date()){
 if(row.state!=='active')return {id:row.state,label:row.state==='paused'?'Paused / inactive':row.state==='archived'?'Archived':'Draft'};
 if(row.expires_at&&(!Number.isFinite(Date.parse(row.expires_at))||Date.parse(row.expires_at)<=now.getTime()))return {id:'expired',label:'Expired / inactive — replace or renew link'};
 if(!row.promotion_approved)return {id:'unapproved',label:'Permission missing / inactive'};
 const day=Date.parse(now.toISOString().slice(0,10)),review=Date.parse(row.reviewed_on);
 if(!Number.isFinite(review)||review>day||review<day-90*86400000)return {id:'review_due',label:'Review due / inactive'};
 return {id:'active',label:'Active / available'};
}
