import { useEffect, useRef, useState } from "react";
import { FaComments, FaTimes, FaWhatsapp, FaArrowRight, FaPaperPlane, FaPhoneAlt } from "react-icons/fa";

const GROUPS = [
  {
    title: "ℹ️ संस्था एवं जानकारी",
    items: [
      ["🏢", "संस्था के बारे में"],
      ["📜", "इतिहास / स्थापना"],
      ["📋", "Registration Details"],
      ["🎯", "संस्था के Objectives"],
      ["🌐", "कार्य क्षेत्र / Website"],
    ],
  },
  {
    title: "🤝 Join / Connect",
    items: [
      ["🤝", "Volunteer कैसे बनें?"],
      ["👥", "Member कैसे बनें?"],
      ["🎓", "Internship / Student"],
      ["🧑‍🏫", "Trainer / Mentor"],
      ["💻", "Skill-Based Volunteering"],
      ["📣", "Campaign / Awareness Volunteer"],
    ],
  },
  {
    title: "🏢 Partnership",
    items: [
      ["🏢", "CSR / Corporate"],
      ["🏫", "College / University"],
      ["🏛️", "Institution Partnership"],
      ["🤲", "NGO / Community Partner"],
    ],
  },
  {
    title: "❤️ सेवा एवं सहयोग",
    items: [
      ["🎓", "Education"],
      ["💻", "Computer / Digital"],
      ["🧵", "Skill Development"],
      ["👩", "Women Empowerment"],
      ["👶", "Child Welfare"],
      ["❤️", "Health"],
      ["🌳", "Environment"],
      ["🌾", "Rural Development"],
      ["⚖️", "Social Justice"],
      ["♿", "Disability / Rehabilitation"],
      ["🐄", "Animal Protection"],
      ["🎭", "Culture / Awareness"],
      ["💰", "Donor / Donation"],
      ["📊", "Reports / Transparency"],
      ["📸", "Our Activities"],
      ["📞", "Contact SSF Team"],
    ],
  },
];

const CATEGORY_ANSWERS = {
  "संस्था के बारे में": "Swastik Srijan Foundation Samiti एक registered nonprofit संस्था है। इसका registered office Rewa, Madhya Pradesh में है और registration year 2013 है।",
  "इतिहास / स्थापना": "Swastik Srijan Foundation Samiti का registration year 2013 है। संस्था का registered office Rewa, Madhya Pradesh में है।",
  "Registration Details": "SSF का Registration No. 05/22/03/11448/13 है। Registration Madhya Pradesh Societies Registration Act, 1973 के अंतर्गत है।",
  "संस्था के Objectives": "SSF के registered objectives में education, skill development, women & child welfare, health awareness, environment, agriculture & rural development, social justice, disability & rehabilitation, animal protection तथा cultural और अन्य सामाजिक विकास से जुड़े कार्य शामिल हैं।",
  "कार्य क्षेत्र / Website": "SSF का कार्यक्षेत्र व्यापक सामाजिक विकास से जुड़ा है। Official website: https://swastiksrijan.in/",
  "Volunteer कैसे बनें?": "आप SSF से volunteer के रूप में जुड़ सकते हैं। अपनी रुचि, location और skills के अनुसार volunteering opportunity के लिए Join/Get Involved section से interest submit करें या SSF Team से WhatsApp +91 9718346691 पर संपर्क करें।",
  "Member कैसे बनें?": "SSF से member के रूप में जुड़ने के लिए membership interest submit करें। आपकी eligibility और उपलब्ध membership process के अनुसार team आगे guide करेगी। सहायता के लिए WhatsApp +91 9718346691 पर संपर्क कर सकते हैं।",
  "Internship / Student": "Students और youth SSF की उपलब्ध internship, learning और volunteering opportunities के लिए अपना interest submit कर सकते हैं। Opportunity के अनुसार team आगे जानकारी देगी।",
  "Trainer / Mentor": "यदि आपके पास teaching, technical, professional या किसी अन्य क्षेत्र की skill है, तो आप Trainer/Mentor के रूप में SSF के साथ सहयोग का interest दे सकते हैं।",
  "Skill-Based Volunteering": "आप अपनी professional या practical skill—जैसे computer, teaching, design, communication, training आदि—के माध्यम से SSF को volunteer support दे सकते हैं।",
  "Campaign / Awareness Volunteer": "Awareness campaigns और social initiatives में volunteer के रूप में जुड़ने के लिए अपना interest submit करें। Campaign की आवश्यकता और उपलब्ध अवसर के अनुसार team guide करेगी।",
  "CSR / Corporate": "Companies और CSR teams SSF के registered objectives से जुड़े education, skills, women & child welfare, health, environment, rural/community development और अन्य initiatives में partnership पर चर्चा कर सकती हैं।",
  "College / University": "Colleges और universities education, internship, youth volunteering, awareness और community initiatives में SSF के साथ collaboration कर सकते हैं।",
  "Institution Partnership": "Schools, colleges और अन्य institutions SSF के education, skill, awareness और community development initiatives के लिए partnership/collaboration के संबंध में team से संपर्क कर सकते हैं।",
  "NGO / Community Partner": "अन्य NGOs और community groups SSF के साथ संयुक्त awareness, education, skill, relief या community initiatives के लिए collaboration प्रस्ताव रख सकते हैं।",
  "Education": "SSF के objectives में primary, secondary और higher secondary education, college, computer education, nursing, technical education, competitive exam coaching, library और science fairs जैसे क्षेत्र शामिल हैं।",
  "Computer / Digital": "SSF के objectives में computer education और digital learning शामिल हैं। उपलब्ध resources और support के अनुसार training या digital initiatives चलाए जा सकते हैं।",
  "Skill Development": "Skill development में computer training, सिलाई-कढ़ाई, स्वरोजगार, vocational training, rural industry तथा खादी एवं ग्रामोद्योग जैसे क्षेत्र शामिल हैं।",
  "Women Empowerment": "Women & Child Development में महिला सशक्तिकरण, बालिका शिक्षा, विधवा सहायता, SHG, पोषण और अन्य संबंधित सामाजिक सहायता के क्षेत्र शामिल हैं।",
  "Child Welfare": "Child welfare के अंतर्गत बालिका शिक्षा, बालवाड़ी, पोषण कार्यक्रम और बच्चों की सुरक्षा एवं विकास से जुड़े कार्य objectives में शामिल हैं।",
  "Health": "Health-related objectives में AIDS और cancer awareness, malnutrition, naturopathy, yoga, family welfare, de-addiction और rehabilitation जैसे क्षेत्र शामिल हैं।",
  "Environment": "Environment के अंतर्गत वृक्षारोपण, biodiversity, forest conservation, natural resources, medicinal plants, organic farming और renewable/natural energy से जुड़े कार्य किए जा सकते हैं।",
  "Rural Development": "Agriculture & Rural Development में organic farming, farmer training, पशुपालन, गौ संरक्षण, ग्रामीण विकास और livelihood जैसे क्षेत्र शामिल हैं।",
  "Social Justice": "Social awareness में भ्रष्टाचार जागरूकता, नैतिक शिक्षा, राष्ट्रीय एकता, सांप्रदायिक सद्भाव और मानव अधिकार जैसे विषयों पर काम किया जा सकता है।",
  "Disability / Rehabilitation": "Disability & Rehabilitation में दिव्यांग सहायता, मानसिक रूप से कमजोर बच्चों का पुनर्वास, वृद्धजन सहायता और अनाथ सहायता जैसे क्षेत्र शामिल हैं।",
  "Animal Protection": "Animal Protection में पशु-पक्षी संरक्षण, गौशाला और wildlife conservation जैसे क्षेत्र शामिल हैं।",
  "Culture / Awareness": "Religious & Cultural objectives में भजन, संस्कृत शिक्षा, संगीत, सम्मेलन और सांस्कृतिक कार्यक्रम जैसे क्षेत्र शामिल हैं।",
  "Donor / Donation": "आप SSF को donor के रूप में support कर सकते हैं। Donation के लिए Donate page का उपयोग करें या SSF Team से WhatsApp +91 9718346691 पर संपर्क करें।",
  "Reports / Transparency": "SSF की reports और transparency information website के Transparency/Reports section में उपलब्ध कराई जाती है।",
  "Our Activities": "SSF की activities, photographs और service highlights website के Media/Activities sections में देखे जा सकते हैं।",
  "Contact SSF Team": "SSF से WhatsApp +91 9718346691 या email: swastiksrijanfoundation@gmail.com के माध्यम से संपर्क कर सकते हैं।",
};

const FAQS = [
  { keys: ["registration", "पंजीयन", "रजिस्ट्रेशन", "05/22/03/11448/13"], answer: CATEGORY_ANSWERS["Registration Details"] },
  { keys: ["objective", "objectives", "उद्देश्य", "work areas", "कार्य क्षेत्र"], answer: CATEGORY_ANSWERS["संस्था के Objectives"] },
  { keys: ["education", "शिक्षा", "school", "पढ़ाई"], answer: CATEGORY_ANSWERS["Education"] },
  { keys: ["computer", "digital", "कंप्यूटर", "डिजिटल", "learning hub"], answer: CATEGORY_ANSWERS["Computer / Digital"] },
  { keys: ["skill", "कौशल", "training", "प्रशिक्षण", "सिलाई", "स्वरोजगार"], answer: CATEGORY_ANSWERS["Skill Development"] },
  { keys: ["women", "महिला", "नारी"], answer: CATEGORY_ANSWERS["Women Empowerment"] },
  { keys: ["child", "बच्चे", "बाल", "बालिका", "children"], answer: CATEGORY_ANSWERS["Child Welfare"] },
  { keys: ["health", "स्वास्थ्य", "aids", "cancer", "yoga", "नशा"], answer: CATEGORY_ANSWERS["Health"] },
  { keys: ["environment", "पर्यावरण", "tree", "वृक्ष", "nature"], answer: CATEGORY_ANSWERS["Environment"] },
  { keys: ["rural", "ग्रामीण", "agriculture", "कृषि", "farmer", "किसान", "village"], answer: CATEGORY_ANSWERS["Rural Development"] },
  { keys: ["social justice", "सामाजिक न्याय", "social awareness", "जागरूकता", "मानव अधिकार", "human rights"], answer: CATEGORY_ANSWERS["Social Justice"] },
  { keys: ["disability", "दिव्यांग", "rehabilitation", "पुनर्वास", "वृद्ध", "अनाथ"], answer: CATEGORY_ANSWERS["Disability / Rehabilitation"] },
  { keys: ["animal", "पशु", "गौ", "गौशाला", "wildlife", "पक्षी"], answer: CATEGORY_ANSWERS["Animal Protection"] },
  { keys: ["culture", "सांस्कृतिक", "धार्मिक", "भजन", "संगीत", "संस्कृति"], answer: CATEGORY_ANSWERS["Culture / Awareness"] },
  { keys: ["volunteer", "स्वयंसेवक", "volunteering"], answer: CATEGORY_ANSWERS["Volunteer कैसे बनें?"] },
  { keys: ["member", "membership", "सदस्य", "सदस्यता"], answer: CATEGORY_ANSWERS["Member कैसे बनें?"] },
  { keys: ["internship", "intern", "इंटर्नशिप", "student", "छात्र"], answer: CATEGORY_ANSWERS["Internship / Student"] },
  { keys: ["trainer", "mentor", "प्रशिक्षक", "मेंटोर"], answer: CATEGORY_ANSWERS["Trainer / Mentor"] },
  { keys: ["csr", "corporate", "सीएसआर", "company"], answer: CATEGORY_ANSWERS["CSR / Corporate"] },
  { keys: ["college", "university", "कॉलेज", "विश्वविद्यालय"], answer: CATEGORY_ANSWERS["College / University"] },
  { keys: ["institution", "संस्थान", "school partnership"], answer: CATEGORY_ANSWERS["Institution Partnership"] },
  { keys: ["ngo", "community partner", "सामुदायिक सहयोग"], answer: CATEGORY_ANSWERS["NGO / Community Partner"] },
  { keys: ["donation", "donate", "दान", "योगदान", "support", "सहयोग", "donor"], answer: CATEGORY_ANSWERS["Donor / Donation"] },
  { keys: ["annual report", "annual reports", "वार्षिक रिपोर्ट", "reports", "transparency", "ऑडिट"], answer: CATEGORY_ANSWERS["Reports / Transparency"] },
  { keys: ["activity", "activities", "गतिविधि", "photos", "फोटो", "media"], answer: CATEGORY_ANSWERS["Our Activities"] },
  { keys: ["contact", "phone", "whatsapp", "संपर्क", "9718346691", "email", "ईमेल"], answer: CATEGORY_ANSWERS["Contact SSF Team"] },
  { keys: ["website", "वेबसाइट", "official site", "swastiksrijan.in"], answer: CATEGORY_ANSWERS["कार्य क्षेत्र / Website"] },
  { keys: ["ssf क्या", "संस्था क्या", "संस्था कौन", "what is ssf"], answer: CATEGORY_ANSWERS["संस्था के बारे में"] },
  { keys: ["स्थापित", "स्थापना", "कब बनी", "history", "founded", "2013"], answer: CATEGORY_ANSWERS["इतिहास / स्थापना"] },
];

const INTRO = "नमस्ते 🙏 मैं SSF Assistant हूँ। आप क्या करना चाहते हैं? नीचे अपना विकल्प चुनें—जुड़ें, सहयोग करें, partnership करें या SSF के बारे में जानें। आप अपना सवाल भी सीधे लिख सकते हैं।";
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

  const send = (value, directAnswer = null) => {
    const question = String(value || "").trim();
    if (!question || typing) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: directAnswer || answerFor(question) }]);
      setTyping(false);
    }, 280);
  };

  const whatsappLink = "https://wa.me/919718346691?text=Namaste%20Swastik%20Srijan%20Foundation%20team%2C%20mujhe%20SSF%20ke%20baare%20mein%20jankari%20chahiye.";

  return (
    <div className="fixed bottom-5 right-4 md:right-6 z-[70] flex flex-col items-end gap-3" onKeyDown={(event) => event.key === "Escape" && open && setOpen(false)}>
      {open && (
        <section ref={panelRef} id="ssf-support-panel" role="dialog" aria-label="SSF Support Assistant" className="w-[min(92vw,390px)] overflow-hidden rounded-3xl border border-white/20 bg-[#061d33]/95 p-3 shadow-2xl backdrop-blur-xl">
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-white">
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-sm font-bold">SSF Assistant</p><p className="mt-0.5 text-[10px] text-emerald-300">● Ready to help • Verified information</p></div>
              <button type="button" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close SSF Assistant"><FaTimes /></button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-white/75">अपनी जरूरत के अनुसार विकल्प चुनें — या सवाल सीधे लिखें।</p>
          </div>

          <div className="mt-2 max-h-[220px] overflow-y-auto rounded-2xl bg-white/[0.06] p-2" aria-live="polite"><div className="space-y-2">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`max-w-[92%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${message.role === "bot" ? "bg-white text-zinc-700" : "ml-auto bg-[#0b6b4f] text-white"}`}>{message.text}</div>)}{typing && <div className="inline-flex rounded-2xl bg-white px-3 py-2 text-[11px] text-zinc-500">SSF Assistant लिख रहा है…</div>}<div ref={endRef} /></div></div>

          <div className="mt-2 max-h-[340px] overflow-y-auto pr-0.5">
            {GROUPS.map((group) => (
              <div key={group.title} className="mb-3 last:mb-0">
                <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-wide text-[#FFB347]">{group.title}</p>
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map(([icon, label]) => (
                    <button key={label} type="button" onClick={() => send(label, CATEGORY_ANSWERS[label])} className="group min-h-[58px] rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2 text-left text-white transition-all hover:bg-white/[0.14] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#FFB347]">
                      <span className="text-lg">{icon}</span>
                      <span className="mt-1 flex items-center justify-between gap-1 text-[11px] font-semibold leading-tight"><span>{label}</span><FaArrowRight className="shrink-0 text-[9px] text-[#FFB347]" /></span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 flex gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send(input)} placeholder="अपना सवाल लिखें…" aria-label="Ask SSF a question" className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-white px-3 py-2.5 text-xs text-zinc-800 outline-none focus:ring-2 focus:ring-[#FFB347]" /><button type="button" onClick={() => send(input)} aria-label="Send question" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFB347] text-[#061d33] hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-white"><FaPaperPlane className="text-xs" /></button></div>
          <div className="mt-2 grid grid-cols-2 gap-2"><a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-3 py-2.5 text-[11px] font-bold text-white"><FaWhatsapp /> SSF Team</a><a href="tel:+919718346691" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-[11px] font-bold text-[#061d33]"><FaPhoneAlt /> Call Now</a></div>
        </section>
      )}
      <button ref={launcherRef} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="ssf-support-panel" aria-label={open ? "Close SSF Assistant" : "Open SSF Assistant"} className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl ring-4 ring-white/80 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#FFB347]">{open ? <FaTimes className="text-xl" /> : <FaComments className="text-xl" />}{!open && <span className="pointer-events-none absolute bottom-[58px] right-0 hidden whitespace-nowrap rounded-full bg-[#061d33] px-3 py-1.5 text-[10px] font-bold text-white shadow-lg md:block">SSF से पूछें</span>}</button>
    </div>
  );
}
