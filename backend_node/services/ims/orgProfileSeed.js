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
      vision: 'An inclusive, educated, healthy, self-reliant and harmonious society where every person can live with dignity, equal opportunity and the ability to participate in sustainable development.',
      visionHi: 'एक समावेशी, शिक्षित, स्वस्थ, आत्मनिर्भर एवं सामंजस्यपूर्ण समाज, जहाँ प्रत्येक व्यक्ति सम्मान, समान अवसर एवं सतत विकास में सहभागिता के साथ जीवन जी सके।',
      mission: 'To work across India for education, health and well-being, livelihood and self-reliance, women and child empowerment, rural development, environmental protection and social awareness through community participation, capacity building, lawful partnerships and transparent organisational practices.',
      missionHi: 'समुदाय सहभागिता, क्षमता निर्माण, विधिक साझेदारी एवं पारदर्शी संस्थागत प्रथाओं के माध्यम से शिक्षा, स्वास्थ्य एवं कल्याण, आजीविका एवं आत्मनिर्भरता, महिला एवं बाल सशक्तिकरण, ग्रामीण विकास, पर्यावरण संरक्षण तथा सामाजिक जागरूकता के लिए सम्पूर्ण भारत में कार्य करना।',
      coreValues: 'Humanity & Truth; Equality & Dignity; Social Harmony; Responsibility; Transparency; Community Participation; Service with Integrity',
      coreValuesHi: 'मानवता एवं सत्य; समानता एवं सम्मान; सामाजिक सामंजस्य; उत्तरदायित्व; पारदर्शिता; समुदाय सहभागिता; सत्यनिष्ठा से सेवा',
      objectives: 'Promote education and skill development; improve health, nutrition and well-being; support women, children, elderly persons and persons with disabilities; strengthen rural development, livelihoods, agriculture and self-reliance; promote environmental and natural-resource conservation; encourage social harmony, ethical values, equality and responsible citizenship; support lawful government and institutional programmes aligned with the Foundation\'s objectives.',
      objectivesHi: 'शिक्षा एवं कौशल विकास को बढ़ावा देना; स्वास्थ्य, पोषण एवं कल्याण में सुधार; महिलाओं, बच्चों, वृद्धजनों एवं दिव्यांगजनों का सहयोग; ग्रामीण विकास, आजीविका, कृषि एवं आत्मनिर्भरता को सुदृढ़ करना; पर्यावरण एवं प्राकृतिक संसाधन संरक्षण को बढ़ावा देना; सामाजिक सामंजस्य, नैतिक मूल्यों, समानता एवं उत्तरदायी नागरिकता को प्रोत्साहित करना; संस्था के उद्देश्यों के अनुरूप विधिक सरकारी एवं संस्थागत कार्यक्रमों का सहयोग करना।',
      areasOfWork: 'Education & Skill Development; Health, Nutrition & Wellness; Women & Child Welfare; Rural Development & Livelihood; Agriculture, Organic Farming & Animal Welfare; Environment, Tree Plantation & Natural Resource Conservation; Disability Support & Rehabilitation; Youth & Community Development; Social Awareness, Ethical Values & Social Harmony',
      areasOfWorkHi: 'शिक्षा एवं कौशल विकास; स्वास्थ्य, पोषण एवं कल्याण; महिला एवं बाल कल्याण; ग्रामीण विकास एवं आजीविका; कृषि, जैविक खेती एवं पशु कल्याण; पर्यावरण, वृक्षारोपण एवं प्राकृतिक संसाधन संरक्षण; दिव्यांगजन सहयोग एवं पुनर्वास; युवा एवं समुदाय विकास; सामाजिक जागरूकता, नैतिक मूल्य एवं सामाजिक सामंजस्य',
      targetBeneficiaries: 'Children; women; elderly persons; persons with disabilities; farmers; rural and economically disadvantaged communities; tribal, backward, remote and underserved communities; youth; families and other persons needing lawful social support.',
      targetBeneficiariesHi: 'बच्चे; महिलाएँ; वृद्धजन; दिव्यांगजन; किसान; ग्रामीण एवं आर्थिक रूप से वंचित समुदाय; जनजातीय, पिछड़े, दूरस्थ एवं अल्प-सुविधा प्राप्त समुदाय; युवा; परिवार एवं अन्य व्यक्ति जिन्हें विधिक सामाजिक सहयोग की आवश्यकता है।',
      statesDistricts: 'All India / Pan India',
      statesDistrictsHi: 'सम्पूर्ण भारत',
    },
  },
  {
    section: 'legal',
    data: {
      registrationNumber: '05/22/03/11448/13',
      registrationDate: '30-12-2013',
      registrationAct: 'Madhya Pradesh Societies Registration Act, 1973',
      registrationActHi: 'मध्य प्रदेश सोसाइटी पंजीकरण अधिनियम, 1973',
      district: 'Rewa',
      districtHi: 'रीवा',
      state: 'Madhya Pradesh',
      pan: 'AAKAS7123H',
      governingDocument: 'Memorandum / Rules & Regulations (Niyamavali) of Swastik Srijan Foundation Samiti',
      governingDocumentHi: 'स्वास्तिक सृजन फाउंडेशन समिति का स्मरण-पत्र / नियम एवं विनियम (नियमावली)',
      amendmentHistory: 'To be updated from registered amendment records, if any.',
      amendmentHistoryHi: 'यदि कोई पंजीकृत संशोधन अभिलेख हों तो उनसे अद्यतन किया जाए।',
    },
  },
  {
    section: 'tax',
    data: {
      pan: 'AAKAS7123H',
      twelveAB: 'AAKAS7123H25BP01',
      twelveABStatus: 'Available / Registered',
      twelveABStatusHi: 'उपलब्ध / पंजीकृत',
      eightyG: 'AAKAS7123HF20231',
      eightyGStatus: 'Provisional / final status to be updated from current certificate/order',
      eightyGStatusHi: 'तात्कालिक / अंतिम स्थिति वर्तमान प्रमाणपत्र/आदेश से अद्यतन की जाए',
      assessmentYear: '2025-26',
      effectiveDates: 'To be updated from respective registration / approval documents',
      effectiveDatesHi: 'संबंधित पंजीकरण / अनुमोदन दस्तावेज़ों से अद्यतन किया जाए',
      incomeTaxFiling: 'To be updated from filed return / acknowledgement records',
      incomeTaxFilingHi: 'दाखिल विवरणी / पावती अभिलेखों से अद्यतन किया जाए',
    },
  },
  {
    section: 'darpan',
    data: {
      ngoDarpanId: 'MP/2017/0169529',
      darpanStatus: 'Active',
      darpanStatusHi: 'सक्रिय',
      csr1Number: 'CSR00093974',
      csrStatus: 'Registered',
      csrStatusHi: 'पंजीकृत',
      mcaCsrRecords: 'CSR-1 registered. No CSR funding received by the Foundation is to be recorded unless supported by actual documents.',
      mcaCsrRecordsHi: 'CSR-1 पंजीकृत। संस्था द्वारा प्राप्त कोई भी CSR निधि तब तक दर्ज न की जाए जब तक वास्तविक दस्तावेज़ों से समर्थित न हो।',
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
      members: 'Sandeep Tripathi; Prameesh Singh; Rishi Kumar Pandey; Ritesh Kumar Tiwari',
      rolesTenure: 'Governing Body structure as per registered Niyamavali: President, Vice President, Secretary, Treasurer, Joint Secretary and Members. Committee tenure and appointment references should be updated from approved resolutions/records.',
      rolesTenureHi: 'पंजीकृत नियमावली के अनुसार शासी निकाय संरचना: अध्यक्ष, उपाध्यक्ष, सचिव, कोषाध्यक्ष, संयुक्त सचिव एवं सदस्य। समिति का कार्यकाल एवं नियुक्ति संदर्भ अनुमोदित संकल्पों/अभिलेखों से अद्यतन किए जाएँ।',
    },
  },
  {
    section: 'finance',
    data: {
      financialYear: '2025-26',
      bankName: 'Union Bank of India',
      bankNameHi: 'यूनियन बैंक ऑफ इंडिया',
      branch: 'Transport Nagar, Rewa',
      branchHi: 'ट्रांसपोर्ट नगर, रीवा',
      accountNumber: '481401010036579',
      ifsc: 'UBIN0548146',
      upi: '9718346691@ptyes',
      auditorName: 'CA Kapil Tiwari',
      auditorContact: '8527067812',
      booksStatus: 'Audited accounts and supporting records are maintained as available. FY 2025-26 internal reconciliation / record completion can be updated here with audit references.',
      booksStatusHi: 'लेखा-परीक्षित लेखे एवं सहायक अभिलेख उपलब्धता के अनुसार संधारित हैं। वित्तीय वर्ष 2025-26 की आंतरिक मिलान / अभिलेख पूर्णता यहाँ लेखा संदर्भों के साथ अद्यतन की जा सकती है।',
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
      complianceName: 'Annual statutory / regulatory filings and renewals',
      complianceNameHi: 'वार्षिक सांविधिक / नियामक विवरणियाँ एवं नवीनीकरण',
      authority: 'Registrar / Income Tax / NGO Darpan / MCA or other applicable authority',
      dueDate: '',
      financialYear: '2025-26',
      status: 'Pending — update each compliance item with its actual due date and filing acknowledgement',
      filingDate: '',
      acknowledgement: '',
      responsiblePerson: 'Secretary / authorised compliance person',
      remarks: 'Create separate calendar records for each applicable filing, renewal, notice or compliance event.',
      remarksHi: 'प्रत्येक लागू विवरणी, नवीनीकरण, नोटिस या अनुपालन घटना के लिए अलग कैलेंडर रिकॉर्ड बनाएँ।',
    },
  },
  {
    section: 'history',
    data: {
      date: new Date().toISOString().slice(0, 10),
      eventType: 'Institution Formation / Compliance Record',
      title: 'Swastik Srijan Foundation Samiti — Institutional Profile',
      titleHi: 'स्वास्तिक सृजन फाउंडेशन समिति — संस्थागत परिचय',
      referenceNo: '05/22/03/11448/13',
      description: 'Registered on 30-12-2013 under the Madhya Pradesh Societies Registration Act, 1973. Institutional profile and compliance records are maintained in SSF-IMS.',
      descriptionHi: '30-12-2013 को मध्य प्रदेश सोसाइटी पंजीकरण अधिनियम, 1973 के अंतर्गत पंजीकृत। संस्थागत परिचय एवं अनुपालन अभिलेख SSF-IMS में संधारित हैं।',
      supportingDocument: 'Registered Rules / Niyamavali; Registration Certificate; statutory certificates and filings',
      remarks: 'Add future amendments, registrations, notices, renewals, certificates and compliance events here with their source documents.',
      remarksHi: 'भविष्य के संशोधन, पंजीकरण, नोटिस, नवीनीकरण, प्रमाणपत्र एवं अनुपालन घटनाएँ उनके स्रोत दस्तावेज़ों सहित यहाँ जोड़ें।',
    },
  },
];

async function seedOrgProfile() {
  const out = { created: 0, existing: 0, sections: [] };
  for (const { section, data } of SECTIONS) {
    const found = await models.ImsOrgProfile.findOne({ where: { section } });
    if (found) { out.existing++; continue; }
    await models.ImsOrgProfile.create({
      section,
      ...data,
      data,
      recordId: 'SSF-ORG-' + section.toUpperCase(),
      status: 'active',
      createdByName: 'SSF Seed',
    });
    out.created++;
    out.sections.push(section);
  }
  return out;
}

module.exports = { seedOrgProfile, ORG_PROFILE_SECTIONS: SECTIONS };
