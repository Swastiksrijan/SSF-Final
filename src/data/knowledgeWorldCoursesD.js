/**
 * Knowledge World courses — Part D (9 subjects).
 * Oceans & Marine Life · Weather & Seasons · Continents & Maps ·
 * Indian States & Capital Cities · Currency & Exchange · Planets & Stars ·
 * Moon & Eclipses · Rocks, Minerals & Fossils · Air & Atmosphere
 */

export const KW_PART_D = {
  "Oceans & Marine Life": {
    icon: "🌊", level: "Beginner → Intermediate", tag: "Geography & Nature",
    tagline: "महासागर, धाराएँ, प्रवाल और समुद्री जीवन।",
    what: "Oceans are vast bodies of saltwater covering most of the earth. They carry currents, host coral reefs and are home to a huge variety of marine life.",
    why: "Oceans control climate, give rain, food and oxygen, and support millions of livelihoods. Protecting them keeps earth's balance.",
    where: "Coasts, beaches, fishing harbours, coral reefs and the deep sea.",
    outcome: "Learners can name the oceans, explain currents and reefs, describe marine life and act to reduce ocean pollution.",
    modules: [
      ["Ocean Basics / महासागर आधार", "महासागर, धाराएँ, गहराई।", [
        ["Five Oceans / पाँच महासागर", "पृथ्वी पर पाँच महासागर — Pacific, Atlantic, Indian, Southern, Arctic।", "भारत के दक्षिण में Indian Ocean।", "पाँच महासागरों के नाम लिखें।", ["महासागर कितने?", ["5", "3", "7", "4"], 0, "5।"]],
        ["Waves & Currents / लहरें एवं धाराएँ", "हवा से लहरें, तापमान-पवन से धाराएँ बनतीं; ये गर्मी बाँटतीं।", "गर्म पानी की धारा मौसम बदलती।", "लहर बनना देखें, धारा-नाम लिखें।", ["लहरें किससे?", ["हवा से", "प्रकाश", "आवाज़", "बादल"], 0, "हवा से।"]],
        ["Depth & Zones / गहराई एवं क्षेत्र", "महासागर में sunlight zone से deep sea तक अलग क्षेत्र।", "गहरे समुद्र में सूर्य प्रकाश नहीं पहुँचता।", "तीन ocean zones के नाम लिखें।", ["गहरे समुद्र में?", ["सूर्य प्रकाश नहीं", "अधिक प्रकाश", "बर्फ", "रेगिस्तान"], 0, "प्रकाश नहीं।"]],
      ]],
      ["Marine Life / समुद्री जीवन", "जीव, प्रवाल, खाद्य श्रृंखला।", [
        ["Fish & Animals / मछली एवं जीव", "मछली, whale, dolphin, turtle, octopus समुद्र में रहते।", "Whale स्तनधारी है, मछली नहीं।", "पाँच समुद्री जीव लिखें।", ["Whale क्या?", ["स्तनधारी", "मछली", "पक्षी", "सरीसृप"], 0, "स्तनधारी।"]],
        ["Coral Reefs / प्रवाल भित्ति", "Coral छोटे जीवों से बने; reefs अनेक प्रजातियों का घर।", "Great Barrier Reef विशाल।", "एक reef की सुंदरता चित्रित करें।", ["Reef किससे?", ["Coral जीव", "पत्थर", "पेड़", "बर्फ"], 0, "Coral जीवों से।"]],
        ["Food Chains / खाद्य श्रृंखला", "Plankton → छोटी मछली → बड़ी मछली → शार्क।", "Plankton समुद्र का आधार भोजन।", "समुद्री खाद्य श्रृंखला बनाएँ।", ["समुद्र आधार भोजन?", ["Plankton", "शार्क", "Whale", "मछली"], 0, "Plankton।"]],
      ]],
      ["Oceans & Climate / महासागर एवं जलवायु", "ऑक्सीजन, वर्षा, तापमान।", [
        ["Oxygen & Rain / ऑक्सीजन एवं वर्षा", "समुद्री पौधे-शैवाल बहुत ऑक्सीजन देते; evaporation से वर्षा।", "समुद्र से वाष्प बादल बनाकर बारिश।", "समुद्र के दो उपयोग लिखें।", ["समुद्र से?", ["ऑक्सीजन/वर्षा", "कोयला", "पेट्रोल", "धूल"], 0, "ऑक्सीजन/वर्षा।"]],
        ["Climate Control / जलवायु नियंत्रण", "महासागर गर्मी सोखकर तापमान संतुलित रखते।", "समुद्र किनारे जलवायु सामान्यतः हल्की।", "समुद्र-तापमान संबंध लिखें।", ["समुद्र तापमान?", ["संतुलित रखते", "बढ़ाते", "कोई नहीं", "गर्म"], 0, "संतुलित रखते।"]],
        ["Livelihoods / आजीविका", "मछुआरे, जहाज़, पर्यटन व व्यापार समुद्र पर निर्भर।", "मछली पकड़ना आम आजीविका।", "समुद्र-आधारित तीन आजीविकाएँ लिखें।", ["समुद्र आजीविका?", ["मछली पकड़ना", "खनन", "खेती", "पशुपालन"], 0, "मछली पकड़ना।"]],
      ]],
      ["Ocean Protection / संरक्षण", "प्रदूषण और रक्षा।", [
        ["Pollution / प्रदूषण", "प्लास्टिक, तेल व रसायन समुद्र को प्रदूषित करते।", "प्लास्टिक मछलियों को नुकसान करता।", "तीन प्रदूषण स्रोत लिखें।", ["समुद्र प्रदूषण?", ["प्लास्टिक/तेल", "बारिश", "हवा", "सूर्य"], 0, "प्लास्टिक/तेल।"]],
        ["Coral Bleaching / प्रवाल विरंजन", "गर्मी-प्रदूषण से coral सफेद होकर मरता।", "Coral bleaching reefs को हानि।", "bleaching का कारण लिखें।", ["Coral bleaching?", ["गर्मी/प्रदूषण", "बारिश", "हवा", "पक्षी"], 0, "गर्मी/प्रदूषण।"]],
        ["Our Actions / हमारे कदम", "प्लास्टिक घटाएँ, सफाई अभियान, टिकाऊ मछली।", "समुद्र-तट सफाई अभियान मदद करता।", "तीन कदम लिखें।", ["रक्षा कदम?", ["प्लास्टिक घटाना", "कचरा डालना", "तेल छोड़ना", "coral तोड़ना"], 0, "प्लास्टिक घटाना।"]],
      ]],
    ],
    glossary: [["Ocean", "महासागर", "विशाल खारा जलक्षेत्र।"], ["Current", "धारा", "समुद्र में जल की गति।"], ["Coral", "प्रवाल", "समुद्री जीव-संरचना।"], ["Plankton", "प्लैंक्टन", "समुद्र का सूक्ष्म आधार-भोजन।"], ["Reef", "भित्ति", "प्रवाल की संरचना।"], ["Salinity", "लवणता", "पानी में नमक की मात्रा।"], ["Tide", "ज्वार-भाटा", "चंद्रमा से समुद्र का चढ़ाव-उतार।"], ["Marine", "समुद्री", "समुद्र से जुड़ा।"]],
    facts: ["प्रशांत महासागर विश्व का सबसे बड़ा व गहरा है।", "महासागर पृथ्वी की सतह का ~71% हैं।", "Coral reefs 'समुद्र के वर्षावन' कहलाते हैं।", "→Water Cycle सीखें तो समुद्र-वर्षा संबंध स्पष्ट होगा।"],
    project: { objective: "समुद्र-प्रदूषण जागरूकता अभियान।", materials: "कागज़, रंग, पोस्टर।", steps: ["प्रदूषण के कारण लिखें।", "प्रभाव लिखें।", "समाधान सुझाएँ।", "पोस्टर बनाएँ।"], observation: "कौन-सा कदम सबसे प्रभावी?", result: "Ocean Awareness Poster।", reflection: "प्लास्टिक कैसे घटाऊँगा/घटाऊँगी?" },
    revision: ["5 oceans", "Waves from wind, currents move heat", "Coral reefs are marine rainforests", "Oceans give oxygen & rain", "Reduce plastic to protect oceans"],
    mastery: [["महासागर कितने?", ["5", "3", "7", "4"], 0, "5।"], ["Whale क्या?", ["स्तनधारी", "मछली", "पक्षी", "सरीसृप"], 0, "स्तनधारी।"], ["लहरें किससे?", ["हवा", "प्रकाश", "आवाज़", "बादल"], 0, "हवा से।"]],
    related: ["Rivers, Mountains & Seas", "Water Cycle", "Earth & Nature", "Natural Wonders of the World"],
  },

  "Weather & Seasons": {
    icon: "🌦️", level: "Beginner → Science", tag: "Earth Science",
    tagline: "मौसम, ऋतुएँ और पूर्वानुमान।",
    what: "Weather is the day-to-day condition of the atmosphere — temperature, rain, wind and clouds. Seasons are longer periods with a typical pattern, caused by earth's tilt and revolution.",
    why: "Weather decides farming, travel, clothing and safety. Understanding it helps you plan and stay safe from storms and heat.",
    where: "Sky, rain, wind, forecast apps, farms and daily clothing choices.",
    outcome: "Learners can describe weather elements, explain seasons, read a basic forecast and act safely in extreme weather.",
    modules: [
      ["Weather Elements / मौसम के तत्व", "तापमान, वर्षा, हवा, बादल।", [
        ["Temperature / तापमान", "तापमान बताता कितना गर्म/ठंडा; थर्मामीटर से मापते।", "दोपहर का तापमान सुबह से ज़्यादा।", "एक दिन के तापमान घंटे-दर-घंटे लिखें।", ["तापमान किससे?", ["थर्मामीटर", "बैरोमीटर", "मापक", "दूरबीन"], 0, "थर्मामीटर।"]],
        ["Rain & Clouds / वर्षा एवं बादल", "जल-वाष्प ठंडा होकर बादल बनता; भारी होने पर वर्षा।", "काले बादल बारिश का संकेत।", "बादल के तीन प्रकार देखकर लिखें।", ["बारिश किससे?", ["बादल", "हवा", "सूर्य", "मिट्टी"], 0, "बादल से।"]],
        ["Wind / हवा", "हवा का बहना दबाव-अंतर से; तेज़ हवा तूफ़ान बनाती।", "पंखा हवा महसूस कराता।", "हवा की दिशा/गति नोट करें।", ["हवा किससे?", ["दबाव-अंतर", "प्रकाश", "आवाज़", "मिट्टी"], 0, "दबाव-अंतर से।"]],
      ]],
      ["Seasons / ऋतुएँ", "ऋतुएँ और उनका कारण।", [
        ["Why Seasons? / ऋतुएँ क्यों?", "Earth का झुकाव (tilt) व revolution से अलग-अलग ऋतुएँ।", "गर्मी-सर्दी सूर्य की स्थिति से।", "ग्लोब की tilt दिखाएँ।", ["ऋतुएँ किससे?", ["Earth का tilt+revolution", "Moon", "हवा", "बादल"], 0, "tilt+revolution।"]],
        ["Indian Seasons / भारतीय ऋतुएँ", "भारत में ग्रीष्म, वर्षा/मानसून, शरद (सर्दी) प्रमुख; कुछ क्षेत्रों में छह ऋतुएँ।", "मानसून जून-सितंबर आम।", "तीन ऋतुओं के महीने लिखें।", ["मानसून कब?", ["जून-सितंबर", "दिसंबर-मार्च", "सिर्फ अप्रैल", "कोई नहीं"], 0, "जून-सितंबर।"]],
        ["Season & Life / ऋतु एवं जीवन", "ऋतुएँ खेती, फसल, त्योहार व जीवन-चक्र तय करतीं।", "मानसून में धान बोया जाता।", "ऋतु-अनुसार फसल सूची बनाएँ।", ["धान मुख्यतः?", ["मानसून", "सर्दी", "गर्मी", "कभी नहीं"], 0, "मानसून।"]],
      ]],
      ["Weather & Climate / मौसम एवं जलवायु", "अंतर और observation।", [
        ["Weather vs Climate / मौसम एवं जलवायु", "मौसम = दैनिक स्थिति; जलवायु = दीर्घकालिक औसत।", "आज बारिश (weather), क्षेत्र शुष्क (climate)।", "एक अंतर उदाहरण सहित लिखें।", ["Climate क्या?", ["दीर्घकालिक औसत", "आज का मौसम", "एक घंटा", "एक दिन"], 0, "दीर्घकालिक औसत।"]],
        ["Weather Station / मौसम केंद्र", "तापमान-वर्षा-हवा मापक यंत्रों से मौसम दर्ज होता।", "मौसम केंद्र रोज़ डेटा जुटाता।", "तीन मौसम-यंत्रों के नाम लिखें।", ["वर्षा मापक?", ["Rain gauge", "थर्मामीटर", "दूरबीन", "मापक"], 0, "Rain gauge।"]],
        ["Forecast / पूर्वानुमान", "उपग्रह-डेटा से आने वाला मौसम बताया जाता; reliable source देखें।", "पूर्वानुमान खेती-यात्रा में मदद।", "आज का पूर्वानुमान reliable source से लिखें।", ["पूर्वानुमान कहाँ?", ["reliable source", "अफवाह", "अनुमान", "अफवाह"], 0, "reliable source।"]],
      ]],
      ["Safety / सुरक्षा", "चरम मौसम में सुरक्षा।", [
        ["Heat & Cold / गर्मी एवं सर्दी", "लू में पानी-छाया, सर्दी में गर्म कपड़े जरूरी।", "गर्मी में dehydration से बचें।", "गर्मी-सर्दी की तीन सावधानियाँ लिखें।", ["लू में?", ["पानी-छाया", "बाहर काम", "गर्म कपड़े", "धूप"], 0, "पानी-छाया।"]],
        ["Storms & Lightning / तूफ़ान एवं बिजली", "तूफ़ान-बिजली में घर के अंदर, पेड़-खंभों से दूर रहें।", "बिजली चमकने पर पेड़ के नीचे नहीं।", "बिजली में सुरक्षा-नियम लिखें।", ["बिजली में?", ["घर के अंदर", "पेड़ के नीचे", "खेत में", "छत पर"], 0, "घर के अंदर।"]],
        ["Floods & Drought / बाढ़ एवं सूखा", "बाढ़-सूखा चरम मौसम से; पहले योजना जरूरी।", "बाढ़ में ऊँचाई पर जाएँ।", "बाढ़-सूखा के दो उपाय लिखें।", ["बाढ़ में?", ["सुरक्षित ऊँचाई", "नदी में", "पुल पर", "पानी पीना"], 0, "सुरक्षित ऊँचाई।"]],
      ]],
    ],
    glossary: [["Weather", "मौसम", "दैनिक वायु स्थिति।"], ["Climate", "जलवायु", "दीर्घकालिक औसत।"], ["Temperature", "तापमान", "गर्मी-ठंडक का माप।"], ["Monsoon", "मानसून", "मौसमी वर्षा।"], ["Forecast", "पूर्वानुमान", "आगामी मौसम की भविष्यवाणी।"], ["Humidity", "आर्द्रता", "हवा में नमी।"], ["Storm", "तूफ़ान", "तेज़ हवा-बारिश।"], ["Season", "ऋतु", "विशेष मौसम-काल।"]],
    facts: ["भारत की जलवायु मुख्यतः मानसून-आधारित है।", "मौसम पूर्वानुमान उपग्रह व radar से बनता है।", "Earth का 23.5° tilt ऋतुएँ बनाता है।", "→Water Cycle सीखें तो वर्षा की प्रक्रिया समझेंगे।"],
    project: { objective: "एक सप्ताह का मौसम डायरी।", materials: "कागज़, पेन, थर्मामीटर।", steps: ["रोज़ तापमान-बारिश-हवा लिखें।", "बादल के प्रकार नोट करें।", "सप्ताह के अंत में pattern देखें।", "डायरी बनाएँ।"], observation: "कौन-सा दिन सबसे गर्म?", result: "Weather Diary।", reflection: "मौसम ने दिनचर्या कैसे प्रभावित की?" },
    revision: ["Weather elements: temperature, rain, wind, clouds", "Seasons from earth's tilt + revolution", "Monsoon Jun-Sep in India", "Weather daily, climate long-term", "Safety: heat, storm, flood, drought"],
    mastery: [["तापमान किससे?", ["थर्मामीटर", "बैरोमीटर", "मापक", "दूरबीन"], 0, "थर्मामीटर।"], ["ऋतुएँ किससे?", ["tilt+revolution", "Moon", "हवा", "बादल"], 0, "tilt+revolution।"], ["Climate?", ["दीर्घकालिक औसत", "आज का", "एक घंटा", "एक दिन"], 0, "दीर्घकालिक औसत।"]],
    related: ["Water Cycle", "Air & Atmosphere", "Earth & Nature", "Deserts & Grasslands"],
  },

  "Continents & Maps": {
    icon: "🗺️", level: "Beginner → Geography", tag: "Geography & Maps",
    tagline: "महाद्वीप, मानचित्र, दिशा और निर्देशांक।",
    what: "Continents are the earth's seven large landmasses. Maps are drawings of places from above, using directions, scale and coordinates to locate things.",
    why: "Maps help us find places, plan travel and understand the world. Coordinates pin any location exactly.",
    where: "Atlases, GPS, phone maps, globes and school geography.",
    outcome: "Learners can name continents, read a map, use directions and latitude-longitude, and locate places.",
    modules: [
      ["Continents / महाद्वीप", "सात महाद्वीप और विशेषताएँ।", [
        ["Seven Continents / सात महाद्वीप", "Asia, Africa, North America, South America, Antarctica, Europe, Australia।", "Asia सबसे बड़ा महाद्वीप।", "सात महाद्वीप आकार-क्रम में लिखें।", ["सबसे बड़ा महाद्वीप?", ["Asia", "Africa", "Europe", "Australia"], 0, "Asia।"]],
        ["Land & Water / भूमि एवं जल", "पृथ्वी पर ~71% जल, ~29% भूमि; महाद्वीप भूमि के बड़े भाग।", "महाद्वीप महासागरों से घिरे।", "जल-भूमि का अनुपात लिखें।", ["पृथ्वी पर जल?", ["~71%", "~29%", "50%", "10%"], 0, "~71%।"]],
        ["Oceans around / महासागर", "हर महाद्वीप के आसपास महासागर।", "Antarctica के आसपास Southern Ocean।", "तीन महाद्वीप-महासागर जोड़े बनाएँ।", ["Antarctica के आसपास?", ["Southern Ocean", "Indian", "Pacific", "Atlantic"], 0, "Southern Ocean।"]],
      ]],
      ["Map Reading / मानचित्र पढ़ना", "दिशा, scale, symbols।", [
        ["Directions / दिशाएँ", "N, S, E, W; compass मदद करता; Sun पूरब से उगता।", "चुंबकीय सुई उत्तर दिखाती।", "compass/दिशा से घर की ओर जानें।", ["N, S, E, W?", ["दिशाएँ", "नदियाँ", "देश", "पर्वत"], 0, "दिशाएँ।"]],
        ["Scale & Symbols / मापक एवं प्रतीक", "Map की scale दूरी बताती; symbols (नदी-पर्वत) दर्शाते।", "scale से 1 सेमी = 10 किमी पता चलता।", "एक map के पाँच symbols पहचानें।", ["Scale क्या बताती?", ["दूरी", "रंग", "नाम", "मौसम"], 0, "दूरी।"]],
        ["Legend & Title / संकेत-सूची एवं शीर्षक", "Title बताता map किसका; legend symbols का अर्थ।", "legend देखकर चिह्न समझें।", "एक map की legend पढ़ें।", ["Legend?", ["symbols का अर्थ", "शीर्षक", "रंग", "दूरी"], 0, "symbols का अर्थ।"]],
      ]],
      ["Coordinates / निर्देशांक", "latitude, longitude।", [
        ["Latitude / अक्षांश", "Equator (0°) से उत्तर-दक्षिण की कोणीय दूरी।", "Equator क्षेत्र गर्म।", "ग्लोब पर 3 latitudes दिखाएँ।", ["Latitude किससे?", ["Equator", "Prime meridian", "Sun", "Moon"], 0, "Equator से।"]],
        ["Longitude / देशांतर", "Prime meridian (0°) से पूर्व-पश्चिम दूरी; time zones से जुड़ा।", "Prime meridian Greenwich से।", "ग्लोब पर Prime meridian दिखाएँ।", ["Prime meridian कहाँ?", ["Greenwich", "Equator", "Delhi", "Pole"], 0, "Greenwich।"]],
        ["Locating Places / स्थान खोजना", "Latitude-longitude के जोड़े से कोई स्थान ढूँढा जाता।", "नक्शे पर दो निर्देशांक से जगह मिलती।", "एक स्थान के निर्देशांक खोजें।", ["निर्देशांक क्या?", ["स्थान की पहचान", "मौसम", "रंग", "नदी"], 0, "स्थान की पहचान।"]],
      ]],
      ["Map Practice / अभ्यास", "खोजना, नापना, बनाना।", [
        ["Find on Map / मानचित्र पर खोजें", "पहले महाद्वीप, फिर देश-शहर ढूँढें।", "अटलांटिक महासागर खोजना सीखें।", "पाँच देश map पर खोजें।", ["पहले क्या?", ["महाद्वीप", "शहर", "गली", "दुकान"], 0, "महाद्वीप।"]],
        ["Measure Distance / दूरी नापना", "Scale की मदद से map पर दूरी निकालें।", "दो शहरों के बीच scale-दूरी।", "दो शहरों की दूरी नापें।", ["दूरी किससे?", ["Scale", "रंग", "नाम", "शीर्षक"], 0, "Scale से।"]],
        ["Draw a Map / मानचित्र बनाएँ", "घर/स्कूल का सरल map directions व symbols से बनाएँ।", "कक्षा का नक्शा खिड़की-दरवाज़े सहित।", "अपने घर का map बनाएँ।", ["Map में जरूरी?", ["Directions+symbols", "केवल रंग", "केवल नाम", "कुछ नहीं"], 0, "Directions+symbols।"]],
      ]],
    ],
    glossary: [["Continent", "महाद्वीप", "बड़ा भू-भाग।"], ["Map", "मानचित्र", "ऊपर से बना स्थान-चित्र।"], ["Compass", "दिक्सूचक", "दिशा बताने वाला यंत्र।"], ["Scale", "मापक", "Map व वास्तविक दूरी का अनुपात।"], ["Latitude", "अक्षांश", "Equator से कोणीय दूरी।"], ["Longitude", "देशांतर", "Prime meridian से दूरी।"], ["Equator", "भूमध्य रेखा", "0° अक्षांश।"], ["Legend", "संकेत-सूची", "Symbols का अर्थ।"]],
    facts: ["पृथ्वी पर सात महाद्वीप हैं।", "Asia जनसंख्या व क्षेत्र में सबसे बड़ा।", "lat-long से कोई भी स्थान पाया जा सकता।", "→Continents & Maps से Countries & World जुड़ता है।"],
    project: { objective: "अपने इलाके का मानचित्र बनाना।", materials: "कागज़, पेन, ruler।", steps: ["घर/स्कूल की स्थिति लिखें।", "मुख्य सड़क-भवन चिह्नित करें।", "Directions+symbols जोड़ें।", "Legend बनाएँ।"], observation: "कौन-सी जगह सबसे दूर?", result: "Local Map।", reflection: "Map बनाना क्यों उपयोगी?" },
    revision: ["7 continents", "Map: directions, scale, symbols, legend", "Latitude from equator, longitude from prime meridian", "Locate places with coordinates", "71% water, 29% land"],
    mastery: [["सबसे बड़ा महाद्वीप?", ["Asia", "Africa", "Europe", "Australia"], 0, "Asia।"], ["N,S,E,W?", ["दिशाएँ", "नदियाँ", "देश", "पर्वत"], 0, "दिशाएँ।"], ["Latitude किससे?", ["Equator", "Prime meridian", "Sun", "Moon"], 0, "Equator से।"]],
    related: ["Countries & World", "Time Zones & World Clock", "Indian States & Capital Cities", "Earth & Nature"],
  },

  "Indian States & Capital Cities": {
    icon: "🇮🇳", level: "Beginner → General Knowledge", tag: "India & Geography",
    tagline: "भारत के राज्य, राजधानियाँ और क्षेत्रीय विविधता।",
    what: "India is divided into 28 states and 8 Union Territories. Each state has a capital, its own language, culture and geography.",
    why: "Knowing states and capitals builds national awareness, helps in exams, travel and understanding India's diversity.",
    where: "Maps, news, travel, state festivals and regional food.",
    outcome: "Learners can name all states/UTs and capitals, locate them, and describe regional diversity.",
    modules: [
      ["States Basics / राज्य आधार", "राज्य, UT, राजधानी।", [
        ["States & UTs / राज्य एवं UT", "भारत में 28 राज्य व 8 केंद्रशासित प्रदेश।", "Ladakh व Jammu-Kashmir UT हैं।", "राज्य-संख्या लिखें।", ["राज्य कितने?", ["28", "8", "20", "15"], 0, "28।"]],
        ["Capitals / राजधानियाँ", "हर राज्य की राजधानी प्रशासनिक केंद्र।", "Maharashtra की राजधानी Mumbai।", "10 राज्य-राजधानी लिखें।", ["Maharashtra की राजधानी?", ["Mumbai", "Pune", "Nagpur", "Delhi"], 0, "Mumbai।"]],
        ["Regions / क्षेत्र", "भारत को उत्तर-दक्षिण-पूर्व-पश्चिम-मध्य क्षेत्रों में बाँटा जाता।", "दक्षिण में Kerala-Tamil Nadu।", "पाँच क्षेत्र व राज्य लिखें।", ["Kerala कहाँ?", ["दक्षिण", "उत्तर", "पूर्व", "पश्चिम"], 0, "दक्षिण।"]],
      ]],
      ["State Geography / राज्य भूगोल", "नदी, पर्वत, जलवायु।", [
        ["Rivers & States / नदी एवं राज्य", "नदियाँ कई राज्यों से बहतीं; Ganga कई राज्यों में।", "Ganga UP-Bihar-Bengal से।", "एक नदी के राज्यों की सूची बनाएँ।", ["Ganga किन राज्यों में?", ["UP-Bihar-Bengal", "केवल केरल", "केवल पंजाब", "केवल गोवा"], 0, "UP-Bihar-Bengal।"]],
        ["Mountains & Coast / पर्वत एवं तट", "हिमालयी राज्य उत्तर, तटीय राज्य दक्षिण-पूर्व-पश्चिम।", "Goa पश्चिम तट पर।", "तीन तटीय राज्य लिखें।", ["Goa कहाँ?", ["पश्चिम तट", "उत्तर", "पूर्व", "मध्य"], 0, "पश्चिम तट।"]],
        ["Climate Zones / जलवायु क्षेत्र", "राज्यों की जलवायु अलग — रेगिस्तानी, तटीय, पहाड़ी, समशीतोष्ण।", "Rajasthan शुष्क, Kerala आर्द्र।", "तीन राज्य-जलवायु जोड़े लिखें।", ["Rajasthan जलवायु?", ["शुष्क/रेगिस्तानी", "आर्द्र", "बर्फीली", "समुद्री"], 0, "शुष्क।"]],
      ]],
      ["Culture & Language / संस्कृति एवं भाषा", "भाषा, त्योहार, भोजन।", [
        ["Languages / भाषाएँ", "राज्यों की अपनी मुख्य भाषाएँ — तमिल, बंगाली, पंजाबी, मराठी आदि।", "Tamil Nadu की भाषा Tamil।", "पाँच राज्य-भाषा जोड़े लिखें।", ["Tamil Nadu की भाषा?", ["Tamil", "Hindi", "Bengali", "Marathi"], 0, "Tamil।"]],
        ["Festivals / त्योहार", "हर राज्य के विशेष त्योहार — Onam (Kerala), Bihu (Assam), Pongal (TN)।", "Onam Kerala का फसल उत्सव।", "पाँच राज्य-त्योहार जोड़े लिखें।", ["Onam कहाँ?", ["Kerala", "Assam", "Punjab", "Gujarat"], 0, "Kerala।"]],
        ["Food & Dress / भोजन एवं वेशभूषा", "हर क्षेत्र का अलग भोजन व पारंपरिक वेशभूषा।", "Punjab का makki di roti-sarson da saag।", "तीन राज्यों के भोजन लिखें।", ["Punjab का प्रसिद्ध भोजन?", ["makki roti-sarson saag", "idli", "dhokla", "biryani"], 0, "makki roti-sarson saag।"]],
      ]],
      ["Map Practice / मानचित्र अभ्यास", "सीखना-जाँचना।", [
        ["Locate States / राज्य खोजें", "नक्शे पर पहले region, फिर राज्य ढूँढें।", "मध्य भारत में MP।", "पाँच राज्य नक्शे पर खोजें।", ["MP कहाँ?", ["मध्य भारत", "दक्षिण", "पूर्व", "पश्चिम"], 0, "मध्य भारत।"]],
        ["Capitals Quiz / राजधानी प्रश्नोत्तरी", "राज्य-राजधानी याद करने हेतु quiz बनाएँ।", "झारखंड की राजधानी Ranchi।", "10 राज्य-राजधानी quiz बनाएँ।", ["झारखंड की राजधानी?", ["Ranchi", "Patna", "Raipur", "Bhopal"], 0, "Ranchi।"]],
        ["Make a Chart / चार्ट बनाएँ", "राज्य, राजधानी, भाषा, त्योहार का चार्ट बनाएँ।", "चार्ट याद रखने में मदद करता।", "एक state-chart बनाएँ।", ["चार्ट में?", ["राज्य-राजधानी-भाषा", "केवल रंग", "केवल नाम", "कुछ नहीं"], 0, "राज्य-राजधानी-भाषा।"]],
      ]],
    ],
    glossary: [["State", "राज्य", "संघीय इकाई।"], ["Union Territory", "केंद्रशासित प्रदेश", "केंद्र-शासित क्षेत्र।"], ["Capital", "राजधानी", "शासन का शहर।"], ["Region", "क्षेत्र", "भौगोलिक हिस्सा।"], ["Diversity", "विविधता", "अनेक भाषा-संस्कृति।"], ["Language", "भाषा", "बोलने का माध्यम।"], ["Festival", "त्योहार", "उत्सव।"], ["Union", "संघ", "राज्यों का मिलन।"]],
    facts: ["भारत में 28 राज्य व 8 UT हैं।", "राजस्थान क्षेत्रफल में सबसे बड़ा राज्य है।", "Goa क्षेत्रफल में सबसे छोटा राज्य है।", "→India विषय से जोड़ें।"],
    project: { objective: "राज्य-राजधानी चार्ट बनाना।", materials: "चार्ट-पेपर, रंग।", steps: ["राज्य लिखें।", "राजधानी भरें।", "भाषा/त्योहार जोड़ें।", "नक्शे पर चिह्नित करें।"], observation: "कौन-सा राज्य सबसे अलग?", result: "State-Capital Chart।", reflection: "कौन-सा राज्य जानना बाकी?" },
    revision: ["28 states + 8 UTs", "Each state has a capital", "Regional languages & festivals", "Rivers cross many states", "Chart + map practice"],
    mastery: [["राज्य कितने?", ["28", "8", "20", "15"], 0, "28।"], ["Kerala की भाषा?", ["Malayalam", "Tamil", "Hindi", "Bengali"], 0, "Malayalam।"], ["Goa कहाँ?", ["पश्चिम तट", "उत्तर", "पूर्व", "मध्य"], 0, "पश्चिम तट।"]],
    related: ["India", "Countries & World", "Culture & Heritage", "Rivers, Mountains & Seas"],
  },

  "Currency & Exchange": {
    icon: "💰", level: "Beginner → Financial Literacy", tag: "Money & Finance",
    tagline: "मुद्रा, विनिमय और पैसे की समझ।",
    what: "Currency is a country's money, used to buy and sell goods. Exchange rate is the value of one currency in terms of another.",
    why: "Money sense helps you budget, save, shop wisely and understand how countries trade.",
    where: "Markets, banks, ATMs, travel abroad and online payments.",
    outcome: "Learners can recognise major currencies, do simple exchange calculations, budget and save responsibly.",
    modules: [
      ["Money Basics / मुद्रा आधार", "मुद्रा, रूप, उपयोग।", [
        ["What is Currency? / मुद्रा क्या?", "मुद्रा वह धन जिससे वस्तु-सेवाएँ खरीदीं जातीं।", "भारत में Rupee (₹) मुद्रा।", "तीन देशों की मुद्राएँ लिखें।", ["भारत की मुद्रा?", ["Rupee", "Dollar", "Euro", "Yen"], 0, "Rupee।"]],
        ["Notes & Coins / नोट एवं सिक्के", "मुद्रा नोट व सिक्कों में; RBI भारत में नोट जारी करता।", "10, 50, 500 के नोट आम।", "पाँच नोट/सिक्के पहचानें।", ["भारत में नोट कौन जारी करता?", ["RBI", "SBI", "बैंक", "सरकार"], 0, "RBI।"]],
        ["Functions / कार्य", "मुद्रा विनिमय, माप व संचय का साधन।", "पैसे से कीमत मापी जाती।", "मुद्रा के तीन कार्य लिखें।", ["मुद्रा का कार्य?", ["विनिमय", "खाना", "कपड़ा", "यात्रा"], 0, "विनिमय।"]],
      ]],
      ["World Currencies / विश्व मुद्राएँ", "भिन्न देश, भिन्न मुद्रा।", [
        ["Major Currencies / प्रमुख मुद्राएँ", "USD (USA), Euro (Europe), Pound (UK), Yen (Japan), Rupee (India)।", "USA की मुद्रा Dollar।", "पाँच मुद्राएँ देशों से मिलाएँ।", ["Japan की मुद्रा?", ["Yen", "Dollar", "Euro", "Pound"], 0, "Yen।"]],
        ["Symbols / प्रतीक", "मुद्राओं के चिह्न — ₹, $, €, £, ¥।", "$ Dollar का चिह्न।", "पाँच मुद्रा-चिह्न लिखें।", ["₹ किसका?", ["Rupee", "Dollar", "Euro", "Yen"], 0, "Rupee।"]],
        ["Compare Values / मूल्य की तुलना", "हर मुद्रा का मूल्य अलग; exchange rate से तुलना।", "1 USD = कई Rupees।", "आज का USD-INR rate reliable source से लिखें।", ["मुद्रा-तुलना किससे?", ["Exchange rate", "नाम", "रंग", "आकार"], 0, "Exchange rate।"]],
      ]],
      ["Exchange Rates / विनिमय दर", "दर और गणना।", [
        ["What is Exchange Rate? / विनिमय दर?", "एक मुद्रा की दूसरी में कीमत; यह बदलती रहती।", "अगर 1 USD=83₹ तो 10 USD=830₹।", "₹-USD उदाहरण आँकें।", ["Exchange rate क्या?", ["मुद्रा की कीमत", "वस्तु", "रंग", "नाम"], 0, "मुद्रा की कीमत।"]],
        ["Simple Conversion / सरल गणना", "मात्रा × दर = कुल मूल्य।", "5 USD × 83 = 415₹।", "तीन conversions हल करें।", ["10 USD × 83 =?", ["830₹", "83₹", "8300₹", "93₹"], 0, "830₹।"]],
        ["Why It Changes / क्यों बदलती", "मांग-आपूर्ति, व्यापार, अर्थव्यवस्था से दर बदलती।", "दर रोज़ बदल सकती।", "एक कारण लिखें।", ["दर क्यों बदलती?", ["मांग-आपूर्ति", "रंग", "मौसम", "नाम"], 0, "मांग-आपूर्ति।"]],
      ]],
      ["Money Skills / धन कौशल", "बचत, बजट, सुरक्षा।", [
        ["Budgeting / बजट", "आय-व्यय लिखकर खर्च नियोजित करना बजट।", "महीने की जेब-खर्च योजना।", "एक साप्ताहिक बजट बनाएँ।", ["बजट क्या?", ["आय-व्यय योजना", "केवल खर्च", "केवल पैसा", "ऋण"], 0, "आय-व्यय योजना।"]],
        ["Saving / बचत", "आय का कुछ हिस्सा बचाना भविष्य हेतु जरूरी।", "हर सप्ताह थोड़ा बचाना।", "एक जग (piggy bank) में बचत करें।", ["बचत क्यों?", ["भविष्य हेतु", "बर्बाद", "कोई नहीं", "खर्च"], 0, "भविष्य हेतु।"]],
        ["Money Safety / धन सुरक्षा", "OTP/PIN किसी को न दें; असली नोट-बैंक जाँचें।", "Unknown call पर OTP न बताएँ।", "तीन धन-सुरक्षा नियम लिखें।", ["OTP किसे?", ["किसी को नहीं", "सबको", "दोस्त", "caller"], 0, "किसी को नहीं।"]],
      ]],
    ],
    glossary: [["Currency", "मुद्रा", "देश का धन।"], ["Exchange Rate", "विनिमय दर", "मुद्रा की कीमत।"], ["Budget", "बजट", "आय-व्यय योजना।"], ["Saving", "बचत", "भविष्य हेतु रखा धन।"], ["RBI", "भारतीय रिज़र्व बैंक", "नोट जारीकर्ता।"], ["Denomination", "मूल्यवर्ग", "नोट/सिक्के का मूल्य।"], ["OTP", "वन-टाइम पासवर्ड", "सुरक्षा कोड।"], ["Transaction", "लेन-देन", "खरीद-बिक्री।"]],
    facts: ["भारत में RBI मुद्रा जारी करता है।", "USD विश्व की सबसे प्रचलित reserve मुद्रा है।", "यूरो अनेक यूरोपीय देशों की साझा मुद्रा है।", "→NGO/Entrepreneurship विषयों से जुड़ता है।"],
    project: { objective: "एक साप्ताहिक बजट व बचत योजना।", materials: "कागज़, पेन।", steps: ["साप्ताहिक आय लिखें।", "आवश्यक खर्च लिखें।", "बचत का लक्ष्य तय करें।", "सप्ताहांत समीक्षा करें।"], observation: "कितना बचा?", result: "Weekly Budget।", reflection: "कहाँ खर्च घटा सकते हैं?" },
    revision: ["Currency = country's money", "Major: USD, Euro, Pound, Yen, Rupee", "Exchange rate = value of one currency in another", "Budget = income-expense plan", "Never share OTP/PIN"],
    mastery: [["भारत की मुद्रा?", ["Rupee", "Dollar", "Euro", "Yen"], 0, "Rupee।"], ["Japan की मुद्रा?", ["Yen", "Dollar", "Euro", "Pound"], 0, "Yen।"], ["10 USD × 83 =?", ["830₹", "83₹", "8300₹", "93₹"], 0, "830₹।"]],
    related: ["Countries & World", "NGO, Project & Grant Learning", "Mathematics & Financial Literacy"],
  },

  "Planets & Stars": {
    icon: "⭐", level: "Beginner → Space", tag: "Space Science",
    tagline: "सूर्य, ग्रह, चंद्रमा, तारे और नक्षत्र।",
    what: "Planets orbit the Sun, stars are huge glowing balls of gas, and constellations are patterns of stars in the night sky.",
    why: "Studying planets and stars helps us understand our place in space, seasons, tides and even navigation.",
    where: "The night sky, Moon, planets visible at dusk and astronomy news.",
    outcome: "Learners can name planets in order, distinguish planets from stars, and identify a few constellations.",
    modules: [
      ["Sun & Planets / सूर्य एवं ग्रह", "सूर्य और आठ ग्रह।", [
        ["The Sun / सूर्य", "सूर्य सौरमंडल का तारा जो प्रकाश-ऊष्मा देता।", "सूर्य के बिना जीवन संभव नहीं।", "सूर्य की ऊर्जा के उपयोग लिखें।", ["सूर्य?", ["तारा", "ग्रह", "उपग्रह", "धूमकेतु"], 0, "तारा।"]],
        ["Eight Planets / आठ ग्रह", "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune; क्रम याद रखें।", "Jupiter सबसे बड़ा।", "ग्रह क्रम में लिखें।", ["ग्रह कितने?", ["8", "7", "9", "10"], 0, "8।"]],
        ["Inner & Outer / भीतरी एवं बाहरी", "भीतरी ग्रह चट्टानी (Mercury-Mars), बाहरी विशाल गैसीय।", "Saturn के छल्ले प्रसिद्ध।", "भीतरी-बाहरी ग्रह अलग करें।", ["Saturn प्रसिद्ध?", ["छल्लों से", "बर्फ", "जंगल", "नदी"], 0, "छल्लों से।"]],
      ]],
      ["Stars / तारे", "तारे और उनकी विशेषताएँ।", [
        ["What are Stars? / तारे क्या?", "तारे विशाल जलते गैस-गोले जो अपनी रोशनी देते।", "रात में टिमटिमाते तारे।", "रात में तारों की गिनती करें।", ["तारे?", ["जलते गैस-गोले", "ग्रह", "उपग्रह", "धूल"], 0, "गैस-गोले।"]],
        ["Why Twinkle? / क्यों टिमटिमाते?", "तारों का प्रकाश वायुमंडल से गुज़रकर मुड़ता, जिससे टिमटिमाहट।", "ग्रह स्थिर, तारे टिमटिमाते दिखते।", "तारे-ग्रह में अंतर देखें।", ["तारे क्यों टिमटिमाते?", ["वायुमंडल से", "आवाज़", "ऊष्मा", "बादल"], 0, "वायुमंडल से।"]],
        ["Brightness / चमक", "तारों की चमक अलग; कुछ बहुत चमकीले।", "Sirius सबसे चमकीला तारा।", "पाँच चमकीले तारों की सूची बनाएँ।", ["चमक किसमें भिन्न?", ["तारों में", "ग्रहों में", "नहीं", "चंद्रमा"], 0, "तारों में।"]],
      ]],
      ["Constellations / नक्षत्र", "तारों के समूह।", [
        ["What are Constellations? / नक्षत्र क्या?", "आकाश में तारों के पहचाने-जाने पैटर्न।", "Saptarishi (Ursa Major) प्रसिद्ध।", "एक नक्षत्र खोजें।", ["नक्षत्र?", ["तारों का पैटर्न", "ग्रह", "उपग्रह", "धूमकेतु"], 0, "तारों का पैटर्न।"]],
        ["Famous Ones / प्रसिद्ध नक्षत्र", "Saptarishi, Orion, Scorpius, Pole Star (Dhruv तारा)।", "Dhruv तारा उत्तर दिशा दिखाता।", "Dhruv तारा खोजने का प्रयास करें।", ["उत्तर दिशा दिखाता?", ["Dhruv तारा", "सूर्य", "चंद्रमा", "मंगल"], 0, "Dhruv तारा।"]],
        ["Navigation / दिशा-ज्ञान", "प्राचीन काल में तारों से दिशा-रात्रि यात्रा होती।", "Dhruv तारा उत्तर दिखाता।", "रात में ध्रुव तारे की स्थिति देखें।", ["पहले नाविक तारों से?", ["दिशा/समय", "भोजन", "वस्त्र", "धन"], 0, "दिशा/समय।"]],
      ]],
      ["Observation / अवलोकन", "आकाश देखना सीखें।", [
        ["Night Sky / रात्रि आकाश", "आकाश में चंद्रमा, ग्रह, तारे-नक्षत्र दिखते।", "साफ रात में अधिक तारे दिखते।", "एक साफ रात में आकाश-नक्शा बनाएँ।", ["साफ रात में?", ["अधिक तारे", "कम तारे", "सूर्य", "बादल"], 0, "अधिक तारे।"]],
        ["Telescope / दूरबीन", "दूरबीन से ग्रह-चंद्रमा नज़दीक दिखते।", "दूरबीन से Saturn के छल्ले।", "दूरबीन से चंद्रमा देखें।", ["दूरबीन का काम?", ["दूर देखना", "उड़ान", "पकाना", "खनन"], 0, "दूर देखना।"]],
        ["Sky Journal / आकाश-डायरी", "रोज़ आकाश देखकर बदलाव दर्ज करें।", "चंद्रमा का आकार बदलता देखें।", "एक सप्ताह आकाश-डायरी रखें।", ["चंद्रमा का आकार?", ["बदलता है", "स्थिर", "गायब", "लाल"], 0, "बदलता है।"]],
      ]],
    ],
    glossary: [["Planet", "ग्रह", "सूर्य की परिक्रमा करने वाला पिंड।"], ["Star", "तारा", "जलता गैस-गोला।"], ["Constellation", "नक्षत्र", "तारों का पैटर्न।"], ["Pole Star", "ध्रुव तारा", "उत्तर दिशा दिखाने वाला।"], ["Orbit", "कक्षा", "परिक्रमा का पथ।"], ["Galaxy", "आकाशगंगा", "तारों का संग्रह।"], ["Telescope", "दूरबीन", "दूर देखने का यंत्र।"], ["Astronomy", "खगोल विज्ञान", "आकाश-अध्ययन।"]],
    facts: ["सूर्य सबसे नज़दीकी तारा है।", "Saturn के छल्ले बर्फ-चट्टान से बने।", "Dhruv तारा उत्तर दिशा में स्थिर दिखता।", "→Moon & Eclipses सीखें तो चंद्र-ग्रहण समझेंगे।"],
    project: { objective: "रात्रि आकाश निरीक्षण डायरी।", materials: "कागज़, पेन, दूरबीन (वैकल्पिक)।", steps: ["साफ रात में आकाश देखें।", "चंद्रमा-तारे-नक्षत्र नोट करें।", "चित्र बनाएँ।", "एक सप्ताह भर दर्ज करें।"], observation: "कौन-से तारे सबसे चमकीले?", result: "Sky Observation Diary।", reflection: "कौन-सा नक्षत्र पहचान पाए?" },
    revision: ["8 planets in order", "Sun is a star", "Stars twinkle, planets don't", "Constellations = star patterns", "Dhruv star shows north"],
    mastery: [["ग्रह कितने?", ["8", "7", "9", "10"], 0, "8।"], ["सूर्य?", ["तारा", "ग्रह", "उपग्रह", "धूमकेतु"], 0, "तारा।"], ["उत्तर दिशा?", ["Dhruv तारा", "सूर्य", "चंद्रमा", "मंगल"], 0, "Dhruv तारा।"]],
    related: ["Solar System & Space", "Moon & Eclipses", "Time Zones & World Clock", "Continents & Maps"],
  },

  "Moon & Eclipses": {
    icon: "🌙", level: "Beginner → Space", tag: "Space Science",
    tagline: "चंद्रमा की कलाएँ, ज्वार और ग्रहण।",
    what: "The Moon is Earth's natural satellite. Its changing phases, tides and eclipses happen because of the positions of the Sun, Moon and Earth.",
    why: "The Moon causes tides, lights the night and creates eclipses — understanding it explains many natural events.",
    where: "Night sky, sea tides, calendars and eclipse events.",
    outcome: "Learners can explain moon phases, tides and both types of eclipses, and observe the Moon safely.",
    modules: [
      ["Moon Basics / चंद्रमा आधार", "चंद्रमा और उसकी कलाएँ।", [
        ["Earth's Satellite / पृथ्वी का उपग्रह", "चंद्रमा पृथ्वी का एकमात्र प्राकृतिक उपग्रह; इसका प्रकाश सूर्य से परावर्तित।", "चंद्रमा अपनी रोशनी नहीं देता।", "चंद्रमा-प्रकाश का स्रोत लिखें।", ["चंद्रमा का प्रकाश?", ["सूर्य से परावर्तित", "अपना", "तारों से", "बादल"], 0, "सूर्य से परावर्तित।"]],
        ["Phases / कलाएँ", "चंद्रमा की कलाएँ — new moon से full moon तक, ~29.5 दिन में।", "पूर्णिमा (full), अमावस्या (new)।", "एक सप्ताह चंद्रमा-आकार दर्ज करें।", ["चंद्र-चक्र कितने दिन?", ["~29.5", "7", "365", "24"], 0, "~29.5 दिन।"]],
        ["Why Phases? / कलाएँ क्यों?", "सूर्य-चंद्रमा-पृथ्वी की स्थिति बदलने से दिखने वाला हिस्सा बदलता।", "कभी आधा, कभी पूरा चंद्रमा दिखता।", "कलाओं का diagram बनाएँ।", ["कलाएँ किससे?", ["सूर्य-चंद्र-पृथ्वी स्थिति", "हवा", "बादल", "तारे"], 0, "स्थिति से।"]],
      ]],
      ["Tides / ज्वार-भाटा", "ज्वार कैसे बनते।", [
        ["What are Tides? / ज्वार क्या?", "चंद्रमा (व सूर्य) के गुरुत्व से समुद्र में जल का चढ़ना-उतरना।", "तट पर पानी ऊपर-नीचे होता।", "ज्वार-भाटा का अंतर लिखें।", ["ज्वार किससे?", ["चंद्रमा का गुरुत्व", "हवा", "प्रकाश", "बादल"], 0, "चंद्रमा का गुरुत्व।"]],
        ["High & Low Tide / ऊँचा-नीचा ज्वार", "दिन में आम तौर पर दो ऊँचे-दो नीचे ज्वार।", "मछुआरे ज्वार देखकर निकलते।", "ज्वार-समय का निरीक्षण करें।", ["दिन में ऊँचे ज्वार?", ["दो", "एक", "पाँच", "शून्य"], 0, "दो।"]],
        ["Spring & Neap / वृहत् एवं लघु ज्वार", "पूर्णिमा-अमावस्या पर वृहत्, अन्य समय लघु ज्वार।", "पूर्णिमा पर ज्वार ऊँचा।", "ज्वार-प्रकार का चार्ट बनाएँ।", ["पूर्णिमा पर ज्वार?", ["वृहत्/ऊँचा", "लघु", "कोई नहीं", "सूखा"], 0, "ऊँचा।"]],
      ]],
      ["Eclipses / ग्रहण", "सूर्य एवं चंद्र ग्रहण।", [
        ["Solar Eclipse / सूर्य ग्रहण", "जब चंद्रमा सूर्य-पृथ्वी के बीच आकर सूर्य ढकता।", "सूर्य ग्रहण दिन में।", "सूर्य ग्रहण का diagram बनाएँ।", ["सूर्य ग्रहण कब?", ["अमावस्या", "पूर्णिमा", "कोई दिन", "बारिश"], 0, "अमावस्या।"]],
        ["Lunar Eclipse / चंद्र ग्रहण", "जब पृथ्वी सूर्य-चंद्रमा के बीच आकर चंद्रमा को छाया में डालती।", "चंद्र ग्रहण रात में।", "चंद्र ग्रहण का diagram बनाएँ।", ["चंद्र ग्रहण कब?", ["पूर्णिमा", "अमावस्या", "कोई दिन", "सुबह"], 0, "पूर्णिमा।"]],
        ["Safe Viewing / सुरक्षित दर्शन", "सूर्य ग्रहण नंगी आँखों/साधारण चश्मे से न देखें; certified filter उपयोग।", "सूर्य ग्रहण सीधे देखना हानिकारक।", "सुरक्षित दर्शन-नियम लिखें।", ["सूर्य ग्रहण?", ["certified filter से", "नंगी आँख", "साधारण चश्मा", "दूरबीन"], 0, "certified filter से।"]],
      ]],
      ["Observation & Culture / अवलोकन एवं संस्कृति", "चंद्र-निरीक्षण, कैलेंडर, ज्वार।", [
        ["Moon Observation / चंद्र अवलोकन", "चंद्रमा को रोज़ देखकर उसकी कला व स्थिति दर्ज करें।", "कुछ दिनों में चंद्रमा का आकार बदलता दिखता।", "एक सप्ताह चंद्रमा का चित्र बनाएँ।", ["चंद्रमा का आकार?", ["धीरे-धीरे बदलता", "स्थिर", "गायब", "लाल"], 0, "धीरे-धीरे बदलता है।"]],
        ["Moon & Calendar / चंद्रमा एवं कैलेंडर", "अनेक चंद्र-आधारित कैलेंडर व त्योहार चंद्रमा पर निर्भर।", "कुछ त्योहार पूर्णिमा-अमावस्या पर आते।", "एक चंद्र-आधारित त्योहार लिखें।", ["चंद्र-आधारित त्योहार?", ["दिवाली/होली जैसे", "कोई नहीं", "सिर्फ जन्मदिन", "बारिश"], 0, "चंद्र-आधारित त्योहार।"]],
        ["Explore Further / आगे जानें", "चंद्रमा पर मानव मिशन व ISRO अभियान जारी।", "Chandrayaan-3 चंद्रमा पर उतरा।", "भारत के चंद्र-मिशन की जानकारी लिखें।", ["Chandrayaan किसका?", ["ISRO/भारत", "NASA", "Russia", "China"], 0, "ISRO/भारत।"]],
      ]],
    ],
    glossary: [["Moon", "चंद्रमा", "पृथ्वी का प्राकृतिक उपग्रह।"], ["Phase", "कला", "चंद्रमा का दिखने वाला आकार।"], ["Tide", "ज्वार-भाटा", "समुद्र का चढ़ाव-उतार।"], ["Eclipse", "ग्रहण", "छाया से ढकना।"], ["Solar Eclipse", "सूर्य ग्रहण", "चंद्रमा द्वारा सूर्य ढकना।"], ["Lunar Eclipse", "चंद्र ग्रहण", "पृथ्वी की छाया चंद्रमा पर।"], ["Full Moon", "पूर्णिमा", "पूरा चंद्रमा दिखे।"], ["New Moon", "अमावस्या", "चंद्रमा न दिखे।"]],
    facts: ["चंद्र-चक्र लगभग 29.5 दिन का होता है।", "चंद्रमा के गुरुत्व से ज्वार-भाटा बनता है।", "चंद्र ग्रहण पूर्णिमा पर, सूर्य ग्रहण अमावस्या पर।", "→Planets & Stars सीखें तो आकाश-ज्ञान बढ़ेगा।"],
    project: { objective: "चंद्र-कला निरीक्षण डायरी।", materials: "कागज़, पेन।", steps: ["रोज़ चंद्रमा देखें।", "कला व स्थिति लिखें/चित्र बनाएँ।", "दिशा नोट करें।", "एक सप्ताह डायरी बनाएँ।"], observation: "कलाएँ कैसे बदलीं?", result: "Moon Phase Diary।", reflection: "कलाएँ क्यों बदलती हैं?" },
    revision: ["Moon = earth's natural satellite", "Phases over ~29.5 days", "Tides from moon's gravity", "Solar eclipse (new moon), lunar eclipse (full moon)", "Never view sun eclipse directly"],
    mastery: [["चंद्र-चक्र?", ["~29.5 दिन", "7", "365", "24"], 0, "~29.5 दिन।"], ["सूर्य ग्रहण कब?", ["अमावस्या", "पूर्णिमा", "कोई दिन", "बारिश"], 0, "अमावस्या।"], ["चंद्रमा का प्रकाश?", ["सूर्य से परावर्तित", "अपना", "तारों से", "बादल"], 0, "परावर्तित।"]],
    related: ["Planets & Stars", "Solar System & Space", "Oceans & Marine Life", "Time & Calendar"],
  },

  "Rocks, Minerals & Fossils": {
    icon: "🪨", level: "Beginner → Earth Science", tag: "Earth Science",
    tagline: "चट्टानें, खनिज और जीवाश्म की कहानी।",
    what: "Rocks are natural solid masses made of minerals. Minerals are natural substances with a definite composition. Fossils are remains of ancient life preserved in rock.",
    why: "Rocks and minerals build our world and give metals, gems and fuels. Fossils tell us about life long ago.",
    where: "Mountains, riverbeds, mines, buildings, roads and museums.",
    outcome: "Learners can name rock types, identify common minerals, explain fossils and understand earth's history.",
    modules: [
      ["Rock Basics / चट्टान आधार", "चट्टान क्या और प्रकार।", [
        ["What are Rocks? / चट्टानें क्या?", "चट्टानें खनिजों से बने प्राकृतिक ठोस; धरती की सतह बनाती।", "पहाड़-नदी-मिट्टी सब चट्टान/खनिज से।", "तीन चट्टान के नमूने इकट्टा करें।", ["चट्टान किससे?", ["खनिजों से", "पेड़", "पानी", "हवा"], 0, "खनिजों से।"]],
        ["Igneous Rocks / आग्नेय चट्टान", "ज्वालामुखी के ठंडे लावा से बनी चट्टानें (granite, basalt)।", "ज्वालामुखी लावा ठंडा होकर basalt बनाता।", "Igneous rock का चित्र बनाएँ।", ["Igneous किससे?", ["ठंडे लावा से", "मिट्टी", "पेड़", "पानी"], 0, "लावा से।"]],
        ["Sedimentary & Metamorphic / अवसादी एवं रूपांतरित", "अवसादी परतों से बनती (sandstone), रूपांतरित ताप-दबाव से (marble)।", "चूना-पत्थर से संगमरमर बनता।", "तीन चट्टान-प्रकार के उदाहरण लिखें।", ["संगमरमर कैसे?", ["रूपांतरित चट्टान", "ज्वालामुखी", "पेड़", "नदी"], 0, "रूपांतरित।"]],
      ]],
      ["Minerals / खनिज", "खनिज और उपयोग।", [
        ["What are Minerals? / खनिज क्या?", "खनिज प्राकृतिक पदार्थ जिनकी निश्चित संरचना; चट्टानों में मिलते।", "सोना, चाँदी, लोहा खनिज।", "पाँच खनिजों के नाम लिखें।", ["खनिज का गुण?", ["निश्चित संरचना", "केवल रंग", "केवल नाम", "कुछ नहीं"], 0, "निश्चित संरचना।"]],
        ["Common Minerals / सामान्य खनिज", "माइका, क्वार्ट्ज, फेल्डस्पार, हेमेटाइट आम।", "क्वार्ट्ज काँच बनाने में उपयोग।", "तीन खनिजों का उपयोग लिखें।", ["क्वार्ट्ज किसमें?", ["काँच", "कागज़", "लकड़ी", "रबर"], 0, "काँच।"]],
        ["Minerals & Us / खनिज एवं हम", "खनिजों से धातु, गहने, नमक, सीमेंट, ईंधन बनते।", "Aluminium बॉक्साइट से।", "पाँच खनिज-उत्पाद लिखें।", ["लोहा किससे?", ["लौह-अयस्क", "कागज़", "पेड़", "पानी"], 0, "लौह-अयस्क।"]],
      ]],
      ["Fossils / जीवाश्म", "जीवाश्म और अतीत।", [
        ["What are Fossils? / जीवाश्म क्या?", "प्राचीन जीवों के अवशेष जो चट्टानों में संरक्षित हो जाते।", "डायनासोर की हड्डियाँ जीवाश्म।", "एक जीवाश्म-चित्र बनाएँ।", ["जीवाश्म?", ["प्राचीन जीव-अवशेष", "नया पौधा", "खनिज", "पानी"], 0, "प्राचीन जीव-अवशेष।"]],
        ["How Formed / कैसे बनते", "जीव अवसाद में दबकर, खनिज भरकर वर्षों में जीवाश्म बनता।", "समुद्री जीव तलछट में दबकर जीवाश्म।", "जीवाश्म बनने का diagram बनाएँ।", ["जीवाश्म बनने में?", ["कई वर्ष", "एक दिन", "एक घंटा", "तुरंत"], 0, "कई वर्ष।"]],
        ["What They Tell / क्या बताते", "जीवाश्म से पुराने जीव, जलवायु व भूगोल का पता चलता।", "समुद्री जीवाश्म पहाड़ पर मिलना पुराने समुद्र का संकेत।", "एक जीवाश्म की जानकारी लिखें।", ["जीवाश्म क्या बताते?", ["पुराने जीव/जलवायु", "आज मौसम", "रंग", "धन"], 0, "पुराने जीव/जलवायु।"]],
      ]],
      ["Rock Cycle & Use / चट्टान चक्र एवं उपयोग", "चक्र और मानव उपयोग।", [
        ["Rock Cycle / चट्टान चक्र", "चट्टानें ताप-दबाव-कटाव से एक प्रकार से दूसरे में बदलतीं।", "लावा→igneous→अवसाद→metamorphic चक्र।", "rock cycle चित्र बनाएँ।", ["चट्टान बदलती?", ["ताप-दबाव-कटाव से", "कभी नहीं", "पानी से", "हवा से"], 0, "ताप-दबाव-कटाव से।"]],
        ["Building & Roads / निर्माण एवं सड़क", "पत्थर, सीमेंट, गिट्टी से घर-सड़क बनते।", "संगमरमर इमारत-सजावट में।", "निर्माण में उपयोग होने वाले तीन पत्थर लिखें।", ["सड़क में?", ["पत्थर/गिट्टी", "कागज़", "लकड़ी", "रबर"], 0, "पत्थर/गिट्टी।"]],
        ["Mining & Care / खनन एवं सावधानी", "खनन से खनिज निकलते, पर पर्यावरण-क्षति से बचना जरूरी।", "असंतुलित खनन से भूमि-जल क्षति।", "खनन की एक सावधानी लिखें।", ["खनन सावधानी?", ["पर्यावरण की रक्षा", "अंधाधुंध", "कचरा", "पानी बर्बाद"], 0, "पर्यावरण की रक्षा।"]],
      ]],
    ],
    glossary: [["Rock", "चट्टान", "खनिजों से बना ठोस।"], ["Mineral", "खनिज", "निश्चित संरचना वाला पदार्थ।"], ["Fossil", "जीवाश्म", "प्राचीन जीव-अवशेष।"], ["Igneous", "आग्नेय", "लावा से बना।"], ["Sedimentary", "अवसादी", "परतों से बना।"], ["Metamorphic", "रूपांतरित", "ताप-दबाव से बदला।"], ["Ore", "अयस्क", "धातु निकलने वाला खनिज।"], ["Rock Cycle", "चट्टान चक्र", "चट्टानों का घूर्णन।"]],
    facts: ["संगमरमर चूना-पत्थर से बनता है।", "सोना एक बहुमूल्य खनिज है।", "जीवाश्म से डायनासोर जैसे प्राचीन जीवों का पता चला।", "→Earth & Nature सीखें तो पृथ्वी-परतें जुड़ेंगी।"],
    project: { objective: "पाँच पत्थर-नमूनों का संग्रह व वर्गीकरण।", materials: "कागज़, पेन, पत्थर।", steps: ["पाँच पत्थर इकट्ठा करें।", "रंग-बनावट-कठोरता लिखें।", "प्रकार का अनुमान लगाएँ।", "संग्रह-तालिका बनाएँ।"], observation: "कौन-सा सबसे कठोर?", result: "Rock Collection।", reflection: "पत्थरों को कैसे बचाएँ?" },
    revision: ["Rocks = minerals combined", "Igneous (lava), sedimentary (layers), metamorphic (heat-pressure)", "Minerals have definite composition", "Fossils show ancient life", "Rock cycle changes types"],
    mastery: [["चट्टान किससे?", ["खनिजों से", "पेड़", "पानी", "हवा"], 0, "खनिजों से।"], ["संगमरमर कैसे?", ["रूपांतरित चट्टान", "ज्वालामुखी", "पेड़", "नदी"], 0, "रूपांतरित।"], ["जीवाश्म क्या बताते?", ["पुराने जीव/जलवायु", "आज मौसम", "रंग", "धन"], 0, "पुराने जीव/जलवायु।"]],
    related: ["Earth & Nature", "Materials & Their Uses", "Rivers, Mountains & Seas", "Science Around Us"],
  },

  "Air & Atmosphere": {
    icon: "🌬️", level: "Beginner → Earth Science", tag: "Earth Science",
    tagline: "हवा, वायुमंडल की परतें और स्वच्छ वायु।",
    what: "Air is the mixture of gases around us, mostly nitrogen and oxygen. The atmosphere is the layered blanket of air around the earth.",
    why: "Air gives us oxygen to breathe, protects from harmful rays and controls weather. Clean air is essential for health.",
    where: "Every breath, wind, clouds, airplanes and the sky above.",
    outcome: "Learners can describe air's composition, atmosphere layers, importance and actions for clean air.",
    modules: [
      ["Air Basics / वायु आधार", "हवा क्या और उसके गैस।", [
        ["What is Air? / हवा क्या?", "हवा गैसों का मिश्रण — ज्यादातर nitrogen (78%) व oxygen (21%)।", "हवा दिखती नहीं, महसूस होती।", "पंखे के आगे हवा महसूस करें।", ["हवा में सबसे अधिक?", ["Nitrogen", "Oxygen", "CO₂", "Helium"], 0, "Nitrogen।"]],
        ["Gases Around Us / गैसें", "Oxygen साँस हेतु, CO₂ पौधों हेतु, अन्य गैसें अल्प मात्रा में।", "पौधे CO₂ लेते, oxygen देते।", "तीन गैसों के उपयोग लिखें।", ["साँस हेतु गैस?", ["Oxygen", "Nitrogen", "CO₂", "Helium"], 0, "Oxygen।"]],
        ["Air & Life / वायु एवं जीवन", "सभी जीव साँस हेतु हवा पर निर्भर।", "बिना हवा जीवन संभव नहीं।", "साँस लेने की गति गिनें।", ["हवा के बिना?", ["जीवन नहीं", "जीवन चलेगा", "कोई फर्क नहीं", "जीव बढ़ेंगे"], 0, "जीवन नहीं।"]],
      ]],
      ["Atmosphere Layers / वायुमंडल की परतें", "परतें और उनका काम।", [
        ["Layers / परतें", "Troposphere, stratosphere, mesosphere, thermosphere, exosphere।", "मौसम troposphere में बनता।", "परतों का diagram बनाएँ।", ["मौसम कहाँ?", ["Troposphere", "Stratosphere", "Core", "Exosphere"], 0, "Troposphere।"]],
        ["Ozone Layer / ओज़ोन परत", "Stratosphere की ओज़ोन परत हानिकारक UV किरणें रोकती।", "ओज़ोन-छिद्र चिंता का विषय।", "ओज़ोन का काम लिखें।", ["ओज़ोन रोकती?", ["UV किरणें", "पानी", "हवा", "प्रकाश"], 0, "UV किरणें।"]],
        ["Protection / रक्षा", "वायुमंडल उल्का जलाता, तापमान संतुलित रखता।", "उल्का वायुमंडल में जल जाते।", "वायुमंडल के दो काम लिखें।", ["वायुमंडल का काम?", ["सुरक्षा+तापमान", "धन", "पेड़", "नदी"], 0, "सुरक्षा+तापमान।"]],
      ]],
      ["Weather & Wind / मौसम एवं पवन", "हवा, दबाव, वर्षा।", [
        ["Air Pressure / वायु दबाव", "हवा का भार दबाव बनाता; अंतर से हवा बहती।", "हाई से लो pressure की ओर हवा।", "दबाव-हवा संबंध लिखें।", ["हवा कहाँ बहती?", ["हाई से लो", "लो से हाई", "कोई नहीं", "ऊपर"], 0, "हाई से लो।"]],
        ["Wind & Weather / पवन एवं मौसम", "हवा के बहाव से मौसम बदलता, बादल-वर्षा बनती।", "ठंडी हवा तापमान घटाती।", "हवा की दिशा नोट करें।", ["बादल किससे?", ["जल-वाष्प", "धूल", "पत्थर", "रेत"], 0, "जल-वाष्प।"]],
        ["Rain & Clouds / वर्षा एवं बादल", "जल-वाष्प ठंडा होकर बादल, भारी होने पर वर्षा।", "काले बादल बारिश का संकेत।", "बादल-प्रकार देखें।", ["वर्षा किससे?", ["बादल", "हवा", "मिट्टी", "सूर्य"], 0, "बादल।"]],
      ]],
      ["Clean Air / स्वच्छ वायु", "प्रदूषण और रक्षा।", [
        ["Air Pollution / वायु प्रदूषण", "धुआँ, वाहन, कारखाने, धूल हवा प्रदूषित करते।", "धुएँ से साँस की समस्या।", "तीन प्रदूषण-स्रोत लिखें।", ["वायु प्रदूषण?", ["धुआँ/वाहन", "पेड़", "बारिश", "हवा"], 0, "धुआँ/वाहन।"]],
        ["Health Effects / स्वास्थ्य प्रभाव", "प्रदूषित हवा से खाँसी, अस्थमा व अन्य समस्याएँ।", "प्रदूषण से फेफड़े प्रभावित।", "तीन प्रभाव लिखें।", ["प्रदूषित हवा से?", ["साँस की समस्या", "कोई नहीं", "दृष्टि तेज़", "बाल बढ़ना"], 0, "साँस की समस्या।"]],
        ["Clean Air Actions / स्वच्छ वायु कदम", "पौधे लगाएँ, वाहन कम, धुआँ कम, mask जरूरत पर।", "पेड़ हवा साफ करते।", "तीन कदम लिखें।", ["स्वच्छ वायु हेतु?", ["पौधे लगाना", "अधिक धुआँ", "कचरा जलाना", "वाहन बढ़ाना"], 0, "पौधे लगाना।"]],
      ]],
    ],
    glossary: [["Air", "वायु", "गैसों का मिश्रण।"], ["Atmosphere", "वायुमंडल", "पृथ्वी के चारों ओर वायु-परत।"], ["Oxygen", "ऑक्सीजन", "साँस हेतु गैस।"], ["Nitrogen", "नाइट्रोजन", "वायु की मुख्य गैस।"], ["Ozone", "ओज़ोन", "UV रोकने वाली परत।"], ["Pressure", "दबाव", "हवा का भार।"], ["Pollution", "प्रदूषण", "हानिकारक मिलावट।"], ["Wind", "पवन/हवा", "हवा का बहाव।"]],
    facts: ["वायु में नाइट्रोजन ~78%, ऑक्सीजन ~21%।", "ओज़ोन परत पृथ्वी को UV से बचाती।", "वायुमंडल उल्का को जलाकर रोकता है।", "→Weather & Seasons सीखें तो मौसम गहराई से।"],
    project: { objective: "स्थानीय वायु गुणवत्ता निरीक्षण।", materials: "कागज़, पेन।", steps: ["तीन स्थान चुनें (सड़क, पार्क, घर)।", "धुआँ/धूल/गंध नोट करें।", "तुलना करें।", "सुधार सुझाएँ।"], observation: "कहाँ हवा सबसे साफ?", result: "Air Quality Report।", reflection: "स्वच्छ वायु हेतु क्या करें?" },
    revision: ["Air: ~78% N, ~21% O", "Atmosphere layers; ozone blocks UV", "Pressure difference causes wind", "Pollution harms health", "Clean air: plant trees, less smoke"],
    mastery: [["हवा में सबसे अधिक?", ["Nitrogen", "Oxygen", "CO₂", "Helium"], 0, "Nitrogen।"], ["ओज़ोन रोकती?", ["UV किरणें", "पानी", "हवा", "प्रकाश"], 0, "UV किरणें।"], ["बादल किससे?", ["जल-वाष्प", "धूल", "पत्थर", "रेत"], 0, "जल-वाष्प।"]],
    related: ["Weather & Seasons", "Water Cycle", "Earth & Nature", "Human Body & Health"],
  },
};
