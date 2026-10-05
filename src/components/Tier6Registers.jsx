// SSF Digital Office — Tier 6: remaining registers from docs/finance-registers-plan.md
//
// Covers CORE-10..12 · INCM-02/05/07/09/11/12/13/14 · EXPN-02/06/07/08/09/10/13 ·
// ASST-05/06/07/10/11/12/13 · BANK-01/03/04/05/06 · BUDG-02/03/05 ·
// AUDT-04/05 · HRPY-01..04 · MSTR-03/04/07.
//
// Each is a thin RegisterEngine wrapper via the shared makeRegister factory, so
// bilingual headers + versioned Edit + archive/restore + FY filter + CSV/PDF come
// for free. Where a feature does not apply yet, the status field keeps
// "Not Applicable Yet" instead of deleting the register (kuch hatana nahi).
import { makeRegister } from "./registerFactory";

// ---------------------------------------------------------------------------
// CORE-10..12 — derived statements (manual entry so no data is lost; the
// auto-generated versions already live in FinanceStatements/FinanceOffice).
// ---------------------------------------------------------------------------
export const INCOME_EXPENDITURE_DEF = {
  id: "incomeExpenditure", codeKey: "income-expenditure-account",
  title: "Income & Expenditure A/c (manual / notes)", titleHi: "आय-व्यय खाता (मैनुअल)",
  intro: "Accrual-basis I&E ka manual record / notes — auto version Financial Statements me hai.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text", req: true },
    { k: "side", l: "Side", lHi: "पक्ष", t: "select", req: true, o: ["Income", "Expenditure"] },
    { k: "head", l: "Head", lHi: "शीर्ष", t: "text", req: true },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "fund", l: "Fund", lHi: "निधि", t: "select", o: ["Unrestricted / General", "Restricted", "Corpus"] },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const BALANCE_SHEET_DEF = {
  id: "balanceSheet", codeKey: "balance-sheet",
  title: "Balance Sheet (manual / notes)", titleHi: "तुलन-पत्र (मैनुअल)",
  intro: "Position statement ka manual record / notes — auto version Financial Statements me hai.",
  dateKey: "asOnDate", amountKey: "amount",
  fields: [
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text", req: true },
    { k: "side", l: "Side", lHi: "पक्ष", t: "select", req: true, o: ["Asset", "Liability", "Fund / Corpus"] },
    { k: "head", l: "Head", lHi: "शीर्ष", t: "text", req: true },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "asOnDate", l: "As On Date", lHi: "दिनांक अनुसार", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const TRIAL_BALANCE_DEF = {
  id: "trialBalance", codeKey: "trial-balance",
  title: "Trial Balance (manual / notes)", titleHi: "शेष-सूची (मैनुअल)",
  intro: "Books correctness ka manual record — auto version Financial Statements me hai.",
  dateKey: "asOnDate", amountKey: "closingBalance",
  fields: [
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text", req: true },
    { k: "head", l: "Ledger Head", lHi: "खाता शीर्ष", t: "text", req: true },
    { k: "debit", l: "Debit (₹)", lHi: "नाम (₹)", t: "number" },
    { k: "credit", l: "Credit (₹)", lHi: "जमा (₹)", t: "number" },
    { k: "closingBalance", l: "Closing Balance (₹)", lHi: "अंतिम शेष (₹)", t: "number" },
    { k: "asOnDate", l: "As On Date", lHi: "दिनांक अनुसार", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

// ---------------------------------------------------------------------------
// INCM — income & receipts
// ---------------------------------------------------------------------------
export const CORPUS_DONATION_DEF = {
  id: "corpusDonation", codeKey: "corpus-donation",
  title: "Corpus Donation Register", titleHi: "कोष दान रजिस्टर",
  intro: "IT 11(1)(d) corpus direction wala daan — mool dhan jo kharch nahi hota.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "donor", l: "Donor", lHi: "दानदाता", t: "text", req: true },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "directionLetterRef", l: "Corpus Direction Letter Ref", lHi: "कोष निदेश पत्र संदर्भ", t: "text" },
    { k: "mode", l: "Mode", lHi: "माध्यम", t: "select", o: ["Bank", "Cheque", "UPI", "Other"] },
    { k: "receiptNo", l: "Receipt No.", lHi: "रसीद क्रमांक", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const IN_KIND_DEF = {
  id: "inKind", codeKey: "in-kind-voluntary-support",
  title: "In-kind & Voluntary Support Register", titleHi: "वस्तु-रूप सहयोग रजिस्टर",
  intro: "Bina rashi wala support (saaman / seva) — fair value ke saath, Cash Book nahi badalta.",
  dateKey: "date", amountKey: "fairValue",
  fields: [
    { k: "itemService", l: "Item / Service", lHi: "वस्तु / सेवा", t: "text", req: true },
    { k: "donor", l: "Donor / Supporter", lHi: "दानदाता", t: "text" },
    { k: "fairValue", l: "Fair Value (₹)", lHi: "उचित मूल्य (₹)", t: "number", req: true },
    { k: "supportType", l: "Type", lHi: "प्रकार", t: "select", o: ["Goods", "Service", "Space", "Other"] },
    { k: "usage", l: "Usage / Where Used", lHi: "उपयोग", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const CSR_FUND_DEF = {
  id: "csrFund", codeKey: "csr-fund",
  title: "CSR Fund Register", titleHi: "सी.एस.आर. निधि रजिस्टर",
  intro: "Company CSR funding (CSR Rules 2014 / CSR-1) — project aur utilisation ke saath.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "company", l: "Company", lHi: "कंपनी", t: "text", req: true },
    { k: "csr2Ref", l: "CSR-2 / Reference", lHi: "सी.एस.आर.-2 संदर्भ", t: "text" },
    { k: "project", l: "Project", lHi: "परियोजना", t: "text" },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "received", l: "Received (₹)", lHi: "प्राप्त (₹)", t: "number" },
    { k: "utilised", l: "Utilised (₹)", lHi: "उपयोग (₹)", t: "number" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Pending", "Received", "Utilised", "Reported"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const INTEREST_INCOME_DEF = {
  id: "interestIncome", codeKey: "interest-other-income",
  title: "Interest & Other Income Register", titleHi: "ब्याज एवं अन्य आय रजिस्टर",
  intro: "Bank interest, FD interest, misc income — TDS ke saath.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "source", l: "Source", lHi: "स्रोत", t: "text", req: true },
    { k: "incomeType", l: "Type", lHi: "प्रकार", t: "select", o: ["Bank Interest", "FD Interest", "Misc Income", "Other"] },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "tds", l: "TDS (₹)", lHi: "टी.डी.एस. (₹)", t: "number" },
    { k: "account", l: "Account", lHi: "खाता", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const EVENT_INCOME_DEF = {
  id: "eventIncome", codeKey: "event-programme-income",
  title: "Event / Programme Income Register", titleHi: "कार्यक्रम आय रजिस्टर",
  intro: "Event / programme se hui receipt aur uske kharch ka record.",
  dateKey: "date", amountKey: "receipts",
  fields: [
    { k: "event", l: "Event / Programme", lHi: "कार्यक्रम", t: "text", req: true },
    { k: "receipts", l: "Receipts (₹)", lHi: "प्राप्ति (₹)", t: "number", req: true },
    { k: "expenses", l: "Expenses (₹)", lHi: "खर्च (₹)", t: "number" },
    { k: "net", l: "Net (₹)", lHi: "शुद्ध (₹)", t: "number" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const ANONYMOUS_DONATION_DEF = {
  id: "anonymousDonation", codeKey: "anonymous-donation",
  title: "Anonymous Donation Register", titleHi: "गुमनाम दान रजिस्टर",
  intro: "Bina naam wala daan (IT me taxable) — date, amount, mode ke saath.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "mode", l: "Mode", lHi: "माध्यम", t: "select", o: ["Cash", "UPI", "Bank", "Other"] },
    { k: "receiptNo", l: "Receipt No.", lHi: "रसीद क्रमांक", t: "text" },
    { k: "place", l: "Place / Collected By", lHi: "स्थान / संग्रहकर्ता", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const FUND_WISE_INCOME_DEF = {
  id: "fundWiseIncome", codeKey: "fund-project-income",
  title: "Fund / Project-wise Income Register", titleHi: "निधि-वार आय रजिस्टर",
  intro: "Har income kis fund / project me gayi — fund accounting ke liye.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "fund", l: "Fund", lHi: "निधि", t: "text", req: true },
    { k: "project", l: "Project", lHi: "परियोजना", t: "text" },
    { k: "source", l: "Income Source", lHi: "आय स्रोत", t: "text" },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const PLEDGE_DEF = {
  id: "pledge", codeKey: "pledge-commitment",
  title: "Pledge / Commitment Register", titleHi: "प्रतिज्ञा रजिस्टर",
  intro: "Donor ne jo rashi dene ka vaada kiya — pledged, received aur balance.",
  dateKey: "pledgeDate", amountKey: "pledgedAmount",
  fields: [
    { k: "donor", l: "Donor", lHi: "दानदाता", t: "text", req: true },
    { k: "pledgedAmount", l: "Pledged (₹)", lHi: "प्रतिज्ञा (₹)", t: "number", req: true },
    { k: "receivedAmount", l: "Received (₹)", lHi: "प्राप्त (₹)", t: "number" },
    { k: "balance", l: "Balance (₹)", lHi: "शेष (₹)", t: "number" },
    { k: "pledgeDate", l: "Pledge Date", lHi: "प्रतिज्ञा दिनांक", t: "date" },
    { k: "expectedDate", l: "Expected Receipt Date", lHi: "अपेक्षित दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Pending", "Part Received", "Fulfilled", "Cancelled"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

// ---------------------------------------------------------------------------
// EXPN — expenditure & payments
// ---------------------------------------------------------------------------
export const PAYMENT_VOUCHER_DEF = {
  id: "paymentVoucher", codeKey: "payment-voucher",
  title: "Payment Voucher Register", titleHi: "भुगतान वाउचर रजिस्टर",
  intro: "Har payment ka voucher — approver, payee aur UTR ke saath.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "voucherNo", l: "Voucher No.", lHi: "वाउचर क्रमांक", t: "text", req: true },
    { k: "payee", l: "Payee", lHi: "प्राप्तकर्ता", t: "text", req: true },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "head", l: "Expense Head", lHi: "व्यय शीर्ष", t: "text" },
    { k: "approver", l: "Approved By", lHi: "स्वीकृतकर्ता", t: "text" },
    { k: "utr", l: "UTR / Cheque No.", lHi: "यू.टी.आर. / चेक क्रमांक", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const RENT_DEF = {
  id: "rent", codeKey: "rent-register",
  title: "Rent Register (incl. Sahyog)", titleHi: "किराया रजिस्टर",
  intro: "Premises ka kiraya — TDS 194I aur Sahyog wale hisse ke saath.",
  dateKey: "date", amountKey: "rentAmount",
  fields: [
    { k: "premises", l: "Premises", lHi: "परिसर", t: "text", req: true },
    { k: "landlord", l: "Landlord", lHi: "मकान मालिक", t: "text" },
    { k: "rentAmount", l: "Rent (₹)", lHi: "किराया (₹)", t: "number", req: true },
    { k: "tds", l: "TDS 194I (₹)", lHi: "टी.डी.एस. (₹)", t: "number" },
    { k: "sahyogPortion", l: "Sahyog Portion (₹)", lHi: "सहयोग हिस्सा (₹)", t: "number" },
    { k: "period", l: "Period", lHi: "अवधि", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const PROGRAMME_EXPENSE_DEF = {
  id: "programmeExpense", codeKey: "programme-project-expense",
  title: "Programme / Project Expense Register", titleHi: "कार्यक्रम व्यय रजिस्टर",
  intro: "Project / activity wise kharch — fund tag ke saath.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "project", l: "Project", lHi: "परियोजना", t: "text", req: true },
    { k: "activity", l: "Activity", lHi: "गतिविधि", t: "text" },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "fund", l: "Fund", lHi: "निधि", t: "select", o: ["Restricted", "Unrestricted / General", "Corpus"] },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const TRAVEL_DEF = {
  id: "travel", codeKey: "travel-reimbursement",
  title: "Travel & Reimbursement Register", titleHi: "यात्रा एवं प्रतिपूर्ति रजिस्टर",
  intro: "Travel / reimbursement claim — purpose aur bills ke saath.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "claimant", l: "Claimant", lHi: "दावेदार", t: "text", req: true },
    { k: "purpose", l: "Purpose", lHi: "उद्देश्य", t: "text" },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "billsRef", l: "Bills Reference", lHi: "बिल संदर्भ", t: "text" },
    { k: "approvedBy", l: "Approved By", lHi: "स्वीकृत", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const ADVANCE_DEF = {
  id: "advance", codeKey: "advance-settlement",
  title: "Advance to Staff / Vendor + Settlement", titleHi: "अग्रिम एवं निपटान रजिस्टर",
  intro: "Kisi ko diya gaya advance aur uski settlement — balance ke saath.",
  dateKey: "date", amountKey: "advanceAmount",
  fields: [
    { k: "payee", l: "Payee", lHi: "प्राप्तकर्ता", t: "text", req: true },
    { k: "payeeType", l: "Type", lHi: "प्रकार", t: "select", o: ["Staff", "Vendor", "Volunteer", "Other"] },
    { k: "advanceAmount", l: "Advance (₹)", lHi: "अग्रिम (₹)", t: "number", req: true },
    { k: "settledAmount", l: "Settled (₹)", lHi: "निपटान (₹)", t: "number" },
    { k: "balance", l: "Balance (₹)", lHi: "शेष (₹)", t: "number" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Open", "Part Settled", "Settled"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const CAPITAL_EXPENDITURE_DEF = {
  id: "capitalExpenditure", codeKey: "capital-expenditure",
  title: "Capital Expenditure Register", titleHi: "पूँजीगत व्यय रजिस्टर",
  intro: "Capitalise hone wala kharch — asset, cost, vendor ke saath.",
  dateKey: "date", amountKey: "cost",
  fields: [
    { k: "asset", l: "Asset", lHi: "संपत्ति", t: "text", req: true },
    { k: "cost", l: "Cost (₹)", lHi: "लागत (₹)", t: "number", req: true },
    { k: "vendor", l: "Vendor", lHi: "विक्रेता", t: "text" },
    { k: "capitalisationDate", l: "Capitalisation Date", lHi: "पूँजीकरण दिनांक", t: "date" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const BANK_CHARGES_DEF = {
  id: "bankCharges", codeKey: "bank-charges-misc",
  title: "Bank Charges & Misc Register", titleHi: "बैंक शुल्क रजिस्टर",
  intro: "Bank charges aur chhote miscellaneous kharch ka record.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "nature", l: "Nature", lHi: "प्रकृति", t: "text", req: true },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "account", l: "Bank Account", lHi: "बैंक खाता", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

// ---------------------------------------------------------------------------
// ASST — assets & liabilities
// ---------------------------------------------------------------------------
export const SECURITY_DEPOSIT_DEF = {
  id: "securityDeposit", codeKey: "security-deposit-advances",
  title: "Security Deposit & Advances Register", titleHi: "जमा एवं अग्रिम रजिस्टर",
  intro: "Recoverable deposits / advances ka tracking.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "party", l: "Party", lHi: "पक्षकार", t: "text", req: true },
    { k: "depositType", l: "Type", lHi: "प्रकार", t: "select", o: ["Security Deposit", "Advance", "Other"] },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "recovered", l: "Recovered (₹)", lHi: "वसूल (₹)", t: "number" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Outstanding", "Part Recovered", "Recovered"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const CREDITORS_DEF = {
  id: "creditors", codeKey: "creditors-payables",
  title: "Creditors / Payables Register", titleHi: "लेनदार रजिस्टर",
  intro: "Bakaya bills / payables ka record.",
  dateKey: "billDate", amountKey: "amount",
  fields: [
    { k: "vendor", l: "Vendor", lHi: "विक्रेता", t: "text", req: true },
    { k: "billNo", l: "Bill No.", lHi: "बिल क्रमांक", t: "text" },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "paid", l: "Paid (₹)", lHi: "भुगतान (₹)", t: "number" },
    { k: "balance", l: "Balance (₹)", lHi: "शेष (₹)", t: "number" },
    { k: "billDate", l: "Bill Date", lHi: "बिल दिनांक", t: "date" },
    { k: "dueDate", l: "Due Date", lHi: "देय दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Outstanding", "Part Paid", "Paid"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const DEBTORS_DEF = {
  id: "debtors", codeKey: "debtors-receivables",
  title: "Debtors / Receivables Register", titleHi: "देनदार रजिस्टर",
  intro: "Grant / pledge jo aana hai — receivable tracking.",
  dateKey: "dueDate", amountKey: "amount",
  fields: [
    { k: "party", l: "Party", lHi: "पक्षकार", t: "text", req: true },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "received", l: "Received (₹)", lHi: "प्राप्त (₹)", t: "number" },
    { k: "balance", l: "Balance (₹)", lHi: "शेष (₹)", t: "number" },
    { k: "dueDate", l: "Due Date", lHi: "देय दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Outstanding", "Part Received", "Received"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const RESERVE_FUND_DEF = {
  id: "reserveFund", codeKey: "reserve-fund",
  title: "Reserve Fund Register", titleHi: "संचित कोष रजिस्टर",
  intro: "Board-approved reserves — banao aur use karo.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "reserveName", l: "Reserve Name", lHi: "संचित नाम", t: "text", req: true },
    { k: "direction", l: "Direction", lHi: "दिशा", t: "select", o: ["Created", "Utilised", "Transferred"] },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "boardResolutionRef", l: "Board Resolution Ref", lHi: "बोर्ड संकल्प संदर्भ", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const CONTINGENT_LIABILITY_DEF = {
  id: "contingentLiability", codeKey: "contingent-liability",
  title: "Contingent Liability & Commitments", titleHi: "आकस्मिक दायित्व रजिस्टर",
  intro: "Wo dayitv jo ho sakte hain — disclosure ke liye.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "nature", l: "Nature", lHi: "प्रकृति", t: "text", req: true },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "party", l: "Party / Authority", lHi: "पक्षकार / प्राधिकरण", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Open", "Materialised", "Lapsed", "Not Applicable Yet"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const PHYSICAL_VERIFICATION_DEF = {
  id: "physicalVerification", codeKey: "asset-physical-verification",
  title: "Asset Physical Verification Register", titleHi: "संपत्ति भौतिक सत्यापन रजिस्टर",
  intro: "Asset safeguarding — kab, kisne, kya nikla.",
  dateKey: "verificationDate", amountKey: null,
  fields: [
    { k: "assetCode", l: "Asset Code", lHi: "संपत्ति कोड", t: "text", req: true },
    { k: "assetName", l: "Asset Name", lHi: "संपत्ति नाम", t: "text" },
    { k: "verificationDate", l: "Verification Date", lHi: "सत्यापन दिनांक", t: "date", req: true },
    { k: "verifiedBy", l: "Verified By", lHi: "सत्यापित", t: "text" },
    { k: "physicalCondition", l: "Condition", lHi: "स्थिति", t: "select", o: ["Good", "Repair Needed", "Damaged", "Not Found"] },
    { k: "location", l: "Location", lHi: "स्थान", t: "text" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const INSURANCE_DEF = {
  id: "insurance", codeKey: "insurance-register",
  title: "Insurance Register", titleHi: "बीमा रजिस्टर",
  intro: "Asset / liability insurance — policy, premium, cover aur expiry.",
  dateKey: "expiryDate", amountKey: "premium",
  fields: [
    { k: "policyNo", l: "Policy No.", lHi: "पॉलिसी क्रमांक", t: "text", req: true },
    { k: "insurer", l: "Insurer", lHi: "बीमाकर्ता", t: "text" },
    { k: "assetInsured", l: "Asset / Risk Insured", lHi: "बीमित संपत्ति / जोखिम", t: "text" },
    { k: "sumInsured", l: "Sum Insured (₹)", lHi: "बीमा राशि (₹)", t: "number" },
    { k: "premium", l: "Premium (₹)", lHi: "प्रीमियम (₹)", t: "number" },
    { k: "startDate", l: "Start Date", lHi: "प्रारंभ दिनांक", t: "date" },
    { k: "expiryDate", l: "Expiry Date", lHi: "समाप्ति दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Expired", "Claimed", "Not Applicable Yet"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

// ---------------------------------------------------------------------------
// BANK — banking & treasury
// ---------------------------------------------------------------------------
export const BANK_ACCOUNT_MASTER_DEF = {
  id: "bankAccountMaster", codeKey: "bank-account-master",
  title: "Bank Account Master", titleHi: "बैंक खाता मास्टर",
  intro: "Sabhi bank accounts + FCRA designated account ka master.",
  dateKey: "openingDate", amountKey: "openingBalance",
  fields: [
    { k: "accountName", l: "Account Name", lHi: "खाता नाम", t: "text", req: true },
    { k: "accountNo", l: "Account No.", lHi: "खाता क्रमांक", t: "text" },
    { k: "bankName", l: "Bank", lHi: "बैंक", t: "text" },
    { k: "branch", l: "Branch", lHi: "शाखा", t: "text" },
    { k: "accountType", l: "Type", lHi: "प्रकार", t: "select", o: ["Savings", "Current", "FCRA Designated", "Other"] },
    { k: "ifsc", l: "IFSC", lHi: "आई.एफ.एस.सी.", t: "text" },
    { k: "openingBalance", l: "Opening Balance (₹)", lHi: "प्रारंभिक शेष (₹)", t: "number" },
    { k: "openingDate", l: "Opening Date", lHi: "प्रारंभ दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Closed", "Dormant"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const CHEQUE_ISSUE_DEF = {
  id: "chequeIssue", codeKey: "cheque-dd-issue",
  title: "Cheque / DD Issue Register", titleHi: "चेक जारी रजिस्टर",
  intro: "Issue hue cheque / DD — control aur stop-payment ke liye.",
  dateKey: "issueDate", amountKey: "amount",
  fields: [
    { k: "chequeNo", l: "Cheque / DD No.", lHi: "चेक क्रमांक", t: "text", req: true },
    { k: "payee", l: "Payee", lHi: "प्राप्तकर्ता", t: "text", req: true },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "bankAccount", l: "Bank Account", lHi: "बैंक खाता", t: "text" },
    { k: "issueDate", l: "Issue Date", lHi: "जारी दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Issued", "Cleared", "Stopped", "Cancelled"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const CHEQUE_BOOK_DEF = {
  id: "chequeBook", codeKey: "cheque-book-stationery",
  title: "Cheque Book & Stationery Register", titleHi: "चेक पुस्तिका रजिस्टर",
  intro: "Cheque book / stationery ka stock control.",
  dateKey: "issueDate", amountKey: null,
  fields: [
    { k: "bankAccount", l: "Bank Account", lHi: "बैंक खाता", t: "text", req: true },
    { k: "bookSeries", l: "Book / Series", lHi: "पुस्तिका / श्रृंखला", t: "text" },
    { k: "fromNo", l: "From Leaf No.", lHi: "से पत्ता क्रमांक", t: "text" },
    { k: "toNo", l: "To Leaf No.", lHi: "तक पत्ता क्रमांक", t: "text" },
    { k: "issueDate", l: "Issue Date", lHi: "जारी दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["In Use", "Exhausted", "Returned"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const SIGNATORY_AUTHORITY_DEF = {
  id: "signatoryAuthority", codeKey: "signatory-authority",
  title: "Signatory / Authority Register", titleHi: "हस्ताक्षर अधिकार रजिस्टर",
  intro: "Bank account par kaun sign karega — board resolution ref ke saath.",
  dateKey: "validFrom", amountKey: null,
  fields: [
    { k: "name", l: "Name", lHi: "नाम", t: "text", req: true },
    { k: "designation", l: "Designation", lHi: "पद", t: "text" },
    { k: "bankAccount", l: "Bank Account", lHi: "बैंक खाता", t: "text" },
    { k: "authorityType", l: "Authority", lHi: "अधिकार", t: "select", o: ["Single Signatory", "Joint Signatory", "Online / Net Banking"] },
    { k: "resolutionRef", l: "Board Resolution Ref", lHi: "बोर्ड संकल्प संदर्भ", t: "text" },
    { k: "validFrom", l: "Valid From", lHi: "मान्य प्रारंभ", t: "date" },
    { k: "validTo", l: "Valid To", lHi: "मान्य तक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Revoked"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const FD_RECEIPT_DEF = {
  id: "fdReceipt", codeKey: "fd-investment-receipt",
  title: "FD / Investment Receipt Register", titleHi: "सावधि जमा रजिस्टर",
  intro: "FD / investment receipt — maturity aur interest ke saath.",
  dateKey: "maturityDate", amountKey: "amount",
  fields: [
    { k: "fdNo", l: "FD / Receipt No.", lHi: "एफ.डी. क्रमांक", t: "text", req: true },
    { k: "bank", l: "Bank / Institution", lHi: "बैंक / संस्था", t: "text" },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "interestRate", l: "Interest Rate (%)", lHi: "ब्याज दर (%)", t: "number" },
    { k: "startDate", l: "Start Date", lHi: "प्रारंभ दिनांक", t: "date" },
    { k: "maturityDate", l: "Maturity Date", lHi: "परिपक्वता दिनांक", t: "date" },
    { k: "maturityAmount", l: "Maturity Amount (₹)", lHi: "परिपक्वता राशि (₹)", t: "number" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Matured", "Encashed", "Renewed"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

// ---------------------------------------------------------------------------
// BUDG — budget & control
// ---------------------------------------------------------------------------
export const BUDGET_REVISION_DEF = {
  id: "budgetRevision", codeKey: "budget-revision",
  title: "Budget Revision Register", titleHi: "बजट संशोधन रजिस्टर",
  intro: "Budget me badlav — approval trail ke saath.",
  dateKey: "revisionDate", amountKey: "revisedAmount",
  fields: [
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text", req: true },
    { k: "head", l: "Budget Head", lHi: "बजट शीर्ष", t: "text", req: true },
    { k: "originalAmount", l: "Original (₹)", lHi: "मूल (₹)", t: "number" },
    { k: "revisedAmount", l: "Revised (₹)", lHi: "संशोधित (₹)", t: "number", req: true },
    { k: "revisionDate", l: "Revision Date", lHi: "संशोधन दिनांक", t: "date" },
    { k: "approvedBy", l: "Approved By", lHi: "स्वीकृत", t: "text" },
    { k: "reason", l: "Reason", lHi: "कारण", t: "text", full: true },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const CASH_FLOW_DEF = {
  id: "cashFlow", codeKey: "cash-flow-statement",
  title: "Cash Flow Statement (manual / notes)", titleHi: "रोकड़ प्रवाह (मैनुअल)",
  intro: "Liquidity ka manual record / notes — auto version Financial Statements me hai.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text", req: true },
    { k: "activity", l: "Activity", lHi: "गतिविधि", t: "select", o: ["Operating", "Investing", "Financing"] },
    { k: "direction", l: "Inflow / Outflow", lHi: "आवक / जावक", t: "select", o: ["Inflow", "Outflow"] },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const VARIANCE_DEF = {
  id: "variance", codeKey: "variance-exception",
  title: "Variance & Exception Register", titleHi: "अंतर विश्लेषण रजिस्टर",
  intro: "Budget se antar — management review ke liye.",
  dateKey: "date", amountKey: "varianceAmount",
  fields: [
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text", req: true },
    { k: "head", l: "Head", lHi: "शीर्ष", t: "text", req: true },
    { k: "budgeted", l: "Budgeted (₹)", lHi: "बजट (₹)", t: "number" },
    { k: "actual", l: "Actual (₹)", lHi: "वास्तविक (₹)", t: "number" },
    { k: "varianceAmount", l: "Variance (₹)", lHi: "अंतर (₹)", t: "number", req: true },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "explanation", l: "Explanation / Action", lHi: "स्पष्टीकरण / कार्रवाई", t: "text", full: true },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

// ---------------------------------------------------------------------------
// AUDT — audit & assurance
// ---------------------------------------------------------------------------
export const INTERNAL_AUDIT_DEF = {
  id: "internalAudit", codeKey: "internal-audit",
  title: "Internal Audit Register", titleHi: "आंतरिक लेखा परीक्षा रजिस्टर",
  intro: "Periodic internal audit ka record.",
  dateKey: "auditDate", amountKey: null,
  fields: [
    { k: "auditPeriod", l: "Audit Period", lHi: "लेखा अवधि", t: "text", req: true },
    { k: "auditor", l: "Internal Auditor", lHi: "आंतरिक लेखा परीक्षक", t: "text" },
    { k: "scope", l: "Scope", lHi: "दायरा", t: "text", full: true },
    { k: "findings", l: "Findings", lHi: "निष्कर्ष", t: "text", full: true },
    { k: "auditDate", l: "Audit Date", lHi: "लेखा परीक्षा दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Planned", "In Progress", "Completed"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const MANAGEMENT_RESPONSE_DEF = {
  id: "managementResponse", codeKey: "management-response-action-taken",
  title: "Management Response / Action Taken", titleHi: "प्रबंधन उत्तर रजिस्टर",
  intro: "Audit finding par management ka jawab aur kya karrawayi hui.",
  dateKey: "responseDate", amountKey: null,
  fields: [
    { k: "findingRef", l: "Finding Reference", lHi: "निष्कर्ष संदर्भ", t: "text", req: true },
    { k: "response", l: "Management Response", lHi: "प्रबंधन उत्तर", t: "text", full: true, req: true },
    { k: "actionTaken", l: "Action Taken", lHi: "कार्रवाई", t: "text", full: true },
    { k: "responsiblePerson", l: "Responsible Person", lHi: "उत्तरदायी व्यक्ति", t: "text" },
    { k: "targetDate", l: "Target Date", lHi: "लक्ष्य दिनांक", t: "date" },
    { k: "responseDate", l: "Response Date", lHi: "उत्तर दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Open", "In Progress", "Closed"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

// ---------------------------------------------------------------------------
// HRPY — HR & payroll interface
// ---------------------------------------------------------------------------
export const EMPLOYEE_MASTER_DEF = {
  id: "employeeMaster", codeKey: "employee-master",
  title: "Employee Master", titleHi: "कर्मचारी मास्टर",
  intro: "Employee ka master record — payroll se juda.",
  dateKey: "joiningDate", amountKey: "grossSalary",
  fields: [
    { k: "employeeId", l: "Employee ID", lHi: "कर्मचारी आई.डी.", t: "text", req: true },
    { k: "name", l: "Name", lHi: "नाम", t: "text", req: true },
    { k: "designation", l: "Designation", lHi: "पद", t: "text" },
    { k: "department", l: "Department", lHi: "विभाग", t: "text" },
    { k: "grossSalary", l: "Gross Salary (₹)", lHi: "सकल वेतन (₹)", t: "number" },
    { k: "joiningDate", l: "Joining Date", lHi: "जॉइनिंग दिनांक", t: "date" },
    { k: "pan", l: "PAN", lHi: "पैन", t: "text" },
    { k: "contact", l: "Contact", lHi: "संपर्क", t: "text" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Resigned", "Retired"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const ATTENDANCE_DEF = {
  id: "attendance", codeKey: "attendance-leave",
  title: "Attendance / Leave Register", titleHi: "उपस्थिति एवं अवकाश रजिस्टर",
  intro: "Attendance / leave — salary calc ke liye.",
  dateKey: "date", amountKey: null,
  fields: [
    { k: "employee", l: "Employee", lHi: "कर्मचारी", t: "text", req: true },
    { k: "month", l: "Month", lHi: "माह", t: "text" },
    { k: "presentDays", l: "Present Days", lHi: "उपस्थित दिन", t: "number" },
    { k: "leaveDays", l: "Leave Days", lHi: "अवकाश दिन", t: "number" },
    { k: "absentDays", l: "Absent Days", lHi: "अनुपस्थित दिन", t: "number" },
    { k: "leaveType", l: "Leave Type", lHi: "अवकाश प्रकार", t: "select", o: ["Casual", "Sick", "Earned", "Unpaid", "Not Applicable"] },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const VOLUNTEER_INTERN_DEF = {
  id: "volunteerIntern", codeKey: "volunteer-intern",
  title: "Volunteer & Intern Register (HR)", titleHi: "स्वयंसेवी एवं इंटर्न रजिस्टर",
  intro: "Volunteer / intern — honorarium link ke liye.",
  dateKey: "startDate", amountKey: "stipend",
  fields: [
    { k: "name", l: "Name", lHi: "नाम", t: "text", req: true },
    { k: "role", l: "Role", lHi: "भूमिका", t: "select", o: ["Volunteer", "Intern", "Trainer", "Resource Person"] },
    { k: "programme", l: "Programme", lHi: "कार्यक्रम", t: "text" },
    { k: "stipend", l: "Stipend (₹)", lHi: "वृत्तिका (₹)", t: "number" },
    { k: "startDate", l: "Start Date", lHi: "प्रारंभ दिनांक", t: "date" },
    { k: "endDate", l: "End Date", lHi: "अंत दिनांक", t: "date" },
    { k: "contact", l: "Contact", lHi: "संपर्क", t: "text" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Completed", "Dropped"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const REIMBURSEMENT_ADVANCE_DEF = {
  id: "reimbursementAdvance", codeKey: "reimbursement-advance",
  title: "Reimbursement & Advance Register (HR)", titleHi: "प्रतिपूर्ति एवं अग्रिम रजिस्टर",
  intro: "Staff reimbursement aur advance ka HR-side record.",
  dateKey: "date", amountKey: "amount",
  fields: [
    { k: "employee", l: "Employee", lHi: "कर्मचारी", t: "text", req: true },
    { k: "type", l: "Type", lHi: "प्रकार", t: "select", o: ["Reimbursement", "Advance"] },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "purpose", l: "Purpose", lHi: "उद्देश्य", t: "text" },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Pending", "Approved", "Paid", "Settled"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

// ---------------------------------------------------------------------------
// MSTR — masters
// ---------------------------------------------------------------------------
export const PARTY_MASTER_DEF = {
  id: "partyMaster", codeKey: "party-master",
  title: "Party Master (Donor / Vendor / Member)", titleHi: "पक्षकार मास्टर",
  intro: "Har party ka 360° record — donor, vendor, member.",
  dateKey: "date", amountKey: null,
  fields: [
    { k: "name", l: "Name", lHi: "नाम", t: "text", req: true },
    { k: "partyType", l: "Party Type", lHi: "पक्षकार प्रकार", t: "select", req: true, o: ["Donor", "Vendor", "Member", "Grantor", "Other"] },
    { k: "pan", l: "PAN", lHi: "पैन", t: "text" },
    { k: "gstin", l: "GSTIN", lHi: "जी.एस.टी.आई.एन.", t: "text" },
    { k: "contact", l: "Contact", lHi: "संपर्क", t: "text" },
    { k: "address", l: "Address", lHi: "पता", t: "text", full: true },
    { k: "date", l: "Date", lHi: "दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const COST_CENTRE_DEF = {
  id: "costCentre", codeKey: "cost-centre-programme",
  title: "Cost-centre / Programme Master", titleHi: "लागत केंद्र मास्टर",
  intro: "Har kharch / income ka programme / project tag.",
  dateKey: "startDate", amountKey: "budgetAmount",
  fields: [
    { k: "code", l: "Cost-centre Code", lHi: "लागत केंद्र कोड", t: "text", req: true },
    { k: "name", l: "Name", lHi: "नाम", t: "text", req: true },
    { k: "programme", l: "Programme", lHi: "कार्यक्रम", t: "text" },
    { k: "fund", l: "Fund", lHi: "निधि", t: "select", o: ["Restricted", "Unrestricted / General", "Corpus"] },
    { k: "budgetAmount", l: "Budget (₹)", lHi: "बजट (₹)", t: "number" },
    { k: "startDate", l: "Start Date", lHi: "प्रारंभ दिनांक", t: "date" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Closed"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

export const DOCUMENT_INDEX_DEF = {
  id: "documentIndex", codeKey: "document-attachment-index",
  title: "Document / Attachment Index", titleHi: "दस्तावेज़ सूची रजिस्टर",
  intro: "Source-document vault — har entry ka bill / receipt / UTR ref.",
  dateKey: "documentDate", amountKey: null,
  fields: [
    { k: "documentName", l: "Document Name", lHi: "दस्तावेज़ नाम", t: "text", req: true },
    { k: "documentType", l: "Type", lHi: "प्रकार", t: "select", o: ["Bill", "Receipt", "UTR / Bank Proof", "Agreement", "Certificate", "Other"] },
    { k: "linkedRecordId", l: "Linked Record ID", lHi: "लिंक्ड रिकॉर्ड आई.डी.", t: "text" },
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text" },
    { k: "storageRef", l: "Storage Reference", lHi: "भंडारण संदर्भ", t: "text" },
    { k: "documentDate", l: "Document Date", lHi: "दस्तावेज़ दिनांक", t: "date" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

// ---------------------------------------------------------------------------
// Wrappers
// ---------------------------------------------------------------------------
export const IncomeExpenditure = makeRegister("incomeExpenditure", INCOME_EXPENDITURE_DEF);
export const BalanceSheet = makeRegister("balanceSheet", BALANCE_SHEET_DEF);
export const TrialBalance = makeRegister("trialBalance", TRIAL_BALANCE_DEF);
export const CorpusDonation = makeRegister("corpusDonation", CORPUS_DONATION_DEF);
export const InKindRegister = makeRegister("inKind", IN_KIND_DEF);
export const CsrFund = makeRegister("csrFund", CSR_FUND_DEF);
export const InterestIncome = makeRegister("interestIncome", INTEREST_INCOME_DEF);
export const EventIncome = makeRegister("eventIncome", EVENT_INCOME_DEF);
export const AnonymousDonation = makeRegister("anonymousDonation", ANONYMOUS_DONATION_DEF);
export const FundWiseIncome = makeRegister("fundWiseIncome", FUND_WISE_INCOME_DEF);
export const PledgeRegister = makeRegister("pledge", PLEDGE_DEF);
export const PaymentVoucher = makeRegister("paymentVoucher", PAYMENT_VOUCHER_DEF);
export const RentRegister = makeRegister("rent", RENT_DEF);
export const ProgrammeExpense = makeRegister("programmeExpense", PROGRAMME_EXPENSE_DEF);
export const TravelRegister = makeRegister("travel", TRAVEL_DEF);
export const AdvanceRegister = makeRegister("advance", ADVANCE_DEF);
export const CapitalExpenditure = makeRegister("capitalExpenditure", CAPITAL_EXPENDITURE_DEF);
export const BankCharges = makeRegister("bankCharges", BANK_CHARGES_DEF);
export const SecurityDeposit = makeRegister("securityDeposit", SECURITY_DEPOSIT_DEF);
export const CreditorsRegister = makeRegister("creditors", CREDITORS_DEF);
export const DebtorsRegister = makeRegister("debtors", DEBTORS_DEF);
export const ReserveFund = makeRegister("reserveFund", RESERVE_FUND_DEF);
export const ContingentLiability = makeRegister("contingentLiability", CONTINGENT_LIABILITY_DEF);
export const PhysicalVerification = makeRegister("physicalVerification", PHYSICAL_VERIFICATION_DEF);
export const InsuranceRegister = makeRegister("insurance", INSURANCE_DEF);
export const BankAccountMaster = makeRegister("bankAccountMaster", BANK_ACCOUNT_MASTER_DEF);
export const ChequeIssue = makeRegister("chequeIssue", CHEQUE_ISSUE_DEF);
export const ChequeBook = makeRegister("chequeBook", CHEQUE_BOOK_DEF);
export const SignatoryAuthority = makeRegister("signatoryAuthority", SIGNATORY_AUTHORITY_DEF);
export const FdReceipt = makeRegister("fdReceipt", FD_RECEIPT_DEF);
export const BudgetRevision = makeRegister("budgetRevision", BUDGET_REVISION_DEF);
export const CashFlow = makeRegister("cashFlow", CASH_FLOW_DEF);
export const Variance = makeRegister("variance", VARIANCE_DEF);
export const InternalAudit = makeRegister("internalAudit", INTERNAL_AUDIT_DEF);
export const ManagementResponse = makeRegister("managementResponse", MANAGEMENT_RESPONSE_DEF);
export const EmployeeMaster = makeRegister("employeeMaster", EMPLOYEE_MASTER_DEF);
export const Attendance = makeRegister("attendance", ATTENDANCE_DEF);
export const VolunteerIntern = makeRegister("volunteerIntern", VOLUNTEER_INTERN_DEF);
export const ReimbursementAdvance = makeRegister("reimbursementAdvance", REIMBURSEMENT_ADVANCE_DEF);
export const PartyMaster = makeRegister("partyMaster", PARTY_MASTER_DEF);
export const CostCentre = makeRegister("costCentre", COST_CENTRE_DEF);
export const DocumentIndex = makeRegister("documentIndex", DOCUMENT_INDEX_DEF);
