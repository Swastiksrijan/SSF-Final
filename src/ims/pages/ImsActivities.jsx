import { useMemo, useState } from 'react';
import ImsLayout from '../ImsLayout';
import { Card, Badge, Button, SectionHero, Tabs, DataTable, DetailModal, Field2, Toggle, FormDrawer, StatStrip, Empty } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { schemaFor } from '../schemas';
import { useResourceRecords } from '../record';

// Activities that cost or received nothing are still real work — keep them.
export default function ImsActivities() {
  const { t } = useLang();
  const [tab, setTab] = useState('all');
  const [freeOnly, setFreeOnly] = useState(false);
  const { rows: activities, reload } = useResourceRecords('activities');
  const { rows: beneficiaries } = useResourceRecords('beneficiaries');
  const [detail, setDetail] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [saving, setSaving] = useState(false);

  const freeCount = (activities || []).filter((a) => a.isFree).length;
  const withOutcome = (activities || []).filter((a) => a.outcome).length;
  const participants = (activities || []).reduce((s, a) => s + (Number(a.participants) || 0), 0);

  const rows = useMemo(() => {
    let r = activities || [];
    if (tab === 'byType') r = [...r];
    if (freeOnly) r = r.filter((a) => a.isFree);
    return r;
  }, [activities, tab, freeOnly]);

  const create = async (form) => {
    setSaving(true);
    try { await ims.create('activities', form); setDrawer(false); reload(); } finally { setSaving(false); }
  };

  const cols = [
    { key: 'recordId', en: 'ID', render: (r) => <span className="font-mono text-xs text-slate-500">{r.recordId}</span> },
    { key: 'title', en: 'Activity', render: (r) => <span className="font-semibold text-[#002344]">{r.title || '—'}</span> },
    { key: 'activityType', en: 'Type', render: (r) => r.activityType || '—' },
    { key: 'activityDate', en: 'Date', render: (r) => r.activityDate || '—' },
    { key: 'participants', en: 'Participants', render: (r) => r.participants ?? 0 },
    { key: 'isFree', en: 'Cost', render: (r) => (r.isFree ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">₹0</span> : <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">Funded</span>) },
    { key: 'outcome', en: 'Outcome', render: (r) => (r.outcome ? String(r.outcome).slice(0, 30) : '—') },
  ];

  return (
    <ImsLayout active="activities">
      <SectionHero title={t('activities')} hi="गतिविधियाँ" eyebrow={t('programmes')} icon="Activity" tone="teal"
        actions={<Button variant="hero" icon="Plus" onClick={() => setDrawer(true)}>{t('new_record')}</Button>} />

      <div className="mb-5">
        <StatStrip items={[
          { labelKey: 'activities', label: t('activities'), value: (activities || []).length, icon: 'Activity' },
          { label: '₹0 (Free)', value: freeCount, icon: 'HeartHandshake', tone: 'green' },
          { label: 'With outcome', value: withOutcome, icon: 'TrendingUp', tone: 'navy' },
          { labelKey: 'beneficiaries', label: t('beneficiaries'), value: participants, icon: 'Users', tone: 'orange' },
        ]} />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onChange={setTab} tabs={[
          { id: 'all', en: 'All Activities', hi: 'सभी गतिविधियाँ', count: (activities || []).length },
          { id: 'byType', en: 'By Type', hi: 'प्रकार अनुसार' },
          { id: 'beneficiaries', en: 'Beneficiaries', hi: 'लाभार्थी', count: (beneficiaries || []).length },
        ]} />
        <Toggle on={freeOnly} onChange={setFreeOnly} label={freeOnly ? 'Only ₹0 activities' : 'All costs'} />
      </div>

      {tab === 'all' && <DataTable columns={cols} rows={rows} onRowClick={setDetail} empty={t('no_records')} />}

      {tab === 'byType' && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groupBy(rows, (a) => a.activityType || 'other')).map(([type, list]) => (
            <Card key={type} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#002344]">{type}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">{list.length}</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">{list.reduce((s, a) => s + (Number(a.participants) || 0), 0)} participants · {list.filter((a) => a.isFree).length} free</p>
            </Card>
          ))}
          {rows.length === 0 && <Card><Empty /></Card>}
        </div>
      )}

      {tab === 'beneficiaries' && (
        <DataTable rows={beneficiaries} empty={t('no_records')} columns={[
          { key: 'recordId', en: 'ID', render: (r) => <span className="font-mono text-xs text-slate-500">{r.recordId}</span> },
          { key: 'household', en: 'Household', render: (r) => <span className="font-semibold text-[#002344]">{r.household || '—'}</span> },
          { key: 'personId', en: 'Person', render: (r) => (r.personId ? `#${r.personId}` : '—') },
          { key: 'services', en: 'Services', render: (r) => (r.services ? String(r.services).slice(0, 40) : '—') },
          { key: 'consent', en: 'Consent', render: (r) => (r.consent ? '✓' : '—') },
        ]} />
      )}

      <ActivityDetail item={detail} onClose={() => setDetail(null)} />

      <FormDrawer open={drawer} title={t('new_record')} schema={schemaFor('activities')} initial={{}} saving={saving}
        onClose={() => setDrawer(false)} onSubmit={create} />
    </ImsLayout>
  );
}

function ActivityDetail({ item, onClose }) {
  if (!item) return null;
  return (
    <DetailModal open onClose={onClose} wide title={item.title || item.recordId} subtitle={`${item.recordId} · ${item.activityType || ''}`}
      badge={item.isFree ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">₹0 Free</span> : <Badge status="active" />}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field2 label={['Date', 'दिनांक']} value={item.activityDate} />
          <Field2 label={['Participants', 'प्रतिभागी']} value={item.participants} />
          <Field2 label={['Project', 'परियोजना']} value={item.projectId ? `#${item.projectId}` : '—'} />
          <Field2 label={['Cost', 'लागत']} value={item.isFree ? '₹0 (no cost)' : 'Funded'} />
        </div>
        <Block title={['Outcome', 'परिणाम']} text={item.outcome} />
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

function groupBy(arr, keyFn) {
  return arr.reduce((acc, x) => { const k = keyFn(x); (acc[k] = acc[k] || []).push(x); return acc; }, {});
}
