import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaGraduationCap, FaChalkboardTeacher, FaLaptopCode, FaRocket, FaBookOpen, FaUserCheck, FaRupeeSign } from "react-icons/fa";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import HygieneModule from "../components/HygieneModule";

export default function LearningHub() {
  return (
    <div className="w-full font-inria bg-white">

      {/* ================= HERO ================= */}
      <section className="bg-zinc-900 text-white pt-40 pb-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left max-w-2xl mx-auto">
            {/* Banner Image for Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="mb-8 rounded-2xl overflow-hidden shadow-2xl border border-zinc-700"
            >
              <img src="/images/uploads/academy-hero-banner-children.jpg" alt="The SSF National Academy - Empowering Every Child for a Stronger India" className="w-full h-auto" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-6">
                <img src="/images/academy/academy-seal.jpg" alt="Academy Seal" className="w-24 h-24 rounded-full shadow-2xl border-2 border-[#004d99]" />
                <div>
                  <span className="inline-block px-4 py-1.5 bg-red-600 text-white text-sm font-bold rounded-full mb-2 tracking-widest uppercase">
                    SSF National Academy
                  </span>
                  <h1 className="text-5xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                    Learning Hub
                  </h1>
                  <h2 className="text-3xl md:text-4xl text-[#004d99] font-bold">
                    For Every Child.
                  </h2>
                </div>
              </div>
            </motion.div>

            {/* ... rest of hero stays same if possible but I need to be careful with context ... */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl text-zinc-300 font-medium leading-relaxed"
            >
              A hybrid education ecosystem blending physical learning centres with a
              state-of-the-art online learning hub for rural India.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start"
            >
              <Link to="/DonateAndSupport" className="sm:w-auto">
                <button className="btn-cta w-full sm:w-auto">
                  Sponsor a Learner
                </button>
              </Link>
              <Link to="/Contact" className="sm:w-auto">
                <button className="btn-secondary w-full sm:w-auto bg-transparent text-white border-white hover:bg-white hover:text-[#003366]">
                  Start a Centre
                </button>
              </Link>
            </motion.div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="bg-zinc-800/60 rounded-[2.5rem] p-10 shadow-2xl border border-white/10 max-w-md w-full">
              <p className="text-sm font-bold tracking-widest uppercase text-blue-300 mb-3">
                Program Snapshot
              </p>
              <p className="text-4xl font-extrabold text-white mb-4">
                1,000+{" "}
                <span className="text-zinc-300 text-xl font-medium">
                  active learners
                </span>
              </p>
              <ul className="space-y-3 text-zinc-300 text-sm">
                <li>• Hybrid classrooms blended with digital content</li>
                <li>• Mentors from across India</li>
                <li>• Foundation to competitive preparation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 1. MISSION & OBJECTIVE ================= */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-200">
            <img
              src="/images/real/classroom-group-poster.jpg"
              alt="SSF National Academy Mission - Empowering Education Through Material Support"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="w-16 h-16 bg-[#003366]/10 text-[#003366] rounded-2xl flex items-center justify-center text-3xl mb-6">
              <FaGraduationCap />
            </div>
            <h2 className="text-4xl font-black text-black mb-6">Our Objective</h2>
            <p className="text-lg text-zinc-600 leading-relaxed mb-6">
              To provide high-quality, free, and accessible education to underprivileged students across India. We aim to remove financial barriers and create a level playing field where every child can dream of a professional career.
            </p>
            <ul className="space-y-4">
              {[
                "Democratizing quality education",
                "Mentorship by industry experts",
                "Focus on holistic development"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-zinc-800">
                  <IoCheckmarkCircleSharp className="text-[#003366] text-xl" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= 1.1 IMPACT & VISION (NEW) ================= */}
      <section className="py-24 bg-white px-4 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-[#003366] font-bold tracking-widest uppercase text-sm">Our Impact</h2>
              <h3 className="text-4xl font-black text-black leading-tight">Why We Built This Academy</h3>
              <p className="text-lg text-zinc-600 leading-relaxed">
                In districts like Rewa, thousands of children lack access to quality education due to unaffordable schools and poor infrastructure. The SSF National Academy addresses this gap directly.
              </p>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Our model reduces dropout rates by 50% and ensures that every child, regardless of financial status, gets a world-class environment to learn and grow. We are not just building a school; we are building a generation.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-zinc-200">
              <img src="/images/uploads/academy-impact-reason.jpg" alt="Why This School and Its Impact" className="w-full h-auto" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-16 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 order-2 md:order-1">
              <img src="/images/village-outreach-children.jpg" alt="Grassroots Education Session" className="w-full h-auto" />
            </div>
            <div className="space-y-4 order-1 md:order-2">
              <h3 className="text-2xl font-black text-black leading-tight italic">"Where there is a will, there is a way."</h3>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Our journey began on simple mats under open skies. These raw grassroots sessions remain the heartbeat of our foundation, reaching children who have never stepped into a formal classroom.
              </p>
            </div>
          </div>

          {/* Education Challenges Infographic */}
          <div className="mt-20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-black mb-4">The Challenges We Address</h3>
              <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
                Understanding the educational gaps in rural India that drive our mission
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl border border-zinc-200">
              <img src="/images/uploads/academy-education-challenges.jpg" alt="Education Challenges - Affordability, Dropout Rates, Digital Access" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. COURSES (NEW) ================= */}
      <section className="py-24 bg-zinc-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[#003366] font-bold tracking-widest uppercase text-sm mb-4">What We Teach</h2>
            <h3 className="text-4xl md:text-5xl font-black text-black">Academic Framework</h3>
          </div>

          {/* Academic Banner */}
          <div className="mb-16 rounded-3xl overflow-hidden shadow-xl border border-zinc-200">
            <img src="/images/uploads/academy-academic-banner.jpg" alt="Academic Framework Nursery to Class 8" className="w-full h-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-24">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-[#003366] text-4xl mb-6"><FaBookOpen /></div>
              <h4 className="text-xl font-bold mb-3">Foundational Learning</h4>
              <p className="text-zinc-500 mb-4 text-sm">Classes 6 to 10</p>
              <ul className="space-y-2 text-zinc-700 text-sm">
                <li>• Mathematics & Science</li>
                <li>• English Grammar</li>
                <li>• Social Studies</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-[#003366] text-4xl mb-6"><FaLaptopCode /></div>
              <h4 className="text-xl font-bold mb-3">Skill Development</h4>
              <p className="text-zinc-500 mb-4 text-sm">Vocational & Digital</p>
              <ul className="space-y-2 text-zinc-700 text-sm">
                <li>• Basic Computer Course (BCC)</li>
                <li>• Coding for Kids</li>
                <li>• Spoken English & Personality</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-green-600 text-4xl mb-6"><FaRocket /></div>
              <h4 className="text-xl font-bold mb-3">Competitive Prep</h4>
              <p className="text-zinc-500 mb-4 text-sm">Career Focus</p>
              <ul className="space-y-2 text-zinc-700 text-sm">
                <li>• Navodaya / Sainik School</li>
                <li>• NTSE & Olympiads</li>
                <li>• Govt. Job Foundation</li>
              </ul>
            </div>
          </div>

          {/* Programs Infographic */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 lg:order-1">
              <h3 className="text-3xl font-black text-black mb-6">Holistic Programs</h3>
              <p className="text-lg text-zinc-600 mb-6">
                Our curriculum is designed not just for academic success but for life. From digital literacy to sports leadership, we nurture every aspect of a child's potential.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-[#003366]"><IoCheckmarkCircleSharp size={20} /></span>
                  <span className="font-medium text-zinc-700"><strong>Smart Classrooms:</strong> Interactive digital learning tools.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-[#003366]"><IoCheckmarkCircleSharp size={20} /></span>
                  <span className="font-medium text-zinc-700"><strong>Talent Development:</strong> Annual sports and cultural events.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-[#003366]"><IoCheckmarkCircleSharp size={20} /></span>
                  <span className="font-medium text-zinc-700"><strong>Nature Clubs:</strong> Environmental awareness and plantation drives.</span>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 rounded-2xl overflow-hidden shadow-2xl border border-zinc-200">
              <img src="/images/uploads/academy-programs-infographic.jpg" alt="SSF Academy Programs Infographic" className="w-full h-auto" />
            </div>
          </div>

          {/* Framework & Roadmap */}
          <div className="space-y-8 text-center">
            <h3 className="text-3xl font-black text-black">Future Roadmap & Framework</h3>
            <div className="rounded-3xl overflow-hidden shadow-xl border border-zinc-200">
              <img src="/images/uploads/academy-framework-roadmap.jpg" alt="Academy Framework and Future Roadmap" className="w-full h-auto" />
            </div>
          </div>

        </div>
      </section>

      {/* ================= 2.1 DIGITAL LESSONS SHOWCASE (NEW) ================= */}
      <HygieneModule />

      {/* ================= 3. REGISTRATION & FEE (NEW) ================= */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">

          {/* Registration Process */}
          <div>
            <h3 className="text-3xl font-black text-black mb-8">Registration Process</h3>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Apply</h4>
                  <p className="text-zinc-600">Fill out our simple online form or visit your nearest SSF Center to register.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Assessment</h4>
                  <p className="text-zinc-600">Take a basic baseline test so we can understand your current learning level.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#003366] text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Start Learning</h4>
                  <p className="text-zinc-600">Get allocated to a batch, receive your ID card, and begin your journey!</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link to="/Contact" className="inline-block px-8 py-3 bg-[#003366] text-white font-bold rounded-lg hover:bg-zinc-800 transition">
                Register Now
              </Link>
            </div>
          </div>

          {/* Fee Model */}
          <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-full text-green-600 text-2xl"><FaRupeeSign /></div>
              <h3 className="text-3xl font-black text-black">Affordable Model</h3>
            </div>
            <p className="text-zinc-600 mb-8 leading-relaxed">
              We believe cost should never be a barrier. Our dual-model ensures sustainability while serving the neediest.
            </p>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-sm">
                <h4 className="text-xl font-bold text-black mb-1">100% Free</h4>
                <p className="text-zinc-500 text-sm mb-3">For Extreme Need</p>
                <p className="text-zinc-700 text-sm">
                  Orphans, children of widows, and Antyodaya card holders receive education, materials, and support completely free of cost.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border-l-4 border-[#003366] shadow-sm">
                <h4 className="text-xl font-bold text-black mb-1">Nominal Fee</h4>
                <p className="text-zinc-500 text-sm mb-3">For Sustainability</p>
                <p className="text-zinc-700 text-sm">
                  A highly subsidized monthly fee for others to help cover center rent, electricity, and teacher stipends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. EDUCATIONAL MODEL (EXISTING) ================= */}
      <section className="py-24 bg-zinc-900 text-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-white font-bold tracking-widest uppercase text-sm mb-4">Delivery Modes</h2>
            <h3 className="text-4xl md:text-5xl font-black">How We Teach</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-black">
            {/* Offline */}
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-black hover:-translate-y-2 transition-transform duration-300">
              <div className="text-4xl text-black mb-6"><FaChalkboardTeacher /></div>
              <h4 className="text-2xl font-bold mb-4">Offline Centers</h4>
              <p className="text-zinc-600">
                Physical learning centers in rural villages providing direct mentorship and discipline.
              </p>
            </div>

            {/* Online */}
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#003366] hover:-translate-y-2 transition-transform duration-300">
              <div className="text-4xl text-[#003366] mb-6"><FaLaptopCode /></div>
              <h4 className="text-2xl font-bold mb-4">Online Hub</h4>
              <p className="text-zinc-600">
                Access to recorded lectures, live webinars, and digital notes via our app/portal.
              </p>
            </div>

            {/* Hybrid */}
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#003366] hover:-translate-y-2 transition-transform duration-300">
              <div className="text-4xl text-[#003366] mb-6"><FaRocket /></div>
              <h4 className="text-2xl font-bold mb-4">Hybrid Learning</h4>
              <p className="text-zinc-600">
                Regular doubt-clearing sessions locally, supported by digital expert classes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5.1 STUDENT ENRICHMENT (NEW) ================= */}
      <section className="py-0 bg-white">
        <div className="w-full">
          <img
            src="/images/uploads/academy-interior-enrichment.jpg"
            alt="Student Enrichment and Infrastructure"
            className="w-full object-cover max-h-[600px]"
          />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-12 -mt-24 relative z-10">
          <div className="bg-white p-10 rounded-2xl shadow-2xl border-t-8 border-[#003366]">
            <h3 className="text-3xl font-black text-[#003366] mb-4">Holistic Student Enrichment</h3>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Beyond academics, we focus on the complete development of the child. Our centers are equipped with smart classrooms, libraries, and sports facilities. We regularly organize Olympiads, talent shows, and cultural programs to nurture confidence and creativity.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 5.2 BUDGET & SUPPORT (NEW) ================= */}
      <section className="py-24 bg-zinc-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[#003366] font-bold tracking-widest uppercase text-sm mb-4">Transparency</h2>
            <h3 className="text-4xl font-black text-black">Projected Budget & Requirements</h3>
            <p className="text-zinc-600 max-w-2xl mx-auto mt-4">
              To realize this vision of a stronger India, we rely on the generous support of our partners. Here is an overview of the investment required for the first year.
            </p>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-lg border border-zinc-200">
            <img
              src="/images/uploads/academy-budget-2.jpg"
              alt="Academy First Year Estimated Budget"
              className="w-full h-auto rounded-2xl"
            />
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500 italic">
              *Estimated budget for initial setup and operations. Detailed proposal available upon request.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 5.0 OFFICIAL PRESENCE (NEW) ================= */}
      <section className="py-24 bg-white px-4 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#003366] font-bold tracking-widest uppercase text-sm mb-4">Official Presence</h2>
            <h3 className="text-4xl font-black text-black">Institutional Branding & Trust</h3>
          </div>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
            <img
              src="/images/uploads/community-banner.jpg"
              alt="SSF National Academy Official Board and Compliance"
              className="w-full h-auto group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>
      </section>

      {/* ================= 5. EXPANSION PLAN ================= */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#003366] font-bold tracking-widest uppercase text-sm mb-4">Growth Strategy</h2>
            <h3 className="text-4xl md:text-5xl font-black text-black">Expansion & Value Proposition</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 group">
              <img
                src="/images/uploads/academy-map-value.jpg"
                alt="SSF Academy Expansion Map and Value Proposition"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div>
              <div className="space-y-12 border-l-4 border-zinc-100 pl-8">
                {/* Item 1 */}
                <div className="relative">
                  <div className="absolute top-0 left-[-43px] w-6 h-6 bg-black rounded-full border-4 border-white shadow-sm"></div>
                  <h4 className="text-2xl font-bold mb-2">2025: Establish 50 Centers</h4>
                  <p className="text-zinc-600">Targeting 50 rural districts in Bihar and UP to create a robust initial network.</p>
                </div>
                {/* Item 2 */}
                <div className="relative">
                  <div className="absolute top-0 left-[-43px] w-6 h-6 bg-[#003366] rounded-full border-4 border-white shadow-sm"></div>
                  <h4 className="text-2xl font-bold mb-2">2027: Digital Integrated Grid</h4>
                  <p className="text-zinc-600">Connecting all centers via a centralized digital learning grid for standardized quality.</p>
                </div>
                {/* Item 3 */}
                <div className="relative">
                  <div className="absolute top-0 left-[-43px] w-6 h-6 bg-zinc-400 rounded-full border-4 border-white shadow-sm"></div>
                  <h4 className="text-2xl font-bold mb-2">2030: Pan-India Academy</h4>
                  <p className="text-zinc-600">Reaching 100,000+ students across 20 states, creating a national movement for education.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-[#003366] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:30px_30px]"></div>
        <div className="container mx-auto px-6 text-center relative z-10 space-y-6">
          <h2 className="text-4xl lg:text-6xl font-bold text-white max-w-3xl mx-auto leading-tight">
            Help Build the Future of Learning.
          </h2>
          <p className="text-zinc-300 text-xl max-w-2xl mx-auto">
            Sponsor a child’s journey at SSF National Academy or partner with us
            to start a new learning hub in your community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
            <Link to="/DonateAndSupport">
              <button className="btn-cta w-full sm:w-auto px-12 py-5 text-xl">
                Donate to Academy
              </button>
            </Link>
            <Link to="/PartnerWithUs">
              <button className="btn-secondary w-full sm:w-auto px-12 py-5 text-xl border-white text-white hover:bg-white hover:text-[#003366]">
                Partner for a Centre
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
