import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaArrowRight, FaCalendarAlt, FaGlobeAsia, FaHeart, FaHandshake, FaShieldAlt, FaUsers, FaBullseye } from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import PageHero from "../components/PageHero";
import footerImg1 from "../assets/footer-gallery-1.jpg";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-zinc-800">
      <PageHero
        image={footerImg1}
        title="Who We Are"
        subtitle="Empowering communities through grassroots governance and sustainable development."
        hindiSubtitle="शिक्षा, स्वास्थ्य और सशक्तिकरण के माध्यम से सामुदायिक विकास।"
        height="h-[28vh] md:min-h-[60vh]"
        objectPosition="center"
        overlayOpacity="bg-black/85 md:bg-black/50"
      />

      {/* ================= OFFICIAL IDENTITY ================= */}
      <section className="py-10 bg-[#002344] text-white">
        <div className="container mx-auto px-6 max-w-6xl grid grid-cols-2 md:grid-cols-5 gap-5 text-center">
          <div><FaCalendarAlt className="mx-auto text-[#fb8500] text-2xl mb-2" /><p className="font-bold">December 2013</p><p className="text-xs text-zinc-300 mt-1">Established</p></div>
          <div><FaShieldAlt className="mx-auto text-[#fb8500] text-2xl mb-2" /><p className="font-bold text-sm md:text-base">05/22/03/11448/13</p><p className="text-xs text-zinc-300 mt-1">Registration No.</p></div>
          <div><FaBullseye className="mx-auto text-[#fb8500] text-2xl mb-2" /><p className="font-bold">MP Societies Act</p><p className="text-xs text-zinc-300 mt-1">1973</p></div>
          <div><FaGlobeAsia className="mx-auto text-[#fb8500] text-2xl mb-2" /><p className="font-bold">Across India</p><p className="text-xs text-zinc-300 mt-1">Area of Work</p></div>
          <div><FaHeart className="mx-auto text-[#fb8500] text-2xl mb-2" /><p className="font-bold">Rewa, M.P.</p><p className="text-xs text-zinc-300 mt-1">Registered Office</p></div>
        </div>
      </section>

      {/* ================= SHORT INTRO ================= */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-[#fb8500] font-bold text-sm tracking-[0.2em] uppercase">About SSF</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#002344] mt-2 mb-8">Who We Are | हम कौन हैं</h2>
          <p className="text-xl text-zinc-600 leading-relaxed mb-6">
            Founded in December 2013, Swastik Srijan Foundation is a registered non-profit organization based in Rewa, Madhya Pradesh, working across India to contribute to community development through education, health, skills, awareness and sustainable initiatives.
          </p>
          <p className="text-lg font-hindi text-zinc-500 mb-12">
            दिसंबर 2013 में स्थापित, स्वस्तिक सृजन फाउंडेशन मध्य प्रदेश के रीवा में स्थित एक पंजीकृत गैर-लाभकारी संस्था है, जो शिक्षा, स्वास्थ्य, कौशल, जागरूकता और सतत विकास के माध्यम से भारत भर में समुदायों के साथ कार्य करती है।
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Link to="/Mission" className="p-8 rounded-2xl bg-zinc-50 hover:bg-[#002344] hover:text-white transition-all group border border-zinc-100 flex flex-col h-full">
              <h3 className="text-xl font-bold mb-2">Mission & Vision</h3><p className="text-sm opacity-80 mb-4 flex-grow">Our guiding principles and core values.</p><div className="flex items-center gap-2 text-[#fb8500] font-bold text-sm uppercase tracking-wider group-hover:text-white mt-auto">Read More <FaArrowRight /></div>
            </Link>
            <Link to="/Objectives" className="p-8 rounded-2xl bg-zinc-50 hover:bg-[#002344] hover:text-white transition-all group border border-zinc-100 flex flex-col h-full">
              <h3 className="text-xl font-bold mb-2">Our Objectives</h3><p className="text-sm opacity-80 mb-4 flex-grow">Key focus areas and developmental goals.</p><div className="flex items-center gap-2 text-[#fb8500] font-bold text-sm uppercase tracking-wider group-hover:text-white mt-auto">Explore <FaArrowRight /></div>
            </Link>
            <Link to="/Team" className="p-8 rounded-2xl bg-zinc-50 hover:bg-[#002344] hover:text-white transition-all group border border-zinc-100 flex flex-col h-full">
              <h3 className="text-xl font-bold mb-2">Meet Our Team</h3><p className="text-sm opacity-80 mb-4 flex-grow">The leadership and volunteers driving change.</p><div className="flex items-center gap-2 text-[#fb8500] font-bold text-sm uppercase tracking-wider group-hover:text-white mt-auto">View Leaders <FaArrowRight /></div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOUNDER MESSAGE ================= */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12"><p className="text-[#fb8500] font-bold text-sm tracking-[0.2em] uppercase">Leadership</p><h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344] mt-2">Founder’s Message</h2><p className="text-zinc-500 mt-3">संस्थापक का संदेश</p></div>
          <div className="grid lg:grid-cols-[280px_1fr] gap-10 items-center bg-white rounded-[2rem] p-7 md:p-10 shadow-xl border border-zinc-100">
            <div className="text-center"><div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white"><OptimizedImage src="/images/leadership.jpg" alt="Mr. Ramesh Pandey, Founder and President" className="w-full aspect-[4/5] object-cover" /></div><h3 className="text-xl font-bold text-[#002344] mt-5">Mr. Ramesh Pandey</h3><p className="text-[#fb8500] font-semibold text-sm">Founder & President</p></div>
            <div className="space-y-5 text-zinc-600 leading-relaxed text-lg"><p>“Social development becomes meaningful when people come together with a spirit of cooperation, learning and responsibility. Swastik Srijan Foundation was established with the belief that every person deserves dignity, opportunity and a chance to contribute.”</p><p>Our journey is guided by education, skill development, awareness, community participation and practical support. We seek to encourage positive change through sincere service, transparency and meaningful partnerships.</p><p className="font-hindi text-base text-zinc-500">हमारा प्रयास है कि सहयोग, कौशल, जागरूकता और सृजन के माध्यम से समाज में सकारात्मक परिवर्तन को बढ़ावा दिया जाए। सेवा में पारदर्शिता, सम्मान और समान अवसर हमारे लिए महत्वपूर्ण हैं।</p></div>
          </div>
        </div>
      </section>

      {/* ================= JOURNEY ================= */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl text-center"><p className="text-[#fb8500] font-bold text-sm tracking-[0.2em] uppercase">Our Journey</p><h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344] mt-2">A Journey of Service Since 2013</h2><p className="text-lg text-zinc-600 leading-relaxed max-w-3xl mx-auto mt-6">From our establishment in December 2013 to continued community work and digital outreach, SSF has evolved through learning, participation and service. Our detailed activities and milestones are presented on the Impact page.</p><div className="grid md:grid-cols-3 gap-5 mt-10 text-left"><div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100"><FaHeart className="text-[#fb8500] text-2xl mb-4" /><h3 className="font-bold text-[#002344]">2013–2017</h3><p className="text-sm text-zinc-600 mt-2">Building the foundation, community relationships and early social initiatives.</p></div><div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100"><FaUsers className="text-[#fb8500] text-2xl mb-4" /><h3 className="font-bold text-[#002344]">2018–2024</h3><p className="text-sm text-zinc-600 mt-2">Expanding social initiatives, learning activities and community-focused work.</p></div><div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100"><FaGlobeAsia className="text-[#fb8500] text-2xl mb-4" /><h3 className="font-bold text-[#002344]">2025–2026</h3><p className="text-sm text-zinc-600 mt-2">Strengthening digital outreach, awareness and opportunities for wider participation.</p></div></div><Link to="/Impact" className="inline-flex items-center gap-2 mt-9 bg-[#002344] text-white px-8 py-3 rounded-full font-bold hover:bg-[#fb8500] transition-all">Explore Our Impact <FaArrowRight /></Link></div>
      </section>

      {/* ================= TEAM & COMMUNITY ================= */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-100">
        <div className="container mx-auto px-6 max-w-6xl"><div className="grid lg:grid-cols-2 gap-12 items-center"><motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6"><h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">Our Core Community</h2><p className="text-lg text-zinc-600 leading-relaxed">Behind every program and impact story is a dedicated group of volunteers and staff members. Our team works across various regions of India to help translate the vision of Swastik Srijan Foundation into meaningful community action.</p><p className="text-zinc-500 font-hindi">प्रत्येक कार्यक्रम और प्रभाव के पीछे स्वयंसेवकों और कर्मचारियों का एक समर्पित समूह होता है। हमारी टीम भारत के विभिन्न क्षेत्रों में संस्था के उद्देश्य को सार्थक कार्य में बदलने का प्रयास करती है।</p><div className="pt-4"><Link to="/Team" className="inline-flex items-center gap-2 bg-[#002344] text-white px-8 py-3 rounded-full font-bold hover:bg-[#fb8500] transition-all">Meet the Full Team <FaArrowRight /></Link></div></motion.div><motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white"><OptimizedImage src="/images/ssf-team.jpg" alt="SSF Team and Core Members" className="w-full h-full object-cover" /></motion.div></div></div>
      </section>

      {/* ================= MISSION / VALUES SNAPSHOT ================= */}
      <section className="py-20 bg-white"><div className="container mx-auto px-6 max-w-6xl"><div className="text-center mb-12"><p className="text-[#fb8500] font-bold text-sm tracking-[0.2em] uppercase">What Guides Us</p><h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344] mt-2">Mission, Approach & Values</h2></div><div className="grid md:grid-cols-3 gap-6"><div className="p-7 rounded-2xl bg-zinc-50 border border-zinc-100"><FaBullseye className="text-[#fb8500] text-2xl mb-4" /><h3 className="font-bold text-[#002344] text-xl">Our Mission</h3><p className="text-sm text-zinc-600 leading-relaxed mt-3">To contribute to inclusive community development through education, skills, health, awareness, participation and practical support.</p></div><div className="p-7 rounded-2xl bg-zinc-50 border border-zinc-100"><FaHandshake className="text-[#fb8500] text-2xl mb-4" /><h3 className="font-bold text-[#002344] text-xl">Our Approach</h3><p className="text-sm text-zinc-600 leading-relaxed mt-3">We encourage cooperation, learning, responsible awareness and partnerships that can create meaningful and sustainable outcomes.</p></div><div className="p-7 rounded-2xl bg-zinc-50 border border-zinc-100"><FaHeart className="text-[#fb8500] text-2xl mb-4" /><h3 className="font-bold text-[#002344] text-xl">Our Values</h3><p className="text-sm text-zinc-600 leading-relaxed mt-3">Transparency, dignity, equal opportunity, cooperation and service without discrimination guide our work.</p></div></div></div></section>

      {/* ================= TRUST & COMPLIANCE ================= */}
      <section className="py-24 bg-white border-t border-zinc-100"><div className="container mx-auto px-6 max-w-6xl"><div className="text-center mb-16 space-y-4"><p className="text-[#fb8500] font-bold text-sm tracking-[0.2em] uppercase">Transparency & Governance</p><h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344]">Trust & Compliance</h2><p className="text-zinc-500 max-w-2xl mx-auto">We aim to maintain clear records, responsible governance and ethical practices in our work.</p></div><div className="grid md:grid-cols-2 gap-12 items-center"><div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-xl border border-zinc-100"><OptimizedImage src="/images/cvc-certificate.jpg" alt="CVC Pledge Certificate" className="w-full h-auto" /></div><div className="order-1 md:order-2 space-y-6"><div className="p-6 bg-blue-50 border-l-4 border-[#002344] rounded-r-xl"><h3 className="text-xl font-bold text-[#002344] mb-2 font-serif">Commitment to Ethics</h3><p className="text-zinc-600 text-sm">Swastik Srijan Foundation is committed to integrity, responsible governance and ethical practices. Our pledge with the Central Vigilance Commission (CVC) reflects this commitment.</p></div><p className="text-zinc-600 leading-relaxed">We believe trust is built through clear information, responsible conduct and accountability. We aim to use every donor contribution and volunteer effort responsibly and in accordance with our objectives.</p><div className="grid grid-cols-2 gap-4 pt-2"><div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100"><span className="block text-2xl font-bold text-[#fb8500]">Registered</span><span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">NGO Darpan</span></div><div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100"><span className="block text-2xl font-bold text-[#fb8500]">Committed</span><span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">To Transparency</span></div></div></div></div></div></section>

      {/* ================= CTA ================= */}
      <section className="py-16 bg-[#001529] text-white"><div className="container mx-auto px-6 max-w-5xl text-center"><h2 className="text-3xl md:text-4xl font-bold">Be Part of the Journey</h2><p className="text-zinc-300 mt-4 max-w-2xl mx-auto">Join SSF as a member, volunteer, supporter or partner and contribute to meaningful community initiatives.</p><div className="flex flex-col sm:flex-row justify-center gap-4 mt-8"><Link to="/GetInvolved" className="px-8 py-3 bg-[#fb8500] rounded-full font-bold hover:bg-[#e57600] transition-all">Join SSF</Link><Link to="/Volunteer" className="px-8 py-3 border-2 border-white rounded-full font-bold hover:bg-white hover:text-[#002344] transition-all">Volunteer</Link></div></div></section>
    </main>
  );
}
