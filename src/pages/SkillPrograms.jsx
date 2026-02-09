import { Link } from "@tanstack/react-router";
import { FaTools, FaUserTie, FaHandshake, FaLaptopCode, FaChartLine, FaBookOpen } from "react-icons/fa";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

export default function SkillPrograms() {
    return (
        <div className="w-full font-inria bg-white">

            {/* ================= HERO ================= */}
            <section className="bg-zinc-900 text-white pt-40 pb-20 relative overflow-hidden text-center px-4">
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Skill & <span className="text-white">Career Programs</span>
                    </h1>
                    <p className="text-zinc-300 text-xl md:text-2xl leading-relaxed">
                        Bridging the gap between education and employment. Transforming youth into industry-ready professionals.
                    </p>
                </div>
            </section>

            {/* ================= 1. YOUTH SKILL DEVELOPMENT ================= */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 relative rounded-2xl overflow-hidden shadow-2xl group">
                        <img
                            src="/images/real/women_empowerment_tailoring.jpg"
                            alt="Women receiving tailoring training"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white font-bold">Women Empowerment: Tailoring Workshop</p>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="w-16 h-16 bg-[#003366]/10 text-[#003366] rounded-2xl flex items-center justify-center text-3xl mb-6">
                            <FaLaptopCode />
                        </div>
                        <h2 className="text-4xl font-black text-black mb-6">Youth Skill Development</h2>
                        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
                            We engage youth in productive vocational training to ensure they have marketable skills. From digital literacy to technical trades, our programs are designed for the modern economy.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Digital Literacy & Coding",
                                "Vocational Trades (Repair, Craft)",
                                "English Speaking & Communication",
                                "Financial Literacy"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 font-bold text-zinc-800">
                                    <IoCheckmarkCircleSharp className="text-[#003366] text-xl" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ================= 2. CAREER GUIDANCE ================= */}
            <section className="py-24 bg-zinc-900 text-white px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-white font-bold tracking-widest uppercase text-sm mb-4">Finding The Right Path</h2>
                        <h3 className="text-4xl md:text-5xl font-black">Career Guidance</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-zinc-800 p-8 rounded-xl border border-zinc-700">
                            <div className="text-white text-4xl mb-6"><FaChartLine /></div>
                            <h4 className="text-xl font-bold mb-3">Roadmap Planning</h4>
                            <p className="text-zinc-400">Helping students identify their strengths and map out a 5-year career plan aligned with their goals.</p>
                        </div>
                        <div className="bg-zinc-800 p-8 rounded-xl border border-zinc-700">
                            <div className="text-[#003366] text-4xl mb-6"><FaUserTie /></div>
                            <h4 className="text-xl font-bold mb-3">Mentorship</h4>
                            <p className="text-zinc-400">Connecting youth with industry professionals for 1-on-1 guidance and real-world insights.</p>
                        </div>
                        <div className="bg-zinc-800 p-8 rounded-xl border border-zinc-700">
                            <div className="text-green-500 text-4xl mb-6"><FaBookOpen /></div>
                            <h4 className="text-xl font-bold mb-3">Counseling</h4>
                            <p className="text-zinc-400">Psychometric assessments and counseling to clear confusion and build confidence in career choices.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= 3. EMPLOYABILITY FOCUS ================= */}
            <section className="py-24 px-4 bg-zinc-50">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="w-16 h-16 bg-[#003366]/10 text-[#003366] rounded-2xl flex items-center justify-center text-3xl mb-6">
                            <FaHandshake />
                        </div>
                        <h2 className="text-4xl font-black text-black mb-6">Employability Focus</h2>
                        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
                            It's not just about learning; it's about earning. We bridge the "last mile" gap to help our students secure dignity and financial independence.
                        </p>
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#003366]">
                                <h4 className="text-xl font-bold mb-2">Job Readiness</h4>
                                <p className="text-zinc-600 text-sm">Resume building, mock interviews, and corporate etiquette training.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-black">
                                <h4 className="text-xl font-bold mb-2">Placements</h4>
                                <p className="text-zinc-600 text-sm">Direct linkage with local businesses and corporate partners for internships and jobs.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-8 h-full min-h-[400px] flex items-center justify-center shadow-lg transform rotate-2 hover:rotate-0 transition duration-500">
                        {/* Placeholder for Image */}
                        <div className="text-center">
                            <h3 className="text-5xl font-black text-zinc-200 mb-2">JOBS</h3>
                            <p className="text-xl font-bold text-zinc-400">Livelihood & Dignity</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="py-20 bg-[#003366] text-white text-center px-4">
                <h2 className="text-3xl font-black mb-4">
                    Ready to Upskill?
                </h2>
                <p className="mb-6 text-lg font-medium">
                    Join our next batch of skill development programs.
                </p>
                <Link to="/Contact">
                    <button className="bg-white text-[#003366] px-8 py-3 font-bold hover:bg-zinc-200 transition">
                        Apply for Training
                    </button>
                </Link>
            </section>

        </div>
    );
}
