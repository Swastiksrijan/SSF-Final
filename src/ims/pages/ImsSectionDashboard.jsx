import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, Spinner, SectionHero, StatStrip, Button } from '../ui';
import { BarChart, ColumnChart } from '../charts';
import { useLang } from '../LangContext';
import { tBoth } from '../i18n';
import { ims } from '../api';
import { SECTIONS as SECTION_CFG, sectionGroups } from '../sectionModules';

// KPI keys charted per section (only those present in the API response show up).
const CHARTS = {
  organisation: ['governanceRules', 'policies', 'committees', 'organisations'],
  governance: ['members', 'meetings', 'pendingActions', 'openCases', 'notices'],
  programmes: ['programmes', 'projects', 'activities', 'beneficiaries', 'freeActivities'],
  finance: ['income', 'expense', 'net', 'vouchers', 'accounts'],
  resources: ['donors', 'grants', 'assets', 'employees', 'volunteers'],
  compliance: ['pending', 'overdue', 'filed', 'auditsOpen', 'highRisks'],
  records: ['documents', 'communications', 'policies', 'governanceRules'],
  admin: ['users', 'documents', 'auditTrail'],
};

export default function ImsSectionDashboard({ section }) {
  const cfg = SECTION_CFG[section] || SECTION_CFG.governance;
  const groups = sectionGroups(section);
  const chartKeys = CHARTS[section] || [];
  const { t } = useLang();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    ims.moduleDashboard(cfg.module).then(setData).catch(() => setData({ kpis: {} }));
  }, [cfg.module]);

  const kpis = (data && data.kpis) || {};
  const num = (k) => Number(kpis[k] || 0);
  const chartData = chartKeys
    .filter((k) => k in kpis)
    .map((k) => ({ label: t(k) !== k ? t(k) : k, value: num(k) }));

  const go = (l) => {
    if (l.path) navigate({ to: l.path });
    else navigate({ to: '/ims/r/$resource', params: { resource: l.resource } });
  };

  return (
    <ImsLayout active={`${section}_dashboard`}>
      <SectionHero
        title={t(cfg.titleKey)}
        hi={tBoth(cfg.titleKey)[1]}
        eyebrow={t('app_name') + ' · ' + t('management_system')}
        icon={cfg.icon}
        tone={cfg.tone}
        actions={<Button variant="hero" icon="LayoutDashboard" onClick={() => navigate({ to: '/ims' })}>{t('main_dashboard')}</Button>}
      />

      {!data && <Spinner />}
      {data && (
        <div className="space-y-5">
          {chartData.length > 0 && (
            <>
              <StatStrip items={chartKeys.filter((k) => k in kpis).map((k) => ({ labelKey: k, label: t(k), value: num(k), icon: iconFor(k) }))} />

              <div className="grid gap-5 lg:grid-cols-2">
                <Card className="p-4">
                  <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('overview')}</h2>
                  <BarChart data={chartData} valueFmt={(v) => v} />
                </Card>
                <Card className="p-4">
                  <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('charts')}</h2>
                  <ColumnChart data={chartData} height={210} />
                </Card>
              </div>
            </>
          )}

          {groups.map((g) => (
            <Card key={g.labelKey} className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#002344]/5 text-[#FF6600]"><Icons.Layers size={14} /></span>
                {t(g.labelKey)}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">{g.items.length}</span>
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {g.items.map((l) => {
                  const I = Icons[l.icon] || Icons.Folder;
                  // Cards use the short label when one exists, so a long name
                  // such as "Meetings & Decisions" does not repeat the block
                  // heading above it.
                  const [en, hi] = tBoth(l.shortKey || l.key);
                  if (l.planned) {
                    return (
                      <div key={l.key} title={t('coming_soon')}
                        className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-3.5 py-3 text-left">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-200 text-slate-400"><I size={18} /></span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-slate-400">{en}</span>
                          <span className="block truncate text-[11px] text-slate-400">{hi}</span>
                        </span>
                      </div>
                    );
                  }
                  return (
                    <button key={l.key} type="button" onClick={() => go(l)}
                      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[#2563EB]/40 hover:shadow-[0_10px_26px_-14px_rgba(2,35,68,0.35)]">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white shadow-sm ring-1 ring-black/5"><I size={18} /></span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-800 group-hover:text-[#002344]">{en}</span>
                        <span className="block truncate text-[11px] text-slate-400">{hi}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </ImsLayout>
  );
}

const ICONS = {
  members: 'IdCard', committeeMembers: 'Users', committees: 'Landmark', meetings: 'CalendarClock',
  pendingActions: 'ListChecks', openCases: 'AlertTriangle', notices: 'Bell', persons: 'UserRound',
  programmes: 'Layers', projects: 'FolderKanban', activities: 'Activity', beneficiaries: 'HeartHandshake',
  freeActivities: 'HeartHandshake', outcomes: 'TrendingUp', donors: 'Heart', grants: 'BadgeDollarSign',
  assets: 'Package', inventory: 'Boxes', employees: 'BriefcaseBusiness', volunteers: 'HandHeart',
  attendance: 'CalendarCheck', insuranceDue: 'ShieldAlert', donationsTotal: 'Gift',
  pending: 'Clock', overdue: 'AlertTriangle', filed: 'CheckCircle2', auditsOpen: 'SearchCheck', highRisks: 'TriangleAlert',
  agreements: 'Scale', documents: 'Files', communications: 'MessageSquare', policies: 'FileText',
  governanceRules: 'Scale', organisations: 'Building2', history: 'History',
  income: 'TrendingUp', expense: 'TrendingDown', net: 'Scale', vouchers: 'ReceiptText', accounts: 'BookOpen',
  users: 'UserCog', auditTrail: 'ClipboardList',
};
function iconFor(k) { return ICONS[k] || 'Activity'; }
