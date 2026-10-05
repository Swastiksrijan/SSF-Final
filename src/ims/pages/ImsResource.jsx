import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, PageHeader, Badge, Empty, Spinner, Button, FormDrawer } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { schemaFor, PRIMARY_FIELD } from '../schemas';

export default function ImsResource() {
  const { resource } = useParams({ from: '/ims/r/$resource' });
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const schema = schemaFor(resource);

  const [rows, setRows] = useState(null);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [drawer, setDrawer] = useState(null); // { mode, initial }
  const [saving, setSaving] = useState(false);
  const [duplicates, setDuplicates] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [history, setHistory] = useState(null); // { recordId, history }
  const [err, setErr] = useState('');
  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setRows(null);
    try {
      let r = await ims.list(resource, { search, limit: 100 });
      // Fresh install: the default cost-centre master may never have been
      // seeded; load it once so the register is never empty (idempotent).
      if (resource === 'costCentres' && (r.records || []).length === 0 && !search) {
        try {
          await ims.costCentreSeed();
          r = await ims.list(resource, { search, limit: 100 });
        } catch { /* best-effort */ }
      }
      setRows(r.records || []);
      setTotal(r.total || 0);
    } catch (e) { setErr(e.message); setRows([]); }
  }, [resource, search]);

  useEffect(() => { load(); }, [load]);

  const primary = PRIMARY_FIELD[resource] || 'recordId';
  const title = schema ? t(schema.titleKey) : resource;

  const labelFor = (row) => {
    const v = row[primary];
    if (v) return v;
    return row.recordId;
  };

  const openNew = () => { setDuplicates(null); setPendingPayload(null); setDrawer({ mode: 'create', initial: {} }); };
  const openEdit = (row) => { setDuplicates(null); setDrawer({ mode: 'edit', initial: row, id: row.id }); };

  const submit = async (form) => {
    setSaving(true); setErr('');
    try {
      if (drawer.mode === 'edit') {
        await ims.update(resource, drawer.id, form);
      } else {
        await ims.create(resource, form, false);
      }
      setDrawer(null); setDuplicates(null); setPendingPayload(null);
      await load();
    } catch (e) {
      if (e.status === 409 && e.duplicates) {
        setDuplicates(e.duplicates);
        setPendingPayload(form);
      } else {
        setErr(e.message);
      }
    } finally { setSaving(false); }
  };

  const createAnyway = async () => {
    if (!pendingPayload) return;
    setSaving(true);
    try {
      await ims.create(resource, pendingPayload, true);
      setDrawer(null); setDuplicates(null); setPendingPayload(null);
      await load();
    } catch (e) { setErr(e.message); } finally { setSaving(false); }
  };

  const useExisting = () => {
    const d = duplicates && duplicates[0];
    setDuplicates(null); setPendingPayload(null); setDrawer(null);
    if (d && resource === 'persons') navigate({ to: '/ims/person/$id', params: { id: String(d.id) } });
  };

  const archive = async (row) => {
    if (!confirm(`${t('archive')}: ${labelFor(row)}?`)) return;
    try { await ims.archive(resource, row.id); await load(); } catch (e) { setErr(e.message); }
  };

  const importForm = async () => {
    setImporting(true); setErr(''); setNotice('');
    try {
      const r = await ims.volunteerSeed();
      setNotice(`${t('volunteer_imported_ok')}: ${r.volunteersCreated} / ${r.total}`);
      await load();
    } catch (e) { setErr(e.message); } finally { setImporting(false); }
  };

  return (
    <ImsLayout active={resource}>
      <PageHeader
        title={title}
        subtitle={`${t('showing')} ${rows ? rows.length : 0} ${t('of')} ${total}`}
        actions={<>
          <div className="relative">
            <Icons.Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t('search_placeholder')}
              className="rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-sm outline-none focus:border-[#FF6600]" />
          </div>
          <Button icon="Plus" onClick={openNew}>{t('new_record')}</Button>
          {resource === 'volunteers' && (
            <Button icon="Upload" variant="ghost" onClick={importForm} disabled={importing}>
              {importing ? '…' : t('import_form_responses')}
            </Button>
          )}
        </>}
      />

      {err && <Card className="mb-3 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</Card>}
      {notice && <Card className="mb-3 border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</Card>}
      {resource === 'volunteers' && (
        <p className="mb-3 text-xs text-slate-500">{t('volunteer_import_hint')}</p>
      )}
      {!rows && <Spinner />}

      {rows && rows.length === 0 && (
        <Card><Empty /></Card>
      )}

      {rows && rows.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5 font-semibold">ID</th>
                  <th className="px-4 py-2.5 font-semibold">{title}</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-500">{row.recordId}</td>
                    <td className="px-4 py-2.5">
                      <button className="font-medium text-[#002344] hover:underline"
                        onClick={() => {
                          if (resource === 'persons') navigate({ to: '/ims/person/$id', params: { id: String(row.id) } });
                          else if (resource === 'members') navigate({ to: '/ims/member/$id', params: { id: String(row.id) } });
                        }}>
                        {labelFor(row)}
                      </button>
                    </td>
                    <td className="px-4 py-2.5"><Badge status={row.status} /></td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right">
                      <button onClick={() => openEdit(row)} className="mr-3 text-slate-500 hover:text-[#FF6600]" title={t('edit')}><Icons.Pencil size={16} /></button>
                      <button onClick={() => ims.history(resource, row.id).then(setHistory)} className="mr-3 text-slate-500 hover:text-[#002344]" title={t('history')}><Icons.History size={16} /></button>
                      <button onClick={() => archive(row)} className="text-slate-400 hover:text-rose-600" title={t('archive')}><Icons.Archive size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <FormDrawer
        open={!!drawer}
        title={drawer && drawer.mode === 'edit' ? t('edit') : t('new_record')}
        schema={schema}
        initial={drawer && drawer.initial}
        saving={saving}
        duplicates={duplicates}
        onClose={() => { setDrawer(null); setDuplicates(null); setPendingPayload(null); }}
        onSubmit={submit}
        onUseExisting={useExisting}
        onCreateAnyway={createAnyway}
      />

      {history && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setHistory(null)}>
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <h2 className="font-bold text-slate-900">{t('history')}</h2>
                <p className="font-mono text-xs text-slate-400">{history.recordId}</p>
              </div>
              <button onClick={() => setHistory(null)} className="rounded p-1 hover:bg-slate-100"><Icons.X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {history.history.length === 0 && <p className="text-sm text-slate-400">{t('no_records')}</p>}
              <ol className="relative space-y-4 border-l border-slate-200 pl-4">
                {history.history.map((h, i) => (
                  <li key={h.id} className="relative">
                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-[#FF6600]" />
                    <div className="flex items-center gap-2">
                      <Badge status={h.action} />
                      <span className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {h.action === 'update' ? t('edited_by') : h.action === 'create' ? t('created_by') : t('archived_by')} <b>{h.actor}</b>
                    </p>
                    {h.action === 'update' && h.oldValue && h.newValue && (
                      <ChangeDiff oldValue={h.oldValue} newValue={h.newValue} />
                    )}
                    {h.reason && <p className="mt-1 text-xs text-slate-500">“{h.reason}”</p>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </ImsLayout>
  );
}

function ChangeDiff({ oldValue, newValue }) {
  const skip = new Set(['updatedAt', 'createdAt', 'id']);
  const changes = Object.keys(newValue).filter(k => !skip.has(k) && JSON.stringify(oldValue[k]) !== JSON.stringify(newValue[k]));
  if (changes.length === 0) return null;
  return (
    <ul className="mt-1 space-y-0.5 text-xs">
      {changes.map(k => (
        <li key={k} className="text-slate-500">
          <span className="font-medium text-slate-600">{k}:</span>{' '}
          <span className="text-rose-500 line-through">{fmt(oldValue[k])}</span>{' → '}
          <span className="text-emerald-600">{fmt(newValue[k])}</span>
        </li>
      ))}
    </ul>
  );
}

const fmt = (v) => (v === null || v === undefined || v === '' ? '—' : String(v).slice(0, 60));
