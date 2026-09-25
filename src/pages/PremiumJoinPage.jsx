import { motion } from "framer-motion";
import pageHeader from "../assets/page-header.jpg";
import { FaArrowRight, FaHandsHelping, FaHeart, FaHandshake, FaUsers, FaClock, FaLightbulb, FaTools, FaNetworkWired, FaBuilding, FaGraduationCap, FaStethoscope, FaLaptopCode, FaUserTie, FaPeopleCarry, FaCheckCircle } from "react-icons/fa";

const roles = [
  { icon: FaUsers, title: "BECOME A MEMBER", text: "Swastik Srijan Foundation की दीर्घकालिक यात्रा का हिस्सा बनिए।", href: "/GetInvolved#member", tone: "blue" },
  { icon: FaHandsHelping, title: "BECOME A VOLUNTEER", text: "अपना समय, ज्ञान या skill समाज के काम में लगाइए।", href: "/GetInvolved#volunteer", tone: "green" },
  { icon: FaHeart, title: "BECOME A DONOR", text: "अपनी क्षमता के अनुसार किसी पहल को support कीजिए।", href: "/Donor", tone: "emerald" },
  { icon: FaHandshake, title: "COLLABORATE / PARTNER", text: "School, Hospital, Company, Institution, Professional या NGO के साथ मिलकर काम कीजिए।", href: "/PartnerWithUs", tone: "blue" },
];

const gifts = [
  [FaClock, "TIME", "आपके समय से सेवा"],
  [FaLightbulb, "KNOWLEDGE", "आपके ज्ञान से सीख"],
  [FaTools, "SKILL", "आपकी skill से समाधान"],
  [FaHeart, "WILL", "आपकी इच्छा से शुरुआत"],
  [FaNetworkWired, "NETWORK", "आपके network से जुड़ाव"],
  [FaBuilding, "RESOURCES", "आपके resources से सहयोग"],
];

const places = [
  [FaGraduationCap, "Student / Youth", "Youth & Community Volunteer"],
  [FaGraduationCap, "Teacher / Mentor", "Education Volunteer"],
  [FaStethoscope, "Healthcare Professional", "Health Support"],
  [FaLaptopCode, "IT / Digital Professional", "Digital Volunteer"],
  [FaUserTie, "Working Professional", "Skill-Based Volunteer"],
  [FaPeopleCarry, "Social Worker", "Community Volunteer"],
  [FaBuilding, "Business / Institution", "Collaboration Partner"],
];

function SectionTitle({ eyebrow, children, accent = false }) {
  return (
    <div className="text-center max-w-4xl mx-auto mb-14">
      {eyebrow && <p className="text-sm md:text-base font-extrabold tracking-[0.22em] uppercase text-[#168a5a] mb-4">{eyebrow}</p>}
      <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#06284a] leading-[1.05]">
        {children}{accent && <span className="text-[#168a5a]">.</span>}
      </h2>
    </div>
  );
}

export default function PremiumJoinPage() {
  return (
    <main className="min-h-screen bg-white text-[#17202a] overflow-hidden">
      <section className="relative min-h-[760px] md:min-h-[820px] flex items-center px-5 py-24 overflow-hidden">
        <img src={pageHeader} alt="People coming together for community service with Swastik Srijan Foundation" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,24,45,.92)_0%,rgba(3,38,65,.78)_42%,rgba(3,38,65,.38)_72%,rgba(3,38,65,.62)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-[1.15fr_.85fr] gap-14 items-center">
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/95 border border-white/60 px-5 py-2.5 shadow-lg text-[#06284a] font-bold mb-7">
              <span className="w-2.5 h-2.5 rounded-full bg-[#168a5a]" /> SWASTIK SRIJAN FOUNDATION
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-[-0.045em] leading-[.95] text-[#06284a]">
              कुछ लोग बदलाव की प्रतीक्षा करते हैं।
              <span className="block text-[#7ee2ad] mt-4 drop-shadow-[0_4px_18px_rgba(0,0,0,.35)]">कुछ लोग बदलाव का हिस्सा बनते हैं।</span>
            </h1>
            <p className="mt-8 text-lg md:text-2xl leading-relaxed text-white/90 max-w-3xl">
              2013 से — Humanity • Truth • Education • Health • Livelihood
            </p>
            <p className="mt-4 text-base md:text-xl leading-relaxed text-white/85 max-w-2xl">
              आप सिर्फ देखने वाले नहीं हैं। Swastik Srijan Foundation की इस यात्रा में आपकी भी एक जगह हो सकती है।
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#choose" className="inline-flex items-center gap-3 rounded-2xl bg-[#168a5a] text-white px-7 py-4 font-extrabold shadow-xl hover:-translate-y-0.5 transition">
                JOIN SWASTIK SRIJAN FOUNDATION <FaArrowRight />
              </a>
              <a href="#your-place" className="inline-flex items-center gap-3 rounded-2xl bg-white text-[#06284a] border border-slate-200 px-7 py-4 font-extrabold shadow-sm hover:border-[#168a5a] transition">
                Find Your Place
              </a>
            </div>
          </motion.div>
          <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:.8,delay:.15}} className="relative">
            <div className="rounded-[2.5rem] bg-white/95 backdrop-blur-xl border border-white/70 shadow-2xl p-7 md:p-9">
              <p className="text-sm font-extrabold uppercase tracking-[.2em] text-[#168a5a]">Your next step</p>
              <h2 className="mt-4 text-3xl md:text-4xl font-black text-[#06284a]">आपके लिए एक रास्ता है।</h2>
              <div className="mt-7 space-y-3">
                {["Member", "Volunteer", "Donor", "Collaborate / Partner"].map((x,i)=>
                  <a key={x} href={roles[i].href} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition group">
                    <span className="font-extrabold text-[#06284a]">{x}</span><FaArrowRight className="text-[#168a5a] group-hover:translate-x-1 transition"/>
                  </a>
                )}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-slate-500">नाम से जुड़ना शुरुआत है। सहभागिता से उद्देश्य मजबूत होता है।</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="choose" className="py-24 md:py-32 px-5">
        <div className="max-w-7xl mx-auto">
          <SectionTitle eyebrow="CHOOSE YOUR PATH">Swastik Srijan Foundation के साथ आप किस तरह जुड़ना चाहते हैं?</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            {roles.map(({icon:Icon,title,text,href,tone},i) => (
              <motion.a key={title} href={href} initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}} className="group rounded-[2rem] border border-slate-200 bg-white p-7 md:p-9 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${tone==="green"||tone==="emerald"?"bg-emerald-50 text-[#168a5a]":"bg-blue-50 text-[#0b4f86]"}`}><Icon/></div>
                <h3 className="mt-7 text-2xl md:text-3xl font-black text-[#06284a]">{title}</h3>
                <p className="mt-3 text-slate-600 text-lg leading-relaxed">{text}</p>
                <span className="mt-7 inline-flex items-center gap-2 font-extrabold text-[#168a5a]">TAKE THE NEXT STEP <FaArrowRight className="group-hover:translate-x-1 transition"/></span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-5 bg-[#f6fbff] border-y border-blue-50">
        <div className="max-w-6xl mx-auto">
          <SectionTitle eyebrow="WHAT YOU CAN GIVE">हर किसी के पास देने के लिए कुछ न कुछ होता है।</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {gifts.map(([Icon,title,text]) => (
              <div key={title} className="rounded-3xl bg-white border border-slate-100 p-6 md:p-8 shadow-sm">
                <Icon className="text-2xl text-[#168a5a]"/>
                <h3 className="mt-5 text-xl font-black text-[#06284a]">{title}</h3>
                <p className="mt-2 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <p className="text-2xl md:text-4xl font-black text-[#06284a]">आपके पास जो है, वहीं से शुरुआत कीजिए।</p>
            <p className="mt-4 text-lg md:text-xl text-slate-600">आपका योगदान छोटा लग सकता है — लेकिन किसी के लिए वही एक शुरुआत हो सकती है।</p>
          </div>
        </div>
      </section>

      <section id="your-place" className="py-24 md:py-32 px-5">
        <div className="max-w-7xl mx-auto">
          <SectionTitle eyebrow="FIND YOUR PLACE">Swastik Srijan Foundation में आपकी जगह कहाँ है?</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {places.map(([Icon,title,text]) => (
              <div key={title} className="rounded-3xl border border-slate-200 p-6 bg-white hover:shadow-xl transition">
                <Icon className="text-2xl text-[#0b4f86]"/>
                <h3 className="mt-5 font-black text-lg text-[#06284a]">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-3xl bg-[#06284a] text-white p-8 md:p-10 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
            <div><h3 className="text-2xl md:text-3xl font-black">अभी तय नहीं है?</h3><p className="mt-2 text-white/70">बस शुरुआत कीजिए। आपकी रुचि के अनुसार रास्ता चुना जा सकता है।</p></div>
            <a href="/GetInvolved#member" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#168a5a] px-7 py-4 font-extrabold whitespace-nowrap">I WANT TO HELP <FaArrowRight/></a>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-5 bg-gradient-to-br from-[#06284a] via-[#0b416b] to-[#168a5a] text-white">
        <div className="max-w-5xl mx-auto">
          <SectionTitle eyebrow="ONE PERSON CAN" >ONE PERSON CAN <span className="text-[#7ee2ad]">BEGIN.</span></SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {["ONE PERSON CAN TEACH.","ONE PERSON CAN HELP.","ONE PERSON CAN CONNECT.","ONE PERSON CAN INSPIRE."].map(x=><div key={x} className="rounded-2xl bg-white/10 border border-white/15 p-5 md:p-6 text-lg md:text-xl font-black text-center">{x}</div>)}
          </div>
          <p className="text-center text-2xl md:text-4xl font-black mt-12">Maybe that person is you.</p>
          <div className="text-center mt-8"><a href="#choose" className="inline-flex items-center gap-3 rounded-2xl bg-white text-[#06284a] px-8 py-4 font-black shadow-xl hover:scale-[1.02] transition">JOIN SWASTIK SRIJAN FOUNDATION <FaArrowRight/></a></div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-5">
        <div className="max-w-5xl mx-auto">
          <SectionTitle eyebrow="THE JOURNEY">JOINING IS ONLY THE BEGINNING.</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {["JOIN","WELCOME","CHOOSE","PARTICIPATE","CONTRIBUTE","GROW"].map((x,i)=><div key={x} className="text-center"><div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-[#0b4f86] flex items-center justify-center font-black">{i+1}</div><p className="mt-3 text-sm font-extrabold text-[#06284a]">{x}</p></div>)}
          </div>
        </div>
      </section>

      <section className="px-5 pb-28">
        <div className="max-w-6xl mx-auto rounded-[2.5rem] bg-[#f5faf7] border border-emerald-100 p-9 md:p-14">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-extrabold tracking-[.2em] text-[#168a5a] uppercase">A REAL JOURNEY</p>
              <h2 className="mt-4 text-4xl md:text-5xl font-black text-[#06284a]">2013 से एक यात्रा।</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">Swastik Srijan Foundation की यात्रा लोगों, volunteers, members, well-wishers और अपने संसाधनों के सहयोग से आगे बढ़ती रही है।</p>
              <p className="mt-4 font-bold text-[#06284a]">हम बड़े दावे नहीं करना चाहते। हम वास्तविक सहभागिता बनाना चाहते हैं।</p>
            </div>
            <div className="space-y-4">
              {["2013 — शुरुआत","Education • Health • Livelihood • Community Development","Members • Volunteers • Supporters • Well-wishers","आज — आगे की यात्रा में आपकी भूमिका"].map(x=><div key={x} className="flex gap-3 items-start rounded-2xl bg-white p-5 border border-slate-100"><FaCheckCircle className="mt-1 text-[#168a5a] shrink-0"/><span className="font-bold text-[#06284a]">{x}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-28">
        <div className="max-w-6xl mx-auto rounded-[3rem] bg-gradient-to-r from-[#f5fbff] to-[#f5faf7] border border-slate-100 p-10 md:p-16 text-center">
          <p className="text-sm font-extrabold tracking-[.2em] text-[#168a5a] uppercase">YOUR NEXT STEP</p>
          <h2 className="mt-5 text-4xl md:text-6xl font-black text-[#06284a]">आप यहाँ तक आ गए हैं।</h2>
          <p className="mt-5 text-xl md:text-2xl text-slate-600">शायद आपके लिए अगला कदम सिर्फ एक छोटा सा निर्णय है।</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="/GetInvolved#member" className="rounded-2xl bg-[#168a5a] text-white px-6 py-4 font-black">JOIN AS MEMBER</a>
            <a href="/GetInvolved#volunteer" className="rounded-2xl bg-[#06284a] text-white px-6 py-4 font-black">BECOME A VOLUNTEER</a>
            <a href="/Donor" className="rounded-2xl bg-white text-[#168a5a] border border-emerald-200 px-6 py-4 font-black">SUPPORT / DONATE</a>
            <a href="/PartnerWithUs" className="rounded-2xl bg-white text-[#06284a] border border-blue-200 px-6 py-4 font-black">COLLABORATE</a>
          </div>
          <p className="mt-9 text-sm text-slate-500">Member • Volunteer • Donor • Partner</p>
        </div>
      </section>
    </main>
  );
}
