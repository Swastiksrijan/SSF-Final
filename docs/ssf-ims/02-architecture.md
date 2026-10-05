# SSF-IMS — Phase 2: Data Architecture

## Core principle
**ENTER ONCE → LINK EVERYWHERE.** One master record per real-world entity; everything else references it.

## ID scheme (permanent, never reused)

| Entity | Format |
|---|---|
| Person | `PERSON-000001` |
| Member | `MEM-2027-0001` |
| Donor | `DON-2027-0001` |
| Volunteer | `VOL-2027-0001` |
| Employee | `EMP-2027-0001` |
| Beneficiary | `BEN-2027-0001` |
| Project | `PROJECT-2027-0001` |
| Programme | `PROGRAM-2027-0001` |
| Meeting | `MEET-2027-0001` |
| Resolution | `RES-2027-0001` |
| Action | `ACTION-2027-0001` |
| Case | `CASE-2027-0001` |
| Document | `DOC-2027-0001` |
| Transaction | `TXN-2027-0001` |
| Voucher | `VCH-2027-0001` |
| Asset | `ASSET-2027-0001` |
| Audit | `AUDIT-2027-0001` |

Implemented in `services/ims/ids.js` via an atomic `ImsIdSequence` counter (row-locked). IDs are never reused.

## Master records (central tables)
Person · Organisation · Member · Donor · Volunteer · Employee · Beneficiary · Committee/OfficeBearer · User · Project · Programme · Activity · Meeting · Resolution · Action · Notice/Communication · Case · Fund · Grant · BankAccount · CashAccount · Account(Chart of Accounts) · FinancialYear · CostCentre · Party/Vendor · Asset · InventoryItem · Document · Compliance · Audit · Risk · Policy · Agreement/MoU · Location.

## Relationship model (universal)
`ImsRelation { fromType, fromId, toType, toId, relation, meta }` gives every record a **Related Records** section without bespoke join tables. Plus explicit foreign keys where the link is structural (e.g. `Meeting.projectId`).

Example:
- Meeting `MEET-2027-0004` → relations → Members, Attendance, Notice, Agenda, Minutes, `RES-2027-017`, `ACTION-2027-032`, Project, Transaction, Documents, Communications.
- Person `PERSON-000123` → roles (Member+Donor+Volunteer), payments, meetings, notices, cases, documents.

## Status model (no hard delete)
`draft · active · approved · closed · cancelled · archived · superseded` — history preserved, corrections versioned.

## Modules (15) → tables

| Module | Tables |
|---|---|
| 1 Organisation & Constitution | Organisation, GovernanceRule, Policy, Location |
| 2 People, Members & Governance | Person, Role, PersonRole, Membership, Committee, CommitteeMember |
| 3 Meetings & Decisions | Meeting, MeetingAttendee, Resolution, Action, Communication |
| 4 Notices, Cases & Follow-up | Notice, Case, Communication |
| 5 Programmes & Projects | Programme, Project, Activity, Beneficiary |
| 6 Beneficiaries & Community | Beneficiary, Activity |
| 7 Finance & Accounts | FinancialYear, Fund, CostCentre, Account, Party, BankAccount, CashAccount, Transaction, Voucher |
| 8 Donors, Contributions & Grants | Donor, Donation, Grant, Agreement |
| 9 Procurement, Stock & Assets | Asset, InventoryItem, Party |
| 10 HR & Volunteers | Employee, Volunteer, Attendance, Payroll |
| 11 Compliance, Legal & Statutory | Compliance, Agreement, Location |
| 12 Audit, Risk & Integrity | Audit, Risk, AuditTrail |
| 13 Documents & Institutional Memory | Document, DocumentLink |
| 14 Communication Centre | Communication, Notification |
| 15 Reports | (generated from linked data) |

## RBAC
Roles: Super Admin, Organisation Admin, President, Secretary, Treasurer, Finance Officer, Programme Manager, HR/Admin, Compliance Officer, Auditor, Reviewer, Data Entry, Volunteer Coordinator, Read Only, Restricted Case Officer.
Permissions at module / record / action / sensitive-field level (`services/ims/rbac.js`).

## Audit trail
Every write logs who/what/old/new/when via `services/ims/audit.js` into `ImsAuditTrail`.

## Governance rules (configurable, versioned)
Stored in `GovernanceRule { key, value, source, ruleText, effectiveDate, version, approvedBy, supersededDate }` — seeded from SSF bylaws (GB yearly, GB notice 15d, GB quorum 3/5, MC monthly, MC notice 7d, MC quorum 1/2, committee 9 posts, term 3y, Secretary ₹5,000, Treasurer ₹4,500, Registrar filing 45d). Never hardcoded.

## Bilingual
All fixed labels/statuses/messages live in `src/ims/i18n.js` (EN + HI). Data is stored language-neutral; user-entered text is never auto-translated.
