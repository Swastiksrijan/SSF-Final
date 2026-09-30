import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, X } from "lucide-react";

const KNOWLEDGE_STORIES = [
  {
    id: 122,
    title: "घर में Fire Safety क्यों जरूरी है?",
    hi: "छोटी सावधानी और सही तैयारी जोखिम कम कर सकती है",
    image: "/images/real/office_banner.jpg",
    text: "बिजली के तार, गैस और अन्य आग के स्रोतों के आसपास सावधानी रखें। घर में emergency exit और जरूरी फोन नंबर की जानकारी रखें। आग लगने की स्थिति में घबराने के बजाय सुरक्षित स्थान पर जाएं और स्थानीय emergency services की मदद लें।"
  },
  {
    id: 123,
    title: "मोबाइल Battery को सुरक्षित कैसे रखें?",
    hi: "खराब charger और गर्म होती battery को नजरअंदाज न करें",
    image: "/images/real/news_media_1.jpg",
    text: "क्षतिग्रस्त cable या charger का उपयोग न करें और असामान्य रूप से गर्म होने वाली battery को नजरअंदाज न करें। फोन को तेज गर्मी से दूर रखें और charging के लिए manufacturer की सुरक्षित accessories व instructions का पालन करें।"
  },
  {
    id: 124,
    title: "जरूरी Documents की Digital Copy क्यों रखें?",
    hi: "जरूरत के समय महत्वपूर्ण जानकारी आसानी से उपलब्ध रहे",
    image: "/images/uploads/learning-hub-2.jpg",
    text: "पहचान और अन्य महत्वपूर्ण दस्तावेजों की सुरक्षित digital copy जरूरत के समय उपयोगी हो सकती है। इन्हें सुरक्षित storage में रखें, मजबूत password और two-factor authentication का उपयोग करें और संवेदनशील documents अनजान लोगों से साझा न करें।"
  },
  {
    id: 125,
    title: "बारिश के मौसम में घर को कैसे सुरक्षित रखें?",
    hi: "पानी का रिसाव, बिजली और फिसलन पर समय रहते ध्यान दें",
    image: "/images/agriculture.png",
    text: "बारिश के दौरान घर में पानी के रिसाव, फिसलन और बिजली से जुड़े जोखिमों पर ध्यान दें। गीले हाथों से electrical switches न छुएं, खराब wiring को नजरअंदाज न करें और जरूरत होने पर qualified electrician की मदद लें।"
  },
  {
    id: 126,
    title: "Emergency Contacts फोन में क्यों जरूरी हैं?",
    hi: "आपात स्थिति में सही व्यक्ति तक जल्दी पहुंचना आसान हो सकता है",
    image: "/images/protection-ecosystem.png",
    text: "परिवार, स्थानीय emergency services और भरोसेमंद संपर्कों के नंबर फोन में पहले से सुरक्षित रखें। जरूरत पड़ने पर फोन लॉक होने की स्थिति के लिए emergency information feature उपलब्ध हो तो उसे भी सही तरीके से सेट करें।"
  }
];

async function shareStory(story) {
  const url = `${window.location.origin}/Blog#knowledge-${story.id}`;
  const text = `SSF | ${story.title}\n${story.hi}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: story.title, text, url });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`, "_blank", "noopener,noreferrer");
}

export default function BlogKnowledgeStories({ children }) {
  const [active, setActive] = useState(null);

  return (
    <>
      {children}
      <section className="bg-gradient-to-b from-zinc-50 to-white py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#fb8500]">Knowledge & Awareness</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-serif font-bold text-[#002344]">5 नई जानकारी वाली Stories</h2>
            <p className="mt-4 text-zinc-600 max-w-3xl mx-auto">रोजमर्रा की जिंदगी, सुरक्षा और आपातकालीन तैयारी से जुड़ी उपयोगी जानकारी।</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {KNOWLEDGE_STORIES.map((story) => (
              <motion.article key={story.id} whileHover={{ y: -5 }} className="overflow-hidden rounded-2xl bg-white text-black shadow-lg border border-zinc-200">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-[#fb8500] mb-2">SSF • KNOWLEDGE STORY</p>
                  <h3 className="text-xl font-bold text-[#002344]">{story.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-zinc-400">{story.hi}</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{story.text}</p>
                  <div className="mt-5 flex gap-2 flex-wrap">
                    <button onClick={() => setActive(story)} className="rounded-full bg-[#002344] px-5 py-2.5 text-sm font-bold text-white">पूरी जानकारी →</button>
                    <button onClick={() => shareStory(story)} className="inline-flex items-center gap-2 rounded-full border-2 border-[#fb8500] px-4 py-2 text-sm font-bold text-[#002344] hover:bg-[#fb8500] hover:text-white"><Share2 size={16} /> Share</button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {active && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center px-4" onClick={() => setActive(null)}>
          <motion.div initial={{ scale: .92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="bg-white text-black max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            <div className="relative aspect-[16/9]">
              <img src={active.image} alt={active.title} className="w-full h-full object-cover" />
              <button onClick={() => setActive(null)} className="absolute top-4 right-4 rounded-full bg-white p-2 shadow-lg"><X size={20} /></button>
            </div>
            <div className="p-7">
              <p className="text-xs font-bold text-[#fb8500] uppercase tracking-wider">SSF Knowledge & Awareness</p>
              <h2 className="mt-2 text-3xl font-bold text-[#002344]">{active.title}</h2>
              <p className="mt-1 font-semibold text-zinc-400">{active.hi}</p>
              <p className="mt-6 leading-8 text-zinc-700">{active.text}</p>
              <button onClick={() => shareStory(active)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#fb8500] px-6 py-3 font-bold text-white"><Share2 size={18} /> Share Story</button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
