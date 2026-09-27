
import fs from 'node:fs';
import path from 'node:path';
const DIR = process.argv[2];
const files = fs.readdirSync(path.join(DIR,'html')).filter(f=>f.endsWith('.html'));
const FACTS = [
  ['ach-names', /Good Girl Gone Vlad|Snitches Get Stitches|Prudence and Prejudice|Caw Evermore|Golden Needle|Drawn to Hue|G\.O\.A\.T\.|Reap what You Sew|A Stitch in Time|Fabric of Society|Threadbare No More|Swan Song|Go Off, Queen!/g],
  ['npcs', /Lord Threadbare|Madame Lacroix|Vlad|Edith|Pigeon Witch/g],
  ['volume', /150 dress pieces|450 fabrics|350 accessories|over 150|over 450|over 350/g],
  ['hours', /35 hours|thirty-five hours|how long to beat/gi],
  ['review', /Very Positive|Overwhelmingly Positive|Mostly Positive|\d+\+? Reviews|\d+% positive|96%/g],
  ['price', /\$14\.99|\$13\.49|10% off|-10%|price drop/gi],
  ['langs', /Simplified Chinese|Japanese|Portuguese|German|Russian|supported languages/gi],
  ['plat', /Windows and macOS|macOS only|Linux|console|mobile/g],
];
const out = {};
for (const f of files) {
  const h = fs.readFileSync(path.join(DIR,'html',f),'utf8');
  const bodyM = h.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = bodyM ? bodyM[1] : h;
  for (const [name, re] of FACTS) {
    const m = body.match(re);
    if (m) {
      out[name] = out[name] || {};
      const uniq = [...new Set(m.map(s=>s.toLowerCase()))];
      for (const u of uniq) { (out[name][u] = out[name][u] || []).push(f.replace('en__','').replace('.html','')); }
    }
  }
}
for (const [k,v] of Object.entries(out)) {
  console.log('\n########## ' + k + ' ##########');
  for (const [term, fl] of Object.entries(v).sort((a,b)=>b[1].length-a[1].length)) {
    console.log('  [' + fl.length + ' pages] "' + term + '"  e.g. ' + fl.slice(0,4).join(', '));
  }
}
