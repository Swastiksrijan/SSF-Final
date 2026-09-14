import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaSeedling, FaGraduationCap, FaHandHoldingHeart, FaFemale, FaBriefcase, FaUsers, FaArrowRight, FaRocket, FaHeartbeat, FaLeaf, FaBullhorn, FaLaptop } from "react-icons/fa";

export default function ImpactTimeline() {
    const years = [
        { year: "2013", title: "Foundation & Registration", desc: "Registered beginning of the Swastik Srijan Foundation journey in Rewa, Madhya Pradesh.", icon: <FaSeedling />, theme: "orange", height: 54 },
        { year: "2014", title: "Foundation Building", desc: "Early community connections and groundwork for education, health and social awareness.", icon: <FaHandHoldingHeart />, theme: "blue", height: 72 },
        { year: "2015", title: "Community Engagement", desc: "Continuing the foundation-building phase through community participation and social initiatives.", icon: <FaUsers />, theme: "green", height: 62 },
        { year: "2016", title: "Learning & Awareness", desc: "Continued focus on learning, awareness and practical community-oriented support.", icon: <FaGraduationCap />, theme: "purple", height: 82 },
        { year: "2017", title: "Strengthening Outreach", desc: "Building stronger connections around inclusive development and community participation.", icon: <FaBullhorn />, theme: "pink", height: 68 },
        { year: "2018", title: "Expanding Initiatives", desc: "Growing attention to education, health, skills and community empowerment.", icon: <FaBriefcase />, theme: "amber", height: 92 },
        { year: "2019", title: "Social Development", desc: "Continuing community-oriented work with emphasis on skills, wellbeing and participation.", icon: <FaFemale />, theme: "cyan", height: 76 },
        { year: "2020", title: "Standing With Communities", desc: "Community awareness, support and responsible social response during the COVID-19 period.", icon: <FaHeartbeat />, theme: "rose", height: 88 },
        { year: "2021", title: "Adapting & Continuing", desc: "Learning and support initiatives continued while adapting to changing community needs.", icon: <FaUsers />, theme: "teal", height: 70 },
        { year: "2022", title: "Strengthening Community Work", desc: "Continued focus on awareness, learning, support and community participation.", icon: <FaHandHoldingHeart />, theme: "indigo", height: 96 },
        { year: "2023", title: "Learning & Development", desc: "Greater emphasis on learning, skills, awareness and practical community development.", icon: <FaGraduationCap />, theme: "sky", height: 80 },
        { year: "2024", title: "Community Initiatives", desc: "Continuing work across education, health, environment and community development areas.", icon: <FaLeaf />, theme: "lime", height: 90 },
        { year: "2025", title: "Digital & Social Outreach", desc: "Wider use of digital tools and outreach for learning, awareness and participation.", icon: <FaLaptop />, theme: "violet", height: 84 },
        { year: "2026", title: "Continuing the Mission", desc: "Current work continues around education, skills, health, awareness, community support and partnerships.", icon: <FaRocket />, theme: "red", height: 100 }
    ];

    const themes = {
        orange: { bar: "bg-orange-500", text: "text-orange-600", soft: "bg-orange-50", glow: "shadow-orange-500/30" },
        blue: { bar: "bg-blue-600", text: "text-blue-700", soft: "bg-blue-50", glow: "shadow-blue-600/30" },
        green: { bar: "bg-emerald-500", text: "text-emerald-700", soft: "bg-emerald-50", glow: "shadow-emerald-500/30" },
        purple: { bar: "bg-violet-600", text: "text-violet-700", soft: "bg-violet-50", glow: "shadow-violet-600/30" },
        pink: { bar: "bg-pink-500", text: "text-pink-700", soft: "bg-pink-50", glow: "shadow-pink-500/30" },
        amber: { bar: "bg-amber-500", text: "text-amber-700", soft: "bg-amber-50", glow: "shadow-amber-500/30" },
        cyan: { bar: "bg-cyan-500", text: "text-cyan-700", soft: "bg-cyan-50", glow: "shadow-cyan-500/30" },
        rose: { bar: "bg-rose-600", text: "text-rose-700", soft: "bg-rose-50", glow: "shadow-rose-600/30" },
        teal: { bar: "bg-teal-500", text: "text-teal-700", soft: "bg-teal-50", glow: "shadow-teal-500/30" },
        indigo: { bar: "bg-indigo-600", text: "text-indigo-700", soft: "bg-indigo-50", glow: "shadow-indigo-600/30" },
        sky: { bar: "bg-sky-500", text: "text-sky-700", soft: "bg-sky-50", glow: "shadow-sky-500/30" },
        lime: { bar: "bg-lime-500", text: "text-lime-700", soft: "bg-lime-50", glow: "shadow-lime-500/30" },
        violet: { bar: "bg-fuchsia-600", text: "text-fuchsia-700", soft: "bg-fuchsia-50", glow: "shadow-fuchsia-600/30" },
        red: { bar: "bg-red-600", text: "text-red-700", soft: "bg-red-50", glow: "shadow-red-600/30" }
    };

    return (
        <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden relative border-y border-zinc-100">
            <div className="absolute -top-40 right-0 w-[32rem] h-[32rem] bg-orange-100/50 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 left-0 w-[32rem] h-[32rem] bg-blue-100/50 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-12">
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
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 bg-gradient-to-r from-slate-50 via-slate-50/95 to-transparent z-30" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 bg-gradient-to-l from-white via-white/95 to-transparent z-30" />

                    <motion.div
                        className="flex items-end gap-4 md:gap-5 w-max px-3 min-h-[430px]"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 52, ease: "linear" } }}
                    >
                        {[...years, ...years].map((item, index) => {
                            const c = themes[item.theme];
                            const delay = (index % years.length) * 0.08;
                            return (
                                <motion.article
                                    key={`${item.year}-${index}`}
                                    className="relative shrink-0 w-[88px] md:w-[105px] h-[410px] flex flex-col justify-end items-center"
                                    initial={{ opacity: 0.65 }}
                                    animate={{ opacity: [0.65, 1, 0.65] }}
                                    transition={{ duration: 3.8, repeat: Infinity, delay, ease: "easeInOut" }}
                                >
                                    <div className="absolute inset-x-0 bottom-[74px] h-[270px] rounded-full bg-white/60 border border-white/80 shadow-inner" />

                                    <motion.div
                                        className={`relative w-[58px] md:w-[68px] rounded-t-[1.35rem] rounded-b-lg ${c.bar} shadow-2xl ${c.glow} overflow-hidden`}
                                        initial={{ height: 20 }}
                                        animate={{ height: [`${item.height - 12}%`, `${item.height}%`, `${item.height - 12}%`] }}
                                        transition={{ duration: 2.8 + (index % 4) * 0.25, repeat: Infinity, delay, ease: "easeInOut" }}
                                    >
                                        <div className="absolute inset-x-0 top-0 h-20 bg-white/25" />
                                        <motion.div className="absolute inset-x-0 top-3 h-2 rounded-full bg-white/70" animate={{ opacity: [0.35, 0.9, 0.35] }} transition={{ duration: 1.8, repeat: Infinity, delay }} />
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                                            <span className={c.text}>{item.icon}</span>
                                        </div>
                                    </motion.div>

                                    <div className={`mt-4 px-3 py-1.5 rounded-full ${c.soft} ${c.text} text-sm md:text-base font-black shadow-sm`}>{item.year}</div>
                                    <div className="mt-2 text-center text-[9px] md:text-[10px] font-black text-[#002344] uppercase tracking-wide leading-tight max-w-[100px] min-h-[28px]">{item.title}</div>
                                </motion.article>
                            );
                        })}
                    </motion.div>
                </div>

                <div className="mt-7 text-center text-[10px] text-zinc-400 font-bold uppercase tracking-[0.18em]">Visual bars are a design element for the year-by-year journey — not numerical impact data.</div>

                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-5">
                    <div className="text-center"><div className="text-2xl font-black text-[#002344]">2013 → 2026</div><div className="text-xs text-zinc-400 uppercase tracking-widest font-bold">A continuing journey of service</div></div>
                    <Link to="/Journey" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002344] text-white font-bold hover:bg-[#FF6600] transition-all shadow-lg uppercase tracking-widest text-[10px]">View Detailed Journey <FaArrowRight className="text-xs" /></Link>
                </div>
            </div>
        </section>
    );
}
