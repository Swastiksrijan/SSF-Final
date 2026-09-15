import { useEffect, useRef, useState } from "react";
import { FaComments, FaTimes, FaWhatsapp, FaArrowRight, FaPaperPlane, FaPhoneAlt } from "react-icons/fa";

const CATEGORIES = [
  ["🏢", "संस्था के बारे में", "SSF क्या है?"],
  ["🤝", "Join / Volunteer", "Volunteer कैसे बनें?"],
  ["💰", "Donation", "Donation कैसे करें?"],
  ["📄", "Registration", "Registration details"],
  ["🎓", "Education & Skills", "SSF के objectives क्या हैं?"],
  ["❤️", "Health & Social Work", "SSF के objectives क्या हैं?"],
  ["🤝", "CSR / Partnership", "CSR partnership"],
  ["📊", "Reports / Transparency", "Annual reports कहाँ हैं?"],
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

const INTRO = "नमस्ते 🙏 SSF में आपका स्वागत है। विषय चुनें या अपना सवाल लिखें। मैं उपलब्ध verified SSF जानकारी के आधार पर सहायता करूँगा।";
const UNKNOWN = "इस प्रश्न की verified जानकारी मेरे उपलब्ध SSF records में नहीं है। मैं अनुमान लगाकर गलत जानकारी नहीं दूँगा। कृपया SSF Team से सीधे संपर्क करें।";

function answerFor(question) {
  const text = String(question || "").toLowerCase().trim();
  if (!text) return "कृपया अपना सवाल लिखें।";
  const match = FAQS.find((faq) => faq.keys.some((key) => text.includes(key.toLowerCase())));
  return match ? match.answer : UNKNOWN;
}

export default function SSFSupportChatPro() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: INTRO }]);
  const panelRef = useRef(null);
  const launcherRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) panelRef.current?.querySelector("button, input")?.focus();
    else launcherRef.current?.focus();
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, typing]);

  const send = (value) => {
    const question = String(value || "").trim();
    if (!question || typing) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: answerFor(question) }]);
      setTyping(false);
    }, 280);
  };

  const whatsappLink = "https://wa.me/919718346691?text=Namaste%20Swastik%20Srijan%20Foundation%20team%2C%20mujhe%20SSF%20ke%20baare%20mein%20jankari%20chahiye.";

  return (
    <div className="fixed bottom-5 right-4 md:right-6 z-[70] flex flex-col items-end gap-3" onKeyDown={(event) => event.key === "Escape" && open && setOpen(false)}>
      {open && (
        <section ref={panelRef} role="dialog" aria-label="SSF Support Assistant" className="w-[min(92vw,390px)] overflow-hidden rounded-3xl border border-white/20 bg-[#061d33]/95 p-3 shadow-2xl backdrop-blur-xl">
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold">SSF Assistant</p>
                <p className="mt-0.5 text-[10px] text-emerald-300">● Ready to help • Verified information</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close SSF Assistant">
                <FaTimes />
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-white/75">विषय चुनें — या नीचे अपना सवाल लिखें।</p>
          </div>

          <div className="mt-2 max-h-[250px] overflow-y-auto rounded-2xl bg-white/[0.06] p-2" aria-live="polite">
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`max-w-[92%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${message.role === "bot" ? "bg-white text-zinc-700" : "ml-auto bg-[#0b6b4f] text-white"}`}>
                  {message.text}
                </div>
              ))}
              {typing && <div className="inline-flex rounded-2xl bg-white px-3 py-2 text-[11px] text-zinc-500">SSF Assistant लिख रहा है…</div>}
              <div ref={endRef} />
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            {CATEGORIES.map(([icon, label, question]) => (
              <button key={label} type="button" onClick={() => send(question)} className="group min-h-[58px] rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2 text-left text-white transition-all hover:bg-white/[0.14] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#FFB347]">
                <span className="text-lg">{icon}</span>
                <span className="mt-1 flex items-center justify-between gap-1 text-[11px] font-semibold leading-tight"><span>{label}</span><FaArrowRight className="shrink-0 text-[9px] text-[#FFB347]" /></span>
              </button>
            ))}
          </div>

          <div className="mt-2 flex gap-2">
            <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send(input)} placeholder="अपना सवाल लिखें…" aria-label="Ask SSF a question" className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-white px-3 py-2.5 text-xs text-zinc-800 outline-none focus:ring-2 focus:ring-[#FFB347]" />
            <button type="button" onClick={() => send(input)} aria-label="Send question" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFB347] text-[#061d33] hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-white"><FaPaperPlane className="text-xs" /></button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-3 py-2.5 text-[11px] font-bold text-white"><FaWhatsapp /> SSF Team</a>
            <a href="tel:+919718346691" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-[11px] font-bold text-[#061d33]"><FaPhoneAlt /> Call Now</a>
          </div>
        </section>
      )}

      <button ref={launcherRef} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="ssf-support-panel" aria-label={open ? "Close SSF Assistant" : "Open SSF Assistant"} className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl ring-4 ring-white/80 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#FFB347]">
        {open ? <FaTimes className="text-xl" /> : <FaComments className="text-xl" />}
        {!open && <span className="pointer-events-none absolute bottom-[58px] right-0 hidden whitespace-nowrap rounded-full bg-[#061d33] px-3 py-1.5 text-[10px] font-bold text-white shadow-lg md:block">SSF से पूछें</span>}
      </button>
    </div>
  );
}
