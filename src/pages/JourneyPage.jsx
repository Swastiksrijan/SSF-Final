import { motion } from "framer-motion";
import PageHero from "../components/PageHero";

export default function JourneyPage() {
  return (
    <div className="w-full">

      {/* ================= HERO ================= */}
      <PageHero
        image="/images/real/ssf_event_members.jpg"
        title="Our Journey & Impact"
        subtitle="A journey of commitment, compassion, and measurable change across communities in India."
        hindiSubtitle="हमारी यात्रा और प्रभाव - भारत के विभिन्न समुदायों में प्रतिबद्धता, करुणा और मापने योग्य परिवर्तन की एक यात्रा।"
      />

      {/* ================= TOP BANNER ================= */}
      <section className="pb-10 px-4">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-zinc-100">
          <img
            src="/images/real/ssf_event_members.jpg"
            alt="Swastik Srijan Foundation Leadership and Journey"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ================= IMPACT NUMBERS ================= */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center">
          {[
            ["75,000+", "Lives Impacted", "प्रभावित जीवन"],
            ["20,000+", "Beneficiaries", "लाभार्थी"],
            ["100+", "Programs Conducted", "आयोजित कार्यक्रम"],
            ["12+ Years", "Of Service", "सेवा के वर्ष"],
          ].map(([value, label, labelHi], i) => (
            <div key={i} className="border rounded-xl p-8 bg-zinc-50/50 hover:bg-white hover:shadow-lg transition-all">
              <p className="text-4xl font-black text-[#003366] mb-2">{value}</p>
              <p className="text-zinc-600 font-bold text-sm uppercase tracking-wider">{label}</p>
              <p className="text-zinc-400 font-hindi text-xs mt-1">{labelHi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= COORDINATOR MESSAGE ================= */}
      <section className="py-24 bg-zinc-50 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/real/journey-seeds.jpg"
                  alt="Young participants our seeds of change"
                  className="w-full h-auto block"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#fb8500] rounded-3xl -z-10 opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#003366] rounded-3xl -z-10 opacity-20"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-[#fb8500] font-bold uppercase tracking-widest text-sm">Message from NGO Coordinator</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#002344]">
                  Our Journey | <span className="text-[#fb8500]">हमारी यात्रा</span>
                </h2>
              </div>

              <div className="space-y-6 text-zinc-600 text-lg leading-relaxed">
                <p>
                  “Since its inception in 2013, Swastik Srijan Foundation has been nurturing young lives from the grassroots. Children who joined our programs at a very young age have grown alongside our initiatives — participating, learning, and contributing to community development. Every step of this journey reflects our commitment to empowering underprivileged communities across India.”
                </p>
                <p className="font-hindi text-zinc-500 text-base border-l-4 border-[#fb8500]/30 pl-6 italic">
                  “2013 में अपनी शुरुआत से, स्वास्तिक सृजन फाउंडेशन ने जमीनी स्तर से बच्चों और समुदायों का सशक्तिकरण किया है। जो बच्चे हमारे कार्यक्रमों में बहुत छोटे उम्र में जुड़े थे, वे अब हमारी पहल के साथ बढ़े हैं — भाग ले रहे हैं, सीख रहे हैं और समाज के विकास में योगदान दे रहे हैं। इस यात्रा का हर कदम वंचित समुदायों को सशक्त बनाने के हमारे संकल्प को दर्शाता है।”
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 relative">
                <div className="absolute -top-4 -left-4 text-6xl text-[#fb8500] opacity-20 font-serif">“</div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xl font-medium text-[#003366] italic">
                      “A single seed planted with care can grow into a forest of change — and our young participants are the seeds of a better India.”
                    </p>
                    <p className="font-hindi text-[#003366]/70">
                      “एक बीज जो सहेजकर बोया जाए, परिवर्तन के जंगल में बदल सकता है — और हमारे युवा सहभागी बेहतर भारत के बीज हैं।”
                    </p>
                  </div>

                  {/* Coordinator Signature with SMALL Image */}
                  <div className="flex items-center gap-4 pt-4 border-t border-zinc-50">
                    <img
                      src="/Teams_Images/ramesh_pandey.jpg"
                      alt="Ramesh Pandey"
                      className="w-16 h-16 rounded-full border-2 border-[#fb8500]/20 object-cover shadow-sm"
                    />
                    <div>
                      <p className="font-bold text-[#002344]">Ramesh Pandey</p>
                      <p className="text-xs text-[#fb8500] font-bold uppercase tracking-wider">Foundation Coordinator</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= TIMELINE ================= */}
      <section className="py-32 bg-white px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-24 space-y-4">
            <span className="text-[#fb8500] font-bold uppercase tracking-[0.2em] text-xs">Our Roadmap | हमारा रोडमैप</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#002344]">
              Our Growth Over <br /> <span className="text-[#fb8500]">the Years</span>
              <div className="text-2xl md:text-3xl font-sans font-normal text-[#002344]/60 mt-4">वर्षों की हमारी <span className="text-[#fb8500]">प्रगति</span></div>
            </h2>
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-zinc-200 md:-translate-x-1/2 rounded-full"></div>

            <div className="space-y-20">
              {[
                {
                  year: "2013",
                  title: "Foundation & Commitment",
                  desc: "The foundation was registered with a clear vision of inclusive and sustainable development.",
                  color: "#FF6600"
                },
                {
                  year: "2014",
                  title: "Nurturing Well-being",
                  desc: "Community health awareness and mental well-being initiatives were introduced.",
                  color: "#003366"
                },
                {
                  year: "2015",
                  title: "Expanding Early Initiatives",
                  desc: "Strengthened nutrition and preventive support services for vulnerable populations.",
                  color: "#fb8500"
                },
                {
                  year: "2016",
                  title: "Rural Empowerment",
                  desc: "Grassroots development programs strengthened through community participation and appropriate technology.",
                  color: "#002344"
                },
                {
                  year: "2017",
                  title: "Education Focus",
                  desc: "Education support initiatives launched for underprivileged children.",
                  color: "#d90429"
                },
                {
                  year: "2018",
                  title: "Promoting Health and Hygiene",
                  desc: "Conducted large-scale health camps, hygiene awareness drives, and sanitation programs.",
                  color: "#fb8500"
                },
                {
                  year: "2019",
                  title: "Women’s Empowerment",
                  desc: "Skill development and livelihood programs initiated for rural women.",
                  color: "#002344"
                },
                {
                  year: "2020",
                  title: "Resilience in Crisis",
                  desc: "Emergency relief and community support provided during the COVID-19 crisis.",
                  color: "#fb8500"
                },
                {
                  year: "2021",
                  title: "Sustaining Momentum",
                  desc: "Strengthened digital learning, digital platforms and changing conditions.",
                  color: "#003366"
                },
                {
                  year: "2022",
                  title: "Strengthening Communities",
                  desc: "Reinforced efforts with disaster relief, implemented long-term resilience-building initiatives recovering from challenges.",
                  color: "#d90429"
                },
                {
                  year: "2023",
                  title: "SSF Learning Hub",
                  desc: "The SSF Learning Hub was established to support structured learning, mentorship, and career guidance.",
                  color: "#003366"
                },
                {
                  year: "2024",
                  title: "Integrating Learning & Environment",
                  desc: "Launched holistic programs combining environmental education, sustainability practices, and nutrition awareness.",
                  color: "#FF6600"
                },
                {
                  year: "2025",
                  title: "Technology Integration",
                  desc: "Programs scaled through digital tools, data-driven planning, and local leadership.",
                  color: "#fb8500"
                },
                {
                  year: "2026+",
                  title: "Continuing the Mission",
                  desc: "Expanding impact through partnerships, innovation, and sustainable community development.",
                  color: "#d90429"
                }
              ].map((item, i) => (
                <div key={i} className={`relative flex items-center justify-between md:justify-normal even:md:flex-row-reverse group`}>
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-4 border-white shadow-xl md:-translate-x-1/2 z-20 transition-transform group-hover:scale-125" style={{ backgroundColor: item.color }}></div>

                  {/* Content */}
                  <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${i % 2 === 0 ? "md:pr-12 text-left md:text-right" : "md:pl-12 text-left"}`}>
                    <motion.div
                      initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-zinc-100 hover:shadow-2xl transition-all duration-300"
                    >
                      <span className="text-4xl font-black opacity-10 block mb-2" style={{ color: item.color }}>{item.year}</span>
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-[#002344] mb-3">{item.title}</h3>
                      <p className="text-zinc-600 leading-relaxed font-medium">{item.desc}</p>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY IT MATTERS ================= */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-6">
            Why Our Work Matters
          </h2>
          <p className="text-zinc-600 leading-relaxed max-w-3xl mx-auto">
            Every initiative we undertake is designed to create long-term,
            sustainable change. We believe real impact is measured not just
            in numbers, but in transformed lives and stronger communities.
          </p>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-[#003366] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:30px_30px]"></div>
        <div className="container mx-auto px-6 text-center relative z-10 space-y-6">
          <h2 className="text-4xl lg:text-6xl font-bold text-white max-w-3xl mx-auto leading-tight">
            Be a Part of Our Journey.
          </h2>
          <p className="mb-2 text-zinc-300 text-xl max-w-2xl mx-auto">
            Your support helps us continue creating meaningful impact across India.
          </p>
          <a
            href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
            target="_blank"
            rel="noreferrer noopener"
          >
            <button className="btn-cta w-full sm:w-auto px-12 py-5 text-xl bg-white text-[#003366] hover:bg-zinc-200 hover:text-[#003366]">
              Support Our Mission
            </button>
          </a>
        </div>
      </section>

    </div>
  );
}
