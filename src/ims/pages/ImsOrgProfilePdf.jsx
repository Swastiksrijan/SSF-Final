// SSF-IMS — shareable Organisation Profile PDF.
// Builds a professional, bilingual (English + हिंदी) profile from website + IMS
// data, previews it, downloads it, and files it into the Document Register so
// anyone in the organisation can find and share it.
import { useState } from 'react';
import {
  FileText, Download, Eye, FilePlus2, Languages, ShieldCheck, Loader2, X, CheckCircle2,
} from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { PROFILE_DOC } from '../orgProfileData';
import { previewProfilePdf, downloadProfilePdf } from '../orgProfilePdf';

const LANGS = [
  { id: 'both', en: 'Bilingual', hi: 'द्विभाषी', note: { en: 'English + हिंदी', hi: 'अंग्रेज़ी + हिंदी' } },
  { id: 'en', en: 'English only', hi: 'केवल अंग्रेज़ी', note: { en: 'English', hi: 'अंग्रेज़ी' } },
  { id: 'hi', en: 'Hindi only', hi: 'केवल हिंदी', note: { en: 'हिंदी', hi: 'हिंदी' } },
];

export default function ImsOrgProfilePdf() {
  const { lang } = useLang();
  const [pdfLang, setPdfLang] = useState('both');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [preview, setPreview] = useState(null); // { url }
  const [generatedAt] = useState(() => new Date().toISOString().slice(0, 10));

  const docTitle = lang === 'hi' ? 'संस्था परिचय पत्र' : 'Organisation Profile';

  const doPreview = async () => {
    setBusy('preview'); setNotice('');
    try {
      const { blob, url, opened } = await previewProfilePdf({ lang: pdfLang });
      if (opened) { setNotice(lang === 'hi' ? 'नए टैब में खुल गया।' : 'Opened in a new tab.'); }
      else { setPreview({ url }); }
      return blob;
    } catch (e) {
      setNotice((lang === 'hi' ? 'त्रुटि: ' : 'Error: ') + e.message);
      return null;
    } finally { setBusy(''); }
  };

  const doDownload = async () => {
    setBusy('download'); setNotice('');
    try {
      await downloadProfilePdf({ lang: pdfLang });
    } catch (e) {
      setNotice((lang === 'hi' ? 'त्रुटि: ' : 'Error: ') + e.message);
    } finally { setBusy(''); }
  };

  const doSave = async () => {
    setBusy('save'); setNotice('');
    try {
      const blob = await previewProfilePdf({ lang: pdfLang }).then((p) => p.blob);
      const dataUrl = await new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = rej;
        fr.readAsDataURL(blob);
      });
      await ims.create('documents', {
        title: `${docTitle} · ${pdfLang === 'hi' ? 'हिंदी' : pdfLang === 'en' ? 'English' : 'English + हिंदी'}`,
        category: 'Organisation Profile',
        docType: 'Organisation Profile',
        issueDate: new Date().toISOString().slice(0, 10),
        owner: 'Secretary',
        confidentiality: 'public',
        source: PROFILE_DOC.code,
        fileUrl: dataUrl,
      });
      setNotice(lang === 'hi'
        ? 'दस्तावेज़ पंजिका में सहेज दिया गया — अब यह सबको दिखेगा।'
        : 'Filed in the Document Register — now visible to everyone who can share it.');
    } catch (e) {
      setNotice((lang === 'hi' ? 'सहेजने में त्रुटि: ' : 'Save error: ') + e.message);
    } finally { setBusy(''); }
  };

  const closePreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  return (
    <ImsLayout active="org_profile_pdf">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="rounded-2xl bg-[#002344] p-6 text-white sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-[#FF9A45]"><FileText size={22} /></span>
            <div className="min-w-0">
              <h1 className="text-2xl font-black leading-tight sm:text-3xl">
                {lang === 'hi' ? 'संस्था परिचय पत्र — साझा करने योग्य PDF' : 'Organisation Profile PDF — ready to share'}
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-white/70">
                {lang === 'hi'
                  ? 'संस्था के आधिकारिक अभिलेखों से बनी एक पेशेवर, द्विभाषी संस्था परिचय — सीएसआर, कंपनी या शासकीय संस्थाओं को भेजने के लिए।'
                  : 'A professional, bilingual organisation profile built from the Foundation\u2019s official records — ready to send to a CSR partner, company or government body.'}
              </p>
              <span className="mt-3 inline-block rounded-lg bg-white/10 px-3 py-1 font-mono text-[11px] text-white/70">{PROFILE_DOC.code}</span>
              <p className="mt-2 text-[11px] text-white/60">
                {(lang === 'hi' ? 'संस्करण' : 'Version')}: <span className="font-mono">{PROFILE_DOC.code}</span>
                {' · '}
                {(lang === 'hi' ? 'निर्मित दिनांक' : 'Generated')}: <span className="font-mono">{generatedAt}</span>
              </p>
            </div>
          </div>
        </div>

        {/* language + actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Languages size={16} className="text-[#FF6600]" />
            <span className="text-sm font-bold text-[#002344]">{lang === 'hi' ? 'भाषा चुनें' : 'Document language'}</span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {LANGS.map((l) => (
              <button key={l.id} type="button" onClick={() => setPdfLang(l.id)}
                className={`rounded-xl border px-4 py-3 text-left transition ${pdfLang === l.id ? 'border-[#002344] bg-[#002344] text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                <div className="text-sm font-bold">{lang === 'hi' ? l.hi : l.en}</div>
                <div className={`mt-0.5 text-[11px] ${pdfLang === l.id ? 'text-white/70' : 'text-slate-400'}`}>{lang === 'hi' ? l.note.hi : l.note.en}</div>
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" disabled={!!busy} onClick={doPreview}
              className="inline-flex items-center gap-2 rounded-xl bg-[#002344] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">
              {busy === 'preview' ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
              {lang === 'hi' ? 'पूर्वावलोकन' : 'Preview'}
            </button>
            <button type="button" disabled={!!busy} onClick={doDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF6600] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">
              {busy === 'download' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {lang === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'}
            </button>
            <button type="button" disabled={!!busy} onClick={doSave}
              className="inline-flex items-center gap-2 rounded-xl border border-[#002344] px-5 py-3 text-sm font-bold text-[#002344] disabled:opacity-40 hover:bg-slate-50">
              {busy === 'save' ? <Loader2 size={16} className="animate-spin" /> : <FilePlus2 size={16} />}
              {lang === 'hi' ? 'दस्तावेज़ पंजिका में सहेजें' : 'File in Document Register'}
            </button>
          </div>

          {notice && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> <span>{notice}</span>
            </div>
          )}
        </div>

        {/* contents listing */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-lg font-black text-[#002344]">
            <ShieldCheck size={18} className="text-[#FF6600]" />
            {lang === 'hi' ? 'PDF में क्या-क्या शामिल है' : 'What the PDF includes'}
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PROFILE_DOC.sections.map((s) => (
              <div key={s.id} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#FF6600]" />
                <span className="text-[13px] font-semibold text-slate-700">{lang === 'hi' ? s.hi : s.en}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            {lang === 'hi'
              ? 'PDF में हिंदी सही (शुद्ध) रूप में छपती है — तकनीकी रूप से ब्राउज़र की पेंटिंग का उपयोग किया गया है।'
              : 'Hindi is rendered correctly in the PDF (the browser paints it, so Devanagari shaping is perfect).'}
          </p>
        </div>
      </div>

      {/* preview modal */}
      {preview?.url && (
        <div className="fixed inset-0 z-[1200] flex flex-col bg-black/70 p-3 sm:p-6">
          <div className="mb-2 flex items-center justify-between text-white">
            <span className="text-sm font-bold">{lang === 'hi' ? 'पूर्वावलोकन' : 'Preview'} · {PROFILE_DOC.code}</span>
            <button type="button" onClick={closePreview} className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold hover:bg-white/20">
              <X size={15} /> {lang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
          <iframe title="SSF Organisation Profile" src={preview.url} className="min-h-0 flex-1 w-full rounded-xl bg-white" />
        </div>
      )}
    </ImsLayout>
  );
}
