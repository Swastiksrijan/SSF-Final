/**
 * Fruits / फल — Master Course content.
 *
 * Full textbook-quality course (Zero Knowledge → Practical Mastery). Same typed
 * block schema as the other Master Courses, rendered by MasterCourse.jsx.
 *
 * Block types: h, p, ul, ol, flow, table, note, ex, act, ch, mistakes.
 */

import { readMigratedProgress } from "./courseProgress";

export const FRUITS_COURSE = {
  meta: {
    icon: "🍎",
    title: ["Fruits", "फल"],
    level: "Beginner → Practical",
    tag: "Knowledge World",
    tagline: "फल को पहचानना, समझना, चुनना, उपयोग करना और पोषण के दृष्टिकोण से जानना।",
    heroSubtitle:
      "फल केवल खाने की चीज नहीं — पौधे के जीवन-चक्र, बीज, मौसम, खेती, पोषण और पर्यावरण से जुड़ी एक पूरी कहानी। चलो step-by-step समझते हैं।",
  },

  overview: {
    what: "फल पौधों के जीवन-चक्र का हिस्सा हैं — फूल के निषेचन के बाद विकसित होते हैं और उनके अंदर बीज हो सकते हैं। साथ ही ये हमारा भोजन भी हैं।",
    why: "फल से हमें vitamins, minerals, fibre और ऊर्जा मिलती है। फल पहचानना, चुनना और सही खाना सीखने से सेहत और खानपान दोनों बेहतर होते हैं।",
    where: "घर की थाली, बाजार, खेत, बगीचा, juice की दुकान और हर मौसम की रसोई में — फल हर जगह दिखते हैं।",
    outcome: "Learner फल पहचान सकेगा, रंग-रूप-स्वाद describe कर सकेगा, plant source और season समझ सकेगा, nutrition और safe handling जान सकेगा और सही फल चुन सकेगा।",
  },

  courseStart: {
    title: "चलो फलों की दुनिया में उतरते हैं",
    blocks: [
      { t: "p", x: "जब हम आम, सेब, केला, अमरूद, संतरा खाते हैं, तो हम उन्हें सामान्य भाषा में “फल” कहते हैं।" },
      { t: "p", x: "लेकिन फल केवल खाने की वस्तु नहीं हैं।" },
      { t: "p", x: "फल पौधों के जीवन-चक्र का भी एक महत्वपूर्ण हिस्सा हैं। फूल के निषेचन के बाद कई पौधों में फल बनता है और उसके अंदर बीज हो सकते हैं।" },
      { t: "p", x: "इसलिए फल को दो दृष्टिकोणों से समझना उपयोगी है:" },
      { t: "note", k: "info", title: "🌳 Plant Science", x: "पौधे में फल कैसे बनता है?" },
      { t: "note", k: "info", title: "🍽️ Food", x: "हम फल को भोजन के रूप में कैसे उपयोग करते हैं?" },
      { t: "note", k: "goal", title: "इस course का लक्ष्य", x: "इस course में हम दोनों दृष्टिकोण जोड़कर सीखेंगे — फल विज्ञान और फल भोजन।" },
    ],
  },

  modules: [
    {
      id: "m1", title: "फल की पहचान", titleHi: "Identifying Fruits", icon: "🍎",
      chapters: [
        {
          id: "c1", number: 1, title: "फल को पहचानना", titleHi: "Recognizing Fruits", icon: "🍎",
          blocks: [
            { t: "h", x: "1.1 सेब / Apple" },
            { t: "p", x: "सेब सामान्यतः गोल या थोड़ा लम्बा होता है। इसके रंग हो सकते हैं:" },
            { t: "ul", items: ["🔴 लाल", "🟢 हरा", "🟡 पीला"] },
            { t: "p", x: "इसे कच्चा खाया जा सकता है और इसका उपयोग juice, sauce तथा अन्य foods में भी होता है।" },
            { t: "note", k: "observe", title: "👀 पहचानो", x: "सेब को केवल रंग से पहचानना जरूरी नहीं। देखो:" },
            { t: "ul", items: ["आकार", "छिलका", "गंध", "बनावट", "बीज का स्थान", "स्वाद"] },

            { t: "h", x: "1.2 केला / Banana" },
            { t: "p", x: "केला सामान्यतः लम्बा और घुमावदार होता है। कच्चे केले का रंग अक्सर हरा होता है और पकने पर पीला हो जाता है।" },
            { t: "p", x: "केले की एक खास बात यह है कि इसे अक्सर बिना काटे भी आसानी से छीलकर खाया जा सकता है।" },
            { t: "note", k: "concept", title: "🧠 सोचो", x: "अगर केला हरा है और बहुत सख्त है, तो क्या वह उसी तरह मीठा होगा जैसे पूरी तरह पका हुआ केला? नहीं — पकने के दौरान उसके स्वाद और texture में परिवर्तन होता है।" },

            { t: "h", x: "1.3 आम / Mango" },
            { t: "p", x: "आम को भारत में बहुत लोकप्रिय फलों में गिना जाता है। इसके कई varieties हैं और उनके आकार, रंग, स्वाद, सुगंध तथा गूदे की बनावट में अंतर हो सकता है।" },
            { t: "p", x: "आम का उपयोग:" },
            { t: "ul", items: ["🥭 सीधे खाने में", "🥤 पेय में", "🍨 desserts में", "🥫 preserves/pickle आदि में"] },
            { t: "note", k: "real", title: "🌞 Seasonal Connection", x: "भारत में कई आम varieties गर्मियों में बाजार में अधिक दिखाई देती हैं। इससे समझ आता है: हर फल पूरे वर्ष एक ही मात्रा में उपलब्ध नहीं होता।" },

            { t: "ex", title: "Example — रंग से पहचानना", x: "अगर किसी फल का रंग बदल सकता है, तो केवल रंग पर निर्भर न रहें।", steps: ["रंग देखो", "आकार और छिलका देखो", "गंध सूंघो", "बनावट (soft/crisp) महसूस करो", "फिर नाम तय करो"] },
            { t: "act", title: "पहचानने की तालिका", x: "कोई 3 फल लेकर उनकी पहचान लिखो।", items: ["नाम (Hindi + English)", "रंग", "आकार", "बनावट", "स्वाद"] },
          ],
        },
        {
          id: "c2", number: 2, title: "फल के रंग", titleHi: "Colours of Fruits", icon: "🌈",
          blocks: [
            { t: "p", x: "फल अलग-अलग रंगों में क्यों दिखाई देते हैं? उनमें प्राकृतिक pigments और अन्य compounds होते हैं जो उनके रंग में योगदान करते हैं।" },
            { t: "p", x: "हम फल को केवल रंग से nutrition judge नहीं कर सकते, लेकिन अलग-अलग रंगों के फल खाना dietary variety बढ़ाने का एक आसान तरीका है।" },
            { t: "note", k: "observe", title: "🌈 रंगों से पहचान", x: "एक ही फल की varieties के अनुसार रंग बदल सकता है — इसलिए रंग एक संकेत है, नियम नहीं।" },
            { t: "table", head: ["रंग", "उदाहरण"], rows: [
              ["🔴 Red", "Apple, Watermelon, Strawberry"],
              ["🟠 Orange", "Orange, Papaya"],
              ["🟡 Yellow", "Banana, Mango"],
              ["🟢 Green", "Guava, green grapes, कुछ pears"],
              ["🟣 Purple / Deep", "कुछ grapes, Jamun"],
            ] },
            { t: "act", title: "🧩 Colour Hunt", x: "अपने आसपास उपलब्ध 5 फल खोजो और तालिका बनाओ।", items: ["Fruit → Colour → Taste", "अब देखो क्या तुम्हें केवल एक रंग के फल मिले या कई रंगों के।"] },
            { t: "table", head: ["Fruit", "Colour", "Taste"], rows: [
              ["Apple", "Red", "Sweet / Tart"],
              ["Banana", "Yellow", "Sweet"],
              ["Orange", "Orange", "Sweet / Tangy"],
            ] },
          ],
        },
        {
          id: "c3", number: 3, title: "फल कहाँ से आते हैं?", titleHi: "Where Fruits Come From", icon: "🌳",
          blocks: [
            { t: "p", x: "फल supermarket में पैदा नहीं होते 😄 — वे पौधों से आते हैं। लेकिन सभी फल एक जैसे पौधों पर नहीं लगते।" },
            { t: "ul", items: ["🌳 बड़े पेड़ों पर", "🌿 छोटे पौधों पर", "🌱 झाड़ियों पर", "🪴 बेल / लता जैसे पौधों पर"] },
            { t: "h", x: "3.1 उदाहरण" },
            { t: "table", head: ["Fruit", "Plant source"], rows: [
              ["🥭 Mango", "Tree (पेड़)"],
              ["🍌 Banana", "Large herbaceous plant (वास्तविक woody tree नहीं)"],
              ["🍉 Watermelon", "Creeping vine (जमीन पर फैलने वाली बेल)"],
              ["🍇 Grapes", "Vine (बेल)"],
            ] },
            { t: "note", k: "concept", title: "🧠 ध्यान दो", x: "बोलचाल में केले के पौधे को “banana tree” कहा जाता है, लेकिन botanical दृष्टि से वह एक large herbaceous plant है — वास्तविक woody tree नहीं। यह distinction plant science समझने में मदद करता है।" },
            { t: "act", title: "Plant Source मिलाओ", items: ["Mango → ?", "Grapes → ?", "Watermelon → ?", "Banana → ?"] },
          ],
        },
      ],
    },

    {
      id: "m2", title: "फल और बीज", titleHi: "Fruits & Seeds", icon: "🌱",
      chapters: [
        {
          id: "c4", number: 4, title: "फल और बीज", titleHi: "Fruits & Seeds", icon: "🌰",
          blocks: [
            { t: "p", x: "फल के अंदर बीज हो सकते हैं।" },
            { t: "table", head: ["Fruit", "Seed"], rows: [
              ["🍎 Apple", "कई छोटे seeds"],
              ["🥭 Mango", "बड़ा seed / stone"],
              ["🍊 Orange", "seeds वाली varieties भी होती हैं"],
              ["🍉 Watermelon", "seeds या seedless varieties"],
              ["🍇 Grapes", "seeded या seedless varieties"],
            ] },
            { t: "note", k: "remember", title: "🧠 महत्वपूर्ण", x: "Seedless fruit का अर्थ यह नहीं कि पौधा कभी reproduce नहीं कर सकता। कई seedless varieties को मानव खेती में propagation के दूसरे तरीकों से उगाया जाता है।" },
            { t: "ex", title: "Example — बीज की भूमिका", x: "बीज अगली generation के पौधे की शुरुआत है।", steps: ["बीज जमीन/मिट्टी में जाता है", "अंकुरण (germination) होता है", "छोटा पौधा बनता है", "बड़ा होकर फिर फूल और फल देता है"] },
          ],
        },
        {
          id: "c5", number: 5, title: "फल बनने की कहानी", titleHi: "How a Fruit Forms", icon: "🌸",
          blocks: [
            { t: "p", x: "इसे एक छोटी कहानी की तरह समझो:" },
            { t: "flow", items: ["🌸 Flower (फूल)", "Pollination / परागण", "Fertilization / निषेचन", "Fruit development", "🍎 Mature fruit"] },
            { t: "p", x: "कई flowering plants में फल विकसित होने की प्रक्रिया फूल से जुड़ी होती है। फल के अंदर बनने वाले बीज अगली generation के पौधों के लिए महत्वपूर्ण हो सकते हैं।" },
            { t: "note", k: "concept", title: "🧠 Flower → Fruit → Seed", x: "जहाँ लागू हो, यही क्रम याद रखो। फूल नहीं तो फल नहीं; फल नहीं तो बीज नहीं।" },
            { t: "act", title: "क्रम लगाओ", items: ["Fertilization", "Flower", "Mature fruit", "Pollination", "Fruit development"] },
          ],
        },
      ],
    },

    {
      id: "m3", title: "फल के प्रकार", titleHi: "Kinds of Fruits", icon: "🍇",
      chapters: [
        {
          id: "c6", number: 6, title: "Fruits के अलग-अलग रूप", titleHi: "Different Forms", icon: "🍒",
          blocks: [
            { t: "p", x: "सभी फल एक जैसे नहीं दिखते। हम उन्हें कई तरीकों से describe कर सकते हैं।" },
            { t: "h", x: "6.1 Size (आकार)" },
            { t: "ul", items: ["🍒 छोटा", "🍎 मध्यम", "🍉 बहुत बड़ा"] },
            { t: "h", x: "6.2 Shape (आकृति)" },
            { t: "ul", items: ["⚪ गोल", "🥭 अंडाकार", "🍌 लम्बा", "🍐 नाशपाती जैसा"] },
            { t: "h", x: "6.3 Texture (बनावट)" },
            { t: "ul", items: ["crunchy", "juicy", "soft", "fibrous", "creamy"] },
            { t: "h", x: "6.4 Taste (स्वाद)" },
            { t: "p", x: "फल sweet, sour/tart या दोनों का मिश्रण हो सकते हैं।" },
            { t: "table", head: ["Feature", "शब्द", "उदाहरण"], rows: [
              ["Size", "छोटा → बड़ा", "Cherry → Watermelon"],
              ["Shape", "गोल / अंडाकार / लम्बा", "Apple / Mango / Banana"],
              ["Texture", "crunchy / juicy / creamy", "Apple / Orange / Banana"],
              ["Taste", "sweet / tart", "Banana / Lemon"],
            ] },
          ],
        },
        {
          id: "c7", number: 7, title: "स्वाद को समझना", titleHi: "Understanding Taste", icon: "👅",
          blocks: [
            { t: "p", x: "जब हम फल खाते हैं, तो केवल “मीठा” कहना पर्याप्त नहीं। हम taste और texture दोनों describe कर सकते हैं।" },
            { t: "table", head: ["Fruit", "Taste", "Texture"], rows: [
              ["🍊 Orange", "Sweet + acidic / tangy", "Juicy"],
              ["🍎 Apple", "Sweet / tart", "Crisp"],
              ["🍌 Banana", "Sweet", "Soft / creamy"],
              ["🍈 Guava", "Sweet / tart", "Firm / grainy (variety और ripeness पर निर्भर)"],
            ] },
            { t: "act", title: "🧠 Taste Detective", x: "तीन अलग फल लो। हर फल के लिए लिखो:", items: ["Colour → Smell → Texture → Taste → Seeds", "अब बिना नाम देखे केवल description से फल पहचानने की कोशिश करो।"] },
          ],
        },
      ],
    },

    {
      id: "m4", title: "मौसम और खेती", titleHi: "Season & Farming", icon: "☀️",
      chapters: [
        {
          id: "c8", number: 8, title: "Season और फल", titleHi: "Season & Fruits", icon: "🌦️",
          blocks: [
            { t: "p", x: "फल की availability मौसम से प्रभावित हो सकती है। लेकिन यह समझना जरूरी है:" },
            { t: "note", k: "warn", x: "Seasonal availability region, variety, farming practices, storage और supply chain के कारण बदल सकती है। इसलिए “यह फल केवल इसी महीने मिलता है” जैसी कठोर बात हर जगह सही नहीं होती।" },
            { t: "h", x: "8.1 Summer Examples" },
            { t: "p", x: "भारत के कई क्षेत्रों में गर्मियों के दौरान ये फल आम तौर पर अधिक दिखाई दे सकते हैं:" },
            { t: "ul", items: ["🥭 Mango", "🍉 Watermelon", "🍈 Muskmelon"] },
            { t: "h", x: "8.2 Winter Examples" },
            { t: "p", x: "कुछ citrus fruits और अन्य seasonal fruits ठंडे मौसम में कई भारतीय क्षेत्रों में अधिक उपलब्ध हो सकते हैं। लेकिन local climate के अनुसार availability बदल सकती है।" },
            { t: "act", title: "Season Chart", items: ["गर्मी के 3 फल लिखो", "सर्दी के 3 फल लिखो", "अपने क्षेत्र में सबसे आसानी से मिलने वाले 2 फल बताओ"] },
          ],
        },
        {
          id: "c9", number: 9, title: "मौसम और खेती", titleHi: "Weather & Farming", icon: "👨‍🌾",
          blocks: [
            { t: "p", x: "फल का उत्पादन कई चीजों पर निर्भर करता है:" },
            { t: "ul", items: ["☀️ sunlight", "💧 water", "🌡️ temperature", "🌱 soil", "🐝 pollination", "🦠 disease / pests", "👨‍🌾 farming practices"] },
            { t: "p", x: "यदि किसी क्षेत्र का तापमान या rainfall बदल जाए, तो crop growth और fruit production प्रभावित हो सकती है। इसलिए fruit को समझना agriculture को समझने से भी जुड़ा है।" },
            { t: "note", k: "career", title: "💼 जुड़ा क्षेत्र", x: "Agriculture, horticulture, food processing और supply chain — ये सब फल से जुड़े काम हैं।" },
          ],
        },
      ],
    },

    {
      id: "m5", title: "पोषण और सुरक्षा", titleHi: "Nutrition & Safety", icon: "🥗",
      chapters: [
        {
          id: "c10", number: 10, title: "फल और Nutrition", titleHi: "Fruits & Nutrition", icon: "🥗",
          blocks: [
            { t: "p", x: "फल diet में महत्वपूर्ण nutrients और beneficial compounds का स्रोत हो सकते हैं।" },
            { t: "p", x: "कई fruits में मिलते हैं:" },
            { t: "ul", items: ["water", "carbohydrates / natural sugars", "dietary fibre", "vitamins", "minerals", "plant compounds"] },
            { t: "note", k: "warn", x: "लेकिन सभी fruits का nutrition profile समान नहीं होता।" },
            { t: "h", x: "10.1 Vitamin C के उदाहरण" },
            { t: "p", x: "कुछ fruits, विशेषकर citrus fruits, vitamin C के अच्छे dietary sources हो सकते हैं:" },
            { t: "ul", items: ["🍊 Orange", "🍋 Lemon", "🍈 कुछ अन्य citrus fruits"] },
            { t: "h", x: "10.2 Potassium के उदाहरण" },
            { t: "p", x: "Banana potassium का एक जाना-पहचाना dietary source है। लेकिन potassium केवल banana में नहीं होता — कई अन्य foods भी potassium प्रदान करते हैं।" },
            { t: "h", x: "10.3 Fibre" },
            { t: "p", x: "पूरे फल खाने पर dietary fibre मिलता है। इसलिए — Whole fruit ≠ केवल fruit juice।" },
            { t: "table", head: ["Nutrient", "उदाहरण source"], rows: [
              ["Vitamin C", "Orange, Lemon"],
              ["Potassium", "Banana (और कई अन्य foods)"],
              ["Dietary fibre", "पूरे फल (whole fruit)"],
              ["Water", "Watermelon, Orange"],
            ] },
          ],
        },
        {
          id: "c11", number: 11, title: "Whole Fruit और Juice", titleHi: "Whole Fruit vs Juice", icon: "🧃",
          blocks: [
            { t: "p", x: "मान लो हमारे पास एक संतरा है।" },
            { t: "h", x: "11.1 Whole Fruit" },
            { t: "p", x: "हम उसे खाते हैं और उसका pulp/flesh तथा उपलब्ध fibre भी लेते हैं।" },
            { t: "h", x: "11.2 Juice" },
            { t: "p", x: "हम उसका juice निकालते हैं। अब fruit का physical form बदल गया। यदि juice में added sugar है, तो वह अतिरिक्त sugar भी प्रदान करेगा।" },
            { t: "note", k: "remember", title: "⭐ Practical Rule", x: "जब संभव हो, whole fruit को diet में शामिल करना एक सरल विकल्प है। Juicing से fruit का form बदल जाता है और processing के अनुसार fibre की मात्रा/संरचना प्रभावित हो सकती है।" },
            { t: "table", head: ["पहलू", "Whole Fruit", "Juice"], rows: [
              ["Form", "प्राकृतिक", "निकाला हुआ"],
              ["Fibre", "मौजूद", "processing पर निर्भर"],
              ["Added sugar", "नहीं", "हो सकता है"],
              ["Chewing / satiety", "अधिक", "कम"],
            ] },
          ],
        },
        {
          id: "c12", number: 12, title: "फल कब पका है?", titleHi: "When is Fruit Ripe?", icon: "🔍",
          blocks: [
            { t: "p", x: "Ripening के दौरान कई fruits में: colour बदल सकता है, smell बढ़ सकती है, texture soft हो सकता है और sweetness बढ़ सकती है। लेकिन हर फल के लिए ripening pattern समान नहीं होता।" },
            { t: "h", x: "12.1 Banana" },
            { t: "flow", items: ["हरा", "पीला", "अधिक ripe"] },
            { t: "p", x: "रंग और softness बदल सकते हैं।" },
            { t: "h", x: "12.2 Mango" },
            { t: "p", x: "कई varieties में ripening के साथ aroma और softness बदलती है। लेकिन केवल बाहरी रंग देखकर हर mango की ripeness निश्चित नहीं की जा सकती।" },
            { t: "act", title: "🔍 Ripeness Observation", x: "एक केला चुनो और 4 दिन observe करो।", items: ["Day 1 → Day 2 → Day 3 → Day 4", "लिखो: colour, firmness, smell, taste"] },
          ],
        },
        {
          id: "c13", number: 13, title: "फल खरीदते समय क्या देखें?", titleHi: "Choosing Fruits", icon: "🛒",
          blocks: [
            { t: "p", x: "फल खरीदते समय केवल सबसे चमकीला फल चुनना जरूरी नहीं।" },
            { t: "ul", items: ["👀 Appearance — क्या बहुत ज्यादा चोट लगी है?", "✋ Firmness — variety के अनुसार उचित firmness है?", "👃 Smell — कुछ fruits में aroma ripeness का संकेत दे सकता है।", "🦠 Spoilage — mould, leaking, unusual soft spots, खराब smell दिख रही है?"] },
            { t: "note", k: "mistake", title: "⚠️ केवल “दाग = खराब” भी सही नहीं", x: "कुछ surface marks cosmetic हो सकते हैं और फल अंदर से ठीक हो सकता है। इसलिए appearance + smell + texture + spoilage signs को साथ देखकर निर्णय लेना चाहिए।" },
            { t: "table", head: ["Check", "क्या देखें"], rows: [
              ["Appearance", "चोट, दाग"],
              ["Firmness", "variety के अनुसार"],
              ["Smell", "aroma / खराब गंध"],
              ["Spoilage", "mould, leaking, soft spots"],
            ] },
          ],
        },
        {
          id: "c14", number: 14, title: "फल सुरक्षित कैसे खाएँ?", titleHi: "Eating Fruits Safely", icon: "🧼",
          blocks: [
            { t: "p", x: "फल खाने से पहले:" },
            { t: "ol", items: ["🧼 हाथ साफ करो।", "🚿 फल को साफ पानी से धोओ।", "🔪 काटने वाले utensils साफ रखो।", "🧊 कटे हुए फल को उचित storage में रखो।"] },
            { t: "p", x: "काटे हुए फल को लंबे समय तक कमरे के तापमान पर खुला छोड़ने के बजाय उचित storage करो। कटे हुए fruit को जरूरत के अनुसार refrigerator में रखें और खराब होने के संकेत दिखें तो न खाएँ।" },
            { t: "note", k: "remember", title: "🧼 Safety Rule", x: "Clean hands + clean fruit + clean utensils + proper storage।" },
          ],
        },
        {
          id: "c15", number: 15, title: "Common Myths", titleHi: "Common Myths", icon: "⚠️",
          blocks: [
            { t: "h", x: "15.1 Fruit और भोजन" },
            { t: "note", k: "mistake", title: "❌ Myth", x: "“सभी फल खाने के तुरंत बाद हर व्यक्ति को नुकसान करते हैं।”" },
            { t: "note", k: "real", title: "✅ Reality", x: "ऐसी universal rule नहीं है। व्यक्ति की स्थिति और भोजन pattern महत्वपूर्ण होते हैं।" },
            { t: "h", x: "15.2 Juice और Whole Fruit" },
            { t: "note", k: "mistake", title: "❌ Myth", x: "“Fruit juice हमेशा whole fruit से ज्यादा healthy है।”" },
            { t: "note", k: "real", title: "✅ Reality", x: "Whole fruit में dietary fibre और chewing/satiety का अलग लाभ हो सकता है; juice का nutritional profile अलग होता है।" },
            { t: "h", x: "15.3 रंग और Nutrition" },
            { t: "note", k: "mistake", title: "❌ Myth", x: "“जिस फल का रंग बहुत गहरा है, वही सबसे nutritious है।”" },
            { t: "note", k: "real", title: "✅ Reality", x: "रंग nutrition का एकमात्र measure नहीं है।" },
          ],
        },
      ],
    },

    {
      id: "m6", title: "फल और दुनिया", titleHi: "Fruits & the World", icon: "🌍",
      chapters: [
        {
          id: "c16", number: 16, title: "स्थानीय और वैश्विक फल", titleHi: "Local & Global Fruits", icon: "🌏",
          blocks: [
            { t: "h", x: "16.1 भारत में commonly मिलने वाले fruits" },
            { t: "ul", items: ["🥭 Mango", "🍌 Banana", "🍎 Apple", "🍊 Orange", "🍈 Guava", "🍇 Grapes", "🍉 Watermelon", "🍍 Pineapple", "🥭 Papaya", "🫐 Jamun"] },
            { t: "h", x: "16.2 दुनिया के अन्य हिस्सों में" },
            { t: "ul", items: ["🥝 Kiwi", "🍑 Peach", "🍐 Pear", "🍒 Cherry", "🫐 Blueberry"] },
            { t: "note", k: "info", x: "Availability region और season के अनुसार बदलती है।" },
          ],
        },
        {
          id: "c17", number: 17, title: "किसान से हमारी थाली तक", titleHi: "Farm to Plate", icon: "🚚",
          blocks: [
            { t: "p", x: "एक fruit की journey समझो:" },
            { t: "flow", items: ["🌱 Plant", "🌸 Flower", "🍏 Fruit development", "👨‍🌾 Harvest", "📦 Sorting / packing", "🚚 Transport", "🏪 Market / shop", "🏠 Home", "🍽️ Consumer"] },
            { t: "note", k: "concept", title: "🧠 Food Supply Chain", x: "इस पूरी प्रक्रिया को food supply chain का हिस्सा समझा जा सकता है।" },
          ],
        },
        {
          id: "c18", number: 18, title: "फल और पर्यावरण", titleHi: "Fruits & Environment", icon: "♻️",
          blocks: [
            { t: "p", x: "Fruit production के लिए इनकी जरूरत हो सकती है:" },
            { t: "ul", items: ["land", "water", "energy", "labour", "transportation", "packaging"] },
            { t: "p", x: "इसलिए food waste कम करना महत्वपूर्ण है। यदि घर में खरीदे हुए फल खराब हो जाएँ, तो केवल पैसा ही नहीं, बल्कि उन्हें पैदा करने में लगे resources भी व्यर्थ होते हैं।" },
            { t: "note", k: "real", title: "♻️ छोटा कदम", x: "जरूरत के अनुसार खरीदो, सही storage करो और पहले पके/नरम फल पहले खाओ — इससे waste घटता है।" },
            { t: "act", title: "Food Waste Plan", items: ["घर के 6 फलों की सूची बनाओ", "कौन पहले खाना चाहिए और क्यों, लिखो", "एक storage tip लिखो"] },
          ],
        },
      ],
    },
  ],

  revision: {
    title: "पूरा course एक नज़र में",
    groups: [
      { title: "🍎 Fruit पहचानने के लिए", items: ["देखो → छुओ → सूंघो → समझो → पहचानो"] },
      { title: "🌱 Plant connection", items: ["Flower → Fruit → Seed (जहाँ लागू हो)"] },
      { title: "🌈 Food understanding", items: ["Colour + Variety + Ripeness + Nutrition"] },
      { title: "🛒 खरीदना", items: ["Freshness + condition + ripeness + spoilage"] },
      { title: "🧼 Safety", items: ["Clean hands + clean fruit + clean utensils + proper storage"] },
      { title: "🌾 Bigger picture", items: ["Farmer → Harvest → Supply Chain → Market → Home → Plate"] },
    ],
  },

  mastery: {
    title: "Final Mastery Test / अंतिम परीक्षा",
    note: "यह test पहचान, classification, understanding, application, nutrition, agriculture और reasoning — सातों levels को cover करता है।",
    tasks: [
      { icon: "🔍", title: "Level 1 — पहचान", x: "चित्र देखकर fruit का नाम बताओ।" },
      { icon: "🗂️", title: "Level 2 — Classification", x: "Fruit को colour / shape / plant source के आधार पर classify करो।" },
      { icon: "🧠", title: "Level 3 — Understanding", x: "Banana को “tree” कहना सामान्य भाषा में ठीक क्यों लगता है लेकिन botanical रूप से वह tree नहीं है?" },
      { icon: "🍽️", title: "Level 4 — Application", x: "घर में खरीदे 6 fruits में से कौन से पहले खाने चाहिए और क्यों?" },
      { icon: "🥗", title: "Level 5 — Nutrition", x: "Whole fruit और juice में मुख्य practical difference समझाओ।" },
      { icon: "👨‍🌾", title: "Level 6 — Agriculture", x: "किसान को fruit production के लिए किन environmental factors पर ध्यान देना पड़ सकता है?" },
      { icon: "🧠", title: "Level 7 — Reasoning", x: "एक fruit बाहर से अच्छा दिख रहा है लेकिन उसमें mould और खराब smell है — क्या तुम उसे खाओगे?" },
      { icon: "🛠️", title: "Level 8 — Master Project", x: "अपने क्षेत्र के 10 fruits की complete fruit field-book बनाओ।" },
    ],
    quiz: [
      { q: "किसी फल की पहचान केवल रंग से करना क्यों पर्याप्त नहीं?", options: ["रंग कभी नहीं दिखता", "एक ही फल की varieties में रंग बदल सकता है", "रंग से स्वाद पता चलता है", "रंग से बीज दिखते हैं"], answer: 1, explain: "एक ही फल की varieties के अनुसार रंग बदल सकता है, इसलिए आकार, गंध और बनावट भी देखें।" },
      { q: "Botanical दृष्टि से banana plant क्या है?", options: ["Woody tree", "Large herbaceous plant", "Creeping vine", "झाड़ी"], answer: 1, explain: "बोलचाल में banana tree कहते हैं, पर botanical रूप से वह large herbaceous plant है।" },
      { q: "Watermelon किस पौधे से मिलता है?", options: ["पेड़", "Creeping vine", "झाड़ी", "घास"], answer: 1, explain: "Watermelon जमीन पर फैलने वाली creeping vine से मिलता है।" },
      { q: "फल बनने का सही क्रम कौन सा है?", options: ["Fruit → Flower → Seed", "Flower → Pollination → Fertilization → Fruit", "Seed → Fruit → Flower", "Fruit → Seed → Flower"], answer: 1, explain: "फूल → परागण → निषेचन → फल विकास → पका फल।" },
      { q: "Seedless fruit का क्या अर्थ है?", options: ["पौधा कभी reproduce नहीं कर सकता", "फल में बीज नहीं दिखता, पर propagation दूसरे तरीकों से होती है", "फल नकली है", "फल में vitamins नहीं होते"], answer: 1, explain: "Seedless varieties को propagation के दूसरे तरीकों से उगाया जाता है।" },
      { q: "Whole fruit और juice में मुख्य अंतर क्या है?", options: ["कोई अंतर नहीं", "Whole fruit में dietary fibre मिलता है, juice का profile अलग होता है", "Juice हमेशा ज्यादा healthy है", "Whole fruit में sugar नहीं होती"], answer: 1, explain: "Whole fruit में fibre तथा chewing/satiety का लाभ हो सकता है; juice का nutritional profile अलग होता है।" },
      { q: "Ripeness का भरोसेमंद संकेत कौन सा है?", options: ["केवल चमक", "रंग + aroma + softness जैसे कई संकेत", "केवल दाम", "केवल आकार"], answer: 1, explain: "कई संकेत मिलाकर ripeness तय करें; केवल बाहरी रंग पर्याप्त नहीं।" },
      { q: "फल खरीदते समय क्या ध्यान रखें?", options: ["केवल सबसे चमकीला फल", "appearance + firmness + smell + spoilage signs", "केवल रंग", "केवल वजन"], answer: 1, explain: "Appearance, firmness, smell और spoilage signs साथ देखें।" },
      { q: "एक फल बाहर से ठीक पर mould और खराब smell है — क्या करें?", options: ["खा लें", "धोकर खा लें", "न खाएँ", "सिर्फ ऊपर वाला हिस्सा खाएँ"], answer: 2, explain: "Spoilage के स्पष्ट संकेत food safety concern हैं, इसलिए उसे न खाएँ।" },
      { q: "Vitamin C के अच्छे dietary source का उदाहरण कौन सा है?", options: ["चावल", "Orange / Lemon जैसे citrus fruits", "तेल", "नमक"], answer: 1, explain: "Citrus fruits, विशेषकर orange और lemon, vitamin C के अच्छे sources हो सकते हैं।" },
    ],
  },

  outcomeIntro: "इस course के बाद learner केवल फल के नाम याद नहीं करेगा। वह:",
  outcome: [
    "🍎 अलग-अलग fruits पहचान सकेगा",
    "🎨 colours और physical characteristics describe कर सकेगा",
    "🌱 उनके plant sources समझ सकेगा",
    "🌦️ season और availability का संबंध समझ सकेगा",
    "🧬 seeds और fruit development की basic science समझ सकेगा",
    "🥗 nutrition की basic भूमिका समझ सकेगा",
    "🧃 whole fruit और juice में अंतर समझ सकेगा",
    "🍌 ripeness के संकेत पहचान सकेगा",
    "🛒 बेहतर तरीके से fruit चुन सकेगा",
    "🧼 fruit hygiene और safe handling समझ सकेगा",
    "🌾 farmer से consumer तक fruit की journey समझ सकेगा",
    "♻️ food waste कम करने की आवश्यकता समझ सकेगा",
    "🧠 और observations के आधार पर फल के बारे में reason कर सकेगा",
  ],
  outcomeClose: "यही “Fruits / फल” को केवल नाम याद करने वाले topic से एक वास्तविक learning course बनाता है।",
};

export const isFruitsSubject = (subject) => {
  if (!subject) return false;
  const base = String(subject.en || "").toLowerCase().trim();
  return base === "fruits" || /फल/.test(subject.hi || subject.title || "");
};

export const FRUITS_CHAPTER_IDS = FRUITS_COURSE.modules.flatMap((m) => m.chapters.map((c) => c.id));

/** Read Fruits progress with legacy numeric entries migrated. */
export const readFruitsProgress = (subject) => readMigratedProgress(subject, FRUITS_CHAPTER_IDS);
