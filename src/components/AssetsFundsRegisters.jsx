// SSF Digital Office — Tier 4: Assets & Funds registers.
//
// ASST-02 Depreciation Schedule · ASST-08 Corpus/Endowment Fund · ASST-09 Restricted/Unrestricted Fund
// EXPN-03 Procurement/Purchase · EXPN-04 Salary & Payroll · EXPN-05 Honorarium & Stipend
// BUDG-04 Fund Balance / Utilisation
//
// (ASST-01 Fixed Asset and BUDG-01 Budget-vs-Actual already exist in FinanceRegisters.)
import { makeRegister } from "./registerFactory";

export const DEPRECIATION_DEF = {
  id: "depreciation",
  codeKey: "depreciation-schedule",
  title: "Depreciation Schedule",
  titleHi: "मूल्यह्रास अनुसूची",
  intro: "Har sthayi sampatti ka varshik mulyahras — cost, rate, varsh ka depreciation aur WDV.",
  dateKey: "date",
  amountKey: "depreciationAmount",
  fields: [
    { k: "assetCode", l: "Asset Code", lHi: "संपत्ति कोड", t: "text", req: true },
    { k: "assetName", l: "Asset Name", lHi: "संपत्ति नाम", t: "text", req: true },
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text", req: true },
    { k: "method", l: "Method", lHi: "विधि", t: "select", o: ["SLM (Straight Line)", "WDV (Written Down Value)"] },
    { k: "rate", l: "Rate (%)", lHi: "दर (%)", t: "number" },
    { k: "openingWdv", l: "Opening WDV (₹)", lHi: "प्रारंभिक डब्ल्यू.डी.वी. (₹)", t: "number" },
    { k: "depreciationAmount", l: "Depreciation (₹)", lHi: "मूल्यह्रास (₹)", t: "number", req: true },
    { k: "closingWdv", l: "Closing WDV (₹)", lHi: "अंतिम डब्ल्यू.डी.वी. (₹)", t: "number" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const CORPUS_FUND_DEF = {
  id: "corpusFund",
  codeKey: "corpus-fund",
  title: "Corpus / Endowment Fund Register",
  titleHi: "कोष निधि रजिस्टर",
  intro: "Corpus (IT 11(1)(d)) me praapt aur rakhi gayi rashi — mool dhan jo kharch nahi hota.",
  dateKey: "date",
  amountKey: "amount",
  fields: [
    { k: "direction", l: "Direction", lHi: "दिशा", t: "select", o: ["Received", "Invested", "Transferred", "Withdrawn"] },
    { k: "donor", l: "Donor / Source", lHi: "दानदाता / स्रोत", t: "text", req: true },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "mode", l: "Mode", lHi: "माध्यम", t: "select", o: ["Bank", "Cheque", "UPI", "FD / Investment", "Other"] },
    { k: "instrument", l: "Instrument / FD Ref", lHi: "इंस्ट्रूमेंट / एफ.डी.", t: "text" },
    { k: "purpose", l: "Purpose / Note", lHi: "उद्देश्य", t: "text", full: true },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const FUND_CLASSIFICATION_DEF = {
  id: "fundClassification",
  codeKey: "fund-classification",
  title: "Restricted & Unrestricted Fund Register",
  titleHi: "निधि वर्गीकरण रजिस्टर",
  intro: "Har nidhi restricted ya unrestricted hai — is register se fund-wise utilisation saaf dikhta hai.",
  dateKey: "date",
  amountKey: "amount",
  fields: [
    { k: "fundName", l: "Fund Name", lHi: "निधि नाम", t: "text", req: true },
    { k: "fundType", l: "Fund Type", lHi: "निधि प्रकार", t: "select", o: ["Restricted", "Unrestricted / General", "Corpus"] },
    { k: "direction", l: "Direction", lHi: "दिशा", t: "select", o: ["Add — Receipt", "Less — Utilisation", "Transfer In", "Transfer Out"] },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "project", l: "Project / Programme", lHi: "परियोजना", t: "text" },
    { k: "purpose", l: "Purpose", lHi: "उद्देश्य", t: "text", full: true },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const PROCUREMENT_DEF = {
  id: "procurement",
  codeKey: "procurement-purchase",
  title: "Procurement / Purchase Register",
  titleHi: "क्रय रजिस्टर",
  intro: "Quotation, vendor, PO, GRN aur best-value note — IT 40A(3) cash-limit ke liye suraksha.",
  dateKey: "date",
  amountKey: "amount",
  fields: [
    { k: "item", l: "Item / Service", lHi: "वस्तु / सेवा", t: "text", req: true },
    { k: "vendor", l: "Vendor", lHi: "विक्रेता", t: "text", req: true },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "quotationRef", l: "Quotation Ref", lHi: "कोटेशन संदर्भ", t: "text" },
    { k: "poNo", l: "PO No.", lHi: "क्रय आदेश क्रमांक", t: "text" },
    { k: "grnNo", l: "GRN No.", lHi: "माल प्राप्ति क्रमांक", t: "text" },
    { k: "paymentMode", l: "Payment Mode", lHi: "भुगतान माध्यम", t: "select", o: ["Bank", "Cheque", "UPI", "Cash"] },
    { k: "bestValueNote", l: "Best Value / Reason", lHi: "सर्वोत्तम मूल्य / कारण", t: "text", full: true },
    { k: "approvedBy", l: "Approved By", lHi: "स्वीकृत", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const PAYROLL_DEF = {
  id: "payroll",
  codeKey: "salary-payroll",
  title: "Salary & Payroll Register",
  titleHi: "वेतन रजिस्टर",
  intro: "Gross, deductions (PF/ESI/TDS) aur net pay — payroll ho to; nahi ho to status 'Not Applicable Yet'.",
  dateKey: "date",
  amountKey: "netPay",
  fields: [
    { k: "employee", l: "Employee", lHi: "कर्मचारी", t: "text", req: true },
    { k: "designation", l: "Designation", lHi: "पद", t: "text" },
    { k: "month", l: "Month / Period", lHi: "माह / अवधि", t: "text", req: true },
    { k: "grossSalary", l: "Gross Salary (₹)", lHi: "सकल वेतन (₹)", t: "number", req: true },
    { k: "pf", l: "PF (₹)", lHi: "पी.एफ. (₹)", t: "number" },
    { k: "esi", l: "ESI (₹)", lHi: "ई.एस.आई. (₹)", t: "number" },
    { k: "tds", l: "TDS (₹)", lHi: "टी.डी.एस. (₹)", t: "number" },
    { k: "otherDeductions", l: "Other Deductions (₹)", lHi: "अन्य कटौती (₹)", t: "number" },
    { k: "netPay", l: "Net Pay (₹)", lHi: "शुद्ध वेतन (₹)", t: "number", req: true },
    { k: "paymentMode", l: "Payment Mode", lHi: "भुगतान माध्यम", t: "select", o: ["Bank", "Cash", "Cheque"] },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Paid", "Pending", "Not Applicable Yet"] },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const HONORARIUM_DEF = {
  id: "honorarium",
  codeKey: "honorarium-stipend",
  title: "Honorarium & Stipend Register",
  titleHi: "मानदेय एवं वृत्तिका रजिस्टर",
  intro: "Interns / volunteers ko diya gaya manadey ya stipend, period aur TDS ke saath.",
  dateKey: "date",
  amountKey: "amount",
  fields: [
    { k: "name", l: "Name", lHi: "नाम", t: "text", req: true },
    { k: "role", l: "Role", lHi: "भूमिका", t: "select", o: ["Intern", "Volunteer", "Trainer", "Resource Person", "Other"] },
    { k: "period", l: "Period", lHi: "अवधि", t: "text" },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "tds", l: "TDS (₹)", lHi: "टी.डी.एस. (₹)", t: "number" },
    { k: "paymentMode", l: "Payment Mode", lHi: "भुगतान माध्यम", t: "select", o: ["Bank", "Cash", "UPI", "Cheque"] },
    { k: "purpose", l: "Purpose / Programme", lHi: "उद्देश्य / कार्यक्रम", t: "text" },
    { k: "approvedBy", l: "Approved By", lHi: "स्वीकृत", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const FUND_UTILISATION_DEF = {
  id: "fundUtilisation",
  codeKey: "fund-balance-utilisation",
  title: "Fund Balance / Utilisation Register",
  titleHi: "निधि उपयोग रजिस्टर",
  intro: "Restricted fund ka opening, praapti, upyog aur closing — donor ke paise ka hisaab.",
  dateKey: "date",
  amountKey: "amount",
  fields: [
    { k: "fundName", l: "Fund Name", lHi: "निधि नाम", t: "text", req: true },
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text", req: true },
    { k: "openingBalance", l: "Opening Balance (₹)", lHi: "प्रारंभिक शेष (₹)", t: "number" },
    { k: "received", l: "Received During Year (₹)", lHi: "वर्ष में प्राप्त (₹)", t: "number" },
    { k: "utilised", l: "Utilised During Year (₹)", lHi: "वर्ष में उपयोग (₹)", t: "number" },
    { k: "amount", l: "Closing Balance (₹)", lHi: "अंतिम शेष (₹)", t: "number", req: true },
    { k: "project", l: "Project / Programme", lHi: "परियोजना", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const DepreciationSchedule = makeRegister("depreciation", DEPRECIATION_DEF);
export const CorpusFund = makeRegister("corpusFund", CORPUS_FUND_DEF);
export const FundClassification = makeRegister("fundClassification", FUND_CLASSIFICATION_DEF);
export const ProcurementRegister = makeRegister("procurement", PROCUREMENT_DEF);
export const PayrollRegister = makeRegister("payroll", PAYROLL_DEF);
export const HonorariumRegister = makeRegister("honorarium", HONORARIUM_DEF);
export const FundUtilisation = makeRegister("fundUtilisation", FUND_UTILISATION_DEF);
