import { useEffect, useRef, useState } from "react";
import { FaComments, FaTimes, FaWhatsapp, FaArrowRight, FaPaperPlane, FaPhoneAlt } from "react-icons/fa";

const CATEGORIES = [
  ["🏢", "संस्था के बारे में", "संस्था क्या है?"],
  ["📜", "इतिहास / स्थापना", "स्थापना कब हुई?"],
  ["📋", "Registration Details", "Registration details क्या हैं?"],
  ["🎯", "संस्था के Objectives", "Objectives क्या हैं?"],
  ["🎓", "Education", "शिक्षा के क्षेत्र में क्या काम हो सकता है?"],
  ["💻", "Computer / Digital", "Computer और digital education के बारे में बताएं"],
  ["🧵", "Skill Development", "Skill development में क्या काम होता है?"],
  ["👩", "Women Empowerment", "महिला सशक्तिकरण में क्या काम हो सकता है?"],
  ["👶", "Child Welfare", "बच्चों के लिए क्या काम हो सकता है?"],
  ["❤️", "Health", "Health के क्षेत्र में क्या काम है?"],
  ["🌳", "Environment", "Environment के लिए क्या काम है?"],
  ["🌾", "Rural Development", "ग्रामीण विकास में क्या काम है?"],
  ["⚖️", "Social Justice", "Social Justice और awareness में क्या काम है?"],
  ["♿", "Disability / Rehabilitation", "दिव्यांग और rehabilitation के लिए क्या काम है?"],
  ["🐄", "Animal Protection", "पशु संरक्षण में क्या काम है?"],
  ["🎭", "Culture / Awareness", "Culture और awareness में क्या काम है?"],
  ["🤝", "Join / Volunteer", "Volunteer कैसे बनें?"],
  ["👥", "Membership", "Member कैसे बनें?"],
  ["🎓", "Internship / Students", "Internship या student volunteering कैसे करें?"],
  ["🏫", "College / Institution", "College या institution partnership कैसे करें?"],
  ["🏢", "CSR / Corporate", "CSR partnership कैसे करें?"],
  ["💰", "Donation", "Donation कैसे करें?"],
  ["📊", "Reports / Transparency", "Reports और transparency कैसे देखें?"],
  ["📸", "Our Activities", "Activities और photos कहाँ देखें?"],
  ["📞", "Contact", "संपर्क कैसे करें?"],
  ["🌐", "Website", "Official website क्या है?"],
];

const CATEGORY_ANSWERS = {
  "संस्था के बारे में": "Swastik Srijan Foundation Samiti एक registered nonprofit संस्था है। इसका registered office Rewa, Madhya Pradesh में है और registration year 2013 है। संस्था का उद्देश्य समाज के विभिन्न क्षेत्रों में सेवा, जागरूकता, शिक्षा, कौशल और विकास से जुड़े कार्य करना है।",
  "इतिहास / स्थापना": "Swastik Srijan Foundation Samiti वर्ष 2013 में registered हुई। संस्था का registered office Rewa, Madhya Pradesh में है और इसके कार्यक्षेत्र में विभिन्न सामाजिक विकास एवं जनहित के विषय शामिल हैं।",
  "Registration Details": "Registration No. 05/22/03/11448/13 है। संस्था Madhya Pradesh Societies Registration Act, 1973 के अंतर्गत registered है। Registration year 2013 है।",
  "संस्था के Objectives": "SSF के registered objectives व्यापक हैं। इनमें शिक्षा, कौशल विकास, महिला एवं बाल कल्याण, स्वास्थ्य, पर्यावरण, कृषि एवं ग्रामीण विकास, सामाजिक जागरूकता, दिव्यांग एवं पुनर्वास, पशु संरक्षण तथा धार्मिक-सांस्कृतिक गतिविधियों जैसे क्षेत्र शामिल हैं।",
  "Education": "Education के क्षेत्र में primary, secondary और higher secondary education, college education, computer education, nursing, technical education, competitive exam coaching, library तथा science fairs जैसे कार्य objectives में शामिल हैं। उपलब्ध resources और support के अनुसार initiatives चलाए जा सकते हैं।",
  "Computer / Digital": "Computer और digital क्षेत्र में computer education, digital learning, basic computer skills और technology awareness जैसे initiatives चलाए जा सकते हैं। SSF Learning Hub जैसी digital initiatives भी इसी दिशा में उपयोगी हैं।",
  "Skill Development": "Skill Development में computer training, सिलाई-कढ़ाई, vocational training, स्वरोजगार, rural industry तथा खादी एवं ग्रामोद्योग जैसे क्षेत्र शामिल हैं। उद्देश्य लोगों को practical skills और livelihood opportunities से जोड़ना है।",
  "Women Empowerment": "Women Empowerment में महिला शिक्षा, skill development, self-employment, SHG और सामाजिक जागरूकता जैसे क्षेत्रों में कार्य किया जा सकता है। महिला एवं बाल विकास SSF के प्रमुख registered objectives में शामिल है।",
  "Child Welfare": "Child Welfare में बालिका शिक्षा, बालवाड़ी, पोषण, बच्चों की सुरक्षा तथा उनके विकास से जुड़े कार्य objectives में शामिल हैं। जरूरत और उपलब्ध support के अनुसार awareness तथा सहायता initiatives चलाए जा सकते हैं।",
  "Health": "Health के objectives में AIDS और cancer awareness, malnutrition, naturopathy, yoga, family welfare, de-addiction और rehabilitation जैसे क्षेत्र शामिल हैं। SSF health awareness और community support activities भी कर सकती है।",
  "Environment": "Environment के क्षेत्र में वृक्षारोपण, biodiversity, forest conservation, natural resources, medicinal plants, organic farming और renewable/natural energy से जुड़े कार्य objectives में शामिल हैं।",
  "Rural Development": "Rural Development में agriculture, organic farming, farmer training, पशुपालन, गौ संरक्षण, rural livelihood और community development जैसे क्षेत्र शामिल हैं। स्थानीय जरूरत और resources के अनुसार programmes किए जा सकते हैं।",
  "Social Justice": "Social Justice और awareness में मानव अधिकार, सामाजिक जागरूकता, भ्रष्टाचार के विरुद्ध जागरूकता, नैतिक शिक्षा, राष्ट्रीय एकता और सांप्रदायिक सद्भाव जैसे विषयों पर कार्य किया जा सकता है।",
  "Disability / Rehabilitation": "Disability और Rehabilitation में दिव्यांग सहायता, rehabilitation, वृद्धजन सहायता तथा जरूरतमंद बच्चों एवं व्यक्तियों के पुनर्वास से जुड़े कार्य objectives में शामिल हैं।",
  "Animal Protection": "Animal Protection में पशु-पक्षी संरक्षण, गौ संरक्षण, गौशाला और wildlife conservation जैसे क्षेत्र शामिल हैं। उद्देश्य जीव-जंतुओं के प्रति संरक्षण और संवेदनशीलता बढ़ाना है।",
  "Culture / Awareness": "Culture और Awareness में धार्मिक-सांस्कृतिक कार्यक्रम, संस्कृत शिक्षा, संगीत, सम्मेलन, नैतिक शिक्षा तथा जन-जागरूकता activities जैसे क्षेत्र objectives में शामिल हैं।",
  "Join / Volunteer": "Volunteer बनने के लिए SSF के Get Involved section से शुरुआत करें। अपनी रुचि, skill और उपलब्ध समय के अनुसार volunteering opportunity के लिए team से संपर्क किया जा सकता है।",
  "Membership": "Membership के लिए Get Involved/Members section से interest submit किया जा सकता है। सदस्यता की वर्तमान eligibility और प्रक्रिया SSF Team से confirm करना सबसे सही रहेगा।",
  "Internship / Students": "Students और youth internship या volunteering के लिए Get Involved section से अपना interest submit कर सकते हैं। उपलब्ध opportunity, duration और role के अनुसार team आगे जानकारी देगी।",
  "College / Institution": "College, university और अन्य institutions education, skill, awareness तथा community initiatives में SSF के साथ collaboration या partnership के लिए team से संपर्क कर सकते हैं।",
  "CSR / Corporate": "CSR और corporate organisations SSF के registered objectives से जुड़े education, skill development, women & child welfare, health, rural/community development और awareness projects पर partnership के लिए चर्चा कर सकते हैं।",
  "Donation": "Donation या support के लिए SSF के Donate page का उपयोग करें। किसी specific initiative को support करने से पहले SSF Team से project और contribution details confirm की जा सकती हैं।",
  "Reports / Transparency": "SSF अपनी transparency, reports और उपलब्ध documentation को website के Reports/Transparency section में प्रस्तुत करती है। किसी specific year की report चाहिए तो team से भी जानकारी ली जा सकती है।",
  "Our Activities": "SSF की activities, photographs और service highlights website के Media/Activities sections में देखे जा सकते हैं। उपलब्ध सामग्री में awareness, education, skill और community initiatives शामिल हैं।",
  "Contact": "SSF से संपर्क करने के लिए WhatsApp/Call: +91 9718346691 और Email: swastiksrijanfoundation@gmail.com पर संपर्क किया जा सकता है।",
  "Website": "SSF की official website है: https://swastiksrijan.in/",
};

const FAQS = [
  { keys: ["what is ssf", "संस्था क्या", "संस्था कौन"], answer: CATEGORY_ANSWERS["संस्था के बारे में"] },
  { keys: ["स्थापित", "स्थापना", "कब बनी", "history", "founded", "2013"], answer: CATEGORY_ANSWERS["इतिहास / स्थापना"] },
  { keys: ["registration", "पंजीयन", "रजिस्ट्रेशन", "05/22/03/11448/13"], answer: CATEGORY_ANSWERS["Registration Details"] },
  { keys: ["objective", "objectives", "उद्देश्य", "कार्य क्षेत्र"], answer: CATEGORY_ANSWERS["संस्था के Objectives"] },
  { keys: ["education", "शिक्षा", "school", "पढ़ाई"], answer: CATEGORY_ANSWERS["Education"] },
  { keys: ["computer", "digital", "कंप्यूटर", "डिजिटल", "learning hub"], answer: CATEGORY_ANSWERS["Computer / Digital"] },
  { keys: ["skill", "कौशल", "training", "प्रशिक्षण", "सिलाई", "स्वरोजगार"], answer: CATEGORY_ANSWERS["Skill Development"] },
  { keys: ["women", "महिला", "नारी"], answer: CATEGORY_ANSWERS["Women Empowerment"] },
  { keys: ["child", "बच्चे", "बाल", "बालिका", "children"], answer: CATEGORY_ANSWERS["Child Welfare"] },
  { keys: ["health", "स्वास्थ्य", "aids", "cancer", "yoga", "नशा"], answer: CATEGORY_ANSWERS["Health"] },
  { keys: ["environment", "पर्यावरण", "tree", "वृक्ष", "nature"], answer: CATEGORY_ANSWERS["Environment"] },
  { keys: ["rural", "ग्रामीण", "agriculture", "कृषि", "farmer", "किसान", "village"], answer: CATEGORY_ANSWERS["Rural Development"] },
  { keys: ["social justice", "सामाजिक न्याय", "social awareness", "मानव अधिकार", "human rights"], answer: CATEGORY_ANSWERS["Social Justice"] },
  { keys: ["disability", "दिव्यांग", "rehabilitation", "पुनर्वास", "वृद्ध"], answer: CATEGORY_ANSWERS["Disability / Rehabilitation"] },
  { keys: ["animal", "पशु", "गौ", "गौशाला", "wildlife", "पक्षी"], answer: CATEGORY_ANSWERS["Animal Protection"] },
  { keys: ["culture", "सांस्कृतिक", "धार्मिक", "संगीत", "संस्कृति"], answer: CATEGORY_ANSWERS["Culture / Awareness"] },
  { keys: ["volunteer", "स्वयंसेवक", "volunteering"], answer: CATEGORY_ANSWERS["Join / Volunteer"] },
  { keys: ["membership", "member", "सदस्य", "सदस्यता"], answer: CATEGORY_ANSWERS["Membership"] },
  { keys: ["internship", "intern", "इंटर्नशिप", "student", "छात्र"], answer: CATEGORY_ANSWERS["Internship / Students"] },
  { keys: ["college", "university", "institution", "कॉलेज", "विश्वविद्यालय", "संस्थान"], answer: CATEGORY_ANSWERS["College / Institution"] },
  { keys: ["csr", "corporate", "सीएसआर", "company"], answer: CATEGORY_ANSWERS["CSR / Corporate"] },
  { keys: ["donation", "donate", "दान", "योगदान", "सहयोग"], answer: CATEGORY_ANSWERS["Donation"] },
  { keys: ["annual report", "annual reports", "वार्षिक रिपोर्ट", "reports", "transparency", "ऑडिट"], answer: CATEGORY_ANSWERS["Reports / Transparency"] },
  { keys: ["activity", "activities", "गतिविधि", "photos", "फोटो", "media"], answer: CATEGORY_ANSWERS["Our Activities"] },
  { keys: ["contact", "phone", "whatsapp", "संपर्क", "9718346691", "email", "ईमेल"], answer: CATEGORY_ANSWERS["Contact"] },
  { keys: ["website", "वेबसाइट", "official site", "swastiksrijan.in"], answer: CATEGORY_ANSWERS["Website"] },
];

const INTRO = "नमस्ते 🙏 SSF Assistant में आपका स्वागत है। नीचे विषय चुनें—हर विषय का अपना अलग उत्तर है। आप अपना सवाल भी लिख सकते हैं।";
const UNKNOWN = "इस प्रश्न की verified जानकारी मेरे उपलब्ध SSF records में नहीं है। मैं अनुमान लगाकर गलत जानकारी नहीं दूँगा। कृपया SSF Team से संपर्क करें।";

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

  const send = (value, categoryLabel = null) => {
    const question = String(value || "").trim();
    if (!question || typing) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setTyping(true);
    window.setTimeout(() => {
      const answer = categoryLabel ? CATEGORY_ANSWERS[categoryLabel] : answerFor(question);
      setMessages((prev) => [...prev, { role: "bot", text: answer || UNKNOWN }]);
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
            <p className="mt-2 text-[11px] leading-relaxed text-white/75">विषय चुनें — हर विषय का अलग उत्तर मिलेगा।</p>
          </div>
          <div className="mt-2 max-h-[220px] overflow-y-auto rounded-2xl bg-white/[0.06] p-2" aria-live="polite"><div className="space-y-2">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`max-w-[92%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${message.role === "bot" ? "bg-white text-zinc-700" : "ml-auto bg-[#0b6b4f] text-white"}`}>{message.text}</div>)}{typing && <div className="inline-flex rounded-2xl bg-white px-3 py-2 text-[11px] text-zinc-500">SSF Assistant लिख रहा है…</div>}<div ref={endRef} /></div></div>
          <div className="mt-2 max-h-[280px] overflow-y-auto pr-0.5"><div className="grid grid-cols-2 gap-2">{CATEGORIES.map(([icon, label, question]) => <button key={label} type="button" onClick={() => send(question, label)} className="group min-h-[58px] rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2 text-left text-white transition-all hover:bg-white/[0.14] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#FFB347]"><span className="text-lg">{icon}</span><span className="mt-1 flex items-center justify-between gap-1 text-[11px] font-semibold leading-tight"><span>{label}</span><FaArrowRight className="shrink-0 text-[9px] text-[#FFB347]" /></span></button>)}</div></div>
          <div className="mt-2 flex gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send(input)} placeholder="अपना सवाल लिखें…" aria-label="Ask SSF a question" className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-white px-3 py-2.5 text-xs text-zinc-800 outline-none focus:ring-2 focus:ring-[#FFB347]" /><button type="button" onClick={() => send(input)} aria-label="Send question" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFB347] text-[#061d33] hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-white"><FaPaperPlane className="text-xs" /></button></div>
          <div className="mt-2 grid grid-cols-2 gap-2"><a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-3 py-2.5 text-[11px] font-bold text-white"><FaWhatsapp /> SSF Team</a><a href="tel:+919718346691" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-[11px] font-bold text-[#061d33]"><FaPhoneAlt /> Call Now</a></div>
        </section>
      )}
      <button ref={launcherRef} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="ssf-support-panel" aria-label={open ? "Close SSF Assistant" : "Open SSF Assistant"} className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl ring-4 ring-white/80 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#FFB347]">{open ? <FaTimes className="text-xl" /> : <FaComments className="text-xl" />}{!open && <span className="pointer-events-none absolute bottom-[58px] right-0 hidden whitespace-nowrap rounded-full bg-[#061d33] px-3 py-1.5 text-[10px] font-bold text-white shadow-lg md:block">SSF से पूछें</span>}</button>
    </div>
  );
}
