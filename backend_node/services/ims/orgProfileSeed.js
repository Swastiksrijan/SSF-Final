// SSF Organisation Profile seed — the Foundation's master identity, statutory
// registrations, governance, finance and compliance details, bilingual.
// Mirrors the SSF Digital Office "Institution Profile & Compliance" record.
// Idempotent and non-destructive: a section is created only if absent, so a
// user-edited record is never overwritten ("kuch hatana nhi").
const { models } = require('../../models/ims');

const SECTIONS = [
  {
    section: 'profile',
    data: {
      organizationName: 'Swastik Srijan Foundation Samiti',
      organizationNameHi: 'स्वास्तिक सृजन फाउंडेशन समिति',
      shortName: 'SSF',
      registrationNumber: '05/22/03/11448/13',
      registrationDate: '30-12-2013',
      registrationAct: 'Madhya Pradesh Societies Registration Act, 1973',
      registrationActHi: 'मध्य प्रदेश सोसाइटी पंजीकरण अधिनियम, 1973',
      organizationType: 'Society',
      organizationTypeHi: 'समिति',
      operationalScope: 'Pan India',
      operationalScopeHi: 'सम्पूर्ण भारत',
      address: 'Ward No. 1, Dadar, Post Rahat, Dist. Rewa',
      addressHi: 'वार्ड नं. 1, ददर, पोस्ट राहत, ज़िला रीवा',
      city: 'Rewa',
      cityHi: 'रीवा',
      state: 'Madhya Pradesh',
      stateHi: 'मध्य प्रदेश',
      pinCode: '486446',
      mobile: '9718346691',
      email: 'swastiksrijanfoundation@gmail.com',
      website: 'www.swastiksrijan.in',
    },
  },
  {
    section: 'objectives',
    data: {
      vision: 'An inclusive, educated, healthy, self-reliant and harmonious society where every person can live with dignity, equal opportunity and meaningful participation in sustainable development.\nएक समावेशी, शिक्षित, स्वस्थ, आत्मनिर्भर और सामाजिक सौहार्दपूर्ण समाज का निर्माण, जहाँ प्रत्येक व्यक्ति गरिमा, समान अवसर और सतत विकास में सार्थक सहभागिता के साथ बेहतर जीवन जी सके।',
      mission: 'To work across India for education, health and well-being, livelihood and self-reliance, women and child empowerment, rural development, environmental protection and social awareness through community participation, capacity building, training and transparent, lawful collaboration.\nपूरे भारत में शिक्षा, स्वास्थ्य एवं कल्याण, आजीविका एवं आत्मनिर्भरता, महिला एवं बाल सशक्तिकरण, ग्रामीण विकास, पर्यावरण संरक्षण तथा सामाजिक जागरूकता के लिए समुदाय की सहभागिता, क्षमता निर्माण, प्रशिक्षण तथा पारदर्शी एवं वैधानिक सहयोग के माध्यम से कार्य करना।',
      coreValues: 'Humanity & Truth; Equality & Dignity; Social Harmony; Responsibility; Transparency; Community Participation; Service with Integrity',
      coreValuesHi: 'मानवता एवं सत्य; समानता एवं सम्मान; सामाजिक सामंजस्य; उत्तरदायित्व; पारदर्शिता; समुदाय सहभागिता; सत्यनिष्ठा से सेवा',
      objectives: 'To promote education and skill development; improve health, nutrition and well-being; support women, children, elderly persons and persons with disabilities; strengthen rural development, livelihoods, agriculture and self-reliance; promote environmental and natural-resource conservation; encourage social harmony, ethical values, equality and responsible citizenship; and support lawful programmes aligned with the Foundation\'s objectives.\nशिक्षा एवं कौशल विकास को बढ़ावा देना; स्वास्थ्य, पोषण एवं कल्याण में सहयोग करना; महिलाओं, बच्चों, बुजुर्गों एवं दिव्यांगजनों के कल्याण एवं सशक्तिकरण के लिए कार्य करना; ग्रामीण विकास, आजीविका, कृषि एवं आत्मनिर्भरता को बढ़ावा देना; पर्यावरण एवं प्राकृतिक संसाधनों के संरक्षण के लिए कार्य करना; सामाजिक समरसता, नैतिक मूल्यों, समानता एवं जिम्मेदार नागरिकता को प्रोत्साहित करना; तथा संस्था के उद्देश्यों के अनुरूप वैधानिक कार्यक्रमों में सहयोग करना।',
      areasOfWork: 'Education & Skill Development / शिक्षा एवं कौशल विकास; Health, Nutrition & Wellness / स्वास्थ्य, पोषण एवं कल्याण; Women & Child Welfare / महिला एवं बाल कल्याण; Rural Development & Livelihood / ग्रामीण विकास एवं आजीविका; Agriculture, Organic Farming & Animal Welfare / कृषि, जैविक खेती एवं पशु कल्याण; Environment, Tree Plantation & Natural Resource Conservation / पर्यावरण, वृक्षारोपण एवं प्राकृतिक संसाधन संरक्षण; Disability Support & Rehabilitation / दिव्यांगजन सहयोग एवं पुनर्वास; Youth & Community Development / युवा एवं सामुदायिक विकास; Social Awareness, Ethical Values & Social Harmony / सामाजिक जागरूकता, नैतिक मूल्य एवं सामाजिक समरसता।',
      targetBeneficiaries: 'Children / बच्चे; Women / महिलाएँ; Elderly Persons / बुजुर्ग; Persons with Disabilities / दिव्यांगजन; Farmers / किसान; Rural and Economically Disadvantaged Communities / ग्रामीण एवं आर्थिक रूप से वंचित समुदाय; Tribal, Backward, Remote and Underserved Communities / जनजातीय, पिछड़े, दूरस्थ एवं सेवा से वंचित समुदाय; Youth / युवा; Families and other persons requiring lawful social support / परिवार एवं अन्य व्यक्ति जिन्हें वैधानिक सामाजिक सहयोग की आवश्यकता हो।',
      statesDistricts: 'All India / Pan India — सम्पूर्ण भारत',
    },
  },
  {
    section: 'legal',
    data: {
      registrationNumber: '05/22/03/11448/13',
      registrationDate: '30-12-2013',
      registrationAct: 'MP Society Act 1973',
      district: 'Rewa',
      state: 'Madhya Pradesh',
      pan: 'AAKAS7123H',
      governingDocument: 'Memorandum / Rules & Regulations (Niyamavali) / मेमोरेंडम एवं नियमावली',
      amendmentHistory: 'No amendment recorded currently / वर्तमान में कोई संशोधन दर्ज नहीं है',
    },
  },
  {
    section: 'tax',
    data: {
      pan: 'AAKAS7123H',
      twelveAB: 'AAKAS7123H25BP01',
      twelveABStatus: 'Available',
      eightyG: 'AAKAS7123HF20231',
      eightyGStatus: 'Provisional Approval / अस्थायी स्वीकृति — Final approval applied in July 2026 / अंतिम स्वीकृति हेतु जुलाई 2026 में आवेदन किया गया; pending',
      assessmentYear: 'AY 2024-25 to AY 2028-29 (12AB); AY 2024-25 to AY 2026-27 (80G Provisional)',
      effectiveDates: '12AB: 23-06-2026; 80G Provisional: 26-08-2023',
      incomeTaxFiling: 'ITR not filed yet / ITR अभी दाखिल नहीं किया गया है; Acknowledgement: Not available / उपलब्ध नहीं',
    },
  },
  {
    section: 'darpan',
    data: {
      ngoDarpanId: 'MP/2017/0169529',
      darpanStatus: 'Active',
      csr1Number: 'CSR00093974',
      csrStatus: 'Registered',
      mcaCsrRecords: 'CSR-1 Registered / CSR-1 पंजीकृत — Registration No.: CSR00093974. No CSR funding received to date / अब तक कोई CSR funding प्राप्त नहीं हुई है. MCA-related records, wherever applicable, to be updated from official records / लागू MCA-संबंधित अभिलेख आधिकारिक रिकॉर्ड के अनुसार अपडेट किए जाएंगे।',
    },
  },
  {
    section: 'governance',
    data: {
      president: 'Ramesh Pandey',
      vicePresident: 'Preeti Shukla',
      secretary: 'Amit Kumar Pandey',
      jointSecretary: 'Kiran Pandey',
      treasurer: 'Divya Sharma',
      members: 'Sandeep Tripathi\nPrameesh Singh\nRishi Kumar Pandey\nRitesh Kumar Tiwari',
      rolesTenure: 'Managing Committee / प्रबंध समिति: President / अध्यक्ष – Ramesh Pandey; Vice President / उपाध्यक्ष – Preeti Shukla; Secretary / सचिव – Amit Kumar Pandey; Treasurer / कोषाध्यक्ष – Divya Sharma; Joint Secretary / संयुक्त सचिव – Kiran Pandey; Members / सदस्य – Sandeep Tripathi, Prameesh Singh, Rishi Kumar Pandey, Ritesh Kumar Tiwari.\nTenure / कार्यकाल: 3 years as per Rules & Regulations / नियमावली के अनुसार 3 वर्ष।\nAppointment Reference / नियुक्ति संदर्भ: As per the Society\'s Rules & Regulations and Managing Committee records / संस्था की नियमावली एवं प्रबंध समिति के अभिलेखों के अनुसार।\nIndividual appointment dates/reference numbers: To be updated from appointment/resolution records where available / जहाँ उपलब्ध हों, नियुक्ति पत्र/प्रस्ताव अभिलेखों से बाद में अपडेट किए जाएंगे।',
    },
  },
  {
    section: 'finance',
    data: {
      financialYear: '2025-26',
      bankName: 'Union Bank of India',
      branch: 'Transport Nagar, Rewa',
      accountNumber: '481401010036579',
      ifsc: 'UBIN0548146',
      upi: '9718346691@ptyes',
      auditorName: 'CA Kapil Tiwari',
      auditorContact: '8527067812',
      booksStatus: 'Books of Accounts / लेखा पुस्तकें: Maintained / रखी जाती हैं — Cash Book, Bank Book, Ledger, Contribution & Expense Records and other supporting records / कैश बुक, बैंक बुक, लेजर, योगदान एवं व्यय अभिलेख तथा संबंधित सहायक अभिलेख।\nAudit Status / ऑडिट स्थिति: Audited Accounts maintained / लेखापरीक्षित खाते उपलब्ध हैं। Auditor: CA Kapil Tiwari.\nSupporting Records: Maintained wherever available / उपलब्धता के अनुसार सहायक अभिलेख सुरक्षित रखे जाते हैं।',
    },
  },
  {
    section: 'government',
    data: {
      udyam: 'UDYAM-MP-38-0042763',
      msmeType: 'Micro (2025-26), Services',
      msmeTypeHi: 'सूक्ष्म (2025-26), सेवाएँ',
      udyogAadhaar: 'MP38D0003317',
      esic: '81000588360001399',
      epfo: 'MPJBP3643700000',
      digitalIndia: 'REG2025070722444819',
      ncsEmployerId: 'F7900E570628',
      ncsOrganizationId: 'P20G74-0022474929830',
      lin: '1-2984-2321-4',
      mpJanAbhiyan: 'NV2022REW0004',
      startupRegistration: 'OI-0825-9266HS',
    },
  },
  {
    section: 'calendar',
    data: {
      complianceName: '12AB Registration / 12AB पंजीकरण',
      authority: 'Income Tax Department / आयकर विभाग',
      dueDate: '',
      financialYear: 'AY 2024-25 to AY 2028-29',
      status: 'Registered / पंजीकृत',
      filingDate: '2026-06-23',
      acknowledgement: 'CIT EXEMPTION BHOPAL/2025-26/12AA/18281',
      responsiblePerson: 'Ramesh Pandey / President',
      remarks: '12AB registration granted under Section 12AB(1)(b); valid for AY 2024-25 to AY 2028-29.',
      remarksHi: '12AB पंजीकरण धारा 12AB(1)(b) के अंतर्गत प्रदान किया गया; AY 2024-25 से AY 2028-29 तक मान्य।',
    },
  },
  {
    section: 'calendar',
    data: {
      complianceName: '80G Provisional Approval / 80G अस्थायी स्वीकृति',
      authority: 'Income Tax Department / आयकर विभाग',
      dueDate: '',
      financialYear: 'AY 2024-25 to AY 2026-27',
      status: 'Provisional Approval — Final Approval Pending / अस्थायी स्वीकृति — अंतिम स्वीकृति लंबित',
      filingDate: '2023-08-26',
      acknowledgement: '194009490190823',
      responsiblePerson: 'Ramesh Pandey / President',
      remarks: 'Provisional approval under Section 80G; final approval application submitted in July 2026 and final approval is pending.',
      remarksHi: 'धारा 80G के अंतर्गत अस्थायी स्वीकृति; अंतिम स्वीकृति हेतु आवेदन जुलाई 2026 में दाखिल, अंतिम स्वीकृति लंबित है।',
    },
  },
  {
    section: 'history',
    data: {
      date: '2013-12-30',
      eventType: 'Institution Formation / संस्था गठन',
      title: 'Swastik Srijan Foundation Samiti का गठन',
      referenceNo: '05/22/03/11448/13',
      description: 'Swastik Srijan Foundation Samiti का गठन 30-12-2013 को किया गया। संस्था मध्य प्रदेश सोसायटी रजिस्ट्रीकरण अधिनियम, 1973 के अंतर्गत पंजीकृत है तथा संस्था का कार्य क्षेत्र Pan India है।',
      supportingDocument: 'Registration Certificate',
      remarks: 'संस्था की स्थापना का प्रारंभिक ऐतिहासिक अभिलेख।',
    },
  },
  {
    section: 'history',
    data: {
      date: '2026-06-23',
      eventType: 'Tax Registration / कर पंजीकरण',
      title: '12AB Registration Granted / 12AB पंजीकरण स्वीकृत',
      referenceNo: 'AAKAS7123H25BP01',
      description: 'Registration granted under Section 12AB(1)(b). Applicable for AY 2024-25 to AY 2028-29.',
      supportingDocument: 'FORM NO. 10AD — DIN: ITBA/EXM/F/EXM44/2026-27/1090281579(1)',
      remarks: 'Permanent registration/approval record received on 23-06-2026.',
    },
  },
  {
    section: 'history',
    data: {
      date: '2023-08-26',
      eventType: 'Tax Approval / कर स्वीकृति',
      title: '80G Provisional Approval / 80G अस्थायी स्वीकृति',
      referenceNo: 'AAKAS7123HF20231',
      description: 'Provisional approval under Clause (iv) of the first proviso to Section 80G(5), applicable from AY 2024-25 to AY 2026-27.',
      supportingDocument: 'DIN: AAKAS7123HF2023101; Application No.: 194009490190823',
      remarks: 'Final approval applied for in July 2026; final approval pending.',
    },
  },
  {
    section: 'history',
    data: {
      date: '2025-07-19',
      eventType: 'CSR Registration / CSR पंजीकरण',
      title: 'Registration for Undertaking CSR Activities / CSR गतिविधियों हेतु पंजीकरण',
      referenceNo: 'CSR00093974',
      description: 'SWASTIK SRIJAN FOUNDATION SAMITI was registered for undertaking CSR activities by the Office of the Registrar of Companies, ROC Delhi, Ministry of Corporate Affairs, Government of India.',
      supportingDocument: 'MCA CSR Registration Approval Letter dated 19-07-2025; SRN: AB5525399',
      remarks: 'Approval is only for registration of the entity for undertaking CSR activities. No CSR funding has been received by the Foundation to date.',
    },
  },
];

async function seedOrgProfile() {
  const out = { created: 0, existing: 0, sections: [] };
  const existing = await models.ImsOrgProfile.findAll({ attributes: ['id', 'section', 'data'] });
  // Multi-record sections (calendar/history) hold several entries; dedupe on the
  // record's own content so re-seeding never duplicates a real compliance record.
  const signature = (section, data) => section + '|' + (data.complianceName || data.title || data.eventType || '');
  const seen = new Set(existing.map(r => signature(r.section, r.data || {})));
  const counters = {};
  for (const { section, data } of SECTIONS) {
    const sig = signature(section, data);
    if (seen.has(sig)) { out.existing++; continue; }
    counters[section] = (counters[section] || 0) + 1;
    await models.ImsOrgProfile.create({
      section,
      ...data,
      data,
      recordId: 'SSF-ORG-' + section.toUpperCase() + '-' + counters[section],
      status: 'active',
      createdByName: 'SSF Seed',
    });
    seen.add(sig);
    out.created++;
    out.sections.push(section);
  }
  return out;
}

module.exports = { seedOrgProfile, ORG_PROFILE_SECTIONS: SECTIONS };
