import { Link } from "@tanstack/react-router";
import { motion as Motion } from "framer-motion";
import {
  FaArrowRight, FaBookOpen, FaBuilding, FaFileAlt,
  FaHandshake, FaHeart, FaLeaf, FaUsers, FaLaptop,
  FaGraduationCap, FaShieldAlt, FaNewspaper, FaChartLine, FaSeedling,
  FaBullseye, FaHandsHelping, FaCompass
} from "react-icons/fa";
import FloatingTicker from "../components/FloatingTicker";
import ImpactTimeline from "../components/ImpactTimeline";
import EliteDonationCard from "../components/EliteDonationCard";
import OptimizedImage from "../components/OptimizedImage";
import TrustCredentials from "../components/TrustCredentials";
import { CONTACT_INFO } from "../config/contact";
import { BRAND } from "../data/brandAssets";
import pageHeader from "../assets/page-header.jpg";

const values = [
  { title: "Integrity", hi: "ईमानदारी", text: "Act responsibly and communicate truthfully." },
  { title: "Dignity", hi: "गरिमा", text: "Respect every person without discrimination." },
  { title: "Inclusion", hi: "समावेशिता", text: "Encourage participation and equal opportunity." },
  { title: "Accountability", hi: "जवाबदेही", text: "Value transparency and responsible use of resources." },
];

const focusAreas = [
  { title: "Education & Learning", hi: "शिक्षा एवं सीखना", image: "/images/real/children-mat-session.jpg", icon: <FaBookOpen />, path: "/OurInitiatives", text: "Learning opportunities, guidance and educational awareness." },
  { title: "Skills & Livelihoods", hi: "कौशल एवं आजीविका", image: "/images/real/women_empowerment_tailoring.jpg", icon: <FaGraduationCap />, path: "/SkillPrograms", text: "Practical skills, confidence and pathways to self-reliance." },
  { title: "Health & Well-being", hi: "स्वास्थ्य एवं कल्याण", image: "/images/real/vision-health-camp.jpg", icon: <FaHeart />, path: "/OurInitiatives#health", text: "Health awareness and community-oriented support." },
  { title: "Women & Child Welfare", hi: "महिला एवं बाल कल्याण", image: "/images/real/women_community_meeting.jpg", icon: <FaUsers />, path: "/OurInitiatives", text: "Dignity, safety, participation and equal opportunity." },
  { title: "Digital Learning", hi: "डिजिटल शिक्षा", image: "/images/real/computer-donation-clean-v2.png", icon: <FaLaptop />, path: "/LearningHub", text: "Learning resources and responsible digital awareness." },
  { title: "Environment & Awareness", hi: "पर्यावरण एवं जागरूकता", image: "/images/real/tree_plantation.jpg", icon: <FaLeaf />, path: "/OurInitiatives#awareness", text: "Environmental responsibility and public awareness." },
];

const proofItems = [
  { title: "Registration & Legal Identity", text: "Society registration details and legal identity records.", icon: <FaFileAlt /> },
  { title: "Statutory Documents", text: "Available 12AB, CSR-1, PAN and other relevant records.", icon: <FaShieldAlt /> },
  { title: "Audited Accounts & Reports", text: "Financial records and annual documents available for review.", icon: <FaChartLine /> },
];

const activityCards = [
  { image: "/images/real/children-mat-session.jpg", alt: "Children taking part in a learning session", label: "Education", title: "Learning with the community", text: "Explore documented learning activities and education-related initiatives." },
  { image: "/images/real/women_empowerment_tailoring.jpg", alt: "Women taking part in a skills and livelihood activity", label: "Women & Skills", title: "Skills, confidence and participation", text: "Explore community-focused activities and awareness efforts." },
  { image: "/images/real/tree_plantation.jpg", alt: "Tree plantation activity", label: "Environment", title: "Awareness through action", text: "Explore environmental awareness and related community initiatives." },
];

const pressItems = [
  { image: "/images/real/newspaper-clipping.jpg", alt: "Newspaper clipping documenting an SSF-related activity", label: "Press coverage" },
  { image: "/images/real/news_media_1.jpg", alt: "News coverage of a digital initiative in Rewa", label: "News & media" },
  { image: "/images/real/online-food-support-clipping.jpg", alt: "Newspaper clipping about an online food support initiative", label: "Community relief" },
];


const communityPhotoStrip = [
  { src: "/images/real/children-playing-circle.jpg", alt: "Children learning and playing together", label: "Learning" },
  { src: "/images/real/women_community_meeting.jpg", alt: "Women at a community meeting", label: "Participation" },
  { src: "/images/real/health-center-visit.jpg", alt: "Community health visit", label: "Health awareness" },
  { src: "/images/real/tree_planting_2.jpg", alt: "Tree planting activity", label: "Environment" },
  { src: "/images/real/stationery-distribution.jpg", alt: "Educational stationery distribution", label: "Education support" },
  { src: "/images/real/ssf_event_members.jpg", alt: "Swastik Srijan Foundation members at an event", label: "Our community" },
  { src: "/images/real/computer-donation-clean-v2.png", alt: "Documented computer donation initiative", label: "Digital access" },
  { src: "/images/real/community-education-meeting.jpg", alt: "Community education meeting", label: "Community work" },
];

export default function Home() {
  return (
    <main className="w-full overflow-hidden bg-[#FAF9F5] font-sans text-[#26343D] antialiased selection:bg-[#F7A814]/30">
      <section className="relative isolate flex min-h-[650px] items-center overflow-hidden bg-[#092744] py-16 text-white sm:min-h-[680px] md:min-h-[740px] md:py-24">
        <div className="absolute inset-0 -z-20">
          <OptimizedImage priority src={pageHeader} alt="Swastik Srijan Foundation community work" className="h-full w-full" />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgba(5,25,47,0.94)_0%,rgba(9,39,68,0.83)_42%,rgba(18,52,90,0.46)_72%,rgba(18,52,90,0.24)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_48%,rgba(247,168,20,0.12),transparent_34%),linear-gradient(0deg,rgba(4,20,37,0.62)_0%,transparent_58%)]" />
        <div className="absolute -right-36 -top-28 -z-10 h-96 w-96 rounded-full border border-[#F7A814]/25 shadow-[0_0_0_36px_rgba(247,168,20,0.035),0_0_0_76px_rgba(247,168,20,0.025)] md:right-[-8rem] md:top-[-7rem] md:h-[680px] md:w-[680px]" />
        <div className="container mx-auto grid max-w-7xl items-center gap-10 px-5 md:px-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
          <Motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl motion-reduce:transform-none">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#F7A814]/45 bg-white/[0.08] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FFD277] shadow-lg shadow-black/10 backdrop-blur-md sm:text-xs lg:hidden">
              <FaSeedling /> Registered Society · Since 2013
            </p>
            <p className="mt-7 text-lg font-semibold tracking-[0.025em] text-white/95 sm:text-xl md:text-2xl">Swastik Srijan Foundation Samiti</p>
            <p className="mt-3 pl-1 font-hindi text-base font-medium leading-relaxed text-white/85 sm:pl-8 sm:text-lg md:text-xl">सहयोग <span className="px-1 text-[#F7A814]">•</span> कौशल <span className="px-1 text-[#F7A814]">•</span> जागरूकता <span className="px-1 text-[#F7A814]">•</span> सृजन</p>
            <h1 className="mt-6 max-w-4xl font-serif text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl md:text-7xl lg:text-[5.4rem]">
              Creating Change.<span className="mt-2 block italic text-[#F7A814]">Inspiring Lives.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/90 sm:text-lg md:text-xl md:leading-9">
              Working towards inclusive community development through education, skills, health awareness, environmental responsibility and meaningful partnerships.
            </p>
            <p className="mt-4 max-w-2xl font-hindi text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              शिक्षा, कौशल, स्वास्थ्य-जागरूकता, पर्यावरण संरक्षण और सार्थक साझेदारी के माध्यम से समावेशी सामुदायिक विकास की दिशा में प्रयास।
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={CONTACT_INFO.social.razorpay} target="_blank" rel="noopener noreferrer" className="ssf-nav-donate inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 font-black shadow-lg shadow-black/15 transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD277]"><FaHeart /> Donate Now</a>
              <Link to="/About" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#176447] to-[#21845D] px-6 py-3 font-bold text-white shadow-lg shadow-[#176447]/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#176447]/25">Discover SSF <FaArrowRight /></Link>
              <Link to="/CSRPartnership" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#F7A814]/70 px-6 py-3 font-bold text-[#F7A814] transition hover:bg-white/10">CSR & Institutional Partnerships <FaHandshake /></Link>
              <Link to="/JoinUs" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"><FaUsers /> Join the Mission</Link>
            </div>
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2.5 text-xs font-semibold leading-6 text-white/85 sm:text-sm">
              <span>12AB Registered</span>
              <span className="text-[#F7A814]" aria-hidden="true">|</span>
              <span>80G Provisional Approval - Final Approval Applied</span>
              <span className="text-[#F7A814]" aria-hidden="true">|</span>
              <span>CSR-1 Registered</span>
              <span className="text-[#F7A814]" aria-hidden="true">|</span>
              <span>NGO Darpan • NITI Aayog</span>
            </p>
          </Motion.div>

          <Motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative hidden min-h-[560px] flex-col items-end justify-between lg:flex lg:self-stretch">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#F7A814]/45 bg-white/[0.08] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FFD277] shadow-lg shadow-black/10 backdrop-blur-md sm:text-xs">
              <FaSeedling /> Registered Society · Since 2013
            </p>
            <div className="relative w-full max-w-sm rounded-[1.75rem] border border-white/15 bg-white/[0.07] p-7 shadow-2xl shadow-black/10 backdrop-blur-xl lg:pb-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#F7A814]">Our Purpose</p>
            <p className="mt-5 font-serif text-3xl leading-snug text-white xl:text-4xl">Service with purpose.</p>
            <p className="mt-2 font-serif text-3xl italic leading-snug text-[#FFD277] xl:text-4xl">Progress through people.</p>
            </div>
          </Motion.div>
        </div>
      </section>

      <FloatingTicker />

      <TrustCredentials />

      <section className="relative border-y border-[#12345A]/10 bg-gradient-to-br from-white via-[#EAF0F6] to-[#F7F3E8] py-8 shadow-[0_22px_46px_-36px_rgba(18,52,90,0.45)] md:py-10">
        <div className="container mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
          {[
            [FaShieldAlt, "Since 2013", "Registered society"],
            [FaBuilding, "Rewa, MP", "Registered office"],
            [FaCompass, "Across India", "Area of work"],
            [FaFileAlt, "Open records", "Transparency & reports"],
          ].map(([Icon, value, label]) => <div key={label} className="group relative overflow-hidden rounded-2xl border border-[#12345A]/10 bg-white/90 py-5 pl-5 pr-14 shadow-[0_14px_34px_-28px_rgba(18,52,90,0.6)] transition duration-300 hover:-translate-y-1 hover:border-[#F7A814]/60 hover:shadow-[0_22px_42px_-25px_rgba(18,52,90,0.28)]"><span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-[#F7A814]" /><span aria-hidden="true" className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#EAF0F6] text-[#12345A]"><Icon className="text-sm" /></span><p className="font-serif text-xl font-semibold text-[#12345A]">{value}</p><p className="mt-1 text-sm text-[#26343D]/75">{label}</p></div>)}
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#12345A]">Work & Community · कार्य और समुदाय</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-[1.12] tracking-tight text-[#12345A] md:text-5xl">The work matters. So does the evidence.</h2>
            <p className="mt-4 leading-relaxed text-slate-600">Explore documented activities and initiatives. We aim to present our work responsibly, without unsupported impact numbers or promises.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {activityCards.map((item) => <article key={item.title} className="group overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white shadow-[0_12px_38px_-30px_rgba(18,52,90,0.55)] transition duration-300 hover:-translate-y-1.5 hover:border-[#F7A814]/50 hover:shadow-[0_26px_60px_-30px_rgba(18,52,90,0.35)]">
              <div className="relative h-56 overflow-hidden bg-slate-100 sm:h-64"><img src={item.image} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-[#12345A]/90 px-3 py-1.5 text-xs font-bold text-white">{item.label}</span></div>
              <div className="p-6 md:p-7"><h3 className="font-serif text-xl font-semibold text-[#12345A]">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p><Link to="/Media" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#12345A]">View documented activities <FaArrowRight /></Link></div>
            </article>)}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/Media" className="inline-flex items-center gap-2 rounded-full border border-[#12345A]/20 bg-white px-5 py-3 font-bold text-[#12345A] transition hover:-translate-y-0.5 hover:border-[#F7A814] hover:bg-[#EAF0F6]"><FaNewspaper /> Media & Gallery</Link>
            <Link to="/Impact" className="inline-flex items-center gap-2 rounded-full border border-[#12345A]/20 bg-white px-5 py-3 font-bold text-[#12345A] transition hover:-translate-y-0.5 hover:border-[#F7A814] hover:bg-[#EAF0F6]"><FaChartLine /> Work & Impact</Link>
            <Link to="/Blog" className="inline-flex items-center gap-2 rounded-full border border-[#12345A]/20 bg-white px-5 py-3 font-bold text-[#12345A] transition hover:-translate-y-0.5 hover:border-[#F7A814] hover:bg-[#EAF0F6]">Stories & Updates <FaArrowRight /></Link>
          </div>
        </div>
      </section>


      <section className="border-y border-[#EAF0F6] bg-white px-5 py-16 md:px-8 md:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#12345A]">Glimpses of SSF · संस्था की झलकियाँ</p>
            <h2 className="mt-3 font-serif text-3xl text-[#12345A] md:text-4xl">Real moments. Shared purpose.</h2>
            <p className="mt-3 text-slate-600">शिक्षा, सहभागिता, जागरूकता और सेवा से जुड़ी संस्था की तस्वीरें।</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4 lg:grid-cols-8">
            {communityPhotoStrip.map((item) => <Link to="/Media" key={item.src} className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1">
              <span className="relative block h-24 w-24 overflow-hidden rounded-full border-[3px] border-[#F7A814] bg-[#EAF0F6] p-1 shadow-[0_8px_24px_-12px_rgba(18,52,90,0.5)] transition duration-300 group-hover:border-[#12345A] group-hover:shadow-xl sm:h-28 sm:w-28 md:h-32 md:w-32">
                <img src={item.src} alt={item.alt} loading="lazy" className="h-full w-full rounded-full object-cover" />
              </span>
              <span className="mt-3 text-sm font-semibold text-[#12345A]">{item.label}</span>
            </Link>)}
          </div>
          <div className="mt-8 text-center"><Link to="/Media" className="inline-flex items-center gap-2 rounded-full border border-[#12345A]/20 bg-white px-5 py-3 font-bold text-[#12345A] transition hover:-translate-y-0.5 hover:border-[#F7A814] hover:bg-[#EAF0F6]">सभी तस्वीरें और समाचार देखें <FaArrowRight /></Link></div>
        </div>
      </section>


      <section className="bg-gradient-to-br from-[#EAF0F6] via-[#F1F5F8] to-white px-5 py-20 md:px-8 md:py-28">
        <div className="container mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#12345A]">Impact & Accountability • प्रभाव एवं जवाबदेही</p><h2 className="mt-4 font-serif text-3xl font-semibold leading-[1.12] tracking-tight text-[#12345A] md:text-5xl">Show the work. Share the learning.</h2><p className="mt-5 leading-relaxed text-slate-600">Institutional trust grows when activities, stories, reports and progress are shared responsibly. Explore SSF’s available updates and documented journey.</p><p className="mt-4 text-sm leading-relaxed text-slate-600">Only verified project results and supported figures should be presented as impact metrics.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Impact & Outcomes", hi: "प्रभाव एवं परिणाम", text: "Explore available impact information and project outcomes.", path: "/Impact", icon: <FaBullseye /> },
              { title: "Stories & Activities", hi: "कहानियाँ एवं गतिविधियाँ", text: "Discover community stories, activities and updates.", path: "/Stories", icon: <FaHeart /> },
              { title: "Service Journey", hi: "सेवा यात्रा", text: "Learn about SSF’s institutional journey since 2013.", path: "/Journey", icon: <FaCompass /> },
              { title: "Media & Updates", hi: "मीडिया एवं अपडेट", text: "Find available media, announcements and information.", path: "/Media", icon: <FaLaptop /> },
            ].map((item) => <Link key={item.title} to={item.path} className="group rounded-2xl border border-[#EAF0F6] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg md:p-6"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF0F6] text-lg text-[#12345A]">{item.icon}</span><h3 className="mt-4 font-bold text-[#12345A]">{item.title}</h3><p className="mt-1 text-sm text-[#12345A]">{item.hi}</p><p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#12345A]">Explore <FaArrowRight /></span></Link>)}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#EAF0F6] via-[#F1F5F8] to-white px-5 py-20 md:px-8 md:py-28">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#12345A]">In the News · समाचारों में</p><h2 className="mt-4 font-serif text-3xl font-semibold leading-[1.12] tracking-tight text-[#12345A] md:text-5xl">A documented journey, not just a promise.</h2><p className="mt-4 leading-relaxed text-slate-600">Newspaper coverage and media records can help visitors understand the Foundation’s past initiatives. Open the gallery to explore available records and context.</p></div><Link to="/Media" className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[#12345A] px-5 py-3 font-bold text-white shadow-md shadow-[#12345A]/15 transition hover:-translate-y-0.5 hover:bg-[#092744] md:self-auto">Explore media archive <FaArrowRight /></Link></div>
          <div className="grid gap-5 sm:grid-cols-3">
            {pressItems.map((item) => <Link to="/Media" key={item.image} className="group overflow-hidden rounded-[1.35rem] border border-[#EAF0F6] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#F7A814]/50 hover:shadow-xl"><div className="flex h-56 items-center justify-center overflow-hidden bg-white p-3"><img src={item.image} alt={item.alt} loading="lazy" className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]" /></div><div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-4"><span className="font-semibold text-[#12345A]">{item.label}</span><FaArrowRight className="shrink-0 text-[#12345A]" /></div></Link>)}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:px-8 md:py-28">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-9 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#12345A]">Our Focus Areas · हमारे कार्यक्षेत्र</p><h2 className="mt-4 font-serif text-3xl font-semibold leading-[1.12] tracking-tight text-[#12345A] md:text-5xl">Where we focus our efforts</h2><p className="mt-4 leading-relaxed text-slate-600">These areas reflect the Foundation’s broad objectives. Individual activities and programmes are developed according to community needs, resources and partnerships.</p></div>
            <figure className="mx-auto w-full max-w-sm">
              <img src={BRAND.focusWheel} alt="Diagram of the Foundation's focus areas" loading="lazy" className="w-full" />
              <figcaption className="mt-3 text-center text-xs font-semibold text-slate-500">The Foundation&apos;s focus areas · कार्यक्षेत्र</figcaption>
            </figure>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((item) => <Link to={item.path} key={item.title} className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#F7A814] hover:shadow-lg"><span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[#F7A814] bg-white shadow-sm"><img src={item.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-110" /></span><span className="min-w-0"><span className="block font-bold text-[#12345A]">{item.title}</span><span className="mt-1 block text-sm font-medium text-[#12345A]">{item.hi}</span><span className="mt-3 block text-sm leading-relaxed text-slate-600">{item.text}</span><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#12345A]">Explore <FaArrowRight className="transition group-hover:translate-x-1" /></span></span></Link>)}
          </div>
          <div className="mt-6"><Link to="/Objectives" className="inline-flex items-center gap-2 font-bold text-[#12345A] hover:text-[#12345A]">View all registered objectives <FaArrowRight /></Link></div>
        </div>
      </section>


      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#12345A] md:text-sm">Purpose & Direction • उद्देश्य एवं दिशा</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-[#12345A] md:text-5xl">A clear purpose. A shared future.</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">SSF’s mission and vision guide the work, partnerships and choices we make.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="relative overflow-hidden rounded-[1.75rem] border border-[#EAF0F6] bg-white p-7 shadow-[0_20px_60px_-38px_rgba(18,52,90,0.35)] md:p-10">
              <span className="absolute right-6 top-2 font-serif text-8xl text-[#EAF0F6]">“</span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#12345A]">Our Mission • हमारा मिशन</p>
              <h3 className="relative mt-5 max-w-xl font-serif text-2xl leading-snug text-[#12345A] md:text-3xl">To contribute to inclusive development through education, skills, health, awareness and community participation.</h3>
              <p className="mt-5 max-w-xl leading-relaxed text-slate-600">शिक्षा, कौशल, स्वास्थ्य, जागरूकता और सामुदायिक सहभागिता के माध्यम से समावेशी विकास में योगदान देना।</p>
              <Link to="/Mission" className="mt-7 inline-flex items-center gap-2 font-bold text-[#12345A] hover:text-[#12345A]">Explore our mission <FaArrowRight /></Link>
            </article>
            <article className="relative overflow-hidden rounded-[1.75rem] border border-[#12345A] bg-[linear-gradient(145deg,#12345A_0%,#092744_100%)] p-7 text-white shadow-[0_24px_60px_-35px_rgba(18,52,90,0.65)] md:p-10">
              <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full border border-[#F7A814]/25" />
              <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-[#F7A814]">Our Vision • हमारा विज़न</p>
              <h3 className="relative mt-5 max-w-xl font-serif text-2xl leading-snug md:text-3xl">A just, educated, inclusive and sustainable India where every individual has the opportunity to thrive with dignity.</h3>
              <p className="relative mt-5 max-w-xl leading-relaxed text-slate-200">एक न्यायपूर्ण, शिक्षित, समावेशी और सतत भारत, जहाँ प्रत्येक व्यक्ति को गरिमा के साथ आगे बढ़ने का अवसर मिले।</p>
              <Link to="/Vision" className="relative mt-7 inline-flex items-center gap-2 font-bold text-[#F7A814] hover:text-white">Explore our vision <FaArrowRight /></Link>
            </article>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => <div key={value.title} className="rounded-2xl border border-[#E5EAF0] bg-white/80 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"><p className="font-bold text-[#12345A]">{value.title}</p><p className="mt-1 text-sm font-semibold text-[#12345A]">{value.hi}</p><p className="mt-3 text-sm leading-relaxed text-slate-600">{value.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(247,168,20,0.12),transparent_35%),linear-gradient(135deg,#092744_0%,#12345A_58%,#0E3C51_100%)] px-5 py-20 text-white md:px-8 md:py-28">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F7A814]">Work Together · साथ मिलकर</p><h2 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">Partnership starts with a conversation.</h2><p className="mt-4 leading-relaxed text-slate-200">For CSR teams, government departments, institutions and community partners, we welcome an initial discussion to explore needs, project scope, compliance requirements and practical ways to work together.</p></div>
          <div className="grid gap-4 md:grid-cols-3">
            <Link to="/CSRPartnership" className="group rounded-[1.35rem] border border-white/15 bg-white/[0.055] p-6 shadow-lg shadow-black/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#F7A814]/65 hover:bg-white/[0.09] hover:shadow-xl md:p-7"><FaHandshake className="text-2xl text-[#F7A814]" /><h3 className="mt-4 text-xl font-bold">CSR & Corporate Partners</h3><p className="mt-3 text-sm leading-relaxed text-slate-200">Explore institutional collaboration, proposal discussions and relevant documents.</p><span className="mt-5 inline-flex items-center gap-2 font-bold text-[#F7A814]">Explore partnerships <FaArrowRight /></span></Link>
            <Link to="/UpcomingProjects" className="group rounded-[1.35rem] border border-white/15 bg-white/[0.055] p-6 shadow-lg shadow-black/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#F7A814]/65 hover:bg-white/[0.09] hover:shadow-xl md:p-7"><FaBuilding className="text-2xl text-[#F7A814]" /><h3 className="mt-4 text-xl font-bold">Projects & Proposals</h3><p className="mt-3 text-sm leading-relaxed text-slate-200">Review planned initiatives and discuss a project with a clear scope and implementation plan.</p><span className="mt-5 inline-flex items-center gap-2 font-bold text-[#F7A814]">Explore initiatives <FaArrowRight /></span></Link>
            <Link to="/JoinUs" className="group rounded-[1.35rem] border border-white/15 bg-white/[0.055] p-6 shadow-lg shadow-black/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#F7A814]/65 hover:bg-white/[0.09] hover:shadow-xl md:p-7"><FaUsers className="text-2xl text-[#F7A814]" /><h3 className="mt-4 text-xl font-bold">Volunteers & Community</h3><p className="mt-3 text-sm leading-relaxed text-slate-200">Contribute time, professional skills, local knowledge or responsible support.</p><span className="mt-5 inline-flex items-center gap-2 font-bold text-[#F7A814]">Find your role <FaArrowRight /></span></Link>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-slate-300">Listing a proposed initiative does not mean it is funded, approved or currently operational. Project commitments are made only after scope, resources and responsibilities are agreed.</p>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="container mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#12345A]">Trust & Transparency · पारदर्शिता</p><h2 className="mt-3 font-serif text-3xl leading-tight text-[#12345A] md:text-4xl">Trust should be supported by records.</h2><p className="mt-4 leading-relaxed text-slate-600">Review available documents and institutional information before deciding to donate, partner or participate.</p><Link to="/Transparency" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#12345A] px-6 py-3 font-bold text-white shadow-md shadow-[#12345A]/15 transition hover:-translate-y-0.5 hover:bg-[#092744]">Open Transparency Centre <FaArrowRight /></Link></div>
          <div className="grid gap-4 sm:grid-cols-3">{proofItems.map((item) => <div key={item.title} className="rounded-2xl border border-[#EAF0F6] bg-white p-5 shadow-[0_10px_32px_-28px_rgba(18,52,90,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-lg"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF0F6] text-lg text-[#12345A]">{item.icon}</span><h3 className="mt-4 font-bold text-[#12345A]">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p><Link to="/Transparency" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#12345A]">View records <FaArrowRight /></Link></div>)}</div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#EAF0F6] via-[#F1F5F8] to-white px-5 py-20 md:px-8 md:py-28">
        <div className="container mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="mx-auto h-44 w-44 overflow-hidden rounded-full border-4 border-[#F7A814] bg-white p-1 shadow-lg lg:mx-0"><OptimizedImage src="/Teams_Images/ramesh_pandey.jpg?v=2" alt="Ramesh Pandey, Founder and President of Swastik Srijan Foundation" className="h-full w-full rounded-full" /></div>
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#12345A]">A message from the Founder</p><h2 className="mt-3 font-serif text-3xl text-[#12345A] md:text-4xl">Ramesh Pandey <span className="block mt-1 text-lg font-sans font-semibold text-slate-600">Founder & President</span></h2><blockquote className="mt-5 border-l-2 border-[#F7A814] pl-5 font-serif text-xl leading-relaxed text-[#12345A] md:text-2xl">“Service becomes meaningful when it reaches people with dignity, cooperation and hope.”</blockquote><p className="mt-5 max-w-3xl leading-relaxed text-slate-600">Our journey began with a belief that positive change grows when people come together, learn together and take responsible action. We invite citizens, volunteers, institutions and partners to review our work and help shape practical, accountable community initiatives.</p><Link to="/About" className="mt-5 inline-flex items-center gap-2 font-bold text-[#12345A]">Read about SSF <FaArrowRight /></Link></div>
        </div>
      </section>


      <section className="bg-[#12345A] px-5 py-16 md:px-8 md:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#F7A814] md:text-sm">Get Involved · जुड़िए</p><h2 className="mt-3 font-serif text-3xl text-white md:text-5xl">Be Part of the Journey</h2><p className="mt-4 leading-relaxed text-slate-100">आज Swastik Srijan Foundation से जुड़िए। आपके लिए जुड़ने का एक रास्ता है — अपनी भूमिका चुनिए।</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "MEMBER", hi: "सदस्य बनें", text: "मैं Swastik Srijan Foundation की यात्रा का हिस्सा बनना चाहता हूँ।", path: "/JoinUs?role=member", icon: <FaUsers /> },
              { title: "VOLUNTEER", hi: "स्वयंसेवक बनें", text: "मेरे पास समय / skill है, मैं काम करना चाहता हूँ।", path: "/JoinUs?role=volunteer", icon: <FaHandsHelping /> },
              { title: "SUPPORTER / DONOR", hi: "सहयोगकर्ता / दानदाता", text: "मैं किसी अच्छे काम को support करना चाहता हूँ।", path: "/Donate", icon: <FaHeart /> },
              { title: "PARTNER", hi: "साझेदार बनें", text: "मेरी संस्था / company / institution Swastik Srijan Foundation के साथ काम कर सकती है।", path: "/PartnerWithUs", icon: <FaHandshake /> },
            ].map((item) => <Link key={item.title} to={item.path} className="group flex h-full flex-col rounded-[1.35rem] border border-white/15 bg-white/[0.055] p-6 shadow-lg shadow-black/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#F7A814]/65 hover:bg-white/[0.1] hover:shadow-2xl md:p-7"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7A814]/10 text-xl text-[#F7A814]">{item.icon}</span><h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3><p className="mt-1 text-sm text-[#F7A814]">{item.hi}</p><p className="mt-3 flex-1 leading-relaxed text-slate-200">{item.text}</p><span className="mt-5 inline-flex items-center gap-2 font-bold text-[#F7A814]">JOIN / EXPLORE <FaArrowRight /></span></Link>)}
          </div>
        </div>
      </section>
      <section className="bg-white px-5 py-12 md:px-8"><div className="container mx-auto max-w-7xl"><div className="mb-8 text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#12345A]">Support SSF • सहयोग करें</p><h2 className="mt-2 font-serif text-3xl text-[#12345A] md:text-4xl">Help meaningful work move forward.</h2></div><EliteDonationCard /></div></section>
      <section className="bg-gradient-to-b from-[#FAF9F5] to-white px-5 py-20 md:px-8 md:py-28"><div className="container mx-auto max-w-7xl"><div className="mb-10 text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#12345A] md:text-sm">Institutional Journey • संस्थागत यात्रा</p><h2 className="mt-3 font-serif text-3xl text-[#12345A] md:text-5xl">A continuing journey of service.</h2><p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">Explore the history and milestones documented by SSF.</p></div><ImpactTimeline /><div className="mt-8 text-center"><Link to="/Journey" className="inline-flex items-center gap-2 rounded-full border border-[#12345A]/20 bg-white px-6 py-3 font-bold text-[#12345A] shadow-sm transition hover:-translate-y-0.5 hover:border-[#F7A814] hover:bg-[#EAF0F6]">View service journey <FaArrowRight /></Link></div></div></section>

      <section className="bg-white px-5 py-14 md:px-8">
        <div className="container mx-auto flex max-w-7xl flex-col gap-6 rounded-[1.75rem] border border-[#EAF0F6] bg-gradient-to-br from-[#FAF9F5] via-white to-[#EAF0F6] p-7 shadow-[0_24px_70px_-45px_rgba(18,52,90,0.35)] md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#12345A]">Take the next step</p><h2 className="mt-3 font-serif text-3xl text-[#12345A] md:text-4xl">Every meaningful partnership starts somewhere.</h2><p className="mt-3 leading-relaxed text-slate-600">Explore the work, ask a question, volunteer a skill or start a conversation about collaboration.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Link to="/JoinUs" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#12345A] px-6 py-3 font-bold text-white shadow-md shadow-[#12345A]/15 transition hover:-translate-y-0.5 hover:bg-[#092744]"><FaUsers /> Join SSF</Link><Link to="/PartnerWithUs" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#F7A814] px-6 py-3 font-bold text-[#12345A] hover:bg-[#EAF0F6]"><FaHandshake /> Partner with us</Link><Link to="/Donate" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 font-bold text-[#12345A] hover:bg-white"><FaHeart /> Support SSF</Link></div>
        </div>
      </section>

    </main>
  );
}
