import fs from 'node:fs';
const P = 'src/lib/layout.mjs';
let s = fs.readFileSync(P, 'utf8');
const FROM = "    '<link rel=\"icon\" href=\"/favicon.svg\" type=\"image/svg+xml\">',\n    '<link rel=\"icon\" href=\"/assets/favicon-32.png\" sizes=\"32x32\" type=\"image/png\">',\n    '<link rel=\"apple-touch-icon\" href=\"/assets/apple-touch-icon.png\">',";
if (!s.includes(FROM)) { console.log('icon block not found'); process.exit(1); }
fs.writeFileSync(P, s.replace(FROM, "    '<link rel=\"icon\" href=\"/favicon.svg\" type=\"image/svg+xml\">',\n    '<link rel=\"icon\" href=\"/assets/favicon-32.png\" sizes=\"32x32\" type=\"image/png\">',\n    '<link rel=\"icon\" href=\"/assets/favicon-16.png\" sizes=\"16x16\" type=\"image/png\">',\n    '<link rel=\"icon\" href=\"/assets/favicon-48.png\" sizes=\"48x48\" type=\"image/png\">',\n    '<link rel=\"apple-touch-icon\" href=\"/assets/apple-touch-icon.png\">',\n    '<link rel=\"manifest\" href=\"/site.webmanifest\">',"));
console.log('layout.mjs: icon links wired (svg + 16/32/48 + apple + manifest)');