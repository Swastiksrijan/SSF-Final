import React from "react";

export default function VolunteerHardcopy() {
  const printForm = () => window.print();
  const line = (label, wide = false) => (
    <div className={wide ? "field wide" : "field"}>
      <span>{label}</span><div className="write-line" />
    </div>
  );

  return (
    <main className="volunteer-hardcopy min-h-screen bg-slate-100 px-3 py-8 text-[#172B45] sm:px-6">
      <div className="no-print mx-auto mb-5 flex max-w-[850px] flex-wrap items-center justify-between gap-3">
        <a href="/Volunteer" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold">← Volunteer Page</a>
        <button onClick={printForm} className="rounded-xl bg-[#176447] px-5 py-3 font-bold text-white shadow">प्रिंट करें / Print or Save as PDF</button>
      </div>

      <article className="volunteer-paper mx-auto max-w-[850px] bg-white p-6 shadow-xl sm:p-10">
        <header className="border-b-2 border-[#176447] pb-4 text-center">
          <img src="/brand/logo/ssf-logo-wordmark.png" alt="Swastik Srijan Foundation logo" className="mx-auto mb-2 h-auto max-h-[78px] max-w-[270px] object-contain" />
          <h1 className="text-xl font-extrabold text-[#12345A] sm:text-2xl">स्वयंसेवक पंजीकरण आवेदन पत्र</h1>
          <p className="mt-1 text-sm font-bold">VOLUNTEER REGISTRATION APPLICATION FORM</p>
          <p className="mt-1 text-xs">Swastik Srijan Foundation Samiti · सेवा • समर्पण • सामाजिक विकास</p>
        </header>

        <section className="mt-4 rounded-lg border border-slate-300 bg-slate-50 p-3 text-xs leading-5">
          <p className="font-bold text-[#12345A]">पंजीकृत कार्यालय / REGISTERED OFFICE</p>
          <p>वार्ड नं. 1, ग्राम – दादर, पोस्ट – रहट, हुजूर, जिला रीवा, मध्य प्रदेश – 486446, भारत</p>
          <p>Ward No. 1, Village – Dadar, Post – Rahat, Huzur, District Rewa, Madhya Pradesh – 486446, India</p>
          <p>वेबसाइट / Website: swastiksrijan.in | ईमेल / Email: info@swastiksrijan.in | फोन / Phone: +91 97183 46691</p>
        </section>

        <div className="mt-4 flex flex-wrap justify-between gap-2 text-xs">
          <span>आवेदन क्रमांक / Application No.: __________________</span>
          <span>दिनांक / Date: ____ / ____ / ______</span>
        </div>

        <section className="mt-5">
          <h2 className="section-heading">1. आवेदक का व्यक्तिगत विवरण / APPLICANT DETAILS</h2>
          <div className="form-grid">
            {line("पूरा नाम / Full Name")}
            {line("ईमेल / Email Address")}
            {line("मोबाइल नंबर / Mobile Number")}
            {line("जन्मतिथि / Date of Birth")}
            {line("पिता / माता / अभिभावक का नाम / Parent or Guardian Name")}
            {line("व्यवसाय / Occupation")}
            {line("शैक्षणिक योग्यता / Educational Qualification")}
            {line("लिंग (वैकल्पिक) / Gender (Optional)")}
            {line("पूरा वर्तमान पता / Full Current Address", true)}
            {line("शहर / City")}
            {line("जिला एवं राज्य / District & State")}
            {line("पिन कोड / PIN Code")}
          </div>
        </section>

        <section className="mt-5">
          <h2 className="section-heading">2. स्वयंसेवा का प्रकार एवं पसंदीदा भूमिका / VOLUNTEER TYPE & PREFERRED ROLE</h2>
          <p className="mb-2 text-xs text-slate-600">उपयुक्त विकल्प पर निशान लगाएँ / Tick the applicable option(s).</p>
          <div className="option-grid">
            <p>☐ फील्ड स्वयंसेवक / Field Volunteer</p>
            <p>☐ कार्यक्रम स्वयंसेवक / Program Volunteer</p>
            <p>☐ प्रोफेशनल स्वयंसेवक / Professional Volunteer</p>
            <p>☐ डिजिटल / ऑनलाइन स्वयंसेवक / Digital / Online Volunteer</p>
          </div>
          <p className="mb-2 mt-4 text-xs font-bold">पसंदीदा कार्यक्षेत्र / Preferred Area of Contribution</p>
          <div className="option-grid">
            <p>☐ शिक्षा एवं मेंटरिंग / Education & Mentoring</p>
            <p>☐ स्वास्थ्य एवं कल्याण / Health & Well-being</p>
            <p>☐ कौशल एवं आजीविका / Skills & Livelihoods</p>
            <p>☐ पर्यावरण एवं ग्रामीण विकास / Environment & Rural Development</p>
            <p>☐ डिजिटल एवं रचनात्मक सहयोग / Digital & Creative Support</p>
            <p>☐ साझेदारी एवं संसाधन सहयोग / Partnerships & Resource Support</p>
            <p>☐ सामान्य सामुदायिक सहयोग / General Community Support</p>
          </div>
          {line("अन्य पसंदीदा भूमिका / Other Preferred Role", true)}
        </section>

        <section className="mt-5">
          <h2 className="section-heading">3. पहचान विवरण / IDENTITY DETAILS</h2>
          <div className="form-grid">
            {line("पहचान पत्र का प्रकार (वैकल्पिक) / Identity Proof Type (Optional)")}
            {line("पहचान पत्र संख्या (वैकल्पिक) / Identity Number (Optional)")}
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-600">आधार / पैन / वोटर आईडी आदि की जानकारी देना वैकल्पिक है। कृपया मूल दस्तावेज जमा न करें। / Providing Aadhaar, PAN, Voter ID or other ID details is optional. Do not submit original documents.</p>
        </section>

        <section className="mt-5">
          <h2 className="section-heading">4. फोटो एवं दस्तावेज / PHOTO & DOCUMENTS</h2>
          <div className="upload-grid">
            <div className="upload-box"><b>प्रोफाइल फोटो / PROFILE PHOTO</b><p>यहाँ हाल की पासपोर्ट आकार की फोटो चिपकाएँ।</p><p>Paste a recent passport-size photograph here.</p></div>
            <div className="upload-box"><b>पहचान पत्र की प्रति (वैकल्पिक) / ID PROOF COPY (OPTIONAL)</b><p>आवश्यक होने पर पहचान पत्र की स्वैच्छिक प्रति संलग्न करें।</p><p>Attach a voluntary copy of ID proof only if required.</p></div>
          </div>
        </section>

        <section className="mt-5">
          <h2 className="section-heading">5. स्वयंसेवा हेतु प्रेरणा एवं योगदान / MOTIVATION & CONTRIBUTION</h2>
          <p className="mb-1 text-xs">आप स्वस्तिक सृजन फाउंडेशन के साथ स्वयंसेवा क्यों करना चाहते हैं और किस प्रकार योगदान दे सकते हैं? / Why would you like to volunteer with Swastik Srijan Foundation, and how would you like to contribute?</p>
          <div className="write-area"><div/><div/><div/><div/></div>
          <div className="form-grid mt-4">
            {line("उपलब्धता / Availability (दिन / समय)")}
            {line("स्वयंसेवा का पसंदीदा स्थान / Preferred Location")}
          </div>
        </section>

        <section className="mt-5">
          <h2 className="section-heading">6. घोषणा एवं सहमति / DECLARATION & CONSENT</h2>
          <div className="declarations">
            <p>☐ मेरे द्वारा दी गई सभी जानकारी मेरी जानकारी के अनुसार सही है। / The information provided by me is true to the best of my knowledge.</p>
            <p>☐ मैं संस्था के उद्देश्यों, नियमों, आचार-संहिता तथा निर्देशों का पालन करूँगा/करूँगी। / I agree to follow the Foundation’s objectives, rules, code of conduct and instructions.</p>
            <p>☐ मैं समझता/समझती हूँ कि आवेदन जमा करने से स्वयंसेवक नियुक्ति या किसी भुगतान/मानदेय की गारंटी नहीं मिलती। / I understand that submitting this application does not guarantee appointment or any payment/honorarium.</p>
            <p>☐ मेरी फोटो का उपयोग स्वयंसेवक पहचान-पत्र एवं संस्था के आंतरिक रिकॉर्ड हेतु किया जा सकता है। / I consent to use of my photograph for a volunteer identity card and internal records.</p>
          </div>
          <p className="mt-4 text-sm">आवेदक के हस्ताक्षर / Applicant’s Signature: ______________________________________________</p>
          <p className="mt-3 text-sm">स्थान / Place: ______________________________　 दिनांक / Date: ________________________</p>
        </section>

        <section className="mt-5 border-2 border-slate-300 p-4">
          <h2 className="mb-3 text-sm font-bold text-[#12345A]">7. केवल संस्था के कार्यालय हेतु / FOR OFFICE USE ONLY</h2>
          <div className="form-grid">
            {line("प्राप्ति दिनांक / Received Date")}
            {line("स्वयंसेवक आईडी / Volunteer ID")}
            {line("समीक्षा स्थिति / Review Status")}
            {line("सौंपा गया कार्यक्षेत्र / Assigned Role")}
            {line("समन्वयक का नाम / Coordinator Name")}
            {line("स्वीकृति दिनांक / Approval Date")}
          </div>
          <p className="mt-4 text-sm">अधिकृत हस्ताक्षर / Authorized Signature: ______________________________________________</p>
        </section>

        <footer className="mt-4 border-t border-slate-300 pt-3 text-[11px] leading-5 text-slate-600">
          यह आवेदन संस्था द्वारा समीक्षा एवं सत्यापन के अधीन है। स्वयंसेवा का कार्य, स्थान, अवधि तथा जिम्मेदारियाँ आपसी सहमति और संस्था की आवश्यकता के अनुसार तय होंगी। हस्ताक्षरित आवेदन संस्था के अधिकृत कार्यालय/समन्वयक को जमा करें।
          <br />
          This application is subject to review and verification by the Foundation. Volunteer duties, location, duration and responsibilities will be decided by mutual agreement and organizational requirements. Submit the signed application to an authorized SSF office representative/coordinator.
        </footer>
      </article>

      <div className="no-print mx-auto mt-4 max-w-[850px] rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
        <b>प्रिंट / PDF:</b> ऊपर “प्रिंट करें / Print or Save as PDF” दबाएँ। प्रिंटर चुनें या Destination में “Save as PDF” चुनकर फाइल सेव करें। A4 पेपर चुनें।
        <p className="mt-2">ऑनलाइन आवेदन अलग से उपलब्ध है। यह हार्डकॉपी फॉर्म प्रिंट करके हाथ से भरने और हस्ताक्षर करने के लिए है।</p>
      </div>

      <style>{`
        .section-heading { background:#EAF0F6; color:#12345A; padding:9px 12px; font-size:13px; font-weight:800; margin-bottom:12px; }
        .form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px 20px; }
        .field { font-size:11px; font-weight:700; min-width:0; }
        .field.wide { grid-column:1/-1; }
        .write-line { height:27px; border-bottom:1px solid #94a3b8; margin-top:3px; }
        .option-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px 16px; font-size:12px; }
        .upload-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .upload-box { border:1px dashed #94a3b8; min-height:120px; padding:12px; font-size:11px; line-height:1.6; text-align:center; }
        .upload-box p { margin-top:8px; }
        .write-area { border:1px solid #94a3b8; padding:5px 10px; }
        .write-area div { height:25px; border-bottom:1px solid #cbd5e1; }
        .declarations { display:grid; gap:9px; font-size:12px; line-height:1.55; }
        @media(max-width:640px) { .form-grid,.option-grid,.upload-grid { grid-template-columns:1fr; } .field.wide { grid-column:auto; } }
        @media print {
          @page { size:A4; margin:12mm; }
          body { background:#fff !important; }
          .volunteer-hardcopy { padding:0 !important; background:#fff !important; }
          .no-print { display:none !important; }
          .volunteer-paper { max-width:none !important; padding:0 !important; box-shadow:none !important; }
          .section-heading,.upload-box { break-inside:avoid; }
        }
      `}</style>
    </main>
  );
}
