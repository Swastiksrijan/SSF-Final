import { useMemo, useState } from "react";
import { FaWhatsapp, FaTimes, FaComments, FaPaperPlane } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import { useLanguage } from "../context/LanguageContext";

const QUICK_QUESTIONS = [
  "How to donate?",
  "CSR partnership details",
  "Volunteer kaise bane?",
  "Certificates / Transparency",
];

const BOT_INTRO =
  "Namaste 🙏 Swastik Srijan Foundation mein aapka swagat hai. Main aapki help ke liye hoon. Aap donation, CSR, volunteer, campaigns, ya kisi bhi query ke liye puch sakte hain.";

function getBotReply(message) {
  const query = message.toLowerCase();

  if (query.includes("donat")) {
    return "Donation ke liye aap Donate page par ja sakte hain. Aapka har yogdaan education, health aur livelihood projects mein direct impact banata hai. Agar chahen to main aapko WhatsApp par donor assistance se connect kar sakta hoon.";
  }

  if (query.includes("csr") || query.includes("corporate")) {
    return "CSR partnerships ke liye hum education, skilling, women empowerment aur rural development projects par kaam karte hain. Aap CSR Partnership page dekh sakte hain ya direct WhatsApp par project deck mang sakte hain.";
  }

  if (query.includes("volunteer") || query.includes("intern")) {
    return "Volunteer/Internship ke liye Get Involved section open karein. Team aapse profile aur interest ke basis par connect karegi. Aap WhatsApp par bhi details bhej sakte hain.";
  }

  if (query.includes("certificate") || query.includes("transparency") || query.includes("trust")) {
    return "Transparency aur trust hamari priority hai. Aap Transparency page aur registration details check kar sakte hain. Zarurat ho to hum WhatsApp par official documents share kar denge.";
  }

  if (query.includes("contact") || query.includes("phone") || query.includes("call")) {
    return "Aap direct call kar sakte hain: +91 9718346691. Ya niche WhatsApp button se instantly connect ho jaiye.";
  }

  return "Bahut accha sawal hai. Iska best personalized jawab hamari team WhatsApp par turant degi. Niche 'Start WhatsApp Chat' par click karein — hum real support denge.";
}

export default function WhatsAppChatWidget() {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "bot", text: BOT_INTRO }]);
  const [isTyping, setIsTyping] = useState(false);

  const whatsappLink = useMemo(() => {
    const message = encodeURIComponent(
      "Namaste Swastik Srijan Foundation team, mujhe donation/CSR/volunteer ke baare mein jankari chahiye."
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
            <p className="text-xs text-white/80">Auto-reply assistant + real team on WhatsApp</p>
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
