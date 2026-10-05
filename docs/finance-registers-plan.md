# SSF Digital Office — Finance & Compliance Register Master (v2)

> Mission: ek aisa MIS jise **50 saal** tak structurally badalna na pade.
> Rule: **kuch hatana nahi** — jo hai wo rahega, sirf sahi / expand karenge.
> Nature: NGO / Society (pan-India) — **loan register ki zarurat nahi**, par hatayenge nahi.
> Basis: Mango NGO financial-management guide, ICAI / Societies Act, Income-Tax 12A/80G/10B/10BD,
> FCRA 2010 (FC-4), CSR Rules 2014 (CSR-1), NITI Darpan, and standard internal-control frameworks
> (segregation of duties, maker-checker, asset safeguarding).

Legend: ✅ already hai · 🔧 hai par FY-wise / structure sahi karna · 🆕 banana hai

---

## 0. Design principles (ye pehle freeze karenge — inhe 50 saal nahi badlenge)

1. **Chart of Accounts (COA)** — har income/expense ka sthir code: `INC-100`, `EXP-210`… Naye head add honge, purane code kabhi nahi badlenge.
2. **FY partition + Year-close** — har register har FY ka alag; FY close hone par **lock** (read-only), naya FY kholna. Opening balance auto carry-forward.
3. **Dual view** — Cash basis (Receipt & Payment A/c) aur Mercantile/accrual (Income & Expenditure A/c) dono support; donor/auditor dono ko chahiye.
4. **Fund accounting** — har entry par: Restricted (project/donor-bound) vs Unrestricted (general), aur Corpus vs General.
5. **Cost-centre / Programme code** — har kharch/income par programme/project tag.
6. **Sahyog & In-kind alag ledger** — non-cash support bhi record ho, par Cash Book na badle (dual entry: income + matching expense → net zero, transparency bane).
7. **Audit trail & immutability** — har entry par: kaun, kab, FY, voucher no., source-document ref; post-close edit allowed nahi, sirf reversal/adjustment entry.
8. **Maker–checker** — banane wala aur approve karne wala alag; approval log.
9. **Source-document vault** — har entry ke saath bill/receipt/UTR attach (document index).
10. **Statutory mapping** — har register kis law/return se juda hai, wo tag hoga (audit-ready).

---

## 1. CORE BOOKS (मूल बहियाँ) — legal books of account

| Code | Register | Hindi | Why / Basis | Frequency | Status |
|------|----------|-------|-------------|-----------|:------:|
| CORE-01 | Cash Book | रोकड़ बही | Societies Act / IT 12A books | Daily | 🔧 |
| CORE-02 | Bank Book (multi-account) | बैंक बही | IT / FCRA (separate a/c) | Daily | 🔧 |
| CORE-03 | Cash–Bank Combined Book | रोकड़-बैंक संयुक्त | Daily cash position | Daily | 🔧 |
| CORE-04 | Journal | रोजनामचा | Double-entry | Daily | ✅ |
| CORE-05 | General Ledger (head-wise) | खाता बही | Books of account | Monthly | ✅ |
| CORE-06 | Voucher Register | वाउचर रजिस्टर | Voucher numbering | Daily | ✅ |
| CORE-07 | Petty Cash / Imprest | फुटकर रोकड़ | Small-expense control | Daily | 🆕 |
| CORE-08 | Bank/Cash Transfer Register | अंतरण रजिस्टर | Inter-account / inter-project | Per event | 🆕 |
| CORE-09 | Receipt & Payment A/c (auto) | प्राप्ति-भुगतान खाता | Cash-basis statement | Annual (auto) | 🆕 |
| CORE-10 | Income & Expenditure A/c (auto) | आय-व्यय खाता | Accrual statement | Annual (auto) | 🆕 |
| CORE-11 | Balance Sheet (auto) | तुलन-पत्र | Position statement | Annual (auto) | 🆕 |
| CORE-12 | Trial Balance (auto) | शेष-सूची | Books correctness | Monthly | 🆕 |
| CORE-13 | Adjustment / Prior-period Entry | समायोजन प्रविष्टि | Audit adjustments | Per event | 🆕 |

## 2. INCOME & RECEIPTS (आय एवं प्राप्तियाँ)

| Code | Register | Hindi | Why / Basis | Key fields (direction) |
|------|----------|-------|-------------|------------------------|
| INCM-01 | Donation Register | दान रजिस्टर | IT 80G / 10BD | donor, PAN, receipt no., mode, amount, 80G?, purpose |
| INCM-02 | Corpus Donation Register | कोष दान | IT 11(1)(d) corpus direction | donor, corpus-direction letter, amount |
| INCM-03 | Membership Fee Register | सदस्यता शुल्क | Society rules | member, fee type, period, receipt no. |
| INCM-04 | **Founder / Sahyog Register** | संस्थापक सहयोग | Internal + transparency | see §14 |
| INCM-05 | In-kind & Voluntary Support | वस्तु-रूप सहयोग | AS/in-kind | item/service, fair value, donor, usage |
| INCM-06 | Grant Register (domestic) | अनुदान | Grant agreement | grantor, agreement no., sanctioned, received, UC due |
| INCM-07 | CSR Fund Register | सीएसआर | CSR Rules 2014 / CSR-1 | company, CSR-2 ref, project, amount |
| INCM-08 | Foreign Contribution (FCRA) Register | विदेशी अंशदान | FCRA 2010, FC-4 | donor country, designated SBI a/c, purpose, utilisation |
| INCM-09 | Interest & Other Income | ब्याज एवं अन्य आय | IT | source, TDS, amount |
| INCM-10 | Donation-in-kind (Goods) | वस्तु दान | IT / in-kind | item, qty, value, donor |
| INCM-11 | Event / Programme Income | कार्यक्रम आय | IT | event, receipts, expenses |
| INCM-12 | Anonymous Donation Register | गुमनाम दान | IT (taxable!) | date, amount, mode |
| INCM-13 | Fund/Project-wise Income | निधि-वार आय | Fund accounting | fund, project, amount |
| INCM-14 | Pledge / Commitment Register | प्रतिज्ञा | Donor management | donor, pledged, received, balance |

## 3. EXPENDITURE & PAYMENTS (व्यय एवं भुगतान)

| Code | Register | Hindi | Why / Basis | Key fields |
|------|----------|-------|-------------|-----------|
| EXPN-01 | Expense Register | व्यय रजिस्टर | Books | date, head, party, amount, mode, bill no. |
| EXPN-02 | Payment Voucher Register | भुगतान वाउचर | Internal control | voucher no., approver, payee, UTR |
| EXPN-03 | Procurement / Purchase Register | क्रय रजिस्टर | Best value / IT 40A(3) | quotation, vendor, PO, GRN, amount |
| EXPN-04 | Salary & Payroll Register | वेतन रजिस्टर | PF/ESI/TDS | employee, gross, deductions, net, bank |
| EXPN-05 | Honorarium & Stipend Register | मानदेय | Interns/volunteers | name, role, period, amount, TDS |
| EXPN-06 | Rent Register (incl. Sahyog) | किराया | TDS 194I | premises, rent, TDS, Sahyog portion |
| EXPN-07 | Programme / Project Expense | कार्यक्रम व्यय | Fund accounting | project, activity, amount, fund |
| EXPN-08 | Travel & Reimbursement Register | यात्रा/प्रतिपूर्ति | IT | claimant, purpose, amount, bills |
| EXPN-09 | Advance to Staff/Vendor + Settlement | अग्रिम एवं निपटान | Internal control | payee, advance, settled, balance |
| EXPN-10 | Capital Expenditure Register | पूँजीगत व्यय | Capitalisation | asset, cost, date, vendor |
| EXPN-11 | TDS Register | टी.डी.एस. | 194C/J/I/H/A | party, section, rate, challan, quarter |
| EXPN-12 | Statutory Dues (PF/ESI/GST/PT) | सांविधिक देय | PF/ESI/GST | type, period, due, paid, challan |
| EXPN-13 | Bank Charges & Misc Register | बैंक शुल्क | Books | date, nature, amount |

## 4. ASSETS & LIABILITIES (संपत्ति एवं दायित्व)

| Code | Register | Hindi | Why / Basis |
|------|----------|-------|-------------|
| ASST-01 | Fixed Asset Register | स्थायी संपत्ति | Cost, dep, WDV (ICAI) |
| ASST-02 | Depreciation Schedule | मूल्यह्रास | IT Act rates / AS |
| ASST-03 | Investment Register | निवेश रजिस्टर | FD/RD/MF, maturity |
| ASST-04 | Loan / Borrowing Register | ऋण रजिस्टर | *rakha — NGO me zarurat nahi* |
| ASST-05 | Security Deposit & Advances | जमा/अग्रिम | Recoverable tracking |
| ASST-06 | Creditors / Payables | लेनदार | Outstanding bills |
| ASST-07 | Debtors / Receivables | देनदार | Grant/pledge receivable |
| ASST-08 | Corpus / Endowment Fund Register | कोष निधि | IT 11(1)(d) |
| ASST-09 | Restricted & Unrestricted Fund Register | निधि वर्गीकरण | Fund accounting |
| ASST-10 | Reserve Fund Register | संचित कोष | Board-approved reserves |
| ASST-11 | Contingent Liability & Commitments | आकस्मिक दायित्व | Disclosure |
| ASST-12 | Asset Physical Verification Register | भौतिक सत्यापन | Asset safeguarding |
| ASST-13 | Insurance Register | बीमा | Asset/liability cover |

## 5. BANKING & TREASURY (बैंकिंग एवं कोषागार)

| Code | Register | Hindi | Why / Basis |
|------|----------|-------|-------------|
| BANK-01 | Bank Account Master | बैंक खाता मास्टर | All accounts + FCRA designated |
| BANK-02 | Bank Reconciliation Register | बैंक मिलान | Monthly BRS |
| BANK-03 | Cheque / DD Issue Register | चेक जारी | Control, stop-payment |
| BANK-04 | Cheque Book & Stationery Register | चेक पुस्तिका | Control |
| BANK-05 | Signatory / Authority Register | हस्ताक्षर अधिकार | Board-resolution ref |
| BANK-06 | FD / Investment Receipt Register | सावधि जमा | Maturity, interest |

## 6. BUDGET & CONTROL (बजट एवं नियंत्रण)

| Code | Register | Hindi | Why |
|------|----------|-------|-----|
| BUDG-01 | Budget vs Actual Register | बजट एवं वास्तविक | Board-approved budget |
| BUDG-02 | Budget Revision Register | बजट संशोधन | Approval trail |
| BUDG-03 | Cash Flow Statement (auto) | रोकड़ प्रवाह | Liquidity |
| BUDG-04 | Fund Balance / Utilisation Register | निधि उपयोग | Restricted-fund tracking |
| BUDG-05 | Variance & Exception Register | अंतर विश्लेषण | Management review |

## 7. COMPLIANCE & STATUTORY (अनुपालन एवं सांविधिक)

| Code | Register | Hindi | Why / Basis |
|------|----------|-------|-------------|
| COMP-01 | Statutory Registration Register | पंजीकरण | Society/12A/80G/FCRA/CSR-1/Darpan/PAN/TAN/ROC |
| COMP-02 | Tax & Return Filing Register | कर विवरणी | ITR-7, 10B/10BB, 10BD/10BE, 24Q/26Q, GST |
| COMP-03 | Form 10BD / 10BE Donation Reporting | दान सूचना | IT (since FY 2021-22) |
| COMP-04 | FCRA FC-4 / FC-3 Register | एफ.सी.आर.ए. | FCRA annual/quarterly |
| COMP-05 | Donor 80G Receipt Register | 80G रसीद | Donor certificate |
| COMP-06 | Compliance Calendar / Due-date Register | अनुपालन कैलेंडर | Deadlines |
| COMP-07 | Legal & Statutory Case Register | विधिक वाद | Litigation |
| COMP-08 | Property / Lease & Utilities Register | संपत्ति/पट्टा | Ownership, NOC, bills |
| COMP-09 | Related-Party & Conflict of Interest | संबंधित पक्ष | Governance/audit |
| COMP-10 | Licence & Renewal Register | अनुज्ञप्ति | Expiry tracking |

## 8. GOVERNANCE & MINUTES (शासन एवं कार्यवृत्त)

| Code | Register | Hindi | Why |
|------|----------|-------|-----|
| GOVN-01 | AGM / General Body Minutes | आम सभा कार्यवृत्त | Societies Act |
| GOVN-02 | Executive Committee Minutes | कार्यकारिणी कार्यवृत्त | Governance |
| GOVN-03 | Resolution Register | संकल्प रजिस्टर | Approvals (rent, budget…) |
| GOVN-04 | Delegation of Authority Register | अधिकार प्रत्यायोजन | Maker–checker |
| GOVN-05 | Policy Register | नीति रजिस्टर | Finance/HR/procurement policies |
| GOVN-06 | Member Register | सदस्य रजिस्टर | Society annual list |
| GOVN-07 | Office-Bearer / Committee Register | पदाधिकारी | Signatories |

## 9. AUDIT & ASSURANCE (लेखा परीक्षा एवं आश्वासन)

| Code | Register | Hindi | Why |
|------|----------|-------|-----|
| AUDT-01 | Audit Register | लेखा परीक्षा | Statutory/Internal/Donor audit |
| AUDT-02 | Audited Statements Archive (FY-wise) | लेखा-परीक्षित विवरण | CA-signed set |
| AUDT-03 | Audit Observation & Compliance | लेखा टिप्पणी | Finding → action |
| AUDT-04 | Internal Audit Register | आंतरिक लेखा परीक्षा | Periodic |
| AUDT-05 | Management Response / Action Taken | प्रबंधन उत्तर | Closure trail |

## 10. DONOR & GRANTOR MANAGEMENT (दानदाता प्रबंधन)

| Code | Register | Hindi | Why |
|------|----------|-------|-----|
| DONR-01 | Donor Master | दानदाता मास्टर | 80G, PAN, history |
| DONR-02 | Grant Agreement Register | अनुदान करार | Terms, conditions |
| DONR-03 | Utilisation Certificate Register | उपयोग प्रमाणपत्र | Grantor UC |
| DONR-04 | Donor Reporting Calendar | दानदाता रिपोर्टिंग | Deadlines |
| DONR-05 | Foreign Donor Register | विदेशी दानदाता | FCRA |

## 11. HR & PAYROLL INTERFACE (मानव संसाधन)

| Code | Register | Hindi | Why |
|------|----------|-------|-----|
| HRPY-01 | Employee Master | कर्मचारी मास्टर | Payroll link |
| HRPY-02 | Attendance / Leave Register | उपस्थिति | Salary calc |
| HRPY-03 | Volunteer & Intern Register | स्वयंसेवी | Honorarium link |
| HRPY-04 | Reimbursement & Advance Register | प्रतिपूर्ति | Control |

## 12. MIS MASTERS (मास्टर)

| Code | Register | Hindi | Why |
|------|----------|-------|-----|
| MSTR-01 | Chart of Accounts (Head Master) | लेखा-शीर्ष | COA codes |
| MSTR-02 | Fund / Project Master | निधि मास्टर | Restricted/unrestricted |
| MSTR-03 | Party Master (Donor/Vendor/Member) | पक्षकार | 360° view |
| MSTR-04 | Cost-centre / Programme Master | लागत केंद्र | Allocation |
| MSTR-05 | FY Master & Year-Close Register | वित्त-वर्ष | Lock/open |
| MSTR-06 | Opening Balance / Carry-forward | प्रारंभिक शेष | Year roll |
| MSTR-07 | Document / Attachment Index | दस्तावेज़ सूची | Source vault |

## 13. RISK & FRAUD CONTROL (जोखिम एवं धोखाधड़ी)

| Code | Register | Hindi | Why |
|------|----------|-------|-----|
| RISK-01 | Segregation-of-Duties Matrix | कार्य पृथक्करण | Internal control |
| RISK-02 | Maker–Checker / Approval Log | स्वीकृति लॉग | Control |
| RISK-03 | Access & Change Log | पहुँच लॉग | IT control |
| RISK-04 | Fraud / Whistleblower Register | शिकायत | Governance |
| RISK-05 | Risk Register | जोखिम रजिस्टर | Enterprise risk |

---

## 14. Founder / Sahyog Register — detailed spec (INCM-04)

**Sahyog** = koi bhi vyakti/institution SSF ke kaam me bina rashi/rasid ke jo sahyog de —
Founder cash de, advance de, office rent de, member fee na de to founder de, IT vibhag,
auditor, ya koi bhi. **Ye loan nahi hai** — ye contribution/sahyog hai. Kisi proof ki zarurat nahi;
SSF internally record rakhe (transparency + audit trail).

**Accounting treatment:** dual entry — `Income: Sahyog` + `Expense: <us kaam ka head>` → net par
asar nahi, par I&E dono taraf saaf dikhe (auditor ko "kaise diya" samajh aaye).

**Suggested columns:** `Sahyog ID · Date · FY · Sahyog Karta (Founder / Office Bearer / IT / Auditor /
Volunteer / Other) · Name · Sahyog Type (Cash / Advance / Rent / Fee / Utility / Service / Goods / Space) ·
Description · Amount/Value (₹) · Mode (Cash / UPI / Bank / In-kind) · Kiske paksh me (SSF / project) ·
Fund (Restricted/Unrestricted) · Recovered/Adjusted? (Y/N + date) · Balance · Voucher ref · Remarks · Verified By`

---

## 15. Compliance calendar (India-specific due dates)

| Return / Filing | Law | Due |
|-----------------|-----|-----|
| ITR-7 + Form 10B/10BB | Income Tax | 31 Oct (audit case) |
| Form 10BD / 10BE (donations) | Income Tax | 31 May / certificates issue |
| Form 10A / 10AB (12A/80G renewal) | Income Tax | As per cycle |
| TDS returns 24Q / 26Q | Income Tax | Quarterly |
| FC-4 annual return | FCRA | 31 Dec (prev FY) |
| FC quarterly return (>₹1 cr) | FCRA | 15 days after quarter |
| CSR-1 / CSR reporting | Companies Act | As applicable |
| Society annual return + audit | Societies Act | State-specific |
| GST returns | GST | If registered |
| PF / ESI returns | PF/ESI | Monthly |

---

## 16. Build order (one-by-one, tiers)

**Tier 1 (foundation):** MSTR-01 COA · MSTR-02 Fund Master · MSTR-05 FY Master/Year-Close · MSTR-06 Opening Balance · CORE-01/02/03 Cash & Bank (FY-wise) · INCM-04 Founder Sahyog.

**Tier 2 (core registers):** INCM-01 Donation · INCM-03 Membership · INCM-06 Grant · EXPN-01 Expense · CORE-06 Voucher · CORE-07 Petty Cash · BANK-02 BRS.

**Tier 3 (statements & audit):** CORE-09..13 auto statements · AUDT-01/02/03 · COMP-01/02/03.

**Tier 4 (assets & funds):** ASST-01/02/08/09 · EXPN-03/04/05 · BUDG-01/04.

**Tier 5 (compliance & governance):** COMP-04..10 · GOVN-01..07 · DONR-01..05 · RISK-01..05.

---

## 17. Current coverage map (kuch hatana nahi)

Already ✅: cash, bank, cashbank, vouchers, donations, membership, expenses, members, meetings,
donorSlips, FinanceTransaction (canonical ledger + journal/ledger/integrity), AuditYear/AuditRecord,
auditReports.json, fixedAssets, tds, statutoryDues, brs, budget, loans, investments, audits.
Baaki sab 🆕 upar list me.

---

## 18. Open questions for user

1. FCRA registration hai? (nahi → INCM-08, DONR-05, COMP-04 defer)
2. GST registration hai? (nahi → GST head defer)
3. Payroll / PF-ESI hai? (nahi → HRPY, EXPN-04 defer)
4. Corpus donation alag rakhna hai?
5. Restricted vs Unrestricted fund tracking chahiye ya simple general fund?

---

## 19. DECISION LOG (user-confirmed, 2026-10-04)

1. **Sab registers rahenge** — kuch bhi hataana nahi, chahe abhi applicable na ho.
2. **GST** — abhi nahi. **FCRA** — abhi nahi. **ESI/EPFO** — registered hain par abhi koi
   salary/project diya-leta nahi; bhavishya me hoga.
   → In registers ko **"Dormant / Not Applicable Yet / भविष्य हेतु"** status ke saath **rakhenge**
   (delete nahi). Jab GST/FCRA/payroll shuru ho, sirf status Active karenge — structure badalna nahi padega.
3. **Bilingual (English + Hindi)** — har register, har label, har field, har button dono bhasha me.
4. **Har entry par EDIT button** — plus Add / View / Archive / Restore / Export. Silent overwrite
   allowed nahi: **Edit = naya version** (audit trail me purana value bhi rahega) — isse 50 saal baad
   bhi "kab, kisne, kya badla" pata chale.

### Register status model (har register ke liye ek status)
| Status | Meaning | Example abhi |
|--------|---------|--------------|
| Active | Abhi use ho raha hai | Cash Book, Bank Book, Donation, Sahyog |
| Dormant / N.A. Yet | Structure ready, abhi entry nahi | GST, FCRA, Payroll, PF/ESI |
| Future | Bhavishya me shuru hoga | Grant, CSR, Foreign Donor |

### Reusable Register Engine (ek hi pattern sab registers ke liye)
Har register me ye sab hoga — taaki 50 saal ek jaisa rahe:
`List view (bilingual headers) · Add · Edit (versioned) · View · Archive/Restore · Search · FY filter ·
Fund/Project filter · CSV export · PDF print · Audit trail (kaun/kab/kya) · Attachment link`

### Build order — updated
Tier 1 me pehle **Register Engine** banayenge (upar wala pattern), phir usi engine se ek-ek register:
Cash Book → Bank Book → Founder/Sahyog. Dormant registers (GST/FCRA/Payroll) Tier 5 me "Not Applicable
Yet" status ke saath add honge.

---

## 20. FINALIZED build order (2026-10-04) — "kya pehle ho"

Professional accounting sequence (cash-basis NGO books):

| Step | Kya | Kyun pehle |
|------|-----|-----------|
| 0 | **Chart of Accounts (COA) / लेखा-शीर्ष मास्टर** | Ye poore system ki reedh ki haddi hai. Har register entry, har statement isi head par tikega. Agar COA pehle freeze na ho, to Cash/Bank/Sahyog entries free-text heads me jayengi → baad me sab redo → "50 saal no change" toot jayega. |
| 0b | **FY Master + Opening Balance / वित्त-वर्ष एवं प्रारंभिक शेष** | Audited FY 2024-25 closing (Cash ₹1,265 + Bank ₹19,816.84 = ₹21,081.84) ko FY 2025-26 ke opening ke roop me carry-forward karna. |
| 1 | **Cash Book (रोकड़ बही)** | Pehli asli register — sabse primary book (R&P base). |
| 2 | **Bank Book (बैंक बही)** | Doosri primary book, multi-account (MGB/UBI). |
| 3 | **Sahyog Register (सहयोग रजिस्टर)** | Founder/well-wisher support — cash + in-kind. |
| 4+ | Donation, Expense, Voucher, Petty Cash, BRS, statements… | Uske baad. |

> **Sahyog ko pehle NAHI banayenge** — kyunki uski entry ko bhi ek COA head chahiye
> (`INC-110 Sahyog`). Foundation (COA) pehle, warna baad me sab redo.

---

## 21. Naming — Founder / Sahyog register (FINAL)

Concept: koi bhi vyakti/institution (Founder, Office-Bearer, IT dept, Auditor, Well-wisher) SSF ke
kaam me **bina rashi/rasid** jo sahyog de — cash, advance, rent, fee, utility, service, goods, space.
Ye **loan nahi**, **contribution/sahyog** hai.

**Recommended name (bilingual):**

- **English:** `Sahyog Register — Founder & Well-wisher Support`
- **Hindi:** `सहयोग रजिस्टर — संस्थापक एवं शुभचिंतक सहयोग`
- **Short / internal:** `Sahyog / सहयोग`
- **Code:** `INCM-04`

Kyun yahi naam: "Sahyog" user ki bhasha hai aur bhaav pakadta hai; "Founder & Well-wisher Support"
statutory/audit ke liye clear rakhta hai ki ye voluntary, non-receipt support hai (loan nahi).
Ek hi register me **cash sahyog** aur **in-kind sahyog** dono — kyunki user koi rasid/proof nahi chahta.

**Alternatives (agar pasand aaye):**
1. `Voluntary Support & Contribution Register` / `स्वैच्छिक सहयोग एवं अंशदान रजिस्टर` (zyada formal/audit)
2. `Founder & Patron Support Register` / `संस्थापक एवं संरक्षक सहयोग रजिस्टर`
3. `Support-in-Kind & Contribution Register` / `वस्तु-रूप एवं अंशदान रजिस्टर`

---

## 22. Chart of Accounts — proposed head master (bilingual, FY-proof)

### Income / आय
| Code | English | Hindi |
|------|---------|-------|
| INC-100 | Donation Received | दान प्राप्त |
| INC-110 | Sahyog — Founder & Well-wisher Support | सहयोग — संस्थापक एवं शुभचिंतक |
| INC-120 | Membership Fees | सदस्यता शुल्क |
| INC-130 | Grant (Domestic) | अनुदान (घरेलू) |
| INC-140 | CSR Fund | सीएसआर कोष |
| INC-150 | Foreign Contribution (FCRA) | विदेशी अंशदान |
| INC-160 | Interest & Other Income | ब्याज एवं अन्य आय |
| INC-170 | Event / Programme Income | कार्यक्रम आय |
| INC-180 | In-kind Support (Goods/Services/Space) | वस्तु-रूप सहयोग |

### Expenditure / व्यय
| Code | English | Hindi |
|------|---------|-------|
| EXP-200 | Education | शिक्षा |
| EXP-210 | Environment Protection & Awareness | पर्यावरण संरक्षण एवं जागरूकता |
| EXP-220 | Yoga Training | योग प्रशिक्षण |
| EXP-230 | Health & Wellness | स्वास्थ्य एवं कल्याण |
| EXP-240 | Stationery & Printing | लेखन सामग्री एवं छपाई |
| EXP-250 | Banner & Poster | बैनर एवं पोस्टर |
| EXP-260 | Refreshment | जलपान |
| EXP-270 | Phone & Mobile | दूरभाष एवं मोबाइल |
| EXP-280 | Travelling | यात्रा |
| EXP-290 | Rent | किराया |
| EXP-300 | Bank Charges | बैंक शुल्क |
| EXP-310 | Admin Expenses | प्रशासनिक व्यय |
| EXP-320 | Salary & Honorarium | वेतन एवं मानदेय |
| EXP-330 | Miscellaneous | विविध |
| EXP-340 | Programme / Project Expense | कार्यक्रम व्यय |
| EXP-350 | Depreciation | मूल्यह्रास |

### Assets / संपत्ति
| Code | English | Hindi |
|------|---------|-------|
| AST-400 | Cash in Hand | नकद शेष |
| AST-410 | Bank Balance | बैंक शेष |
| AST-420 | Furniture & Fixtures | फर्नीचर एवं सज्जा |
| AST-430 | Office Equipment | कार्यालय उपकरण |
| AST-440 | Computer & IT Equipment | कंप्यूटर एवं आई.टी. |
| AST-450 | Investments | निवेश |
| AST-460 | Advances & Deposits | अग्रिम एवं जमा |
| AST-470 | Receivables | देनदार |

### Liabilities & Funds / दायित्व एवं निधि
| Code | English | Hindi |
|------|---------|-------|
| LIA-500 | General Fund | सामान्य निधि |
| LIA-510 | Corpus Fund | कोष निधि |
| LIA-520 | Restricted Fund | प्रतिबंधित निधि |
| LIA-530 | Statutory Dues Payable | सांविधिक देय |
| LIA-540 | Loans | ऋण |
| LIA-550 | Payables | लेनदार |
| LIA-560 | Surplus / (Deficit) | अधिशेष / (घाटा) |

> Ye COA SSF ke asli audited heads (Education, Environment, Yoga, Rent, Admin, Bank Charges…)
> se banaya gaya hai. Naye head **add** ho sakte hain, purane code kabhi nahi badlenge.


