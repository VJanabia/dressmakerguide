
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = process.argv[2];
const urls = (await fs.readFile(path.join(OUT,'all_urls.txt'),'utf8')).trim().split('\n').map(s=>s.trim()).filter(Boolean);
const en = urls.filter(u=>u.includes('/en/') || u === 'https://dressmaker-wiki.wiki/');

await fs.mkdir(path.join(OUT,'html'), {recursive:true});

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
let done = 0, failed = [];
async function grab(u){
  const slug = u.replace('https://dressmaker-wiki.wiki/','').replace(/\/$/,'').replace(/\//g,'__') || 'root';
  try {
    const res = await fetch(u, {headers:{'user-agent':UA,'accept':'text/html'}, redirect:'follow'});
    const html = await res.text();
    await fs.writeFile(path.join(OUT,'html',slug+'.html'), html);
    done++;
    if(!res.ok) failed.push([u,res.status]);
  } catch(e){ failed.push([u,String(e.message)]); }
}
const q = [...en];
const workers = Array.from({length:6}, async ()=>{ while(q.length) await grab(q.shift()); });
await Promise.all(workers);
console.log('fetched', done, 'of', en.length, 'targets; failures:', JSON.stringify(failed));
