import {validateSiteSettings,siteSettingsDefaults} from '../supabase/functions/_shared/site-settings.mjs';
export * from '../supabase/functions/_shared/site-settings.mjs';

// Reads the owner's published homepage settings. Any failure falls back to defaults,
// so the homepage never breaks because settings are missing or malformed.
export async function readSiteSettings(fetcher=fetch){
 try{
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key||!/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/.test(url))return siteSettingsDefaults();
  const response=await fetcher(url.replace(/\/$/,'')+'/rest/v1/site_settings?select=content&limit=1',{headers:{apikey:key},cache:'no-store',signal:AbortSignal.timeout(8000)});
  if(!response.ok)return siteSettingsDefaults();
  const rows=await response.json();
  return Array.isArray(rows)&&rows[0]?.content?validateSiteSettings(rows[0].content):siteSettingsDefaults();
 }catch{return siteSettingsDefaults();}
}
