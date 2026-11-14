import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, Button, SectionHero, Tabs, Badge, DataTable, DetailModal, Field2 } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { exportRecordsExcel } from '../excel';

const SOURCE_LABELS = {
  interest: { en: 'Join / Interest', hi: 'जुड़ाव / रुचि' },
  member: { en: 'Membership', hi: 'सदस्यता' },
  volunteer: { en: 'Volunteer', hi: 'स्वयंसेवा' },
  donor: { en: 'Donor', hi: 'दानदाता' },
  internship: { en: 'Internship', hi: 'इंटर्नशिप' },
  contact: { en: 'Contact', hi: 'संपर्क' },
  complaint: { en: 'Complaint / Grievance', hi: 'शिकायत / निवारण' },
};
const TYPE_TONE = {
  interest: 'bg-indigo-100 text-indigo-700',
  member: 'bg-[#12345A]/10 text-[#12345A]',
  volunteer: 'bg-emerald-100 text-emerald-700',
  donor: 'bg-amber-100 text-amber-700',
  internship: 'bg-sky-100 text-sky-700',
  contact: 'bg-slate-100 text-slate-600',
  complaint: 'bg-rose-100 text-rose-700',
};

const FOLLOW_UP = [
  { id: 'new', en: 'New', hi: 'नया', tone: 'bg-amber-100 text-amber-700' },
  { id: 'contacted', en: 'Contacted', hi: 'संपर्क किया', tone: 'bg-blue-100 text-blue-700' },
  { id: 'follow_up', en: 'Follow-up', hi: 'अनुसरण', tone: 'bg-indigo-100 text-indigo-700' },
  { id: 'closed', en: 'Closed', hi: 'बंद', tone: 'bg-emerald-100 text-emerald-700' },
];
const FOLLOW_UP_LABEL = Object.fromEntries(FOLLOW_UP.map((f) => [f.id, f]));

const FIELD_LABELS = {
  fullName: { en: 'Full name', hi: 'पूरा नाम' },
  firstName: { en: 'First name', hi: 'पहला नाम' },
  lastName: { en: 'Last name', hi: 'अंतिम नाम' },
  email: { en: 'Email', hi: 'ईमेल' },
  phone: { en: 'Phone', hi: 'फ़ोन' },
  interestType: { en: 'Interest type', hi: 'रुचि प्रकार' },
  memberType: { en: 'Membership type', hi: 'सदस्यता प्रकार' },
  volunteerType: { en: 'Volunteer type', hi: 'स्वयंसेवा प्रकार' },
  internshipType: { en: 'Internship type', hi: 'इंटर्नशिप प्रकार' },
  category: { en: 'Category', hi: 'श्रेणी' },
  designation: { en: 'Designation', hi: 'पद' },
  position: { en: 'Position', hi: 'पद' },
  city: { en: 'City', hi: 'शहर' },
  state: { en: 'State', hi: 'राज्य' },
  college: { en: 'College', hi: 'महाविद्यालय' },
  course: { en: 'Course', hi: 'पाठ्यक्रम' },
  duration: { en: 'Duration', hi: 'अवधि' },
  amount: { en: 'Amount', hi: 'राशि' },
  pan: { en: 'PAN', hi: 'पैन' },
  donationPurpose: { en: 'Purpose', hi: 'उद्देश्य' },
  reference: { en: 'Reference', hi: 'संदर्भ' },
  subject: { en: 'Subject', hi: 'विषय' },
  description: { en: 'Description', hi: 'विवरण' },
  message: { en: 'Message', hi: 'संदेश' },
  status: { en: 'Status', hi: 'स्थिति' },
  paymentStatus: { en: 'Payment', hi: 'भुगतान' },
  isVerified: { en: 'Verified', hi: 'सत्यापित' },
};
const prettyKey = (k) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

function Pill({ tone, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}

export default function ImsSubmissions() {
  const { lang } = useLang();
  const hi = lang === 'hi';
  const L = useCallback((obj, fallback = '—') => (obj ? (hi ? obj.hi : obj.en) : fallback), [hi]);

  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [detail, setDetail] = useState(null);
  const [remark, setRemark] = useState('');
  const [followUp, setFollowUp] = useState('new');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setErr('');
    try {
      const [list, sum] = await Promise.all([
        ims.submissions({ type: tab, q: query.trim() }),
        ims.submissionsSummary(),
      ]);
      setRows(list.records || []);
      setSummary(sum);
    } catch (e) {
      setErr(e.message || 'Unable to load submissions');
      setRows([]);
    } finally { setLoading(false); }
  }, [tab, query]);

  useEffect(() => {
    const id = setTimeout(load, query ? 250 : 0);
    return () => clearTimeout(id);
  }, [load, query]);

  const openDetail = useCallback((row) => {
    setDetail(row);
    setRemark(row.remark || '');
    setFollowUp(row.followUp || 'new');
  }, []);

  const tabs = useMemo(() => {
    const counts = summary?.counts || {};
    const list = [{ id: 'all', en: 'All', hi: 'सभी', count: summary?.total }];
    for (const [key, label] of Object.entries(SOURCE_LABELS)) {
      if (counts[key] == null) continue;
      list.push({ id: key, en: label.en, hi: label.hi, count: counts[key] });
    }
    return list;
  }, [summary]);

  const saveNote = async () => {
    if (!detail) return;
    setSaving(true);
    try {
      await ims.submissionsUpdateNote(detail.id, { remark, followUp });
      setDetail(null);
      load();
    } catch (e) {
      setErr(e.message || 'Unable to save remark');
    } finally { setSaving(false); }
  };

  const removeRow = useCallback(async (row) => {
    if (!row) return;
    const label = L(SOURCE_LABELS[row.sourceType], row.sourceType);
    const msg = hi
      ? `"${row.name}" (${label}) को हमेशा के लिए हटाएँ?\n\nयह प्रविष्टि स्थायी रूप से मिट जाएगी। इसे वापस नहीं लाया जा सकता।`
      : `Delete "${row.name}" (${label})?\n\nThis permanently removes the submission. This cannot be undone.`;
    if (!window.confirm(msg)) return;
    setDeleting(true);
    try {
      await ims.submissionsDelete(row.id);
      setDetail(null);
      load();
    } catch (e) {
      setErr(e.message || 'Unable to delete submission');
    } finally { setDeleting(false); }
  }, [hi, L, load]);

  const doExport = async () => {
    setExporting(true);
    try {
      const list = await ims.submissions({ type: tab, q: query.trim() });
      const records = (list.records || []).map((r) => ({
        Type: L(SOURCE_LABELS[r.sourceType], r.sourceType),
        Name: r.name,
        Email: r.email,
        Phone: r.phone,
        Details: r.detail,
        Status: r.status,
        Remark: r.remark,
        'Follow-up': L(FOLLOW_UP_LABEL[r.followUp], r.followUp),
        Submitted: r.createdAt ? new Date(r.createdAt).toLocaleString('en-IN') : '',
      }));
      await exportRecordsExcel({
        title: tab === 'all' ? 'Submissions Register' : `${L(SOURCE_LABELS[tab], tab)} Submissions`,
        records,
        sheetName: 'Submissions',
      });
    } catch (e) {
      setErr(e.message || 'Export failed');
    } finally { setExporting(false); }
  };

  const columns = useMemo(() => [
    { key: 'sourceType', en: 'Type', hi: 'प्रकार', render: (r) => <Pill tone={TYPE_TONE[r.sourceType] || 'bg-slate-100 text-slate-600'}>{L(SOURCE_LABELS[r.sourceType], r.sourceType)}</Pill> },
    { key: 'name', en: 'Name', hi: 'नाम', render: (r) => <span className="font-semibold text-[#12345A]">{r.name}</span> },
    { key: 'contact', en: 'Contact', hi: 'संपर्क', render: (r) => <span className="text-xs text-slate-600">{r.email || '—'}{r.phone ? <><br />{r.phone}</> : null}</span> },
    { key: 'detail', en: 'Details', hi: 'विवरण', render: (r) => <span className="line-clamp-2 block max-w-xs text-xs text-slate-500">{r.detail || '—'}</span> },
    { key: 'status', en: 'Status', hi: 'स्थिति', render: (r) => (r.status ? <Badge status={r.status} /> : '—') },
    { key: 'followUp', en: 'Follow-up', hi: 'अनुसरण', render: (r) => { const f = FOLLOW_UP_LABEL[r.followUp] || FOLLOW_UP[0]; return <Pill tone={f.tone}>{L(f)}</Pill>; } },
    { key: 'remark', en: 'Remark', hi: 'टिप्पणी', render: (r) => <span className="line-clamp-2 block max-w-[16rem] text-xs text-slate-600">{r.remark || <span className="text-slate-300">—</span>}</span> },
    { key: 'createdAt', en: 'Submitted', hi: 'प्राप्त', render: (r) => <span className="whitespace-nowrap text-xs text-slate-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '—'}</span> },
    { key: 'actions', en: '', hi: '', align: 'right', render: (r) => (
      <div className="flex items-center justify-end gap-2">
        <button onClick={(e) => { e.stopPropagation(); openDetail(r); }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#176447] hover:bg-slate-50">
          {hi ? 'टिप्पणी / अनुसरण' : 'Remark / Follow-up'}
        </button>
        <button onClick={(e) => { e.stopPropagation(); removeRow(r); }} aria-label={hi ? 'हटाएँ' : 'Delete'} title={hi ? 'हटाएँ' : 'Delete'} className="rounded-lg border border-rose-200 px-2 py-1.5 text-rose-600 hover:bg-rose-50">
          <Icons.Trash2 size={15} />
        </button>
      </div>
    ) },
  ], [L, hi, openDetail, removeRow]);

  return (
    <ImsLayout>
      <SectionHero
        title={hi ? 'आवेदन एवं पंजीकरण' : 'Submissions Register'}
        hi="आवेदन एवं पंजीकरण"
        eyebrow={hi ? 'वेबसाइट से स्वतः प्रविष्टि' : 'Auto-registered from every website form'}
        icon="Inbox"
        tone="teal"
        actions={(
          <Button icon="FileDown" variant="ghost" onClick={doExport} disabled={exporting || !rows || !rows.length}>
            {exporting ? (hi ? 'निर्यात हो रहा है…' : 'Exporting…') : (hi ? 'Excel निर्यात' : 'Export Excel')}
          </Button>
        )}
      >
        <p className="max-w-3xl text-sm font-semibold text-white/80">
          {hi
            ? 'वेबसाइट के हर फ़ॉर्म (सदस्यता, स्वयंसेवा, दान, इंटर्नशिप, संपर्क, शिकायत, जुड़ाव) की प्रविष्टि यहाँ स्वतः दिखती है। नीचे टिप्पणी एवं अनुसरण जोड़ें।'
            : 'Every website form — membership, volunteer, donor, internship, contact, complaint and Join Us — appears here automatically the moment it is submitted. Add an office remark and a follow-up status below.'}
        </p>
      </SectionHero>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {Object.entries(SOURCE_LABELS).map(([key, label]) => (
          <Card key={key} className="p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{L(label)}</p>
            <p className="mt-1 text-2xl font-black text-[#12345A]">{summary?.counts?.[key] ?? '—'}</p>
          </Card>
        ))}
      </div>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="mb-4 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <Icons.Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={hi ? 'नाम, ईमेल, फ़ोन या विवरण खोजें…' : 'Search name, email, phone or details…'}
            className="w-full bg-transparent text-sm outline-none"
          />
          {query && <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600"><Icons.X size={16} /></button>}
        </div>
        <Button icon="RotateCw" variant="ghost" onClick={load}>{hi ? 'ताज़ा करें' : 'Refresh'}</Button>
      </div>

      {err && <Card className="mb-4 border-l-4 border-red-400 p-3 text-sm font-semibold text-red-600">{err}</Card>}

      <DataTable
        columns={columns}
        rows={rows || []}
        loading={loading}
        onRowClick={openDetail}
        empty={hi ? 'इस श्रेणी में कोई प्रविष्टि नहीं — कोई फ़ॉर्म भरते ही यहाँ दिखेगी।' : 'No submissions in this category — a new form submission will appear here.'}
      />

      <DetailModal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.name}
        subtitle={detail ? `${L(SOURCE_LABELS[detail.sourceType], detail.sourceType)} · ${detail.createdAt ? new Date(detail.createdAt).toLocaleString('en-IN') : ''}` : ''}
        wide
      >
        {detail && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(detail.data || {}).map(([k, v]) => (
                <Field2 key={k} label={L(FIELD_LABELS[k], prettyKey(k))} value={String(v)} full={String(v).length > 60} />
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <p className="mb-3 text-[11px] font-black uppercase tracking-wide text-slate-400">
                {hi ? 'कार्यालय टिप्पणी' : 'Office remark'}
              </p>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={3}
                placeholder={hi ? 'टिप्पणी लिखें…' : 'Write a remark…'}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#176447]"
              />
              <p className="mb-2 mt-4 text-[11px] font-black uppercase tracking-wide text-slate-400">
                {hi ? 'अनुसरण स्थिति' : 'Follow-up status'}
              </p>
              <div className="flex flex-wrap gap-2">
                {FOLLOW_UP.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFollowUp(f.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${followUp === f.id ? 'border-[#12345A] bg-[#12345A] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                  >
                    {L(f)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button variant="danger" icon="Trash2" onClick={() => removeRow(detail)} disabled={deleting || saving}>
                {hi ? 'हटाएँ' : 'Delete'}
              </Button>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setDetail(null)}>{hi ? 'रद्द करें' : 'Cancel'}</Button>
                <Button icon="Check" onClick={saveNote} disabled={saving || deleting}>{saving ? (hi ? 'सहेजा जा रहा…' : 'Saving…') : (hi ? 'सहेजें' : 'Save')}</Button>
              </div>
            </div>
          </div>
        )}
      </DetailModal>
    </ImsLayout>
  );
}
