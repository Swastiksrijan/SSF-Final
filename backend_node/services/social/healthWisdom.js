// Series 3 — स्वास्थ्य ज्ञान (Charak Samhita / Ayurveda daily wisdom) — रोज़ एक अध्याय.
//
// Objective (नियमावली): उद्देश्य 2, 3, 7 — स्वास्थ्य, प्राकृतिक चिकित्सा, जन-जागरूकता।
//
// SAFETY: This shares the GENERAL, non-controversial well-being principles of
// Charak Samhita (daily routine, seasonal routine, diet discipline, sleep,
// moderation). It makes NO claim to diagnose or cure any disease, prescribes no
// medicine or dose, and every post carries the disclaimer to consult a qualified
// doctor. It never tells a reader to stop prescribed treatment.
//
// Bilingual (EN + HI).

const { CH, T } = require('./seriesEngine');

const items = [
  CH(
    T('Dincharya — the daily routine that keeps health steady', 'दिनचर्या — स्वास्थ्य स्थिर रखने वाली दैनिक दिनचर्या'),
    T('Health is built by small habits repeated daily.', 'स्वास्थ्य रोज़ दोहराई जाने वाली छोटी आदतों से बनता है।'),
    [
      T('Waking early, cleansing, gentle movement and a calm mind begin the day.', 'जल्दी उठना, शुद्धि, हल्का व्यायाम एवं शांत मन दिन की शुरुआत करते हैं।'),
      T('Charak Samhita advises an early, light, timely breakfast and a regular sleep time.', 'चरक संहिता जल्दी, हल्का, समय पर नाश्ता और नियमित सोने का समय बताती है।'),
      T('A fixed daily rhythm helps digestion, sleep and mood.', 'स्थिर दैनिक लय पाचन, नींद एवं मनोदशा में मदद करती है।'),
    ],
    T('A family that wakes and sleeps at fixed times tends to fall ill less often.', 'जो परिवार निश्चित समय पर उठता-सोता है, वह कम बीमार पड़ता है।'),
    T('Set one fixed sleep time tonight and one fixed waking time tomorrow.', 'आज रात एक निश्चित सोने का समय तय करें और कल एक निश्चित जागने का समय।'),
    T('Routine is medicine that costs nothing.', 'दिनचर्या वह औषधि है जो कुछ मूल्य की नहीं।'),
    T('This is general well-being guidance, not a treatment — for any illness consult a doctor.', 'यह सामान्य स्वास्थ्य मार्गदर्शन है, उपचार नहीं — किसी रोग में डॉक्टर से मिलें।'),
  ),
  CH(
    T('Ritu-achar — living well with the seasons', 'ऋतु-आचरण — ऋतुओं के अनुसार जीवन'),
    T('Change your habits as the season changes.', 'मौसम बदले तो आदतें भी बदलें।'),
    [
      T('Charak Samhita advises adjusting food, clothing and activity with each season.', 'चरक संहिता प्रत्येक ऋतु के अनुसार आहार, वस्त्र एवं गतिविधि बदलने की सलाह देती है।'),
      T('Cool seasons suit warmer, nourishing food; hot months suit light, hydrating food.', 'ठंडी ऋतु में गर्म, पौष्टिक भोजन; गर्म महीनों में हल्का, तरलयुक्त भोजन।'),
      T('Protecting against extreme heat, cold and damp prevents many seasonal illnesses.', 'अत्यधिक गर्मी, ठंड एवं नमी से बचाव कई मौसमी रोगों को रोकता है।'),
    ],
    T('In the rainy season, drinking boiled/filtered water prevents water-borne disease.', 'वर्षा ऋतु में उबला/छना जल पीना जल-जनित रोग रोकता है।'),
    T('Change one food or clothing habit to match this season.', 'इस ऋतु के अनुसार भोजन या वस्त्र की एक आदत बदलें।'),
    T('Seasonal living is simple prevention.', 'ऋतु-अनुसार जीवन एक सरल बचाव है।'),
    T('Follow local health advice in extreme weather — this is guidance, not a prescription.', 'अत्यधिक मौसम में स्थानीय स्वास्थ्य सलाह मानें — यह मार्गदर्शन है, नुस्खा नहीं।'),
  ),
  CH(
    T('Aahar — eat with attention, not in a hurry', 'आहार — ध्यान से खाएँ, जल्दबाज़ी में नहीं'),
    T('How you eat matters as much as what you eat.', 'क्या खाते हैं उतना ही ज़रूरी है कि कैसे खाते हैं।'),
    [
      T('Eat only when hungry, at regular times, sitting calmly and chewing well.', 'भूख लगने पर ही, नियमित समय पर, शांत बैठकर एवं अच्छी तरह चबाकर खाएँ।'),
      T('Warm, freshly cooked, moderate food suits most people better than cold or stale food.', 'गर्म, ताज़ा पका, संतुलित भोजन ठंडे या बासी भोजन से अधिकांश के लिए बेहतर है।'),
      T('Overeating burdens digestion; the habit of a light, early dinner helps sleep.', 'अधिक खाना पाचन पर बोझ है; हल्का, जल्दी रात्रि भोजन नींद में मदद करता है।'),
    ],
    T('A person who eats slowly and stops at "nearly full" often feels lighter all day.', 'जो धीरे खाता है और "लगभग भर" पर रुक जाता है, वह दिनभर हल्का महसूस करता है।'),
    T('Avoid screens during one meal today and eat with full attention.', 'आज एक भोजन स्क्रीन के बिना, पूरे ध्यान से करें।'),
    T('Mindful eating prevents many digestion problems.', 'सजग भोजन कई पाचन समस्याएँ रोकता है।'),
    T('Real diet problems need a doctor or dietician — do not self-medicate.', 'असली आहार समस्याओं में डॉक्टर या आहार-विशेषज्ञ से मिलें — स्वयं दवा न लें।'),
  ),
  CH(
    T('Nidra — sleep is not laziness, it is repair', 'निद्रा — नींद आलस्य नहीं, मरम्मत है'),
    T('No medicine replaces good sleep.', 'अच्छी नींद की भरपाई कोई दवा नहीं करती।'),
    [
      T('Charak Samhita treats healthy sleep as one of the three pillars of good health.', 'चरक संहिता स्वस्थ निद्रा को अच्छे स्वास्थ्य के तीन स्तंभों में मानती है।'),
      T('A dark, quiet room and a fixed sleep time improve sleep quality.', 'अंधेरा, शांत कमरा एवं निश्चित सोने का समय नींद की गुणवत्ता सुधारते हैं।'),
      T('Daytime over-sleeping and staying awake late night both disturb the body clock.', 'दिन में अधिक सोना एवं रात में देर तक जागना दोनों शरीर की घड़ी बिगाड़ते हैं।'),
    ],
    T('A student who sleeps 7–8 hours at a fixed time concentrates better in school.', 'जो विद्यार्थी निश्चित समय पर 7–8 घंटे सोता है, वह स्कूल में बेहतर ध्यान देता है।'),
    T('Keep phones away from the bed for one night and note how you feel.', 'एक रात फोन को बिस्तर से दूर रखें और महसूस करें।'),
    T('Sleep is when the body repairs itself.', 'नींद में शरीर स्वयं की मरम्मत करता है।'),
    T('Persistent sleeplessness is a medical matter — consult a doctor.', 'लगातार अनिद्रा एक चिकित्सकीय विषय है — डॉक्टर से परामर्श करें।'),
  ),
  CH(
    T('Water and hydration — simple, powerful', 'जल एवं जलसंतुलन — सरल, शक्तिशाली'),
    T('Most headaches and tiredness are mild dehydration.', 'अधिकांश सिरदर्द एवं थकान हल्की जल-कमी हैं।'),
    [
      T('Drink clean water through the day; do not wait until you are very thirsty.', 'दिनभर स्वच्छ जल पिएँ; बहुत प्यास लगने तक न रुकें।'),
      T('In heat and after exertion, the body needs more water.', 'गर्मी में एवं श्रम के बाद शरीर को अधिक जल चाहिए।'),
      T('Always prefer boiled or filtered water where supply is uncertain.', 'जहाँ जल-आपूर्ति अनिश्चित हो, वहाँ उबला या छना जल ही पिएँ।'),
    ],
    T('A field worker who drinks water hourly avoids afternoon headaches.', 'खेत में घंटे-घंटे पानी पीने वाला मज़दूर दोपहर के सिरदर्द से बचता है।'),
    T('Keep a filled water bottle where you sit and finish it by evening.', 'जहाँ बैठते हैं वहाँ भरी पानी की बोतल रखें और शाम तक पूरी करें।'),
    T('Water is the cheapest health habit.', 'जल सबसे सस्ती स्वास्थ्य आदत है।'),
    T('People with kidney or heart conditions must follow their doctor\'s fluid advice.', 'गुर्दा या हृदय रोग वाले लोग डॉक्टर की तरल-सलाह का पालन करें।'),
  ),
  CH(
    T('Vyayama — movement for every age', 'व्यायाम — हर उम्र हेतु गति'),
    T('A body that moves stays younger longer.', 'जो शरीर चलता-फिरता है वह अधिक समय तक जवान रहता है।'),
    [
      T('Regular, moderate exercise (walking, yoga, household work) keeps joints and heart healthy.', 'नियमित, संतुलित व्यायाम (चलना, योग, घरेलू कार्य) जोड़ एवं हृदय स्वस्थ रखता है।'),
      T('Exercise to about half your capacity — stop before exhaustion.', 'अपनी क्षमता के लगभग आधे तक व्यायाम करें — थकान से पहले रुकें।'),
      T('Children, adults and elders each need suitable, safe movement — not the same routine.', 'बच्चों, वयस्कों एवं वृद्धों को उपयुक्त, सुरक्षित गति चाहिए — एक ही दिनचर्या नहीं।'),
    ],
    T('A 30-minute daily walk lowers risk of many lifestyle diseases.', 'रोज़ 30 मिनट की सैर कई जीवनशैली रोगों का जोखिम घटाती है।'),
    T('Take a 20-minute walk today, ideally with a family member.', 'आज 20 मिनट की सैर करें, संभव हो तो परिवार के साथ।'),
    T('Movement is the free medicine for body and mind.', 'गति शरीर एवं मन की निःशुल्क औषधि है।'),
    T('Stop exercise at once if you feel chest pain or dizziness, and seek medical help.', 'व्यायाम में सीने में दर्द या चक्कर आए तो तुरंत रोकें और चिकित्सकीय सहायता लें।'),
  ),
  CH(
    T('Manas — a calm mind is part of health', 'मन — शांत मन स्वास्थ्य का अंग है'),
    T('Mental health is health, not weakness.', 'मानसिक स्वास्थ्य स्वास्थ्य है, कमज़ोरी नहीं।'),
    [
      T('Charak Samhita links a peaceful mind to good digestion, sleep and immunity.', 'चरक संहिता शांत मन को अच्छे पाचन, नींद एवं प्रतिरक्षा से जोड़ती है।'),
      T('Breathing slowly, prayer/meditation, and time in nature calm the mind.', 'धीमी श्वास, प्रार्थना/ध्यान एवं प्रकृति में समय मन को शांत करते हैं।'),
      T('Talking about feelings to someone trustworthy reduces mental load.', 'किसी विश्वसनीय व्यक्ति से मन की बात कहना मानसिक बोझ घटाता है।'),
    ],
    T('A person who shares worries early often avoids depression from growing.', 'जो व्यक्ति चिंता जल्दी बाँटता है, वह अवसाद को बढ़ने से बचाता है।'),
    T('Spend 5 quiet minutes breathing slowly today.', 'आज 5 मिनट धीमी श्वास के साथ शांत बैठें।'),
    T('A calm mind is not a luxury — it is a health habit.', 'शांत मन कोई विलासिता नहीं — यह स्वास्थ्य आदत है।'),
    T('If low mood lasts more than two weeks, consult a doctor or counsellor.', 'उदासी दो सप्ताह से अधिक रहे तो डॉक्टर या परामर्शदाता से मिलें।'),
    {
      labh: T('Free mental-health counselling over the phone, in your own language.', 'आपकी ही भाषा में, फोन पर निःशुल्क मानसिक स्वास्थ्य परामर्श।'),
      who: T('Anyone with stress, sadness, anxiety or thoughts of self-harm.', 'तनाव, उदासी, चिंता या स्वयं को हानि पहुँचाने के विचार वाले कोई भी व्यक्ति।'),
      docs: T('Nothing needed to call. Keep a doctor/ID handy for a clinic visit.', 'कॉल करने के लिए कुछ नहीं चाहिए। क्लिनिक जाने हेतु डॉक्टर/पहचान पत्र साथ रखें।'),
      where: T('Tele-MANAS helpline 14416 (toll-free, 24x7) or your nearest govt hospital.', 'टेली-मानस हेल्पलाइन 14416 (निःशुल्क, 24x7) या नज़दीकी सरकारी अस्पताल।'),
    },
  ),
  CH(
    T('Swachhata — cleanliness prevents more disease than medicine', 'स्वच्छता — स्वच्छता औषधि से अधिक रोग रोकती है'),
    T('Wash hands and half your illnesses never arrive.', 'हाथ धोएँ और आधी बीमारियाँ आएँ ही नहीं।'),
    [
      T('Washing hands with soap before eating and after toilet prevents diarrhoea and infections.', 'खाने से पहले एवं शौच के बाद साबुन से हाथ धोना दस्त एवं संक्रमण रोकता है।'),
      T('Safe drinking water, clean toilets and covered food stop many diseases at the source.', 'सुरक्षित पेयजल, स्वच्छ शौचालय एवं ढका भोजन कई रोगों को स्रोत पर रोकते हैं।'),
      T('Keeping the home and surroundings dry stops mosquitoes from breeding.', 'घर एवं आसपास सूखा रखना मच्छरों का प्रजनन रोकता है।'),
    ],
    T('A household that washes hands before meals sees fewer stomach illnesses.', 'जो परिवार भोजन से पहले हाथ धोता है, उसमें पेट की बीमारियाँ कम होती हैं।'),
    T('Teach hand-washing with soap to one child today.', 'आज एक बच्चे को साबुन से हाथ धोना सिखाएँ।'),
    T('Cleanliness is the cheapest and strongest prevention.', 'स्वच्छता सबसे सस्ती एवं सबसे मज़बूत रोकथाम है।'),
    T('Persistent fever or diarrhoea needs a doctor — do not rely only on home habits.', 'लगातार बुखार या दस्त में डॉक्टर से मिलें — केवल घरेलू आदतों पर निर्भर न रहें।'),
    {
      labh: T('Free health advice by phone and check-up at government health centres.', 'फोन पर निःशुल्क स्वास्थ्य सलाह एवं सरकारी स्वास्थ्य केंद्रों पर जाँच।'),
      who: T('Anyone with fever, diarrhoea, or a question about symptoms/medicines.', 'बुखार, दस्त या लक्षण/दवा के बारे में प्रश्न वाला कोई भी व्यक्ति।'),
      docs: T('Aadhaar / any health card if visiting a centre.', 'केंद्र जाने पर आधार / कोई स्वास्थ्य कार्ड।'),
      where: T('Health helpline 104, or your nearest PHC / sub-centre / govt hospital.', 'स्वास्थ्य हेल्पलाइन 104, या नज़दीकी PHC / उपकेंद्र / सरकारी अस्पताल।'),
    },
  ),
  CH(
    T('Nasha-mukti — addiction is a disease, not a character flaw', 'नशा-मुक्ति — व्यसन एक रोग है, चरित्र-दोष नहीं'),
    T('Stop the addiction, not the relationship.', 'व्यसन छोड़ें, अपनों से नाता नहीं।'),
    [
      T('Tobacco, alcohol and other addictions harm the body and the family economy.', 'तम्बाकू, मद्य एवं अन्य व्यसन शरीर एवं परिवार की अर्थव्यवस्था दोनों को हानि पहुँचाते हैं।'),
      T('Addiction can be treated; support and medical help increase the chance of recovery.', 'व्यसन का इलाज संभव है; सहयोग एवं चिकित्सकीय मदद से स्वस्थ होने की संभावना बढ़ती है।'),
      T('Never shame a person; encourage professional help and family support.', 'व्यक्ति को कभी अपमानित न करें; व्यावसायिक सहायता एवं परिवार-सहयोग बढ़ाएँ।'),
    ],
    T('A person who stops tobacco with a de-addiction centre saves both health and money.', 'जो व्यक्ति नशा-मुक्ति केंद्र की मदद से तम्बाकू छोड़ता है, वह स्वास्थ्य एवं पैसा दोनों बचाता है।'),
    T('Learn the nearest de-addiction helpline and share it with someone who needs it.', 'नज़दीकी नशा-मुक्ति हेल्पलाइन जानें और ज़रूरतमंद को बताएँ।'),
    T('Support and treatment work better than judgement.', 'निर्णय से बेहतर सहयोग एवं उपचार काम करते हैं।'),
    T('Sudden withdrawal can be dangerous — get medical supervision, never self-manage.', 'अचानक नशा छोड़ना खतरनाक हो सकता है — चिकित्सकीय निगरानी में छोड़ें।'),
    {
      labh: T('Free counselling and de-addiction treatment at government centres.', 'सरकारी केंद्रों पर निःशुल्क परामर्श एवं नशा-मुक्ति उपचार।'),
      who: T('Anyone (or a family member) struggling with tobacco, alcohol or drugs.', 'तम्बाकू, मद्य या नशीली दवा से जूझ रहा कोई भी व्यक्ति (या परिवारजन)।'),
      docs: T('Aadhaar and, if available, any hospital/ID card.', 'आधार और, यदि हो, कोई अस्पताल/पहचान पत्र।'),
      where: T('National Tobacco Quitline 1800-11-2356; nearest govt de-addiction centre / hospital.', 'राष्ट्रीय तम्बाकू क्विटलाइन 1800-11-2356; नज़दीकी सरकारी नशा-मुक्ति केंद्र / अस्पताल।'),
    },
  ),
  CH(
    T('First aid that everyone should know', 'प्राथमिक चिकित्सा जो हर किसी को आनी चाहिए'),
    T('The first ten minutes can save a life.', 'पहले दस मिनट जीवन बचा सकते हैं।'),
    [
      T('For a burn: cool running water for 20 minutes; never apply toothpaste or oil.', 'जलने पर: 20 मिनट ठंडा बहता पानी डालें; टूथपेस्ट या तेल कभी न लगाएँ।'),
      T('For bleeding: press firmly with a clean cloth and keep the part raised.', 'खून बहने पर: साफ़ कपड़े से दबाव डालें और अंग ऊँचा रखें।'),
      T('For unconscious person: check breathing, keep airway open, call for help (112).', 'बेहोश व्यक्ति हेतु: श्वास जाँचें, वायुमार्ग खुला रखें, सहायता बुलाएँ (112)।'),
    ],
    T('Cooling a burn promptly reduces severity and scarring.', 'जलन पर तुरंत ठंडा पानी डालने से गंभीरता एवं निशान कम होते हैं।'),
    T('Learn one first-aid step properly today and teach it to a family member.', 'आज एक प्राथमिक चिकित्सा कदम अच्छी तरह सीखें और परिवार को सिखाएँ।'),
    T('First aid is a duty every citizen should carry.', 'प्राथमिक चिकित्सा हर नागरिक का कर्तव्य है।'),
    T('First aid does not replace a doctor — call for professional help early.', 'प्राथमिक चिकित्सा डॉक्टर का विकल्प नहीं — जल्दी व्यावसायिक सहायता बुलाएँ।'),
    {
      labh: T('Emergency ambulance and treatment, free at government hospitals.', 'आपातकालीन एम्बुलेंस एवं इलाज, सरकारी अस्पतालों में निःशुल्क।'),
      who: T('Any accident, burn, bleeding, snake-bite or unconscious person.', 'कोई दुर्घटना, जलन, रक्तस्राव, सर्पदंश या बेहोश व्यक्ति।'),
      docs: T('None needed for emergency care; carry ID if available.', 'आपातकालीन उपचार हेतु कुछ नहीं चाहिए; हो तो पहचान पत्र साथ रखें।'),
      where: T('Emergency 112 · Ambulance 108 · nearest govt hospital.', 'आपातकाल 112 · एम्बुलेंस 108 · नज़दीकी सरकारी अस्पताल।'),
    },
  ),
];

module.exports = {
  key: 'swasthya',
  emoji: '🌿',
  category: 'ayurveda',
  title: T('Health Wisdom — One Chapter a Day', 'स्वास्थ्य ज्ञान — हर दिन एक अध्याय'),
  note: T('General well-being guidance inspired by Charak Samhita. This is NOT medical advice, diagnosis or a cure. For any illness or medicine, consult a qualified doctor.',
    'चरक संहिता से प्रेरित सामान्य स्वास्थ्य मार्गदर्शन। यह चिकित्सकीय सलाह, निदान या इलाज नहीं है। किसी भी रोग या दवा हेतु योग्य डॉक्टर से परामर्श करें।'),
  cta: T('Awareness is prevention. Share this with someone who needs it.',
    'जागरूकता ही बचाव है। इसे किसी ज़रूरतमंद के साथ साझा करें।'),
  verified: '2026-01',
  items,
};
