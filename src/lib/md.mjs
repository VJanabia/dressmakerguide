// Minimal, dependency-free Markdown subset -> HTML.
// Supported: ## / ### / #### headings, paragraphs, - and 1. lists, > note callouts,
// | pipe tables |, ![alt](src "caption") figures, **bold**, *italic*, \`code\`, [links](url).
// Everything is escaped first, so page content can never inject markup.

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/* Image syntax: ![alt](src) or ![alt](src caption text).
   The caption is everything after the URL rather than a quoted string, because a quote-delimited
   caption breaks the moment the caption itself contains an apostrophe or a quotation mark - which
   is exactly what happened the first time these captions were wired up. */
const IMAGE = /!\[([^\]]*)\]\((\S+?)(?:\s+([^)]*?))?\)/;

function inline(text) {
  let out = esc(text);
  out = out.replace(IMAGE, (m, alt, src) => '<img src="' + src + '" alt="' + alt + '" loading="lazy" decoding="async" width="600" height="337">');
  out = out.replace(/\[([^\]]+)\]\((\S+?)\)/g,
    (m, label, href) => {
      const external = /^https?:\/\//.test(href);
      const attrs = external ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + href + '"' + attrs + '>' + label + '</a>';
    });
  /* Replacement FUNCTIONS, not replacement strings. In a string replacement "$1" is a capture
     reference, so "**$14.99**" silently rendered as "4.99" - which is what happened to every price
     on the site the moment an answer box was written. Functions have no such special syntax. */
  out = out.replace(/\*\*([^*]+)\*\*/g, (m, body) => '<strong>' + body + '</strong>');
  out = out.replace(/(^|[\s(])\*([^*\n]+)\*/g, (m, pre, body) => pre + '<em>' + body + '</em>');
  out = out.replace(/\`([^\`]+)\`/g, (m, body) => '<code>' + body + '</code>');
  return out;
}

const isTableRow = (l) => /^\|.*\|\s*$/.test(l);
const cells = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());


/* ---- block helpers -------------------------------------------------------
   A heading owns every line after it until the next heading. The renderer walks headings as
   blocks, which is what lets a FAQ section group each question with its own answer. */

/* True for a line that starts with 2-4 hashes followed by a space. */

/* ---- guide components ----------------------------------------------------
   Beyond plain prose the pages need three structured shapes: numbered steps, coloured
   callouts, and small card grids. All three are written in the existing Markdown subset so
   content stays portable and nothing raw is injected. */

/* "1. **Title** - body" becomes a numbered step with its own title and copy. */
function stepsHtml(items) {
  const parts = items.map(function (raw, idx) {
    const m = /^\*\*([^*]+)\*\*\s*[\u2014\u2013:-]?\s*([\s\S]*)$/.exec(raw.trim());
    const title = m ? m[1] : raw.trim();
    const body = m ? m[2] : '';
    return '<li class="step">' +
      '<span class="step-n" aria-hidden="true">' + (idx + 1) + '</span>' +
      '<div class="step-body"><p class="step-title">' + inline(title) + '</p>' +
      (body ? '<p>' + inline(body) + '</p>' : '') + '</div></li>';
  }).join('');
  return '<ol class="steps">' + parts + '</ol>';
}

/* "### Card title" inside a Cards block, with the lines under it as the body. */
function cardsHtml(lines) {
  const cards = [];
  let current = null;
  for (const line of lines) {
    const t = String(line).trim();
    let n = 0;
    while (n < t.length && t.charAt(n) === '#') n++;
    if (n === 3 && t.charAt(n) === ' ') {
      if (current) cards.push(current);
      current = { title: t.slice(n + 1).trim(), body: [] };
      continue;
    }
    if (current) current.body.push(line);
  }
  if (current) cards.push(current);
  if (!cards.length) return '';
  return '<ul class="cards">' + cards.map(function (c) {
    const body = renderMarkdown(c.body.join('\n')).trim();
    return '<li class="card"><p class="card-title">' + inline(c.title) + '</p>' + body + '</li>';
  }).join('') + '</ul>';
}

/* "> Tip: ..." / "> Warning: ..." / "> Note: ..." as coloured callouts. */
function calloutHtml(kind, text) {
  const labels = { tip: 'Tip', warning: 'Warning', note: 'Note', info: 'Note' };
  return '<aside class="callout ' + kind + '">' +
    '<p class="callout-label">' + labels[kind] + '</p>' +
    '<p>' + inline(text) + '</p></aside>';
}

function isHeadingLine(line) {
  const t = String(line).trim();
  let n = 0;
  while (n < t.length && t.charAt(n) === '#') n++;
  return n >= 2 && n <= 4 && t.charAt(n) === ' ';
}

function slug(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);
}

/* Everything from <start> up to the next heading of the SAME OR HIGHER level.
   A level-2 section must be able to contain level-3 subsections - slicing at any heading at all
   truncated the FAQ section at its first question. */
function sliceSection(lines, start, level) {
  const body = [];
  let j = start;
  while (j < lines.length) {
    const t = String(lines[j]).trim();
    let n = 0;
    while (n < t.length && t.charAt(n) === '#') n++;
    if (n >= 2 && n <= 4 && t.charAt(n) === ' ' && n <= level) break;
    body.push(lines[j]);
    j++;
  }
  return { body: body, next: j };
}

/* The inner HTML of one list item: the question heading plus its rendered answer. */
function faqItemHtml(headingText, bodyLines) {
  const id = slug(headingText);
  let answer = renderMarkdown(bodyLines.join('\n')).trim();
  const wrapped = /^<p>([\s\S]*)<\/p>$/.exec(answer);
  if (wrapped) answer = wrapped[1];
  return '<li><h3 id="' + id + '">' + inline(headingText) + '</h3>' +
         (answer ? '<p>' + answer + '</p>' : '') + '</li>';
}

/* A whole FAQ section as one list, one item per question. */
function faqSectionHtml(lines) {
  const items = [];
  let currentTitle = null;
  let currentBody = [];
  for (const line of lines) {
    const t = String(line).trim();
    let hashes = 0;
    while (hashes < t.length && t.charAt(hashes) === '#') hashes++;
    if (hashes === 3 && t.charAt(hashes) === ' ') {
      if (currentTitle !== null) items.push(faqItemHtml(currentTitle, currentBody));
      currentTitle = t.slice(hashes + 1).trim();
      currentBody = [];
      continue;
    }
    if (currentTitle !== null) currentBody.push(line);
  }
  if (currentTitle !== null) items.push(faqItemHtml(currentTitle, currentBody));
  return items.length ? '<ol class="faq">' + items.join('') + '</ol>' : '';
}

export function renderMarkdown(src) {
  const lines = String(src).replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let i = 0;
  let para = [];
  let list = null; // { type: 'ul'|'ol', items: string[] }

  const flushPara = () => {
    if (!para.length) return;
    const joined = para.join(' ');
    /* An image on its own line is a figure, not a paragraph: it gets a border, a caption and a
       consistent margin. The markdown title becomes the visible caption. */
    const lone = new RegExp('^' + IMAGE.source + '$').exec(joined.trim());
    if (lone) {
      const [, alt, src, caption] = lone;
      html.push('<figure>' +
        '<img src="' + src + '" alt="' + alt + '" loading="lazy" decoding="async" width="1100" height="619">' +
        (caption ? '<figcaption>' + caption + '</figcaption>' : '') +
        '</figure>');
    } else {
      html.push('<p>' + inline(joined) + '</p>');
    }
    para = [];
  };
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
      /* data-label carries the column name into each cell so the table can restack as labelled
         blocks on narrow screens instead of forcing a horizontal scroll. */
      const label = (i) => ' data-label="' + head[i].replace(/"/g, '') + '"';
      const rows = body.map((r) => '<tr>' + r.map((c, ci) =>
        (ci === 0 ? '<th scope="row">' + inline(c) + '</th>' : '<td' + label(ci) + '>' + inline(c) + '</td>')).join('') + '</tr>').join('');
      html.push('<div class="table-wrap"><table><thead><tr>' + th + '</tr></thead><tbody>' + rows + '</tbody></table></div>');
      continue;
    }

    // --- callout ---
    if (trimmed.startsWith('> ')) {
      flushAll();
      const buf = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) { buf.push(lines[i].trim().slice(2)); i++; }
      const first = (buf[0] || '').replace(/\*\*/g, '');
      /* "> Short answer: ..." is the answer-first box: the direct reply a reader (or a featured
         snippet) wants before any of the explanation. */
      if (/^short answer\s*:/i.test(first)) {
        buf[0] = buf[0].replace(/^\s*\*{0,2}short answer\s*:\*{0,2}\s*/i, '');
        html.push('<aside class="answer"><p>' + buf.map(inline).join(' ') + '</p></aside>');
        continue;
      }
      /* Coloured callouts: tip, warning, note. A bare note keeps the neutral style. */
      const kindMatch = /^(tip|warning|note|heads up|info)\s*:/i.exec(first);
      if (kindMatch) {
        const raw = kindMatch[1].toLowerCase();
        const kind = raw === 'heads up' ? 'warning' : (raw === 'info' ? 'note' : raw);
        buf[0] = buf[0].replace(/^\s*\*{0,2}(tip|warning|note|heads up|info)\s*:\*{0,2}\s*/i, '');
        html.push(calloutHtml(kind === 'note' ? 'note' : kind, buf.join(' ')));
        continue;
      }
      html.push('<aside class="note"><p>' + buf.map(inline).join(' ') + '</p></aside>');
      continue;
    }

    // --- headings ---
    const h = /^(#{2,4})\s+(.*)$/.exec(trimmed);
    if (h) {
      const level = h[1].length;
      const text = h[2];
      const id = slug(text);
      const isFaq = level === 2 && /frequently asked|^faq\b/i.test(text);
      const slice = sliceSection(lines, i + 1, level);
      flushAll();
      html.push('<h' + level + ' id="' + id + '">' + inline(text) + '</h' + level + '>');
      if (isFaq) {
        html.push(faqSectionHtml(slice.body));
      } else if (slice.body.length && slice.body.join('').trim()) {
        html.push(renderMarkdown(slice.body.join('\n')).trim());
      }
      i = slice.next;
      continue;
    }

    // --- directives: ::: steps / ::: cards blocks ---
    const directive = /^:::\s*([a-z]+)\s*$/.exec(trimmed);
    if (directive) {
      const name = directive[1];
      const body = [];
      i++;
      while (i < lines.length && !/^:::\s*$/.test(lines[i].trim())) { body.push(lines[i]); i++; }
      i++; // consume the closing :::
      flushAll();
      if (name === 'steps') {
        const items = [];
        for (const line of body) {
          const m = /^(?:\d+\.|[-*])\s+(.*)$/.exec(String(line).trim());
          if (m) items.push(m[1]);
        }
        if (items.length) html.push(stepsHtml(items));
      } else if (name === 'cards') {
        html.push(cardsHtml(body));
      }
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
