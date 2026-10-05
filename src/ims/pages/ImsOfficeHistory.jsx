// SSF-IMS Managing Committee History — permanent record of committee
// appointments, role changes, re-appointments, resignations, removals and
// relieving over time. Replicates the SSF Digital Office "Managing Committee
// History" register (6 views: dashboard, history, member, position, actions,
// register) with the real office data. Bilingual.
import { useEffect, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, Button, Spinner, Empty } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

const TYPES = ['Appointment', 'Role Change / Transfer', 'Re-appointment', 'Additional Responsibility', 'Resignation', 'Removal', 'Relieving', 'Other'];
const TYPES_HI = {
  Appointment: 'नियुक्ति', 'Role Change / Transfer': 'पद परिवर्तन / स्थानांतरण', 'Re-appointment': 'पुनर्नियुक्ति',
  'Additional Responsibility': 'अतिरिक्त उत्तरदायित्व', Resignation: 'त्यागपत्र', Removal: 'हटाव',
  Relieving: 'मुक्ति', Other: 'अन्य',
};

const DASH = [
  ['Historical Records', 'ऐतिहासिक अभिलेख'], ['Members in History', 'इतिहास में सदस्य'],
  ['Appointments', 'नियुक्तियाँ'], ['Role Changes', 'पद परिवर्तन'],
];
const VIEWS = [
  ['history', 'Committee & Office History', 'समिति एवं पद इतिहास', 'Landmark'],
  ['member', 'Member-wise History', 'सदस्य-वार इतिहास', 'Users'],
  ['position', 'Position History', 'पद इतिहास', 'Target'],
  ['actions', 'Governance Actions', 'शासन कार्रवाई', 'Settings2'],
];

const blank = () => ({ eventDate: new Date().toISOString().slice(0, 10), memberId: '', fullName: '', changeType: 'Appointment', previousRole: '', newRole: '', referenceNo: '', resolutionNo: '', meetingDate: '', details: '', remarks: '' });
const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#FF6600]';

const fmt = (d) => {
  if (!d) return '—';
  const s = String(d).slice(0, 10);
  const [y, m, dd] = s.split('-');
  return y && m && dd ? `${dd}-${m}-${y}` : s;
};
const memberKey = (r) => String(r.memberId || r.fullName || r.recordId);
const roleKey = (r) => String(r.newRole || r.previousRole || 'Unspecified');

// Navy title card identical to the SSF Digital Office "SimpleOfficeCard".
function SimpleOfficeCard({ title, subtitle, children }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-[#002344] p-6 text-white">
        <h2 className="text-2xl font-black">{title}</h2>
        <p className="mt-1 text-white/70">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export function ImsOfficeHistory() {
  const { lang } = useLang();
  const hi = lang === 'hi';
  const L = (en, h) => (hi ? h : en);
  const [tab, setTab] = useState('dashboard');
  const [rows, setRows] = useState(null);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateAsc');
  const [form, setForm] = useState(blank());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const load = async () => {
    let d = await ims.list('officeHistory', { limit: 500 });
    if ((d.records || []).length === 0) {
      await ims.officeHistorySeed().catch(() => {});
      d = await ims.list('officeHistory', { limit: 500 });
    }
    return d.records || [];
  };

  useEffect(() => {
    let active = true;
    (async () => { const r = await load().catch(() => []); if (active) setRows(r); })();
    return () => { active = false; };
  }, []);

  const all = useMemo(() => rows || [], [rows]);
  const members = useMemo(() => Array.from(new Map(all.map(r => [memberKey(r), r])).values()), [all]);
  const roles = useMemo(() => Array.from(new Map(all.map(r => [roleKey(r), r])).values()), [all]);

  const searched = all.filter(r => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [r.recordId, r.recordDate, r.memberId, r.fullName, r.changeType, r.previousRole, r.newRole, r.details, r.remarks].join(' ').toLowerCase().includes(q);
  });
  const sorted = [...searched].sort((a, b) => {
    const da = String(a.eventDate || a.recordDate || ''), db = String(b.eventDate || b.recordDate || '');
    if (sortBy === 'dateDesc') return db.localeCompare(da);
    if (sortBy === 'member') return String(a.memberId || '').localeCompare(String(b.memberId || ''));
    if (sortBy === 'name') return String(a.fullName || '').localeCompare(String(b.fullName || ''));
    return da.localeCompare(db);
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const reset = () => { setEditingId(null); setForm(blank()); setNotice(''); };
  const startEdit = (r) => {
    setEditingId(r.id);
    setForm({ ...blank(), memberId: r.memberId || '', fullName: r.fullName || '', eventDate: (r.eventDate || r.recordDate || '').slice(0, 10), changeType: r.changeType || r.recordType || 'Appointment', previousRole: r.previousRole || '', newRole: r.newRole || '', referenceNo: r.referenceNo || '', resolutionNo: r.resolutionNo || '', meetingDate: (r.meetingDate || '').slice(0, 10), details: r.details || '', remarks: r.remarks || '' });
    setTab('history'); setNotice(''); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async () => {
    const needsRole = !['Removal', 'Resignation', 'Relieving'].includes(form.changeType);
    if (!form.fullName.trim() || !form.eventDate || (needsRole && !form.newRole.trim())) {
      setNotice(L('Full Name, Event Date and New / Current Position are required.', 'पूरा नाम, घटना दिनांक एवं नया / वर्तमान पद आवश्यक हैं।'));
      return;
    }
    setSaving(true); setNotice('');
    try {
      const payload = { ...form, recordDate: form.eventDate, recordType: form.changeType };
      if (editingId) await ims.update('officeHistory', editingId, payload);
      else await ims.create('officeHistory', payload, true);
      setNotice(L('Office History saved successfully.', 'कार्यालय इतिहास सफलतापूर्वक सहेजा गया।'));
      setRows(await load().catch(() => all));
      reset();
    } catch (e) { setNotice(e.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const archive = async (id) => {
    if (!window.confirm(L('Archive this history record?', 'इस इतिहास अभिलेख को संग्रहित करें?'))) return;
    try { await ims.archive('officeHistory', id); setRows(await load().catch(() => all)); } catch (e) { setNotice(e.message); }
  };

  const Th = ({ children }) => <th className="whitespace-nowrap p-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">{children}</th>;

  const Row = ({ r }) => (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="p-3">{fmt(r.eventDate || r.recordDate)}</td>
      <td className="p-3 font-bold text-[#002344]">{r.memberId || '—'}</td>
      <td className="p-3 font-bold">{r.fullName || '—'}</td>
      <td className="p-3">{r.changeType || r.recordType || '—'}</td>
      <td className="p-3">{r.previousRole || '—'}</td>
      <td className="p-3">{r.newRole || '—'}</td>
      <td className="p-3">{r.referenceNo || '—'}</td>
      <td className="p-3">{r.resolutionNo || '—'}</td>
      <td className="p-3">{fmt(r.meetingDate)}</td>
      <td className="max-w-[320px] p-3 text-slate-600">{r.details || '—'}</td>
      <td className="max-w-[280px] p-3 text-slate-500">{r.remarks || '—'}</td>
      <td className="whitespace-nowrap p-3">
        <button type="button" onClick={() => startEdit(r)} className="mr-2 rounded-lg bg-[#002344] px-3 py-1.5 text-xs font-bold text-white">✏️ {L('Edit', 'संपादित')}</button>
        <button type="button" onClick={() => archive(r.id)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700">{L('Archive', 'संग्रह')}</button>
      </td>
    </tr>
  );

  const table = (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1450px] text-sm">
          <thead className="bg-slate-50">
            <tr>{[L('Date', 'दिनांक'), L('Member ID', 'सदस्य आईडी'), L('Full Name', 'पूरा नाम'), L('Type', 'प्रकार'), L('Previous Role', 'पूर्व पद'), L('New / Current Role', 'नया / वर्तमान पद'), L('Reference', 'संदर्भ'), L('Resolution', 'संकल्प'), L('Meeting', 'बैठक'), L('Details', 'विवरण'), L('Remarks', 'टिप्पणी'), L('Action', 'कार्रवाई')].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>{sorted.map(r => <Row key={r.id} r={r} />)}
            {!sorted.length && <tr><td colSpan={12} className="p-8 text-center text-slate-500">{L('No history records found.', 'कोई इतिहास अभिलेख नहीं मिला।')}</td></tr>}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const formCard = (
    <Card className="p-5">
      <h3 className="text-lg font-black text-[#002344]">{editingId ? L('Update Office History', 'कार्यालय इतिहास अद्यतन') : L('Add Office History', 'कार्यालय इतिहास जोड़ें')}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-bold text-slate-600">{L('Member ID', 'सदस्य आईडी')}<input value={form.memberId} onChange={e => set('memberId', e.target.value)} className={inputCls} placeholder="SSF-MBR-00001" /></label>
        <label className="text-xs font-bold text-slate-600">{L('Full Name *', 'पूरा नाम *')}<input value={form.fullName} onChange={e => set('fullName', e.target.value)} className={inputCls} /></label>
        <label className="text-xs font-bold text-slate-600">{L('Event Date *', 'घटना दिनांक *')}<input type="date" value={form.eventDate} onChange={e => set('eventDate', e.target.value)} className={inputCls} /></label>
        <label className="text-xs font-bold text-slate-600">{L('Type *', 'प्रकार *')}<select value={form.changeType} onChange={e => set('changeType', e.target.value)} className={inputCls}>{TYPES.map(x => <option key={x} value={x}>{L(x, TYPES_HI[x])}</option>)}</select></label>
        <label className="text-xs font-bold text-slate-600">{L('Previous Position', 'पूर्व पद')}<input value={form.previousRole} onChange={e => set('previousRole', e.target.value)} className={inputCls} /></label>
        <label className="text-xs font-bold text-slate-600">{L('New / Current Position', 'नया / वर्तमान पद')}<input value={form.newRole} onChange={e => set('newRole', e.target.value)} className={inputCls} /></label>
        <label className="text-xs font-bold text-slate-600">{L('Reference / File No.', 'संदर्भ / फ़ाइल संख्या')}<input value={form.referenceNo} onChange={e => set('referenceNo', e.target.value)} className={inputCls} /></label>
        <label className="text-xs font-bold text-slate-600">{L('Resolution No.', 'संकल्प संख्या')}<input value={form.resolutionNo} onChange={e => set('resolutionNo', e.target.value)} className={inputCls} /></label>
        <label className="text-xs font-bold text-slate-600">{L('Meeting Date', 'बैठक दिनांक')}<input type="date" value={form.meetingDate} onChange={e => set('meetingDate', e.target.value)} className={inputCls} /></label>
        <label className="text-xs font-bold text-slate-600 sm:col-span-2 lg:col-span-3">{L('Details', 'विवरण')}<textarea rows={2} value={form.details} onChange={e => set('details', e.target.value)} className={inputCls} /></label>
        <label className="text-xs font-bold text-slate-600 sm:col-span-2 lg:col-span-4">{L('Remarks', 'टिप्पणी')}<textarea rows={2} value={form.remarks} onChange={e => set('remarks', e.target.value)} className={inputCls} /></label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button icon="Save" onClick={save} disabled={saving}>{saving ? '…' : editingId ? L('Update Office History', 'कार्यालय इतिहास अद्यतन') : L('Save Office History', 'कार्यालय इतिहास सहेजें')}</Button>
        {editingId && <Button variant="ghost" onClick={reset}>{L('Cancel Edit', 'संपादन रद्द')}</Button>}
      </div>
    </Card>
  );

  const dashboard = (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {DASH.map(([en, h], i) => {
          const vals = [all.length, members.length, all.filter(r => r.changeType === 'Appointment').length, all.filter(r => String(r.changeType || '').includes('Role Change')).length];
          return (
            <Card key={en} className="border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-bold text-slate-500">{L(en, h)}</div>
              <div className="mt-1 text-3xl font-black text-[#002344]">{vals[i]}</div>
            </Card>
          );
        })}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {VIEWS.map(([id, en, h, icon]) => {
          const I = Icons[icon] || Icons.FileText;
          return (
            <button key={id} type="button" onClick={() => setTab(id)} className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#1F7A70] hover:shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1F7A70]"><I size={13} /> SSF {L('Governance Record', 'शासन अभिलेख')}</div>
              <div className="mt-1 font-black text-[#002344]">{L(en, h)}</div>
              <div className="mt-1 text-xs text-slate-500">{L('Open section', 'अनुभाग खोलें')}</div>
            </button>
          );
        })}
      </div>
      <Card className="p-5">
        <h3 className="text-xl font-black text-[#002344]">{L('Historical Committee Members', 'ऐतिहासिक समिति सदस्य')}</h3>
        <p className="mt-1 text-sm text-slate-500">{L('Old and current committee members remain preserved here. Records can be corrected later; this register does not replace Membership History.', 'पुराने एवं वर्तमान समिति सदस्य यहाँ सुरक्षित रहते हैं। अभिलेख बाद में सुधारे जा सकते हैं; यह रजिस्टर सदस्यता इतिहास का स्थान नहीं लेता।')}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {members.slice(0, 12).map((r, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4">
              <div className="font-black text-[#002344]">{r.fullName || '—'}</div>
              <div className="mt-1 text-xs font-bold text-[#1F7A70]">{r.memberId || '—'}</div>
              <div className="mt-2 text-sm text-slate-600">{r.newRole || r.previousRole || '—'}</div>
              <button type="button" onClick={() => startEdit(r)} className="mt-3 rounded-lg bg-[#002344] px-3 py-2 text-xs font-bold text-white">✏️ {L('Edit History', 'इतिहास संपादित')}</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const history = (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder={L('Search member, ID, role or action', 'सदस्य, आईडी, पद या कार्रवाई खोजें')} className={inputCls} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={inputCls + ' sm:max-w-xs'}>
          <option value="dateAsc">{L('Date — Oldest First', 'दिनांक — पुराना पहले')}</option>
          <option value="dateDesc">{L('Date — Newest First', 'दिनांक — नया पहले')}</option>
          <option value="member">{L('Member ID — A to Z', 'सदस्य आईडी — A से Z')}</option>
          <option value="name">{L('Name — A to Z', 'नाम — A से Z')}</option>
        </select>
      </div>
      <div className="text-xs text-slate-500">{sorted.length} {L('matching record(s)', 'मेल खाते अभिलेख')} · {members.length} {L('member(s)', 'सदस्य')}</div>
      {formCard}
      {table}
    </div>
  );

  const memberView = (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{L('Member-wise view groups the preserved committee / office history by member. It is separate from membership joining, validity and status.', 'सदस्य-वार दृश्य सुरक्षित समिति / पद इतिहास को सदस्य के अनुसार समूहित करता है। यह सदस्यता, वैधता एवं स्थिति से अलग है।')}</div>
      <div className="grid gap-4 md:grid-cols-2">
        {members.map((m, i) => {
          const mine = all.filter(r => memberKey(r) === memberKey(m)).sort((a, b) => String(a.eventDate || a.recordDate).localeCompare(String(b.eventDate || b.recordDate)));
          return (
            <Card key={i} className="p-5">
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="font-black text-[#002344]">{m.fullName || '—'}</h3>
                  <div className="mt-1 text-xs font-bold text-[#1F7A70]">{m.memberId || '—'}</div>
                </div>
                <span className="h-fit rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{mine.length} {L('record(s)', 'अभिलेख')}</span>
              </div>
              <div className="mt-4 space-y-2">
                {mine.map(r => (
                  <div key={r.id} className="border-t border-slate-100 pt-2 text-sm">
                    <b>{fmt(r.eventDate || r.recordDate)}</b> · {r.changeType || r.recordType} · {r.previousRole || '—'} → {r.newRole || '—'}
                    <div className="mt-1 text-xs text-slate-500">{r.details || r.remarks || '—'}</div>
                    <button type="button" onClick={() => startEdit(r)} className="mt-2 rounded-lg bg-[#002344] px-3 py-1.5 text-xs font-bold text-white">{L('Edit', 'संपादित')}</button>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const position = (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-[#123B5D]">{L('Position history shows the roles recorded over time. It does not infer tenure where dates are missing or approximate.', 'पद इतिहास समय के साथ दर्ज पदों को दिखाता है। जहाँ तिथियाँ अनुपलब्ध या अनुमानित हैं वहाँ कार्यकाल का अनुमान नहीं लगाया जाता।')}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((r, i) => (
          <Card key={i} className="p-5">
            <div className="text-xs font-black text-[#1F7A70]">{r.newRole || r.previousRole || L('Unspecified', 'अनिर्दिष्ट')}</div>
            <h3 className="mt-1 font-black text-[#002344]">{r.fullName || '—'}</h3>
            <p className="mt-2 text-sm text-slate-600">{r.changeType || '—'} · {fmt(r.eventDate)}</p>
            <p className="mt-2 text-xs text-slate-500">{r.details || r.remarks || '—'}</p>
            <button type="button" onClick={() => startEdit(r)} className="mt-3 rounded-lg bg-[#002344] px-3 py-2 text-xs font-bold text-white">✏️ {L('Edit History', 'इतिहास संपादित')}</button>
          </Card>
        ))}
      </div>
    </div>
  );

  const actions = (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{L('Use this register for appointment, role change, re-appointment, additional responsibility, resignation, removal and relieving. Formal separation records remain in the separate Role Changes & Separation module.', 'इस रजिस्टर का उपयोग नियुक्ति, पद परिवर्तन, पुनर्नियुक्ति, अतिरिक्त उत्तरदायित्व, त्यागपत्र, हटाव एवं मुक्ति हेतु करें। औपचारिक पृथक्करण अभिलेख अलग पद परिवर्तन एवं पृथक्करण मॉड्यूल में रहते हैं।')}</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TYPES.map(type => (
          <button key={type} type="button" onClick={() => { setForm({ ...blank(), changeType: type }); setEditingId(null); setTab('history'); }} className="rounded-xl border border-slate-200 bg-white p-4 text-left font-bold text-[#002344] transition hover:border-[#1F7A70] hover:bg-slate-50">
            {L(type, TYPES_HI[type])}
          </button>
        ))}
      </div>
    </div>
  );

  const register = (
    <div className="space-y-5">
      {formCard}
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-black text-[#002344]">{L('Complete Register', 'पूर्ण रजिस्टर')}</h3>
              <p className="mt-1 text-sm text-slate-500">{L('All preserved Managing Committee History records — edit any existing entry without creating a duplicate.', 'सभी सुरक्षित प्रबंधकारिणी समिति इतिहास अभिलेख — बिना नकल बनाए किसी भी मौजूदा प्रविष्टि को संपादित करें।')}</p>
            </div>
            <div className="text-sm font-bold text-[#1F7A70]">{all.length} {L('historical record(s)', 'ऐतिहासिक अभिलेख')}</div>
          </div>
        </div>
      </Card>
      {table}
    </div>
  );

  const tabs = [
    ['dashboard', '📊 Dashboard / डैशबोर्ड'],
    ['history', '🏛️ Committee & Office History / समिति एवं पद इतिहास'],
    ['member', '👤 Member-wise History / सदस्य-वार इतिहास'],
    ['position', '🎯 Position History / पद इतिहास'],
    ['actions', '⚙️ Governance Actions / शासन कार्रवाई'],
    ['register', '📋 Complete Register / पूर्ण रजिस्टर'],
  ];

  return (
    <ImsLayout active="office_history">
      <SimpleOfficeCard
        title={L('🏛️ Managing Committee History / प्रबंधकारिणी समिति इतिहास', '🏛️ प्रबंधकारिणी समिति इतिहास / Managing Committee History')}
        subtitle={L('Permanent record of appointment, role change, re-appointment, resignation, removal and relieving in the Foundation over time.', 'संस्था में समय-समय पर हुए appointment, role change, re-appointment, resignation, removal और relieving का permanent historical record.')}
      >
        {notice && <Card className="border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{notice}</Card>}
        {!rows ? <Spinner /> : (
          <div className="space-y-5">
            <Card className="p-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {tabs.map(([id, label]) => (
                  <button key={id} type="button" onClick={() => setTab(id)}
                    className={`min-h-[52px] rounded-xl px-2.5 py-2.5 text-center text-xs font-bold leading-tight transition sm:text-sm ${tab === id ? 'bg-[#002344] text-white' : 'bg-slate-100 text-[#123B5D] hover:bg-slate-200'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </Card>
            {tab === 'dashboard' ? dashboard : tab === 'history' ? history : tab === 'member' ? memberView : tab === 'position' ? position : tab === 'actions' ? actions : register}
            {!all.length && <Card><Empty label={L('No history records found.', 'कोई इतिहास अभिलेख नहीं मिला।')} /></Card>}
          </div>
        )}
      </SimpleOfficeCard>
    </ImsLayout>
  );
}
