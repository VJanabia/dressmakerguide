
import fs from 'node:fs';
import path from 'node:path';
const DIR = process.argv[2], f = process.argv[3];
const strip = h => h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
const txt = h => strip(h).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim();
const h = fs.readFileSync(path.join(DIR,'html',f),'utf8');
const body = h.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1];
const SKIP = new Set(['span','a','p','li','time','button','svg','path','use','br','i','b','strong','em','small','code','pre','label','input','img','source']);
const out = [];
const re = /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;
let m;
while ((m = re.exec(body))) {
  const tag = m[1].toLowerCase();
  if (SKIP.has(tag)) continue;
  const attrs = m[2];
  const cls = (attrs.match(/class="([^"]*)"/) || [])[1] || '';
  const id = (attrs.match(/id="([^"]*)"/) || [])[1] || '';
  out.push('<' + tag + (id ? ' #' + id : '') + (cls ? ' .' + cls.split(/\s+/).slice(0,4).join('.') : '') + '>');
  if (out.length > 90) break;
}
console.log('===== TAG OUTLINE: ' + f + ' =====');
console.log(out.join('\n'));
console.log('\n===== FULL TEXT: ' + f + ' =====');
console.log(txt(body).slice(0, 6000));
