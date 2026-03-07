
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import PageHero from "../components/PageHero";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-zinc-800">

      {/* ================= HERO ================= */}
      <PageHero
        image="/images/real/office_banner.jpg"
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
                src="/images/real/ssf_event_members.jpg"
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
                src="/images/real/ncw_pledge_certificate.jpg"
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
    </main>
  );
}
