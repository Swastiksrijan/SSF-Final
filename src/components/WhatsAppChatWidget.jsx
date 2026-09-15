import { useEffect, useRef, useState } from "react";
import { FaWhatsapp, FaTimes, FaComments, FaPaperPlane } from "react-icons/fa";

const QUICK_QUESTIONS = [
  "SSF क्या है?",
  "Registration details",
  "SSF के objectives क्या हैं?",
  "Volunteer कैसे बनें?",
  "Member कैसे बनें?",
  "Donation कैसे करें?",
  "CSR partnership",
  "Annual reports कहाँ हैं?",
];

const FAQS = [
  { keys: ["ssf", "संस्था क्या", "संस्था कौन", "what is ssf"], answer: "Swastik Srijan Foundation Samiti एक registered nonprofit संस्था है। Registered office Rewa, Madhya Pradesh में है और registration year 2013 है।" },
  { keys: ["registration", "पंजीयन", "रजिस्ट्रेशन", "05/22/03/11448/13"], answer: "SSF का Registration No. 05/22/03/11448/13 है। Registration Madhya Pradesh Societies Registration Act, 1973 के अंतर्गत है।" },
  { keys: ["objective", "objectives", "उद्देश्य", "क्या काम", "work areas"], answer: "SSF के registered objectives में education, skill development, women & child welfare, health awareness, rural/community development, environment और अन्य सामाजिक विकास से जुड़े कार्य शामिल हैं।" },
  { keys: ["volunteer", "स्वयंसेवक", "volunteering"], answer: "Volunteer बनने के लिए website के Get Involved section से शुरुआत करें। आपकी रुचि और skill के अनुसार team आगे guide करेगी।" },
  { keys: ["member", "membership", "सदस्य", "सदस्यता"], answer: "Member बनने के लिए website के Get Involved/Members section से शुरुआत करें। Current eligibility और process team से confirm करें।" },
  { keys: ["donation", "donate", "दान", "योगदान"], answer: "Donation के लिए website के Donate page का उपयोग करें। Donation और applicable tax-document information के लिए official policy/transparency information देखें।" },
  { keys: ["csr", "corporate", "सीएसआर", "partnership"], answer: "SSF CSR/corporate partnerships के लिए education, skills, women & child welfare, health, rural/community development और अन्य registered objectives से जुड़े opportunities पर चर्चा कर सकता है।" },
  { keys: ["annual report", "annual reports", "वार्षिक रिपोर्ट", "reports"], answer: "SSF की reports और transparency information website के Transparency/Reports section में उपलब्ध कराई जाती है।" },
  { keys: ["contact", "phone", "whatsapp", "संपर्क", "9718346691"], answer: "SSF से WhatsApp पर +91 9718346691 या email: swastiksrijanfoundation@gmail.com के माध्यम से संपर्क कर सकते हैं।" },
];

const BOT_INTRO = "नमस्ते 🙏 Swastik Srijan Foundation में आपका स्वागत है। मैं SSF की उपलब्ध verified जानकारी के आधार पर सहायता कर सकता हूँ।";
const UNKNOWN_REPLY = "इस प्रश्न की verified जानकारी मेरे उपलब्ध SSF records में नहीं है। मैं अनुमान लगाकर गलत जानकारी नहीं दूँगा। कृपया SSF से सीधे संपर्क करें: WhatsApp +91 9718346691 या swastiksrijanfoundation@gmail.com.";

function findAnswer(question) {
  const text = String(question || "").toLowerCase().trim();
  if (!text) return "कृपया अपना सवाल लिखें।";
  const match = FAQS.find((faq) => faq.keys.some((key) => text.includes(key.toLowerCase())));
  return match ? match.answer : UNKNOWN_REPLY;
}

export default function WhatsAppChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: BOT_INTRO }]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (value) => {
    const question = String(value || "").trim();
    if (!question || isTyping) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setIsTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: findAnswer(question) }]);
      setIsTyping(false);
    }, 350);
  };

  const whatsappLink = "https://wa.me/919718346691?text=Namaste%20Swastik%20Srijan%20Foundation%2C%20mujhe%20jankari%20chahiye.";

  return (
    <div className="fixed bottom-24 right-4 md:right-6 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[min(92vw,380px)] rounded-2xl bg-white shadow-2xl border border-zinc-200 overflow-hidden">
          <div className="bg-[#0b3a64] text-white px-4 py-3">
            <p className="text-sm font-bold">Swastik Srijan Foundation Support</p>
            <p className="text-xs text-white/80">Verified information assistant + real team on WhatsApp</p>
          </div>

          <div className="max-h-[330px] overflow-y-auto overscroll-contain p-3 space-y-2 bg-zinc-50" style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}>
            {messages.map((msg, index) => (
              <div key={`${msg.role}-${index}`} className={`max-w-[92%] rounded-xl px-3 py-2 text-xs leading-relaxed ${msg.role === "bot" ? "bg-white border border-zinc-200 text-zinc-700" : "ml-auto bg-[#0b3a64] text-white"}`}>
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
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 py-2 border-t border-zinc-100 bg-white">
            <p className="text-[10px] font-semibold text-zinc-400 mb-1.5">किसी भी सवाल पर सीधे touch करें 👇</p>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {QUICK_QUESTIONS.map((question) => (
                <button key={question} type="button" onClick={() => sendMessage(question)} className="min-h-9 text-[11px] px-2 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 active:scale-[0.98] hover:bg-zinc-100 transition-transform">
                  {question}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input type="text" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage(input)} placeholder="अपना सवाल लिखें..." className="flex-1 h-9 rounded-lg border border-zinc-200 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#0b3a64]/20" />
              <button type="button" onClick={() => sendMessage(input)} className="h-9 w-9 rounded-lg bg-[#0b3a64] text-white flex items-center justify-center hover:brightness-110 transition-all" aria-label="Send message">
                <FaPaperPlane className="text-xs" />
              </button>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-2 py-2 text-[11px] font-bold text-white hover:brightness-95 transition-all">
                <FaWhatsapp /> WhatsApp Chat
              </a>
              <a href="tel:+919718346691" className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-2 py-2 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                Call Now
              </a>
            </div>
          </div>
        </div>
      )}

      <button type="button" onClick={() => setOpen((previous) => !previous)} className="h-14 w-14 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform" aria-label="Open WhatsApp support">
        {open ? <FaTimes className="text-xl" /> : <FaComments className="text-xl" />}
      </button>
    </div>
  );
}
