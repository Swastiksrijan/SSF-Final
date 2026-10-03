/**
 * Education courses — RICH (Primary-level depth).
 *
 * This is the new, rebuild-quality content layer: each topic is authored as a
 * full object (body, objectives, deep, why, examples, practice, mistakes,
 * summary, reflection) and each module carries its own teaching steps + checks,
 * exactly like the Primary Education benchmark renderer.
 *
 * Subjects present here override the compact versions in the part files; the
 * loader (educationCourse.js) merges this object last. Subjects not yet rebuilt
 * continue to use the compact shape.
 *
 * BATCH 1: Computer Education
 */

export const EDU_RICH_B1 = {
  "Computer Education": {
    icon: "💻", level: "Foundation → Advanced", tag: "Digital Learning",
    tagline: "Computer को समझो, सुरक्षित चलाओ, और digital निर्माण करना सीखो।",
    what: "Computer education is the confident and safe use of computers — understanding hardware and software, managing files, creating documents and spreadsheets, using the internet responsibly, and taking a first step into programming, data and AI.",
    why: "Digital skills are now part of study, work and daily life. Knowing how a computer works, how to organise files, create documents and stay safe online opens education and employment doors for every learner.",
    where: "School and college computer labs, homes, offices, cyber cafés, smartphones, online classes, and almost every modern workplace.",
    outcome: "Learners can explain how a computer works, manage files, create documents, spreadsheets and presentations, search and verify information, protect their accounts, and begin learning programming, data and AI.",
    modules: [
      {
        title: "Computer Foundation / कंप्यूटर आधार",
        summary: "Hardware, software, operating system और basic controls।",
        steps: ["🔍 असली device या चित्र दिखाकर हर भाग का नाम पूछें।", "🗣️ हर भाग का कार्य एक सरल वाक्य में समझाएँ।", "👀 Input → Process → Output का जीवंत उदाहरण दिखाएँ।", "✋ device पर guided task करवाएँ।", "✍️ बच्चा स्वयं वही task दोहराए; teacher देखे।", "🔁 रोज़ के उपयोग से जोड़कर पुनरावृत्ति कराएँ।"],
        checks: ["भाग का नाम और कार्य बिना संकेत सही बता सके।", "दिखाया गया कार्य स्वयं कर सके।"],
        topics: [
          {
            title: "What is a Computer? / कंप्यूटर क्या है?",
            learn: "Computer एक मशीन है जो data इनपुट लेती है, program (निर्देश) के अनुसार process करती है, output देती है और जानकारी store करती है।",
            example: "Keyboard से नाम टाइप करना → CPU process करता है → monitor पर नाम दिखना।",
            activity: "अपने आसपास 5 ऐसी जगह पहचानें जहाँ computer जैसी मशीन काम करती है (मोबाइल, ATM, TV आदि)।",
            quiz: { question: "Computer का मुख्य काम क्या है?", options: ["Input → Process → Output → Store", "केवल खेल", "केवल print", "कुछ नहीं"], answer: 0, explain: "Computer data लेकर, निर्देश से process करके, output देता और store करता है।" },
            body: "**Computer क्या है? / What is a Computer?**\n\nComputer एक electronic मशीन है जो चार मूल काम करती है:\n- **Input** — data या निर्देश लेना (keyboard, mouse, touch)\n- **Process** — निर्देशों के अनुसार काम करना (CPU)\n- **Output** — परिणाम दिखाना (screen, speaker, printer)\n- **Store** — जानकारी अगली बार के लिए रखना (storage)\n\nComputer खुद नहीं सोचता — जो निर्देश (program) दिए जाएँ, वही करता है।",
            objectives: ["Computer को input → process → output → store के रूप में समझना।", "आसपास computer जैसी मशीनों की पहचान करना।", "एक दैनिक काम को computer के 4 चरणों में बाँटना।"],
            deep: "हर काम में यही चक्र दोहराता है — चाहे नाम टाइप करना हो या video चलाना। चारों में से कोई एक चरण टूटे तो काम नहीं होता: इनपुट न हो तो data नहीं, process बंद हो तो नतीजा नहीं, output न हो तो पता नहीं चलेगा, store न हो तो बंद करते ही चला जाएगा।",
            why: "इसी चक्र को समझने से आगे hardware, software, programming और AI — सब आसान हो जाते हैं, क्योंकि हर बड़ा काम इन्हीं चार चरणों का विस्तार है।",
            keyPoints: ["Input → Process → Output → Store", "CPU process करता है", "Computer निर्देशों से चलता है", "हर काम इसी चक्र से होता है"],
            examples: ["ATM: कार्ड डालना (input) → PIN जाँचना (process) → पैसे देना (output) → balance update (store)।", "मोबाइल में message टाइप करके भेजना — भी यही चार चरण।"],
            practice: ["एक दैनिक काम चुनकर उसके 4 चरण लिखें।", "अपने computer/मोबाइल के 3 input और 3 output device लिखें।", "बिना देखे चार चरण क्रम में बताएँ।"],
            mistakes: ["Input और output device में भ्रम करना (keyboard input, monitor output)।", "यह मानना कि computer खुद सोचता है — यह केवल निर्देश मानता है।"],
            summary: "Computer = input → process → output → store, और यह program (निर्देश) से चलता है।",
            reflection: ["आज मैंने किस दैनिक काम को 4 चरणों में बाँटा?", "कौन-सा input-output जोड़ी नया सीखा?"]
          },
          {
            title: "Hardware / हार्डवेयर",
            learn: "जो भाग हम छू सकते हैं वे hardware हैं — CPU (processing), RAM (अस्थायी memory), storage (स्थायी memory), monitor, keyboard, mouse, printer।",
            example: "CPU computer का 'दिमाग', RAM उसकी 'अस्थायी मेज', storage उसकी 'अलमारी'।",
            activity: "अपने device के 5 hardware parts की सूची बनाएँ और हर एक का कार्य लिखें।",
            quiz: { question: "Processing कौन करता है?", options: ["CPU", "Monitor", "Printer", "Mouse"], answer: 0, explain: "CPU (Central Processing Unit) मुख्य processing इकाई है।" },
            body: "**Hardware / हार्डवेयर**\n\nHardware वे भौतिक भाग हैं जिन्हें छू सकते हैं। मुख्य भाग:\n- **CPU** — processing; computer का दिमाग\n- **RAM** — अस्थायी memory; चालू काम तेज़ रखती है, बंद करते ही खाली\n- **Storage** (HDD/SSD/pen drive) — स्थायी memory; बंद करने पर भी रहती है\n- **Input devices** — keyboard, mouse, touch\n- **Output devices** — monitor, speaker, printer",
            objectives: ["Hardware के मुख्य भाग और उनके कार्य बताना।", "RAM और storage का अंतर समझना।", "अपने device के भागों की पहचान करना।"],
            deep: "RAM और storage का अंतर सबसे महत्वपूर्ण है: RAM अस्थायी और तेज़ है — चालू काम वहाँ रहता है; power बंद होते ही वह मिट जाता है। Storage धीमी पर स्थायी है — files, photos वहाँ बनी रहती हैं। इसलिए काम करते समय 'save' करना जरूरी है।",
            why: "यह जानने से पता चलता है कि file कहाँ सुरक्षित रहती है, computer धीमा क्यों होता है (RAM भर जाना), और backup क्यों जरूरी है।",
            keyPoints: ["CPU = processing", "RAM = अस्थायी, storage = स्थायी", "Input vs output devices", "Save किए बिना काम बंद होते ही खत्म"],
            examples: ["Pen drive से photos copy करना — storage का काम।", "बहुत सारे tabs/apps खोलने पर computer धीमा — RAM भर जाना।"],
            practice: ["अपने device के 5 hardware parts की सूची बनाएँ।", "RAM और storage के 3 अंतर लिखें।", "3 input और 3 output device लिखें।"],
            mistakes: ["RAM को स्थायी memory मानना।", "Input और output device में फर्क न कर पाना।"],
            summary: "Hardware = छूने योग्य भाग; CPU process करता है, RAM अस्थायी, storage स्थायी।",
            reflection: ["अपने device का कौन-सा hardware नया सीखा?", "file कहाँ सुरक्षित रहती है — अब कैसे बताऊँगा?"]
          },
          {
            title: "Software & Operating System / सॉफ्टवेयर एवं OS",
            learn: "Software निर्देशों का समूह है; Operating System (Windows/Linux/Android) hardware और apps के बीच प्रबंधन करता है।",
            example: "Android या Windows चालू होते ही desktop/screen मिलती है जिससे apps खुलते हैं — यह OS का काम है।",
            activity: "अपने device का OS नाम और 3 apps लिखें, और बताएँ हर app क्या करती है।",
            quiz: { question: "Operating System का मुख्य काम?", options: ["Hardware और apps का प्रबंधन", "छपाई", "खेल", "कुछ नहीं"], answer: 0, explain: "OS hardware को चलाता है और apps को उससे जोड़ता है।" },
            body: "**Software & OS / सॉफ्टवेयर एवं ऑपरेटिंग सिस्टम**\n\nSoftware = निर्देशों का समूह जो computer को बताता है क्या करना है।\n- **System software** — Operating System (Windows, Linux, Android, iOS)\n- **Application software** — Word, browser, camera, games\n\n**Operating System** hardware और apps के बीच पुल का काम करता है: keyboard से इनपुट लेना, screen पर दिखाना, memory बाँटना और files सँभालना।",
            objectives: ["Software और hardware का अंतर बताना।", "OS का कार्य समझना।", "system और application software पहचानना।"],
            deep: "OS वह नींव है जिसके बिना apps नहीं चल सकते। जब आप app खोलते हैं, वह सीधे hardware से नहीं, OS के ज़रिए बात करता है। इसलिए OS पुराना या खराब होने पर apps भी गड़बड़ करते हैं।",
            why: "OS समझना मतलब यह समझना कि device कैसे चलता है, apps कैसे जुड़ते हैं, और update क्यों जरूरी है (सुरक्षा और नई सुविधाएँ)।",
            keyPoints: ["Software = निर्देश", "OS = hardware-app प्रबंधक", "System vs application software", "OS update = सुरक्षा"],
            examples: ["Windows पर Word खोलना — OS ने memory और screen दी।", "Android फोन में camera app चलाना — OS camera hardware से जोड़ता है।"],
            practice: ["अपने device का OS और 3 apps लिखें।", "3 system और 3 application software की सूची बनाएँ।", "बताएँ OS के बिना क्या होगा।"],
            mistakes: ["App और OS को एक मानना।", "OS update को बेकार समझना।"],
            summary: "Software निर्देश हैं; OS hardware और apps के बीच प्रबंधन करता है।",
            reflection: ["मेरे device का OS कौन-सा है?", "OS के काम का एक नया उदाहरण क्या सोचा?"]
          }
        ]
      },
      {
        title: "Productivity / उत्पादकता",
        summary: "Documents, spreadsheets, presentations और email का व्यावहारिक उपयोग।",
        steps: ["👀 तैयार नमूना (document/sheet/slide) दिखाएँ।", "🗣️ हर tool का उद्देश्य बताएँ।", "🖥️ स्क्रीन पर demo करके चरण दिखाएँ।", "✋ साथ में guided task करवाएँ।", "✍️ स्वयं एक छोटा काम पूरा करवाएँ।", "🔎 काम जाँचकर सुधार करवाएँ।"],
        checks: ["document, sheet और slide स्वयं बना सके।", "बताए कि कौन-सा tool किस काम के लिए है।"],
        topics: [
          {
            title: "Documents / दस्तावेज़",
            learn: "Word processor में text लिखकर format (bold/heading/list) करें, save करें और PDF/print में निकालें।",
            example: "एक formal letter टाइप करके उसे PDF में save करना।",
            activity: "एक 1-पेज document (letter या notes) बनाकर folder में save करें।",
            quiz: { question: "Document में मुख्यतः क्या करते हैं?", options: ["लिखना और format करना", "गणना", "वीडियो बनाना", "कुछ नहीं"], answer: 0, explain: "Document text लिखने, format करने और save/print करने के लिए है।" },
            body: "**Documents / दस्तावेज़**\n\nDocument app (Word, Google Docs) में आप लिखते, सजाते और save करते हैं:\n- **Formatting** — heading, bold, bullet list, spacing\n- **Save / Save As** — file ko नाम देकर सुरक्षित करना\n- **Export PDF** — हर device पर एक जैसा दिखने के लिए",
            objectives: ["नया document बनाकर format करना।", "सही नाम से save करना।", "PDF में export करना।"],
            deep: "Document केवल टाइपिंग नहीं — साफ़ structure (heading, point, spacing) पढ़ने वाले को जल्दी समझाता है। और 'save' का अर्थ है काम स्थायी रूप से storage में जाना, वरना बंद करते ही चला जाएगा।",
            why: "Application, letter, notes, project report — हर जगह document काम आता है; और PDF बनाना सिखाने पर आपका काम हर किसी तक ठीक पहुँचता है।",
            keyPoints: ["Heading + bullets = साफ़ structure", "Save किए बिना काम खत्म", "PDF = हर जगह एक जैसा"],
            examples: ["Asli Zindagi: दुकान का bill या स्कूल का notice — दोनों document।", "NGO project report को PDF में भेजना।"],
            practice: ["एक 1-पेज letter बनाएँ।", "उसमें heading, bullet और bold लगाएँ।", "PDF में export करके देखें।"],
            mistakes: ["बिना save किए बंद कर देना।", "बिना heading सब एक ही पैराग्राफ में लिखना।"],
            summary: "Document = लिखना + format + save/PDF, जिससे काम साफ़ और साझा करने योग्य बने।",
            reflection: ["मेरा document कितना साफ़ है?", "कहाँ PDF बनाना उपयोगी रहा?"]
          },
          {
            title: "Spreadsheets / स्प्रेडशीट",
            learn: "Cells में data भरें, formula (जैसे =SUM) से गणना करें और chart बनाकर दिखाएँ।",
            example: "महीने के खर्च की सूची बनाकर =SUM से कुल निकालना।",
            activity: "5 खर्चों की sheet बनाकर formula से total और एक chart बनाएँ।",
            quiz: { question: "Total निकालने का formula कौन-सा है?", options: ["=SUM()", "=TOTAL", "=ADD", "कुछ नहीं"], answer: 0, explain: "=SUM(range) दिए गए cells का योग करता है।" },
            body: "**Spreadsheets / स्प्रेडशीट**\n\nSpreadsheet (Excel, Google Sheets) rows और columns के cells में data रखती है:\n- **Cell** — एक box (जैसे A1)\n- **Formula** — `=SUM(A1:A5)` जैसी गणना\n- **Chart** — data को graph में दिखाना\n\nयह गिनती, बजट, marks और stock के लिए सबसे उपयोगी tool है।",
            objectives: ["cells में data भरना।", "=SUM जैसे basic formula लगाना।", "data का chart बनाना।"],
            deep: "Spreadsheet की असली ताकत है formula — एक बार लगाओ, data बदलते ही उत्तर अपने आप बदल जाता है। इसलिए इसे 'जीवित गणना' कह सकते हैं, जबकि calculator पर हर बार दोबारा जोड़ना पड़ता है।",
            why: "बजट, attendance, marks, दुकान का हिसाब — spreadsheet से गलती कम होती है और काम तेज़; chart से बात तुरंत समझ आती है।",
            keyPoints: ["Cell = data की जगह", "=SUM() = योग", "Data बदलो, उत्तर अपने आप बदले", "Chart = बात साफ़"],
            examples: ["घर का महीना-वार बजट।", "कक्षा के marks का average और chart।"],
            practice: ["5 खर्चों की sheet बनाएँ।", "=SUM से total निकालें।", "एक bar chart बनाएँ।"],
            mistakes: ["Cell range गलत देना (=SUM(A1:A5) में A3 छोड़ देना)।", "Total को हाथ से जोड़ना भले formula हो सकता था।"],
            summary: "Spreadsheet = cells + formula + chart; यह गणना को स्वचालित और साफ़ बनाती है।",
            reflection: ["मैंने कौन-सा formula नया सीखा?", "chart से कौन-सी बात साफ़ हुई?"]
          },
          {
            title: "Presentations & Email / प्रस्तुति एवं ईमेल",
            learn: "Slides में बिंदु, चित्र और साफ़ संरचना रखें; email में स्पष्ट subject, संदेश और जरूरत हो तो attachment भेजें।",
            example: "एक topic की 5-slide presentation और उसे भेजने वाला professional email।",
            activity: "3-slide presentation बनाएँ और उसका email draft तैयार करें।",
            quiz: { question: "अच्छे email में सबसे जरूरी क्या है?", options: ["स्पष्ट subject और संदेश", "बिना subject", "केवल attachment", "कुछ नहीं"], answer: 0, explain: "स्पष्ट subject और संदेश से पढ़ने वाला तुरंत समझता है।" },
            body: "**Presentations & Email / प्रस्तुति एवं ईमेल**\n\n**Presentation** (PowerPoint, Slides):\n- हर slide पर एक मुख्य बिंदु\n- कम शब्द, सही चित्र, बड़ा font\n- शुरुआत → मुख्य बातें → निष्कर्ष\n\n**Email** का ढाँचा:\n- **Subject** — एक पंक्ति में उद्देश्य\n- **Greeting + संदेश** — संक्षिप्त और स्पष्ट\n- **Attachment** (जरूरत हो तो) + धन्यवाद",
            objectives: ["3-slide presentation बनाना।", "professional email लिखना।", "subject और संदेश स्पष्ट रखना।"],
            deep: "दोनों का लक्ष्य एक है — अपनी बात कम शब्दों में साफ़ पहुँचाना। Slide भीड़ नहीं, समझ के लिए होती है; email का subject पढ़ने वाले को यह तय करने में मदद करता है कि आगे पढ़े या नहीं।",
            why: "स्कूल project, interview, college application और काम — हर जगह साफ़ presentation और email बहुत अंतर बनाते हैं।",
            keyPoints: ["एक slide = एक बिंदु", "Subject स्पष्ट रखें", "Attachment से पहले नाम बताएँ", "शिष्ट भाषा"],
            examples: ["स्कूल science project की 5-slide presentation।", "शिकायत/निवेदन का email — स्पष्ट subject के साथ।"],
            practice: ["3-slide presentation बनाएँ।", "उसका email subject और 3-line message लिखें।", "एक attachment सही नाम से भेजें।"],
            mistakes: ["एक slide पर बहुत सारा text।", "बिना subject या गलत attachment भेजना।"],
            summary: "Slide साफ़ समझ के लिए, email स्पष्ट संदेश के लिए — दोनों में कम पर स्पष्ट लिखें।",
            reflection: ["मेरी presentation में कौन-सी slide सबसे साफ़ थी?", "email में subject कैसे सुधारा?"]
          }
        ]
      },
      {
        title: "Internet & Safety / इंटरनेट एवं सुरक्षा",
        summary: "Search, जानकारी जाँचना और digital सुरक्षा।",
        steps: ["👀 browser खोलकर दिखाएँ।", "🗣️ सही keywords कैसे चुनें, बताएँ।", "🔎 एक search साथ में करें।", "✋ learner स्वयं खोज करें।", "🧪 दो स्रोतों की तुलना करवाएँ।", "🔐 safety नियम याद करवाएँ।"],
        checks: ["सटीक keywords से search कर सके।", "जानकारी का स्रोत जाँच सके और safety नियम बता सके।"],
        topics: [
          {
            title: "Internet & Search / इंटरनेट एवं खोज",
            learn: "Browser से websites खोलें; बेहतर परिणाम के लिए सटीक keywords चुनें और परिणाम जाँचें।",
            example: "'पानी का सूत्र' की जगह 'water chemical formula' जैसे सटीक keywords।",
            activity: "एक topic को 3 अलग keywords से search करके बताएँ कौन-सा बेहतर रहा।",
            quiz: { question: "बेहतर search के लिए क्या करें?", options: ["सटीक keywords", "लंबा वाक्य", "एक अक्षर", "कुछ नहीं"], answer: 0, explain: "छोटे, सटीक keywords सबसे अच्छे परिणाम देते हैं।" },
            body: "**Internet & Search / इंटरनेट एवं खोज**\n\nInternet दुनिया-भर के computerों का जाल है; browser (Chrome) से हम websites खोलते हैं।\n- **URL/address** — किसी website का पता\n- **Search engine** — Google जैसा tool\n- बेहतर search: **छोटे, सटीक keywords** और जरूरत पर quotes",
            objectives: ["browser और search engine का उपयोग।", "सटीक keywords चुनना।", "परिणाम की उपयोगिता जाँचना।"],
            deep: "Search एक कौशल है — सही keyword से उत्तर पहली कोशिश में मिलता है, गलत से भ्रम। इसीलिए पहले सोचें 'मुझे असल में क्या चाहिए', फिर 2–4 सटीक शब्द लिखें।",
            why: "हर विषय की पढ़ाई, नौकरी और रोज़ का काम अब search पर निर्भर है; सही खोज समय बचाती और सही जानकारी देती है।",
            keyPoints: ["keywords छोटे और सटीक", "URL = website का पता", "परिणाम जाँचकर चुनें"],
            examples: ["परीक्षा syllabus खोजना — सटीक keywords से।", "एक शब्द का अर्थ और उदाहरण खोजना।"],
            practice: ["एक topic 3 keywords से खोजें।", "अच्छे-बुरे परिणाम की तुलना लिखें।", "एक website का URL लिखें।"],
            mistakes: ["पूरा लंबा वाक्य search में डालना।", "पहला परिणाम बिना जाँचे मान लेना।"],
            summary: "Search = सटीक keywords + परिणाम की जाँच।",
            reflection: ["कौन-सा keyword सबसे अच्छा रहा?", "मैं search कैसे सुधारूँगा?"]
          },
          {
            title: "Information Evaluation / जानकारी जाँचना",
            learn: "हर online जानकारी सही नहीं होती — source, तारीख और प्रमाण जाँचकर भरोसा करें।",
            example: "एक तथ्य को दो अलग भरोसेमंद websites पर मिलाकर देखना।",
            activity: "एक दावा चुनें और उसे दो स्रोतों से जाँचकर बताएँ सही है या नहीं।",
            quiz: { question: "Online जानकारी पर भरोसा कब?", options: ["स्रोत जाँचने के बाद", "हमेशा", "कभी नहीं", "फॉरवर्ड से"], answer: 0, explain: "स्रोत, तारीख और प्रमाण जाँचने के बाद ही भरोसा करें।" },
            body: "**Information Evaluation / जानकारी जाँचना**\n\nInternet पर सही और गलत — दोनों हैं। जाँच के 3 सवाल:\n- **कौन कह रहा है?** (source भरोसेमंद है?)\n- **कब लिखा?** (जानकारी पुरानी नहीं?)\n- **प्रमाण क्या?** (तथ्य/आँकड़े हैं या केवल दावा?)\n\nअफवाह तेज़ फैलती है — इसलिए **forward करने से पहले जाँचें**।",
            objectives: ["जानकारी के स्रोत जाँचना।", "तारीख/प्रमाण का महत्व समझना।", "अफवाह और तथ्य में फर्क करना।"],
            deep: "सत्य जानने का तरीका है 'cross-check' — एक ही बात कम-से-कम दो स्वतंत्र भरोसेमंद स्रोतों में देखें। सिर्फ शेयर किया जाना किसी बात को सही नहीं बनाता।",
            why: "गलत जानकारी से स्वास्थ्य, पैसा और समय — तीनों का नुकसान होता है; जाँचना एक जीवन-कौशल है।",
            keyPoints: ["Source जाँचें", "तारीख देखें", "प्रमाण माँगें", "forward से पहले verify"],
            examples: ["दावा: 'यह उपाय बीमारी ठीक करता है' — डॉक्टर/official स्रोत से जाँच।", "पुरानी scheme की तारीख जाँचकर नई जानकारी लेना।"],
            practice: ["एक दावा दो स्रोतों से जाँचें।", "एक अफवाह पहचानकर कारण लिखें।", "भरोसेमंद 3 websites की सूची बनाएँ।"],
            mistakes: ["फॉरवर्ड/टिप्पणी को प्रमाण मानना।", "एक ही स्रोत से सत्य मान लेना।"],
            summary: "जानकारी जाँचें: source, तारीख और प्रमाण — cross-check के बाद भरोसा।",
            reflection: ["आज कौन-सी जानकारी जाँचना जरूरी लगा?", "मैं अगली बार कैसे verify करूँगा?"]
          },
          {
            title: "Digital Safety / डिजिटल सुरक्षा",
            learn: "मजबूत password, OTP गोपनीय, phishing पहचानना, सुरक्षित download और account security अपनाएँ।",
            example: "किसी को OTP/password न बताना, और अनजान link को न खोलना।",
            activity: "एक मजबूत password बनाएँ और एक phishing संदेश का उदाहरण पहचानें।",
            quiz: { question: "OTP किसे बताएँ?", options: ["किसी को नहीं", "मित्र", "कॉलर", "सबको"], answer: 0, explain: "OTP और password कभी किसी के साथ साझा नहीं करें।" },
            body: "**Digital Safety / डिजिटल सुरक्षा**\n\nसुरक्षित रहने के नियम:\n- **मजबूत password** — अक्षर + अंक + symbol, हर खाते में अलग\n- **OTP/password** — कभी किसी के साथ साझा नहीं\n- **Phishing** — बैंक/नाम का झूठा संदेश जो जानकारी माँगे; link न खोलें\n- **सुरक्षित download** — केवल भरोसेमंद स्रोत से\n- **Logout** — साझा device पर काम के बाद",
            objectives: ["मजबूत password बनाना।", "phishing पहचानना।", "OTP/निजी जानकारी सुरक्षित रखना।"],
            deep: "सबसे बड़ा खतरा तकनीक नहीं, भरोसा है — ठग भरोसा जीतकर जानकारी माँगते हैं। याद रखें: असली बैंक/संस्था कभी OTP या password नहीं माँगती।",
            why: "एक गलती से पैसा, पहचान और निजी जानकारी जा सकती है; सुरक्षा की आदत आपको और परिवार को बचाती है।",
            keyPoints: ["OTP/password किसी को नहीं", "हर खाते में अलग password", "अनजान link न खोलें", "साझा device पर logout"],
            examples: ["'आपका खाता बंद हो जाएगा' वाला झूठा SMS — phishing।", "public computer पर काम के बाद logout करना।"],
            practice: ["एक मजबूत password बनाएँ।", "एक phishing संदेश पहचानें।", "safe digital use के 5 नियम लिखें।"],
            mistakes: ["हर जगह एक ही आसान password रखना।", "OTP/जन्मतिथि किसी को बताना।"],
            summary: "सुरक्षा = मजबूत password + OTP गोपनीय + phishing से सावधान + सुरक्षित download।",
            reflection: ["मेरा password कितना मजबूत है?", "phishing का कौन-सा लक्षण नया सीखा?"]
          }
        ]
      },
      {
        title: "Practical & Advanced Direction / व्यावहारिक एवं आगे की दिशा",
        summary: "Files व्यवस्थित करना, व्यावहारिक task और programming/data/AI का परिचय।",
        steps: ["👀 files/folders की व्यवस्था दिखाएँ।", "🗣️ अच्छे naming का तरीका बताएँ।", "🖥️ demo: एक file बनाकर folder में रखें।", "✋ learner स्वयं project folder बनाए।", "🧩 छोटा algorithm (steps) लिखवाएँ।", "🔎 काम जाँचकर सुधार करवाएँ।"],
        checks: ["files को folders में व्यवस्थित कर सके।", "एक दैनिक काम को step-by-step (algorithm) लिख सके।"],
        topics: [
          {
            title: "Files & Folders / फाइल एवं फोल्डर",
            learn: "Files को स्पष्ट नाम देकर folders में रखें, backup रखें और एक जैसा naming अपनाएँ।",
            example: "Class9/Maths/Notes जैसे subject-wise folders बनाना।",
            activity: "5 files को सही नाम देकर subject-wise folders में व्यवस्थित करें।",
            quiz: { question: "Files व्यवस्थित रखने का सही तरीका?", options: ["Folders और स्पष्ट नाम", "डेस्कटॉप पर सब", "कुछ नहीं", "एक ही नाम"], answer: 0, explain: "Folders और स्पष्ट नाम से files ढूँढना आसान रहता है।" },
            body: "**Files & Folders / फाइल एवं फोल्डर**\n\nअच्छी file-व्यवस्था:\n- **स्पष्ट नाम** — `Maths_Notes_Ch3.pdf` (न कि `new1.pdf`)\n- **Folders** — subject/विषय के अनुसार\n- **Backup** — जरूरी files की दूसरी copy (cloud/pen drive)\n- **Date** — नए और पुराने की पहचान",
            objectives: ["Files को सही नाम देना।", "folders में व्यवस्थित करना।", "जरूरी files का backup रखना।"],
            deep: "अच्छे नाम और folders का असर समय के साथ बढ़ता है — 100 files होने पर 'new1, new2' से कुछ नहीं मिलता, जबकि साफ़ नाम तुरंत। Backup वह सुरक्षा है जो device खराब होने पर भी काम बचाती है।",
            why: "समय बचता है, कुछ खोता नहीं, और दूसरों के साथ काम साझा करना आसान होता है।",
            keyPoints: ["स्पष्ट नाम दें", "Subject-wise folders", "Backup रखें", "एक जैसा naming"],
            examples: ["हर विषय का अलग folder।", "project की files एक ही folder में।"],
            practice: ["5 files को rename करें।", "3 subject folders बनाएँ।", "जरूरी files का backup लें।"],
            mistakes: ["डेस्कटॉप/Downloads में सब कुछ डालना।", "बिना backup बड़ी file रखना।"],
            summary: "Files = साफ़ नाम + folders + backup, ताकि कुछ खो न जाए और तुरंत मिल जाए।",
            reflection: ["मेरी files कितनी व्यवस्थित हैं?", "कौन-सी file का backup जरूरी है?"]
          },
          {
            title: "Practical Skills / व्यावहारिक कौशल",
            learn: "अपने हाथ से एक document, spreadsheet और presentation बनाना, files व्यवस्थित करना और professional email भेजना — यही असली digital कौशल है।",
            example: "तीनों (doc, sheet, slide) बनाकर एक project folder में रखना।",
            activity: "चार काम पूरे करें: document, spreadsheet, 3-slide presentation और एक email — सब एक folder में।",
            quiz: { question: "कौशल सीखने का सही क्रम?", options: ["Explain → Demonstrate → Practice → Task → Project", "केवल सुनना", "कुछ नहीं", "केवल पढ़ना"], answer: 0, explain: "समझो → देखो → अभ्यास → कार्य → project।" },
            body: "**Practical Skills / व्यावहारिक कौशल**\n\nकौशल सुनने से नहीं, **करने** से आता है:\n1. **Explain** — क्या करना है, समझें\n2. **Demonstrate** — एक बार होते देखें\n3. **Practice** — साथ में दोहराएँ\n4. **Task** — स्वयं एक काम पूरा करें\n5. **Project** — कई काम जोड़कर बनाएँ",
            objectives: ["चार व्यावहारिक काम स्वयं पूरे करना।", "एक project folder बनाना।", "गलती जाँचकर सुधारना।"],
            deep: "जब तक आप एक काम खुद शुरू से अंत तक नहीं करते, वह सीखा हुआ नहीं माना जाता। Project इसलिए जरूरी है कि वह अलग-अलग skills को जोड़ना सिखाता है।",
            why: "नौकरी और पढ़ाई में 'मैं कर सकता हूँ' का प्रमाण काम से मिलता है, इसलिए अभ्यास और project जरूरी हैं।",
            keyPoints: ["करके सीखें", "5 चरण: explain→project", "Project = कई skills साथ", "गलती जाँचकर सुधारें"],
            examples: ["एक topic पर doc + sheet + slide बनाना।", "project folder में सब रखकर साझा करना।"],
            practice: ["एक document बनाएँ।", "एक spreadsheet बनाएँ।", "3-slide presentation बनाकर सब एक folder में रखें।"],
            mistakes: ["सिर्फ देखना, स्वयं न करना।", "गलती जाँचे बिना आगे बढ़ना।"],
            summary: "व्यावहारिक कौशल = explain → demo → practice → task → project, और जाँच से सुधार।",
            reflection: ["मैंने खुद से कौन-सा काम किया?", "कहाँ गलती सुधारी?"]
          },
          {
            title: "Programming, Data & AI Intro / प्रोग्रामिंग, डेटा एवं AI परिचय",
            learn: "Programming निर्देशों का क्रम है; data जानकारी है जिसका विश्लेषण होता है; AI data से सीखने वाली तकनीक है।",
            example: "चाय बनाने के चरण = algorithm; फिर उन्हें computer से करवाना = programming।",
            activity: "एक daily काम के steps (algorithm) लिखें और बताएँ AI वहाँ कैसे मदद कर सकता है।",
            quiz: { question: "Algorithm क्या है?", options: ["चरणों का क्रम", "एक app", "एक device", "कुछ नहीं"], answer: 0, explain: "Algorithm = किसी काम को करने के चरणों का क्रम।" },
            body: "**Programming, Data & AI / प्रोग्रामिंग, डेटा एवं AI**\n\n- **Algorithm** — किसी काम के चरणों का क्रम\n- **Programming** — इन चरणों को computer से करवाना (Python, JavaScript...)\n- **Data** — जानकारी (marks, मौसम, बिक्री) जिसका विश्लेषण होता है\n- **AI** — data से pattern सीखकर भविष्यवाणी/निर्णय में मदद\n\nयाद रखें: AI भी गलत हो सकता है — नतीजे जाँचना जरूरी है।",
            objectives: ["algorithm की अवधारणा समझना।", "data का अर्थ बताना।", "AI का मूल और उसकी सीमा जानना।"],
            deep: "Programming की जड़ वही algorithm है जो रोज़ के कामों में है — क्रम, शर्त और दोहराव। AI इसका अगला चरण है: जहाँ सामान्य program नियम खुद बताते हैं, वहाँ AI data से नियम/pattern खुद सीखता है।",
            why: "यह समझना आज के दौर में जरूरी है — नौकरियाँ data/AI की ओर बढ़ रही हैं, और समझदार नागरिक बनने के लिए AI की सीमा जानना जरूरी है।",
            keyPoints: ["Algorithm = चरणों का क्रम", "Programming = निर्देश से चलाना", "Data = जानकारी", "AI = data से सीखना, पर जाँच जरूरी"],
            examples: ["चाय बनाने के steps = algorithm।", "मौसम data से बारिश की भविष्यवाणी = AI का विचार।"],
            practice: ["एक काम के 5 steps लिखें (algorithm)।", "3 example of data लिखें।", "AI का एक उपयोग और एक सीमा लिखें।"],
            mistakes: ["AI के हर उत्तर को सही मानना।", "algorithm को केवल computer की बात समझना — यह रोज़ के काम में भी है।"],
            summary: "Algorithm (चरण) → Programming (चलाना) → Data (जानकारी) → AI (data से सीखना, जाँच जरूरी)।",
            reflection: ["कौन-सा दैनिक काम algorithm की तरह है?", "AI कहाँ मदद कर सकता है, कहाँ नहीं?"]
          }
        ]
      }
    ],
    glossary: [["Hardware", "हार्डवेयर", "छूने योग्य भौतिक भाग।"], ["Software", "सॉफ्टवेयर", "निर्देशों का समूह।"], ["Operating System", "ऑपरेटिंग सिस्टम", "Hardware-app प्रबंधक।"], ["CPU", "सीपीयू", "मुख्य processing इकाई।"], ["RAM", "रैम", "अस्थायी memory।"], ["Storage", "भंडारण", "स्थायी memory।"], ["Spreadsheet", "स्प्रेडशीट", "गणना की sheet।"], ["Formula", "सूत्र", "गणना का निर्देश (=SUM)।"], ["Phishing", "फिशिंग", "धोखाधड़ी वाला संदेश।"], ["Algorithm", "कलन-विधि", "चरणों का क्रम।"]],
    facts: ["CPU computer का मुख्य processing हिस्सा है; RAM अस्थायी और storage स्थायी memory है।", "=SUM() spreadsheet में योग निकालता है।", "OTP और password कभी साझा नहीं करने चाहिए।", "Algorithm सिर्फ चरणों का क्रम है — रोज़ के काम भी algorithm हैं।", "AI data से सीखता है, पर हर उत्तर सही नहीं होता।"],
    project: { objective: "एक 'digital basics' project folder बनाना।", materials: "Computer/लैपटॉप, office software।", steps: ["एक document बनाएँ।", "एक spreadsheet बनाकर =SUM से total निकालें।", "3-slide presentation बनाएँ।", "सब एक folder में व्यवस्थित करें और backup रखें।"], observation: "कौन-सा काम सबसे उपयोगी लगा?", result: "एक संगठित digital project।", reflection: "अब आप कौन-सा कौशल आगे बढ़ाना चाहेंगे?" },
    revision: ["Input → Process → Output → Store", "Hardware vs Software; RAM vs storage", "=SUM() से total", "सटीक keywords से search", "OTP/password गोपनीय", "Files → folders में व्यवस्थित", "Algorithm = चरणों का क्रम"],
    mastery: [["Processing कौन करता है?", ["CPU", "Monitor", "Printer", "Mouse"], 0, "CPU।"], ["मजबूत password?", ["अक्षर+अंक+symbol", "1234", "नाम", "जन्मतिथि"], 0, "अक्षर+अंक+symbol।"], ["Spreadsheet में योग?", ["=SUM()", "=ADD", "=TOTAL", "कुछ नहीं"], 0, "=SUM()।"], ["OTP किसे बताएँ?", ["किसी को नहीं", "मित्र", "कॉलर", "सबको"], 0, "किसी को नहीं।"], ["Algorithm क्या है?", ["चरणों का क्रम", "एक app", "एक device", "कुछ नहीं"], 0, "चरणों का क्रम।"]],
    related: ["Secondary Education", "Technical Education", "Competitive Exam Preparation", "Library & Reading"]
  }
};