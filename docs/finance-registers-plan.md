# SSF Digital Office — Finance Registers Master Plan

> Goal: ek aisa MIS jo 50 saal bina structural badlav chale.
> Rule: **kuch hatana nahi** — jo hai wo rahega, sirf sahi/expand karenge.
> NGO hai — **loan register ki zarurat nahi**, par delete nahi karenge (deprioritize).

Legend: ✅ = app me already hai · 🔧 = hai par FY-wise / structure sahi karna hai · 🆕 = banana hai

---

## 0. 50-saal MIS ke 5 design rules (sabse pehle ye tay)

1. **Chart of Accounts (COA)** — har income/expense ka ek sthir head code (e.g. `INC-100 Donation`,
   `EXP-210 Rent`). 50 saal tak code nahi badlega, sirf naye head add honge.
2. **FY-wise partition** — har register har FY ka alag. Purana FY lock (read-only), naya FY kholna.
3. **Fund accounting** — Restricted (project/donor-bound) vs Unrestricted (general) har entry par.
4. **Sahyog / in-kind alag** — non-cash support bhi record ho, par cash book na badle.
5. **Audit trail** — har entry par: kaun, kab, FY, voucher no., source document ref.

---

## A. Core Books (मूल बहियाँ) — legal books

| # | Register | Hindi | Status |
|---|----------|-------|--------|
| A1 | Cash Book (FY-wise) | रोकड़ बही | 🔧 (cash) |
| A2 | Bank Book (FY-wise, multi-account) | बैंक बही | 🔧 (bank) |
| A3 | Cash–Bank Combined Book | रोकड़-बैंक संयुक्त बही | 🔧 (cashbank) |
| A4 | Journal (double entry) | रोजनामचा | ✅ (finance/journal) |
| A5 | Ledger (head-wise) | खाता बही | ✅ (finance/ledger) |
| A6 | Voucher Register | वाउचर रजिस्टर | ✅ (vouchers) |
| A7 | Receipt & Payment A/c (auto, FY) | प्राप्ति-भुगतान खाता | 🆕 |
| A8 | Income & Expenditure A/c (auto, FY) | आय-व्यय खाता | 🆕 |
| A9 | Balance Sheet (auto, FY) | तुलन-पत्र | 🆕 |
| A10 | Trial Balance (auto, FY) | शेष-सूची | 🆕 |

## B. Income / Receipts (आय रजिस्टर)

| # | Register | Hindi | Status |
|---|----------|-------|--------|
| B1 | Donation Register | दान रजिस्टर | ✅ (donations) |
| B2 | Membership Fee Register | सदस्यता शुल्क | ✅ (membership) |
| B3 | **Founder / Sahyog Register** | संस्थापक सहयोग | 🆕 (key) |
| B4 | In-kind & Voluntary Support Register | वस्तु-रूप / स्वयंसेवी सहयोग | 🆕 |
| B5 | Grant Register | अनुदान रजिस्टर | 🆕 |
| B6 | CSR Fund Register | सीएसआर कोष | 🆕 |
| B7 | Foreign Contribution (FCRA) Register | विदेशी अंशदान | 🆕 (agar FCRA) |
| B8 | Interest & Other Income Register | ब्याज एवं अन्य आय | 🆕 |
| B9 | Fund / Project-wise Income Register | निधि-वार आय | 🆕 |

## C. Expenditure (व्यय)

| # | Register | Hindi | Status |
|---|----------|-------|--------|
| C1 | Expense Register | व्यय रजिस्टर | ✅ (expenses) |
| C2 | Payment Voucher Register | भुगतान वाउचर | ✅ (vouchers) |
| C3 | Petty Cash Register | फुटकर रोकड़ | 🆕 |
| C4 | Procurement / Purchase Register | क्रय रजिस्टर | 🆕 |
| C5 | Salary, Honorarium & Stipend Register | वेतन / मानदेय | 🆕 |
| C6 | Rent Register (incl. Sahyog-supported) | किराया रजिस्टर | 🆕 |
| C7 | Program / Project Expense Register | कार्यक्रम व्यय | 🆕 |
| C8 | TDS Register | टी.डी.एस. | ✅ (tds) |
| C9 | Statutory Dues Register (PF/ESI/GST) | सांविधिक देय | ✅ (statutoryDues) |

## D. Assets & Liabilities (संपत्ति एवं दायित्व)

| # | Register | Hindi | Status |
|---|----------|-------|--------|
| D1 | Fixed Asset Register | स्थायी संपत्ति | ✅ (fixedAssets) |
| D2 | Depreciation Schedule | मूल्यह्रास | 🆕 (FA ka hissa) |
| D3 | Investment Register | निवेश रजिस्टर | ✅ (investments) |
| D4 | Loan / Borrowing Register | ऋण रजिस्टर | ✅ (loans) — *rakha, par NGO me zarurat nahi* |
| D5 | Security Deposit & Advances Register | जमा एवं अग्रिम | 🆕 |
| D6 | Creditors / Payables Register | लेनदार | 🆕 |
| D7 | Debtors / Receivables Register | देनदार | 🆕 |

## E. Banking (बैंकिंग)

| # | Register | Hindi | Status |
|---|----------|-------|--------|
| E1 | Bank Reconciliation Register | बैंक मिलान | ✅ (brs) |
| E2 | Bank Account Master | बैंक खाता मास्टर | 🆕 |
| E3 | Cheque / DD Issue & Receipt Register | चेक/डी.डी. | 🆕 |

## F. Budget & Control (बजट एवं नियंत्रण)

| # | Register | Hindi | Status |
|---|----------|-------|--------|
| F1 | Budget vs Actual Register | बजट एवं वास्तविक | ✅ (budget) |
| F2 | Fund Balance / Reserve Register | निधि शेष | 🆕 |
| F3 | Cash Flow Statement (auto) | रोकड़ प्रवाह | 🆕 |

## G. Compliance & Audit (अनुपालन एवं लेखा परीक्षा)

| # | Register | Hindi | Status |
|---|----------|-------|--------|
| G1 | Audit Register | लेखा परीक्षा | ✅ (audits) |
| G2 | Audited Statements Archive (FY-wise) | लेखा-परीक्षित विवरण | ✅ (audit-reports + auditReports.json) |
| G3 | Statutory Registration Register (12A/80G/FCRA/CSR-1/Darpan/ROC) | वैधानिक पंजीकरण | 🆕 |
| G4 | Tax & Return Filing Register (ITR-7, TDS returns, GST) | कर विवरणी | 🆕 |
| G5 | Donor 80G Receipt / Certificate Register | दान रसीद | 🔧 (donorSlips) |
| G6 | Related-Party & Conflict of Interest Register | संबंधित-पक्ष | 🆕 |

## H. MIS Masters (मास्टर)

| # | Register | Hindi | Status |
|---|----------|-------|--------|
| H1 | Chart of Accounts (Head Master) | लेखा-शीर्ष मास्टर | 🆕 |
| H2 | Fund / Project Master | निधि मास्टर | 🆕 |
| H3 | Party Master (Donor / Vendor / Member) | पक्षकार मास्टर | 🆕 |
| H4 | FY Master & Year-Close Register | वित्त-वर्ष मास्टर | 🔧 (AuditYear) |
| H5 | Opening Balance / Carry-forward Register | प्रारंभिक शेष | 🆕 |

---

## Founder / Sahyog Register — concept (B3)

Sahyog = koi bhi vyakti/institution SSF ke kaam me **bina rashi/rasid ke** jo sahyog de —
Founder cash de, advance de, office rent de, member fee na de to founder de,
IT vibhag, auditor, ya koi bhi. Ye **loan nahi** hai — ye contribution/sahyog hai.

- Kisi receipt/proof ki zarurat nahi. Sirf SSF internally record rakhe.
- Accounting: I&E me income (Sahyog) + uske saamne corresponding expense (rent/service) —
  net par asar nahi, par transparency + audit trail bane.

Suggested columns (final hum baad me tay karenge):
Sahyog ID · Date · FY · Sahyog Karta (Founder / Office Bearer / IT / Auditor / Other) · Name ·
Sahyog Type (Cash / Advance / Rent / Fee / Utility / Service / Goods / Space) · Description ·
Amount/Value (₹) · Mode (Cash / UPI / Bank / In-kind) · Kiske paksh me (SSF) · Recovered/Adjusted? (Y/N + date) ·
Balance · Remarks · Verified By.

---

## Next steps (one-by-one)

1. User is list ko confirm/edit kare.
2. Phir register-by-register: columns/rows tay karke, ek-ek karke banayenge.
3. Pehla target: **A1 Cash Book (FY-wise)** + **A2 Bank Book (FY-wise)** + **B3 Founder Sahyog**.
