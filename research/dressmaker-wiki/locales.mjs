
import fs from 'node:fs';
const strip = h => h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
const text = h => strip(h).replace(/<[^>]+>/g,' ').replace(/&[a-z#0-9]+;/g,' ').replace(/\s+/g,' ').trim();
for (const f of ['t_de_fabrics_.html','t_ja_fabrics_.html','t_pt_fabrics_.html']) {
  const h = fs.readFileSync(f,'utf8');
  const title = (h.match(/<title>([^<]*)<\/title>/i)||[])[1];
  const h1 = (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1];
  const main = (h.match(/<main[^>]*>([\s\S]*?)<\/main>/i)||[])[1] || h;
  const body = (h.match(/<body[^>]*>([\s\S]*)<\/body>/i)||[])[1] || h;
  console.log('### ' + f);
  console.log('title: ' + title);
  console.log('h1: ' + text(h1||''));
  const t = text(main);
  console.log('main words: ' + t.split(/\s+/).filter(Boolean).length);
  console.log('excerpt: ' + t.slice(0, 420));
  console.log('hreflang count: ' + (h.match(/hreflang=/gi)||[]).length + ' | canonical: ' + ((h.match(/rel="canonical" href="([^"]*)"/i)||[])[1]));
  console.log();
}
