import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import ImsLayout from '../ImsLayout';
import { Button, SectionHero, DataTable, Badge, FormDrawer } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { schemaFor } from '../schemas';
import { useResourceRecords } from '../record';

// Members list — clicking a member opens its full Member 360.
export default function ImsMembersList() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { rows: members, reload } = useResourceRecords('members');
  const { rows: persons } = useResourceRecords('persons');
  const [drawer, setDrawer] = useState(false);
  const [saving, setSaving] = useState(false);

  const nameOf = useMemo(() => {
    const map = {};
    (persons || []).forEach((p) => { map[p.id] = p.fullName || p.recordId; });
    return (id) => map[id] || (id ? `#${id}` : '—');
  }, [persons]);

  const create = async (form) => {
    setSaving(true);
    try { await ims.create('members', form); setDrawer(false); reload(); } finally { setSaving(false); }
  };

  const cols = [
    { key: 'recordId', en: 'Member No', hi: 'सदस्य संख्या', render: (r) => <span className="font-mono text-xs text-slate-500">{r.memberNo || r.recordId}</span> },
    { key: 'personId', en: 'Member', hi: 'सदस्य', render: (r) => <span className="font-semibold text-[#002344]">{nameOf(r.personId)}</span> },
    { key: 'category', en: 'Category', hi: 'श्रेणी', render: (r) => r.category || '—' },
    { key: 'admissionDate', en: 'Admission', hi: 'प्रवेश', render: (r) => r.admissionDate || '—' },
    { key: 'feeAmount', en: 'Fee', hi: 'शुल्क', render: (r) => (r.feeAmount ? `₹${r.feeAmount} / ${r.feeFrequency || ''}` : '—') },
    { key: 'applicationStatus', en: 'Status', hi: 'स्थिति', render: (r) => <Badge status={r.applicationStatus || r.status} /> },
  ];

  return (
    <ImsLayout active="members">
      <SectionHero title={t('members')} hi="सदस्य" eyebrow={t('governance')} icon="IdCard"
        actions={<Button variant="hero" icon="Plus" onClick={() => setDrawer(true)}>{t('new_record')}</Button>} />
      <p className="mb-3 text-sm text-slate-500">{t('member_360')}: {t('overview')} → Fee/Dues → {t('attendance')} → {t('cases')} → {t('documents')} → {t('history_tab')}</p>
      <DataTable columns={cols} rows={members} onRowClick={(r) => navigate({ to: '/ims/member/$id', params: { id: String(r.id) } })} empty={t('no_records')} />
      <FormDrawer open={drawer} title={t('new_record')} schema={schemaFor('members')} initial={{}} saving={saving}
        onClose={() => setDrawer(false)} onSubmit={create} />
    </ImsLayout>
  );
}
