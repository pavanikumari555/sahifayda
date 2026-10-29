import assert from 'node:assert/strict';
import { readFile,readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import {guideSlugs,guidePath} from '../lib/guides.mjs';
import {productRoutes} from '../lib/product-pages.mjs';
const headers=await readFile('out/_headers','utf8');
const info=JSON.parse(await readFile('out/security-build.json','utf8'));
const manifest=JSON.parse(await readFile('out/manifest.webmanifest','utf8'));
assert.equal(manifest.display,'standalone');
assert.equal(manifest.start_url,'/');
assert.equal(manifest.scope,'/');
for(const icon of manifest.icons){
 const png=await readFile('out'+icon.src);
 assert.equal(png.subarray(1,4).toString(),'PNG');
 const size=Number(icon.sizes.split('x')[0]);
 assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);
}
assert.match(headers,/frame-ancestors 'none'/);
assert.match(headers,/script-src-attr 'none'/);
assert.doesNotMatch(headers,/script-src[^;]*'unsafe-(inline|eval)'/);
const policies=new Map();let policyRoute;for(const line of headers.split('\n')){if(line&&!line.startsWith(' '))policyRoute=line;else if(line.includes('Content-Security-Policy:'))policies.set(policyRoute,line);}
assert.ok(headers.split('\n').every(line=>line.length<=2000));
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){
 const file=join(dir,entry.name);
 if(entry.isDirectory()){await walk(file);continue;}
 assert.ok(!entry.name.startsWith('.env')&&!entry.name.endsWith('.map'),'No env files or source maps in export');
 if(!/\.(html|js|json|css|txt|xml)$/.test(file))continue;
 const source=await readFile(file,'utf8');
 assert.doesNotMatch(source,/sb_secret_[A-Za-z0-9_-]{10,}|sbp_[A-Za-z0-9_-]{10,}|gh[opusr]_[A-Za-z0-9]{20,}/,'No secret-like keys in browser assets');
 if(!file.endsWith('.html'))continue;
 const asset='/'+file.replaceAll('\\','/').replace(/^out\//,'');const route=asset.endsWith('/index.html')?asset.slice(0,-10):asset;const csp=policies.get(route);assert.ok(csp,'Every HTML route has its own complete CSP');
 assert.doesNotMatch(source,/\son(?:click|error|load|mouseover)\s*=/i,'No inline event handlers');
 for(const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  if(/\bsrc\s*=/.test(match[1])||!match[2].trim())continue;
  assert.ok(csp.includes(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`),'Every trusted inline script must have a matching CSP hash');
 }
}}
await walk('out');
for(const route of ['out/index.html','out/hi/index.html']){
 const html=await readFile(route,'utf8');
 assert.match(html,/rel="manifest" href="\/manifest.webmanifest"/);
 assert.match(html,/install-app/);
 assert.ok(html.includes(`<html lang="${route.includes('/hi/')?'hi':'en'}"`),'Each exported language route has the correct document language');
 assert.equal(/<meta name="robots" content="noindex, follow"/.test(html),!info.indexable);
 if(info.indexable){assert.ok(html.includes('rel="canonical"'));assert.ok(html.includes(info.origin));}
}
assert.match(await readFile('out/marketing-preview.html','utf8'),/name="robots" content="noindex, nofollow"/);
assert.match(await readFile('out/admin/index.html','utf8'),/name="robots" content="noindex, nofollow"/);
assert.match(headers,/\/admin\n  X-Robots-Tag: noindex, nofollow\n  Cache-Control: no-store/);
assert.match(headers,/\/admin\/\*\n  X-Robots-Tag: noindex, nofollow\n  Cache-Control: no-store\n  Referrer-Policy: no-referrer/);
assert.match(await readFile('out/admin/recover/index.html','utf8'),/name="robots" content="noindex, nofollow"/);
const sitemap=await readFile('out/sitemap.xml','utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,info.indexable?4+guideSlugs.length*2+productRoutes('en').length*2:0);
for(const language of ['en','hi'])for(const route of productRoutes(language)){
 const html=await readFile('out'+route+'index.html','utf8');assert.ok(html.includes(`<html lang="${language}"`));assert.ok(html.includes('<h1>')&&(html.includes('product-grid')||html.includes('service-category-grid')));assert.ok(html.includes('role="status"'));assert.equal(/<meta name="robots" content="noindex, follow"/.test(html),!info.indexable);
}
for(const slug of guideSlugs)for(const language of ['en','hi']){
 const html=await readFile('out'+guidePath(slug,language)+'index.html','utf8');
 assert.ok(html.includes(`<html lang="${language}"`));
 assert.ok(html.includes('<h1>')&&html.includes('<article>'));
 assert.equal(/<meta name="robots" content="noindex, follow"/.test(html),!info.indexable);
 if(info.indexable)assert.ok(html.includes(info.origin+guidePath(slug,language)));
}
assert.match(headers,/\/hi\/\n  Content-Security-Policy:[^\n]+\n  Permissions-Policy: microphone=\(self\)/);
assert.match(await readFile('out/robots.txt','utf8'),/Allow: \//);
console.log('Export security and indexing checks passed.');

// Model Cloudflare Pages header concatenation, rather than last-rule-wins.
const rules=[];let rule;
for(const line of headers.split('\n')){if(!line.trim())continue;if(!line.startsWith(' ')){rule={path:line.trim(),policy:[]};rules.push(rule);}else if(line.trim().startsWith('Permissions-Policy:'))rule.policy.push(line.slice(line.indexOf(':')+1).trim());}
for(const path of ['/','/hi/','/admin/','/admin/recover/','/guides/monthly-budget/']){
 const effective=rules.filter(r=>r.path.endsWith('*')?path.startsWith(r.path.slice(0,-1)):path===r.path).flatMap(r=>r.policy).join(', ');
 for(const name of ['camera','microphone','geolocation','payment','usb'])assert.equal((effective.match(new RegExp(name+'=','g'))||[]).length,1,'Each browser permission directive must have one effective value: '+path);
 assert.ok(effective.includes('microphone='+(['/','/hi/'].includes(path)?'(self)':'()')),'Microphone policy: '+path);
}
