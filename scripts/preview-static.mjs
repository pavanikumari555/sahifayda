// Loopback-only preview of the built Pages assets with the generated header rules.
import { createServer } from 'node:http';
import { readFile,stat } from 'node:fs/promises';
import { resolve,extname,sep } from 'node:path';
const root=resolve('out'), port=Number(process.env.PORT || 3102);
const rules=[];
let current;
for(const line of (await readFile(resolve(root,'_headers'),'utf8')).split('\n')){
 if(!line.trim() || line.startsWith('#'))continue;
 if(!line.startsWith(' ')){current={path:line.trim(),headers:{}};rules.push(current);}else{const split=line.indexOf(':');current.headers[line.slice(0,split).trim()]=line.slice(split+1).trim();}
}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.ico':'image/x-icon'};
const server=createServer(async(req,res)=>{
 const send=(code,body)=>{res.statusCode=code;res.end(req.method==='HEAD'?undefined:body);};
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  const path=decodeURIComponent(url.pathname);
  for(const rule of rules){const matches=rule.path.endsWith('*')?path.startsWith(rule.path.slice(0,-1)):path===rule.path;if(matches)for(const [key,value]of Object.entries(rule.headers))res.setHeader(key,value);}
  if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');return send(405,'Method not allowed');}
  if(path.split('/').some(p=>p.startsWith('.')) || path.includes('\\') || path.includes('\0'))return send(404,'Not found');
  let file=resolve(root,'.'+path);
  if(file!==root&&!file.startsWith(root+sep))return send(404,'Not found');
  try{if((await stat(file)).isDirectory())file=resolve(file,'index.html');}catch{if(!extname(file))file+='.html';}
  let body;
  try{body=await readFile(file);}catch{res.setHeader('Content-Type','text/html; charset=utf-8');return send(404,await readFile(resolve(root,'404.html')));}
  res.setHeader('Content-Type',types[extname(file)] || 'application/octet-stream');
  send(200,body);
 }catch{send(400,'Bad request');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Secure static preview: http://127.0.0.1:${port}`));
