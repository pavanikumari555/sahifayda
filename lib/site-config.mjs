// Owner approved public search launch on 10 November 2026. Branch previews stay noindex.
export const approvedOrigin = 'https://sahifayda.pages.dev';
export function siteConfig(env = process.env) {
  const preview = env.CF_PAGES_BRANCH && env.CF_PAGES_BRANCH !== 'main';
  if (env.SAHIFAYDA_INDEXABLE && !['true','false'].includes(env.SAHIFAYDA_INDEXABLE)) throw new Error('SAHIFAYDA_INDEXABLE must be true or false.');
  const indexable = !preview && env.SAHIFAYDA_INDEXABLE !== 'false';
  const raw = env.SAHIFAYDA_PUBLIC_SITE_URL || approvedOrigin;
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
    ...(language === 'hi' ? {title:'सहीफ़ायदा — पैसों के फ़ैसले, अब आसान',description:'बचत खाते, क्रेडिट कार्ड, लोन, डीमैट और बीमा की शर्तें आसान हिन्दी में समझें और तुलना करें। मुफ़्त कैलकुलेटर और SIA, जो आपकी भाषा में जवाब देती है।',openGraph:{title:'सहीफ़ायदा — पैसों के फ़ैसले, अब आसान',locale:'hi_IN',type:'website',siteName:'SahiFayda'}} : {}),
    robots:{index:indexable,follow:true},
    ...(origin ? {alternates:{canonical:origin+(language==='hi'?'/hi/':'/'),languages:{en:origin+'/',hi:origin+'/hi/','x-default':origin+'/'}}} : {})
  };
}
