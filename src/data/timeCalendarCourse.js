/**
 * Time & Calendar / समय एवं कैलेंडर — Master Course content.
 *
 * This is a full textbook-quality course (Zero Knowledge → Mastery), not a
 * heading/template. Each chapter is a lesson made of typed blocks so the
 * renderer can lay them out as cards instead of a text wall.
 *
 * Block types (see TimeCalendarCourse.jsx renderer):
 *   h        sub-heading
 *   p        paragraph
 *   ul/ol    lists
 *   flow     vertical arrow timeline
 *   table    { head, rows }
 *   note     { k: goal|concept|observe|tip|mistake|remember|real|career|info|warn, title, x, items }
 *   ex       worked example { title, x, steps }
 *   act      activity { title, x, items }
 *   ch       challenge { title, x, items }
 *   prac     practice { title, items }
 *   rev      revision { title, items }
 *   mistakes { items: [{ w, c }] }
 */

export const TIME_CALENDAR_COURSE = {
  meta: {
    icon: "🕐",
    level: "Beginner → Practical → Mastery",
    tag: "Everyday Skills",
    tagline: "समय को समझना, घड़ी पढ़ना, कैलेंडर चलाना और समय का सही उपयोग करना।",
    heroSubtitle:
      "Zero knowledge से शुरू करके घड़ी पढ़ना, समय की गणना, कैलेंडर, time zones और समय-प्रबंधन तक — एक expert teacher की तरह step-by-step।",
  },

  overview: {
    what: "Time, change को मापने का तरीका है — कोई घटना कब हुई, कितनी देर चली और किस क्रम में हुई। Calendar दिनों को weeks, months और years में व्यवस्थित करता है।",
    why: "समय की समझ से हम समय पर पहुँचते हैं, काम plan करते हैं, दूसरों के समय का सम्मान करते हैं और मौसम, इतिहास तथा भविष्य को समझते हैं।",
    where: "School timetable, bus/train timings, office hours, त्योहार, जन्मदिन, खेती के मौसम और हर घड़ी — दीवार पर या फ़ोन में।",
    outcome: "Learner कोई भी घड़ी पढ़ सकेगा, समय की इकाइयाँ बदल सकेगा, calendar चला सकेगा, duration निकाल सकेगा, schedule plan कर सकेगा और उम्र निकाल सकेगा।",
  },

  courseStart: {
    title: "चलो समय को समझते हैं",
    blocks: [
      { t: "p", x: "सुबह जब तुम उठते हो, तो शायद घड़ी देखकर कहते हो: “अभी 7 बजे हैं।”" },
      { t: "p", x: "स्कूल जाने से पहले तुम कहते हो: “मुझे 8 बजे तक तैयार होना है।”" },
      { t: "p", x: "अगर स्कूल 8:30 बजे शुरू होता है और तुम 8:15 बजे पहुँचते हो, तो तुम जानते हो कि तुम्हारे पास अभी कुछ मिनट बचे हैं।" },
      { t: "p", x: "शाम को तुम कहते हो: “मैंने 1 घंटे पढ़ाई की।”" },
      { t: "p", x: "यह चार अलग-अलग बातें हैं, लेकिन इन सभी में एक ही चीज काम कर रही है — समय (Time)।" },
      { t: "p", x: "समय हमें यह समझने में मदद करता है: कब? → कितनी देर? → पहले क्या हुआ? → बाद में क्या होगा?" },
      { t: "note", k: "goal", title: "इस course का आधार", x: "यही इस पूरे course का आधार है — समय को पहचानना, मापना, गिनना और सही उपयोग करना।" },
    ],
  },

  modules: [
    {
      id: "m1", title: "समय की नींव", titleHi: "Foundations of Time", icon: "🌅",
      chapters: [
        {
          id: "c1", number: 1, title: "समय क्या है?", titleHi: "What is Time?", icon: "⏳",
          blocks: [
            { t: "h", x: "1.1 समय केवल घड़ी की संख्या नहीं है" },
            { t: "p", x: "घड़ी हमें समय बताने का एक तरीका देती है, लेकिन समय स्वयं केवल घड़ी नहीं है। जब कोई घटना होती है, तो हम जानना चाहते हैं:" },
            { t: "ul", items: ["घटना कब हुई?", "उससे पहले क्या हुआ?", "उसके बाद क्या हुआ?", "घटना कितनी देर चली?"] },
            { t: "p", x: "उदाहरण —" },
            { t: "flow", items: ["7:00 — उठना", "7:30 — नाश्ता", "8:00 — घर से निकलना", "8:30 — स्कूल पहुँचना"] },
            { t: "p", x: "यह एक समय-क्रम (sequence) है। इससे हम घटनाओं को सही क्रम में समझ सकते हैं।" },
            { t: "note", k: "remember", x: "समय घटनाओं को क्रम में रखने और उनकी अवधि समझने में हमारी मदद करता है।" },

            { t: "h", x: "1.2 पहले, बाद में और बीच में" },
            { t: "p", x: "मान लो:" },
            { t: "flow", items: ["सुबह 6:30 — उठना", "सुबह 7:00 — नहाना", "सुबह 7:30 — नाश्ता"] },
            { t: "p", x: "अब बताओ:" },
            { t: "ul", items: ["सबसे पहले क्या हुआ? → उठना", "उसके बाद क्या हुआ? → नहाना", "सबसे बाद में क्या हुआ? → नाश्ता", "नहाने और नाश्ते के बीच क्या हुआ? → 7:00 से 7:30 का समय"] },
            { t: "note", k: "tip", x: "यह बहुत छोटी बात लगती है, लेकिन यही skill आगे timetable और duration problems में काम आएगी।" },

            { t: "h", x: "1.3 Past, Present और Future" },
            { t: "note", k: "info", title: "🔙 Past / भूतकाल", x: "जो हो चुका है। उदाहरण: “मैं कल बाजार गया था।”" },
            { t: "note", k: "info", title: "🟢 Present / वर्तमान", x: "जो अभी हो रहा है। उदाहरण: “मैं अभी पढ़ रहा हूँ।”" },
            { t: "note", k: "info", title: "🔜 Future / भविष्य", x: "जो आगे होने वाला है। उदाहरण: “मैं शाम को खेलूँगा।”" },
            { t: "note", k: "concept", title: "🧠 सोचो", x: "अगर आज मंगलवार है: सोमवार → Past, मंगलवार → Present, बुधवार → Future।" },

            { t: "h", x: "1.4 दिन और रात" },
            { t: "p", x: "पृथ्वी के घूमने के कारण हमें दिन और रात का अनुभव होता है। सूर्य का प्रकाश मिलने वाले समय में दिन और अंधकार वाले समय में रात दिखाई देती है।" },
            { t: "p", x: "हम दिन को आगे छोटे समयों में भी बाँटते हैं:" },
            { t: "ul", items: ["🌅 Morning — सुबह", "☀️ Afternoon — दोपहर", "🌇 Evening — शाम", "🌙 Night — रात"] },
            { t: "note", k: "tip", x: "इन शब्दों को घड़ी पढ़ते समय AM/PM के साथ समझना बहुत उपयोगी होगा।" },

            { t: "act", title: "अपना दिन क्रम में लगाओ", x: "इन घटनाओं को सही क्रम में लगाओ: सोना, स्कूल जाना, उठना, नाश्ता, घर लौटना।", items: ["एक सम्भावित क्रम: उठना → नाश्ता → स्कूल जाना → घर लौटना → सोना", "अब अपने वास्तविक दिन का क्रम बनाओ।"] },
          ],
        },
      ],
    },

    {
      id: "m2", title: "समय की इकाइयाँ", titleHi: "Units of Time", icon: "📏",
      chapters: [
        {
          id: "c2", number: 2, title: "समय की इकाइयाँ", titleHi: "Units of Time", icon: "📏",
          blocks: [
            { t: "p", x: "समय को अलग-अलग units में मापा जाता है। मुख्य क्रम:" },
            { t: "flow", items: ["Second → Minute → Hour → Day → Week → Month → Year"] },

            { t: "h", x: "2.1 Second / सेकंड" },
            { t: "p", x: "Second बहुत छोटी समय-इकाई है। Stopwatch में दौड़ का समय अक्सर seconds में मापा जाता है। उदाहरण: यदि कोई दौड़ पूरी करने में 12 seconds लेता है, तो उसकी duration 12 seconds है।" },

            { t: "h", x: "2.2 Minute / मिनट" },
            { t: "p", x: "60 seconds = 1 minute" },
            { t: "table", head: ["कथन", "गणना"], rows: [["1 minute", "60 seconds"], ["2 minutes", "120 seconds"], ["5 minutes", "300 seconds (5 × 60)"]] },

            { t: "h", x: "2.3 Hour / घंटा" },
            { t: "p", x: "60 minutes = 1 hour" },
            { t: "table", head: ["कथन", "मान"], rows: [["2 hours", "120 minutes"], ["3 hours", "180 minutes"]] },
            { t: "note", k: "remember", title: "🔢 नियम", x: "Hours → Minutes = × 60 · Minutes → Hours = ÷ 60 (जब संख्या पूरी divisible हो)। उदाहरण: 120 ÷ 60 = 2 hours।" },

            { t: "h", x: "2.4 Day / दिन" },
            { t: "p", x: "1 day = 24 hours" },
            { t: "table", head: ["कथन", "मान"], rows: [["2 days", "48 hours"], ["3 days", "72 hours"]] },

            { t: "h", x: "2.5 Week / सप्ताह" },
            { t: "p", x: "1 week = 7 days" },
            { t: "ol", items: ["Monday — सोमवार", "Tuesday — मंगलवार", "Wednesday — बुधवार", "Thursday — गुरुवार", "Friday — शुक्रवार", "Saturday — शनिवार", "Sunday — रविवार"] },
            { t: "note", k: "concept", title: "🧠 Memory Practice", x: "Monday के बाद? Tuesday · Friday के बाद? Saturday · Sunday के बाद? Monday।" },

            { t: "h", x: "2.6 Month / महीना" },
            { t: "p", x: "एक year में 12 months होते हैं:" },
            { t: "ol", items: ["January — जनवरी", "February — फरवरी", "March — मार्च", "April — अप्रैल", "May — मई", "June — जून", "July — जुलाई", "August — अगस्त", "September — सितंबर", "October — अक्टूबर", "November — नवंबर", "December — दिसंबर"] },
            { t: "table", head: ["दिनों की संख्या", "महीने"], rows: [["31 days", "January, March, May, July, August, October, December"], ["30 days", "April, June, September, November"], ["28 / 29", "February (सामान्य / Leap Year)"]] },
          ],
        },
        {
          id: "c3", number: 3, title: "Leap Year", titleHi: "Leap Year", icon: "🧠",
          blocks: [
            { t: "p", x: "Leap Year वह वर्ष है जिसमें February में 29 days होते हैं। सामान्यतः: वर्ष 4 से divisible हो → Leap Year होने की सम्भावना। लेकिन century years में विशेष नियम होता है:" },
            { t: "note", k: "remember", title: "⭐ याद रखने का नियम", x: "÷4 → generally leap · ÷100 → exception · ÷400 → leap" },
            { t: "table", head: ["वर्ष", "Leap?", "कारण"], rows: [["2024", "✅ हाँ", "2024 ÷ 4 पूरा जाता है"], ["1900", "❌ नहीं", "100 से divisible, पर 400 से नहीं"], ["2000", "✅ हाँ", "2000 ÷ 400 पूरा जाता है"]] },
            { t: "note", k: "tip", x: "Shortcut: साल के आख़िरी दो अंक 4 से divisible हों (और century न हो) तो leap year। Century year हो तो 400 से जाँचो।" },
          ],
        },
      ],
    },

    {
      id: "m3", title: "घड़ी पढ़ना", titleHi: "Reading a Clock", icon: "🕐",
      chapters: [
        {
          id: "c4", number: 4, title: "घड़ी को पढ़ना", titleHi: "Reading a Clock", icon: "🕐",
          blocks: [
            { t: "p", x: "अब हम वास्तविक clock reading सीखेंगे। एक analog clock में सामान्यतः तीन hands होते हैं:" },
            { t: "ul", items: ["🕐 Hour hand / घंटे की सुई — छोटी", "🕑 Minute hand / मिनट की सुई — सामान्यतः लंबी", "🕒 Second hand / सेकंड की सुई — सबसे तेज चलती है"] },

            { t: "h", x: "4.1 Clock के 12 numbers" },
            { t: "p", x: "Clock face पर: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12। Minute hand हर number पर जाने में 5 minutes लेती है।" },
            { t: "table", head: ["Number", "Minutes"], rows: [["12", "00"], ["1", "05"], ["2", "10"], ["3", "15"], ["4", "20"], ["5", "25"], ["6", "30"], ["7", "35"], ["8", "40"], ["9", "45"], ["10", "50"], ["11", "55"]] },
            { t: "note", k: "remember", title: "⭐ बहुत जरूरी", x: "Clock number × 5 = minutes। उदाहरण: Minute hand 8 पर है → 8 × 5 = 40 minutes।" },

            { t: "h", x: "4.2 Exact Hour" },
            { t: "p", x: "अगर minute hand 12 पर है और hour hand 4 पर: 4:00 — इसे कहते हैं Four o'clock / चार बजे।" },

            { t: "h", x: "4.3 Half Past" },
            { t: "p", x: "अगर minute hand 6 पर है: 6 × 5 = 30 minutes। Hour hand 5 के आसपास और minute hand 6 पर → 5:30 — Half past five। क्योंकि एक घंटे का आधा = 30 minutes।" },

            { t: "h", x: "4.4 Quarter Past" },
            { t: "p", x: "15 minutes = quarter hour। अगर समय 3:15 है तो Quarter past three — क्योंकि 3 बजे के 15 मिनट बाद है।" },

            { t: "h", x: "4.5 Quarter To" },
            { t: "p", x: "45 minutes का अर्थ है अगले hour से 15 minutes पहले। 4:45 → Quarter to five — क्योंकि 5 बजने में 15 minutes बाकी हैं।" },
          ],
        },
        {
          id: "c5", number: 5, title: "Digital Clock", titleHi: "Digital Clock", icon: "💻",
          blocks: [
            { t: "p", x: "Digital clock सीधे numbers दिखाती है। उदाहरण: 07:30 = 7 hours 30 minutes। 14:20 यह 24-hour format में है — इसे 12-hour format में 2:20 PM लिख सकते हैं।" },
            { t: "h", x: "5.1 AM और PM" },
            { t: "p", x: "12-hour clock में दिन को दो हिस्सों में बाँटा जाता है: AM — midnight के बाद से noon तक; PM — noon के बाद से midnight तक।" },
            { t: "ul", items: ["7:00 AM → सुबह 7 बजे", "2:00 PM → दोपहर 2 बजे", "8:00 PM → रात 8 बजे"] },
            { t: "note", k: "warn", title: "⚠️ 12 AM और 12 PM", x: "12:00 AM = midnight / आधी रात · 12:00 PM = noon / दोपहर 12 बजे। यह बहुत common confusion है — इसे याद रखना जरूरी है।" },
          ],
        },
        {
          id: "c6", number: 6, title: "12-hour और 24-hour clock", titleHi: "12-hour & 24-hour", icon: "🔄",
          blocks: [
            { t: "p", x: "24-hour format में:" },
            { t: "table", head: ["12-hour", "24-hour"], rows: [["1:00 PM", "13:00"], ["2:00 PM", "14:00"], ["3:00 PM", "15:00"], ["4:00 PM", "16:00"], ["5:00 PM", "17:00"], ["6:00 PM", "18:00"], ["7:00 PM", "19:00"], ["8:00 PM", "20:00"], ["9:00 PM", "21:00"], ["10:00 PM", "22:00"], ["11:00 PM", "23:00"]] },
            { t: "note", k: "tip", title: "🧠 Shortcut", x: "PM के 1–11 बजे के लिए सामान्यतः hour + 12। उदाहरण: 7 PM → 7 + 12 = 19:00। लेकिन 12 PM → 12:00 और 12 AM → 00:00।" },
          ],
        },
      ],
    },

    {
      id: "m4", title: "समय का गणित", titleHi: "Time Calculation", icon: "⏱️",
      chapters: [
        {
          id: "c7", number: 7, title: "Duration / कितनी देर?", titleHi: "Duration", icon: "⏱️",
          blocks: [
            { t: "p", x: "अब सबसे महत्वपूर्ण skill: दो समयों के बीच कितना समय बीता?" },
            { t: "p", x: "Start = 2:00 PM, End = 3:00 PM → Duration = 1 hour।" },
            { t: "ex", title: "🔎 कठिन उदाहरण", x: "Start = 2:35 PM, End = 4:10 PM", steps: ["पहले 2:35 → 3:35 = 1 hour", "फिर 3:35 → 4:10 = 35 minutes", "Total = 1 hour 35 minutes"] },
            { t: "note", k: "tip", title: "⭐ Trick", x: "Duration को छोटे manageable हिस्सों में तोड़ो।" },
          ],
        },
        {
          id: "c8", number: 8, title: "Time Addition", titleHi: "Time Addition", icon: "➕",
          blocks: [
            { t: "p", x: "1 hour 25 minutes और 2 hours 40 minutes जोड़ने हैं।" },
            { t: "ex", title: "🔎 Step-by-step", x: "1h 25m + 2h 40m", steps: ["Hours: 1 + 2 = 3", "Minutes: 25 + 40 = 65 minutes", "60 minutes = 1 hour, तो 65 minutes = 1 hour 5 minutes", "3 hours + 1 hour 5 minutes = 4 hours 5 minutes"] },
            { t: "note", k: "remember", x: "जब minutes 60 से ज़्यादा हो जाएँ, तो 60 minutes को 1 hour में बदलकर hours में जोड़ो।" },
          ],
        },
        {
          id: "c9", number: 9, title: "Time Subtraction", titleHi: "Time Subtraction", icon: "➖",
          blocks: [
            { t: "p", x: "5 hours 20 minutes − 2 hours 45 minutes" },
            { t: "ex", title: "🔎 Step-by-step", x: "20 minutes में से 45 नहीं घट सकते।", steps: ["एक hour borrow करो: 5h 20m = 4h 80m", "80 − 45 = 35 minutes", "4 − 2 = 2 hours", "उत्तर: 2 hours 35 minutes"] },
            { t: "note", k: "tip", x: "Time में borrow = 60 (100 नहीं)। 1 hour उधार लो = 60 minutes जोड़ो।" },
          ],
        },
        {
          id: "c10", number: 10, title: "Midnight Cross करना", titleHi: "Crossing Midnight", icon: "🌙",
          blocks: [
            { t: "p", x: "एक यात्रा 10:30 PM पर शुरू हुई और 1:15 AM पर समाप्त हुई।" },
            { t: "ex", title: "🔎 Step-by-step", x: "10:30 PM → 1:15 AM", steps: ["10:30 PM → 12:00 AM = 1 hour 30 minutes", "12:00 AM → 1:15 AM = 1 hour 15 minutes", "Total = 2 hours 45 minutes"] },
            { t: "note", k: "warn", title: "⭐ ध्यान दो", x: "11:59 PM के बाद 12:00 AM आता है और नया दिन शुरू होता है। यहाँ date भी बदल गई।" },
          ],
        },
      ],
    },

    {
      id: "m5", title: "कैलेंडर", titleHi: "Calendar", icon: "📅",
      chapters: [
        {
          id: "c11", number: 11, title: "Calendar पढ़ना", titleHi: "Reading a Calendar", icon: "📅",
          blocks: [
            { t: "p", x: "Calendar हमें एक date को तीन महत्वपूर्ण चीजों से जोड़ता है: Day + Date + Month। उदाहरण: Monday, 15 June → Day = Monday, Date = 15, Month = June।" },
            { t: "h", x: "11.1 Date से Day ढूँढना" },
            { t: "p", x: "मान लो 1 June = Monday, तो:" },
            { t: "ul", items: ["8 June = Monday", "15 June = Monday", "22 June = Monday", "29 June = Monday"] },
            { t: "note", k: "remember", x: "हर 7 दिन बाद वही weekday वापस आता है। नियम: Date में 7 जोड़ो → वही weekday।" },
            { t: "act", title: "Calendar Challenge", x: "अगर 1 January = Wednesday, तो 8 / 15 / 22 January = ? (उत्तर: Wednesday) — अब learner को calendar देखकर स्वयं verify करना है।" },
          ],
        },
        {
          id: "c12", number: 12, title: "Dates के बीच अंतर", titleHi: "Difference Between Dates", icon: "📆",
          blocks: [
            { t: "p", x: "Exam = 10 March, आज = 3 March। यदि दोनों dates उसी month में हैं: 10 − 3 = 7 days, अर्थात exam 7 days बाद है।" },
            { t: "note", k: "tip", x: "अलग months हों तो पहले महीने के बचे दिन + बीच के महीनों के दिन + अगले महीने के दिन जोड़ो। Leap year में February = 29 रखना मत भूलो।" },
          ],
        },
        {
          id: "c13", number: 13, title: "Age और Birthday", titleHi: "Age & Birthday", icon: "🎂",
          blocks: [
            { t: "p", x: "Birth Year = 2010, Current Year = 2026। अगर birthday इस वर्ष हो चुका है: 2026 − 2010 = 16 years। लेकिन अगर birthday अभी आया नहीं है, तो उम्र अभी 15 years होगी।" },
            { t: "note", k: "warn", x: "इसलिए केवल year subtraction हमेशा पर्याप्त नहीं होता। Date + Month + Year देखना पड़ सकता है।" },
          ],
        },
      ],
    },

    {
      id: "m6", title: "योजना एवं वास्तविक जीवन", titleHi: "Planning & Real Life", icon: "🗓️",
      chapters: [
        {
          id: "c14", number: 14, title: "Timetable बनाना", titleHi: "Making a Timetable", icon: "🗓️",
          blocks: [
            { t: "p", x: "समय का सबसे उपयोगी practical use है planning।" },
            { t: "table", head: ["समय", "कार्य"], rows: [["6:30–7:00", "Wake up & prepare"], ["7:00–7:30", "Breakfast"], ["8:00–2:00", "School"], ["4:00–5:00", "Homework"], ["5:00–6:00", "खेल"], ["7:00–8:00", "Revision"], ["9:30", "Sleep"]] },
            { t: "act", title: "🏠 Practical Activity", x: "अपना एक दिन का timetable बनाओ। कम से कम 8 activities लिखो। हर activity के लिए: Start Time + End Time + Duration।", items: ["उदाहरण: Homework 4:00 PM – 5:15 PM → Duration = 1 hour 15 minutes", "अब अपने पूरे दिन का total study time निकालो।"] },
          ],
        },
        {
          id: "c15", number: 15, title: "Travel Time", titleHi: "Travel Time", icon: "🚆",
          blocks: [
            { t: "p", x: "Train: Departure = 6:45 AM, Arrival = 9:20 AM। Duration निकालो।" },
            { t: "ex", title: "🔎 Step-by-step", x: "6:45 AM → 9:20 AM", steps: ["6:45 → 7:45 = 1 hour", "7:45 → 8:45 = 1 hour", "8:45 → 9:20 = 35 minutes", "Total = 2 hours 35 minutes"] },
          ],
        },
        {
          id: "c16", number: 16, title: "Cooking और Daily Life", titleHi: "Cooking & Daily Life", icon: "🍳",
          blocks: [
            { t: "p", x: "खाना बनाने में Preparation = 20 minutes, Cooking = 35 minutes → total = 20 + 35 = 55 minutes।" },
            { t: "p", x: "अगर cooking 11:40 AM पर शुरू हुई: 11:40 + 55 minutes = 12:35 PM। यही time calculation वास्तविक जीवन में लगातार उपयोग होता है।" },
          ],
        },
        {
          id: "c17", number: 17, title: "Work और Appointment Planning", titleHi: "Work & Appointment", icon: "💼",
          blocks: [
            { t: "p", x: "Appointment = 3:30 PM और पहुँचने में 45 minutes लगते हैं। तुम्हें latest कब निकलना चाहिए?" },
            { t: "ex", title: "🔎 Step-by-step", x: "3:30 PM से पीछे चलो", steps: ["3:30 − 45 minutes = 2:45 PM", "Practical planning में buffer भी रखो — 15-minute buffer: 2:45 − 15 = 2:30 PM", "इसलिए departure time = 2:30 PM"] },
            { t: "note", k: "career", title: "💼 Planning = समझदारी", x: "Planning केवल calculation नहीं, समय का समझदारी से उपयोग भी है। Buffer रखने से देर नहीं होती।" },
          ],
        },
      ],
    },

    {
      id: "m7", title: "समय क्षेत्र एवं औज़ार", titleHi: "Time Zones & Tools", icon: "🌍",
      chapters: [
        {
          id: "c18", number: 18, title: "Time Zones", titleHi: "Time Zones", icon: "🌍",
          blocks: [
            { t: "p", x: "दुनिया के अलग-अलग हिस्सों में local time अलग हो सकता है। इसका कारण पृथ्वी का rotation और सूर्य के सापेक्ष अलग position है।" },
            { t: "p", x: "भारत में IST = Indian Standard Time, जिसका reference UTC + 5:30 है। उदाहरण: अगर UTC में 12:00 noon है, तो IST = 5:30 PM।" },
            { t: "note", k: "tip", title: "🌐 Practical Situation", x: "भारत में online meeting 7:00 PM IST पर है — दूसरे देश के व्यक्ति को local time अलग दिखेगा। International scheduling में Date + Time + Time Zone तीनों देखो।" },
          ],
        },
        {
          id: "c19", number: 19, title: "समय मापने का विकास", titleHi: "Evolution of Timekeeping", icon: "🏛️",
          blocks: [
            { t: "p", x: "आज हमारे पास digital watches और smartphones हैं। पुराने समय में लोगों ने समय मापने के अलग तरीके बनाए:" },
            { t: "ul", items: ["☀️ Sundial — सूर्य की छाया", "💧 Water Clock — पानी के प्रवाह से", "⌛ Hourglass — रेत के प्रवाह से", "⚙️ Mechanical Clock — gears और mechanisms", "⌚ Watch — portable timekeeping", "📱 Digital Clock — electronic display"] },
            { t: "note", k: "concept", x: "समय स्वयं नया नहीं हुआ; समय मापने की तकनीक विकसित हुई।" },
          ],
        },
        {
          id: "c20", number: 20, title: "Time Estimation", titleHi: "Time Estimation", icon: "🧠",
          blocks: [
            { t: "p", x: "हर बार घड़ी देखना संभव नहीं होता। कभी-कभी हमें अनुमान लगाना पड़ता है: 1 minute, 10 minutes, 30 minutes, 1 hour में लगभग कितना काम हो सकता है?" },
            { t: "p", x: "यदि तुम्हें पता है कि एक page पढ़ने में लगभग 5 minutes लगते हैं, तो 10 pages ≈ 50 minutes। यह exact measurement नहीं, planning estimate है।" },
          ],
        },
      ],
    },

    {
      id: "m8", title: "गलतियाँ एवं Mastery", titleHi: "Mistakes & Mastery", icon: "🏆",
      chapters: [
        {
          id: "c21", number: 21, title: "Common Mistakes", titleHi: "Common Mistakes", icon: "⚠️",
          blocks: [
            { t: "mistakes", items: [
              { w: "1 hour = 100 minutes", c: "1 hour = 60 minutes" },
              { w: "1 week = 5 days", c: "1 week = 7 days" },
              { w: "12 AM = noon", c: "12 AM = midnight · 12 PM = noon" },
              { w: "Every month has 30 days", c: "Months में 28, 29, 30 या 31 days हो सकते हैं" },
              { w: "Age = Current Year − Birth Year हमेशा", c: "Birthday इस साल हो चुका है या नहीं, यह भी देखना पड़ सकता है" },
            ] },
            { t: "act", title: "🧩 Find the Mistake", x: "Rahul कहता है: “मेरी train 11:30 PM पर चली और 1:00 AM पर पहुँची, इसलिए यात्रा 1 hour 30 minutes की थी।” क्या calculation सही है?", items: ["11:30 PM → 12:00 AM = 30 min", "12:00 AM → 1:00 AM = 1 hour", "Total = 1 hour 30 minutes → इस बार Rahul सही है।"] },
            { t: "note", k: "mistake", title: "दूसरा example", x: "“12 AM दोपहर है।” → ❌ गलत। 12 AM = midnight।" },
          ],
        },
        {
          id: "c22", number: 22, title: "Master Challenges", titleHi: "Master Challenges", icon: "🏆",
          blocks: [
            { t: "ch", title: "🏆 Master Challenge 1 — Timetable", x: "Wake up 6:30 AM · School starts 8:00 AM · School ends 2:30 PM · Homework 4:00–5:30 PM · Sports 5:45–6:45 PM · Revision 7:30–8:15 PM", items: ["उठने से school शुरू होने तक कितना समय?", "Homework कितनी देर?", "Sports कितनी देर?", "Revision कितनी देर?", "Homework और sports के बीच कितना gap?", "Sports और revision के बीच कितना gap?", "पूरे दिन में दिए गए study periods का total duration?"] },
            { t: "ch", title: "🏆 Master Challenge 2 — Calendar", x: "मान लो 1 April = Wednesday", items: ["8 April? 15 April? 22 April? 29 April?", "अगर 30 April तक project जमा करना है और आज 17 April है, तो कितने calendar days बाकी हैं?", "वही समस्या किसी 31-day month में solve करो।"] },
            { t: "ch", title: "🏆 Master Challenge 3 — Real-Life Planning", x: "9:00 AM पर appointment, पहुँचने में 50 minutes, 10 minutes safety buffer।", items: ["9:00 − 50 minutes = 8:10", "8:10 − 10 minutes = 8:00 AM", "इसलिए practical departure time = 8:00 AM"] },
          ],
        },
        {
          id: "c23", number: 23, title: "Final Project", titleHi: "My Time Management Plan", icon: "🛠️",
          blocks: [
            { t: "p", x: "अब learner अपना वास्तविक weekly time plan बनाए। Monday–Sunday, हर दिन: wake-up, study/work, meals, exercise/play, important tasks, free time, sleep। हर major activity के लिए: Start → End → Duration।" },
            { t: "p", x: "फिर calculate करो:" },
            { t: "ul", items: ["Total study/work time", "Total sleep time", "Total exercise/play time", "Free time", "सबसे अधिक समय कहाँ जा रहा है?", "क्या कोई activity unnecessarily ज्यादा समय ले रही है?", "अगले सप्ताह क्या सुधार करोगे?"] },
            { t: "note", k: "goal", x: "यह project learner को सिर्फ “time पढ़ने” से आगे ले जाकर time management सिखाता है।" },
          ],
        },
      ],
    },
  ],

  revision: {
    title: "पूरा विषय एक नज़र में",
    groups: [
      { title: "Time Units", items: ["60 seconds = 1 minute", "60 minutes = 1 hour", "24 hours = 1 day", "7 days = 1 week", "12 months = 1 year"] },
      { title: "Clock", items: ["12 clock numbers", "हर number = 5 minutes"] },
      { title: "Calendar", items: ["7 days", "12 months", "February = 28/29", "बाकी months = 30/31"] },
      { title: "Leap Year", items: ["4-year rule + century exception + 400-year rule"] },
      { title: "Time Calculation", items: ["Start → Duration → End", "कोई भी दो पता हों तो तीसरा निकाला जा सकता है"] },
      { title: "12/24 Hour", items: ["PM के सामान्य 1–11 hours के लिए +12", "12 AM/PM को विशेष रूप से याद रखें"] },
      { title: "Planning", items: ["Time + Duration + Deadline + Buffer = Better Schedule"] },
    ],
  },

  mastery: {
    title: "Final Mastery Test",
    note: "Learner को केवल MCQ नहीं दिया जाए। Assessment में अलग-अलग प्रकार के tasks हों।",
    tasks: [
      { icon: "🕐", title: "Clock Reading", x: "Analog clock देखकर exact time बताना।" },
      { icon: "💻", title: "Digital Conversion", x: "12-hour ↔ 24-hour conversion।" },
      { icon: "⏱️", title: "Duration", x: "Start और end time से elapsed time निकालना।" },
      { icon: "➕", title: "Calculation", x: "Time addition/subtraction।" },
      { icon: "📅", title: "Calendar", x: "Date/day और date difference निकालना।" },
      { icon: "🎂", title: "Age", x: "Birth date से age calculate करना।" },
      { icon: "🌍", title: "Time Zone", x: "IST/UTC आधारित practical problem।" },
      { icon: "🗓️", title: "Planning", x: "एक वास्तविक timetable बनाना।" },
      { icon: "⚠️", title: "Error Detection", x: "दूसरे व्यक्ति की गलत calculation खोजकर समझाना।" },
      { icon: "🏆", title: "Final Case", x: "Multi-step real-life situation: Calendar + Clock + Duration + Planning चारों का उपयोग।" },
    ],
    quiz: [
      { q: "1 दिन में कितने minutes होते हैं?", options: ["1,440", "60", "24", "360"], answer: 0, explain: "24 hours × 60 minutes = 1,440 minutes।" },
      { q: "1 hour = कितने minutes?", options: ["100", "60", "90", "120"], answer: 1, explain: "1 hour = 60 minutes (100 नहीं — यह common mistake है)।" },
      { q: "Leap year में February में कितने days होते हैं?", options: ["28", "29", "30", "31"], answer: 1, explain: "Leap year में February = 29 days।" },
      { q: "12:00 AM का मतलब?", options: ["दोपहर", "आधी रात (midnight)", "सुबह 12 बजे", "शाम"], answer: 1, explain: "12:00 AM = midnight; 12:00 PM = noon।" },
      { q: "3 hours 45 minutes = कितने minutes?", options: ["345", "225", "180", "245"], answer: 1, explain: "3 × 60 + 45 = 225 minutes।" },
      { q: "6:45 AM से 9:20 AM तक कितना समय?", options: ["2 hours 35 minutes", "3 hours 25 minutes", "2 hours 45 minutes", "1 hour 35 minutes"], answer: 0, explain: "6:45 → 8:45 = 2 hours, +35 minutes = 2 hours 35 minutes।" },
      { q: "5 hours 20 minutes − 2 hours 45 minutes = ?", options: ["2 hours 35 minutes", "3 hours 25 minutes", "2 hours 45 minutes", "3 hours 35 minutes"], answer: 0, explain: "Borrow: 4h 80m − 2h 45m = 2h 35m।" },
      { q: "अगर 1 January = Wednesday, तो 15 January कौन-सा दिन?", options: ["Wednesday", "Tuesday", "Thursday", "Monday"], answer: 0, explain: "हर 7 दिन बाद वही weekday: 1, 8, 15 → Wednesday।" },
      { q: "IST का UTC reference क्या है?", options: ["UTC + 5:30", "UTC + 6:00", "UTC − 5:30", "UTC + 4:30"], answer: 0, explain: "IST = UTC + 5:30।" },
      { q: "एक घड़ी में minute hand 8 पर है — कितने minutes?", options: ["8", "40", "45", "35"], answer: 1, explain: "Clock number × 5 = 8 × 5 = 40 minutes।" },
    ],
  },

  outcome: [
    "analog clock पढ़ सकेगा", "digital clock समझ सकेगा", "AM/PM सही इस्तेमाल करेगा",
    "12-hour और 24-hour time बदल सकेगा", "seconds/minutes/hours convert कर सकेगा",
    "duration निकाल सकेगा", "time जोड़ और घटा सकेगा", "midnight crossing संभाल सकेगा",
    "calendar पढ़ सकेगा", "dates और weekdays समझ सकेगा", "leap year पहचान सकेगा",
    "age calculate कर सकेगा", "timetable बना सकेगा", "appointments और deadlines plan कर सकेगा",
    "travel duration निकाल सकेगा", "basic time-zone calculations समझ सकेगा",
    "time-related mistakes पहचान सकेगा", "और अपने वास्तविक जीवन में समय का बेहतर उपयोग कर सकेगा",
  ],
};

export const isTimeCalendarSubject = (subject) => {
  if (!subject) return false;
  const base = String(subject.en || "").toLowerCase().trim();
  return base === "time & calendar" || base === "time and calendar" || /समय एवं कैलेंडर/.test(subject.hi || subject.title || "");
};
