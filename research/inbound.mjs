
import fs from 'node:fs';
const norm = u => u.replace(/\/$/, '') || '/';
const files = [['(home)','dist/index.html']];
for (const d of fs.readdirSync('dist',{withFileTypes:true})) if (d.isDirectory() && fs.existsSync('dist/'+d.name+'/index.html')) files.push([d.name,'dist/'+d.name+'/index.html']);
const inbound = {};
for (const [name,file] of files) {
  const h = fs.readFileSync(file,'utf8');
  const afterHead = h.slice(h.indexOf('</head>')+7);
  const body = afterHead
    .replace(/<aside class="sidebar"[\s\S]*?<\/aside>/g,' ')
    .replace(/<aside class="toc"[\s\S]*?<\/aside>/g,' ')
    .replace(/<aside class="ad-slot[\s\S]*?<\/aside>/g,' ')
    .replace(/<footer[\s\S]*?<\/footer>/g,' ')
    .replace(/<script[\s\S]*?<\/script>/g,' ');
  for (const m of body.matchAll(/href="(\/[^"#]*)"/g)) {
    const u = norm(m[1]); if (u.startsWith('/assets')) continue;
    inbound[u] = inbound[u] || new Set(); inbound[u].add(name);
  }
}
console.log('### inbound contextual links (unique source pages) ###');
for (const [name] of files) { const u = name==='(home)'?'/':'/'+name; console.log(String((inbound[u]||new Set()).size).padStart(3) + '  ' + u); }
console.log('\n### H2 outline of /wiki ###');
const w = fs.readFileSync('dist/wiki/index.html','utf8');
for (const m of w.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/g)) console.log('  H'+m[1]+' '+m[2].replace(/<[^>]+>/g,'').trim());
console.log('\n### H2 outline of /customers ###');
const c = fs.readFileSync('dist/customers/index.html','utf8');
for (const m of c.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/g)) console.log('  H'+m[1]+' '+m[2].replace(/<[^>]+>/g,'').trim());
console.log('\n### all page titles + descriptions ###');
for (const [name,file] of files) {
  const h = fs.readFileSync(file,'utf8');
  const t = (h.match(/<title>([^<]*)<\/title>/)||[])[1];
  const d = (h.match(/<meta name="description" content="([^"]*)"/)||[])[1];
  console.log((name==='(home)'?'/':'/'+name+'').padEnd(22) + ' | ' + t + '  [' + t.length + ']');
}
