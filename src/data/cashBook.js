// SSF Digital Office — Cash Book.
//
// Cash (रोकड़) is a separate book from the bank. Entries here are manual /
// collected-cash records (membership contributions, member donations, phone
// and programme expenses). Kept as data so a financial year can be imported
// into the Digital Office database and linked from other registers.
//
// FY 2025-26 verified: opening 1,219 + receipts 51,569 − payments 47,459.75 =
// closing 5,328.25. NOTE: ordered by date the running balance dips below zero
// (see `shortfall`) — likely a missing receipt or an understated opening
// balance; surfaced in the UI as an advisory, not a hard error.

export const CASH_BOOKS = {
  "SSF-CASH": { id: "SSF-CASH", name: "SSF Cash Book / रोकड़ बही", branch: "SSF Office" },
};

// [date, particulars, type, category, receipt, payment, remarks]
const FY_2025_26 = [
  ["2025-04-05", "Ramesh Pandey (President)", "Contribution", "Income", 1910, 0, "Membership fee"],
  ["2025-04-05", "Preeti Shukla (Vice President)", "Contribution", "Income", 1120, 0, "Membership fee"],
  ["2025-04-05", "BSNL Pack - Head Office Number", "Expence", "Phone & Mobile Exp.", 0, 599, "NGO official communication"],
  ["2025-04-07", "Ramesh Pandey (Founder)", "Donation Received", "Income", 1219, 0, "Member Contribution"],
  ["2025-04-15", "Divya Sharma (Treasurer)", "Donation Received", "Income", 609, 0, "Member Contribution"],
  ["2025-05-05", "Preeti Shukla (Vice President)", "Donation Received", "Income", 487, 0, "Member Contribution"],
  ["2025-05-10", "Amit Kumar Pandey (Secretary)", "Donation Received", "Income", 366, 0, "Member Contribution"],
  ["2025-05-10", "Amit Kumar Pandey (Secretary)", "Contribution", "Income", 1100, 0, "Membership fee"],
  ["2025-05-12", "VI Pack - NGO Coordination Number", "Expence", "Phone & Mobile Exp.", 0, 599, "NGO communication & coordination"],
  ["2025-05-20", "Sandeep Tripathi (Member)", "Donation Received", "Income", 609, 0, "Founder Contribution"],
  ["2025-06-02", "Ramesh Pandey (Founder)", "Donation Received", "Income", 1462, 0, "Member Contribution"],
  ["2025-06-10", "BSNL Pack - Founder/NGO Number", "Expence", "Phone & Mobile Exp.", 0, 599, "NGO-related calls and coordination"],
  ["2025-06-15", "Kiran Pandey (Joint Secretary)", "Donation Received", "Income", 487, 0, "Member Contribution"],
  ["2025-06-15", "Divya Sharma (Treasurer)", "Contribution", "Income", 555, 0, "Membership fee"],
  ["2025-06-15", "Kiran Pandey (Joint Secretary)", "Contribution", "Income", 555, 0, "Membership fee"],
  ["2025-06-25", "Ritesh Kumar Tiwari (Member)", "Donation Received", "Income", 609, 0, "Member Contribution"],
  ["2025-07-05", "Divya Sharma (Treasurer)", "Donation Received", "Income", 731, 0, "Founder Contribution"],
  ["2025-07-08", "VI Pack - Head Office Number", "Expence", "Phone & Mobile Exp.", 0, 599, "Official communication"],
  ["2025-07-15", "Ramesh Pandey (Founder)", "Donation Received", "Income", 1828, 0, "Member Contribution"],
  ["2025-07-20", "Sandeep Tripathi (Member)", "Contribution", "Income", 890, 0, "Membership fee"],
  ["2025-07-20", "Prameesh Singh (Member)", "Contribution", "Income", 890, 0, "Membership fee"],
  ["2025-07-20", "Rishi Kumar Pandey (Member)", "Contribution", "Income", 890, 0, "Membership fee"],
  ["2025-07-20", "Ritesh Kumar Tiwari (Member)", "Contribution", "Income", 780, 0, "Membership fee"],
  ["2025-07-25", "Prameesh Singh (Member)", "Donation Received", "Income", 487, 0, "Member Contribution"],
  ["2025-08-02", "Rishi Kumar Pandey (Member)", "Donation Received", "Income", 244, 0, "Member Contribution"],
  ["2025-08-15", "Preeti Shukla (Vice President)", "Donation Received", "Income", 609, 0, "Member Contribution"],
  ["2025-08-15", "Members' Contribution - Multiple Members", "Contribution", "Income", 2220, 0, "Collective inflow"],
  ["2025-08-15", "BSNL Pack - NGO Coordination Number", "Expence", "Phone & Mobile Exp.", 0, 599, "NGO communication"],
  ["2025-09-05", "Amit Kumar Pandey (Secretary)", "Donation Received", "Income", 487, 0, "Member Contribution"],
  ["2025-09-10", "VI Pack - Founder/NGO Number", "Expence", "Phone & Mobile Exp.", 0, 599, "NGO-related communication"],
  ["2025-09-15", "Members' Contribution - Multiple Members", "Contribution", "Income", 1665, 0, "Collective inflow"],
  ["2025-09-20", "Sandeep Tripathi (Member)", "Donation Received", "Income", 731, 0, "Founder Contribution"],
  ["2025-10-02", "Ramesh Pandey (Founder)", "Donation Received", "Income", 1462, 0, "Member Contribution"],
  ["2025-10-08", "BSNL Pack - Head Office Number", "Expence", "Phone & Mobile Exp.", 0, 599, "Official communication"],
  ["2025-10-15", "Divya Sharma (Treasurer)", "Donation Received", "Income", 853, 0, "Member Contribution"],
  ["2025-10-15", "Members' Contribution - Multiple Members", "Contribution", "Income", 2220, 0, "Collective inflow"],
  ["2025-10-25", "Kiran Pandey (Joint Secretary)", "Donation Received", "Income", 609, 0, "Member Contribution"],
  ["2025-11-05", "Ritesh Kumar Tiwari (Member)", "Donation Received", "Income", 731, 0, "Member Contribution"],
  ["2025-11-12", "VI Pack - NGO Coordination Number", "Expence", "Phone & Mobile Exp.", 0, 599, "NGO coordination"],
  ["2025-11-15", "Preeti Shukla (Vice President)", "Donation Received", "Income", 731, 0, "Founder Contribution"],
  ["2025-11-15", "Members' Contribution - Multiple Members", "Contribution", "Income", 2220, 0, "Collective inflow"],
  ["2025-12-02", "Ramesh Pandey (Founder)", "Donation Received", "Income", 1584, 0, "Member Contribution"],
  ["2025-12-10", "BSNL Pack - Founder/NGO Number", "Expence", "Phone & Mobile Exp.", 0, 599, "NGO-related communication"],
  ["2025-12-15", "Divya Sharma (Treasurer)", "Donation Received", "Income", 975, 0, "Collective inflow"],
  ["2025-12-15", "Members' Contribution - Multiple Members", "Contribution", "Income", 2220, 0, "Collective inflow"],
  ["2026-01-05", "Membership Pool (all)", "Donation Received", "Income", 609, 0, "Collective inflow"],
  ["2026-01-10", "BSNL Pack - Head Office Number", "Expence", "Phone & Mobile Exp.", 0, 599, "Official communication"],
  ["2026-01-15", "Membership Pool (all)", "Donation Received", "Income", 487, 0, "Collective inflow"],
  ["2026-01-15", "Members' Contribution - Multiple Members", "Contribution", "Income", 2220, 0, "Collective inflow"],
  ["2026-01-25", "Membership Pool (all)", "Donation Received", "Income", 244, 0, "Collective inflow"],
  ["2026-02-05", "Membership Pool (all)", "Donation Received", "Income", 1462, 0, "Collective inflow"],
  ["2026-02-12", "VI Pack - NGO Coordination Number", "Expence", "Phone & Mobile Exp.", 0, 599, "NGO coordination"],
  ["2026-02-15", "Membership Pool (all)", "Donation Received", "Income", 731, 0, "Collective inflow"],
  ["2026-02-15", "Members' Contribution - Multiple Members", "Contribution", "Income", 2220, 0, "Collective inflow"],
  ["2026-02-25", "Membership Pool (all)", "Donation Received", "Income", 609, 0, "Collective inflow"],
  ["2026-03-05", "Membership Pool (all)", "Donation Received", "Income", 1219, 0, "Collective inflow"],
  ["2026-03-10", "BSNL Pack - Founder/NGO Number", "Expence", "Phone & Mobile Exp.", 0, 611, "Year-end NGO communication"],
  ["2026-03-15", "Membership Pool (all)", "Donation Received", "Income", 1545, 0, "Collective inflow"],
  ["2026-03-15", "Members' Contribution - Multiple Members", "Contribution", "Income", 2225, 0, "Collective inflow"],
  ["2026-03-20", "Membership Pool (all)", "Donation Received", "Income", 853, 0, "Founder support"],
  ["2025-06-05", "Awareness Campaign (Pune-Rewa)", "Expence", "Environment Protection & Awareness", 0, 1000, "Local awareness drive"],
  ["2025-12-05", "Snacks - Annual Event", "Expence", "Refreshment Exp.", 0, 600, "Awareness campaign support"],
  ["2025-12-05", "Printing of Certificates", "Expence", "Stationery & Printing Exp.", 0, 500, "Training/awareness program use"],
  ["2025-12-05", "Taxi Fare - Annual Event", "Expence", "Travelling Exp.", 0, 900, "Travel for awareness campaign"],
  ["2025-12-05", "Photocopy & Binding", "Expence", "Misc. Exp.", 0, 500, "Awareness program documentation"],
  ["2026-01-10", "Education Material - Annual Program", "Expence", "Education Exp.", 0, 300, "Handouts for annual meet"],
  ["2025-05-10", "Courier Charges - Documents", "Expence", "Misc. Exp.", 0, 500, "NGO papers dispatch"],
  ["2025-05-10", "Office Supplies Purchase", "Expence", "Admin Expenses", 0, 2500, "Stationery + consumables"],
  ["2025-07-10", "Cold Drinks - Awareness Camp", "Expence", "Refreshment Exp.", 0, 500, "Volunteers & participants"],
  ["2025-09-10", "Banner & Poster - Environment Rally", "Expence", "Banner & Poster Exp.", 0, 1200, "Posters for September event"],
  ["2025-05-12", "Bus Fare - Awareness Camp Visit", "Expence", "Travelling Exp.", 0, 800, "Travel to nearby village"],
  ["2025-07-12", "SSF Nursery Creation (Dr. Ashok Smriti)", "Expence", "Environment Protection & Awareness", 0, 3000, "Nursery setup"],
  ["2026-02-15", "Tea & Snacks - Meeting", "Expence", "Refreshment Exp.", 0, 300, "NGO coordination"],
  ["2025-05-15", "Banner & Poster - Awareness Drive", "Expence", "Banner & Poster Exp.", 0, 1000, "Printing for May campaign"],
  ["2025-05-15", "Tea & Snacks - Meeting", "Expence", "Refreshment Exp.", 0, 400, "NGO staff meeting"],
  ["2025-07-15", "Laptop Repair", "Expence", "Admin Expenses", 0, 6000, "Approved in meeting"],
  ["2025-09-15", "Education Support - Student Session", "Expence", "Education Exp.", 0, 300, "Small training material"],
  ["2025-09-15", "Office Stationery Purchase", "Expence", "Stationery & Printing Exp.", 0, 400, "Pens, registers, files"],
  ["2025-09-15", "Train Fare - District Program", "Expence", "Travelling Exp.", 0, 1000, "Travel to district HQ"],
  ["2025-09-15", "Hospitality - Guest Visit", "Expence", "Misc. Exp.", 0, 400, "Tea/snacks for visitors"],
  ["2025-12-15", "Misc. Office Maintenance", "Expence", "Admin Expenses", 0, 1059.75, "Cleaning + minor repair"],
  ["2026-01-20", "Banner & Poster - Annual Meeting", "Expence", "Banner & Poster Exp.", 0, 800, "Annual NGO meeting banners"],
  ["2026-02-20", "Photocopy & Misc. Printing", "Expence", "Stationery & Printing Exp.", 0, 400, "Annual meeting documentation"],
  ["2026-02-20", "Bus Fare - Year-end Meeting", "Expence", "Travelling Exp.", 0, 700, "Travel for annual closing meeting"],
  ["2026-02-20", "Misc. Purchase - Cleaning Items", "Expence", "Misc. Exp.", 0, 600, "Office maintenance"],
  ["2026-03-20", "Cold Drinks - Year-end Meet", "Expence", "Refreshment Exp.", 0, 300, "Annual closing meeting"],
  ["2025-06-20", "Education Material - Awareness Camp", "Expence", "Education Exp.", 0, 400, "Leaflets for June camp"],
  ["2025-06-20", "Printing of Awareness Posters", "Expence", "Stationery & Printing Exp.", 0, 600, "NGO campaign material"],
  ["2025-07-20", "Auto Fare - Meeting Attendance", "Expence", "Travelling Exp.", 0, 500, "Local NGO coordination"],
  ["2025-07-20", "Minor Repair - Office Chair", "Expence", "Misc. Exp.", 0, 600, "Furniture repair"],
  ["2025-09-20", "Tea & Biscuits - Office", "Expence", "Refreshment Exp.", 0, 300, "Monthly coordination"],
  ["2025-08-21", "Travel Allowance (Admin Staff)", "Expence", "Admin Expenses", 0, 700, "Approved in meeting"],
  ["2025-11-28", "Golden Hills Cleaning Drive", "Expence", "Environment Protection & Awareness", 0, 9400, "Cleaning & plantation"],
  ["2025-11-28", "Animal Feed Drive", "Expence", "Environment Protection & Awareness", 0, 1800, "Feed distribution"],
];

const toEntry = ([date, particulars, type, category, receipt, payment, remarks]) => ({
  date, particulars, type, category,
  mode: "Cash",
  receipt: receipt || 0,
  payment: payment || 0,
  voucherNo: "",
  remarks: remarks || "",
  verifiedBy: "NA",
});

export const CASH_STATEMENTS = {
  "SSF-CASH": {
    "2025-26": {
      bookId: "SSF-CASH",
      fy: "2025-26",
      periodFrom: "2025-04-01",
      periodTo: "2026-03-31",
      openingBalance: 1219,
      transactions: FY_2025_26.map(toEntry).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)),
      summary: { receipts: 51569, payments: 47459.75, closingBalance: 5328.25 },
      source: "SSF cash book (collected cash), FY 2025-26",
    },
  },
};

export const listCashStatements = (bookId) => Object.values(CASH_STATEMENTS[bookId] || {});

export const getCashStatement = (bookId, fy) => CASH_STATEMENTS[bookId]?.[fy] || null;

/** Convert a cash statement into Digital Office record payloads (module "cash"). */
export const cashStatementRecords = (bookId, fy) => {
  const st = getCashStatement(bookId, fy);
  if (!st) return [];
  return st.transactions.map((t, i) => ({
    module: "cash",
    recordDate: t.date,
    recordType: t.type,
    amount: t.receipt || t.payment,
    paymentMode: "Cash",
    direction: t.receipt ? "in" : "out",
    data: {
      category: t.category,
      direction: t.receipt ? "in" : "out",
      type: t.type,
      purpose: t.particulars,
      amount: t.receipt || t.payment,
      receipt: t.receipt || null,
      payment: t.payment || null,
      mode: t.mode,
      voucherNo: t.voucherNo || "",
      referenceNo: t.voucherNo || "",
      remarks: t.remarks,
      verifiedBy: t.verifiedBy,
      fy: st.fy,
      openingBalance: st.openingBalance,
      slNo: i + 1,
      notes: "Imported from cash book (" + st.fy + ")",
    },
  }));
};
