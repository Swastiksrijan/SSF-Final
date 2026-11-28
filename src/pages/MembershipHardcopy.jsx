import React from "react";

/* The PDF is a pre-built static file: generating it in the browser with
   html2canvas/jsPDF failed on many phones and in-app browsers. Regenerate it
   from this page's print view whenever the form changes:
   chromium --headless --no-pdf-header-footer --print-to-pdf=public/forms/SSF-Membership-Application-Form.pdf http://localhost:12000/MembershipHardcopy */
const PDF_PATH = "/forms/SSF-Membership-Application-Form.pdf";

const MembershipHardcopy = () => {
  const printForm = () => window.print();

  return (
    <main className="ssf-hero-offset min-h-screen bg-slate-100 px-3 py-8 text-[#172B45] sm:px-6">
      <div className="mx-auto mb-5 flex max-w-[820px] flex-wrap items-center justify-between gap-3 print:hidden">
        <a href="/Members" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold">← सदस्यता पेज</a>
        <a href={PDF_PATH} download="SSF-Membership-Application-Form.pdf" className="rounded-xl bg-[#176447] px-5 py-3 text-center font-bold text-white shadow">PDF डाउनलोड करें / Download PDF</a>
        <button onClick={printForm} className="rounded-xl bg-[#12345A] px-5 py-3 font-bold text-white shadow">प्रिंट / Print Form</button>
      </div>
      <article className="membership-print mx-auto max-w-[820px] bg-white p-6 shadow-xl sm:p-10">
        <header className="border-b-2 border-[#176447] pb-4 text-center">
          <img src="/brand/logo/ssf-logo-wordmark.png" alt="Swastik Srijan Foundation logo" className="mx-auto mb-2 h-auto max-h-[78px] max-w-[270px] object-contain" />
          <h1 className="text-xl font-extrabold text-[#12345A] sm:text-2xl">सदस्यता हेतु आवेदन पत्र</h1>
          <p className="mt-1 text-sm font-bold">MEMBERSHIP APPLICATION FORM</p>
          <p className="mt-1 text-xs">Swastik Srijan Foundation Samiti · नियमावली के नियम 5–9 के अनुसार</p>
        </header>
        <section className="mt-4 rounded-lg border border-slate-300 bg-slate-50 p-3 text-xs leading-5">
          <p className="font-bold text-[#12345A]">पंजीकृत कार्यालय / REGISTERED OFFICE</p>
          <p>वार्ड नं. 1, ग्राम – दादर, पोस्ट – रहट, हुजूर, जिला रीवा, मध्य प्रदेश – 486446, भारत</p>
          <p>Ward No. 1, Village – Dadar, Post – Rahat, Huzur, District Rewa, Madhya Pradesh – 486446, India</p>
          <p>वेबसाइट / Website: swastiksrijan.in | ईमेल / Email: info@swastiksrijan.org | फोन / Phone: +91 97183 46691</p>
        </section>
        <div className="mt-4 flex flex-wrap justify-between gap-2 text-xs">
          <span>आवेदन क्रमांक: __________________</span><span>दिनांक: ____ / ____ / ______</span>
        </div>
        <section className="mt-5">
          <h2 className="mb-2 bg-[#EAF0F6] px-3 py-2 text-sm font-bold text-[#12345A]">1. सदस्यता श्रेणी चुनें / Select membership category</h2>
          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
            <div className="border border-slate-300 p-3">☐ संरक्षक सदस्य (Patron)<br/><b>₹10,000 या अधिक</b><br/>एकमुश्त या एक वर्ष के भीतर अधिकतम 12 किस्तों में / One-time or up to 12 instalments within one year</div>
            <div className="border border-slate-300 p-3">☐ आजीवन सदस्य (Life)<br/><b>₹8,000 या अधिक</b><br/>नियमावली के अनुसार अंशदान / Contribution as per the bylaws</div>
            <div className="border border-slate-300 p-3">☐ साधारण सदस्य (Ordinary)<br/><b>₹100 मासिक / ₹1,200 वार्षिक</b></div>
          </div>
        </section>
        <section className="mt-5">
          <h2 className="mb-2 bg-[#EAF0F6] px-3 py-2 text-sm font-bold text-[#12345A]">2. आवेदक का विवरण / Applicant details</h2>
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            {["पूरा नाम / Full name", "ईमेल / Email", "मोबाइल नंबर / Mobile number", "जन्मतिथि / Date of birth", "पिता / अभिभावक का नाम / Father or guardian’s name", "व्यवसाय / Occupation"].map((label) => <div key={label} className="form-field"><span>{label}</span><div className="write-line"/></div>)}
            <div className="form-field sm:col-span-2"><span>पूरा पता / Full postal address</span><div className="write-line"/><div className="write-line"/></div>
            <div className="form-field"><span>नागरिकता / Citizenship</span><div className="write-line">भारतीय / Indian</div></div>
            <div className="form-field"><span>साधारण सदस्यता भुगतान अवधि / Ordinary membership payment period</span><div className="write-line">☐ मासिक ₹100　 ☐ वार्षिक ₹1,200</div></div>
            <div className="form-field sm:col-span-2"><span>संरक्षक सदस्य अंशदान भुगतान विकल्प / Patron member contribution payment option</span><div className="write-line">☐ एकमुश्त　 ☐ 2　 ☐ 3　 ☐ 4　 ☐ 6　 ☐ 12 किस्तें (एक वर्ष के भीतर)</div></div>
          </div>
        </section>
        <section className="mt-4">
          <h2 className="mb-2 bg-[#EAF0F6] px-3 py-2 text-sm font-bold text-[#12345A]">फोटो / APPLICANT PHOTOGRAPH</h2>
          <div className="member-photo-row">
            <div className="member-photo-frame"><span>यहाँ हाल की रंगीन पासपोर्ट आकार की फोटो चिपकाएँ<br/>PASTE RECENT PASSPORT-SIZE PHOTO HERE</span></div>
            <p className="text-xs leading-5 text-slate-600">आवेदक की हाल की रंगीन पासपोर्ट आकार की फोटो (लगभग 3.5 × 4.5 सेमी) लगाएँ। / Attach one recent colour passport-size photograph (approx. 3.5 × 4.5 cm).</p>
          </div>
        </section>
        <section className="mt-5">
          <h2 className="mb-2 bg-[#EAF0F6] px-3 py-2 text-sm font-bold text-[#12345A]">3. नियम 7 के अनुसार पात्रता एवं घोषणा / Eligibility and declaration under Rule 7</h2>
          <div className="space-y-2 text-sm leading-6">
            <p>☐ मैं भारतीय नागरिक हूँ और मेरी आयु कम-से-कम 18 वर्ष है। / I am an Indian citizen aged 18 or above.</p>
            <p>☐ मैं घोषित करता/करती हूँ कि मेरा चरित्र अच्छा है और मैं संस्था की नियमावली का पालन करूँगा/करूँगी। / I declare that I am of good character and will follow the Foundation’s bylaws.</p>
            <p>☐ मैं नियमावली में दी गई मद्यपान संबंधी शर्त स्वीकार करता/करती हूँ। / I accept the alcohol-related condition stated in the bylaws.</p>
            <p>☐ मैं संस्था के उद्देश्यों एवं नियमों से सहमत हूँ। / I agree with the Foundation’s objectives and rules.</p>
            <p>☐ मेरे द्वारा दी गई जानकारी सत्य है। / I declare that the information provided is true.</p>
          </div>
          <p className="mt-3 text-sm">इलेक्ट्रॉनिक हस्ताक्षर नहीं—आवेदक के हस्ताक्षर / Applicant’s handwritten signature: ____________________________________</p>
          <p className="mt-3 text-sm">स्थान / Place: __________________________　 दिनांक / Date: __________________</p>
        </section>
        <section className="mt-5 border-2 border-slate-300 p-4">
          <h2 className="mb-2 text-sm font-bold text-[#12345A]">4. केवल संस्था के कार्यालय हेतु / For office use only</h2>
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <p>आवेदन प्राप्ति / Received on: __________________</p><p>रजिस्टर क्रमांक / Register No.: __________________</p>
            <p>समिति निर्णय / Committee decision: ☐ स्वीकृत / Approved　☐ अस्वीकृत / Rejected　☐ लंबित / Pending</p><p>प्रवेश दिनांक / Admission date: __________________</p>
            <p>अंशदान रसीद क्रमांक / Receipt No.: __________________</p><p>अधिकृत हस्ताक्षर / Authorized signature: __________________</p>
          </div>
        </section>
        <footer className="mt-4 border-t border-slate-300 pt-3 text-[11px] leading-5 text-slate-600">
          आवेदन जमा करने मात्र से सदस्यता स्वीकृत नहीं होती। सदस्यता संस्था की नियमावली और अधिकृत समिति के निर्णय के अनुसार प्रभावी होगी। समिति की अनुमति से पहले कोई अंशदान न करें। मूल हस्ताक्षरित प्रति संस्था के रिकॉर्ड हेतु सुरक्षित रखें।
        </footer>
      </article>
      <div className="mx-auto mt-4 max-w-[820px] rounded-xl bg-amber-50 p-4 text-sm text-amber-900 print:hidden">
        <b>PDF डाउनलोड / Download PDF:</b> ऊपर “PDF डाउनलोड करें / Download PDF” दबाएँ—फाइल तुरंत डाउनलोड हो जाएगी (फोन पर Downloads/Files में देखें)। उसे खोलकर A4 पेपर पर प्रिंट करें। वैकल्पिक रूप से “प्रिंट / Print Form” दबाकर प्रिंटर या “Save as PDF” चुनें।
        <p className="mt-2">हस्ताक्षरित फॉर्म की वेबसाइट पर सुरक्षित अपलोड सुविधा अभी उपलब्ध नहीं है। इसलिए फॉर्म डाउनलोड करके प्रिंट करें, हाथ से भरें और हस्ताक्षरित प्रति संस्था के रिकॉर्ड हेतु जमा करें।</p>
      </div>
      <style>{`
        .form-field { font-size: 12px; font-weight: 600; }
        .write-line { min-height: 27px; border-bottom: 1px solid #94a3b8; margin-top: 3px; font-weight: 400; }
        .member-photo-row { display:flex; align-items:center; gap:16px; min-height:49mm; }
        .member-photo-frame { width:35mm; height:45mm; flex:0 0 35mm; border:1px solid #64748b; display:flex; align-items:center; justify-content:center; padding:4px; text-align:center; color:#64748b; font-size:9px; font-weight:700; }
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: white !important; }
          .ssf-root-shell > *:not(main) { display: none !important; }
          main, main.ssf-hero-offset { padding: 0 !important; background: white !important; }
          .membership-print { max-width: none !important; padding: 0 !important; box-shadow: none !important; }
          .form-field { break-inside: avoid; }
          section { break-inside: avoid; }
          .member-photo-row { break-inside: avoid; }
        }
      `}</style>
    </main>
  );
};
export default MembershipHardcopy;
