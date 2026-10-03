// Discipline-specific teaching methodology. Each subject must be taught with a
// structure appropriate to its discipline (spec §7), not one generic template.
// Consumed by getSubjectProfile() in LearningHubV2.

export const DISCIPLINE_PROFILES = [
  {
    test: /math|गणित|arithmetic|algebra|geometry|statistic|mental maths|number|fraction|decimal|प्रतिशत|बीजगणित|ज्यामिति|सांख्यिकी|अंकगणित|मानसिक/i,
    icon: "🔢",
    modules: [
      ["Concept & Vocabulary / अवधारणा एवं शब्दावली", ["What & Why / क्या एवं क्यों","Key Terms / मुख्य शब्द","Number Sense / संख्या-बोध"]],
      ["Rule & Formula / नियम एवं सूत्र", ["Rule Statement / नियम का कथन","Formula Meaning / सूत्र का अर्थ","When to Use / कब उपयोग करें"]],
      ["Visual Explanation / दृश्य व्याख्या", ["Diagram / आरेख","Number Line / संख्या रेखा","Pattern / पैटर्न"]],
      ["Worked Example / हल किया उदाहरण", ["Step-by-Step / चरणबद्ध हल","Reasoning / तर्क","Verification / जाँच"]],
      ["Guided Practice / निर्देशित अभ्यास", ["Try Together / साथ करें","Hints / संकेत","Correct Method / सही विधि"]],
      ["Independent Practice / स्वतंत्र अभ्यास", ["Solve Alone / स्वयं हल करें","Speed / गति","Accuracy / सटीकता"]],
      ["Problem Solving / समस्या समाधान", ["Word Problems / शब्द समस्याएँ","Multi-Step / बहु-चरण","Reasoning Task / तर्क कार्य"]],
      ["Real-Life Application / वास्तविक उपयोग", ["Money & Shopping / धन एवं खरीद","Measurement / मापन","Everyday Maths / दैनिक गणित"]],
      ["Assessment & Revision / आकलन एवं पुनरावृत्ति", ["Knowledge Check / ज्ञान जाँच","Common Errors / सामान्य गलतियाँ","Mastery Review / दक्षता समीक्षा"]]
    ]
  },
  {
    test: /science|physics|chemistry|biology|विज्ञान|भौतिकी|रसायन|जीव|environmental science|laboratory|scientific method|पर्यावरण विज्ञान|प्रयोगशाला|वैज्ञानिक/i,
    icon: "🔬",
    modules: [
      ["Question & Curiosity / प्रश्न एवं जिज्ञासा", ["Observe / अवलोकन","Ask a Question / प्रश्न पूछें","Predict / अनुमान"]],
      ["Concept / अवधारणा", ["Core Idea / मुख्य विचार","Key Terms / मुख्य शब्द","Why It Happens / क्यों होता है"]],
      ["Diagram & Model / आरेख एवं मॉडल", ["Label the Diagram / आरेख पहचानें","Model / मॉडल","Process / प्रक्रिया"]],
      ["Experiment / प्रयोग", ["Safe Setup / सुरक्षित तैयारी","Steps / चरण","Observation / अवलोकन"]],
      ["Evidence & Explanation / प्रमाण एवं व्याख्या", ["Record Data / डेटा दर्ज करें","Explain / व्याख्या","Conclusion / निष्कर्ष"]],
      ["Application / उपयोग", ["Real-Life Example / वास्तविक उदाहरण","Technology / तकनीक","Everyday Science / दैनिक विज्ञान"]],
      ["Safety / सुरक्षा", ["Lab Safety / प्रयोगशाला सुरक्षा","Do No Harm / सुरक्षित व्यवहार","Waste Care / अपशिष्ट देखभाल"]],
      ["Assessment & Revision / आकलन एवं पुनरावृत्ति", ["Knowledge Check / ज्ञान जाँच","Myth vs Fact / भ्रम एवं तथ्य","Review / पुनरावृत्ति"]]
    ]
  },
  {
    test: /english|language|भाषा|communication|संचार|grammar|vocabulary|writing|reading|speaking|translation|अनुवाद|हिंदी|संस्कृत|sanskrit|comprehension|शब्दावली|व्याकरण|लेखन|पठन/i,
    icon: "🗣️",
    modules: [
      ["Listen & Notice / सुनें एवं पहचानें", ["Listen / सुनें","Sound & Pronunciation / ध्वनि एवं उच्चारण","Notice Patterns / पैटर्न पहचानें"]],
      ["Vocabulary / शब्द भंडार", ["New Words / नए शब्द","Meaning in Context / संदर्भ में अर्थ","Use in Sentence / वाक्य में प्रयोग"]],
      ["Grammar in Use / प्रयोगात्मक व्याकरण", ["Rule / नियम","Examples / उदाहरण","Common Errors / सामान्य गलतियाँ"]],
      ["Reading / पठन", ["Read Aloud / ज़ोर से पढ़ें","Main Idea / मुख्य विचार","Inference / निष्कर्ष"]],
      ["Speaking / बोलना", ["Repeat / दोहराएँ","Conversation / बातचीत","Fluency / प्रवाह"]],
      ["Writing / लेखन", ["Plan / योजना","Draft / मसौदा","Edit / संपादन"]],
      ["Practice & Assessment / अभ्यास एवं आकलन", ["Practice Task / अभ्यास कार्य","Knowledge Check / ज्ञान जाँच","Revision / पुनरावृत्ति"]]
    ]
  },
  {
    test: /computer|digital|internet|google|cyber|online|payment|data literacy|डिजिटल|कंप्यूटर|इंटरनेट|साइबर|भुगतान|AI |artificial intelligence|generative|prompt|मशीन|बुद्धिमत्ता/i,
    icon: "💻",
    modules: [
      ["Explain / समझें", ["What It Is / यह क्या है","Why It Matters / क्यों जरूरी है","Key Terms / मुख्य शब्द"]],
      ["Demonstrate / प्रदर्शन", ["Watch a Demo / प्रदर्शन देखें","Walkthrough / चरणबद्ध दिखाना","Good Practice / अच्छा अभ्यास"]],
      ["Guided Practice / निर्देशित अभ्यास", ["Do It Together / साथ करें","Checkpoints / जाँच-बिंदु","Fix Mistakes / गलती सुधारें"]],
      ["Independent Task / स्वतंत्र कार्य", ["Try Alone / स्वयं करें","Real Task / वास्तविक कार्य","Verify / सत्यापन"]],
      ["Real Example / वास्तविक उदाहरण", ["Everyday Use / दैनिक उपयोग","Workplace / कार्यस्थल","Responsible Use / जिम्मेदार उपयोग"]],
      ["Safety & Ethics / सुरक्षा एवं नैतिकता", ["Privacy / गोपनीयता","Security / सुरक्षा","Ethics / नैतिकता"]],
      ["Project / प्रोजेक्ट", ["Mini Project / छोटा प्रोजेक्ट","Portfolio / पोर्टफोलियो","Present / प्रस्तुत करें"]],
      ["Assessment / आकलन", ["Knowledge Check / ज्ञान जाँच","Troubleshooting / समस्या समाधान","Review / पुनरावृत्ति"]]
    ]
  },
  {
    test: /tailoring|embroidery|craft|drawing|painting|music|theatre|photography|video|storytelling|सिलाई|कढ़ाई|शिल्प|चित्र|संगीत|रंगमंच|फोटो|कहानी|folk|लोक|सृजन/i,
    icon: "🎨",
    modules: [
      ["Tools & Materials / उपकरण एवं सामग्री", ["Identify Tools / उपकरण पहचानें","Material Knowledge / सामग्री ज्ञान","Care & Safety / देखभाल एवं सुरक्षा"]],
      ["Measurement & Basics / मापन एवं आधार", ["Measure / मापें","Basic Terms / मूल शब्द","Prepare / तैयारी"]],
      ["Demonstration / प्रदर्शन", ["Watch Steps / चरण देखें","Technique / तकनीक","Quality Points / गुणवत्ता बिंदु"]],
      ["Guided Practice / निर्देशित अभ्यास", ["Practice Together / साथ अभ्यास","Correct Handling / सही तरीका","Repeat / दोहराव"]],
      ["Independent Work / स्वतंत्र कार्य", ["Create Alone / स्वयं बनाएँ","Finishing / फिनिशिंग","Self-Check / स्व-जाँच"]],
      ["Quality Check / गुणवत्ता जाँच", ["Measure Output / परिणाम जाँचें","Common Defects / सामान्य कमियाँ","Improve / सुधार"]],
      ["Finished Product / तैयार उत्पाद", ["Present Work / काम प्रस्तुत करें","Costing / लागत","Customer View / ग्राहक दृष्टि"]],
      ["Assessment / आकलन", ["Knowledge Check / ज्ञान जाँच","Portfolio / पोर्टफोलियो","Revision / पुनरावृत्ति"]]
    ]
  },
  {
    test: /history|culture|heritage|leader|कला, रचनात्मकता|संस्कृति|विरासत|इतिहास|नेता|विचारक|civilisation|timeline|monument|सभ्यता|स्मारक/i,
    icon: "📜",
    modules: [
      ["Timeline / कालक्रम", ["When / कब","Sequence / क्रम","Period / कालखंड"]],
      ["Context / संदर्भ", ["Where & Who / कहाँ एवं कौन","Society / समाज","Background / पृष्ठभूमि"]],
      ["Event / घटना", ["What Happened / क्या हुआ","Key People / मुख्य लोग","Place / स्थान"]],
      ["Causes / कारण", ["Why It Happened / क्यों हुआ","Multiple Causes / अनेक कारण","Trigger / कारक"]],
      ["Evidence & Sources / प्रमाण एवं स्रोत", ["Primary Source / प्राथमिक स्रोत","Secondary Source / द्वितीयक स्रोत","Reliability / विश्वसनीयता"]],
      ["Consequences / परिणाम", ["Short-Term / तत्काल","Long-Term / दीर्घकाल","Impact / प्रभाव"]],
      ["Analysis & Reflection / विश्लेषण एवं चिंतन", ["Compare / तुलना","Point of View / दृष्टिकोण","Lesson / सीख"]],
      ["Assessment / आकलन", ["Knowledge Check / ज्ञान जाँच","Source Task / स्रोत कार्य","Revision / पुनरावृत्ति"]]
    ]
  },
  {
    test: /health|fitness|nutrition|yoga|sleep|wellbeing|wellness|first aid|hygiene|स्वास्थ्य|पोषण|योग|नींद|कल्याण|स्वच्छता|चिकित्सा|प्राथमिक चिकित्सा|mental well|fitness|खेल|sports|exercise|व्यायाम/i,
    icon: "🩺",
    modules: [
      ["Health Foundation / स्वास्थ्य आधार", ["What is Health / स्वास्थ्य क्या है","Facts vs Myths / तथ्य एवं भ्रम","Healthy Habits / स्वस्थ आदतें"]],
      ["Prevention / बचाव", ["Risk Factors / जोखिम कारक","Prevention Steps / बचाव के कदम","Hygiene / स्वच्छता"]],
      ["Nutrition & Body / पोषण एवं शरीर", ["Balanced Diet / संतुलित आहार","Nutrients / पोषक तत्व","Hydration / जल"]],
      ["Safe Practice / सुरक्षित अभ्यास", ["Correct Technique / सही तरीका","Warm-up / वार्मअप","Do No Harm / सुरक्षित व्यवहार"]],
      ["Warning Signs / चेतावनी संकेत", ["Recognise / पहचानें","When to Seek Care / कब सहायता लें","Emergency / आपात स्थिति"]],
      ["Wellbeing Routine / कल्याण दिनचर्या", ["Daily Routine / दैनिक दिनचर्या","Stress & Rest / तनाव एवं आराम","Consistency / नियमितता"]],
      ["Assessment & Revision / आकलन एवं पुनरावृत्ति", ["Knowledge Check / ज्ञान जाँच","Responsible Claims / जिम्मेदार जानकारी","Review / पुनरावृत्ति"]]
    ]
  },
  {
    test: /financial|bank|budget|insurance|tax|entrepreneur|business|marketing|sales|pricing|bookkeep|freelanc|gig |networking|e-commerce|वित्तीय|बैंक|बजट|बीमा|कर |उद्यम|व्यवसाय|विपणन|बिक्री|मूल्य|बहीखाता|निवेश|मुद्रा|currency|exchange/i,
    icon: "📈",
    modules: [
      ["Concept / अवधारणा", ["What It Is / यह क्या है","Why It Matters / क्यों जरूरी है","Key Terms / मुख्य शब्द"]],
      ["Numbers & Records / संख्या एवं रिकॉर्ड", ["Calculate / गणना करें","Record / रिकॉर्ड रखें","Verify / जाँचें"]],
      ["Planning / योजना", ["Set a Goal / लक्ष्य तय करें","Make a Plan / योजना बनाएँ","Estimate / अनुमान"]],
      ["Worked Example / हल किया उदाहरण", ["Case / उदाहरण","Steps / चरण","Result / परिणाम"]],
      ["Risk & Safety / जोखिम एवं सुरक्षा", ["Identify Risk / जोखिम पहचानें","Safety Net / बचाव","Fraud Awareness / धोखाधड़ी जागरूकता"]],
      ["Application / उपयोग", ["Personal / व्यक्तिगत","Household / परिवार","Small Business / छोटा व्यवसाय"]],
      ["Practice & Assessment / अभ्यास एवं आकलन", ["Practice Task / अभ्यास कार्य","Knowledge Check / ज्ञान जाँच","Revision / पुनरावृत्ति"]]
    ]
  },
  {
    test: /media|information literacy|fact|fake|misinformation|disinformation|source|privacy|digital citizenship|मीडिया|सूचना|तथ्य|भ्रामक|स्रोत|गोपनीयता|नागरिकता/i,
    icon: "📰",
    modules: [
      ["What Is It? / यह क्या है", ["Definition / परिभाषा","Everyday Examples / दैनिक उदाहरण","Why It Matters / क्यों जरूरी है"]],
      ["Spot the Signs / संकेत पहचानें", ["Red Flags / चेतावनी संकेत","Bias / पूर्वाग्रह","Emotional Trap / भावनात्मक जाल"]],
      ["Verify / सत्यापन", ["Check the Source / स्रोत जाँचें","Cross-Check / दूसरे स्रोत से मिलाएँ","Date & Context / तिथि एवं संदर्भ"]],
      ["Tools & Method / उपकरण एवं विधि", ["Search Skill / खोज कौशल","Reverse Check / उलटी जाँच","Evidence / प्रमाण"]],
      ["Case Practice / केस अभ्यास", ["Real Example / वास्तविक उदाहरण","Decide: Real or Fake / सही या गलत","Explain Why / कारण बताएँ"]],
      ["Responsible Sharing / जिम्मेदार साझा", ["Pause Before Share / साझा से पहले रुकें","Respect Privacy / गोपनीयता","Correct Mistakes / सुधार करें"]],
      ["Assessment / आकलन", ["Knowledge Check / ज्ञान जाँच","Fact-Check Task / तथ्य-जाँच कार्य","Revision / पुनरावृत्ति"]]
    ]
  },
  {
    test: /life skill|personal development|self awareness|confidence|goal setting|time management|critical thinking|problem solving|decision|emotional|leadership|teamwork|creativity|conflict|stress|adaptability|life skills|व्यक्तिगत विकास|आत्म|जीवन कौशल|लक्ष्य|समय प्रबंधन|आलोचनात्मक|समस्या समाधान|भावनात्मक|नेतृत्व|रचनात्मकता|तनाव/i,
    icon: "🧭",
    modules: [
      ["Understand / समझें", ["What It Is / यह क्या है","Why It Helps / क्यों उपयोगी है","Key Idea / मुख्य विचार"]],
      ["Self-Reflection / आत्म-चिंतन", ["Notice in Yourself / स्वयं में देखें","Strengths / शक्तियाँ","Areas to Grow / सुधार क्षेत्र"]],
      ["Tool / तकनीक", ["Step Framework / चरण ढाँचा","Model / मॉडल","When to Use / कब उपयोग करें"]],
      ["Scenario Practice / स्थिति अभ्यास", ["Real Situation / वास्तविक स्थिति","Choose an Action / कदम चुनें","Consequences / परिणाम"]],
      ["Apply in Daily Life / दैनिक जीवन में", ["Home / घर","Study / पढ़ाई","Work & Community / काम एवं समुदाय"]],
      ["Reflect & Improve / चिंतन एवं सुधार", ["Journal / डायरी","Feedback / प्रतिक्रिया","Next Step / अगला कदम"]],
      ["Assessment / आकलन", ["Knowledge Check / ज्ञान जाँच","Practice Task / अभ्यास कार्य","Revision / पुनरावृत्ति"]]
    ]
  },
  {
    test: /practical everyday|home safety|road safety|consumer|documents|government service|legal|emergency|public transport|cooking|household|दैनिक|घर सुरक्षा|सड़क|उपभोक्ता|दस्तावेज़|सरकारी|कानूनी|आपात|परिवहन|रसोई|गृह/i,
    icon: "🏠",
    modules: [
      ["Why It Matters / क्यों जरूरी है", ["Real Situation / वास्तविक स्थिति","Risk / जोखिम","Benefit / लाभ"]],
      ["Know the Basics / मूल जानकारी", ["Key Terms / मुख्य शब्द","Rules / नियम","Who to Contact / किससे संपर्क करें"]],
      ["Safe Steps / सुरक्षित कदम", ["Step-by-Step / चरणबद्ध","Do and Don't / करें एवं न करें","Emergency / आपात स्थिति"]],
      ["Everyday Practice / दैनिक अभ्यास", ["At Home / घर पर","On the Road / रास्ते में","In the Community / समुदाय में"]],
      ["Documents & Records / दस्तावेज़ एवं रिकॉर्ड", ["Keep Safe / सुरक्षित रखें","Fill Correctly / सही भरें","Verify / जाँचें"]],
      ["Scenario Practice / स्थिति अभ्यास", ["What Would You Do / आप क्या करेंगे","Best Action / सर्वोत्तम कदम","Explain / समझाएँ"]],
      ["Assessment / आकलन", ["Knowledge Check / ज्ञान जाँच","Checklist / चेकलिस्ट","Revision / पुनरावृत्ति"]]
    ]
  },
  {
    test: /research|mastery|how to learn|how to read|note making|memory technique|information search|source evaluation|citation|referencing|project work|presentation skill|teaching others|portfolio|शोध|दक्षता|नोट्स|स्मृति|सूचना खोज|स्रोत मूल्यांकन|उद्धरण|परियोजना|प्रस्तुति|पोर्टफोलियो|अनुसंधान/i,
    icon: "🎓",
    modules: [
      ["Understand the Skill / कौशल समझें", ["What It Is / यह क्या है","Why It Matters / क्यों जरूरी है","Key Terms / मुख्य शब्द"]],
      ["Method / विधि", ["Step Framework / चरण ढाँचा","Tools / उपकरण","Best Practice / अच्छा अभ्यास"]],
      ["Guided Practice / निर्देशित अभ्यास", ["Do Together / साथ करें","Model Answer / आदर्श उत्तर","Check / जाँच"]],
      ["Independent Task / स्वतंत्र कार्य", ["Try Alone / स्वयं करें","Real Topic / वास्तविक विषय","Self-Check / स्व-जाँच"]],
      ["Apply & Create / लागू करें एवं बनाएँ", ["Own Work / अपना काम","Portfolio / पोर्टफोलियो","Present / प्रस्तुत करें"]],
      ["Review & Improve / समीक्षा एवं सुधार", ["Feedback / प्रतिक्रिया","Common Mistakes / सामान्य गलतियाँ","Next Level / अगला स्तर"]],
      ["Assessment / आकलन", ["Knowledge Check / ज्ञान जाँच","Reflection / चिंतन","Revision / पुनरावृत्ति"]]
    ]
  },
  {
    test: /agriculture|farmer|animal husbandry|cow|rural livelihood|soil|crop|irrigation|kheti|कृषि|किसान|पशुपालन|गौ|ग्रामीण|मृदा|फसल|सिंचाई|गाय|उद्यान|organic farming|जैविक/i,
    icon: "🌾",
    modules: [
      ["Field Foundation / क्षेत्र आधार", ["Soil & Land / मिट्टी एवं भूमि","Season & Climate / ऋतु एवं जलवायु","Local Context / स्थानीय संदर्भ"]],
      ["Planning / योजना", ["Crop Selection / फसल चयन","Seed & Material / बीज एवं सामग्री","Schedule / समय-सारणी"]],
      ["Practice & Care / अभ्यास एवं देखभाल", ["Water / जल","Nutrition / पोषण","Pest Awareness / कीट जागरूकता"]],
      ["Observation / अवलोकन", ["Record / रिकॉर्ड","Complaint / समस्या","When to Seek Help / कब सहायता लें"]],
      ["Safety / सुरक्षा", ["Safe Tools / सुरक्षित उपकरण","Safe Inputs / सुरक्षित इनपुट","Animal Care / पशु देखभाल"]],
      ["Cost & Market / लागत एवं बाजार", ["Costing / लागत","Quality / गुणवत्ता","Selling / बिक्री"]],
      ["Assessment / आकलन", ["Knowledge Check / ज्ञान जाँच","Field Task / क्षेत्र कार्य","Revision / पुनरावृत्ति"]]
    ]
  },
  {
    test: /environment|climate|tree|waste|water conservation|biodiversity|forest|renewable|energy|पर्यावरण|जलवायु|वृक्ष|कचरा|जल संरक्षण|जैव विविधता|वन|नवीकरणीय|ऊर्जा|मेरु|nature/i,
    icon: "🌳",
    modules: [
      ["Ecology Question / पारिस्थितिक प्रश्न", ["Observe Nature / प्रकृति देखें","Ask Why / क्यों पूछें","Local Issue / स्थानीय समस्या"]],
      ["System & Concept / तंत्र एवं अवधारणा", ["How It Works / कैसे काम करता है","Key Terms / मुख्य शब्द","Cycle / चक्र"]],
      ["Evidence / प्रमाण", ["Collect Data / डेटा लें","Measure / मापें","Compare / तुलना"]],
      ["Causes & Effects / कारण एवं प्रभाव", ["Human Impact / मानव प्रभाव","Consequences / परिणाम","Who Is Affected / कौन प्रभावित"]],
      ["Solutions / समाधान", ["Reduce / कम करें","Reuse & Recycle / पुनः उपयोग","Protect / संरक्षण"]],
      ["Local Action / स्थानीय कार्य", ["Home Practice / घर पर","Community Campaign / समुदाय अभियान","Monitor / निगरानी"]],
      ["Assessment / आकलन", ["Knowledge Check / ज्ञान जाँच","Action Project / कार्य प्रोजेक्ट","Revision / पुनरावृत्ति"]]
    ]
  },
  {
    test: /social justice|human rights|moral|corruption|national unity|communal harmony|civic|सामाजिक न्याय|मानवाधिकार|नैतिक|भ्रष्टाचार|राष्ट्रीय एकता|सद्भाव|नागरिक|मूल्य|disability|inclusion|दिव्यांग|समावेशन|elder|vulnerable|animal|wildlife|पशु|वन्यजीव|गौशाला/i,
    icon: "⚖️",
    modules: [
      ["Values & Context / मूल्य एवं संदर्भ", ["What & Why / क्या एवं क्यों","Dignity / गरिमा","Local Context / स्थानीय संदर्भ"]],
      ["Rights & Duties / अधिकार एवं कर्तव्य", ["Rights / अधिकार","Duties / कर्तव्य","Lawful Process / कानूनी प्रक्रिया"]],
      ["Everyday Practice / दैनिक व्यवहार", ["Respect / सम्मान","Inclusion / समावेशन","Fairness / निष्पक्षता"]],
      ["Scenario Practice / स्थिति अभ्यास", ["Real Case / वास्तविक मामला","Right Action / सही कदम","Why / कारण"]],
      ["Support & Referral / सहायता एवं रेफ़रल", ["Who to Contact / किससे संपर्क","Consent & Privacy / सहमति एवं गोपनीयता","Safe Steps / सुरक्षित कदम"]],
      ["Community Action / सामुदायिक कार्य", ["Awareness / जागरूकता","Participation / भागीदारी","Monitoring / निगरानी"]],
      ["Assessment / आकलन", ["Knowledge Check / ज्ञान जाँच","Reflection / चिंतन","Revision / पुनरावृत्ति"]]
    ]
  }
];
