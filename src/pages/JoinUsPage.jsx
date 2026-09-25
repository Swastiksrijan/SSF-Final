import { useMemo, useState } from "react";
import { FaUsers, FaHandsHelping, FaHeart, FaHandshake, FaClock, FaLightbulb, FaTools, FaShareAlt, FaBuilding, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import MemberForm from "../components/MemberForm";
import VolunteerForm from "../components/VolunteerForm";
import DonorForm from "../components/DonorForm";
import GetInvolvedInterestForm from "../components/GetInvolvedInterestForm";
import footerImg1 from "../assets/footer-gallery-1.jpg";
import footerImg2 from "../assets/footer-gallery-2.jpg";
import footerImg3 from "../assets/footer-gallery-3.jpg";
import footerImg4 from "../assets/footer-gallery-4.png";

const ROLES = [
  { id: "member", title: "MEMBER / सदस्य", text: "Swastik Srijan Foundation / स्थापना की यात्रा का हिस्सा बनना चाहता हूँ।", icon: FaUsers, color: "blue" },
  { id: "volunteer", title: "VOLUNTEER / स्वयंसेवक", text: "अपने समय, ज्ञान या skill से सक्रिय रूप से योगदान करना चाहता हूँ।", icon: FaHandsHelping, color: "green" },
  { id: "donor", title: "SUPPORT / सहयोग", text: "अपने resources या financial support से अच्छे काम को आगे बढ़ाना चाहता हूँ।", icon: FaHeart, color: "navy" },
  { id: "partner", title: "PARTNER / साझेदार", text: "अपनी संस्था, company या network के साथ मिलकर काम करना चाहता हूँ।", icon: FaHandshake, color: "teal" },
];

const GIFTS = [
  { label: "TIME", icon: FaClock, role: "volunteer" },
  { label: "KNOWLEDGE", icon: FaLightbulb, role: "volunteer" },
  { label: "SKILL", icon: FaTools, role: "volunteer" },
  { label: "NETWORK", icon: FaShareAlt, role: "partner" },
  { label: "RESOURCES", icon: FaBuilding, role: "partner" },
  { label: "JUST THE WILL", icon: FaHeart, role: "volunteer" },
];

const colors = {
  blue: ["text-[#0b4f86] bg-blue-50 border-blue-100", "text-[#0b4f86]"],
  green: ["text-[#168a5a] bg-emerald-50 border-emerald-100", "text-[#168a5a]"],
  navy: ["text-[#06284a] bg-slate-100 border-slate-200", "text-[#06284a]"],
  teal: ["text-[#087f73] bg-teal-50 border-teal-100", "text-[#087f73]"],
};

function RoleForm({ active }) {
  return <div id="join-form" className="scroll-mt-24">{active === "member" && <MemberForm />}{active === "volunteer" && <VolunteerForm />}{active === "donor" && <DonorForm />}{active === "partner" && <GetInvolvedInterestForm type="partner" />}</div>;
}

export default function JoinUsPage() {
  const [active, setActive] = useState("member");
  const [gift, setGift] = useState(null);
  const selectedRole = useMemo(() => ROLES.find((item) => item.id === active), [active]);
  const chooseRole = (id) => { setActive(id); setGift(null); window.setTimeout(() => document.getElementById("join-form")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60); };
  const chooseGift = (item) => { setGift(item.label); setActive(item.role); window.setTimeout(() => document.getElementById("role-result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 60); };

  return (
    <main className="min-h-screen bg-[#f7fafc] text-[#17202a]">
      <section className="relative min-h-[68vh] lg:min-h-[72vh] w-full overflow-hidden bg-[#001529] text-white">
        <div className="absolute inset-0 p-2 sm:p-3 lg:p-4">
          <div className="grid h-full grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 lg:gap-3">
            {[footerImg1, footerImg2, footerImg3, footerImg4].map((img, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg lg:rounded-xl bg-[#002344]">
                <img src={img} alt="" className="h-full w-full object-cover object-center opacity-75 scale-105" loading={index === 0 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-[#001529]/62"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/35 via-[#001529]/55 to-[#001529]/90"></div>
        <div className="relative z-10 flex min-h-[68vh] lg:min-h-[72vh] items-center justify-center px-5 py-24 lg:px-8">
          <div className="max-w-6xl w-full text-center">
            <div className="mx-auto inline-block rounded-2xl border border-white/15 bg-[#001529]/55 px-6 py-5 sm:px-12 sm:py-6 backdrop-blur-sm shadow-2xl">
              <p className="mt-4 md:mt-6 text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.22em] text-[#7dd3a8]">Swastik Srijan Foundation / स्थापना • Join the Movement / जुड़िए</p>
              <h1 className="mt-8 md:mt-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">कुछ लोग बदलाव की प्रतीक्षा करते हैं।<span className="block mt-2 text-[#7dd3a8]">Some wait for change. कुछ बदलाव का हिस्सा बनते हैं।</span></h1>
              <p className="mx-auto mt-4 max-w-5xl text-base md:text-lg text-[#e5edf4] leading-relaxed">Find your place in Swastik Srijan Foundation / स्थापना. / Swastik Srijan Foundation / स्थापना में आपके लिए कौन-सी भूमिका है?</p>
              <button onClick={() => document.getElementById("find-place")?.scrollIntoView({ behavior: "smooth" })} className="mt-5 inline-flex items-center gap-3 rounded-full bg-[#168a5a] px-7 py-3.5 text-white font-black shadow-xl shadow-black/20 hover:bg-[#126f4a] hover:-translate-y-1 transition">FIND YOUR PLACE / अपनी भूमिका चुनें <FaArrowRight /></button>
            </div>
          </div>
        </div>
      </section>

      <section id="find-place" className="mx-auto max-w-6xl px-5 py-12 md:py-16 scroll-mt-16">
        <div className="text-center max-w-3xl mx-auto"><p className="text-emerald-600 font-extrabold tracking-[0.18em] text-xs md:text-sm uppercase">01 • FIND YOUR PLACE / अपनी भूमिका चुनें</p><h2 className="mt-3 text-2xl md:text-4xl font-black text-[#06284a]">How would you like to join? / आप किस तरह जुड़ना चाहेंगे?</h2><p className="mt-4 text-slate-500 text-base md:text-lg">Choose your role, and take the next step with us. / अपनी भूमिका चुनिए और हमारे साथ अगला कदम बढ़ाइए।</p></div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLES.map((item) => { const Icon=item.icon; const c=colors[item.color]; return <button key={item.id} onClick={() => chooseRole(item.id)} className={"group text-left rounded-[1.75rem] border bg-white p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all " + (active===item.id ? "border-[#168a5a] ring-2 ring-emerald-100" : "border-slate-200")}><span className={"w-14 h-14 rounded-2xl border flex items-center justify-center text-xl " + c[0]}><Icon /></span><h3 className={"mt-5 text-xl md:text-2xl font-black " + c[1]}>{item.title}</h3><p className="mt-3 text-slate-600 font-medium leading-relaxed">{item.text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#06284a]">CHOOSE THIS <FaArrowRight className="group-hover:translate-x-1 transition" /></span></button>; })}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="text-center"><p className="text-emerald-600 font-extrabold tracking-[0.18em] text-xs md:text-sm uppercase">02 • WHAT CAN YOU GIVE? / आप क्या दे सकते हैं?</p><h2 className="mt-3 text-3xl md:text-5xl font-black text-[#06284a]">What can you contribute? / आपके पास क्या है?</h2><p className="mt-4 text-slate-500 text-base md:text-lg">Every contribution is not financial. Your time, knowledge, skills and willingness can make a difference. / हर योगदान पैसे से नहीं होता; आपका समय, ज्ञान, कौशल और इच्छा भी बदलाव की शुरुआत हो सकते हैं।</p></div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">{GIFTS.map((item) => { const Icon=item.icon; return <button key={item.label} onClick={() => chooseGift(item)} className={"rounded-2xl border p-5 text-center font-black transition-all hover:-translate-y-1 hover:shadow-lg " + (gift===item.label ? "border-emerald-400 bg-[#eef8f5] text-[#168a5a]" : "border-slate-200 bg-slate-50 text-[#06284a]")}><Icon className="mx-auto text-xl mb-3" /><span className="text-xs tracking-wider">{item.label}</span></button>; })}</div>
        </div>
      </section>

      <section id="role-result" className="mx-auto max-w-6xl px-5 py-16 md:py-20 scroll-mt-20">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#06284a] to-[#0b4f86] text-white p-7 md:p-12 overflow-hidden relative"><div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/10" /><p className="relative text-emerald-300 font-extrabold tracking-[0.18em] text-xs uppercase">03 • YOUR POSSIBLE PATH / आपकी संभावित यात्रा</p><h2 className="relative mt-3 text-3xl md:text-5xl font-black">There is a place for you here. / आपके लिए यहाँ एक जगह है।</h2><p className="relative mt-4 max-w-2xl text-slate-200 text-base md:text-lg leading-relaxed">{gift ? gift + " के माध्यम से आपका पहला कदम सक्रिय सहभागिता की ओर हो सकता है।" : "अपनी भूमिका चुनिए और फिर अपनी journey का पहला कदम उठाइए।"}</p><div className="relative mt-8 flex flex-wrap items-center gap-2 text-sm md:text-base font-extrabold"><span className="rounded-full bg-white/10 px-4 py-2">JOIN</span><FaArrowRight className="text-emerald-300" /><span className="rounded-full bg-white/10 px-4 py-2">WELCOME</span><FaArrowRight className="text-emerald-300" /><span className="rounded-full bg-white/10 px-4 py-2">PARTICIPATE</span><FaArrowRight className="text-emerald-300" /><span className="rounded-full bg-emerald-400 text-[#06284a] px-4 py-2">CONTRIBUTE</span><FaArrowRight className="text-emerald-300" /><span className="rounded-full bg-white/10 px-4 py-2">LEAD</span></div></div>
      </section>

      <section className="bg-[#f7fafc] border-y border-slate-200"><div className="mx-auto max-w-6xl px-5 py-16 md:py-20"><div className="text-center"><p className="text-emerald-600 font-extrabold tracking-[0.18em] text-xs uppercase">04 • ONE PERSON CAN / एक व्यक्ति भी बदलाव ला सकता है</p><h2 className="mt-5 text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#06284a]">ONE PERSON CAN.</h2></div><div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 text-center">{["TEACH.", "HELP.", "CONNECT.", "INSPIRE.", "BEGIN."].map((word,index)=><div key={word} className={"rounded-2xl p-6 md:p-8 font-black text-xl md:text-2xl " + (index===4 ? "bg-emerald-50 text-[#168a5a]" : "bg-white border border-slate-200 text-[#0b4f86]")}>{word}</div>)}</div><p className="mt-8 text-center text-xl md:text-2xl font-bold text-slate-500 italic">Maybe that person is you. / शायद वह व्यक्ति आप हैं।</p></div></section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20"><div className="text-center"><p className="text-emerald-600 font-extrabold tracking-[0.18em] text-xs uppercase">05 • OUR JOURNEY / हमारी यात्रा</p><h2 className="mt-3 text-3xl md:text-5xl font-black text-[#06284a]">2013 → TODAY → TOMORROW / 2013 → आज → कल</h2></div><div className="mt-10 grid md:grid-cols-4 gap-4">{[[ "2013","Foundation / स्थापना","Swastik Srijan Foundation / स्थापना की शुरुआत।" ],[ "YEARS","Voluntary Work / स्वैच्छिक कार्य","Education • Health • Livelihood • Community" ],[ "TODAY","Growing Participation / बढ़ती सहभागिता","Members • Volunteers • Supporters • Partners / सदस्य • स्वयंसेवक • सहयोगी • साझेदार" ],[ "TOMORROW","What can we build together? / हम साथ मिलकर क्या बना सकते हैं?","Building the next chapter together. / आपकी सहभागिता से आगे की यात्रा।" ]].map(([year,title,text])=><div key={year} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><span className="text-emerald-600 font-black text-sm tracking-widest">{year}</span><h3 className="mt-3 text-2xl font-black text-[#06284a]">{title}</h3><p className="mt-3 text-slate-600 font-medium leading-relaxed">{text}</p></div>)}</div></section>

      <section className="bg-[#06284a] text-white"><div className="mx-auto max-w-6xl px-5 py-16 md:py-20"><div className="grid md:grid-cols-3 gap-5">{[[ "LEVEL 1 / स्तर 1","I WANT TO JOIN / मैं जुड़ना चाहता हूँ","Simple registration — your first step. / सरल पंजीकरण — आपका पहला कदम।" ],[ "LEVEL 2","I WANT TO PARTICIPATE / मैं सहभागिता करना चाहता हूँ","Activities, volunteering and active involvement. / गतिविधियाँ, स्वयंसेवा और सक्रिय सहभागिता।" ],[ "LEVEL 3","I WANT TO TAKE RESPONSIBILITY / मैं जिम्मेदारी लेना चाहता हूँ","Coordinator, team and responsibility opportunities. / समन्वयक, टीम और जिम्मेदारी के अवसर।" ]].map(([level,title,text])=><div key={level} className="rounded-3xl border border-white/10 bg-white/5 p-7"><span className="text-emerald-300 font-black tracking-widest text-xs">{level}</span><h3 className="mt-4 text-2xl font-black">{title}</h3><p className="mt-3 text-slate-200 leading-relaxed">{text}</p></div>)}</div><div className="mt-12 text-center"><p className="text-emerald-300 font-extrabold tracking-[0.18em] text-xs uppercase">06 • TAKE YOUR FIRST STEP / अपना पहला कदम उठाएँ</p><h2 className="mt-4 text-3xl md:text-5xl font-black">Joining is the beginning. / नाम जुड़ना शुरुआत है।</h2><p className="mt-2 text-xl md:text-2xl text-blue-100">Participation starts change. / सहभागिता बदलाव की शुरुआत है।</p></div></div></section>

      <section className="mx-auto max-w-5xl px-5 py-16 md:py-20"><div className="rounded-[2rem] bg-white border border-slate-200 shadow-[0_20px_60px_rgba(6,40,74,0.10)] p-5 md:p-8"><div className="text-center mb-8"><p className="text-emerald-600 font-extrabold tracking-[0.18em] text-xs uppercase">07 • START YOUR JOURNEY / अपनी यात्रा शुरू करें</p><h2 className="mt-3 text-3xl md:text-5xl font-black text-[#06284a]">Take your first step as {selectedRole.title}. / {selectedRole.title} के साथ अपना पहला कदम उठाइए</h2><p className="mt-3 text-slate-500">Your form is below according to your selected role. / आपकी चुनी हुई भूमिका के अनुसार form नीचे है।</p></div><RoleForm active={active} /></div></section>
      <div className="pb-12 text-center px-5"><div className="inline-flex items-center gap-2 text-slate-500 font-semibold"><FaCheckCircle className="text-emerald-600" /> Swastik Srijan Foundation / स्थापना • Humanity & Truth</div></div>
    </main>
  );
}