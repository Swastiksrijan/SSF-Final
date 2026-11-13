import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Users, Landmark, Network, ShieldCheck, BookOpen, ClipboardList, ArrowRight, Building2 } from "lucide-react";

const committee = [
  ["President", "अध्यक्ष", "प्रबंध समिति की अध्यक्षता तथा नियमावली के अनुसार संस्था के कार्यों में नेतृत्व।"],
  ["Vice-President", "उपाध्यक्ष", "अध्यक्ष की सहायता तथा नियमानुसार उनके अनुपस्थित रहने पर दायित्व निभाना।"],
  ["Secretary", "सचिव", "संस्था के प्रशासनिक कार्य, अभिलेख, बैठक की कार्यवाही और निर्णयों का समन्वय।"],
  ["Treasurer", "कोषाध्यक्ष", "आय-व्यय, वित्तीय अभिलेख और लेखा संबंधी कार्यों की निगरानी।"],
  ["Joint Secretary", "सह-सचिव", "सचिव के कार्यों में सहयोग तथा सौंपे गए प्रशासनिक दायित्व।"],
  ["Executive Committee Member 1", "कार्यकारिणी सदस्य 1", "प्रबंध समिति के निर्णयों और संस्था के कार्यों में सहभागिता।"],
  ["Executive Committee Member 2", "कार्यकारिणी सदस्य 2", "प्रबंध समिति के निर्णयों और संस्था के कार्यों में सहभागिता।"],
  ["Executive Committee Member 3", "कार्यकारिणी सदस्य 3", "प्रबंध समिति के निर्णयों और संस्था के कार्यों में सहभागिता।"],
  ["Executive Committee Member 4", "कार्यकारिणी सदस्य 4", "प्रबंध समिति के निर्णयों और संस्था के कार्यों में सहभागिता।"],
];

const departments = [
  ["Education & Learning", "शिक्षा, साक्षरता, डिजिटल शिक्षा और कौशल विकास से जुड़े कार्यक्रम।"],
  ["Health & Community Well-being", "स्वास्थ्य जागरूकता, जनकल्याण और समुदाय आधारित सहयोग।"],
  ["Women, Child & Social Inclusion", "महिला, बाल विकास, समान अवसर और वंचित समुदायों के सशक्तिकरण के प्रयास।"],
  ["Livelihood & Sustainable Development", "आजीविका, कौशल, पर्यावरण-अनुकूल गतिविधियों और टिकाऊ विकास की पहल।"],
  ["Environment & Rural Development", "पर्यावरण संरक्षण, ग्रामीण विकास और स्थानीय जरूरतों पर आधारित गतिविधियाँ।"],
  ["Administration, Finance & Compliance", "कार्यालयीन समन्वय, वित्तीय अनुशासन, अभिलेख और वैधानिक अनुपालन।"],
  ["Communication & Public Engagement", "जनसंपर्क, सूचना, मीडिया, साझेदारी और समुदाय से संवाद।"],
  ["Monitoring, Evaluation & Reporting", "कार्य प्रगति, परिणाम, दस्तावेजीकरण और पारदर्शी रिपोर्टिंग।"],
];

function SectionHeading({ eyebrow, title, description }) {
  return <div className="max-w-3xl mb-8"><p className="text-xs font-black uppercase tracking-[.22em] text-[#176447]">{eyebrow}</p><h2 className="mt-2 text-2xl md:text-3xl font-black text-[#12345A]">{title}</h2>{description && <p className="mt-3 text-[#53616C] leading-7">{description}</p>}</div>;
}

export default function OrganizationPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return <main className="bg-[#F6F8FA] text-[#26343D]">
    <section className="relative overflow-hidden bg-[#082B49] text-white">
      <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 15% 20%, #F7A814 0, transparent 28%), radial-gradient(circle at 85% 80%, #2D8A68 0, transparent 30%)"}} />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-4xl">
          <p className="text-xs md:text-sm font-bold tracking-[.24em] uppercase text-[#F7A814]">Governance • Participation • Accountability</p>
          <h1 className="mt-4 text-4xl md:text-6xl font-black leading-tight">Our Organization <span className="block text-2xl md:text-4xl mt-2 text-white/85">हमारा संगठन</span></h1>
          <p className="mt-6 max-w-3xl text-base md:text-xl leading-8 text-white/85">Swastik Srijan Foundation Samiti का संगठनात्मक ढाँचा सदस्य सहभागिता, निर्वाचित प्रबंध समिति, उत्तरदायी प्रशासन और समुदाय के साथ समन्वय पर आधारित है।</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#general-body" className="rounded-full bg-[#F7A814] px-6 py-3 font-extrabold text-[#12345A]">आम सभा की भूमिका</a>
            <a href="#managing-committee" className="rounded-full border border-white/35 px-6 py-3 font-bold text-white hover:bg-white/10">9 सदस्यीय प्रबंध समिति</a>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E4EAF0]"><Landmark className="text-[#176447] w-8 h-8"/><h3 className="mt-4 font-black text-lg text-[#12345A]">साधारण सभा</h3><p className="mt-2 text-sm leading-6 text-[#53616C]">नियमावली के अनुसार पात्र सदस्यों का सर्वोच्च सामान्य निकाय।</p></div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E4EAF0]"><Users className="text-[#176447] w-8 h-8"/><h3 className="mt-4 font-black text-lg text-[#12345A]">9 सदस्यीय प्रबंध समिति</h3><p className="mt-2 text-sm leading-6 text-[#53616C]">साधारण सभा द्वारा नियमों के अनुसार चुनी जाने वाली कार्यकारी समिति।</p></div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E4EAF0]"><Network className="text-[#176447] w-8 h-8"/><h3 className="mt-4 font-black text-lg text-[#12345A]">प्रशासनिक नेटवर्क</h3><p className="mt-2 text-sm leading-6 text-[#53616C]">मुख्य कार्यालय, विभाग और आवश्यकतानुसार क्षेत्रीय समन्वय।</p></div>
      </div>
    </section>

    <section id="general-body" className="scroll-mt-28 mx-auto max-w-7xl px-5 sm:px-8 py-12">
      <SectionHeading eyebrow="01 / General Body" title="General Body — आम सभा / साधारण सभा" description="साधारण सभा संस्था की सदस्य-आधारित सामान्य सभा है। इसके सदस्य संस्था की नियमावली और अद्यतन सदस्यता अभिलेखों के अनुसार निर्धारित होते हैं। यह निकाय संस्था के प्रमुख सामान्य विषयों पर विचार करता है और नियमों के अनुसार प्रबंध समिति के गठन में भूमिका निभाता है।"/>
      <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-6">
        <div className="rounded-3xl bg-white p-7 md:p-9 border border-[#E4EAF0] shadow-sm">
          <h3 className="text-xl font-black text-[#12345A]">साधारण सभा के प्रमुख कार्य</h3>
          <ul className="mt-5 space-y-3 text-[#53616C] leading-7">
            <li>• नियमावली के अनुसार प्रबंध समिति के सदस्यों का निर्वाचन।</li>
            <li>• वार्षिक कार्य, कार्यक्रम, बजट और लेखों पर विचार/अनुमोदन, जैसा नियमों में निर्धारित है।</li>
            <li>• संस्था के महत्वपूर्ण नीतिगत और संगठनात्मक विषयों पर विचार।</li>
            <li>• बैठक में चर्चा, प्रस्ताव और निर्णयों का विधिवत अभिलेखीकरण।</li>
            <li>• विशेष बैठक की मांग और आयोजन नियमावली में दी गई प्रक्रिया के अनुसार।</li>
          </ul>
        </div>
        <div className="rounded-3xl bg-[#EAF1F4] p-7 md:p-9">
          <h3 className="text-xl font-black text-[#12345A]">सदस्यता और मतदान</h3>
          <p className="mt-4 text-sm leading-7 text-[#53616C]">सदस्यता की श्रेणियाँ, पात्रता, शुल्क/योगदान, मतदान का अधिकार और निर्वाचन में भाग लेने की पात्रता संस्था की पंजीकृत नियमावली तथा अद्यतन सदस्यता रजिस्टर से तय होगी। केवल नाममात्र या मानद पद से मतदान अथवा निर्वाचन का अधिकार स्वतः प्राप्त नहीं होता।</p>
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-white p-4"><ShieldCheck className="w-6 h-6 shrink-0 text-[#176447]"/><p className="text-xs leading-6 text-[#53616C]">सार्वजनिक वेबसाइट पर सदस्य संख्या या नाम तभी दिखाए जाएँगे जब वे अधिकृत अभिलेखों से सत्यापित हों।</p></div>
        </div>
      </div>
    </section>

    <section id="managing-committee" className="scroll-mt-28 bg-white py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="02 / Managing Committee" title="Managing Committee — प्रबंध समिति (9 सदस्य)" description="प्रबंध समिति संस्था का कार्यकारी/प्रशासनिक निकाय है। इसका गठन साधारण सभा द्वारा पंजीकृत नियमावली में निर्धारित निर्वाचन प्रक्रिया के अनुसार किया जाता है। नीचे नौ पदों का संरचनात्मक विवरण दिया गया है; यह किसी वर्तमान पदाधिकारी की नियुक्ति या निर्वाचन की घोषणा नहीं है।"/>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {committee.map(([en, hi, desc], i) => <article key={en} className="rounded-2xl border border-[#E4EAF0] bg-[#FAFBFC] p-5">
            <div className="flex items-center justify-between"><span className="text-xs font-black tracking-widest text-[#176447]">POSITION {String(i+1).padStart(2,"0")}</span><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12345A] text-sm font-black text-white">{i+1}</span></div>
            <h3 className="mt-4 text-lg font-black text-[#12345A]">{en}</h3><p className="mt-1 font-bold text-[#176447]">{hi}</p><p className="mt-3 text-sm leading-6 text-[#53616C]">{desc}</p>
          </article>)}
        </div>
        <p className="mt-6 rounded-xl border-l-4 border-[#F7A814] bg-[#FFF9E9] p-4 text-sm leading-6 text-[#5F5437]">कार्यकाल, पुनर्निर्वाचन, रिक्त पद, बैठक, कोरम और पदाधिकारियों के अधिकार/कर्तव्य पंजीकृत नियमावली के अनुसार ही लागू होंगे।</p>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
      <SectionHeading eyebrow="03 / Head Office & Administration" title="मुख्य कार्यालय एवं प्रशासनिक व्यवस्था" description="प्रबंध समिति के निर्णयों और संस्था की स्वीकृत योजनाओं को लागू करने के लिए मुख्य कार्यालय प्रशासनिक समन्वय का केंद्र होगा। आवश्यकतानुसार कार्य-विभाजन और जिम्मेदारियाँ लिखित आदेश/समिति प्रस्ताव से तय की जा सकती हैं।"/>
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-[#12345A] p-6 text-center text-white shadow-lg"><Building2 className="mx-auto h-8 w-8 text-[#F7A814]"/><h3 className="mt-2 text-xl font-black">Head Office / मुख्य कार्यालय</h3><p className="mt-1 text-sm text-white/75">प्रबंध समिति के मार्गदर्शन में केंद्रीय प्रशासनिक समन्वय</p></div>
        <div className="mx-auto h-8 w-px bg-[#B8C6D1]"/>
        <div className="grid gap-3 sm:grid-cols-2">
          {["प्रशासन एवं कार्यालय प्रबंधन","वित्त एवं लेखा","कार्यक्रम एवं परियोजना समन्वय","सदस्यता एवं स्वयंसेवक समन्वय","दस्तावेज़, अनुपालन एवं रिपोर्टिंग","संचार, मीडिया एवं जनसंपर्क"].map(x=><div key={x} className="rounded-xl border border-[#DCE5EB] bg-white p-4 text-center font-bold text-[#12345A]">{x}</div>)}
        </div>
      </div>
    </section>

    <section className="bg-[#EDF3F2] py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="04 / Departments" title="विभाग एवं उनके उद्देश्य" description="विभाग कार्यों को व्यवस्थित करने के लिए प्रशासनिक इकाइयाँ हैं। विभागाध्यक्ष/समन्वयक की नियुक्ति और अधिकार लिखित स्वीकृति से होंगे; विभाग अपने आप में नियमावली की संवैधानिक समिति नहीं बन जाते।"/>
        <div className="grid gap-4 md:grid-cols-2">
          {departments.map(([name, desc])=><div key={name} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm"><div className="mt-1 rounded-xl bg-[#EAF1F4] p-3"><ClipboardList className="h-5 w-5 text-[#176447]"/></div><div><h3 className="font-black text-[#12345A]">{name}</h3><p className="mt-2 text-sm leading-6 text-[#53616C]">{desc}</p></div></div>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
      <SectionHeading eyebrow="05 / Field Coordination" title="राज्य से ग्राम/वार्ड स्तर तक समन्वय" description="संस्था का कार्यक्षेत्र अखिल भारतीय होने के अनुरूप, आवश्यकता, संसाधन और स्वीकृति के आधार पर विभिन्न स्तरों पर समन्वय इकाइयाँ विकसित की जा सकती हैं। ये पद/इकाइयाँ नियमावली में वर्णित प्रबंध समिति का विकल्प नहीं हैं।"/>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {["राष्ट्रीय / केंद्रीय समन्वय","राज्य स्तरीय समन्वय","जिला स्तरीय समन्वय","विकासखंड स्तरीय समन्वय","ग्राम / वार्ड स्तरीय समन्वय"].map((x,i)=><div key={x} className="rounded-2xl border border-[#DCE5EB] bg-white p-5 text-center"><span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#176447] text-white font-black">{i+1}</span><p className="mt-3 font-black text-sm text-[#12345A]">{x}</p></div>)}
      </div>
      <div className="mt-8 rounded-3xl bg-[#082B49] p-7 md:p-9 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div><h3 className="text-xl font-black">नियमावली और आधिकारिक अभिलेख</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">संगठन का वास्तविक गठन, सदस्यता, निर्वाचन और अधिकार पंजीकृत नियमावली, प्रस्तावों तथा अधिकृत रजिस्टर के अनुसार ही मान्य होंगे।</p></div>
        <Link to="/MemorandumAndRules" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F7A814] px-5 py-3 font-black text-[#12345A]">Memorandum & Rules <ArrowRight className="h-4 w-4"/></Link>
      </div>
    </section>
  </main>;
}
