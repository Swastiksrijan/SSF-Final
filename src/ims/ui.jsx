// SSF-IMS shared UI primitives (KPI cards, badges, tables, drawer form).
import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useLang } from './LangContext';

export function Card({ children, className = '' }) {
  return <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Kpi({ icon, label, value, tone = 'navy' }) {
  const tones = {
    navy: 'bg-[#002344] text-white',
    orange: 'bg-[#FF6600] text-white',
    green: 'bg-emerald-600 text-white',
    red: 'bg-rose-600 text-white',
    amber: 'bg-amber-500 text-white',
    slate: 'bg-slate-700 text-white',
  };
  const I = Icons[icon] || Icons.Activity;
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${tones[tone]}`}><I size={20} /></span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
        <span className="block text-xl font-bold text-slate-900">{value}</span>
      </span>
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
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{status || '—'}</span>;
}

export function Button({ children, icon, variant = 'primary', ...rest }) {
  const variants = {
    primary: 'bg-[#FF6600] text-white hover:bg-[#e65c00]',
    navy: 'bg-[#002344] text-white hover:bg-[#001529]',
    ghost: 'border border-slate-300 text-slate-700 hover:bg-slate-100',
    danger: 'border border-rose-300 text-rose-600 hover:bg-rose-50',
  };
  const I = icon ? Icons[icon] : null;
  return (
    <button {...rest} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${variants[variant]} ${rest.className || ''}`}>
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
  const [opts, setOpts] = useState({}); // ref:xxx option lists

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
