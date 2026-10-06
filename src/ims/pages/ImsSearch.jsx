import { useEffect, useMemo, useState } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, PageHeader, Badge, Button, Spinner } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const fmtDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
// Badge tone by module — gives each result a clear colour cue.
const MODULE_TONE = {
  organisation: 'text-[#0e7490] bg-cyan-50 ring-cyan-100',
  governance: 'text-[#7c3aed] bg-violet-50 ring-violet-100',
  finance: 'text-[#15803d] bg-emerald-50 ring-emerald-100',
  programmes: 'text-[#b45309] bg-amber-50 ring-amber-100',
  hr: 'text-[#be123c] bg-rose-50 ring-rose-100',
  compliance: 'text-[#1d4ed8] bg-blue-50 ring-blue-100',
  documents: 'text-[#0f766e] bg-teal-50 ring-teal-100',
  assets: 'text-[#475569] bg-slate-100 ring-slate-200',
  masters: 'text-[#002344] bg-[#002344]/5 ring-[#002344]/10',
};

export default function ImsSearch() {
  const { q: initialQ = '', module: initialModule = '', type: initialType = '', status: initialStatus = '', dateFrom: initialFrom = '', dateTo: initialTo = '' } = useSearch({ from: '/ims/search' });
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const [q, setQ] = useState(initialQ);
  const [debounced, setDebounced] = useState(initialQ.trim());
  const [module, setModule] = useState(initialModule);
  const [type, setType] = useState(initialType);
  const [status, setStatus] = useState(initialStatus);
  const [dateFrom, setDateFrom] = useState(initialFrom);
  const [dateTo, setDateTo] = useState(initialTo);

  const [meta, setMeta] = useState(null);
  const [results, setResults] = useState(null);
  const [counts, setCounts] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [limit, setLimit] = useState(30);

  useEffect(() => { ims.searchMeta().then(setMeta).catch(() => setMeta({ modules: [], types: [] })); }, []);

  // Debounce the query so typing is smooth but still live.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 250);
    return () => clearTimeout(id);
  }, [q]);

  const filters = useMemo(() => ({ module, type, status, dateFrom, dateTo }), [module, type, status, dateFrom, dateTo]);
  const anyFilter = Boolean(module || type || status || dateFrom || dateTo);
  const active = Boolean(debounced || anyFilter);

  useEffect(() => {
    if (!active) { setResults(null); setCounts({}); return; }
    let cancelled = false;
    setBusy(true); setErr('');
    ims.search(debounced, filters)
      .then((r) => { if (!cancelled) { setResults(r.results || []); setCounts(r.counts || {}); } })
      .catch((e) => { if (!cancelled) { setErr(e.message); setResults([]); } })
      .finally(() => { if (!cancelled) setBusy(false); });
    return () => { cancelled = true; };
  }, [debounced, filters, active]);

  const typeOptions = useMemo(() => {
    const types = (meta && meta.types) || [];
    return module ? types.filter((x) => x.module === module) : types;
  }, [meta, module]);

  const clearAll = () => { setQ(''); setModule(''); setType(''); setStatus(''); setDateFrom(''); setDateTo(''); };

  const openRecord = (r) => {
    if (r.key === 'persons' || r.type === 'Person') {
      navigate({ to: '/ims/person/$id', params: { id: String(r.id) } });
    } else if (r.key === 'members') {
      navigate({ to: '/ims/member/$id', params: { id: String(r.id) } });
    } else {
      // Open the record inside its own register (drawer auto-opens via ?open=).
      navigate({ to: '/ims/r/$resource', params: { resource: r.resource }, search: { open: String(r.id) } });
    }
  };

  const shown = results ? results.slice(0, limit) : [];

  const typeLabel = (key) => {
    const x = (meta && meta.types || []).find((tt) => tt.value === key);
    return x ? x.type : key;
  };
  const moduleLabel = (key) => {
    const m = (meta && meta.modules || []).find((mm) => mm.value === key);
    return m ? (m[lang] || m.en) : key;
  };

  return (
    <ImsLayout active="global_search">
      <PageHeader title={t('global_search')} subtitle={t('search_hint')} />

      {/* Prominent universal search box */}
      <div className="relative mb-4 max-w-3xl">
        <Icons.Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6600]" />
        <input
          autoFocus value={q} onChange={(e) => setQ(e.target.value)}
          placeholder={t('search_placeholder')}
          className="w-full rounded-2xl border border-slate-300 bg-white py-4 pl-12 pr-4 text-base shadow-sm outline-none transition focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10"
        />
        {q && (
          <button onClick={() => setQ('')} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100">
            <Icons.X size={16} />
          </button>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-5 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FilterSelect label={t('filter_by_module')} value={module} onChange={(v) => { setModule(v); setType(''); }}>
            <option value="">{t('all')}</option>
            {(meta && meta.modules || []).map((m) => <option key={m.value} value={m.value}>{m[lang] || m.en}</option>)}
          </FilterSelect>
          <FilterSelect label={t('filter_by_record_type')} value={type} onChange={setType}>
            <option value="">{t('all')}</option>
            {typeOptions.map((x) => <option key={x.value} value={x.value}>{x.type}</option>)}
          </FilterSelect>
          <FilterSelect label={t('filter_by_status')} value={status} onChange={setStatus}>
            <option value="">{t('all')}</option>
            {['active', 'approved', 'pending', 'draft', 'completed', 'closed', 'overdue', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
          </FilterSelect>
          <DateFilter label={t('start_date')} value={dateFrom} onChange={setDateFrom} />
          <DateFilter label={t('end_date')} value={dateTo} onChange={setDateTo} />
        </div>
        {anyFilter && (
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" icon="X" onClick={clearAll}>{t('clear_filters')}</Button>
          </div>
        )}
      </Card>

      {err && <Card className="mb-4 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</Card>}

      {/* Initial state — never a premature "No records yet" */}
      {!active && (
        <Card className="flex flex-col items-center gap-2 p-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#002344]/5 text-[#FF6600]"><Icons.Search size={26} /></span>
          <p className="text-sm font-semibold text-slate-700">{t('search_hint')}</p>
          <p className="text-xs text-slate-400">{t('search_everything_hint')}</p>
        </Card>
      )}

      {active && busy && !results && <Spinner />}

      {active && results && results.length === 0 && !busy && (
        <Card className="flex flex-col items-center gap-2 p-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400"><Icons.SearchX size={26} /></span>
          <p className="text-sm font-semibold text-slate-700">{t('no_results_for')} “{debounced || t('filters')}”</p>
          <p className="text-xs text-slate-400">{t('no_results_hint')}</p>
          {anyFilter && <Button variant="ghost" icon="X" onClick={clearAll} className="mt-1">{t('clear_filters')}</Button>}
        </Card>
      )}

      {active && results && results.length > 0 && (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-500"><b className="text-[#002344]">{results.length}</b> {t('results_found')}</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(counts).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, n]) => (
                <span key={k} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">{typeLabel(k)} · {n}</span>
              ))}
            </div>
          </div>

          <Card className="divide-y divide-slate-100">
            {shown.map((r) => (
              <div key={r.key + r.id} className="flex flex-wrap items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ${MODULE_TONE[r.module] || 'text-slate-600 bg-slate-100 ring-slate-200'}`}>{r.type}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{moduleLabel(r.module)}</span>
                  </span>
                  <span className="mt-1 block truncate font-semibold text-[#002344]">{r.title}</span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                    {r.recordId && <span className="font-mono">{r.recordId}</span>}
                    {r.personName && <span className="inline-flex items-center gap-1"><Icons.UserRound size={12} />{r.personName}</span>}
                    {!r.personName && r.subtitle && <span>{r.subtitle}</span>}
                    {r.date && <span>{fmtDate(r.date)}</span>}
                    {r.amount != null && <span className="font-bold text-emerald-700">{money(r.amount)}</span>}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  {r.status && <Badge status={r.status} />}
                  <Button variant="ghost" icon="ExternalLink" onClick={() => openRecord(r)}>{t('open_record')}</Button>
                </span>
              </div>
            ))}
          </Card>

          {results.length > shown.length && (
            <div className="mt-4 flex justify-center">
              <Button variant="ghost" icon="ChevronDown" onClick={() => setLimit((n) => n + 30)}>
                {t('showing')} {shown.length} {t('of')} {results.length}
              </Button>
            </div>
          )}
        </>
      )}
    </ImsLayout>
  );
}

function FilterSelect({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FF6600]"
      >
        {children}
      </select>
    </label>
  );
}

function DateFilter({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type="date" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#FF6600]"
      />
    </label>
  );
}
