export function validatePartnerHelp(body){
 const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
 if(!body||Array.isArray(body)||Object.keys(body).some(k=>!['id','link_id','name','mobile','status','issue','consent'].includes(k))||!uuid(body.id)||!uuid(body.link_id))throw Error('Check the request.');
 for(const [key,max]of [['name',80],['mobile',20],['issue',240]])if(typeof body[key]!=='string'||body[key].length>max)throw Error('Check name, mobile and short help message.');
 const name=body.name.trim(),mobile=body.mobile.replace(/[\s-]/g,'').replace(/^\+91/,'');
 if(!name&&!mobile||mobile&&!/^[6-9][0-9]{9}$/.test(mobile))throw Error('Add a name or a valid Indian mobile number.');
 if(!['not_started','in_progress','opened','problem'].includes(body.status)||body.consent!==true)throw Error('Choose your status and allow the submitted details to be shared for support.');
 if(/\b\d{10,}\b|\b[A-Z]{5}\d{4}[A-Z]\b|(?:\b(?:otp|pin)\b|ओटीपी|पिन)[^\d]{0,20}\d{4,8}|\bpassword\b|पासवर्ड/i.test(body.issue))throw Error('Do not put OTPs, passwords, PAN, Aadhaar, account numbers or documents in the help message.');
 return {p_id:body.id,p_link:body.link_id,p_name:name,p_mobile:mobile,p_status:body.status,p_issue:body.issue.trim(),p_consent:true};
}
