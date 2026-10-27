import assert from 'node:assert/strict';
import { readFile,readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import {guideSlugs,guidePath} from '../lib/guides.mjs';
const headers=await readFile('out/_headers','utf8');
const info=JSON.parse(await readFile('out/security-build.json','utf8'));
assert.match(headers,/frame-ancestors 'none'/);
assert.match(headers,/script-src-attr 'none'/);
assert.doesNotMatch(headers,/script-src[^;]*'unsafe-(inline|eval)'/);
const csp=headers.split('\n').find(line=>line.includes('Content-Security-Policy:'));
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){
 const file=join(dir,entry.name);
 if(entry.isDirectory()){await walk(file);continue;}
 assert.ok(!entry.name.startsWith('.env')&&!entry.name.endsWith('.map'),'No env files or source maps in export');
 if(!/\.(html|js|json|css|txt|xml)$/.test(file))continue;
 const source=await readFile(file,'utf8');
 assert.doesNotMatch(source,/sb_secret_[A-Za-z0-9_-]{10,}|sbp_[A-Za-z0-9_-]{10,}|gh[opusr]_[A-Za-z0-9]{20,}/,'No secret-like keys in browser assets');
 if(!file.endsWith('.html'))continue;
 assert.doesNotMatch(source,/\son(?:click|error|load|mouseover)\s*=/i,'No inline event handlers');
 for(const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  if(/\bsrc\s*=/.test(match[1])||!match[2].trim())continue;
  assert.ok(csp.includes(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`),'Every trusted inline script must have a matching CSP hash');
 }
}}
await walk('out');
for(const route of ['out/index.html','out/hi/index.html']){
 const html=await readFile(route,'utf8');
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
assert.equal((sitemap.match(/<loc>/g)||[]).length,info.indexable?2+guideSlugs.length*2:0);
for(const slug of guideSlugs)for(const language of ['en','hi']){
 const html=await readFile('out'+guidePath(slug,language)+'index.html','utf8');
 assert.ok(html.includes(`<html lang="${language}"`));
 assert.ok(html.includes('<h1>')&&html.includes('<article>'));
 assert.equal(/<meta name="robots" content="noindex, follow"/.test(html),!info.indexable);
 if(info.indexable)assert.ok(html.includes(info.origin+guidePath(slug,language)));
}
assert.match(headers,/\/hi\/\n  Permissions-Policy: camera=\(\), microphone=\(self\)/);
assert.match(await readFile('out/robots.txt','utf8'),/Allow: \//);
console.log('Export security and indexing checks passed.');
