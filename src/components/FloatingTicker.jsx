import { motion } from "framer-motion";

const FloatingTicker = () => {
    const valuesText = "सेवा • समर्पण • समग्र विकास";

    return (
        <div className="relative z-30 mt-3 px-4 md:px-10">
            <div className="mx-auto grid max-w-7xl gap-4 md:gap-5 lg:grid-cols-2 lg:items-stretch">
                {/* Left — identity + scrolling values ticker */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="bg-[#12345A] rounded-2xl shadow-xl border border-white/10 px-6 py-7 md:px-9 md:py-9 text-center text-white overflow-hidden relative flex flex-col justify-center"
                >
                    <div className="relative z-10 space-y-3">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-wide drop-shadow-md">
                            Swastik Srijan Foundation
                        </h2>
                        <p className="text-[#F7A814] font-medium text-lg md:text-xl tracking-wider uppercase font-sans">
                            Empowering Lives. Building a Better Bharat.
                        </p>
                    </div>

                    {/* Values line — static, no auto-scroll */}
                    <div className="mt-7 border-t border-white/10 pt-5">
                        <p className="text-xl md:text-2xl font-bold leading-normal text-white/90">
                            {valuesText}
                        </p>
                    </div>
                </motion.div>

                {/* Right — our guiding promise */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.65 }}
                    className="bg-[#12345A] rounded-2xl shadow-xl border border-white/10 px-6 py-7 md:px-9 md:py-9 text-white relative flex flex-col justify-center"
                >
                    <div className="absolute left-6 top-0 h-1 w-20 -translate-y-1/2 rounded-full bg-[#F7A814]"></div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#F7A814]">Our guiding promise</p>
                    <h2 className="mt-4 font-serif text-2xl leading-snug text-white md:text-3xl">Serve with integrity. Act with compassion.</h2>
                    <p className="mt-3 leading-relaxed text-slate-200">We strive to create lasting, meaningful social value through responsible action, community participation and cooperation.</p>
                    <div className="mt-5 border-t border-white/15 pt-5">
                        <p className="text-sm font-semibold text-[#F7A814]">हमारा संकल्प</p>
                        <p className="mt-2 leading-relaxed text-slate-200">ईमानदारी से सेवा, संवेदनशीलता के साथ कार्य और समाज के लिए स्थायी सकारात्मक परिवर्तन।</p>
                    </div>
                    <div className="mt-5 flex items-center gap-3 text-sm text-slate-300">
                        <span className="h-px flex-1 bg-[#F7A814]/45"></span>
                        <span>Since December 2013</span>
                        <span className="h-px flex-1 bg-[#F7A814]/45"></span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FloatingTicker;
