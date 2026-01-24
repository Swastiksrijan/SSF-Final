import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaBuilding, FaHandshake, FaUniversity, FaChalkboardTeacher, FaGlobeAsia } from "react-icons/fa";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

export default function PartnerWithUs() {
    return (
        <main className="w-full bg-white min-h-screen font-inria">

            {/* ================= HERO SECTION (Premium Heritage Blue) ================= */}
            <section className="bg-[#002344] text-white pt-48 pb-32 relative overflow-hidden px-6">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#fb8500] opacity-[0.05] rounded-full blur-[100px]"></div>

                <div className="max-w-6xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <span className="text-[#fb8500] font-bold uppercase tracking-[0.3em] text-xs">
                            Strategic Collaboration • रणनीतिक सहयोग
                        </span>
                        <h1 className="text-5xl md:text-8xl font-serif font-bold leading-tight">
                            Partner <span className="text-[#fb8500]">With Us</span>
                        </h1>
                        <h2 className="text-xl md:text-2xl text-zinc-400 italic">
                            Strategic Collaboration for Social Impact
                        </h2>
                        <p className="text-zinc-400 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto font-medium">
                            "Alone we can do so little; together we can do so much." Join forces with SSF to amplify social impact and reach the last mile.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ================= CSR PARTNERSHIPS ================= */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-10"
                    >
                        <div className="inline-flex items-center gap-4 text-[#fb8500]">
                            <div className="w-12 h-12 bg-[#fb8500]/10 rounded-2xl flex items-center justify-center text-xl">
                                <FaBuilding />
                            </div>
                            <span className="font-bold uppercase tracking-widest text-sm">Corporate Social Responsibility</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#002344] leading-tight">
                            Transforming Corporate <br /> Vision into Social Reality.
                        </h2>
                        <p className="text-lg text-zinc-500 italic">
                            Transforming Corporate Vision into Social Reality
                        </p>

                        <p className="text-lg text-zinc-600 font-medium leading-relaxed">
                            We help corporates fulfill their CSR goals with transparent, scalable, and measurable impact projects that align with UN Sustainable Development Goals.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {[
                                { title: "12A/80G Certified", desc: "Full tax benefits for all contributions." },
                                { title: "CSR-1 Registered", desc: "Compliant with Ministry of Corporate Affairs." },
                                { title: "Quarterly Reports", desc: "Transparent financial and impact reporting." },
                                { title: "Volunteer Drifts", desc: "Involve your employees in direct fieldwork." }
                            ].map((item, i) => (
                                <div key={i} className="bg-[#f8f9fa] p-6 rounded-3xl border border-zinc-100 hover:border-[#fb8500]/20 transition-all">
                                    <h4 className="font-bold text-[#002344] mb-2">{item.title}</h4>
                                    <p className="text-zinc-500 text-sm font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-zinc-100 aspect-square flex items-center justify-center">
                            <div className="text-center space-y-4 opacity-30">
                                <FaHandshake className="text-9xl mx-auto text-[#002344]" />
                                <p className="font-black tracking-[0.3em] text-[#002344]">PARTNERSHIP HUB</p>
                            </div>
                        </div>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#fb8500] opacity-5 rounded-full blur-3xl"></div>
                    </motion.div>
                </div>
            </section>

            {/* ================= ECOSYSTEM MODELS ================= */}
            <section className="py-32 bg-[#002344] text-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 space-y-6">
                        <h2 className="text-[#fb8500] font-bold tracking-[0.3em] uppercase text-xs">The SSF Ecosystem</h2>
                        <h3 className="text-4xl md:text-6xl font-serif font-bold">Collaboration Models</h3>
                        <p className="text-xl text-zinc-400 font-medium">Partnership Models</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <FaUniversity />,
                                title: "Institutions",
                                hindiTitle: "संस्थान",
                                color: "border-[#fb8500]",
                                desc: "Schools, colleges, and training institutes can partner for student exchange, internships, and research projects.",
                                points: ["Campus Chapters", "Resource Sharing"],
                                stat: "50+ Schools Partnered"
                            },
                            {
                                icon: <FaChalkboardTeacher />,
                                title: "Expert Mentors",
                                hindiTitle: "विशेषज्ञ परामर्शदाता",
                                color: "border-[#d90429]",
                                desc: "Subject matter experts can join as guest faculty or curriculum advisors for our National Academy projects.",
                                points: ["Guest Lectures", "Curriculum Design"],
                                stat: "100+ Mentors Onboard"
                            },
                            {
                                icon: <FaGlobeAsia />,
                                title: "NGO Partners",
                                hindiTitle: "गैर सरकारी संगठन",
                                color: "border-[#2d6a4f]",
                                desc: "Grassroot organizations can collaborate to implement our models in new geographies. Let's scale together.",
                                points: ["Joint Implementation", "Scaling Impact"],
                                stat: "15+ NGO Partners"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className={`bg-white/5 backdrop-blur-sm p-10 rounded-[3rem] border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden`}
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl mb-8 group-hover:bg-[#fb8500] group-hover:text-white transition-all`}>
                                    {item.icon}
                                </div>
                                <h4 className="text-2xl font-serif font-bold mb-1">{item.title}</h4>
                                <h5 className="text-sm text-zinc-400 mb-4 italic">{item.hindiTitle}</h5>
                                <p className="text-zinc-400 font-medium leading-relaxed mb-8">{item.desc}</p>
                                <ul className="space-y-3 mb-8">
                                    {item.points.map((p, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm font-bold opacity-80">
                                            <IoCheckmarkCircleSharp className="text-[#fb8500]" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-[#fb8500] font-bold text-sm uppercase tracking-widest">{item.stat}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FINAL CTA SECTION (Polished) ================= */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#f8f9fa] rounded-[4rem] p-12 md:p-24 text-center space-y-12 relative overflow-hidden border border-zinc-100 shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#fb8500] opacity-[0.03] rounded-full blur-[100px] -mr-32 -mt-32"></div>

                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-7xl font-serif font-bold text-[#002344]"
                        >
                            Become a <span className="text-[#fb8500]">Partner.</span>
                        </motion.h2>
                        <p className="text-lg text-zinc-400 italic">Building Partnerships for Change</p>

                        <p className="text-xl md:text-2xl text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            Join our roadmap to social transformation. Reach out to our partnership team to explore collaboration opportunities.
                        </p>

                        <div className="pt-8">
                            <Link to="/Contact">
                                <button className="btn-primary px-16 py-6 text-xl bg-[#003366] text-white rounded-full font-bold hover:bg-[#002244] transition-colors shadow-lg shadow-blue-900/20">
                                    Contact Partnership Team
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>



        </main>
    );
}
