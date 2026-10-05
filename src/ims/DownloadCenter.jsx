// SSF-IMS Download Center — pick any register + format (CSV / Excel / PDF),
// mirroring the legacy SSF Digital Office "Download / Export" dropdown.
import { useEffect, useRef, useState } from 'react';
import * as Icons from 'lucide-react';
import { NAV } from './nav';
import { useLang } from './LangContext';
import { tBoth } from './i18n';
import { ims } from './api';
import { exportRecordsPdf } from './pdf';
import { exportRecordsExcel } from './excel';

// Every nav item that browses a resource is downloadable.
const RESOURCES = [];
NAV.forEach((g) => g.items.forEach((it) => {
  if (it.resource) RESOURCES.push({ group: g.group, resource: it.resource, key: it.key });
}));

function toCsv(rows) {
  const cols = Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== 'object');
  return [cols.join(',')]
    .concat(rows.map((r) => cols.map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(',')))
    .join('\n');
}

function downloadBlob(name, content, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

const FORMATS = [
  { id: 'csv', label: 'CSV', icon: 'Download' },
  { id: 'excel', label: 'Excel', icon: 'Table2' },
  { id: 'pdf', label: 'PDF', icon: 'FileText' },
];

const isResource = (r) => RESOURCES.some((x) => x.resource === r);

export default function DownloadCenter({ defaultResource, align = 'right', variant = 'bar' }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(isResource(defaultResource) ? defaultResource : RESOURCES[0]?.resource || 'persons');
  const [format, setFormat] = useState('pdf');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (isResource(defaultResource)) setTarget(defaultResource);
  }, [defaultResource]);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const labelFor = (resource) => {
    const item = RESOURCES.find((r) => r.resource === resource);
    return item ? t(item.key) : resource;
  };

  const download = async () => {
    if (busy) return;
    setBusy(true);
    setMsg('');
    try {
      const { records } = await ims.list(target, { limit: 5000 });
      const rows = records || [];
      if (!rows.length) {
        setMsg(lang === 'hi' ? 'इस पंजिका में कोई रिकॉर्ड नहीं मिला।' : 'No records found in this register.');
        return;
      }
      const label = labelFor(target);
      const stamp = new Date().toISOString().slice(0, 10);
      if (format === 'pdf') exportRecordsPdf({ title: label, subtitle: `${target} register`, records: rows, lang });
      else if (format === 'excel') await exportRecordsExcel({ title: label, records: rows, sheetName: label });
      else downloadBlob(`${target}-${stamp}.csv`, toCsv(rows), 'text/csv');
      setOpen(false);
    } catch (e) {
      setMsg(e.message || 'Download failed.');
    } finally {
      setBusy(false);
    }
  };

  const triggerClass = variant === 'hero'
    ? 'inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-[#002344] hover:bg-zinc-100'
    : 'inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15';

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} className={triggerClass}>
        <Icons.Download size={variant === 'hero' ? 16 : 14} /> {variant === 'hero' ? t('download_export') : t('download')}
      </button>
      {open && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-11 z-[70] w-[min(92vw,390px)] rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl`}>
          <div className="text-lg font-black text-[#002344]">{t('what_download')}</div>
          <p className="mt-1 text-xs text-slate-500">{t('select_register_hint')}</p>

          <label className="mt-4 mb-1 block text-xs font-bold text-slate-500">{t('select_register')}</label>
          <select value={target} onChange={(e) => setTarget(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#002344]/20">
            {NAV.map((g) => {
              const opts = g.items.filter((it) => it.resource);
              if (!opts.length) return null;
              return (
                <optgroup key={g.group} label={t(g.group)}>
                  {opts.map((it) => {
                    const both = tBoth(it.key);
                    return <option key={it.resource} value={it.resource}>{lang === 'hi' ? `${both[1]} (${both[0]})` : both[0]}</option>;
                  })}
                </optgroup>
              );
            })}
          </select>

          <label className="mt-3 mb-1 block text-xs font-bold text-slate-500">{t('format')}</label>
          <div className="grid grid-cols-3 gap-2">
            {FORMATS.map((f) => (
              <button key={f.id} type="button" onClick={() => setFormat(f.id)}
                className={`rounded-xl border px-3 py-3 text-sm font-bold ${format === f.id ? 'border-[#002344] bg-[#002344] text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                {f.label}
              </button>
            ))}
          </div>

          {msg && <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">{msg}</p>}

          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">{t('cancel')}</button>
            <button type="button" disabled={busy} onClick={download} className="flex-1 rounded-xl bg-[#002344] px-3 py-2.5 text-sm font-bold text-white disabled:opacity-40">{busy ? t('preparing') : t('download')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
