import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaArrowRight, FaQuoteLeft } from "react-icons/fa";
import { stories } from "../data/stories";
import StoryModal from "./StoryModal";

export default function ImpactStories() {
    const [selectedStory, setSelectedStory] = useState(null);
    const [lang, setLang] = useState('en');

    // Featuring "Dreams Taking Flight" as requested
    const featuredStory = stories[2];

    const toggleLang = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

    return (
        <section className="py-24 px-6 bg-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EAF0F6] rounded-full blur-[120px] opacity-60 -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#EAF0F6] rounded-full blur-[120px] opacity-60 translate-y-1/2 -translate-x-1/4"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF0F6] text-[#12345A] text-[10px] font-bold uppercase tracking-[0.2em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#176447] animate-pulse"></span>
                        Voice of Transformation
                    </div>
                    <h2 className="text-4xl lg:text-7xl font-serif font-bold text-[#12345A]">
                        Stories of <span className="text-[#12345A]">Change</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-[#26343D] text-lg font-medium leading-relaxed">
                        Every life we touch has a story that deserves to be told. Explore the ripples of impact created by your support.
                    </p>
                </div>

                {/* Featured Story - High Impact Layout */}
                <div className="bg-[#FAF9F5] rounded-[3.5rem] p-4 md:p-8 border border-[#EAF0F6] shadow-xl overflow-hidden mb-16 group">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Image Column */}
                        <div className="lg:w-1/2 w-full h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                            <img
                                src={featuredStory.img}
                                alt={featuredStory.title.en}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            <span className="absolute bottom-8 left-8 bg-[#176447] text-[#12345A] px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                {featuredStory.category}
                            </span>
                        </div>

                        {/* Text Column */}
                        <div className="lg:w-1/2 w-full p-4 md:p-12 space-y-10">
                            <FaQuoteLeft className="text-[#F7A814] opacity-20 text-7xl" />
                            <div className="space-y-6">
                                <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#12345A] leading-tight group-hover:text-[#12345A] transition-colors">
                                    {featuredStory.title.en}
                                </h3>
                                <p className="text-2xl text-[#26343D] leading-relaxed font-medium italic">
                                    "{featuredStory.desc.en}"
                                </p>
                            </div>

                            <div className="pt-10 border-t border-[#EAF0F6] flex flex-wrap gap-8 items-center">
                                <button
                                    onClick={() => setSelectedStory(featuredStory)}
                                    className="px-12 py-6 bg-[#12345A] text-white rounded-2xl font-bold hover:bg-[#176447] hover:text-[#12345A] transition-all shadow-2xl hover:shadow-[#F7A814]/25 flex items-center gap-3 text-lg"
                                >
                                    Read Full Story <FaArrowRight />
                                </button>
                                <span className="text-[#26343D] font-bold uppercase tracking-[0.3em] text-[10px]">
                                    Direct Field Impact
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Single CTA to See All Highlights */}
                <div className="flex justify-center">
                    <Link to="/Stories">
                        <button className="group px-16 py-7 bg-[#12345A] text-white rounded-[2rem] font-bold hover:bg-[#176447] hover:text-[#12345A] transition-all shadow-2xl flex items-center gap-4 text-xl">
                            View All Impact Highlights
                            <FaArrowRight className="text-[#F7A814] group-hover:translate-x-2 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Global Story Modal */}
            <StoryModal
                story={selectedStory}
                isOpen={!!selectedStory}
                onClose={() => setSelectedStory(null)}
                lang={lang}
                onToggleLang={toggleLang}
            />
        </section>
    );
}
