import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const SITE_URL = "https://swastiksrijan.in";

export default function SingleKnowledgeStory() {
  const [open, setOpen] = useState(false);

  const share = async () => {
    const title = "घर में First-Aid Kit क्यों जरूरी है?";
    const text = "छोटी चोट या सामान्य आपात स्थिति में घर की First-Aid Kit तुरंत काम आ सकती है। जरूरी सामान साफ, व्यवस्थित और आसानी से उपलब्ध रखें। दवाओं के लिए expiry date और label जरूर जांचें। गंभीर स्थिति में तुरंत योग्य चिकित्सा सहायता लें।";
    const url = `${SITE_URL}/Blog#knowledge-story-1`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `SSF | ${title}`, text, url });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n\n${text}\n\n${url}`)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="knowledge-story-1" className="max-w-6xl mx-auto pb-16">
      <div className="text-center mb-8">
        <p className="text-[#fb8500] font-semibold tracking-wide">SSF • KNOWLEDGE & AWARENESS</p>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">आज की उपयोगी जानकारी</h2>
      </div>

      <motion.article whileHover={{ y: -5 }} className="bg-white text-black rounded-2xl overflow-hidden shadow-xl max-w-md mx-auto">
        <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#002344] to-[#fb8500] flex items-center justify-center text-white text-7xl">
          🩹
        </div>
        <div className="p-6">
          <p className="text-sm text-zinc-500 mb-1">Health & Safety</p>
          <h3 className="text-xl font-bold mb-2">घर में First-Aid Kit क्यों जरूरी है?</h3>
          <p className="text-zinc-700 text-sm mb-5">छोटी चोट या सामान्य आपात स्थिति में जरूरी First-Aid सामान तुरंत उपलब्ध होना उपयोगी हो सकता है।</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setOpen(true)} className="rounded-full bg-[#002344] text-white px-5 py-2.5 font-semibold hover:bg-[#003b70] transition">Story पढ़ें →</button>
            <button type="button" onClick={share} className="rounded-full border-2 border-[#fb8500] text-[#002344] px-5 py-2.5 font-semibold hover:bg-[#fb8500] hover:text-white transition">↗ Share Story</button>
          </div>
        </div>
      </motion.article>

      {open && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white text-black max-w-2xl w-full rounded-2xl p-7 relative max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close story" className="absolute top-4 right-4 bg-zinc-100 rounded-full p-2 hover:bg-zinc-200"><X /></button>
            <p className="text-[#fb8500] font-semibold">SSF • Health & Safety</p>
            <h2 className="text-3xl font-bold mt-2 mb-5">घर में First-Aid Kit क्यों जरूरी है?</h2>
            <p className="text-zinc-700 leading-7">छोटी चोट, कट, हल्की जलन या सामान्य आपात स्थिति में घर की First-Aid Kit तुरंत काम आ सकती है। जरूरी सामान एक साफ और आसानी से पहुंचने वाली जगह पर व्यवस्थित रखें।</p>
            <p className="text-zinc-700 leading-7 mt-4">Kit में सामान्य उपयोग की पट्टियां, sterile gauze, antiseptic सामग्री, disposable gloves, thermometer और जरूरी basic supplies रखे जा सकते हैं। दवाओं के लिए हमेशा label, dosage और expiry date जांचें तथा बच्चों की पहुंच से दूर रखें।</p>
            <p className="text-zinc-700 leading-7 mt-4">First-Aid केवल शुरुआती सहायता के लिए है। गंभीर चोट, तेज रक्तस्राव, सांस लेने में परेशानी या अन्य गंभीर स्थिति में तुरंत योग्य चिकित्सा सहायता लें।</p>
            <button type="button" onClick={share} className="mt-6 rounded-full bg-[#fb8500] text-white px-6 py-3 font-semibold hover:opacity-90 transition">↗ Share This Story</button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
