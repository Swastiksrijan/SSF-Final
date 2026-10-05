# SSF-IMS — Phase 4 Report (SSF OneOffice)

> **SSF OneOffice** · *One Organisation • One Record • Complete Accountability*
> **एक संस्था • एक रिकॉर्ड • पूर्ण जवाबदेही**
> Ye report aasan Hindi/Hinglish me hai — taki bina technical jaankari ke bhi samajh aaye.

---

## 1. Aasan bhasha me: humne kya banaya?

Pehle SSF Digital Office ek **flat register** tha — sab kuch ek hi table
(`DigitalOfficeRecords`) me `module` + JSON ke roop me pada tha. Isse:
- ek hi vyakti ke records alag-alag jagah bikhre rehte the,
- duplicate rows ban jaate the,
- aur "kaun sa register kahan hai" ka koi pakka hisaab nahi tha.

Ab humne **naya SSF OneOffice (SSF-IMS)** banaya hai jo **relational** hai:
- **Ek Person = ek permanent record.** Uske member/donor/volunteer/employee
  hone ka matlab sirf *role* hai — record dobara nahi banta.
  Isi ko hum kehte hain **"ENTER ONCE → LINK EVERYWHERE"**.
- Har record ko ek **permanent ID** milti hai (jaise `PERSON-000001`,
  `MEM-2026-0001`, `MEET-2026-0001`, `TXN-2026-0001`).
- Har entry par **Edit button** hai, aur har edit ka **version history**
  (kisne, kab, kya badla) apne aap save hota hai.
- **Purana kuch hataya nahi gaya** ("kuch hatana nhi") — purana Digital Office
  aur uske registers jyun ke tyun hain. Naya dashboard unhi records ko
  padhta hai aur sahi jagah dikhata hai.

---

## 2. Purane registers ka kya kiya? (aapka nirnay)

Aapne kaha tha: *"purane registers me mix aur duplicate hai — unhe chhedna nahi,
naya dashboard banao jo purane register data ko sahi jagah dikhaye."*

Isi hisaab se:
- Purane registers **read-only** rahenge (legacy).
- Naya IMS unhi data ko **sahi master** me dikhata hai.
- Duplicate detection built-in hai: naya entry banate waqt agar wahi mobile/email
  mila to system **409** dekar rok deta hai aur "Use existing" ka option deta hai.

---

## 3. System me kya-kya hai (modules)

**9 groups, 60+ screens:**

| Group | Kya hai |
|---|---|
| Main | Main Dashboard, Global Search, Notifications |
| Organisation | Organisation profile, Constitution & Bylaws, Governance Rules, **Registers Required**, Policies, History |
| Governance | Persons, Members, Committee, Committees, Meetings, Resolutions, Actions, Cases |
| Programmes | Programmes, Projects, Activities, Beneficiaries, Impact |
| Finance | Finance Dashboard, Financial Years, Funds, Accounts, Cost Centres, Transactions, Vouchers, Bank, Cash, Parties |
| Resources | Donors, Donations, Grants, Procurement, Assets, Inventory, Employees, Volunteers, Attendance |
| Compliance | Compliance, Legal/Agreements, Audit, Risks, Integrity |
| Records | Documents, Communications, Reports, Knowledge |
| Admin | Users, Permissions, Audit Trail, Import/Export |

---

## 4. Backend (technical summary)

- **47 IMS tables** PostgreSQL me ban gaye (Sequelize `sync`).
- Services: `ids.js` (permanent ID, atomic), `audit.js` (audit trail),
  `rbac.js`, `resource.js` (generic CRUD + duplicate check + role hooks),
  `person360.js`, `dashboard.js`, `seed.js`.
- Routes: `routes/imsRoutes.js` — generic CRUD, link, person360, dashboards,
  seed, global search, **audit-trail**, **integrity**, **register-map**,
  **coverage**, **per-record history**.
- Auth: wahi purana office token (`ADMIN_PORTAL_TOKEN`) — naya login banane ki
  zarurat nahi.

---

## 5. Frontend

- Naya `src/ims/` folder: `i18n.js` (EN/HI), `LangContext.jsx`, `nav.js`,
  `schemas.js` (har register ke fields), `api.js`, `ui.jsx`, `ImsLayout.jsx`.
- Naye pages: Dashboard, Resource browser, Person 360, Search, Reports,
  Knowledge, History, Notifications, Permissions, Data backup, Integrity,
  Audit Trail, Constitution, Registers Required, Finance/Impact/Procurement.
- **Har screen bilingual** — top-right button se English ⇄ हिंदी.
- Admin Dashboard aur Admin Portal me **"SSF OneOffice (IMS)"** ka button laga
  diya (purane "SSF Digital Office" button ko hataya nahi).

---

## 6. Verification (sandbox me chalaya gaya)

- ✅ `npm run build` pass (44 routes).
- ✅ Person create → `PERSON-000011` (201).
- ✅ Duplicate mobile → **409** block.
- ✅ Edit → version history me 2 events (create + update).
- ✅ Person 360 → roles, memberships, meetings, relations sab dikhte hain.
- ✅ Integrity checks, Audit Trail, Registers map — sab real data dete hain.
- ✅ Hindi mode me poora UI हिंदी me render hota hai.

---

## 7. Ab kya baaki hai (next)

1. **Production deploy** — Render (backend) + Vercel (frontend). Render DB ka
   backup pehle lena hai.
2. **Legacy data import** — purane `DigitalOfficeRecords` ko IMS masters me
   map karna (ek migration script).
3. Report PDF/download options, aur charts.

*Report khatam.*
