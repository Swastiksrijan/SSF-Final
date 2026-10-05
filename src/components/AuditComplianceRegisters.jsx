// SSF Digital Office — Tier 3: Audit (AUDT-02/03) & Compliance (COMP-01/02/03).
//
// AUDT-02 Audited Statements Archive · AUDT-03 Audit Observation & Compliance
// COMP-01 Statutory Registration · COMP-02 Tax & Return Filing · COMP-03 Form 10BD/10BE
//
// All five are thin RegisterEngine wrappers (bilingual + versioned Edit +
// archive/restore + FY filter + CSV/PDF), so the wrapper is generated from a
// single factory instead of five near-identical files.
import { makeRegister } from "./registerFactory";

export const AUDITED_STATEMENTS_DEF = {
  id: "auditedStatements",
  codeKey: "audited-statements-archive",
  title: "Audited Statements Archive",
  titleHi: "लेखा-परीक्षित विवरण संग्रह",
  intro: "Har varsh ka CA-signed statement set (Receipts & Payments, I&E, Balance Sheet) ek jagah surakshit.",
  dateKey: "signedDate",
  amountKey: "totalReceipts",
  fields: [
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text", req: true },
    { k: "statementSet", l: "Statement Set", lHi: "विवरण समूह", t: "select", o: ["Full Set", "Receipts & Payments", "Income & Expenditure", "Balance Sheet", "Trial Balance"] },
    { k: "caFirm", l: "CA Firm / Auditor", lHi: "सी.ए. फर्म / लेखा परीक्षक", t: "text", req: true },
    { k: "signedDate", l: "Signed Date", lHi: "हस्ताक्षर दिनांक", t: "date" },
    { k: "reportType", l: "Report Type", lHi: "रिपोर्ट प्रकार", t: "select", o: ["Clean / Unqualified", "Qualified", "Adverse", "Disclaimer"] },
    { k: "totalReceipts", l: "Total Receipts (₹)", lHi: "कुल प्राप्ति (₹)", t: "number" },
    { k: "documentRef", l: "Document Reference", lHi: "दस्तावेज़ संदर्भ", t: "text" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Draft", "Signed", "Filed"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const AUDIT_OBSERVATIONS_DEF = {
  id: "auditObservations",
  codeKey: "audit-observation-compliance",
  title: "Audit Observation & Compliance",
  titleHi: "लेखा टिप्पणी एवं अनुपालन",
  intro: "Audit ki nikalI observation se lekar action-taken tak ka poora trail — finding, zimmedar, due date, closure.",
  dateKey: "observationDate",
  amountKey: "amountImpact",
  fields: [
    { k: "auditRef", l: "Audit Reference", lHi: "लेखा परीक्षा संदर्भ", t: "text", req: true },
    { k: "observationDate", l: "Observation Date", lHi: "टिप्पणी दिनांक", t: "date" },
    { k: "auditType", l: "Audit Type", lHi: "लेखा परीक्षा प्रकार", t: "select", o: ["Internal", "Statutory", "Donor", "Tax", "Other"] },
    { k: "category", l: "Category", lHi: "श्रेणी", t: "select", o: ["Books & Records", "Statutory Dues", "Documentation", "Internal Control", "Cash Management", "Compliance", "Other"] },
    { k: "observation", l: "Observation / Finding", lHi: "टिप्पणी / निष्कर्ष", t: "textarea", req: true, full: true },
    { k: "riskLevel", l: "Risk Level", lHi: "जोखिम स्तर", t: "select", o: ["High", "Medium", "Low"] },
    { k: "responsibility", l: "Responsibility", lHi: "उत्तरदायित्व", t: "text" },
    { k: "dueDate", l: "Due Date", lHi: "देय दिनांक", t: "date" },
    { k: "actionTaken", l: "Action Taken", lHi: "की गई कार्रवाई", t: "textarea", full: true },
    { k: "amountImpact", l: "Amount Impact (₹)", lHi: "राशि प्रभाव (₹)", t: "number" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Open", "In Progress", "Resolved", "Closed"] },
    { k: "closedDate", l: "Closed Date", lHi: "समापन दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const STATUTORY_REGISTRATIONS_DEF = {
  id: "statutoryRegistrations",
  codeKey: "statutory-registration",
  title: "Statutory Registration Register",
  titleHi: "सांविधिक पंजीकरण रजिस्टर",
  intro: "Society / PAN / TAN / 12A / 80G / FCRA / CSR-1 / Darpan / GST — har registration number, validity aur renewal.",
  dateKey: "issueDate",
  amountKey: "feePaid",
  fields: [
    { k: "registrationType", l: "Registration Type", lHi: "पंजीकरण प्रकार", t: "select", req: true, o: ["Society Registration", "PAN", "TAN", "12A", "80G", "FCRA", "CSR-1", "NITI Darpan", "GST", "Shops & Establishment", "Professional Tax", "Other"] },
    { k: "registrationNo", l: "Registration No.", lHi: "पंजीकरण क्रमांक", t: "text", req: true },
    { k: "authority", l: "Issuing Authority", lHi: "जारीकर्ता प्राधिकरण", t: "text" },
    { k: "issueDate", l: "Issue Date", lHi: "जारी दिनांक", t: "date" },
    { k: "validUpto", l: "Valid Upto", lHi: "मान्य तक", t: "date" },
    { k: "renewalDue", l: "Renewal Due", lHi: "नवीनीकरण देय", t: "date" },
    { k: "feePaid", l: "Fee Paid (₹)", lHi: "शुल्क (₹)", t: "number" },
    { k: "documentRef", l: "Document Reference", lHi: "दस्तावेज़ संदर्भ", t: "text" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Expired", "Renewal Due", "Applied", "Not Applicable Yet"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const TAX_RETURNS_DEF = {
  id: "taxReturns",
  codeKey: "tax-return-filing",
  title: "Tax & Return Filing Register",
  titleHi: "कर एवं विवरणी रजिस्टर",
  intro: "ITR-7, 10B/10BB, 24Q/26Q, GST — due date, filed date aur acknowledgement ka record.",
  dateKey: "filedDate",
  amountKey: "taxPaid",
  fields: [
    { k: "returnType", l: "Return Type", lHi: "विवरणी प्रकार", t: "select", req: true, o: ["ITR-7", "Form 10B / 10BB", "Form 10BD / 10BE", "TDS 24Q", "TDS 26Q", "GST Return", "Other"] },
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text", req: true },
    { k: "period", l: "Period", lHi: "अवधि", t: "text" },
    { k: "dueDate", l: "Due Date", lHi: "देय दिनांक", t: "date" },
    { k: "filedDate", l: "Filed Date", lHi: "दाखिल दिनांक", t: "date" },
    { k: "acknowledgementNo", l: "Acknowledgement No.", lHi: "पावती क्रमांक", t: "text" },
    { k: "taxPaid", l: "Tax Paid (₹)", lHi: "भुगतान कर (₹)", t: "number" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Pending", "Filed", "Late Filed", "Not Applicable Yet"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const FORM10BD_DEF = {
  id: "form10bd",
  codeKey: "form-10bd-10be",
  title: "Form 10BD / 10BE Donation Reporting",
  titleHi: "फॉर्म 10BD / 10BE दान सूचना",
  intro: "80G donor reporting (FY 2021-22 se) — donation statement (10BD) aur donor certificate (10BE).",
  dateKey: "filedDate",
  amountKey: "totalDonation",
  fields: [
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text", req: true },
    { k: "formType", l: "Form Type", lHi: "फॉर्म प्रकार", t: "select", o: ["Form 10BD (Statement of donations)", "Form 10BE (Donor certificate)"] },
    { k: "dueDate", l: "Due Date", lHi: "देय दिनांक", t: "date" },
    { k: "filedDate", l: "Filed Date", lHi: "दाखिल दिनांक", t: "date" },
    { k: "acknowledgementNo", l: "Acknowledgement No.", lHi: "पावती क्रमांक", t: "text" },
    { k: "donorCount", l: "Donor Count", lHi: "दानदाता संख्या", t: "number" },
    { k: "totalDonation", l: "Total Donation (₹)", lHi: "कुल दान (₹)", t: "number" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Pending", "Filed", "Not Applicable Yet"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const AuditedStatements = makeRegister("auditedStatements", AUDITED_STATEMENTS_DEF);
export const AuditObservations = makeRegister("auditObservations", AUDIT_OBSERVATIONS_DEF);
export const StatutoryRegistrations = makeRegister("statutoryRegistrations", STATUTORY_REGISTRATIONS_DEF);
export const TaxReturns = makeRegister("taxReturns", TAX_RETURNS_DEF);
export const Form10BD = makeRegister("form10bd", FORM10BD_DEF);
