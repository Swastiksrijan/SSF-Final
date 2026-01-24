import InfiniteLogoScroll from "../components/InfiniteScrollLogo";
import { motion } from "framer-motion";

export default function Collaborations() {
  return (
    <section className="w-full bg-[#001529] py-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#fb8500] opacity-[0.03] rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#003366] opacity-[0.05] rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* TITLE SECTION */}
        <div className="text-center space-y-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="text-[#fb8500] font-bold uppercase tracking-[0.3em] text-xs">
              Synergy for Social Impact
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white">
              Our <span className="text-[#fb8500]">Collaborations</span>
            </h2>
            <div className="flex flex-col gap-2">
              <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
                We partner with trusted organizations to amplify our collective impact and reach the last mile.
              </p>
              <p className="text-lg font-hindi text-[#fb8500]/60 italic font-medium">
                "हम सामूहिक प्रभाव को बढ़ाने और अंतिम मील तक पहुँचने के लिए विश्वसनीय संगठनों के साथ साझेदारी करते हैं।"
              </p>
            </div>
          </motion.div>
        </div>

        {/* LOGO SCROLL CONTAINER WITH FADE EDGES */}
        <div className="relative">
          {/* Fading Gradient Overlays */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#001529] to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#001529] to-transparent z-10"></div>

          <div className="bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/5 py-10 px-4">
            <InfiniteLogoScroll />
          </div>
        </div>

      </div>
    </section>
  );
}
