/**
 * Vocabulary Building / शब्द भंडार — Master Course content.
 *
 * Full teaching material (Zero Knowledge → Vocabulary Mastery), not a
 * heading/template list. Rendered by MasterCourse.jsx with the same typed block
 * schema as Time & Calendar and Fruits.
 *
 * Block types: h, p, ul, ol, flow, table, note, ex, act, ch, mistakes.
 */

import { readMigratedProgress } from "./courseProgress";

export const VOCABULARY_COURSE = {
  meta: {
    icon: "📖",
    title: ["Vocabulary Building", "शब्द भंडार"],
    level: "Beginner → Practical → Mastery",
    tag: "English & Communication",
    tagline: "नए शब्द समझना, याद रखना, context में प्रयोग करना और independently सीखना।",
    heroSubtitle:
      "यह केवल शब्दों की list नहीं — यह Vocabulary Mastery Course है। शब्द देखने से लेकर independently सीखने तक, हर stage पर concept, example, practice और revision के साथ।",
  },

  overview: {
    what: "Vocabulary शब्दों का भंडार है — वे शब्द जिन्हें हम पढ़ते, सुनते, बोलते और लिखते हैं। शब्द सीखना केवल अर्थ याद करना नहीं, बल्कि context, प्रयोग और याद रखने की आदत है।",
    why: "अच्छा शब्द-भंडार समझ, बोलने, लिखने और आत्मविश्वास को बढ़ाता है। सही शब्द सही जगह पर use करना संचार को स्पष्ट और प्रभावी बनाता है।",
    where: "पढ़ाई, बातचीत, exam, interview, email, office, social media और रोज़मर्रा की हर बातचीत में शब्द काम आते हैं।",
    outcome: "Learner नया शब्द देखकर context से अर्थ समझ सकेगा, dictionary से verify कर सकेगा, synonyms/antonyms और word families का सही प्रयोग कर सकेगा और unfamiliar शब्दों को independently सीख सकेगा।",
  },

  courseStart: {
    title: "चलो शब्दों की दुनिया में उतरते हैं",
    blocks: [
      { t: "p", x: "सोचो — जब तुम किसी नई चीज़ का नाम सीखते हो, तो तुम्हारी दुनिया थोड़ी बड़ी हो जाती है।" },
      { t: "p", x: "जितने ज़्यादा शब्द तुम जानते हो, उतने ही सटीक तरीके से तुम अपनी बात कह सकते हो।" },
      { t: "note", k: "goal", title: "इस course का लक्ष्य", x: "नया शब्द देखना → context समझना → अर्थ पहचानना → dictionary से verify करना → अनेक अर्थ समझना → synonyms/antonyms का सही प्रयोग → word family समझना → sentence बनाना → बोलना/लिखना → revision → unfamiliar शब्द independently सीखना।" },
      { t: "note", k: "warn", title: "यह क्या नहीं है", x: "यह केवल vocabulary list नहीं है और कोई “What is Vocabulary” वाला खोखला chapter नहीं है। हर lesson में असली teaching, example, practice और feedback है।" },
      { t: "note", k: "info", title: "सीखने का flow", x: "हर lesson में: Concept → Teacher Explanation → Example → Worked Example → Guided Practice → Independent Practice → Feedback → Real-life Application → Revision।" },
      { t: "dict", title: "📚 Online Dictionary — हर नया शब्द यहीं जाँचें", x: "कोई भी English शब्द टाइप करके उसका अर्थ, उच्चारण (pronunciation), example और speech सुनें। नया शब्द सीखने के बाद तुरंत यहाँ verify करना आदत बनाएँ।", suggest: ["courage", "curious", "improve", "honest", "achieve", "confident", "context"] },
    ],
  },

  modules: [
    {
      id: "m1", title: "शब्द को सीखना", titleHi: "Learning a Word", icon: "🧱",
      chapters: [
        {
          id: "c1", number: 1, title: "शब्द क्या है और उसे सही तरह कैसे सीखें", titleHi: "What a Word Is & How to Learn It", icon: "🧱",
          blocks: [
            { t: "h", x: "1.1 शब्द क्या है?" },
            { t: "p", x: "शब्द भाषा की सबसे छोटी स्वतंत्र इकाई है जो कोई अर्थ या भाव देती है। “पानी”, “book”, “दौड़ना”, “सुंदर” — ये सब शब्द हैं।" },
            { t: "note", k: "concept", title: "🧠 शब्द = रूप + अर्थ + प्रयोग", x: "किसी शब्द को जानने का मतलब है — उसका रूप (spelling/pronunciation), उसका अर्थ, और उसका सही प्रयोग तीनों जानना।" },

            { t: "h", x: "1.2 केवल definition याद करना पर्याप्त क्यों नहीं?" },
            { t: "p", x: "मान लो तुमने रट लिया: “साहस = Courage”। लेकिन क्या तुम “साहस” शब्द को अपनी बातचीत में use कर पाओगे? शायद नहीं।" },
            { t: "mistakes", items: [
              { w: "अर्थ को अकेले रट लेना (साहस = Courage) और बस।", c: "शब्द को situation, example और अपने वाक्य से जोड़कर सीखना।" },
              { w: "सुनना/बोलना छोड़ देना।", c: "शब्द को ज़ोर से बोलना और सुनना — pronunciation के साथ।" },
            ] },

            { t: "h", x: "1.3 Word → Meaning → Idea → Example → Usage" },
            { t: "p", x: "किसी भी शब्द को इस क्रम में सीखो:" },
            { t: "flow", items: ["Word — शब्द", "Meaning — अर्थ", "Idea — पीछे का विचार", "Example — उदाहरण", "Usage — अपना प्रयोग"] },
            { t: "note", k: "tip", x: "यही क्रम रटने और सच में सीखने के बीच का फर्क है। Idea step से शब्द ‘ज़िंदा’ हो जाता है।" },

            { t: "h", x: "1.4 एक शब्द को पूरी तरह कैसे सीखें" },
            { t: "ex", title: "Worked Example — साहस / Courage", x: "सिर्फ “साहस = Courage” नहीं, बल्कि पूरा चित्र बनाओ:", steps: [
              "सरल Hindi meaning: डर के बावजूद सही काम करने की हिम्मत।",
              "English equivalent: courage / bravery।",
              "Pronunciation: कौर-इज (जहाँ उपयोगी हो)।",
              "Real-life situation: अंधेरे में अकेले घर जाते समय डर लगना, पर फिर भी आगे बढ़ना।",
              "Example sentence: “उसने सच बोलने का साहस दिखाया।”",
              "Related words: brave, bold, fearless।",
              "Appropriate opposite: कायरता / cowardice।",
              "Own sentence: “मैंने stage पर बोलने का साहस किया।”",
              "Speaking usage: किसी की तारीफ़ करते समय — “That took real courage!”",
            ] },

            { t: "act", title: "Guided Practice — पहला शब्द", x: "“मेहनत / hard work” को ऊपर वाले 9 steps से सीखो।", items: ["Hindi meaning लिखो", "English equivalent लिखो", "एक real-life situation सोचो", "एक वाक्य बनाओ", "एक related word और opposite लिखो"] },
            { t: "ch", title: "Independent Practice", x: "आज कोई एक नया शब्द चुनो और उसका पूरा ‘word card’ बनाओ।", items: ["Word", "Meaning (Hindi + English)", "Example", "Synonym / Antonym", "अपना वाक्य"] },
            { t: "note", k: "remember", title: "Revision", x: "शब्द को एक बार सीखकर भूलना आम है। कल फिर उसी शब्द को बिना देखे याद करो — यही असली learning है।" },
          ],
        },
      ],
    },

    {
      id: "m2", title: "Context से अर्थ", titleHi: "Meaning from Context", icon: "🔍",
      chapters: [
        {
          id: "c2", number: 2, title: "Context से word meaning समझना", titleHi: "Understanding Meaning from Context", icon: "🔍",
          blocks: [
            { t: "p", x: "जब तुम किसी अजनबी शब्द को पढ़ते या सुनते हो, तो हर बार dictionary नहीं खोलते। तुम आसपास के शब्दों से उसका अर्थ अंदाज़ा लगाते हो — इसे context clue कहते हैं।" },
            { t: "h", x: "2.1 Context Clues के प्रकार" },
            { t: "table", head: ["Clue", "कैसे मदद करता है", "उदाहरण"], rows: [
              ["Definition clue", "सीधे अर्थ बताया जाता है", "“A carnivore, that is, a meat-eating animal…”"],
              ["Example clue", "उदाहरण से अर्थ साफ़ होता है", "“Fruits like mango, guava, papaya…”"],
              ["Description clue", "विवरण से अर्थ बनता है", "“The tiny, buzzing insect flew near the flower.”"],
              ["Contrast clue", "उल्टे शब्द से अर्थ साफ़ होता है", "“Unlike his calm brother, he was always agitated.”"],
              ["Prior knowledge", "पहले से जानी बात से मदद", "बारिश का ज़िक्र → छाता/गीला शब्द का अर्थ"],
            ] },
            { t: "h", x: "2.2 एक ही शब्द, अलग अर्थ — context से" },
            { t: "note", k: "concept", title: "🧠 तेज", x: "“तेज बारिश” में ‘तेज’ = तेज़ गति/तीव्रता। पर “तेज दौड़ना” में ‘तेज’ = गति। “तेज दिमाग” में ‘तेज’ = बुद्धिमान। शब्द वही, अर्थ context से बदल जाता है।" },
            { t: "h", x: "2.3 Helpful vs Weak Context" },
            { t: "ul", items: ["Helpful context — वाक्य में इतना संकेत है कि अर्थ लगभग साफ़ हो जाए।", "Weak context — वाक्य में कोई खास संकेत नहीं, अनुमान मुश्किल। तब dictionary ज़रूरी है।"] },
            { t: "ex", title: "Worked Example — अनुमान लगाओ", x: "वाक्य: “The traveller was exhausted after walking all day under the sun.”", steps: [
              "पहले पूरा वाक्य पढ़ो।",
              "अजनबी शब्द: exhausted।",
              "संकेत: “walking all day under the sun”।",
              "अनुमान: बहुत थका हुआ।",
              "Verify: dictionary → exhausted = बहुत थका हुआ।",
              "मिलान: अनुमान सही था।",
            ] },
            { t: "act", title: "Guided Practice — Context Choice", x: "वाक्य: “अंधेरे में रास्ता साफ़ नहीं दिख रहा था।” शब्द: ‘साफ़’।", items: ["Meaning 1: स्वच्छ (clean)", "Meaning 2: स्पष्ट (clear)", "Meaning 3: खाली (empty)", "सही meaning चुनो और बताओ क्यों।"] },
            { t: "note", k: "tip", title: "Feedback", x: "सही उत्तर: ‘स्पष्ट’ — क्योंकि यहाँ बात रास्ता ‘दिखने’ की है, cleanliness की नहीं। ‘स्वच्छ’ इस context में fit नहीं; ‘खाली’ तो बिल्कुल मेल नहीं खाता।" },
            { t: "ch", title: "Independent Practice", x: "कोई एक अजनबी शब्द वाला वाक्य ढूँढो, अनुमान लगाओ, फिर dictionary से check करो।", items: ["अनुमान लिखो", "सही अर्थ लिखो", "दोनों में अंतर बताओ"] },
          ],
        },
      ],
    },

    {
      id: "m3", title: "अनेक अर्थ", titleHi: "Multiple Meanings", icon: "🎭",
      chapters: [
        {
          id: "c3", number: 3, title: "अनेक अर्थ / Multiple Meanings", titleHi: "One Word, Many Meanings", icon: "🎭",
          blocks: [
            { t: "p", x: "कई शब्दों के एक से ज़्यादा अर्थ होते हैं। सही अर्थ context तय करता है।" },
            { t: "h", x: "3.1 हिंदी उदाहरण — कल" },
            { t: "ul", items: ["“मैं कल गया था।” → कल = बीता हुआ दिन (yesterday)", "“मैं कल जाऊँगा।” → कल = आने वाला दिन (tomorrow)"] },
            { t: "note", k: "concept", x: "एक ही शब्द ‘कल’ past और future दोनों दिखा सकता है — केवल verb (गया था / जाऊँगा) से अर्थ तय होता है।" },
            { t: "h", x: "3.2 English उदाहरण — bank" },
            { t: "table", head: ["Meaning", "Context", "Example"], rows: [
              ["financial institution", "पैसे का लेन-देन", "I deposited money in the bank."],
              ["side of a river", "नदी का किनारा", "We sat on the river bank."],
            ] },
            { t: "h", x: "3.3 English उदाहरण — branch" },
            { t: "table", head: ["Meaning", "Context", "Example"], rows: [
              ["tree branch", "पेड़ की डाल", "A bird sat on the branch."],
              ["branch of an organization", "कार्यालय की शाखा", "The bank opened a new branch."],
              ["branch of a subject/system", "विषय की शाखा", "Physics is a branch of science."],
            ] },
            { t: "note", k: "warn", x: "रैंडम अर्थों की लंबी list मत रटो। हर अर्थ के साथ उसका context और example जोड़ो — तभी याद रहेगा।" },
            { t: "act", title: "Guided Practice — इस sentence में कौन-सा meaning?", x: "वाक्य: “वह पेड़ की शाखा पर बैठी चिड़िया को देख रहा था।”", items: ["Meaning A: office branch", "Meaning B: tree branch", "Meaning C: subject branch", "सही चुनो और कारण बताओ।"] },
            { t: "note", k: "tip", title: "Feedback", x: "सही उत्तर B (tree branch) — क्योंकि वाक्य में ‘पेड़’ और ‘चिड़िया’ हैं। A और C का office/subject से कोई संकेत नहीं।" },
            { t: "ch", title: "Independent Practice", x: "‘light’ शब्द के दो अर्थ ढूँढो और हर एक का वाक्य बनाओ।", items: ["अर्थ 1 + वाक्य", "अर्थ 2 + वाक्य"] },
          ],
        },
      ],
    },

    {
      id: "m4", title: "पर्यायवाची", titleHi: "Synonyms", icon: "🟰",
      chapters: [
        {
          id: "c4", number: 4, title: "पर्यायवाची / Synonyms", titleHi: "Synonyms", icon: "🟰",
          blocks: [
            { t: "p", x: "Synonym वे शब्द हैं जिनका अर्थ लगभग समान होता है — जैसे big और large। लेकिन ‘लगभग समान’ और ‘बिल्कुल समान’ में फर्क होता है।" },
            { t: "h", x: "4.1 Exact और Near-synonym" },
            { t: "note", k: "concept", title: "🧠 जल / पानी / नीर", x: "तीनों का मतलब पानी है, पर प्रयोग अलग: “जल संरक्षण” (formal), “पानी पीना” (रोज़मर्रा), “नीर” (कविता/साहित्य)।" },
            { t: "h", x: "4.2 हर synonym हर जगह क्यों नहीं लगता" },
            { t: "table", head: ["शब्द", "Register / context"], rows: [
              ["जल", "Formal, official, साहित्य"],
              ["पानी", "रोज़मर्रा की बोलचाल"],
              ["नीर", "काव्य / पुराना साहित्य"],
            ] },
            { t: "note", k: "tip", x: "Synonym list रटना vocabulary learning नहीं है। असली कौशल है — सही जगह सही शब्द चुनना।" },
            { t: "ex", title: "Worked Example — कौन-सा शब्द सही?", x: "वाक्य: “सरकार ने ____ संरक्षण के लिए योजना शुरू की।”", steps: [
              "वाक्य formal है (सरकार, योजना)।",
              "विकल्प: जल / पानी / नीर।",
              "‘पानी’ बोलचाल का है — formal वाक्य में कमज़ोर।",
              "‘नीर’ काव्य का है — यहाँ ठीक नहीं।",
              "‘जल’ formal है — सबसे उपयुक्त।",
              "उत्तर: जल।",
            ] },
            { t: "act", title: "Guided Practice", x: "वाक्य: “बच्चे मैदान में ____ रहे हैं।”", items: ["विकल्प: दौड़ / भाग / शीघ्र", "सही चुनो", "बताओ बाकी क्यों नहीं"] },
            { t: "note", k: "tip", title: "Feedback", x: "‘दौड़ रहे हैं’ सही है। ‘भाग’ भी चल सकता है पर भाव अलग (डर से भागना)। ‘शीघ्र’ एक क्रिया-विशेषण है, क्रिया नहीं — इसलिए fit नहीं।" },
            { t: "ch", title: "Independent Practice", x: "‘अच्छा’ के तीन synonyms लिखो और हर एक के लिए एक उपयुक्त वाक्य बनाओ।" },
          ],
        },
      ],
    },

    {
      id: "m5", title: "विलोम", titleHi: "Antonyms", icon: "↔️",
      chapters: [
        {
          id: "c5", number: 5, title: "विलोम / Antonyms", titleHi: "Antonyms", icon: "↔️",
          blocks: [
            { t: "p", x: "Antonym वे शब्द हैं जिनका अर्थ उल्टा होता है — जैसे दिन ↔ रात।" },
            { t: "table", head: ["शब्द", "विलोम"], rows: [
              ["दिन", "रात"],
              ["ऊँचा", "नीचा"],
              ["सुख", "दुख"],
              ["आना", "जाना"],
            ] },
            { t: "note", k: "warn", title: "हर शब्द का perfect opposite नहीं होता", x: "कुछ शब्दों का एक जैसा उल्टा नहीं होता। जैसे ‘book’ का कोई सीधा opposite नहीं। context के अनुसार जोड़ा बदल सकता है।" },
            { t: "h", x: "5.1 Context और antonym" },
            { t: "ul", items: ["‘गर्म’ का opposite सामान्यतः ‘ठंडा’।", "पर “गर्म स्वभाव” के context में opposite ‘शांत’ हो सकता है।"] },
            { t: "ex", title: "Worked Example", x: "वाक्य: “आज मौसम बहुत गर्म है।”", steps: ["यहाँ ‘गर्म’ तापमान के बारे में है।", "तापमान का opposite = ठंडा।", "उत्तर: ठंडा।"] },
            { t: "act", title: "Guided Practice", x: "इनके विलोम लिखो।", items: ["सुख", "ऊँचा", "जीत", "सुबह"] },
            { t: "ch", title: "Independent Practice", x: "कोई एक शब्द चुनो जिसका context के साथ अलग-अलग opposite हो सके, और दो वाक्य बनाओ।" },
          ],
        },
      ],
    },

    {
      id: "m6", title: "Word Precision", titleHi: "Choosing the Right Word", icon: "🎯",
      chapters: [
        {
          id: "c6", number: 6, title: "Word Precision — सही शब्द चुनना", titleHi: "Word Precision", icon: "🎯",
          blocks: [
            { t: "p", x: "यह course का सबसे important advanced हिस्सा है। अच्छा vocabulary का मतलब कठिन शब्द नहीं, बल्कि सही शब्द चुनना है।" },
            { t: "ex", title: "Worked Example — ‘अच्छा’ किस sense में?", x: "वाक्य: “वह अच्छा काम करता है।” ‘अच्छा’ धुँधला शब्द है। असली अर्थ क्या है?", steps: [
              "अगर काम समय बचाता है → efficient (कुशल, कम समय-संसाधन में)।",
              "अगर काम का असर होता है → effective (प्रभावी, जो परिणाम दे)।",
              "अगर काम से फ़ायदा होता है → useful (उपयोगी)।",
              "अगर काम लक्ष्य पूरा करता है → successful (सफल)।",
              "अगर काम व्यवहार में लागू होता है → practical (व्यावहारिक)।",
            ] },
            { t: "table", head: ["शब्द", "असली भाव", "उदाहरण"], rows: [
              ["efficient", "कम समय/संसाधन में काम", "an efficient worker"],
              ["effective", "जो परिणाम दे", "an effective medicine"],
              ["useful", "जिससे फ़ायदा हो", "a useful tool"],
              ["successful", "लक्ष्य पूरा करने वाला", "a successful plan"],
              ["practical", "व्यवहार में लागू", "a practical solution"],
            ] },
            { t: "note", k: "remember", title: "Goal", x: "Learner सही शब्द चुनना सीखे — सिर्फ कठिन शब्द नहीं।" },
            { t: "act", title: "Guided Practice", x: "वाक्य: “यह एक ____ तरीका है जो कम पैसे में ज़्यादा काम करता है।”", items: ["विकल्प: efficient / useful / successful", "सही चुनो", "कारण बताओ"] },
            { t: "note", k: "tip", title: "Feedback", x: "‘efficient’ सही — क्योंकि बात कम पैसे/संसाधन में ज़्यादा काम की है। ‘useful’ फ़ायदे की बात करता है पर efficiency नहीं; ‘successful’ लक्ष्य की बात करता है।" },
            { t: "ch", title: "Independent Practice", x: "‘अच्छा’ शब्द का प्रयोग छोड़कर तीन वाक्य लिखो, हर बार अलग precise शब्द use करो।" },
          ],
        },
      ],
    },

    {
      id: "m7", title: "Active vs Passive", titleHi: "Active & Passive Vocabulary", icon: "🔊",
      chapters: [
        {
          id: "c7", number: 7, title: "Active vs Passive Vocabulary", titleHi: "Active vs Passive Vocabulary", icon: "🔊",
          blocks: [
            { t: "table", head: ["प्रकार", "परिभाषा", "उदाहरण"], rows: [
              ["Passive vocabulary", "शब्द पढ़ने/सुनने पर समझ आता है", "‘magnificent’ पढ़कर मतलब समझ आ जाए"],
              ["Active vocabulary", "बोलते/लिखते समय स्वयं याद आता है", "बोलते समय खुद ‘magnificent’ use करना"],
            ] },
            { t: "note", k: "concept", x: "अक्सर passive vocabulary बड़ा होता है, active छोटा। असली काम है — passive शब्दों को active बनाना।" },
            { t: "h", x: "7.1 Passive → Active कैसे करें" },
            { t: "flow", items: ["Word दिखाओ", "Meaning पहचानो (passive)", "बिना options वाला अपना sentence बनाओ", "ज़ोर से बोलो (speaking task)", "अगले दिन बिना देखे फिर use करो"] },
            { t: "act", title: "Guided Practice", x: "शब्द: ‘improve’", items: ["Meaning लिखो", "बिना देखे एक वाक्य बनाओ", "वह वाक्य ज़ोर से बोलो", "कल फिर एक नया वाक्य बनाओ"] },
            { t: "ch", title: "Independent Practice", x: "पाँच ऐसे शब्द चुनो जो तुम समझते हो पर बोलते नहीं, और उनसे बोलकर वाक्य बनाओ।" },
          ],
        },
      ],
    },

    {
      id: "m8", title: "Word Families", titleHi: "Word Families", icon: "🌳",
      chapters: [
        {
          id: "c8", number: 8, title: "Word Families", titleHi: "Word Families", icon: "🌳",
          blocks: [
            { t: "p", x: "एक मूल शब्द से कई शब्द बनते हैं। इनके रूप बदलते हैं, और grammatical role भी।" },
            { t: "h", x: "8.1 CREATE family" },
            { t: "table", head: ["Word", "Part of speech", "अर्थ"], rows: [
              ["create", "verb", "बनाना"],
              ["creation", "noun", "रचना"],
              ["creative", "adjective", "रचनात्मक"],
              ["creatively", "adverb", "रचनात्मक ढंग से"],
              ["creator", "noun", "रचयिता"],
            ] },
            { t: "h", x: "8.2 DECIDE family" },
            { t: "table", head: ["Word", "Part of speech", "अर्थ"], rows: [
              ["decide", "verb", "निर्णय लेना"],
              ["decision", "noun", "निर्णय"],
              ["decisive", "adjective", "निर्णायक"],
              ["decisively", "adverb", "निर्णायक ढंग से"],
            ] },
            { t: "note", k: "concept", x: "केवल spelling नहीं बदलती — grammatical role और प्रयोग भी बदलता है। इसलिए “decide” और “decision” को अलग-अलग जगह use करना पड़ता है।" },
            { t: "ex", title: "Worked Example", x: "वाक्य बनाओ: “She made a quick decision.” (noun)", steps: ["यहाँ चाहिए noun → decision।", "“She decided quickly.” में verb + adverb।", "“She is a decisive leader.” में adjective।", "एक ही family, अलग-अलग role।"] },
            { t: "act", title: "Guided Practice", x: "‘decide’ family से सही रूप भरो।", items: ["“Please ____ fast.” (verb)", "“It was a hard ____.” (noun)", "“He answered ____.” (adverb)"] },
            { t: "ch", title: "Independent Practice", x: "‘create’ family के 5 शब्दों से 5 अलग वाक्य बनाओ।" },
          ],
        },
      ],
    },

    {
      id: "m9", title: "Prefix / Suffix", titleHi: "Word Parts", icon: "🧩",
      chapters: [
        {
          id: "c9", number: 9, title: "Prefix / Suffix / Word Parts", titleHi: "Prefix, Suffix & Word Parts", icon: "🧩",
          blocks: [
            { t: "p", x: "Word parts की पहचान से तुम अनजाने शब्द का अर्थ अंदाज़ा लगा सकते हो।" },
            { t: "table", head: ["Word part", "अर्थ", "उदाहरण"], rows: [
              ["un- (prefix)", "not", "un + happy → unhappy"],
              ["-ful (suffix)", "भरा हुआ / full of", "help + ful → helpful"],
              ["-less (suffix)", "बिना / without", "care + less → careless"],
            ] },
            { t: "note", k: "warn", title: "Blindly apply मत करो", x: "हर word पर कोई pattern लागू नहीं होता। जैसे ‘un-’ हमेशा ‘not’ नहीं देता (‘understand’ ≠ not-stand)। इसलिए पहचान के बाद verify करो।" },
            { t: "h", x: "9.1 Unfamiliar word की strategy" },
            { t: "flow", items: ["शब्द को meaningful parts में तोड़ो", "हर part का अर्थ सोचो", "जोड़कर अंदाज़ा बनाओ", "वाक्य के context से मिलाओ", "dictionary से verify करो"] },
            { t: "ex", title: "Worked Example — ‘careless’", x: "नया शब्द: careless", steps: ["care = ध्यान/परवाह", "-less = बिना", "जोड़ो → बिना परवाह", "context: “His careless mistake cost him.”", "Verify: careless = लापरवाह।"] },
            { t: "act", title: "Guided Practice", x: "इन शब्दों को parts में तोड़ो।", items: ["unhappy", "helpful", "hopeless", "re + build"] },
            { t: "ch", title: "Independent Practice", x: "कोई एक unfamiliar शब्द लो, parts पहचानो, अर्थ का अनुमान लगाओ, फिर verify करो।" },
          ],
        },
      ],
    },

    {
      id: "m10", title: "Dictionary Skills", titleHi: "Dictionary & Reference", icon: "📚",
      chapters: [
        {
          id: "c10", number: 10, title: "Dictionary और Reference Skills", titleHi: "Dictionary Skills", icon: "📚",
          blocks: [
            { t: "p", x: "Dictionary केवल अर्थ नहीं देती — वह pronunciation, part of speech, examples और related words भी देती है।" },
            { t: "h", x: "10.1 Dictionary entry में क्या देखें" },
            { t: "ul", items: ["Pronunciation", "Part of speech (noun/verb/…) ", "Meaning", "Multiple meanings", "Example", "Usage", "Related words"] },
            { t: "ex", title: "Sample entry — branch", x: "branch (noun) /brɑːntʃ/", steps: [
              "1. a part of a tree growing out from the trunk — “A bird sat on the branch.”",
              "2. a division of an organization — “The bank opened a new branch.”",
              "3. a division of a subject — “Physics is a branch of science.”",
            ] },
            { t: "act", title: "Guided Practice", x: "वाक्य: “She works at the city branch of the library.” इस वाक्य के लिए कौन-सा meaning सही है?", items: ["1. पेड़ की डाल", "2. संस्था की शाखा", "3. विषय की शाखा", "सही चुनो और कारण बताओ"] },
            { t: "note", k: "tip", title: "Feedback", x: "सही उत्तर 2 — क्योंकि ‘city branch of the library’ किसी संस्था की शाखा है। डाल का कोई संकेत नहीं।" },
            { t: "ch", title: "Independent Practice", x: "कोई एक शब्द चुनो, dictionary entry पढ़ो, और उसके दो meanings के दो वाक्य बनाओ।" },
          ],
        },
      ],
    },

    {
      id: "m11", title: "Reading से Vocabulary", titleHi: "Vocabulary from Reading", icon: "📄",
      chapters: [
        {
          id: "c11", number: 11, title: "Reading से Vocabulary सीखना", titleHi: "Learning Vocabulary from Reading", icon: "📄",
          blocks: [
            { t: "p", x: "पढ़ना vocabulary का सबसे बड़ा source है — अगर तुम सही process से पढ़ो।" },
            { t: "h", x: "11.1 पढ़ने का process" },
            { t: "ol", items: ["पूरा sentence पढ़ो।", "unknown word identify करो।", "context से अनुमान लगाओ।", "अपना अनुमान लिखो।", "dictionary/reference से check करो।", "difference compare करो।", "अपना sentence बनाओ।", "कुछ दिन बाद recall करो।"] },
            { t: "ex", title: "Worked Example — passage से शब्द", x: "वाक्य: “The old bridge was sturdy, so it survived the flood.”", steps: [
              "Unknown word: sturdy।",
              "Context clue: “survived the flood” → मज़बूत होगा।",
              "अनुमान: मज़बूत / टिकाऊ।",
              "Verify: sturdy = मज़बूत, दृढ़।",
              "अपना वाक्य: “The table is sturdy enough to hold the books.”",
            ] },
            { t: "act", title: "Guided Practice", x: "वाक्य: “She was reluctant to leave the party.” ‘reluctant’ का अनुमान लगाओ।", items: ["संकेत शब्द ढूँढो", "अनुमान लिखो", "verify करो"] },
            { t: "ch", title: "Independent Practice", x: "एक paragraph पढ़ो और 3 unknown words के लिए पूरा 8-step process करो।" },
          ],
        },
      ],
    },

    {
      id: "m12", title: "Formal / Informal", titleHi: "Register & Formality", icon: "🎩",
      chapters: [
        {
          id: "c12", number: 12, title: "Formal / Informal Vocabulary", titleHi: "Formal & Informal Vocabulary", icon: "🎩",
          blocks: [
            { t: "p", x: "एक ही बात अलग situation में अलग शब्दों से कही जाती है। इसे register कहते हैं।" },
            { t: "table", head: ["Situation", "उदाहरण"], rows: [
              ["Friend", "“यार, जल्दी आना।”"],
              ["Formal", "“कृपया समय पर उपस्थित होने का प्रयास करें।”"],
            ] },
            { t: "h", x: "12.1 अलग-अलग situations" },
            { t: "table", head: ["Situation", "उपयुक्त भाषा"], rows: [
              ["दोस्त", "“भाई, पहुँच गया?”"],
              ["Teacher", "“Sir, क्या मैं अंदर आ सकता हूँ?”"],
              ["Office", "“Please share the update by evening.”"],
              ["Official email", "“Kindly find the attached report.”"],
              ["Public announcement", "“Passengers are requested to remain seated.”"],
            ] },
            { t: "act", title: "Guided Practice", x: "सही register चुनो।", items: ["दोस्त को message: “Hey, what’s up?” या “Good morning, how do you do?”", "Principal को application: “I wanna leave early” या “I request permission to leave early”"] },
            { t: "note", k: "tip", title: "Feedback", x: "दोस्त को — “Hey, what’s up?” (informal)। Principal को — “I request permission…” (formal)। Situation न हो तो भाषा की choice बेमेल लगती है।" },
            { t: "ch", title: "Independent Practice", x: "एक ही बात तीन register में लिखो — दोस्त, teacher, official email।" },
          ],
        },
      ],
    },

    {
      id: "m13", title: "Academic Vocabulary", titleHi: "Academic Words", icon: "🎓",
      chapters: [
        {
          id: "c13", number: 13, title: "Academic Vocabulary", titleHi: "Academic Vocabulary", icon: "🎓",
          blocks: [
            { t: "p", x: "Academic words exam और पढ़ाई में बार-बार आते हैं — और हर एक का अपना काम है।" },
            { t: "table", head: ["Word", "काम", "उदाहरण"], rows: [
              ["explain", "कारण सहित समझाना", "Explain why the sky is blue."],
              ["describe", "विवरण देना", "Describe the process."],
              ["compare", "समानता-अंतर दिखाना", "Compare the two methods."],
              ["analyze", "टुकड़ों में तोड़कर समझना", "Analyze the causes."],
              ["evaluate", "मूल्यांकन करना", "Evaluate the result."],
              ["summarize", "सारांश देना", "Summarize the chapter."],
              ["evidence", "प्रमाण", "Give evidence for your claim."],
              ["conclusion", "निष्कर्ष", "State your conclusion."],
            ] },
            { t: "h", x: "13.1 Explain vs Analyze" },
            { t: "note", k: "concept", title: "🧠 Explain", x: "Explain = कैसे और क्यों, कारण के साथ स्पष्ट करना। “Explain why the plant died.”" },
            { t: "note", k: "concept", title: "🧠 Analyze", x: "Analyze = हिस्सों में तोड़कर हर हिस्से की जाँच करना। “Analyze the factors that led to the plant’s death.”" },
            { t: "h", x: "13.2 Describe vs Evaluate" },
            { t: "note", k: "concept", title: "🧠 Describe", x: "Describe = जो है वह बताना (क्या, कैसा)। “Describe the plant’s leaves.”" },
            { t: "note", k: "concept", title: "🧠 Evaluate", x: "Evaluate = अच्छाई/बुराई, मूल्य का फैसला करना। “Evaluate whether the method was effective.”" },
            { t: "act", title: "Guided Practice", x: "कौन-सा word चाहिए?", items: ["“____ the two pictures.” → describe / compare", "“____ why it happened.” → explain / summarize", "“____ if the answer is correct.” → evaluate / describe"] },
            { t: "ch", title: "Independent Practice", x: "एक topic लो और उस पर ‘explain’ और ‘analyze’ दोनों तरह से एक-एक वाक्य लिखो।" },
          ],
        },
      ],
    },

    {
      id: "m14", title: "Speaking Vocabulary", titleHi: "Speaking Words", icon: "🗣️",
      chapters: [
        {
          id: "c14", number: 14, title: "Speaking Vocabulary", titleHi: "Speaking Vocabulary", icon: "🗣️",
          blocks: [
            { t: "p", x: "शब्द सीखना तभी पूरा होता है जब वह बोलने में आए।" },
            { t: "note", k: "info", title: "आज के words", x: "reliable, accurate, essential, improve, observe" },
            { t: "table", head: ["Word", "अर्थ", "बोलने में"], rows: [
              ["reliable", "भरोसेमंद", "“He is a reliable friend.”"],
              ["accurate", "सटीक", "“Her answer was accurate.”"],
              ["essential", "ज़रूरी", "“Water is essential for life.”"],
              ["improve", "सुधारना", "“I want to improve my English.”"],
              ["observe", "निरीक्षण करना", "“Observe the change carefully.”"],
            ] },
            { t: "act", title: "Speaking Task", x: "इनमें से कम से कम 3 words use करके 30–60 second का response बनाओ और ज़ोर से बोलो।", items: ["3 words चुनो", "2–3 वाक्य बनाओ", "ज़ोर से बोलो (record कर सको तो करो)", "दोबारा बोलो और सुधार करो"] },
            { t: "note", k: "tip", x: "Audio मौजूद है — ऊपर 🔊 सुनें से lesson सुन सकते हो। बोलने का अभ्यास ज़ोर से दोहराने से होता है।" },
            { t: "ch", title: "Independent Practice", x: "‘reliable’ और ‘essential’ को अपनी रोज़मर्रा की बातचीत में आज use करो और नोट करो कि कब use किया।" },
          ],
        },
      ],
    },

    {
      id: "m15", title: "Writing Vocabulary", titleHi: "Writing Words", icon: "✍️",
      chapters: [
        {
          id: "c15", number: 15, title: "Writing Vocabulary", titleHi: "Writing Vocabulary", icon: "✍️",
          blocks: [
            { t: "p", x: "Writing में vague (धुँधले) शब्दों को precise शब्दों से बदलना सीखो।" },
            { t: "flow", items: ["“good” (vague)", "useful", "effective", "successful", "informative", "practical"] },
            { t: "note", k: "warn", x: "लेकिन हर जगह ये शब्द fit नहीं होंगे — context के अनुसार चुनो। ‘a good book’ में ‘informative’ हो सकता है, पर हर किताब informative नहीं होती।" },
            { t: "h", x: "15.1 Writing tasks के प्रकार" },
            { t: "ul", items: ["Sentence", "Short paragraph", "Description", "Formal message", "Opinion", "Explanation"] },
            { t: "ex", title: "Worked Example", x: "Vague: “This is a good plan.”", steps: [
              "क्या plan कम संसाधन में काम करता है? → “This is an efficient plan.”",
              "क्या plan परिणाम देता है? → “This is an effective plan.”",
              "क्या plan लागू हो सकता है? → “This is a practical plan.”",
            ] },
            { t: "act", title: "Guided Practice", x: "इन vague वाक्यों को precise बनाओ।", items: ["“He gave a good speech.”", "“It was a good idea.”"] },
            { t: "ch", title: "Independent Practice", x: "एक छोटा paragraph लिखो जिसमें ‘good’ शब्द बिल्कुल न हो, पर अर्थ साफ़ हो।" },
          ],
        },
      ],
    },

    {
      id: "m16", title: "Memory & Revision", titleHi: "Memory & Revision", icon: "🔁",
      chapters: [
        {
          id: "c16", number: 16, title: "Memory + Revision", titleHi: "Memory & Revision", icon: "🔁",
          blocks: [
            { t: "p", x: "Vocabulary को एक बार पढ़ाकर complete मत मानो। हर शब्द की एक progression होती है।" },
            { t: "flow", items: ["Encounter — पहली बार देखना", "Understand — अर्थ समझना", "Recall — बिना देखकर याद करना", "Use — sentence में लगाना", "Revisit — कुछ समय बाद फिर देखना", "Transfer — नए context में use करना"] },
            { t: "note", k: "concept", title: "🧠 Spaced Revision", x: "एक दिन बाद, तीन दिन बाद, एक हफ्ते बाद — थोड़े-थोड़े अंतराल पर दोहराना सबसे असरदार तरीका है।" },
            { t: "h", x: "16.1 Revision system" },
            { t: "ul", items: ["Flashcards बनाओ (एक तरफ़ शब्द, दूसरी तरफ़ अर्थ)।", "रोज़ 5 पुराने शब्द दोहराओ।", "जो शब्द भूल जाओ, उन्हें फिर से active बनाओ।"] },
            { t: "act", title: "Guided Practice", x: "आज सीखे शब्दों में से 3 चुनो और revision cycle के हर step को लिखो।", items: ["Encounter → Understand → Recall → Use → Revisit → Transfer"] },
            { t: "ch", title: "Independent Practice", x: "एक हफ्ते का revision plan बनाओ — हर दिन कौन-से शब्द दोहराओगे।" },
          ],
        },
      ],
    },

    {
      id: "m17", title: "Vocabulary Games", titleHi: "Practice Games", icon: "🎲",
      chapters: [
        {
          id: "c17", number: 17, title: "Vocabulary Games / Practice", titleHi: "Vocabulary Games", icon: "🎲",
          blocks: [
            { t: "p", x: "अभ्यास के अलग-अलग रूप से शब्द पक्के होते हैं। हर activity में सवाल अलग है।" },
            { t: "h", x: "17.1 Game types" },
            { t: "table", head: ["Activity", "क्या करना है"], rows: [
              ["Guess the Word", "Definition/context से शब्द पहचानो"],
              ["Meaning Match", "शब्द → सही अर्थ"],
              ["Synonym Match", "शब्द → पर्यायवाची"],
              ["Antonym Match", "शब्द → विलोम"],
              ["Context Choice", "वाक्य में सही अर्थ चुनो"],
              ["Odd One Out", "बेमेल शब्द छाँटो"],
              ["Find the Better Word", "वague शब्द की जगह precise शब्द"],
              ["Find the Mistake", "गलत प्रयोग पकड़ो"],
              ["Complete the Sentence", "सही शब्द भरो"],
              ["Make Your Own Sentence", "खुद वाक्य बनाओ"],
              ["One-Minute Speaking", "1 मिनट बोलो"],
            ] },
            { t: "act", title: "Game 1 — Guess the Word", x: "“भरोसेमंद; जिस पर भरोसा किया जा सके।”", items: ["A) reliable  B) accurate  C) essential", "सही चुनो"] },
            { t: "act", title: "Game 2 — Odd One Out", x: "इनमें बेमेल शब्द कौन-सा है?", items: ["big, large, huge, tiny", "कारण बताओ"] },
            { t: "act", title: "Game 3 — Find the Mistake", x: "“He is very reliable and never breaks his promise.” — कोई गलती है?", items: ["यह वाक्य सही है — reliable का प्रयोग ठीक है।", "अब बताओ कौन-सा शब्द इसे गलत बना सकता था।"] },
            { t: "ch", title: "Independent Practice", x: "ऊपर की कोई 3 activities खुद के शब्दों से बनाओ और हल करो।" },
          ],
        },
      ],
    },

    {
      id: "m18", title: "Word Detective", titleHi: "Word Detective", icon: "🕵️",
      chapters: [
        {
          id: "c18", number: 18, title: "Word Detective", titleHi: "Word Detective", icon: "🕵️",
          blocks: [
            { t: "p", x: "एक छोटा passage पढ़ो जिसमें कुछ unfamiliar words हैं, और उन्हें ‘detective’ की तरह खोजो।" },
            { t: "ex", title: "Passage", x: "“The village was isolated, far from any town. The people were self-reliant and grew their own food. Their life was simple but content.”", steps: [] },
            { t: "h", x: "18.1 हर शब्द के लिए process" },
            { t: "ol", items: ["context देखकर अनुमान", "confidence level (कितना यकीन?)", "dictionary verification", "correct meaning", "sentence", "related word"] },
            { t: "table", head: ["Word", "अनुमान", "सही अर्थ"], rows: [
              ["isolated", "अलग, दूर", "दूर, अलग-थलग"],
              ["self-reliant", "खुद पर निर्भर", "आत्मनिर्भर"],
              ["content", "संतुष्ट", "संतुष्ट, खुश"],
            ] },
            { t: "act", title: "Guided Practice", x: "ऊपर के passage से एक शब्द चुनो और पूरा 6-step process लिखो।", items: ["अनुमान → confidence → verify → meaning → sentence → related word"] },
            { t: "ch", title: "Independent Practice", x: "अपनी पसंद का एक छोटा passage लो, 5 unfamiliar words खोजो, हर एक के लिए 6 steps करो।" },
          ],
        },
      ],
    },

    {
      id: "m19", title: "Personal Word Bank", titleHi: "Word Bank", icon: "🗂️",
      chapters: [
        {
          id: "c19", number: 19, title: "Personal Word Bank", titleHi: "Personal Word Bank", icon: "🗂️",
          blocks: [
            { t: "p", x: "अपना vocabulary notebook/database बनाओ — यही तुम्हारा सबसे कीमती साधन है।" },
            { t: "h", x: "19.1 हर entry में क्या रखें" },
            { t: "ul", items: ["Word", "Hindi meaning", "English meaning (जहाँ लागू)", "Pronunciation", "Part of speech", "Meanings (एक से ज़्यादा हो तो)", "Example", "Synonym", "Antonym (जहाँ valid)", "Related words", "अपना वाक्य", "Mastery/revision status"] },
            { t: "ex", title: "Sample entry", x: "reliable (adjective) /rɪˈlaɪəbl/", steps: [
              "Meaning: भरोसेमंद, जिस पर भरोसा किया जा सके।",
              "Example: “He is a reliable friend.”",
              "Synonym: dependable; Antonym: unreliable",
              "Related: rely, reliability",
              "My sentence: “This bus service is reliable.”",
              "Status: Understood → need recall",
            ] },
            { t: "note", k: "tip", x: "User द्वारा save किए शब्द course progress से जुड़े रहते हैं — जैसे-जैसे तुम पढ़ोगे, तुम्हारा word bank बढ़ता जाएगा।" },
            { t: "act", title: "Guided Practice", x: "आज के 5 शब्दों के लिए word bank entries बनाओ।", items: ["हर entry में ऊपर के fields भरो"] },
            { t: "ch", title: "Independent Practice", x: "एक हफ्ते तक हर दिन 2 नए शब्द अपने word bank में जोड़ो और पुराने दोहराओ।" },
          ],
        },
      ],
    },

    {
      id: "m20", title: "Final Project", titleHi: "Mastery Project", icon: "🏆",
      chapters: [
        {
          id: "c20", number: 20, title: "Final Mastery Project", titleHi: "Final Mastery Project", icon: "🏆",
          blocks: [
            { t: "p", x: "यह तुम्हारा अंतिम और सबसे असली task है।" },
            { t: "h", x: "20.1 Project steps" },
            { t: "ol", items: [
              "एक unfamiliar passage लो।",
              "कम से कम 10 useful/new words identify करो।",
              "हर word के लिए: context, guessed meaning, verified meaning, sentence, related word, appropriate synonym (जहाँ लागू), usage explanation।",
              "उनमें से कम से कम 5 words use करके अपना paragraph लिखो।",
            ] },
            { t: "table", head: ["Field", "क्या भरना है"], rows: [
              ["Word", "नया शब्द"],
              ["Context", "वाक्य/संकेत"],
              ["Guessed meaning", "तुम्हारा अनुमान"],
              ["Verified meaning", "dictionary से"],
              ["Sentence", "अपना वाक्य"],
              ["Related word", "word family"],
              ["Synonym", "जहाँ लागू"],
              ["Usage note", "कहाँ use करेंगे"],
            ] },
            { t: "note", k: "goal", title: "Mastery", x: "जब तुम बिना मदद के नए passage से शब्द सीख सको, तभी vocabulary mastery हुई।" },
            { t: "ch", title: "Final Deliverable", x: "10-word table + 5+ words वाला paragraph।", items: ["Table complete करो", "Paragraph लिखो", "कम से कम 5 words underline करो"] },
          ],
        },
      ],
    },
  ],

  revision: {
    title: "पूरा course एक नज़र में",
    groups: [
      { title: "🧱 शब्द सीखना", items: ["Word → Meaning → Idea → Example → Usage"] },
      { title: "🔍 Context", items: ["Definition / Example / Description / Contrast clues"] },
      { title: "🎭 अनेक अर्थ", items: ["कल, bank, branch — context ही निर्णय करता है"] },
      { title: "🟰 Synonyms", items: ["Exact vs near-synonym; सही register चुनो"] },
      { title: "↔️ Antonyms", items: ["हर शब्द का perfect opposite नहीं होता"] },
      { title: "🎯 Precision", items: ["efficient / effective / useful / successful / practical"] },
      { title: "🔊 Active vs Passive", items: ["Passive → बोलकर Active बनाओ"] },
      { title: "🌳 Word Families", items: ["create → creation → creative → creatively"] },
      { title: "🧩 Word Parts", items: ["un- / -ful / -less; verify करना ज़रूरी"] },
      { title: "📚 Dictionary", items: ["Pronunciation + POS + meanings + examples"] },
      { title: "🎩 Register", items: ["Friend vs teacher vs office vs official email"] },
      { title: "🔁 Revision", items: ["Encounter → Understand → Recall → Use → Revisit → Transfer"] },
    ],
  },

  mastery: {
    title: "Final Mastery Test / अंतिम परीक्षा",
    note: "यह test context, multiple meanings, synonyms, antonyms, precision, word families, word parts और academic vocabulary — सब cover करता है।",
    tasks: [
      { icon: "🔍", title: "Context", x: "अनजाने शब्द का अर्थ context से निकालो।" },
      { icon: "🎭", title: "Multiple Meanings", x: "वाक्य में शब्द का सही अर्थ पहचानो।" },
      { icon: "🟰", title: "Synonyms", x: "सही जगह सही पर्यायवाची चुनो।" },
      { icon: "↔️", title: "Antonyms", x: "विलोम पहचानो।" },
      { icon: "🎯", title: "Precision", x: "vague शब्द की जगह precise शब्द चुनो।" },
      { icon: "🌳", title: "Word Families", x: "सही रूप (noun/verb/adjective) चुनो।" },
      { icon: "🧩", title: "Word Parts", x: "prefix/suffix से अर्थ निकालो।" },
      { icon: "🎓", title: "Academic", x: "explain / analyze / evaluate में फर्क बताओ।" },
    ],
    quiz: [
      { q: "“तेज बारिश” में ‘तेज’ का अर्थ क्या है?", options: ["बुद्धिमान", "गति/तीव्रता", "धीमा", "ठंडा"], answer: 1, explain: "बारिश के context में ‘तेज’ = तीव्रता/गति। ‘बुद्धिमान’ तब होता जब ‘तेज दिमाग’ होता।" },
      { q: "“We sat on the river bank.” — ‘bank’ का अर्थ?", options: ["पैसा संस्थान", "नदी का किनारा", "विषय की शाखा", "पेड़"], answer: 1, explain: "‘river bank’ = नदी का किनारा।" },
      { q: "“सरकार ने ____ संरक्षण योजना शुरू की।” सबसे उपयुक्त शब्द?", options: ["पानी", "नीर", "जल", "बूँद"], answer: 2, explain: "Formal वाक्य में ‘जल’ सबसे उपयुक्त है; ‘पानी’ बोलचाल का, ‘नीर’ काव्य का।" },
      { q: "‘गर्म’ का opposite, जब बात मौसम की हो?", options: ["शांत", "ठंडा", "तेज", "नरम"], answer: 1, explain: "तापमान के context में ‘गर्म’ का opposite ‘ठंडा’। ‘शांत’ स्वभाव के context में आता।" },
      { q: "“कम पैसे में ज़्यादा काम करने वाला तरीका” — सबसे precise शब्द?", options: ["useful", "successful", "efficient", "practical"], answer: 2, explain: "कम संसाधन में ज़्यादा काम = efficient।" },
      { q: "‘decide’ family में noun कौन-सा है?", options: ["decide", "decision", "decisive", "decisively"], answer: 1, explain: "decision = noun; decide = verb; decisive = adjective; decisively = adverb।" },
      { q: "‘careless’ का अर्थ word parts से?", options: ["बहुत ध्यान वाला", "बिना परवाह", "फिर से ध्यान", "ध्यान से"], answer: 1, explain: "care + (-less = without) → बिना परवाह।" },
      { q: "“____ the two methods and list similarities and differences.” कौन-सा शब्द?", options: ["explain", "compare", "evaluate", "summarize"], answer: 1, explain: "समानता-अंतर दिखाना = compare।" },
      { q: "Passive vocabulary क्या है?", options: ["बोलते समय याद आने वाला शब्द", "पढ़ने/सुनने पर समझ आने वाला शब्द", "कठिन शब्द", "विलोम"], answer: 1, explain: "पढ़ने/सुनने पर समझ आना = passive; बोलते/लिखते समय खुद याद आना = active।" },
      { q: "“He was reluctant to leave.” ‘reluctant’ का सही अर्थ?", options: ["उत्सुक", "अनिच्छुक", "खुश", "तेज़"], answer: 1, explain: "reluctant = अनिच्छुक, हिचकिचाता हुआ।" },
    ],
  },

  outcomeIntro: "इस course के बाद learner केवल शब्द याद नहीं करेगा। वह:",
  outcome: [
    "📖 नया शब्द देखकर context से अर्थ समझ सकेगा",
    "🔍 context clues पहचान सकेगा (definition, example, contrast)",
    "🎭 एक शब्द के अनेक अर्थ context से अलग कर सकेगा",
    "🟰 synonyms का सही register में प्रयोग कर सकेगा",
    "↔️ antonyms और उनकी सीमाएँ समझ सकेगा",
    "🎯 vague शब्दों की जगह precise शब्द चुन सकेगा",
    "🔊 passive शब्दों को active बना सकेगा",
    "🌳 word families के सही रूप use कर सकेगा",
    "🧩 prefix/suffix से अनजाने शब्द का अर्थ अंदाज़ा लगा सकेगा",
    "📚 dictionary entry सही तरह पढ़ सकेगा",
    "🎩 situation के अनुसार formal/informal भाषा चुन सकेगा",
    "🎓 academic words का सही अर्थ में प्रयोग कर सकेगा",
    "🔁 spaced revision की आदत बना सकेगा",
    "🕵️ unfamiliar शब्दों को independently सीख सकेगा",
  ],
  outcomeClose: "यही Vocabulary Building को केवल शब्द-सूची से एक वास्तविक Vocabulary Mastery Course बनाता है।",
};

export const isVocabularySubject = (subject) => {
  if (!subject) return false;
  const base = String(subject.en || "").toLowerCase().trim();
  return base === "vocabulary building" || /शब्द भंडार/.test(subject.hi || subject.title || "");
};

export const VOCABULARY_CHAPTER_IDS = VOCABULARY_COURSE.modules.flatMap((m) => m.chapters.map((c) => c.id));

/** Read Vocabulary progress with legacy numeric entries migrated. */
export const readVocabularyProgress = (subject) => readMigratedProgress(subject, VOCABULARY_CHAPTER_IDS);
