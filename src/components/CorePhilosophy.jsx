import { FaEye, FaBullseye, FaLeaf, FaArrowRight } from "react-icons/fa";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export default function CorePhilosophy() {
    const cards = [
        {
            title: "Vision",
            icon: <FaEye />,
            desc: "To build an inclusive, ethical, and empowered society where every individual has access to education, health, and dignity.",
            link: "/Vision",
            // Bright Azure Blue
            bg: "bg-[#0081d1]",
            text: "text-[#0081d1]",
            delay: 0
        },
        {
            title: "Mission",
            icon: <FaBullseye />,
            desc: "Focusing on holistic development through education, health, and sustainable livelihood to uplift the marginalized.",
            link: "/Mission",
            // Vibrant Growth Green
            bg: "bg-[#00a651]",
            text: "text-[#00a651]",
            delay: 0.2
        },
        {
            title: "Values",
            icon: <FaLeaf />,
            desc: "Integrity, Inclusivity, and Compassion are the pillars guiding our every action and decision.",
            link: "/institutional-dna",
            // Warm Terra Cotta / Bronze
            bg: "bg-[#c05e2b]",
            text: "text-[#c05e2b]",
            delay: 0.4
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Elements matching new vibrant colors */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-10 w-80 h-80 bg-[#0081d1] rounded-full blur-[100px] opacity-10"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#00a651] rounded-full blur-[100px] opacity-10"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header Section Restored */}
                <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
                    <h2 className="text-[#fb8500] font-bold text-xs uppercase tracking-[0.2em]">Purpose & Direction</h2>
                    <h3 className="text-4xl lg:text-5xl font-serif font-bold text-[#002344]">Our Campaign</h3>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto">Foundational pillars of our movement for social change.</p>
                </div>

                {/* Cards Container */}
                <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-6xl mx-auto">

                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: card.delay, ease: "easeOut" }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className={`flex-1 ${card.bg} rounded-[2.5rem] p-10 text-center flex flex-col items-center justify-between text-white shadow-xl group hover:shadow-2xl transition-shadow duration-300`}
                        >
                            <div className="space-y-6">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner border border-white/20"
                                >
                                    {card.icon}
                                </motion.div>

                                <div>
                                    <h3 className="text-3xl font-serif font-bold mb-3 tracking-wide">{card.title}</h3>
                                    <div className="w-12 h-1 bg-white/30 mx-auto rounded-full mb-5"></div>
                                    <p className="text-white/90 font-medium leading-relaxed text-lg">
                                        {card.desc}
                                    </p>
                                </div>
                            </div>

                            <Link
                                to={card.link}
                                className={`mt-8 bg-white ${card.text} px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2`}
                            >
                                Read More <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
}
