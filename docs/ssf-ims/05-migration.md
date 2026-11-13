# SSF-IMS — Legacy "SSF Digital Office" removal

> **Status: DONE.** The legacy **SSF Digital Office** subsystem has been removed
> completely. Only the **SSF-IMS** ("OneOffice") remains.

## 1. What happened

The IMS was originally built on top of the Digital Office. The Digital Office
data was migrated into the IMS masters at boot (additive and idempotent), so
every legacy row already exists as a native IMS record. With that migration
verified, the whole Digital Office subsystem was deleted:

| Removed | Where it lived |
|---|---|
| Office engine + finance + audit routes | `backend_node/routes/{digitalOfficeRoutes,financeRoutes,auditRoutes}.js` |
| Flat-register models | `backend_node/models/{DigitalOfficeRecord,DigitalOfficeAudit,FinanceTransaction,AuditYear,AuditRecord}.js` |
| Legacy seed + migration | `backend_node/services/ims/{legacyOfficeSeed,migrateLegacy}.js` |
| One-off scripts | `backend_node/{backup-digital-office.js,scripts/{migrate-legacy,restore-digital-office}.js}` |
| Legacy tests | `backend_node/tests/{workbookSeed,fyRegisters,legacyOfficeSeed,legacyMigration,legacyReachability}.test.js` |
| Legacy office UI | `src/ims/oldOffice*.jsx`, `src/routes/ims/{office.jsx,legacy/}` |
| Legacy register components | `src/components/{RegisterEngine,registerFactory,FinanceOffice,FinanceOps,FinanceRegisters,Tier5Registers,Tier6Registers,AssetsFundsRegisters,AuditComplianceRegisters,ChartOfAccounts,FYMaster,SahyogRegister,PettyCashRegister,TransferRegister,AdjustmentRegister,FundMaster,GrantRegister}.jsx` |

## 2. Where the data lives now

Every register the Digital Office owned is a **native IMS resource** served by
the generic engine (`backend_node/services/ims/resource.js`) and rendered by
`/ims/r/<resource>`. The seed services write straight into the IMS tables:

- `services/ims/workbookSeed.js` — official-registers workbook + CA-signed audit years.
- `services/ims/fyRegistersSeed.js` — FY registers (sector activities, compliance, Sahyog in-kind).
- `scripts/bootstrap-database.js` — fresh-install bootstrap (IMS only).

Bank statements that the old Bank Book page used to read from the frontend now
flow through the IMS statement importer (`scripts/backfill-bank-statements.js` →
`src/data/bankStatements.js` → `/ims/finance/statement-import`).

## 3. If data still looks missing

The migration was additive, so nothing was deleted from the IMS side. If a
specific register looks empty, re-run the relevant seed from the admin
**Import / Export** (`/ims/data`) page, or check the resource directly at
`/ims/r/<resource>`.

*End of note.*
