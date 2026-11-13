import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, PageHeader, Badge, Empty, Spinner, Button, Kpi, Tabs, Field2 } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { API_BASE_URL } from '../../config/api';
import { exportRecordsExcel } from '../excel';
import { exportRecordsPdf } from '../pdf';

// ---- option lists (value + bilingual label) --------------------------------
const DIRECTION = [['outward', 'Outward', 'जावक'], ['inward', 'Inward', 'आवक']];
const TYPES = [
  ['official_email', 'Official Email', 'आधिकारिक ईमेल'],
  ['official_letter', 'Official Letter', 'आधिकारिक पत्र'],
  ['application', 'Application', 'आवेदन'],
  ['project_proposal', 'Project Proposal', 'परियोजना प्रस्ताव'],
  ['request_for_guidance', 'Request for Guidance', 'मार्गदर्शन हेतु अनुरोध'],
  ['funding_csr_proposal', 'Funding / CSR Proposal', 'निधि / सीएसआर प्रस्ताव'],
  ['collaboration_request', 'Collaboration Request', 'सहयोग अनुरोध'],
  ['reminder', 'Reminder', 'अनुस्मारक'],
  ['notice', 'Notice', 'सूचना'],
  ['reply', 'Reply', 'उत्तर'],
  ['other', 'Other', 'अन्य'],
];
const MODES = [
  ['email', 'Email', 'ईमेल'],
  ['speed_post', 'Speed Post', 'स्पीड पोस्ट'],
  ['registered_post', 'Registered Post', 'पंजीकृत डाक'],
  ['ordinary_post', 'Ordinary Post', 'साधारण डाक'],
  ['hand_delivery', 'Hand Delivery', 'हस्त वितरण'],
  ['online_portal', 'Online Portal', 'ऑनलाइन पोर्टल'],
  ['other', 'Other', 'अन्य'],
];
const DEPT_CATS = [
  ['central_government', 'Central Government', 'केंद्र सरकार'],
  ['state_government', 'State Government', 'राज्य सरकार'],
  ['district_administration', 'District Administration', 'जिला प्रशासन'],
  ['government_department', 'Government Department', 'सरकारी विभाग'],
  ['ngo_foundation', 'NGO / Foundation / Society', 'गैर-सरकारी संगठन / संस्था'],
  ['csr_corporate', 'CSR / Corporate', 'सीएसआर / कॉर्पोरेट'],
  ['bank_financial', 'Bank / Financial Institution', 'बैंक / वित्तीय संस्थान'],
  ['educational_institution', 'Educational Institution', 'शैक्षणिक संस्थान'],
  ['other', 'Other', 'अन्य'],
];
const DELIVERY = [
  ['draft', 'Draft', 'प्रारूप'], ['sent', 'Sent', 'भेजा गया'], ['delivered', 'Delivered', 'पहुँचा'],
  ['failed', 'Failed', 'विफल'], ['returned', 'Returned / Bounced', 'वापस / बाउंस'],
  ['unknown', 'Unknown', 'अज्ञात'], ['not_applicable', 'Not Applicable', 'लागू नहीं'],
];
const REPLY = [
  ['awaiting_reply', 'Awaiting Reply', 'उत्तर प्रतीक्षित'], ['reply_received', 'Reply Received', 'उत्तर प्राप्त'],
  ['no_reply', 'No Reply', 'कोई उत्तर नहीं'], ['not_required', 'Not Required', 'आवश्यक नहीं'],
];
const FOLLOWUP = [
  ['not_due', 'Not Due', 'देय नहीं'], ['due', 'Due', 'देय'], ['follow_up_done', 'Follow-up Done', 'अनुस्मारक किया'],
  ['closed', 'Closed', 'बंद'], ['not_required', 'Not Required', 'आवश्यक नहीं'],
];
const PRIORITY = [['normal', 'Normal', 'सामान्य'], ['important', 'Important', 'महत्वपूर्ण'], ['urgent', 'Urgent', 'अत्यावश्यक']];

const labelOf = (list, value, lang) => {
  const f = list.find((x) => x[0] === value);
  if (!f) return value || '—';
  return lang === 'hi' ? f[2] : f[1];
};

export default function ImsCorrespondence() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const search = useSearch({ from: '/ims/correspondence' });
  const tab = (search && search.tab) || 'dashboard';
  const setTab = (id) => navigate({ to: '/ims/correspondence', search: id === 'dashboard' ? {} : { tab: id } });

  const [stats, setStats] = useState(null);
  const [rows, setRows] = useState(null);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState('');
  const [drawer, setDrawer] = useState(null); // {mode, initial}
  const [viewing, setViewing] = useState(null);
  const [replies, setReplies] = useState(null);

  const [filters, setFilters] = useState({ search: '', fromDate: '', toDate: '', direction: '', deliveryStatus: '', replyStatus: '' });
  const direction = tab === 'outward' ? 'outward' : tab === 'inward' ? 'inward' : '';

  const [nonce, setNonce] = useState(0);

  const loadStats = useCallback(() => {
    ims.corrDashboard().then(setStats).catch(() => setStats(null));
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  useEffect(() => {
    if (!['all', 'outward', 'inward'].includes(tab)) return;
    let alive = true;
    (async () => {
      try {
        const params = { limit: 500, ...filters };
        if (direction) params.direction = direction;
        for (const k of Object.keys(params)) if (params[k] === '') delete params[k];
        const r = await ims.corrList(params);
        if (alive) { setRows(r.records || []); setTotal(r.total || 0); setErr(''); }
      } catch (e) { if (alive) { setErr(e.message); setRows([]); } }
    })();
    return () => { alive = false; };
  }, [tab, direction, filters, nonce]);

  const refresh = () => { loadStats(); setNonce((n) => n + 1); };

  const openReplies = async (row) => {
    setViewing(row); setReplies(null);
    try { const d = await ims.corrReplies(row.id); setReplies(d.replies || []); } catch { setReplies([]); }
  };

  const tabs = [
    { id: 'dashboard', en: 'Dashboard', hi: 'डैशबोर्ड' },
    { id: 'all', en: 'All Communications', hi: 'सभी पत्राचार', count: stats && stats.total },
    { id: 'outward', en: 'Outward Register', hi: 'जावक रजिस्टर', count: stats && stats.outward },
    { id: 'inward', en: 'Inward Register', hi: 'आवक रजिस्टर', count: stats && stats.inward },
    { id: 'pending', en: 'Pending Replies', hi: 'प्रतीक्षित उत्तर', count: stats && stats.awaitingReplies },
    { id: 'followup', en: 'Follow-up', hi: 'अनुसरण', count: stats && stats.followUpDue },
    { id: 'reports', en: 'Reports', hi: 'रिपोर्ट' },
  ];

  return (
    <ImsLayout active="communications">
      <PageHeader
        title={lang === 'hi' ? 'पत्राचार एवं संचार प्रबंधन' : 'Correspondence & Communication Management'}
        subtitle={lang === 'hi' ? 'एक ही मास्टर सिस्टम में जावक एवं आवक पत्राचार' : 'One master system for all outward and inward correspondence'}
        actions={<>
          <Button icon="Plus" onClick={() => setDrawer({ mode: 'create', initial: direction ? { direction } : {} })}>
            {lang === 'hi' ? 'नई प्रविष्टि' : 'New Entry'}
          </Button>
        </>}
      />
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {err && <Card className="mb-3 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</Card>}

      {tab === 'dashboard' && <Dashboard stats={stats} onOpen={(id) => setTab(id)} lang={lang} />}
      {['all', 'outward', 'inward'].includes(tab) && (
        <Register
          rows={rows} total={total} lang={lang} t={t}
          filters={filters} setFilters={setFilters}
          onView={openReplies} onEdit={(r) => setDrawer({ mode: 'edit', initial: r })}
          onReply={(r) => setDrawer({ mode: 'create', initial: { direction: 'inward', linkedOutwardId: r.id, linkedOutwardRef: r.referenceNo || r.recordId, department: r.department || r.recipient || '', subject: `Re: ${r.subject || ''}` } })}
          onArchive={async (r) => {
            if (!confirm(`${t('archive')}: ${r.referenceNo || r.recordId}?`)) return;
            try { await ims.archive('communications', r.id); refresh(); } catch (e) { setErr(e.message); }
          }}
        />
      )}
      {['pending', 'followup'].includes(tab) && (
        <FollowUp scope={tab === 'pending' ? 'pending' : 'due'} lang={lang}
          onView={openReplies} onEdit={(r) => setDrawer({ mode: 'edit', initial: r })} refresh={refresh} />
      )}
      {tab === 'reports' && <Reports lang={lang} />}

      {drawer && (
        <CorrespondenceDrawer
          mode={drawer.mode} initial={drawer.initial} lang={lang} t={t}
          onClose={() => setDrawer(null)}
          onSaved={() => { setDrawer(null); refresh(); }}
        />
      )}
      {viewing && (
        <ViewDrawer row={viewing} replies={replies} lang={lang} t={t}
          onClose={() => { setViewing(null); setReplies(null); }}
          onEdit={() => { setDrawer({ mode: 'edit', initial: viewing }); setViewing(null); }}
          onLinked={refresh} />
      )}
    </ImsLayout>
  );
}

// ---- Dashboard -------------------------------------------------------------
function Dashboard({ stats, onOpen, lang }) {
  const cards = [
    ['total', 'Total Communications', 'कुल पत्राचार', 'Inbox', 'navy'],
    ['outward', 'Total Outward', 'कुल जावक', 'Send', 'orange'],
    ['inward', 'Total Inward', 'कुल आवक', 'Inbox', 'blue'],
    ['awaitingReplies', 'Awaiting Replies', 'प्रतीक्षित उत्तर', 'Clock', 'amber'],
    ['repliesReceived', 'Replies Received', 'प्राप्त उत्तर', 'MailCheck', 'green'],
    ['failed', 'Failed / Bounced', 'विफल / बाउंस', 'AlertTriangle', 'red'],
    ['followUpDue', 'Follow-up Due', 'अनुसरण देय', 'BellRing', 'amber'],
    ['closed', 'Closed', 'बंद', 'CheckCircle2', 'slate'],
  ];
  if (!stats) return <Spinner />;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(([key, en, hi, icon, tone]) => (
        <button key={key} className="text-left" onClick={() => onOpen(key === 'total' ? 'all' : key === 'outward' ? 'outward' : key === 'inward' ? 'inward' : key === 'awaitingReplies' ? 'pending' : key === 'followUpDue' ? 'followup' : 'all')}>
          <Kpi icon={icon} tone={tone} label={lang === 'hi' ? hi : en} value={stats[key] ?? 0} />
        </button>
      ))}
    </div>
  );
}

// ---- Register table + filters ---------------------------------------------
function Register({ rows, total, lang, t, filters, setFilters, onView, onEdit, onReply, onArchive }) {
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const from = (r) => r.senderEmail || '—';
  const to = (r) => r.toEmails || r.recipientEmail || '—';
  return (
    <>
      <Card className="mb-3 p-3">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          <input value={filters.search} onChange={(e) => set('search', e.target.value)}
            placeholder={lang === 'hi' ? 'संदर्भ / विभाग / विषय / ईमेल खोजें' : 'Search reference / dept / subject / email'}
            className={inputCls + ' lg:col-span-2'} />
          <input type="date" value={filters.fromDate} onChange={(e) => set('fromDate', e.target.value)} className={inputCls} title={lang === 'hi' ? 'से' : 'From'} />
          <input type="date" value={filters.toDate} onChange={(e) => set('toDate', e.target.value)} className={inputCls} title={lang === 'hi' ? 'तक' : 'To'} />
          <select value={filters.deliveryStatus} onChange={(e) => set('deliveryStatus', e.target.value)} className={inputCls}>
            <option value="">{lang === 'hi' ? 'डिलीवरी स्थिति' : 'Delivery Status'}</option>
            {DELIVERY.map((o) => <option key={o[0]} value={o[0]}>{lang === 'hi' ? o[2] : o[1]}</option>)}
          </select>
          <select value={filters.replyStatus} onChange={(e) => set('replyStatus', e.target.value)} className={inputCls}>
            <option value="">{lang === 'hi' ? 'उत्तर स्थिति' : 'Reply Status'}</option>
            {REPLY.map((o) => <option key={o[0]} value={o[0]}>{lang === 'hi' ? o[2] : o[1]}</option>)}
          </select>
        </div>
      </Card>

      {!rows && <Spinner />}
      {rows && rows.length === 0 && <Card><Empty /></Card>}
      {rows && rows.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2.5 font-semibold">S.No.</th>
                  <th className="px-3 py-2.5 font-semibold">Reference No.</th>
                  <th className="px-3 py-2.5 font-semibold">Date</th>
                  <th className="px-3 py-2.5 font-semibold">Direction</th>
                  <th className="px-3 py-2.5 font-semibold">Department / Organization</th>
                  <th className="px-3 py-2.5 font-semibold">From Email</th>
                  <th className="px-3 py-2.5 font-semibold">To Email</th>
                  <th className="px-3 py-2.5 font-semibold">Subject</th>
                  <th className="px-3 py-2.5 font-semibold">Mode</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold">Reply Status</th>
                  <th className="px-3 py-2.5 font-semibold">Follow-up</th>
                  <th className="px-3 py-2.5 font-semibold">Linked Reference</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 text-slate-500">{i + 1}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-slate-600">{r.referenceNo || r.recordId}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">{r.correspondenceDate || '—'}</td>
                    <td className="px-3 py-2.5"><Badge status={r.direction} /></td>
                    <td className="px-3 py-2.5 text-slate-700">{r.department || r.recipient || '—'}</td>
                    <td className="px-3 py-2.5 text-slate-600">{from(r)}</td>
                    <td className="px-3 py-2.5 text-slate-600">{to(r)}</td>
                    <td className="max-w-[280px] px-3 py-2.5 text-slate-700"><span className="line-clamp-2">{r.subject || '—'}</span></td>
                    <td className="px-3 py-2.5 text-slate-600">{labelOf(MODES, r.mode, lang)}</td>
                    <td className="px-3 py-2.5"><Badge status={r.deliveryStatus} /></td>
                    <td className="px-3 py-2.5"><Badge status={r.replyStatus} /></td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">{r.followUpDate || '—'}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">
                      {r.direction === 'outward'
                        ? (r.replyCount ? `${r.replyCount} ${lang === 'hi' ? 'उत्तर' : 'replies'}` : '—')
                        : (r.linkedOutwardRef || '—')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right">
                      <button onClick={() => onView(r)} className="mr-2 text-slate-500 hover:text-[#12345A]" title="View"><Icons.Eye size={16} /></button>
                      <button onClick={() => onEdit(r)} className="mr-2 text-slate-500 hover:text-[#176447]" title={t('edit')}><Icons.Pencil size={16} /></button>
                      {r.direction === 'outward' && (
                        <button onClick={() => onReply(r)} className="mr-2 text-slate-500 hover:text-[#12345A]" title={lang === 'hi' ? 'उत्तर जोड़ें' : 'Add reply'}><Icons.Reply size={16} /></button>
                      )}
                      <button onClick={() => onArchive(r)} className="text-slate-400 hover:text-rose-600" title={t('archive')}><Icons.Archive size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500">
            {lang === 'hi' ? `${rows.length} / ${total} दिखाए जा रहे हैं` : `Showing ${rows.length} of ${total}`}
          </div>
        </Card>
      )}
    </>
  );
}

// ---- Follow-up / pending replies ------------------------------------------
function FollowUp({ scope, lang, onView, onEdit, refresh }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const d = await ims.corrFollowUps(scope);
        if (alive) { setRows(d.records || []); setErr(''); }
      } catch (e) { if (alive) { setErr(e.message); setRows([]); } }
    })();
    return () => { alive = false; };
  }, [scope, nonce]);

  const markDone = async (r) => {
    try { await ims.update('communications', r.id, { followUpStatus: 'follow_up_done' }); setNonce((n) => n + 1); refresh && refresh(); }
    catch (e) { setErr(e.message); }
  };

  return (
    <>
      {err && <Card className="mb-3 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</Card>}
      {!rows && <Spinner />}
      {rows && rows.length === 0 && <Card><Empty label={lang === 'hi' ? 'कोई लंबित प्रविष्टि नहीं' : 'Nothing pending'} /></Card>}
      {rows && rows.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead><tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] uppercase text-slate-500">
                <th className="px-3 py-2.5">Reference</th><th className="px-3 py-2.5">Department</th>
                <th className="px-3 py-2.5">Subject</th><th className="px-3 py-2.5">Follow-up Date</th>
                <th className="px-3 py-2.5">Reply Status</th><th className="px-3 py-2.5 text-right">Action</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs">{r.referenceNo || r.recordId}</td>
                    <td className="px-3 py-2.5">{r.department || r.recipient || '—'}</td>
                    <td className="max-w-[300px] px-3 py-2.5"><span className="line-clamp-2">{r.subject || '—'}</span></td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      {r.followUpDate || '—'} {r.overdue && <span className="ml-1 rounded bg-rose-100 px-1.5 text-[11px] font-semibold text-rose-700">Overdue</span>}
                    </td>
                    <td className="px-3 py-2.5"><Badge status={r.replyStatus} /></td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right">
                      <button onClick={() => onView(r)} className="mr-2 text-slate-500 hover:text-[#12345A]" title="View"><Icons.Eye size={16} /></button>
                      <button onClick={() => onEdit(r)} className="mr-2 text-slate-500 hover:text-[#176447]" title="Edit"><Icons.Pencil size={16} /></button>
                      <button onClick={() => markDone(r)} className="text-slate-500 hover:text-emerald-600" title="Mark follow-up done"><Icons.CheckCheck size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}

// ---- Reports ---------------------------------------------------------------
function Reports({ lang }) {
  const [dept, setDept] = useState(null);
  useEffect(() => { ims.corrDepartmentWise().then((d) => setDept(d.records || [])).catch(() => setDept([])); }, []);

  const fetchRows = async (params) => (await ims.corrList({ limit: 1000, ...params })).records || [];
  const COLS = ['referenceNo', 'correspondenceDate', 'direction', 'department', 'senderEmail', 'toEmails', 'subject', 'mode', 'deliveryStatus', 'replyStatus', 'followUpDate'];
  const run = async (kind, label, params) => {
    const records = await fetchRows(params);
    if (!records.length) { alert(lang === 'hi' ? 'कोई अभिलेख नहीं' : 'No records'); return; }
    if (kind === 'excel') await exportRecordsExcel({ title: label, records, columns: COLS, sheetName: label });
    else exportRecordsPdf({ title: label, subtitle: 'Correspondence & Communication', records, columns: COLS, lang });
  };

  const cards = [
    ['All Communications', 'सभी पत्राचार', {}],
    ['Outward Register', 'जावक रजिस्टर', { direction: 'outward' }],
    ['Inward Register', 'आवक रजिस्टर', { direction: 'inward' }],
    ['Pending Replies', 'प्रतीक्षित उत्तर', { replyStatus: 'awaiting_reply' }],
    ['Failed / Bounced', 'विफल / बाउंस', { deliveryStatus: 'failed' }],
  ];
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([en, hi, params]) => (
          <Card key={en} className="flex items-center justify-between p-4">
            <span className="text-sm font-semibold text-slate-700">{lang === 'hi' ? hi : en}</span>
            <div className="flex gap-1">
              <button title="Excel" className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50" onClick={() => run('excel', en, params)}><Icons.Table2 size={16} /></button>
              <button title="PDF" className="rounded p-1.5 text-rose-600 hover:bg-rose-50" onClick={() => run('pdf', en, params)}><Icons.FileText size={16} /></button>
            </div>
          </Card>
        ))}
      </div>

      <h3 className="mb-2 mt-6 text-sm font-bold uppercase tracking-wide text-slate-500">{lang === 'hi' ? 'विभाग-वार रिपोर्ट' : 'Department-wise Report'}</h3>
      {!dept && <Spinner />}
      {dept && dept.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead><tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] uppercase text-slate-500">
                <th className="px-3 py-2.5">Department / Organization</th><th className="px-3 py-2.5">Outward</th>
                <th className="px-3 py-2.5">Inward</th><th className="px-3 py-2.5">Total</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {dept.map((d) => (
                  <tr key={d.department} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 text-slate-700">{d.department}</td>
                    <td className="px-3 py-2.5">{d.outward}</td><td className="px-3 py-2.5">{d.inward}</td>
                    <td className="px-3 py-2.5 font-semibold">{d.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 px-4 py-2">
            <Button variant="ghost" icon="Table2" onClick={() => exportRecordsExcel({ title: 'Department-wise', records: dept, columns: ['department', 'outward', 'inward', 'total'], sheetName: 'Department-wise' })}>Excel</Button>
            <Button variant="ghost" icon="FileText" onClick={() => exportRecordsPdf({ title: 'Department-wise Report', subtitle: 'Correspondence', records: dept, columns: ['department', 'outward', 'inward', 'total'], lang })}>PDF</Button>
          </div>
        </Card>
      )}
    </>
  );
}

// ---- View drawer -----------------------------------------------------------
function ViewDrawer({ row, replies, lang, t, onClose, onEdit, onLinked }) {
  const [linking, setLinking] = useState(false);
  const [candidates, setCandidates] = useState(null);
  const [q, setQ] = useState('');

  const searchCandidates = async (term) => {
    setCandidates(null);
    try { const d = await ims.corrLinkCandidates(term); setCandidates(d.records || []); } catch { setCandidates([]); }
  };
  const link = async (outward) => {
    try { await ims.corrLinkReply(row.id, outward.id); setLinking(false); onLinked && onLinked(); onClose(); }
    catch (e) { alert(e.message); }
  };
  const unlink = async () => {
    try { await ims.corrUnlinkReply(row.id); onLinked && onLinked(); onClose(); } catch (e) { alert(e.message); }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="font-bold text-slate-900">{row.referenceNo || row.recordId}</h2>
            <p className="text-xs text-slate-400">{row.direction === 'inward' ? (lang === 'hi' ? 'आवक' : 'Inward') : (lang === 'hi' ? 'जावक' : 'Outward')} • {row.recordId}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" icon="Pencil" onClick={onEdit}>{t('edit')}</Button>
            <button onClick={onClose} className="rounded p-1 hover:bg-slate-100"><Icons.X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field2 label={lang === 'hi' ? 'दिनांक' : 'Date'} value={row.correspondenceDate} />
            <Field2 label={lang === 'hi' ? 'विभाग / संस्था' : 'Department / Organization'} value={row.department || row.recipient} />
            <Field2 label={lang === 'hi' ? 'प्रकार' : 'Type'} value={labelOf(TYPES, row.communicationType, lang)} />
            <Field2 label={lang === 'hi' ? 'माध्यम' : 'Mode'} value={labelOf(MODES, row.mode, lang)} />
            <Field2 label={lang === 'hi' ? 'प्राथमिकता' : 'Priority'} value={labelOf(PRIORITY, row.priority, lang)} />
            <Field2 label={lang === 'hi' ? 'विभाग श्रेणी' : 'Department Category'} value={labelOf(DEPT_CATS, row.departmentCategory, lang)} />
            <Field2 label="From" value={[row.sender, row.senderEmail].filter(Boolean).join(' • ')} />
            <Field2 label="To" value={row.toEmails || row.recipientEmail} />
            <Field2 label="CC" value={row.ccEmails} />
            <Field2 label="BCC" value={row.bccEmails} />
            <Field2 label={lang === 'hi' ? 'डिलीवरी स्थिति' : 'Delivery Status'} value={labelOf(DELIVERY, row.deliveryStatus, lang)} />
            <Field2 label={lang === 'hi' ? 'उत्तर स्थिति' : 'Reply Status'} value={labelOf(REPLY, row.replyStatus, lang)} />
            <Field2 label={lang === 'hi' ? 'अनुसरण तिथि' : 'Follow-up Date'} value={row.followUpDate} />
            <Field2 label={lang === 'hi' ? 'अनुसरण स्थिति' : 'Follow-up Status'} value={labelOf(FOLLOWUP, row.followUpStatus, lang)} />
            <Field2 label={lang === 'hi' ? 'प्रेषण क्रमांक' : 'Dispatch No.'} value={row.dispatchNo} />
            <Field2 label={lang === 'hi' ? 'ट्रैकिंग क्रमांक' : 'Tracking No.'} value={row.trackingNo} />
            <Field2 label={lang === 'hi' ? 'संदेश आईडी' : 'Message ID'} value={row.messageId} />
            <Field2 label={lang === 'hi' ? 'संबंधित संदर्भ' : 'Linked Reference'} value={row.direction === 'inward' ? row.linkedOutwardRef : (row.replyCount ? `${row.replyCount}` : null)} />
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-500">{lang === 'hi' ? 'विषय' : 'Subject'}</p>
            <p className="text-sm text-slate-800">{row.subject || '—'}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-500">{lang === 'hi' ? 'पूरा संदेश' : 'Full Message'}</p>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{row.message || '—'}</pre>
          </div>
          {Array.isArray(row.attachments) && row.attachments.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-500">{lang === 'hi' ? 'संलग्नक' : 'Attachments'}</p>
              <ul className="space-y-1">
                {row.attachments.map((a, i) => (
                  <li key={i}>
                    <a href={urlOf(a.url)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#176447] hover:underline">
                      <Icons.Download size={14} /> {a.name || a.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reply linking */}
          {row.direction === 'inward' && (
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">{lang === 'hi' ? 'उत्तर लिंकिंग' : 'Reply Linking'}</p>
              {row.linkedOutwardRef ? (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-slate-700">{lang === 'hi' ? 'लिंक किया गया' : 'Linked to'} <b>{row.linkedOutwardRef}</b></span>
                  <Button variant="danger" onClick={unlink}>{lang === 'hi' ? 'लिंक हटाएँ' : 'Unlink'}</Button>
                </div>
              ) : linking ? (
                <div className="mt-2">
                  <input value={q} onChange={(e) => { setQ(e.target.value); searchCandidates(e.target.value); }} placeholder={lang === 'hi' ? 'जावक संदर्भ / विभाग खोजें' : 'Search outward reference / dept'} className={inputCls} />
                  <div className="mt-2 max-h-56 space-y-1 overflow-auto">
                    {!candidates && <Spinner />}
                    {(candidates || []).map((c) => (
                      <button key={c.id} onClick={() => link(c)} className="block w-full rounded border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50">
                        <span className="font-mono text-xs text-slate-500">{c.referenceNo || c.recordId}</span> — {c.department || c.recipient} <span className="block text-xs text-slate-400 line-clamp-1">{c.subject}</span>
                      </button>
                    ))}
                    {candidates && candidates.length === 0 && <p className="text-sm text-slate-400">—</p>}
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <Button variant="navy" icon="Link2" onClick={() => { setLinking(true); searchCandidates(''); }}>{lang === 'hi' ? 'जावक से लिंक करें' : 'Link to an Outward'}</Button>
                </div>
              )}
            </div>
          )}

          {row.direction === 'outward' && (
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">{lang === 'hi' ? 'संबंधित उत्तर' : 'Related Replies'}</p>
              {!replies && <Spinner />}
              {replies && replies.length === 0 && <p className="mt-1 text-sm text-slate-400">{lang === 'hi' ? 'कोई उत्तर नहीं' : 'No replies linked yet'}</p>}
              {replies && replies.map((rp) => (
                <div key={rp.id} className="mt-2 rounded border border-slate-100 p-2">
                  <p className="font-mono text-xs text-slate-500">{rp.referenceNo || rp.recordId} • {rp.correspondenceDate}</p>
                  <p className="text-sm text-slate-700">{rp.subject}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Create / Edit drawer --------------------------------------------------
function CorrespondenceDrawer({ mode, initial, lang, t, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({ ...(initial || {}) }));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const [isReply, setIsReply] = useState(!!(initial && initial.linkedOutwardId));
  const [linkTarget, setLinkTarget] = useState(initial && initial.linkedOutwardId ? { id: initial.linkedOutwardId, referenceNo: initial.linkedOutwardRef } : null);
  const [candQ, setCandQ] = useState('');
  const [candidates, setCandidates] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const isInward = form.direction === 'inward';
  const isEmail = (form.mode || 'email') === 'email';
  const L = (en, hi) => (lang === 'hi' ? hi : en);

  const searchCandidates = async (term) => {
    setCandidates(null);
    try { const d = await ims.corrLinkCandidates(term); setCandidates(d.records || []); } catch { setCandidates([]); }
  };

  const upload = async (files) => {
    if (!files || !files.length) return;
    setUploading(true); setErr('');
    try {
      const fd = new FormData();
      for (const f of files) fd.append('files', f);
      const token = localStorage.getItem('ssf_admin_token') || '';
      const res = await fetch(`${API_BASE_URL}/api/ims/correspondence/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Upload failed');
      set('attachments', [...(form.attachments || []), ...(body.files || [])]);
    } catch (e) { setErr(e.message); } finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const submit = async () => {
    setErr('');
    if (!form.direction) return setErr(L('Direction is required', 'दिशा आवश्यक है'));
    if (!form.correspondenceDate) return setErr(L('Date is required', 'दिनांक आवश्यक है'));
    if (!form.subject) return setErr(L('Subject is required', 'विषय आवश्यक है'));
    for (const k of ['senderEmail', 'toEmails', 'ccEmails', 'bccEmails']) {
      const bad = badEmails(form[k]);
      if (bad) return setErr(`${L('Invalid email', 'अमान्य ईमेल')}: ${bad}`);
    }
    setSaving(true);
    try {
      const payload = { ...form };
      delete payload.id; delete payload.recordId; delete payload.createdAt; delete payload.updatedAt;
      let saved;
      if (mode === 'edit' && form.id) saved = await ims.update('communications', form.id, payload);
      else saved = await ims.create('communications', payload);
      if (isInward && isReply && linkTarget && linkTarget.id) {
        await ims.corrLinkReply(saved.id, linkTarget.id);
      }
      onSaved();
    } catch (e) {
      if (e.status === 409 && e.duplicates) setErr(L('A similar record already exists.', 'समान अभिलेख पहले से मौजूद है।'));
      else setErr(e.message);
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="font-bold text-slate-900">{mode === 'edit' ? t('edit') : L('New Communication', 'नई प्रविष्टि')}</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-slate-100"><Icons.X size={18} /></button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
          {err && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</div>}

          {/* A. Basic information */}
          <Section title={L('A. Basic Information', 'क. मूल जानकारी')}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select label={L('Direction', 'दिशा')} required value={form.direction} onChange={(v) => set('direction', v)} options={DIRECTION} lang={lang} />
              <Input label={L('Reference No. (auto if blank)', 'संदर्भ क्रमांक (खाली छोड़ने पर स्वतः)')} value={form.referenceNo} onChange={(v) => set('referenceNo', v)} />
              <Input label={L('Date', 'दिनांक')} required type="date" value={form.correspondenceDate} onChange={(v) => set('correspondenceDate', v)} />
              <Input label={L('Department / Organization', 'विभाग / संस्था')} value={form.department} onChange={(v) => set('department', v)} />
              <Select label={L('Department Category', 'विभाग श्रेणी')} value={form.departmentCategory} onChange={(v) => set('departmentCategory', v)} options={DEPT_CATS} lang={lang} />
              <Select label={L('Communication Type', 'संचार का प्रकार')} value={form.communicationType} onChange={(v) => set('communicationType', v)} options={TYPES} lang={lang} />
              <Select label={L('Mode', 'माध्यम')} value={form.mode} onChange={(v) => set('mode', v)} options={MODES} lang={lang} />
              <Select label={L('Priority', 'प्राथमिकता')} value={form.priority} onChange={(v) => set('priority', v)} options={PRIORITY} lang={lang} />
              <Input label={isInward ? L('Sender Name', 'प्रेषक का नाम') : L('Recipient Name', 'प्राप्तकर्ता का नाम')} value={isInward ? form.sender : form.recipient} onChange={(v) => set(isInward ? 'sender' : 'recipient', v)} />
              <Input label={L('Designation', 'पदनाम')} value={isInward ? form.senderDesignation : form.recipientDesignation} onChange={(v) => set(isInward ? 'senderDesignation' : 'recipientDesignation', v)} />
              <Input label={L('Phone Number (optional)', 'दूरभाष संख्या (वैकल्पिक)')} value={form.senderPhone} onChange={(v) => set('senderPhone', v)} />
            </div>
          </Section>

          {/* B. Email details */}
          {isEmail && (
            <Section title={L('B. Email Details', 'ख. ईमेल विवरण')}>
              <div className="grid gap-3 sm:grid-cols-2">
                {isInward ? (
                  <>
                    <Input label={L('From Email', 'प्रेषक ईमेल')} value={form.senderEmail} onChange={(v) => set('senderEmail', v)} placeholder="sender@example.com" />
                    <Input label={L('To Email (SSF)', 'प्राप्तकर्ता ईमेल (SSF)')} value={form.toEmails} onChange={(v) => set('toEmails', v)} placeholder="info@swastiksrijan.in" />
                  </>
                ) : (
                  <>
                    <Input label={L('From Email (SSF)', 'प्रेषक ईमेल (SSF)')} value={form.senderEmail} onChange={(v) => set('senderEmail', v)} placeholder="info@swastiksrijan.in" />
                    <Input label={L('To Email(s)', 'प्राप्तकर्ता ईमेल')} value={form.toEmails} onChange={(v) => set('toEmails', v)} placeholder="ps.dept@mp.gov.in, officer@mp.gov.in" />
                  </>
                )}
                <Input label="CC" value={form.ccEmails} onChange={(v) => set('ccEmails', v)} />
                <Input label="BCC" value={form.bccEmails} onChange={(v) => set('bccEmails', v)} />
                <Input label={L('Email Subject', 'ईमेल विषय')} required value={form.subject} onChange={(v) => set('subject', v)} />
                <Input label={L('Email Message ID', 'ईमेल संदेश आईडी')} value={form.messageId} onChange={(v) => set('messageId', v)} />
                <Input label={isInward ? L('Date & Time Received', 'प्राप्ति तिथि एवं समय') : L('Date & Time Sent', 'भेजने की तिथि एवं समय')} type="datetime-local" value={toLocalInput(isInward ? form.receivedAt : form.sentAt)} onChange={(v) => set(isInward ? 'receivedAt' : 'sentAt', v)} />
                <Select label={L('Delivery Status', 'डिलीवरी स्थिति')} value={form.deliveryStatus} onChange={(v) => set('deliveryStatus', v)} options={DELIVERY} lang={lang} />
              </div>
              <Textarea label={L('Full Email Message / Body', 'पूरा ईमेल संदेश')} value={form.message} onChange={(v) => set('message', v)} rows={8} />
            </Section>
          )}

          {/* C. Letter / other */}
          {!isEmail && (
            <Section title={L('C. Letter / Other Communication', 'ग. पत्र / अन्य संचार')}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label={L('Subject', 'विषय')} required value={form.subject} onChange={(v) => set('subject', v)} />
                <Input label={L('Dispatch Number', 'प्रेषण क्रमांक')} value={form.dispatchNo} onChange={(v) => set('dispatchNo', v)} />
                <Input label={L('Postal Tracking Number', 'डाक ट्रैकिंग क्रमांक')} value={form.trackingNo} onChange={(v) => set('trackingNo', v)} />
                <Input label={L('External Reference Number', 'बाह्य संदर्भ क्रमांक')} value={form.externalRef} onChange={(v) => set('externalRef', v)} />
                <Input label={L('Related Project / Campaign', 'संबंधित परियोजना / अभियान')} value={form.relatedType} onChange={(v) => set('relatedType', v)} />
                <Input label={L('Delivery Status', 'डिलीवरी स्थिति')} value={form.deliveryStatus} onChange={(v) => set('deliveryStatus', v)} />
              </div>
              <Textarea label={L('Full Letter / Communication Content', 'पूरा पत्र / संचार विवरण')} value={form.message} onChange={(v) => set('message', v)} rows={6} />
            </Section>
          )}

          {/* D. Attachments */}
          <Section title={L('D. Attachments', 'घ. संलग्नक')}>
            <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" onChange={(e) => upload(e.target.files)} />
            <Button variant="ghost" icon="Paperclip" onClick={() => fileRef.current && fileRef.current.click()} disabled={uploading}>
              {uploading ? '…' : L('Add attachment (PDF, DOC, DOCX, JPG, PNG)', 'संलग्नक जोड़ें')}
            </Button>
            {(form.attachments || []).length > 0 && (
              <ul className="mt-2 space-y-1">
                {(form.attachments || []).map((a, i) => (
                  <li key={i} className="flex items-center justify-between rounded border border-slate-200 px-3 py-1.5 text-sm">
                    <a href={urlOf(a.url)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#176447] hover:underline"><Icons.Download size={14} /> {a.name}</a>
                    <button onClick={() => set('attachments', form.attachments.filter((_, j) => j !== i))} className="text-slate-400 hover:text-rose-500"><Icons.X size={15} /></button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* E. Status & follow-up */}
          <Section title={L('E. Status & Follow-up', 'ङ. स्थिति एवं अनुसरण')}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select label={L('Reply Status', 'उत्तर स्थिति')} value={form.replyStatus} onChange={(v) => set('replyStatus', v)} options={REPLY} lang={lang} />
              <Select label={L('Follow-up Status', 'अनुसरण स्थिति')} value={form.followUpStatus} onChange={(v) => set('followUpStatus', v)} options={FOLLOWUP} lang={lang} />
              <Input label={L('Follow-up Date', 'अनुसरण तिथि')} type="date" value={form.followUpDate} onChange={(v) => set('followUpDate', v)} />
            </div>
            <Textarea label={L('Action Taken', 'की गई कार्रवाई')} value={form.actionTaken} onChange={(v) => set('actionTaken', v)} rows={2} />
            <Textarea label={L('Reply / Response Details', 'प्राप्त उत्तर / प्रतिक्रिया')} value={form.response} onChange={(v) => set('response', v)} rows={2} />
            <Textarea label={L('Remarks', 'टिप्पणी')} value={form.remarks} onChange={(v) => set('remarks', v)} rows={2} />
          </Section>

          {/* Reply linking (inward) */}
          {isInward && (
            <Section title={L('Is this a reply to an earlier communication?', 'क्या यह किसी पूर्व संचार का उत्तर है?')}>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="radio" checked={!isReply} onChange={() => { setIsReply(false); setLinkTarget(null); }} /> {L('No', 'नहीं')}</label>
                <label className="flex items-center gap-2 text-sm"><input type="radio" checked={isReply} onChange={() => { setIsReply(true); searchCandidates(''); }} /> {L('Yes', 'हाँ')}</label>
              </div>
              {isReply && (
                <div className="mt-2">
                  {linkTarget ? (
                    <div className="flex items-center justify-between rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm">
                      <span>{L('Linked to', 'लिंक किया गया')} <b>{linkTarget.referenceNo || `#${linkTarget.id}`}</b></span>
                      <button onClick={() => setLinkTarget(null)} className="text-slate-500 hover:text-rose-500"><Icons.X size={15} /></button>
                    </div>
                  ) : (
                    <>
                      <input value={candQ} onChange={(e) => { setCandQ(e.target.value); searchCandidates(e.target.value); }} placeholder={L('Search outward reference / department / subject', 'जावक संदर्भ / विभाग / विषय खोजें')} className={inputCls} />
                      <div className="mt-2 max-h-56 space-y-1 overflow-auto">
                        {!candidates && <Spinner />}
                        {(candidates || []).map((c) => (
                          <button key={c.id} onClick={() => setLinkTarget(c)} className="block w-full rounded border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50">
                            <span className="font-mono text-xs text-slate-500">{c.referenceNo || c.recordId}</span> — {c.department || c.recipient}
                            <span className="block text-xs text-slate-400 line-clamp-1">{c.subject}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </Section>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3">
          <Button variant="ghost" onClick={onClose}>{t('cancel')}</Button>
          <Button icon="Check" onClick={submit} disabled={saving}>{saving ? '…' : t('save')}</Button>
        </div>
      </div>
    </div>
  );
}

// ---- small form primitives -------------------------------------------------
const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#176447]';

function Section({ title, children }) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 p-3">
      <h3 className="text-xs font-bold uppercase tracking-wide text-[#12345A]">{title}</h3>
      {children}
    </section>
  );
}
function Input({ label, value, onChange, type = 'text', required, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}{required && <span className="text-rose-500"> *</span>}</span>
      <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
    </label>
  );
}
function Textarea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <textarea rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </label>
  );
}
function Select({ label, value, onChange, options, lang, required }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}{required && <span className="text-rose-500"> *</span>}</span>
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        <option value="">—</option>
        {options.map((o) => <option key={o[0]} value={o[0]}>{lang === 'hi' ? o[2] : o[1]}</option>)}
      </select>
    </label>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function badEmails(v) {
  if (!v) return null;
  for (const e of String(v).split(/[,;\s]+/).filter(Boolean)) if (!EMAIL_RE.test(e)) return e;
  return null;
}
function urlOf(u) {
  if (!u) return '#';
  return /^https?:\/\//.test(u) ? u : `${API_BASE_URL}${u}`;
}
function toLocalInput(v) {
  if (!v) return '';
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
