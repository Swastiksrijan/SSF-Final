import { motion } from "framer-motion";
import { FaGlobeAmericas, FaArrowRight, FaCheckCircle, FaHandHoldingHeart, FaShieldAlt } from "react-icons/fa";
import { Link } from "@tanstack/react-router";
import OptimizedImage from "../components/OptimizedImage";

export default function VisionPage() {
    return (
        <div className="w-full bg-white overflow-hidden">
            {/* ================= HERO SECTION ================= */}
            <section className="relative min-h-[60vh] flex items-center pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#001529] via-[#002344] to-[#003366]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05]"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#fb8500] opacity-[0.08] rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d90429] opacity-[0.08] rounded-full blur-[120px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center space-y-6"
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                                <FaGlobeAmericas className="text-[#fb8500] text-3xl" />
                            </div>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white leading-tight">
                            Our <span className="text-[#fb8500]">Vision</span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-zinc-300 font-medium max-w-3xl mx-auto leading-relaxed">
                            Vision Statement
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ================= VISION STATEMENT ================= */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        {/* Main Vision Statement */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-[#002344] to-[#003366] rounded-[3rem] p-12 lg:p-16 text-white shadow-2xl mb-16"
                        >
                            <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-8 text-center text-[#fb8500]">
                                A Commitment to Inclusive Growth
                            </h2>
                            <p className="text-xl lg:text-2xl leading-relaxed text-center font-medium mb-8">
                                Our vision reflects our commitment to inclusive growth, ethical action, and human dignity. We aspire to create a society where development reaches the last person and contributes to a stronger nation and a better world.
                            </p>
                            <div className="w-24 h-1 bg-[#fb8500] mx-auto mb-8 opacity-50"></div>
                            <p className="text-lg lg:text-xl leading-relaxed text-center font-hindi opacity-90">
                                हमारी दृष्टि समावेशी विकास, नैतिक कार्य और मानव गरिमा के प्रति हमारी प्रतिबद्धता को दर्शाती है, जहाँ विकास अंतिम व्यक्ति तक पहुँचे और राष्ट्र व विश्व के कल्याण में योगदान दे।
                            </p>
                        </motion.div>

                        {/* Core Pillars / Goals */}
                        <div className="grid lg:grid-cols-2 gap-12 mb-16">
                            {/* Hindi Vision Points */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <h3 className="text-2xl font-serif font-bold text-[#002344] border-l-4 border-[#fb8500] pl-4">
                                    लक्ष्य और दृष्टि
                                </h3>
                                <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
                                    <p className="text-xl text-[#002344] font-medium leading-relaxed">
                                        एक ऐसा समावेशी, नैतिक और सशक्त समाज बनाना जहाँ प्रत्येक व्यक्ति को शिक्षा, स्वास्थ्य, सम्मान, अवसर और सुरक्षित भविष्य प्राप्त हो — राष्ट्र निर्माण के माध्यम से वैश्विक कल्याण की दिशा में।
                                    </p>
                                </div>
                            </motion.div>

                            {/* English Vision Points */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <h3 className="text-2xl font-serif font-bold text-[#002344] border-l-4 border-[#fb8500] pl-4">
                                    Vision Goals
                                </h3>
                                <div className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100">
                                    <p className="text-xl text-[#002344] font-medium leading-relaxed">
                                        To build an inclusive, ethical, and empowered society where every individual has access to education, health, dignity, opportunities, and a secure future—contributing to nation-building and global well-being.
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Path Forward */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-zinc-50 rounded-[2.5rem] p-12 border border-zinc-200"
                        >
                            <h3 className="text-3xl font-serif font-bold text-[#002344] mb-6 text-center">
                                Our Path Forward
                            </h3>
                            <p className="text-xl text-zinc-600 leading-relaxed text-center font-medium mb-8">
                                Our Vision is realized through our Mission and guided by our Core Values.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <Link to="/Mission" className="btn-secondary border-[#002344] text-[#002344] hover:bg-[#002344] hover:text-white">
                                    Explore Our Mission <FaHandHoldingHeart />
                                </Link>
                                <Link to="/institutional-dna" className="btn-secondary border-[#d90429] text-[#d90429] hover:bg-[#d90429] hover:text-white">
                                    Explore Institutional DNA <FaShieldAlt />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ================= CALL TO ACTION ================= */}
            <section className="py-24 bg-[#001529] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center space-y-8"
                    >
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
                            Let's Build a Better World Together
                        </h2>
                        <p className="text-xl text-zinc-400 font-medium">
                            If your ideas, principles, or goals align with our organization, feel free to join us in building a better world.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                            <Link to="/Volunteer" className="btn-cta px-12 py-5 text-lg">
                                Become a Volunteer
                            </Link>
                            <Link to="/DonateAndSupport" className="btn-secondary border-white text-white hover:bg-white hover:text-[#001529] px-12 py-5 text-lg">
                                Support Our Vision
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
