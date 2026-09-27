
import fs from 'node:fs/promises';
import path from 'node:path';
const DIR = process.argv[2];
const files = (await fs.readdir(path.join(DIR,'html'))).filter(f=>f.endsWith('.html'));

const strip = h => h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
const text = h => strip(h).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim();
const g = (h,re) => { const m=h.match(re); return m?m[1].trim():null; };
const gall = (h,re) => { const out=[]; let m; const r=new RegExp(re.source, re.flags.includes('g')?re.flags:re.flags+'g'); while((m=r.exec(h))) out.push(m); return out; };

const rows = [];
for (const f of files) {
  const h = await fs.readFile(path.join(DIR,'html',f),'utf8');
  const body = g(h, /<body[^>]*>([\s\S]*)<\/body>/i) || h;
  const main = g(body, /<main[^>]*>([\s\S]*?)<\/main>/i) || g(body, /<article[^>]*>([\s\S]*?)<\/article>/i) || body;
  const ld = [...h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
  let ldTypes = [];
  for (const j of ld) { try { const p=JSON.parse(j); const arr=Array.isArray(p)?p:[p]; for(const o of arr){ if(o['@graph']) o['@graph'].forEach(x=>ldTypes.push(x['@type'])); else ldTypes.push(o['@type']); } } catch(e){ ldTypes.push('PARSE_ERROR'); } }
  const hreflang = [...h.matchAll(/hreflang="([^"]+)"/gi)].map(m=>m[1]);
  const headings = [...main.matchAll(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi)].map(m=>'H'+m[1]+': '+text(m[2]).slice(0,90));
  const imgs = [...h.matchAll(/<img\b[^>]*>/gi)].map(m=>m[0]);
  const internal = [...body.matchAll(/href="(\/en\/[^"#]*|\/[^"#]*)"/gi)].map(m=>m[1]);
  const external = [...body.matchAll(/href="(https?:\/\/[^"]+)"/gi)].map(m=>m[1]).filter(u=>!u.includes('dressmaker-wiki.wiki'));
  const scripts = [...h.matchAll(/<script[^>]*src="([^"]+)"/gi)].map(m=>m[1]);
  const bodyText = text(main);
  rows.push({
    file: f,
    title: g(h,/<title[^>]*>([\s\S]*?)<\/title>/i),
    titleLen: (g(h,/<title[^>]*>([\s\S]*?)<\/title>/i)||'').length,
    desc: g(h,/<meta[^>]*name="description"[^>]*content="([^"]*)"/i) || g(h,/<meta[^>]*content="([^"]*)"[^>]*name="description"/i),
    canonical: g(h,/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i),
    robots: g(h,/<meta[^>]*name="robots"[^>]*content="([^"]*)"/i),
    hreflang: [...new Set(hreflang)].join(','),
    ogTitle: g(h,/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i),
    ogImage: g(h,/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i),
    ldTypes: [...new Set(ldTypes)].join('|'),
    h1: (main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1] ? text((main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i))[1]) : null,
    h1Count: (main.match(/<h1/gi)||[]).length,
    h2Count: (main.match(/<h2/gi)||[]).length,
    h3Count: (main.match(/<h3/gi)||[]).length,
    headings,
    words: bodyText.split(/\s+/).filter(Boolean).length,
    imgs: imgs.length,
    imgsNoAlt: imgs.filter(i=>!/alt=/.test(i)).length,
    internalLinks: [...new Set(internal)].length,
    externalLinks: [...new Set(external)],
    scripts: [...new Set(scripts)],
  });
}
await fs.writeFile(path.join(DIR,'analysis.json'), JSON.stringify(rows,null,1));
// console summary
console.log('PAGES:', rows.length);
const wc = rows.map(r=>r.words).sort((a,b)=>a-b);
console.log('word counts: min',wc[0],'p25',wc[Math.floor(wc.length*0.25)],'median',wc[Math.floor(wc.length/2)],'p75',wc[Math.floor(wc.length*0.75)],'max',wc[wc.length-1]);
console.log('avg words', Math.round(wc.reduce((a,b)=>a+b,0)/wc.length));
console.log('total words', wc.reduce((a,b)=>a+b,0));
console.log('\n--- sample rows ---');
for (const r of rows.slice(0,3)) console.log(JSON.stringify({file:r.file,title:r.title,desc:r.desc,canonical:r.canonical,robots:r.robots,hreflang:r.hreflang,ldTypes:r.ldTypes,h1:r.h1,words:r.words,imgs:r.imgs,il:r.internalLinks,ext:r.externalLinks,scripts:r.scripts},null,1));
console.log('\n--- all scripts seen ---');
console.log([...new Set(rows.flatMap(r=>r.scripts))].join('\n'));
console.log('\n--- all external link hosts ---');
const hosts = {};
rows.flatMap(r=>r.externalLinks).forEach(u=>{ try{const hh=new URL(u).host; hosts[hh]=(hosts[hh]||0)+1;}catch(e){} });
console.log(Object.entries(hosts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+' '+v).join('\n'));
