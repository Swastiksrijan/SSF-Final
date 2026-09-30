import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const SITE_URL = "https://swastiksrijan.in";

const stories = [
  {
    id: 1,
    category: "Health & Safety",
    icon: "🩹",
    title: "घर में First-Aid Kit क्यों जरूरी है?",
    summary: "छोटी चोट या सामान्य आपात स्थिति में जरूरी First-Aid सामान तुरंत उपलब्ध होना उपयोगी हो सकता है।",
    text: [
      "छोटी चोट, कट, हल्की जलन या सामान्य आपात स्थिति में घर की First-Aid Kit तुरंत काम आ सकती है। जरूरी सामान एक साफ और आसानी से पहुंचने वाली जगह पर व्यवस्थित रखें।",
      "Kit में सामान्य उपयोग की पट्टियां, sterile gauze, antiseptic सामग्री, disposable gloves, thermometer और जरूरी basic supplies रखे जा सकते हैं। दवाओं के लिए हमेशा label, dosage और expiry date जांचें तथा बच्चों की पहुंच से दूर रखें।",
      "First-Aid केवल शुरुआती सहायता के लिए है। गंभीर चोट, तेज रक्तस्राव, सांस लेने में परेशानी या अन्य गंभीर स्थिति में तुरंत योग्य चिकित्सा सहायता लें।"
    ]
  },
  {
    id: 2,
    category: "Digital Safety",
    icon: "🔐",
    title: "OTP कभी किसी को क्यों नहीं बताना चाहिए?",
    summary: "OTP आपके खाते या लेन-देन की सुरक्षा में महत्वपूर्ण भूमिका निभाता है। इसे किसी के साथ साझा करना जोखिमपूर्ण हो सकता है।",
    text: [
      "OTP यानी One-Time Password का उपयोग पहचान या किसी लेन-देन की पुष्टि के लिए किया जा सकता है। बैंक, ऐप या सेवा का genuine representative आम तौर पर आपसे OTP बताने के लिए नहीं कहता।",
      "फोन पर कोई व्यक्ति जल्दी करने, डराने या account बंद होने की बात कहकर OTP मांगे तो उसे साझा न करें। अनजान लिंक पर OTP दर्ज करने से भी बचें।",
      "यदि कोई संदिग्ध गतिविधि दिखे तो संबंधित बैंक या सेवा के आधिकारिक customer-care माध्यम से स्वयं संपर्क करें।"
    ]
  },
  {
    id: 3,
    category: "Digital Awareness",
    icon: "💳",
    title: "UPI से भुगतान करते समय किन बातों का ध्यान रखें?",
    summary: "UPI भुगतान आसान है, लेकिन payment request और receiver details को ध्यान से जांचना जरूरी है।",
    text: [
      "UPI से भुगतान करने से पहले प्राप्तकर्ता का नाम और राशि ध्यान से जांचें। केवल पैसे प्राप्त करने के लिए सामान्यतः आपको अपना UPI PIN दर्ज करने की जरूरत नहीं होती।",
      "QR code scan करने पर स्क्रीन पर दिखाई देने वाली payment details को verify करें। किसी अनजान व्यक्ति के कहने पर collect request approve न करें।",
      "UPI PIN, OTP और अन्य confidential details किसी के साथ साझा न करें। संदिग्ध transaction होने पर तुरंत अपने बैंक या संबंधित payment service की official सहायता लें।"
    ]
  },
  {
    id: 4,
    category: "Digital Awareness",
    icon: "📱",
    title: "QR Code scan करने से पहले क्या देखें?",
    summary: "QR code उपयोगी है, लेकिन scan करने से पहले source और दिखाई गई जानकारी को verify करना जरूरी है।",
    text: [
      "QR code आज payments, websites, forms और information sharing में बहुत उपयोग होता है। लेकिन किसी अनजान जगह से मिला QR code बिना जांचे scan करना उचित नहीं है।",
      "Payment के लिए QR scan करने पर receiver का नाम और राशि जरूर देखें। किसी व्यक्ति के कहने पर remote-access app install करना या sensitive information देना अलग जोखिम पैदा कर सकता है।",
      "यदि QR code किसी संदिग्ध message, poster या unknown website से आया है तो पहले उसकी authenticity की पुष्टि करें।"
    ]
  },
  {
    id: 5,
    category: "Digital Safety",
    icon: "🔑",
    title: "मजबूत Password क्यों जरूरी है?",
    summary: "अलग-अलग accounts के लिए मजबूत और अलग passwords रखना digital security का एक महत्वपूर्ण हिस्सा है।",
    text: [
      "एक ही password कई accounts में इस्तेमाल करने से एक account की जानकारी compromise होने पर दूसरे accounts भी जोखिम में पड़ सकते हैं।",
      "जहां संभव हो, लंबे और unique passwords या passphrases रखें और multi-factor authentication चालू करें। Password या verification code किसी के साथ साझा न करें।",
      "Public या shared device पर login करने के बाद logout करना और महत्वपूर्ण accounts में security alerts पर ध्यान देना भी उपयोगी है।"
    ]
  },
  {
    id: 6,
    category: "Education & Skills",
    icon: "🎓",
    title: "Degree और Skill — दोनों क्यों महत्वपूर्ण हैं?",
    summary: "शिक्षा और practical skills अलग-अलग तरह से अवसरों में मदद कर सकते हैं; दोनों का संतुलन उपयोगी हो सकता है।",
    text: [
      "Degree किसी विषय में औपचारिक शिक्षा और qualification को दर्शा सकती है, जबकि skill किसी काम को practically करने की क्षमता को मजबूत करती है। कई क्षेत्रों में दोनों की जरूरत अलग-अलग स्तर पर होती है।",
      "Student और youth को अपनी पढ़ाई के साथ communication, computer, problem-solving, financial awareness या अपने क्षेत्र से जुड़ी practical skills विकसित करने पर भी ध्यान देना चाहिए।",
      "सीखना केवल certificate तक सीमित नहीं होना चाहिए। नियमित अभ्यास, projects और वास्तविक अनुभव skills को मजबूत करने में मदद कर सकते हैं।"
    ]
  }
];

export default function SingleKnowledgeStory() {
  const [openId, setOpenId] = useState(null);

  const share = async (story) => {
    const text = story.text.join(" ");
    const url = `${SITE_URL}/Blog#knowledge-story-${story.id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `SSF | ${story.title}`, text, url });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${story.title}\n\n${text}\n\n${url}`)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const activeStory = stories.find((story) => story.id === openId);

  return (
    <section className="max-w-6xl mx-auto pb-16">
      <div className="text-center mb-8">
        <p className="text-[#fb8500] font-semibold tracking-wide">SSF • KNOWLEDGE & AWARENESS</p>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">आज की उपयोगी जानकारी</h2>
        <p className="text-zinc-300 mt-3 max-w-2xl mx-auto">हर दिन कुछ नया सीखें — छोटी लेकिन उपयोगी जानकारी, जो रोजमर्रा की जिंदगी में काम आ सके।</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <motion.article
            key={story.id}
            id={`knowledge-story-${story.id}`}
            whileHover={{ y: -5 }}
            className="bg-white text-black rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#002344] to-[#fb8500] flex items-center justify-center text-white text-7xl">
              {story.icon}
            </div>
            <div className="p-6">
              <p className="text-sm text-zinc-500 mb-1">{story.category}</p>
              <h3 className="text-xl font-bold mb-2">{story.title}</h3>
              <p className="text-zinc-700 text-sm mb-5">{story.summary}</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setOpenId(story.id)} className="rounded-full bg-[#002344] text-white px-5 py-2.5 font-semibold hover:bg-[#003b70] transition">Story पढ़ें →</button>
                <button type="button" onClick={() => share(story)} className="rounded-full border-2 border-[#fb8500] text-[#002344] px-5 py-2.5 font-semibold hover:bg-[#fb8500] hover:text-white transition">↗ Share Story</button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {activeStory && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white text-black max-w-2xl w-full rounded-2xl p-7 relative max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={() => setOpenId(null)} aria-label="Close story" className="absolute top-4 right-4 bg-zinc-100 rounded-full p-2 hover:bg-zinc-200"><X /></button>
            <p className="text-[#fb8500] font-semibold">SSF • {activeStory.category}</p>
            <h2 className="text-3xl font-bold mt-2 mb-5">{activeStory.title}</h2>
            {activeStory.text.map((paragraph) => (
              <p key={paragraph} className="text-zinc-700 leading-7 mt-4 first:mt-0">{paragraph}</p>
            ))}
            <button type="button" onClick={() => share(activeStory)} className="mt-6 rounded-full bg-[#fb8500] text-white px-6 py-3 font-semibold hover:opacity-90 transition">↗ Share This Story</button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
