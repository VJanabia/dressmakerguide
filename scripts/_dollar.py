import io
p = 'src/lib/md.mjs'
s = io.open(p, encoding='utf-8').read()

old = """function inline(text) {
  let out = esc(text);
  out = out.replace(IMAGE, (m, alt, src) => '<img src="' + src + '" alt="' + alt + '" loading="lazy" decoding="async" width="600" height="337">');
  out = out.replace(/\\[([^\\]]+)\\]\\((\\S+?)\\)/g,
    (m, label, href) => {
      const external = /^https?:\\/\\//.test(href);
      const attrs = external ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + href + '"' + attrs + '>' + label + '</a>';
    });
  out = out.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[\\s(])\\*([^*\\n]+)\\*/g, '$1<em>$2</em>');
  out = out.replace(/\\\`([^\\\`]+)\\\`/g, '<code>$1</code>');
  return out;
}"""

new = """function inline(text) {
  let out = esc(text);
  out = out.replace(IMAGE, (m, alt, src) => '<img src="' + src + '" alt="' + alt + '" loading="lazy" decoding="async" width="600" height="337">');
  out = out.replace(/\\[([^\\]]+)\\]\\((\\S+?)\\)/g,
    (m, label, href) => {
      const external = /^https?:\\/\\//.test(href);
      const attrs = external ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + href + '"' + attrs + '>' + label + '</a>';
    });
  /* Replacement FUNCTIONS, not replacement strings. In a string replacement "$1" is a capture
     reference and "$14.99" silently becomes "4.99" - which is exactly what happened to every price
     on the site the first time an answer box was written. Functions have no such special syntax. */
  out = out.replace(/\\*\\*([^*]+)\\*\\*/g, (m, body) => '<strong>' + body + '</strong>');
  out = out.replace(/(^|[\\s(])\\*([^*\\n]+)\\*/g, (m, pre, body) => pre + '<em>' + body + '</em>');
  out = out.replace(/\\\`([^\\\`]+)\\\`/g, (m, body) => '<code>' + body + '</code>');
  return out;
}"""
assert old in s, 'inline function not found'
io.open(p, 'w', encoding='utf-8').write(s.replace(old, new, 1))
print('md.mjs: inline replacements are now $-safe')
