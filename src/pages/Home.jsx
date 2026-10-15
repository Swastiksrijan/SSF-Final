import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FaArrowRight, FaBookOpen, FaBuilding, FaCheckCircle, FaFileAlt,
  FaGlobeAsia, FaHandshake, FaHeart, FaLeaf, FaUsers, FaLaptop,
  FaGraduationCap, FaShieldAlt, FaNewspaper, FaEnvelope, FaPhoneAlt,
  FaChartLine, FaSeedling
} from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import pageHeader from "../assets/page-header.jpg";

const gold = "#D7B45A";

const focusAreas = [
  { title: "Education & Learning", hi: "शिक्षा एवं सीखना", icon: <FaBookOpen />, path: "/OurInitiatives", text: "Learning opportunities, guidance and educational awareness." },
  { title: "Skills & Livelihoods", hi: "कौशल एवं आजीविका", icon: <FaGraduationCap />, path: "/SkillPrograms", text: "Practical skills, confidence and pathways to self-reliance." },
  { title: "Health & Well-being", hi: "स्वास्थ्य एवं कल्याण", icon: <FaHeart />, path: "/OurInitiatives#health", text: "Health awareness and community-oriented support." },
  { title: "Women & Child Welfare", hi: "महिला एवं बाल कल्याण", icon: <FaUsers />, path: "/OurInitiatives", text: "Dignity, safety, participation and equal opportunity." },
  { title: "Digital Learning", hi: "डिजिटल शिक्षा", icon: <FaLaptop />, path: "/LearningHub", text: "Learning resources and responsible digital awareness." },
  { title: "Environment & Awareness", hi: "पर्यावरण एवं जागरूकता", icon: <FaLeaf />, path: "/OurInitiatives#awareness", text: "Environmental responsibility and public awareness." },
];

const proofItems = [
  { title: "Registration & Legal Identity", text: "Society registration details and legal identity records.", icon: <FaFileAlt /> },
  { title: "Statutory Documents", text: "Available 12AB, CSR-1, PAN and other relevant records.", icon: <FaShieldAlt /> },
  { title: "Audited Accounts & Reports", text: "Financial records and annual documents available for review.", icon: <FaChartLine /> },
];

const activityCards = [
  { image: "/images/real/children-mat-session.jpg", alt: "Children taking part in a learning session", label: "Education", title: "Learning with the community", text: "Explore documented learning activities and education-related initiatives." },
  { image: "/images/women-learning-session.png", alt: "Women participating in a learning and discussion session", label: "Participation", title: "Creating space for participation", text: "See community-focused activities and awareness efforts." },
  { image: "/images/real/tree_plantation.jpg", alt: "Tree plantation activity", label: "Environment", title: "Awareness through action", text: "Explore environmental awareness and related community initiatives." },
];

const pressItems = [
  { image: "/images/real/newspaper-clipping.jpg", alt: "Newspaper clipping documenting an SSF-related activity", label: "Press coverage" },
  { image: "/images/real/news_media_1.jpg", alt: "News coverage of a digital initiative in Rewa", label: "News & media" },
  { image: "/images/real/computer-donation-clipping.jpg", alt: "Newspaper clipping about a computer donation initiative", label: "Documented initiative" },
];

export default function Home() {
  return (
    <main className="w-full overflow-hidden bg-[#fbfaf7] font-sans text-[#17283a]">
      <section className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-[#09233c] py-20 text-white md:min-h-[680px] md:py-24">
        <div className="absolute inset-0 -z-20">
          <OptimizedImage priority src={pageHeader} alt="Community work associated with Swastik Srijan Foundation" className="h-full w-full" />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(5,25,44,0.98)_0%,rgba(5,25,44,0.9)_50%,rgba(5,25,44,0.48)_100%)]" />
        <div className="absolute -right-24 -top-28 -z-10 h-96 w-96 rounded-full border border-[#d7b45a]/30 md:h-[560px] md:w-[560px]" />
        <div className="container mx-auto grid max-w-7xl items-center gap-10 px-5 md:px-10 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d7b45a]/40 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#f0dba5]">
              <FaSeedling /> Registered Society · Since 2013
            </p>
            <p className="mt-6 text-xl font-semibold tracking-wide text-white md:text-2xl">Swastik Srijan Foundation Samiti</p>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
              Service with purpose.<span className="mt-2 block italic text-[#e8c878]">Progress through people.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-100 md:text-xl">
              Working towards inclusive community development through education, skills, health awareness, environmental responsibility and meaningful partnerships.
            </p>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-200">
              शिक्षा, कौशल, स्वास्थ्य-जागरूकता, पर्यावरण संरक्षण और सार्थक साझेदारी के माध्यम से समावेशी सामुदायिक विकास की दिशा में प्रयास।
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/About" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d7b45a] px-6 py-3 font-bold text-[#09233c] transition hover:-translate-y-0.5 hover:bg-[#f0dba5]">Discover SSF <FaArrowRight /></Link>
              <Link to="/CSRPartnership" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#e8c878]/70 px-6 py-3 font-bold text-[#f0dba5] transition hover:bg-white/10">CSR & Institutional Partnerships <FaHandshake /></Link>
              <Link to="/JoinUs" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"><FaUsers /> Join the Mission</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2"><FaCheckCircle className="text-emerald-300" /> 12AB Registered</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2"><FaCheckCircle className="text-emerald-300" /> CSR-1 Registered</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2"><FaFileAlt className="text-[#e8c878]" /> 80G final approval pending</span>
            </div>
          </motion.div>
          <motion.aside initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.1 }} className="hidden lg:block">
            <div className="rounded-[2rem] border border-[#d7b45a]/35 bg-[#071b30]/75 p-7 shadow-2xl backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e8c878]">Institutional Profile</p>
              <h2 className="mt-4 font-serif text-3xl leading-snug">A clear record. An open invitation.</h2>
              <p className="mt-4 leading-relaxed text-slate-200">We invite citizens, volunteers, institutions, CSR teams and public agencies to review our work, explore our priorities and discuss practical collaboration.</p>
              <div className="mt-7 space-y-4 border-t border-white/15 pt-6">
                <div className="flex gap-3"><FaBuilding className="mt-1 shrink-0 text-[#e8c878]" /><div><p className="font-semibold">Registered office</p><p className="text-sm text-slate-300">Rewa, Madhya Pradesh, India</p></div></div>
                <div className="flex gap-3"><FaGlobeAsia className="mt-1 shrink-0 text-[#e8c878]" /><div><p className="font-semibold">Area of work</p><p className="text-sm text-slate-300">Community development across India</p></div></div>
                <div className="flex gap-3"><FaShieldAlt className="mt-1 shrink-0 text-[#e8c878]" /><div><p className="font-semibold">Open documentation</p><p className="text-sm text-slate-300">Registration, statutory records and available reports</p></div></div>
              </div>
              <Link to="/Transparency" className="mt-7 inline-flex items-center gap-2 font-bold text-[#f0dba5] hover:text-white">Review transparency documents <FaArrowRight /></Link>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-7">
        <div className="container mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-2 md:grid-cols-4 md:px-8">
          {[
            ["Since 2013", "Registered society"],
            ["Rewa, MP", "Registered office"],
            ["Across India", "Area of work"],
            ["Open records", "Transparency & reports"],
          ].map(([value, label]) => <div key={label} className="flex items-center gap-3 border-slate-200 sm:px-3 md:border-r last:md:border-r-0"><span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#c6a24e]" /><div><p className="font-serif text-xl font-semibold text-[#10263b]">{value}</p><p className="mt-1 text-sm text-slate-600">{label}</p></div></div>)}
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-9 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f6d2a]">Work & Community · कार्य और समुदाय</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-[#10263b] md:text-5xl">The work matters. So does the evidence.</h2>
            <p className="mt-4 leading-relaxed text-slate-600">Explore documented activities and initiatives. We aim to present our work responsibly, without unsupported impact numbers or promises.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {activityCards.map((item) => <article key={item.title} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-56 overflow-hidden bg-slate-100"><img src={item.image} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-[#09233c]/90 px-3 py-1.5 text-xs font-bold text-white">{item.label}</span></div>
              <div className="p-6"><h3 className="font-serif text-xl font-semibold text-[#10263b]">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p><Link to="/Media" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#8f6d2a]">View documented activities <FaArrowRight /></Link></div>
            </article>)}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/Media" className="inline-flex items-center gap-2 rounded-full border border-[#d7c69e] px-5 py-3 font-bold text-[#775b24] hover:bg-[#f5f1e8]"><FaNewspaper /> Media & Gallery</Link>
            <Link to="/Impact" className="inline-flex items-center gap-2 rounded-full border border-[#d7c69e] px-5 py-3 font-bold text-[#775b24] hover:bg-[#f5f1e8]"><FaChartLine /> Work & Impact</Link>
            <Link to="/Blog" className="inline-flex items-center gap-2 rounded-full border border-[#d7c69e] px-5 py-3 font-bold text-[#775b24] hover:bg-[#f5f1e8]">Stories & Updates <FaArrowRight /></Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f2eee5] px-5 py-16 md:px-8 md:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f6d2a]">In the News · समाचारों में</p><h2 className="mt-3 font-serif text-3xl leading-tight text-[#10263b] md:text-5xl">A documented journey, not just a promise.</h2><p className="mt-4 leading-relaxed text-slate-600">Newspaper coverage and media records can help visitors understand the Foundation’s past initiatives. Open the gallery to explore available records and context.</p></div><Link to="/Media" className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[#10263b] px-5 py-3 font-bold text-white hover:bg-[#1c405f] md:self-auto">Explore media archive <FaArrowRight /></Link></div>
          <div className="grid gap-5 sm:grid-cols-3">
            {pressItems.map((item) => <Link to="/Media" key={item.image} className="group overflow-hidden rounded-2xl border border-[#dfd5c1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-56 items-center justify-center overflow-hidden bg-white p-3"><img src={item.image} alt={item.alt} loading="lazy" className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]" /></div><div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-4"><span className="font-semibold text-[#10263b]">{item.label}</span><FaArrowRight className="shrink-0 text-[#8f6d2a]" /></div></Link>)}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-8 md:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-9 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f6d2a]">Our Focus Areas · हमारे कार्यक्षेत्र</p><h2 className="mt-3 font-serif text-3xl leading-tight text-[#10263b] md:text-5xl">Where we focus our efforts</h2><p className="mt-4 leading-relaxed text-slate-600">These areas reflect the Foundation’s broad objectives. Individual activities and programmes are developed according to community needs, resources and partnerships.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((item) => <Link to={item.path} key={item.title} className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#c6a24e] hover:shadow-lg"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f5f1e8] text-xl text-[#8f6d2a] group-hover:bg-[#102b43] group-hover:text-[#f0dba5]">{item.icon}</span><span className="min-w-0"><span className="block font-bold text-[#10263b]">{item.title}</span><span className="mt-1 block text-sm font-medium text-[#8f6d2a]">{item.hi}</span><span className="mt-3 block text-sm leading-relaxed text-slate-600">{item.text}</span><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8f6d2a]">Explore <FaArrowRight className="transition group-hover:translate-x-1" /></span></span></Link>)}
          </div>
          <div className="mt-6"><Link to="/Objectives" className="inline-flex items-center gap-2 font-bold text-[#8f6d2a] hover:text-[#10263b]">View all registered objectives <FaArrowRight /></Link></div>
        </div>
      </section>

      <section className="bg-[#09233c] px-5 py-16 text-white md:px-8 md:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-9 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e8c878]">Work Together · साथ मिलकर</p><h2 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">Partnership starts with a conversation.</h2><p className="mt-4 leading-relaxed text-slate-200">For CSR teams, government departments, institutions and community partners, we welcome an initial discussion to explore needs, project scope, compliance requirements and practical ways to work together.</p></div>
          <div className="grid gap-4 md:grid-cols-3">
            <Link to="/CSRPartnership" className="group rounded-2xl border border-white/15 bg-white/[0.06] p-6 transition hover:border-[#d7b45a]/60 hover:bg-white/[0.1]"><FaHandshake className="text-2xl text-[#e8c878]" /><h3 className="mt-4 text-xl font-bold">CSR & Corporate Partners</h3><p className="mt-3 text-sm leading-relaxed text-slate-200">Explore institutional collaboration, proposal discussions and relevant documents.</p><span className="mt-5 inline-flex items-center gap-2 font-bold text-[#f0dba5]">Explore partnerships <FaArrowRight /></span></Link>
            <Link to="/UpcomingProjects" className="group rounded-2xl border border-white/15 bg-white/[0.06] p-6 transition hover:border-[#d7b45a]/60 hover:bg-white/[0.1]"><FaBuilding className="text-2xl text-[#e8c878]" /><h3 className="mt-4 text-xl font-bold">Projects & Proposals</h3><p className="mt-3 text-sm leading-relaxed text-slate-200">Review planned initiatives and discuss a project with a clear scope and implementation plan.</p><span className="mt-5 inline-flex items-center gap-2 font-bold text-[#f0dba5]">Explore initiatives <FaArrowRight /></span></Link>
            <Link to="/JoinUs" className="group rounded-2xl border border-white/15 bg-white/[0.06] p-6 transition hover:border-[#d7b45a]/60 hover:bg-white/[0.1]"><FaUsers className="text-2xl text-[#e8c878]" /><h3 className="mt-4 text-xl font-bold">Volunteers & Community</h3><p className="mt-3 text-sm leading-relaxed text-slate-200">Contribute time, professional skills, local knowledge or responsible support.</p><span className="mt-5 inline-flex items-center gap-2 font-bold text-[#f0dba5]">Find your role <FaArrowRight /></span></Link>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-slate-300">Listing a proposed initiative does not mean it is funded, approved or currently operational. Project commitments are made only after scope, resources and responsibilities are agreed.</p>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-20">
        <div className="container mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f6d2a]">Trust & Transparency · पारदर्शिता</p><h2 className="mt-3 font-serif text-3xl leading-tight text-[#10263b] md:text-4xl">Trust should be supported by records.</h2><p className="mt-4 leading-relaxed text-slate-600">Review available documents and institutional information before deciding to donate, partner or participate.</p><Link to="/Transparency" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#10263b] px-6 py-3 font-bold text-white hover:bg-[#1c405f]">Open Transparency Centre <FaArrowRight /></Link></div>
          <div className="grid gap-4 sm:grid-cols-3">{proofItems.map((item) => <div key={item.title} className="rounded-2xl border border-[#e1d5b9] bg-white p-5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f1e8] text-lg text-[#8f6d2a]">{item.icon}</span><h3 className="mt-4 font-bold text-[#10263b]">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p><Link to="/Transparency" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8f6d2a]">View records <FaArrowRight /></Link></div>)}</div>
        </div>
      </section>

      <section className="bg-[#f2eee5] px-5 py-16 md:px-8 md:py-20">
        <div className="container mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="mx-auto h-44 w-44 overflow-hidden rounded-full border-4 border-[#d7b45a] bg-white p-1 shadow-lg lg:mx-0"><OptimizedImage src="/Teams_Images/ramesh_pandey.jpg?v=2" alt="Ramesh Pandey, Founder and President of Swastik Srijan Foundation" className="h-full w-full rounded-full" /></div>
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f6d2a]">A message from the Founder</p><h2 className="mt-3 font-serif text-3xl text-[#10263b] md:text-4xl">Ramesh Pandey <span className="block mt-1 text-lg font-sans font-semibold text-slate-600">Founder & President</span></h2><blockquote className="mt-5 border-l-2 border-[#c6a24e] pl-5 font-serif text-xl leading-relaxed text-[#10263b] md:text-2xl">“Service becomes meaningful when it reaches people with dignity, cooperation and hope.”</blockquote><p className="mt-5 max-w-3xl leading-relaxed text-slate-600">Our journey began with a belief that positive change grows when people come together, learn together and take responsible action. We invite citizens, volunteers, institutions and partners to review our work and help shape practical, accountable community initiatives.</p><Link to="/About" className="mt-5 inline-flex items-center gap-2 font-bold text-[#8f6d2a]">Read about SSF <FaArrowRight /></Link></div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 md:px-8">
        <div className="container mx-auto flex max-w-7xl flex-col gap-6 rounded-[1.75rem] border border-[#e1d5b9] bg-[#fbfaf7] p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f6d2a]">Take the next step</p><h2 className="mt-3 font-serif text-3xl text-[#10263b] md:text-4xl">Every meaningful partnership starts somewhere.</h2><p className="mt-3 leading-relaxed text-slate-600">Explore the work, ask a question, volunteer a skill or start a conversation about collaboration.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Link to="/JoinUs" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#10263b] px-6 py-3 font-bold text-white hover:bg-[#1c405f]"><FaUsers /> Join SSF</Link><Link to="/PartnerWithUs" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#c6a24e] px-6 py-3 font-bold text-[#775b24] hover:bg-[#f5f1e8]"><FaHandshake /> Partner with us</Link><Link to="/Donate" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 font-bold text-[#10263b] hover:bg-white"><FaHeart /> Support SSF</Link></div>
        </div>
      </section>
    </main>
  );
}
