import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, Spinner, SectionHero, StatStrip, Button } from '../ui';
import { BarChart, ColumnChart } from '../charts';
import { useLang } from '../LangContext';
import { tBoth } from '../i18n';
import { ims } from '../api';

// Per-section configuration: hero tone, module key for KPIs, quick links to the
// section's registers, and which KPI keys to chart. Keeps nav flat (no 100+
// menu items) while giving every big section its own dashboard.
const SECTIONS = {
  organisation: {
    titleKey: 'organisation', icon: 'Building2', tone: 'navy', module: 'organisation',
    links: [
      { resource: 'organisations', key: 'organisations', icon: 'Building2' },
      { path: '/ims/constitution', key: 'constitution', icon: 'ScrollText' },
      { resource: 'governanceRules', key: 'governanceRules', icon: 'Scale' },
      { path: '/ims/registers', key: 'registers_required', icon: 'BookMarked' },
      { resource: 'policies', key: 'policies', icon: 'FileText' },
      { path: '/ims/history', key: 'history', icon: 'History' },
    ],
    chart: ['governanceRules', 'policies', 'committees', 'organisations'],
  },
  governance: {
    titleKey: 'governance', icon: 'Scale', tone: 'navy', module: 'governance',
    links: [
      { resource: 'persons', key: 'persons', icon: 'UserRound' },
      { path: '/ims/members', key: 'members', icon: 'IdCard' },
      { resource: 'committees', key: 'committees', icon: 'Landmark' },
      { path: '/ims/meetings', key: 'meetings', icon: 'CalendarClock' },
      { resource: 'resolutions', key: 'resolutions', icon: 'Gavel' },
      { resource: 'actions', key: 'actions', icon: 'ListChecks' },
      { path: '/ims/cases', key: 'notices_cases', icon: 'AlertTriangle' },
    ],
    chart: ['members', 'meetings', 'pendingActions', 'openCases', 'notices'],
  },
  programmes: {
    titleKey: 'programmes', icon: 'Layers', tone: 'teal', module: 'programmes',
    links: [
      { resource: 'programmes', key: 'programmes', icon: 'Layers' },
      { resource: 'projects', key: 'projects', icon: 'FolderKanban' },
      { path: '/ims/activities', key: 'activities', icon: 'Activity' },
      { resource: 'beneficiaries', key: 'beneficiaries', icon: 'HeartHandshake' },
      { path: '/ims/impact', key: 'impact', icon: 'TrendingUp' },
    ],
    chart: ['programmes', 'projects', 'activities', 'beneficiaries', 'freeActivities'],
  },
  resources: {
    titleKey: 'resources', icon: 'Boxes', tone: 'teal', module: 'resources',
    links: [
      { resource: 'donors', key: 'donors', icon: 'Heart' },
      { resource: 'donations', key: 'donations', icon: 'Gift' },
      { resource: 'grants', key: 'grants', icon: 'BadgeDollarSign' },
      { path: '/ims/procurement', key: 'procurement', icon: 'ShoppingCart' },
      { resource: 'assets', key: 'assets', icon: 'Package' },
      { resource: 'inventory', key: 'inventory', icon: 'Boxes' },
      { resource: 'employees', key: 'employees', icon: 'BriefcaseBusiness' },
      { resource: 'volunteers', key: 'volunteers', icon: 'HandHeart' },
      { resource: 'attendance', key: 'attendance', icon: 'CalendarCheck' },
    ],
    chart: ['donors', 'grants', 'assets', 'employees', 'volunteers'],
  },
  compliance: {
    titleKey: 'compliance', icon: 'ShieldCheck', tone: 'orange', module: 'compliance',
    links: [
      { resource: 'compliance', key: 'compliance', icon: 'ShieldCheck' },
      { resource: 'agreements', key: 'legal', icon: 'Scale' },
      { resource: 'audits', key: 'audits', icon: 'SearchCheck' },
      { resource: 'risks', key: 'risks', icon: 'TriangleAlert' },
      { path: '/ims/integrity', key: 'integrity', icon: 'Fingerprint' },
    ],
    chart: ['pending', 'overdue', 'filed', 'auditsOpen', 'highRisks'],
  },
  records: {
    titleKey: 'records', icon: 'Files', tone: 'navy', module: 'records',
    links: [
      { resource: 'documents', key: 'documents', icon: 'Files' },
      { resource: 'communications', key: 'communications', icon: 'MessageSquare' },
      { path: '/ims/reports', key: 'reports', icon: 'BarChart3' },
      { path: '/ims/knowledge', key: 'knowledge', icon: 'BookMarked' },
    ],
    chart: ['documents', 'communications', 'policies', 'governanceRules'],
  },
};

export default function ImsSectionDashboard({ section }) {
  const cfg = SECTIONS[section] || SECTIONS.governance;
  const { t } = useLang();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    ims.moduleDashboard(cfg.module).then(setData).catch(() => setData({ kpis: {} }));
  }, [cfg.module]);

  const kpis = (data && data.kpis) || {};
  const num = (k) => Number(kpis[k] || 0);
  const chartData = cfg.chart
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
        hi={t(cfg.titleKey) === cfg.titleKey ? '' : tBothHi(cfg.titleKey)}
        eyebrow={t('app_name') + ' · ' + t('management_system')}
        icon={cfg.icon}
        tone={cfg.tone}
        actions={<Button variant="hero" icon="LayoutDashboard" onClick={() => navigate({ to: '/ims' })}>{t('main_dashboard')}</Button>}
      />

      {!data && <Spinner />}
      {data && (
        <div className="space-y-5">
          <StatStrip items={cfg.chart.filter((k) => k in kpis).map((k) => ({ labelKey: k, label: t(k), value: num(k), icon: iconFor(k) }))} />

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

          <Card className="p-4">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('quick_actions')}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {cfg.links.map((l) => {
                const I = Icons[l.icon] || Icons.Folder;
                return (
                  <button key={l.key} type="button" onClick={() => go(l)}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left transition hover:border-[#002344]/30 hover:shadow-sm">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#002344] text-white"><I size={17} /></span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-800">{t(l.key)}</span>
                      <span className="block truncate text-[11px] text-slate-400">{tBothHi(l.key)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </ImsLayout>
  );
}

// Local Hindi lookup without importing the whole dictionary twice.
function tBothHi(key) { return tBoth(key)[1]; }

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
};
function iconFor(k) { return ICONS[k] || 'Activity'; }
