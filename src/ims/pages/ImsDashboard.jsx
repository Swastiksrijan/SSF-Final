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
        updated={data ? new Date().toLocaleString('en-IN') : ''}
        actions={data ? (
          <div className="flex flex-wrap gap-2">
            <DownloadCenter variant="hero" defaultResource="members" />
          </div>
        ) : null}
      />

      {err && <Card className="mb-4 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</Card>}
      {!data && !err && <Spinner />}

      {data && (
        <div className="space-y-6">
          <Section title={t('organisation')} icon="Building2">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
              <Kpi icon="UserRound" label={t('persons')} value={data.organisation.persons} tone="navy" />
              <Kpi icon="IdCard" label={t('members')} value={data.organisation.members} tone="navy" />
              <Kpi icon="Heart" label={t('donors')} value={data.organisation.donors} tone="orange" />
              <Kpi icon="HandHeart" label={t('volunteers')} value={data.organisation.volunteers} tone="green" />
              <Kpi icon="BriefcaseBusiness" label={t('employees')} value={data.organisation.employees} tone="slate" />
              <Kpi icon="HeartHandshake" label={t('beneficiaries')} value={data.organisation.beneficiaries} tone="amber" />
              <Kpi icon="Users" label={t('committee')} value={data.organisation.currentCommittee} tone="navy" />
            </div>
          </Section>

          <Section title={t('governance')} icon="Landmark">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
              <Kpi icon="CalendarClock" label={t('meetings')} value={data.governance.meetings} tone="navy" />
              <Kpi icon="FileClock" label={t('pending') + ' · ' + t('documents')} value={data.governance.pendingMinutes} tone="amber" />
              <Kpi icon="Gavel" label={t('resolutions')} value={data.governance.pendingResolutions} tone="slate" />
              <Kpi icon="ListChecks" label={t('actions')} value={data.governance.pendingActions} tone="orange" />
              <Kpi icon="AlertTriangle" label={t('cases')} value={data.governance.openCases} tone="red" />
              <Kpi icon="CalendarArrowDown" label={t('meetings') + ' →'} value={data.governance.nextMeeting ? data.governance.nextMeeting.meetingDate : '—'} tone="green" />
            </div>
          </Section>

          <Section title={t('finance')} icon="PieChart">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
              <Kpi icon="TrendingUp" label={t('income')} value={money(data.finance.income)} tone="green" />
              <Kpi icon="TrendingDown" label={t('expenses')} value={money(data.finance.expense)} tone="red" />
              <Kpi icon="Scale" label={t('statements')} value={money(data.finance.net)} tone={data.finance.net >= 0 ? 'green' : 'red'} />
              <Kpi icon="Gift" label={t('donations')} value={money(data.finance.donationsTotal)} tone="orange" />
              <Kpi icon="Wallet" label={t('funds')} value={data.finance.funds} tone="navy" />
            </div>
          </Section>

          <div className="grid gap-6 lg:grid-cols-3">
            <Section title={t('organisation')} icon="PieChart">
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
            <Section title={t('finance')} icon="BarChart3">
              <Card className="p-4">
                <BarChart data={[
                  { label: t('income'), value: data.finance.income, color: '#15803d' },
                  { label: t('expenses'), value: data.finance.expense, color: '#be123c' },
                  { label: t('donations'), value: data.finance.donationsTotal, color: '#FF6600' },
                  { label: t('statements'), value: data.finance.net, color: '#002344' },
                ]} valueFmt={money} />
              </Card>
            </Section>
            <Section title={t('governance')} icon="Activity">
              <Card className="p-4">
                <ColumnChart data={[
                  { label: t('meetings'), value: data.governance.meetings, color: '#002344' },
                  { label: t('resolutions'), value: data.governance.pendingResolutions, color: '#FF6600' },
                  { label: t('actions'), value: data.governance.pendingActions, color: '#FFD166' },
                  { label: t('cases'), value: data.governance.openCases, color: '#be123c' },
                ]} />
              </Card>
            </Section>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title={t('alerts')} icon="Bell">
              <Card className="divide-y divide-slate-100">
                <AlertRow tone="red" label={t('compliance') + ' · ' + t('overdue')} value={data.alerts.critical} />
                <AlertRow tone="amber" label={t('cases') + ' · ' + t('pending')} value={data.alerts.high} />
                <AlertRow tone="blue" label={t('actions') + ' · ' + t('pending')} value={data.alerts.medium} />
                <AlertRow tone="green" label={t('audits')} value={data.compliance.auditsOpen} />
              </Card>
            </Section>

            <Section title={t('recent_activity')} icon="History">
              <Card className="max-h-80 overflow-y-auto">
                {(!data.recent || data.recent.length === 0) ? <Empty /> : (
                  <ul className="divide-y divide-slate-100">
                    {data.recent.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 px-4 py-2.5 text-sm">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#FF6600]" />
                        <span className="min-w-0">
                          <span className="font-medium text-slate-700">{r.action} · {r.entityType}</span>
                          <span className="block text-xs text-slate-400">{r.entityId} · {new Date(r.createdAt).toLocaleString('en-IN')}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </Section>
          </div>
        </div>
      )}
    </ImsLayout>
  );
}

function Hero({ title, eyebrow, tagline, updated, actions }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#002344] p-6 text-white shadow-lg sm:p-8">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FF6600]/20 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-[#FFD166]/10 blur-2xl" />
      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4">
          <img src={logoImg} alt="SSF logo" className="h-16 w-16 shrink-0 rounded-2xl bg-white p-2 object-contain sm:h-20 sm:w-20" />
          <div>
            <p className="text-[11px] font-black uppercase tracking-[.2em] text-[#FFD166]">{eyebrow}</p>
            <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm text-white/75">{tagline}</p>
            {updated && <p className="mt-2 text-[11px] font-semibold text-white/50">{updated}</p>}
          </div>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </section>
  );
}

function Section({ title, icon, children }) {
  const I = Icons[icon] || Icons.Circle;
  return (
    <section>
      <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
        <I size={16} className="text-[#FF6600]" />{title}
      </h2>
      {children}
    </section>
  );
}

function AlertRow({ tone, label, value }) {
  const dot = { red: 'bg-rose-500', amber: 'bg-amber-500', blue: 'bg-blue-500', green: 'bg-emerald-500' }[tone];
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="flex items-center gap-2 text-sm text-slate-700"><span className={`h-2.5 w-2.5 rounded-full ${dot}`} />{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}
