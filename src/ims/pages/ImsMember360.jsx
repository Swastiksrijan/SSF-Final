import { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, Badge, Button, SectionHero, Lifecycle, Spinner, Empty, RecordCard, Field2, DataTable } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

export default function ImsMember360() {
  const { id } = useParams({ from: '/ims/member/$id' });
  const { t } = useLang();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => { try { setData(await ims.member360(id)); } catch (e) { setErr(e.message); } })();
  }, [id]);

  const personName = data && data.person ? (data.person.fullName || data.person.recordId) : (data ? data.membership.recordId : '');

  return (
    <ImsLayout active="members">
      <SectionHero
        title={personName || t('members')}
        hi={t('members')}
        eyebrow={data ? data.membership.recordId : ''}
        icon="IdCard"
        actions={<Button variant="hero" icon="ArrowLeft" onClick={() => navigate({ to: '/ims/r/$resource', params: { resource: 'members' } })}>{t('members')}</Button>}
      />

      {err && <Card className="mb-3 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</Card>}
      {!data && !err && <Spinner />}

      {data && (
        <div className="space-y-5">
          {/* Dues chain — the full recovery lifecycle */}
          <Card className="p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">{t('members')} · Dues</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">{t('overview')}: <b>{data.dues.paidCount}</b> paid / <b>{data.dues.expectedPeriods}</b> expected</span>
                <span className={`rounded-full px-3 py-1 text-sm font-black ${data.dues.amountDue > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  ₹{Number(data.dues.amountDue).toLocaleString('en-IN')} due
                </span>
              </div>
            </div>
            <Lifecycle steps={data.dues.chain} value={data.dues.stage} />
          </Card>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="p-4 lg:col-span-2">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('overview')}</h2>
              <div className="grid grid-cols-2 gap-3">
                <Field2 label={['Person', 'व्यक्ति']} value={personName} />
                <Field2 label={['Member No', 'सदस्य संख्या']} value={data.membership.memberNo} />
                <Field2 label={['Category', 'श्रेणी']} value={data.membership.category} />
                <Field2 label={['Admission Date', 'प्रवेश तिथि']} value={data.membership.admissionDate} />
                <Field2 label={['Fee', 'शुल्क']} value={data.membership.feeAmount ? `₹${data.membership.feeAmount} / ${data.membership.feeFrequency || ''}` : '—'} />
                <Field2 label={['Application Status', 'आवेदन स्थिति']} value={data.membership.applicationStatus} />
              </div>
            </Card>

            <Card className="p-4">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('roles')}</h2>
              <div className="flex flex-wrap gap-2">
                {data.committeeRoles.length === 0 && <span className="text-sm text-slate-400">—</span>}
                {data.committeeRoles.map((r) => (
                  <span key={r.id} className="rounded-full bg-[#002344] px-3 py-1 text-xs font-semibold text-white">{r.position || r.recordId}</span>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title={t('donations')} icon="Gift" empty={data.payments.length === 0}>
              {data.payments.map((p) => (
                <RecordCard key={p.id} icon="Gift" title={`₹${Number(p.amount || 0).toLocaleString('en-IN')}`} subtitle={`${p.txnDate || ''} · ${p.paymentMode || ''}`} right={<Badge status={p.status} />} />
              ))}
            </Panel>

            <Panel title={t('attendance')} icon="CalendarCheck" empty={data.attendance.length === 0}>
              {data.attendance.map((a) => (
                <RecordCard key={a.id} icon="CalendarCheck" title={a.meetingTitle} subtitle={a.meetingDate} right={<Badge status={a.attendance} />} />
              ))}
            </Panel>

            <Panel title={t('notices')} icon="Bell" empty={data.notices.length === 0}>
              {data.notices.map((n) => (
                <RecordCard key={n.id} icon="Bell" title={n.subject || n.recordId} subtitle={n.noticeType} right={<Badge status={n.deliveryStatus} />} />
              ))}
            </Panel>

            <Panel title={t('cases')} icon="AlertTriangle" empty={data.cases.length === 0}>
              {data.cases.map((c) => (
                <RecordCard key={c.id} icon="AlertTriangle" title={c.title || c.recordId} subtitle={c.caseType} right={<Badge status={c.stage} />} />
              ))}
            </Panel>

            <Panel title={t('documents')} icon="Files" empty={data.documents.length === 0}>
              {data.documents.map((d) => (
                <RecordCard key={d.id} icon="Files" title={d.title || d.recordId} subtitle={d.category} />
              ))}
            </Panel>

            <Panel title={t('actions')} icon="ListChecks" empty={data.actions.length === 0}>
              {data.actions.map((a) => (
                <RecordCard key={a.id} icon="ListChecks" title={a.title || a.recordId} subtitle={a.dueDate} right={<Badge status={a.actionStatus} />} />
              ))}
            </Panel>
          </div>

          <Card className="p-4">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('history_tab')}</h2>
            {data.history.length === 0 ? <Empty /> : (
              <ol className="relative space-y-3 border-l border-slate-200 pl-4">
                {data.history.map((h) => (
                  <li key={h.id} className="relative">
                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-[#FF6600]" />
                    <div className="flex items-center gap-2">
                      <Badge status={h.action} />
                      <span className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleString('en-IN')}</span>
                      <span className="text-xs font-semibold text-slate-500">{h.actor}</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      )}
    </ImsLayout>
  );
}

function Panel({ title, icon, empty, children }) {
  const I = Icons[icon] || Icons.FileText;
  return (
    <Card className="p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500"><I size={15} /> {title}</h2>
      <div className="space-y-2">{empty ? <Empty /> : children}</div>
    </Card>
  );
}
