import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, Badge, Button, SectionHero, Tabs, DataTable, DetailModal, Field2, Lifecycle, Toggle, FormDrawer, Empty, Spinner } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { schemaFor } from '../schemas';
import { useResourceRecords } from '../record';

const STAGES = [
  { id: 'detected', en: 'Detected', hi: 'पता चला' },
  { id: 'assigned', en: 'Assigned', hi: 'सौंपा' },
  { id: 'notified', en: 'Notified', hi: 'सूचित' },
  { id: 'response', en: 'Response', hi: 'उत्तर' },
  { id: 'review', en: 'Review', hi: 'समीक्षा' },
  { id: 'decision', en: 'Decision', hi: 'निर्णय' },
  { id: 'action', en: 'Action', hi: 'कार्य' },
  { id: 'followUp', en: 'Follow-up', hi: 'अनुवर्तन' },
  { id: 'closed', en: 'Closed', hi: 'बंद' },
];

export default function ImsCases() {
  const { t } = useLang();
  const [tab, setTab] = useState('board');
  const [showSensitive, setShowSensitive] = useState(false);
  const { rows: cases, reload } = useResourceRecords('cases');
  const { rows: notices, reload: reloadNotices } = useResourceRecords('notices');
  const [detail, setDetail] = useState(null);
  const [drawer, setDrawer] = useState(null); // { resource }
  const [saving, setSaving] = useState(false);

  const board = useMemo(() => {
    const map = {};
    STAGES.forEach((s) => { map[s.id] = []; });
    (cases || []).forEach((c) => {
      const stage = map[c.stage] ? c.stage : 'detected';
      map[stage].push(c);
    });
    return map;
  }, [cases]);

  const visibleCases = useMemo(() => {
    if (showSensitive) return cases || [];
    return (cases || []).filter((c) => !c.confidential);
  }, [cases, showSensitive]);

  const create = async (form) => {
    setSaving(true);
    try {
      await ims.create(drawer.resource, form);
      setDrawer(null);
      drawer.resource === 'cases' ? reload() : reloadNotices();
    } finally { setSaving(false); }
  };

  const caseCols = [
    { key: 'recordId', en: 'ID', render: (r) => <span className="font-mono text-xs text-slate-500">{r.recordId}</span> },
    { key: 'title', en: 'Case', render: (r) => <span className="font-semibold text-[#002344]">{r.title || '—'}</span> },
    { key: 'caseType', en: 'Type', render: (r) => r.caseType || '—' },
    { key: 'deadline', en: 'Deadline', render: (r) => r.deadline || '—' },
    { key: 'stage', en: 'Stage', render: (r) => <Badge status={r.stage} /> },
    { key: 'confidential', en: 'Access', render: (r) => (r.confidential ? <Badge status="rejected" /> : <Badge status="active" />) },
  ];

  return (
    <ImsLayout active="cases">
      <SectionHero title={t('notices_cases')} hi="सूचनाएँ एवं प्रकरण" eyebrow={t('governance')} icon="AlertTriangle" tone="orange"
        actions={<>
          <Button variant="hero" icon="Plus" onClick={() => setDrawer({ resource: 'cases' })}>Case</Button>
          <Button variant="hero" icon="Bell" onClick={() => setDrawer({ resource: 'notices' })}>Notice</Button>
        </>} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onChange={setTab} tabs={[
          { id: 'board', en: 'Case Board', hi: 'प्रकरण बोर्ड', count: (cases || []).length },
          { id: 'cases', en: 'Cases', hi: 'प्रकरण' },
          { id: 'notices', en: 'Notices', hi: 'सूचनाएँ', count: (notices || []).length },
        ]} />
        <Toggle on={showSensitive} onChange={setShowSensitive} label={showSensitive ? 'Sensitive: visible' : 'Sensitive: hidden'} />
      </div>

      {tab === 'board' && (
        <div className="flex gap-3 overflow-x-auto pb-3">
          {STAGES.map((s) => (
            <div key={s.id} className="min-w-[220px] flex-1">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">{s.en} <span className="text-slate-400">· {s.hi}</span></span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">{board[s.id].length}</span>
              </div>
              <div className="space-y-2">
                {board[s.id].filter((c) => showSensitive || !c.confidential).map((c) => (
                  <button key={c.id} type="button" onClick={() => setDetail(c)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-[#002344]/30 hover:shadow-sm">
                    <span className="block text-sm font-semibold text-slate-800">{c.title || c.recordId}</span>
                    <span className="mt-1 block text-[11px] text-slate-400">{c.caseType || ''}</span>
                    {c.confidential && <span className="mt-1 inline-block rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">Sensitive</span>}
                  </button>
                ))}
                {board[s.id].length === 0 && <div className="rounded-xl border border-dashed border-slate-200 p-3 text-center text-[11px] text-slate-300">—</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'cases' && <DataTable columns={caseCols} rows={visibleCases} onRowClick={setDetail} empty={t('no_records')} />}

      {tab === 'notices' && (
        <DataTable rows={notices} empty={t('no_records')} columns={[
          { key: 'recordId', en: 'ID', render: (r) => <span className="font-mono text-xs text-slate-500">{r.recordId}</span> },
          { key: 'subject', en: 'Notice', render: (r) => <span className="font-semibold text-[#002344]">{r.subject || '—'}</span> },
          { key: 'noticeType', en: 'Type', render: (r) => r.noticeType || '—' },
          { key: 'deliveryStatus', en: 'Delivery', render: (r) => <Badge status={r.deliveryStatus} /> },
          { key: 'reminderCount', en: 'Reminders', render: (r) => r.reminderCount ?? 0 },
        ]} />
      )}

      <CaseDetail item={detail} onClose={() => setDetail(null)} />

      <FormDrawer open={!!drawer} title={t('new_record')} schema={drawer ? schemaFor(drawer.resource) : null} initial={{}} saving={saving}
        onClose={() => setDrawer(null)} onSubmit={create} />
    </ImsLayout>
  );
}

function CaseDetail({ item, onClose }) {
  if (!item) return null;
  return (
    <DetailModal open onClose={onClose} wide title={item.title || item.recordId} subtitle={`${item.recordId} · ${item.caseType || ''}`}
      badge={<Badge status={item.stage} />}>
      <div className="space-y-5">
        <Lifecycle steps={STAGES} value={item.stage} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field2 label={['Related Person', 'संबंधित व्यक्ति']} value={item.personId ? `#${item.personId}` : '—'} />
          <Field2 label={['Responsible', 'उत्तरदायी']} value={item.responsiblePersonId ? `#${item.responsiblePersonId}` : '—'} />
          <Field2 label={['Deadline', 'अंतिम तिथि']} value={item.deadline} />
          <Field2 label={['Access', 'पहुँच']} value={item.confidential ? 'Restricted / Sensitive' : 'Open'} />
          <Field2 label={['Closed On', 'बंद दिनांक']} value={item.closedOn} />
        </div>
        <Block title={['Complaint / Issue', 'शिकायत / मामला']} text={item.description} />
        <Block title={['Evidence / Documents', 'प्रमाण / दस्तावेज़']} text={item.evidence} />
        <Block title={['Response / Reply', 'उत्तर']} text={item.response} />
        <Block title={['Decision / Resolution', 'निर्णय / संकल्प']} text={item.decision} />
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
