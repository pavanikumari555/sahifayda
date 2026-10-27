// Supabase validates the bearer token. This parser only bounds incoming URL data.
export function recoveryFragment(hash,now=Date.now()){
 const values=new URLSearchParams(hash.replace(/^#/,''));
 if(values.get('type')!=='recovery')return null;
 const token=values.get('access_token'),expires=Number(values.get('expires_in'));
 if(!token||token.length>5000||!Number.isFinite(expires)||expires<=0)return null;
 const absolute=values.has('expires_at')?Number(values.get('expires_at'))*1000:Infinity;
 if(Number.isNaN(absolute)||absolute<=now)return null;
 return {token,expiresAt:Math.min(absolute,now+Math.min(expires,1800)*1000)};
}
