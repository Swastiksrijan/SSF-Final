import { useEffect } from "react";
import { Link } from "@tanstack/react-router";

export default function MemorandumAndRules() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const objectives = [
    "शिक्षा, साक्षरता और कौशल विकास के अवसरों को प्रोत्साहित करना।",
    "स्वास्थ्य, पोषण, महिला एवं बाल कल्याण के लिए जनहितकारी पहल को बढ़ावा देना।",
    "ग्रामीण एवं सामुदायिक विकास, आजीविका और स्वरोजगार के अवसरों को सहयोग देना।",
    "पर्यावरण संरक्षण, जल-संरक्षण, स्वच्छता और प्राकृतिक संसाधनों के प्रति जागरूकता बढ़ाना।",
    "सामाजिक कल्याण, युवा विकास, खेल, संस्कृति और जन-जागरूकता से जुड़े कार्यों को प्रोत्साहित करना।",
  ];

  return (
    <main className="min-h-screen w-full bg-[#F5F8FA] px-4 pb-20 pt-28 text-[#263746] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-[2rem] bg-[#082B49] px-6 py-12 text-center text-white shadow-xl md:px-12 md:py-16">
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#F7C45B]">Public Institutional Overview</p>
          <h1 className="mt-4 text-3xl font-black md:text-5xl">Institutional Framework</h1>
          <p className="mt-3 text-xl font-semibold text-white/85">संस्थागत परिचय एवं उद्देश्य</p>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
            संस्था की पहचान, सार्वजनिक उद्देश्य और कार्य-दृष्टिकोण का संक्षिप्त परिचय।
          </p>
        </header>

        <div className="mt-8 space-y-7 rounded-[1.75rem] border border-[#E1E8ED] bg-white p-6 shadow-sm md:p-10">
          <section>
            <h2 className="text-xl font-extrabold text-[#12345A]">Legal Identity | कानूनी पहचान</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[#F5F8FA] p-4"><p className="text-xs font-bold text-[#176447]">Registered Name</p><p className="mt-1 font-bold">Swastik Srijan Foundation Samiti</p><p className="mt-1 text-sm text-slate-600">स्वास्तिक सृजन फाउंडेशन समिति</p></div>
              <div className="rounded-xl bg-[#F5F8FA] p-4"><p className="text-xs font-bold text-[#176447]">Registration</p><p className="mt-1 font-bold">05/22/03/11448/13</p><p className="mt-1 text-sm text-slate-600">30 December 2013 · Madhya Pradesh Societies Registration Act, 1973</p></div>
              <div className="rounded-xl bg-[#F5F8FA] p-4"><p className="text-xs font-bold text-[#176447]">Registered Office</p><p className="mt-1 font-semibold">Rewa, Madhya Pradesh, India</p></div>
              <div className="rounded-xl bg-[#F5F8FA] p-4"><p className="text-xs font-bold text-[#176447]">Area of Operation</p><p className="mt-1 font-semibold">All India, as recorded in the Society documents</p></div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-7">
            <h2 className="text-xl font-extrabold text-[#12345A]">Purpose & Public Objectives | उद्देश्य</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              संस्था शिक्षा, स्वास्थ्य-जागरूकता, सामाजिक कल्याण, कौशल, आजीविका, पर्यावरण और सामुदायिक विकास से जुड़े जनहितकारी प्रयासों को प्रोत्साहित करने के लिए कार्य करती है। कार्यक्रम स्थानीय आवश्यकताओं, उपलब्ध संसाधनों, व्यवहार्यता और आवश्यक अनुमतियों के अनुसार विकसित किए जाते हैं।
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 text-slate-700">
              {objectives.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className="border-t border-slate-100 pt-7">
            <h2 className="text-xl font-extrabold text-[#12345A]">Official Records | आधिकारिक अभिलेख</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              पंजीकरण, वैधानिक स्थिति, उपलब्ध सार्वजनिक प्रमाण-पत्रों और वित्तीय पारदर्शिता संबंधी जानकारी Transparency Centre में दी गई है। यह पृष्ठ केवल सार्वजनिक परिचय है; यह पंजीकृत Memorandum एवं Rules का विकल्प या उनका पूर्ण पाठ नहीं है।
            </p>
            <Link to="/Transparency" className="mt-5 inline-flex items-center justify-center rounded-full bg-[#12345A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#176447]">View Transparency Records</Link>
          </section>

          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
            कानूनी अधिकारों और दायित्वों के लिए पंजीकृत मूल दस्तावेज़ तथा लागू कानून ही निर्णायक होंगे। किसी संक्षिप्त वेबसाइट परिचय को प्रमाणित नियमावली न माना जाए।
          </p>
        </div>
      </div>
    </main>
  );
}
