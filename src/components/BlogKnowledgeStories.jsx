import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, X } from "lucide-react";

const KNOWLEDGE_STORIES = [
  {id:101,title:"OTP सुरक्षा: एक छोटी सावधानी, बड़ा बचाव",hi:"ओटीपी किसी के साथ क्यों नहीं साझा करना चाहिए?",image:"/images/protection-ecosystem.png",text:"OTP, PIN, CVV और पासवर्ड जैसी गोपनीय जानकारी किसी व्यक्ति को फोन पर नहीं बतानी चाहिए। बैंक या सेवा प्रदाता बनकर आने वाले संदिग्ध संदेश और कॉल से सावधान रहें।"},
  {id:102,title:"QR Code से भुगतान करते समय सावधानी",hi:"QR स्कैन करना हमेशा पैसे प्राप्त करना नहीं होता",image:"/images/real/news_media_1.jpg",text:"QR Code स्कैन करने से पहले यह समझें कि आप भुगतान कर रहे हैं या पैसा प्राप्त कर रहे हैं। अनजान QR, लिंक या स्क्रीन-शेयर अनुरोध से बचें और UPI PIN कभी साझा न करें।"},
  {id:103,title:"UPI सुरक्षा के 5 आसान नियम",hi:"डिजिटल भुगतान सुरक्षित कैसे रखें?",image:"/images/real/office_banner.jpg",text:"UPI PIN केवल भुगतान के लिए होता है। अनजान collect request स्वीकार न करें, स्क्रीन-शेयरिंग ऐप से बचें, भुगतान से पहले नाम और राशि जांचें और संदिग्ध लेन-देन पर तुरंत अपने बैंक से संपर्क करें।"},
  {id:104,title:"Strong Password क्यों जरूरी है?",hi:"मजबूत पासवर्ड आपकी पहली डिजिटल सुरक्षा है",image:"/images/protection-ecosystem.png",text:"हर महत्वपूर्ण खाते के लिए अलग और लंबा पासवर्ड रखें। जहां संभव हो two-factor authentication चालू करें और पासवर्ड किसी के साथ साझा न करें।"},
  {id:105,title:"Degree और Skill में क्या अंतर है?",hi:"करियर के लिए प्रमाणपत्र के साथ कौशल भी जरूरी है",image:"/images/uploads/learning-hub-1.jpg",text:"Degree आपकी शैक्षणिक योग्यता बताती है, जबकि skill यह दिखाती है कि आप वास्तव में क्या कर सकते हैं। पढ़ाई के साथ communication, computer, problem-solving और practical skills विकसित करना उपयोगी है।"},
  {id:106,title:"Resume की 7 सामान्य गलतियां",hi:"एक अच्छा Resume अवसर तक पहुंच आसान कर सकता है",image:"/images/uploads/learning-hub-2.jpg",text:"Resume में गलत contact details, बहुत लंबा content, spelling mistakes, अस्पष्ट skills और बिना प्रमाण के बड़े दावे से बचें। अपने वास्तविक skills और उपलब्धियों को साफ तरीके से लिखें।"},
  {id:107,title:"हर महीने थोड़ी बचत क्यों?",hi:"छोटी बचत से बड़ी वित्तीय सुरक्षा बन सकती है",image:"/images/real/office_banner.jpg",text:"आय चाहे कम हो या अधिक, नियमित बचत की आदत emergency के समय मदद कर सकती है। जरूरत, बचत और खर्च का सरल रिकॉर्ड रखें तथा किसी भी निवेश से पहले उसकी शर्तें समझें।"},
  {id:108,title:"पेड़ और हमारा भविष्य",hi:"वृक्ष केवल हरियाली नहीं, जीवन का आधार हैं",image:"/images/uploads/tree-planting.jpg",text:"पेड़ छाया, जैव विविधता और पर्यावरणीय संतुलन में महत्वपूर्ण भूमिका निभाते हैं। पौधा लगाना अच्छी शुरुआत है, लेकिन उसकी देखभाल और संरक्षण भी उतना ही जरूरी है।"},
  {id:109,title:"पानी बचाना: घर से शुरू करें",hi:"हर बूंद की कीमत समझें",image:"/images/agriculture.png",text:"नल खुला छोड़ना, अनावश्यक पानी बहाना और रिसाव को नजरअंदाज करना पानी की बर्बादी बढ़ाता है। घर और समुदाय स्तर पर पानी के जिम्मेदार उपयोग की आदत अपनाएं।"},
  {id:110,title:"कचरा अलग करना क्यों जरूरी है?",hi:"गीला और सूखा कचरा अलग करने की आदत",image:"/images/tree-planting-1.jpg",text:"कचरे को स्रोत पर अलग करने से recycling और composting आसान होती है। घर में गीला, सूखा और जहां लागू हो वहां hazardous waste अलग रखने की व्यवस्था करें।"},
  {id:111,title:"बाल सुरक्षा: बच्चों को क्या सिखाएं?",hi:"बच्चों को 'ना' कहने और मदद मांगने का अधिकार दें",image:"/images/real/child-protection-support.jpg",text:"बच्चों को trusted adults, सुरक्षित और असुरक्षित व्यवहार तथा आपात स्थिति में मदद मांगने के बारे में उम्र के अनुसार समझाएं। उनकी बात ध्यान से सुनना भी सुरक्षा का महत्वपूर्ण हिस्सा है।"},
  {id:112,title:"महिला शिक्षा: पूरे परिवार की ताकत",hi:"एक शिक्षित महिला अनेक अवसरों का द्वार खोल सकती है",image:"/images/real/women_empowerment_tailoring.jpg",text:"शिक्षा महिलाओं को जानकारी, निर्णय क्षमता और आर्थिक अवसरों तक पहुंच मजबूत करने में मदद करती है। परिवार और समाज को बेटियों की शिक्षा तथा skill development को प्रोत्साहित करना चाहिए।"},
  {id:113,title:"स्वास्थ्य के लिए रोजमर्रा की आदतें",hi:"छोटी healthy habits, बड़ा फर्क",image:"/images/children-exercise-session.jpg",text:"संतुलित भोजन, पर्याप्त नींद, नियमित शारीरिक गतिविधि और स्वच्छता स्वास्थ्य के महत्वपूर्ण आधार हैं। किसी बीमारी या लगातार लक्षण के लिए योग्य स्वास्थ्य विशेषज्ञ की सलाह लें।"},
  {id:114,title:"तनाव महसूस हो तो क्या करें?",hi:"मानसिक स्वास्थ्य पर बात करना कमजोरी नहीं है",image:"/images/real/boys-group-photo.jpg",text:"तनाव होने पर किसी भरोसेमंद व्यक्ति से बात करना, पर्याप्त आराम, नियमित दिनचर्या और अपनी पसंद की स्वस्थ गतिविधियों के लिए समय देना मददगार हो सकता है। गंभीर या लगातार परेशानी में professional help लेना उचित है।"},
  {id:115,title:"Road Safety: कुछ सेकंड की सावधानी",hi:"सड़क पर नियम अपनी और दूसरों की सुरक्षा के लिए हैं",image:"/images/real/office_banner.jpg",text:"Helmet और seat belt का उपयोग करें, वाहन चलाते समय phone से बचें, speed limits का पालन करें और पैदल यात्रियों का सम्मान करें। सड़क सुरक्षा हर व्यक्ति की साझा जिम्मेदारी है।"},
  {id:116,title:"रक्तदान के बारे में सही जानकारी",hi:"स्वैच्छिक रक्तदान किसी जरूरतमंद के लिए महत्वपूर्ण सहायता हो सकता है",image:"/images/real/news_media_1.jpg",text:"रक्तदान से पहले पात्रता और स्वास्थ्य संबंधी आवश्यकताओं की जांच अधिकृत blood bank या medical team से कराएं। केवल योग्य और सुरक्षित प्रक्रिया के माध्यम से ही रक्तदान करें।"},
  {id:117,title:"आपदा के समय तैयार कैसे रहें?",hi:"Emergency preparedness घर से शुरू होती है",image:"/images/protection-ecosystem.png",text:"महत्वपूर्ण फोन नंबर, basic first-aid सामग्री, जरूरी दस्तावेजों की प्रतियां और परिवार के लिए emergency contact plan तैयार रखना उपयोगी है। स्थानीय प्रशासन की आधिकारिक सलाह को प्राथमिकता दें।"},
  {id:118,title:"स्वयंसेवा का असली अर्थ",hi:"समय, skill और सहयोग भी सेवा हैं",image:"/images/real/women_community_meeting.jpg",text:"Volunteer बनने का अर्थ केवल धन देना नहीं है। शिक्षा, digital skills, awareness, event support, translation या अपने professional skill के माध्यम से भी समाज के लिए योगदान दिया जा सकता है।"},
  {id:119,title:"सोशल मीडिया पर खबर साझा करने से पहले",hi:"Forward करने से पहले Verify करें",image:"/images/real/office_banner.jpg",text:"किसी खबर, फोटो या वीडियो को आगे भेजने से पहले source, date और context जांचें। भावनात्मक या सनसनीखेज संदेश हमेशा सही हों, यह जरूरी नहीं। गलत जानकारी का प्रसार रोकना भी जिम्मेदार नागरिकता है।"},
  {id:120,title:"समाज में सहयोग की संस्कृति",hi:"छोटे सहयोग मिलकर बड़ा बदलाव ला सकते हैं",image:"/images/cultural-event-children.jpg",text:"समाज की प्रगति केवल संस्थाओं की जिम्मेदारी नहीं है। सम्मान, सहयोग, जागरूकता, skill sharing और जरूरतमंद व्यक्ति की सही समय पर सहायता—ये सभी सकारात्मक बदलाव की नींव बन सकते हैं।"},
  {id:121,title:"घर में First-Aid Kit क्यों जरूरी है?",hi:"छोटी चोट या अचानक जरूरत में शुरुआती मदद के लिए तैयार रहें",image:"/images/protection-ecosystem.png",text:"घर में basic First-Aid Kit रखना छोटी चोट, कटने या सामान्य आपात स्थिति में शुरुआती सहायता के लिए उपयोगी हो सकता है। इसमें जरूरी सामग्री रखें, expiry dates जांचते रहें और गंभीर स्थिति में तुरंत medical help लें।"},
  {id:122,title:"घर में Fire Safety क्यों जरूरी है?",hi:"छोटी सावधानी और सही तैयारी जोखिम कम कर सकती है",image:"/images/real/office_banner.jpg",text:"बिजली के तार, गैस और अन्य आग के स्रोतों के आसपास सावधानी रखें। घर में emergency exit और जरूरी फोन नंबर की जानकारी रखें। आग लगने की स्थिति में घबराने के बजाय सुरक्षित स्थान पर जाएं और स्थानीय emergency services की मदद लें।"},
  {id:123,title:"मोबाइल Battery को सुरक्षित कैसे रखें?",hi:"खराब charger और गर्म होती battery को नजरअंदाज न करें",image:"/images/real/news_media_1.jpg",text:"क्षतिग्रस्त cable या charger का उपयोग न करें और असामान्य रूप से गर्म होने वाली battery को नजरअंदाज न करें। फोन को तेज गर्मी से दूर रखें और charging के लिए manufacturer की सुरक्षित accessories व instructions का पालन करें।"},
  {id:124,title:"जरूरी Documents की Digital Copy क्यों रखें?",hi:"जरूरत के समय महत्वपूर्ण जानकारी आसानी से उपलब्ध रहे",image:"/images/uploads/learning-hub-2.jpg",text:"पहचान और अन्य महत्वपूर्ण दस्तावेजों की सुरक्षित digital copy जरूरत के समय उपयोगी हो सकती है। इन्हें सुरक्षित storage में रखें, मजबूत password और two-factor authentication का उपयोग करें और संवेदनशील documents अनजान लोगों से साझा न करें।"},
  {id:125,title:"बारिश के मौसम में घर को कैसे सुरक्षित रखें?",hi:"पानी का रिसाव, बिजली और फिसलन पर समय रहते ध्यान दें",image:"/images/agriculture.png",text:"बारिश के दौरान घर में पानी के रिसाव, फिसलन और बिजली से जुड़े जोखिमों पर ध्यान दें। गीले हाथों से electrical switches न छुएं, खराब wiring को नजरअंदाज न करें और जरूरत होने पर qualified electrician की मदद लें।"},
  {id:126,title:"Emergency Contacts फोन में क्यों जरूरी हैं?",hi:"आपात स्थिति में सही व्यक्ति तक जल्दी पहुंचना आसान हो सकता है",image:"/images/protection-ecosystem.png",text:"परिवार, स्थानीय emergency services और भरोसेमंद संपर्कों के नंबर फोन में पहले से सुरक्षित रखें। जरूरत पड़ने पर फोन लॉक होने की स्थिति के लिए emergency information feature उपलब्ध हो तो उसे भी सही तरीके से सेट करें।"},
];

async function shareStory(story) {
  const url = `${window.location.origin}/Blog#knowledge-${story.id}`;
  const text = `SSF | ${story.title}\n${story.hi}`;
  if (navigator.share) {
    try {
      const imageUrl = new URL(story.image, window.location.origin).href;
      const response = await fetch(imageUrl, { cache: "no-cache" });
      if (response.ok && navigator.canShare) {
        const blob = await response.blob();
        const file = new File([blob], `SSF-Knowledge-${story.id}.jpg`, { type: blob.type || "image/jpeg" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ title: story.title, text: `${text}\n\n${url}`, files: [file] });
          return;
        }
      }
      await navigator.share({ title: story.title, text, url });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`, "_blank", "noopener,noreferrer");
}

export default function BlogKnowledgeStories({ children }) {
  const [active, setActive] = useState(null);
  return <>
    {children}
    <section className="bg-gradient-to-b from-zinc-50 to-white py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#fb8500]">Knowledge & Awareness</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-serif font-bold text-[#002344]">26 नई जानकारी वाली Stories</h2>
          <p className="mt-4 text-zinc-600 max-w-3xl mx-auto">रोजमर्रा की जिंदगी, शिक्षा, डिजिटल सुरक्षा, स्वास्थ्य, पर्यावरण और सामाजिक जागरूकता से जुड़ी उपयोगी जानकारी।</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {KNOWLEDGE_STORIES.map((story) => <motion.article key={story.id} whileHover={{y:-5}} className="overflow-hidden rounded-2xl bg-white text-black shadow-lg border border-zinc-200">
            <div className="aspect-[4/3] overflow-hidden"><img src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" /></div>
            <div className="p-5">
              <p className="text-xs font-bold text-[#fb8500] mb-2">SSF • KNOWLEDGE STORY</p>
              <h3 className="text-xl font-bold text-[#002344]">{story.title}</h3>
              <p className="mt-1 text-sm font-semibold text-zinc-400">{story.hi}</p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{story.text}</p>
              <div className="mt-5 flex gap-2 flex-wrap">
                <button onClick={() => setActive(story)} className="rounded-full bg-[#002344] px-5 py-2.5 text-sm font-bold text-white">पूरी जानकारी →</button>
                <button onClick={() => shareStory(story)} className="inline-flex items-center gap-2 rounded-full border-2 border-[#fb8500] px-4 py-2 text-sm font-bold text-[#002344] hover:bg-[#fb8500] hover:text-white"><Share2 size={16}/> Share</button>
              </div>
            </div>
          </motion.article>)}
        </div>
      </div>
    </section>
    {active && <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center px-4" onClick={() => setActive(null)}>
      <motion.div initial={{scale:.92,opacity:0}} animate={{scale:1,opacity:1}} onClick={(e) => e.stopPropagation()} className="bg-white text-black max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        <div className="relative aspect-[16/9]"><img src={active.image} alt={active.title} className="w-full h-full object-cover"/><button onClick={() => setActive(null)} className="absolute top-4 right-4 rounded-full bg-white p-2 shadow-lg"><X size={20}/></button></div>
        <div className="p-7"><p className="text-xs font-bold text-[#fb8500] uppercase tracking-wider">SSF Knowledge & Awareness</p><h2 className="mt-2 text-3xl font-bold text-[#002344]">{active.title}</h2><p className="mt-1 font-semibold text-zinc-400">{active.hi}</p><p className="mt-6 leading-8 text-zinc-700">{active.text}</p><button onClick={() => shareStory(active)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#fb8500] px-6 py-3 font-bold text-white"><Share2 size={18}/> Share Story</button></div>
      </motion.div>
    </div>}
  </>;
}