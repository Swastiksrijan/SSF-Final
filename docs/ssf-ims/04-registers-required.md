# SSF-IMS — How many registers are needed (per Niyamavali)?

> Aapka sawaal: **"Niyamavali ke hisaab se asal me kitni registers chahiye?"**
> Jawab: **23 primary registers + 7 linked operational views = 30 register entries**. 23 primary registers use dedicated IMS masters; 7 additional views reuse those same masters or existing office registers so duplicate data is not created.

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
| 8 | Cash Book | रोकड़ पंजिका | Bylaw — Treasurer daily cash limit ₹4,500 | `cashAccounts` |
| 9 | Bank Book | बैंक पंजिका | Accountability — bank reconciliation | `bankAccounts` |
| 10 | Voucher Register | वाउचर पंजिका | Bylaw — Secretary expense limit ₹5,000 | `vouchers` |
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
| 19 | Compliance Register | अनुपालन पंजिका | Bylaw — Registrar filing in 45 days | `compliance` |
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

**IMS now presents 30 register entries:** 23 primary registers (7 governance + 7 finance + 4 programme + 3 compliance + 2 people) and 7 linked operational views. The 23 primary registers have live counts from their existing IMS masters; the 7 linked views open the existing working modules and are labelled Linked rather than showing a misleading zero count. Supporting masters (Persons, Funds, Accounts, Financial Years, Parties, Bank/Cash accounts, Committees, Programmes, Users) remain supporting masters, not separate registers.

**Note:** in 23 ke alawa kuch **supporting masters** bhi hain (Persons, Funds,
Accounts, Financial Years, Parties, Bank/Cash accounts, Committees, Programmes,
Users) jo in registers ko chalane ke liye zaroori hain — lekin wo "register"
nahi, "master" hain.
