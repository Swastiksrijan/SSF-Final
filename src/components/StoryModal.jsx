import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaArrowRight } from "react-icons/fa";
import { Languages } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function StoryModal({ story, isOpen, onClose, lang, onToggleLang }) {
    if (!story) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-zinc-500 hover:bg-[#fb8500] hover:text-white transition-all border border-zinc-100 shadow-xl"
                        >
                            <FaTimes size={20} />
                        </button>

                        {/* Language Toggle */}
                        <button
                            onClick={onToggleLang}
                            className="absolute top-6 left-6 md:left-auto md:right-24 z-20 px-6 h-12 bg-white/90 backdrop-blur rounded-full flex items-center gap-2 text-[#002344] font-bold text-sm hover:bg-zinc-50 transition-all border border-zinc-100 shadow-xl"
                        >
                            <Languages size={18} />
                            {lang === 'en' ? 'हिन्दी' : 'English'}
                        </button>

                        <div className="flex flex-col lg:flex-row">
                            {/* Image Section */}
                            <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-full bg-zinc-100">
                                <img
                                    src={story.img || "/images/placeholder.jpg"}
                                    alt={story.title[lang] || story.title.en}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-10 left-10 space-y-2">
                                    <span className="px-4 py-1.5 bg-[#fb8500] text-white text-[10px] font-bold rounded-full uppercase tracking-[0.2em] shadow-lg">
                                        {story.category}
                                    </span>
                                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Ground Transformation</p>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="lg:w-3/5 p-12 md:p-16 space-y-10 bg-white">
                                <div className="space-y-4">
                                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-[#002344] leading-tight">
                                        {story.title[lang] || story.title.en}
                                    </h3>
                                    <div className="w-20 h-1.5 bg-[#fb8500] rounded-full"></div>
                                </div>

                                <div className="space-y-6 text-zinc-600 text-lg leading-relaxed whitespace-pre-line font-medium">
                                    {(story.content?.[lang] || story.content?.en || "")
                                        .split('\n\n')
                                        .map((paragraph, idx) => (
                                            <p key={idx}>{paragraph}</p>
                                        ))}
                                </div>

                                <div className="pt-10 border-t border-zinc-100 flex flex-col sm:flex-row gap-6">
                                    <Link to="/DonateAndSupport" className="flex-1">
                                        <button className="w-full px-10 py-5 bg-[#002344] text-white rounded-2xl font-bold hover:bg-[#fb8500] transition-all shadow-xl shadow-[#002344]/10 flex items-center justify-center gap-3">
                                            {lang === 'en' ? 'Support This Cause' : 'सहयोग करें'}
                                            <FaArrowRight />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={onClose}
                                        className="px-10 py-5 rounded-2xl border-2 border-zinc-100 font-bold text-zinc-500 hover:border-[#002344] hover:text-[#002344] transition-all"
                                    >
                                        {lang === 'en' ? 'Close Story' : 'बंद करें'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
