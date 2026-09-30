import { motion } from "framer-motion";

const FloatingTicker = () => {
    const hindiText = "सेवा • समर्पण • समग्र विकास • सेवा • समर्पण • समग्र विकास • सेवा • समर्पण • समग्र विकास • ";

    return (
        <div className="relative z-30 -mt-16 mx-4 md:mx-auto max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-[#002344] rounded-2xl shadow-xl border border-zinc-700/30 p-6 md:p-8 text-center text-white overflow-hidden relative"
            >
                <div className="relative z-10 space-y-2">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-wide drop-shadow-md">
                        Swastik Srijan Foundation
                    </h2>
                    <p className="text-[#fb8500] font-medium text-lg md:text-xl tracking-wider uppercase font-sans">
                        Empowering Lives. Building a Better Bharat.
                    </p>
                </div>

                {/* Scrolling Ticker */}
                <div className="mt-6 border-t border-white/10 pt-4 overflow-hidden relative">
                    <div className="flex whitespace-nowrap overflow-hidden">
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
                                <span className="text-xl md:text-2xl font-bold text-white/90 px-4">
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
