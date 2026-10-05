// Minimal, dependency-free Markdown renderer for the policy manual.
// Supports: #/##/###/#### headings, bullet + ordered lists, **bold**,
// *italic*, `code`, horizontal rules, and pipe tables. Every non-empty line
// is kept as its own block so the manual's line structure is preserved.

export function slugifyHeading(text) {
  return String(text).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/(^-|-$)/g, '');
}

function inline(text, keyPrefix = '') {
  const nodes = [];
  const re = /(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\*([^*]+)\*)/g;
  let last = 0; let m; let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] != null) nodes.push(<strong key={`${keyPrefix}b${k++}`}>{m[2]}</strong>);
    else if (m[4] != null) nodes.push(<code key={`${keyPrefix}c${k++}`} className="rounded bg-slate-100 px-1 py-0.5 text-[0.85em]">{m[4]}</code>);
    else if (m[6] != null) nodes.push(<em key={`${keyPrefix}i${k++}`}>{m[6]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length ? nodes : text;
}

/** Parse markdown into an array of block descriptors. */
export function parseBlocks(md) {
  const lines = String(md).split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) { i++; continue; }
    if (/^-{3,}\s*$/.test(line)) { blocks.push({ type: 'hr' }); i++; continue; }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { blocks.push({ type: 'heading', level: h[1].length, text: h[2].trim() }); i++; continue; }

    if (/^\s*\|\s*/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        const cells = lines[i].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      blocks.push({ type: 'table', rows });
      continue;
    }
    if (/^\s*[*-]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[*-]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[*-]\s+/, '')); i++; }
      blocks.push({ type: 'ul', items });
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++; }
      blocks.push({ type: 'ol', items });
      continue;
    }
    blocks.push({ type: 'p', text: line.trim() });
    i++;
  }
  return blocks;
}

/** Render a parsed block list to React nodes. */
export function renderBlocks(blocks) {
  return blocks.map((b, idx) => {
    const key = `blk-${idx}`;
    switch (b.type) {
      case 'hr':
        return <hr key={key} className="my-6 border-slate-200" />;
      case 'heading': {
        const id = slugifyHeading(b.text);
        if (b.level === 1) return <h2 key={key} id={id} className="mt-8 mb-3 scroll-mt-24 border-l-4 border-[#FF6600] pl-3 text-lg font-bold text-[#002344]">{inline(b.text, key)}</h2>;
        if (b.level === 2) return <h3 key={key} id={id} className="mt-6 mb-2 scroll-mt-24 text-base font-bold text-[#002344]">{inline(b.text, key)}</h3>;
        return <h4 key={key} id={id} className="mt-4 mb-1.5 scroll-mt-24 text-sm font-bold text-slate-700">{inline(b.text, key)}</h4>;
      }
      case 'ul':
        return <ul key={key} className="my-2 list-disc space-y-1 pl-6 text-slate-700">{b.items.map((t, j) => <li key={j}>{inline(t, `${key}-${j}`)}</li>)}</ul>;
      case 'ol':
        return <ol key={key} className="my-2 list-decimal space-y-1 pl-6 text-slate-700">{b.items.map((t, j) => <li key={j}>{inline(t, `${key}-${j}`)}</li>)}</ol>;
      case 'table':
        return (
          <div key={key} className="my-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <tbody>
                {b.rows.map((row, r) => (
                  <tr key={r} className={r === 0 ? 'bg-[#002344] text-white' : (r % 2 ? 'bg-slate-50' : '')}>
                    {row.map((c, ci) => (
                      <td key={ci} className="border border-slate-200 px-3 py-1.5 align-top">{inline(c, `${key}-${r}-${ci}`)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return <p key={key} className="my-2 leading-relaxed text-slate-700">{inline(b.text, key)}</p>;
    }
  });
}
