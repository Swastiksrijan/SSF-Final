# SSF-IMS — Phase 1: Existing System Audit

> Swastik Srijan Foundation — Integrated Management System
> Working name: **SSF OneOffice** · Tagline: *One Organisation • One Record • Complete Accountability*
> यह दस्तावेज़ पुराने **SSF Digital Office** का पूरा ऑडिट है (कुछ हटाया नहीं जाएगा)।

## 1. Technology stack (as found — will be reused)

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7 + TailwindCSS 4 + TanStack Router (file-based, `src/routes/*`) |
| UI libs | framer-motion, gsap, react-icons, lucide-react, jspdf, react-hot-toast |
| Backend | Node.js + Express (`backend_node/server.js`, port 5099 local) |
| ORM/DB | Sequelize + PostgreSQL (`ngo_db`) |
| Hosting | Vercel (frontend, `vercel.json`) + Render (`render.yaml`) |
| Auth (office) | Static bearer token: `ADMIN_PORTAL_TOKEN` (default `ssf-admin-portal-token`), header `Authorization: Bearer …`; frontend stores `ssf_admin_token` in localStorage |
| Auth (public users) | Member/volunteer login via `Members.passwordHash` + reset tokens |

## 2. Existing backend (Express) — 19 route files

- `digitalOfficeRoutes.js` (789 lines, 19 endpoints) — **core office engine**
- `financeRoutes.js` (260 lines, 8 endpoints)
- `auditRoutes.js` (438 lines, 13 endpoints)
- Public/portal: `memberCertificateRoutes`, `learningCertificateRoutes`, `volunteerAdminRoutes`, `adminUserRoutes`, `submissionRoutes`, `profileApplicationRoutes`, `volunteerRoutes`, `portalParticipationRoutes`, `userPortalRoutes`, `userDocumentRoutes`, `interestRoutes`, `contactRoutes`, `internshipRoutes`, `donorRoutes`, `roleDocumentRoutes`, `passwordResetRoutes`

## 3. Data model (13 Sequelize models, schema synced via `sequelize.sync({alter:true})`)

| Model / table | Purpose | Key fields |
|---|---|---|
| **DigitalOfficeRecord** (`DigitalOfficeRecords`) | **Universal office register row** — every module stores here as `module` + JSON `data` | id, recordId, module, recordType, status, recordDate, amount, direction, account, linkedRecordId, personId, createdBy, data(JSON), profilePhotoData |
| **DigitalOfficeAudit** (`DigitalOfficeAudits`) | Office audit trail | action, module, recordId, actor, details |
| **FinanceTransaction** (`FinanceTransactions`) | Integrated finance txn | transactionId, financialYear, transactionDate, transactionType, amount, direction, fundId, projectId, accountId, voucherId, donorId, memberId, partyId, linkedRecords, status, needsReview, data |
| **AuditRecord / AuditYear** | Audit register + years | auditId, financialYear, status, dueDate, data |
| **Member** (`Members`) | Public member accounts (identity source) | fullName, email, phone, passwordHash, memberType, memberId, status, paymentStatus, paymentAmount |
| **Volunteer / Donor / InternshipApplication / Interest / ContactMessage** | Public applications | own IDs, status workflow |
| **LearningCertificate / RoleDocument** | Certificates & role documents | certificateId, personId, role, documentNumber, verificationCode |

**Key architectural insight:** the office is essentially a **flat register store** — `DigitalOfficeRecords.module` currently holds **~120 distinct module names**, all sharing one JSON shape. This is exactly the duplication problem SSF-IMS must solve with a relational core.

## 4. Existing frontend

- `src/pages/SSFDigitalOffice.jsx` — **1803 lines, 28 components**, one file containing all registers.
- Sidebar `MODULES` array = **139 entries**, flat list (no grouping).
- Rich, hand-authored registers exist for: **Meetings** (calendar + online + resolutions), **Members Register** (8 sub-tabs), **Managing Committee** (8 sub-tabs), **Managing Committee History** (6 sub-tabs), **Institution Profile & Compliance** (10 sub-tabs), plus ~120 generic register cards.
- Route guard: `src/routes/SSFDigitalOffice.jsx` redirects to `/Admin` when `ssf_admin_token` missing.
- Other pages (public website + **Learning Hub**) are independent and must not be touched.

## 5. Live DB check (this sandbox)

Local `ngo_db` was created fresh for development; `sequelize.sync` created 13 tables with 0 rows. **Production data lives in the Render-hosted Postgres** and is not reachable from here. Migration must therefore run against a dump/connection, not this empty local DB.

## 6. What is genuinely valuable (must be preserved)

1. **Meeting engine** — calendar, online/offline/hybrid, Google Meet link generation, notices, attendance, minutes, resolutions, actions, WhatsApp group integration.
2. **Member register** — 8-tab profile, membership fee reminders (WhatsApp/Email), payment link, photo upload.
3. **Managing Committee** — 9-member seed, governance actions, historical committees.
4. **Institution Profile & Compliance** — 10 compliance sections with real SSF registration data.
5. **Finance** — Chart of Accounts, Fund/FY masters, transactions, ledger/journal, integrity + duplicate checks, audit years/records.
6. **Audit trail** — every office action already logged in `DigitalOfficeAudits`.

## 7. Migration inventory (KEEP / IMPROVE / MERGE / MOVE / REPLACE / ARCHIVE)

| Existing feature | Decision |
|---|---|
| Meetings + Resolutions + Online meeting + Notices | **IMPROVE** → linked Meeting/Resolution/Action masters |
| Members Register | **IMPROVE** → Person + Member masters |
| Managing Committee / History | **IMPROVE** → Committee/OfficeBearer masters |
| Institution Profile & Compliance | **MOVE** → Organisation + Constitution + Compliance modules |
| Chart of Accounts / Fund / FY | **KEEP** → Finance masters |
| Finance transactions / ledger / journal | **KEEP/IMPROVE** → single Transaction→Voucher→Ledger pipeline |
| Audit years / records / observations | **KEEP** → Audit module |
| ~120 generic registers | **MERGE** → into the 15 SSF-IMS modules (views preserved) |
| Duplicate registers (Member Register/Donors/Cash&Bank/Fixed Assets/vouchers/audit) | **MERGE** into one model, keep both views |
| All existing data | **PRESERVE** — backup before any migration |
| Old `SSF Digital Office` | **ARCHIVE** (read-only legacy) only *after* SSF-IMS verified |

## 8. Risks / constraints identified

- **No hard delete** for institutional records (already partly honoured — `status='deleted'` soft-archive).
- Seed-on-mount bug class (child effect before parent load) — already fixed once; SSF-IMS must never auto-write on view.
- Bilingual coverage currently uneven — SSF-IMS enforces EN/HI everywhere.
- Public website + Learning Hub are **out of scope** and must stay untouched.

*End of Phase 1 audit.*
