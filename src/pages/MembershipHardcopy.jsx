import React from "react";

const MembershipHardcopy = () => {
  const printForm = () => window.print();
  return (
    <main className="min-h-screen bg-slate-100 px-3 py-8 text-[#172B45] sm:px-6">
      <div className="mx-auto mb-5 flex max-w-[820px] flex-wrap items-center justify-between gap-3 print:hidden">
        <a href="/Members" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold">← सदस्यता पेज</a>
        <button onClick={printForm} className="rounded-xl bg-[#12345A] px-5 py-3 font-bold text-white shadow">PDF डाउनलोड / प्रिंट करें</button>
      </div>
      <article className="membership-print mx-auto max-w-[820px] bg-white p-6 shadow-xl sm:p-10">
        <header className="border-b-2 border-[#176447] pb-4 text-center">
          <img src="/brand/logo/ssf-logo-wordmark.png" alt="Swastik Srijan Foundation logo" className="mx-auto mb-2 h-auto max-h-[78px] max-w-[270px] object-contain" />
          <h1 className="text-xl font-extrabold text-[#12345A] sm:text-2xl">सदस्यता हेतु आवेदन पत्र</h1>
          <p className="mt-1 text-sm font-bold">MEMBERSHIP APPLICATION FORM</p>
          <p className="mt-1 text-xs">Swastik Srijan Foundation Samiti · नियमावली के नियम 5–9 के अनुसार</p>
        </header>
        <div className="mt-4 flex flex-wrap justify-between gap-2 text-xs">
          <span>आवेदन क्रमांक: __________________</span><span>दिनांक: ____ / ____ / ______</span>
        </div>
        <section className="mt-5">
          <h2 className="mb-2 bg-[#EAF0F6] px-3 py-2 text-sm font-bold text-[#12345A]">1. सदस्यता श्रेणी चुनें (Select membership category)</h2>
          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
            <div className="border border-slate-300 p-3">☐ संरक्षक सदस्य (Patron)<br/><b>₹10,000 या अधिक</b><br/>एकमुश्त / एक वर्ष में अधिकतम 12 किस्तें</div>
            <div className="border border-slate-300 p-3">☐ आजीवन सदस्य (Life)<br/><b>₹8,000 या अधिक</b><br/>नियमावली के अनुसार</div>
            <div className="border border-slate-300 p-3">☐ साधारण सदस्य (Ordinary)<br/><b>₹100 मासिक / ₹1,200 वार्षिक</b></div>
          </div>
        </section>
        <section className="mt-5">
          <h2 className="mb-2 bg-[#EAF0F6] px-3 py-2 text-sm font-bold text-[#12345A]">2. आवेदक का विवरण (Applicant details)</h2>
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            {["पूरा नाम / Full name", "ईमेल / Email", "मोबाइल नंबर / Mobile number", "जन्मतिथि / Date of birth", "पिता / अभिभावक का नाम", "व्यवसाय / Occupation"].map((label) => <div key={label} className="form-field"><span>{label}</span><div className="write-line"/></div>)}
            <div className="form-field sm:col-span-2"><span>पूरा पता / Full postal address</span><div className="write-line"/><div className="write-line"/></div>
            <div className="form-field"><span>नागरिकता / Citizenship</span><div className="write-line">भारतीय / Indian</div></div>
            <div className="form-field"><span>सदस्यता भुगतान अवधि (साधारण सदस्य)</span><div className="write-line">☐ मासिक ₹100　 ☐ वार्षिक ₹1,200</div></div>
            <div className="form-field sm:col-span-2"><span>संरक्षक सदस्य किस्त विकल्प (यदि लागू हो)</span><div className="write-line">☐ एकमुश्त　 ☐ 2　 ☐ 3　 ☐ 4　 ☐ 6　 ☐ 12 किस्तें (एक वर्ष के भीतर)</div></div>
          </div>
        </section>
        <section className="mt-5">
          <h2 className="mb-2 bg-[#EAF0F6] px-3 py-2 text-sm font-bold text-[#12345A]">3. पात्रता एवं घोषणा (Rule 7 declarations)</h2>
          <div className="space-y-2 text-sm leading-6">
            <p>☐ मैं 18 वर्ष या उससे अधिक आयु का/की भारतीय नागरिक हूँ।</p>
            <p>☐ मेरा चरित्र अच्छा है और मैं संस्था की नियमावली का पालन करूँगा/करूँगी।</p>
            <p>☐ मैं नियमावली में वर्णित मद्यपान संबंधी पात्रता शर्त स्वीकार करता/करती हूँ।</p>
            <p>☐ मैं संस्था के उद्देश्यों एवं नियमों के प्रति सहमति व्यक्त करता/करती हूँ।</p>
            <p>☐ मेरे द्वारा दी गई सभी जानकारी सत्य एवं सही है।</p>
          </div>
          <p className="mt-3 text-sm">आवेदक के हस्ताक्षर / Applicant signature: ____________________________________</p>
          <p className="mt-3 text-sm">स्थान / Place: __________________________　 दिनांक / Date: __________________</p>
        </section>
        <section className="mt-5 border-2 border-slate-300 p-4">
          <h2 className="mb-2 text-sm font-bold text-[#12345A]">4. केवल संस्था के कार्यालय हेतु (For office use only)</h2>
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <p>आवेदन प्राप्ति / Received on: __________________</p><p>रजिस्टर क्रमांक / Register No.: __________________</p>
            <p>समिति निर्णय: ☐ स्वीकृत　☐ अस्वीकृत　☐ लंबित</p><p>प्रवेश दिनांक / Admission date: __________________</p>
            <p>अंशदान रसीद क्रमांक / Receipt No.: __________________</p><p>अधिकृत हस्ताक्षर / Authorized signature: __________________</p>
          </div>
        </section>
        <footer className="mt-4 border-t border-slate-300 pt-3 text-[11px] leading-5 text-slate-600">
          आवेदन जमा करने मात्र से सदस्यता स्वीकृत नहीं होती। सदस्यता संस्था की नियमावली और अधिकृत समिति के निर्णय के अनुसार प्रभावी होगी। समिति की अनुमति से पहले कोई अंशदान न करें। मूल हस्ताक्षरित प्रति संस्था के रिकॉर्ड हेतु सुरक्षित रखें।
        </footer>
      </article>
      <div className="mx-auto mt-4 max-w-[820px] rounded-xl bg-amber-50 p-4 text-sm text-amber-900 print:hidden">
        <b>PDF कैसे सेव करें:</b> ऊपर “PDF डाउनलोड / प्रिंट करें” दबाएँ। प्रिंट विंडो में Destination / Printer के स्थान पर “Save as PDF” चुनकर सेव करें। फिर PDF प्रिंट करके हाथ से भर सकते हैं।
        <p className="mt-2">हस्ताक्षरित फॉर्म की वेबसाइट पर सुरक्षित अपलोड सुविधा अभी मौजूदा सदस्यता प्रणाली में उपलब्ध नहीं है; इसलिए इस पेज पर फाइल चुनने का ऐसा विकल्प नहीं जोड़ा गया है जो वास्तव में फाइल जमा न करे।</p>
      </div>
      <style>{`
        .form-field { font-size: 12px; font-weight: 600; }
        .write-line { min-height: 27px; border-bottom: 1px solid #94a3b8; margin-top: 3px; font-weight: 400; }
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: white !important; }
          main { padding: 0 !important; background: white !important; }
          .membership-print { max-width: none !important; padding: 0 !important; box-shadow: none !important; }
          .form-field { break-inside: avoid; }
          section { break-inside: avoid; }
        }
      `}</style>
    </main>
  );
};
export default MembershipHardcopy;
