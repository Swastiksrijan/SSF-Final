import { useMemo, useState } from "react";
import { FaWhatsapp, FaTimes, FaComments, FaPaperPlane } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import { useLanguage } from "../context/LanguageContext";

const QUICK_QUESTIONS = [
  "SSF क्या है?",
  "Registration details",
  "Volunteer कैसे बनें?",
  "Donation कैसे करें?",
  "CSR partnership",
  "Transparency / Reports",
];

const BOT_INTRO =
  "नमस्ते 🙏 Swastik Srijan Foundation में आपका स्वागत है। मैं SSF की उपलब्ध verified जानकारी के आधार पर सहायता कर सकता हूँ। जानकारी उपलब्ध न होने पर मैं अनुमान नहीं लगाऊँगा।";

const UNKNOWN_REPLY =
  "इस प्रश्न की verified जानकारी मेरे उपलब्ध SSF records में नहीं है। कृपया SSF से सीधे संपर्क करें: WhatsApp +91 9718346691 या swastiksrijanfoundation@gmail.com. आप चाहें तो नीचे WhatsApp Chat से टीम से जुड़ सकते हैं।";

function getBotReply(message) {
  const query = message.toLowerCase().trim();
  const hasAny = (...terms) => terms.some((term) => query.includes(term));

  if (hasAny("ssf क्या", "ssf kya", "what is ssf", "swastik srijan foundation kya", "संस्था क्या")) {
    return "Swastik Srijan Foundation Samiti एक registered nonprofit संस्था है, जिसका registered office Rewa, Madhya Pradesh में है। संस्था की स्थापना/registration 2013 में हुई और इसका कार्यक्षेत्र India है।";
  }

  if (hasAny("registration", "रजिस्ट्रेशन", "पंजीयन", "reg no", "registration number")) {
    return "SSF का Registration No. 05/22/03/11448/13 है। Registration Act: Madhya Pradesh Societies Registration Act, 1973. Registered office: Rewa, Madhya Pradesh. Official details Transparency page पर उपलब्ध हैं।";
  }

  if (hasAny("office", "address", "पता", "कार्यालय", "rewa")) {
    return "SSF का registered office Rewa, Madhya Pradesh में है। उपलब्ध contact के लिए +91 9718346691 या swastiksrijanfoundation@gmail.com पर संपर्क करें।";
  }

  if (hasAny("objective", "objectives", "उद्देश्य", "काम क्या", "work areas", "कार्य क्षेत्र")) {
    return "SSF के registered objectives में education, skill development, women & child welfare, health awareness, youth/community development, rural development, environment और अन्य सामाजिक विकास से जुड़े कार्य शामिल हैं। किसी specific programme की current availability के लिए टीम से पुष्टि करें।";
  }

  if (hasAny("donat", "donation", "दान", "योगदान")) {
    return "Donation के लिए website के Donate page का उपयोग करें। Donation/refund और applicable tax-document information के लिए Donation & Refund Policy तथा Transparency page देखें। किसी भी tax benefit को automatic या guaranteed न मानें; eligibility applicable rules और donor conditions पर निर्भर करती है।";
  }

  if (hasAny("csr", "corporate", "company", "सीएसआर")) {
    return "SSF CSR और institutional partnerships के लिए education, skill development, women & child welfare, community/rural development, health awareness और अन्य registered objectives से जुड़े opportunities पर चर्चा कर सकता है। Partnership के लिए Get Involved/Partner section या WhatsApp team से current requirement confirm करें।";
  }

  if (hasAny("volunteer", "intern", "internship", "स्वयंसेवक", "इंटर्न")) {
    return "Volunteer/Internship के लिए website के Get Involved section से शुरुआत करें। Volunteer, Member, Student/Youth, Intern, Trainer/Mentor, Skill-based Volunteer, Institution/NGO/Community Partner और CSR/Corporate जैसे engagement options उपलब्ध हैं। अंतिम role/availability team से confirm होती है।";
  }

  if (hasAny("member", "membership", "सदस्य", "मेंबर")) {
    return "SSF में जुड़ने के लिए Get Involved/Members section देखें। Membership की current process, eligibility या applicable fee जैसी specific जानकारी के लिए team से पुष्टि करें; assistant अनुमान नहीं लगाएगा।";
  }

  if (hasAny("learning hub", "learninghub", "computer", "digital literacy", "शिक्षा", "learning")) {
    return "SSF Learning HUB से जुड़े focus areas में digital literacy, computer learning, academic support, youth learning, online/community learning और guidance शामिल हैं। किसी centre की current opening, timing या admission की जानकारी team से verify करें।";
  }

  if (hasAny("skill", "silai", "sewing", "vocational", "livelihood", "कौशल")) {
    return "SSF के skill-development focus में sewing, computer/digital skills, vocational learning, self-employment, women-focused skills, livelihood support और trainer/mentor participation जैसे areas शामिल हैं। Current batch/admission की पुष्टि team से करें।";
  }

  if (hasAny("health", "medical", "dental", "स्वास्थ्य", "चिकित्सा")) {
    return "SSF के registered objectives में health awareness और community wellbeing से जुड़े कार्य शामिल हैं। किसी specific health camp, dental camp, date, location या service availability के बारे में मैं अनुमान नहीं लगाऊँगा—कृपया team से current confirmation लें।";
  }

  if (hasAny("transparency", "report", "annual report", "certificate", "compliance", "पारदर्शिता", "वार्षिक रिपोर्ट")) {
    return "SSF की Transparency page पर registration/compliance documents और available annual reports दिए गए हैं। किसी document की validity/status के लिए official document और current SSF records को प्राथमिकता दें।";
  }

  if (hasAny("website", "site", "वेबसाइट")) {
    return "SSF की official website: https://swastiksrijan.in/";
  }

  if (hasAny("contact", "phone", "call", "whatsapp", "mobile", "संपर्क", "फोन")) {
    return "SSF से संपर्क: WhatsApp/Phone +91 9718346691 और email swastiksrijanfoundation@gmail.com. Registered office Rewa, Madhya Pradesh में है।";
  }

  return UNKNOWN_REPLY;
}

export default function WhatsAppChatWidget() {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "bot", text: BOT_INTRO }]);
  const [isTyping, setIsTyping] = useState(false);

  const whatsappLink = useMemo(() => {
    const message = encodeURIComponent(
      "Namaste Swastik Srijan Foundation team, mujhe SSF ke baare mein jankari chahiye."
    );
    return `${CONTACT_INFO.social.whatsapp}?text=${message}`;
  }, []);

  const sendMessage = (rawMessage) => {
    const message = rawMessage.trim();
    if (!message || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: getBotReply(message) }]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-24 right-4 md:right-6 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[min(92vw,360px)] rounded-2xl bg-white shadow-2xl border border-zinc-200 overflow-hidden">
          <div className="bg-[#0b3a64] text-white px-4 py-3">
            <p className="text-sm font-bold">Swastik Srijan Foundation Support</p>
            <p className="text-xs text-white/80">Verified information assistant + real team on WhatsApp</p>
          </div>

          <div className="max-h-[310px] overflow-y-auto p-3 space-y-2 bg-zinc-50">
            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}`}
                className={`max-w-[92%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  msg.role === "bot"
                    ? "bg-white border border-zinc-200 text-zinc-700"
                    : "ml-auto bg-[#0b3a64] text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="inline-flex items-center gap-1 rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse [animation-delay:100ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse [animation-delay:200ms]" />
              </div>
            )}
          </div>

          <div className="px-3 py-2 border-t border-zinc-100 bg-white">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder={lang === "en" ? "Type your question..." : "अपना सवाल लिखें..."}
                className="flex-1 h-9 rounded-lg border border-zinc-200 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#0b3a64]/20"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                className="h-9 w-9 rounded-lg bg-[#0b3a64] text-white flex items-center justify-center hover:brightness-110 transition-all"
                aria-label="Send message"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-2 py-2 text-[11px] font-bold text-white hover:brightness-95 transition-all"
              >
                <FaWhatsapp /> {lang === "en" ? "Start WhatsApp Chat" : "व्हाट्सऐप चैट शुरू करें"}
              </a>
              <a
                href="tel:+919718346691"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-2 py-2 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                {lang === "en" ? "Call Now" : "अभी कॉल करें"}
              </a>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-14 w-14 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Open WhatsApp support"
      >
        {open ? <FaTimes className="text-xl" /> : <FaComments className="text-xl" />}
      </button>
    </div>
  );
}
