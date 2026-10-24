# SSF Digital Office → SSF OneOffice (IMS) Migration

## Goal
Make `/ims` the single supported office portal before retiring `/SSFDigitalOffice`. Do not delete the old route, backend endpoints, database tables, or records until acceptance checks pass.

## Repository findings (2026-10-24)
- The old admin portal is routed through `src/routes/SSFDigitalOffice.jsx` and rendered by `src/pages/SSFDigitalOffice.jsx`.
- The old portal declares 139 module IDs in its module catalogue.
- IMS already contains a compatibility layer:
  - `src/ims/oldOfficeModules.js` — legacy module catalogue.
  - `src/ims/oldOfficeCore.jsx` — reads/writes the same `ENDPOINTS.DIGITAL_OFFICE_RECORDS` API used by the old portal.
  - `src/ims/oldOfficePages.jsx` — 16 legacy-compatible screens, including dashboard, meetings, members, managing committee, membership contributions, notifications, reports, audit, users, official documents, appointment letters, donor slips, separations, download centre, bank book, cash book, and learning certificates.
  - `src/routes/ims/legacy/$module.jsx` — authenticated route for legacy register modules.
  - `src/ims/sectionModules.js` — IMS section navigation, including legacy links and modules marked planned.
- The backend keeps Digital Office records and audit history in `DigitalOfficeRecord` and `DigitalOfficeAudit` models, with backup/restore scripts present. The code also contains Google integration endpoints tied to the Digital Office API.
- The IMS has its own API/schema and canonical resources too. Some functions overlap; the same-looking label does not prove the data is already unified.

## Safe migration sequence
1. **Inventory & backup (read-only first):** inspect route catalogue, endpoint mappings, model/table usage, production deployment configuration, and current production record counts. Run a production backup of Digital Office records and audit logs before any destructive change. Never put database credentials or backup data in Git.
2. **Map each old module:** mark each module as (a) already ported with matching behavior, (b) reachable through the generic IMS legacy register, (c) overlapping with a canonical IMS resource, (d) missing, or (e) dependent on external configuration such as Google OAuth/email.
3. **Resolve data ownership:** decide the canonical resource for overlapping areas (members, donations, finance, documents, meetings, volunteers, users, audit trail). Preserve original IDs and history; do not bulk-copy records into a second table unless a tested mapping and duplicate strategy exists.
4. **Complete IMS navigation and behavior:** expose every required working module through the IMS section navigation. Replace placeholders/planned modules only after implementation and test. Retain existing authentication and authorization checks.
5. **Regression test:** verify read/create/edit/archive/restore/search/export where applicable, PDF generation, attachments, meeting integrations, finance totals, and audit history. Compare production record counts and key totals before/after.
6. **Cutover:** only after owner acceptance, make IMS the canonical entry point and redirect the old URL to IMS. Keep the old route/backend available during a rollback window.
7. **Retirement:** remove the old UI only after monitoring confirms no required links/integrations depend on it. Keep API/data/audit history until explicitly verified safe to retire.

## Current blockers / not yet verified
- GitHub source inspection does not reveal production database contents or confirm the currently deployed build.
- No live database backup, record-count comparison, production smoke test, or deployment verification has been performed by this migration audit.
- Therefore, no production data has been migrated or deleted, and the old portal must remain available.

## Acceptance checklist
- [ ] Production backup of Digital Office records and audit logs completed and restore tested.
- [ ] All 139 legacy module IDs mapped to an IMS destination and status.
- [ ] All required modules are reachable from IMS navigation and have working behavior.
- [ ] Data ownership and duplicate handling documented for overlapping IMS/legacy entities.
- [ ] Record counts, finance totals, attachments, and audit history validated.
- [ ] Authentication, permissions, exports/PDFs, and external integrations tested.
- [ ] User accepts IMS as the only portal; old URL redirect and rollback plan verified.
- [ ] Only then consider retiring the old UI.


## Detailed route audit added (2026-10-24)
- Parsed the legacy module catalogue: 139 distinct module IDs.
- Found 89 distinct explicit `legacy('moduleId')` links in `src/ims/sectionModules.js`. This is a navigation-link count, not a statement that the other 50 are missing: some use dedicated IMS routes, canonical resources, or custom screens and must be classified individually.
- The compatibility route `/ims/legacy/$module` is protected by the same `ssf_admin_token` login gate as the old portal. It renders `ImsLegacyRegister` inside `LangProvider`.
- `src/ims/oldOfficeCore.jsx` is the bridge that reads/writes the Digital Office records endpoint. This supports a staged UI consolidation without immediately copying records to a second table, but it does not prove every legacy module uses the same data contract correctly.
- The old portal's backend Google integration currently defaults `GOOGLE_FRONTEND_URL` to `https://swastiksrijan.in/SSFDigitalOffice`. Do not change that default until the OAuth flow has been tested with IMS and deployment configuration/environment overrides have been checked; otherwise Google sign-in could break during the transition.
- The repository workflow `.github/workflows/netlify-auto-deploy.yml` triggers Netlify only on pushes to `main` or `work`, not this migration branch. Changes on the migration branch are therefore not expected to appear on the live website automatically.

## Immediate next implementation gate
Before changing routes or redirecting users, produce a per-ID audit table covering all 139 module IDs with the actual destination component/route, data endpoint, navigation reachability, and test status. The table must distinguish source-code presence from verified runtime behavior. Then fix confirmed gaps in this branch and run the repository's build/lint checks in CI before opening a cutover PR.
