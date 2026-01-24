import { motion } from "framer-motion";
import { FaHandsWash, FaSoap, FaShower, FaTshirt, FaSmile, FaVirusSlash, FaHeartbeat } from "react-icons/fa";
import { BiTimer } from "react-icons/bi";

const HygieneModule = () => {
    const benefits = [
        {
            title: "स्वस्थ रहें",
            subtitle: "Stay Healthy",
            icon: <FaHeartbeat className="text-red-500" />,
            color: "bg-green-100 border-green-200",
        },
        {
            title: "कीटाणुओं को दूर रखें",
            subtitle: "Keep Germs Away",
            icon: <FaVirusSlash className="text-blue-500" />,
            color: "bg-yellow-100 border-yellow-200",
        },
        {
            title: "खुश और आत्मविश्वास रहें",
            subtitle: "Stay Happy & Confident",
            icon: <FaSmile className="text-orange-500" />,
            color: "bg-red-100 border-red-200",
        },
    ];

    const handWashTimes = [
        { title: "खाना खाने से पहले", eng: "Before Eating", icon: "🍎" },
        { title: "शौचालय के बाद", eng: "After Toilet", icon: "🚽" },
        { title: "खेलने के बाद", eng: "After Playing", icon: "⚽" },
    ];

    return (
        <section className="py-20 bg-[#fdfcf0] relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50 -ml-32 -mb-32"></div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 bg-[#004d99] text-white text-xs font-bold rounded-full mb-4 tracking-widest uppercase"
                    >
                        SSF Learning Hub Special
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-zinc-900 mb-4"
                    >
                        निजी स्वच्छता (Personal Hygiene)
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl text-[#004d99] font-bold italic"
                    >
                        "स्वच्छ रहो, चमकदार रहो!"
                    </motion.p>
                </div>

                {/* Section 1: What is it? */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-white p-10 rounded-[2.5rem] shadow-xl border-2 border-blue-50 shadow-blue-900/5"
                    >
                        <h3 className="text-3xl font-black text-zinc-800 mb-6">निजी स्वच्छता क्या है?</h3>
                        <div className="bg-blue-600 text-white p-6 rounded-2xl mb-8 text-center text-xl font-bold shadow-lg shadow-blue-200">
                            अपने शरीर को साफ और स्वस्थ रखना।
                        </div>
                        <p className="text-zinc-600 text-lg leading-relaxed">
                            Personal hygiene is the practice of keeping your body clean and healthy to prevent illness and feel good about yourself.
                        </p>
                    </motion.div>

                    <div className="grid gap-6">
                        {benefits.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className={`flex items-center gap-6 p-6 rounded-2xl border-2 ${benefit.color} shadow-sm transition-all`}
                            >
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-md">
                                    {benefit.icon}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-zinc-800">{benefit.title}</h4>
                                    <p className="text-zinc-500 font-medium">{benefit.subtitle}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Section 2: Hand Washing */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-zinc-100 mb-20 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FaHandsWash size={200} className="text-blue-900" />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-3xl font-black text-zinc-900 mb-10 flex items-center gap-4">
                            <span className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg"><FaHandsWash /></span>
                            अपने हाथ धोएं: सुरक्षा का पहला कदम
                        </h3>

                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            {handWashTimes.map((item, idx) => (
                                <div key={idx} className="bg-zinc-50 p-8 rounded-3xl text-center border border-zinc-100 hover:border-blue-200 hover:bg-white transition-all group">
                                    <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform">{item.icon}</div>
                                    <h4 className="text-xl font-black text-zinc-800 mb-2">{item.title}</h4>
                                    <p className="text-zinc-400 font-bold text-sm tracking-widest uppercase">{item.eng}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-green-500 text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-green-100">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center text-5xl">🧼</div>
                                <div>
                                    <h4 className="text-2xl font-black">सुनहरा नियम (The Golden Rule)</h4>
                                    <p className="text-green-50 font-medium text-lg">हमेशा साबुन और पानी का प्रयोग करें।</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full border border-white/20">
                                <BiTimer className="text-3xl" />
                                <span className="font-bold">20 Seconds</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Section 3: Bath & Freshness */}
                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-white p-10 rounded-[3rem] shadow-xl border border-zinc-100 group"
                    >
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                            <FaShower />
                        </div>
                        <h3 className="text-3xl font-black text-zinc-900 mb-6">स्नान और ताजगी</h3>
                        <ul className="space-y-4 text-lg">
                            <li className="flex items-center gap-3 text-zinc-700 font-medium">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                प्रतिदिन स्नान करें
                            </li>
                            <li className="flex items-center gap-3 text-zinc-700 font-medium">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                साबुन और साफ पानी का प्रयोग करें
                            </li>
                        </ul>
                        <div className="mt-8 pt-8 border-t border-zinc-100">
                            <p className="text-2xl font-black text-blue-600 italic">"ताजा और साफ रहें"</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-white p-10 rounded-[3rem] shadow-xl border border-zinc-100 group"
                    >
                        <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-500">
                            <FaTshirt />
                        </div>
                        <h3 className="text-3xl font-black text-zinc-900 mb-6">कपड़ों की सफाई</h3>
                        <ul className="space-y-4 text-lg">
                            <li className="flex items-center gap-3 text-zinc-700 font-medium">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                रोज साफ कपड़े पहनें
                            </li>
                            <li className="flex items-center gap-3 text-zinc-700 font-medium">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                गंदे कपड़े बदलें
                            </li>
                        </ul>
                        <div className="mt-8 pt-8 border-t border-zinc-100">
                            <p className="text-2xl font-black text-orange-600 italic">"अच्छी महक, अच्छा एहसास"</p>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-24 text-center p-12 bg-zinc-900 text-white rounded-[3rem] shadow-2xl overflow-hidden relative"
                >
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="relative z-10">
                        <p className="text-3xl font-black mb-4">सुनने के लिए धन्यवाद!</p>
                        <p className="text-zinc-400 text-lg mb-8">Thank you for listening! Let's build a healthier India together.</p>
                        <div className="flex flex-col items-center">
                            <div className="text-xl font-bold text-blue-400">गिन्सी जॉर्ज</div>
                            <div className="text-zinc-500 text-sm">काउंसिलिंग और कम्युनिटी हेड</div>
                            <div className="bg-blue-600/20 text-blue-300 px-4 py-1 rounded-full text-xs font-bold mt-2 border border-blue-500/30">
                                Well-Being (Pan India)
                            </div>
                        </div>
                        <div className="mt-12 text-sm font-bold tracking-[0.2em] text-zinc-600 uppercase">
                            Swastik Srijan Foundation
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HygieneModule;
