import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, PageHeader, Spinner, Empty, Badge } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { API_BASE_URL } from '../../config/api';

const TOKEN = () => localStorage.getItem('ssf_admin_token') || '';
const get = (path) => fetch(`${API_BASE_URL}${path}`, { headers: { Authorization: `Bearer ${TOKEN()}` } }).then(r => r.json());

/** Audit Trail viewer */
export function ImsAuditTrail() {
  const { t } = useLang();
  const [rows, setRows] = useState(null);
  useEffect(() => { get('/api/ims/audit-trail?limit=200').then(d => setRows(d.records || [])).catch(() => setRows([])); }, []);
  return (
    <ImsLayout active="audit_trail">
      <PageHeader title={t('audit_trail')} subtitle={t('tagline')} />
      {!rows && <Spinner />}
      {rows && rows.length === 0 && <Card><Empty /></Card>}
      {rows && rows.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead><tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-2.5">Action</th><th className="px-4 py-2.5">Entity</th><th className="px-4 py-2.5">Actor</th><th className="px-4 py-2.5">When</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5"><Badge status={r.action} /></td>
                    <td className="px-4 py-2.5"><span className="font-medium text-slate-700">{r.entityType}</span><span className="ml-2 font-mono text-xs text-slate-400">{r.entityId}</span></td>
                    <td className="px-4 py-2.5 text-slate-600">{r.actor}</td>
                    <td className="px-4 py-2.5 text-slate-500">{new Date(r.createdAt).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </ImsLayout>
  );
}

/** Data Integrity dashboard */
export function ImsIntegrity() {
  const { t } = useLang();
  const [data, setData] = useState(null);
  useEffect(() => { get('/api/ims/integrity').then(setData).catch(() => setData({ checks: [], totalIssues: 0 })); }, []);
  return (
    <ImsLayout active="integrity">
      <PageHeader title={t('integrity')} subtitle={t('tagline')} />
      {!data && <Spinner />}
      {data && (
        <>
          <Card className="mb-4 flex items-center justify-between p-4">
            <span className="text-sm font-semibold text-slate-600">Total issues</span>
            <span className={`text-2xl font-bold ${data.totalIssues ? 'text-rose-600' : 'text-emerald-600'}`}>{data.totalIssues}</span>
          </Card>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.checks.map(c => (
              <Card key={c.key} className="flex items-center justify-between p-4">
                <span className="text-sm text-slate-700">{c.label}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${c.count ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{c.count}</span>
              </Card>
            ))}
          </div>
        </>
      )}
    </ImsLayout>
  );
}

/** Simple module dashboard (KPI cards from module-dashboard endpoint). */
export function ImsModuleDashboard({ module, titleKey, icon = 'BarChart3', active }) {
  const { t } = useLang();
  const [data, setData] = useState(null);
  const I = Icons[icon] || Icons.BarChart3;
  useEffect(() => { ims.moduleDashboard(module).then(setData).catch(() => setData({ kpis: {} })); }, [module]);
  return (
    <ImsLayout active={active || module}>
      <PageHeader title={t(titleKey)} subtitle={t('tagline')} />
      {!data && <Spinner />}
      {data && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {Object.entries(data.kpis).map(([k, v]) => (
            <Card key={k} className="flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#002344] text-white"><I size={20} /></span>
              <span>
                <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">{k}</span>
                <span className="block text-xl font-bold text-slate-900">{typeof v === 'number' && k.match(/income|expense|net|amount/i) ? '₹' + v.toLocaleString('en-IN') : v}</span>
              </span>
            </Card>
          ))}
        </div>
      )}
    </ImsLayout>
  );
}

/** Registers Required (per Niyamavali) — live map of statutory registers → IMS masters. */
export function ImsRegisters() {
  const { t, lang } = useLang();
  const [data, setData] = useState(null);
  useEffect(() => { get('/api/ims/register-map').then(setData).catch(() => setData(null)); }, []);
  const GROUP_LABEL = {
    governance: ['Governance / शासन', 'शासन'],
    finance: ['Finance / वित्त', 'वित्त'],
    programme: ['Programmes / कार्यक्रम', 'कार्यक्रम'],
    compliance: ['Compliance / अनुपालन', 'अनुपालन'],
    hr: ['People / मानव संसाधन', 'मानव संसाधन'],
  };
  return (
    <ImsLayout active="registers_required">
      <PageHeader
        title={t('registers_required')}
        subtitle={lang === 'hi' ? 'नियमावली के अनुसार संस्था को कुल इतनी पंजिकाएँ चाहिए — नीचे हर पंजिका का असली मास्टर और गिनती है।' : 'Per the SSF Niyamavali, this is the full set of registers the organisation needs — each mapped to its real IMS master with a live count.'}
      />
      {!data && <Spinner />}
      {data && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
            <Card className="p-4"><span className="block text-xs uppercase tracking-wide text-slate-400">Total</span><span className="text-2xl font-bold text-[#002344]">{data.total}</span></Card>
            {data.byGroup.map(g => (
              <Card key={g.group} className="p-4">
                <span className="block text-xs uppercase tracking-wide text-slate-400">{GROUP_LABEL[g.group] ? (lang === 'hi' ? GROUP_LABEL[g.group][1] : GROUP_LABEL[g.group][0]) : g.group}</span>
                <span className="text-2xl font-bold text-slate-800">{g.count}</span>
              </Card>
            ))}
          </div>
          {data.groups.map(g => (
            <section key={g} className="mb-5">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">{GROUP_LABEL[g] ? (lang === 'hi' ? GROUP_LABEL[g][1] : GROUP_LABEL[g][0]) : g}</h2>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead><tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                      <th className="px-4 py-2.5">Register</th><th className="px-4 py-2.5">पंजिका</th>
                      <th className="px-4 py-2.5">Basis (Niyamavali)</th><th className="px-4 py-2.5 text-right">Records</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.registers.filter(r => r.group === g).map(r => (
                        <tr key={r.rule} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 font-medium text-slate-800">{r.en}</td>
                          <td className="px-4 py-2.5 text-slate-600">{r.hi}</td>
                          <td className="px-4 py-2.5 text-xs text-slate-500">{r.basis}</td>
                          <td className="px-4 py-2.5 text-right">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${r.count ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{r.count}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>
          ))}
        </>
      )}
    </ImsLayout>
  );
}

/** Constitution & Bylaws — reads governance rules (configurable, versioned). */
export function ImsConstitution() {
  const { t, lang } = useLang();
  const [rows, setRows] = useState(null);
  useEffect(() => { ims.list('governanceRules', { limit: 200 }).then(d => setRows(d.records || [])).catch(() => setRows([])); }, []);
  return (
    <ImsLayout active="constitution">
      <PageHeader title={t('constitution')} subtitle={t('tagline')} />
      {!rows && <Spinner />}
      {rows && (
        <Card className="divide-y divide-slate-100">
          {rows.map(r => (
            <div key={r.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{r.key} · {r.value}</span>
                <span className="text-xs text-slate-400">{r.source}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{lang === 'hi' && r.ruleTextHi ? r.ruleTextHi : r.ruleText}</p>
            </div>
          ))}
        </Card>
      )}
    </ImsLayout>
  );
}
