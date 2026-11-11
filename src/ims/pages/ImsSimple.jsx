import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, PageHeader, Spinner, Empty, Badge } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { API_BASE_URL } from '../../config/api';

const TOKEN = () => localStorage.getItem('ssf_admin_token') || '';
const get = (path) => fetch(`${API_BASE_URL}${path}`, { headers: { Authorization: `Bearer ${TOKEN()}` } })
  .then(r => r.json().then(body => {
    if (!r.ok) throw new Error((body && body.message) || `Request failed (${r.status})`);
    return body;
  }));

/** Audit Trail viewer */
export function ImsAuditTrail() {
  const { t } = useLang();
  const [rows, setRows] = useState(null);
  useEffect(() => { get('/api/ims/audit-trail?limit=200').then(d => setRows(d.records || [])).catch(() => setRows([])); }, []);
  return (
    <ImsLayout active="audit_trail">
      <PageHeader title={t('audit_trail')} subtitle={t('tagline')} />
      {!rows && <Spinner />}
      {rows && rows.length === 0 && <Card><Empty /></Card>}
      {rows && rows.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead><tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-2.5">Action</th><th className="px-4 py-2.5">Entity</th><th className="px-4 py-2.5">Actor</th><th className="px-4 py-2.5">When</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5"><Badge status={r.action} /></td>
                    <td className="px-4 py-2.5"><span className="font-medium text-slate-700">{r.entityType}</span><span className="ml-2 font-mono text-xs text-slate-400">{r.entityId}</span></td>
                    <td className="px-4 py-2.5 text-slate-600">{r.actor}</td>
                    <td className="px-4 py-2.5 text-slate-500">{new Date(r.createdAt).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </ImsLayout>
  );
}

/** Data Integrity dashboard */
export function ImsIntegrity() {
  const { t } = useLang();
  const [data, setData] = useState(null);
  useEffect(() => { get('/api/ims/integrity').then(setData).catch(() => setData({ checks: [], totalIssues: 0 })); }, []);
  return (
    <ImsLayout active="integrity">
      <PageHeader title={t('integrity')} subtitle={t('tagline')} />
      {!data && <Spinner />}
      {data && (
        <>
          <Card className="mb-4 flex items-center justify-between p-4">
            <span className="text-sm font-semibold text-slate-600">Total issues</span>
            <span className={`text-2xl font-bold ${data.totalIssues ? 'text-rose-600' : 'text-emerald-600'}`}>{data.totalIssues}</span>
          </Card>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {(data.checks || []).map(c => (
              <Card key={c.key} className="flex items-center justify-between p-4">
                <span className="text-sm text-slate-700">{c.label}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${c.count ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{c.count}</span>
              </Card>
            ))}
          </div>
        </>
      )}
    </ImsLayout>
  );
}

/** Simple module dashboard (KPI cards from module-dashboard endpoint). */
export function ImsModuleDashboard({ module, titleKey, icon = 'BarChart3', active }) {
  const { t } = useLang();
  const [data, setData] = useState(null);
  const I = Icons[icon] || Icons.BarChart3;
  useEffect(() => { ims.moduleDashboard(module).then(setData).catch(() => setData({ kpis: {} })); }, [module]);
  return (
    <ImsLayout active={active || module}>
      <PageHeader title={t(titleKey)} subtitle={t('tagline')} />
      {!data && <Spinner />}
      {data && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {Object.entries(data.kpis || {}).map(([k, v]) => (
            <Card key={k} className="flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#12345A] text-white"><I size={20} /></span>
              <span>
                <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">{k}</span>
                <span className="block text-xl font-bold text-slate-900">{typeof v === 'number' && k.match(/income|expense|net|amount/i) ? '₹' + v.toLocaleString('en-IN') : v}</span>
              </span>
            </Card>
          ))}
        </div>
      )}
    </ImsLayout>
  );
}

/** Registers & Records — primary registers plus linked operational views. */
const SUPPORTING_REGISTER_VIEWS = [
  { group: 'governance', rule: 'membership_applications', en: 'Membership Application & Admission Register', hi: 'सदस्यता आवेदन एवं प्रवेश पंजिका', basis: 'Rule 6 — written application and Managing Committee decision', resource: 'members', path: '/ims/members', linked: true },
  { group: 'governance', rule: 'membership_categories', en: 'Membership Categories & Honorary Members View', hi: 'सदस्यता श्रेणी एवं सम्माननीय सदस्य विवरण', basis: 'Rules 5–9 — category, eligibility, cessation and member register', resource: 'members', path: '/ims/members', linked: true },
  { group: 'finance', rule: 'membership_contributions', en: 'Membership Fee & Contribution Register', hi: 'सदस्यता शुल्क एवं अंशदान पंजिका', basis: 'Rule 5 — actual fee/contribution receipts; no assumed or backdated payment', resource: 'membershipContributions', path: '/ims/membership-contributions', linked: true },
  { group: 'governance', rule: 'special_general_body', en: 'Annual & Special General Body Meeting View', hi: 'वार्षिक एवं विशेष आम सभा बैठक विवरण', basis: 'Rule 10 — annual meeting and special meeting on written requisition', resource: 'meetings', path: '/ims/meetings', linked: true },
  { group: 'governance', rule: 'meeting_notices_agenda', en: 'Meeting Notices, Agenda & Dispatch View', hi: 'बैठक सूचना, कार्यसूची एवं प्रेषण विवरण', basis: 'Rule 10 — 15-day General Body and 7-day Managing Committee notice', resource: 'meetings', path: '/ims/meetings', linked: true },
  { group: 'resources', rule: 'stock_inventory', en: 'Stock & Inventory Register', hi: 'भंडार एवं सामग्री पंजिका', basis: 'Operational control — stock receipts, issues and balance', resource: 'inventory', path: '/ims/r/inventory', linked: true },
  { group: 'compliance', rule: 'annual_report_record', en: 'Annual Report & Progress Report Register', hi: 'वार्षिक प्रतिवेदन एवं प्रगति रिपोर्ट पंजिका', basis: 'Rule 11 — General Body considers annual report and progress', resource: 'annualReports', path: '/ims/annual-reports', linked: true },
  { group: 'finance', rule: 'permanent_fund_record', en: 'Permanent Fund Register', hi: 'स्थायी निधि पंजिका', basis: 'Rule 11 — General Body considers permanent fund and property matters', resource: 'funds', path: '/ims/r/funds', linked: true },
  { group: 'compliance', rule: 'auditor_appointment_record', en: 'Auditor Appointment & Tenure Record', hi: 'लेखापरीक्षक नियुक्ति एवं कार्यकाल रिकॉर्ड', basis: 'Rule 11 — General Body appoints auditor; retain appointment and report', resource: 'audits', path: '/ims/r/audits', linked: true },
  { group: 'governance', rule: 'election_record', en: 'Managing Committee Election & Result Record', hi: 'प्रबंध समिति चुनाव एवं परिणाम रिकॉर्ड', basis: 'Rule 12 — nine positions elected by eligible members under Rules 5(A)–(C)', resource: 'committeeMembers', path: '/ims/managing-committee', linked: true },
  { group: 'governance', rule: 'committee_term_record', en: 'Committee Tenure, Extension & Handover Record', hi: 'कार्यकारिणी कार्यकाल, विस्तार एवं हस्तांतरण रिकॉर्ड', basis: 'Rule 13 — three-year term; extension up to six months only with General Body approval', resource: 'committeeMembers', path: '/ims/managing-committee', linked: true },
  { group: 'finance', rule: 'bank_signatory_record', en: 'Bank Mandate & Joint Signatory Record', hi: 'बैंक संचालन एवं संयुक्त हस्ताक्षरकर्ता रिकॉर्ड', basis: 'Rule 20 — bank withdrawals by prescribed joint signatories', resource: 'bankAccounts', path: '/ims/bank-book', linked: true },
  { group: 'finance', rule: 'cash_limit_record', en: 'Cash-in-Hand Limit Control', hi: 'नकद सीमा नियंत्रण रिकॉर्ड', basis: 'Rule 20 — maximum cash in hand ₹4,500; not a daily expense limit', resource: 'cashAccounts', path: '/ims/cash-book', linked: true },
  { group: 'compliance', rule: 'annual_filing_record', en: 'Annual Committee List & Accounts Filing Record', hi: 'वार्षिक समिति सूची एवं लेखा दाखिला रिकॉर्ड', basis: 'Rule 21 — file committee list within 45 days of annual meeting and audited accounts as prescribed', resource: 'compliance', path: '/ims/r/compliance', linked: true },
  { group: 'governance', rule: 'amendment_record', en: 'Rules & Bylaws Amendment Record', hi: 'नियमावली संशोधन रिकॉर्ड', basis: 'Rule 22 — amendment requires two-thirds of total members and applicable Registrar process', resource: 'governanceRules', path: '/ims/constitution', linked: true },
  { group: 'compliance', rule: 'dissolution_record', en: 'Dissolution & Asset Disposal Record', hi: 'विघटन एवं संपत्ति निस्तारण रिकॉर्ड', basis: 'Rule 23 — dissolution resolution and transfer of remaining assets as specified', resource: 'assets', path: '/ims/r/assets', linked: true },
  { group: 'finance', rule: 'immovable_property_permission', en: 'Immovable Property & Registrar Permission Record', hi: 'अचल संपत्ति एवं रजिस्ट्रार अनुमति रिकॉर्ड', basis: 'Rule 24 — property transactions subject to written Registrar permission as stated in the bylaws', resource: 'assets', path: '/ims/r/assets', linked: true },
  { group: 'governance', rule: 'registrar_meeting_record', en: 'Registrar-Called Meeting Record', hi: 'रजिस्ट्रार द्वारा बुलाई गई बैठक रिकॉर्ड', basis: 'Rule 25 — Registrar’s authority to call a meeting', resource: 'meetings', path: '/ims/meetings', linked: true },
  { group: 'compliance', rule: 'dispute_record', en: 'Dispute & Resolution Record', hi: 'विवाद एवं निस्तारण रिकॉर्ड', basis: 'Rule 26 — dispute procedure under the bylaws', resource: 'compliance', path: '/ims/r/compliance', linked: true },
];

const REGISTER_PATHS = {
  members: '/ims/members',
  committeeMembers: '/ims/managing-committee',
  meetings: '/ims/meetings',
  governanceRules: '/ims/constitution',
  cashAccounts: '/ims/cash-book',
  bankAccounts: '/ims/bank-book',
  transactions: '/ims/finance/ledger',
  annualReports: '/ims/annual-reports',
};

/** Shows the actual IMS destination for every register; linked views reuse one master. */
export function ImsRegisters() {
  const { t, lang } = useLang();
  const [data, setData] = useState(null);
  useEffect(() => { get('/api/ims/register-map').then(setData).catch(() => setData(null)); }, []);
  const GROUP_LABEL = {
    governance: ['Governance / शासन', 'शासन'],
    finance: ['Finance / वित्त', 'वित्त'],
    programme: ['Programmes / कार्यक्रम', 'कार्यक्रम'],
    compliance: ['Compliance / अनुपालन', 'अनुपालन'],
    hr: ['People / मानव संसाधन', 'मानव संसाधन'],
    resources: ['Resources / संसाधन', 'संसाधन'],
    records: ['Records / अभिलेख', 'अभिलेख'],
  };
  const allRegisters = [
    ...((data && data.registers) || []).map(r => ({
      ...r,
      path: REGISTER_PATHS[r.resource] || `/ims/r/${r.resource}`,
      linked: false,
    })),
    ...SUPPORTING_REGISTER_VIEWS,
  ];
  const groups = [...new Set(allRegisters.map(r => r.group))];
  return (
    <ImsLayout active="registers_required">
      <PageHeader
        title={t('registers_required')}
        subtitle={lang === 'hi' ? 'नियमावली से जुड़े मुख्य रजिस्टर और अनुपालन/संचालन के लिंक्ड रिकॉर्ड — लिंक्ड प्रविष्टियाँ मौजूदा रिकॉर्ड का ही उपयोग करती हैं।' : 'Bylaw-linked register index: primary IMS registers plus linked compliance and operational views. Linked entries reuse existing records.'}
      />
      {!data && <Spinner />}
      {data && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
            <Card className="p-4"><span className="block text-xs uppercase tracking-wide text-slate-400">Total</span><span className="text-2xl font-bold text-[#12345A]">{allRegisters.length}</span></Card>
            {groups.map(group => (
              <Card key={group} className="p-4">
                <span className="block text-xs uppercase tracking-wide text-slate-400">{GROUP_LABEL[group] ? (lang === 'hi' ? GROUP_LABEL[group][1] : GROUP_LABEL[group][0]) : group}</span>
                <span className="text-2xl font-bold text-slate-800">{allRegisters.filter(r => r.group === group).length}</span>
              </Card>
            ))}
          </div>
          {groups.map(g => (
            <section key={g} className="mb-5">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">{GROUP_LABEL[g] ? (lang === 'hi' ? GROUP_LABEL[g][1] : GROUP_LABEL[g][0]) : g}</h2>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead><tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                      <th className="px-4 py-2.5">Register</th><th className="px-4 py-2.5">पंजिका</th>
                      <th className="px-4 py-2.5">Basis (Niyamavali)</th><th className="px-4 py-2.5 text-right">Records</th><th className="px-4 py-2.5 text-right">Open</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {allRegisters.filter(r => r.group === g).map(r => (
                        <tr key={r.rule} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 font-medium text-slate-800">{r.en}</td>
                          <td className="px-4 py-2.5 text-slate-600">{r.hi}</td>
                          <td className="px-4 py-2.5 text-xs text-slate-500">{r.basis}</td>
                          <td className="px-4 py-2.5 text-right">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${r.linked ? 'bg-blue-50 text-blue-700' : r.count ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{r.linked ? 'Linked' : r.count}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right"><a href={r.path} className="inline-flex rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#12345A] hover:border-[#176447] hover:text-[#176447]">Open →</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>
          ))}
        </>
      )}
    </ImsLayout>
  );
}

/** Constitution & Bylaws — reads governance rules (configurable, versioned). */
export function ImsConstitution() {
  const { t, lang } = useLang();
  const [rows, setRows] = useState(null);
  useEffect(() => { ims.list('governanceRules', { limit: 200 }).then(d => setRows(d.records || [])).catch(() => setRows([])); }, []);
  return (
    <ImsLayout active="constitution">
      <PageHeader title={t('constitution')} subtitle={t('tagline')} />
      {!rows && <Spinner />}
      {rows && (
        <Card className="divide-y divide-slate-100">
          {rows.map(r => (
            <div key={r.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{r.key} · {r.value}</span>
                <span className="text-xs text-slate-400">{r.source}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{lang === 'hi' && r.ruleTextHi ? r.ruleTextHi : r.ruleText}</p>
            </div>
          ))}
        </Card>
      )}
    </ImsLayout>
  );
}
