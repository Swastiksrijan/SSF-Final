import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaGraduationCap, FaHeartbeat, FaHome, FaLeaf, FaHandHoldingHeart, FaRupeeSign, FaArrowRight, FaUsers } from "react-icons/fa";
import { HiSparkles, HiHeart } from "react-icons/hi2";
import PageHero from "../components/PageHero";

export default function Campaigns() {
    const campaigns = [
        {
            id: "education",
            icon: <FaGraduationCap />,
            title: "Education Equality",
            hindiTitle: "शिक्षा समानता - पढ़ेगा इंडिया, बढ़ेगा इंडिया",
            tagline: "Empowering Minds, Creating Futures",
            description: "Our 'Education Equality' campaign aims to bridge the gap in educational access for underprivileged children. We reach out to villages with interactive learning and literacy drives, providing resources to those who need them most.",
            impact: "20,000+ Students Impacted",
            donateLabel: "Support Child Education",
            gradient: "from-[#fb8500] to-[#e76f00]",
            bgLight: "bg-orange-50",
            iconBg: "bg-gradient-to-br from-[#fb8500] to-[#e76f00]",
            image: "/images/real/community-education-meeting.jpg"
        },
        {
            id: "health",
            icon: <FaHeartbeat />,
            title: "Health for All",
            hindiTitle: "सबके लिए स्वास्थ्य - स्वस्थ भारत, समृद्ध भारत",
            tagline: "Building Healthy Communities",
            description: "From COVID-19 awareness to regular health camps, we prioritize making healthcare accessible. We work at the ground level to provide essential support to mothers and children in remote areas.",
            impact: "50,000+ Lives Touched",
            donateLabel: "Donate for Healthcare",
            gradient: "from-[#d90429] to-[#a00320]",
            bgLight: "bg-red-50",
            iconBg: "bg-gradient-to-br from-[#d90429] to-[#a00320]",
            image: "/images/real/covid-awareness-banner.jpg"
        },
        {
            id: "rural",
            icon: <FaHome />,
            title: "Rural Development",
            hindiTitle: "ग्रामीण विकास - आत्मनिर्भर गाँव",
            tagline: "Sustainable Growth, Empowered Communities",
            description: "Our 'Rural Development Initiative' fosters self-reliance through community engagement, cloth distribution, and direct aid to families in rural Bharat.",
            impact: "120+ Villages Covered",
            donateLabel: "Support Rural Growth",
            gradient: "from-[#2d6a4f] to-[#1b4332]",
            bgLight: "bg-emerald-50",
            iconBg: "bg-gradient-to-br from-[#2d6a4f] to-[#1b4332]",
            image: "/images/real/cloth-distribution.jpg"
        }
    ];

    const additionalInitiatives = [
        {
            title: "Send Child To School",
            hindiTitle: "हर बच्चा स्कूल जाए",
            description: "Ensure every child, regardless of their background, has access to quality education. We enable underprivileged children to attend school with dignity.",
            icon: <FaUsers />,
            color: "text-[#002344]"
        },
        {
            title: "Fund Raising For Poor",
            hindiTitle: "मदद का हाथ, गरीबों के साथ",
            description: "A collective effort to raise funds that directly benefit the impoverished. Every donation goes towards food, shelter, and healthcare for the most vulnerable.",
            icon: <FaHandHoldingHeart />,
            color: "text-[#d90429]"
        },
        {
            title: "Nourishment for Well-being",
            hindiTitle: "पोषण अभियान - कोई भूखा न सोए",
            description: "Ensuring nutritious meals reach those facing food insecurity through food distribution programs and community kitchens.",
            icon: <HiHeart />,
            color: "text-[#fb8500]"
        },
        {
            title: "Tree Plantation Drive",
            hindiTitle: "वृक्षारोपण अभियान - हरित भारत",
            description: "A community-led initiative to increase green cover and promote environmental sustainability through regular plantation drives.",
            icon: <FaLeaf />,
            color: "text-[#2d6a4f]"
        },
        {
            title: "SOD Drive (Save Our Daughters)",
            hindiTitle: "बेटी बचाओ अभियान - सशक्त बेटियाँ",
            description: "Focused on protecting the rights of the girl child, ensuring their education, health, and empowerment in society.",
            icon: <FaHandHoldingHeart />,
            color: "text-[#d90429]"
        }
    ];

    return (
        <section className="bg-white font-inria min-h-screen">
            {/* ================= HERO ================= */}
            <PageHero
                image="/images/real/green-warriors-students.jpg"
                title="Our Campaigns"
                subtitle="Swastik Srijan Foundation conducts various campaigns to raise awareness, encourage community participation, and address important social, educational, health, and environmental issues."
                hindiSubtitle="हमारे अभियान - समुदायों का सशक्तिकरण, जीवन का परिवर्तन"
            />

            {/* ================= MAIN CAMPAIGNS ================= */}
            <div className="py-24 bg-gradient-to-b from-white to-zinc-50">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-[#fb8500] font-bold text-xs uppercase tracking-[0.2em] mb-4">Our Core Campaigns | हमारे मुख्य अभियान</p>
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#002344] mb-2">
                            Three Impactful Initiatives | तीन प्रभावशाली पहल
                        </h2>
                        <p className="text-xl text-zinc-500 font-medium">
                            Education, Health & Rural Development | शिक्षा, स्वास्थ्य और ग्रामीण विकास
                        </p>
                    </motion.div>

                    <div className="space-y-16">
                        {campaigns.map((campaign, idx) => (
                            <motion.div
                                key={campaign.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                id={campaign.id}
                                className={`grid lg:grid-cols-2 gap-10 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                {/* Image Side */}
                                <div className={`relative ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                                        <img
                                            src={campaign.image}
                                            alt={campaign.title}
                                            className="w-full h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t ${campaign.gradient} opacity-30`}></div>
                                        <div className={`absolute top-6 left-6 ${campaign.iconBg} p-4 rounded-2xl text-white text-3xl shadow-xl`}>
                                            {campaign.icon}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className={`space-y-6 ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                                    <div className={`inline-flex items-center gap-2 ${campaign.bgLight} px-4 py-2 rounded-full`}>
                                        <span className="text-zinc-600 font-semibold text-sm">{campaign.impact}</span>
                                    </div>

                                    <div>
                                        <h3 className="text-3xl lg:text-4xl font-serif font-bold text-[#002344]">
                                            {campaign.title}
                                        </h3>
                                        <p className="text-sm text-zinc-400 mt-1 italic">
                                            {campaign.hindiTitle}
                                        </p>
                                    </div>

                                    <p className={`text-lg font-semibold bg-gradient-to-r ${campaign.gradient} bg-clip-text text-transparent`}>
                                        {campaign.tagline}
                                    </p>

                                    <p className="text-zinc-600 leading-relaxed text-lg">
                                        {campaign.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <a
                                            href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-3 bg-gradient-to-r ${campaign.gradient} text-white font-bold px-8 py-4 rounded-full hover:shadow-xl hover:-translate-y-1 transition-all`}
                                        >
                                            <FaRupeeSign className="text-lg" />
                                            {campaign.donateLabel}
                                        </a>
                                        <Link
                                            to="/DonateAndSupport"
                                            className="inline-flex items-center gap-2 border-2 border-[#002344] text-[#002344] font-bold px-8 py-4 rounded-full hover:bg-[#002344] hover:text-white transition-all"
                                        >
                                            Learn More <FaArrowRight />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= CAMPAIGNS COLLAGE ================= */}
            <div className="py-24 bg-white overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-[#fb8500] font-bold text-xs uppercase tracking-[0.2em] mb-4">Visual Journey | दृश्य यात्रा</p>
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#002344] mb-2">
                            Campaigns at a Glance | अभियानों की एक झलक
                        </h2>
                        <p className="text-xl text-zinc-500 font-medium">
                            A showcase of our diverse initiatives across multiple domains.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[12px] border-white group"
                    >
                        <img
                            src="/images/real/green-warriors-students.jpg"
                            alt="Our Campaigns Collage"
                            className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#002344]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Decorative elements */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#fb8500]/10 rounded-full -translate-x-16 -translate-y-16 blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#d90429]/10 rounded-full translate-x-24 translate-y-24 blur-3xl"></div>
                    </motion.div>
                </div>
            </div>

            {/* ================= ADDITIONAL INITIATIVES ================= */}
            <div className="py-24 bg-[#001529]">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-[#fb8500] font-bold text-xs uppercase tracking-[0.2em] mb-4">More Ways to Help | मदद करने के और तरीके</p>
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-2">
                            Additional Initiatives | अतिरिक्त पहल
                        </h2>
                        <p className="text-xl text-zinc-400 font-medium">
                            Expanding Our Reach, Deepening Our Impact | हमारी पहुँच का विस्तार, हमारे प्रभाव की गहराई
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {additionalInitiatives.map((initiative, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-[#fb8500]/50 hover:bg-white/10 transition-all group"
                            >
                                <div className={`text-4xl ${initiative.color} mb-6 group-hover:scale-110 transition-transform`}>
                                    {initiative.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{initiative.title}</h3>
                                <p className="text-xs text-zinc-400 mb-4 italic">{initiative.hindiTitle}</p>
                                <p className="text-zinc-400 leading-relaxed mb-6">{initiative.description}</p>
                                <a
                                    href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[#fb8500] font-bold hover:gap-3 transition-all"
                                >
                                    Contribute Now <FaArrowRight />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= QUICK DONATE SECTION ================= */}
            <div className="py-24 bg-gradient-to-br from-[#fb8500]/5 via-white to-[#d90429]/5">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <HiSparkles className="text-5xl text-[#fb8500] mx-auto mb-6" />
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#002344] mb-6">
                            Quick Donate | त्वरित दान
                        </h2>
                        <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
                            Choose a cause and make an instant impact. Every donation, big or small, creates ripples of change.
                        </p>
                        <p className="text-zinc-400 mt-2 text-md">
                            एक कारण चुनें और तत्काल प्रभाव डालें। हर दान, चाहे वह बड़ा हो या छोटा, बदलाव की लहरें पैदा करता है।
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Child Education", icon: <FaGraduationCap />, color: "from-[#fb8500] to-[#e76f00]" },
                            { label: "Healthcare", icon: <FaHeartbeat />, color: "from-[#d90429] to-[#a00320]" },
                            { label: "Rural Development", icon: <FaHome />, color: "from-[#2d6a4f] to-[#1b4332]" },
                            { label: "Environment", icon: <FaLeaf />, color: "from-[#0077b6] to-[#005f92]" }
                        ].map((item, idx) => (
                            <motion.a
                                key={idx}
                                href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 text-center text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group`}
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{item.label}</h3>
                                <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
                                    <FaRupeeSign /> Donate Now
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= CTA ================= */}
            <div className="py-24 bg-gradient-to-br from-[#002344] to-[#001529] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#fb8500_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
                            Every Action <span className="text-[#fb8500]">Counts</span>
                        </h2>
                        <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                            Our campaigns are designed to inspire action, promote responsible behavior, and create meaningful social impact. Join us in making a difference.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <a
                                href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#d90429] to-[#b00422] text-white font-bold px-12 py-5 rounded-full text-lg hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-1 transition-all"
                            >
                                <FaHandHoldingHeart className="text-xl" />
                                Donate Now
                            </a>
                            <Link
                                to="/Volunteer"
                                className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold px-12 py-5 rounded-full text-lg hover:bg-white/20 transition-all"
                            >
                                <FaUsers className="text-xl" />
                                Volunteer With Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
