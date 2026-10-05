// SSF-IMS Organisation Profile — master identity, statutory registrations,
// governance, finance and compliance details of the Foundation. Bilingual.
// Mirrors the SSF Digital Office "Institution Profile & Compliance" section.
import { useEffect, useMemo, useState } from 'react';
import ImsLayout from '../ImsLayout';
import { Card, PageHeader, Button, Spinner, SectionHero, StatStrip } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

const SECTIONS = [
  {
    id: 'master', icon: 'Building2', en: 'Organisation Master', hi: 'संस्था मास्टर', master: true,
    fields: [
      ['name', 'Name', 'नाम'],
      ['legalName', 'Legal Name', 'विधिक नाम'],
      ['regNumber', 'Registration Number', 'पंजीकरण संख्या'],
      ['regAuthority', 'Registering Authority', 'पंजीकरण प्राधिकारी'],
      ['regDate', 'Registration Date', 'पंजीकरण तिथि', 'date'],
      ['pan', 'PAN', 'पैन'],
      ['tan', 'TAN', 'टैन'],
      ['address', 'Address', 'पता', 'textarea'],
      ['areaOfOperation', 'Area of Operation', 'कार्यक्षेत्र', 'textarea'],
      ['contactEmail', 'Contact Email', 'संपर्क ईमेल'],
      ['contactPhone', 'Contact Phone', 'संपर्क फ़ोन'],
      ['website', 'Website', 'वेबसाइट'],
    ],
  },
  {
    id: 'profile', icon: 'Building2', en: 'Organisation Profile', hi: 'संस्था परिचय',
    fields: [
      ['organizationName', 'Organisation Name', 'संस्था का नाम'],
      ['organizationNameHi', 'Name (Hindi)', 'नाम (हिंदी)'],
      ['shortName', 'Short Name', 'संक्षिप्त नाम'],
      ['registrationNumber', 'Registration Number', 'पंजीकरण संख्या'],
      ['registrationDate', 'Registration Date', 'पंजीकरण तिथि'],
      ['registrationAct', 'Registration Act', 'पंजीकरण अधिनियम'],
      ['organizationType', 'Organisation Type', 'संस्था प्रकार'],
      ['operationalScope', 'Operational Scope', 'कार्यक्षेत्र'],
      ['address', 'Address', 'पता', 'textarea'],
      ['city', 'City / District', 'शहर / ज़िला'],
      ['state', 'State', 'राज्य'],
      ['pinCode', 'PIN Code', 'पिन कोड'],
      ['mobile', 'Mobile Number', 'मोबाइल नंबर'],
      ['email', 'Email', 'ईमेल'],
      ['website', 'Website', 'वेबसाइट'],
    ],
  },
  {
    id: 'objectives', icon: 'Target', en: 'Objectives & Areas of Work', hi: 'उद्देश्य एवं कार्यक्षेत्र',
    fields: [
      ['vision', 'Vision', 'दृष्टि', 'textarea'],
      ['visionHi', 'Vision (Hindi)', 'दृष्टि (हिंदी)', 'textarea'],
      ['mission', 'Mission', 'मिशन', 'textarea'],
      ['missionHi', 'Mission (Hindi)', 'मिशन (हिंदी)', 'textarea'],
      ['coreValues', 'Core Values', 'मूल मूल्य', 'textarea'],
      ['coreValuesHi', 'Core Values (Hindi)', 'मूल मूल्य (हिंदी)', 'textarea'],
      ['objectives', 'Core Objectives', 'मुख्य उद्देश्य', 'textarea'],
      ['objectivesHi', 'Core Objectives (Hindi)', 'मुख्य उद्देश्य (हिंदी)', 'textarea'],
      ['areasOfWork', 'Areas of Work', 'कार्यक्षेत्र', 'textarea'],
      ['areasOfWorkHi', 'Areas of Work (Hindi)', 'कार्यक्षेत्र (हिंदी)', 'textarea'],
      ['targetBeneficiaries', 'Target Beneficiaries', 'लक्षित समूह', 'textarea'],
      ['targetBeneficiariesHi', 'Target Beneficiaries (Hindi)', 'लक्षित समूह (हिंदी)', 'textarea'],
      ['statesDistricts', 'States / Districts', 'राज्य / ज़िले', 'textarea'],
      ['statesDistrictsHi', 'States / Districts (Hindi)', 'राज्य / ज़िले (हिंदी)', 'textarea'],
    ],
  },
  {
    id: 'legal', icon: 'Scale', en: 'Legal Registration & Identity', hi: 'कानूनी पंजीकरण एवं पहचान',
    fields: [
      ['registrationNumber', 'Registration Number', 'पंजीकरण संख्या'],
      ['registrationDate', 'Registration Date', 'पंजीकरण तिथि'],
      ['registrationAct', 'Registration Act', 'पंजीकरण अधिनियम'],
      ['registrationActHi', 'Registration Act (Hindi)', 'पंजीकरण अधिनियम (हिंदी)'],
      ['district', 'District', 'ज़िला'],
      ['districtHi', 'District (Hindi)', 'ज़िला (हिंदी)'],
      ['state', 'State', 'राज्य'],
      ['pan', 'PAN Number', 'पैन नंबर'],
      ['governingDocument', 'Governing Document / Rules', 'शासी दस्तावेज़ / नियमावली', 'textarea'],
      ['governingDocumentHi', 'Governing Document (Hindi)', 'शासी दस्तावेज़ (हिंदी)', 'textarea'],
      ['amendmentHistory', 'Amendment History', 'संशोधन इतिहास', 'textarea'],
      ['amendmentHistoryHi', 'Amendment History (Hindi)', 'संशोधन इतिहास (हिंदी)', 'textarea'],
    ],
  },
  {
    id: 'tax', icon: 'ReceiptText', en: 'Tax & Exemption', hi: 'कर एवं छूट अनुपालन',
    fields: [
      ['pan', 'PAN Number', 'पैन नंबर'],
      ['twelveAB', '12AB Registration No.', '12AB पंजीकरण संख्या'],
      ['twelveABStatus', '12AB Status', '12AB स्थिति'],
      ['twelveABStatusHi', '12AB Status (Hindi)', '12AB स्थिति (हिंदी)'],
      ['eightyG', '80G Registration No.', '80G पंजीकरण संख्या'],
      ['eightyGStatus', '80G Status', '80G स्थिति'],
      ['eightyGStatusHi', '80G Status (Hindi)', '80G स्थिति (हिंदी)'],
      ['assessmentYear', 'Assessment Year', 'निर्धारण वर्ष'],
      ['effectiveDates', 'Effective / Valid Dates', 'प्रभावी / वैध तिथियाँ'],
      ['effectiveDatesHi', 'Effective Dates (Hindi)', 'प्रभावी तिथियाँ (हिंदी)'],
      ['incomeTaxFiling', 'Income-tax Filing / Acknowledgement', 'आयकर फाइलिंग / पावती', 'textarea'],
      ['incomeTaxFilingHi', 'Income-tax Filing (Hindi)', 'आयकर फाइलिंग (हिंदी)', 'textarea'],
    ],
  },
  {
    id: 'darpan', icon: 'Landmark', en: 'NGO Darpan & CSR', hi: 'NGO दर्पण एवं CSR',
    fields: [
      ['ngoDarpanId', 'NGO DARPAN ID', 'NGO दर्पण आईडी'],
      ['darpanStatus', 'DARPAN Status', 'दर्पण स्थिति'],
      ['darpanStatusHi', 'DARPAN Status (Hindi)', 'दर्पण स्थिति (हिंदी)'],
      ['csr1Number', 'CSR-1 Registration No.', 'CSR-1 पंजीकरण संख्या'],
      ['csrStatus', 'CSR Status', 'CSR स्थिति'],
      ['csrStatusHi', 'CSR Status (Hindi)', 'CSR स्थिति (हिंदी)'],
      ['mcaCsrRecords', 'MCA / CSR Records & Remarks', 'MCA / CSR अभिलेख एवं टिप्पणी', 'textarea'],
      ['mcaCsrRecordsHi', 'MCA / CSR Remarks (Hindi)', 'MCA / CSR टिप्पणी (हिंदी)', 'textarea'],
    ],
  },
  {
    id: 'governance', icon: 'Users', en: 'Governance & Office Bearers', hi: 'शासन एवं पदाधिकारी',
    fields: [
      ['president', 'President', 'अध्यक्ष'],
      ['vicePresident', 'Vice President', 'उपाध्यक्ष'],
      ['secretary', 'Secretary', 'सचिव'],
      ['jointSecretary', 'Joint Secretary', 'संयुक्त सचिव'],
      ['treasurer', 'Treasurer', 'कोषाध्यक्ष'],
      ['members', 'Other Governing Body Members', 'अन्य शासी निकाय सदस्य', 'textarea'],
      ['rolesTenure', 'Roles / Tenure / Appointment Reference', 'भूमिका / कार्यकाल / नियुक्ति संदर्भ', 'textarea'],
      ['rolesTenureHi', 'Roles / Tenure (Hindi)', 'भूमिका / कार्यकाल (हिंदी)', 'textarea'],
    ],
  },
  {
    id: 'finance', icon: 'Wallet', en: 'Financial & Banking Profile', hi: 'वित्तीय एवं बैंकिंग विवरण',
    fields: [
      ['financialYear', 'Financial Year', 'वित्तीय वर्ष'],
      ['bankName', 'Bank Name', 'बैंक का नाम'],
      ['bankNameHi', 'Bank Name (Hindi)', 'बैंक का नाम (हिंदी)'],
      ['branch', 'Branch', 'शाखा'],
      ['branchHi', 'Branch (Hindi)', 'शाखा (हिंदी)'],
      ['accountNumber', 'Account Number', 'खाता संख्या'],
      ['ifsc', 'IFSC Code', 'IFSC कोड'],
      ['upi', 'UPI ID', 'UPI आईडी'],
      ['auditorName', 'Auditor / CA', 'लेखा परीक्षक / CA'],
      ['auditorContact', 'Auditor / CA Contact', 'लेखा परीक्षक / CA संपर्क'],
      ['booksStatus', 'Books of Accounts / Audit Status', 'लेखा पुस्तकें / लेखा परीक्षा स्थिति', 'textarea'],
      ['booksStatusHi', 'Books / Audit Status (Hindi)', 'लेखा / परीक्षा स्थिति (हिंदी)', 'textarea'],
    ],
  },
  {
    id: 'government', icon: 'Building', en: 'Government & Institutional Registrations', hi: 'शासकीय एवं संस्थागत पंजीकरण',
    fields: [
      ['udyam', 'MSME (Udyam Registration)', 'MSME (उद्यम पंजीकरण)'],
      ['msmeType', 'MSME Type', 'MSME प्रकार'],
      ['msmeTypeHi', 'MSME Type (Hindi)', 'MSME प्रकार (हिंदी)'],
      ['udyogAadhaar', 'Udyog Aadhaar No.', 'उद्योग आधार संख्या'],
      ['esic', 'ESIC No.', 'ESIC संख्या'],
      ['epfo', 'EPFO No.', 'EPFO संख्या'],
      ['digitalIndia', 'Digital India Registration', 'डिजिटल इंडिया पंजीकरण'],
      ['ncsEmployerId', 'NCS Employer ID', 'NCS नियोक्ता आईडी'],
      ['ncsOrganizationId', 'NCS Organisation ID', 'NCS संस्था आईडी'],
      ['lin', 'LIN', 'LIN'],
      ['mpJanAbhiyan', 'MP Jan Abhiyan Parishad', 'MP जन अभियान परिषद'],
      ['startupRegistration', 'Startup Registration', 'स्टार्टअप पंजीकरण'],
    ],
  },
  {
    id: 'calendar', icon: 'CalendarClock', en: 'Compliance Calendar', hi: 'अनुपालन कैलेंडर', multi: true,
    fields: [
      ['complianceName', 'Compliance / Return Name', 'अनुपालन / विवरणी नाम'],
      ['authority', 'Authority', 'प्राधिकारी'],
      ['dueDate', 'Due Date', 'देय तिथि', 'date'],
      ['financialYear', 'Financial Year', 'वित्तीय वर्ष'],
      ['status', 'Status', 'स्थिति'],
      ['filingDate', 'Filing Date', 'दाखिला तिथि', 'date'],
      ['acknowledgement', 'Acknowledgement No.', 'पावती संख्या'],
      ['responsiblePerson', 'Responsible Person', 'उत्तरदायी व्यक्ति'],
      ['remarks', 'Remarks', 'टिप्पणी', 'textarea'],
    ],
  },
  {
    id: 'history', icon: 'History', en: 'Documents & Compliance History', hi: 'दस्तावेज़ एवं अनुपालन इतिहास', multi: true,
    fields: [
      ['date', 'Date', 'दिनांक', 'date'],
      ['eventType', 'Document / Compliance Event Type', 'दस्तावेज़ / अनुपालन घटना प्रकार'],
      ['title', 'Document / Event Title', 'दस्तावेज़ / घटना शीर्षक'],
      ['referenceNo', 'Document / Reference No.', 'दस्तावेज़ / संदर्भ संख्या'],
      ['description', 'Description / Details', 'विवरण', 'textarea'],
      ['supportingDocument', 'Supporting Document / File Reference', 'सहायक दस्तावेज़ / फ़ाइल संदर्भ'],
      ['remarks', 'Remarks', 'टिप्पणी', 'textarea'],
    ],
  },
];

const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#FF6600]';

export function ImsOrganisationProfile() {
  const { lang } = useLang();
  const hi = lang === 'hi';
  const [tab, setTab] = useState('master');
  const [rows, setRows] = useState(null);
  const [master, setMaster] = useState(null);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const fetchRecords = async () => {
    let d = await ims.list('orgProfile', { limit: 200 });
    let records = d.records || [];
    if (records.length === 0) {
      await ims.orgProfileSeed().catch(() => {});
      d = await ims.list('orgProfile', { limit: 200 });
      records = d.records || [];
    }
    return records;
  };

  const fetchMaster = async () => {
    try {
      const d = await ims.list('organisations', { limit: 1 });
      return (d.records || [])[0] || null;
    } catch { return null; }
  };

  const applySection = (records, masterRec) => {
    const section = SECTIONS.find(s => s.id === tab);
    if (section && section.master) {
      setEditingId(masterRec ? masterRec.id : null);
      setForm(masterRec ? { ...masterRec } : {});
      return;
    }
    const current = records.find(r => r.section === tab);
    // Multi-record sections (calendar/history) start blank for a fresh entry;
    // single-record sections load the saved master record.
    if (section && section.multi) { setEditingId(null); setForm({}); }
    else { setEditingId(current ? current.id : null); setForm({ ...(current && current.data ? current.data : {}) }); }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      const [records, masterRec] = await Promise.all([fetchRecords(), fetchMaster()]);
      if (!active) return;
      setRows(records);
      setMaster(masterRec);
      applySection(records, masterRec);
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const section = useMemo(() => SECTIONS.find(s => s.id === tab), [tab]);
  const sectionRows = useMemo(() => (rows || []).filter(r => r.section === tab), [rows, tab]);
  const sectionHas = (s) => s.master ? !!master : rows.some(r => r.section === s.id);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const startNew = () => { setEditingId(null); setForm({}); setNotice(''); };
  const startEdit = (r) => { setEditingId(r.id); setForm({ ...(r.data || {}) }); setNotice(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const save = async () => {
    setSaving(true); setNotice('');
    try {
      if (section.master) {
        const rec = master;
        if (rec) await ims.update('organisations', rec.id, form);
        else setMaster(await ims.create('organisations', form, true));
        setNotice(hi ? 'संस्था मास्टर सफलतापूर्वक सहेजा गया।' : 'Organisation Master saved successfully.');
        return;
      }
      const payload = { section: tab, data: form, ...form };
      if (editingId) await ims.update('orgProfile', editingId, payload);
      else await ims.create('orgProfile', { ...payload, recordId: 'SSF-ORG-' + tab.toUpperCase() + (section.multi ? '-' + Date.now() : '') }, true);
      setNotice(hi ? 'विवरण सफलतापूर्वक सहेजा गया।' : 'Details saved successfully.');
      const records = await fetchRecords();
      setRows(records);
      applySection(records, master);
    } catch (e) { setNotice(e.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <ImsLayout active="org_profile">
      <PageHeader
        title={hi ? 'संस्था प्रोफ़ाइल एवं अनुपालन' : 'Organisation Profile & Compliance'}
        subtitle={hi ? 'संस्था की मुख्य पहचान, सांविधिक पंजीकरण, शासन, वित्त एवं अनुपालन अभिलेख।' : 'Master organisational profile, statutory registrations, governance, finance and compliance records.'}
      />

      <SectionHero
        title={hi ? 'संस्था प्रोफ़ाइल' : 'Organisation Profile'}
        hi={hi ? '' : 'संस्था परिचय एवं अनुपालन'}
        eyebrow="SSF-IMS · Organisation"
        icon="Building2"
        tone="navy"
      >
        {rows && <StatStrip items={SECTIONS.map(s => ({ label: hi ? s.hi : s.en, value: sectionHas(s) ? '✓' : '—' }))} />}
      </SectionHero>

      {!rows && <Spinner />}

      {rows && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Card className="h-fit p-2">
            {SECTIONS.map(s => (
              <button key={s.id} type="button" onClick={() => setTab(s.id)}
                className={`mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold ${tab === s.id ? 'bg-[#002344] text-white' : 'text-[#002344] hover:bg-slate-100'}`}>
                <span>{hi ? s.hi : s.en}</span>
                {sectionHas(s) && <span className="ml-auto text-xs opacity-70">✓</span>}
              </button>
            ))}
          </Card>

          <div className="min-w-0 space-y-4">
            <Card className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-[#002344]">{hi ? section.hi : section.en}</h3>
                {section.multi && editingId && <Button variant="ghost" icon="Plus" onClick={startNew}>{hi ? 'नई प्रविष्टि' : 'New Entry'}</Button>}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {section.multi
                  ? (hi ? 'एक से अधिक रिकॉर्ड समर्थित हैं — नई प्रविष्टि के लिए सहेजें, किसी मौजूदा को संपादित करने के लिए नीचे Edit दबाएँ।' : 'Multiple records are supported — Save to add a new entry, or use Edit below to update an existing one.')
                  : (hi ? 'यहाँ सहेजी गई जानकारी ही संस्था का अधिकृत रिकॉर्ड है। संपादित करके सहेजें।' : 'Saved details below are the Foundation\'s official record. Edit and save to update.')}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {section.fields.map(([key, en, hiLabel, type]) => (
                  <div key={key} className={type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">{hi ? hiLabel : en}</label>
                    {type === 'textarea'
                      ? <textarea rows={3} className={inputCls} value={form[key] ?? ''} onChange={e => set(key, e.target.value)} />
                      : <input type={type === 'date' ? 'date' : 'text'} className={inputCls} value={form[key] ?? ''} onChange={e => set(key, e.target.value)} />}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button icon="Save" onClick={save} disabled={saving}>
                  {saving ? '…' : editingId ? (hi ? 'अद्यतन करें' : 'Update') : (hi ? 'सहेजें' : 'Save')}
                </Button>
                {section.multi && editingId && <Button variant="ghost" onClick={startNew}>{hi ? 'रद्द करें' : 'Cancel'}</Button>}
                {editingId && <span className="font-mono text-xs text-slate-400">#{editingId}</span>}
              </div>
            </Card>
            {notice && <Card className="border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</Card>}

            {section.multi && (
              <Card className="overflow-hidden">
                <div className="border-b border-slate-200 px-4 py-3">
                  <h4 className="font-bold text-[#002344]">{hi ? 'सहेजे गए रिकॉर्ड' : 'Saved Records'} · {sectionRows.length}</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <th className="whitespace-nowrap px-4 py-2.5 font-semibold">Record ID</th>
                        <th className="whitespace-nowrap px-4 py-2.5 font-semibold">{hi ? 'रिकॉर्ड दिनांक' : 'Record Date'}</th>
                        {section.fields.map(([key, en, hiLabel]) => (
                          <th key={key} className="whitespace-nowrap px-4 py-2.5 font-semibold">{hi ? hiLabel : en}</th>
                        ))}
                        <th className="whitespace-nowrap px-4 py-2.5 text-right font-semibold">{hi ? 'कार्रवाई' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sectionRows.map(r => {
                        const d = r.data || {};
                        return (
                          <tr key={r.id} className="align-top hover:bg-slate-50">
                            <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-500">{r.recordId}</td>
                            <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">{(r.createdAt || '').slice(0, 10) || '—'}</td>
                            {section.fields.map(([key]) => (
                              <td key={key} className="max-w-[260px] whitespace-pre-line px-4 py-2.5 text-slate-700">{d[key] || '—'}</td>
                            ))}
                            <td className="whitespace-nowrap px-4 py-2.5 text-right">
                              <button onClick={() => startEdit(r)} className="font-semibold text-[#002344] hover:text-[#FF6600]">{hi ? 'संपादित करें' : 'Edit'}</button>
                            </td>
                          </tr>
                        );
                      })}
                      {sectionRows.length === 0 && (
                        <tr><td colSpan={section.fields.length + 3} className="px-4 py-8 text-center text-slate-400">{hi ? 'अभी कोई रिकॉर्ड नहीं।' : 'No records yet.'}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </ImsLayout>
  );
}
