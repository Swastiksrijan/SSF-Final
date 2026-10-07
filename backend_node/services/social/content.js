// SSF Social Awareness Publisher — bilingual content engine.
// Deterministically plans two posts a day (morning + evening):
//   * an official awareness day when the date matches one, otherwise
//   * a rotating SSF theme (education / health / environment / community …).
// Everything is bilingual (English + Hindi). No external AI key is required;
// the copy is composed from curated, reviewable templates so nothing false or
// off-brand is ever published automatically.

const ORG = {
  name: 'Swastik Srijan Foundation',
  short: 'SSF',
  taglineEn: 'One Organisation • One Record • Complete Accountability',
  taglineHi: 'एक संस्था • एक रिकॉर्ड • पूर्ण जवाबदेही',
  website: 'swastiksrijan.in',
  phone: '+91 97183 46691',
  email: 'info@swastiksrijan.in',
  baseHashtags: '#SwastikSrijan #SSF #NGO #SocialImpact #India',
};

// Fixed (month/day) awareness days. Recomputed every year from these rules.
const AWARENESS_DAYS = [
  { m: 1, d: 1, key: 'new-year', cat: 'community', en: 'New Year — a new resolve to serve', hi: 'नव वर्ष — सेवा का नया संकल्प', angleEn: 'Start the year by choosing one habit of giving: time, skill or a small monthly contribution.', angleHi: 'साल की शुरुआत दान की एक आदत चुनकर करें: समय, कौशल या छोटा मासिक योगदान।', tags: '#NewYear #Seva' },
  { m: 1, d: 12, key: 'youth-day', cat: 'youth', en: 'National Youth Day', hi: 'राष्ट्रीय युवा दिवस', angleEn: 'Youth are not the future alone — they are the present force of change. Channel that energy into community service.', angleHi: 'युवा केवल भविष्य नहीं, बदलाव की वर्तमान शक्ति हैं। इस ऊर्जा को समाजसेवा में लगाएँ।', tags: '#NationalYouthDay #YouthPower' },
  { m: 1, d: 15, key: 'army-day', cat: 'community', en: 'Army Day', hi: 'सेना दिवस', angleEn: 'Salute the guardians of our borders. Their discipline inspires our service.', angleHi: 'हमारी सीमाओं के रक्षकों को नमन। उनका अनुशासन हमारी सेवा को प्रेरित करता है।', tags: '#ArmyDay #JaiHind' },
  { m: 1, d: 26, key: 'republic-day', cat: 'community', en: 'Republic Day', hi: 'गणतंत्र दिवस', angleEn: 'A republic is strong when every citizen takes responsibility for the weakest among us.', angleHi: 'गणतंत्र तब मजबूत होता है जब हर नागरिक सबसे कमजोर की जिम्मेदारी लेता है।', tags: '#RepublicDay #India' },
  { m: 2, d: 4, key: 'cancer-day', cat: 'health', en: 'World Cancer Day', hi: 'विश्व कैंसर दिवस', angleEn: 'Early detection saves lives. Spread awareness, support patients and their families.', angleHi: 'शीघ्र पहचान जीवन बचाती है। जागरूकता फैलाएँ, मरीजों और परिवारों का साथ दें।', tags: '#WorldCancerDay #HealthAwareness' },
  { m: 2, d: 20, key: 'social-justice', cat: 'community', en: 'World Day of Social Justice', hi: 'विश्व सामाजिक न्याय दिवस', angleEn: 'Justice begins where education, food and dignity reach everyone equally.', angleHi: 'न्याय वहाँ शुरू होता है जहाँ शिक्षा, भोजन और सम्मान सबको समान रूप से मिले।', tags: '#SocialJustice #Equality' },
  { m: 3, d: 3, key: 'wildlife-day', cat: 'environment', en: 'World Wildlife Day', hi: 'विश्व वन्यजीव दिवस', angleEn: 'Protect wildlife and the habitats that keep our planet breathing.', angleHi: 'वन्यजीवों और उनके आवासों की रक्षा करें जो हमारी पृथ्वी को जीवित रखते हैं।', tags: '#WorldWildlifeDay #SaveWildlife' },
  { m: 3, d: 8, key: 'womens-day', cat: 'women', en: 'International Women’s Day', hi: 'अंतर्राष्ट्रीय महिला दिवस', angleEn: 'Every woman deserves safety, education and an equal voice. Celebrate her strength today and every day.', angleHi: 'हर महिला सुरक्षा, शिक्षा और समान अवसर की हकदार है। उसकी शक्ति का सम्मान करें।', tags: '#WomensDay #SheEmpowers' },
  { m: 3, d: 20, key: 'happiness-day', cat: 'community', en: 'International Day of Happiness', hi: 'अंतर्राष्ट्रीय खुशी दिवस', angleEn: 'Real happiness multiplies when it is shared. One act of kindness can change a whole day.', angleHi: 'सच्ची खुशी बाँटने से बढ़ती है। दया का एक कार्य पूरा दिन बदल सकता है।', tags: '#HappinessDay #Kindness' },
  { m: 3, d: 21, key: 'forest-day', cat: 'environment', en: 'International Day of Forests', hi: 'अंतर्राष्ट्रीय वन दिवस', angleEn: 'Forests are our lungs. Plant, protect and never litter the green.', angleHi: 'वन हमारे फेफड़े हैं। पेड़ लगाएँ, बचाएँ और हरियाली को नुकसान न पहुँचाएँ।', tags: '#ForestDay #GreenEarth' },
  { m: 3, d: 22, key: 'water-day', cat: 'environment', en: 'World Water Day', hi: 'विश्व जल दिवस', angleEn: 'Save every drop — clean water is a right, not a luxury.', angleHi: 'हर बूँद बचाएँ — स्वच्छ जल एक अधिकार है, विलासिता नहीं।', tags: '#WorldWaterDay #SaveWater' },
  { m: 4, d: 7, key: 'health-day', cat: 'health', en: 'World Health Day', hi: 'विश्व स्वास्थ्य दिवस', angleEn: 'Good health is the foundation of every family’s progress. Eat right, move daily, rest well.', angleHi: 'अच्छा स्वास्थ्य हर परिवार की प्रगति की नींव है। सही भोजन, रोज़ व्यायाम, पर्याप्त आराम।', tags: '#WorldHealthDay #HealthyIndia' },
  { m: 4, d: 22, key: 'earth-day', cat: 'environment', en: 'Earth Day', hi: 'पृथ्वी दिवस', angleEn: 'The earth does not need saving from itself — it needs saving from us. Act today.', angleHi: 'पृथ्वी को अपने आप से नहीं, हमसे बचाना है। आज ही कदम उठाएँ।', tags: '#EarthDay #SaveEarth' },
  { m: 5, d: 1, key: 'labour-day', cat: 'community', en: 'Labour Day', hi: 'मजदूर दिवस', angleEn: 'Respect the workers who build our homes, roads and food security.', angleHi: 'उन श्रमिकों का सम्मान करें जो हमारे घर, सड़क और भोजन सुरक्षा बनाते हैं।', tags: '#LabourDay #DignityOfWork' },
  { m: 5, d: 8, key: 'red-cross-day', cat: 'health', en: 'World Red Cross Day', hi: 'विश्व रेड क्रॉस दिवस', angleEn: 'Humanity in action — donate blood, learn first aid, help in disasters.', angleHi: 'मानवता कर्म में — रक्तदान करें, प्राथमिक चिकित्सा सीखें, आपदा में मदद करें।', tags: '#RedCrossDay #Humanity' },
  { m: 5, d: 31, key: 'tobacco-day', cat: 'health', en: 'World No Tobacco Day', hi: 'विश्व तम्बाकू निषेध दिवस', angleEn: 'Tobacco takes more lives than any war. Choose a smoke-free future.', angleHi: 'तम्बाकू किसी युद्ध से अधिक जानें लेता है। धूम्रपान-मुक्त भविष्य चुनें।', tags: '#NoTobaccoDay #QuitSmoking' },
  { m: 6, d: 5, key: 'environment-day', cat: 'environment', en: 'World Environment Day', hi: 'विश्व पर्यावरण दिवस', angleEn: 'Plant a tree, refuse single-use plastic, and walk where you can. Small steps heal the planet.', angleHi: 'एक पेड़ लगाएँ, सिंगल-यूज़ प्लास्टिक मना करें, जहाँ संभव हो पैदल चलें। छोटे कदम धरती को स्वस्थ करते हैं।', tags: '#WorldEnvironmentDay #BeatPlastic' },
  { m: 6, d: 14, key: 'blood-donor-day', cat: 'health', en: 'World Blood Donor Day', hi: 'विश्व रक्तदाता दिवस', angleEn: 'One donation, up to three lives. Find a camp near you and donate blood.', angleHi: 'एक दान, तीन तक जीवन। अपने पास का शिविर खोजें और रक्तदान करें।', tags: '#BloodDonorDay #DonateBlood' },
  { m: 6, d: 21, key: 'yoga-day', cat: 'health', en: 'International Yoga Day', hi: 'अंतर्राष्ट्रीय योग दिवस', angleEn: 'Yoga unites body, breath and mind — a free remedy for stress and disease.', angleHi: 'योग शरीर, श्वास और मन को जोड़ता है — तनाव और रोग का मुफ्त उपचार।', tags: '#YogaDay #YogaForAll' },
  { m: 7, d: 11, key: 'population-day', cat: 'community', en: 'World Population Day', hi: 'विश्व जनसंख्या दिवस', angleEn: 'Awareness on family planning and girl-child education builds a stronger nation.', angleHi: 'परिवार नियोजन और बालिका शिक्षा की जागरूकता राष्ट्र को मजबूत बनाती है।', tags: '#PopulationDay #Awareness' },
  { m: 8, d: 9, key: 'tribal-day', cat: 'community', en: 'International Day of the World’s Indigenous Peoples', hi: 'विश्व के स्वदेशी लोगों का अंतर्राष्ट्रीय दिवस', angleEn: 'Honour the culture, land and rights of indigenous communities.', angleHi: 'स्वदेशी समुदायों की संस्कृति, धरती और अधिकारों का सम्मान करें।', tags: '#IndigenousPeoples #Rights' },
  { m: 8, d: 12, key: 'youth-day2', cat: 'youth', en: 'International Youth Day', hi: 'अंतर्राष्ट्रीय युवा दिवस', angleEn: 'Give youth a seat at the table — their ideas solve real problems today.', angleHi: 'युवाओं को निर्णय में भागीदारी दें — उनके विचार आज की समस्याएँ सुलझाते हैं।', tags: '#YouthDay #YouthLeadership' },
  { m: 8, d: 20, key: 'mosquito-day', cat: 'health', en: 'World Mosquito Day', hi: 'विश्व मच्छर दिवस', angleEn: 'Remove stagnant water, use nets — simple steps prevent malaria and dengue.', angleHi: 'ठहरा पानी हटाएँ, मच्छरदानी उपयोग करें — मलेरिया और डेंगू से बचाव सरल है।', tags: '#MosquitoDay #FightDengue' },
  { m: 9, d: 5, key: 'teacher-day', cat: 'education', en: 'Teachers’ Day', hi: 'शिक्षक दिवस', angleEn: 'A teacher shapes a generation. Thank the one who changed your life.', angleHi: 'एक शिक्षक पूरी पीढ़ी बनाता है। उसका धन्यवाद करें जिसने आपका जीवन बदला।', tags: '#TeachersDay #ThankATeacher' },
  { m: 9, d: 8, key: 'literacy-day', cat: 'education', en: 'International Literacy Day', hi: 'अंतर्राष्ट्रीय साक्षरता दिवस', angleEn: 'Literacy is the first step to freedom. Help someone learn to read today.', angleHi: 'साक्षरता स्वतंत्रता का पहला कदम है। आज किसी को पढ़ना सिखाएँ।', tags: '#LiteracyDay #EducationForAll' },
  { m: 9, d: 21, key: 'peace-day', cat: 'community', en: 'International Day of Peace', hi: 'अंतर्राष्ट्रीय शांति दिवस', angleEn: 'Peace in the world begins with peace at home and in our hearts.', angleHi: 'विश्व शांति घर और मन की शांति से शुरू होती है।', tags: '#PeaceDay #NonViolence' },
  { m: 9, d: 27, key: 'tourism-day', cat: 'community', en: 'World Tourism Day', hi: 'विश्व पर्यटन दिवस', angleEn: 'Travel responsibly — respect local culture and leave places cleaner than you found them.', angleHi: 'जिम्मेदारी से यात्रा करें — स्थानीय संस्कृति का सम्मान करें और जगह साफ छोड़ें।', tags: '#TourismDay #ResponsibleTravel' },
  { m: 10, d: 1, key: 'elderly-day', cat: 'community', en: 'International Day of Older Persons', hi: 'वृद्धजनों का अंतर्राष्ट्रीय दिवस', angleEn: 'Our elders are living libraries. Listen, care and never let them feel alone.', angleHi: 'हमारे बुज़ुर्ग जीवित पुस्तकालय हैं। सुनें, देखभाल करें और अकेला न छोड़ें।', tags: '#ElderlyDay #RespectElders' },
  { m: 10, d: 2, key: 'nonviolence-day', cat: 'community', en: 'International Day of Non-Violence', hi: 'अंतर्राष्ट्रीय अहिंसा दिवस', angleEn: 'Non-violence is the greatest force at the disposal of mankind.', angleHi: 'अहिंसा मानवता के पास सबसे बड़ी शक्ति है।', tags: '#NonViolence #GandhiJayanti' },
  { m: 10, d: 10, key: 'mental-health-day', cat: 'health', en: 'World Mental Health Day', hi: 'विश्व मानसिक स्वास्थ्य दिवस', angleEn: 'It is okay to not be okay. Talk, listen and seek help without shame.', angleHi: 'ठीक न होना ठीक है। बात करें, सुनें और बिना शर्म के मदद लें।', tags: '#MentalHealthDay #EndTheStigma' },
  { m: 10, d: 11, key: 'girl-child-day', cat: 'women', en: 'International Day of the Girl Child', hi: 'अंतर्राष्ट्रीय बालिका दिवस', angleEn: 'Educate a girl and you educate a family, a village and a nation.', angleHi: 'एक बालिका को शिक्षित करें, तो परिवार, गाँव और राष्ट्र शिक्षित होता है।', tags: '#GirlChildDay #BetiPadhao' },
  { m: 10, d: 16, key: 'food-day', cat: 'health', en: 'World Food Day', hi: 'विश्व खाद्य दिवस', angleEn: 'Waste less, share more. No one should sleep hungry beside a full plate.', angleHi: 'कम बर्बाद करें, ज़्यादा बाँटें। कोई भूखा न सोए जब थाली भरी हो।', tags: '#WorldFoodDay #ZeroHunger' },
  { m: 10, d: 24, key: 'un-day', cat: 'community', en: 'United Nations Day', hi: 'संयुक्त राष्ट्र दिवस', angleEn: 'Global cooperation for peace, dignity and development for all.', angleHi: 'शांति, सम्मान और विकास के लिए वैश्विक सहयोग।', tags: '#UNDay #GlobalGoals' },
  { m: 11, d: 14, key: 'children-day', cat: 'education', en: 'Children’s Day', hi: 'बाल दिवस', angleEn: 'Every child deserves play, safety, nutrition and a school nearby.', angleHi: 'हर बच्चा खेल, सुरक्षा, पोषण और पास का स्कूल पाने का हकदार है।', tags: '#ChildrensDay #BachpanBachao' },
  { m: 11, d: 19, key: 'mens-day', cat: 'health', en: 'International Men’s Day', hi: 'अंतर्राष्ट्रीय पुरुष दिवस', angleEn: 'Men too should speak about health and emotion. Break the silence.', angleHi: 'पुरुषों को भी स्वास्थ्य और भावनाओं पर बात करनी चाहिए। चुप्पी तोड़ें।', tags: '#MensDay #MensHealth' },
  { m: 11, d: 25, key: 'no-violence-women', cat: 'women', en: 'International Day for the Elimination of Violence against Women', hi: 'महिलाओं के विरुद्ध हिंसा उन्मूलन दिवस', angleEn: 'No woman should live in fear. Speak up, support survivors, teach respect at home.', angleHi: 'कोई महिला डर में न जिए। आवाज़ उठाएँ, पीड़ितों का साथ दें, घर में सम्मान सिखाएँ।', tags: '#EndViolence #OrangeTheWorld' },
  { m: 12, d: 1, key: 'aids-day', cat: 'health', en: 'World AIDS Day', hi: 'विश्व एड्स दिवस', angleEn: 'Awareness, testing and compassion — not stigma — defeat HIV/AIDS.', angleHi: 'जागरूकता, जाँच और करुणा — कलंक नहीं — HIV/एड्स को हराती है।', tags: '#WorldAIDSDay #EndStigma' },
  { m: 12, d: 3, key: 'disability-day', cat: 'community', en: 'International Day of Persons with Disabilities', hi: 'दिव्यांगजनों का अंतर्राष्ट्रीय दिवस', angleEn: 'Accessibility and inclusion are rights, not favours. Build a barrier-free world.', angleHi: 'सुगम्यता और समावेश अधिकार हैं, एहसान नहीं। बाधा-मुक्त विश्व बनाएँ।', tags: '#DisabilityDay #Inclusion' },
  { m: 12, d: 10, key: 'human-rights-day', cat: 'community', en: 'Human Rights Day', hi: 'मानवाधिकार दिवस', angleEn: 'Dignity is not a privilege. Stand for the rights of every person.', angleHi: 'गरिमा विशेषाधिकार नहीं है। हर व्यक्ति के अधिकारों के लिए खड़े हों।', tags: '#HumanRightsDay #Dignity' },
  { m: 12, d: 25, key: 'christmas', cat: 'community', en: 'Christmas — the spirit of giving', hi: 'क्रिसमस — दान की भावना', angleEn: 'Share warmth, food and joy with someone in need this season.', angleHi: 'इस मौसम में किसी ज़रूरतमंद के साथ गर्माहट, भोजन और खुशी बाँटें।', tags: '#Christmas #SeasonOfGiving' },
];

// Rotating day-to-day themes (used when the date has no fixed awareness day).
const THEMES = [
  { cat: 'education', en: 'Education changes everything', hi: 'शिक्षा सब कुछ बदल देती है', angleEn: 'A single notebook, a kind teacher and a safe classroom can rewrite a child’s future. Support education today.', angleHi: 'एक कॉपी, एक दयालु शिक्षक और सुरक्षित कक्षा किसी बच्चे का भविष्य बदल सकती है। आज शिक्षा का साथ दें।', tags: '#Education #Padhai' },
  { cat: 'health', en: 'Health is the real wealth', hi: 'स्वास्थ्य ही असली धन है', angleEn: 'Prevention is cheaper than cure. Wash hands, eat clean, get check-ups on time.', angleHi: 'बचाव इलाज से सस्ता है। हाथ धोएँ, साफ खाएँ, समय पर जाँच कराएँ।', tags: '#Health #Swasthya' },
  { cat: 'environment', en: 'Our planet, our duty', hi: 'हमारी धरती, हमारा कर्तव्य', angleEn: 'One tree, one clean street, one saved drop — every small action counts.', angleHi: 'एक पेड़, एक साफ गली, एक बची बूँद — हर छोटा कदम मायने रखता है।', tags: '#Environment #Prakriti' },
  { cat: 'women', en: 'Empower a woman, empower a generation', hi: 'एक महिला को सशक्त करें, पीढ़ी को सशक्त करें', angleEn: 'When a woman is safe, skilled and financially independent, her whole family rises.', angleHi: 'जब एक महिला सुरक्षित, कुशल और आर्थिक रूप से आत्मनिर्भर होती है, पूरा परिवार उठता है।', tags: '#WomenEmpowerment #NariShakti' },
  { cat: 'youth', en: 'Youth: the power to change India', hi: 'युवा: भारत बदलने की शक्ति', angleEn: 'Volunteer a few hours a week — tutoring, cleaning drives, blood donation. Small time, big change.', angleHi: 'सप्ताह में कुछ घंटे स्वयंसेवा करें — पढ़ाना, सफाई अभियान, रक्तदान। थोड़ा समय, बड़ा बदलाव।', tags: '#Youth #Volunteer' },
  { cat: 'community', en: 'Seva begins at home', hi: 'सेवा घर से शुरू होती है', angleEn: 'Help your neighbour, feed a stray, check on an elder. Service is a habit, not an event.', angleHi: 'पड़ोसी की मदद करें, बेज़ुबान को खाना दें, बुज़ुर्ग का हाल पूछें। सेवा आदत है, आयोजन नहीं।', tags: '#Seva #Kindness' },
  { cat: 'environment', en: 'Say no to single-use plastic', hi: 'सिंगल-यूज़ प्लास्टिक को ना कहें', angleEn: 'Carry a cloth bag and a steel bottle. The ocean thanks you.', angleHi: 'कपड़े का थैला और स्टील बोतल रखें। समुद्र आपका आभारी होगा।', tags: '#BanPlastic #Reuse' },
  { cat: 'health', en: 'Donate blood, be a hero', hi: 'रक्तदान करें, नायक बनें', angleEn: 'Blood cannot be manufactured — only donated. Keep a donor card handy.', angleHi: 'रक्त बनाया नहीं जा सकता, केवल दान किया जा सकता है। डोनर कार्ड रखें।', tags: '#BloodDonation #SaveLives' },
  { cat: 'education', en: 'Books over screens, sometimes', hi: 'कभी-कभी स्क्रीन से बेहतर किताबें', angleEn: 'Read together with your child for 20 minutes daily. It builds language and bond.', angleHi: 'रोज़ 20 मिनट बच्चे के साथ पढ़ें। इससे भाषा और जुड़ाव बढ़ता है।', tags: '#ReadingHabit #Books' },
  { cat: 'community', en: 'Celebrate festivals responsibly', hi: 'त्योहार जिम्मेदारी से मनाएँ', angleEn: 'Avoid crackers that pollute and disturb. Celebrate with lights, sweets and sharing.', angleHi: 'प्रदूषण फैलाने वाले पटाखों से बचें। रोशनी, मिठाई और बाँटने के साथ मनाएँ।', tags: '#GreenFestival #Celebrate' },
  { cat: 'health', en: 'Mental health matters', hi: 'मानसिक स्वास्थ्य मायने रखता है', angleEn: 'Check in on friends. A simple “how are you?” can save a life.', angleHi: 'दोस्तों का हाल पूछें। एक साधारण “कैसे हो?” जान बचा सकता है।', tags: '#MentalHealth #YouMatter' },
  { cat: 'community', en: 'Respect the elderly', hi: 'बुज़ुर्गों का सम्मान करें', angleEn: 'Spend 10 minutes listening to an elder’s story. You will learn more than any book.', angleHi: 'बुज़ुर्ग की कहानी सुनने में 10 मिनट दें। किसी किताब से ज़्यादा सीखेंगे।', tags: '#Elders #Respect' },
  { cat: 'environment', en: 'Save water today', hi: 'आज पानी बचाएँ', angleEn: 'Fix leaking taps and use a bucket instead of a shower. Every drop matters.', angleHi: 'टपकते नल ठीक करें और शॉवर की जगह बाल्टी उपयोग करें। हर बूँद मायने रखती है।', tags: '#SaveWater #JalHaiJeevan' },
  { cat: 'youth', en: 'Skill today, job tomorrow', hi: 'आज कौशल, कल रोज़गार', angleEn: 'Learn one skill online this week — computers, tailoring, spoken English. It opens doors.', angleHi: 'इस सप्ताह एक कौशल सीखें — कंप्यूटर, सिलाई, अंग्रेज़ी। यह रास्ते खोलता है।', tags: '#SkillIndia #Rozgar' },
];

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_HI = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];

// Category-level "sub-title, real-life example, positive takeaway and call to
// action". The example is deliberately ordinary and true-to-life (an unnamed
// person, school or village), so it inspires without being controversial or
// making an unverifiable claim.
const SUBTITLES = {
  education: { en: 'A small step for a big future', hi: 'बड़े भविष्य के लिए एक छोटा कदम' },
  health: { en: 'Small habits, strong families', hi: 'छोटी आदतें, मजबूत परिवार' },
  environment: { en: 'Protect today, breathe tomorrow', hi: 'आज बचाएँ, कल साँस लें' },
  women: { en: 'Her progress lifts everyone', hi: 'उसकी प्रगति सबको ऊपर उठाती है' },
  youth: { en: 'Energy that builds the nation', hi: 'ऊर्जा जो राष्ट्र बनाती है' },
  community: { en: 'Together we rise', hi: 'साथ मिलकर हम बढ़ते हैं' },
};
const EXAMPLES = {
  education: { en: 'In a village school, a teacher gave one struggling girl 15 extra minutes each day for a month. She was reading fluently by year-end — and now helps two juniors read.', hi: 'एक गाँव के स्कूल में शिक्षक ने एक कमज़ोर बच्ची को महीने भर रोज़ 15 मिनट अतिरिक्त दिए। साल के अंत तक वह सहज पढ़ने लगी — और अब दो छोटों को पढ़ाती है।' },
  health: { en: 'A family began washing hands before every meal and boiling drinking water. In one year, the children’s visits to the doctor dropped sharply — the change cost nothing.', hi: 'एक परिवार ने हर भोजन से पहले हाथ धोना और पानी उबालकर पीना शुरू किया। एक साल में बच्चों के डॉक्टर तक जाने की संख्या तेज़ी से घटी — और यह बदलाव बिना खर्च हुआ।' },
  environment: { en: 'Students planted saplings on their school boundary and took turns watering them. Within two years the dusty edge of the ground turned into cool shade for the whole assembly.', hi: 'विद्यार्थियों ने स्कूल की सीमा पर पौधे लगाए और बारी-बारी पानी दिया। दो साल में वह धूल भरा किनारा पूरी सभा के लिए ठंडी छाया बन गया।' },
  women: { en: 'A woman learned tailoring in a three-month course and began stitching at home. Her earnings paid her daughter’s school fees — and her opinion now counts in family decisions.', hi: 'एक महिला ने तीन महीने के कोर्स में सिलाई सीखी और घर पर सिलने लगीं। उनकी कमाई से बेटी की फीस भरी — और अब परिवार के फैसलों में उनकी राय मायने रखती है।' },
  youth: { en: 'A college student volunteered two hours each Sunday to teach a neighbourhood child. Six months later, three friends had joined — and a small weekend class had begun.', hi: 'एक कॉलेज छात्र हर रविवार दो घंटे मोहल्ले के बच्चे को पढ़ाने लगा। छह महीने बाद तीन दोस्त जुड़ गए — और एक छोटी सप्ताहांत कक्षा शुरू हो गई।' },
  community: { en: 'A group of neighbours began sharing one cooked meal with an elderly person living alone. That one plate turned into a daily routine five families now take turns to keep.', hi: 'पड़ोसियों का एक समूह अकेले रह रहे बुज़ुर्ग के साथ एक पका भोजन बाँटने लगा। वह एक थाली ऐसी आदत बन गई जिसे अब पाँच परिवार बारी-बारी निभाते हैं।' },
};
const TAKEAWAYS = {
  education: { en: 'Every hour you give to a learner returns to society many times over.', hi: 'आप जो घंटा किसी सीखने वाले को देते हैं, वह समाज को कई गुना लौटता है।' },
  health: { en: 'Prevention is the cheapest medicine — start today, not tomorrow.', hi: 'बचाव सबसे सस्ती दवा है — आज ही शुरू करें, कल नहीं।' },
  environment: { en: 'Nature repays every small act of care with clean air and shade.', hi: 'प्रकृति देखभाल के हर छोटे काम का बदला स्वच्छ हवा और छाया से देती है।' },
  women: { en: 'When one woman rises, she quietly lifts an entire generation.', hi: 'जब एक महिला उठती है, वह चुपचाप पूरी पीढ़ी को उठा लेती है।' },
  youth: { en: 'Your few hours are someone’s turning point — begin this week.', hi: 'आपके कुछ घंटे किसी का जीवन-मोड़ हैं — इसी सप्ताह शुरू करें।' },
  community: { en: 'Service is a habit, not an event. Do one small thing today.', hi: 'सेवा एक आदत है, आयोजन नहीं। आज एक छोटा काम करें।' },
};
const CTAS = {
  education: { en: 'Support a child’s learning — sponsor a book or give an hour.', hi: 'बच्चे की पढ़ाई में साथ दें — किताब दें या एक घंटा दें।' },
  health: { en: 'Bring one healthy habit home today, and share this message.', hi: 'आज एक सेहतमंद आदत घर लाएँ, और यह संदेश आगे बढ़ाएँ।' },
  environment: { en: 'Plant or protect one tree this week — and tell us about it.', hi: 'इस सप्ताह एक पेड़ लगाएँ या बचाएँ — और हमें बताएँ।' },
  women: { en: 'Support a woman’s skill or education — it changes a full family.', hi: 'किसी महिला के कौशल या शिक्षा में साथ दें — इससे पूरा परिवार बदलता है।' },
  youth: { en: 'Give two hours this week to a cause you care about.', hi: 'इस सप्ताह दो घंटे किसी अच्छे काम को दें।' },
  community: { en: 'Join hands with SSF — volunteer, donate or simply spread this.', hi: 'SSF से जुड़ें — स्वयंसेवा करें, दान दें या यह संदेश फैलाएँ।' },
};
const DEFAULT_SUB = { en: 'A small step for a better India', hi: 'बेहतर भारत के लिए एक छोटा कदम' };
const DEFAULT_EXAMPLE = { en: 'An ordinary person chose to help one neighbour in one small way — and that single act encouraged others around them to do the same.', hi: 'एक साधारण व्यक्ति ने एक पड़ोसी की एक छोटी मदद की — और उस एक काम ने आसपास के लोगों को भी प्रेरित किया।' };
const DEFAULT_TAKEAWAY = { en: 'Change starts small, but it starts with someone. Let that someone be you.', hi: 'बदलाव छोटा होता है, पर किसी से शुरू होता है। वह कोई आप हों।' };
const DEFAULT_CTA = { en: 'Do one good thing today and pass this message on.', hi: 'आज एक अच्छा काम करें और यह संदेश आगे बढ़ाएँ।' };

// Category display labels (used in the video and for reference).
const CAT_LABELS = {
  education: { en: 'Education', hi: 'शिक्षा' },
  health: { en: 'Health', hi: 'स्वास्थ्य' },
  environment: { en: 'Environment', hi: 'पर्यावरण' },
  women: { en: 'Women', hi: 'महिला' },
  youth: { en: 'Youth & Skills', hi: 'युवा एवं कौशल' },
  community: { en: 'Community', hi: 'समुदाय' },
};

// Assemble the extra sections for a given category.
function buildSections(cat) {
  return {
    sub: SUBTITLES[cat] || DEFAULT_SUB,
    ex: EXAMPLES[cat] || DEFAULT_EXAMPLE,
    tk: TAKEAWAYS[cat] || DEFAULT_TAKEAWAY,
    ct: CTAS[cat] || DEFAULT_CTA,
    label: CAT_LABELS[cat] || CAT_LABELS.community,
  };
}

const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
// day-of-year, used as a stable rotation index so the same date always yields
// the same theme (idempotent re-runs) but no two adjacent days repeat.
function dayOfYear(d) {
  return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 86400000);
}

function awarenessFor(date) {
  const m = date.getMonth() + 1;
  const day = date.getDate();
  return AWARENESS_DAYS.filter((a) => a.m === m && a.d === day)[0] || null;
}

// Compose one bilingual post for a date + slot. `slot` = morning | evening | extra.
function planPost(date, slot = 'morning', extraSeed = 0) {
  const aware = awarenessFor(date);
  const doy = dayOfYear(date);
  const slotShift = slot === 'morning' ? 0 : slot === 'evening' ? 1 : 2;
  const theme = THEMES[(doy + slotShift + extraSeed) % THEMES.length];
  const dateEn = `${date.getDate()} ${MONTHS_EN[date.getMonth()]} ${date.getFullYear()}`;
  const dateHi = `${date.getDate()} ${MONTHS_HI[date.getMonth()]} ${date.getFullYear()}`;

  const useAware = aware && slot !== 'extra';
  const titleEn = useAware ? aware.en : theme.en;
  const titleHi = useAware ? aware.hi : theme.hi;
  const angleEn = useAware ? aware.angleEn : theme.angleEn;
  const angleHi = useAware ? aware.angleHi : theme.angleHi;
  const cat = useAware ? aware.cat : theme.cat;
  const key = useAware ? `day-${aware.key}` : `theme-${THEMES.indexOf(theme)}`;
  const kind = useAware ? 'awareness' : 'day-to-day';

  const tags = [useAware ? aware.tags : theme.tags, ORG.baseHashtags].filter(Boolean).join(' ').replace(/\s+/g, ' ');

  // Structured content: heading + sub-title + real-life example + positive
  // takeaway + call to action. This is what the video/reel renders.
  const sec = buildSections(cat);
  const headingEn = titleEn, headingHi = titleHi;
  const subtitleEn = sec.sub.en, subtitleHi = sec.sub.hi;
  const exampleEn = sec.ex.en, exampleHi = sec.ex.hi;
  const takeawayEn = sec.tk.en, takeawayHi = sec.tk.hi;
  const ctaEn = sec.ct.en, ctaHi = sec.ct.hi;
  const catLabelEn = sec.label.en, catLabelHi = sec.label.hi;

  // Slot greeting keeps the two daily posts visibly different.
  const greetEn = slot === 'morning' ? 'Good morning! ☀️' : slot === 'evening' ? 'Good evening! 🌙' : 'A quick reminder 💡';
  const greetHi = slot === 'morning' ? 'सुप्रभात! ☀️' : slot === 'evening' ? 'शुभ संध्या! 🌙' : 'एक छोटी याद 💡';

  // Social caption: greeting, heading, sub-title, idea, example, takeaway, CTA.
  const bodyEn = `${greetEn}\n\n${headingEn}\n${subtitleEn}\n\n${angleEn}\n\n${exampleEn}\n\n✅ ${takeawayEn}\n\n👉 ${ctaEn}\n\n🌐 ${ORG.website}  |  📞 ${ORG.phone}\n${tags}`;
  const bodyHi = `${greetHi}\n\n${headingHi}\n${subtitleHi}\n\n${angleHi}\n\n${exampleHi}\n\n✅ ${takeawayHi}\n\n👉 ${ctaHi}\n\n🌐 ${ORG.website}  |  📞 ${ORG.phone}\n${tags}`;

  return {
    postDate: ymd(date), slot, topicKey: key, category: cat, kind,
    titleEn, titleHi, bodyEn, bodyHi, hashtags: tags,
    headingEn, headingHi, subtitleEn, subtitleHi,
    exampleEn, exampleHi, takeawayEn, takeawayHi, ctaEn, ctaHi,
    catLabelEn, catLabelHi,
    dateEn, dateHi, imageUrl: `${(process.env.PUBLIC_BASE_URL || 'https://ngo-backend-03hq.onrender.com').replace(/\/$/, '')}/api/social/image/daily?date=${ymd(date)}&slot=${slot}&format=png`,
  };
}

// Fields that have no dedicated column and are stored inside SocialPost.data
// (JSONB). Keeping them here means a plain `sequelize.sync()` — which does not
// add new columns on an existing table — still persists and returns them.
const EXTRA_FIELDS = [
  'headingEn', 'headingHi', 'subtitleEn', 'subtitleHi',
  'exampleEn', 'exampleHi', 'takeawayEn', 'takeawayHi',
  'ctaEn', 'ctaHi', 'catLabelEn', 'catLabelHi',
];

// Split a planned post into the row columns and the JSONB `data` payload.
function splitPlan(plan) {
  const row = { ...plan };
  const extra = {};
  for (const k of EXTRA_FIELDS) {
    if (row[k] !== undefined) { extra[k] = row[k]; delete row[k]; }
  }
  return { row, extra };
}

// Re-merge `data` back onto a SocialPost instance / plain row for API output.
function mergePost(p) {
  const base = typeof p.toJSON === 'function' ? p.toJSON() : p;
  return { ...base, ...(base.data || {}) };
}

module.exports = { ORG, AWARENESS_DAYS, THEMES, planPost, awarenessFor, dayOfYear, ymd, MONTHS_EN, MONTHS_HI,
  SUBTITLES, EXAMPLES, TAKEAWAYS, CTAS, buildSections, splitPlan, mergePost, EXTRA_FIELDS };
