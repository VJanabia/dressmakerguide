
import fs from 'node:fs';
const DIR = process.argv[2];
const rows = JSON.parse(fs.readFileSync(DIR + '/analysis.json','utf8'));
function catOf(f){ const s=f.replace('en__','').replace('.html',''); if(s==='root') return {group:'home',kind:'home'};
  const p=s.split('__'); if(p.length===1){ const stat=['about','sitemap','privacy-policy','terms-of-service'];
    return {group:p[0], kind: stat.includes(p[0]) ? 'utility' : 'hub'}; } return {group:p[0], kind:'article'}; }
const byGroup={};
for(const r of rows){ const c=catOf(r.file); (byGroup[c.group]=byGroup[c.group]||[]).push({...r,kind:c.kind}); }
const order=['home','about','sitemap','privacy-policy','terms-of-service','guides','fabrics','patterns','commissions','decorations','characters','achievements','shop','updates','platforms'];
let md='# 竞品页面清单 (dressmaker-wiki.wiki / en, 88 页)\n\n';
md+='| slug | 类型 | Title | 词数 | H2 | H3 | 图 | 唯一内链 | Schema |\n|---|---|---|---|---|---|---|---|---|\n';
let n=0;
for(const g of order){ const list=byGroup[g]; if(!list) continue;
  for(const r of list.sort((a,b)=>(a.kind==='hub'?0:1)-(b.kind==='hub'?0:1)||b.words-a.words)){
    const slug = r.file.replace('en__','').replace('.html','').replace(/__/g,'/');
    const url = slug==='root' ? '/' : '/'+slug+'/';
    md+='| \`'+url+'\` | '+r.kind+' | '+(r.title||'').replace(/\|/g,'/')+' | '+r.words+' | '+r.h2Count+' | '+r.h3Count+' | '+r.imgs+' | '+r.internalLinks+' | '+(r.ldTypes||'')+' |\n'; n++;
  } }
md+='\n(词数为 <main>/<article> 内可见文本按空白切分；唯一内链去重后计数)\n';
fs.writeFileSync(DIR+'/inventory.md', md);
console.log('rows written:', n);
for(const g of order){ const l=byGroup[g]; if(l) console.log(g.padEnd(18)+' hub='+l.filter(x=>x.kind==='hub').length+' article='+l.filter(x=>x.kind==='article').length+' utility='+l.filter(x=>x.kind==='utility').length); }
