import { Link } from "@tanstack/react-router";

const committee = [
  ["President", "अध्यक्ष", "Overall institutional direction, chairing meetings and oversight as provided by the bylaws."],
  ["Vice-President", "उपाध्यक्ष", "Supports the President and performs duties assigned under approved resolutions."],
  ["Secretary", "सचिव", "Administration, notices, records, correspondence and implementation of committee decisions."],
  ["Treasurer", "कोषाध्यक्ष", "Accounts, budgets, receipts, payments and financial records under the bylaws."],
  ["Joint Secretary", "संयुक्त सचिव", "Assists the Secretary and acts in the Secretary's absence as permitted by the rules."],
  ["Managing Committee Member 1", "प्रबंध समिति सदस्य 1", "Portfolio responsibilities may be assigned by a recorded committee resolution."],
  ["Managing Committee Member 2", "प्रबंध समिति सदस्य 2", "Portfolio responsibilities may be assigned by a recorded committee resolution."],
  ["Managing Committee Member 3", "प्रबंध समिति सदस्य 3", "Portfolio responsibilities may be assigned by a recorded committee resolution."],
  ["Managing Committee Member 4", "प्रबंध समिति सदस्य 4", "Portfolio responsibilities may be assigned by a recorded committee resolution."],
];

const departments = [
  ["Education, Training & Knowledge Development", "शिक्षा, प्रशिक्षण एवं ज्ञान विकास"],
  ["Women, Child & Family Welfare", "महिला, बाल एवं परिवार कल्याण"],
  ["Health, Nutrition & Rehabilitation", "स्वास्थ्य, पोषण एवं पुनर्वास"],
  ["Social Welfare & Inclusive Development", "सामाजिक कल्याण एवं समावेशी विकास"],
  ["Rural & Community Development", "ग्रामीण एवं सामुदायिक विकास"],
  ["Agriculture, Horticulture & Organic Farming", "कृषि, बागवानी एवं जैविक खेती"],
  ["Animal Husbandry & Animal Welfare", "पशुपालन एवं पशु कल्याण"],
  ["Environment, Water & Natural Resources", "पर्यावरण, जल एवं प्राकृतिक संसाधन"],
  ["Skill Development, Employment & Village Industries", "कौशल विकास, रोजगार एवं ग्रामोद्योग"],
  ["Youth, Sports, Culture & Yoga", "युवा, खेल, संस्कृति एवं योग"],
  ["Disaster Relief & Humanitarian Assistance", "आपदा राहत एवं मानवीय सहायता"],
  ["Membership & Volunteer Management", "सदस्यता एवं स्वयंसेवक प्रबंधन"],
  ["Project Planning, Implementation & Evaluation", "परियोजना योजना, क्रियान्वयन एवं मूल्यांकन"],
  ["CSR, Grants, Funding & Partnerships", "सीएसआर, अनुदान, वित्तपोषण एवं साझेदारी"],
  ["Finance, Accounts & Internal Financial Controls", "वित्त, लेखा एवं आंतरिक वित्तीय नियंत्रण"],
  ["Legal, Registration & Compliance", "विधिक, पंजीयन एवं अनुपालन"],
  ["Media, Communication & Public Relations", "मीडिया, संचार एवं जनसंपर्क"],
  ["Information Technology, Digital Office & MIS", "सूचना प्रौद्योगिकी, डिजिटल कार्यालय एवं एमआईएस"],
  ["Human Resources & Personnel Management", "मानव संसाधन एवं कार्मिक प्रबंधन"],
  ["Institutions, Centres & Office Operations", "संस्थानों, केंद्रों एवं कार्यालयों का संचालन"],
  ["Quality, Transparency & Grievance Redressal", "गुणवत्ता, पारदर्शिता एवं शिकायत निवारण"],
];

const levels = [
  ["Head Office", "मुख्य कार्यालय", "Head Office In-charge, Department Heads, Administration and functional coordinators."],
  ["State", "राज्य स्तर", "State In-charge, State Coordinators and assigned departmental in-charges."],
  ["District", "जिला स्तर", "District In-charge, District Coordinators and programme/department in-charges."],
  ["Block / Tehsil", "विकासखंड / तहसील", "Block In-charge, Block Coordinators and field programme coordinators."],
  ["Village / Ward / City", "ग्राम / वार्ड / नगर", "Village or Ward In-charge, local coordinators and volunteers."],
  ["Institution / Centre / Project", "संस्थान / केंद्र / परियोजना", "Institution Head, Principal, Centre In-charge, Project Director/Manager, Programme Officer, Field Officer, Teacher, Trainer and support staff."],
];

const managementLinks = [
  ["/ims/managing-committee", "Managing Committee Register", "प्रबंध समिति रजिस्टर"],
  ["/ims/meetings", "Meetings & Resolutions", "बैठकें एवं संकल्प"],
  ["/ims/appointment-letters", "Appointment Orders", "नियुक्ति आदेश"],
  ["/ims/history", "Committee History", "समिति इतिहास"],
  ["/ims/sections/governance", "Governance Dashboard", "शासन डैशबोर्ड"],
  ["/ims/volunteer-network", "Volunteer Network", "स्वयंसेवक नेटवर्क"],
];

export default function OrganizationStructureContent({ mode = "public" }) {
  const adminMode = mode === "admin";
  const internalMode = mode !== "public";
  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#243342]">
      <section className="relative overflow-hidden bg-[#092541] px-5 py-14 text-white sm:px-8 sm:py-20">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#176447]/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#FFC56D]">Swastik Srijan Foundation Samiti · Governance</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">Organization & Governance</h1>
          <p lang="hi" className="mt-2 text-xl font-bold text-white/90 sm:text-2xl">संगठनात्मक संरचना एवं प्रशासन व्यवस्था</p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
            One society, one General Body and one 9-member Managing Committee, supported by functional departments and an administrative network across India.
          </p>
          <p lang="hi" className="mt-2 max-w-3xl text-sm leading-7 text-white/80">
            एक संस्था, एक साधारण सभा और एक 9 सदस्यीय प्रबंध समिति—जिसके अधीन विभागों तथा प्रशासनिक स्तरों के माध्यम से कार्य संचालित होंगे।
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-9 sm:px-7 sm:py-12">
        {internalMode && (
          <section className="rounded-2xl border border-[#C9D7E4] bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-[#176447]">{adminMode ? "Admin workspace · प्रशासनिक कार्यक्षेत्र" : "IMS workspace · आंतरिक अभिलेख"}</p>
            <h2 className="mt-2 text-xl font-black text-[#12345A]">Actual appointments and statutory records are maintained in IMS</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">This page is the approved structure reference. Use the linked IMS registers to record real appointments, meeting resolutions and committee history. Do not treat a proposed role as an appointment.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {managementLinks.map(([to, en]) => <Link key={to} to={to} className="rounded-xl bg-[#12345A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#176447]">{en} ↗</Link>)}
            </div>
          </section>
        )}

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-[#D94C13]">1 · General Body</p>
            <h2 className="mt-2 text-2xl font-black text-[#12345A]">General Body · साधारण सभा</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">The General Body is the society's member body and exercises the powers assigned to it by the registered bylaws and applicable law, including the matters reserved to it in the rules.</p>
            <p lang="hi" className="mt-2 text-sm leading-7 text-slate-600">साधारण सभा संस्था के सदस्यों की सभा है। इसके अधिकार पंजीकृत नियमावली और लागू कानून के अनुसार होंगे।</p>
          </article>
          <article className="rounded-2xl border-2 border-[#176447]/20 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-[#176447]">2 · Single governing body</p>
            <h2 className="mt-2 text-2xl font-black text-[#12345A]">Managing Committee · प्रबंध समिति</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">One main Managing Committee of nine positions for the society's all-India area of operation. Its composition and term are governed by the registered rules.</p>
            <p className="mt-2 text-sm font-bold text-[#176447]">9 positions · 3-year term, subject to the registered rules.</p>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-black uppercase tracking-widest text-[#D94C13]">Main committee</p><h2 className="mt-2 text-2xl font-black text-[#12345A]">Nine office-bearer positions · नौ पद</h2></div>
            <span className="rounded-full bg-[#EAF4EF] px-3 py-1.5 text-xs font-bold text-[#176447]">Single committee · एक ही समिति</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {committee.map(([en, hi, desc], i) => <article key={en} className="rounded-xl border border-slate-200 bg-[#FBFCFD] p-4">
              <p className="text-[11px] font-black tracking-widest text-[#D94C13]">POSITION {String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-extrabold text-[#12345A]">{en}</h3><p lang="hi" className="text-sm font-bold text-[#176447]">{hi}</p>
              <p className="mt-2 text-xs leading-5 text-slate-600">{desc}</p>
            </article>)}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-black uppercase tracking-widest text-[#D94C13]">Functional departments</p>
          <h2 className="mt-2 text-2xl font-black text-[#12345A]">Departments derived from the society's objects</h2>
          <p lang="hi" className="mt-1 text-sm text-slate-600">संस्था के उद्देश्यों के अनुरूप कार्यात्मक विभाग</p>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">These are functional areas, not separate statutory committees. The Managing Committee may assign portfolios and create operational teams through recorded decisions. Only departments needed for active work should be staffed.</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map(([en, hi], i) => <div key={en} className="flex gap-3 rounded-xl border border-slate-100 bg-[#FBFCFD] p-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#12345A] text-xs font-black text-white">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0"><p className="text-sm font-bold text-[#12345A]">{en}</p><p lang="hi" className="text-xs text-slate-500">{hi}</p></div>
            </div>)}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-black uppercase tracking-widest text-[#D94C13]">Administrative levels</p>
          <h2 className="mt-2 text-2xl font-black text-[#12345A]">One administrative network · एक प्रशासनिक व्यवस्था</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">These are administrative coordination levels, not separate elected governing bodies. There is no separate State President, State Secretary or State Managing Committee under this structure.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {levels.map(([en, hi, desc], i) => <article key={en} className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-black text-[#D94C13]">LEVEL {i + 1}</p><h3 className="mt-1 font-extrabold text-[#12345A]">{en}</h3><p lang="hi" className="text-sm font-bold text-[#176447]">{hi}</p><p className="mt-2 text-xs leading-5 text-slate-600">{desc}</p>
            </article>)}
          </div>
        </section>

        <section className="rounded-2xl border border-[#F0D8B5] bg-[#FFFAF1] p-5 sm:p-7">
          <h2 className="text-xl font-black text-[#12345A]">Authority, appointments & compliance · अधिकार, नियुक्ति एवं अनुपालन</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>Department Heads, State/District/Block/Village In-charges and project personnel are administrative appointments, not additional members of the statutory Managing Committee.</li>
            <li>Every appointment, delegation, tenure and reporting line must be approved and recorded by the competent authority under the bylaws.</li>
            <li>No subordinate role receives independent bank-signing, withdrawal or statutory governing powers merely by holding a title. Financial authority remains subject to the bylaws and approved controls.</li>
            <li>Creating a new elected governing body or changing the registered rules requires the applicable amendment and Registrar process.</li>
            <li>Actual public office-bearer names should be published only after verification against current official records and consent for publication.</li>
          </ul>
          <p lang="hi" className="mt-4 text-sm leading-7 text-slate-700">विभाग प्रमुख तथा राज्य/जिला/ब्लॉक/ग्राम स्तर के प्रभारी प्रशासनिक नियुक्तियाँ होंगे। नियुक्ति, अधिकार और कार्यकाल सक्षम प्राधिकारी के लिखित अनुमोदन से तय होंगे। केवल पदनाम से किसी को बैंक संचालन या स्वतंत्र समिति का अधिकार नहीं मिलेगा।</p>
        </section>

        {!internalMode && (
          <section className="rounded-2xl bg-[#092541] p-6 text-white sm:p-8">
            <h2 className="text-xl font-black">Institutional records & transparency</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75">Public information is shown here. Formal committee records, appointment orders, minutes and registers are maintained internally in SSF OneOffice (IMS).</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/MemorandumAndRules" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#12345A]">Memorandum & Rules</Link>
              <Link to="/Team" className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold text-white">Meet the Team</Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
