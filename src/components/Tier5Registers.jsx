// SSF Digital Office — Tier 5: Compliance (COMP-04..10), Governance (GOVN-01..07),
// Donor management (DONR-01..05) and Risk / internal control (RISK-01..05).
//
// Every register is a thin RegisterEngine wrapper via the shared factory, so it
// carries bilingual headers + versioned Edit + archive/restore + FY filter +
// CSV/PDF. Where a feature does not apply yet (FCRA, GST, payroll), the record's
// status field keeps "Not Applicable Yet" instead of deleting the register.
import { makeRegister } from "./registerFactory";

export const FCRA_DEF = {
  id: "fcra", codeKey: "fcra-fc4-fc3",
  title: "FCRA FC-4 / FC-3 Register", titleHi: "एफ.सी.आर.ए. रजिस्टर",
  intro: "Foreign contribution annual (FC-4) / quarterly (FC-3) filing — FCRA registered ho to; nahi to 'Not Applicable Yet'.",
  dateKey: "filedDate", amountKey: "foreignReceipts",
  fields: [
    { k: "fcraType", l: "Filing Type", lHi: "फाइलिंग प्रकार", t: "select", req: true, o: ["FC-4 Annual Return", "FC-3 Quarterly", "FCRA Renewal", "Other"] },
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text", req: true },
    { k: "period", l: "Period", lHi: "अवधि", t: "text" },
    { k: "dueDate", l: "Due Date", lHi: "देय दिनांक", t: "date" },
    { k: "filedDate", l: "Filed Date", lHi: "दाखिल दिनांक", t: "date" },
    { k: "acknowledgementNo", l: "Acknowledgement No.", lHi: "पावती क्रमांक", t: "text" },
    { k: "foreignReceipts", l: "Foreign Receipts (₹)", lHi: "विदेशी प्राप्ति (₹)", t: "number" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Pending", "Filed", "Not Applicable Yet"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const DONOR80G_DEF = {
  id: "donor80g", codeKey: "donor-80g-receipt",
  title: "Donor 80G Receipt Register", titleHi: "80G रसीद रजिस्टर",
  intro: "80G certificate donor ko jari hua ya nahi — PAN, receipt no. aur amount ke saath.",
  dateKey: "receiptDate", amountKey: "amount",
  fields: [
    { k: "donorName", l: "Donor Name", lHi: "दानदाता नाम", t: "text", req: true },
    { k: "pan", l: "PAN", lHi: "पैन", t: "text" },
    { k: "receiptNo", l: "Receipt No.", lHi: "रसीद क्रमांक", t: "text", req: true },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "mode", l: "Mode", lHi: "माध्यम", t: "select", o: ["Cash", "Cheque", "Bank", "UPI", "Other"] },
    { k: "receiptDate", l: "Receipt Date", lHi: "रसीद दिनांक", t: "date" },
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text" },
    { k: "certificateIssued", l: "80G Certificate Issued", lHi: "80G प्रमाणपत्र जारी", t: "select", o: ["Yes", "No", "Pending"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const COMPLIANCE_CALENDAR_DEF = {
  id: "complianceCalendar", codeKey: "compliance-calendar",
  title: "Compliance Calendar / Due-date Register", titleHi: "अनुपालन कैलेंडर",
  intro: "Har statutory deadline ek jagah — kaun, kab, aur complete hua ya nahi.",
  dateKey: "dueDate", amountKey: null,
  fields: [
    { k: "compliance", l: "Compliance / Filing", lHi: "अनुपालन / फाइलिंग", t: "text", req: true },
    { k: "category", l: "Category", lHi: "श्रेणी", t: "select", o: ["Income Tax", "FCRA", "GST", "ROC / MCA", "Society", "TDS", "Other"] },
    { k: "dueDate", l: "Due Date", lHi: "देय दिनांक", t: "date", req: true },
    { k: "frequency", l: "Frequency", lHi: "आवृत्ति", t: "select", o: ["Monthly", "Quarterly", "Half-yearly", "Annual", "One-time"] },
    { k: "responsible", l: "Responsible Person", lHi: "उत्तरदायी व्यक्ति", t: "text" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Pending", "Completed", "Overdue", "Not Applicable Yet"] },
    { k: "completedDate", l: "Completed Date", lHi: "पूर्ण दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const LEGAL_CASE_DEF = {
  id: "legalCase", codeKey: "legal-statutory-case",
  title: "Legal & Statutory Case Register", titleHi: "विधिक वाद रजिस्टर",
  intro: "Court / authority me chal rahe kisi bhi vaad ka record — status, next hearing, advocate.",
  dateKey: "filingDate", amountKey: "amountInvolved",
  fields: [
    { k: "caseNo", l: "Case No.", lHi: "वाद क्रमांक", t: "text", req: true },
    { k: "matter", l: "Matter", lHi: "विषय", t: "text", req: true },
    { k: "courtAuthority", l: "Court / Authority", lHi: "न्यायालय / प्राधिकरण", t: "text" },
    { k: "caseType", l: "Type", lHi: "प्रकार", t: "select", o: ["Civil", "Criminal", "Tax", "Labour", "Consumer", "Other"] },
    { k: "filingDate", l: "Filing Date", lHi: "दायर दिनांक", t: "date" },
    { k: "nextHearingDate", l: "Next Hearing", lHi: "अगली सुनवाई", t: "date" },
    { k: "amountInvolved", l: "Amount Involved (₹)", lHi: "संबंधित राशि (₹)", t: "number" },
    { k: "advocate", l: "Advocate", lHi: "अधिवक्ता", t: "text" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Filed", "Hearing", "Won", "Lost", "Settled", "Withdrawn"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const PROPERTY_LEASE_DEF = {
  id: "propertyLease", codeKey: "property-lease-utilities",
  title: "Property / Lease & Utilities Register", titleHi: "संपत्ति / पट्टा रजिस्टर",
  intro: "Office/space owned, rented ya licensed — lease dates, rent aur utility bills.",
  dateKey: "leaseStart", amountKey: "rentAmount",
  fields: [
    { k: "property", l: "Property / Premises", lHi: "संपत्ति / परिसर", t: "text", req: true },
    { k: "propertyType", l: "Type", lHi: "प्रकार", t: "select", o: ["Owned", "Rented / Leased", "Licensed", "Other"] },
    { k: "address", l: "Address", lHi: "पता", t: "text", full: true },
    { k: "owner", l: "Owner / Landlord", lHi: "स्वामी / मकान मालिक", t: "text" },
    { k: "leaseStart", l: "Lease Start", lHi: "पट्टा प्रारंभ", t: "date" },
    { k: "leaseEnd", l: "Lease End", lHi: "पट्टा समाप्ति", t: "date" },
    { k: "rentAmount", l: "Rent (₹)", lHi: "किराया (₹)", t: "number" },
    { k: "utilityType", l: "Utility", lHi: "उपयोगिता", t: "select", o: ["Electricity", "Water", "Internet", "Telephone", "Other"] },
    { k: "billAmount", l: "Latest Bill (₹)", lHi: "नवीनतम बिल (₹)", t: "number" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const RELATED_PARTY_DEF = {
  id: "relatedParty", codeKey: "related-party-conflict",
  title: "Related-Party & Conflict of Interest", titleHi: "संबंधित पक्ष एवं हित-संघर्ष",
  intro: "Office-bearer / committee / employee se juda koi bhi len-den — declaration aur mitigation ke saath.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "personName", l: "Person Name", lHi: "व्यक्ति नाम", t: "text", req: true },
    { k: "relation", l: "Relation", lHi: "संबंध", t: "select", o: ["Office Bearer", "Committee Member", "Employee", "Volunteer", "Family of Above", "Vendor", "Other"] },
    { k: "transactionType", l: "Transaction Type", lHi: "लेन-देन प्रकार", t: "select", o: ["Purchase", "Sale", "Service", "Rent", "Loan", "Donation", "Other"] },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "conflictDeclared", l: "Conflict Declared", lHi: "हित-संघर्ष घोषित", t: "select", o: ["Yes", "No", "Not Applicable"] },
    { k: "mitigation", l: "Mitigation / Note", lHi: "उपाय / टिप्पणी", t: "text", full: true },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const LICENCE_DEF = {
  id: "licence", codeKey: "licence-renewal",
  title: "Licence & Renewal Register", titleHi: "अनुज्ञप्ति एवं नवीनीकरण रजिस्टर",
  intro: "Har licence ka number, expiry aur renewal — expire hone se pehle alert.",
  dateKey: "expiryDate", amountKey: "renewalFee",
  fields: [
    { k: "licenceName", l: "Licence / Permission", lHi: "अनुज्ञप्ति / अनुमति", t: "text", req: true },
    { k: "authority", l: "Issuing Authority", lHi: "जारीकर्ता प्राधिकरण", t: "text" },
    { k: "licenceNo", l: "Licence No.", lHi: "अनुज्ञप्ति क्रमांक", t: "text" },
    { k: "issueDate", l: "Issue Date", lHi: "जारी दिनांक", t: "date" },
    { k: "expiryDate", l: "Expiry Date", lHi: "समाप्ति दिनांक", t: "date" },
    { k: "renewalFee", l: "Renewal Fee (₹)", lHi: "नवीनीकरण शुल्क (₹)", t: "number" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Expiring Soon", "Expired", "Renewed", "Not Applicable Yet"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const AGM_MINUTES_DEF = {
  id: "agmMinutes", codeKey: "agm-general-body-minutes",
  title: "AGM / General Body Minutes", titleHi: "आम सभा कार्यवृत्त",
  intro: "Annual / special general body meeting ka karyavritt — agenda, nirnay aur quorum.",
  dateKey: "meetingDate", amountKey: null,
  fields: [
    { k: "meetingDate", l: "Meeting Date", lHi: "बैठक दिनांक", t: "date", req: true },
    { k: "venue", l: "Venue", lHi: "स्थान", t: "text" },
    { k: "agenda", l: "Agenda", lHi: "कार्यसूची", t: "text", full: true },
    { k: "decisions", l: "Decisions / Resolutions", lHi: "निर्णय / संकल्प", t: "text", full: true },
    { k: "quorumMet", l: "Quorum Met", lHi: "कोरम पूर्ण", t: "select", o: ["Yes", "No"] },
    { k: "membersPresent", l: "Members Present", lHi: "उपस्थित सदस्य", t: "number" },
    { k: "chairperson", l: "Chairperson", lHi: "अध्यक्ष", t: "text" },
    { k: "nextMeetingDate", l: "Next Meeting", lHi: "अगली बैठक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const EC_MINUTES_DEF = {
  id: "ecMinutes", codeKey: "executive-committee-minutes",
  title: "Executive Committee Minutes", titleHi: "कार्यकारिणी कार्यवृत्त",
  intro: "Managing / executive committee ki baithak ka karyavritt.",
  dateKey: "meetingDate", amountKey: null,
  fields: [
    { k: "meetingDate", l: "Meeting Date", lHi: "बैठक दिनांक", t: "date", req: true },
    { k: "venue", l: "Venue", lHi: "स्थान", t: "text" },
    { k: "agenda", l: "Agenda", lHi: "कार्यसूची", t: "text", full: true },
    { k: "decisions", l: "Decisions", lHi: "निर्णय", t: "text", full: true },
    { k: "membersPresent", l: "Members Present", lHi: "उपस्थित सदस्य", t: "number" },
    { k: "chairperson", l: "Chairperson", lHi: "अध्यक्ष", t: "text" },
    { k: "nextMeetingDate", l: "Next Meeting", lHi: "अगली बैठक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const RESOLUTION_DEF = {
  id: "resolution", codeKey: "resolution-register",
  title: "Resolution Register", titleHi: "संकल्प रजिस्टर",
  intro: "Board/committee dwara paas har resolution — rent, budget, bank, appointment…",
  dateKey: "resolutionDate", amountKey: null,
  fields: [
    { k: "resolutionNo", l: "Resolution No.", lHi: "संकल्प क्रमांक", t: "text", req: true },
    { k: "resolutionDate", l: "Date", lHi: "दिनांक", t: "date", req: true },
    { k: "subject", l: "Subject", lHi: "विषय", t: "text", req: true },
    { k: "resolutionType", l: "Type", lHi: "प्रकार", t: "select", o: ["Rent", "Budget", "Bank Operation", "Investment", "Policy", "Appointment", "Project", "Other"] },
    { k: "decision", l: "Decision", lHi: "निर्णय", t: "text", full: true },
    { k: "movedBy", l: "Moved By", lHi: "प्रस्तावक", t: "text" },
    { k: "secondedBy", l: "Seconded By", lHi: "अनुमोदक", t: "text" },
    { k: "effectiveDate", l: "Effective Date", lHi: "प्रभावी दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Passed", "Deferred", "Rejected", "Implemented"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const DELEGATION_DEF = {
  id: "delegation", codeKey: "delegation-of-authority",
  title: "Delegation of Authority Register", titleHi: "अधिकार प्रत्यायोजन रजिस्टर",
  intro: "Kisko kitni financial / operational authority di gayi — maker-checker control.",
  dateKey: "validFrom", amountKey: "limitAmount",
  fields: [
    { k: "authorityType", l: "Authority Type", lHi: "अधिकार प्रकार", t: "select", o: ["Financial Approval", "Bank Operation", "Signing", "Procurement", "HR", "Other"] },
    { k: "delegateName", l: "Delegate Name", lHi: "प्रत्यायोजित व्यक्ति", t: "text", req: true },
    { k: "designation", l: "Designation", lHi: "पद", t: "text" },
    { k: "limitAmount", l: "Limit (₹)", lHi: "सीमा (₹)", t: "number" },
    { k: "validFrom", l: "Valid From", lHi: "मान्य प्रारंभ", t: "date" },
    { k: "validTo", l: "Valid To", lHi: "मान्य तक", t: "date" },
    { k: "approvedBy", l: "Approved By", lHi: "स्वीकृत", t: "text" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const POLICY_DEF = {
  id: "policy", codeKey: "policy-register",
  title: "Policy Register", titleHi: "नीति रजिस्टर",
  intro: "Finance / HR / procurement / IT niyam — version, approval aur review date ke saath.",
  dateKey: "approvedDate", amountKey: null,
  fields: [
    { k: "policyName", l: "Policy Name", lHi: "नीति नाम", t: "text", req: true },
    { k: "category", l: "Category", lHi: "श्रेणी", t: "select", o: ["Finance", "HR", "Procurement", "Programme", "IT / Data", "Governance", "Other"] },
    { k: "version", l: "Version", lHi: "संस्करण", t: "text" },
    { k: "approvedDate", l: "Approved Date", lHi: "स्वीकृत दिनांक", t: "date" },
    { k: "approvedBy", l: "Approved By", lHi: "स्वीकृत", t: "text" },
    { k: "reviewDate", l: "Next Review", lHi: "अगली समीक्षा", t: "date" },
    { k: "documentRef", l: "Document Reference", lHi: "दस्तावेज़ संदर्भ", t: "text" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Under Review", "Superseded", "Draft"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const MEMBER_REGISTER_DEF = {
  id: "memberRegister", codeKey: "member-register-governance",
  title: "Member Register (Society Annual List)", titleHi: "सदस्य रजिस्टर (वार्षिक सूची)",
  intro: "Society ke annual member list ka statutory record.",
  dateKey: "joinDate", amountKey: null,
  fields: [
    { k: "memberId", l: "Member ID", lHi: "सदस्य आई.डी.", t: "text", req: true },
    { k: "name", l: "Name", lHi: "नाम", t: "text", req: true },
    { k: "membershipType", l: "Membership Type", lHi: "सदस्यता प्रकार", t: "select", o: ["Founder", "Life", "General", "Associate", "Honorary"] },
    { k: "joinDate", l: "Join Date", lHi: "शामिल होने की तिथि", t: "date" },
    { k: "contact", l: "Contact", lHi: "संपर्क", t: "text" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Inactive", "Resigned", "Expired"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const OFFICE_BEARER_DEF = {
  id: "officeBearer", codeKey: "office-bearer-committee",
  title: "Office-Bearer / Committee Register", titleHi: "पदाधिकारी रजिस्टर",
  intro: "Kaun kis pad par, kis term me, aur signatory hai ya nahi.",
  dateKey: "termFrom", amountKey: null,
  fields: [
    { k: "name", l: "Name", lHi: "नाम", t: "text", req: true },
    { k: "position", l: "Position", lHi: "पद", t: "select", o: ["President", "Vice-President", "Secretary", "Treasurer", "Joint Secretary", "Executive Member", "Other"] },
    { k: "memberId", l: "Member ID", lHi: "सदस्य आई.डी.", t: "text" },
    { k: "termFrom", l: "Term From", lHi: "कार्यकाल प्रारंभ", t: "date" },
    { k: "termTo", l: "Term To", lHi: "कार्यकाल तक", t: "date" },
    { k: "isSignatory", l: "Bank Signatory", lHi: "बैंक हस्ताक्षरकर्ता", t: "select", o: ["Yes", "No"] },
    { k: "contact", l: "Contact", lHi: "संपर्क", t: "text" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Current", "Former"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const DONOR_MASTER_DEF = {
  id: "donorMaster", codeKey: "donor-master",
  title: "Donor Master", titleHi: "दानदाता मास्टर",
  intro: "Har donor ka ek master record — 80G, PAN aur cumulative donation history.",
  dateKey: "firstDonationDate", amountKey: "cumulativeAmount",
  fields: [
    { k: "donorName", l: "Donor Name", lHi: "दानदाता नाम", t: "text", req: true },
    { k: "donorType", l: "Donor Type", lHi: "दानदाता प्रकार", t: "select", o: ["Individual", "Corporate", "Trust / Foundation", "Government", "Institutional", "Other"] },
    { k: "pan", l: "PAN", lHi: "पैन", t: "text" },
    { k: "contact", l: "Contact", lHi: "संपर्क", t: "text" },
    { k: "address", l: "Address", lHi: "पता", t: "text", full: true },
    { k: "firstDonationDate", l: "First Donation", lHi: "पहला दान", t: "date" },
    { k: "cumulativeAmount", l: "Cumulative Amount (₹)", lHi: "कुल राशि (₹)", t: "number" },
    { k: "has80G", l: "80G Eligible", lHi: "80G पात्र", t: "select", o: ["Yes", "No", "Pending"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const GRANT_AGREEMENT_DEF = {
  id: "grantAgreement", codeKey: "grant-agreement",
  title: "Grant Agreement Register", titleHi: "अनुदान करार रजिस्टर",
  intro: "Grant ke terms & conditions, reporting frequency aur status ka record.",
  dateKey: "agreementDate", amountKey: "amount",
  fields: [
    { k: "grantor", l: "Grantor", lHi: "अनुदानकर्ता", t: "text", req: true },
    { k: "agreementNo", l: "Agreement No.", lHi: "करार क्रमांक", t: "text" },
    { k: "agreementDate", l: "Agreement Date", lHi: "करार दिनांक", t: "date" },
    { k: "project", l: "Project", lHi: "परियोजना", t: "text" },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number" },
    { k: "period", l: "Period", lHi: "अवधि", t: "text" },
    { k: "terms", l: "Terms & Conditions", lHi: "नियम एवं शर्तें", t: "text", full: true },
    { k: "ucRequired", l: "UC Required", lHi: "उपयोग प्रमाणपत्र आवश्यक", t: "select", o: ["Yes", "No"] },
    { k: "reportingFrequency", l: "Reporting Frequency", lHi: "रिपोर्टिंग आवृत्ति", t: "select", o: ["Monthly", "Quarterly", "Half-yearly", "Annual"] },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Completed", "Terminated"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const UC_DEF = {
  id: "utilisationCertificate", codeKey: "utilisation-certificate",
  title: "Utilisation Certificate Register", titleHi: "उपयोग प्रमाणपत्र रजिस्टर",
  intro: "Grantor ko diya gaya UC — kitna praapt, kitna upyog, kitna shesh.",
  dateKey: "ucDate", amountKey: "amountUtilised",
  fields: [
    { k: "grantor", l: "Grantor", lHi: "अनुदानकर्ता", t: "text", req: true },
    { k: "grantRef", l: "Grant Reference", lHi: "अनुदान संदर्भ", t: "text" },
    { k: "ucNo", l: "UC No.", lHi: "प्रमाणपत्र क्रमांक", t: "text" },
    { k: "ucDate", l: "UC Date", lHi: "प्रमाणपत्र दिनांक", t: "date" },
    { k: "periodFrom", l: "Period From", lHi: "अवधि से", t: "date" },
    { k: "periodTo", l: "Period To", lHi: "अवधि तक", t: "date" },
    { k: "amountUtilised", l: "Amount Utilised (₹)", lHi: "उपयोग राशि (₹)", t: "number", req: true },
    { k: "balanceAmount", l: "Balance (₹)", lHi: "शेष (₹)", t: "number" },
    { k: "submittedTo", l: "Submitted To", lHi: "प्रस्तुत", t: "text" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Pending", "Submitted", "Accepted", "Queried"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const DONOR_REPORTING_DEF = {
  id: "donorReporting", codeKey: "donor-reporting-calendar",
  title: "Donor Reporting Calendar", titleHi: "दानदाता रिपोर्टिंग कैलेंडर",
  intro: "Donor/grantor ko bhejni wali har report ka due date aur status.",
  dateKey: "dueDate", amountKey: null,
  fields: [
    { k: "reportName", l: "Report Name", lHi: "रिपोर्ट नाम", t: "text", req: true },
    { k: "donor", l: "Donor / Grantor", lHi: "दानदाता / अनुदानकर्ता", t: "text" },
    { k: "reportType", l: "Report Type", lHi: "रिपोर्ट प्रकार", t: "select", o: ["Utilisation Certificate", "Progress Report", "Financial Report", "Impact Report", "Other"] },
    { k: "dueDate", l: "Due Date", lHi: "देय दिनांक", t: "date" },
    { k: "submittedDate", l: "Submitted Date", lHi: "प्रस्तुत दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Pending", "Submitted", "Overdue", "Not Applicable Yet"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const FOREIGN_DONOR_DEF = {
  id: "foreignDonor", codeKey: "foreign-donor",
  title: "Foreign Donor Register (FCRA)", titleHi: "विदेशी दानदाता रजिस्टर",
  intro: "Videsh se praapt contribution — FCRA registered ho to; nahi to 'Not Applicable Yet'.",
  dateKey: "receiptDate", amountKey: "amount",
  fields: [
    { k: "donorName", l: "Donor Name", lHi: "दानदाता नाम", t: "text", req: true },
    { k: "country", l: "Country", lHi: "देश", t: "text" },
    { k: "fcraRef", l: "FCRA Reference", lHi: "एफ.सी.आर.ए. संदर्भ", t: "text" },
    { k: "amount", l: "Amount", lHi: "राशि", t: "number", req: true },
    { k: "currency", l: "Currency", lHi: "मुद्रा", t: "select", o: ["USD", "EUR", "GBP", "Other"] },
    { k: "purpose", l: "Purpose", lHi: "उद्देश्य", t: "text", full: true },
    { k: "receiptDate", l: "Receipt Date", lHi: "प्राप्ति दिनांक", t: "date" },
    { k: "mode", l: "Mode", lHi: "माध्यम", t: "select", o: ["Bank Transfer", "Other"] },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Received", "Pending", "Not Applicable Yet"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const SOD_DEF = {
  id: "segregationOfDuties", codeKey: "segregation-of-duties",
  title: "Segregation-of-Duties Matrix", titleHi: "कार्य पृथक्करण मैट्रिक्स",
  intro: "Kaun kaam karta hai aur kaun check karta hai — internal control ka aadhaar.",
  dateKey: "reviewDate", amountKey: null,
  fields: [
    { k: "process", l: "Process", lHi: "प्रक्रिया", t: "text", req: true },
    { k: "riskArea", l: "Risk Area", lHi: "जोखिम क्षेत्र", t: "select", o: ["Cash Handling", "Banking", "Procurement", "Payroll", "Donations", "Approvals", "Other"] },
    { k: "makerRole", l: "Maker Role", lHi: "कर्ता भूमिका", t: "text" },
    { k: "checkerRole", l: "Checker Role", lHi: "जाँच भूमिका", t: "text" },
    { k: "segregationStatus", l: "Segregation", lHi: "पृथक्करण", t: "select", o: ["Adequate", "Weak", "Compensating Control", "Not Applicable"] },
    { k: "reviewDate", l: "Review Date", lHi: "समीक्षा दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const MAKER_CHECKER_DEF = {
  id: "makerChecker", codeKey: "maker-checker-approval",
  title: "Maker–Checker / Approval Log", titleHi: "स्वीकृति लॉग",
  intro: "Kis transaction ko kisne banaya aur kisne approve kiya — do-nazar control.",
  dateKey: "approvalDate", amountKey: "amount",
  fields: [
    { k: "transactionRef", l: "Transaction Reference", lHi: "लेन-देन संदर्भ", t: "text", req: true },
    { k: "transactionType", l: "Transaction Type", lHi: "लेन-देन प्रकार", t: "select", o: ["Payment", "Receipt", "Journal", "Transfer", "Adjustment", "Other"] },
    { k: "makerName", l: "Maker", lHi: "कर्ता", t: "text" },
    { k: "checkerName", l: "Checker / Approver", lHi: "जाँचकर्ता / स्वीकृतकर्ता", t: "text" },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number" },
    { k: "approvalDate", l: "Approval Date", lHi: "स्वीकृति दिनांक", t: "date" },
    { k: "approvalStatus", l: "Status", lHi: "स्थिति", t: "select", o: ["Approved", "Rejected", "Pending"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const ACCESS_LOG_DEF = {
  id: "accessLog", codeKey: "access-change-log",
  title: "Access & Change Log", titleHi: "पहुँच एवं परिवर्तन लॉग",
  intro: "System / bank portal / email par kisne kya badla — IT control record.",
  dateKey: "actionDate", amountKey: null,
  fields: [
    { k: "system", l: "System", lHi: "प्रणाली", t: "select", o: ["Digital Office", "Website", "Bank Portal", "Email", "Other"] },
    { k: "userName", l: "User", lHi: "उपयोगकर्ता", t: "text", req: true },
    { k: "role", l: "Role", lHi: "भूमिका", t: "text" },
    { k: "action", l: "Action", lHi: "कार्य", t: "select", o: ["Login", "Data Entry", "Edit", "Delete / Archive", "Permission Change", "Other"] },
    { k: "actionDate", l: "Action Date", lHi: "कार्य दिनांक", t: "date" },
    { k: "changeDetail", l: "Change Detail", lHi: "परिवर्तन विवरण", t: "text", full: true },
    { k: "authorisedBy", l: "Authorised By", lHi: "अधिकृत", t: "text" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const WHISTLEBLOWER_DEF = {
  id: "whistleblower", codeKey: "fraud-whistleblower",
  title: "Fraud / Whistleblower Register", titleHi: "शिकायत एवं धोखाधड़ी रजिस्टर",
  intro: "Shikayat / fraud report — channel, jaanch aur outcome ka record (gopniyata sadhya).",
  dateKey: "complaintDate", amountKey: null,
  fields: [
    { k: "complaintDate", l: "Complaint Date", lHi: "शिकायत दिनांक", t: "date", req: true },
    { k: "complaintType", l: "Complaint Type", lHi: "शिकायत प्रकार", t: "select", o: ["Fraud", "Misappropriation", "Conflict of Interest", "Harassment", "Other"] },
    { k: "channel", l: "Channel", lHi: "माध्यम", t: "select", o: ["Anonymous", "Written", "Email", "Verbal", "Other"] },
    { k: "description", l: "Description", lHi: "विवरण", t: "text", full: true, req: true },
    { k: "actionTaken", l: "Action Taken", lHi: "की गई कार्रवाई", t: "text", full: true },
    { k: "investigator", l: "Investigator", lHi: "जाँचकर्ता", t: "text" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Received", "Under Investigation", "Resolved", "Closed", "Not Applicable"] },
    { k: "outcome", l: "Outcome", lHi: "परिणाम", t: "text", full: true },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const RISK_DEF = {
  id: "risk", codeKey: "risk-register",
  title: "Risk Register", titleHi: "जोखिम रजिस्टर",
  intro: "Enterprise risk — likelihood x impact, mitigation, owner aur status.",
  dateKey: "reviewDate", amountKey: null,
  fields: [
    { k: "riskTitle", l: "Risk Title", lHi: "जोखिम शीर्षक", t: "text", req: true },
    { k: "category", l: "Category", lHi: "श्रेणी", t: "select", o: ["Financial", "Operational", "Compliance", "Reputational", "Strategic", "IT", "Other"] },
    { k: "description", l: "Description", lHi: "विवरण", t: "text", full: true },
    { k: "likelihood", l: "Likelihood", lHi: "संभावना", t: "select", o: ["High", "Medium", "Low"] },
    { k: "impact", l: "Impact", lHi: "प्रभाव", t: "select", o: ["High", "Medium", "Low"] },
    { k: "riskRating", l: "Overall Rating", lHi: "समग्र रेटिंग", t: "select", o: ["High", "Medium", "Low"] },
    { k: "mitigation", l: "Mitigation", lHi: "निवारण", t: "text", full: true },
    { k: "owner", l: "Owner", lHi: "उत्तरदायी", t: "text" },
    { k: "reviewDate", l: "Review Date", lHi: "समीक्षा दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Open", "Mitigating", "Closed", "Accepted"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const FcraRegister = makeRegister("fcra", FCRA_DEF);
export const Donor80GRegister = makeRegister("donor80g", DONOR80G_DEF);
export const ComplianceCalendar = makeRegister("complianceCalendar", COMPLIANCE_CALENDAR_DEF);
export const LegalCaseRegister = makeRegister("legalCase", LEGAL_CASE_DEF);
export const PropertyLeaseRegister = makeRegister("propertyLease", PROPERTY_LEASE_DEF);
export const RelatedPartyRegister = makeRegister("relatedParty", RELATED_PARTY_DEF);
export const LicenceRegister = makeRegister("licence", LICENCE_DEF);
export const AgmMinutesRegister = makeRegister("agmMinutes", AGM_MINUTES_DEF);
export const EcMinutesRegister = makeRegister("ecMinutes", EC_MINUTES_DEF);
export const ResolutionRegister = makeRegister("resolution", RESOLUTION_DEF);
export const DelegationRegister = makeRegister("delegation", DELEGATION_DEF);
export const PolicyRegister = makeRegister("policy", POLICY_DEF);
export const MemberRegisterGovernance = makeRegister("memberRegister", MEMBER_REGISTER_DEF);
export const OfficeBearerRegister = makeRegister("officeBearer", OFFICE_BEARER_DEF);
export const DonorMasterRegister = makeRegister("donorMaster", DONOR_MASTER_DEF);
export const GrantAgreementRegister = makeRegister("grantAgreement", GRANT_AGREEMENT_DEF);
export const UtilisationCertificateRegister = makeRegister("utilisationCertificate", UC_DEF);
export const DonorReportingCalendar = makeRegister("donorReporting", DONOR_REPORTING_DEF);
export const ForeignDonorRegister = makeRegister("foreignDonor", FOREIGN_DONOR_DEF);
export const SegregationOfDuties = makeRegister("segregationOfDuties", SOD_DEF);
export const MakerCheckerRegister = makeRegister("makerChecker", MAKER_CHECKER_DEF);
export const AccessLogRegister = makeRegister("accessLog", ACCESS_LOG_DEF);
export const WhistleblowerRegister = makeRegister("whistleblower", WHISTLEBLOWER_DEF);
export const RiskRegister = makeRegister("risk", RISK_DEF);
