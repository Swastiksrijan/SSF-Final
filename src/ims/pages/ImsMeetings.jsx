import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, Badge, Button, SectionHero, Tabs, DataTable, DetailModal, Field2, RecordCard, FormDrawer, Empty } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { schemaFor } from '../schemas';
import { useResourceRecords } from '../record';

// Everything the legacy meeting system had, kept inside one workspace.
const TABS = [
  { id: 'meetings', en: 'Meetings', hi: 'बैठकें', icon: 'CalendarClock' },
  { id: 'agenda', en: 'Agenda', hi: 'कार्यसूची' },
  { id: 'attendance', en: 'Attendance & Quorum', hi: 'उपस्थिति एवं कोरम' },
  { id: 'minutes', en: 'Minutes', hi: 'कार्यवृत्त' },
  { id: 'decisions', en: 'Decisions', hi: 'निर्णय' },
  { id: 'resolutions', en: 'Resolutions & Voting', hi: 'संकल्प एवं मतदान' },
  { id: 'actions', en: 'Action Items', hi: 'कार्य मद' },
  { id: 'notices', en: 'Notices', hi: 'सूचनाएँ' },
];

export default function ImsMeetings() {
  const { t } = useLang();
  const [tab, setTab] = useState('meetings');
  const { rows: meetings, reload } = useResourceRecords('meetings');
  const { rows: attendees } = useResourceRecords('attendees');
  const { rows: resolutions } = useResourceRecords('resolutions');
  const { rows: actions } = useResourceRecords('actions');
  const { rows: notices } = useResourceRecords('notices');
  const [dossier, setDossier] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [saving, setSaving] = useState(false);

  const byMeeting = useMemo(() => {
    const map = { attendees: {}, resolutions: {}, actions: {}, notices: {} };
    (attendees || []).forEach((a) => { (map.attendees[a.meetingId] = map.attendees[a.meetingId] || []).push(a); });
    (resolutions || []).forEach((a) => { (map.resolutions[a.meetingId] = map.resolutions[a.meetingId] || []).push(a); });
    (actions || []).forEach((a) => { (map.actions[a.sourceMeetingId] = map.actions[a.sourceMeetingId] || []).push(a); });
    (notices || []).forEach((a) => { (map.notices[a.meetingId] = map.notices[a.meetingId] || []).push(a); });
    return map;
  }, [attendees, resolutions, actions, notices]);

  const counts = {
    meetings: (meetings || []).length,
    resolutions: (resolutions || []).length,
    actions: (actions || []).length,
    notices: (notices || []).length,
    attendance: (attendees || []).length,
  };

  const openDossier = async (m) => {
    setOpenId(m.id);
    setDossier(null);
    try { setDossier(await ims.meetingDossier(m.id)); } catch { setDossier(false); }
  };

  const create = async (form) => {
    setSaving(true);
    try { await ims.create('meetings', form); setDrawer(false); reload(); }
    finally { setSaving(false); }
  };

  const meetingCols = [
    { key: 'recordId', en: 'ID', hi: 'आईडी', render: (r) => <span className="font-mono text-xs text-slate-500">{r.recordId}</span> },
    { key: 'title', en: 'Meeting', hi: 'बैठक', render: (r) => <span className="font-semibold text-[#002344]">{r.title || '—'}</span> },
    { key: 'meetingType', en: 'Type', hi: 'प्रकार', render: (r) => r.meetingType || '—' },
    { key: 'meetingDate', en: 'Date', hi: 'दिनांक', render: (r) => r.meetingDate || '—' },
    { key: 'mode', en: 'Mode', hi: 'माध्यम', render: (r) => <Badge status={r.mode} /> },
    { key: 'minutesStatus', en: 'Minutes', hi: 'कार्यवृत्त', render: (r) => <Badge status={r.minutesStatus} /> },
    { key: 'quorumAchieved', en: 'Quorum', hi: 'कोरम', render: (r) => (r.quorumAchieved ? <Badge status="approved" /> : <Badge status="pending" />) },
    { key: 'linked', en: 'Linked', hi: 'संबंधित', render: (r) => {
      const b = byMeeting;
      const n = (b.attendees[r.id]?.length || 0) + (b.resolutions[r.id]?.length || 0) + (b.actions[r.id]?.length || 0) + (b.notices[r.id]?.length || 0);
      return <span className="text-xs text-slate-500">{n}</span>;
    } },
  ];

  return (
    <ImsLayout active="meetings">
      <SectionHero title={t('meetings')} hi="बैठकें एवं निर्णय" eyebrow={t('governance')} icon="CalendarClock"
        actions={<Button variant="hero" icon="Plus" onClick={() => setDrawer(true)}>{t('new_record')}</Button>} />

      <Tabs tabs={TABS.map((tb) => ({ ...tb, count: tb.id === 'meetings' ? counts.meetings : counts[tb.id] }))} value={tab} onChange={setTab} />

      {tab === 'meetings' && (
        <DataTable columns={meetingCols} rows={meetings} onRowClick={openDossier} empty={t('no_records')} />
      )}

      {tab === 'agenda' && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(meetings || []).filter((m) => m.agenda).map((m) => (
            <RecordCard key={m.id} icon="ListChecks" title={m.title || m.recordId} subtitle={`${m.meetingDate || ''} · ${t('agenda')}`}
              right={<Badge status={m.minutesStatus} />} onClick={() => openDossier(m)} />
          ))}
          {(meetings || []).filter((m) => m.agenda).length === 0 && <Card><Empty /></Card>}
        </div>
      )}

      {tab === 'attendance' && (
        <DataTable rows={attendees} empty={t('no_records')} columns={[
          { key: 'recordId', en: 'ID', render: (r) => <span className="font-mono text-xs text-slate-500">{r.recordId}</span> },
          { key: 'meetingId', en: 'Meeting', render: (r) => `#${r.meetingId}` },
          { key: 'personId', en: 'Person', render: (r) => `#${r.personId}` },
          { key: 'attendance', en: 'Attendance', render: (r) => <Badge status={r.attendance} /> },
          { key: 'joinedMode', en: 'Mode', render: (r) => r.joinedMode || '—' },
          { key: 'acknowledged', en: 'Acknowledged', render: (r) => (r.acknowledged ? '✓' : '—') },
        ]} />
      )}

      {tab === 'minutes' && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(meetings || []).map((m) => (
            <RecordCard key={m.id} icon="FileText" title={m.title || m.recordId} subtitle={m.minutes ? String(m.minutes).slice(0, 80) : t('no_records')}
              right={<Badge status={m.minutesStatus} />} onClick={() => openDossier(m)} />
          ))}
        </div>
      )}

      {tab === 'decisions' && (
        <DataTable rows={resolutions} empty={t('no_records')} columns={[
          { key: 'recordId', en: 'ID', render: (r) => <span className="font-mono text-xs text-slate-500">{r.recordId}</span> },
          { key: 'title', en: 'Decision', render: (r) => <span className="font-semibold text-[#002344]">{r.title || '—'}</span> },
          { key: 'votingResult', en: 'Voting', render: (r) => r.votingResult || '—' },
          { key: 'isSpecial', en: 'Special', render: (r) => (r.isSpecial ? '✓' : '—') },
          { key: 'status', en: 'Status', render: (r) => <Badge status={r.status} /> },
        ]} />
      )}

      {tab === 'resolutions' && (
        <DataTable rows={resolutions} empty={t('no_records')} columns={[
          { key: 'resolutionNo', en: 'Resolution No', render: (r) => r.resolutionNo || r.recordId },
          { key: 'title', en: 'Title', render: (r) => <span className="font-semibold text-[#002344]">{r.title || '—'}</span> },
          { key: 'votingResult', en: 'Voting Result', render: (r) => r.votingResult || '—' },
          { key: 'dissent', en: 'Dissent', render: (r) => (r.dissent ? String(r.dissent).slice(0, 40) : '—') },
          { key: 'isSpecial', en: 'Special', render: (r) => (r.isSpecial ? '✓' : '—') },
        ]} />
      )}

      {tab === 'actions' && (
        <DataTable rows={actions} empty={t('no_records')} columns={[
          { key: 'recordId', en: 'ID', render: (r) => <span className="font-mono text-xs text-slate-500">{r.recordId}</span> },
          { key: 'title', en: 'Action', render: (r) => <span className="font-semibold text-[#002344]">{r.title || '—'}</span> },
          { key: 'dueDate', en: 'Due', render: (r) => r.dueDate || '—' },
          { key: 'priority', en: 'Priority', render: (r) => <Badge status={r.priority} /> },
          { key: 'actionStatus', en: 'Status', render: (r) => <Badge status={r.actionStatus} /> },
        ]} />
      )}

      {tab === 'notices' && (
        <DataTable rows={notices} empty={t('no_records')} columns={[
          { key: 'recordId', en: 'ID', render: (r) => <span className="font-mono text-xs text-slate-500">{r.recordId}</span> },
          { key: 'subject', en: 'Notice', render: (r) => <span className="font-semibold text-[#002344]">{r.subject || '—'}</span> },
          { key: 'noticeType', en: 'Type', render: (r) => r.noticeType || '—' },
          { key: 'deliveryStatus', en: 'Delivery', render: (r) => <Badge status={r.deliveryStatus} /> },
          { key: 'reminderCount', en: 'Reminders', render: (r) => r.reminderCount ?? 0 },
        ]} />
      )}

      <MeetingDossier open={!!openId} onClose={() => { setOpenId(null); setDossier(null); }} dossier={dossier} t={t} />

      <FormDrawer open={drawer} title={t('new_record')} schema={schemaFor('meetings')} initial={{}} saving={saving}
        onClose={() => setDrawer(false)} onSubmit={create} />
    </ImsLayout>
  );
}

function MeetingDossier({ open, onClose, dossier, t }) {
  if (!open) return null;
  if (dossier === null) return <DetailModal open onClose={onClose} title={t('meetings')} wide><div className="py-10 text-center text-slate-400">…</div></DetailModal>;
  if (dossier === false) return <DetailModal open onClose={onClose} title={t('meetings')} wide><Empty /></DetailModal>;
  const m = dossier.meeting;
  return (
    <DetailModal open onClose={onClose} wide
      title={m.title || m.recordId} subtitle={`${m.recordId} · ${m.meetingType || ''}`} badge={<Badge status={m.minutesStatus} />}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field2 label={['Date', 'दिनांक']} value={m.meetingDate} />
          <Field2 label={['Time', 'समय']} value={[m.startTime, m.endTime].filter(Boolean).join(' – ')} />
          <Field2 label={['Mode', 'माध्यम']} value={m.mode} />
          <Field2 label={['Venue', 'स्थान']} value={m.venue} />
          <Field2 label={['Meeting Link', 'बैठक लिंक']} value={m.meetingLink} />
          <Field2 label={['Platform', 'प्लेटफ़ॉर्म']} value={m.platform} />
          <Field2 label={['Notice Date', 'सूचना तिथि']} value={m.noticeDate} />
          <Field2 label={['Chairman', 'अध्यक्ष']} value={m.chairman} />
          <Field2 label={['Quorum', 'कोरम']} value={`${m.quorumRequired || '—'} (${m.quorumAchieved ? '✓' : '—'})`} />
        </div>

        <Block title={['Agenda', 'कार्यसूची']} text={m.agenda} />
        <Block title={['Minutes', 'कार्यवृत्त']} text={m.minutes} />

        <Section title={`${t('attendance')} · ${t('present') || 'present'} ${dossier.attendanceSummary.present}/${dossier.attendanceSummary.invited}`}>
          {dossier.attendance.length === 0 ? <Empty /> : (
            <div className="flex flex-wrap gap-2">
              {dossier.attendance.map((a) => (
                <span key={a.id} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  {a.personName} <Badge status={a.attendance} />
                </span>
              ))}
            </div>
          )}
        </Section>

        <Section title={t('resolutions')}>
          {dossier.resolutions.length === 0 ? <Empty /> : dossier.resolutions.map((r) => (
            <RecordCard key={r.id} icon="Gavel" title={r.title || r.recordId} subtitle={r.votingResult} right={<Badge status={r.status} />} />
          ))}
        </Section>

        <Section title={t('actions')}>
          {dossier.actions.length === 0 ? <Empty /> : dossier.actions.map((a) => (
            <RecordCard key={a.id} icon="ListChecks" title={a.title || a.recordId} subtitle={`${t('due') || 'Due'}: ${a.dueDate || '—'}`} right={<Badge status={a.actionStatus} />} />
          ))}
        </Section>

        <Section title={t('notices')}>
          {dossier.notices.length === 0 ? <Empty /> : dossier.notices.map((n) => (
            <RecordCard key={n.id} icon="Bell" title={n.subject || n.recordId} subtitle={n.noticeType} right={<Badge status={n.deliveryStatus} />} />
          ))}
        </Section>

        <Section title={t('communications')}>
          {dossier.communications.length === 0 ? <Empty /> : dossier.communications.map((c) => (
            <RecordCard key={c.id} icon="MessageSquare" title={c.subject || c.recordId} subtitle={`${c.channel || ''} · ${c.deliveryStatus || ''}`} />
          ))}
        </Section>
      </div>
    </DetailModal>
  );
}

function Block({ title, text }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{title[0]} · {title[1]}</div>
      <p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{text || '—'}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
