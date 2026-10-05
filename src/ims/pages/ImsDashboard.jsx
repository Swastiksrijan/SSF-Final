import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, Kpi, PageHeader, Empty, Spinner, Button } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

export default function ImsDashboard() {
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

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
      <PageHeader title={t('main_dashboard')} subtitle={t('tagline')} />

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
