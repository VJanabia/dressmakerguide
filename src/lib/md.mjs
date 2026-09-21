// Minimal, dependency-free Markdown subset -> HTML.
// Supported: ## / ### / #### headings, paragraphs, - and 1. lists, > note callouts,
// | pipe tables |, ![alt](src "caption") figures, **bold**, *italic*, \`code\`, [links](url).
// Everything is escaped first, so page content can never inject markup.

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function inline(text) {
  let out = esc(text);
  out = out.replace(/!\[([^\]]*)\]\((\S+?)(?:\s+&quot;([^&]*)&quot;)?\)/g,
    (m, alt, src, title) => '<img src="' + src + '" alt="' + alt + '" loading="lazy" decoding="async" width="600" height="337"' + (title ? ' title="' + title + '"' : '') + '>');
  out = out.replace(/\[([^\]]+)\]\((\S+?)\)/g,
    (m, label, href) => {
      const external = /^https?:\/\//.test(href);
      const attrs = external ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + href + '"' + attrs + '>' + label + '</a>';
    });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  out = out.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
  return out;
}

const isTableRow = (l) => /^\|.*\|\s*$/.test(l);
const cells = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

export function renderMarkdown(src) {
  const lines = String(src).replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let i = 0;
  let para = [];
  let list = null; // { type: 'ul'|'ol', items: string[] }

  const flushPara = () => { if (para.length) { html.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } };
  const flushList = () => {
    if (!list) return;
    const tag = list.type;
    html.push('<' + tag + '>' + list.items.map((it) => '<li>' + inline(it) + '</li>').join('') + '</' + tag + '>');
    list = null;
  };
  const flushAll = () => { flushPara(); flushList(); };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { flushAll(); i++; continue; }

    // --- table ---
    if (isTableRow(trimmed) && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
      flushAll();
      const head = cells(trimmed);
      const body = [];
      i += 2;
      while (i < lines.length && isTableRow(lines[i].trim())) { body.push(cells(lines[i].trim())); i++; }
      const th = head.map((h) => '<th scope="col">' + inline(h) + '</th>').join('');
      const rows = body.map((r) => '<tr>' + r.map((c, ci) => (ci === 0 ? '<th scope="row">' + inline(c) + '</th>' : '<td>' + inline(c) + '</td>')).join('') + '</tr>').join('');
      html.push('<div class="table-wrap"><table><thead><tr>' + th + '</tr></thead><tbody>' + rows + '</tbody></table></div>');
      continue;
    }

    // --- callout ---
    if (trimmed.startsWith('> ')) {
      flushAll();
      const buf = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) { buf.push(lines[i].trim().slice(2)); i++; }
      const isWarn = /^(note|warning|heads up)/i.test(buf[0] || '');
      html.push('<aside class="note' + (isWarn ? ' warn' : '') + '"><p>' + buf.map(inline).join(' ') + '</p></aside>');
      continue;
    }

    // --- headings ---
    const h = /^(#{2,4})\s+(.*)$/.exec(trimmed);
    if (h) {
      flushAll();
      const level = h[1].length;
      const text = h[2];
      const id = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);
      html.push('<h' + level + ' id="' + id + '">' + inline(text) + '</h' + level + '>');
      i++;
      continue;
    }

    // --- lists ---
    const ul = /^[-*]\s+(.*)$/.exec(trimmed);
    const ol = /^\d+\.\s+(.*)$/.exec(trimmed);
    if (ul || ol) {
      flushPara();
      const type = ul ? 'ul' : 'ol';
      if (!list || list.type !== type) { flushList(); list = { type, items: [] }; }
      list.items.push((ul ? ul[1] : ol[1]).trim());
      i++;
      continue;
    }

    para.push(trimmed);
    i++;
  }
  flushAll();
  return html.join('\n');
}
