import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import nextEnv from '@next/env';
import { siteConfig } from '../lib/site-config.mjs';
import {guideSlugs,guidePath} from '../lib/guides.mjs';
import {productRoutes} from '../lib/product-pages.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
nextEnv.loadEnvConfig(root,false);
const output=join(root,'out');
const {indexable,origin}=siteConfig();
const api=new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
if(api.protocol!=='https:' || !/^[a-z0-9]+\.supabase\.co$/.test(api.hostname) || api.pathname!=='/' || api.search || api.hash || api.username || api.password || api.port) throw new Error('Use the exact HTTPS Supabase project origin.');
const html=[];
async function walk(path){for(const entry of await readdir(path,{withFileTypes:true})){const file=join(path,entry.name);if(entry.isDirectory())await walk(file);else if(file.endsWith('.html'))html.push(file);else if(file.endsWith('.map') || /^\.env/.test(entry.name))throw new Error('Private/debug files must not be exported.');}}
await walk(output);
const hashes=new Set(),pageHashes=new Map();
for(const file of html){
 let source=await readFile(file,'utf8');
 const ownHashes=new Set();pageHashes.set(file,ownHashes);
 if(relative(output,file).replaceAll('\\','/').startsWith('hi/')){
  source=source.replace('<html lang="en"','<html lang="hi"');
  await writeFile(file,source);
 }
 if(/sb_secret_[A-Za-z0-9_-]+|sbp_[A-Za-z0-9_-]+|gh[opusr]_[A-Za-z0-9]{20,}/.test(source))throw new Error('Secret-like token in exported HTML.');
 for(const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  if(/\bsrc\s*=/i.test(match[1]) || !match[2].trim())continue;
  const hash=`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`;hashes.add(hash);ownHashes.add(hash);
 }
 if(indexable && ['index.html','hi/index.html'].includes(relative(output,file).replaceAll('\\','/')) && /content="[^"\n]*noindex/i.test(source))throw new Error('An indexable page still contains noindex.');
}
const csp=trusted=>["default-src 'self'",`script-src 'self' ${[...trusted].join(' ')}`,"script-src-attr 'none'","style-src 'self' 'unsafe-inline' https://fonts.googleapis.com","font-src 'self' https://fonts.gstatic.com","img-src 'self' data:",`connect-src 'self' ${api.origin}`,"object-src 'none'","base-uri 'none'","form-action 'self'","frame-src 'none'","frame-ancestors 'none'"].join('; ');
const lines=['/*','  X-Content-Type-Options: nosniff','  X-Frame-Options: DENY','  Referrer-Policy: strict-origin-when-cross-origin','  Permissions-Policy: camera=(), geolocation=(), payment=(), usb=()','  Strict-Transport-Security: max-age=15552000','  Cross-Origin-Opener-Policy: same-origin','  X-DNS-Prefetch-Control: off',...(!indexable?['  X-Robots-Tag: noindex, follow']:[]),'','/marketing-preview.html','  X-Robots-Tag: noindex, nofollow','','/_next/static/*','  Cache-Control: public, max-age=31536000, immutable',''];
lines.push('/manifest.webmanifest','  Content-Type: application/manifest+json','  Cache-Control: no-cache','');
lines.push('/admin','  X-Robots-Tag: noindex, nofollow','  Cache-Control: no-store','  Referrer-Policy: no-referrer','  Permissions-Policy: microphone=()','','/admin/*','  X-Robots-Tag: noindex, nofollow','  Cache-Control: no-store','  Referrer-Policy: no-referrer','  Permissions-Policy: microphone=()','');
// Pages joins repeated header values; give each directive one value per route.
for(const file of html){
 const asset='/'+relative(output,file).replaceAll('\\','/');
 const route=asset.endsWith('/index.html')?asset.slice(0,-10):asset;
 // A complete policy per HTML route avoids one growing global hash allowlist.
 const permission='  Permissions-Policy: microphone='+(['/','/hi/'].includes(route)?'(self)':'()');
 lines.push(route,`  Content-Security-Policy: ${csp(pageHashes.get(file))}`,...(route.startsWith('/admin/')?[]:[permission]),'');
 if(asset!==route)lines.push(asset,`  Content-Security-Policy: ${csp(pageHashes.get(file))}`,...(asset.startsWith('/admin/')?[]:['  Permissions-Policy: microphone=()']),'');
}
if(lines.filter(line=>line&&!line.startsWith(' ')).length>100)throw new Error('Too many Cloudflare header rules.');
if(lines.some(line=>line.length>2000))throw new Error('Security headers exceed Cloudflare Pages line limits. Split per-page policies before release.');
await writeFile(join(output,'_headers'),lines.join('\n'));
// Crawling must stay allowed so a crawler can actually read the noindex header.
await writeFile(join(output,'robots.txt'),`User-agent: *\nAllow: /\n${indexable?`\nSitemap: ${origin}/sitemap.xml\n`:''}`);
const urls=indexable?[origin+'/',origin+'/hi/',origin+'/guides/',origin+'/hi/guides/',...guideSlugs.flatMap(slug=>['en','hi'].map(language=>origin+guidePath(slug,language))),...['en','hi'].flatMap(language=>productRoutes(language).map(route=>origin+route))]:[];
await writeFile(join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`\n  <url><loc>${url}</loc></url>`).join('')}\n</urlset>\n`);
await writeFile(join(output,'security-build.json'),JSON.stringify({indexable,origin:origin||null,htmlPages:html.length,inlineScriptHashes:hashes.size},null,2));
console.log(`Secured ${html.length} exported pages; ${hashes.size} script hashes; search indexing ${indexable?'enabled for approved origin':'disabled for preview'}.`);
