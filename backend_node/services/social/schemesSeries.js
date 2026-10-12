// Series 2 — सरकारी योजनाएँ (Government Schemes) — रोज़ एक योजना.
//
// Objective (नियमावली): उद्देश्य 1, 4, 5 — शासकीय योजनाओं का प्रचार-प्रसार,
// वंचित वर्गों तक लाभ पहुँचाना, शिक्षा एवं कौशल।
//
// Sourcing: names and broad purpose of well-known Government of India schemes.
// Exact eligibility, amounts and last dates change often — the post tells the
// reader to verify on the OFFICIAL portal (always a .gov.in / nic.in address or a
// Common Service Centre). No invented benefit amounts; no "SSF will get you this".
//
// Bilingual (EN + HI).

const { CH, T } = require('./seriesEngine');

const items = [
  CH(
    T('PM-KISAN — income support for farmers', 'पीएम-किसान — किसानों को आय सहायता'),
    T('Small farmers get direct income support in their bank account.', 'छोटे किसानों को सीधे बैंक खाते में आय सहायता मिलती है।'),
    [
      T('A central scheme giving eligible landholding farmer families direct benefit transfer.', 'यह केंद्रीय योजना पात्र भूमि-धारक किसान परिवारों को प्रत्यक्ष लाभ अंतरण देती है।'),
      T('It is paid in instalments directly to the bank account — no middleman.', 'यह किस्तों में सीधे बैंक खाते में मिलती है — कोई बिचौलिया नहीं।'),
      T('Eligibility and instalment amount are set by the scheme; verify current rules on the official portal.', 'पात्रता एवं किस्त राशि योजना तय करती है; वर्तमान नियम आधिकारिक पोर्टल पर जाँचें।'),
    ],
    T('A small farmer with an Aadhaar-linked bank account receives the instalment by DBT.', 'आधार से जुड़े बैंक खाते वाले छोटे किसान को DBT द्वारा किस्त मिलती है।'),
    T('Help one farmer check their PM-KISAN status on the official portal today.', 'आज एक किसान की पीएम-किसान स्थिति आधिकारिक पोर्टल पर जाँचने में मदद करें।'),
    T('Registration is free on the official site; a CSC may charge a small official fee.', 'आधिकारिक साइट पर पंजीकरण निःशुल्क है; CSC छोटा आधिकारिक शुल्क ले सकता है।'),
    T('Never pay a "commission" to anyone promising the instalment.', '"किस्त दिलाने" के नाम पर किसी को कमीशन न दें।'),
    {
      labh: T('Direct income support in instalments to your own bank account.', 'किस्तों में सीधी आय सहायता आपके अपने बैंक खाते में।'),
      who: T('Eligible landholding farmer families (as per scheme rules).', 'पात्र भूमि-धारक किसान परिवार (योजना नियमानुसार)।'),
      docs: T('Aadhaar, land records, bank account linked to Aadhaar, mobile number.', 'आधार, भूमि अभिलेख, आधार से जुड़ा बैंक खाता, मोबाइल नंबर।'),
      where: T('pmkisan.gov.in (self-registration) or your nearest CSC / patwari.', 'pmkisan.gov.in (स्वयं पंजीकरण) या नज़दीकी CSC / पटवारी।'),
    },
  ),
  CH(
    T('Ayushman Bharat (PM-JAY) — health cover for families', 'आयुष्मान भारत (PM-JAY) — परिवारों हेतु स्वास्थ्य सुरक्षा'),
    T('Hospital treatment should not push a family into debt.', 'अस्पताल का इलाज परिवार को कर्ज़ में न डाले।'),
    [
      T('A health assurance scheme for eligible families, covering hospitalisation at empanelled hospitals.', 'पात्र परिवारों हेतु स्वास्थ्य आश्वासन योजना, जो सूचीबद्ध अस्पतालों में भर्ती उपचार कवर करती है।'),
      T('Each eligible family gets an Ayushman card; treatment is cashless at empanelled hospitals.', 'प्रत्येक पात्र परिवार को आयुष्मान कार्ड मिलता है; सूचीबद्ध अस्पतालों में इलाज कैशलेस है।'),
      T('Check your family\'s eligibility at the official portal or your nearest CSC / hospital help-desk.', 'अपने परिवार की पात्रता आधिकारिक पोर्टल या नज़दीकी CSC / अस्पताल सहायता-डेस्क पर जाँचें।'),
    ],
    T('An eligible family can get major surgery without paying upfront at an empanelled hospital.', 'पात्र परिवार सूचीबद्ध अस्पताल में बड़ी सर्जरी बिना अग्रिम भुगतान करा सकता है।'),
    T('Help one eligible person make their Ayushman card this week.', 'इस सप्ताह एक पात्र व्यक्ति का आयुष्मान कार्ड बनवाने में मदद करें।'),
    T('Ask at the hospital counter before admission: "Is this hospital empanelled?"', 'भर्ती से पहले अस्पताल काउंटर पर पूछें: "क्या यह अस्पताल सूचीबद्ध है?"'),
    T('Coverage applies only at empanelled hospitals and as per scheme rules.', 'कवरेज केवल सूचीबद्ध अस्पतालों में और योजना नियमों के अनुसार लागू है।'),
    {
      labh: T('Cashless hospital treatment for eligible families at empanelled hospitals.', 'पात्र परिवारों को सूचीबद्ध अस्पतालों में कैशलेस इलाज।'),
      who: T('Families listed as eligible under PM-JAY (check at the portal / hospital desk).', 'PM-JAY में पात्र सूचीबद्ध परिवार (पोर्टल / अस्पताल डेस्क पर जाँचें)।'),
      docs: T('Ayushman card / Aadhaar / Ration card; ask the hospital help-desk.', 'आयुष्मान कार्ड / आधार / राशन कार्ड; अस्पताल सहायता-डेस्क से पूछें।'),
      where: T('beneficiary.nha.gov.in, or any empanelled hospital\'s Ayushman desk.', 'beneficiary.nha.gov.in, या किसी सूचीबद्ध अस्पताल का आयुष्मान डेस्क।'),
    },
  ),
  CH(
    T('MGNREGA — 100 days of guaranteed wage work', 'मनरेगा — 100 दिन का गारंटीशुदा मज़दूरी रोज़गार'),
    T('If there is no work, the law promises 100 days of it.', 'यदि काम नहीं है, तो कानून 100 दिन काम का वादा करता है।'),
    [
      T('A rural employment guarantee scheme: at least 100 days of unskilled wage work per household per year.', 'ग्रामीण रोज़गार गारंटी योजना: प्रति परिवार प्रति वर्ष कम से कम 100 दिन अकुशल मज़दूरी कार्य।'),
      T('Work is provided within the village as far as possible; wages go to a bank/post-office account.', 'काम यथासंभव गाँव में मिलता है; मज़दूरी बैंक/डाकघर खाते में जाती है।'),
      T('A job card is the key document; a written application can be given to the gram panchayat.', 'जॉब कार्ड मुख्य दस्तावेज है; लिखित आवेदन ग्राम पंचायत को दिया जा सकता है।'),
    ],
    T('A worker with a job card can demand work and is entitled to unemployment allowance if work is not given in time.', 'जॉब कार्ड धारक काम माँग सकते है, समय पर काम न मिले तो बेरोज़गारी भत्ते का हक है।'),
    T('Find one person needing a job card and guide them to the gram panchayat.', 'एक व्यक्ति खोजें जिसे जॉब कार्ड चाहिए और उसे ग्राम पंचायत तक मार्गदर्शन दें।'),
    T('Wages must reach the worker\'s own account — check the passbook.', 'मज़दूरी श्रमिक के अपने खाते में पहुँचे — पासबुक में देखें।'),
    T('No contractor may deduct from MGNREGA wages.', 'कोई ठेकेदार मनरेगा मज़दूरी से कटौती नहीं कर सकता।'),
    {
      labh: T('At least 100 days of unskilled wage work per household per year.', 'प्रति परिवार प्रति वर्ष कम से कम 100 दिन अकुशल मज़दूरी कार्य।'),
      who: T('Any rural household willing to do unskilled manual work.', 'अकुशल शारीरिक श्रम करने को तैयार कोई भी ग्रामीण परिवार।'),
      docs: T('Job card, Aadhaar, bank/post-office account; written application.', 'जॉब कार्ड, आधार, बैंक/डाकघर खाता; लिखित आवेदन।'),
      where: T('Your Gram Panchayat office (free). No fee to get a job card.', 'आपका ग्राम पंचायत कार्यालय (निःशुल्क)। जॉब कार्ड हेतु कोई शुल्क नहीं।'),
    },
  ),
  CH(
    T('Sukanya Samriddhi Yojana — savings for a girl child', 'सुकन्या समृद्धि योजना — बालिका हेतु बचत'),
    T('A small saving today for a daughter\'s tomorrow.', 'आज की छोटी बचत, बेटी के कल के लिए।'),
    [
      T('A small-deposit savings scheme for a girl child, opened at a post office or bank.', 'बालिका हेतु लघु जमा बचत योजना, डाकघर या बैंक में खुलती है।'),
      T('The account is opened by a parent/guardian in the girl\'s name; deposits have a fixed tenure and attractive interest.', 'खाता माता-पिता/अभिभावक बालिका के नाम खोलते हैं; जमा की निश्चित अवधि एवं आकर्षक ब्याज है।'),
      T('Each family may open accounts per the scheme rules; verify the current limits at the post office.', 'प्रत्येक परिवार योजना नियमों अनुसार खाते खोल सकता है; वर्तमान सीमा डाकघर पर जाँचें।'),
    ],
    T('A girl\'s higher education or marriage can be planned with a long-term Sukanya deposit.', 'बालिका की उच्च शिक्षा या विवाह की योजना दीर्घकालिक सुकन्या जमा से बन सकती है।'),
    T('Tell one family with a young daughter about this scheme today.', 'आज छोटी बेटी वाले एक परिवार को इस योजना के बारे में बताएँ।'),
    T('Start small and save regularly — the girl benefits from patient saving.', 'छोटी राशि से शुरू करें और नियमित बचत करें — धैर्य की बचत बालिका के काम आती है।'),
    T('Open only at a post office or scheduled bank; beware of fake "agents".', 'केवल डाकघर या अनुसूचित बैंक में खोलें; फर्जी "एजेंट" से बचें।'),
    {
      labh: T('A long-term, small-savings account for a daughter\'s education or future.', 'बेटी की शिक्षा या भविष्य हेतु दीर्घकालिक लघु-बचत खाता।'),
      who: T('A parent/guardian opening an account in a girl child\'s name (as per rules).', 'माता-पिता/अभिभावक बालिका के नाम खाता खोलते हैं (नियमानुसार)।'),
      docs: T('Girl\'s birth certificate, guardian ID and address proof, photo.', 'बालिका का जन्म प्रमाणपत्र, अभिभावक का पहचान व पता प्रमाण, फोटो।'),
      where: T('Any post office or scheduled bank branch (fixed official form).', 'कोई भी डाकघर या अनुसूचित बैंक शाखा (निर्धारित आधिकारिक फॉर्म)।'),
    },
  ),
  CH(
    T('PM Mudra Yojana — a loan for a small business', 'पीएम मुद्रा योजना — छोटे व्यापार हेतु ऋण'),
    T('A small loan can turn a skill into a livelihood.', 'छोटा ऋण कौशल को आजीविका में बदल सकता है।'),
    [
      T('A scheme offering collateral-free micro/small loans to non-farm small businesses through banks/NBFCs.', 'बैंक/NBFC के माध्यम से गैर-कृषि छोटे व्यापार को बिना जमानत सूक्ष्म/छोटे ऋण देने वाली योजना।'),
      T('Loans are grouped in categories (Shishu/Kishore/Tarun) by size, as per current rules.', 'ऋण आकार के अनुसार श्रेणियों (शिशु/किशोर/तरुण) में हैं, वर्तमान नियमों अनुसार।'),
      T('Apply at a bank/NBFC; no collateral for smaller categories under the scheme.', 'बैंक/NBFC में आवेदन करें; योजना के तहत छोटी श्रेणियों में जमानत नहीं।'),
    ],
    T('A tailor or small shop can take a Mudra loan to buy a machine or stock.', 'दर्जी या छोटी दुकानदार मशीन या माल खरीदने हेतु मुद्रा ऋण ले सकता है।'),
    T('Identify one aspiring micro-entrepreneur and guide them to a bank.', 'एक इच्छुक सूक्ष्म उद्यमी की पहचान करें और उसे बैंक तक मार्गदर्शन दें।'),
    T('A repayment track record builds credit for larger future loans.', 'चुकौती इतिहास भविष्य के बड़े ऋण हेतु साख बनाता है।'),
    T('Read the interest rate and terms carefully; loan is repayable, not a grant.', 'ब्याज दर एवं शर्तें ध्यान से पढ़ें; ऋण चुकाना होता है, अनुदान नहीं।'),
    {
      labh: T('A collateral-free small business loan to start or grow a micro-enterprise.', 'सूक्ष्म उद्यम शुरू करने या बढ़ाने हेतु बिना जमानत छोटा व्यापार ऋण।'),
      who: T('Non-farm small/micro entrepreneurs (tailor, shop, artisan, service).', 'गैर-कृषि छोटे/सूक्ष्म उद्यमी (दर्जी, दुकान, कारीगर, सेवा)।'),
      docs: T('ID/address proof, business plan or quotation, bank account.', 'पहचान/पता प्रमाण, व्यापार योजना या कोटेशन, बैंक खाता।'),
      where: T('Any bank or NBFC branch under Mudra; apply in person or via Jan Samarth.', 'मुद्रा के तहत कोई भी बैंक/NBFC शाखा; व्यक्तिगत रूप से या जन समर्थ पोर्टल से।'),
    },
  ),
  CH(
    T('National Scholarship Portal — help for students', 'राष्ट्रीय छात्रवृत्ति पोर्टल — विद्यार्थियों हेतु सहायता'),
    T('Money for study should never stop a bright student.', 'पढ़ाई का पैसा किसी मेधावी विद्यार्थी को न रोके।'),
    [
      T('A single portal listing many central and state scholarships by class, category and course.', 'कक्षा, वर्ग एवं कोर्स के अनुसार अनेक केंद्रीय व राज्य छात्रवृत्तियाँ एक ही पोर्टल पर।'),
      T('Scholarships cover school, college and professional courses as per each scheme.', 'छात्रवृत्तियाँ प्रत्येक योजना अनुसार स्कूल, कॉलेज एवं व्यावसायिक कोर्स कवर करती हैं।'),
      T('Apply online with Aadhaar, bank and income/caste documents as required.', 'आवश्यकतानुसार आधार, बैंक एवं आय/जाति दस्तावेजों सहित ऑनलाइन आवेदन करें।'),
    ],
    T('A class-12 student from a low-income family can apply for a post-matric scholarship.', 'कम आय वाले परिवार का 12वीं का छात्र पोस्ट-मैट्रिक छात्रवृत्ति हेतु आवेदन कर सकता है।'),
    T('Help one student find and apply for a scholarship this week.', 'इस सप्ताह एक विद्यार्थी को छात्रवृत्ति खोजने एवं आवेदन करने में मदद करें।'),
    T('Keep documents ready before the deadline — late applications are rejected.', 'समय-सीमा से पहले दस्तावेज तैयार रखें — विलंब आवेदन खारिज होते हैं।'),
    T('Apply only on the official portal; never pay an agent.', 'केवल आधिकारिक पोर्टल पर आवेदन करें; किसी एजेंट को पैसे न दें।'),
    {
      labh: T('Scholarship money for school, college or professional study.', 'स्कूल, कॉलेज या व्यावसायिक पढ़ाई हेतु छात्रवृत्ति राशि।'),
      who: T('Students by class/category/course income as each scholarship defines.', 'प्रत्येक छात्रवृत्ति के अनुसार कक्षा/वर्ग/कोर्स/आय के आधार पर विद्यार्थी।'),
      docs: T('Aadhaar, bank account, income/caste certificate, marksheet, photo.', 'आधार, बैंक खाता, आय/जाति प्रमाण, अंकतालिका, फोटो।'),
      where: T('scholarships.gov.in (National Scholarship Portal) — free online.', 'scholarships.gov.in (राष्ट्रीय छात्रवृत्ति पोर्टल) — निःशुल्क ऑनलाइन।'),
    },
  ),
  CH(
    T('Ujjwala & Saubhagya — clean fuel and power at home', 'उज्ज्वला एवं सौभाग्य — घर में स्वच्छ ईंधन व बिजली'),
    T('A smoke-free kitchen and a lit home change health and study.', 'धुआँ-रहित रसोई और रोशन घर स्वास्थ्य व पढ़ाई बदलते हैं।'),
    [
      T('Pradhan Mantri Ujjwala Yojana provides LPG connection support to eligible poor households.', 'प्रधानमंत्री उज्ज्वला योजना पात्र गरीब परिवारों को LPG कनेक्शन सहायता देती है।'),
      T('Saubhagya aimed at household electrification for un-electrified homes.', 'सौभाग्य का लक्ष्य बिना बिजली वाले घरों का विद्युतीकरण था।'),
      T('Eligibility and subsidies change; verify current terms at the official site or CSC.', 'पात्रता एवं सब्सिडी बदलती है; वर्तमान शर्तें आधिकारिक साइट या CSC पर जाँचें।'),
    ],
    T('A woman cooking on firewood can get breathing relief and time savings from an LPG connection.', 'लकड़ी पर खाना बनाने वाली महिला को LPG कनेक्शन से श्वास राहत एवं समय बचत मिलती है।'),
    T('Share the Ujjwala eligibility rules with one eligible household today.', 'आज एक पात्र परिवार को उज्ज्वला पात्रता नियम बताएँ।'),
    T('Clean cooking fuel protects women\'s health directly.', 'स्वच्छ ईंधन सीधे महिलाओं के स्वास्थ्य की रक्षा करता है।'),
    T('Apply only through the official channel; a nominee may misuse documents.', 'केवल आधिकारिक माध्यम से आवेदन करें; नामज़द व्यक्ति दस्तावेजों का दुरुपयोग कर सकता है।'),
    {
      labh: T('Clean cooking gas (LPG) and/or household electricity connection support.', 'स्वच्छ रसोई गैस (LPG) और/या घरेलू बिजली कनेक्शन सहायता।'),
      who: T('Eligible poor / un-electrified households as per scheme rules.', 'योजना नियमानुसार पात्र गरीब / बिना बिजली वाले परिवार।'),
      docs: T('Aadhaar, ration card, bank account, address proof.', 'आधार, राशन कार्ड, बैंक खाता, पता प्रमाण।'),
      where: T('Your LPG distributor or state DISCOM / official portal; CSC can help.', 'आपका LPG वितरक या राज्य DISCOM / आधिकारिक पोर्टल; CSC मदद कर सकता है।'),
    },
  ),
  CH(
    T('How to verify any scheme is genuine', 'कोई भी योजना असली है या नहीं, कैसे जाँचें'),
    T('A real scheme never asks you for an OTP or a fee to "release" money.', 'असली योजना पैसे "दिलाने" के लिए OTP या फीस नहीं माँगती।'),
    [
      T('Every genuine central scheme is on an official .gov.in / nic.in site, or a state government site.', 'हर असली केंद्रीय योजना आधिकारिक .gov.in / nic.in साइट, या राज्य सरकार की साइट पर होती है।'),
      T('Applications are online or through a CSC / bank / panchayat — never through a personal link.', 'आवेदन ऑनलाइन या CSC / बैंक / पंचायत से — किसी निजी लिंक से कभी नहीं।'),
      T('No genuine scheme asks for your bank PIN, OTP or full card details to give you a benefit.', 'कोई असली योजना लाभ देने हेतु बैंक PIN, OTP या पूर्ण कार्ड विवरण नहीं माँगती।'),
    ],
    T('A "PM scheme" WhatsApp link asking for an OTP + fee is fraud — delete and report.', '"पीएम योजना" का WhatsApp लिंक जो OTP + फीस माँगे — वह ठगी है; हटाएँ व रिपोर्ट करें।'),
    T('Bookmark one official portal today so you can verify future claims quickly.', 'आज एक आधिकारिक पोर्टल बुकमार्क करें ताकि भविष्य के दावे तुरंत जाँच सकें।'),
    T('Verification on the official site is your best protection.', 'आधिकारिक साइट पर जाँच ही आपकी सबसे अच्छी सुरक्षा है।'),
    T('When unsure, ask at a government office or CSC — never at a stranger\'s link.', 'संदेह हो तो सरकारी कार्यालय या CSC पर पूछें — किसी अजनबी के लिंक पर कभी नहीं।'),
    {
      labh: T('Protects you from losing money to fake "scheme" fraud.', 'फर्जी "योजना" की ठगी में पैसा गँवाने से बचाता है।'),
      who: T('Every citizen — especially first-time online applicants.', 'हर नागरिक — विशेषकर पहली बार ऑनलाइन आवेदन करने वाले।'),
      docs: T('None needed — just check the web address ends in .gov.in / nic.in.', 'कुछ नहीं चाहिए — बस देखें कि वेब पता .gov.in / nic.in पर समाप्त हो।'),
      where: T('Official .gov.in / nic.in sites, or a government office / CSC.', 'आधिकारिक .gov.in / nic.in साइट, या सरकारी कार्यालय / CSC।'),
    },
  ),
];

module.exports = {
  key: 'yojana',
  emoji: '🏛️',
  category: 'schemes',
  title: T('Sarkari Yojana — One Scheme a Day', 'सरकारी योजना — रोज़ एक योजना'),
  note: T('Scheme rules and amounts change. Always verify eligibility and apply only on the official portal (gov.in / nic.in) or a CSC.',
    'योजना के नियम एवं राशि बदलती रहती है। पात्रता सदैव आधिकारिक पोर्टल (gov.in / nic.in) या CSC पर जाँचें और वहीं आवेदन करें।'),
  cta: T('Help one eligible person reach a benefit they did not know about.',
    'एक पात्र व्यक्ति को उस लाभ तक पहुँचाएँ जिसकी उसे जानकारी नहीं थी।'),
  verified: '2026-01',
  items,
};
