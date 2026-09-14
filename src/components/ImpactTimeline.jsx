import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaSeedling, FaGraduationCap, FaHandHoldingHeart, FaFemale, FaBriefcase, FaUsers, FaArrowRight, FaRocket, FaHeartbeat, FaLeaf, FaBullhorn, FaLaptop } from "react-icons/fa";

export default function ImpactTimeline() {
    const years = [
        { year: "2013", title: "Foundation & Registration", desc: "Registered beginning of the Swastik Srijan Foundation journey in Rewa, Madhya Pradesh.", icon: <FaSeedling />, theme: "orange" },
        { year: "2014", title: "Foundation Building", desc: "Early community connections and groundwork for education, health and social awareness.", icon: <FaHandHoldingHeart />, theme: "blue" },
        { year: "2015", title: "Community Engagement", desc: "Continuing the foundation-building phase through community participation and social initiatives.", icon: <FaUsers />, theme: "green" },
        { year: "2016", title: "Learning & Awareness", desc: "Continued focus on learning, awareness and practical community-oriented support.", icon: <FaGraduationCap />, theme: "purple" },
        { year: "2017", title: "Strengthening Outreach", desc: "Building stronger connections around inclusive development and community participation.", icon: <FaBullhorn />, theme: "pink" },
        { year: "2018", title: "Expanding Initiatives", desc: "Growing attention to education, health, skills and community empowerment.", icon: <FaBriefcase />, theme: "amber" },
        { year: "2019", title: "Social Development", desc: "Continuing community-oriented work with emphasis on skills, wellbeing and participation.", icon: <FaFemale />, theme: "cyan" },
        { year: "2020", title: "Standing With Communities", desc: "Community awareness, support and responsible social response during the COVID-19 period.", icon: <FaHeartbeat />, theme: "rose" },
        { year: "2021", title: "Adapting & Continuing", desc: "Learning and support initiatives continued while adapting to changing community needs.", icon: <FaUsers />, theme: "teal" },
        { year: "2022", title: "Strengthening Community Work", desc: "Continued focus on awareness, learning, support and community participation.", icon: <FaHandHoldingHeart />, theme: "indigo" },
        { year: "2023", title: "Learning & Development", desc: "Greater emphasis on learning, skills, awareness and practical community development.", icon: <FaGraduationCap />, theme: "sky" },
        { year: "2024", title: "Community Initiatives", desc: "Continuing work across education, health, environment and community development areas.", icon: <FaLeaf />, theme: "lime" },
        { year: "2025", title: "Digital & Social Outreach", desc: "Wider use of digital tools and outreach for learning, awareness and participation.", icon: <FaLaptop />, theme: "violet" },
        { year: "2026", title: "Continuing the Mission", desc: "Current work continues around education, skills, health, awareness, community support and partnerships.", icon: <FaRocket />, theme: "red" }
    ];

    const themes = {
        orange: { bar: "bg-orange-500", year: "text-orange-600", icon: "bg-orange-500 text-white", wash: "from-orange-500/25 via-orange-50 to-white", line: "bg-orange-200", badge: "bg-orange-100 text-orange-700" },
        blue: { bar: "bg-blue-600", year: "text-blue-700", icon: "bg-blue-600 text-white", wash: "from-blue-600/25 via-blue-50 to-white", line: "bg-blue-200", badge: "bg-blue-100 text-blue-700" },
        green: { bar: "bg-emerald-500", year: "text-emerald-700", icon: "bg-emerald-500 text-white", wash: "from-emerald-500/25 via-emerald-50 to-white", line: "bg-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
        purple: { bar: "bg-violet-600", year: "text-violet-700", icon: "bg-violet-600 text-white", wash: "from-violet-600/25 via-violet-50 to-white", line: "bg-violet-200", badge: "bg-violet-100 text-violet-700" },
        pink: { bar: "bg-pink-500", year: "text-pink-700", icon: "bg-pink-500 text-white", wash: "from-pink-500/25 via-pink-50 to-white", line: "bg-pink-200", badge: "bg-pink-100 text-pink-700" },
        amber: { bar: "bg-amber-500", year: "text-amber-700", icon: "bg-amber-500 text-white", wash: "from-amber-500/25 via-amber-50 to-white", line: "bg-amber-200", badge: "bg-amber-100 text-amber-700" },
        cyan: { bar: "bg-cyan-500", year: "text-cyan-700", icon: "bg-cyan-500 text-white", wash: "from-cyan-500/25 via-cyan-50 to-white", line: "bg-cyan-200", badge: "bg-cyan-100 text-cyan-700" },
        rose: { bar: "bg-rose-600", year: "text-rose-700", icon: "bg-rose-600 text-white", wash: "from-rose-600/25 via-rose-50 to-white", line: "bg-rose-200", badge: "bg-rose-100 text-rose-700" },
        teal: { bar: "bg-teal-500", year: "text-teal-700", icon: "bg-teal-500 text-white", wash: "from-teal-500/25 via-teal-50 to-white", line: "bg-teal-200", badge: "bg-teal-100 text-teal-700" },
        indigo: { bar: "bg-indigo-600", year: "text-indigo-700", icon: "bg-indigo-600 text-white", wash: "from-indigo-600/25 via-indigo-50 to-white", line: "bg-indigo-200", badge: "bg-indigo-100 text-indigo-700" },
        sky: { bar: "bg-sky-500", year: "text-sky-700", icon: "bg-sky-500 text-white", wash: "from-sky-500/25 via-sky-50 to-white", line: "bg-sky-200", badge: "bg-sky-100 text-sky-700" },
        lime: { bar: "bg-lime-500", year: "text-lime-700", icon: "bg-lime-500 text-white", wash: "from-lime-500/25 via-lime-50 to-white", line: "bg-lime-200", badge: "bg-lime-100 text-lime-700" },
        violet: { bar: "bg-fuchsia-600", year: "text-fuchsia-700", icon: "bg-fuchsia-600 text-white", wash: "from-fuchsia-600/25 via-fuchsia-50 to-white", line: "bg-fuchsia-200", badge: "bg-fuchsia-100 text-fuchsia-700" },
        red: { bar: "bg-red-600", year: "text-red-700", icon: "bg-red-600 text-white", wash: "from-red-600/25 via-red-50 to-white", line: "bg-red-200", badge: "bg-red-100 text-red-700" }
    };

    return (
        <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden relative border-y border-zinc-100">
            <div className="absolute -top-40 right-0 w-[32rem] h-[32rem] bg-orange-100/50 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 left-0 w-[32rem] h-[32rem] bg-blue-100/50 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-14">
                    <span className="inline-flex px-5 py-2 rounded-full bg-[#002344] text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-xl">2013 — 2026 • Service Journey</span>
                    <h2 className="mt-6 text-4xl md:text-6xl font-serif font-bold text-[#002344]">SSF SERVICE JOURNEY <span className="text-[#FF6600]">| सेवा यात्रा</span></h2>
                    <p className="mt-5 text-zinc-600 text-base md:text-lg leading-relaxed">Fourteen years of a continuing journey — from registration and foundation building to learning, community development, digital outreach and ongoing service.</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2 text-[9px] font-black uppercase tracking-[0.18em]">
                        <span className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-600">Support</span>
                        <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700">Skill</span>
                        <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">Awareness</span>
                        <span className="px-3 py-1.5 rounded-full bg-violet-50 text-violet-700">Creation</span>
                    </div>
                </div>

                <div className="relative overflow-hidden py-8 -mx-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-30" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 bg-gradient-to-l from-white via-white/90 to-transparent z-30" />

                    <motion.div className="flex items-stretch gap-5 w-max px-2" animate={{ x: ["0%", "-50%"] }} transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 58, ease: "linear" } }}>
                        {[...years, ...years].map((item, index) => {
                            const c = themes[item.theme];
                            const tilt = index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]";
                            const accentHeight = 70 + ((index % 5) * 14);
                            return (
                                <motion.article key={`${item.year}-${index}`} whileHover={{ y: -14, rotate: 0, scale: 1.035 }} transition={{ duration: 0.28 }} className={`shrink-0 w-[280px] md:w-[315px] ${tilt} hover:rotate-0 transition-transform duration-300`}>
                                    <div className={`relative h-full min-h-[390px] rounded-[2rem] overflow-hidden border border-white/80 bg-white shadow-[0_18px_55px_rgba(0,35,68,0.14)] hover:shadow-[0_28px_75px_rgba(0,35,68,0.22)]`}>
                                        <div className={`absolute inset-0 bg-gradient-to-b ${c.wash}`} />
                                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${c.bar}`} />
                                        <div className={`absolute right-5 top-3 font-black text-[82px] leading-none opacity-[0.055] ${c.year}`}>{item.year}</div>

                                        <div className="relative p-6 pt-7">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className={`w-16 h-16 rounded-[1.25rem] ${c.icon} flex items-center justify-center text-2xl shadow-xl ring-4 ring-white/70 group-hover:scale-105`}>{item.icon}</div>
                                                <div className="text-right">
                                                    <div className={`text-4xl font-black tracking-tight ${c.year}`}>{item.year}</div>
                                                    <span className={`inline-block mt-1 px-2.5 py-1 rounded-full ${c.badge} text-[8px] font-black uppercase tracking-[0.18em]`}>Milestone</span>
                                                </div>
                                            </div>

                                            <div className="mt-7 flex items-center gap-2">
                                                <span className={`w-3 h-3 rounded-full ${c.bar} ring-4 ring-white shadow-md`} />
                                                <div className={`h-1 flex-1 rounded-full ${c.line}`}>
                                                    <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${accentHeight}%` }} />
                                                </div>
                                            </div>

                                            <h3 className="mt-6 text-xl font-extrabold text-[#002344] leading-tight min-h-[54px]">{item.title}</h3>
                                            <p className="mt-3 text-sm text-zinc-600 leading-relaxed min-h-[88px]">{item.desc}</p>

                                            <div className="mt-7 pt-4 border-t border-white/80 flex items-center justify-between gap-3">
                                                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-400">SSF • {item.year}</span>
                                                <span className={`w-9 h-9 rounded-full ${c.icon} flex items-center justify-center shadow-lg`}><FaArrowRight className="text-xs" /></span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </motion.div>
                </div>

                <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-5">
                    <div className="text-center"><div className="text-2xl font-black text-[#002344]">2013 → 2026</div><div className="text-xs text-zinc-400 uppercase tracking-widest font-bold">A continuing journey of service</div></div>
                    <Link to="/Journey" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002344] text-white font-bold hover:bg-[#FF6600] transition-all shadow-lg uppercase tracking-widest text-[10px]">View Detailed Journey <FaArrowRight className="text-xs" /></Link>
                </div>
            </div>
        </section>
    );
}
