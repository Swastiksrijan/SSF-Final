import { motion } from "framer-motion";

const FloatingTicker = () => {
    const hindiText = "सेवा • समर्पण • समग्र विकास • सेवा • समर्पण • समग्र विकास • सेवा • समर्पण • समग्र विकास • ";

    return (
        <div className="relative z-30 mt-3 mx-4 md:mx-auto max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-[#12345A] rounded-2xl shadow-xl border border-zinc-700/30 px-6 py-7 md:px-9 md:py-9 text-center text-white overflow-hidden relative"
            >
                <div className="relative z-10 space-y-3">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-wide drop-shadow-md">
                        Swastik Srijan Foundation
                    </h2>
                    <p className="text-[#176447] font-medium text-lg md:text-xl tracking-wider uppercase font-sans">
                        Empowering Lives. Building a Better Bharat.
                    </p>
                </div>

                {/* Scrolling Ticker */}
                <div className="mt-7 border-t border-white/10 pt-5 overflow-hidden relative">
                    <div className="flex whitespace-nowrap overflow-hidden py-2">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: 0 }}
                                animate={{ x: "-100%" }}
                                transition={{
                                    repeat: Infinity,
                                    ease: "linear",
                                    duration: 25, // Slightly slower for better readability
                                }}
                                className="flex items-center"
                            >
                                <span className="text-xl md:text-2xl font-bold leading-normal text-white/90 px-4">
                                    {hindiText}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FloatingTicker;
