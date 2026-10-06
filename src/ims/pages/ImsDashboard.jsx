import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, Kpi, Empty, Spinner } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { BarChart, DonutChart, ColumnChart } from '../charts';
import DownloadCenter from '../DownloadCenter';
import logoImg from '../../assets/new-logo.png';

const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const pretty = (s) => String(s || '—').replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const fmtTime = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '—';
  return dt.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function ImsDashboard() {
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        let d = await ims.mainDashboard();
        // Auto-seed on a completely empty install so the dashboard is never blank.
        if (d && d.organisation && d.organisation.persons === 0 && d.governance.meetings === 0) {
          await ims.seed().catch(() => {});
          d = await ims.mainDashboard();
        }
        setData(d);
      } catch (e) { setErr(e.message); }
    })();
  }, []);

  return (
    <ImsLayout active="main_dashboard">
      <Hero
        title={t('app_full')}
        eyebrow={`${t('working_name')} · ${t('management_system')}`}
        tagline={t('tagline')}
        updated={data ? fmtTime(new Date()) : ''}
        actions={data ? <DownloadCenter variant="hero" defaultResource="members" /> : null}
      />

      {err && <Card className="mb-4 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</Card>}
      {!data && !err && <Spinner />}

      {data && (
        <div className="space-y-7">
          {/* 1. Organisation Overview */}
          <Section title={t('organisation_overview')} icon="Building2" count={7}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
              <Kpi icon="UserRound" label={t('persons')} value={data.organisation.persons} tone="navy" />
              <Kpi icon="IdCard" label={t('members')} value={data.organisation.members} tone="blue" />
              <Kpi icon="Handshake" label={t('donors')} value={data.organisation.donors} tone="orange" />
              <Kpi icon="HandHeart" label={t('volunteers')} value={data.organisation.volunteers} tone="green" />
              <Kpi icon="BriefcaseBusiness" label={t('employees')} value={data.organisation.employees} tone="slate" />
              <Kpi icon="HeartHandshake" label={t('beneficiaries')} value={data.organisation.beneficiaries} tone="amber" />
              <Kpi icon="Users" label={t('committee')} value={data.organisation.currentCommittee} tone="teal" />
            </div>
          </Section>

          {/* 2. Finance Overview — live from the central money transactions */}
          <Section
            title={t('finance_overview')}
            icon="PieChart"
            badge={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{t('live_from_transactions')}
              </span>
            }
          >
            <div className="grid gap-3 lg:grid-cols-3">
              <NetBalanceCard net={data.finance.net} income={data.finance.income} expense={data.finance.expense} t={t} />
              <div className="grid grid-cols-2 gap-3 lg:col-span-2 xl:grid-cols-3">
                <Kpi icon="TrendingUp" label={t('total_income')} value={money(data.finance.income)} tone="green" />
                <Kpi icon="TrendingDown" label={t('total_expenses')} value={money(data.finance.expense)} tone="red" />
                <Kpi icon="Landmark" label={t('bank_balance')} value={money(data.finance.bankBalance)} tone="blue" />
                <Kpi icon="Banknote" label={t('cash_balance')} value={money(data.finance.cashBalance)} tone="teal" />
                <Kpi icon="Gift" label={t('donations')} value={money(data.finance.donationsTotal)} tone="orange" />
                <Kpi icon="Coins" label={t('membership_contributions')} value={money(data.finance.membershipTotal)} tone="amber" />
              </div>
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              <Card className="p-4 lg:col-span-2">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">{t('overview')}</h3>
                <BarChart
                  data={[
                    { label: t('total_income'), value: data.finance.income, color: '#15803d' },
                    { label: t('total_expenses'), value: data.finance.expense, color: '#be123c' },
                    { label: t('net_balance'), value: data.finance.net, color: '#002344' },
                    { label: t('donations'), value: data.finance.donationsTotal, color: '#FF6600' },
                  ]}
                  valueFmt={money}
                />
              </Card>
              <Kpi icon="BadgeDollarSign" label={t('grants_hi')} value={money(data.finance.grantsTotal)} tone="purple" />
            </div>
          </Section>

          {/* 3. Governance */}
          <Section title={t('governance_overview')} icon="Landmark">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              <Kpi icon="CalendarClock" label={t('upcoming_meetings')} value={data.governance.upcomingMeetings} tone="blue" />
              <Kpi icon="Gavel" label={t('pending_resolutions')} value={data.governance.pendingResolutions} tone="purple" />
              <Kpi icon="ListChecks" label={t('pending_actions')} value={data.governance.pendingActions} tone="orange" />
              <Kpi icon="AlertTriangle" label={t('pending_cases')} value={data.governance.openCases} tone="red" />
              <Kpi icon="FileClock" label={t('pending_documents')} value={data.governance.pendingDocuments} tone="amber" />
            </div>
          </Section>

          {/* 4. Compliance & Alerts */}
          <Section title={t('compliance_alerts')} icon="ShieldCheck">
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="grid grid-cols-2 gap-3 lg:col-span-2 md:grid-cols-3">
                <Kpi icon="AlertOctagon" label={t('overdue_compliance')} value={data.compliance.complianceOverdue} tone="red" />
                <Kpi icon="SearchCheck" label={t('pending_audit')} value={data.compliance.pendingAudit} tone="slate" />
                <Kpi icon="ListChecks" label={t('pending_actions')} value={data.governance.pendingActions} tone="orange" />
                <Kpi icon="Scale" label={t('pending_cases')} value={data.governance.openCases} tone="amber" />
                <Kpi icon="CalendarX" label={t('expiring_documents')} value={data.compliance.expiringDocuments} tone="red" />
                <Kpi icon="ClipboardCheck" label={t('compliance')} value={data.compliance.complianceDue} tone="blue" />
              </div>
              <Card className="divide-y divide-slate-100">
                <AlertRow tone="red" label={t('overdue_compliance')} value={data.compliance.complianceOverdue} />
                <AlertRow tone="slate" label={t('pending_audit')} value={data.compliance.pendingAudit} />
                <AlertRow tone="amber" label={t('expiring_documents')} value={data.compliance.expiringDocuments} />
                <AlertRow tone="green" label={t('compliance')} value={data.compliance.complianceDue} />
              </Card>
            </div>
          </Section>

          {/* Charts */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Section title={t('organisation_overview')} icon="Users">
              <Card className="p-4">
                <DonutChart data={[
                  { label: t('persons'), value: data.organisation.persons, color: '#002344' },
                  { label: t('members'), value: data.organisation.members, color: '#FF6600' },
                  { label: t('donors'), value: data.organisation.donors, color: '#FFD166' },
                  { label: t('volunteers'), value: data.organisation.volunteers, color: '#15803d' },
                  { label: t('employees'), value: data.organisation.employees, color: '#0e7490' },
                ]} />
              </Card>
            </Section>
            <Section title={t('finance_overview')} icon="BarChart3">
              <Card className="p-4">
                <ColumnChart data={[
                  { label: t('total_income'), value: data.finance.income, color: '#15803d' },
                  { label: t('total_expenses'), value: data.finance.expense, color: '#be123c' },
                  { label: t('donations'), value: data.finance.donationsTotal, color: '#FF6600' },
                  { label: t('bank_balance'), value: data.finance.bankBalance, color: '#002344' },
                  { label: t('cash_balance'), value: data.finance.cashBalance, color: '#0e7490' },
                ]} />
              </Card>
            </Section>
            <Section title={t('governance_overview')} icon="Activity">
              <Card className="p-4">
                <ColumnChart data={[
                  { label: t('upcoming_meetings'), value: data.governance.upcomingMeetings, color: '#002344' },
                  { label: t('pending_resolutions'), value: data.governance.pendingResolutions, color: '#FF6600' },
                  { label: t('pending_actions'), value: data.governance.pendingActions, color: '#FFD166' },
                  { label: t('pending_cases'), value: data.governance.openCases, color: '#be123c' },
                ]} />
              </Card>
            </Section>
          </div>

          {/* 5. Recent Activity */}
          <Section title={t('recent_activity')} icon="History">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-[11px] uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-2.5 font-bold">{t('time')}</th>
                      <th className="px-4 py-2.5 font-bold">{t('user')}</th>
                      <th className="px-4 py-2.5 font-bold">{t('action')}</th>
                      <th className="px-4 py-2.5 font-bold">{t('module')}</th>
                      <th className="px-4 py-2.5 font-bold">{t('reference')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!data.recent || data.recent.length === 0) ? (
                      <tr><td colSpan={5} className="px-4 py-6"><Empty /></td></tr>
                    ) : data.recent.map((r, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                        <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">{fmtTime(r.createdAt)}</td>
                        <td className="whitespace-nowrap px-4 py-2.5 font-medium text-slate-700">{pretty(r.actor || 'system')}</td>
                        <td className="whitespace-nowrap px-4 py-2.5">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002344]/5 px-2.5 py-0.5 text-[11px] font-semibold text-[#002344]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6600]" />{pretty(r.action)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-slate-600">{pretty(r.entityType)}</td>
                        <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-500">{r.entityId || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </Section>
        </div>
      )}
    </ImsLayout>
  );
}

function Hero({ title, eyebrow, tagline, updated, actions }) {
  return (
    <section className="relative mb-7 overflow-hidden rounded-3xl bg-[#002344] p-6 text-white shadow-[0_18px_40px_-20px_rgba(2,35,68,0.55)] sm:p-8">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FF6600]/20 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-[#FFD166]/10 blur-2xl" />
      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4">
          <img src={logoImg} alt="SSF logo" className="h-16 w-16 shrink-0 rounded-2xl bg-white p-2 object-contain sm:h-20 sm:w-20" />
          <div>
            <p className="text-[11px] font-black uppercase tracking-[.2em] text-[#FFD166]">{eyebrow}</p>
            <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm text-white/75">{tagline}</p>
            {updated && <p className="mt-2 text-[11px] font-semibold text-white/50">{updated}</p>}
          </div>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </section>
  );
}

function Section({ title, icon, count, badge, children }) {
  const I = Icons[icon] || Icons.Circle;
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-600">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#002344]/5 text-[#FF6600]"><I size={15} /></span>
          {title}
          {count != null && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">{count}</span>}
        </h2>
        {badge}
      </div>
      {children}
    </section>
  );
}

function NetBalanceCard({ net, income, expense, t }) {
  const positive = net >= 0;
  return (
    <Card className={`relative overflow-hidden p-5 ${positive ? 'bg-gradient-to-br from-[#002344] to-[#0b3a63]' : 'bg-gradient-to-br from-[#7f1d1d] to-[#b91c1c]'} text-white`}>
      <span aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
      <div className="relative">
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-white/60">{t('net_balance')}</p>
        <p className="mt-1 text-3xl font-black tracking-tight">{money(net)}</p>
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-white/80">
          <span>{t('total_income')} <span className="text-[#8fe3a8]">{money(income)}</span></span>
          <span className="text-white/50">−</span>
          <span>{t('total_expenses')} <span className="text-[#ffb3b3]">{money(expense)}</span></span>
        </p>
      </div>
    </Card>
  );
}

function AlertRow({ tone, label, value }) {
  const dot = { red: 'bg-rose-500', amber: 'bg-amber-500', blue: 'bg-blue-500', green: 'bg-emerald-500', slate: 'bg-slate-500' }[tone];
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="flex items-center gap-2 text-sm text-slate-700"><span className={`h-2.5 w-2.5 rounded-full ${dot}`} />{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}
