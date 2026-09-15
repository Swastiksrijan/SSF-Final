import { useEffect, useRef, useState } from "react";
import { FaComments, FaTimes, FaWhatsapp, FaArrowRight, FaPaperPlane, FaPhoneAlt, FaExternalLinkAlt } from "react-icons/fa";

const WHATSAPP = "https://wa.me/919718346691?text=Namaste%20Swastik%20Srijan%20Foundation%20team%2C%20mujhe%20SSF%20ke%20baare%20mein%20jankari%20chahiye.";
const WEBSITE = "https://swastiksrijan.in/";
const DONATE = "https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view";

const GROUPS = [
  { title: "ℹ️ संस्था एवं जानकारी", items: [["🏢", "संस्था के बारे में"], ["📜", "इतिहास / स्थापना"], ["📋", "Registration Details"], ["🎯", "संस्था के Objectives"], ["🇮🇳", "कार्य क्षेत्र — All India"], ["🌐", "Website"]] },
  { title: "🤝 Join / Connect", items: [["🤝", "Volunteer कैसे बनें?"], ["👥", "Member कैसे बनें?"], ["🎓", "Internship / Student"], ["🧑‍🏫", "Trainer / Mentor"], ["💻", "Skill-Based Volunteering"], ["📣", "Campaign / Awareness Volunteer"]] },
  { title: "🏢 Partnership", items: [["🏢", "CSR / Corporate"], ["🏫", "College / University"], ["🏛️", "Institution Partnership"], ["🤲", "NGO / Community Partner"]] },
  { title: "❤️ सेवा एवं सहयोग", items: [["🎓", "Education"], ["💻", "Computer / Digital"], ["🧵", "Skill Development"], ["👩", "Women Empowerment"], ["👶", "Child Welfare"], ["❤️", "Health"], ["🌳", "Environment"], ["🌾", "Rural Development"], ["⚖️", "Social Justice"], ["♿", "Disability / Rehabilitation"], ["🐄", "Animal Protection"], ["🎭", "Culture / Awareness"]] },
  { title: "💰 Support & Trust", items: [["💰", "Donor / Donation"], ["📊", "Reports / Transparency"], ["📸", "Our Activities"], ["📞", "Contact SSF Team"]] },
];

const ANSWERS = {
  "संस्था के बारे में": "Swastik Srijan Foundation Samiti एक registered nonprofit संस्था है। Registered office Rewa, Madhya Pradesh में है और registration year 2013 है।",
  "इतिहास / स्थापना": "Swastik Srijan Foundation Samiti का registration year 2013 है। संस्था का registered office Rewa, Madhya Pradesh में है।",
  "Registration Details": "SSF का Registration No. 05/22/03/11448/13 है। Registration Madhya Pradesh Societies Registration Act, 1973 के अंतर्गत है।",
  "संस्था के Objectives": "Registered objectives में education, skill development, women & child welfare, health, environment, agriculture & rural development, social justice, disability & rehabilitation, animal protection तथा cultural/social development के क्षेत्र शामिल हैं।",
  "कार्य क्षेत्र — All India": "Swastik Srijan Foundation Samiti का कार्यक्षेत्र All India है। संस्था अपने registered objectives के अनुसार भारत के विभिन्न राज्यों और क्षेत्रों में आवश्यकता, उपलब्ध संसाधनों और सहयोग के आधार पर सामाजिक विकास से जुड़े कार्य कर सकती है।",
  "Website": "SSF की official website: https://swastiksrijan.in/",
  "कार्य क्षेत्र / Website": "Swastik Srijan Foundation Samiti का कार्यक्षेत्र All India है। Official website: https://swastiksrijan.in/",
  "Volunteer कैसे बनें?": "Volunteer के रूप में जुड़ने के लिए अपनी रुचि, location और skills के अनुसार Join/Get Involved section से interest submit करें। WhatsApp +91 9718346691 पर भी संपर्क कर सकते हैं।",
  "Member कैसे बनें?": "Member बनने के लिए membership interest submit करें। Eligibility और उपलब्ध membership process के अनुसार team आगे guide करेगी। WhatsApp +91 9718346691 पर संपर्क किया जा सकता है।",
  "Internship / Student": "Students और youth उपलब्ध internship, learning और volunteering opportunities के लिए अपना interest submit कर सकते हैं। Opportunity के अनुसार team आगे जानकारी देगी।",
  "Trainer / Mentor": "Teaching, technical, professional या किसी अन्य क्षेत्र की skill रखने वाले लोग Trainer/Mentor के रूप में SSF के साथ सहयोग का interest दे सकते हैं।",
  "Skill-Based Volunteering": "Computer, teaching, design, communication, training, management जैसी professional या practical skills के माध्यम से SSF को volunteer support दिया जा सकता है।",
  "Campaign / Awareness Volunteer": "Awareness campaigns और social initiatives में volunteer के रूप में जुड़ने के लिए अपना interest submit करें। उपलब्ध campaign और आवश्यकता के अनुसार team guide करेगी।",
  "CSR / Corporate": "Companies और CSR teams education, skills, women & child welfare, health, environment, rural/community development और अन्य registered objectives से जुड़े initiatives में partnership पर चर्चा कर सकती हैं।",
  "College / University": "Colleges और universities education, internship, youth volunteering, awareness और community initiatives में SSF के साथ collaboration कर सकते हैं।",
  "Institution Partnership": "Schools, colleges और अन्य institutions SSF के education, skill, awareness और community development initiatives के लिए partnership/collaboration हेतु team से संपर्क कर सकते हैं।",
  "NGO / Community Partner": "अन्य NGOs और community groups संयुक्त awareness, education, skill, relief या community initiatives के लिए SSF के साथ collaboration proposal रख सकते हैं।",
  "Education": "Education objectives में primary, secondary और higher secondary education, college, computer education, nursing, technical education, competitive exam coaching, library और science fairs जैसे क्षेत्र शामिल हैं।",
  "Computer / Digital": "Computer education और digital learning SSF के objectives में शामिल हैं। उपलब्ध resources और support के अनुसार training या digital initiatives चलाए जा सकते हैं।",
  "Skill Development": "Skill development में computer training, सिलाई-कढ़ाई, स्वरोजगार, vocational training, rural industry तथा खादी एवं ग्रामोद्योग जैसे क्षेत्र शामिल हैं।",
  "Women Empowerment": "Women & Child Development में महिला सशक्तिकरण, बालिका शिक्षा, विधवा सहायता, SHG, पोषण और संबंधित सामाजिक सहायता के क्षेत्र शामिल हैं।",
  "Child Welfare": "Child welfare में बालिका शिक्षा, बालवाड़ी, पोषण कार्यक्रम और बच्चों की सुरक्षा एवं विकास से जुड़े कार्य objectives में शामिल हैं।",
  "Health": "Health-related objectives में AIDS और cancer awareness, malnutrition, naturopathy, yoga, family welfare, de-addiction और rehabilitation जैसे क्षेत्र शामिल हैं।",
  "Environment": "Environment के अंतर्गत वृक्षारोपण, biodiversity, forest conservation, natural resources, medicinal plants, organic farming और renewable/natural energy से जुड़े कार्य किए जा सकते हैं।",
  "Rural Development": "Agriculture & Rural Development में organic farming, farmer training, पशुपालन, गौ संरक्षण, ग्रामीण विकास और livelihood जैसे क्षेत्र शामिल हैं।",
  "Social Justice": "Social awareness में भ्रष्टाचार जागरूकता, नैतिक शिक्षा, राष्ट्रीय एकता, सांप्रदायिक सद्भाव और मानव अधिकार जैसे विषयों पर काम किया जा सकता है।",
  "Disability / Rehabilitation": "Disability & Rehabilitation में दिव्यांग सहायता, पुनर्वास, वृद्धजन सहायता और जरूरतमंद बच्चों/व्यक्तियों से जुड़े support के क्षेत्र शामिल हैं।",
  "Animal Protection": "Animal Protection में पशु-पक्षी संरक्षण, गौ संरक्षण/गौशाला और wildlife conservation जैसे क्षेत्र शामिल हैं।",
  "Culture / Awareness": "Religious & Cultural objectives में भजन, संस्कृत शिक्षा, संगीत, सम्मेलन और सांस्कृतिक कार्यक्रम जैसे क्षेत्र शामिल हैं।",
  "Donor / Donation": "आप SSF को donor/supporter के रूप में सहयोग कर सकते हैं। Donation के लिए Donate Now का उपयोग करें या WhatsApp +91 9718346691 पर संपर्क करें।",
  "Reports / Transparency": "SSF की reports और transparency information website के Reports/Transparency section में उपलब्ध कराई जाती है।",
  "Our Activities": "SSF की activities, photographs और service highlights website के Media/Activities sections में देखे जा सकते हैं।",
  "Contact SSF Team": "SSF से WhatsApp +91 9718346691 या email swastiksrijanfoundation@gmail.com के माध्यम से संपर्क कर सकते हैं।",
};

const QUICK_ACTIONS = [["🤝", "मैं जुड़ना चाहता हूँ", "Volunteer कैसे बनें?"], ["💰", "मैं सहयोग करना चाहता हूँ", "Donor / Donation"], ["🏢", "Partnership करना है", "CSR / Corporate"], ["ℹ️", "SSF के बारे में जानना है", "संस्था के बारे में"]];
const INTRO = "नमस्ते 🙏 मैं SSF Assistant हूँ। आप क्या करना चाहते हैं? नीचे विकल्प चुनें या अपना सवाल सीधे लिखें।";
const UNKNOWN = "इस प्रश्न की verified जानकारी मेरे उपलब्ध SSF records में नहीं है। मैं अनुमान लगाकर गलत जानकारी नहीं दूँगा। कृपया SSF Team से संपर्क करें।";

const answerFor = (question) => {
  const text = String(question || "").toLowerCase().trim();
  if (!text) return "कृपया अपना सवाल लिखें।";
  const direct = Object.keys(ANSWERS).find((key) => text === key.toLowerCase());
  if (direct) return ANSWERS[direct];
  const rules = [
    [["registration", "पंजीयन", "रजिस्ट्रेशन"], "Registration Details"], [["objective", "objectives", "उद्देश्य"], "संस्था के Objectives"],
    [["all india", "all-india", "india level", "भारत स्तर", "पूरे भारत", "सम्पूर्ण भारत", "देशभर", "देश भर", "अखिल भारतीय", "कार्य क्षेत्र", "कार्य क्षेत्र क्या है", "work area", "कहां काम", "कहाँ काम"], "कार्य क्षेत्र — All India"],
    [["website", "वेबसाइट", "official site", "swastiksrijan.in"], "Website"],
    [["volunteer", "स्वयंसेवक"], "Volunteer कैसे बनें?"], [["member", "membership", "सदस्य", "सदस्यता"], "Member कैसे बनें?"],
    [["internship", "intern", "student", "छात्र"], "Internship / Student"], [["trainer", "mentor"], "Trainer / Mentor"],
    [["skill", "कौशल", "सिलाई", "स्वरोजगार"], "Skill Development"], [["campaign", "awareness volunteer"], "Campaign / Awareness Volunteer"],
    [["csr", "corporate", "company"], "CSR / Corporate"], [["college", "university"], "College / University"], [["institution", "संस्थान"], "Institution Partnership"],
    [["ngo", "community partner"], "NGO / Community Partner"], [["education", "शिक्षा", "school", "पढ़ाई"], "Education"],
    [["computer", "digital", "कंप्यूटर", "डिजिटल"], "Computer / Digital"], [["women", "महिला", "नारी"], "Women Empowerment"],
    [["child", "बच्चे", "बाल", "बालिका"], "Child Welfare"], [["health", "स्वास्थ्य", "aids", "cancer", "yoga", "नशा"], "Health"],
    [["environment", "पर्यावरण", "tree", "वृक्ष"], "Environment"], [["rural", "ग्रामीण", "agriculture", "कृषि", "किसान"], "Rural Development"],
    [["social justice", "सामाजिक न्याय", "मानव अधिकार"], "Social Justice"], [["disability", "दिव्यांग", "rehabilitation", "पुनर्वास"], "Disability / Rehabilitation"],
    [["animal", "पशु", "गौ", "wildlife"], "Animal Protection"], [["culture", "सांस्कृतिक", "धार्मिक", "संस्कृति"], "Culture / Awareness"],
    [["donation", "donate", "दान", "योगदान", "support", "सहयोग"], "Donor / Donation"], [["report", "reports", "transparency", "ऑडिट"], "Reports / Transparency"],
    [["activity", "activities", "गतिविधि", "photos", "फोटो", "media"], "Our Activities"], [["contact", "phone", "whatsapp", "संपर्क", "9718346691", "email", "ईमेल"], "Contact SSF Team"],
  ];
  const match = rules.find(([keys]) => keys.some((key) => text.includes(key)));
  return match ? ANSWERS[match[1]] : UNKNOWN;
};

export default function SSFSupportChatPro() {
  const [open, setOpen] = useState(false); const [input, setInput] = useState(""); const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: INTRO }]); const panelRef = useRef(null); const launcherRef = useRef(null); const endRef = useRef(null);
  useEffect(() => { if (open) panelRef.current?.querySelector("button, input")?.focus(); else launcherRef.current?.focus(); }, [open]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages, typing]);
  const send = (value, label = null) => { const question = String(value || "").trim(); if (!question || typing) return; setInput(""); setMessages((prev) => [...prev, { role: "user", text: label || question }]); setTyping(true); window.setTimeout(() => { setMessages((prev) => [...prev, { role: "bot", text: ANSWERS[question] || answerFor(question) }]); setTyping(false); }, 260); };

  return <div className="fixed bottom-5 right-4 md:right-6 z-[70] flex flex-col items-end gap-3" onKeyDown={(event) => event.key === "Escape" && open && setOpen(false)}>
    {open && <section ref={panelRef} id="ssf-support-panel" role="dialog" aria-label="SSF Support Assistant" className="w-[min(94vw,410px)] overflow-hidden rounded-3xl border border-white/20 bg-[#061d33]/95 p-3 shadow-2xl backdrop-blur-xl">
      <div className="rounded-2xl bg-white/10 px-4 py-3 text-white"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-bold">SSF Assistant</p><p className="mt-0.5 text-[10px] text-emerald-300">● Ready to help • Verified SSF information</p></div><button type="button" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close SSF Assistant"><FaTimes /></button></div><p className="mt-2 text-[11px] leading-relaxed text-white/75">अपना उद्देश्य चुनें — फिर संबंधित विकल्प से आगे बढ़ें।</p></div>
      <div className="mt-2 grid grid-cols-2 gap-2">{QUICK_ACTIONS.map(([icon, label, question]) => <button key={question} type="button" onClick={() => send(question, label)} className="min-h-[58px] rounded-2xl border border-[#FFB347]/30 bg-[#FFB347]/10 px-3 py-2 text-left text-white hover:bg-[#FFB347]/20 focus:outline-none focus:ring-2 focus:ring-[#FFB347]"><span className="text-lg">{icon}</span><span className="mt-1 flex items-center justify-between gap-1 text-[10px] font-bold leading-tight"><span>{label}</span><FaArrowRight className="shrink-0 text-[9px] text-[#FFB347]" /></span></button>)}</div>
      <div className="mt-2 max-h-[210px] overflow-y-auto rounded-2xl bg-white/[0.06] p-2" aria-live="polite"><div className="space-y-2">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`max-w-[94%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${message.role === "bot" ? "bg-white text-zinc-700" : "ml-auto bg-[#0b6b4f] text-white"}`}>{message.text}</div>)}{typing && <div className="inline-flex rounded-2xl bg-white px-3 py-2 text-[11px] text-zinc-500">SSF Assistant लिख रहा है…</div>}<div ref={endRef} /></div></div>
      <div className="mt-2 max-h-[285px] overflow-y-auto pr-0.5">{GROUPS.map((group) => <div key={group.title} className="mb-3 last:mb-0"><p className="px-1 pb-1 text-[10px] font-bold uppercase tracking-wide text-[#FFB347]">{group.title}</p><div className="grid grid-cols-2 gap-2">{group.items.map(([icon, label]) => <button key={label} type="button" onClick={() => send(label)} className="group min-h-[54px] rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2 text-left text-white transition-all hover:bg-white/[0.14] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#FFB347]"><span className="text-base">{icon}</span><span className="mt-1 flex items-center justify-between gap-1 text-[10px] font-semibold leading-tight"><span>{label}</span><FaArrowRight className="shrink-0 text-[9px] text-[#FFB347]" /></span></button>)}</div></div>)}</div>
      <div className="mt-2 flex gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send(input)} placeholder="अपना सवाल लिखें…" aria-label="Ask SSF a question" className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-white px-3 py-2.5 text-xs text-zinc-800 outline-none focus:ring-2 focus:ring-[#FFB347]" /><button type="button" onClick={() => send(input)} aria-label="Send question" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFB347] text-[#061d33] hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-white"><FaPaperPlane className="text-xs" /></button></div>
      <div className="mt-2 grid grid-cols-2 gap-2"><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-3 py-2.5 text-[11px] font-bold text-white"><FaWhatsapp /> SSF Team</a><a href="tel:+919718346691" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-[11px] font-bold text-[#061d33]"><FaPhoneAlt /> Call Now</a></div>
      <div className="mt-2 grid grid-cols-2 gap-2"><a href={DONATE} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-[#FFB347] px-3 py-2.5 text-[11px] font-bold text-[#061d33]">💰 Donate Now <FaExternalLinkAlt className="text-[9px]" /></a><a href={WEBSITE} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-3 py-2.5 text-[11px] font-bold text-white">🌐 Website <FaExternalLinkAlt className="text-[9px]" /></a></div>
    </section>}
    <button ref={launcherRef} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="ssf-support-panel" aria-label={open ? "Close SSF Assistant" : "Open SSF Assistant"} className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl ring-4 ring-white/80 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#FFB347]">{open ? <FaTimes className="text-xl" /> : <FaComments className="text-xl" />}{!open && <span className="pointer-events-none absolute bottom-[58px] right-0 hidden whitespace-nowrap rounded-full bg-[#061d33] px-3 py-1.5 text-[10px] font-bold text-white shadow-lg md:block">SSF से पूछें</span>}</button>
  </div>;
}
