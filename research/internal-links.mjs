
import fs from 'node:fs';
import path from 'node:path';
const dist = 'dist';
const pages = [];
for (const d of fs.readdirSync(dist, {withFileTypes:true})) {
  if (d.isDirectory() && fs.existsSync(path.join(dist, d.name, 'index.html'))) pages.push([d.name, path.join(dist, d.name, 'index.html')]);
}
pages.push(['(home)', path.join(dist, 'index.html')]);
console.log('page'.padEnd(20) + '| contextual in-body links | words | img | h2');
const targets = {};
for (const [name, file] of pages) {
  const h = fs.readFileSync(file, 'utf8');
  const afterHead = h.slice(h.indexOf('</head>') + 7);
  const body = afterHead
    .replace(/<nav[\s\S]*?<\/nav>/g, ' ')            // crumbs + sidebar nav + footer nav
    .replace(/<aside class="sidebar"[\s\S]*?<\/aside>/g, ' ')
    .replace(/<aside class="toc"[\s\S]*?<\/aside>/g, ' ')
    .replace(/<aside class="ad-slot[\s\S]*?<\/aside>/g, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ');
  const links = [...new Set([...body.matchAll(/href="(\/[^"#]*)"/g)].map(x => x[1]))].filter(l => !l.startsWith('/assets'));
  const words = body.replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim().split(' ').filter(Boolean).length;
  console.log(name.padEnd(20) + '| ' + String(links.length).padStart(3) + '  ' + links.join(' '));
  for (const l of links) targets[l] = (targets[l]||0)+1;
}
console.log('\n### inbound contextual links per page (a page linked from 0-2 bodies is effectively orphaned) ###');
const all = pages.map(p => p[0] === '(home)' ? '/' : '/' + p[0] + '/');
for (const u of all) console.log(String(targets[u]||0).padStart(3) + '  ' + u);
