// Code-generated SVG charts for SSF-IMS (no chart library, no stock assets).
// Brand palette: navy #002344 / #001529, orange #FF6600, amber #FFD166.
const NAVY = '#002344';
const ORANGE = '#FF6600';
const AMBER = '#FFD166';
const TONES = [NAVY, ORANGE, AMBER, '#0e7490', '#15803d', '#7c3aed', '#be123c', '#475569'];

/** Simple two-column bar chart. data = [{ label, value }] */
export function BarChart({ data = [], height = 180, color = ORANGE, valueFmt = (v) => v }) {
  const rows = data.filter((d) => d && d.value != null);
  if (!rows.length) return <EmptyChart height={height} />;
  const max = Math.max(...rows.map((d) => Number(d.value) || 0), 1);
  const rowH = 30;
  const labelW = 150;
  return (
    <svg viewBox={`0 0 640 ${rows.length * rowH + 16}`} width="100%" height={rows.length * rowH + 16} role="img">
      {rows.map((d, i) => {
        const y = i * rowH + 8;
        const w = Math.max(2, ((Number(d.value) || 0) / max) * (640 - labelW - 90));
        return (
          <g key={i}>
            <text x={0} y={y + 17} fontSize="12" fill="#475569">{String(d.label).slice(0, 24)}</text>
            <rect x={labelW} y={y + 4} width={640 - labelW - 90} height={18} rx="4" fill="#eef2f7" />
            <rect x={labelW} y={y + 4} width={w} height={18} rx="4" fill={d.color || color} />
            <text x={640} y={y + 17} fontSize="12" fontWeight="700" textAnchor="end" fill={NAVY}>{valueFmt(d.value)}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** Vertical bars, good for trends. data = [{ label, value }] */
export function ColumnChart({ data = [], height = 200, color = NAVY }) {
  const rows = data.filter((d) => d && d.value != null);
  if (!rows.length) return <EmptyChart height={height} />;
  const max = Math.max(...rows.map((d) => Number(d.value) || 0), 1);
  const w = 640, h = height, pad = 26, bottom = 28;
  const colW = (w - pad * 2) / rows.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} role="img">
      <line x1={pad} y1={h - bottom} x2={w - pad} y2={h - bottom} stroke="#cbd5e1" />
      {rows.map((d, i) => {
        const bh = ((Number(d.value) || 0) / max) * (h - pad - bottom);
        const x = pad + i * colW + colW * 0.18;
        const bw = colW * 0.64;
        return (
          <g key={i}>
            <rect x={x} y={h - bottom - bh} width={bw} height={bh} rx="4" fill={d.color || color} />
            <text x={x + bw / 2} y={h - bottom - bh - 4} fontSize="10" textAnchor="middle" fill="#64748b">{d.value}</text>
            <text x={x + bw / 2} y={h - bottom + 15} fontSize="10" textAnchor="middle" fill="#475569">{String(d.label).slice(0, 8)}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** Donut chart. data = [{ label, value }] */
export function DonutChart({ data = [], size = 190, thickness = 34 }) {
  const rows = data.filter((d) => d && Number(d.value) > 0);
  const total = rows.reduce((s, d) => s + Number(d.value), 0);
  if (!total) return <EmptyChart height={size} />;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img">
        <circle cx={c} cy={c} r={r} fill="none" stroke="#eef2f7" strokeWidth={thickness} />
        {rows.map((d, i) => {
          const frac = Number(d.value) / total;
          const dash = frac * circ;
          const el = (
            <circle
              key={i} cx={c} cy={c} r={r} fill="none"
              stroke={d.color || TONES[i % TONES.length]}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${c} ${c})`}
            />
          );
          offset += dash;
          return el;
        })}
        <text x={c} y={c - 2} textAnchor="middle" fontSize="22" fontWeight="800" fill={NAVY}>{total}</text>
        <text x={c} y={c + 16} textAnchor="middle" fontSize="11" fill="#64748b">total</text>
      </svg>
      <ul className="space-y-1 text-sm">
        {rows.map((d, i) => (
          <li key={i} className="flex items-center gap-2 text-slate-700">
            <span className="h-3 w-3 rounded-sm" style={{ background: d.color || TONES[i % TONES.length] }} />
            {d.label}
            <span className="font-semibold text-slate-900">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyChart({ height }) {
  return (
    <div className="flex items-center justify-center text-sm text-slate-400" style={{ height }}>
      No data to chart yet · अभी कोई डेटा नहीं
    </div>
  );
}
