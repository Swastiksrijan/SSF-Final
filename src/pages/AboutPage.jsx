import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaArrowRight, FaCalendarAlt, FaGlobeAsia, FaHeart, FaHandshake, FaShieldAlt, FaUsers, FaBullseye } from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import footerImg1 from "../assets/footer-gallery-1.jpg";
import footerImg2 from "../assets/footer-gallery-2.jpg";
import footerImg3 from "../assets/footer-gallery-3.jpg";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-[#41506b]">
      <section className="relative min-h-[48vh] md:min-h-[60vh] w-full overflow-hidden bg-[#08192b] text-white">
        <div className="absolute inset-0 p-2 sm:p-3 lg:p-4">
          <div className="grid h-full grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2 lg:gap-3">
            {[footerImg1, footerImg2, footerImg3].map((img, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg lg:rounded-xl bg-[#0a2540]">
                <img src={img} alt="" className="h-full w-full object-cover object-center opacity-80 scale-105" loading={index === 0 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-[#08192b]/58"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#08192b]/30 via-[#08192b]/55 to-[#08192b]/90"></div>
        <div className="relative z-10 flex min-h-[48vh] md:min-h-[60vh] items-center justify-center px-5 py-20 lg:px-8 text-center">
          <div className="max-w-5xl">
            <p className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.22em] text-[#e4c86a]">Swastik Srijan Foundation / स्थापना</p>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-white">Who We Are</h1>
            <p className="mx-auto mt-5 max-w-3xl text-base md:text-xl text-[#e2e8f0] leading-relaxed">Empowering communities through grassroots governance and sustainable development.</p>
            <p className="mx-auto mt-2 max-w-3xl text-base md:text-lg text-[#cbd5e1] leading-relaxed">शिक्षा, स्वास्थ्य और सशक्तिकरण के माध्यम से सामुदायिक विकास।</p>
          </div>
        </div>
      </section>

      <section className="relative py-12 md:py-16 bg-[#0a2540] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#08192b] via-[#0a2540] to-[#123a5e]"></div>
        <div className="relative container mx-auto px-5 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            <div className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-sm px-6 py-7 md:px-7 md:py-8 text-center shadow-xl">
              <FaCalendarAlt className="mx-auto text-[#c9a227] text-3xl md:text-4xl mb-4" />
              <p className="text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-[#e4c86a]">Established</p>
              <p className="mt-2 text-2xl md:text-3xl lg:text-4xl font-black tracking-tight">December 2013</p>
              <p className="mt-2 text-sm md:text-base text-[#cbd5e1]">Foundation established</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-sm px-6 py-7 md:px-7 md:py-8 text-center shadow-xl">
              <FaShieldAlt className="mx-auto text-[#c9a227] text-3xl md:text-4xl mb-4" />
              <p className="text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-[#e4c86a]">Registration</p>
              <p className="mt-2 text-xl md:text-2xl lg:text-3xl font-black tracking-tight break-words">05/22/03/11448/13</p>
              <p className="mt-2 text-sm md:text-base text-[#cbd5e1]">MP Societies Act, 1973</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-sm px-6 py-7 md:px-7 md:py-8 text-center shadow-xl">
              <FaGlobeAsia className="mx-auto text-[#c9a227] text-3xl md:text-4xl mb-4" />
              <p className="text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-[#e4c86a]">Area of Work</p>
              <p className="mt-2 text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">PAN INDIA</p>
              <p className="mt-2 text-sm md:text-base text-[#cbd5e1]">Working across India</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-sm px-6 py-7 md:px-7 md:py-8 text-center shadow-xl">
              <FaHeart className="mx-auto text-[#c9a227] text-3xl md:text-4xl mb-4" />
              <p className="text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-[#e4c86a]">Registered Office</p>
              <p className="mt-2 text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">REWA, M.P.</p>
              <p className="mt-2 text-sm md:text-base text-[#cbd5e1]">Madhya Pradesh, India</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white"><div className="container mx-auto px-6 max-w-4xl text-center">
        <p className="text-[#7e5f22] font-bold text-sm tracking-[0.2em] uppercase">About SSF</p><h2 className="text-3xl md:text-4xl font-bold text-[#0a2540] mt-2 mb-8">Who We Are | हम कौन हैं</h2>
        <p className="text-xl text-[#41506b] leading-relaxed mb-6">Founded in December 2013, Swastik Srijan Foundation is a registered non-profit organization based in Rewa, Madhya Pradesh, working across India to contribute to community development through education, health, skills, awareness and sustainable initiatives.</p>
        <p className="text-lg font-hindi text-[#5c6b80] mb-12">दिसंबर 2013 में स्थापित, स्वस्तिक सृजन फाउंडेशन मध्य प्रदेश के रीवा में स्थित एक पंजीकृत गैर-लाभकारी संस्था है, जो शिक्षा, स्वास्थ्य, कौशल, जागरूकता और सतत विकास के माध्यम से भारत भर में समुदायों के साथ कार्य करती है।</p>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <Link to="/Mission" className="p-8 rounded-2xl bg-[#f8f5ed] hover:bg-[#0a2540] hover:text-white transition-all group border border-[#e9e3d6] flex flex-col h-full"><h3 className="text-xl font-bold mb-2">Mission & Vision</h3><p className="text-sm opacity-80 mb-4 flex-grow">Our guiding principles and core values.</p><div className="flex items-center gap-2 text-[#7e5f22] font-bold text-sm uppercase tracking-wider group-hover:text-white mt-auto">Read More <FaArrowRight /></div></Link>
          <Link to="/Objectives" className="p-8 rounded-2xl bg-[#f8f5ed] hover:bg-[#0a2540] hover:text-white transition-all group border border-[#e9e3d6] flex flex-col h-full"><h3 className="text-xl font-bold mb-2">Our Objectives</h3><p className="text-sm opacity-80 mb-4 flex-grow">Key focus areas and developmental goals.</p><div className="flex items-center gap-2 text-[#7e5f22] font-bold text-sm uppercase tracking-wider group-hover:text-white mt-auto">Explore <FaArrowRight /></div></Link>
          <Link to="/Team" className="p-8 rounded-2xl bg-[#f8f5ed] hover:bg-[#0a2540] hover:text-white transition-all group border border-[#e9e3d6] flex flex-col h-full"><h3 className="text-xl font-bold mb-2">Meet Our Team</h3><p className="text-sm opacity-80 mb-4 flex-grow">The leadership and volunteers driving change.</p><div className="flex items-center gap-2 text-[#7e5f22] font-bold text-sm uppercase tracking-wider group-hover:text-white mt-auto">View Leaders <FaArrowRight /></div></Link>
        </div>
      </div></section>

      <section className="py-20 bg-[#f8f5ed] border-y border-[#e9e3d6]"><div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12"><p className="text-[#7e5f22] font-bold text-sm tracking-[0.2em] uppercase">Leadership</p><h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0a2540] mt-2">Founder’s Message</h2><p className="text-[#5c6b80] mt-3">संस्थापक का संदेश</p></div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-center bg-white rounded-[2rem] p-7 md:p-10 shadow-xl border border-[#e9e3d6]">
          <div className="text-center">
            <div className="mx-auto w-full max-w-[280px] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-[#f5f1e8]">
              <OptimizedImage src="/Teams_Images/ramesh_pandey.jpg?v=2" alt="Mr. Ramesh Pandey, Founder and President of Swastik Srijan Foundation" className="block w-full aspect-square object-cover" />
            </div>
            <h3 className="text-xl font-bold text-[#0a2540] mt-5">Mr. Ramesh Pandey</h3><p className="text-[#7e5f22] font-semibold text-sm">Founder & President</p>
          </div>
          <div className="space-y-5 text-[#41506b] leading-relaxed text-lg"><p>“Social development becomes meaningful when people come together with a spirit of cooperation, learning and responsibility. Swastik Srijan Foundation was established with the belief that every person deserves dignity, opportunity and a chance to contribute.”</p><p>Our journey is guided by education, skill development, awareness, community participation and practical support. We seek to encourage positive change through sincere service, transparency and meaningful partnerships.</p><p className="font-hindi text-base text-[#5c6b80]">हमारा प्रयास है कि सहयोग, कौशल, जागरूकता और सृजन के माध्यम से समाज में सकारात्मक परिवर्तन को बढ़ावा दिया जाए। सेवा में पारदर्शिता, सम्मान और समान अवसर हमारे लिए महत्वपूर्ण हैं।</p></div>
        </div>
      </div></section>

      <section className="py-20 bg-white"><div className="container mx-auto px-6 max-w-5xl text-center"><p className="text-[#7e5f22] font-bold text-sm tracking-[0.2em] uppercase">Our Journey</p><h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0a2540] mt-2">A Journey of Service Since 2013</h2><p className="text-lg text-[#41506b] leading-relaxed max-w-3xl mx-auto mt-6">From our establishment in December 2013 to continued community work and digital outreach, SSF has evolved through learning, participation and service. Our detailed activities and milestones are presented on the Impact page.</p><div className="grid md:grid-cols-3 gap-5 mt-10 text-left"><div className="p-6 rounded-2xl bg-[#f8f5ed] border border-[#e9e3d6]"><FaHeart className="text-[#c9a227] text-2xl mb-4" /><h3 className="font-bold text-[#0a2540]">2013–2017</h3><p className="text-sm text-[#41506b] mt-2">Building the foundation, community relationships and early social initiatives.</p></div><div className="p-6 rounded-2xl bg-[#f8f5ed] border border-[#e9e3d6]"><FaUsers className="text-[#c9a227] text-2xl mb-4" /><h3 className="font-bold text-[#0a2540]">2018–2024</h3><p className="text-sm text-[#41506b] mt-2">Expanding social initiatives, learning activities and community-focused work.</p></div><div className="p-6 rounded-2xl bg-[#f8f5ed] border border-[#e9e3d6]"><FaGlobeAsia className="text-[#c9a227] text-2xl mb-4" /><h3 className="font-bold text-[#0a2540]">2025–2026</h3><p className="text-sm text-[#41506b] mt-2">Strengthening digital outreach, awareness and opportunities for wider participation.</p></div></div><Link to="/Impact" className="inline-flex items-center gap-2 mt-9 bg-[#0a2540] text-white px-8 py-3 rounded-full font-bold hover:bg-[#c9a227] hover:text-[#0f2740] transition-all">Explore Our Impact <FaArrowRight /></Link></div></section>

      <section className="py-20 bg-[#f8f5ed] border-y border-[#e9e3d6]"><div className="container mx-auto px-6 max-w-6xl"><div className="grid lg:grid-cols-2 gap-12 items-center"><motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6"><h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0a2540]">Our Core Community</h2><p className="text-lg text-[#41506b] leading-relaxed">Behind every program and impact story is a dedicated group of volunteers and staff members. Our team works across various regions of India to help translate the vision of Swastik Srijan Foundation into meaningful community action.</p><p className="text-[#5c6b80] font-hindi">प्रत्येक कार्यक्रम और प्रभाव के पीछे स्वयंसेवकों और कर्मचारियों का एक समर्पित समूह होता है। हमारी टीम भारत के विभिन्न क्षेत्रों में संस्था के उद्देश्य को सार्थक कार्य में बदलने का प्रयास करती है।</p><div className="pt-4"><Link to="/Team" className="inline-flex items-center gap-2 bg-[#0a2540] text-white px-8 py-3 rounded-full font-bold hover:bg-[#c9a227] hover:text-[#0f2740] transition-all">Meet the Full Team <FaArrowRight /></Link></div></motion.div><motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white"><OptimizedImage src="/images/ssf-team.jpg" alt="SSF Team and Core Members" className="w-full h-full object-cover" /></motion.div></div></div></section>

      <section className="py-20 bg-white"><div className="container mx-auto px-6 max-w-6xl"><div className="text-center mb-12"><p className="text-[#7e5f22] font-bold text-sm tracking-[0.2em] uppercase">What Guides Us</p><h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0a2540] mt-2">Mission, Approach & Values</h2></div><div className="grid md:grid-cols-3 gap-6"><div className="p-7 rounded-2xl bg-[#f8f5ed] border border-[#e9e3d6]"><FaBullseye className="text-[#c9a227] text-2xl mb-4" /><h3 className="font-bold text-[#0a2540] text-xl">Our Mission</h3><p className="text-sm text-[#41506b] leading-relaxed mt-3">To contribute to inclusive community development through education, skills, health, awareness, participation and practical support.</p></div><div className="p-7 rounded-2xl bg-[#f8f5ed] border border-[#e9e3d6]"><FaHandshake className="text-[#c9a227] text-2xl mb-4" /><h3 className="font-bold text-[#0a2540] text-xl">Our Approach</h3><p className="text-sm text-[#41506b] leading-relaxed mt-3">We encourage cooperation, learning, responsible awareness and partnerships that can create meaningful and sustainable outcomes.</p></div><div className="p-7 rounded-2xl bg-[#f8f5ed] border border-[#e9e3d6]"><FaHeart className="text-[#c9a227] text-2xl mb-4" /><h3 className="font-bold text-[#0a2540] text-xl">Our Values</h3><p className="text-sm text-[#41506b] leading-relaxed mt-3">Transparency, dignity, equal opportunity, cooperation and service without discrimination guide our work.</p></div></div></div></section>

      <section className="py-24 bg-white border-t border-[#e9e3d6]"><div className="container mx-auto px-6 max-w-6xl"><div className="text-center mb-16 space-y-4"><p className="text-[#7e5f22] font-bold text-sm tracking-[0.2em] uppercase">Transparency & Governance</p><h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0a2540]">Trust & Compliance</h2><p className="text-[#5c6b80] max-w-2xl mx-auto">We aim to maintain clear records, responsible governance and ethical practices in our work.</p></div><div className="grid md:grid-cols-2 gap-12 items-center"><div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-xl border border-[#e9e3d6]"><OptimizedImage src="/images/cvc-certificate.jpg" alt="CVC Pledge Certificate" className="w-full h-auto" /></div><div className="order-1 md:order-2 space-y-6"><h3 className="text-2xl font-bold text-[#0a2540]">Commitment to Ethics</h3><p className="text-[#41506b] leading-relaxed">Swastik Srijan Foundation is committed to integrity, responsible governance and ethical practices. Our pledge with the Central Vigilance Commission (CVC) reflects this commitment.</p><p className="text-[#41506b] leading-relaxed">We believe trust is built through responsible conduct, clear communication, proper records and accountability to the communities and partners we serve.</p><div className="grid grid-cols-2 gap-4"><div className="p-5 rounded-xl bg-[#f8f5ed] border border-[#e9e3d6]"><FaShieldAlt className="text-[#c9a227] text-2xl mb-2" /><p className="font-bold text-[#0a2540]">Registered</p><p className="text-xs text-[#5c6b80]">NGO Darpan</p></div><div className="p-5 rounded-xl bg-[#f8f5ed] border border-[#e9e3d6]"><FaHandshake className="text-[#c9a227] text-2xl mb-2" /><p className="font-bold text-[#0a2540]">Committed</p><p className="text-xs text-[#5c6b80]">To Transparency</p></div></div></div></div></div></section>

      <section className="py-20 bg-[#0a2540] text-white"><div className="container mx-auto px-6 max-w-5xl text-center"><p className="text-[#e4c86a] font-bold text-sm tracking-[0.2em] uppercase">Get Involved</p><h2 className="text-3xl md:text-5xl font-serif font-bold mt-2">Be Part of the Journey</h2><p className="text-[#cbd5e1] max-w-2xl mx-auto mt-5 leading-relaxed">Join, volunteer or partner with Swastik Srijan Foundation and contribute to meaningful community development.</p><div className="flex flex-wrap justify-center gap-4 mt-8"><Link to="/GetInvolved" className="inline-flex items-center gap-2 bg-[#c9a227] text-[#0f2740] px-8 py-3 rounded-full font-bold hover:bg-white hover:text-[#0f2740] transition-all">Join SSF <FaArrowRight /></Link><Link to="/Volunteer" className="inline-flex items-center gap-2 bg-white text-[#0f2740] px-8 py-3 rounded-full font-bold hover:bg-[#c9a227] hover:text-[#0f2740] transition-all">Volunteer <FaArrowRight /></Link></div></div></section>
    </main>
  );
}
