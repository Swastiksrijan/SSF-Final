// SSF-IMS — Official Letter Generator for Swastik Srijan Foundation Samiti.
import { useEffect, useMemo, useState } from 'react';
import {
  FileSignature, Download, Printer, Eye, Save, FileText, Languages,
  CheckCircle2, AlertTriangle, Loader2, RefreshCw, Search, X, Stamp
} from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { PAGE_TITLE_ON_DARK } from '../ui';
import { LETTER_TYPES } from '../letterheadData';
import {
  downloadLetterPdf, previewLetterPdf, printLetterPdf, letterFileName,
  letterheadPreviewHtml, PAGE_W_MM, PAGE_H_MM, SIGNATURE_HOLDER,
} from '../letterheadPdf';

const REGISTER = 'documents';
const CATEGORY = 'Official Correspondence';
const TYPE_GROUPS = [
  { code: 'GEN', en: 'General official letter', hi: 'सामान्य कार्यालयीन पत्र' },
  { code: 'GOV', en: 'Government & department', hi: 'शासकीय एवं विभागीय पत्र' },
  { code: 'CSR', en: 'CSR, corporate & donor', hi: 'CSR, कॉर्पोरेट एवं दानदाता पत्र' },
  { code: 'AUTH', en: 'Bank, authorization & institutional', hi: 'बैंक, प्राधिकरण एवं संस्थागत पत्र' },
];
const SIGNATORIES = [
  { name: 'Ramesh Pandey', designation: 'President', hi: 'अध्यक्ष' },
  { name: 'Amit Kumar Pandey', designation: 'Secretary', hi: 'सचिव' },
  { name: 'Preeti Shukla', designation: 'Vice President', hi: 'उपाध्यक्ष' },
  { name: 'Divya Sharma', designation: 'Treasurer', hi: 'कोषाध्यक्ष' },
  { name: 'Kiran Pandey', designation: 'Joint Secretary', hi: 'संयुक्त सचिव' },
  { name: '__trio__', designation: 'President + Secretary + Treasurer', hi: 'अध्यक्ष + सचिव + कोषाध्यक्ष — तीनों एक लाइन में' },
  { name: 'Other authorised signatory', designation: 'Authorised Signatory', hi: 'अधिकृत हस्ताक्षरकर्ता' },
];
const cls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#12345A] focus:ring-2 focus:ring-[#12345A]/10';
const label = 'mb-1 block text-xs font-bold text-slate-600';
const today = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const financialYear = (dateValue) => {
  const d = dateValue ? new Date(dateValue + 'T12:00:00') : new Date();
  const start = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return String(start) + '-' + String(start + 1).slice(-2);
};
const rowData = (r) => r && r.data ? r.data : {};
const nextRef = (rows, groupCode, dateValue) => {
  const prefix = 'SSF/' + groupCode + '/' + financialYear(dateValue) + '/';
  const max = (rows || []).map((r) => String(rowData(r).letterNo || '')).filter((n) => n.startsWith(prefix))
    .map((n) => Number.parseInt(n.slice(prefix.length), 10) || 0).reduce((a, b) => Math.max(a, b), 0);
  return prefix + String(max + 1).padStart(4, '0');
};
const initialLetter = () => ({
  blankMode: false,
  letterNo: '',
  date: today(),
  groupCode: 'GEN',
  letterType: LETTER_TYPES[0].en,
  toName: '', toDesignation: '', toOrg: '', toAddress: '',
  subject: '', salutation: 'Respected Sir/Madam,',
  body: '', closing: '',
  enclosures: '', cc: '',
  signatoryName: 'Ramesh Pandey',
  signatoryDesignation: 'President',
  signature: false,
  seal: true,
  sealPosition: 'left',
  signatoryMode: 'single',
});
const rowToLetter = (r) => {
  const d = rowData(r);
  return {
    id: r.id,
    docId: r.recordId || '',
    letterNo: d.letterNo || '',
    group: d.groupLabel || d.docType || r.docType || r.category || '—',
    to: d.toName || d.toOrg || '—',
    subject: d.subject || r.title || '—',
    date: d.date || r.issueDate || r.recordDate || '',
  };
};

export default function ImsLetterhead() {
  const { lang } = useLang();
  const hindi = lang === 'hi';
  const [rows, setRows] = useState([]);
  const [f, setF] = useState(initialLetter);
  const [pdfLang, setPdfLang] = useState('both');
  const [watermark, setWatermark] = useState(true);
  const [sheet, setSheet] = useState('');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState(null);
  const [query, setQuery] = useState('');
  const [customSignatoryName, setCustomSignatoryName] = useState('');
  const [preview, setPreview] = useState(null);
  const set = (key, value) => setF((old) => ({ ...old, [key]: value }));
  const say = (text, tone) => setNotice({ text, tone: tone || 'ok' });
  const activeGroup = TYPE_GROUPS.find((g) => g.code === f.groupCode) || TYPE_GROUPS[0];
  const outputLetter = useMemo(() => ({ ...f, signatoryName: f.signatoryName === 'Other authorised signatory' ? customSignatoryName.trim() : f.signatoryName }), [f, customSignatoryName]);
  const isSecretary = f.signatoryName === SIGNATURE_HOLDER;

  useEffect(() => {
    let live = true;
    ims.list(REGISTER, { limit: 500 }).then((d) => {
      if (live) setRows(Array.isArray(d) ? d : (d.records || d.items || d.rows || []));
    }).catch(() => { if (live) setRows([]); });
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (!f.letterNo) setF((old) => old.letterNo ? old : ({ ...old, letterNo: nextRef(rows, old.groupCode, old.date) }));
  }, [rows, f.letterNo]);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      try {
        const html = await letterheadPreviewHtml(f, { lang: pdfLang, watermark });
        if (!alive) return;
        const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
        setSheet((previous) => {
          if (previous) URL.revokeObjectURL(previous);
          return url;
        });
      } catch { /* the PDF actions remain available if preview rendering fails */ }
    }, 280);
    return () => { alive = false; clearTimeout(timer); };
  }, [f, pdfLang, watermark]);

  useEffect(() => () => { if (sheet) URL.revokeObjectURL(sheet); }, [sheet]);

  const recent = useMemo(() => rows.map(rowToLetter)
    .filter((r) => !query || [r.letterNo, r.group, r.to, r.subject, r.docId].join(' ').toLowerCase().includes(query.toLowerCase()))
    .slice(0, 25), [rows, query]);

  const chooseGroup = (code) => {
    setF((old) => ({ ...old, groupCode: code, letterNo: nextRef(rows, code, old.date) }));
  };
  const chooseType = (name) => {
    const template = LETTER_TYPES.find((t) => t.en === name);
    setF((old) => ({
      ...old,
      letterType: name,
      subject: template ? (hindi ? template.subject.hi : template.subject.en) : old.subject,
      body: template ? (hindi ? template.body.hi : template.body.en) : old.body,
      salutation: hindi ? 'आदरणीय महोदय / महोदया,' : 'Respected Sir/Madam,',
      closing: '',
    }));
  };
  const refreshRef = () => set('letterNo', nextRef(rows, f.groupCode, f.date));
  const validate = () => {
    if (!f.subject.trim() && !f.body.trim()) {
      say(hindi ? 'कृपया विषय या पत्र की सामग्री भरें।' : 'Please enter a subject or letter body.', 'warn');
      return false;
    }
    if (f.signatoryMode !== 'trio' && (!outputLetter.signatoryName || !f.signatoryDesignation)) {
      say(hindi ? 'हस्ताक्षरकर्ता का नाम और पद भरें।' : 'Please provide the signatory name and designation.', 'warn');
      return false;
    }
    return true;
  };
  const run = async (key, task) => {
    if (!validate()) return;
    setBusy(key);
    setNotice(null);
    try { await task(); }
    catch (e) { say((hindi ? 'कार्य पूरा नहीं हुआ: ' : 'Action failed: ') + (e.message || 'Unknown error'), 'err'); }
    finally { setBusy(''); }
  };
  const doPreview = () => run('preview', async () => {
    const result = await previewLetterPdf(outputLetter, { lang: pdfLang, watermark });
    if (result.opened) say(hindi ? 'PDF नए टैब में खुला है।' : 'PDF opened in a new tab.');
    else setPreview({ url: result.url });
  });
  const doDownload = () => run('download', () => downloadLetterPdf(outputLetter, { lang: pdfLang, watermark }));
  const doPrint = () => run('print', () => printLetterPdf(outputLetter, { lang: pdfLang, watermark }));
  const doSave = () => run('save', async () => {
    const payload = {
      title: f.subject || activeGroup.en + ' — ' + (f.toName || f.toOrg || 'Official letter'),
      category: CATEGORY,
      docType: activeGroup.en,
      issueDate: f.date,
      owner: outputLetter.signatoryName,
      source: 'SSF Official Letter Generator',
      approvedBy: f.signatoryDesignation,
      data: {
        letterNo: f.letterNo, date: f.date, groupCode: f.groupCode,
        groupLabel: activeGroup.en, docType: f.letterType,
        toName: f.toName, toDesignation: f.toDesignation, toOrg: f.toOrg, toAddress: f.toAddress,
        subject: f.subject, salutation: f.salutation, body: f.body, closing: f.closing,
        enclosures: f.enclosures, cc: f.cc,
        signatoryName: outputLetter.signatoryName, signatoryDesignation: f.signatoryDesignation,
        signatoryMode: f.signatoryMode || 'single',
        signature: isSecretary && f.signature === true, seal: f.seal !== false, sealPosition: f.sealPosition || 'left', signatoryMode: f.signatoryMode || 'single',
        language: pdfLang, watermark,
      },
    };
    const created = await ims.create(REGISTER, payload);
    setRows((old) => [created, ...old]);
    const next = { ...initialLetter(), groupCode: f.groupCode, letterType: f.letterType,
      signatoryName: f.signatoryName === 'Other authorised signatory' ? 'Ramesh Pandey' : f.signatoryName,
      signatoryDesignation: f.signatoryName === 'Other authorised signatory' ? 'President' : f.signatoryDesignation };
    if (f.signatoryName === 'Other authorised signatory') setCustomSignatoryName('');
    next.letterNo = nextRef([created, ...rows], next.groupCode, next.date);
    setF(next);
    say((hindi ? 'पत्र दस्तावेज़ पंजिका में सुरक्षित है। संदर्भ: ' : 'Letter saved to the permanent Documents register. Reference: ') + f.letterNo + (created.recordId ? ' · ' + created.recordId : ''));
  });
  const closePreview = () => {
    if (preview && preview.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  return (
    <ImsLayout active="letterhead">
      <div className="mx-auto max-w-[1500px] space-y-5">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1F3A] via-[#12345A] to-[#176447] p-6 text-white shadow-lg sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full border border-white/10" />
          <div className="relative flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-[#F7A814]"><FileSignature size={27} /></span>
            <div className="min-w-0 flex-1">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.15em]">SSF · Official Correspondence</div>
              <h1 className={PAGE_TITLE_ON_DARK + ' leading-tight'}>{hindi ? 'आधिकारिक पत्र निर्माण' : 'Official Letter Generator'}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75">{hindi ? 'संस्था के आधिकारिक पत्र बनाएँ, A4 पर पूर्वावलोकन करें, PDF डाउनलोड करें और प्रत्येक जारी पत्र को दस्तावेज़ पंजिका में सुरक्षित रखें।' : 'Create professional official letters, preview the true A4 layout, export PDF and keep a permanent record in the IMS Documents register.'}</p>
            </div>
          </div>
          <div className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TYPE_GROUPS.map((g) => <button key={g.code} type="button" onClick={() => chooseGroup(g.code)} className={'rounded-xl border px-3 py-3 text-left transition ' + (f.groupCode === g.code ? 'border-[#F7A814] bg-white text-[#12345A]' : 'border-white/20 bg-white/5 text-white hover:bg-white/10')}>
              <span className="block text-xs font-extrabold">{hindi ? g.hi : g.en}</span>
              <span className="mt-1 block text-[10px] opacity-70">{g.code}</span>
            </button>)}
          </div>
        </section>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-[#12345A]">{hindi ? 'पत्र का विवरण' : 'Letter details'}</h2>
                <p className="mt-1 text-xs text-slate-500">{hindi ? 'क्रमांक और तारीख स्वतः भरे जाते हैं; जरूरत हो तो बदल सकते हैं।' : 'Reference number and date are filled automatically; you can edit them if needed.'}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-800">A4 · PDF</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={label}>{hindi ? 'संदर्भ क्रमांक' : 'Reference number'}</label>
                <div className="flex gap-2">
                  <input className={cls} value={f.letterNo} onChange={(e) => set('letterNo', e.target.value)} />
                  <button type="button" onClick={refreshRef} title="Generate next reference" className="grid shrink-0 place-items-center rounded-xl border border-slate-200 px-3 text-[#12345A] hover:bg-slate-50"><RefreshCw size={16} /></button>
                </div>
              </div>
              <div><label className={label}>{hindi ? 'दिनांक' : 'Date'}</label><input type="date" className={cls} value={f.date} onChange={(e) => { const v = e.target.value; setF((old) => ({ ...old, date: v, letterNo: nextRef(rows, old.groupCode, v) })); }} /></div>
              <div className="sm:col-span-2">
                <label className={label}>{hindi ? 'पत्र का उप-प्रकार / टेम्पलेट' : 'Letter subtype / template'}</label>
                <select className={cls} value={f.letterType} onChange={(e) => chooseType(e.target.value)}>
                  {LETTER_TYPES.map((t) => <option key={t.en} value={t.en}>{hindi ? t.hi : t.en}</option>)}
                </select>
              </div>
              <div><label className={label}>{hindi ? 'प्राप्तकर्ता का नाम' : 'Recipient name'}</label><input className={cls} value={f.toName} onChange={(e) => set('toName', e.target.value)} placeholder={hindi ? 'श्री / श्रीमती…' : 'Name of recipient'} /></div>
              <div><label className={label}>{hindi ? 'पदनाम' : 'Designation'}</label><input className={cls} value={f.toDesignation} onChange={(e) => set('toDesignation', e.target.value)} placeholder={hindi ? 'कलेक्टर / निदेशक…' : 'Collector / Director'} /></div>
              <div><label className={label}>{hindi ? 'विभाग / संस्था / कंपनी' : 'Department / organisation'}</label><input className={cls} value={f.toOrg} onChange={(e) => set('toOrg', e.target.value)} /></div>
              <div><label className={label}>{hindi ? 'प्राप्तकर्ता का पता' : 'Recipient address'}</label><input className={cls} value={f.toAddress} onChange={(e) => set('toAddress', e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={label}>{hindi ? 'विषय' : 'Subject'}</label><input className={cls} value={f.subject} onChange={(e) => set('subject', e.target.value)} placeholder={hindi ? 'पत्र का संक्षिप्त विषय' : 'Short, clear subject line'} /></div>
              <div className="sm:col-span-2"><label className={label}>{hindi ? 'संबोधन' : 'Salutation'}</label><input className={cls} value={f.salutation} onChange={(e) => set('salutation', e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={label}>{hindi ? 'पत्र की सामग्री' : 'Letter body'}</label><textarea className={cls + ' min-h-[220px] resize-y leading-6'} value={f.body} onChange={(e) => set('body', e.target.value)} placeholder={hindi ? 'अपना पत्र यहाँ लिखें…' : 'Write the letter here…'} /></div>
              <div><label className={label}>{hindi ? 'संलग्नक' : 'Enclosures'}</label><input className={cls} value={f.enclosures} onChange={(e) => set('enclosures', e.target.value)} placeholder={hindi ? 'यदि हों तो' : 'If any'} /></div>
              <div className="sm:col-span-2"><label className={label}>{hindi ? 'प्रतिलिपि (CC)' : 'Copy to (CC)'}</label><input className={cls} value={f.cc} onChange={(e) => set('cc', e.target.value)} /></div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#12345A]"><FileSignature size={16} />{hindi ? 'हस्ताक्षर एवं प्राधिकरण' : 'Signatory & authorisation'}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={label}>{hindi ? 'हस्ताक्षरकर्ता / व्यवस्था' : 'Signatory'}</label>
                  <button type="button" onClick={() => { setF((old) => ({ ...old, signatoryMode: 'trio', signature: false })); setCustomSignatoryName(''); }} className="mb-2 w-full rounded-xl border-2 border-[#12345A] bg-blue-50 px-3 py-2.5 text-left text-sm font-extrabold text-[#12345A] hover:bg-blue-100">
                    {hindi ? '★ तीनों एक साथ चुनें — अध्यक्ष + सचिव + कोषाध्यक्ष' : '★ Select all three — President + Secretary + Treasurer'}
                  </button>
                  <select className={cls} value={f.signatoryMode === 'trio' ? '__trio__' : f.signatoryName} onChange={(e) => {
                    if (e.target.value === '__trio__') {
                      setF((old) => ({ ...old, signatoryMode: 'trio', signature: false }));
                      setCustomSignatoryName('');
                      return;
                    }
                    const chosen = SIGNATORIES.find((s) => s.name === e.target.value);
                    setF((old) => ({ ...old, signatoryMode: 'single', signatoryName: e.target.value, signatoryDesignation: chosen ? chosen.designation : old.signatoryDesignation, signature: false }));
                    if (e.target.value !== 'Other authorised signatory') setCustomSignatoryName('');
                  }}>
                    <option value="__trio__">{hindi ? '★ तीनों एक साथ — अध्यक्ष + सचिव + कोषाध्यक्ष' : '★ Select all three — President + Secretary + Treasurer'}</option>
                    {SIGNATORIES.filter((s) => s.name !== '__trio__').map((s) => <option key={s.name} value={s.name}>{s.name} — {hindi ? s.hi : s.designation}</option>)}
                  </select>
                  {f.signatoryMode === 'trio' && <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-900">{hindi ? 'PDF में Ramesh Pandey (अध्यक्ष), Amit Kumar Pandey (सचिव) और Divya Sharma (कोषाध्यक्ष) के तीन हस्ताक्षर बॉक्स एक ही पंक्ति में आएँगे।' : 'The PDF will show Ramesh Pandey (President), Amit Kumar Pandey (Secretary) and Divya Sharma (Treasurer) in one row.'}</p>}
                </div>
                {f.signatoryMode !== 'trio' && <>
                  <div><label className={label}>{hindi ? 'पदनाम' : 'Designation'}</label><input className={cls} value={f.signatoryDesignation} onChange={(e) => set('signatoryDesignation', e.target.value)} /></div>
                  {f.signatoryName === 'Other authorised signatory' && <div className="sm:col-span-2"><label className={label}>{hindi ? 'अधिकृत व्यक्ति का पूरा नाम' : 'Full name of authorised person'}</label><input className={cls} value={customSignatoryName} onChange={(e) => setCustomSignatoryName(e.target.value)} placeholder={hindi ? 'पूरा नाम दर्ज करें' : 'Enter full name'} /></div>}
                </>}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={f.signature === true && isSecretary} disabled={!isSecretary} onChange={(e) => set('signature', e.target.checked)} className="h-4 w-4 accent-[#12345A]" /><span className={!isSecretary ? 'text-slate-400' : 'text-slate-700'}>{hindi ? 'सचिव के उपलब्ध हस्ताक्षर स्कैन का उपयोग' : 'Use Secretary signature scan (only if selected)'}</span></label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={f.seal !== false} onChange={(e) => set('seal', e.target.checked)} className="h-4 w-4 accent-[#12345A]" /><Stamp size={15} className="text-[#176447]" />{hindi ? 'संस्था की मुहर' : 'Organisation seal'}</label>
                <div className="min-w-[210px] flex-1"><label className={label}>{hindi ? 'मुहर की जगह' : 'Seal placement'}</label><select className={cls} value={f.sealPosition || 'left'} onChange={(e) => set('sealPosition', e.target.value)}><option value="left">{hindi ? 'संस्था के नाम के पास (छोटी)' : 'Beside organisation name (small)'}</option><option value="signatory">{hindi ? 'अधिकृत हस्ताक्षर के पास' : 'Beside authorised signatory'}</option></select></div>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={watermark} onChange={(e) => setWatermark(e.target.checked)} className="h-4 w-4 accent-[#12345A]" />{hindi ? 'हल्का वॉटरमार्क' : 'Faint watermark'}</label>
              </div>
              {!isSecretary && <p className="mt-2 text-xs leading-5 text-amber-800">{hindi ? 'इस पदाधिकारी के नाम पर सचिव के हस्ताक्षर नहीं लगेंगे। वास्तविक हस्ताक्षर के लिए प्रिंट के बाद हस्ताक्षर करें।' : 'The Secretary’s scanned signature will not be placed under another person’s name. Print and sign manually for other signatories.'}</p>}
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#12345A]"><Languages size={16} />{hindi ? 'भाषा एवं आउटपुट' : 'Language & output'}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className={label}>{hindi ? 'पत्र की भाषा' : 'Letter language'}</label><select className={cls} value={pdfLang} onChange={(e) => setPdfLang(e.target.value)}><option value="both">Hindi + English / हिंदी + अंग्रेज़ी</option><option value="hi">Hindi only / केवल हिंदी</option><option value="en">English only / केवल अंग्रेज़ी</option></select></div>
                <div className="flex items-end"><p className="text-xs leading-5 text-slate-500">{hindi ? 'PDF, प्रिंट और पूर्वावलोकन में यही भाषा लागू होगी।' : 'This setting applies to preview, PDF and print.'}</p></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={!!busy} onClick={doPreview} className="inline-flex items-center gap-2 rounded-xl bg-[#12345A] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy === 'preview' ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}{hindi ? 'पूर्वावलोकन' : 'Preview PDF'}</button>
              <button type="button" disabled={!!busy} onClick={doDownload} className="inline-flex items-center gap-2 rounded-xl bg-[#176447] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy === 'download' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}{hindi ? 'PDF डाउनलोड' : 'Download PDF'}</button>
              <button type="button" disabled={!!busy} onClick={doPrint} className="inline-flex items-center gap-2 rounded-xl border border-[#12345A] px-4 py-2.5 text-sm font-bold text-[#12345A] disabled:opacity-50">{busy === 'print' ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}{hindi ? 'प्रिंट' : 'Print'}</button>
              <button type="button" disabled={!!busy} onClick={doSave} className="inline-flex items-center gap-2 rounded-xl bg-[#F7A814] px-4 py-2.5 text-sm font-bold text-[#12345A] disabled:opacity-50">{busy === 'save' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{hindi ? 'पंजिका में सुरक्षित करें' : 'Save to register'}</button>
            </div>
            {notice && <div role={notice.tone === 'err' || notice.tone === 'warn' ? 'alert' : 'status'} className={'flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-semibold ' + (notice.tone === 'ok' ? 'bg-emerald-50 text-emerald-800' : notice.tone === 'warn' ? 'bg-amber-50 text-amber-900' : 'bg-red-50 text-red-800')}>{notice.tone === 'ok' ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}<span>{notice.text}</span></div>}
          </section>

          <div className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div><h2 className="flex items-center gap-2 text-base font-black text-[#12345A]"><FileText size={17} className="text-[#176447]" />{hindi ? 'A4 पत्र पूर्वावलोकन' : 'A4 letter preview'}</h2><p className="mt-1 text-xs text-slate-500">{PAGE_W_MM} × {PAGE_H_MM} mm · {hindi ? 'यही लेआउट PDF में होगा' : 'Same layout used for the PDF'}</p></div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">A4</span>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {sheet ? <iframe title="SSF A4 letter preview" src={sheet} className="h-[780px] w-full border-0" /> : <div className="grid h-[780px] place-items-center text-slate-400"><Loader2 size={20} className="animate-spin" /></div>}
              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-black text-[#12345A]">{hindi ? 'जारी पत्रों की पंजिका' : 'Official letter register'}</h2><p className="mt-1 text-xs text-slate-500">{hindi ? 'सहेजे गए पत्र स्थायी IMS दस्तावेज़ पंजिका से लिए जाते हैं।' : 'Records are loaded from the permanent IMS Documents register.'}</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{rows.length}</span></div>
              <div className="relative mt-3"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className={cls + ' pl-9'} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={hindi ? 'क्रमांक, विषय, प्राप्तकर्ता या Doc ID खोजें' : 'Search reference, subject, recipient or Doc ID'} /></div>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500"><tr><th className="p-2.5">Ref. No.</th><th className="p-2.5">Doc ID</th><th className="p-2.5">{hindi ? 'प्रति' : 'To'}</th><th className="p-2.5">{hindi ? 'विषय' : 'Subject'}</th><th className="p-2.5">{hindi ? 'दिनांक' : 'Date'}</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {recent.map((r, i) => <tr key={r.id || r.docId || i} className="hover:bg-slate-50"><td className="p-2.5 font-bold text-[#12345A]">{r.letterNo || '—'}</td><td className="p-2.5 font-mono text-slate-500">{r.docId || '—'}</td><td className="p-2.5">{r.to}</td><td className="max-w-[200px] truncate p-2.5">{r.subject}</td><td className="p-2.5">{r.date || '—'}</td></tr>)}
                    {!recent.length && <tr><td colSpan={5} className="p-5 text-center text-slate-400">{hindi ? 'कोई पत्र नहीं मिला।' : 'No letters found.'}</td></tr>}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-slate-400">{hindi ? 'नोट: संदर्भ क्रमांक का सुझाव पंजिका में मौजूद क्रमांकों से बनता है। अंतिम रिकॉर्ड सर्वर पर सुरक्षित होता है।' : 'Note: suggested references are based on existing register entries. Saved records are stored on the server.'}</p>
            </section>
          </div>
        </div>
      </div>
      {preview && preview.url && <div className="fixed inset-0 z-[1200] flex flex-col bg-black/70 p-3 sm:p-6"><div className="mb-2 flex items-center justify-between text-white"><span className="text-sm font-bold">{letterFileName(outputLetter, pdfLang)}</span><button type="button" onClick={closePreview} className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold"><X size={15} />{hindi ? 'बंद करें' : 'Close'}</button></div><iframe title="SSF letter PDF" src={preview.url} className="min-h-0 flex-1 w-full rounded-xl bg-white" /></div>}
    </ImsLayout>
  );
}
