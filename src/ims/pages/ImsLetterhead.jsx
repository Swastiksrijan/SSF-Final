// SSF-IMS — Letterhead / लेटरहेड composer.
//
// One screen to write any official letter — to a government department, a
// company, a bank, a donor or a member — and send it out on the Foundation's
// own letterhead. English, हिंदी or both; preview, download, print (works
// offline) or share on WhatsApp / e-mail.
import { useEffect, useState } from 'react';
import {
  FileSignature, Eye, Download, Printer, Share2, Mail, MessageCircle, Copy,
  FilePlus2, Loader2, X, CheckCircle2, AlertTriangle, Languages, Droplets, Save,
} from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { PAGE_TITLE_ON_DARK } from '../ui';
import { LETTER_TYPES } from '../letterheadData';
import {
  downloadLetterPdf, previewLetterPdf, printLetterPdf, shareLetterPdf,
  letterPlainText, nextLetterNo, letterFileName,
} from '../letterheadPdf';

const LANGS = [
  { id: 'both', en: 'Bilingual', hi: 'द्विभाषी', note: { en: 'English + हिंदी', hi: 'अंग्रेज़ी + हिंदी' } },
  { id: 'en', en: 'English only', hi: 'केवल अंग्रेज़ी', note: { en: 'English', hi: 'अंग्रेज़ी' } },
  { id: 'hi', en: 'Hindi only', hi: 'केवल हिंदी', note: { en: 'हिंदी', hi: 'हिंदी' } },
];

const cls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#12345A] focus:ring-2 focus:ring-[#12345A]/10';
const label = 'text-[11px] font-bold uppercase tracking-wide text-slate-500';

export default function ImsLetterhead() {
  const { lang } = useLang();
  const today = new Date().toISOString().slice(0, 10);
  const [rows, setRows] = useState([]);
  const [pdfLang, setPdfLang] = useState('both');
  const [watermark, setWatermark] = useState(true);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState(null);
  const say = (text, tone = 'ok') => setNotice({ text, tone });
  const [preview, setPreview] = useState(null);
  const [f, setF] = useState({
    letterNo: '', date: today, letterType: LETTER_TYPES[0].en,
    toName: '', toDesignation: '', toOrg: '', toAddress: '',
    subject: '', salutation: '', body: '', closing: '', enclosures: '', cc: '',
    signatoryName: 'Ramesh Pandey', signatoryDesignation: 'Authorised Signatory',
  });

  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  useEffect(() => {
    ims.list('officialDocuments', { limit: 500 })
      .then((d) => setRows(Array.isArray(d) ? d : (d.items || d.rows || [])))
      .catch(() => setRows([]));
  }, []);

  // Auto-number the first letter of the year; the admin can overwrite it.
  useEffect(() => {
    if (!f.letterNo && rows.length >= 0) setF((x) => (x.letterNo ? x : { ...x, letterNo: nextLetterNo(rows) }));
  }, [rows]); // eslint-disable-line react-hooks/exhaustive-deps

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
    say(lang === 'hi'
      ? `साझा किया गया (${r.shared}).`
      : `Shared (${r.shared}).`);
  });
  const doCopy = () => run('copy', async () => {
    await navigator.clipboard.writeText(letterPlainText(f, pdfLang));
    say(lang === 'hi' ? 'पत्र की सामग्री कॉपी हो गई।' : 'Letter text copied.');
  });

  const doSave = () => run('save', async () => {
    await ims.create('officialDocuments', {
      docType: f.letterType,
      name: f.toName || f.toOrg || '—',
      designation: f.toDesignation || '',
      date: f.date,
      reference: f.letterNo,
      subject: f.subject,
      body: f.body,
      remarks: [f.enclosures && `Enclosures: ${f.enclosures}`, f.cc && `Copy to: ${f.cc}`].filter(Boolean).join(' · '),
      signatory: `${f.signatoryName}\n${f.signatoryDesignation}`,
      language: pdfLang,
      letterNo: f.letterNo,
    });
    setRows((r) => [{ data: { letterNo: f.letterNo, subject: f.subject, name: f.toName }, recordDate: f.date, recordType: f.letterType, id: 'tmp' }, ...r]);
    setF((x) => ({ ...x, letterNo: nextLetterNo([...rows, { data: { letterNo: f.letterNo } }]), subject: '', body: '', toName: '', toOrg: '', toAddress: '', toDesignation: '' }));
    say(lang === 'hi'
      ? 'वैधानिक दस्तावेज़ पंजिका में सहेज दिया गया।'
      : 'Saved to the Official Documents register.');
  });

  const closePreview = () => { if (preview?.url) URL.revokeObjectURL(preview.url); setPreview(null); };

  return (
    <ImsLayout active="letterhead">
      <div className="mx-auto max-w-5xl space-y-5">
        {/* header */}
        <div className="rounded-2xl bg-[#12345A] p-6 text-white sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-[#176447]"><FileSignature size={22} /></span>
            <div className="min-w-0">
              <h1 className={`${PAGE_TITLE_ON_DARK} leading-tight`}>
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
          </div>

          {notice && (
            <div className={`mt-4 flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${notice.tone === 'ok' ? 'bg-emerald-50 text-emerald-800' : notice.tone === 'warn' ? 'bg-amber-50 text-amber-900' : 'bg-red-50 text-red-800'}`} role={notice.tone === 'ok' ? 'status' : 'alert'}>
              {notice.tone === 'ok' ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />} <span>{notice.text}</span>
            </div>
          )}
        </div>

        {/* recent */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-lg font-black text-[#12345A]">
            <Save size={18} className="text-[#176447]" />{lang === 'hi' ? 'हाल के पत्र' : 'Recent letters'}
          </h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <tr><th className="p-3">Ref. No.</th><th className="p-3">{lang === 'hi' ? 'प्रकार' : 'Type'}</th><th className="p-3">{lang === 'hi' ? 'प्रति' : 'To'}</th><th className="p-3">{lang === 'hi' ? 'विषय' : 'Subject'}</th><th className="p-3">{lang === 'hi' ? 'दिनांक' : 'Date'}</th></tr>
              </thead>
              <tbody className="divide-y">
                {rows.slice(0, 15).map((r, i) => (
                  <tr key={r.id || i}>
                    <td className="p-3 font-bold text-[#12345A]">{r.data?.letterNo || r.data?.documentNo || r.recordId || '—'}</td>
                    <td className="p-3">{r.recordType || r.data?.docType || '—'}</td>
                    <td className="p-3">{r.data?.name || '—'}</td>
                    <td className="p-3 max-w-[280px] truncate">{r.data?.subject || '—'}</td>
                    <td className="p-3">{r.recordDate || r.data?.date || '—'}</td>
                  </tr>
                ))}
                {!rows.length && <tr><td colSpan={5} className="p-6 text-center text-slate-400">{lang === 'hi' ? 'अभी कोई पत्र नहीं।' : 'No letters yet.'}</td></tr>}
              </tbody>
            </table>
          </div>
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
