import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaGraduationCap, FaHeartbeat, FaBriefcase, FaFemale, FaLeaf, FaTractor,
  FaBalanceScale, FaWheelchair, FaPaw, FaMusic, FaShareAlt, FaArrowRight,
  FaClipboardCheck, FaBullhorn, FaWhatsapp
} from "react-icons/fa";
import PageHero from "../components/PageHero";
import { CONTACT_INFO } from "../config/contact";

const RAZORPAY_LINK = CONTACT_INFO.social.razorpay;

const campaigns = [
  { id:"education", title:"Education", hindi:"शिक्षा अभियान", tagline:"ज्ञान से अवसर, अवसर से विकास", icon:<FaGraduationCap/>, image:"/images/real/classroom-floor-seating.jpg", items:["विद्यालय एवं कॉलेज शिक्षा","कंप्यूटर एवं डिजिटल शिक्षा","पुस्तकालय और अध्ययन सामग्री","तकनीकी शिक्षा एवं प्रतियोगी परीक्षा मार्गदर्शन"], appeal:"किसी बच्चे और युवा की सीखने की यात्रा में सहयोग करें।" },
  { id:"skills", title:"Skill Development", hindi:"कौशल एवं आजीविका विकास", tagline:"कौशल से आत्मनिर्भरता", icon:<FaBriefcase/>, image:"/images/real/women_empowerment_tailoring.jpg", items:["कंप्यूटर एवं व्यावसायिक प्रशिक्षण","सिलाई-कढ़ाई एवं हस्तकौशल","स्वरोजगार और ग्रामीण उद्योग","खादी एवं ग्रामोद्योग"], appeal:"कौशल, अवसर और आत्मनिर्भरता की शुरुआत में साथ दें।" },
  { id:"women-child", title:"Women & Child Development", hindi:"महिला एवं बाल विकास", tagline:"सशक्त महिला, सुरक्षित और शिक्षित बचपन", icon:<FaFemale/>, image:"/images/real/women_community_meeting.jpg", items:["महिला सशक्तिकरण एवं बालिका शिक्षा","पोषण एवं बाल विकास","विधवा और जरूरतमंद महिलाओं का सहयोग","स्वयं सहायता समूह"], appeal:"महिलाओं और बच्चों के बेहतर भविष्य के लिए सहयोग करें।" },
  { id:"health", title:"Health & Well-being", hindi:"स्वास्थ्य एवं कल्याण", tagline:"स्वस्थ समाज, जागरूक समाज", icon:<FaHeartbeat/>, image:"/images/real/nutrition_program.jpg", items:["स्वास्थ्य एवं पोषण जागरूकता","योग एवं प्राकृतिक चिकित्सा","नशा मुक्ति एवं परिवार कल्याण","पुनर्वास संबंधी प्रयास"], appeal:"स्वस्थ और जागरूक समुदाय बनाने में भागीदार बनें।" },
  { id:"environment", title:"Environment", hindi:"पर्यावरण संरक्षण", tagline:"प्रकृति की रक्षा, भविष्य की सुरक्षा", icon:<FaLeaf/>, image:"/images/tree-planting-1.jpg", items:["वृक्षारोपण एवं जैव विविधता","वन एवं प्राकृतिक संसाधन संरक्षण","औषधीय पौधे एवं जैविक खेती","प्राकृतिक ऊर्जा एवं स्वच्छता"], appeal:"प्रकृति और आने वाली पीढ़ियों के लिए योगदान दें।" },
  { id:"agriculture", title:"Agriculture & Rural Development", hindi:"कृषि एवं ग्रामीण विकास", tagline:"गांव मजबूत, देश मजबूत", icon:<FaTractor/>, image:"https://images.unsplash.com/photo-1707811180272-53a54a905d14?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600", items:["किसान प्रशिक्षण एवं जैविक खेती","पशुपालन एवं गौ संरक्षण","ग्रामीण विकास एवं आजीविका","कृषि आधारित स्थानीय अवसर"], appeal:"गांवों में अवसर और आजीविका बढ़ाने के प्रयासों से जुड़ें।" },
  { id:"social-justice", title:"Social Justice & Awareness", hindi:"सामाजिक न्याय एवं जागरूकता", tagline:"जागरूक नागरिक, मजबूत समाज", icon:<FaBalanceScale/>, image:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=85&w=1600", items:["मानव अधिकार एवं नागरिक जागरूकता","नैतिक शिक्षा एवं राष्ट्रीय एकता","सामाजिक सद्भाव","भ्रष्टाचार के विरुद्ध जन-जागरूकता"], appeal:"जागरूक, समान और संवेदनशील समाज के निर्माण में सहयोग करें।" },
  { id:"disability-rehabilitation", title:"Disability, Elderly & Rehabilitation", hindi:"दिव्यांग, वृद्धजन एवं पुनर्वास", tagline:"सहयोग, सम्मान और पुनर्वास", icon:<FaWheelchair/>, image:"/images/real/disability-rehabilitation.svg", items:["दिव्यांगजनों के लिए सहायता","वृद्धजन कल्याण","विशेष आवश्यकता वाले बच्चों का पुनर्वास","अनाथ एवं जरूरतमंदों का सहयोग"], appeal:"सम्मान, समावेशन और सहारा देने वाली पहल का साथ दें।" },
  { id:"animal-protection", title:"Animal & Bird Protection", hindi:"पशु-पक्षी संरक्षण", tagline:"जीवों के प्रति संवेदना और संरक्षण", icon:<FaPaw/>, image:"/images/cow-rescue-mission.jpg", items:["पशु-पक्षी संरक्षण","गौ संरक्षण एवं देखभाल","वन्यजीव संरक्षण जागरूकता"], appeal:"बेजुबान जीवों की सुरक्षा और देखभाल में सहयोग करें।" },
  { id:"religious-cultural", title:"Culture & Values", hindi:"धार्मिक एवं सांस्कृतिक", tagline:"संस्कृति, शिक्षा और सद्भाव", icon:<FaMusic/>, image:"/images/cultural-event-children.jpg", items:["संगीत एवं सांस्कृतिक कार्यक्रम","संस्कृत एवं मूल्य शिक्षा","सम्मेलन एवं सामाजिक सद्भाव"], appeal:"संस्कृति, शिक्षा और सद्भाव को आगे बढ़ाने में साथ दें।" },
];

export default function CampaignsPage() {
  const [copied, setCopied] = useState("");
  const campaignUrl = (campaign) => `${window.location.origin}/Campaigns#${campaign.id}`;
  const shareCampaign = async (campaign) => {
    const url = campaignUrl(campaign);
    const message = `Swastik Srijan Foundation Samiti | ${campaign.hindi}\n${campaign.appeal}\n\nअभियान देखें: ${url}\nसहयोग: ${RAZORPAY_LINK}`;
    if (navigator.share) {
      try { await navigator.share({ title: `SSF | ${campaign.title}`, text: message, url }); return; }
      catch (error) { if (error?.name === "AbortError") return; }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };
  const copyCampaign = async (campaign) => {
    const message = `Swastik Srijan Foundation Samiti | ${campaign.hindi}\n${campaign.appeal}\n${campaignUrl(campaign)}\nDonate: ${RAZORPAY_LINK}`;
    try { await navigator.clipboard.writeText(message); setCopied(campaign.id); }
    catch { shareCampaign(campaign); }
  };

  return <section className="min-h-screen bg-white font-inria">
    <PageHero image="/images/real/community-education-meeting.jpg" title="Our Campaigns | हमारे अभियान" subtitle="SSF के सभी प्रमुख पंजीकृत उद्देश्य क्षेत्रों के लिए अलग-अलग सहयोग अभियान।" hindiSubtitle="अपनी पसंद का उद्देश्य चुनें, सहयोग करें और अभियान को अपने नेटवर्क तक पहुँचाएँ।" />
    <div className="bg-[#002344] px-5 py-10 text-white"><div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#ffb347]">10 objective areas · 10 campaign themes</p><h2 className="mt-2 text-2xl font-black md:text-3xl">एक उद्देश्य चुनें, उसके लिए आवाज़ उठाएँ</h2><p className="mt-2 max-w-3xl text-sm leading-7 text-white/75">ये संस्था के व्यापक पंजीकृत उद्देश्य क्षेत्रों पर आधारित प्रस्तावित अभियान हैं। गतिविधियाँ संसाधन, समुदाय की आवश्यकता, व्यवहार्यता और आवश्यक अनुमतियों के अनुसार शुरू होंगी।</p></div><a href={RAZORPAY_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#fb8500] px-6 py-3 font-extrabold text-[#17212b]">Donate via Razorpay <FaArrowRight/></a></div></div>

    <div className="bg-gradient-to-b from-white to-[#EAF0F6] py-16 md:py-20"><div className="mx-auto max-w-7xl px-5">
      <div className="mb-10 max-w-3xl"><p className="text-xs font-black uppercase tracking-[.2em] text-[#176447]">Choose a cause</p><h2 className="mt-2 text-3xl font-black text-[#002344] md:text-4xl">हर उद्देश्य का अपना अभियान</h2><p className="mt-3 leading-7 text-slate-600">हर कार्ड का अपना shareable link और तैयार संदेश है। Donate बटन फिलहाल संस्था के मौजूदा आधिकारिक Razorpay checkout पर जाता है।</p></div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {campaigns.map((c,i)=><motion.article key={c.id} id={c.id} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.1}} className="flex scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="relative h-48 overflow-hidden"><img src={c.image} alt={c.title} className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-[#002344]/75 to-transparent"/><span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-2 text-xs font-black text-[#002344]">CAMPAIGN {String(i+1).padStart(2,"0")}</span><span className="absolute bottom-4 right-5 text-3xl text-white">{c.icon}</span></div>
          <div className="flex flex-1 flex-col p-6"><h3 className="text-xl font-black text-[#002344]">{c.hindi}</h3><p className="mt-1 text-sm font-bold text-[#176447]">{c.title}</p><p className="mt-3 text-sm font-semibold text-slate-700">{c.tagline}</p><ul className="mt-4 flex-1 space-y-2">{c.items.map(item=><li key={item} className="flex gap-2 text-sm leading-6 text-slate-600"><span className="font-black text-[#176447]">✓</span>{item}</li>)}</ul><p className="mt-4 rounded-xl bg-[#F1F6F3] p-3 text-sm font-bold leading-6 text-[#002344]">{c.appeal}</p>
            <div className="mt-5 grid grid-cols-2 gap-2"><a href={RAZORPAY_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176447] px-3 py-3 text-sm font-extrabold text-white">Donate <FaArrowRight/></a><button type="button" onClick={()=>shareCampaign(c)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-3 text-sm font-extrabold text-[#002344] hover:bg-slate-50"><FaWhatsapp/> Share</button></div>
            <button type="button" onClick={()=>copyCampaign(c)} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[#176447] hover:bg-[#F1F6F3]"><FaShareAlt/>{copied===c.id?"Campaign message copied":"Copy campaign post"}</button>
          </div>
        </motion.article>)}
      </div>
    </div></div>

    <div className="bg-white px-5 py-16"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
      <div><p className="text-xs font-black uppercase tracking-[.2em] text-[#176447]">How to support</p><h2 className="mt-3 text-3xl font-black text-[#002344]">आपका सहयोग कैसे दर्ज होगा?</h2><ol className="mt-5 space-y-3 text-sm leading-7 text-slate-600"><li><b className="text-[#002344]">1. अभियान चुनें:</b> अपनी पसंद का उद्देश्य चुनें और उसका संदेश साझा करें।</li><li><b className="text-[#002344]">2. भुगतान करें:</b> Razorpay checkout पर भुगतान से पहले beneficiary का नाम और विवरण सत्यापित करें।</li><li><b className="text-[#002344]">3. उद्देश्य बताएं:</b> भुगतान के बाद Donate पेज के Donor Details form में चुना गया अभियान और transaction details दें ताकि संस्था रिकॉर्ड का मिलान कर सके।</li><li><b className="text-[#002344]">4. रिपोर्टिंग:</b> सत्यापित परियोजना प्रगति और उपयोग संबंधी अपडेट उपलब्ध होने पर प्रकाशित किए जाएँगे।</li></ol></div>
      <div className="rounded-3xl bg-[#002344] p-7 text-white"><FaClipboardCheck className="text-3xl text-[#ffb347]"/><h3 className="mt-4 text-2xl font-black">पारदर्शिता और जरूरी जानकारी</h3><p className="mt-3 text-sm leading-7 text-white/75">अभी हर अभियान के लिए अलग payment link, target amount या live collection figure उपलब्ध नहीं है। इसलिए सभी Donate buttons मौजूदा सामान्य Razorpay checkout पर जाते हैं; campaign-wise collection तभी अलग दिखेगा जब अलग payment links/accounting व्यवस्था बनाई जाएगी।</p><p className="mt-3 text-sm leading-7 text-white/75">ये अभियान प्रस्तावित उद्देश्य क्षेत्रों को प्रस्तुत करते हैं—हर गतिविधि के अभी संचालित होने का दावा नहीं। 80G लाभ का दावा केवल संबंधित तारीख पर वैध स्वीकृति और आवश्यक प्रमाण होने पर करें। विदेशी अंशदान से पहले FCRA स्थिति की पुष्टि करें।</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/Donate" className="rounded-full bg-[#fb8500] px-5 py-3 font-extrabold text-[#17212b]">Donation details</Link><Link to="/Contact" className="rounded-full border border-white/35 px-5 py-3 font-extrabold text-white">Contact SSF</Link></div></div>
    </div></div>
  </section>;
}
