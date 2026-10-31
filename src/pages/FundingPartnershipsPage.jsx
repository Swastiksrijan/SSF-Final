import { Link } from "@tanstack/react-router";
import SustainableLivelihoodContent from "./SustainableLivelihoodPage";
import qrCode from "../assets/barcode.jpg";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Landmark, HandHeart, Factory, GraduationCap, HeartPulse, Sprout, Users, FileText, ShieldCheck, ClipboardList, PackageCheck, Handshake, IndianRupee, BriefcaseBusiness, BadgeCheck } from "lucide-react";

const fundingRoutes = [
  { icon: Building2, title: "Corporate CSR & Corporate Foundations", hindi: "कंपनियों का CSR सहयोग", desc: "Companies, public-sector enterprises, corporate foundations and their CSR teams can explore eligible, measurable community projects with SSF.", asks: ["Education and digital learning", "Health, nutrition and community welfare", "Women and youth skill development", "Environment and rural development"], note: "CSR project acceptance is subject to the company’s CSR policy, Schedule VII, due diligence and SSF’s eligibility at the time of proposal." },
  { icon: Landmark, title: "Banks & Financial Institutions", hindi: "बैंक एवं वित्तीय संस्थान", desc: "Banks may support eligible community programmes through CSR/philanthropy, financial literacy, skill partnerships, equipment support or other approved programmes.", asks: ["Financial literacy and digital inclusion", "Skill and livelihood programmes", "Equipment or infrastructure support", "Enterprise credit appraisal for viable livelihood units"], note: "A loan is repayable finance, not a donation or grant. Credit is subject to the lender’s independent appraisal and terms." },
  { icon: HandHeart, title: "Industrialists, HNIs & Philanthropists", hindi: "उद्योगपति, दानदाता एवं परोपकारी सहयोगी", desc: "Individuals, business families and philanthropists can support a specific project, sponsor a beneficiary group, contribute equipment or provide recurring support.", asks: ["Sponsor a classroom or learning resources", "Support a health or nutrition camp", "Fund skill training batches", "Donate tools, computers, furniture or other approved assets"], note: "Every contribution will be acknowledged and recorded with the purpose and restrictions stated by the donor." },
  { icon: Building2, title: "Government Grants & Schemes", hindi: "केंद्र एवं राज्य सरकार की योजनाएँ", desc: "SSF will identify relevant central, state and district-level schemes, calls for proposals and departmental partnerships, and apply only where the organisation and project meet the notified criteria.", asks: ["Education and skill development", "Rural livelihoods and women’s collectives", "Agriculture and farmer support", "Environment, health and social welfare"], note: "Government support is competitive and scheme-specific; listing a sector does not mean a grant is open or sanctioned." },
  { icon: Factory, title: "Business & Industry Partnerships", hindi: "उद्योग एवं व्यावसायिक साझेदारी", desc: "Companies and local industries can create practical social impact through purchase commitments, vendor development, job-work, training, technology and market access.", asks: ["Buy from trained local producer groups", "Provide raw material or machinery in kind", "Offer internships, mentoring and technical training", "Share purchase forecasts and market linkages"], note: "Commercial contracts and charitable grants will be documented and accounted for separately." },
  { icon: Users, title: "Citizens, Members & Community", hindi: "आम नागरिक एवं समुदाय", desc: "Small and recurring contributions, community fundraising, volunteer time and local networks can sustain grassroots programmes.", asks: ["One-time or monthly donation", "Sponsor books, kits or learning materials", "Volunteer professional skills", "Connect SSF with potential donors and buyers"], note: "Online and domestic bank-transfer donation options are available on the official Donate page." }
];

const projects = [
  { icon: GraduationCap, title: "Education & Digital Learning", desc: "Learning materials, digital access, school support, computer learning and youth education.", use: "Equipment, devices, books, connectivity, learning kits, trainers and programme delivery." },
  { icon: HeartPulse, title: "Health, Nutrition & Well-being", desc: "Community health awareness, preventive health activities, nutrition and support for vulnerable groups.", use: "Camp logistics, approved medical supplies, nutrition kits, qualified professionals and outreach." },
  { icon: BriefcaseBusiness, title: "Skills, Women & Youth Livelihoods", desc: "Practical training, employability, women’s economic participation and self-employment readiness.", use: "Trainer costs, tools, training material, certification where applicable and placement linkages." },
  { icon: Sprout, title: "Rural Development & Environment", desc: "Farmer support, water and environment awareness, plantation, waste reduction and local resilience.", use: "Planting material, field demonstrations, community mobilisation, tools and monitoring." },
  { icon: PackageCheck, title: "Sustainable Livelihood & Social Enterprise", desc: "Market-linked livelihood pilots that may create local work and strengthen long-term organisational resilience.", use: "Separate enterprise capital, equipment, working capital or credit only through a lawful and properly approved route—not by diverting restricted charitable or CSR grants." }
];

const proposalPack = [
  "One-page concept note with need, location, beneficiaries and outcomes",
  "Detailed project proposal / DPR with activities, timeline and implementation plan",
  "Item-wise budget, quotations, assumptions and funding requested",
  "Organisation profile, registration and current statutory documents",
  "Governance details, audited financial statements and due-diligence responses",
  "Monitoring indicators, reporting calendar and utilisation documentation"
];

export default function FundingPartnershipsPage() {
  const sharePage = async () => {
    const shareData = { title: "Sustainable Development | Swastik Srijan Foundation Samiti", text: "Explore our funding, partnerships, livelihood and community development initiatives.", url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (error) { if (error?.name !== "AbortError") console.error("Share failed", error); }
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(window.location.href);
      window.alert("Page link copied. You can now share it.");
    }
  };
  return <main className="min-h-screen bg-[#F7F9FC] text-[#26343D]">
    <section className="relative overflow-hidden bg-[#002344] text-white">
      <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 15% 20%, #2d6a4f 0, transparent 32%), radial-gradient(circle at 85% 80%, #fb8500 0, transparent 28%)"}} />
      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
        <p className="mb-4 text-xs font-bold uppercase tracking-[.28em] text-[#ffb347]">Swastik Srijan Foundation Samiti · Funding & Partnerships</p>
        <div className="max-w-4xl">
          <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">Funding, Partnerships &amp; Sustainable Development</h1>
          <p className="mt-4 text-xl font-semibold text-white/90">सहयोग, वित्तपोषण एवं साझेदारी</p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/80 md:text-lg">We invite responsible support from companies, banks, industries, philanthropists, institutions, government programmes and citizens. Every request will be linked to a clear purpose, realistic budget, accountable implementation and measurable outcomes.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#funding-options" className="inline-flex items-center gap-2 rounded-full bg-[#fb8500] px-6 py-3 font-bold text-[#17212b] hover:bg-[#ffad4d]">Explore support options <ArrowRight size={18}/></a>
            <Link to="/Contact" className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 font-bold text-white hover:bg-white/10">Submit a partnership enquiry</Link>
            <button type="button" onClick={sharePage} className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 font-bold text-white hover:bg-white/10">Share this page</button>
          </div>
        </div>
        <div className="mt-14 grid gap-3 sm:grid-cols-3">
          {[[ "2013", "Foundation journey" ],[ "Rewa, MP", "Grassroots focus" ],[ "Pan-India", "Long-term ambition" ]].map(([v,l])=><div key={l} className="rounded-2xl border border-white/15 bg-white/10 p-5"><div className="text-2xl font-black text-[#ffb347]">{v}</div><div className="mt-1 text-sm text-white/75">{l}</div></div>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-18">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-black uppercase tracking-[.22em] text-[#2d6a4f]">A clear reason to support</p>
        <h2 className="mt-3 font-serif text-3xl font-bold text-[#002344] md:text-4xl">What is the funding needed for?</h2>
        <p className="mt-4 leading-8 text-slate-600">Funding is sought for defined charitable programmes, approved project costs, community assets and measurable outcomes—not as an unexplained general collection. Project-wise budgets and current funding gaps will be shared with prospective partners before a commitment is requested.</p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {projects.map(({icon:Icon,title,desc,use})=><article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start gap-4"><div className="rounded-xl bg-[#EAF2EE] p-3 text-[#2d6a4f]"><Icon size={25}/></div><div><h3 className="text-lg font-extrabold text-[#002344]">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p></div></div><div className="mt-5 rounded-xl bg-[#F7F9FC] p-4"><p className="text-xs font-black uppercase tracking-wider text-[#2d6a4f]">Possible use of support</p><p className="mt-2 text-sm leading-6 text-slate-700">{use}</p></div></article>)}
      </div>
    </section>


    <section id="support-ssf" className="relative overflow-hidden bg-[#F1F6F3] px-5 py-16 md:px-8 md:py-20 scroll-mt-24">
      <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.65 }} className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#2d6a4f]">Your support creates impact</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-[#002344] md:text-4xl">Donate Now / Support Our Mission</h2>
          <p className="mt-4 leading-8 text-slate-600">Swastik Srijan Foundation Samiti welcomes responsible support for education, health, skills, youth, environment and community development. Choose a secure online payment or direct bank/UPI transfer.</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-3xl bg-[#002344] p-7 text-white shadow-xl md:p-9">
            <HandHeart size={34} className="text-[#ffb347]"/>
            <p className="mt-4 text-xs font-bold uppercase tracking-[.2em] text-[#ffb347]">Fast & secure</p>
            <h3 className="mt-2 font-serif text-3xl font-bold">Online Donation</h3>
            <p className="mt-3 text-sm leading-7 text-white/75">Pay securely through the Foundation’s existing Razorpay payment page. Available payment methods are shown on the Razorpay checkout.</p>
            <a href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#fb8500] px-6 py-4 font-extrabold text-[#17212b] hover:bg-[#ffad4d]">Donate Now / Support SSF <ArrowRight size={18}/></a>
            <p className="mt-4 text-xs text-white/55">Please confirm the beneficiary shown on the payment page before completing payment.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
            <Landmark size={32} className="text-[#2d6a4f]"/>
            <h3 className="mt-4 font-serif text-2xl font-bold text-[#002344]">Bank Transfer & Paytm / UPI</h3>
            <div className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200">
              <div className="p-4"><p className="text-xs text-slate-500">Account Name / Beneficiary</p><p className="mt-1 font-bold text-[#002344]">Swastik Srijan Foundation Samiti</p></div>
              <div className="p-4"><p className="text-xs text-slate-500">Bank</p><p className="mt-1 font-bold text-[#002344]">Union Bank of India</p></div>
              <div className="p-4"><p className="text-xs text-slate-500">Account Number</p><p className="mt-1 break-all font-mono font-bold text-[#002344]">481401010036579</p></div>
              <div className="p-4"><p className="text-xs text-slate-500">IFSC</p><p className="mt-1 font-mono font-bold text-[#002344]">UBIN0548146</p></div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-[#C9DDD1] bg-[#F7F9FC] p-4">
              <img src={qrCode} alt="Swastik Srijan Foundation Samiti UPI payment QR code" className="h-24 w-24 rounded-xl border border-slate-200 bg-white object-contain"/>
              <div className="min-w-0 flex-1"><p className="font-bold text-[#002344]">Scan to Pay</p><p className="mt-1 text-xs text-slate-600">Use the existing official QR scanner.</p><p className="mt-3 text-xs font-semibold text-slate-500">Paytm mobile number</p><a href="tel:9718346691" className="text-xl font-black tracking-wide text-[#2d6a4f]">9718346691</a></div>
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-500">Before confirming a bank transfer, verify that the beneficiary name displayed by your bank matches the account’s actual registered name. Please share transaction details with the Foundation for acknowledgement.</p>
          </motion.div>
        </div>
      </motion.div>
    </section>

    <section id="funding-options" className="scroll-mt-24 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.22em] text-[#2d6a4f]">Who can partner?</p><h2 className="mt-3 font-serif text-3xl font-bold text-[#002344] md:text-4xl">Different ways to support SSF</h2><p className="mt-4 leading-7 text-slate-600">Each partner can choose a suitable route. Grant, donation, in-kind contribution, purchase order and loan are different forms of support and will never be represented as interchangeable.</p></div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {fundingRoutes.map(({icon:Icon,title,hindi,desc,asks,note})=><article key={title} className="flex flex-col rounded-2xl border border-slate-200 bg-[#FBFCFE] p-6"><div className="flex items-start gap-4"><div className="rounded-xl bg-[#EAF2EE] p-3 text-[#2d6a4f]"><Icon size={24}/></div><div><h3 className="font-extrabold text-[#002344]">{title}</h3><p className="mt-1 text-sm font-semibold text-[#2d6a4f]">{hindi}</p></div></div><p className="mt-4 text-sm leading-7 text-slate-600">{desc}</p><p className="mt-4 text-xs font-black uppercase tracking-wider text-[#002344]">Possible collaboration</p><ul className="mt-2 flex-1 space-y-2">{asks.map(a=><li key={a} className="flex gap-2 text-sm leading-6 text-slate-600"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#fb8500]"/>{a}</li>)}</ul><p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-6 text-slate-500">{note}</p></article>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl bg-[#002344] p-7 text-white md:p-9">
          <HandHeart size={32} className="text-[#ffb347]"/>
          <h2 className="mt-4 font-serif text-3xl font-bold">Individual & domestic donations</h2>
          <p className="mt-4 text-sm leading-7 text-white/75">Individuals and Indian institutions can use the existing official donation page for available online payment and bank-transfer instructions. Please mention the project or purpose where the payment facility permits, and share transaction details for donor acknowledgement.</p>
          <Link to="/Donate" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#fb8500] px-6 py-3 font-bold text-[#17212b]">Go to official donation page <ArrowRight size={18}/></Link>
          <p className="mt-5 text-xs leading-6 text-white/55">Do not transfer money to personal accounts or to any account shared through unofficial messages. Verify the account name and current bank details on the official website before payment.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-7 md:p-9">
          <IndianRupee size={32} className="text-[#2d6a4f]"/>
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#002344]">Equipment, materials & expertise</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">Support need not always be cash. Partners can offer usable computers, furniture, books, tools, machinery, raw materials, transport, professional services, technical mentoring, training or market access. In-kind support will be accepted only after need, condition, valuation, ownership and documentation checks.</p>
          <Link to="/Contact" className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#002344]/20 px-6 py-3 font-bold text-[#002344]">Offer in-kind support <ArrowRight size={18}/></Link>
        </div>
      </div>
    </section>

    <section className="bg-[#EAF0F6] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.22em] text-[#2d6a4f]">Ready for due diligence</p><h2 className="mt-3 font-serif text-3xl font-bold text-[#002344] md:text-4xl">What a serious funding proposal will include</h2><p className="mt-4 leading-7 text-slate-600">For each opportunity, SSF will prepare a donor-ready proposal rather than send the same generic appeal to every funder.</p></div>
        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {proposalPack.map((item,i)=><div key={item} className="flex gap-3 rounded-2xl bg-white p-5 shadow-sm"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF2EE] text-sm font-black text-[#2d6a4f]">{String(i+1).padStart(2,"0")}</span><p className="text-sm leading-6 text-slate-700">{item}</p></div>)}
        </div>
        <div className="mt-8 rounded-2xl border border-[#C9DDD1] bg-white p-6 md:p-8">
          <div className="flex items-start gap-3"><FileText className="mt-1 shrink-0 text-[#2d6a4f]" size={25}/><div><h3 className="text-xl font-extrabold text-[#002344]">Project-wise funding formats</h3><p className="mt-3 text-sm leading-7 text-slate-600">SSF will maintain separate formats for: (1) CSR project proposal / Expression of Interest, (2) corporate foundation and philanthropic grant request, (3) government scheme application / departmental partnership, (4) bank or MSME finance DPR, (5) individual donor appeal, (6) equipment or material-in-kind request, (7) institutional sponsorship and (8) purchase-order / market-linkage partnership. Each format will contain its own purpose, budget, eligibility, deliverables and reporting terms.</p></div></div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <div><p className="text-xs font-black uppercase tracking-[.22em] text-[#2d6a4f]">Accountability framework</p><h2 className="mt-3 font-serif text-3xl font-bold text-[#002344] md:text-4xl">Every rupee must have a purpose and a record</h2><p className="mt-4 leading-7 text-slate-600">Before accepting a restricted grant, SSF will review the donor agreement, permitted heads, reporting requirements and delivery capacity. Project-wise ledgers, bank trails, invoices, beneficiary records and utilisation reports will be maintained as applicable.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[[ShieldCheck,"Purpose-specific use","Restricted funds will be used only for the approved purpose and budget."],[ClipboardList,"Documented spending","Invoices, vouchers, procurement records and supporting evidence."],[BadgeCheck,"Independent review","Audit, utilisation certificates and donor reporting where required."],[Handshake,"No false promises","No guaranteed grant, tax deduction, job, return or project outcome is advertised."]].map(([Icon,t,d])=><div key={t} className="rounded-2xl border border-slate-200 bg-white p-5"><Icon className="text-[#2d6a4f]" size={24}/><h3 className="mt-3 font-extrabold text-[#002344]">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{d}</p></div>)}
        </div>
      </div>
      <div className="mt-9 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h3 className="font-extrabold text-[#7C3D00]">Important legal and funding conditions</h3>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
          <li>• <strong>CSR:</strong> CSR-1 registration alone does not establish eligibility. The applicable Companies (CSR Policy) Rules require the relevant implementing-agency conditions, including 12A/12AB and 80G approvals for the applicable society/trust route, and other conditions such as track record where relevant. SSF’s current 80G application status must be verified before representing any project as CSR-eligible. No CSR funding is promised or assumed.</li>
          <li>• <strong>80G:</strong> The final approval application is pending as per the Foundation’s currently stated status. Donors must not be promised a deduction unless a valid approval is in force for the donation date and the donation qualifies.</li>
          <li>• <strong>Foreign contributions:</strong> No foreign contribution will be solicited or accepted unless the Foundation first obtains the required FCRA registration or project-specific prior permission and follows the designated banking and reporting rules.</li>
          <li>• <strong>Government grants:</strong> Applications will be made only against live notifications and verified eligibility. A government scheme is not a guaranteed source of funds.</li>
          <li>• <strong>Enterprise finance:</strong> Donations and CSR grants will not be diverted into commercial working capital or business assets. Any enterprise loan, investment or commercial transaction must be separately approved, documented and reviewed for legal and tax compliance.</li>
        </ul>
      </div>
    </section>

    <section className="bg-[#002344] px-5 py-16 text-center text-white md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl"><Handshake className="mx-auto text-[#ffb347]" size={38}/><h2 className="mt-5 font-serif text-3xl font-bold md:text-4xl">Let us build a project together</h2><p className="mt-5 leading-8 text-white/75">Companies, banks, institutions, government departments, philanthropists, industry leaders and citizens are welcome to discuss a defined project, partnership, equipment contribution or institutional requirement.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/Contact" className="inline-flex items-center gap-2 rounded-full bg-[#fb8500] px-6 py-3 font-bold text-[#17212b]">Contact the Foundation <ArrowRight size={18}/></Link><Link to="/Donate" className="rounded-full border border-white/35 px-6 py-3 font-bold hover:bg-white/10">Donate online</Link></div><p className="mt-8 text-xs leading-6 text-white/50">This page explains potential funding and partnership routes. It is not a public offer, sanction letter, guarantee of eligibility or assurance that any grant or finance has been approved. All proposals remain subject to due diligence, approvals and applicable law.</p></div>
    </section>

    <section id="sustainable-livelihood" className="scroll-mt-24">
      <SustainableLivelihoodContent />
    </section>
  </main>;
}
