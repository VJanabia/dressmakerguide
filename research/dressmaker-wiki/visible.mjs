
import fs from 'node:fs';
import path from 'node:path';
const DIR = process.argv[2];
const files = fs.readdirSync(path.join(DIR,'html')).filter(f=>f.endsWith('.html'));
const strip = h => h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
const TERMS = ['96%','450+ Reviews','Very Positive','Overwhelmingly Positive','$13.49','$14.99','-10%','Good Girl Gone Vlad','Golden Needle','Lord Threadbare','Madame Lacroix','Edith','Pigeon Witch','Russian','German','Portuguese','Simplified Chinese','Japanese','35 hours','32 Steam achievements','Active Codes','YouTube','youtube.com/embed','Advertisement'];
const hits = {};
const ytIds = {};
for (const f of files) {
  const raw = fs.readFileSync(path.join(DIR,'html',f),'utf8');
  const h = strip(raw);
  const bodyM = h.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = bodyM ? bodyM[1] : h;
  for (const t of TERMS) {
    const n = (body.match(new RegExp(t.replace(/[.*+?^$()[\]{}|\\]/g,'\\$&'),'gi'))||[]).length;
    if (n) { (hits[t] = hits[t] || []).push(f.replace('en__','').replace('.html','') + '(' + n + ')'); }
  }
  const ids = [...new Set([...raw.matchAll(/(?:youtube\.com\/embed\/|youtu\.be\/|img\.youtube\.com\/vi\/)([A-Za-z0-9_-]{11})/g)].map(m=>m[1]))];
  if (ids.length) ytIds[f.replace('en__','').replace('.html','')] = ids;
}
for (const t of TERMS) {
  const v = hits[t] || [];
  console.log(t.padEnd(24) + ' | visible on ' + String(v.length).padStart(2) + ' pages | ' + v.slice(0,6).join(', '));
}
console.log('\n### YouTube embeds per page ###');
const allIds = new Set();
for (const [f,ids] of Object.entries(ytIds)) { ids.forEach(i=>allIds.add(i)); console.log(f + ': ' + ids.join(',')); }
console.log('\nunique video ids: ' + allIds.size + ' -> ' + [...allIds].join(','));
