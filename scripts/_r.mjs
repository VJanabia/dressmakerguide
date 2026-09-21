import fs from 'node:fs'; import path from 'node:path';
const css = fs.readFileSync('public/assets/styles.css','utf8').replace(//*[sS]*?*//g,' ').replace(/url([^)]*)/g,'URL');
const declared = new Set(); for (const m of css.matchAll(/.(-?[_a-zA-Z][w-]*)/g)) declared.add(m[1]);
const emitted = new Set();
const walk=(d)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=d+'/'+e.name;
 if(e.isDirectory())walk(f); else if(e.name.endsWith('.html'))
 for(const m of fs.readFileSync(f,'utf8').matchAll(/class="([^"]+)"/g)) m[1].split(/s+/).forEach(c=>emitted.add(c));}};
walk('dist');
console.log('declared', declared.size, 'emitted', emitted.size, '| unreachable:', [...declared].filter(c=>!emitted.has(c)).join(', ')||'none');
