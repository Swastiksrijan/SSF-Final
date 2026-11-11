# SSF-IMS — How many registers are needed (per Niyamavali)?

> Aapka sawaal: **"Niyamavali ke hisaab se asal me kitni registers chahiye?"**
> Jawab: **23 primary register modules + 19 linked compliance/operational views = 42 index entries**. 23 primary registers use dedicated IMS masters; 7 additional views reuse those same masters or existing office registers so duplicate data is not created.

> Ye list system ke andar hi zinda hai — `/api/ims/register-map` endpoint
> har register ka **live count** deta hai, aur **Registers Required** page
> par screen par dikhta hai. Isliye ye sirf ek document nahi, chalne wala
> hisaab hai.

## A. Governance / शासन (7)

| # | Register | पंजिका | Niyamavali aadhaar | IMS master |
|---|---|---|---|---|
| 1 | Members Register | सदस्य पंजिका | Bylaw — membership categories & fees | `members` |
| 2 | Managing Committee Register | प्रबंधकारिणी पंजिका | Bylaw — committee of 9, term 3 years | `committeeMembers` |
| 3 | Meetings & Minutes Register | बैठक एवं कार्यवृत्त पंजिका | Bylaw — GB yearly, MC monthly; notice 15/7 days | `meetings` |
| 4 | Resolutions Register | संकल्प पंजिका | Bylaw — special resolution to Registrar in 45 days | `resolutions` |
| 5 | Action-Taken Register | कार्य-अनुपालन पंजिका | Accountability — decision follow-up | `actions` |
| 6 | Attendance Register | उपस्थिति पंजिका | Bylaw — quorum 3/5 (GB), 1/2 (MC) | `attendees` |
| 7 | Constitution & Bylaws | संविधान एवं नियमावली | Memorandum & Rules | `governanceRules` |

## B. Finance / वित्त (7)

| # | Register | पंजिका | Niyamavali aadhaar | IMS master |
|---|---|---|---|---|
| 8 | Cash Book | रोकड़ पंजिका | Rule 20 — maximum cash in hand ₹4,500; not a daily spending limit | `cashAccounts` |
| 9 | Bank Book | बैंक पंजिका | Accountability — bank reconciliation | `bankAccounts` |
| 10 | Voucher Register | वाउचर पंजिका | Rule 15–19 — Secretary spending authority up to ₹5,000 per task (as provided) | `vouchers` |
| 11 | Donation Register | दान पंजिका | Accountability — 80G receipts | `donations` |
| 12 | Grant Register | अनुदान पंजिका | Accountability — utilisation certificates | `grants` |
| 13 | Fixed Asset Register | स्थायी संपत्ति पंजिका | Accountability — asset verification | `assets` |
| 14 | Ledger / Day Book | बहीखाता / रोजनामा | Accountability — books of account | `transactions` |

## C. Programmes / कार्यक्रम (4)

| # | Register | पंजिका | Aadhaar | IMS master |
|---|---|---|---|---|
| 15 | Project Register | परियोजना पंजिका | Accountability — project delivery | `projects` |
| 16 | Activity Register | गतिविधि पंजिका | Accountability — activity evidence | `activities` |
| 17 | Beneficiary Register | लाभार्थी पंजिका | Accountability — beneficiary consent | `beneficiaries` |
| 18 | Document Register | दस्तावेज़ पंजिका | Accountability — document control | `documents` |

## D. Compliance / अनुपालन (3)

| # | Register | पंजिका | Aadhaar | IMS master |
|---|---|---|---|---|
| 19 | Compliance Register | अनुपालन पंजिका | Rule 21 — annual committee list within 45 days of annual meeting; audited accounts as prescribed | `compliance` |
| 20 | Audit Register | लेखा-परीक्षण पंजिका | Accountability — internal/external audit | `audits` |
| 21 | Risk Register | जोखिम पंजिका | Accountability — risk management | `risks` |

## E. People / मानव संसाधन (2)

| # | Register | पंजिका | Aadhaar | IMS master |
|---|---|---|---|---|
| 22 | Employee Register | कर्मचारी पंजिका | Accountability — payroll | `employees` |
| 23 | Volunteer Register | स्वयंसेवक पंजिका | Accountability — volunteer coordination | `volunteers` |

---

## F. Additional linked operational views (7)

| # | Register / view | पंजिका / विवरण | Basis | Existing IMS destination |
|---|---|---|---|---|
| 24 | Membership Application & Admission | सदस्यता आवेदन एवं प्रवेश | Rule 6 | `members` |
| 25 | Membership Categories & Honorary Members | सदस्यता श्रेणी एवं सम्माननीय सदस्य | Rules 5–9 | `members` |
| 26 | Membership Fee & Contribution | सदस्यता शुल्क एवं अंशदान | Rule 5 | `membership-contributions` |
| 27 | Annual & Special General Body Meetings | वार्षिक एवं विशेष आम सभा | Rule 10 | `meetings` |
| 28 | Meeting Notices, Agenda & Dispatch | बैठक सूचना, कार्यसूची एवं प्रेषण | Rule 10 | `meetings` |
| 29 | Stock & Inventory | भंडार एवं सामग्री | Operational control | `inventory` |
| 30 | Inward & Outward Correspondence | आवक एवं जावक पत्राचार | Operational record | `communications` |

These seven are **linked views**, not seven new independent databases. The same member, meeting, inventory or communication record must not be entered twice.

## Jawab ek line me

**IMS index presents 42 entries:** 23 primary register modules and 19 linked compliance/operational views. Counts are live only for the 23 primary models. Linked views open existing modules and are labelled Linked; they do not claim a separate database or a live count. Supporting masters (Persons, Funds, Accounts, Financial Years, Parties, Bank/Cash accounts, Committees, Programmes, Users) remain supporting masters, not separate registers.

**Note:** in 23 ke alawa kuch **supporting masters** bhi hain (Persons, Funds,
Accounts, Financial Years, Parties, Bank/Cash accounts, Committees, Programmes,
Users) jo in registers ko chalane ke liye zaroori hain — lekin wo "register"
nahi, "master" hain.


## G. Additional bylaw compliance controls (13 linked views)

| # | Register / view | Rule | IMS destination | Purpose |
|---|---|---|---|---|
| 31 | Annual Report & Progress Report | Rule 11 | annual-reports / documents | Historical year-wise reports are view-only; new signed reports should be stored in Documents and tabled at General Body |
| 32 | Permanent Fund | Rule 11 | funds | Permanent fund and property matters considered by General Body |
| 33 | Auditor Appointment & Tenure | Rule 11 | audits | General Body auditor appointment and audit evidence |
| 34 | Managing Committee Election & Result | Rule 12 | managing-committee | Eligible voters/candidates, nine positions and election result evidence |
| 35 | Committee Tenure, Extension & Handover | Rule 13 | managing-committee | Three-year term; extension up to six months only with General Body approval |
| 36 | Bank Mandate & Joint Signatories | Rule 20 | bank-book | Approved bank mandate and joint signatory evidence |
| 37 | Cash-in-Hand Limit Control | Rule 20 | cash-book | Maximum cash-in-hand ₹4,500; this is not a daily expense limit |
| 38 | Annual Committee List & Accounts Filing | Rule 21 | compliance | Committee list within 45 days after annual meeting and audited accounts filing evidence |
| 39 | Rules & Bylaws Amendment | Rule 22 | constitution | Two-thirds approval and applicable Registrar process |
| 40 | Dissolution & Asset Disposal | Rule 23 | assets | Dissolution resolution and remaining asset transfer record |
| 41 | Immovable Property & Registrar Permission | Rule 24 | assets | Property record and written permission evidence where required by the bylaws |
| 42 | Registrar-Called Meeting | Rule 25 | meetings | Meeting called by Registrar and related notice/minutes |
| 43 | Dispute & Resolution | Rule 26 | compliance | Dispute record, steps taken and outcome |

These 13 Rule 11–26 compliance views are part of the 19 linked views over existing modules, not separate databases. The exact statutory filing forms, deadlines and Registrar procedure must follow applicable Madhya Pradesh law and Registrar directions; this index does not replace legal verification.

## H. Important interpretation controls

- Rule 5(A)–(D) membership categories remain distinct. Honorary members may attend General Body meetings as stated in the bylaws but have no voting right; Rule 12 election eligibility is limited to categories 5(A), (B), (C) as written.
- Rule 10: Annual General Body, Special General Body and Managing Committee meetings are meeting types/bodies, not three separate membership classes. Keep minutes, notice, agenda, attendance and quorum evidence.
- Rule 12: Managing Committee consists of nine posts: President, Vice-President, Secretary, Treasurer, Joint Secretary and four members.
- Rule 13: retain start/end dates and any General Body-approved extension evidence.
- Rule 20: record approved joint bank signatories and cash-in-hand ceiling; do not convert ₹4,500 into a daily expense cap.
- Rule 21: the 45-day deadline relates to filing the annual committee list after the annual meeting; preserve separate proof of audited-account filing.
- Rules 22–26: keep amendment, dissolution, property, Registrar-called meeting and dispute evidence linked to the relevant decision/document.
- A linked view is not proof that the underlying workflow has full forms or validation. The source module remains the authoritative record and must be checked for required fields before operational use.
