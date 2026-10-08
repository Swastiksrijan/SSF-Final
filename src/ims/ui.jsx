// SSF-IMS shared UI primitives (KPI cards, badges, tables, drawer form).
import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { useLang } from './LangContext';

export function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(2,35,68,0.04),0_8px_24px_-12px_rgba(2,35,68,0.12)] ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-black tracking-tight text-[#002344]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Kpi({ icon, label, value, tone = 'navy' }) {
  const tones = {
    navy: 'from-[#002344] to-[#0b3a63] text-white',
    blue: 'from-[#2563EB] to-[#3b82f6] text-white',
    deepblue: 'from-[#1E3A8A] to-[#2563EB] text-white',
    purple: 'from-[#7C3AED] to-[#9333ea] text-white',
    orange: 'from-[#FF6600] to-[#ff8a3d] text-white',
    green: 'from-[#16A34A] to-emerald-500 text-white',
    teal: 'from-[#0F766E] to-[#0e7490] text-white',
    red: 'from-[#DC2626] to-rose-500 text-white',
    amber: 'from-[#D97706] to-amber-400 text-white',
    slate: 'from-slate-700 to-slate-600 text-white',
  };
  const I = Icons[icon] || Icons.Activity;
  return (
    <Card className="group relative overflow-hidden p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(2,35,68,0.28)]">
      <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-slate-50 transition-colors group-hover:bg-slate-100/80" />
      <div className="relative flex items-center gap-3.5">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br shadow-sm ring-1 ring-black/5 ${tones[tone]}`}><I size={21} /></span>
        <span className="min-w-0">
          <span className="block truncate text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
          <span className="block truncate text-[22px] font-black leading-tight tracking-tight text-[#002344]">{value}</span>
        </span>
      </div>
    </Card>
  );
}

const BADGE = {
  active: 'bg-emerald-100 text-emerald-700', approved: 'bg-emerald-100 text-emerald-700', completed: 'bg-emerald-100 text-emerald-700', filed: 'bg-emerald-100 text-emerald-700', present: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700', draft: 'bg-slate-100 text-slate-600', review: 'bg-amber-100 text-amber-700', inProgress: 'bg-blue-100 text-blue-700',
  overdue: 'bg-rose-100 text-rose-700', rejected: 'bg-rose-100 text-rose-700', cancelled: 'bg-slate-100 text-slate-500', archived: 'bg-slate-100 text-slate-500', absent: 'bg-rose-100 text-rose-700',
  closed: 'bg-slate-100 text-slate-600', detected: 'bg-rose-100 text-rose-700', assigned: 'bg-blue-100 text-blue-700', notified: 'bg-amber-100 text-amber-700', decision: 'bg-indigo-100 text-indigo-700', action: 'bg-blue-100 text-blue-700', followUp: 'bg-amber-100 text-amber-700',
};

export function Badge({ status }) {
  const cls = BADGE[status] || 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status || '—'}
    </span>
  );
}

export function Button({ children, icon, variant = 'primary', ...rest }) {
  const variants = {
    primary: 'bg-[#FF6600] text-white hover:bg-[#e65c00] shadow-sm shadow-orange-500/20',
    navy: 'bg-[#002344] text-white hover:bg-[#001529] shadow-sm shadow-[#002344]/20',
    ghost: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400',
    hero: 'bg-white text-[#002344] hover:bg-zinc-100 shadow-sm',
    danger: 'border border-rose-300 bg-white text-rose-600 hover:bg-rose-50',
  };
  const I = icon ? Icons[icon] : null;
  return (
    <button {...rest} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]/40 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${rest.className || ''}`}>
      {I && <I size={16} />}{children}
    </button>
  );
}

export function Empty({ label }) {
  const { t } = useLang();
  return (
    <div className="grid place-items-center gap-2 py-14 text-slate-400">
      <Icons.Inbox size={32} />
      <span className="text-sm">{label || t('no_records')}</span>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="grid place-items-center py-16 text-slate-400">
      <Icons.Loader2 className="animate-spin" size={26} />
    </div>
  );
}

/** Generic right-side drawer form driven by a field schema. */
export function FormDrawer({ open, title, schema, initial, onClose, onSubmit, saving, duplicates, onUseExisting, onCreateAnyway }) {
  const { t, lang } = useLang();
  const [form, setForm] = useState(initial || {});
  // The drawer stays mounted between records, so reset the form whenever a
  // different record (or create mode) is opened. Without this the fields keep
  // the previous/empty state and an edit would blank out the record on save.
  const initialKey = initial && initial.id != null ? `id:${initial.id}` : 'new';
  useEffect(() => {
    setForm(initial || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey, open]);

  if (!open) return null;
  const fields = (schema && schema.fields) || [];
  const set = (n, v) => setForm(f => ({ ...f, [n]: v }));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-slate-100"><Icons.X size={18} /></button>
        </div>

        {duplicates && duplicates.length > 0 && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm">
            <p className="font-semibold text-amber-800">{t('possible_duplicate')}</p>
            <ul className="mt-1 space-y-0.5 text-amber-700">
              {duplicates.map((d, i) => <li key={i}>• {d.name || d.recordId} ({d.recordId})</li>)}
            </ul>
            <div className="mt-2 flex gap-2">
              <Button variant="ghost" onClick={onUseExisting}>{t('use_existing')}</Button>
              <Button variant="navy" onClick={onCreateAnyway}>{t('create_anyway')}</Button>
            </div>
          </div>
        )}

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {fields.map(f => {
            const label = Array.isArray(f.l) ? (lang === 'hi' ? f.l[1] : f.l[0]) : f.name;
            const val = form[f.name] ?? '';
            if (f.type === 'textarea') {
              return <Field key={f.name} label={label} required={f.required}>
                <textarea rows={3} className={inputCls} value={val} onChange={e => set(f.name, e.target.value)} /></Field>;
            }
            if (f.type === 'checkbox') {
              return <label key={f.name} className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={!!form[f.name]} onChange={e => set(f.name, e.target.checked)} />{label}</label>;
            }
            if (f.type === 'select') {
              return <Field key={f.name} label={label} required={f.required}>
                <select className={inputCls} value={val} onChange={e => set(f.name, e.target.value)}>
                  <option value="">—</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select></Field>;
            }
            if (f.type && f.type.startsWith('ref:')) {
              const r = f.type.slice(4);
              return <RefField key={f.name} label={label} required={f.required} resource={r}
                value={val} onChange={v => set(f.name, v)} />;
            }
            // A stored file (uploaded data URL or a link) must not be dumped into
            // a plain text input: multi-megabyte values freeze the drawer and are
            // unreadable. Show a compact open/download link with a clear action.
            if (typeof val === 'string' && val.length > 240 && (val.startsWith('data:') || /^https?:\/\//.test(val))) {
              const kind = val.startsWith('data:image') ? 'Image' : val.startsWith('data:application/pdf') ? 'PDF' : 'File';
              return <Field key={f.name} label={label}>
                <div className="flex items-center gap-2">
                  <a href={val} target="_blank" rel="noreferrer" download
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-[#002344] hover:border-[#FF6600] hover:text-[#FF6600]">
                    <Icons.Download size={15} /> {kind}
                  </a>
                  <button type="button" onClick={() => set(f.name, '')} className="text-xs text-slate-400 hover:text-rose-500">{t('cancel')}</button>
                </div>
              </Field>;
            }
            return <Field key={f.name} label={label} required={f.required}>
              <input type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                className={inputCls} value={val} onChange={e => set(f.name, f.type === 'number' ? e.target.value : e.target.value)} /></Field>;
          })}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3">
          <Button variant="ghost" onClick={onClose}>{t('cancel')}</Button>
          <Button icon="Check" onClick={() => onSubmit(form)} disabled={saving}>{saving ? '…' : t('save')}</Button>
        </div>
      </div>
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#FF6600]';

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}{required && <span className="text-rose-500"> *</span>}</span>
      {children}
    </label>
  );
}

function RefField({ label, required, resource, value, onChange }) {
  const [options, setOptions] = useState(null);
  const [open, setOpen] = useState(false);
  const load = async () => {
    if (options) { setOpen(true); return; }
    try {
      const { list } = await import('./api');
      const { records } = await list(resource, { limit: 200 });
      setOptions(records);
    } catch { setOptions([]); }
    setOpen(true);
  };
  const chosen = options && options.find(o => String(o.id) === String(value));
  return (
    <Field label={label} required={required}>
      <button type="button" onClick={load} className={inputCls + ' text-left'}>
        {chosen ? (chosen.fullName || chosen.name || chosen.title || chosen.label || chosen.recordId) : (value ? `#${value}` : '—')}
      </button>
      {open && (
        <div className="mt-1 max-h-44 overflow-auto rounded-lg border border-slate-200 bg-white shadow">
          {(options || []).map(o => (
            <button key={o.id} type="button" className="block w-full px-3 py-1.5 text-left text-sm hover:bg-slate-100"
              onClick={() => { onChange(o.id); setOpen(false); }}>
              {o.fullName || o.name || o.title || o.label || o.obligation || o.recordId}
              <span className="ml-2 text-xs text-slate-400">{o.recordId}</span>
            </button>
          ))}
          {(!options || options.length === 0) && <div className="px-3 py-2 text-sm text-slate-400">—</div>}
        </div>
      )}
    </Field>
  );
}

// ---- premium section primitives -------------------------------------------
// Bilingual tab strip used by every module workspace (Meetings, Members,
// Notices & Cases, Activities). Hindi shown in brackets so nothing is lost.
export function Tabs({ tabs = [], value, onChange }) {
  const { lang } = useLang();
  return (
    <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tb) => {
        const on = tb.id === value;
        const label = lang === 'hi' && tb.hi ? `${tb.hi} (${tb.en})` : tb.en;
        return (
          <button key={tb.id} type="button" onClick={() => onChange(tb.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all duration-150 ${on ? 'bg-[#002344] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {label}
            {tb.count != null && (
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-black ${on ? 'bg-white/20 text-white' : 'bg-white text-slate-500'}`}>{tb.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Small strip of metric tiles (used under a section hero).
export function StatStrip({ items = [] }) {
  const { t } = useLang();
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {items.map((s, i) => (
        <Kpi key={i} icon={s.icon || 'Activity'} label={s.labelKey ? t(s.labelKey) : s.label} value={s.value} tone={s.tone || 'navy'} />
      ))}
    </div>
  );
}

// Premium navy hero for a section/workspace page.
export function SectionHero({ title, hi, eyebrow, icon = 'LayoutDashboard', tone = 'navy', actions, children }) {
  const { lang } = useLang();
  const I = Icons[icon] || Icons.LayoutDashboard;
  const tones = {
    navy: 'from-[#002344] to-[#0b3a63]',
    blue: 'from-[#1E3A8A] to-[#2563EB]',
    deepblue: 'from-[#1E3A8A] to-[#1d4ed8]',
    purple: 'from-[#6d28d9] to-[#7C3AED]',
    orange: 'from-[#c2410c] to-[#FF6600]',
    teal: 'from-[#134e4a] to-[#0e7490]',
    green: 'from-[#065f46] to-emerald-600',
    amber: 'from-[#b45309] to-[#D97706]',
    slate: 'from-slate-700 to-slate-600',
  };
  return (
    <section className={`relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br ${tones[tone] || tones.navy} p-6 text-white shadow-[0_18px_40px_-20px_rgba(2,35,68,0.55)] sm:p-7`}>
      <span className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
      <span className="pointer-events-none absolute -bottom-24 right-24 h-44 w-44 rounded-full bg-white/5" />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20"><I size={24} /></span>
          <div>
            {eyebrow && <p className="text-[11px] font-black uppercase tracking-[.22em] text-[#FFD166]">{eyebrow}</p>}
            <h1 className="mt-1.5 text-2xl font-black leading-tight tracking-tight sm:text-[32px]">{title}</h1>
            {hi && lang !== 'hi' && <p className="mt-1 text-sm font-semibold text-white/70">{hi}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children && <div className="relative mt-5">{children}</div>}
    </section>
  );
}

// Data table: columns = [{ key, en, hi, render?, className?, align? }]
export function DataTable({ columns = [], rows = [], loading, empty, onRowClick }) {
  const { lang } = useLang();
  if (loading) return <Spinner />;
  if (!rows || rows.length === 0) return <Card><Empty label={empty} /></Card>;
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {columns.map((c, i) => (
                <th key={i} className={`px-4 py-3 font-bold ${c.align === 'right' ? 'text-right' : ''}`}>
                  {lang === 'hi' && c.hi ? c.hi : c.en}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r, ri) => (
              <tr key={r.id || ri} className={`transition-colors hover:bg-[#F5F8FC] ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={onRowClick ? () => onRowClick(r) : undefined}>
                {columns.map((c, ci) => (
                  <td key={ci} className={`px-4 py-3 text-slate-700 ${c.className || ''} ${c.align === 'right' ? 'text-right' : ''}`}>
                    {c.render ? c.render(r) : (r[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// Horizontal lifecycle / status strip (e.g. case stages, due chain).
export function Lifecycle({ steps = [], value }) {
  const { lang } = useLang();
  const idx = Math.max(0, steps.findIndex((s) => s.id === value));
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((s, i) => {
        const done = i < idx;
        const on = i === idx;
        const label = lang === 'hi' && s.hi ? s.hi : s.en;
        return (
          <span key={s.id} className="flex items-center gap-1.5">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${on ? 'bg-[#FF6600] text-white' : done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
              {label}
            </span>
            {i < steps.length - 1 && <Icons.ChevronRight size={13} className="text-slate-300" />}
          </span>
        );
      })}
    </div>
  );
}

// Detail modal with a title, subtitle, actions and body.
export function DetailModal({ open, onClose, title, subtitle, badge, actions, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 sm:p-6" onClick={onClose}>
      <div className={`w-full ${wide ? 'max-w-4xl' : 'max-w-2xl'} rounded-2xl bg-white shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-black text-[#002344]">{title}</h2>
              {badge}
            </div>
            {subtitle && <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <button onClick={onClose} className="rounded p-1.5 hover:bg-slate-100"><Icons.X size={18} /></button>
          </div>
        </div>
        <div className="max-h-[72vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

// Label/value pair used inside detail modals.
export function Field2({ label, value, full }) {
  const { lang } = useLang();
  const l = Array.isArray(label) ? (lang === 'hi' ? label[1] : label[0]) : label;
  return (
    <div className={full ? 'col-span-2' : ''}>
      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{l}</div>
      <div className="mt-0.5 text-sm text-slate-800">{value === null || value === undefined || value === '' ? '—' : String(value)}</div>
    </div>
  );
}

// Small record card (list item) with a click target.
export function RecordCard({ title, subtitle, right, onClick, icon = 'FileText' }) {
  const I = Icons[icon] || Icons.FileText;
  return (
    <button type="button" onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left transition-all duration-150 hover:border-[#002344]/25 hover:shadow-[0_10px_26px_-14px_rgba(2,35,68,0.3)]">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-[#002344]"><I size={18} /></span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-slate-800">{title}</span>
        {subtitle && <span className="block truncate text-xs text-slate-400">{subtitle}</span>}
      </span>
      {right}
      <Icons.ChevronRight size={16} className="shrink-0 text-slate-300" />
    </button>
  );
}

// Pill toggle for quick filters (e.g. "Only ₹0 activities").
export function Toggle({ on, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!on)}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition ${on ? 'border-[#002344] bg-[#002344] text-white' : 'border-slate-300 bg-white text-slate-600'}`}>
      <span className={`h-2 w-2 rounded-full ${on ? 'bg-[#FFD166]' : 'bg-slate-300'}`} />
      {label}
    </button>
  );
}

// Read-only relation list (Related Records) for a detail view.
export function RelatedList({ relations = [], onOpen }) {
  const { t } = useLang();
  if (!relations.length) return <p className="text-sm text-slate-400">{t('no_records')}</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {relations.map((r, i) => (
        <button key={i} type="button" onClick={() => onOpen && onOpen(r)}
          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200">
          {r.relation}: <b>{r.type}</b> #{r.id}
        </button>
      ))}
    </div>
  );
}

