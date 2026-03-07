
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaArrowRight, FaChartLine, FaGlobeAsia, FaHandsHelping, FaHeart, FaHandshake, FaLeaf, FaShieldAlt, FaUsers } from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import PageHero from "../components/PageHero";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-zinc-800">

      {/* ================= HERO ================= */}
      <PageHero
        image="/images/who-we-are-hero.png"
        title="Who We Are"
        subtitle="Empowering communities through grassroots governance and sustainable development."
        hindiSubtitle="शिक्षा, स्वास्थ्य और सशक्तिकरण के माध्यम से सामुदायिक विकास।"
        height="h-[28vh] md:min-h-[60vh]"
        objectPosition="top"
        overlayOpacity="bg-black/85 md:bg-black/50"
      />

      {/* ================= SHORT INTRO ================= */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-[#002344] mb-8">Who We Are | हम कौन हैं</h2>
          <p className="text-xl text-zinc-600 leading-relaxed mb-6">
            Founded in 2013, Swastik Srijan Foundation is a dedicated non-profit organization working across India to uplift communities through education, health, and sustainable development.
          </p>
          <p className="text-lg font-hindi text-zinc-500 mb-12">
            2013 में स्थापित, स्वस्तिक सृजन फाउंडेशन एक समर्पित गैर-लाभकारी संगठन है जो शिक्षा, स्वास्थ्य और सतत विकास के माध्यम से समुदायों को ऊपर उठाने के लिए भारत भर में काम कर रहा है।
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Link to="/Mission" className="p-8 rounded-2xl bg-zinc-50 hover:bg-[#002344] hover:text-white transition-all group border border-zinc-100 flex flex-col h-full">
              <h3 className="text-xl font-bold mb-2">Mission & Vision</h3>
              <p className="text-sm opacity-80 mb-4 flex-grow">Our guiding principles and core values.</p>
              <div className="flex items-center gap-2 text-[#fb8500] font-bold text-sm uppercase tracking-wider group-hover:text-white mt-auto">
                Read More <FaArrowRight />
              </div>
            </Link>

            <Link to="/Objectives" className="p-8 rounded-2xl bg-zinc-50 hover:bg-[#002344] hover:text-white transition-all group border border-zinc-100 flex flex-col h-full">
              <h3 className="text-xl font-bold mb-2">Our Objectives</h3>
              <p className="text-sm opacity-80 mb-4 flex-grow">Key focus areas and developmental goals.</p>
              <div className="flex items-center gap-2 text-[#fb8500] font-bold text-sm uppercase tracking-wider group-hover:text-white mt-auto">
                Explore <FaArrowRight />
              </div>
            </Link>

            <Link to="/Team" className="p-8 rounded-2xl bg-zinc-50 hover:bg-[#002344] hover:text-white transition-all group border border-zinc-100 flex flex-col h-full">
              <h3 className="text-xl font-bold mb-2">Meet Our Team</h3>
              <p className="text-sm opacity-80 mb-4 flex-grow">The leadership and volunteers driving change.</p>
              <div className="flex items-center gap-2 text-[#fb8500] font-bold text-sm uppercase tracking-wider group-hover:text-white mt-auto">
                View Leaders <FaArrowRight />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= TEAM & COMMUNITY ================= */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">Our Core Community</h2>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Behind every program and impact story is a dedicated group of volunteers and staff members. Our team works tirelessly across various regions of India to ensure that the vision of Swastik Srijan Foundation translates into real-world change.
              </p>
              <p className="text-zinc-500 font-hindi">
                प्रत्येक कार्यक्रम और प्रभाव के पीछे स्वयंसेवकों और कर्मचारियों का एक समर्पित समूह होता है। हमारी टीम भारत के विभिन्न क्षेत्रों में अथक रूप से काम करती है।
              </p>
              <div className="pt-4">
                <Link to="/Team" className="inline-flex items-center gap-2 bg-[#002344] text-white px-8 py-3 rounded-full font-bold hover:bg-[#fb8500] transition-all">
                  Meet the Full Team <FaArrowRight />
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white"
            >
              <OptimizedImage
                src="/images/ssf-team.jpg"
                alt="SSF Team and Core Members"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= TRUST & COMPLIANCE ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344]">Trust & Compliance</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">We maintain the highest standards of transparency and official recognition.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-xl border border-zinc-100">
              <OptimizedImage
                src="/images/cvc-certificate.jpg"
                alt="CVC Pledge Certificate"
                className="w-full h-auto"
              />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <div className="p-6 bg-blue-50 border-l-4 border-[#002344] rounded-r-xl">
                <h3 className="text-xl font-bold text-[#002344] mb-2 font-serif underline">Commitment to Ethics</h3>
                <p className="text-zinc-600 text-sm">
                  Swastik Srijan Foundation is committed to maintaining the highest levels of integrity and governance. Our pledge with the Central Vigilance Commission (CVC) reinforces our dedication to ethical practices in all our operations.
                </p>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                We believe that trust is the foundation of every successful community initiative. By adhering to national standards and maintaining open records, we ensure that every donor's contribution and every volunteer's effort is utilized effectively.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <span className="block text-2xl font-bold text-[#fb8500]">100%</span>
                  <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Transparent</span>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <span className="block text-2xl font-bold text-[#fb8500]">Registered</span>
                  <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">NGO Darpan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= IMPACT STATISTICS ================= */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344]">Impact Statistics (Since 2013)</h2>
            <p className="text-zinc-500">Measurable outcomes that reflect our consistent grassroots work.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "20,000+", label: "Lives Impacted", icon: <FaUsers /> },
              { value: "40+", label: "Programs Conducted", icon: <FaHandsHelping /> },
              { value: "100+", label: "Villages Reached", icon: <FaGlobeAsia /> },
              { value: "50,000+", label: "Beneficiaries", icon: <FaHeart /> },
            ].map((item, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#fb8500] mx-auto mb-4 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <p className="text-2xl md:text-3xl font-black text-[#002344]">{item.value}</p>
                <p className="text-sm text-zinc-500 mt-1">{item.label}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OUR JOURNEY TIMELINE ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344]">Our Journey Since 2013</h2>
            <p className="text-zinc-500 mt-3">Milestones that shaped our mission and impact.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { year: "2013", title: "Foundation Established", icon: <FaLeaf /> },
              { year: "2016", title: "Expanded Rural Outreach", icon: <FaHandsHelping /> },
              { year: "2020", title: "Health & Relief Response", icon: <FaShieldAlt /> },
              { year: "2025", title: "CSR & Institutional Growth", icon: <FaChartLine /> },
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6 hover:bg-white hover:shadow-md transition-all">
                <p className="text-[#fb8500] font-black text-xl">{item.year}</p>
                <div className="text-[#002344] text-2xl mt-2">{item.icon}</div>
                <h3 className="mt-3 font-bold text-[#002344]">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OUR WORK IN ACTION ================= */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344]">Our Work in Action</h2>
            <p className="text-zinc-500 mt-3">A visual snapshot of our education, health, environment, and community programs.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: "/images/tree-planting-2.jpg", alt: "Tree plantation drive" },
              { src: "/images/classroom-mat-session.jpg", alt: "Children classroom session" },
              { src: "/images/health-program-masks.jpg", alt: "Health awareness activity" },
              { src: "/images/slum-area-outreach.jpg", alt: "Community outreach" },
            ].map((img, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border border-zinc-100 shadow-sm group">
                <OptimizedImage src={img.src} alt={img.alt} className="w-full h-44 md:h-56 group-hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TEAM HIGHLIGHTS ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344]">Team Highlights</h2>
            <p className="text-zinc-500 mt-3">Leadership and core members committed to ethical and impactful action.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Mr. Ramesh Pandey",
                role: "Founder & National President",
                bio: "Leads organizational vision, governance, and long-term grassroots strategy.",
                img: "/Teams_Images/ramesh_pandey.jpg",
              },
              {
                name: "Ms. Preeti Shukla",
                role: "Program Head",
                bio: "Oversees on-ground execution and coordination across key program verticals.",
                img: "/Teams_Images/image_19.jpg",
              },
              {
                name: "Ms. Divya Sharma",
                role: "Chief Finance Officer",
                bio: "Ensures financial discipline, reporting quality, and donor trust compliance.",
                img: "/Teams_Images/divya_sharma.jpg",
              },
            ].map((member, idx) => (
              <div key={idx} className="bg-zinc-50 border border-zinc-100 rounded-3xl p-6 hover:shadow-lg transition-all">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#002344]">{member.name}</h3>
                <p className="text-sm font-semibold text-[#fb8500]">{member.role}</p>
                <p className="text-sm text-zinc-600 mt-3">{member.bio}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/Team" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#002344] text-white font-bold hover:bg-[#fb8500] transition-all">
              View Full Team <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CSR PARTNERSHIP + CTA ================= */}
      <section className="py-24 bg-gradient-to-br from-[#001529] to-[#002344] text-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <h2 className="text-3xl md:text-5xl font-serif font-bold">Partner With Us / CSR Partnership</h2>
              <p className="text-zinc-300 text-lg">
                We collaborate with companies, institutions, and philanthropic partners to deliver scalable social impact with measurable outcomes.
              </p>
              <div className="inline-flex items-center gap-2 text-[#fb8500] font-bold uppercase tracking-widest text-xs">
                <FaHandshake /> Responsible Partnerships • Transparent Reporting
              </div>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-3xl p-8 grid sm:grid-cols-2 gap-4">
              <Link to="/Donate" className="text-center py-4 rounded-xl bg-[#fb8500] font-bold hover:bg-[#ff9f1c] transition-all">Donate</Link>
              <Link to="/Volunteer" className="text-center py-4 rounded-xl bg-white/10 font-bold hover:bg-white/20 transition-all">Volunteer</Link>
              <Link to="/CSRPartnership" className="text-center py-4 rounded-xl bg-white text-[#002344] font-bold hover:bg-zinc-100 transition-all">CSR Partnership</Link>
              <Link to="/PartnerWithUs" className="text-center py-4 rounded-xl border border-white/40 font-bold hover:bg-white/10 transition-all">Partner With Us</Link>
            </div>
          </div>

          <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <h3 className="text-2xl font-bold">Financial Transparency / Audit Reports</h3>
            <p className="text-zinc-300 mt-2">Review year-wise reports, compliance details, and accountability records.</p>
            <div className="mt-5">
              <Link to="/Transparency" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-[#002344] font-bold hover:bg-[#fb8500] hover:text-white transition-all">
                Open Transparency Page <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
