// SSF-IMS — Letterhead / लेटरहेड composer.
//
// One screen to write any official letter — to a government department, a
// company, a bank, a donor or a member — and send it out on the Foundation's
// own letterhead. English, हिंदी or both; preview, download, print (works
// offline) or share on WhatsApp / e-mail.
import { useEffect, useMemo, useState } from 'react';
import {
  FileSignature, Eye, Download, Printer, Share2, Mail, MessageCircle, Copy,
  FilePlus2, Loader2, X, CheckCircle2, AlertTriangle, Languages, Droplets, Save,
  FileText, RotateCcw,
} from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { LETTER_TYPES } from '../letterheadData';
import {
  downloadLetterPdf, previewLetterPdf, printLetterPdf, shareLetterPdf,
  letterPlainText, nextLetterNo, letterFileName, letterheadPreviewHtml,
  PAGE_W_MM, PAGE_H_MM,
} from '../letterheadPdf';

const LANGS = [
  { id: 'both', en: 'Bilingual', hi: 'द्विभाषी' },
  { id: 'en', en: 'English only', hi: 'केवल अंग्रेज़ी' },
  { id: 'hi', en: 'Hindi only', hi: 'केवल हिंदी' },
];

// The composer writes into the IMS Documents register (`documents`), the module
// the Official Documents screen reads. The old code posted to a module named
// `officialDocuments`, which the IMS resource engine does not know, so every
// save failed with "Unknown IMS resource".
const REGISTER = 'documents';
const CATEGORY = 'Official Correspondence';

const cls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#12345A] focus:ring-2 focus:ring-[#12345A]/10';
const label = 'text-[11px] font-bold uppercase tracking-wide text-slate-500';

const today = () => new Date().toISOString().slice(0, 10);

const blankLetter = () => ({
  letterNo: '', date: today(), letterType: LETTER_TYPES[0].en,
  toName: '', toDesignation: '', toOrg: '', toAddress: '',
  subject: '', salutation: '', body: '', closing: '', enclosures: '', cc: '',
  // The President named in src/ims/orgProfileData.js; editable before sending.
  signatoryName: 'Ramesh Pandey', signatoryDesignation: 'Founder & National President',
});

const TEMPLATE_KEY = 'ssf_letterhead_template';

/** A stored register row → the display shape used by the "Recent letters" table. */
const rowToLetter = (r) => {
  const d = (r && r.data) || {};
  return {
    id: r.id,
    documentId: r.recordId || '',
    letterNo: d.letterNo || '',
    letterType: d.docType || r.docType || r.category || '—',
    to: d.toName || d.toOrg || '—',
    subject: d.subject || r.title || '—',
    date: d.date || r.issueDate || r.recordDate || '',
  };
};

export default function ImsLetterhead() {
  const { lang } = useLang();
  const [rows, setRows] = useState([]);
  const [pdfLang, setPdfLang] = useState('both');
  const [watermark, setWatermark] = useState(true);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState(null);
  const say = (text, tone = 'ok') => setNotice({ text, tone });
  const [preview, setPreview] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [f, setF] = useState(blankLetter);

  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  useEffect(() => {
    ims.list(REGISTER, { limit: 500 })
      .then((d) => setRows(Array.isArray(d) ? d : (d.records || d.items || d.rows || [])))
      .catch(() => setRows([]));
  }, []);

  // Auto-number the first letter of the year from the real register; the admin
  // can overwrite it. The register's own recordId stays the collision-proof
  // identity of every saved letter.
  useEffect(() => {
    setF((x) => (x.letterNo ? x : { ...x, letterNo: nextLetterNo(rows) }));
  }, [rows]);

  // A restored working template, so the same wording can be reused.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(TEMPLATE_KEY) || 'null');
      if (saved && typeof saved === 'object') setF((x) => ({ ...x, ...saved }));
    } catch { /* ignore a corrupt template */ }
  }, []);

  const letters = useMemo(() => rows.map(rowToLetter), [rows]);

  // Live A4 sheet, re-rendered as the letter is typed.
  useEffect(() => {
    let alive = true;
    const id = setTimeout(async () => {
      try {
        const html = await letterheadPreviewHtml(f, { lang: pdfLang, watermark });
        if (!alive) return;
        const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
        setSheet((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
      } catch { /* preview is best-effort */ }
    }, 350);
    return () => { alive = false; clearTimeout(id); };
  }, [f, pdfLang, watermark]);

  useEffect(() => () => { if (sheet) URL.revokeObjectURL(sheet); }, [sheet]);

  const applyTemplate = (t) => {
    setF((x) => ({
      ...x,
      letterType: t.en,
      subject: t.subject ? (lang === 'hi' ? t.subject.hi : t.subject.en) : x.subject,
      body: t.body ? (lang === 'hi' ? t.body.hi : t.body.en) : x.body,
    }));
  };

  const guard = () => {
    if (!f.subject.trim() && !f.body.trim()) { say(lang === 'hi' ? 'पहले विषय या पत्र का पाठ भरें, तभी PDF बनेगा।' : 'Fill the subject or body first — then the PDF will be created.', 'warn'); return false; }
    return true;
  };

  const run = async (key, fn) => {
    if (!guard()) return;
    setBusy(key); setNotice(null);
    try { await fn(); }
    catch (e) { say((lang === 'hi' ? 'त्रुटि: ' : 'Error: ') + e.message, 'err'); }
    finally { setBusy(''); }
  };

  const doPreview = () => run('preview', async () => {
    const { url, opened } = await previewLetterPdf(f, { lang: pdfLang, watermark });
    if (opened) say(lang === 'hi' ? 'नए टैब में खुल गया।' : 'Opened in a new tab.');
    else setPreview({ url });
  });
  const doDownload = () => run('download', () => downloadLetterPdf(f, { lang: pdfLang, watermark }));
  const doPrint = () => run('print', () => printLetterPdf(f, { lang: pdfLang, watermark }));
  const doWhatsApp = () => run('wa', async () => { await shareLetterPdf(f, { lang: pdfLang, via: 'whatsapp' }); });
  const doEmail = () => run('email', async () => { await shareLetterPdf(f, { lang: pdfLang, via: 'email' }); });
  const doShare = () => run('share', async () => {
    const r = await shareLetterPdf(f, { lang: pdfLang, via: 'native' });
    say(lang === 'hi' ? `साझा किया गया (${r.shared}).` : `Shared (${r.shared}).`);
  });
  const doCopy = () => run('copy', async () => {
    await navigator.clipboard.writeText(letterPlainText(f, pdfLang));
    say(lang === 'hi' ? 'पत्र की सामग्री कॉपी हो गई।' : 'Letter text copied.');
  });

  const doSaveTemplate = () => {
    try {
      localStorage.setItem(TEMPLATE_KEY, JSON.stringify(f));
      say(lang === 'hi' ? 'यह प्रारूप सहेज लिया गया — अगली बार स्वतः भर जाएगा।' : 'Template saved — it will be restored next time.');
    } catch { say(lang === 'hi' ? 'प्रारूप सहेजा नहीं जा सका।' : 'Could not save the template.', 'warn'); }
  };
  const doClearTemplate = () => {
    try { localStorage.removeItem(TEMPLATE_KEY); } catch { /* ignore */ }
    say(lang === 'hi' ? 'सहेजा गया प्रारूप हटा दिया गया।' : 'Saved template cleared.');
  };

  const doSave = () => run('save', async () => {
    const created = await ims.create(REGISTER, {
      title: f.subject || `${f.letterType} — ${f.toName || f.toOrg || 'Official letter'}`,
      category: CATEGORY,
      docType: f.letterType,
      issueDate: f.date,
      owner: f.signatoryName || '',
      source: 'Letterhead composer',
      approvedBy: f.signatoryDesignation || '',
      data: {
        letterNo: f.letterNo, date: f.date, docType: f.letterType,
        toName: f.toName, toDesignation: f.toDesignation, toOrg: f.toOrg, toAddress: f.toAddress,
        subject: f.subject, salutation: f.salutation, body: f.body, closing: f.closing,
        enclosures: f.enclosures, cc: f.cc,
        signatoryName: f.signatoryName, signatoryDesignation: f.signatoryDesignation,
        language: pdfLang, watermark,
      },
    });
    setRows((r) => [created, ...r]);
    setF((x) => ({
      ...blankLetter(),
      signatoryName: x.signatoryName, signatoryDesignation: x.signatoryDesignation,
      letterType: x.letterType, date: x.date,
      letterNo: nextLetterNo([created, ...rows]),
    }));
    say(lang === 'hi'
      ? `दस्तावेज़ पंजिका में सहेज दिया गया (${created.recordId}).`
      : `Saved to the Documents register (${created.recordId}).`);
  });

  const closePreview = () => { if (preview?.url) URL.revokeObjectURL(preview.url); setPreview(null); };

  return (
    <ImsLayout active="letterhead">
      <div className="mx-auto max-w-[1500px] space-y-5">
        {/* header */}
        <div className="rounded-2xl bg-[#12345A] p-6 text-white sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-[#176447]"><FileSignature size={22} /></span>
            <div className="min-w-0">
              <h1 className="text-2xl font-black leading-tight sm:text-3xl">
                {lang === 'hi' ? 'लेटरहेड — आधिकारिक पत्र' : 'Letterhead — Official Letter'}
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-white/70">
                {lang === 'hi'
                  ? 'किसी भी विषय पर — शासकीय विभाग, कंपनी, बैंक, दानदाता या सदस्य को — संस्था के लेटरहेड पर पत्र लिखें। अंग्रेज़ी, हिंदी या दोनों में; डाउनलोड, प्रिंट (ऑफ़लाइन भी) या व्हाट्सएप/ईमेल पर भेजें।'
                  : 'Write to anyone — a government department, company, bank, donor or member — on the Foundation\u2019s own letterhead. English, हिंदी or both; download, print (works offline) or share on WhatsApp / e-mail.'}
              </p>
            </div>
          </div>
        </div>

        {/* letter type templates */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <FileSignature size={16} className="text-[#176447]" />
            <span className="text-sm font-bold text-[#12345A]">{lang === 'hi' ? 'पत्र का प्रकार' : 'Letter type'}</span>
            <span className="text-[11px] text-slate-400">{lang === 'hi' ? '(चुनने पर विषय/प्रारूप भर जाता है)' : '(fills a subject + draft)'}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {LETTER_TYPES.map((t) => (
              <button key={t.en} type="button" onClick={() => applyTemplate(t)}
                className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${f.letterType === t.en ? 'border-[#12345A] bg-[#12345A] text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                {lang === 'hi' ? t.hi : t.en}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {/* composer */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={label}>{lang === 'hi' ? 'पत्र क्रमांक (संदर्भ)' : 'Letter No. (Reference)'}</label>
                <input className={cls + ' mt-1'} value={f.letterNo} onChange={(e) => set('letterNo', e.target.value)} placeholder="SSF/LTR/2026/0001" /></div>
              <div><label className={label}>{lang === 'hi' ? 'दिनांक' : 'Date'}</label>
                <input type="date" className={cls + ' mt-1'} value={f.date} onChange={(e) => set('date', e.target.value)} /></div>

              <div><label className={label}>{lang === 'hi' ? 'प्राप्तकर्ता का नाम' : 'To — Name'}</label>
                <input className={cls + ' mt-1'} value={f.toName} onChange={(e) => set('toName', e.target.value)} placeholder={lang === 'hi' ? 'श्री / श्रीमती …' : 'Mr / Ms …'} /></div>
              <div><label className={label}>{lang === 'hi' ? 'पदनाम' : 'Designation'}</label>
                <input className={cls + ' mt-1'} value={f.toDesignation} onChange={(e) => set('toDesignation', e.target.value)} placeholder={lang === 'hi' ? 'जिला कलेक्टर / निदेशक …' : 'Collector / Director …'} /></div>
              <div><label className={label}>{lang === 'hi' ? 'संस्था / विभाग' : 'Organisation / Department'}</label>
                <input className={cls + ' mt-1'} value={f.toOrg} onChange={(e) => set('toOrg', e.target.value)} placeholder={lang === 'hi' ? 'कार्यालय …' : 'Office of …'} /></div>
              <div><label className={label}>{lang === 'hi' ? 'पता' : 'Address'}</label>
                <input className={cls + ' mt-1'} value={f.toAddress} onChange={(e) => set('toAddress', e.target.value)} placeholder={lang === 'hi' ? 'रीवा, म.प्र.' : 'Rewa, MP'} /></div>

              <div className="sm:col-span-2"><label className={label}>{lang === 'hi' ? 'विषय' : 'Subject'}</label>
                <input className={cls + ' mt-1'} value={f.subject} onChange={(e) => set('subject', e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={label}>{lang === 'hi' ? 'संबोधन' : 'Salutation'}</label>
                <input className={cls + ' mt-1'} value={f.salutation} onChange={(e) => set('salutation', e.target.value)} placeholder={lang === 'hi' ? 'आदरणीय महोदय / महोदया,' : 'Respected Sir/Madam,'} /></div>
              <div className="sm:col-span-2"><label className={label}>{lang === 'hi' ? 'पत्र का मुख्य पाठ' : 'Body'}</label>
                <textarea className={cls + ' mt-1 min-h-[220px]'} value={f.body} onChange={(e) => set('body', e.target.value)}
                  placeholder={lang === 'hi' ? 'पत्र की मुख्य सामग्री… (खाली पंक्ति छोड़ने पर नया पैराग्राफ बनेगा)' : 'Main letter text… (a blank line starts a new paragraph)'} /></div>
              <div><label className={label}>{lang === 'hi' ? 'धन्यवाद वाक्य' : 'Closing'}</label>
                <input className={cls + ' mt-1'} value={f.closing} onChange={(e) => set('closing', e.target.value)} placeholder={lang === 'hi' ? 'धन्यवाद,' : 'Thank you,'} /></div>
              <div><label className={label}>{lang === 'hi' ? 'हस्ताक्षरकर्ता का नाम' : 'Signatory name'}</label>
                <input className={cls + ' mt-1'} value={f.signatoryName} onChange={(e) => set('signatoryName', e.target.value)} /></div>
              <div><label className={label}>{lang === 'hi' ? 'हस्ताक्षरकर्ता का पद' : 'Signatory designation'}</label>
                <input className={cls + ' mt-1'} value={f.signatoryDesignation} onChange={(e) => set('signatoryDesignation', e.target.value)} /></div>
              <div><label className={label}>{lang === 'hi' ? 'संलग्नक' : 'Enclosures'}</label>
                <input className={cls + ' mt-1'} value={f.enclosures} onChange={(e) => set('enclosures', e.target.value)} placeholder={lang === 'hi' ? '1. … 2. …' : '1. … 2. …'} /></div>
              <div className="sm:col-span-2"><label className={label}>{lang === 'hi' ? 'प्रतिलिपि' : 'Copy to'}</label>
                <input className={cls + ' mt-1'} value={f.cc} onChange={(e) => set('cc', e.target.value)} /></div>
            </div>

            {/* options */}
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
              <Languages size={16} className="text-[#176447]" />
              <span className="text-sm font-bold text-[#12345A]">{lang === 'hi' ? 'भाषा' : 'Language'}</span>
              <div className="flex flex-wrap gap-2">
                {LANGS.map((l) => (
                  <button key={l.id} type="button" onClick={() => setPdfLang(l.id)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${pdfLang === l.id ? 'border-[#12345A] bg-[#12345A] text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {lang === 'hi' ? l.hi : l.en}
                  </button>
                ))}
              </div>
              <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-600">
                <input type="checkbox" checked={watermark} onChange={(e) => setWatermark(e.target.checked)} className="h-4 w-4 accent-[#12345A]" />
                <Droplets size={14} className="text-[#176447]" />
                {lang === 'hi' ? 'हल्का लोगो वॉटरमार्क' : 'Faint logo watermark'}
              </label>
            </div>

            {/* actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" disabled={!!busy} onClick={doPreview} className="inline-flex items-center gap-2 rounded-xl bg-[#12345A] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">
                {busy === 'preview' ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}{lang === 'hi' ? 'पूर्वावलोकन' : 'Preview'}
              </button>
              <button type="button" disabled={!!busy} onClick={doDownload} className="inline-flex items-center gap-2 rounded-xl bg-[#176447] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">
                {busy === 'download' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}{lang === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'}
              </button>
              <button type="button" disabled={!!busy} onClick={doPrint} className="inline-flex items-center gap-2 rounded-xl border border-[#12345A] px-4 py-2.5 text-sm font-bold text-[#12345A] hover:bg-slate-50 disabled:opacity-40">
                {busy === 'print' ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}{lang === 'hi' ? 'प्रिंट' : 'Print'}
              </button>
              <button type="button" disabled={!!busy} onClick={doWhatsApp} className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">
                {busy === 'wa' ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />}WhatsApp
              </button>
              <button type="button" disabled={!!busy} onClick={doEmail} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                {busy === 'email' ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}Email
              </button>
              <button type="button" disabled={!!busy} onClick={doShare} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                {busy === 'share' ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}{lang === 'hi' ? 'साझा' : 'Share'}
              </button>
              <button type="button" disabled={!!busy} onClick={doCopy} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                {busy === 'copy' ? <Loader2 size={16} className="animate-spin" /> : <Copy size={16} />}{lang === 'hi' ? 'पाठ कॉपी' : 'Copy text'}
              </button>
              <button type="button" disabled={!!busy} onClick={doSave} className="inline-flex items-center gap-2 rounded-xl bg-[#12345A] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">
                {busy === 'save' ? <Loader2 size={16} className="animate-spin" /> : <FilePlus2 size={16} />}{lang === 'hi' ? 'पंजिका में सहेजें' : 'File in register'}
              </button>
              <button type="button" onClick={doSaveTemplate} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                <Save size={16} />{lang === 'hi' ? 'प्रारूप सहेजें' : 'Save template'}
              </button>
              <button type="button" onClick={doClearTemplate} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                <RotateCcw size={16} />{lang === 'hi' ? 'प्रारूप हटाएँ' : 'Clear template'}
              </button>
            </div>

            {notice && (
              <div className={`mt-4 flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${notice.tone === 'ok' ? 'bg-emerald-50 text-emerald-800' : notice.tone === 'warn' ? 'bg-amber-50 text-amber-900' : 'bg-red-50 text-red-800'}`} role={notice.tone === 'ok' ? 'status' : 'alert'}>
                {notice.tone === 'ok' ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />} <span>{notice.text}</span>
              </div>
            )}
          </div>

          {/* live A4 sheet */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#176447]" />
              <span className="text-sm font-bold text-[#12345A]">{lang === 'hi' ? 'A4 पूर्वावलोकन' : 'A4 preview'}</span>
              <span className="text-[11px] text-slate-400">{PAGE_W_MM} × {PAGE_H_MM} mm</span>
            </div>
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {sheet
                ? <iframe title="SSF letterhead A4 preview" src={sheet} className="h-[780px] w-full border-0" />
                : <div className="grid h-[780px] place-items-center text-slate-400"><Loader2 size={18} className="animate-spin" /></div>}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              {lang === 'hi'
                ? 'यही अभिकल्प PDF, प्रिंट और ऑफ़लाइन निर्यात में उपयोग होता है।'
                : 'The same layout is used for PDF, print and offline export.'}
            </p>
          </div>
        </div>

        {/* recent */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-lg font-black text-[#12345A]">
            <Save size={18} className="text-[#176447]" />{lang === 'hi' ? 'हाल के पत्र' : 'Recent letters'}
          </h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <tr><th className="p-3">Ref. No.</th><th className="p-3">Doc ID</th><th className="p-3">{lang === 'hi' ? 'प्रकार' : 'Type'}</th><th className="p-3">{lang === 'hi' ? 'प्रति' : 'To'}</th><th className="p-3">{lang === 'hi' ? 'विषय' : 'Subject'}</th><th className="p-3">{lang === 'hi' ? 'दिनांक' : 'Date'}</th></tr>
              </thead>
              <tbody className="divide-y">
                {letters.slice(0, 15).map((r, i) => (
                  <tr key={r.id || i}>
                    <td className="p-3 font-bold text-[#12345A]">{r.letterNo || '—'}</td>
                    <td className="p-3 font-mono text-xs text-slate-500">{r.documentId || '—'}</td>
                    <td className="p-3">{r.letterType}</td>
                    <td className="p-3">{r.to}</td>
                    <td className="p-3 max-w-[280px] truncate">{r.subject}</td>
                    <td className="p-3">{r.date || '—'}</td>
                  </tr>
                ))}
                {!letters.length && <tr><td colSpan={6} className="p-6 text-center text-slate-400">{lang === 'hi' ? 'अभी कोई पत्र नहीं।' : 'No letters yet.'}</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            {lang === 'hi'
              ? `पत्र दस्तावेज़ पंजिका (${REGISTER}) में सहेजे जाते हैं; Doc ID सर्वर द्वारा क्रमबद्ध रूप से जारी होता है, अतः एक ही संख्या दो बार नहीं बनती।`
              : `Letters are filed in the Documents register (${REGISTER}); the Doc ID is issued sequentially by the server, so two letters can never share a number.`}
          </p>
        </div>
      </div>

      {preview?.url && (
        <div className="fixed inset-0 z-[1200] flex flex-col bg-black/70 p-3 sm:p-6">
          <div className="mb-2 flex items-center justify-between text-white">
            <span className="text-sm font-bold">{lang === 'hi' ? 'पूर्वावलोकन' : 'Preview'} · {letterFileName(f, pdfLang)}</span>
            <button type="button" onClick={closePreview} className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold hover:bg-white/20">
              <X size={15} /> {lang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
          <iframe title="SSF Letterhead" src={preview.url} className="min-h-0 flex-1 w-full rounded-xl bg-white" />
        </div>
      )}
    </ImsLayout>
  );
}
