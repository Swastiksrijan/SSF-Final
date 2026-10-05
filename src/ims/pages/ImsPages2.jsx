import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, PageHeader, Spinner, Empty, Button, Badge } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { API_BASE_URL } from '../../config/api';

const TOKEN = () => localStorage.getItem('ssf_admin_token') || '';
const get = (path) => fetch(`${API_BASE_URL}${path}`, { headers: { Authorization: `Bearer ${TOKEN()}` } }).then(r => r.json());

/** Reports Centre — real links to report datasets + CSV export. */
export function ImsReports() {
  const { t } = useLang();
  const navigate = useNavigate();
  const reports = [
    ['members', 'Members'], ['committees', 'Committee'], ['committeeMembers', 'Office Bearers'],
    ['meetings', 'Meetings'], ['resolutions', 'Resolutions'], ['actions', 'Actions'],
    ['transactions', 'Transactions'], ['vouchers', 'Vouchers'], ['donations', 'Donations'],
    ['projects', 'Projects'], ['activities', 'Activities'], ['beneficiaries', 'Beneficiaries'],
    ['compliance', 'Compliance'], ['audits', 'Audit'], ['assets', 'Assets'], ['documents', 'Documents'],
  ];
  return (
    <ImsLayout active="reports">
      <PageHeader title={t('reports')} subtitle={t('tagline')} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {reports.map(([res, label]) => (
          <Card key={res} className="flex items-center justify-between p-4">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <div className="flex gap-1">
              <button title="CSV" className="rounded p-1.5 text-slate-500 hover:bg-slate-100" onClick={() => exportCsv(res)}><Icons.Download size={16} /></button>
              <button title="Open" className="rounded p-1.5 text-[#FF6600] hover:bg-orange-50" onClick={() => navigate({ to: '/ims/r/$resource', params: { resource: res } })}><Icons.ExternalLink size={16} /></button>
            </div>
          </Card>
        ))}
      </div>
    </ImsLayout>
  );
}

async function exportCsv(resource) {
  try {
    const { records } = await ims.list(resource, { limit: 500 });
    if (!records || !records.length) return;
    const cols = Object.keys(records[0]).filter(k => typeof records[0][k] !== 'object');
    const csv = [cols.join(',')].concat(records.map(r => cols.map(c => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(','))).join('\n');
    download(`${resource}.csv`, csv, 'text/csv');
  } catch { /* ignore */ }
}

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Institutional Knowledge — documents + policies (real data). */
export function ImsKnowledge() {
  const { t } = useLang();
  const [docs, setDocs] = useState(null);
  const [pols, setPols] = useState(null);
  useEffect(() => {
    ims.list('documents', { limit: 50 }).then(d => setDocs(d.records || [])).catch(() => setDocs([]));
    ims.list('policies', { limit: 50 }).then(d => setPols(d.records || [])).catch(() => setPols([]));
  }, []);
  return (
    <ImsLayout active="knowledge">
      <PageHeader title={t('knowledge')} subtitle={t('tagline')} />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('documents')}</h2>
          {!docs ? <Spinner /> : docs.length === 0 ? <Empty /> : docs.map(d => (
            <div key={d.id} className="flex items-center justify-between border-b border-slate-100 py-2 text-sm last:border-0">
              <span className="text-slate-700">{d.title}</span><span className="font-mono text-xs text-slate-400">{d.recordId}</span>
            </div>
          ))}
        </Card>
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('policies')}</h2>
          {!pols ? <Spinner /> : pols.length === 0 ? <Empty /> : pols.map(p => (
            <div key={p.id} className="flex items-center justify-between border-b border-slate-100 py-2 text-sm last:border-0">
              <span className="text-slate-700">{p.title}</span><span className="text-xs text-slate-400">v{p.version}</span>
            </div>
          ))}
        </Card>
      </div>
    </ImsLayout>
  );
}

/** Institutional History — committees over time. */
export function ImsHistory() {
  const { t } = useLang();
  const [rows, setRows] = useState(null);
  useEffect(() => { ims.list('committees', { limit: 100 }).then(d => setRows(d.records || [])).catch(() => setRows([])); }, []);
  return (
    <ImsLayout active="history">
      <PageHeader title={t('history')} subtitle={t('tagline')} />
      {!rows ? <Spinner /> : rows.length === 0 ? <Card><Empty /></Card> : (
        <div className="space-y-3">
          {rows.map(c => (
            <Card key={c.id} className="flex items-center justify-between p-4">
              <span>
                <span className="block font-semibold text-slate-800">{c.name}</span>
                <span className="block text-xs text-slate-400">{c.termStart} → {c.termEnd} · {c.recordId}</span>
              </span>
              {c.isCurrent && <Badge status="active" />}
            </Card>
          ))}
        </div>
      )}
    </ImsLayout>
  );
}

/** Notifications — communication + notice log. */
export function ImsNotifications() {
  const { t } = useLang();
  const [comms, setComms] = useState(null);
  const [notices, setNotices] = useState(null);
  useEffect(() => {
    ims.list('communications', { limit: 100 }).then(d => setComms(d.records || [])).catch(() => setComms([]));
    ims.list('notices', { limit: 100 }).then(d => setNotices(d.records || [])).catch(() => setNotices([]));
  }, []);
  return (
    <ImsLayout active="notifications">
      <PageHeader title={t('notifications')} subtitle={t('tagline')} />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('communications')}</h2>
          {!comms ? <Spinner /> : comms.length === 0 ? <Empty /> : comms.map(c => (
            <div key={c.id} className="border-b border-slate-100 py-2 text-sm last:border-0">
              <div className="flex justify-between"><span className="font-medium text-slate-700">{c.subject || c.channel}</span><span className="text-xs text-slate-400">{c.deliveryStatus}</span></div>
              <span className="text-xs text-slate-400">{c.recordId}</span>
            </div>
          ))}
        </Card>
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('notices_cases')}</h2>
          {!notices ? <Spinner /> : notices.length === 0 ? <Empty /> : notices.map(n => (
            <div key={n.id} className="border-b border-slate-100 py-2 text-sm last:border-0">
              <div className="flex justify-between"><span className="font-medium text-slate-700">{n.subject}</span><span className="text-xs text-slate-400">{n.deliveryStatus}</span></div>
              <span className="text-xs text-slate-400">{n.recordId}</span>
            </div>
          ))}
        </Card>
      </div>
    </ImsLayout>
  );
}

/** Users & Permissions — roles + default module grants. */
export function ImsPermissions() {
  const { t } = useLang();
  const [data, setData] = useState(null);
  useEffect(() => { ims.roles().then(setData).catch(() => setData({ roles: {}, grants: {} })); }, []);
  return (
    <ImsLayout active="users_perms">
      <PageHeader title={t('users_perms')} subtitle={t('tagline')} />
      {!data ? <Spinner /> : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(data.roles).map(([code, r]) => {
            const g = data.grants[code] || {};
            return (
              <Card key={code} className="p-4">
                <div className="font-semibold text-slate-800">{r.en} <span className="text-xs text-slate-400">/ {r.hi}</span></div>
                <div className="mt-1 font-mono text-[11px] text-slate-400">{code}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(g.modules || []).map(m => <span key={m} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{m}</span>)}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(g.actions || []).map(a => <span key={a} className="rounded bg-orange-100 px-1.5 py-0.5 text-[11px] text-orange-700">{a}</span>)}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </ImsLayout>
  );
}

/** Data Import/Export — portable backup (JSON) + CSV per resource. */
export function ImsData() {
  const { t } = useLang();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const resources = ['persons', 'members', 'committees', 'committeeMembers', 'meetings', 'resolutions', 'actions', 'cases', 'projects', 'activities', 'beneficiaries', 'funds', 'accounts', 'transactions', 'vouchers', 'donors', 'donations', 'grants', 'assets', 'documents', 'compliance', 'audits', 'risks', 'policies', 'governanceRules'];

  const exportAll = async () => {
    setBusy(true); setMsg('');
    try {
      const out = { exportedAt: new Date().toISOString(), data: {} };
      for (const r of resources) {
        try { const d = await ims.list(r, { limit: 500 }); out.data[r] = d.records || []; } catch { out.data[r] = []; }
      }
      download(`ssf-ims-backup-${Date.now()}.json`, JSON.stringify(out, null, 2), 'application/json');
      setMsg('Backup exported.');
    } finally { setBusy(false); }
  };

  return (
    <ImsLayout active="import_export">
      <PageHeader title={t('import_export')} subtitle={t('tagline')} />
      <Card className="p-5">
        <p className="mb-3 text-sm text-slate-600">Export a complete, portable, machine-readable backup of SSF-IMS records. No vendor lock-in.</p>
        <Button icon="Database" onClick={exportAll} disabled={busy}>{busy ? '…' : 'Export full backup (JSON)'}</Button>
        {msg && <p className="mt-2 text-sm text-emerald-600">{msg}</p>}
      </Card>
    </ImsLayout>
  );
}
