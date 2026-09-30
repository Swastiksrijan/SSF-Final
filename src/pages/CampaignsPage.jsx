import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FaGraduationCap, FaHeartbeat, FaHome, FaLeaf, FaHandHoldingHeart,
  FaRupeeSign, FaArrowRight, FaUsers, FaChild, FaLaptopCode,
  FaFemale, FaBullhorn, FaHandsHelping, FaMusic, FaShareAlt,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import PageHero from "../components/PageHero";
import { CONTACT_INFO } from "../config/contact";

const RAZORPAY_LINK = CONTACT_INFO.social.razorpay;
const RAZORPAY_CAMPAIGN_LINKS = {
  education: "", skills: "", womenChild: "", health: "", environment: "",
  agriculture: "", socialJustice: "", disability: "", animal: "", cultural: "",
};

const campaigns = [
  { id:"education", icon:<FaGraduationCap/>, title:"Education", hindi:"शिक्षा अभियान", tagline:"ज्ञान से अवसर, अवसर से विकास", items:["प्राथमिक, माध्यमिक, उच्च माध्यमिक विद्यालय","कॉलेज","कंप्यूटर शिक्षा","नर्सिंग","तकनीकी शिक्षा","प्रतियोगी परीक्षा कोचिंग","पुस्तकालय","विज्ञान मेले"], gradient:"from-[#fb8500] to-[#e76f00]", image:"/images/real/classroom-floor-seating.jpg" },
  { id:"skills", icon:<FaLaptopCode/>, title:"Skill Development", hindi:"कौशल विकास अभियान", tagline:"कौशल से आत्मनिर्भरता", items:["कंप्यूटर प्रशिक्षण","सिलाई-कढ़ाई","स्वरोजगार","व्यावसायिक प्रशिक्षण","ग्रामीण उद्योग","खादी एवं ग्रामोद्योग"], gradient:"from-[#2d6a4f] to-[#1b4332]", image:"/images/real/women_empowerment_tailoring.jpg" },
  { id:"womenChild", icon:<FaFemale/>, title:"Women & Child Development", hindi:"महिला एवं बाल विकास अभियान", tagline:"सशक्त महिला, सुरक्षित और शिक्षित बचपन", items:["महिला सशक्तिकरण","बालिका शिक्षा","भ्रूण हत्या रोकथाम","विधवा सहायता","नारी निकेतन","बालवाड़ी","पोषण कार्यक्रम","SHG (Self Help Groups)"], gradient:"from-[#d90429] to-[#a00320]", image:"/images/real/women_community_meeting.jpg" },
  { id:"health", icon:<FaHeartbeat/>, title:"Health", hindi:"स्वास्थ्य अभियान", tagline:"स्वस्थ समाज, जागरूक समाज", items:["AIDS जागरूकता","कैंसर जागरूकता","कुपोषण","प्राकृतिक चिकित्सा","योग","परिवार कल्याण","नशा मुक्ति","पुनर्वास"], gradient:"from-[#e63946] to-[#9d0208]", image:"/images/real/nutrition_program.jpg" },
  { id:"environment", icon:<FaLeaf/>, title:"Environment", hindi:"पर्यावरण अभियान", tagline:"प्रकृति की रक्षा, भविष्य की सुरक्षा", items:["वृक्षारोपण","जैव विविधता","वन संरक्षण","प्राकृतिक संसाधन संरक्षण","औषधीय पौधे","जैविक खेती","प्राकृतिक ऊर्जा"], gradient:"from-[#40916c] to-[#1b4332]", image:"/images/tree-planting-1.jpg" },
  { id:"agriculture", icon:<FaHome/>, title:"Agriculture & Rural Development", hindi:"कृषि एवं ग्रामीण विकास अभियान", tagline:"गांव मजबूत, देश मजबूत", items:["जैविक खेती","किसानों का प्रशिक्षण","पशुपालन","गौ संरक्षण","ग्रामीण विकास","आजीविका"], gradient:"from-[#588157] to-[#344e41]", image:"https://images.unsplash.com/photo-1707811180272-53a54a905d14?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600" },
  { id:"socialJustice", icon:<FaBullhorn/>, title:"Social Justice", hindi:"सामाजिक न्याय अभियान", tagline:"जागरूक नागरिक, मजबूत समाज", items:["भ्रष्टाचार जागरूकता","नैतिक शिक्षा","राष्ट्रीय एकता","सांप्रदायिक सद्भाव","मानव अधिकार"], gradient:"from-[#264653] to-[#1d3557]", image:"https://images.unsplash.com/photo-1628238218162-1b11b9c5500b?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600" },
  { id:"disability", icon:<FaHandsHelping/>, title:"Disability & Rehabilitation", hindi:"दिव्यांग एवं पुनर्वास अभियान", tagline:"सहयोग, सम्मान और पुनर्वास", items:["दिव्यांग सहायता","मानसिक रूप से कमजोर बच्चों का पुनर्वास","वृद्धजन सहायता","अनाथ सहायता"], gradient:"from-[#6a4c93] to-[#3c096c]", image:"/images/real/disability-rehabilitation.svg" },
  { id:"animal", icon:<FaChild/>, title:"Animal Protection", hindi:"पशु संरक्षण अभियान", tagline:"जीवों के प्रति संवेदना और संरक्षण", items:["पशु-पक्षी संरक्षण","गौशाला","वन्यजीव संरक्षण"], gradient:"from-[#386641] to-[#1b4332]", image:"/images/cow-rescue-mission.jpg" },
  { id:"cultural", icon:<FaMusic/>, title:"Religious & Cultural", hindi:"धार्मिक एवं सांस्कृतिक अभियान", tagline:"संस्कृति, शिक्षा और सद्भाव", items:["भजन","संस्कृत शिक्षा","संगीत","सम्मेलन","सांस्कृतिक कार्यक्रम"], gradient:"from-[#9c6644] to-[#6f4518]", image:"/images/cultural-event-children.jpg" },
];

const shareCampaign = async (campaign) => {
  const url = `${window.location.origin}/campaigns#${campaign.id}`;
  const text = `SSF ${campaign.hindi} — ${campaign.tagline}`;

  if (navigator.share) {
    try {
      const imageUrl = new URL(campaign.image, window.location.origin).href;
      const imageResponse = await fetch(imageUrl, { cache: "no-cache" });
      if (!imageResponse.ok) throw new Error("Campaign image could not be loaded");
      const imageBlob = await imageResponse.blob();
      const mime = imageBlob.type || "image/jpeg";
      const extension = mime.includes("png") ? "png" : "jpg";
      const imageFile = new File([imageBlob], `SSF-${campaign.id}.${extension}`, { type: mime });

      if (navigator.canShare?.({ files: [imageFile] })) {
        await navigator.share({
          title: `SSF | ${campaign.title}`,
          text: `${text}\n\n${url}`,
          files: [imageFile],
        });
        return;
      }

      await navigator.share({ title: `SSF | ${campaign.title}`, text, url });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
};

export default function Campaigns() {
  return <section className="min-h-screen bg-white font-inria">
    <PageHero image="/images/uploads/our-campaigns-collage.jpg" title="Our Campaigns" subtitle="SSF के विभिन्न उद्देश्यों से जुड़े अभियान — जागरूकता, सहभागिता, volunteering, partnership और responsible support के लिए।" hindiSubtitle="आप जिस उद्देश्य से जुड़ना चाहते हैं, उस अभियान को चुनें और सहयोग करें।" />

    <div className="bg-[#002344] py-6"><div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:text-left"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#fb8500]">Support SSF Campaigns</p><p className="mt-1 text-sm text-white/80">अपना पसंदीदा अभियान चुनें और उसी के लिए योगदान करें।</p></div><a href={RAZORPAY_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#fb8500] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#e76f00]"><FaRupeeSign/> Donate via Razorpay</a></div></div>

    <div className="bg-gradient-to-b from-white to-zinc-50 py-20"><div className="mx-auto max-w-6xl px-6">
      <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mx-auto mb-14 max-w-3xl text-center"><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#fb8500]">10 Campaign Areas</p><h2 className="text-4xl font-serif font-bold text-[#002344] md:text-5xl">Our Campaigns | हमारे अभियान</h2><p className="mt-5 text-lg leading-relaxed text-zinc-600">SSF के व्यापक objectives के अनुसार प्रत्येक प्रमुख क्षेत्र को अलग campaign के रूप में प्रस्तुत किया गया है।</p></motion.div>
      <div className="grid gap-7 md:grid-cols-2">
        {campaigns.map((c,i)=>{ const link=RAZORPAY_CAMPAIGN_LINKS[c.id]||RAZORPAY_LINK; const dedicated=Boolean(RAZORPAY_CAMPAIGN_LINKS[c.id]); return <motion.article key={c.id} id={c.id} initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.1}} transition={{duration:.45}} className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-xl">
          <div className="relative h-52 overflow-hidden"><img src={c.image} alt={c.title} className="h-full w-full object-cover transition duration-700 hover:scale-105"/><div className={`absolute inset-0 bg-gradient-to-tr ${c.gradient} opacity-35`}/><div className={`absolute left-5 top-5 rounded-2xl bg-gradient-to-br ${c.gradient} p-4 text-3xl text-white shadow-xl`}>{c.icon}</div><span className="absolute right-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[#002344]">Campaign {String(i+1).padStart(2,"0")}</span></div>
          <div className="p-7"><h3 className="text-2xl font-serif font-bold text-[#002344] md:text-3xl">{c.title}</h3><p className="mt-1 text-sm font-semibold text-zinc-400">{c.hindi}</p><p className={`mt-3 bg-gradient-to-r ${c.gradient} bg-clip-text font-bold text-transparent`}>{c.tagline}</p><div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">{c.items.map(item=><div key={item} className="rounded-xl bg-zinc-50 px-3 py-2 text-sm text-zinc-600">✓ {item}</div>)}</div>
            <div className="mt-5 flex flex-wrap gap-3"><a href={link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${c.gradient} px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5`}><FaRupeeSign/>{dedicated?"Donate to This Campaign":"Donate Now"}</a><button type="button" onClick={()=>shareCampaign(c)} className="inline-flex items-center gap-2 rounded-full border-2 border-[#fb8500] px-5 py-3 text-sm font-bold text-[#002344] transition hover:bg-[#fb8500] hover:text-white" aria-label={`Share ${c.title} campaign photo and link`}><FaShareAlt/> Share Campaign</button><Link to="/DonateAndSupport" className="inline-flex items-center gap-2 rounded-full border-2 border-[#002344] px-5 py-3 text-sm font-bold text-[#002344] transition hover:bg-[#002344] hover:text-white">Details <FaArrowRight/></Link></div>
          </div></motion.article> })}
      </div>
    </div></div>

    <div className="bg-[#fff7ed] py-12"><div className="mx-auto max-w-4xl px-6 text-center"><HiSparkles className="mx-auto text-4xl text-[#fb8500]"/><h3 className="mt-3 text-3xl font-serif font-bold text-[#002344]">हर अभियान में सहभागिता मायने रखती है</h3><p className="mt-3 text-zinc-600">आप स्वयंसेवक बनें, अपनी skill दें, संस्था से जुड़ें या अपनी क्षमता के अनुसार सहयोग करें।</p></div></div>
  </section>;
}
