// Only build-time, owner-configured origins may create canonical/indexable pages.
export function siteConfig(env = process.env) {
  const indexable = env.SAHIFAYDA_INDEXABLE === 'true';
  const raw = env.SAHIFAYDA_PUBLIC_SITE_URL || '';
  let origin;
  if (raw) {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname) || /(^|\.)(localhost|local|test|invalid|example)$/.test(url.hostname)) throw new Error('Set a real public HTTPS origin without a path for SAHIFAYDA_PUBLIC_SITE_URL.');
    origin = url.origin;
  }
  if (indexable && !origin) throw new Error('Indexable builds require the approved public site origin.');
  return { indexable, origin };
}
export function pageMetadata(language) {
  const { indexable, origin } = siteConfig();
  return {
    ...(language === 'hi' ? {title:'सहीफ़ायदा — रोज़मर्रा के पैसों का सही हिसाब',description:'महीने का हिसाब समझें, खरीद के दो कोटेशन की तुलना करें और भुगतान की दिक्कत में अगला कदम जानें।'} : {}),
    robots:{index:indexable,follow:true},
    ...(origin ? {alternates:{canonical:origin+(language==='hi'?'/hi/':'/'),languages:{en:origin+'/',hi:origin+'/hi/','x-default':origin+'/'}}} : {})
  };
}
