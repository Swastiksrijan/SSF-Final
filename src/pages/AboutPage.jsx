import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaArrowRight, FaCalendarAlt, FaGlobeAsia, FaHeart, FaHandshake, FaShieldAlt, FaUsers, FaBullseye } from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import footerImg1 from "../assets/footer-gallery-1.jpg";
import footerImg2 from "../assets/footer-gallery-2.jpg";
import footerImg3 from "../assets/footer-gallery-3.jpg";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-zinc-800">
      <section className="relative min-h-[48vh] md:min-h-[60vh] w-full overflow-hidden bg-[#001529] text-white">
        <div className="absolute inset-0 p-2 sm:p-3 lg:p-4">
          <div className="grid h-full grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2 lg:gap-3">
            {[footerImg1, footerImg2, footerImg3].map((img, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg lg:rounded-xl bg-[#002344]">
                <img src={img} alt="" className="h-full w-full object-cover object-center opacity-80 scale-105" loading={index === 0 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-[#001529]/58"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/30 via-[#001529]/55 to-[#001529]/90"></div>
        <div className="relative z-10 flex min-h-[48vh] md:min-h-[60vh] items-center justify-center px-5 py-20 lg:px-8 text-center">
          <div className="max-w-5xl">
            <p className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.22em] text-[#7dd3a8]">Swastik Srijan Foundation / स्थापना</p>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-white">Who We Are</h1>
            <p className="mx-auto mt-5 max-w-3xl text-base md:text-xl text-[#e5edf4] leading-relaxed">Empowering communities through grassroots governance and sustainable development.</p>
            <p className="mx-auto mt-2 max-w-3xl text-base md:text-lg text-[#d5e1ea] leading-relaxed">शिक्षा, स्वास्थ्य और सशक्तिकरण के माध्यम से सामुदायिक विकास।</p>
          </div>
        </div>
      </section>

      <section className="relative py-12 md:py-16 bg-[#002344] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001529] via-[#002344] to-[#00345f]"></div>
        <div className="relative container mx-auto px-5 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            <div className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-sm px-6 py-7 md:px-7 md:py-8 text-center shadow-xl">
              <FaCalendarAlt className="mx-auto text-[#fb8500] text-3xl md:text-4xl mb-4" />
              <p className="text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-[#7dd3a8]">Established</p>
              <p className="mt-2 text-2xl md:text-3xl lg:text-4xl font-black tracking-tight">December 2013</p>
              <p className="mt-2 text-sm md:text-base text-zinc-300">Foundation established</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-sm px-6 py-7 md:px-7 md:py-8 text-center shadow-xl">
              <FaShieldAlt className="mx-auto text-[#fb8500] text-3xl md:text-4xl mb-4" />
              <p className="text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-[#7dd3a8]">Registration</p>
              <p className="mt-2 text-xl md:text-2xl lg:text-3xl font-black tracking-tight break-words">05/22/03/11448/13</p>
              <p className="mt-2 text-sm md:text-base text-zinc-300">MP Societies Act, 1973</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-sm px-6 py-7 md:px-7 md:py-8 text-center shadow-xl">
              <FaGlobeAsia className="mx-auto text-[#fb8500] text-3xl md:text-4xl mb-4" />
              <p className="text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-[#7dd3a8]">Area of Work</p>
              <p className="mt-2 text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">PAN INDIA</p>
              <p className="mt-2 text-sm md:text-base text-zinc-300">Working across India</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-sm px-6 py-7 md:px-7 md:py-8 text-center shadow-xl">
              <FaHeart className="mx-auto text-[#fb8500] text-3xl md:text-4xl mb-4" />
              <p className="text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-[#7dd3a8]">Registered Office</p>
              <p className="mt-2 text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">REWA, M.P.</p>
              <p className="mt-2 text-sm md:text-base text-zinc-300">Madhya Pradesh, India</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white"><div className="container mx-auto px-6 max-w-4xl text-center">
        <p className="text-[#fb8500] font-bold text-sm tracking-[0.2em] uppercase">About SSF</p><h2 className="text-3xl md:text-4xl font-bold text-[#002344] mt-2 mb-8">Who We Are | हम कौन हैं</h2>
        <p className="text-xl text-zinc-600 leading-relaxed mb-6">Founded in December 2013, Swastik Srijan Foundation is a registered non-profit organization based in Rewa, Madhya Pradesh, working across India to contribute to community development through education, health, skills, awareness and sustainable initiatives.</p>
        <p className="text-lg font-hindi text-zinc-500 mb-12">दिसंबर 2013 में स्थापित, स्वस्तिक सृजन फाउंडेशन मध्य प्रदेश के रीवा में स्थित एक पंजीकृत गैर-लाभकारी संस्था है, जो शिक्षा, स्वास्थ्य, कौशल, जागरूकता और सतत विकास के माध्यम से भारत भर में समुदायों के साथ कार्य करती है।</p>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <Link to="/Mission" className="p-8 rounded-2xl bg-zinc-50 hover:bg-[#002344] hover:text-white transition-all group border border-zinc-100 flex flex-col h-full"><h3 className="text-xl font-bold mb-2">Mission & Vision</h3><p className="text-sm opacity-80 mb-4 flex-grow">Our guiding principles and core values.</p><div className="flex items-center gap-2 text-[#fb8500] font-bold text-sm uppercase tracking-wider group-hover:text-white mt-auto">Read More <FaArrowRight /></div></Link>
          <Link to="/Objectives" className="p-8 rounded-2xl bg-zinc-50 hover:bg-[#002344] hover:text-white transition-all group border border-zinc-100 flex flex-col h-full"><h3 className="text-xl font-bold mb-2">Our Objectives</h3><p className="text-sm opacity-80 mb-4 flex-grow">Key focus areas and developmental goals.</p><div className="flex items-center gap-2 text-[#fb8500] font-bold text-sm uppercase tracking-wider group-hover:text-white mt-auto">Explore <FaArrowRight /></div></Link>
          <Link to="/Team" className="p-8 rounded-2xl bg-zinc-50 hover:bg-[#002344] hover:text-white transition-all group border border-zinc-100 flex flex-col h-full"><h3 className="text-xl font-bold mb-2">Meet Our Team</h3><p className="text-sm opacity-80 mb-4 flex-grow">The leadership and volunteers driving change.</p><div className="flex items-center gap-2 text-[#fb8500] font-bold text-sm uppercase tracking-wider group-hover:text-white mt-auto">View Leaders <FaArrowRight /></div></Link>
        </div>
      </div></section>

      <section className="py-20 bg-zinc-50 border-y border-zinc-100"><div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12"><p className="text-[#fb8500] font-bold text-sm tracking-[0.2em] uppercase">Leadership</p><h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344] mt-2">Founder’s Message</h2><p className="text-zinc-500 mt-3">संस्थापक का संदेश</p></div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-center bg-white rounded-[2rem] p-7 md:p-10 shadow-xl border border-zinc-100">
          <div className="text-center">
            <div className="mx-auto w-full max-w-[280px] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-zinc-100">
              <OptimizedImage src="/Teams_Images/ramesh_pandey.jpg" alt="Mr. Ramesh Pandey, Founder and President of Swastik Srijan Foundation" className="block w-full aspect-[4/5] object-cover" />
            </div>
            <h3 className="text-xl font-bold text-[#002344] mt-5">Mr. Ramesh Pandey</h3><p className="text-[#fb8500] font-semibold text-sm">Founder & President</p>
          </div>
          <div className="space-y-5 text-zinc-600 leading-relaxed text-lg"><p>“Social development becomes meaningful when people come together with a spirit of cooperation, learning and responsibility. Swastik Srijan Foundation was established with the belief that every person deserves dignity, opportunity and a chance to contribute.”</p><p>Our journey is guided by education, skill development, awareness, community participation and practical support. We seek to encourage positive change through sincere service, transparency and meaningful partnerships.</p><p className="font-hindi text-base text-zinc-500">हमारा प्रयास है कि सहयोग, कौशल, जागरूकता और सृजन के माध्यम से समाज में सकारात्मक परिवर्तन को बढ़ावा दिया जाए। सेवा में पारदर्शिता, सम्मान और समान अवसर हमारे लिए महत्वपूर्ण हैं।</p></div>
        </div>
      </div></section>

      <section className="py-20 bg-white"><div className="container mx-auto px-6 max-w-5xl text-center"><p className="text-[#fb8500] font-bold text-sm tracking-[0.2em] uppercase">Our Journey</p><h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344] mt-2">A Journey of Service Since 2013</h2><p className="text-lg text-zinc-600 leading-relaxed max-w-3xl mx-auto mt-6">From our establishment in December 2013 to continued community work and digital outreach, SSF has evolved through learning, participation and service. Our detailed activities and milestones are presented on the Impact page.</p><div className="grid md:grid-cols-3 gap-5 mt-10 text-left"><div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100"><FaHeart className="text-[#fb8500] text-2xl mb-4" /><h3 className="font-bold text-[#002344]">2013–2017</h3><p className="text-sm text-zinc-600 mt-2">Building the foundation, community relationships and early social initiatives.</p></div><div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100"><FaUsers className="text-[#fb8500] text-2xl mb-4" /><h3 className="font-bold text-[#002344]">2018–2024</h3><p className="text-sm text-zinc-600 mt-2">Expanding social initiatives, learning activities and community-focused work.</p></div><div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100"><FaGlobeAsia className="text-[#fb8500] text-2xl mb-4" /><h3 className="font-bold text-[#002344]">2025–2026</h3><p className="text-sm text-zinc-600 mt-2">Strengthening digital outreach, awareness and opportunities for wider participation.</p></div></div><Link to="/Impact" className="inline-flex items-center gap-2 mt-9 bg-[#002344] text-white px-8 py-3 rounded-full font-bold hover:bg-[#fb8500] transition-all">Explore Our Impact <FaArrowRight /></Link></div></section>

      <section className="py-20 bg-zinc-50 border-y border-zinc-100"><div className="container mx-auto px-6 max-w-6xl"><div className="grid lg:grid-cols-2 gap-12 items-center"><motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6"><h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">Our Core Community</h2><p className="text-lg text-zinc-600 leading-relaxed">Behind every program and impact story is a dedicated group of volunteers and staff members. Our team works across various regions of India to help translate the vision of Swastik Srijan Foundation into meaningful community action.</p><p className="text-zinc-500 font-hindi">प्रत्येक कार्यक्रम और प्रभाव के पीछे स्वयंसेवकों और कर्मचारियों का एक समर्पित समूह होता है। हमारी टीम भारत के विभिन्न क्षेत्रों में संस्था के उद्देश्य को सार्थक कार्य में बदलने का प्रयास करती है।</p><div className="pt-4"><Link to="/Team" className="inline-flex items-center gap-2 bg-[#002344] text-white px-8 py-3 rounded-full font-bold hover:bg-[#fb8500] transition-all">Meet the Full Team <FaArrowRight /></Link></div></motion.div><motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white"><OptimizedImage src="/images/ssf-team.jpg" alt="SSF Team and Core Members" className="w-full h-full object-cover" /></motion.div></div></div></section>

      <section className="py-20 bg-white"><div className="container mx-auto px-6 max-w-6xl"><div className="text-center mb-12"><p className="text-[#fb8500] font-bold text-sm tracking-[0.2em] uppercase">What Guides Us</p><h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344] mt-2">Mission, Approach & Values</h2></div><div className="grid md:grid-cols-3 gap-6"><div className="p-7 rounded-2xl bg-zinc-50 border border-zinc-100"><FaBullseye className="text-[#fb8500] text-2xl mb-4" /><h3 className="font-bold text-[#002344] text-xl">Our Mission</h3><p className="text-sm text-zinc-600 leading-relaxed mt-3">To contribute to inclusive community development through education, skills, health, awareness, participation and practical support.</p></div><div className="p-7 rounded-2xl bg-zinc-50 border border-zinc-100"><FaHandshake className="text-[#fb8500] text-2xl mb-4" /><h3 className="font-bold text-[#002344] text-xl">Our Approach</h3><p className="text-sm text-zinc-600 leading-relaxed mt-3">We encourage cooperation, learning, responsible awareness and partnerships that can create meaningful and sustainable outcomes.</p></div><div className="p-7 rounded-2xl bg-zinc-50 border border-zinc-100"><FaHeart className="text-[#fb8500] text-2xl mb-4" /><h3 className="font-bold text-[#002344] text-xl">Our Values</h3><p className="text-sm text-zinc-600 leading-relaxed mt-3">Transparency, dignity, equal opportunity, cooperation and service without discrimination guide our work.</p></div></div></div></section>

      <section className="py-24 bg-white border-t border-zinc-100"><div className="container mx-auto px-6 max-w-6xl"><div className="text-center mb-16 space-y-4"><p className="text-[#fb8500] font-bold text-sm tracking-[0.2em] uppercase">Transparency & Governance</p><h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344]">Trust & Compliance</h2><p className="text-zinc-500 max-w-2xl mx-auto">We aim to maintain clear records, responsible governance and ethical practices in our work.</p></div><div className="grid md:grid-cols-2 gap-12 items-center"><div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-xl border border-zinc-100"><OptimizedImage src="/images/cvc-certificate.jpg" alt="CVC Pledge Certificate" className="w-full h-auto" /></div><div className="order-1 md:order-2 space-y-6"><h3 className="text-2xl font-bold text-[#002344]">Commitment to Ethics</h3><p className="text-zinc-600 leading-relaxed">Swastik Srijan Foundation is committed to integrity, responsible governance and ethical practices. Our pledge with the Central Vigilance Commission (CVC) reflects this commitment.</p><p className="text-zinc-600 leading-relaxed">We believe trust is built through responsible conduct, clear communication, proper records and accountability to the communities and partners we serve.</p><div className="grid grid-cols-2 gap-4"><div className="p-5 rounded-xl bg-zinc-50 border border-zinc-100"><FaShieldAlt className="text-[#fb8500] text-2xl mb-2" /><p className="font-bold text-[#002344]">Registered</p><p className="text-xs text-zinc-500">NGO Darpan</p></div><div className="p-5 rounded-xl bg-zinc-50 border border-zinc-100"><FaHandshake className="text-[#fb8500] text-2xl mb-2" /><p className="font-bold text-[#002344]">Committed</p><p className="text-xs text-zinc-500">To Transparency</p></div></div></div></div></div></section>

      <section className="py-20 bg-[#002344] text-white"><div className="container mx-auto px-6 max-w-5xl text-center"><p className="text-[#fb8500] font-bold text-sm tracking-[0.2em] uppercase">Get Involved</p><h2 className="text-3xl md:text-5xl font-serif font-bold mt-2">Be Part of the Journey</h2><p className="text-zinc-300 max-w-2xl mx-auto mt-5 leading-relaxed">Join, volunteer or partner with Swastik Srijan Foundation and contribute to meaningful community development.</p><div className="flex flex-wrap justify-center gap-4 mt-8"><Link to="/GetInvolved" className="inline-flex items-center gap-2 bg-[#fb8500] text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-[#002344] transition-all">Join SSF <FaArrowRight /></Link><Link to="/Volunteer" className="inline-flex items-center gap-2 bg-white text-[#002344] px-8 py-3 rounded-full font-bold hover:bg-[#fb8500] hover:text-white transition-all">Volunteer <FaArrowRight /></Link></div></div></section>
    </main>
  );
}
