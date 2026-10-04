// SSF Digital Office — Bank Book statements.
//
// Bank statement data is kept here (not hard-coded in the UI) so a financial
// year's entries can be imported into the Digital Office database and then
// linked from other registers. `bankStatementRecords(fy)` converts a statement
// into the office record shape used by POST /api/digital-office/records.
//
// NOTE: withdrawals/deposits are the raw bank amounts; balances are as printed
// on the statement. Financial year 2025-26 was verified: opening 19,816.84 +
// credits 25,046.02 − debits 29,262.35 = closing 15,600.51 Cr.

export const BANK_ACCOUNTS = {
  "UBIN-4814": {
    id: "UBIN-4814",
    bank: "Union Bank of India",
    branch: "Transport Nagar Rewa",
    accountName: "SWASTIK SRIJAN FOUNDATION SAMITI",
    accountNumber: "4814XXXXXXX6579",
    customerId: "900448570",
    ifsc: "UBIN0548146",
    micr: "486026005",
    accountType: "CAA",
    accountOpenDate: "2021-08-30",
    phone: "9718346691",
    email: "SWASTIKSRIJANFOUNDATION@GMAIL.COM",
    address: ["Ward No. 1, Vill Dadar, Post Rahat", "Vill Dadar, Post Rahat", "Rewa", "Madhya Pradesh", "486001, India"],
  },
};

// [date, particulars, withdrawal, deposit, balance, chqNum]
const FY_2025_26 = [
  ["2025-04-03", "UPIAB/509368400629/CR/RAMESH P/UBIN/9971103790@pts", null, 300.00, 20116.84],
  ["2025-04-03", "UPIAB/509368486221/CR/RAMESH P/UBIN/9971103790@pts", null, 200.00, 20316.84],
  ["2025-04-04", "IMPSAB/509425299851/RazorpayX Private L/9999999999", null, 475.95, 20792.79],
  ["2025-04-04", "UPIAB/509494498028/CR/AZAD SIN/ICIC/9873913705@pts", null, 11.00, 20803.79],
  ["2025-04-04", "UPIAB/509432780101/CR/SUMUKH/ICIC/9717440707@pta", null, 51.00, 20854.79],
  ["2025-04-04", "UPIAB/362243095427/CR/KUMAR GA/ICIC/8800947444@ib", null, 100.00, 20954.79],
  ["2025-04-05", "UPIAB/509565926440/CR/MANISH K/UCBA/shaktisondhiya", null, 100.00, 21054.79],
  ["2025-04-06", "UPIAB/455862307702/CR/ABHIMANY/HDFC/9993582110-2@a", null, 1500.00, 22554.79],
  ["2025-04-07", "NEFT:RAZORPAY SOFTWARE PRIVATE LIMITED - AXISCN095", null, 489.18, 23043.97],
  ["2025-04-07", "UPIAB/602598143391/CR/RISHI KU/HDFC/6265485041-2@y", null, 201.00, 23244.97],
  ["2025-04-07", "UPIAB/440761464360/CR/KIRAN PA/BARB/kiranpandey425", null, 100.00, 23344.97],
  ["2025-04-07", "UPIAB/742168787730/CR/MUKESH S/UBIN/mukeshsingh010", null, 101.00, 23445.97],
  ["2025-04-07", "UPIAB/509759273452/CR/AYUSH PA/UBIN/ayush.3410-4@w", null, 301.00, 23746.97],
  ["2025-04-08", "UPIAB/509896114678/CR/RITESH K/KKBK/rrtiwari8853@o", null, 101.00, 23847.97],
  ["2025-04-09", "UPIAB/740259298374/CR/JYOTSANA/IOBA/9205493490-2@a", null, 50.00, 23897.97],
  ["2025-04-11", "UPIAB/103012249873/CR/ARVIND C/HDFC/arvind.chaudha", null, 100.00, 23997.97],
  ["2025-04-15", "NEFT:RAZORPAY SOFTWARE PRIVATE LIMITED - AXISCN096", null, 489.18, 24487.15],
  ["2025-04-26", "UPIAB/759787183324/CR/SHIVAM/SBIN/ 7999906522@yb", null, 101.00, 24588.15],
  ["2025-04-26", "UPIAB/548252743746/CR/VISHAL D/UBIN/vishal.vd5436@", null, 101.00, 24689.15],
  ["2025-05-05", "March 25 Worldine QR Rent", 29.50, null, 24659.65, "271"],
  ["2025-05-10", "IMPSAB/513028127903/RazorpayX Private L/9999999999", null, 48.45, 24708.10],
  ["2025-05-13", "SELF", 10000.00, null, 14708.10, "33341500"],
  ["2025-05-20", "chrge rec for DUP. STATEMENT >1 YR!", 210.04, null, 14498.06],
  ["2025-05-30", "IMPSAB/515017704291/PERFIOS SOFTWARE SO/0000000091", null, 1.00, 14499.06],
  ["2025-05-30", "IMPSAB/515019480127/CASHFREE PAYMENTS I/6364859966", null, 1.00, 14500.06],
  ["2025-05-30", "IMPSAB/515019109422/CashfreePayments/6364888137", null, 1.08, 14501.14],
  ["2025-06-25", "NEFT:RAZORPAY SOFTWARE PRIVATE LIMITED - AXISCN100", null, 489.18, 14990.32],
  ["2025-06-28", "UPIAB/516178642884/CR/ABHIMANY/HDFC/9993582110-2@y", null, 1000.00, 15990.32],
  ["2025-06-29", "Sms Charges For June Qtr ,2025", 8.56, null, 15981.76],
  ["2025-07-17", "Charges for PORD Customer Payment:UBINJ25198586956", 2.66, null, 15979.10],
  ["2025-07-17", "NEFTO-RAMESH PANDEY 002177173372", 100.00, null, 15879.10],
  ["2025-07-17", "Charges for PORD Customer Payment:UBINJ25198499648", 2.66, null, 15876.44],
  ["2025-07-17", "NEFTO-BABU LAL PANDEY 002178170226", 100.00, null, 15776.44],
  ["2025-07-18", "Charges for PORD Customer Payment:UBINJ25199105165", 2.66, null, 15773.78],
  ["2025-07-18", "NEFTO-BABU LAL PANDEY 002179962188", 100.00, null, 15673.78],
  ["2025-07-20", "UPIAB/288554541654/CR/ASHA KOC/HDFC/ asha.k7@ptye", null, 1600.00, 17273.78],
  ["2025-07-20", "eTXN/To:653102010008241/Deepali Fee", 100.00, null, 17173.78],
  ["2025-07-20", "eTXN/To:776602120000759/Deepali", 1500.00, null, 15673.78],
  ["2025-07-21", "UPIAB/288607579632/CR/ASHA KOC/HDFC/ asha.k7@ptye", null, 1800.00, 17473.78],
  ["2025-07-25", "ePAY/To:BILLDESK PAYMENTS/664957525/", 10.00, null, 17463.78],
  ["2025-08-01", "UPIAB/902035225349/CR/JYOTSANA/IOBA/9205493490-2@a", null, 2000.00, 19463.78],
  ["2025-08-08", "ePAY/To:EPFO/532185534/2922508003676", 75.00, null, 19388.78],
  ["2025-08-14", "UPIAB/522655092925/CR/RAMESH P/UBIN/9971103790@pts", null, 261.00, 19649.78],
  ["2025-08-15", "UPIAB/522758897974/CR/RAMESH P/UBIN/9971103790@pts", null, 2000.00, 21649.78],
  ["2025-08-15", "UPIAB/522758929361/CR/RAMESH P/UBIN/9971103790@pts", null, 2000.00, 23649.78],
  ["2025-08-21", "Charges for PORD Customer Payment:UBINJ25233112870", 2.66, null, 23647.12],
  ["2025-08-21", "NEFTO-BABU LAL PANDEY 002239882863", 500.00, null, 23147.12],
  ["2025-08-21", "Charges for PORD Customer Payment:UBINJ25233958020", 2.66, null, 23144.46],
  ["2025-08-21", "NEFTO-BABU LAL PANDEY 002240700013", 2000.00, null, 21144.46],
  ["2025-09-02", "UPIAB/524555568923/CR/RAMESH P/UBIN/9971103790@pts", null, 1500.00, 22644.46],
  ["2025-09-02", "UPIAB/101715922173/CR/JYOTSANA/IOBA/9205493490-2@y", null, 2000.00, 24644.46],
  ["2025-09-04", "UPIAB/524779819963/CR/RAMESH P/UBIN/9971103790@pts", null, 5.00, 24649.46],
  ["2025-09-04", "UPIAB/524784011837/CR/RAMESH P/UBIN/9971103790@pts", null, 5.00, 24654.46],
  ["2025-09-08", "Charges for PORD Customer Payment:UBINJ25251648033", 2.66, null, 24651.80],
  ["2025-09-08", "NEFTO-BABU LAL PANDEY 002272010370", 2500.00, null, 22151.80],
  ["2025-09-28", "Sms Charges For Sept Qtr ,2025", 7.38, null, 22144.42],
  ["2025-10-06", "UPIAB/292895266997/CR/RAMESH P/UBIN/9971103790@pty", null, 10.00, 22154.42],
  ["2025-10-10", "eTXN/To:776602120000759/UBI", 4000.00, null, 18154.42],
  ["2025-12-12", "UPIAB/407978080413/CR/DHIRAJ K/ICIC/ 9650160536@ib", null, 2026.00, 20180.42],
  ["2025-12-27", "Sms Charges For Dec Qtr ,2025", 0.89, null, 20179.53],
  ["2026-01-24", "UPIAB/298938927703/CR/RAMESH P/UBIN/9971103790@pty", null, 1.00, 20180.53],
  ["2026-02-04", "eTXN/To:776602120000759", 6000.00, null, 14180.53],
  ["2026-02-10", "UPIAB/604115969645/CR/RIYA PAN/UBIN/9309439461@pth", null, 5.00, 14185.53],
  ["2026-03-10", "UPIAB/201636217288/CR/RAMESH P/UBIN/9971103790@pty", null, 10.00, 14195.53],
  ["2026-03-10", "UPIAB/201637489665/CR/ASHA KOC/HDFC/ asha.k7@ptye", null, 2000.00, 16195.53],
  ["2026-03-10", "UPIAB/201637644468/CR/ASHA KOC/HDFC/ asha.k7@ptye", null, 1000.00, 17195.53],
  ["2026-03-10", "Charges for PORD Customer Payment:UBINJ26069415939", 2.66, null, 17192.87],
  ["2026-03-10", "NEFTO-DHIRAJ KUMAR 002617102915", 2000.00, null, 15192.87],
  ["2026-03-19", "UPIAB/202203972453/CR/RAMESH P/UBIN/9971103790@pty", null, 10.00, 15202.87],
  ["2026-03-20", "UPIAB/566923197958/CR/PRAMEESH/UBIN/ 9144796001@ax", null, 200.00, 15402.87],
  ["2026-03-20", "UPIAB/594777436612/CR/PRITI P/SBIN/ 8085897964@yb", null, 200.00, 15602.87],
  ["2026-03-22", "Sms Charges For Mar Qtr ,2026", 2.36, null, 15600.51],
];

const toEntry = ([date, particulars, withdrawal, deposit, balance, chq]) => ({
  date, particulars,
  withdrawal: withdrawal ?? null,
  deposit: deposit ?? null,
  balance: balance ?? null,
  chqNum: chq || "",
});

export const BANK_STATEMENTS = {
  "UBIN-4814": {
    "2025-26": {
      accountId: "UBIN-4814",
      fy: "2025-26",
      periodFrom: "2025-04-01",
      periodTo: "2026-03-31",
      openingBalance: 19816.84,
      transactions: FY_2025_26.map(toEntry),
      summary: { totalDebits: 29262.35, totalCredits: 25046.02, closingBalance: 15600.51 },
      source: "Union Bank of India statement, generated 11-07-2026",
    },
  },
};

export const listBankStatements = (accountId) => Object.values(BANK_STATEMENTS[accountId] || {});

export const getBankStatement = (accountId, fy) => BANK_STATEMENTS[accountId]?.[fy] || null;

/** Convert a statement into Digital Office record payloads (module "bank"). */
export const bankStatementRecords = (accountId, fy) => {
  const st = getBankStatement(accountId, fy);
  if (!st) return [];
  return st.transactions.map((t, i) => ({
    module: "bank",
    recordDate: t.date,
    recordType: t.deposit != null ? "Deposit" : "Withdrawal",
    amount: t.deposit != null ? t.deposit : t.withdrawal,
    paymentMode: "Bank",
    direction: t.deposit != null ? "in" : "out",
    data: {
      category: "Bank Transaction",
      direction: t.deposit != null ? "in" : "out",
      purpose: t.particulars,
      referenceNo: t.chqNum || "",
      amount: t.deposit != null ? t.deposit : t.withdrawal,
      deposit: t.deposit,
      withdrawal: t.withdrawal,
      balance: t.balance,
      fy: st.fy,
      accountNumber: BANK_ACCOUNTS[accountId]?.accountNumber || "",
      particulars: t.particulars,
      chqNum: t.chqNum || "",
      openingBalance: st.openingBalance,
      slNo: i + 1,
      notes: "Imported from bank statement (" + st.fy + ")",
    },
  }));
};
