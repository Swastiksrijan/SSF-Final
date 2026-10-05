import { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, PageHeader, Badge, Empty, Spinner, Button } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

export default function ImsPerson360() {
  const { id } = useParams({ from: '/ims/person/$id' });
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try { setData(await ims.person360(id)); } catch (e) { setErr(e.message); }
    })();
  }, [id]);

  return (
    <ImsLayout active="persons">
      <PageHeader
        title={data ? data.person.fullName : t('person_360')}
        subtitle={data ? data.person.recordId : ''}
        actions={<Button icon="ArrowLeft" variant="ghost" onClick={() => navigate({ to: '/ims/r/$resource', params: { resource: 'persons' } })}>{t('persons')}</Button>}
      />

      {err && <Card className="mb-3 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</Card>}
      {!data && !err && <Spinner />}

      {data && (
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="p-4 lg:col-span-2">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('overview')}</h2>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Item label="Mobile" value={data.person.mobile} />
                <Item label="Email" value={data.person.email} />
                <Item label="City" value={data.person.city} />
                <Item label="State" value={data.person.state} />
                <Item label="Occupation" value={data.person.occupation} />
                <Item label="PAN" value={data.person.pan} />
                <div className="col-span-2"><Item label="Address" value={data.person.address} /></div>
              </dl>
            </Card>

            <Card className="p-4">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('roles')}</h2>
              <div className="flex flex-wrap gap-2">
                {data.roles.length === 0 && <span className="text-sm text-slate-400">—</span>}
                {data.roles.map((r, i) => (
                  <span key={i} className="rounded-full bg-[#002344] px-3 py-1 text-xs font-semibold text-white">{r}</span>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Section title={t('members')} icon="IdCard" empty={data.memberships.length === 0}>
              {data.memberships.map(m => (
                <Row key={m.id} id={m.recordId} title={m.category || '—'} right={<Badge status={m.applicationStatus || m.status} />} />
              ))}
            </Section>

            <Section title={t('meetings')} icon="CalendarClock" empty={data.meetings.length === 0}>
              {data.meetings.map(m => (
                <Row key={m.id} id={m.recordId} title={m.title} right={<Badge status={m.minutesStatus} />} />
              ))}
            </Section>

            <Section title={t('donations')} icon="Gift" empty={data.donations.length === 0}>
              {data.donations.map(d => (
                <Row key={d.id} id={d.recordId} title={'₹' + Number(d.amount || 0).toLocaleString('en-IN')} right={d.receiptNo || ''} />
              ))}
            </Section>

            <Section title={t('actions')} icon="ListChecks" empty={data.actions.length === 0}>
              {data.actions.map(a => (
                <Row key={a.id} id={a.recordId} title={a.title} right={<Badge status={a.actionStatus} />} />
              ))}
            </Section>

            <Section title={t('cases')} icon="AlertTriangle" empty={data.cases.length === 0}>
              {data.cases.map(c => (
                <Row key={c.id} id={c.recordId} title={c.title} right={<Badge status={c.stage} />} />
              ))}
            </Section>

            <Section title={t('communications')} icon="MessageSquare" empty={data.communications.length === 0}>
              {data.communications.map(c => (
                <Row key={c.id} id={c.recordId} title={c.subject || c.channel} right={c.deliveryStatus || ''} />
              ))}
            </Section>
          </div>

          <Section title={t('related_records')} icon="Link2" empty={data.relations.length === 0}>
            <div className="flex flex-wrap gap-2">
              {data.relations.map((r, i) => (
                <span key={i} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
                  <span className="font-semibold text-slate-600">{r.type}</span>
                  <span className="ml-2 font-mono text-slate-400">{r.id}</span>
                </span>
              ))}
            </div>
          </Section>
        </div>
      )}
    </ImsLayout>
  );
}

function Item({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-slate-800">{value || '—'}</dd>
    </div>
  );
}

function Section({ title, icon, empty, children }) {
  const I = Icons[icon] || Icons.Circle;
  return (
    <Card className="p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
        <I size={15} className="text-[#FF6600]" />{title}
      </h2>
      {empty ? <span className="text-sm text-slate-400">—</span> : <div className="space-y-1.5">{children}</div>}
    </Card>
  );
}

function Row({ id, title, right }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm">
      <span className="min-w-0">
        <span className="block truncate font-medium text-slate-700">{title}</span>
        <span className="block font-mono text-[11px] text-slate-400">{id}</span>
      </span>
      <span className="ml-2 shrink-0 text-xs text-slate-500">{right}</span>
    </div>
  );
}
