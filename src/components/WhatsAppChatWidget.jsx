import { useMemo, useState } from "react";
import { FaWhatsapp, FaTimes, FaComments, FaPaperPlane } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import { useLanguage } from "../context/LanguageContext";

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

const BOT_INTRO =
  "नमस्ते 🙏 Swastik Srijan Foundation में आपका स्वागत है। मैं SSF की उपलब्ध verified जानकारी के आधार पर सहायता कर सकता हूँ। जानकारी उपलब्ध न होने पर मैं अनुमान नहीं लगाऊँगा।";

const UNKNOWN_REPLY =
  "इस प्रश्न की verified जानकारी मेरे उपलब्ध SSF records में नहीं है। मैं अनुमान लगाकर गलत जानकारी नहीं दूँगा। कृपया SSF से सीधे संपर्क करें: WhatsApp +91 9718346691 या swastiksrijanfoundation@gmail.com. आप नीचे WhatsApp Chat से टीम से भी जुड़ सकते हैं।";

const FAQS = [
  {
    keys: ["ssf क्या", "ssf kya", "what is ssf", "swastik srijan foundation kya", "संस्था क्या", "संस्था कौन"],
    answer: "Swastik Srijan Foundation Samiti एक registered nonprofit संस्था है। इसका registered office Rewa, Madhya Pradesh में है। संस्था 2013 में registered हुई और इसका stated service area India है।",
  },
  {
    keys: ["स्थापना", "स्थापित", "कब शुरू", "since when", "founded", "established", "2013"],
    answer: "Swastik Srijan Foundation की registration year 2013 है। Official records में registration December 2013 से जुड़ा है।",
  },
  {
    keys: ["registration number", "registration no", "reg no", "पंजीयन नंबर", "रजिस्ट्रेशन नंबर", "05/22/03/11448/13"],
    answer: "SSF का Registration No. 05/22/03/11448/13 है।",
  },
  {
    keys: ["registration act", "societies act", "किस act", "किस अधिनियम", "registration law"],
    answer: "SSF का registration Madhya Pradesh Societies Registration Act, 1973 के अंतर्गत है।",
  },
  {
    keys: ["registered office", "office address", "registered address", "कार्यालय पता", "पंजीकृत कार्यालय", "मुख्यालय", "office kaha"],
    answer: "SSF का registered office Rewa, Madhya Pradesh में है। पूरा address उपलब्ध official contact records से ही confirm करें।",
  },
  {
    keys: ["work area", "कार्य क्षेत्र", "कहाँ काम", "where work", "service area", "pan india", "पूरे भारत"],
    answer: "SSF का stated service area India है। किसी specific शहर, जिले या programme की current availability अलग से team से confirm करनी चाहिए।",
  },
  {
    keys: ["objective", "objectives", "उद्देश्य", "मुख्य उद्देश्य", "क्या काम करती", "work areas", "कार्य क्षेत्र"],
    answer: "SSF के registered objectives में education, skill development, women & child welfare, health awareness, youth/community development, rural development, environment और अन्य सामाजिक विकास से जुड़े कार्य शामिल हैं।",
  },
  {
    keys: ["education", "शिक्षा", "school", "विद्यालय", "college", "academic support"],
    answer: "SSF के objectives में education, academic support, learning और community education से जुड़े कार्य शामिल हैं। किसी specific programme की current availability team से confirm करें।",
  },
  {
    keys: ["learning hub", "learninghub", "computer learning", "digital literacy", "digital learning", "computer centre"],
    answer: "SSF Learning HUB के focus areas में digital literacy, computer learning, academic support, youth learning, online/community learning और guidance शामिल हैं। Centre की current opening, timing या admission की जानकारी team से verify करें।",
  },
  {
    keys: ["skill development", "skill program", "skill programmes", "कौशल विकास", "कौशल कार्यक्रम", "vocational"],
    answer: "SSF के skill-development focus में sewing, computer/digital skills, vocational learning, self-employment, women-focused skills, livelihood support और trainer/mentor participation जैसे areas शामिल हैं। Current batch की पुष्टि team से करें।",
  },
  {
    keys: ["silai", "sewing", "stitching", "सिलाई", "सिलाई प्रशिक्षण"],
    answer: "Sewing/silai skill development SSF के skill-focused activities में शामिल है। किसी centre, batch, timing या admission की current availability team से confirm करें।",
  },
  {
    keys: ["women", "महिला", "women empowerment", "महिला सशक्तिकरण"],
    answer: "Women empowerment और women-focused skill/livelihood development SSF के registered objectives और programme focus का हिस्सा हैं। Current programme availability team से confirm करें।",
  },
  {
    keys: ["child", "children", "बाल", "बच्चे", "child welfare", "बाल कल्याण"],
    answer: "Women & child welfare SSF के registered objectives में शामिल है। Specific child programme, location या current activity के लिए team से पुष्टि करें।",
  },
  {
    keys: ["youth", "student", "student youth", "युवा", "छात्र", "student support"],
    answer: "Youth और student engagement SSF के programme focus में शामिल है। Student/Youth volunteer, learning या skill participation के लिए Get Involved section से शुरुआत की जा सकती है।",
  },
  {
    keys: ["health", "health awareness", "स्वास्थ्य", "स्वास्थ्य जागरूकता", "medical"],
    answer: "Health awareness और community wellbeing SSF के registered objectives में शामिल हैं। किसी specific health camp, service, date या location की जानकारी team से current confirmation के बाद ही लें।",
  },
  {
    keys: ["dental", "दंत", "दांत", "dental camp"],
    answer: "SSF ने health/community support activities के अंतर्गत dental-related outreach भी किया है। किसी camp की current date, location या appointment को team से verify करें।",
  },
  {
    keys: ["environment", "पर्यावरण", "tree", "वृक्ष", "green"],
    answer: "Environment और environmental awareness SSF के registered objectives/programme focus में शामिल हैं। Current campaign की जानकारी team से confirm करें।",
  },
  {
    keys: ["rural", "ग्रामीण", "village", "ग्राम", "community development"],
    answer: "Rural और community development SSF के registered objectives में शामिल हैं। किसी specific village/project की current activity team से confirm करें।",
  },
  {
    keys: ["animal", "bird", "पशु", "पक्षी", "animal welfare"],
    answer: "Community welfare और available programme records में animal/bird welfare awareness से जुड़े efforts भी हो सकते हैं। किसी specific current activity के लिए team से पुष्टि करें।",
  },
  {
    keys: ["volunteer", "स्वयंसेवक", "volunteering", "volunteer कैसे", "volunteer kaise"],
    answer: "Volunteer बनने के लिए website के Get Involved section से शुरुआत करें। Volunteer, Campaign/Awareness Volunteer, Skill-Based Volunteer और अन्य engagement options में आपकी रुचि के अनुसार team आगे guide करेगी।",
  },
  {
    keys: ["intern", "internship", "इंटर्न", "इंटर्नशिप"],
    answer: "Internship के लिए Get Involved section से enquiry की जा सकती है। Eligibility, role, duration और current availability team से confirm होती है।",
  },
  {
    keys: ["member", "membership", "सदस्य", "सदस्यता", "मेंबर"],
    answer: "Member बनने के लिए website के Members/Get Involved section से शुरुआत करें। Membership की current eligibility, process या applicable fee जैसी specific जानकारी team से confirm करें।",
  },
  {
    keys: ["trainer", "mentor", "ट्रेनर", "मेंटोर", "mentor कैसे"],
    answer: "Trainer/Mentor के रूप में जुड़ने का option Get Involved में रखा गया है। आपकी skill और availability के अनुसार suitable opportunity team से confirm की जाएगी।",
  },
  {
    keys: ["institution", "college", "university", "institution partnership", "college partnership", "विश्वविद्यालय"],
    answer: "Institution/College/University partnership के लिए Get Involved या Partner section से enquiry करें। Partnership scope और current requirement team से confirm होगी।",
  },
  {
    keys: ["ngo partner", "ngo partnership", "community partner", "ngo", "community partnership"],
    answer: "NGO/Community Partner के रूप में जुड़ने के लिए Partner/Get Involved section का उपयोग करें। Collaboration का scope project और mutual requirements के अनुसार तय होता है।",
  },
  {
    keys: ["csr", "corporate", "company partnership", "सीएसआर", "csr partnership"],
    answer: "SSF CSR और corporate partnerships के लिए education, skill development, women & child welfare, community/rural development, health awareness और अन्य registered objectives से जुड़े opportunities पर चर्चा कर सकता है। Current project requirement team से confirm करें।",
  },
  {
    keys: ["supporter", "well wisher", "well-wisher", "समर्थक", "शुभचिंतक"],
    answer: "Supporter/Well-wisher के रूप में SSF से जुड़ने का option Get Involved में है। आपका support awareness, volunteering, partnership या अन्य suitable contribution के रूप में हो सकता है; team से current process confirm करें।",
  },
  {
    keys: ["donation", "donate", "दान", "योगदान", "कैसे donate", "donation कैसे"],
    answer: "Donation के लिए website के Donate page का उपयोग करें। Donation/refund और applicable tax-document information के लिए Donation & Refund Policy तथा Transparency page देखें। Tax benefit automatic या guaranteed नहीं है; eligibility applicable rules और donor conditions पर निर्भर करती है।",
  },
  {
    keys: ["donation use", "दान का उपयोग", "donation कहाँ", "पैसा कहाँ", "fund use"],
    answer: "Donations का उपयोग संस्था के eligible objectives और approved programme requirements के अनुसार किया जाना चाहिए। किसी specific donation के utilisation की जानकारी के लिए official records/team से पूछें।",
  },
  {
    keys: ["refund", "refund policy", "रिफंड", "वापसी", "donation refund"],
    answer: "Donation और payment refund से जुड़े नियम website की Donation & Refund Policy में दिए गए हैं। Technical/duplicate/incorrect payment जैसी स्थिति में policy के अनुसार request करें।",
  },
  {
    keys: ["80g", "80 g", "tax benefit", "tax exemption", "कर छूट"],
    answer: "80G/tax benefit को automatic या guaranteed नहीं माना जाना चाहिए। Donor eligibility, applicable provisions और current official documentation के अनुसार ही benefit निर्धारित होता है।",
  },
  {
    keys: ["12ab", "12 ab", "12ab registration"],
    answer: "SSF की Transparency/Compliance section में 12AB से संबंधित official document उपलब्ध कराया गया है। Current status के लिए उसी official document को प्राथमिकता दें।",
  },
  {
    keys: ["csr-1", "csr 1", "csr registration"],
    answer: "SSF की Transparency/Compliance section में CSR-1 से संबंधित official document उपलब्ध है। Partnership के लिए current CSR requirements team से confirm करें।",
  },
  {
    keys: ["ngo darpan", "ngo-darpan", "ngo portal"],
    answer: "SSF की Transparency/Compliance section में NGO Darpan से संबंधित document उपलब्ध कराया गया है। Current verification के लिए official document को प्राथमिकता दें।",
  },
  {
    keys: ["annual report", "annual reports", "वार्षिक रिपोर्ट", "yearly report", "reports कहाँ", "reports kaha"],
    answer: "SSF की Transparency page पर उपलब्ध annual reports 2013-14 से 2025-26 तक क्रमवार दी गई हैं। वहीं उपलब्ध official records भी देखे जा सकते हैं।",
  },
  {
    keys: ["transparency", "पारदर्शिता", "compliance", "documents", "official documents", "certificate"],
    answer: "SSF की Transparency page पर registration/compliance documents और available annual reports दिए गए हैं। किसी document की validity/status के लिए official document और current SSF records को प्राथमिकता दें।",
  },
  {
    keys: ["audit", "audited accounts", "ऑडिट", "लेखा", "accounts"],
    answer: "Transparency/Compliance section में उपलब्ध audited accounts और अन्य official records देखे जा सकते हैं। किसी particular year या document की जानकारी official file से verify करें।",
  },
  {
    keys: ["pan", "pan verification", "पैन"],
    answer: "Transparency/Compliance section में PAN verification से संबंधित official document उपलब्ध है।",
  },
  {
    keys: ["website", "official site", "site", "वेबसाइट", "official website"],
    answer: "SSF की official website: https://swastiksrijan.in/",
  },
  {
    keys: ["contact", "phone", "call", "whatsapp", "mobile", "संपर्क", "फोन", "number", "नंबर"],
    answer: "SSF से संपर्क: WhatsApp/Phone +91 9718346691 और email swastiksrijanfoundation@gmail.com. Registered office Rewa, Madhya Pradesh में है।",
  },
  {
    keys: ["email", "ईमेल", "mail id", "मेल"],
    answer: "General SSF contact email: swastiksrijanfoundation@gmail.com. Website पर उपलब्ध official contact details को प्राथमिकता दें।",
  },
  {
    keys: ["get involved", "getinvolved", "कैसे जुड़ें", "जुड़ना", "join", "join ssf"],
    answer: "SSF से जुड़ने के लिए Get Involved section में Volunteer, Member, Internship, Student/Youth, Trainer/Mentor, Skill-Based Volunteer, Institution/College/University, NGO/Community Partner, CSR/Corporate और Supporter जैसे options देखें।",
  },
  {
    keys: ["partner", "partnership", "साझेदारी", "सहयोग", "partner with us"],
    answer: "Partnership के लिए institution, NGO/community, CSR/corporate और अन्य suitable collaboration options उपलब्ध हैं। Current requirement और process team से confirm करें।",
  },
  {
    keys: ["campaign", "campaigns", "अभियान", "जागरूकता अभियान", "awareness campaign"],
    answer: "SSF awareness और community campaigns को अपने registered objectives और available resources/partnerships के अनुसार चलाता है। किसी campaign की current status या participation के लिए team से confirm करें।",
  },
  {
    keys: ["media", "photos", "photo", "फोटो", "मीडिया", "gallery"],
    answer: "Website के Media section में उपलब्ध SSF activity photos और media-related material देखा जा सकता है। Photo के साथ activity/date/location की exact जानकारी के लिए official record को प्राथमिकता दें।",
  },
  {
    keys: ["upcoming", "future project", "आगामी", "भविष्य की परियोजना", "upcoming projects"],
    answer: "Upcoming Projects page पर planned/proposed projects की जानकारी दी जाती है। किसी project को active/open/confirmed मानने से पहले team से current status verify करें।",
  },
  {
    keys: ["learning", "training", "प्रशिक्षण", "course", "admission", "batch"],
    answer: "Training/learning की availability programme और location के अनुसार बदल सकती है। किसी current course, batch, admission या timing को team से verify करें।",
  },
  {
    keys: ["certificate", "motivation certificate", "प्रमाण पत्र", "certificate मिलेगा"],
    answer: "Certificate से जुड़ी eligibility, type और issuance programme/participation requirements पर निर्भर करती है। कोई certificate guaranteed मानने से पहले SSF team से current confirmation लें।",
  },
  {
    keys: ["fee", "fees", "फीस", "शुल्क", "charge"],
    answer: "किसी programme, membership, training या service की fee को assistant स्वयं निर्धारित नहीं करेगा। जहाँ लागू हो, current fee/charge team से confirm करें।",
  },
  {
    keys: ["receipt", "donation receipt", "रसीद", "receipt मिलेगा"],
    answer: "Donation receipt/tax documentation payment और donor details के अनुसार process होती है। Current procedure के लिए Donate/Donation Policy या SSF team से confirm करें।",
  },
  {
    keys: ["privacy", "privacy policy", "गोपनीयता", "personal data"],
    answer: "Website की Privacy Policy में personal information, usage, sharing, security, retention और user rights से संबंधित जानकारी दी गई है।",
  },
  {
    keys: ["terms", "terms of use", "नियम", "शर्तें", "website rules"],
    answer: "Website के Terms of Use में website use, user responsibilities, donations, intellectual property, external links और अन्य applicable terms दिए गए हैं।",
  },
  {
    keys: ["cookie", "cookies", "कुकी"],
    answer: "Website की Cookie Policy में cookies, essential functionality, analytics/third-party services और user choices से संबंधित जानकारी दी गई है।",
  },
  {
    keys: ["founder", "president", "संस्थापक", "अध्यक्ष", "ramesh pandey"],
    answer: "SSF के Founder & President के रूप में Mr. Ramesh Pandey का official website पर उल्लेख है। Leadership और team की जानकारी Team page पर उपलब्ध है।",
  },
  {
    keys: ["team", "leadership", "नेतृत्व", "टीम", "पदाधिकारी"],
    answer: "SSF की leadership/team information website के Team page पर उपलब्ध है। किसी पद, जिम्मेदारी या current team status के लिए official Team page को प्राथमिकता दें।",
  },
  {
    keys: ["rewa", "madhya pradesh", "मध्य प्रदेश", "रीवा"],
    answer: "SSF का registered office Rewa, Madhya Pradesh में है। संस्था के programmes का scope specific activity और available resources के अनुसार बदल सकता है।",
  },
  {
    keys: ["social media", "facebook", "linkedin", "instagram", "फेसबुक", "लिंक्डइन"],
    answer: "SSF अपने public outreach के लिए social media channels का उपयोग करता है। किसी social-media post को official record मानने से पहले website/annual report/official document से महत्वपूर्ण तथ्य verify करें।",
  },
  {
    keys: ["fake", "real ngo", "genuine", "सच्ची संस्था", "विश्वसनीय"],
    answer: "SSF की registration, compliance documents और annual reports Transparency page पर उपलब्ध कराए गए हैं। संस्था की official information के लिए swastiksrijan.in और official documents को प्राथमिकता दें।",
  },
];

function getBotReply(message) {
  const query = message.toLowerCase().trim();
  const match = FAQS.find(({ keys }) => keys.some((key) => query.includes(key)));
  return match?.answer || UNKNOWN_REPLY;
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
    }, 450);
  };

  return (
    <div className="fixed bottom-24 right-4 md:right-6 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[min(92vw,380px)] rounded-2xl bg-white shadow-2xl border border-zinc-200 overflow-hidden">
          <div className="bg-[#0b3a64] text-white px-4 py-3">
            <p className="text-sm font-bold">Swastik Srijan Foundation Support</p>
            <p className="text-xs text-white/80">Verified information assistant + real team on WhatsApp</p>
          </div>

          <div className="max-h-[330px] overflow-y-auto p-3 space-y-2 bg-zinc-50">
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
