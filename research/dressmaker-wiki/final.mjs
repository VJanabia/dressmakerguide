
import fs from 'node:fs';
const DIR = '.';
const rows = JSON.parse(fs.readFileSync(DIR + '/analysis.json','utf8'));
const get = f => rows.find(r => r.file === 'en__' + f + '.html');
console.log('EN /en/fabrics/ words:', get('fabrics').words, '| h2:', get('fabrics').h2Count, '| imgs:', get('fabrics').imgs);
console.log('total images across 88 pages:', rows.reduce((a,b)=>a+b.imgs,0));
console.log('pages with 0 images:', rows.filter(r=>r.imgs===0).length);
const il = rows.map(r=>r.internalLinks).sort((a,b)=>a-b);
console.log('internal links per page: min', il[0], 'median', il[44], 'max', il[87]);
console.log('avg words:', Math.round(rows.reduce((a,b)=>a+b.words,0)/rows.length));
console.log('pages under 1000 words:', rows.filter(r=>r.words<1000).map(r=>r.file+':'+r.words).join(', '));
console.log('pages 1000-2000:', rows.filter(r=>r.words>=1000&&r.words<2000).map(r=>r.file+':'+r.words).join(', '));
console.log('robots meta unique:', [...new Set(rows.map(r=>r.robots))].join(' | '));
console.log('pages with og:image:', rows.filter(r=>r.ogImage).length);
console.log('h1 != 1 count:', rows.filter(r=>r.h1Count!==1).length);
console.log('titles with duplicate suffix count:', rows.filter(r=>(r.title||'').includes('| Dressmaker Wiki')).length);
