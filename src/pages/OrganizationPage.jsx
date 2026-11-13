import { useEffect } from "react";
import { HeartHandshake, BookOpen, Sprout, Laptop, ShieldCheck, ArrowRight } from "lucide-react";

const focusAreas = [
  [BookOpen, "शिक्षा एवं सीखने के अवसर", "शिक्षा, साक्षरता, विद्यार्थियों के प्रोत्साहन और क्षमता-विकास से जुड़े प्रयास।"],
  [Laptop, "डिजिटल सशक्तिकरण", "डिजिटल जागरूकता, कंप्यूटर शिक्षा और तकनीक तक सरल पहुँच को बढ़ावा।"],
  [Sprout, "सतत आजीविका एवं विकास", "स्थानीय जरूरतों के अनुरूप कौशल, आजीविका और पर्यावरण-अनुकूल पहल।"],
  [HeartHandshake, "समुदाय एवं जनकल्याण", "समुदाय की भागीदारी से सामाजिक जागरूकता और विकास के अवसर।"],
];

export default function OrganizationPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <main className="bg-[#F6F8FA] text-[#26343D]">
      <section className="relative isolate overflow-hidden bg-[#082B49] text-white">
        <div className="absolute inset-0 -z-10 opacity-30" style={{backgroundImage:"radial-gradient(circle at 12% 18%, #F7A814 0, transparent 30%), radial-gradient(circle at 88% 82%, #2D8A68 0, transparent 34%)"}} />
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-8 md:pb-28 md:pt-44">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[.24em] text-[#F7A814]">About the Foundation</p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">Our Organization <span className="mt-2 block text-2xl text-white/85 md:text-4xl">हमारा संगठन</span></h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/85 md:text-xl">
              Swastik Srijan Foundation Samiti एक सामाजिक संस्था है, जो शिक्षा, जागरूकता, सामुदायिक विकास और सतत आजीविका से जुड़े सकारात्मक प्रयासों को प्रोत्साहित करने के लिए प्रतिबद्ध है।
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
              हमारा विश्वास है कि स्थानीय जरूरतों को समझकर, लोगों की भागीदारी के साथ और जिम्मेदारीपूर्ण तरीके से किए गए प्रयास स्थायी बदलाव की मजबूत नींव बनते हैं।
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#176447]">Who We Are</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#12345A] md:text-4xl">समाज के साथ, समाज के लिए</h2>
          </div>
          <div className="rounded-3xl border border-[#E1E8ED] bg-white p-7 shadow-[0_12px_35px_rgba(8,43,73,.06)] md:p-9">
            <p className="text-base leading-8 text-[#53616C]">
              संस्था का उद्देश्य ऐसे अवसरों और पहलों को बढ़ावा देना है, जिनसे व्यक्ति और समुदाय अपनी क्षमता विकसित कर सकें। हम स्थानीय आवश्यकताओं, उपलब्ध संसाधनों और सहयोगी संस्थाओं के साथ मिलकर उपयोगी एवं व्यावहारिक गतिविधियों को आगे बढ़ाने पर ध्यान देते हैं।
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-9 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#176447]">Our Focus</p>
            <h2 className="mt-3 text-3xl font-black text-[#12345A] md:text-4xl">हमारे प्रमुख कार्यक्षेत्र</h2>
            <p className="mt-3 leading-7 text-[#53616C]">हमारी पहलें समाज की जरूरतों और संस्था की उपलब्ध क्षमता के अनुसार विकसित की जाती हैं।</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map(([Icon, title, description], index) => (
              <article key={title} className="group rounded-3xl border border-[#E4EAF0] bg-[#FAFBFC] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#B8D5C7] hover:bg-white hover:shadow-[0_16px_38px_rgba(8,43,73,.09)]">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF4EF] text-[#176447]"><Icon size={23}/></span>
                  <span className="text-xs font-black tracking-widest text-[#9AA9B3]">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-black text-[#12345A]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#53616C]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#082B49] p-8 text-white md:p-12">
          <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full border-[28px] border-white/5"/>
          <div className="relative max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-[#F7C45B]"><ShieldCheck size={15}/> जिम्मेदारी • पारदर्शिता • सहभागिता</span>
            <h2 className="mt-5 text-2xl font-black md:text-3xl">विश्वास और जवाबदेही के साथ आगे बढ़ना</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
              संस्था अपने कार्यों में उचित दस्तावेजीकरण, जिम्मेदार संसाधन-उपयोग, लागू नियमों के अनुपालन और सहयोगियों के प्रति पारदर्शिता को महत्व देती है।
            </p>
            <a href="/Contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#F7A814] px-6 py-3 font-extrabold text-[#12345A] transition hover:bg-[#ffc13b]">हमसे जुड़ें <ArrowRight size={17}/></a>
          </div>
        </div>
      </section>
    </main>
  );
}
