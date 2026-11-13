import { useEffect } from "react";
import { HeartHandshake, BookOpen, Sprout, Laptop, ShieldCheck, ArrowRight, Users, Target, Handshake, Leaf } from "lucide-react";

const focusAreas = [
  { Icon: BookOpen, title: "शिक्षा एवं क्षमता विकास", text: "शिक्षा, साक्षरता, विद्यार्थियों के प्रोत्साहन और सीखने के अवसरों को बढ़ावा।" },
  { Icon: Laptop, title: "डिजिटल सशक्तिकरण", text: "डिजिटल जागरूकता, कंप्यूटर शिक्षा और तकनीक तक सरल पहुँच।" },
  { Icon: Sprout, title: "आजीविका एवं सतत विकास", text: "कौशल, स्थानीय आजीविका, ग्रामीण विकास और पर्यावरण-अनुकूल पहल।" },
  { Icon: HeartHandshake, title: "समुदाय एवं जनकल्याण", text: "सामाजिक जागरूकता, सहभागिता और जरूरतमंद समुदायों के लिए उपयोगी प्रयास।" },
];

const principles = [
  ["समुदाय की भागीदारी", "स्थानीय जरूरतों और लोगों की आवाज को प्राथमिकता।", Users],
  ["साझेदारी", "समान उद्देश्य वाले व्यक्तियों, संस्थाओं और सहयोगियों के साथ काम।", Handshake],
  ["जवाबदेही", "उचित दस्तावेजीकरण, जिम्मेदार संसाधन-उपयोग और पारदर्शिता।", ShieldCheck],
];

export default function OrganizationPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <main className="overflow-hidden bg-[#F5F8FA] text-[#263746]">
      <section className="relative isolate bg-[#082B49] text-white">
        <div className="absolute inset-0 -z-10" style={{backgroundImage:"radial-gradient(ellipse at 12% 20%, rgba(247,168,20,.23), transparent 35%), radial-gradient(ellipse at 90% 85%, rgba(45,138,104,.32), transparent 38%)"}} />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-32 sm:px-8 md:grid-cols-[1.3fr_.7fr] md:items-center md:pb-28 md:pt-40">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-[#F7C45B]"><span className="h-2 w-2 rounded-full bg-[#F7A814]"/> About the Foundation</span>
            <h1 className="mt-6 text-4xl font-black leading-[1.12] md:text-6xl">Our Organization<span className="mt-3 block text-2xl font-bold text-white/85 md:text-4xl">हमारा संगठन</span></h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-white/85 md:text-lg">Swastik Srijan Foundation Samiti एक सामाजिक संस्था है, जो शिक्षा, जागरूकता, सामुदायिक विकास और सतत आजीविका से जुड़े सकारात्मक प्रयासों को प्रोत्साहित करने के लिए प्रतिबद्ध है।</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65 md:text-base">स्थानीय जरूरतों को समझकर, लोगों की भागीदारी और सहयोग से व्यावहारिक एवं जिम्मेदार पहल विकसित करना हमारा दृष्टिकोण है।</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/About" className="inline-flex items-center gap-2 rounded-full bg-[#F7A814] px-6 py-3 text-sm font-extrabold text-[#082B49] transition hover:bg-[#ffc13b]">संस्था के बारे में <ArrowRight size={16}/></a>
              <a href="/Contact" className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">संपर्क करें</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-5 rounded-[2.5rem] border border-white/10"/>
            <div className="rounded-[2rem] border border-white/15 bg-white/[.08] p-7 shadow-2xl backdrop-blur-sm md:p-9">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F7A814] text-[#082B49]"><Target size={28}/></div>
              <p className="mt-7 text-xs font-black uppercase tracking-[.2em] text-[#F7C45B]">Our Purpose</p>
              <h2 className="mt-3 text-2xl font-extrabold leading-snug">सार्थक अवसर, सक्षम समुदाय और सकारात्मक बदलाव</h2>
              <p className="mt-4 text-sm leading-7 text-white/70">ऐसे प्रयासों को प्रोत्साहन जो लोगों की क्षमता, आत्मनिर्भरता और सामुदायिक विकास में योगदान दें।</p>
              <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-[#F7A814]"/></div>
              <p className="mt-2 text-[11px] font-semibold tracking-wide text-white/50">PEOPLE • PARTNERSHIP • PROGRESS</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#176447]">Who We Are</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#12345A] md:text-4xl">समाज के साथ,<br/>समाज के लिए</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#657480]">हम मानते हैं कि स्थायी विकास की शुरुआत स्थानीय जरूरतों को समझने और उपलब्ध संसाधनों का सही उपयोग करने से होती है।</p>
          </div>
          <div className="rounded-[1.75rem] border border-[#E1E8ED] bg-white p-7 shadow-[0_18px_50px_rgba(8,43,73,.06)] md:p-10">
            <p className="text-base leading-8 text-[#53616C]">संस्था का उद्देश्य ऐसे अवसरों और पहलों को बढ़ावा देना है, जिनसे व्यक्ति और समुदाय अपनी क्षमता विकसित कर सकें। हम स्थानीय आवश्यकताओं, उपलब्ध संसाधनों और सहयोगी संस्थाओं के साथ मिलकर उपयोगी एवं व्यावहारिक गतिविधियों को आगे बढ़ाने पर ध्यान देते हैं।</p>
            <div className="mt-7 grid gap-4 border-t border-[#E9EEF1] pt-6 sm:grid-cols-2">
              <div><p className="text-xs font-bold uppercase tracking-wider text-[#176447]">दृष्टिकोण</p><p className="mt-2 text-sm font-semibold leading-6 text-[#12345A]">समावेशी और सतत सामुदायिक विकास</p></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-[#176447]">कार्यशैली</p><p className="mt-2 text-sm font-semibold leading-6 text-[#12345A]">सहभागिता, सहयोग और जवाबदेही</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div><p className="text-xs font-black uppercase tracking-[.2em] text-[#176447]">Our Focus Areas</p><h2 className="mt-3 text-3xl font-black text-[#12345A] md:text-4xl">हमारे प्रमुख कार्यक्षेत्र</h2></div>
            <p className="max-w-xl text-sm leading-7 text-[#657480]">कार्यक्रम और गतिविधियाँ समाज की जरूरतों, संस्था की क्षमता, उपलब्ध संसाधनों और आवश्यक अनुमोदनों के अनुसार विकसित की जाती हैं।</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map(({Icon,title,text},i) => <article key={title} className="group rounded-3xl border border-[#E4EAF0] bg-[#F8FAFB] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#B8D5C7] hover:bg-white hover:shadow-[0_18px_40px_rgba(8,43,73,.09)]">
              <div className="flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E8F2ED] text-[#176447] transition group-hover:bg-[#176447] group-hover:text-white"><Icon size={23}/></span><span className="text-xs font-black tracking-widest text-[#A6B2BA]">0{i+1}</span></div>
              <h3 className="mt-6 text-lg font-extrabold text-[#12345A]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#657480]">{text}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="mb-9 max-w-3xl"><p className="text-xs font-black uppercase tracking-[.2em] text-[#176447]">How We Work</p><h2 className="mt-3 text-3xl font-black text-[#12345A] md:text-4xl">हमारे कार्य के मूल सिद्धांत</h2></div>
        <div className="grid gap-5 md:grid-cols-3">
          {principles.map(([title,desc,Icon],i)=><article key={title} className="rounded-3xl border border-[#E1E8ED] bg-white p-7 shadow-sm"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF4EF] text-[#176447]"><Icon size={22}/></span><p className="mt-5 text-xs font-black tracking-widest text-[#A2AFB8]">0{i+1}</p><h3 className="mt-2 text-lg font-extrabold text-[#12345A]">{title}</h3><p className="mt-2 text-sm leading-7 text-[#657480]">{desc}</p></article>)}
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 md:pb-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#082B49] p-8 text-white md:p-12">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[34px] border-white/[.06]"/>
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-[#F7C45B]"><Leaf size={15}/> जिम्मेदारी • पारदर्शिता • सहभागिता</span><h2 className="mt-5 text-2xl font-black md:text-3xl">मिलकर बेहतर भविष्य की दिशा में</h2><p className="mt-4 text-sm leading-7 text-white/75 md:text-base">संस्था उचित दस्तावेजीकरण, जिम्मेदार संसाधन-उपयोग, लागू नियमों के अनुपालन और सहयोगियों के प्रति पारदर्शिता को महत्व देती है।</p></div>
            <a href="/Contact" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F7A814] px-6 py-3 font-extrabold text-[#12345A] transition hover:bg-[#ffc13b]">हमसे जुड़ें <ArrowRight size={17}/></a>
          </div>
        </div>
      </section>
    </main>
  );
}
