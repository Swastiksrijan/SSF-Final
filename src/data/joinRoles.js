// Every way a person can join Swastik Srijan Foundation, as a single flat list
// of labelled roles. Each role carries a stable slug so a share link like
// /Members?role=<slug> opens straight to that role's application form, and the
// backend records the requested role with the interest.
//
// The groups mirror the registered organisational structure: constitutional
// bodies, office bearers, advisory councils, departments, administrative
// levels and institution/project posts. A departmental or field post is a
// working assignment under the Managing Committee — it does not by itself make
// the holder a member of the Managing Committee.

export const JOIN_GROUPS = [
  { id: "membership", hi: "सदस्यता", en: "Membership", note: "संस्था की सदस्यता के प्रकार", form: "member" },
  { id: "volunteer", hi: "स्वयंसेवा एवं क्षेत्रीय सहयोग", en: "Volunteering & Field Support", note: "समय, कौशल और सेवा-भावना से जुड़िए", form: "volunteer" },
  { id: "committee", hi: "प्रबंध समिति एवं पदाधिकारी", en: "Managing Committee & Office Bearers", note: "नियमावली के अनुसार निर्वाचित पद", form: "role" },
  { id: "advisory", hi: "सलाहकार परिषद एवं विशेषज्ञ मंडल", en: "Advisory Councils & Expert Panels", note: "विषय विशेषज्ञों का सहयोग", form: "role" },
  { id: "department", hi: "विभाग एवं विभागीय प्रभारी", en: "Departments & In-charges", note: "मुख्य समिति के अधीन कार्यकारी विभाग", form: "role" },
  { id: "level", hi: "प्रशासनिक स्तर", en: "Administrative Levels", note: "मुख्य कार्यालय से ग्राम स्तर तक", form: "role" },
  { id: "institution", hi: "संस्थान एवं परियोजना", en: "Institutions & Projects", note: "विद्यालय, केंद्र और परियोजना पद", form: "role" },
  { id: "internship", hi: "इंटर्नशिप", en: "Internship", note: "अनुभव एवं कौशल अर्जन", form: "internship" },
];

const R = (group, slug, hi, en) => ({ group, slug, hi, en });

export const JOIN_ROLES = [
  // ---- Membership ----
  R("membership", "patron-member", "संरक्षक सदस्य", "Patron Member"),
  R("membership", "life-member", "आजीवन सदस्य", "Life Member"),
  R("membership", "ordinary-member", "साधारण सदस्य", "Ordinary Member"),
  R("membership", "advisory-member", "सलाहकार सदस्य", "Advisory Member"),

  // ---- Volunteering & field support ----
  R("volunteer", "volunteer", "स्वयंसेवक", "Volunteer"),
  R("volunteer", "community-worker", "सामुदायिक कार्यकर्ता", "Community Worker"),
  R("volunteer", "field-officer", "क्षेत्रीय कार्य अधिकारी", "Field Officer"),
  R("volunteer", "trainer", "प्रशिक्षक", "Trainer"),
  R("volunteer", "teacher", "शिक्षक", "Teacher"),
  R("volunteer", "block-volunteer-coordinator", "ब्लॉक स्वयंसेवक समन्वयक", "Block Volunteer Coordinator"),
  R("volunteer", "village-volunteer-coordinator", "ग्राम स्वयंसेवक समन्वयक", "Village Volunteer Coordinator"),

  // ---- Managing Committee & office bearers (per the registered rules) ----
  R("committee", "president", "अध्यक्ष", "President"),
  R("committee", "vice-president", "उपाध्यक्ष", "Vice President"),
  R("committee", "secretary", "सचिव", "Secretary"),
  R("committee", "joint-secretary", "संयुक्त सचिव", "Joint Secretary"),
  R("committee", "treasurer", "कोषाध्यक्ष", "Treasurer"),
  R("committee", "executive-member", "कार्यकारिणी सदस्य", "Executive Member"),

  // ---- Advisory councils & expert panels ----
  R("advisory", "national-advisory-council", "राष्ट्रीय सलाहकार परिषद", "National Advisory Council"),
  R("advisory", "education-advisory-panel", "शिक्षा सलाहकार मंडल", "Education Advisory Panel"),
  R("advisory", "health-advisory-panel", "स्वास्थ्य सलाहकार मंडल", "Health Advisory Panel"),
  R("advisory", "agriculture-environment-panel", "कृषि एवं पर्यावरण सलाहकार मंडल", "Agriculture & Environment Advisory Panel"),
  R("advisory", "finance-csr-panel", "वित्त एवं CSR सलाहकार मंडल", "Finance & CSR Advisory Panel"),
  R("advisory", "legal-advisory-panel", "विधिक सलाहकार मंडल", "Legal Advisory Panel"),
  R("advisory", "technical-advisory-panel", "तकनीकी सलाहकार मंडल", "Technical Advisory Panel"),
  R("advisory", "youth-advisory-council", "युवा सलाहकार परिषद", "Youth Advisory Council"),
  R("advisory", "women-advisory-council", "महिला सलाहकार परिषद", "Women Advisory Council"),
  R("advisory", "social-development-council", "सामाजिक विकास सलाहकार परिषद", "Social Development Advisory Council"),

  // ---- Departments & in-charges ----
  R("department", "education-department", "शिक्षा विभाग प्रमुख", "Education Department Head"),
  R("department", "women-child-department", "महिला एवं बाल विकास विभाग प्रमुख", "Women & Child Development Department Head"),
  R("department", "health-department", "स्वास्थ्य, पोषण एवं पुनर्वास विभाग प्रमुख", "Health, Nutrition & Rehabilitation Department Head"),
  R("department", "social-welfare-department", "सामाजिक कल्याण एवं समावेशी विकास विभाग प्रमुख", "Social Welfare & Inclusive Development Department Head"),
  R("department", "rural-development-department", "ग्रामीण एवं सामुदायिक विकास विभाग प्रमुख", "Rural & Community Development Department Head"),
  R("department", "agriculture-department", "कृषि, उद्यानिकी एवं जैविक खेती विभाग प्रमुख", "Agriculture, Horticulture & Organic Farming Department Head"),
  R("department", "animal-husbandry-department", "पशुपालन एवं पशु कल्याण विभाग प्रमुख", "Animal Husbandry & Animal Welfare Department Head"),
  R("department", "environment-department", "पर्यावरण, जल एवं प्राकृतिक संसाधन विभाग प्रमुख", "Environment, Water & Natural Resources Department Head"),
  R("department", "skill-employment-department", "कौशल, रोजगार एवं ग्रामोद्योग विभाग प्रमुख", "Skill, Employment & Village Industries Department Head"),
  R("department", "youth-sports-department", "युवा, खेल, संस्कृति एवं योग विभाग प्रमुख", "Youth, Sports, Culture & Yoga Department Head"),
  R("department", "csr-funding-department", "CSR, अनुदान एवं साझेदारी विभाग प्रमुख", "CSR, Grants & Partnerships Department Head"),
  R("department", "finance-accounts-department", "वित्त, लेखा एवं बजट विभाग समन्वयक", "Finance, Accounts & Budget Coordinator"),
  R("department", "legal-compliance-department", "विधिक, पंजीयन एवं अनुपालन विभाग समन्वयक", "Legal, Registration & Compliance Coordinator"),
  R("department", "media-communication-department", "मीडिया, संचार एवं जनसंपर्क विभाग प्रमुख", "Media, Communication & PR Department Head"),
  R("department", "it-digital-department", "आईटी, डिजिटल कार्यालय एवं MIS प्रभारी", "IT, Digital Office & MIS In-charge"),
  R("department", "hr-department", "मानव संसाधन एवं कर्मचारी प्रबंधन विभाग समन्वयक", "Human Resources & Personnel Management Coordinator"),
  R("department", "institutions-operations-department", "संस्थान, केंद्र एवं कार्यालय संचालन विभाग प्रमुख", "Institutions, Centres & Office Operations Department Head"),
  R("department", "quality-transparency-department", "गुणवत्ता, पारदर्शिता एवं शिकायत निवारण विभाग समन्वयक", "Quality, Transparency & Grievance Redressal Coordinator"),

  // ---- Administrative levels ----
  R("level", "head-office-administration", "मुख्य कार्यालय प्रशासन प्रभारी", "Head Office Administration In-charge"),
  R("level", "head-office-coordinator", "मुख्य कार्यालय संगठन समन्वयक", "Head Office Organization Coordinator"),
  R("level", "state-in-charge", "राज्य प्रभारी", "State In-charge"),
  R("level", "state-coordinator", "राज्य संगठन समन्वयक", "State Organization Coordinator"),
  R("level", "district-in-charge", "जिला प्रभारी", "District In-charge"),
  R("level", "district-coordinator", "जिला संगठन समन्वयक", "District Organization Coordinator"),
  R("level", "block-in-charge", "ब्लॉक प्रभारी", "Block In-charge"),
  R("level", "block-coordinator", "ब्लॉक संगठन समन्वयक", "Block Organization Coordinator"),
  R("level", "village-in-charge", "ग्राम प्रभारी", "Village In-charge"),
  R("level", "ward-city-coordinator", "वार्ड एवं नगर समन्वयक", "Ward & City Coordinator"),

  // ---- Institutions & projects ----
  R("institution", "institution-head", "संस्थान प्रमुख", "Institution Head"),
  R("institution", "school-principal", "विद्यालय प्राचार्य", "School Principal"),
  R("institution", "training-centre-incharge", "प्रशिक्षण केंद्र प्रभारी", "Training Centre In-charge"),
  R("institution", "service-centre-incharge", "सेवा केंद्र प्रभारी", "Service Centre In-charge"),
  R("institution", "project-director", "परियोजना निदेशक", "Project Director"),
  R("institution", "project-manager", "परियोजना प्रबंधक", "Project Manager"),
  R("institution", "project-coordinator", "परियोजना समन्वयक", "Project Coordinator"),
  R("institution", "programme-officer", "कार्यक्रम अधिकारी", "Programme Officer"),
  R("institution", "office-assistant", "कार्यालय सहायक", "Office Assistant"),
  R("institution", "accounts-assistant", "लेखा सहायक", "Accounts Assistant"),
  R("institution", "technical-assistant", "तकनीकी सहायक", "Technical Assistant"),

  // ---- Internship ----
  R("internship", "intern", "इंटर्नशिप", "Internship"),
];

export const findRole = slug => JOIN_ROLES.find(r => r.slug === slug);
export const findGroup = id => JOIN_GROUPS.find(g => g.id === id);
