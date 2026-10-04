// Real teaching content for the Office Skills cards. Previously these cards
// shipped an empty shell ("detailed lessons will be added later"); this file
// supplies genuine, workplace-relevant material so every office card opens a
// complete Master Course. Keyed by the English course name (OFFICE_CARDS en).

const T = (title, learn, example, activity, q, options, answer, explain) =>
  ({ title, learn, example, activity, quiz: { q, options, answer, explain } });
const M = (title, summary, topics) => ({ title, summary, topics });

export const OFFICE_SKILLS_CONTENT = {
  "Excel & Spreadsheet Formulas": {
    tagline: "Cell references, core functions, logic, lookup और error handling — हिसाब-किताब को Excel में साफ़ और तेज़ बनाएँ।",
    modules: [
      M("Foundation / बुनियाद", "Cell, row, column, formula और function का फर्क।", [
        T("Cell References / सेल संदर्भ", "Excel में हर डेटा एक cell (A1) में रहता है; formula '=' से शुरू होकर दूसरे cells को नाम से पुकारता है।", "=A1+B1 दो cells जोड़ता है; =SUM(A1:A10) पूरी range जोड़ता है।", "एक खर्च-सूची बनाकर =SUM() से total निकालें।", "Excel formula किस चिह्न से शुरू होता है?", ["=", "#", "@", "$"], 0, "हर formula '=' से शुरू होता है।"),
        T("Formula vs Function", "Formula आपका खुद लिखा हिसाब है; function पहले से बना tool (SUM, AVERAGE)। डेटा बदलते ही result खुद अपडेट होता है।", "=AVERAGE(B2:B6) पाँच नंबरों का औसत देता है।", "मार्क्स की सूची बनाकर average निकालें।", "AVERAGE क्या है?", ["Function", "File type", "Password", "Chart"], 0, "AVERAGE built-in function है।"),
      ]),
      M("Core Functions / मुख्य फ़ंक्शन", "SUM, COUNT, ROUND, MIN/MAX जैसे रोज़ के functions।", [
        T("Adding & Counting", "SUM जोड़ता है, COUNT नंबर गिनता है, COUNTA भरे cells गिनता है — salary, stock या attendance का quick total।", "=COUNT(C2:C30) बताएगा कितने कर्मचारी present थे।", "30 दिन की attendance में present count निकालें।", "खाली न होने वाले cells गिनने का function?", ["COUNTA", "SUM", "ROUND", "TODAY"], 0, "COUNTA non-empty cells गिनता है।"),
        T("Rounding & Min/Max", "ROUND दशमलव तय करता है; MIN/MAX सबसे छोटा/बड़ा मान देते हैं।", "=ROUND(1234.567,2) → 1234.57; =MAX(D2:D20) सबसे बड़ी value।", "एक invoice की हर line amount round करें।", "1234.567 को 2 दशमलव तक round करने का सूत्र?", ["=ROUND(1234.567,2)", "=SUM(1234.567,2)", "=COUNT(1234.567)", "=MAX(1234.567)"], 0, "ROUND(value, digits) दशमलव तय करता है।"),
      ]),
      M("References & Logic / संदर्भ और तर्क", "Absolute reference और IF/AND/OR से decisions।", [
        T("Relative vs Absolute", "$ चिह्न reference को lock करता है; $B$1 copy करने पर नहीं बदलता — fixed rate के लिए उपयोगी।", "=A2*$B$1 नीचे खींचने पर A बदलता है पर $B$1 वही रहता है।", "fixed GST rate सेल बनाकर कई amounts पर लगाएँ।", "कौन-सा reference copy करने पर नहीं बदलता?", ["$B$1", "B1", "B2", "A1"], 0, "$ absolute reference lock करता है।"),
        T("IF, AND, OR", "IF शर्त पर एक value देता है, वरना दूसरी; AND/OR कई शर्तें जोड़ते हैं — pass/fail या alert column।", '=IF(B2>=40,"Pass","Fail")', "Marks से automatic Pass/Fail column बनाएँ।", "शर्त पर दो में से एक परिणाम देने वाला function?", ["IF", "SUM", "MAX", "COUNT"], 0, "IF conditional result देता है।"),
      ]),
      M("Lookup & Errors / खोज और त्रुटि", "VLOOKUP और common errors ठीक करना।", [
        T("VLOOKUP", "एक key से दूसरी table में जुड़ा मान खोजता है, जैसे roll number से नाम। exact match (0) रखें।", "=VLOOKUP(A2,Sheet2!A:C,2,0)", "master list से दूसरी sheet में नाम भरें।", "VLOOKUP में exact match के लिए क्या दें?", ["0/FALSE", "1/TRUE", "कोई नहीं", "2"], 0, "0/FALSE exact match करता है।"),
        T("Common Errors", "#DIV/0! शून्य से भाग, #REF! हटा reference, #N/A न मिला मान दिखाता है; IFERROR से साफ़ करें।", '=IFERROR(A2/B2,"—")', "एक broken formula ठीक करके IFERROR लगाएँ।", "#DIV/0! कब आता है?", ["शून्य से भाग देने पर", "file बंद होने पर", "password गलत होने पर", "chart हटाने पर"], 0, "शून्य से भाग देने पर #DIV/0! आता है।"),
      ]),
    ],
    glossary: [["Cell", "सेल", "डेटा रखने की सबसे छोटी इकाई (A1)।"], ["Function", "फ़ंक्शन", "पहले से बना हिसाब tool (SUM, IF)।"], ["Absolute Reference", "निरपेक्ष संदर्भ", "$ से lock किया reference।"]],
    facts: ["Excel में 400+ functions हैं; रोज़ के ~20 सीखकर 90% office काम हो जाता है।"],
    mastery: [["पूरी range जोड़ने का function?", ["SUM", "IF", "ROUND", "COUNT"], 0, "SUM range जोड़ता है।"], ["Fixed amount के लिए reference?", ["$B$1", "B1", "A1", "C1"], 0, "$ lock करता है।"]],
  },

  "Microsoft Excel": {
    tagline: "Data को tables, sorting/filtering, charts, pivot tables और dashboard में बदलकर office report आसान बनाएँ।",
    modules: [
      M("Data & Tables / डेटा और टेबल", "साफ़ data entry और Excel Table के फायदे।", [
        T("Clean Data", "हर column में एक ही तरह का data रखें; ऊपर heading, बीच में खाली row नहीं — यही हर report की बुनियाद है।", "Date | Name | Amount | Department क्रम में लगातार rows।", "एक महीने का खर्च साफ़ table में लिखें।", "अच्छे data की पहली शर्त?", ["हर column में एक ही तरह का data", "रंग-बिरंगी rows", "खाली rows", "बिना heading"], 0, "Consistent columns analysis आसान करते हैं।"),
        T("Excel Tables", "Ctrl+T से data को Table बनाएँ — filter, auto formula और बढ़ती range मिलती है।", "Table बनाने पर =SUM(Table1[Amount]) पूरे column पर लगता है।", "अपनी खर्च-सूची को Table में बदलें।", "Data को Table बनाने का shortcut?", ["Ctrl+T", "Ctrl+P", "Ctrl+S", "Ctrl+Z"], 0, "Ctrl+T Table बनाता है।"),
      ]),
      M("Sorting & Filtering / छँटाई और फ़िल्टर", "Data क्रम में लगाना और जरूरी rows निकालना।", [
        T("Sort / छँटाई", "Sort data को बढ़ते/घटते क्रम में लगाता है; पहले पूरी table चुनें ताकि rows टूटें नहीं।", "Amount column पर Largest→Smallest।", "खर्च को amount के हिसाब से sort करें।", "Sort से पहले क्या करें?", ["पूरी table चुनें", "सिर्फ एक cell चुनें", "file बंद करें", "chart बनाएँ"], 0, "पूरी table चुनने पर rows साथ रहती हैं।"),
        T("Filter / फ़िल्टर", "Filter सिर्फ चुनी rows दिखाता है — जैसे एक department या महीना; हटाने पर पूरा data वापस।", "Department = Accounts filter।", "एक महीने का खर्च filter करके total निकालें।", "Filter का काम?", ["सिर्फ चुनी rows दिखाना", "data delete करना", "file save करना", "password लगाना"], 0, "Filter चुनी rows दिखाता है।"),
      ]),
      M("Charts & Pivot / चार्ट और पिवट", "Visual और summary।", [
        T("Choosing a Chart", "Trend के लिए line, तुलना के लिए column, हिस्सेदारी के लिए pie — सही chart data की कहानी जल्दी कहता है।", "महीने-वार sales के लिए column chart।", "अपने खर्च का bar chart बनाएँ।", "हिस्सेदारी दिखाने का सबसे सही chart?", ["Pie", "Line", "Scatter", "Area"], 0, "Pie हिस्सेदारी दिखाता है।"),
        T("Pivot Tables", "Rows, columns और values में fields डालकर तुरंत summary — जैसे department-wise total salary; data बदलने पर Refresh।", "Rows=Department, Values=Sum of Salary।", "एक data से department-wise total निकालें।", "Data बदलने पर Pivot में क्या करें?", ["Refresh", "Delete", "Save As", "Hide"], 0, "Refresh से Pivot अपडेट होता है।"),
      ]),
      M("Dashboard / डैशबोर्ड", "Key numbers एक नज़र में।", [
        T("Dashboard Basics", "सबसे जरूरी KPI (total, average, top items) कम जगह में रखें, detail नीचे।", "ऊपर Total Sales, Pending; नीचे chart।", "एक page पर 4 key numbers और 1 chart रखें।", "Dashboard में क्या रखें?", ["सबसे जरूरी key numbers", "पूरा raw data", "सिर्फ रंग", "खाली cells"], 0, "Dashboard key numbers पर केंद्रित होता है।"),
        T("Conditional Formatting", "शर्त पर cell खुद रंग बदलती है — जैसे pending payment लाल।", "Amount > 10000 वाली cells लाल।", "बड़ी रकम highlight करें।", "जरूरी value highlight करने का tool?", ["Conditional Formatting", "Pivot", "Sort", "Print"], 0, "Conditional Formatting शर्त पर रंग लगाता है।"),
      ]),
    ],
    glossary: [["Pivot Table", "पिवट टेबल", "Data का तुरंत summary tool।"], ["Filter", "फ़िल्टर", "चुनी हुई rows दिखाना।"], ["Dashboard", "डैशबोर्ड", "Key numbers का एक-पेज view।"]],
    facts: ["एक साफ़ Pivot Table घंटों का manual जोड़ कुछ सेकंड में कर देता है।"],
    mastery: [["Table बनाने का shortcut?", ["Ctrl+T", "Ctrl+P", "Ctrl+S", "Ctrl+Z"], 0, "Ctrl+T Table बनाता है।"], ["Pivot refresh कब?", ["Data बदलने पर", "कभी नहीं", "print पर", "file खोलने पर"], 0, "Data बदलने पर refresh करें।"]],
  },

  "Microsoft Word": {
    tagline: "Documents, letters और reports को साफ़ formatting, tables और styles के साथ professional बनाएँ।",
    modules: [
      M("Document Basics / बुनियाद", "नया document, save और editing।", [
        T("Create & Save", "नया document खोलें, text लिखें और Ctrl+S से save करें; सही नाम-folder से file बाद में मिलती है।", "File name: 2026-03_Invoice_Sharma.docx", "एक notice लिखकर सही नाम से save करें।", "Word में save का shortcut?", ["Ctrl+S", "Ctrl+P", "Ctrl+C", "Ctrl+V"], 0, "Ctrl+S save करता है।"),
        T("Select & Edit", "Text चुनकर bold/colour/delete करें; Ctrl+Z गलती वापस लाता है।", "Heading चुनकर Bold और बड़ा font।", "paragraph लिखकर heading bold करें।", "गलती वापस लेने का shortcut?", ["Ctrl+Z", "Ctrl+S", "Ctrl+P", "Ctrl+B"], 0, "Ctrl+Z undo करता है।"),
      ]),
      M("Formatting / फ़ॉर्मैटिंग", "Font, spacing, list और alignment।", [
        T("Font & Spacing", "1–2 font रखें, heading अलग size; line spacing 1.15–1.5 और paragraph gap पढ़ना आसान करते हैं।", "Heading 16pt bold, body 11–12pt।", "notice में heading और body का फर्क साफ़ करें।", "पढ़ने में आसान document के लिए?", ["1–2 font और साफ़ spacing", "5 font", "बिना spacing", "सिर्फ bold"], 0, "कम font + spacing पढ़ना आसान करते हैं।"),
        T("Lists & Alignment", "Bullets points साफ़ करते हैं, numbering steps दिखाती है; left align body सबसे पढ़ने योग्य है।", "Steps के लिए 1,2,3; features के लिए • bullets।", "checklist numbered list में लिखें।", "Steps दिखाने के लिए क्या?", ["Numbered list", "Bullets", "Table", "Chart"], 0, "Steps के लिए numbering सही है।"),
      ]),
      M("Tables & Documents / टेबल और दस्तावेज़", "Table, page setup और professional structure।", [
        T("Insert Table", "Table rows/columns में data साफ़ रखता है; header row bold/shaded रखें।", "Item | Qty | Rate | Amount।", "छोटी rate list table बनाएँ।", "जुड़ा data किसमें साफ़ दिखता है?", ["Table", "Bullets", "Chart", "Footnote"], 0, "Table rows/columns में data साफ़ रखता है।"),
        T("Page Setup & Styles", "Margins, orientation और Heading styles; Heading styles से auto Table of Contents बनता है।", "चौड़ी table के लिए Landscape; Heading 1 से chapters।", "table को landscape में fit करें और TOC जोड़ें।", "Auto Table of Contents के लिए क्या जरूरी?", ["Heading styles", "Bold text", "Colour", "Table"], 0, "Heading styles से auto TOC बनता है।"),
      ]),
      M("Professional Writing / पेशेवर लेखन", "Letter, report और CV।", [
        T("Letter & Report", "Letter में date, receiver, subject, body, signature; report में title, purpose, findings, conclusion।", "Subject: Leave Application — 3 पंक्तियों का body।", "औपचारिक application लिखें।", "औपचारिक letter में सबसे ऊपर क्या?", ["Date और receiver", "Signature", "Table", "Chart"], 0, "Date और receiver ऊपर होते हैं।"),
        T("Proofread & Print", "Spell check (F7) चलाएँ, Print Preview से देखें कि content कट तो नहीं रहा, फिर print/PDF।", "F7 से spelling जाँच।", "एक page proofread करके PDF में export करें।", "Print से पहले क्या देखें?", ["Print Preview", "रंग", "font की कीमत", "chart"], 0, "Preview से layout जाँचें।"),
      ]),
    ],
    glossary: [["Style", "स्टाइल", "Formatting का बना set।"], ["Margin", "हाशिया", "Page के किनारे की खाली जगह।"], ["TOC", "विषय-सूची", "Auto list of headings।"]],
    facts: ["Heading styles लगाने से Word खुद contents list और navigation बना देता है।"],
    mastery: [["Word save shortcut?", ["Ctrl+S", "Ctrl+Z", "Ctrl+B", "Ctrl+P"], 0, "Ctrl+S save करता है।"], ["चौड़ी table के लिए orientation?", ["Landscape", "Portrait", "Square", "कोई नहीं"], 0, "Landscape चौड़ी table में fit होती है।"]],
  },

  "Microsoft PowerPoint": {
    tagline: "Slides, design, charts और confident presenting — कम शब्दों में साफ़ message।",
    modules: [
      M("Slide Basics / बुनियाद", "Slide बनाना और text rules।", [
        T("New Slide & Layout", "हर slide पर एक main idea रखें; title + content layout से शुरुआत करें।", "Title → Agenda → 3 content → Summary।", "5-slide का presentation बनाएँ।", "एक slide पर कितने main idea?", ["एक", "पाँच", "जितने आएँ", "शून्य"], 0, "एक slide = एक idea।"),
        T("Text Rules", "Bullet छोटे (5–6 शब्द) रखें; 6 lines से ज्यादा हो तो नई slide बनाएँ। Font 24pt+ रखें।", "• Sales up 20% (बोलकर समझाएँ)।", "एक भरी slide को 2 हल्की slides में बाँटें।", "Slide font का safe size?", ["24pt+", "8pt", "10pt", "12pt"], 0, "24pt+ पीछे से पढ़ा जाता है।"),
      ]),
      M("Design & Content / डिज़ाइन", "Theme, colours और visuals।", [
        T("Theme & Colours", "एक theme और 2–3 रंग पूरे deck में; text का contrast साफ़ रखें।", "गहरा नीला background + सफेद text।", "deck पर एक theme लगाएँ।", "Deck में कितने theme रखें?", ["एक", "चार", "हर slide अलग", "कोई नहीं"], 0, "एक theme एकरूपता देता है।"),
        T("Images & Charts", "एक सही image या chart लंबे text से बेहतर समझाता है; सबसे जरूरी number बड़ा रखें।", "growth दिखाने वाला column chart।", "एक data slide में chart जोड़ें।", "Data दिखाने का सबसे साफ़ तरीका?", ["Chart", "पैराग्राफ", "छोटा font", "Bullets"], 0, "Chart data जल्दी समझाता है।"),
      ]),
      M("Animation & Delivery / प्रस्तुति", "हल्का animation और confident बोलना।", [
        T("Animation", "Appear/Fade जैसा हल्का effect काफ़ी है; हर शब्द उड़ाना audience को थका देता है।", "Bullet एक-एक करके Appear।", "3 bullets पर हल्का animation लगाएँ।", "अच्छा animation कैसा?", ["हल्का और उपयोगी", "हर शब्द पर भारी", "बहुत रंग", "ध्वनि भरी"], 0, "हल्का animation ध्यान बनाए रखता है।"),
        T("Presenter Tips", "Slides को script न बनाएँ — points बोलकर समझाएँ; Presenter View से notes/timer दिखते हैं।", "Slide पर 3 शब्द, मुँह से पूरा वाक्य।", "एक slide 1 मिनट में बोलकर समझाएँ।", "Presenter View का फायदा?", ["Notes और timer presenter को", "audience को notes", "file छोटा", "print आसान"], 0, "Presenter View presenter को notes दिखाता है।"),
      ]),
      M("Build a Deck / पूरा डेक", "Planning से delivery तक।", [
        T("Plan & Structure", "पहले कहानी तय करें: problem → points → proof → ask; फिर slides बनाएँ।", "Problem → 3 facts → chart → request।", "अपने topic का 4-point outline लिखें।", "Slides बनाने से पहले क्या तय करें?", ["कहानी/structure", "रंग", "font", "animation"], 0, "पहले structure तय करें।"),
        T("Rehearse & Export", "बोलकर अभ्यास करें, timing देखें; जरूरत पर PDF handout या video export करें।", "Slide Show > From Beginning से अभ्यास।", "एक बार पूरा deck बोलकर अभ्यास करें।", "Deck साझा करने का सुरक्षित रूप?", ["PDF export", "कच्ची file", "स्क्रीनशॉट", "print स्क्रीन"], 0, "PDF export layout सुरक्षित रखता है।"),
      ]),
    ],
    glossary: [["Layout", "लेआउट", "Slide पर content की जगह।"], ["Theme", "थीम", "रंग-font का set।"], ["Presenter View", "प्रस्तुतकर्ता दृश्य", "Notes दिखाने वाला screen।"]],
    facts: ["10-20-30 नियम: 10 slides, 20 मिनट, 30pt font — presenting आसान रखता है।"],
    mastery: [["एक slide पर कितने idea?", ["एक", "पाँच", "दस", "शून्य"], 0, "एक slide = एक idea।"], ["Slide का safe font size?", ["24pt+", "8pt", "10pt", "12pt"], 0, "24pt+ पीछे से दिखता है।"]],
  },

  "PDF Tools & Management": {
    tagline: "PDF बनाना, convert, edit, merge, split, compress और sign — documents office-ready रखें।",
    modules: [
      M("PDF Basics / बुनियाद", "PDF क्यों और कब।", [
        T("What is PDF", "PDF हर device पर एक जैसा दिखता है, इसलिए letter, invoice और certificate भेजने के लिए सबसे भरोसेमंद है।", "Bank statement या marksheet PDF में भेजना।", "एक Word file को PDF में export करें।", "PDF की खास बात?", ["हर device पर एक जैसा दिखता है", "हमेशा editable", "सिर्फ मोबाइल में", "भारी file"], 0, "PDF layout हर जगह same रहता है।"),
        T("View & Search", "zoom, page jump और Ctrl+F से लंबा document जल्दी पढ़ा जाता है।", "Invoice में Ctrl+F से 'Total' खोजना।", "एक PDF में शब्द search करें।", "PDF में शब्द खोजने का shortcut?", ["Ctrl+F", "Ctrl+P", "Ctrl+S", "Ctrl+Z"], 0, "Ctrl+F find करता है।"),
      ]),
      M("Convert & Create / बदलना", "Word/Image ↔ PDF।", [
        T("Create PDF", "Word/Excel/image से 'Save/Export as PDF'; Print > Save as PDF भी आसान तरीका।", "Word report को Export → PDF।", "एक image को PDF में बदलें।", "Word से PDF बनाने का तरीका?", ["Export/Save as PDF", "Ctrl+Z", "Print screen", "Rename"], 0, "Export/Save as PDF से PDF बनता है।"),
        T("PDF to Word", "PDF को Word में बदलकर edit किया जा सकता है, पर formatting बदल सकता है — बाद में जाँचें।", "पुराना form PDF से Word में edit।", "एक PDF को Word में convert करके जाँचें।", "PDF को edit करने के लिए?", ["Word में convert करें", "rename करें", "delete करें", "print करें"], 0, "Word में convert करके edit होता है।"),
      ]),
      M("Organise PDF / व्यवस्थित", "Merge, split, rotate, reorder।", [
        T("Merge & Split", "Merge कई PDF को एक बनाता है; Split चुने pages अलग करता है।", "ID + address proof को एक PDF में merge।", "दो PDF merge करके set बनाएँ।", "कई PDF को एक बनाना?", ["Merge", "Split", "Compress", "Rotate"], 0, "Merge जोड़ता है।"),
        T("Rotate & Reorder", "गलत दिशा के pages rotate करें और scan के pages सही क्रम में लगाएँ।", "उल्टे scan page को 90° rotate।", "scan PDF के pages सही क्रम में लगाएँ।", "उल्टा page सीधा करने का tool?", ["Rotate", "Merge", "Split", "Sign"], 0, "Rotate दिशा बदलता है।"),
      ]),
      M("Edit & Secure / संपादन और सुरक्षा", "Annotation, compress, sign।", [
        T("Annotate & Compress", "Highlight/comment से नोट जोड़ें; Compress बड़ी file को email लायक छोटा करता है।", "10MB scan को 1MB तक compress।", "एक बड़ी PDF compress करें।", "बड़ी PDF छोटी करने का tool?", ["Compress", "Merge", "Rotate", "Sign"], 0, "Compress size घटाता है।"),
        T("Digital Sign & Protect", "Sign tool से हस्ताक्षर जोड़ें; जरूरी files पर password/protect लगाएँ।", "Agreement PDF पर signature।", "एक PDF पर हस्ताक्षर जोड़ें।", "PDF पर हस्ताक्षर जोड़ने का tool?", ["Sign", "Split", "Compress", "Rotate"], 0, "Sign हस्ताक्षर जोड़ता है।"),
      ]),
    ],
    glossary: [["Merge", "मर्ज", "कई PDF को एक बनाना।"], ["Compress", "कंप्रेस", "File का size घटाना।"], ["OCR", "ओसीआर", "Scan की image से text निकालना।"]],
    facts: ["Print > 'Save as PDF' हर Windows/Mac में मौजूद मुफ़्त PDF बनाने का तरीका है।"],
    mastery: [["कई PDF एक बनाने का tool?", ["Merge", "Split", "Rotate", "Sign"], 0, "Merge जोड़ता है।"], ["बड़ी PDF छोटी करने का tool?", ["Compress", "Merge", "Rotate", "Split"], 0, "Compress size घटाता है।"]],
  },

  "Email & Office Communication": {
    tagline: "Gmail/Outlook, professional emails, attachments, meetings और follow-up — साफ़, विनम्र communication।",
    modules: [
      M("Email Basics / बुनियाद", "Inbox और basic actions।", [
        T("Inbox & Actions", "Reply भेजने वाले को, Reply All सबको, Forward किसी और को; सोच-समझकर Reply All चुनें।", "Boss के mail पर Reply; team को जानकारी हो तो Reply All।", "Reply और Forward का फर्क देखें।", "पूरी team को जवाब?", ["Reply All", "Reply", "Forward", "Delete"], 0, "Reply All सबको भेजता है।"),
        T("Labels & Folders", "Mail को label/folder में रखें, Star/Flag से important चिह्नित करें।", "Invoices, Clients, Personal labels।", "10 mail को labels में बाँटें।", "Inbox साफ़ रखने का तरीका?", ["Labels/folders", "सब delete", "सब unread", "सब spam"], 0, "Labels से mail organised रहते हैं।"),
      ]),
      M("Professional Email / पेशेवर ईमेल", "Subject, tone, structure।", [
        T("Clear Subject", "Subject में काम साफ़ लिखें — 'Leave request – 12–13 Oct' जैसा; अस्पष्ट subject छूट सकता है।", "Subject: Invoice #45 – payment confirmation।", "तीन कामों के साफ़ subject लिखें।", "अच्छे subject में क्या हो?", ["साफ़ काम", "खाली", "सिर्फ Hi", "बहुत लंबा"], 0, "साफ़ subject receiver की मदद करता है।"),
        T("Tone & Structure", "Greeting → purpose → detail → request → thanks → signature; विनम्र, सीधी भाषा; CAPS से बचें।", "Dear Sir, Please find the report attached. Thanks, Rahul।", "एक request mail पूरे structure में लिखें।", "पूरे capital letters का मतलब?", ["चिल्लाना", "विनम्रता", "औपचारिकता", "गोपनीयता"], 0, "CAPS चिल्लाने जैसा लगता है।"),
      ]),
      M("Attachments & Meetings / संलग्न और बैठक", "File जोड़ना और meeting etiquette।", [
        T("Attachments", "File भेजने से पहले size/sahi file जाँचें; बड़ी file compress या cloud link से; भेजने से पहले attachment जुड़ा है या नहीं देखें।", "Invoice PDF attach करके भेजना।", "एक PDF attach करके खुद को test भेजें।", "बड़ी file भेजने से पहले?", ["compress या link", "सब delete", "rename", "print"], 0, "compress/link से भेजना आसान होता है।"),
        T("Meetings & Follow-up", "Meeting invite में समय, agenda और link साफ़ रखें; जवाब न आने पर 2–3 दिन बाद विनम्र reminder।", "Gentle reminder: sharing the request below again।", "एक polite follow-up लिखें।", "Follow-up कब भेजें?", ["2–3 दिन बाद विनम्रता से", "तुरंत गुस्से में", "कभी नहीं", "हर घंटे"], 0, "विनम्र reminder 2–3 दिन बाद।"),
      ]),
      M("Etiquette / शिष्टाचार", "Privacy और professional behaviour।", [
        T("CC, BCC & Privacy", "CC सबको दिखता है, BCC छिपा रहता है; संवेदनशील जानकारी BCC में या अलग भेजें।", "बड़े group को BCC में mail।", "एक mail CC और BCC के साथ तैयार करें।", "छिपी हुई copy कौन-सा है?", ["BCC", "CC", "To", "Subject"], 0, "BCC छिपी copy है।"),
        T("Timely & Clear Replies", "समय पर जवाब दें; पूरी बात लिखें, भाव साफ़ रखें, और reply करने से पहले 'Reply All' जरूरी है या नहीं सोचें।", "'Received, will share by 5 PM today.'", "एक short confirmation reply लिखें।", "अच्छे reply की खास बात?", ["समय पर और साफ़", "देर से और अस्पष्ट", "सिर्फ emoji", "बिना subject"], 0, "समय पर साफ़ reply पेशेवर है।"),
      ]),
    ],
    glossary: [["CC", "सीसी", "जानकारी के लिए भेजा व्यक्ति।"], ["BCC", "बीसीसी", "छिपी हुई copy।"], ["Signature", "हस्ताक्षर", "Mail के नीचे नाम-पद।"]],
    facts: ["एक साफ़ subject और छोटा body सबसे जल्दी जवाब दिलाता है।"],
    mastery: [["पूरी team को जवाब?", ["Reply All", "Reply", "Forward", "Delete"], 0, "Reply All सबको भेजता है।"], ["CAPS का मतलब?", ["चिल्लाना", "विनम्रता", "औपचारिकता", "गोपनीयता"], 0, "CAPS चिल्लाने जैसा लगता है।"]],
  },

  "Google Workspace": {
    tagline: "Drive, Docs, Sheets, Slides और Forms — cloud में collaborate और files सुरक्षित साझा करना।",
    modules: [
      M("Drive & Sharing / ड्राइव", "Cloud storage और rights।", [
        T("Drive Basics", "Drive cloud में files रखता है, हर device पर उपलब्ध; folder बनाकर organise करें, जरूरी files star करें।", "Photos, Docs, Office folders।", "Drive में 3 folders बनाकर files रखें।", "Google Drive क्या है?", ["Cloud storage", "Printer", "Antivirus", "Browser"], 0, "Drive cloud storage है।"),
        T("Sharing Rights", "Viewer (देखें), Commenter (टिप्पणी), Editor (बदलें) — बाहर भेजने से पहले link access जाँचें।", "Report किसी को Editor, बाकी Viewer।", "एक file Viewer के रूप में share करें।", "बदलाव करने देने वाला right?", ["Editor", "Viewer", "Commenter", "Owner-only"], 0, "Editor बदल सकता है।"),
      ]),
      M("Docs & Sheets / डॉक्स-शीट्स", "Online document और spreadsheet।", [
        T("Google Docs", "Docs में सब online लिखते-सुधारते हैं, बदलाव auto-save; Suggesting mode से सुझाव साफ़।", "टीम एक report पर साथ काम करे।", "Doc बनाकर किसी को Suggesting में बुलाएँ।", "Docs में बदलाव कब save होते हैं?", ["अपने-आप", "कभी नहीं", "सिर्फ Ctrl+S से", "print पर"], 0, "Docs auto-save करता है।"),
        T("Google Sheets", "Sheets में formulas, charts और real-time collaboration; कई लोग एक sheet साथ भर सकते हैं।", "टीम attendance sheet साथ भरे।", "Sheet बनाकर total formula लगाएँ।", "Sheets में क्या होता है?", ["Formulas और charts", "सिर्फ image", "सिर्फ video", "कुछ नहीं"], 0, "Sheets spreadsheet है।"),
      ]),
      M("Slides, Forms & Collab / स्लाइड-फ़ॉर्म", "Presentation, forms और comment।", [
        T("Slides & Forms", "Slides online presentation बनाता है; Forms का data अपने-आप Sheet में आता है।", "Feedback Form → response Sheet।", "छोटा Form बनाकर 3 responses देखें।", "Forms का response कहाँ जाता है?", ["Sheet में", "प्रिंटर में", "Inbox में", "कहीं नहीं"], 0, "Responses Sheet में जमा होते हैं।"),
        T("Comments & Version", "Comment से सुझाव दें, Resolve से बंद करें; Version history से पुराना रूप वापस।", "गलती पर पुराना version restore।", "Doc की version history देखें।", "पुराना रूप वापस लाने का tool?", ["Version history", "Comment", "Share", "Print"], 0, "Version history से restore होता है।"),
      ]),
      M("Productivity / उत्पादकता", "Templates और mobile।", [
        T("Templates & Add-ons", "Docs/Sheets/Slides में तैयार template चुनकर शुरुआत करें; जरूरत पर add-on से काम आसान।", "Resume template से CV।", "एक template से document बनाएँ।", "Template का फायदा?", ["तैयार layout", "ज्यादा रंग", "भारी file", "कुछ नहीं"], 0, "Template तैयार layout देता है।"),
        T("Mobile & Offline", "Workspace apps mobile पर भी चलते हैं; offline में भी बदलाव बाद में sync हो जाते हैं।", "Phone पर Doc में edit।", "मोबाइल पर एक Doc खोलकर edit करें।", "Offline बदलाव का क्या होता है?", ["बाद में sync", "गायब", "प्रिंट", "कुछ नहीं"], 0, "Offline बदलाव बाद में sync होते हैं।"),
      ]),
    ],
    glossary: [["Cloud", "क्लाउड", "इंटरनेट पर files की जगह।"], ["Viewer/Editor", "दर्शक/संपादक", "देखने-बदलने के अधिकार।"], ["Version history", "संस्करण इतिहास", "File के पुराने रूप।"]],
    facts: ["Google Workspace में बदलाव auto-save होते हैं, इसलिए 'save' दबाने की जरूरत नहीं।"],
    mastery: [["बदलाव करने देने वाला right?", ["Editor", "Viewer", "Commenter", "Owner-only"], 0, "Editor बदल सकता है।"], ["Forms response कहाँ?", ["Sheet में", "प्रिंटर में", "Inbox में", "कहीं नहीं"], 0, "Response Sheet में जाता है।"]],
  },

  "Files & Document Management": {
    tagline: "Files, folders, naming, backup, cloud और sharing — documents कभी न खोएँ और जल्दी मिलें।",
    modules: [
      M("File Basics / बुनियाद", "File, extension, create/rename।", [
        T("File & Extension", "हर file का extension (.docx, .pdf, .jpg) उसका प्रकार बताता है; सही app से खोलें।", ".xlsx Excel, .pdf document, .jpg image।", "5 files के extension पहचानें।", ".pdf किस प्रकार की file है?", ["Document", "Image", "Audio", "Video"], 0, ".pdf document है।"),
        T("Create, Rename & Delete", "File बनाएँ, नाम बदलें, जरूरत न हो तो Recycle Bin में delete करें; नाम में तारीख रखें।", "2026-03-05_Quotation_Sharma.pdf", "तीन files को तारीख वाले नाम से rename करें।", "नाम में तारीख रखने का फायदा?", ["क्रम बना रहता है", "file छोटी", "रंग बदलता", "password लगता"], 0, "तारीख से sorting आसान होती है।"),
      ]),
      M("Organisation / व्यवस्था", "Folder structure और search।", [
        T("Folder Structure", "काम के हिसाब से folders बनाएँ और हर file सही जगह रखें; उथला ढाँचा ढूँढना आसान रखता है।", "Work > 2026 > Invoices।", "अपने documents के 3 folders बनाएँ।", "Folders किस आधार पर बनाएँ?", ["काम के हिसाब से", "रंग के हिसाब से", "random", "size से"], 0, "काम-आधारित folders मिलते आसान हैं।"),
        T("Search & Shortcuts", "Search box में नाम/extension लिखकर file मिलती है; common shortcuts से काम तेज़।", "search: *.pdf", "Search से एक पुरानी file खोजें।", "किसी भी PDF को खोजने का pattern?", ["*.pdf", "#pdf", "@pdf", "pdf#"], 0, "*.pdf सभी PDF दिखाता है।"),
      ]),
      M("Backup & Sharing / बैकअप और साझा", "Backup, cloud, compress।", [
        T("Backup Basics", "जरूरी files की दो जगह copy रखें (local + cloud/pen drive); नियमित backup data loss रोकता है।", "महीने के अंत में Drive पर copy।", "एक folder का backup बनाएँ।", "Backup क्यों जरूरी?", ["Data loss रोकता है", "file सजाता", "रंग बदलता", "password देता"], 0, "Backup data loss रोकता है।"),
        T("Cloud & Sharing", "Cloud पर file रखने से कहीं से मिलती है; share करते समय सिर्फ जरूरी लोगों को access दें।", "Drive link से document भेजना।", "एक file cloud पर रखकर link share करें।", "Share करते समय क्या ध्यान रखें?", ["सिर्फ जरूरी लोगों को access", "सबको editor", "public link", "बिना जाँच"], 0, "सीमित access सुरक्षित रहता है।"),
      ]),
      M("Records & Recovery / रिकॉर्ड", "Organise, recover, compress।", [
        T("Naming & Records", "एक जैसी naming rule (तारीख_प्रकार_नाम) अपनाएँ; रिकॉर्ड समय पर folder में लगाएँ।", "2026-03_Salary_Sheet.xlsx", "एक महीने के records सही नाम से रखें।", "अच्छी naming rule का फायदा?", ["जल्दी मिलती है", "file छोटी", "रंग बदलता", "कुछ नहीं"], 0, "एक जैसी naming से files मिलती आसान हैं।"),
        T("Recover & Compress", "गलती से delete हुई file Recycle Bin से वापस आती है; बड़ी files zip करके छोटी और सुरक्षित भेजें।", "Recycle Bin > Restore; right-click > Send to > Compressed folder।", "एक folder zip करके size देखें।", "गलती से delete हुई file कहाँ से वापस?", ["Recycle Bin", "Inbox", "Printer", "Desktop"], 0, "Recycle Bin से restore होती है।"),
      ]),
    ],
    glossary: [["Extension", "एक्सटेंशन", "File का प्रकार बताने वाला अंत (.pdf)।"], ["Backup", "बैकअप", "File की अतिरिक्त copy।"], ["Cloud", "क्लाउड", "इंटरनेट पर storage।"]],
    facts: ["'3-2-1' backup नियम: 3 copies, 2 जगह, 1 अलग स्थान पर — data लगभग कभी नहीं खोता।"],
    mastery: [[".pdf किस प्रकार की file?", ["Document", "Image", "Audio", "Video"], 0, ".pdf document है।"], ["गलती से delete हुई file कहाँ से वापस?", ["Recycle Bin", "Inbox", "Printer", "Desktop"], 0, "Recycle Bin से restore होती है।"]],
  },

  "Printing & Scanning": {
    tagline: "Print, scan, PDF, OCR और print settings — कागज़ और digital documents को साफ़ और सुरक्षित संभालें।",
    modules: [
      M("Printing / प्रिंटिंग", "Print settings और quality।", [
        T("Print Basics", "Ctrl+P से print; copies, pages, colour और paper size चुनें; Print Preview से layout जाँचें।", "Pages 1–2, 2 copies, black & white।", "एक document के 2 pages का preview देखें।", "Print का shortcut?", ["Ctrl+P", "Ctrl+S", "Ctrl+F", "Ctrl+Z"], 0, "Ctrl+P print करता है।"),
        T("Quality & Cost", "Draft mode से ink बचता है, जरूरी documents पर Normal/Best; दोनों तरफ (duplex) print कागज़ बचाता है।", "Draft mode से rough copy।", "एक document duplex में print करें।", "कागज़ बचाने का तरीका?", ["Duplex (दोनों तरफ)", "सिर्फ एक तरफ", "रंगीन", "Best quality"], 0, "Duplex कागज़ बचाता है।"),
      ]),
      M("Scanning / स्कैनिंग", "Scan करना और save करना।", [
        T("Scan Basics", "Scanner पर document रखें, DPI/resolution चुनें (text के लिए 300 DPI काफ़ी), scan करके PDF/JPEG में save करें।", "Marksheet को 300 DPI PDF में scan।", "एक document scan करके PDF बनाएँ।", "Text scan के लिए ठीक DPI?", ["300 DPI", "10 DPI", "5000 DPI", "DPI मायने नहीं रखता"], 0, "300 DPI text के लिए साफ़ है।"),
        T("Multiple Pages & Files", "कई pages scan करके एक PDF बनाएँ; गलत क्रम सुधारें और नाम साफ़ रखें।", "5-page form को एक PDF में scan।", "दो pages एक PDF में scan करें।", "कई scanned pages एक file में रखने के लिए?", ["एक PDF बनाएँ", "अलग files", "JPEG सूची", "प्रिंट करें"], 0, "एक PDF pages को साथ रखता है।"),
      ]),
      M("PDF & OCR / पीडीएफ और ओसीआर", "Digital text और storage।", [
        T("OCR Basics", "OCR scan की image से पढ़ने/खोजने योग्य text बनाता है, जिससे typed form में copy किया जा सके।", "पुराने letter का scan OCR से text।", "एक scan पर OCR चलाकर text निकालें।", "OCR क्या करता है?", ["Image से text निकालता है", "प्रिंट करता है", "रंग बदलता", "file delete"], 0, "OCR image से text निकालता है।"),
        T("Storage & Naming", "Scanned files को तारीख+प्रकार वाले नाम से सही folder में रखें और backup लें।", "2026-02_Aadhaar_Scan.pdf", "एक scan को सही नाम-फ़ोल्डर में रखें।", "Scanned file कैसे रखें?", ["तारीख+नाम, सही folder", "random नाम", "Desktop पर", "बिना नाम"], 0, "साफ़ नाम-folder से मिलती आसान है।"),
      ]),
      M("Troubleshooting / समस्या समाधान", "Common printer/scanner issues।", [
        T("Print Problems", "प्रिंट न हो तो paper, ink, connection और default printer जाँचें; queue में रुका job cancel करें।", "Printer offline → cable/WiFi जाँचें।", "एक रुका print job cancel करें।", "प्रिंट न हो तो पहले क्या देखें?", ["Paper, ink, connection", "रंग", "font", "chart"], 0, "बुनियादी कारण पहले जाँचें।"),
        T("Scan Problems", "Scan खाली/काला आए तो glass साफ़ करें, document सही रखें और resolution बदलें।", "धुंधला scan → glass साफ़ करें।", "scanner glass साफ़ करके दोबारा scan करें।", "धुंधले scan का एक कारण?", ["गंदा glass", "DPI", "रंग", "नाम"], 0, "गंदा glass धुंधला scan देता है।"),
      ]),
    ],
    glossary: [["DPI", "डीपीआई", "Scan/print की स्पष्टता।"], ["OCR", "ओसीआर", "Image से text निकालना।"], ["Duplex", "डुप्लेक्स", "दोनों तरफ print।"]],
    facts: ["300 DPI text scan और 150 DPI photo scan ज्यादातर काम के लिए काफ़ी है।"],
    mastery: [["Print shortcut?", ["Ctrl+P", "Ctrl+S", "Ctrl+F", "Ctrl+Z"], 0, "Ctrl+P print करता है।"], ["OCR क्या करता है?", ["Image से text निकालता है", "प्रिंट करता है", "रंग बदलता", "file delete"], 0, "OCR image से text निकालता है।"]],
  },

  "Office Data & Records": {
    tagline: "Attendance, salary, expenses, invoice, stock और records को organised और accurate रखना।",
    modules: [
      M("Attendance & Salary / उपस्थिति-वेतन", "रोज़ का record और salary गणना।", [
        T("Attendance Register", "तारीख-वार present/absent/leave साफ़ भरें; महीने के अंत में total दिन निकलें।", "Date | Name | Status | Days।", "एक हफ्ते का attendance register बनाएँ।", "Attendance register में क्या जरूरी?", ["तारीख और status", "रंग", "chart", "logo"], 0, "तारीख + status से हिसाब साफ़ रहता है।"),
        T("Salary Calculation", "Present दिन × daily rate = salary; overtime और deduction अलग column में रखें।", "=PresentDays*DailyRate", "एक कर्मचारी की monthly salary निकालें।", "Salary निकालने का आधार?", ["Present दिन × rate", "रंग", "font", "logo"], 0, "Present दिन × rate से salary बनती है।"),
      ]),
      M("Expenses & Invoice / खर्च और बिल", "खर्च और invoice।", [
        T("Expense Record", "हर खर्च की तारीख, मद, रकम और bill number लिखें; महीने का total निकालें।", "Date | Item | Amount | Bill No।", "एक हफ्ते का खर्च record करें।", "खर्च record में क्या जरूरी?", ["तारीख, मद, रकम", "रंग", "chart", "logo"], 0, "तारीख-मद-रकम से हिसाब मिलता है।"),
        T("Invoice Basics", "Invoice में seller, buyer, items, rate, tax, total और invoice number रहते हैं।", "Item | Qty | Rate | Amount; नीचे Total।", "एक छोटा invoice बनाएँ।", "Invoice में क्या जरूरी?", ["Invoice number", "रंग", "font", "logo"], 0, "Invoice number से हिसाब मिलता है।"),
      ]),
      M("Stock & Records / स्टॉक और रिकॉर्ड", "Stock और file records।", [
        T("Stock Register", "खुला stock + आया − गया = बचा stock; हर entry तारीख सहित लिखें।", "Opening + In − Out = Closing।", "एक item का stock register बनाएँ।", "Stock का सही सूत्र?", ["Opening + In − Out", "Opening × Out", "In + Out", "Opening − In"], 0, "Opening + In − Out = Closing।"),
        T("Records & Filing", "रिकॉर्ड को तारीख/प्रकार से folder में रखें और backup लें; जरूरत पर तुरंत मिलें।", "2026 > Salary > March", "एक महीने के records सही folder में रखें।", "Records कैसे रखें?", ["तारीख/प्रकार से folder में", "random", "Desktop पर", "बिना नाम"], 0, "तारीख/प्रकार से folder में रखने पर मिलते आसान हैं।"),
      ]),
      M("Accuracy & Review / शुद्धता", "Checking और reconciliation।", [
        T("Cross-check", "Total और detail मिलाकर जाँचें (reconcile); छोटा अंतर भी पकड़ें और सही करें।", "Total = sum of all entries जाँचें।", "एक महीने का total detail से मिलाएँ।", "Reconcile का मतलब?", ["Total और detail मिलाना", "रंग बदलना", "print करना", "file delete"], 0, "Reconcile total-detail मिलाना है।"),
        T("Monthly Summary", "महीने के अंत में सारे records से summary बनाएँ — total income, expense, balance; अगले महीने से तुलना करें।", "Income − Expense = Balance।", "एक महीने का summary बनाएँ।", "Balance का सूत्र?", ["Income − Expense", "Income + Expense", "Expense × 2", "Income × Expense"], 0, "Income − Expense = Balance।"),
      ]),
    ],
    glossary: [["Reconcile", "मिलान", "Total और detail मिलाना।"], ["Invoice", "बिल", "बिक्री/सेवा का दस्तावेज़।"], ["Stock", "स्टॉक", "सामान की उपलब्ध मात्रा।"]],
    facts: ["तारीख-वार record रखने से सालाना हिसाब और audit बहुत आसान हो जाता है।"],
    mastery: [["Stock का सही सूत्र?", ["Opening + In − Out", "Opening × Out", "In + Out", "Opening − In"], 0, "Opening + In − Out = Closing।"], ["Balance का सूत्र?", ["Income − Expense", "Income + Expense", "Expense × 2", "Income × Expense"], 0, "Income − Expense = Balance।"]],
  },

  "Data Analysis & Reporting": {
    tagline: "Data को साफ़ करना, charts, pivot tables और MIS reports से decision-ready जानकारी बनाना।",
    modules: [
      M("Data Preparation / डेटा तैयारी", "साफ़ और भरोसेमंद data।", [
        T("Clean & Validate", "Duplicate हटाएँ, खाली cells भरें, spelling/format एक जैसा करें; गलत data से गलत नतीजा आता है।", "Remove Duplicates, TRIM से extra space हटाना।", "एक data से duplicate हटाएँ।", "गलत data का नतीजा?", ["गलत conclusion", "सही conclusion", "रंग बदलना", "file छोटी"], 0, "गलत data गलत conclusion देता है।"),
        T("Summarise", "SUM, AVERAGE, COUNTIF से totals और counts निकालें — जैसे कितने orders pending हैं।", '=COUNTIF(C2:C100,"Pending")', "एक data में pending items गिनें।", "शर्त-आधारित गिनती का function?", ["COUNTIF", "SUM", "AVERAGE", "MAX"], 0, "COUNTIF शर्त पर गिनता है।"),
      ]),
      M("Analysis / विश्लेषण", "Trend और तुलना।", [
        T("Trends", "महीने-वार बदलाव देखकर trend पहचानें — बढ़त, गिरावट या मौसमी बदलाव।", "Line chart में 6 महीने की बिक्री।", "एक 6-महीने का trend chart बनाएँ।", "Trend दिखाने का सही chart?", ["Line", "Pie", "Scatter", "Area"], 0, "Line chart trend दिखाता है।"),
        T("Compare & Rank", "Top/Bottom performers निकालें और % share देखें ताकि focus सही जगह हो।", "=LARGE(range,1) सबसे बड़ा मान।", "Top 5 items निकालें।", "Top value निकालने का function?", ["LARGE", "SMALL", "SUM", "AVERAGE"], 0, "LARGE सबसे बड़ा मान देता है।"),
      ]),
      M("Reporting / रिपोर्टिंग", "MIS और dashboard।", [
        T("MIS Report", "MIS report में period, key numbers, comparison और exceptions रहते हैं; साफ़ heading और तारीख डालें।", "Monthly MIS: Sales, Expense, Profit, Pending।", "एक page का MIS report बनाएँ।", "MIS report में क्या जरूरी?", ["Period और key numbers", "रंग", "logo", "chart"], 0, "Period + key numbers से MIS बनता है।"),
        T("Dashboard & Charts", "Pivot + charts से dashboard बनाएँ; सबसे जरूरी KPI ऊपर रखें और जरूरत पर drill-down दें।", "KPI cards + trend chart।", "एक छोटा dashboard बनाएँ।", "Dashboard में सबसे ऊपर क्या?", ["सबसे जरूरी KPI", "raw data", "रंग", "logo"], 0, "KPI ऊपर रखें।"),
      ]),
      M("Insight & Ethics / निष्कर्ष", "Insight और ईमानदारी।", [
        T("From Data to Insight", "Numbers से आगे जाकर 'क्यों' और 'क्या करें' लिखें — यही report को उपयोगी बनाता है।", "'Sales गिरी क्योंकि X region बंद रहा।'", "एक number से एक insight लिखें।", "Insight में क्या हो?", ["कारण और सुझाव", "सिर्फ number", "रंग", "logo"], 0, "Insight कारण-सुझाव देता है।"),
        T("Accuracy & Privacy", "Report भेजने से पहले number जाँचें; व्यक्तिगत/गोपनीय data सिर्फ जरूरी लोगों से साझा करें।", "Aggregate data share, individual नहीं।", "एक report से निजी जानकारी हटाएँ।", "गोपनीय data किससे साझा करें?", ["सिर्फ जरूरी लोगों से", "सबसे", "public link", "किसी से नहीं"], 0, "सीमित लोगों से साझा करें।"),
      ]),
    ],
    glossary: [["MIS", "एमआईएस", "Management Information System report।"], ["KPI", "केपीआई", "मुख्य प्रदर्शन संकेतक।"], ["Insight", "निष्कर्ष", "Data से निकला अर्थ/सुझाव।"]],
    facts: ["एक अच्छी report numbers के साथ कारण और अगला कदम भी बताती है।"],
    mastery: [["शर्त-आधारित गिनती का function?", ["COUNTIF", "SUM", "AVERAGE", "MAX"], 0, "COUNTIF शर्त पर गिनता है।"], ["Top value निकालने का function?", ["LARGE", "SMALL", "SUM", "AVERAGE"], 0, "LARGE सबसे बड़ा मान देता है।"]],
  },

  "AI for Office Work": {
    tagline: "AI से Excel, Word, PowerPoint, PDF और email के रोज़ के office काम तेज़ करें — सुरक्षित और जिम्मेदार तरीके से।",
    modules: [
      M("AI Basics / एआई बुनियाद", "AI क्या कर सकता है, क्या नहीं।", [
        T("What AI Does Well", "AI draft लिखना, summarise करना, translate करना और idea देना अच्छा करता है; final जाँच इंसान की जिम्मेदारी है।", "AI से email draft बनवाना।", "AI से एक छोटा summary बनवाएँ।", "AI output के बाद क्या जरूरी?", ["इंसान द्वारा जाँच", "सीधे भेजना", "बिना पढ़े", "delete"], 0, "AI output की जाँच जरूरी है।"),
        T("Limits & Hallucination", "AI कभी गलत या बना हुआ तथ्य दे सकता है; numbers, नाम और नियम हमेशा verify करें।", "AI द्वारा बताया formula test करें।", "AI के एक तथ्य को verify करें।", "AI की सबसे बड़ी सावधानी?", ["गलत तथ्य दे सकता है", "बहुत धीमा", "महँगा", "कुछ नहीं"], 0, "AI गलत तथ्य दे सकता है, verify करें।"),
      ]),
      M("AI with Documents / दस्तावेज़", "Word, email, PDF।", [
        T("Writing & Summarising", "AI से letter/report का draft, summary या bullet points बनवाएँ; फिर अपने हिसाब से सुधारें।", "'Summarise this in 5 bullets' prompt।", "एक paragraph का AI summary बनवाएँ।", "AI से summary लेने के बाद?", ["अपने हिसाब से सुधारें", "सीधे भेजें", "बिना पढ़े", "delete"], 0, "Draft को सुधारना जरूरी है।"),
        T("Translate & Tone", "AI से हिंदी↔अंग्रेज़ी translation और tone (औपचारिक/सरल) बदलवाएँ; स्थानीय अर्थ जाँचें।", "'Make this email polite and short'।", "एक email का tone बदलवाएँ।", "AI translation के बाद क्या करें?", ["अर्थ जाँचें", "सीधे भेजें", "delete", "print"], 0, "Translation का अर्थ जाँचें।"),
      ]),
      M("AI with Data / डेटा", "Excel और analysis में मदद।", [
        T("Formulas & Explanation", "AI से Excel formula का सुझाव या समझ माँगें, पर formula को अपने data पर test करें।", "'Formula for average if >40' prompt।", "AI से एक formula समझें और test करें।", "AI formula के बाद क्या?", ["अपने data पर test", "सीधे लगाएँ", "delete", "print"], 0, "Formula test करना जरूरी है।"),
        T("Data Insights", "AI से data का pattern/insight पूछें, पर गोपनीय data AI में न डालें।", "'What trend do you see?' (सामान्य data)।", "एक सामान्य data पर AI insight लें।", "AI में कौन-सा data न डालें?", ["गोपनीय/निजी data", "सामान्य संख्या", "public info", "कोई भी"], 0, "गोपनीय data AI में न डालें।"),
      ]),
      M("Responsible Use / जिम्मेदार उपयोग", "Privacy और ईमानदारी।", [
        T("Privacy & Confidentiality", "ग्राहक का नाम, salary, ID, password या company का गोपनीय data AI tools में न डालें; जरूरत पर नाम हटाकर (anonymise) पूछें।", "नाम की जगह 'Employee A' लिखें।", "एक prompt से निजी जानकारी हटाएँ।", "AI prompt में क्या न डालें?", ["निजी/गोपनीय data", "सामान्य सवाल", "public info", "गणित"], 0, "निजी/गोपनीय data न डालें।"),
        T("Verify & Attribute", "AI से बनी सामग्री को तथ्य-जाँच के बाद ही भेजें; जहाँ जरूरी हो, AI की मदद का जिक्र करें और अपनी जिम्मेदारी लें।", "AI draft + आपकी जाँच = तैयार।", "एक AI draft को तथ्य-जाँच के साथ final करें।", "AI सामग्री भेजने से पहले?", ["तथ्य-जाँच", "सीधे भेजें", "delete", "print"], 0, "तथ्य-जाँच के बाद भेजें।"),
      ]),
    ],
    glossary: [["Prompt", "प्रॉम्प्ट", "AI को दिया गया निर्देश।"], ["Anonymise", "अनाम करना", "नाम/पहचान हटाना।"], ["Hallucination", "भ्रम", "AI का बनाया गलत तथ्य।"]],
    facts: ["AI सबसे अच्छा तब काम करता है जब prompt में काम, format और लंबाई साफ़ बताई जाए।"],
    mastery: [["AI output के बाद क्या जरूरी?", ["इंसान द्वारा जाँच", "सीधे भेजना", "बिना पढ़े", "delete"], 0, "AI output की जाँच जरूरी है।"], ["AI prompt में क्या न डालें?", ["निजी/गोपनीय data", "सामान्य सवाल", "public info", "गणित"], 0, "निजी/गोपनीय data न डालें।"]],
  },

  "Office Security & Privacy": {
    tagline: "Passwords, phishing, safe files, privacy, backup और recovery — office data और accounts सुरक्षित रखें।",
    modules: [
      M("Passwords & Accounts / पासवर्ड", "मजबूत पासवर्ड और login।", [
        T("Strong Passwords", "लंबा पासवर्ड (12+ अक्षर), अक्षर+अंक+चिह्न मिलाकर; हर account का अलग पासवर्ड और 2-step verification।", "Sun#River92Kite (काल्पनिक)।", "एक मजबूत passphrase बनाएँ।", "मजबूत पासवर्ड कैसा?", ["लंबा और मिला-जुला", "123456", "नाम", "जन्मतिथि"], 0, "लंबा, मिला-जुला पासवर्ड मजबूत है।"),
        T("Two-Factor Auth", "OTP या authenticator app से login पर दूसरी जाँच जोड़ें; OTP किसी को न बताएँ।", "Login के बाद phone पर OTP।", "एक account पर 2FA on करें।", "OTP किसे बताएँ?", ["किसी को नहीं", "कॉल करने वाले को", "मैसेज भेजने वाले को", "सबको"], 0, "OTP कभी साझा न करें।"),
      ]),
      M("Phishing & Scams / धोखाधड़ी", "संदिग्ध संदेश पहचानना।", [
        T("Recognise Phishing", "अनजान link, जल्दबाज़ी, धमकी, गलत भाषा और personal info की माँग phishing के संकेत हैं।", "'Account band ho jayega, यहाँ click करें'।", "एक संदिग्ध mail के 3 संकेत लिखें।", "Phishing का संकेत?", ["अनजान link और जल्दबाज़ी", "साफ़ भाषा", "known sender", "कोई link नहीं"], 0, "अनजान link + जल्दबाज़ी phishing है।"),
        T("Safe Response", "link पर click न करें, भेजने वाले की official website से जाँचें, संदिग्ध mail report/delete करें।", "Bank की official app से balance देखें।", "एक phishing mail report करें।", "संदिग्ध link मिलने पर?", ["click न करें, verify करें", "turant click", "OTP भेजें", "forward सबको"], 0, "Click न करके official source से verify करें।"),
      ]),
      M("Files & Privacy / फ़ाइल और गोपनीयता", "Safe files और sharing।", [
        T("Safe Files & Backup", "जरूरी files का नियमित backup रखें; antivirus update रखें और अनजान attachment/download से बचें।", "Weekly backup + updated antivirus।", "एक folder का backup शेड्यूल बनाएँ।", "अनजान attachment का क्या करें?", ["खोलें नहीं", "तुरंत खोलें", "forward करें", "print करें"], 0, "अनजान attachment न खोलें।"),
        T("Privacy & Sharing", "गोपनीय files पर password लगाएँ, सिर्फ जरूरी लोगों को access दें, public links से बचें।", "Password-protected PDF भेजें।", "एक file को password से सुरक्षित करें।", "गोपनीय file कैसे भेजें?", ["password-protected, सीमित लोगों को", "public link", "सबको", "बिना जाँच"], 0, "Password + सीमित access सुरक्षित है।"),
      ]),
      M("Recovery & Habits / सुधार और आदत", "Incident और अच्छी आदतें।", [
        T("If Compromised", "शक होते ही पासवर्ड बदलें, 2FA जाँचें, bank/IT को बताएँ और नुकसान रोकें।", "पासवर्ड बदलें + sessions logout।", "एक compromise checklist बनाएँ।", "खाता लीक होने पर पहला कदम?", ["पासवर्ड बदलें", "इंतज़ार करें", "सबको बताएँ", "कुछ न करें"], 0, "पहले पासवर्ड बदलें।"),
        T("Digital Hygiene", "screen lock, updated software, निजी काम के लिए अलग account और नियमित password बदलाव अपनाएँ।", "Office और personal account अलग।", "अपनी 5 सुरक्षा आदतें लिखें।", "अच्छी digital habit?", ["screen lock + update", "password साझा", "public WiFi पर bank", "बिना lock"], 0, "Lock + update सुरक्षित रखते हैं।"),
      ]),
    ],
    glossary: [["Phishing", "फ़िशिंग", "नकली संदेश से जानकारी चुराना।"], ["2FA", "टू-फ़ैक्टर", "दो-चरणीय login सुरक्षा।"], ["Backup", "बैकअप", "File की अतिरिक्त copy।"]],
    facts: ["लंबा passphrase + 2FA दो आदतें ज्यादातर account धोखाधड़ी रोक देती हैं।"],
    mastery: [["OTP किसे बताएँ?", ["किसी को नहीं", "कॉल करने वाले को", "मैसेज भेजने वाले को", "सबको"], 0, "OTP कभी साझा न करें।"], ["खाता लीक होने पर पहला कदम?", ["पासवर्ड बदलें", "इंतज़ार करें", "सबको बताएँ", "कुछ न करें"], 0, "पहले पासवर्ड बदलें।"]],
  },
};