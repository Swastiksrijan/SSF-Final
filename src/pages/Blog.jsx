import { useState } from "react";
import { motion } from "framer-motion";
import { X, Languages } from "lucide-react";

// 🔹 Blog Data with Hindi translations & Real Images
const BLOG_POSTS = [
  {
    id: 1,
    title: {
      en: "The Gift of Life: Plasma Donation Initiative",
      hi: "जीवन का उपहार: प्लाज्मा दान पहल"
    },
    date: "May 2021",
    image: "/images/real/news_media_1.jpg",
    short: {
      en: "Plasma donation saves lives by providing critical antibodies to patients in need. Learn how SSF supported this cause.",
      hi: "प्लाज्मा दान मरीजों को महत्वपूर्ण एंटीबॉडी प्रदान करके जीवन बचाता है। जानें कि SSF ने इस नेक कार्य में कैसे सहयोग किया।"
    },
    full: {
      en: `Plasma donation is often referred to as 'The Gift of Life.' During the peak of the COVID-19 pandemic, the demand for convalescent plasma skyrocketed, creating a critical bridge between life and death for many. Swastik Srijan Foundation (SSF) recognized this urgency and launched a dedicated Plasma Support Cell.

Our team worked round-the-clock to:
1. Connect verified donors with families in distress.
2. Educate the public about the safety and requirements of plasma donation.
3. Debunk myths surrounding the donation process to encourage more volunteers.

The process involves separating plasma from the blood and returning the remaining components to the donor. It is a safe, painless procedure that can save up to three lives. SSF continues to maintain a registry of blood and plasma donors to respond to future medical emergencies swiftly. Your one donation can be the miracle someone is praying for.`,
      hi: `प्लाज्मा दान को अक्सर 'जीवन का उपहार' कहा जाता है। COVID-19 महामारी के चरम के दौरान, स्वस्थ हो चुके व्यक्तियों के प्लाज्मा की मांग आसमान छू गई, जिससे कई लोगों के लिए जीवन और मृत्यु के बीच एक महत्वपूर्ण पुल बन गया। स्वास्तिक सृजन फाउंडेशन (SSF) ने इस तात्कालिकता को पहचाना और एक समर्पित प्लाज्मा सपोर्ट सेल लॉन्च किया।

हमारी टीम ने चौबीसों घंटे काम किया:
1. संकट में फंसे परिवारों के साथ सत्यापित दाताओं को जोड़ना।
2. जनता को प्लाज्मा दान की सुरक्षा और आवश्यकताओं के बारे में शिक्षित करना।
3. अधिक स्वयंसेवकों को प्रोत्साहित करने के लिए दान प्रक्रिया से जुड़ी भ्रांतियों को दूर करना।

इस प्रक्रिया में रक्त से प्लाज्मा को अलग करना और शेष घटकों को दाता को वापस करना शामिल है। यह एक सुरक्षित, दर्द रहित प्रक्रिया है जो तीन लोगों तक का जीवन बचा सकती है। SSF भविष्य की चिकित्सा आपात स्थितियों का तेजी से जवाब देने के लिए रक्त और प्लाज्मा दाताओं की एक रजिस्ट्री बनाए रखना जारी रखता है। आपका एक दान किसी के लिए चमत्कार साबित हो सकता है जिसकी वे प्रार्थना कर रहे हैं।`
    }
  },
  {
    id: 2,
    title: {
      en: "Masks for All: Community Initiative",
      hi: "सभी के लिए मास्क: सामुदायिक पहल"
    },
    date: "June 2021",
    image: "/images/real/direct-aid-mask.jpg",
    short: {
      en: "SSF distributed free masks to vulnerable communities during the COVID-19 lockdown.",
      hi: "COVID-19 लॉकडाउन के दौरान SSF ने कमजोर समुदायों को मुफ्त मास्क वितरित किए।"
    },
    full: {
      en: `During the COVID-19 pandemic, SSF launched a mask distribution drive after government mandates made mask-wearing compulsory.

Volunteers distributed masks across Noida and nearby areas, especially targeting those who could not afford them. Alongside distribution, awareness sessions on hygiene, mask usage, and social distancing were conducted.

This initiative helped protect hundreds of families and strengthened community trust.`,
      hi: `COVID-19 महामारी के दौरान, सरकारी आदेशों द्वारा मास्क पहनना अनिवार्य किए जाने के बाद SSF ने मास्क वितरण अभियान शुरू किया।

स्वयंसेवकों ने नोएडा और आसपास के क्षेत्रों में मास्क वितरित किए, विशेष रूप से उन लोगों को लक्षित किया जो उन्हें खरीद नहीं सकते थे। वितरण के साथ-साथ, स्वच्छता, मास्क के उपयोग और सामाजिक दूरी पर जागरूकता सत्र आयोजित किए गए।

इस पहल ने सैकड़ों परिवारों की रक्षा करने में मदद की और सामुदायिक विश्वास को मजबूत किया।`
    }
  },
  {
    id: 3,
    title: {
      en: "Dadar School Improvement Program",
      hi: "दादर स्कूल सुधार कार्यक्रम"
    },
    date: "Jan 2022",
    image: "/images/real/classroom-floor-seating.jpg",
    short: {
      en: "Donation of computers and printers led to a 98% improvement in school effectiveness.",
      hi: "कंप्यूटर और प्रिंटर के दान से स्कूल की प्रभावशीलता में 98% सुधार हुआ।"
    },
    full: {
      en: `At Dadar School, SSF donated computers and printers to improve academic efficiency.

Motivational visits encouraged teachers to enhance punctuality and engagement. The program resulted in a 98% success rate and significantly improved teaching quality and student performance.`,
      hi: `दादर स्कूल में, SSF ने शैक्षणिक दक्षता में सुधार के लिए कंप्यूटर और प्रिंटर दान किए।

प्रेरक यात्राओं ने शिक्षकों को समय की पाबंदी और जुड़ाव बढ़ाने के लिए प्रोत्साहित किया। कार्यक्रम के परिणामस्वरूप 98% सफलता दर मिली और शिक्षण गुणवत्ता और छात्र प्रदर्शन में उल्लेखनीय सुधार हुआ।`
    }
  },
  {
    id: 4,
    title: {
      en: "Noida Sector 53 Education Initiative",
      hi: "नोएडा सेक्टर 53 शिक्षा पहल"
    },
    date: "March 2022",
    image: "/images/real/student-leadership-recitation.jpg",
    short: {
      en: "Modern teaching tools transformed student engagement and learning outcomes.",
      hi: "आधुनिक शिक्षण उपकरणों ने छात्र जुड़ाव और सीखने के परिणामों को बदल दिया।"
    },
    full: {
      en: `SSF improved infrastructure and introduced modern teaching aids in Noida Sector 53 schools.

Workshops and motivational sessions helped teachers design customized lesson plans, leading to improved student participation and academic growth.`,
      hi: `SSF ने नोएडा सेक्टर 53 के स्कूलों में बुनियादी ढांचे में सुधार किया और आधुनिक शिक्षण सहायक सामग्री पेश की।

कार्यशालाओं और प्रेरक सत्रों ने शिक्षकों को अनुकूलित पाठ योजनाएं डिजाइन करने में मदद की, जिससे छात्र भागीदारी और शैक्षणिक विकास में सुधार हुआ।`
    }
  },
  {
    id: 5,
    title: {
      en: "A Second Chance: Saving a Dream",
      hi: "एक दूसरा मौका: एक सपने को बचाना"
    },
    date: "Aug 2022",
    image: "/images/real/scholarship_distribution.jpg",
    short: {
      en: "SSF paid pending school fees to save a child's education.",
      hi: "SSF ने एक बच्चे की शिक्षा बचाने के लिए लंबित स्कूल फीस का भुगतान किया।"
    },
    full: {
      en: `A young boy in Noida was on the verge of losing his school admission due to unpaid fees.

SSF stepped in, paid the fees, and ensured uninterrupted education. This support restored hope and strengthened the child's determination to succeed.`,
      hi: `नोएडा में एक युवा लड़का अवैतनिक फीस के कारण अपने स्कूल प्रवेश खोने के कगार पर था।

SSF ने हस्तक्षेप किया, फीस का भुगतान किया, और निर्बाध शिक्षा सुनिश्चित की। इस समर्थन ने आशा बहाल की और बच्चे के सफल होने के दृढ़ संकल्प को मजबूत किया।`
    }
  },
  {
    id: 6,
    title: {
      en: "Empowering Migrants: Hope & Resilience",
      hi: "प्रवासियों को सशक्त बनाना: आशा और लचीलापन"
    },
    date: "Feb 2023",
    image: "/images/real/boys-group-photo.jpg",
    short: {
      en: "SSF supported migrant families with food, clothing, and education kits.",
      hi: "SSF ने प्रवासी परिवारों को भोजन, कपड़े और शिक्षा किट के साथ समर्थन दिया।"
    },
    full: {
      en: `SSF assisted migrant families from Rewa, Madhya Pradesh, relocating to Maharashtra.

Essential supplies, hygiene kits, and educational materials were distributed. Volunteers worked closely with families, fostering trust and hope for a better future.`,
      hi: `SSF ने रीवा, मध्य प्रदेश से महाराष्ट्र में स्थानांतरित हो रहे प्रवासी परिवारों की सहायता की।

आवश्यक आपूर्ति, स्वच्छता किट और शैक्षिक सामग्री वितरित की गई। स्वयंसेवकों ने परिवारों के साथ मिलकर काम किया, बेहतर भविष्य के लिए विश्वास और आशा को बढ़ावा दिया।`
    }
  },
  {
    id: 7,
    title: {
      en: "Empowering Villages for a Stronger Nation",
      hi: "एक मजबूत राष्ट्र के लिए गांवों का सशक्तिकरण"
    },
    date: "Aug 2023",
    image: "/images/real/tree_plantation.jpg",
    short: {
      en: "True national strength lies in our villages. Developing them reduces migration and boosts the economy.",
      hi: "असली राष्ट्रीय शक्ति हमारे गांवों में निहित है। उनका विकास पलायन को कम करता है और अर्थव्यवस्था को बढ़ावा देता है।"
    },
    full: {
      en: `In today’s world, when we talk about the development and sustainability of our nation, we often focus only on cities. However, the true pillar of our strength lies in our villages. If we develop our villages in the right way, the entire country can become a better place.

SSF focuses on opening new job opportunities in every village to curb migration. By promoting agriculture-based industries and vocational training, we ensure that people find employment within their communities. Furthermore, making agriculture sustainable and technologically advanced improves food security and increases farmer income.`,
      hi: `आज की दुनिया में, जब हम राष्ट्र के विकास की बात करते हैं, तो अक्सर केवल शहरों पर ध्यान केंद्रित करते हैं। हालाँकि, हमारी ताकत का असली स्तंभ गांवों में है। यदि हम गांवों का सही विकास करें, तो पूरा देश बेहतर बन सकता है।

SSF पलायन को रोकने के लिए हर गांव में रोजगार के नए अवसर खोलने पर ध्यान केंद्रित करता है। कृषि आधारित उद्योगों और व्यावसायिक प्रशिक्षण को बढ़ावा देकर, हम यह सुनिश्चित करते हैं कि लोगों को अपने समुदायों के भीतर रोजगार मिले। इसके अलावा, कृषि को टिकाऊ और तकनीकी रूप से उन्नत बनाने से खाद्य सुरक्षा में सुधार होता है और किसानों की आय बढ़ती है।`
    }
  },
  {
    id: 8,
    title: {
      en: "SSF: Greening India - Every Step a Blessing",
      hi: "एसएसएफ: हरित भारत - हर कदम एक आशीर्वाद"
    },
    date: "Oct 2023",
    image: "/images/real/tree_planting_2.jpg",
    short: {
      en: "Join the SSF Tree Plantation Movement. Trees are the lungs of our Earth and guardians of biodiversity.",
      hi: "एसएसएफ वृक्षारोपण आंदोलन में शामिल हों। पेड़ हमारी पृथ्वी के फेफड़े और जैव विविधता के संरक्षक हैं।"
    },
    full: {
      en: `In the heart of bustling India, a silent crisis unfolds - the depletion of our precious green cover. The SSF Greening India Initiative is a movement to transform India's landscape, one tree at a time.

Trees are nature's silent warriors battling pollution and climate change. They purify the air, regulate climate, and provide habitat for countless species.

We invite every individual, community, and institution to plant a tree, spread awareness, and embrace sustainable practices. Together, we can turn our nation into a verdant paradise.`,
      hi: `हलचल भरे भारत के बीच, एक मूक संकट सामने आ रहा है - हमारे कीमती हरित आवरण का ह्रास। एसएसएफ ग्रीनिंग इंडिया पहल भारत के परिदृश्य को बदलने का एक आंदोलन है, एक समय में एक पेड़।

पेड़ प्रदूषण और जलवायु परिवर्तन से लड़ने वाले प्रकृति के मूक योद्धा हैं। वे हवा को शुद्ध करते हैं, जलवायु को नियंत्रित करते हैं, और अनगिनत प्रजातियों को आवास प्रदान करते हैं।

हम हर व्यक्ति, समुदाय और संस्था को एक पेड़ लगाने, जागरूकता फैलाने और टिकाऊ प्रथाओं को अपनाने के लिए आमंत्रित करते हैं। साथ मिलकर, हम अपने राष्ट्र को एक हरे-भरे स्वर्ग में बदल सकते हैं।`
    }
  },
  {
    id: 9,
    title: {
      en: "Education for All: Unveiling Commitment",
      hi: "सभी के लिए शिक्षा: प्रतिबद्धता का अनावरण"
    },
    date: "Dec 2023",
    image: "/images/real/office_banner.jpg",
    short: {
      en: "Education is a right, not a privilege. SSF bridges gaps through digital literacy and free coaching.",
      hi: "शिक्षा एक अधिकार है, विशेषाधिकार नहीं। एसएसएफ डिजिटल साक्षरता और मुफ्त कोचिंग के माध्यम से अंतराल को पाटता है।"
    },
    full: {
      en: `In a world where knowledge empowers, Swastik Srijan Foundation stands committed to ensuring education is a right for all. Prioritizing universal learning, we collaborate with government bodies and communities to make education accessible irrespective of socio-economic background.

From providing computers to schools to bridging the digital divide, to running free coaching centers in cities for supplemental education, our initiatives are diverse. Our 'School Chalo Abhiyan' rallies children who haven't had the chance to attend school, ensuring no child is left behind.`,
      hi: `ऐसी दुनिया में जहां ज्ञान सशक्त बनाता है, स्वास्तिक सृजन फाउंडेशन यह सुनिश्चित करने के लिए प्रतिबद्ध है कि शिक्षा सभी का अधिकार है। सार्वभौमिक शिक्षा को प्राथमिकता देते हुए, हम सामाजिक-आर्थिक पृष्ठभूमि की परवाह किए बिना शिक्षा को सुलभ बनाने के लिए सरकारी निकायों और समुदायों के साथ सहयोग करते हैं।

डिजिटल अंतर को पाटने के लिए स्कूलों को कंप्यूटर प्रदान करने से लेकर शहरों में मुफ्त कोचिंग सेंटर चलाने तक, हमारी पहल विविध हैं। हमारा 'स्कूल चलो अभियान' उन बच्चों को रैलियों में शामिल करता है जिन्हें स्कूल जाने का मौका नहीं मिला है, यह सुनिश्चित करते हुए कि कोई भी बच्चा पीछे न रहे।`
    }
  },
  {
    id: 10,
    title: {
      en: "Empowering Women: A Symphony of Change",
      hi: "महिला सशक्तिकरण: परिवर्तन की एक सिम्फनी"
    },
    date: "Jan 2024",
    image: "/images/real/ncw_pledge_certificate.jpg",
    short: {
      en: "Empowering women through self-defense, entrepreneurship support, and legal advocacy.",
      hi: "आत्मरक्षा, उद्यमिता समर्थन और कानूनी वकालत के माध्यम से महिलाओं को सशक्त बनाना।"
    },
    full: {
      en: `Swastik Srijan Foundation is at the forefront of empowering women, recognizing their pivotal role in community development. We are committed to dismantling barriers and providing opportunities for women to realize their full potential.

Our medical outreach programs focus on holistic well-being, while self-defense workshops aim to enhance safety and confidence. We also support women entrepreneurs with mentorship and financial assistance, and actively advocate for their legal rights, ensuring a secure and equitable environment for all.`,
      hi: `स्वास्तिक सृजन फाउंडेशन महिलाओं को सशक्त बनाने में सबसे आगे है, सामुदायिक विकास में उनकी महत्वपूर्ण भूमिका को पहचानता है। हम बाधाओं को दूर करने और महिलाओं को उनकी पूरी क्षमता का एहसास करने के अवसर प्रदान करने के लिए प्रतिबद्ध हैं।

हमारे चिकित्सा आउटरीच कार्यक्रम समग्र कल्याण पर ध्यान केंद्रित करते हैं, जबकि आत्मरक्षा कार्यशालाओं का उद्देश्य सुरक्षा और आत्मविश्वास बढ़ाना है। हम महिला उद्यमियों को परामर्श और वित्तीय सहायता के साथ भी समर्थन करते हैं, और उनके कानूनी अधिकारों के लिए सक्रिय रूप से वकालत करते हैं, जो सभी के लिए एक सुरक्षित और समान वातावरण सुनिश्चित करते हैं।`
    }
  },
  {
    id: 11,
    title: {
      en: "Direct Relief: Supporting Rural Women",
      hi: "प्रत्यक्ष सहायता: ग्रामीण महिलाओं का समर्थन"
    },
    date: "Feb 2024",
    image: "/images/real/gorakhpur-woman-aid.jpg",
    short: {
      en: "SSF reaches the doorsteps of rural families with direct material and financial support.",
      hi: "SSF प्रत्यक्ष सामग्री और वित्तीय सहायता के साथ ग्रामीण परिवारों के दरवाजे तक पहुँचता है।"
    },
    full: {
      en: `Our empowerment mission extends beyond training; we provide direct relief to those in immediate need. By identifying vulnerable women in remote villages, SSF ensures they receive essential supplies and initial financial support to sustain their households.

This direct interaction helps us build a deeper bond with the community and understand their challenges first-hand. Every hand extended is a step towards a more inclusive society.`,
      hi: `हमारा सशक्तिकरण मिशन केवल प्रशिक्षण तक ही सीमित नहीं है; हम उन लोगों को प्रत्यक्ष सहायता प्रदान करते हैं जिन्हें तत्काल आवश्यकता होती है। दूरदराज के गांवों में कमजोर महिलाओं की पहचान करके, SSF यह सुनिश्चित करता है कि उन्हें अपने घरों को चलाने के लिए आवश्यक आपूर्ति और प्रारंभिक वित्तीय सहायता मिले।

यह प्रत्यक्ष बातचीत हमें समुदाय के साथ गहरा संबंध बनाने और उनकी चुनौतियों को प्रत्यक्ष रूप से समझने में मदद करती है। बढ़ाया गया हर एक हाथ एक अधिक समावेशी समाज की ओर एक कदम है।`
    }
  },
  {
    id: 12,
    title: {
      en: "Mission Compassion: Local Animal Rescue",
      hi: "मिशन करुणा: स्थानीय पशु बचाव"
    },
    date: "March 2024",
    image: "/images/real/cow-rescue.jpg",
    short: {
      en: "Rescuing animals in distress is a core part of our commitment to a balanced ecosystem.",
      hi: "संकट में फंसे पशुओं को बचाना संतुलित पारिस्थितिकी तंत्र के प्रति हमारी प्रतिबद्धता का एक मुख्य हिस्सा है।"
    },
    full: {
      en: `At Swastik Srijan Foundation, we believe that 'Seva' (Service) extends to all living beings. Recently, our volunteers successfully rescued a cow from a deep village ditch, showing that no life is too small for our attention.

Our animal welfare wing works to protect strays and wildlife, providing medical care and emergency response. We encourage everyone to be compassionate towards the creatures we share our environment with.`,
      hi: `स्वास्तिक सृजन फाउंडेशन में, हमारा मानना है कि 'सेवा' सभी जीवित प्राणियों तक विस्तृत है। हाल ही में, हमारे स्वयंसेवकों ने एक गहरे ग्रामीण गड्ढे से एक गाय को सफलतापूर्वक बचाया, यह दिखाते हुए कि हमारे ध्यान के लिए कोई भी जीवन छोटा नहीं है।

हमारा पशु कल्याण विंग लावारिस पशुओं और वन्यजीवों की रक्षा के लिए काम करता है, चिकित्सा देखभाल और आपातकालीन प्रतिक्रिया प्रदान करता है। हम सभी को उन प्राणियों के प्रति दयालु होने के लिए प्रोत्साहित करते हैं जिनके साथ हम अपना वातावरण साझा करते हैं।`
    }
  },
  {
    id: 13,
    title: {
      en: "Fit Bharat: Promoting Physical Wellness",
      hi: "फिट भारत: शारीरिक स्वास्थ्य को बढ़ावा देना"
    },
    date: "April 2024",
    image: "/images/real/park-activity-session.jpg",
    short: {
      en: "Starting the day with fitness programs ensures a healthy mind in a healthy body for our students.",
      hi: "फिटनेस कार्यक्रमों के साथ दिन की शुरुआत हमारे छात्रों के लिए स्वस्थ शरीर में स्वस्थ दिमाग सुनिश्चित करती है।"
    },
    full: {
      en: `A healthy nation starts with healthy children. SSF has integrated physical training and exercise sessions into our daily education modules. These sessions not only improve physical fitness but also instill discipline and team spirit among rural students.

From yoga to group exercises, our students learn the importance of maintaining an active lifestyle from a young age. This holistic approach ensures they are ready to face future challenges with energy and confidence.`,
      hi: `एक स्वस्थ राष्ट्र की शुरुआत स्वस्थ बच्चों से होती है। SSF ने हमारे दैनिक शिक्षा मॉड्यूल में शारीरिक प्रशिक्षण और व्यायाम सत्रों को एकीकृत किया है। ये सत्र न केवल शारीरिक फिटनेस में सुधार करते हैं बल्कि ग्रामीण छात्रों के बीच अनुशासन और टीम भावना भी पैदा करते हैं।

योग से लेकर समूह व्यायाम तक, हमारे छात्र कम उम्र से ही सक्रिय जीवनशैली बनाए रखने का महत्व सीखते हैं। यह समग्र दृष्टिकोण सुनिश्चित करता है कि वे ऊर्जा और आत्मविश्वास के साथ भविष्य की चुनौतियों का सामना करने के लिए तैयार हैं।`
    }
  },
  {
    id: 14,
    title: {
      en: "Virasat: Celebrating Cultural Roots",
      hi: "विरासत: सांस्कृतिक जड़ों का उत्सव"
    },
    date: "May 2024",
    image: "/images/real/community-bhajan.jpg",
    short: {
      en: "Cultural performances by our students help preserve local traditions and build stage confidence.",
      hi: "हमारे छात्रों द्वारा सांस्कृतिक प्रदर्शन स्थानीय परंपराओं को संरक्षित करने और मंच पर आत्मविश्वास बढ़ाने में मदद करते हैं।"
    },
    full: {
      en: `Culture is the soul of our community. SSF National Academy regularly organizes cultural events where children showcase traditional dances, music, and plays. These celebrations provide a platform for rural talent and help students connect with their rich heritage.

Events like 'Virasat' (Heritage) encourage creative expression and help in the all-round personality development of every child involved.`,
      hi: `संस्कृति हमारे समुदाय की आत्मा है। एसएसएफ नेशनल अकादमी नियमित रूप से सांस्कृतिक कार्यक्रमों का आयोजन करती है जहां बच्चे पारंपरिक नृत्य, संगीत और नाटक प्रदर्शित करते हैं। ये उत्सव ग्रामीण प्रतिभाओं के लिए एक मंच प्रदान करते हैं और छात्रों को उनकी समृद्ध विरासत से जुड़ने में मदद करते हैं।

'विरासत' जैसे कार्यक्रम रचनात्मक अभिव्यक्ति को प्रोत्साहित करते हैं और इसमें शामिल हर बच्चे के चहुंमुखी व्यक्तित्व विकास में मदद करते हैं।`
    }
  }
];

export default function Blogs() {
  const [activePost, setActivePost] = useState(null);
  const [language, setLanguage] = useState("en"); // en or hi

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "hi" : "en");
  };

  return (
    <main className="pt-28 bg-black min-h-screen text-white px-4">
      {/* ===== Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="flex justify-center items-center gap-4 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            {language === "en" ? "Our Impact Stories" : "हमारी प्रभाव कहानियाँ"}
          </h1>
          <button
            onClick={toggleLanguage}
            className="bg-[#003366] hover:bg-[#004488] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            title={language === "en" ? "Switch to Hindi" : "Switch to English"}
          >
            <Languages size={20} />
            <span className="text-sm font-semibold">{language === "en" ? "हिं" : "EN"}</span>
          </button>
        </div>
        <p className="text-zinc-400">
          {language === "en"
            ? "Real stories of change, compassion, and community upliftment."
            : "परिवर्तन, करुणा और सामुदायिक उत्थान की वास्तविक कहानियाँ।"}
        </p>
      </motion.div>

      {/* ===== Blog Grid ===== */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {BLOG_POSTS.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ y: -6 }}
            className="bg-white text-black rounded-2xl overflow-hidden shadow-xl"
          >
            {/* Image */}
            <div className="w-full aspect-[4/3] overflow-hidden">
              <img
                src={post.image}
                alt={post.title[language]}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm text-zinc-500 mb-1">{post.date}</p>
              <h3 className="text-xl font-bold mb-2">{post.title[language]}</h3>
              <p className="text-zinc-700 text-sm mb-4">{post.short[language]}</p>

              <button
                onClick={() => setActivePost(post)}
                className="text-[#003366] font-semibold hover:underline"
              >
                {language === "en" ? "Read More →" : "और पढ़ें →"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ===== Modal ===== */}
      {activePost && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white text-black max-w-3xl w-full rounded-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto"
          >
            {/* Close */}
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <X />
            </button>

            {/* Modal Image */}
            <div className="w-full aspect-[16/9]">
              <img
                src={activePost.image}
                alt={activePost.title[language]}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-2">
                {activePost.title[language]}
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                {activePost.date}
              </p>
              <p className="text-zinc-700 leading-relaxed whitespace-pre-line">
                {activePost.full[language]}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
