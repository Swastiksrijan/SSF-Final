import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaSeedling, FaGraduationCap, FaHandHoldingHeart, FaFemale, FaBriefcase, FaUsers, FaArrowRight, FaRocket, FaHeartbeat, FaLeaf, FaBullhorn, FaLaptop } from "react-icons/fa";

export default function ImpactTimeline() {
    const years = [
        { year: "2013", title: "Foundation & Registration", desc: "Registered beginning of the Swastik Srijan Foundation journey in Rewa, Madhya Pradesh.", icon: <FaSeedling />, tone: "orange" },
        { year: "2014", title: "Foundation Building", desc: "Early community connections and groundwork for education, health and social awareness.", icon: <FaHandHoldingHeart />, tone: "blue" },
        { year: "2015", title: "Community Engagement", desc: "Continuing the foundation-building phase through community participation and social initiatives.", icon: <FaUsers />, tone: "green" },
        { year: "2016", title: "Learning & Awareness", desc: "Continued focus on learning, awareness and practical community-oriented support.", icon: <FaGraduationCap />, tone: "purple" },
        { year: "2017", title: "Strengthening Outreach", desc: "Building stronger connections around inclusive development and community participation.", icon: <FaBullhorn />, tone: "pink" },
        { year: "2018", title: "Expanding Initiatives", desc: "Growing attention to education, health, skills and community empowerment.", icon: <FaBriefcase />, tone: "orange" },
        { year: "2019", title: "Social Development", desc: "Continuing community-oriented work with emphasis on skills, wellbeing and participation.", icon: <FaFemale />, tone: "blue" },
        { year: "2020", title: "Standing With Communities", desc: "Community awareness, support and responsible social response during the COVID-19 period.", icon: <FaHeartbeat />, tone: "red" },
        { year: "2021", title: "Adapting & Continuing", desc: "Learning and support initiatives continued while adapting to changing community needs.", icon: <FaUsers />, tone: "green" },
        { year: "2022", title: "Strengthening Community Work", desc: "Continued focus on awareness, learning, support and community participation.", icon: <FaHandHoldingHeart />, tone: "purple" },
        { year: "2023", title: "Learning & Development", desc: "Greater emphasis on learning, skills, awareness and practical community development.", icon: <FaGraduationCap />, tone: "blue" },
        { year: "2024", title: "Community Initiatives", desc: "Continuing work across education, health, environment and community development areas.", icon: <FaLeaf />, tone: "green" },
        { year: "2025", title: "Digital & Social Outreach", desc: "Wider use of digital tools and outreach for learning, awareness and participation.", icon: <FaLaptop />, tone: "orange" },
        { year: "2026", title: "Continuing the Mission", desc: "Current work continues around education, skills, health, awareness, community support and partnerships.", icon: <FaRocket />, tone: "red" }
    ];

    const tone = {
        orange: { bg: "bg-orange-500", soft: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
        blue: { bg: "bg-blue-600", soft: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
        green: { bg: "bg-emerald-500", soft: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
        purple: { bg: "bg-violet-600", soft: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
        pink: { bg: "bg-pink-500", soft: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
        red: { bg: "bg-rose-600", soft: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" }
    };

    return (
        <section className="py-24 bg-gradient-to-b from-white via-zinc-50 to-white overflow-hidden relative border-y border-zinc-100">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-14">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#002344] text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-lg">
                        2013 — 2026 • Service Journey
                    </span>
                    <h2 className="mt-6 text-4xl md:text-6xl font-serif font-bold text-[#002344]">
                        OUR JOURNEY <span className="text-[#FF6600]">| हमारी यात्रा</span>
                    </h2>
                    <p className="mt-5 text-zinc-600 text-base md:text-lg leading-relaxed">
                        Fourteen years of a continuing journey — from registration and foundation building to learning, community development, digital outreach and ongoing service.
                    </p>
                </div>

                {/* Continuous auto-moving journey cards. Hover/touch pauses the track so visitors can read. */}
                <div className="relative overflow-hidden py-4 -mx-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-zinc-50 to-transparent z-10"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
                    <motion.div
                        className="flex gap-5 w-max px-1 hover:[animation-play-state:paused]"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            x: { repeat: Infinity, repeatType: "loop", duration: 48, ease: "linear" }
                        }}
                    >
                        {[...years, ...years].map((item, index) => {
                            const c = tone[item.tone];
                            return (
                                <article
                                    key={`${item.year}-${index}`}
                                    className={`shrink-0 w-[270px] md:w-[300px] rounded-[2rem] border ${c.border} bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden relative group`}
                                >
                                    <div className={`h-2 ${c.bg}`}></div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className={`w-14 h-14 rounded-2xl ${c.soft} ${c.text} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                                                {item.icon}
                                            </div>
                                            <span className={`text-3xl font-black ${c.text}`}>{item.year}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#002344] leading-tight min-h-[52px]">{item.title}</h3>
                                        <p className="mt-3 text-sm text-zinc-500 leading-relaxed min-h-[82px]">{item.desc}</p>
                                        <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${c.bg}`}></span>
                                            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">SSF Service Journey</span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </motion.div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-5">
                    <div className="text-center">
                        <div className="text-2xl font-black text-[#002344]">2013 → 2026</div>
                        <div className="text-xs text-zinc-400 uppercase tracking-widest font-bold">A continuing journey of service</div>
                    </div>
                    <Link to="/Journey" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002344] text-white font-bold hover:bg-[#FF6600] transition-all shadow-lg uppercase tracking-widest text-[10px]">
                        View Detailed Journey <FaArrowRight className="text-xs" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
