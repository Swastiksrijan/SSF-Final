/**
 * Trees & Forests / वृक्ष एवं जंगल — Master Course content.
 *
 * A Knowledge World science course (25 chapters / 5 modules) built from the
 * full teaching material: tree structure, water movement, photosynthesis,
 * growth, forest as an ecosystem, layers, habitats, food chains/webs,
 * biodiversity, pollination, seed dispersal, decomposition, human uses,
 * forest communities, products, deforestation/degradation/fragmentation, and
 * conservation + a local field study project. Rendered by MasterCourse.jsx.
 */

import { readMigratedProgress } from "./courseProgress";

export const TREES_FORESTS_COURSE = {
  meta: {
    icon: "🌳",
    title: ["Trees & Forests", "वृक्ष एवं जंगल"],
    level: "Beginner → Intermediate",
    tag: "Knowledge World",
    tagline: "पेड़ की बनावट, जंगल का तंत्र, जैव विविधता, उपयोग और संरक्षण।",
    heroSubtitle:
      "यह केवल पेड़ों की सूची नहीं — यह समझ और observation का course है। पेड़ की structure से लेकर एक पूरे forest ecosystem, biodiversity और conservation तक, हर lesson में concept, example, activity और evidence-based सोच।",
  },

  overview: {
    what: "पेड़ एक जीवित organism है और forest एक ecosystem — जिसमें trees, plants, animals, fungi, microorganisms, soil, water, air और sunlight आपस में जुड़े होते हैं।",
    why: "पेड़ और forest हमें oxygen, भोजन, लकड़ी, पानी-मिट्टी की सुरक्षा और जलवायु संतुलन देते हैं। इनके बिना जीवन और livelihoods दोनों पर असर पड़ता है।",
    where: "घर-आँगन, स्कूल, गली, खेत, पहाड़, rainforest, national park और हमारे आसपास के हर green area में।",
    outcome: "Learner पेड़ के भाग समझेगा, photosynthesis, food chain/web, biodiversity और conservation के स्तरों में अंतर करेगा, और अपने आसपास के पेड़ों का scientific observation कर सकेगा।",
  },

  courseStart: {
    title: "चलो पेड़ और जंगल को science की तरह देखें",
    blocks: [
      { t: "p", x: "“पेड़” कहते ही हमें एक बड़ा तना, शाखाएँ और हरी पत्तियाँ याद आती हैं। पर science में पेड़ को केवल “बड़ा पौधा” कहना पर्याप्त नहीं है।" },
      { t: "p", x: "पेड़ एक जीवित organism है — जो बढ़ता है, respiration करता है, reproduce करता है और वातावरण से पदार्थों का आदान-प्रदान करता है।" },
      { t: "note", k: "goal", title: "इस course का उद्देश्य", x: "पेड़ की structure → water movement → photosynthesis → growth → forest as ecosystem → layers → habitats → food chain/web → biodiversity → pollination → seed dispersal → decomposition → human uses → conservation → local field study।" },
      { t: "note", k: "info", title: "सीखने का flow", x: "हर lesson में: Concept → Explanation → Example → Activity → Application → Revision।" },
      { t: "note", k: "warn", title: "यह क्या नहीं है", x: "यह दुनिया के हर पेड़ की dictionary नहीं है। Course = समझ और skill; Knowledge Search = unlimited reference।" },
    ],
  },

  modules: [
    /* ------------------------------- MODULE 1 ------------------------------- */
    {
      id: "m1", title: "पेड़ को समझना", titleHi: "Understanding Trees", icon: "🌱",
      chapters: [
        {
          id: "c1", number: 1, title: "पेड़ आखिर है क्या?", titleHi: "What is a Tree?", icon: "🌳",
          blocks: [
            { t: "p", x: "जब हम “पेड़” कहते हैं तो हमारे मन में तुरंत एक बड़ा तना, शाखाएँ और हरी पत्तियाँ आती हैं। लेकिन science में पेड़ को केवल “बड़ा पौधा” कहना पर्याप्त नहीं है।" },
            { t: "p", x: "पेड़ एक जीवित organism है जो बढ़ता है, respiration करता है, reproduce करता है, वातावरण के साथ पदार्थों का आदान-प्रदान करता है और अपने जीवन के लिए ऊर्जा प्राप्त करता है।" },
            { t: "note", k: "concept", title: "🧠 एक सामान्य tree के भाग", x: "Roots → Trunk → Branches → Leaves → Flowers/Fruits/Seeds। ये अलग-अलग हिस्से हैं, लेकिन स्वतंत्र नहीं।" },
            { t: "h", x: "उदाहरण — आम के पेड़ का life cycle" },
            { t: "flow", items: ["बीज", "अंकुर", "छोटा पौधा", "बड़ा पेड़", "फूल", "फल", "बीज (अगली पीढ़ी)"] },
            { t: "h", x: "पेड़ और बाकी पौधे" },
            { t: "table", head: ["Plant", "सामान्य रूप"], rows: [["आम", "Tree"], ["नीम", "Tree"], ["बरगद", "Tree"], ["गुलाब", "Shrub"], ["गेहूँ", "Herb / grass-like crop"], ["घास", "Grass"], ["लौकी", "Climbing / vining plant"]] },
            { t: "note", k: "info", x: "यह classification हर botanical context में बिल्कुल कठोर नहीं होती, लेकिन beginner के लिए growth form समझने का अच्छा तरीका है।" },
            { t: "note", k: "tip", title: "🧠 सोचो", x: "अगर कोई पेड़ 100 साल पुराना है, तो क्या वह हर साल “नया पेड़” बनता है? नहीं — वही organism लगातार grow करता रहता है।" },
            { t: "act", title: "Practice — सही पहचान करो", x: "Tree है या नहीं?", items: ["नीम → पेड़", "गेहूँ → सामान्यतः tree नहीं", "बरगद → पेड़", "घास → tree नहीं", "आम → पेड़"] },
            { t: "ch", title: "Challenge", x: "अपने घर/स्कूल/गली में 5 plants देखो और उन्हें Tree / Shrub / Herb / Grass / Climber में बाँटने की कोशिश करो।" },
          ],
        },
        {
          id: "c2", number: 2, title: "पेड़ के हिस्से", titleHi: "Parts of a Tree", icon: "🪵",
          blocks: [
            { t: "p", x: "एक पेड़ को समझने का सबसे अच्छा तरीका है उसे ऊपर से नीचे तक देखना।" },
            { t: "h", x: "🌱 1. Roots — जड़ें" },
            { t: "ul", items: ["plant को anchor करना", "पानी लेना", "mineral nutrients लेना", "कुछ plants में food storage", "soil के साथ interaction"] },
            { t: "note", k: "warn", x: "सारी roots केवल सीधे नीचे नहीं जातीं। कई पेड़ों की roots आसपास की मिट्टी में फैलती हैं — पेड़ के नीचे दिखने वाली ज़मीन का बड़ा हिस्सा उसके root system से जुड़ा हो सकता है।" },
            { t: "h", x: "🪵 2. Trunk — तना" },
            { t: "ul", items: ["पेड़ को support देता है", "branches को संभालता है", "roots और leaves के बीच transport system का हिस्सा है"] },
            { t: "table", head: ["Vascular tissue", "काम"], rows: [["Xylem", "जड़ों से पानी और dissolved minerals को ऊपर ले जाना"], ["Phloem", "पत्तियों में बने sugars को plant के अन्य हिस्सों तक पहुँचाना"]] },
            { t: "h", x: "🌿 3. Branches — शाखाएँ" },
            { t: "p", x: "Branches पत्तियों को फैलने के लिए structure देती हैं, जिससे plant अधिक sunlight capture कर सकता है।" },
            { t: "h", x: "🍃 4. Leaves — पत्तियाँ" },
            { t: "p", x: "Leaves में photosynthesis का मुख्य भाग होता है। पत्ती के अंदर chlorophyll-containing cells light energy को capture करते हैं।" },
            { t: "h", x: "🌸 5. Flowers — फूल" },
            { t: "p", x: "Flowering plants में flowers reproduction से जुड़े होते हैं। Pollination और fertilization के बाद कई plants में fruits/seeds develop होते हैं।" },
            { t: "h", x: "🍎 6. Fruits — फल" },
            { t: "p", x: "Fruit developing seeds को protect करने और seed dispersal में सहायता करता है।" },
            { t: "h", x: "🌰 7. Seeds — बीज" },
            { t: "p", x: "Suitable conditions मिलने पर seed germinate कर सकता है और नया plant विकसित हो सकता है।" },
            { t: "act", title: "Practice", x: "एक पेड़ चुनो और उसके हिस्से पहचानो।", items: ["जड़, तना, शाखा, पत्ती पहचानो", "फूल/फल/बीज में से जो दिखे उसे नोट करो", "हर हिस्से का एक काम लिखो"] },
          ],
        },
        {
          id: "c3", number: 3, title: "पेड़ पानी कैसे प्राप्त करता है?", titleHi: "Water Movement in Plants", icon: "💧",
          blocks: [
            { t: "p", x: "एक interesting सवाल: पानी ज़मीन से पेड़ की सबसे ऊँची पत्ती तक कैसे पहुँचता है?" },
            { t: "p", x: "Roots soil से water absorb करती हैं। फिर water plant के vascular system के माध्यम से ऊपर move करता है। Leaves से water का loss transpiration कहलाता है।" },
            { t: "flow", items: ["Soil water", "Roots", "Stem / Xylem", "Branches", "Leaves", "Water vapour to atmosphere"] },
            { t: "h", x: "🌬️ Transpiration को समझो" },
            { t: "p", x: "गर्म और dry conditions में कई plants से water loss बढ़ सकता है। लेकिन plant stomata के opening/closing द्वारा gas exchange और water loss को regulate करता है।" },
            { t: "note", k: "concept", title: "🧠 Stomata क्या हैं?", x: "Leaves की surface पर microscopic pores। इनके माध्यम से: carbon dioxide अंदर जा सकती है, oxygen बाहर जा सकती है, water vapour बाहर निकल सकता है।" },
            { t: "act", title: "Observation", x: "एक पत्ती को sunlight में और एक को छाया में रखो और कुछ घंटे बाद observe करो।", items: ["कौन-सी पत्ती जल्दी मुरझाती दिखी?", "गमले की मिट्टी की नमी कैसे बदली?", "अपना अनुमान लिखो"] },
          ],
        },
        {
          id: "c4", number: 4, title: "Photosynthesis", titleHi: "पौधा अपना भोजन कैसे बनाता है?", icon: "☀️",
          blocks: [
            { t: "p", x: "यह course का सबसे important scientific concept है। Plants photosynthesis द्वारा light energy का उपयोग करके carbon dioxide और water से organic compounds बनाते हैं।" },
            { t: "note", k: "concept", title: "सरल equation", x: "Carbon dioxide + Water + Light Energy → Glucose + Oxygen" },
            { t: "flow", items: ["☀️ Sun", "🍃 Leaf", "Light energy captured", "CO₂ + H₂O", "🌱 Sugars / organic matter"] },
            { t: "p", x: "Plant इन sugars का उपयोग growth और metabolism में करता है। यह पूरी प्रक्रिया केवल equation याद करने के लिए नहीं है।" },
            { t: "mistakes", items: [
              { w: "“Plants सिर्फ रात में oxygen देते हैं।”", c: "यह simple statement misleading है। Photosynthesis light-dependent process है, जबकि plants respiration भी करते हैं। दोनों processes को अलग-अलग समझो।" },
              { w: "“पौधे दिन में oxygen, रात में CO₂ देते हैं” जैसी याद की हुई line।", c: "Photosynthesis और respiration दो अलग प्रक्रियाएँ हैं — इन्हें समझो, रटो मत।" },
            ] },
            { t: "act", title: "Mini Activity", x: "पत्ती को कुछ समय छाया में रखकर देखो क्या बदलाव आता है।", items: ["क्या पत्ती का रंग बदलता है?", "क्या बदलाव की गति sunlight पर निर्भर है?", "निष्कर्ष लिखो"] },
          ],
        },
        {
          id: "c5", number: 5, title: "पेड़ बढ़ता कैसे है?", titleHi: "Growth of a Tree", icon: "🌱",
          blocks: [
            { t: "p", x: "एक seed से tree बनने में कई stages हो सकती हैं:" },
            { t: "flow", items: ["Seed", "Germination", "Seedling", "Young plant", "Mature tree", "Flowering / reproduction", "Seeds", "Next generation"] },
            { t: "h", x: "Growth को प्रभावित करने वाले factors" },
            { t: "ul", items: ["water", "light", "temperature", "nutrients", "soil conditions", "species", "competition", "pests / diseases"] },
            { t: "act", title: "🌱 Mini Activity — Germination Experiment", x: "एक seed germination experiment करो। दो containers लो:", items: ["A: पर्याप्त moisture", "B: बहुत कम water", "कुछ दिनों तक observation लिखो"] },
            { t: "ch", title: "फिर सोचो", x: "Observation के बाद पूछो:", items: ["किसमें germination बेहतर हुआ?", "क्या केवल water पर्याप्त है?", "light और temperature का क्या प्रभाव हो सकता है?"] },
          ],
        },
      ],
    },

    /* ------------------------------- MODULE 2 ------------------------------- */
    {
      id: "m2", title: "जंगल एक जीवित संसार", titleHi: "Forest as an Ecosystem", icon: "🌲",
      chapters: [
        {
          id: "c6", number: 6, title: "Forest क्या है?", titleHi: "What is a Forest?", icon: "🌲",
          blocks: [
            { t: "p", x: "Forest को केवल “बहुत सारे पेड़” कहना incomplete है। Forest एक ecosystem है।" },
            { t: "h", x: "Living components" },
            { t: "ul", items: ["trees, shrubs, grasses", "insects, birds", "mammals, reptiles, amphibians", "fungi, bacteria", "other microorganisms"] },
            { t: "h", x: "Non-living components" },
            { t: "ul", items: ["soil", "water", "air", "sunlight", "temperature", "minerals"] },
            { t: "note", k: "remember", title: "और सबसे important", x: "इन सबके बीच interactions। Living + non-living components और उनके आपसी संबंध मिलकर ecosystem बनाते हैं।" },
            { t: "mistakes", items: [{ w: "“जंगल में पेड़ होते हैं इसलिए जंगल ecosystem है।”", c: "केवल trees की presence पर्याप्त explanation नहीं है। Living और non-living components तथा उनके interactions ecosystem बनाते हैं।" }] },
          ],
        },
        {
          id: "c7", number: 7, title: "Forest की परतें", titleHi: "Forest Layers", icon: "🌳",
          blocks: [
            { t: "p", x: "एक mature forest में vertical structure हो सकता है।" },
            { t: "table", head: ["Layer", "क्या होता है"], rows: [
              ["☀️ Emergent layer", "कुछ बहुत ऊँचे trees canopy से भी ऊपर निकल सकते हैं"],
              ["🌳 Canopy", "पेड़ों की branches और leaves की मुख्य upper layer"],
              ["🌿 Understory", "Canopy के नीचे की vegetation"],
              ["🌱 Shrub / Herb layer", "छोटे plants और herbs"],
              ["🍂 Forest floor", "गिरी हुई leaves, branches, seeds और decomposing material"],
              ["🦠 Soil", "जहाँ microorganisms और अनेक छोटे organisms रहते हैं"],
            ] },
            { t: "note", k: "concept", title: "Why layers matter?", x: "हर layer में अलग light, humidity, temperature, food और shelter हो सकता है। इसलिए एक forest केवल horizontal area नहीं — वह vertical habitat भी है।" },
            { t: "act", title: "Observation", x: "किसी पेड़ को ऊपर से नीचे तक देखो और परतें पहचानो।", items: ["सबसे ऊपर की पत्तियाँ", "बीच की शाखाएँ", "नीचे के छोटे पौधे", "ज़मीन पर गिरी पत्तियाँ"] },
          ],
        },
        {
          id: "c8", number: 8, title: "कौन कहाँ रहता है?", titleHi: "Forest Habitats", icon: "🐦",
          blocks: [
            { t: "p", x: "एक tree पर भी कई organisms रह सकते हैं।" },
            { t: "table", head: ["जगह", "Organism"], rows: [["ऊपर", "🐦 Bird"], ["पत्तियों पर", "🐛 Caterpillar"], ["फूलों पर", "🐝 Bee"], ["छाल पर", "🪲 Insects"], ["जड़ों के आसपास", "🦠 Microorganisms"], ["गिरी पत्तियों में", "🍄 Fungi"]] },
            { t: "note", k: "remember", x: "एक पेड़ अपने आप में कई छोटे habitats प्रदान कर सकता है।" },
            { t: "act", title: "Biodiversity Hunt", x: "एक पेड़ के आसपास जितने अलग organisms दिखें, उन्हें नोट करो।", items: ["पक्षी, तितली, मधुमक्खी", "कीट, मकड़ी", "शrub, herb", "फंगस, मिट्टी के जीव"] },
          ],
        },
        {
          id: "c9", number: 9, title: "Food Chain", titleHi: "खाद्य श्रृंखला", icon: "🔗",
          blocks: [
            { t: "p", x: "अब ecosystem में energy movement समझो।" },
            { t: "flow", items: ["🌱 Plant", "🐛 Caterpillar", "🐦 Bird", "🦅 Eagle"] },
            { t: "p", x: "यह एक simplified food chain है।" },
            { t: "table", head: ["Role", "क्या करता है"], rows: [
              ["Producer", "Plants producers हैं क्योंकि वे photosynthesis द्वारा organic matter बनाते हैं"],
              ["Consumer", "Animals directly या indirectly plants से प्राप्त energy पर निर्भर होते हैं"],
              ["Decomposer", "Fungi और bacteria dead organic matter को break down करते हैं"],
            ] },
            { t: "act", title: "Practice", x: "अपने आसपास की एक food chain बनाओ।", items: ["एक producer पहचानो", "एक consumer पहचानो", "एक decomposer पहचानो"] },
          ],
        },
        {
          id: "c10", number: 10, title: "Food Web", titleHi: "खाद्य जाल", icon: "🕸️",
          blocks: [
            { t: "p", x: "वास्तविक forest में केवल एक food chain नहीं होती। एक bird कई insects खा सकता है; एक insect कई plants खा सकता है; एक predator कई prey species पर निर्भर हो सकता है।" },
            { t: "note", k: "concept", title: "Many food chains → Food Web", x: "इसलिए ecosystem में ऊर्जा एक जाल (web) की तरह बहती है, एक सीधी रेखा की तरह नहीं।" },
            { t: "ch", title: "🧠 Challenge", x: "अगर forest से एक important insect species बहुत कम हो जाए तो सोचो:", items: ["कौन से birds प्रभावित हो सकते हैं?", "कौन से plants प्रभावित हो सकते हैं?", "pollination पर प्रभाव हो सकता है?", "predators पर indirect effect हो सकता है?"] },
            { t: "note", k: "tip", x: "यही ecosystem thinking है — एक बदलाव पूरे जाल पर असर डालता है।" },
          ],
        },
      ],
    },

    /* ------------------------------- MODULE 3 ------------------------------- */
    {
      id: "m3", title: "Biodiversity और Forest Life", titleHi: "Biodiversity & Forest Life", icon: "🐾",
      chapters: [
        {
          id: "c11", number: 11, title: "Biodiversity क्या है?", titleHi: "जैव विविधता", icon: "🧬",
          blocks: [
            { t: "p", x: "Biodiversity = जैव विविधता = जीवन की विविधता। इसे तीन levels में समझो:" },
            { t: "table", head: ["Level", "अर्थ"], rows: [
              ["1. Genetic diversity", "एक species के individuals के genes में variation"],
              ["2. Species diversity", "एक क्षेत्र में अलग-अलग species की variety"],
              ["3. Ecosystem diversity", "अलग-अलग ecosystems की variety"],
            ] },
            { t: "ex", title: "उदाहरण", x: "एक forest में 100 प्रकार के birds और 100 अलग genetic varieties — एक ही बात नहीं हैं।", steps: ["Species diversity = कितनी अलग species", "Genetic diversity = एक species के अंदर variation", "इसलिए biodiversity केवल species count नहीं है"] },
            { t: "mistakes", items: [{ w: "“Biodiversity का मतलब animals की संख्या है।”", c: "Biodiversity life की genetic, species और ecosystem-level variety को शामिल करती है।" }] },
          ],
        },
        {
          id: "c12", number: 12, title: "Pollination", titleHi: "परागण", icon: "🐝",
          blocks: [
            { t: "p", x: "Flowering plants के reproduction में pollination महत्वपूर्ण है।" },
            { t: "h", x: "Pollen transfer कैसे हो सकता है?" },
            { t: "ul", items: ["wind से", "bees से", "butterflies से", "birds से", "bats से", "अन्य animals से"] },
            { t: "ex", title: "Example", x: "एक bee flower पर nectar लेने आती है।", steps: ["उसके body पर pollen लग सकता है।", "वह दूसरे flower पर जाती है।", "Pollen transfer हो सकता है।", "इससे plant reproduction में सहायता मिल सकती है।"] },
            { t: "act", title: "Observation", x: "किसी फूल पर 10 मिनट देखो कि कौन-कौन आता है।", items: ["मधुमक्खी, तितली, पक्षी में से कौन?", "क्या वे flower के बीच जाते हैं?", "नोट करो"] },
          ],
        },
        {
          id: "c13", number: 13, title: "Seed Dispersal", titleHi: "बीज प्रसार", icon: "🌬️",
          blocks: [
            { t: "p", x: "अगर सारे seeds parent tree के ठीक नीचे गिरें तो सभी seedlings को light, water, nutrients और space के लिए competition करना पड़ेगा। इसलिए seed dispersal important है।" },
            { t: "h", x: "Methods" },
            { t: "ul", items: ["🌬️ Wind", "💧 Water", "🐦 Birds", "🐒 Animals", "👣 Humans"] },
            { t: "ex", title: "Example", x: "Bird fruit खाता है।", steps: ["Seed दूसरी जगह पहुँच सकता है।", "Suitable conditions में germination हो सकता है।", "इससे forest regeneration में मदद मिल सकती है।"] },
            { t: "act", title: "Practice", x: "आसपास के seeds देखो और उनके dispersal का तरीका अंदाज़ा लगाओ।", items: ["हल्के/पंखदार seeds → ?", "फल वाले seeds → ?", "पानी के पास के seeds → ?"] },
          ],
        },
        {
          id: "c14", number: 14, title: "Decomposition और Nutrient Cycle", titleHi: "अपघटन एवं पोषक चक्र", icon: "🍄",
          blocks: [
            { t: "p", x: "एक forest में हर साल बहुत leaves गिरती हैं। अगर decomposition न हो तो dead material लगातार जमा होता जाता। Fungi और bacteria सहित decomposers organic material को break down करने में मदद करते हैं।" },
            { t: "flow", items: ["🍂 Dead leaves", "🍄 Decomposers", "Organic matter breakdown", "Nutrients", "🌱 Soil", "Plants", "🍃 Leaves"] },
            { t: "note", k: "concept", title: "यह nutrient cycling है", x: "मृत पत्तियों के पोषक तत्व मिट्टी में लौटते हैं और फिर पौधों को मिलते हैं।" },
            { t: "mistakes", items: [{ w: "“Dead leaves useless हैं।”", c: "Dead leaves decomposition और nutrient cycling में महत्वपूर्ण हो सकती हैं।" }] },
          ],
        },
        {
          id: "c15", number: 15, title: "Forest Biodiversity क्यों महत्वपूर्ण है?", titleHi: "Why Biodiversity Matters", icon: "🌍",
          blocks: [
            { t: "p", x: "Biodiversity ecosystem की resilience और functioning में महत्वपूर्ण भूमिका निभाती है। एक forest में pollination, seed dispersal, nutrient recycling, predator-prey relationships और अनेक ecological processes interconnected होते हैं।" },
            { t: "note", k: "info", x: "FAO forest biodiversity को ecological functioning और ecosystem services से सीधे जोड़ता है।" },
            { t: "ex", title: "सोचो", x: "अगर किसी forest में केवल 3 plant species हों और दूसरे forest में 300 plant species हों, तो दोनों forests बिल्कुल identical नहीं होंगे।", steps: ["habitat structure अलग", "food availability अलग", "ecological relationships अलग", "resilience अलग"] },
            { t: "act", title: "Practice", x: "दो green areas (जैसे स्कूल का बगीचा और एक पार्क) की species variety compare करो।", items: ["कौन-सी जगह ज़्यादा variety?", "क्यों?"] },
          ],
        },
      ],
    },

    /* ------------------------------- MODULE 4 ------------------------------- */
    {
      id: "m4", title: "Forests और Human Life", titleHi: "Forests & Human Life", icon: "🌍",
      chapters: [
        {
          id: "c16", number: 16, title: "Forest हमें क्या देते हैं?", titleHi: "Ecosystem Services", icon: "🎁",
          blocks: [
            { t: "p", x: "Forests से मिलने वाले benefits को चार groups में समझें।" },
            { t: "table", head: ["Group", "उदाहरण"], rows: [
              ["🌳 Material resources", "timber, fruits, nuts, fibres, fuel, fodder, medicinal resources, non-timber forest products"],
              ["💧 Regulation", "water cycle, soil protection, carbon storage"],
              ["🐾 Habitat", "अनेक species forests पर निर्भर हैं"],
              ["👨‍👩‍👧‍👦 Livelihood", "अनेक communities forest resources और forest-based activities से जुड़ी हैं"],
            ] },
            { t: "note", k: "info", x: "FAO forests को food, fibre, fuel, livelihoods और ecosystem benefits से जोड़ता है।" },
            { t: "img", src: "/images/tree-planting-1.jpg", cap: "SSF वृक्षारोपण अभियान — पेड़ लगाना ecosystem की रक्षा की दिशा में एक कदम है।" },
          ],
        },
        {
          id: "c17", number: 17, title: "Forest People और Local Communities", titleHi: "वन एवं स्थानीय समुदाय", icon: "👨‍👩‍👧‍👦",
          blocks: [
            { t: "p", x: "Forest केवल “जानवरों की जगह” नहीं है। कई communities forests से food, fuel, medicines, bamboo, leaves, fruits, fibres और livelihoods प्राप्त करती हैं।" },
            { t: "note", k: "remember", x: "इसलिए conservation में local communities को समझना महत्वपूर्ण है — वे forests के साथ सदियों से जुड़े हैं।" },
            { t: "note", k: "info", x: "NCERT forest education में forest-dependent communities, forest products और community conservation को learning के महत्वपूर्ण हिस्सों के रूप में शामिल किया गया है।" },
            { t: "act", title: "Practice", x: "पूछो और नोट करो:", items: ["आपके आसपास कौन-से forest-based काम होते हैं?", "कौन-से वन-उत्पाद रोज़ use होते हैं?", "community कैसे जंगल की देखभाल करती है?"] },
          ],
        },
        {
          id: "c18", number: 18, title: "Forest Products", titleHi: "वन उत्पाद", icon: "🪵",
          blocks: [
            { t: "h", x: "Wood products" },
            { t: "ul", items: ["furniture", "paper", "construction material", "tools"] },
            { t: "h", x: "Non-wood forest products" },
            { t: "ul", items: ["fruits", "nuts", "honey", "bamboo", "leaves", "gums", "resins", "medicinal plants"] },
            { t: "note", k: "warn", title: "लेकिन याद रखो", x: "Forest product useful है → इसका मतलब unlimited extraction सही है, ऐसा नहीं। यहीं से sustainable use का concept आता है।" },
            { t: "act", title: "Practice", x: "अपने घर में 5 ऐसी चीज़ें खोजो जो किसी न किसी रूप में forest से जुड़ी हैं।", items: ["कुर्सी/मेज़", "किताब/कागज़", "फल/मेवे", "औषधि", "झाड़ू/बाँस"] },
          ],
        },
        {
          id: "c19", number: 19, title: "Deforestation और Forest Degradation", titleHi: "वन कटाई एवं क्षरण", icon: "⚠️",
          blocks: [
            { t: "h", x: "Deforestation" },
            { t: "p", x: "Forest land का दूसरे land use में permanent conversion।" },
            { t: "flow", items: ["Forest → Agriculture", "Forest → Settlement", "Forest → Infrastructure"] },
            { t: "h", x: "Degradation" },
            { t: "p", x: "Forest पूरी तरह गायब नहीं हुआ, लेकिन उसकी ecological quality/function कम हो गई।" },
            { t: "table", head: ["कारण", "उदाहरण"], rows: [["Overharvesting", "ज़रूरत से ज़्यादा कटाई"], ["Fire", "वन आग"], ["Overgrazing", "अत्यधिक चराई"], ["Invasive species", "बाहरी आक्रामक प्रजातियाँ"], ["Pests / disease", "कीट व रोग"], ["Pollution", "प्रदूषण"], ["Fragmentation", "आवास का टुकड़ों में बँटना"]] },
            { t: "note", k: "info", x: "FAO forest biodiversity loss के प्रमुख pressures में deforestation, degradation, invasive species, fires, pests और diseases को पहचानता है।" },
          ],
        },
        {
          id: "c20", number: 20, title: "Fragmentation", titleHi: "विखंडन", icon: "🛣️",
          blocks: [
            { t: "p", x: "मान लो पहले एक continuous forest था, फिर बीच से road बनी।" },
            { t: "flow", items: ["🌳🌳🌳🌳🌳🌳🌳🌳🌳", "🌳🌳🌳🌳 | 🛣️ | 🌳🌳🌳🌳🌳"] },
            { t: "p", x: "अब habitat fragmented हो सकता है। इससे:" },
            { t: "ul", items: ["animal movement बदल सकता है", "populations अलग हो सकती हैं", "breeding opportunities प्रभावित हो सकती हैं", "edge effects बढ़ सकते हैं"] },
            { t: "note", k: "remember", x: "इसलिए conservation केवल “कितने पेड़ हैं” का सवाल नहीं है। कहाँ हैं और कैसे जुड़े हैं — यह भी महत्वपूर्ण है।" },
            { t: "act", title: "Practice", x: "एक कागज़ पर एक forest बनाओ, बीच से road खींचो, और सोचो कौन-से जीव प्रभावित होंगे।" },
          ],
        },
      ],
    },

    /* ------------------------------- MODULE 5 ------------------------------- */
    {
      id: "m5", title: "Conservation और Practical Mastery", titleHi: "Conservation & Practical Mastery", icon: "🌱",
      chapters: [
        {
          id: "c21", number: 21, title: "Conservation क्या है?", titleHi: "संरक्षण", icon: "🤝",
          blocks: [
            { t: "p", x: "Conservation का अर्थ: Nature और natural resources को इस तरह protect और manage करना कि ecological value और future availability बनी रहे।" },
            { t: "h", x: "इसमें केवल protection नहीं, बल्कि:" },
            { t: "ul", items: ["sustainable use", "restoration", "monitoring", "community participation", "habitat protection", "species protection"] },
            { t: "act", title: "Practice", x: "अपने आसपास एक green area चुनो और सोचो उसकी रक्षा कैसे हो सकती है।", items: ["कौन-सा ख़तरा सबसे बड़ा है?", "एक practical कदम लिखो"] },
          ],
        },
        {
          id: "c22", number: 22, title: "Afforestation, Reforestation, Restoration", titleHi: "पुनर्रोपण एवं पुनर्स्थापन", icon: "🌱",
          blocks: [
            { t: "p", x: "इन तीन शब्दों को कभी mix मत करना।" },
            { t: "table", head: ["शब्द", "अर्थ"], rows: [
              ["Afforestation", "जहाँ forest नहीं था/लंबे समय से नहीं था, वहाँ forest establish करना"],
              ["Reforestation", "जहाँ forest खो गया था, वहाँ फिर forest establish करना"],
              ["Restoration", "Degraded ecosystem की ecological functions और structure को recover करने का broader प्रयास"],
            ] },
            { t: "note", k: "warn", title: "सबसे महत्वपूर्ण lesson", x: "Tree plantation ≠ complete forest restoration। अगर natural forest में 100 species, animals, fungi, soil organisms, natural regeneration और multiple vegetation layers हैं, और हम वहाँ केवल एक fast-growing species की plantation लगा दें, तो trees की संख्या बढ़ सकती है लेकिन original ecosystem की सारी biodiversity automatically वापस नहीं आती।" },
            { t: "note", k: "info", x: "FAO की 2026 forest-restoration material restoration को soils, water, biodiversity, livelihoods और ecosystem functions के interconnected recovery के रूप में देखती है।" },
            { t: "mistakes", items: [{ w: "“हर plantation natural forest के बराबर है।”", c: "Plantation की species composition और ecological structure natural forest से अलग हो सकती है।" }] },
          ],
        },
        {
          id: "c23", number: 23, title: "Protected Areas और Community Conservation", titleHi: "संरक्षित क्षेत्र एवं सामुदायिक संरक्षण", icon: "🏞️",
          blocks: [
            { t: "h", x: "Protected Areas" },
            { t: "ul", items: ["National Parks", "Wildlife Sanctuaries", "अन्य protected landscapes"] },
            { t: "h", x: "Community Conservation" },
            { t: "p", x: "Local communities भी forests को protect कर सकती हैं। भारत के environmental education curriculum में Chipko Movement, sacred groves और community-based forest protection जैसे examples शामिल हैं।" },
            { t: "note", k: "remember", title: "सीख", x: "Conservation केवल government का काम नहीं है, लेकिन केवल individuals का काम भी नहीं है। यह Government + Scientists + Forest managers + Local communities + Citizens के सहयोग से बेहतर होता है।" },
          ],
        },
        {
          id: "c24", number: 24, title: "Forest Conservation Case Study", titleHi: "केस अध्ययन", icon: "🧭",
          blocks: [
            { t: "h", x: "Case: “एक forest के बीच road”" },
            { t: "p", x: "मान लो सरकार एक road बनाना चाहती है।" },
            { t: "table", head: ["फ़ायदे ✅", "चिंताएँ ⚠️"], rows: [["transportation बेहतर", "trees कट सकते हैं"], ["लोगों को सुविधा", "habitat fragment हो सकता है"], ["economic activity बढ़ सकती है", "wildlife movement प्रभावित"], ["", "noise/light बढ़ सकती है"]] },
            { t: "h", x: "Beginner answer vs Intermediate thinking" },
            { t: "note", k: "mistake", title: "Weak answers", x: "“Road मत बनाओ।” या “Road बनाओ, बाद में पेड़ लगा देंगे।” — दोनों सरल हैं पर पूरी तस्वीर नहीं देखते।" },
            { t: "ol", items: ["Alternative route है?", "सबसे sensitive habitat कहाँ है?", "कितने trees और कौन-सी species प्रभावित होंगी?", "wildlife movement कहाँ है?", "क्या wildlife crossing बनाई जा सकती है?", "construction timing बदली जा सकती है?", "soil और drainage कैसे सुरक्षित होंगे?", "restoration कैसे होगी?", "long-term monitoring कौन करेगा?"] },
            { t: "note", k: "tip", x: "यही evidence-based environmental decision-making है।" },
          ],
        },
        {
          id: "c25", number: 25, title: "अपना Local Forest/Tree Study", titleHi: "स्थानीय अध्ययन परियोजना", icon: "🔬",
          blocks: [
            { t: "p", x: "अब learner को textbook छोड़कर बाहर जाना है। Project: “मेरे आसपास का Tree & Forest Study”।" },
            { t: "note", k: "goal", title: "एक green area चुनो", x: "school, park, village, colony, farm boundary, urban green space या nearby natural area।" },
            { t: "img", src: "/images/tree-planting-2.jpg", cap: "SSF टीम के साथ field observation — पेड़ों और हरियाली का असली अध्ययन बाहर जाकर ही होता है।" },
            { t: "h", x: "Part A — Tree Census" },
            { t: "p", x: "कम से कम 10 trees observe करो। हर tree के लिए:" },
            { t: "table", head: ["जानकारी", "Observation"], rows: [["Local name", ""], ["English name", ""], ["Approx. height", ""], ["Leaf shape", ""], ["Bark", ""], ["Flower", ""], ["Fruit", ""], ["Seed", ""], ["Shade", ""], ["Nearby organisms", ""]] },
            { t: "h", x: "Part B — Biodiversity Hunt" },
            { t: "p", x: "देखो कितने अलग organisms मिलते हैं: 🐦 Birds, 🦋 Butterflies, 🐝 Bees, 🪲 Insects, 🕷️ Spiders, 🌿 Shrubs, 🌱 Herbs, 🍄 Fungi, 🪱 Soil organisms।" },
            { t: "note", k: "tip", x: "Goal: सिर्फ संख्या नहीं; relationships खोजो।" },
            { t: "h", x: "Part C — Relationship Map" },
            { t: "p", x: "एक tree चुनो और उसके आसपास का ecosystem map बनाओ:" },
            { t: "flow", items: ["Tree → Flower → Bee", "Tree → Fruit → Bird", "Tree → Fallen leaves → Fungi → Soil"] },
            { t: "h", x: "🔬 Experiment — “एक पेड़ के नीचे क्या बदलता है?”" },
            { t: "p", x: "एक पेड़ के नीचे और 10–15 metres दूर open ground की तुलना करो। Observe: temperature, soil moisture, shade, fallen leaves, number of insects, vegetation, soil appearance।" },
            { t: "note", k: "remember", x: "फिर लिखो: “Tree presence ने local environment में क्या-क्या बदला?”" },
            { t: "ch", title: "🏆 Final Master Challenge", x: "बिना notes देखे इस विषय को किसी दूसरे व्यक्ति को समझाओ: “एक forest में एक पेड़ अकेला नहीं होता। उसके roots, leaves, insects, birds, fungi, soil, water, climate और humans के बीच कैसे संबंध बनते हैं?”" },
          ],
        },
      ],
    },
  ],

  revision: {
    title: "पूरा course एक नज़र में",
    groups: [
      { title: "🌳 पेड़ की संरचना", items: ["Roots, Trunk, Branches, Leaves, Flowers, Fruits, Seeds"] },
      { title: "💧 पानी", items: ["Roots → Xylem → Leaves → Transpiration; stomata"] },
      { title: "☀️ Photosynthesis", items: ["CO₂ + H₂O + Light → Glucose + Oxygen"] },
      { title: "🌲 Forest ecosystem", items: ["Living + non-living components + interactions"] },
      { title: "🪜 Layers", items: ["Emergent → Canopy → Understory → Shrub → Floor → Soil"] },
      { title: "🔗 Food chain/web", items: ["Producer → Consumer → Decomposer; many chains = web"] },
      { title: "🧬 Biodiversity", items: ["Genetic + Species + Ecosystem diversity"] },
      { title: "🐝🐦🌬️", items: ["Pollination, seed dispersal, decomposition"] },
      { title: "🎁 Uses", items: ["Material, regulation, habitat, livelihood"] },
      { title: "⚠️ Threats", items: ["Deforestation, degradation, fragmentation"] },
      { title: "🌱 Conservation", items: ["Afforestation, Reforestation, Restoration"] },
      { title: "🤝", items: ["Protected areas + community conservation + citizens"] },
    ],
  },

  mastery: {
    title: "Final Assessment / अंतिम परीक्षा",
    note: "Recall, Understanding, Application और Analysis — चारों levels को cover करने वाला test।",
    tasks: [
      { icon: "🧠", title: "Recall", x: "Tree, root, xylem, photosynthesis, biodiversity की basic पहचान।" },
      { icon: "🔍", title: "Understanding", x: "Ecosystem, food chain vs web, decomposers, pollinators, layers।" },
      { icon: "🛠️", title: "Application", x: "Predator घटने, leaves हटने, road fragmentation के असर।" },
      { icon: "📊", title: "Analysis", x: "“पेड़ बढ़े पर biodiversity घटी” — कैसे संभव?" },
    ],
    quiz: [
      { q: "Xylem का मुख्य काम क्या है?", options: ["Sugars नीचे भेजना", "पानी और minerals ऊपर ले जाना", "फूल बनाना", "बीज बनाना"], answer: 1, explain: "Xylem जड़ों से पानी और dissolved minerals को ऊपर ले जाता है; sugars phloem भेजता है।" },
      { q: "Photosynthesis का सही equation कौन-सा है?", options: ["Glucose + Oxygen → CO₂ + Water", "CO₂ + Water + Light → Glucose + Oxygen", "Water + Soil → Glucose", "Oxygen + Light → CO₂"], answer: 1, explain: "CO₂ + H₂O + Light Energy → Glucose + Oxygen।" },
      { q: "Forest को ecosystem क्यों कहते हैं?", options: ["क्योंकि उसमें बहुत पेड़ हैं", "क्योंकि living + non-living components आपस में जुड़े हैं", "क्योंकि वह हरा है", "क्योंकि उसमें जानवर हैं"], answer: 1, explain: "केवल पेड़ होना पर्याप्त नहीं; components और interactions मिलकर ecosystem बनाते हैं।" },
      { q: "Food chain और food web में अंतर?", options: ["कोई अंतर नहीं", "Food web कई food chains से बनता है", "Food chain में केवल पौधे होते हैं", "Food web में ऊर्जा नहीं बहती"], answer: 1, explain: "वास्तविक ecosystem में many food chains → food web।" },
      { q: "Decomposers क्यों जरूरी हैं?", options: ["फूल बनाने के लिए", "Dead matter को तोड़कर nutrients वापस मिट्टी में लाने के लिए", "पानी लाने के लिए", "छाया देने के लिए"], answer: 1, explain: "Fungi/bacteria dead material को breakdown करके nutrient cycling में मदद करते हैं।" },
      { q: "Biodiversity के तीन levels?", options: ["Genetic, Species, Ecosystem", "Tree, Shrub, Herb", "Root, Stem, Leaf", "Water, Soil, Air"], answer: 0, explain: "Genetic, Species और Ecosystem diversity।" },
      { q: "Tree plantation और forest restoration में मुख्य अंतर?", options: ["कोई अंतर नहीं", "Plantation में केवल trees; restoration में पूरा ecosystem functions recover करना", "Restoration सस्ता है", "Plantation ज़्यादा biodiversity देती है"], answer: 1, explain: "Tree count बढ़ना ≠ पूरा ecosystem वापस आना।" },
      { q: "Deforestation और degradation में अंतर?", options: ["दोनों एक ही हैं", "Deforestation में forest land permanently दूसरे use में चला जाता है; degradation में quality घटती है", "Degradation में पेड़ कभी नहीं कटते", "Deforestation सिर्फ आग है"], answer: 1, explain: "Deforestation = land conversion; Degradation = function/quality का घटना।" },
      { q: "Fragmentation का मुख्य असर?", options: ["पेड़ बढ़ना", "habitat का टुकड़ों में बँटना और wildlife movement प्रभावित होना", "बारिश बढ़ना", "मिट्टी बढ़ना"], answer: 1, explain: "Road आदि से habitat fragment होकर populations अलग हो जाती हैं।" },
      { q: "“Forest में पेड़ों की संख्या बढ़ी लेकिन biodiversity घट गई” — क्या संभव है?", options: ["नहीं, असंभव", "हाँ, monoculture plantation से", "केवल गलती है", "केवल पानी से जुड़ा है"], answer: 1, explain: "Monoculture/limited species से tree count बढ़ सकता है पर biodiversity और ecological relationships नहीं।" },
    ],
  },

  outcomeIntro: "इस course के बाद learner:",
  outcome: [
    "🌳 पेड़ की basic structure और हर भाग का काम समझेगा",
    "💧 पानी की movement (roots → xylem → transpiration) समझेगा",
    "☀️ Photosynthesis और plant growth समझेगा",
    "🌲 Forest को एक ecosystem के रूप में देखेगा",
    "🪜 Forest layers और habitats पहचानेगा",
    "🔗 Food chain, food web और decomposition समझेगा",
    "🧬 Biodiversity के तीन levels समझेगा",
    "🐝 Pollination और seed dispersal समझेगा",
    "🎁 Forest के human life से संबंध समझेगा",
    "⚠️ Deforestation, degradation, fragmentation में अंतर करेगा",
    "🌱 Afforestation, reforestation, restoration में अंतर समझेगा",
    "🔬 अपने आसपास के पेड़ों का scientific observation करेगा",
    "🏆 एक Local Tree & Forest Study Project पूरा करेगा",
  ],
  outcomeClose: "यही Beginner → Intermediate mastery है — पेड़ को अकेला नहीं, एक interconnected ecosystem के रूप में समझना।",
};

export const isTreesForestsSubject = (subject) => {
  if (!subject) return false;
  const base = String(subject.en || "").toLowerCase().trim();
  return base === "trees & forests" || base === "trees and forests" || /वृक्ष एवं जंगल/.test(subject.hi || subject.title || "");
};

export const TREES_FORESTS_CHAPTER_IDS = TREES_FORESTS_COURSE.modules.flatMap((m) => m.chapters.map((c) => c.id));

export const readTreesForestsProgress = (subject) => readMigratedProgress(subject, TREES_FORESTS_CHAPTER_IDS);
