require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Op } = require('sequelize');
const sequelize = require('./config/database');
const { ensureColumns } = require('./services/ensureColumns');

const app = express();
const PORT = process.env.PORT || 5000;

const { emailConfigured } = require('./services/mailer');

if (!emailConfigured()) {
    console.warn('⚠️ WARNING: no BREVO_API_KEY and no EMAIL_USER/EMAIL_PASS in .env. Automated emails will not work.');
}

app.use(cors());
// Larger limit so generated documents (e.g. the Organisation Profile PDF saved as
// a data URL) can be created through the IMS. The previous 100kb default rejected
// them with a 413 before the request ever reached a route.
app.use(express.json({ limit: '12mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (_req, res) => res.send('SSF NGO Backend is Running with PostgreSQL!'));

// Lightweight diagnostics: confirm which mail transport the running process
// picked up, without exposing any secret value.
app.get('/api/health/email', (_req, res) => res.json({
    provider: process.env.BREVO_API_KEY ? 'brevo' : ((process.env.EMAIL_USER && process.env.EMAIL_PASS) ? 'gmail' : 'none'),
    brevoConfigured: Boolean(process.env.BREVO_API_KEY),
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || null,
    fromName: process.env.EMAIL_FROM_NAME || null,
}));

// Live database probe. Returns 200 when a trivial query succeeds, 503 when the
// database is down or over its provider quota — the single fastest way to tell
// "the app is broken" from "the database is broken".
app.get('/api/health/db', async (_req, res) => {
    const { databaseStatus } = require('./services/dbHealth');
    const status = await databaseStatus();
    res.status(status.ok ? 200 : 503).json(status);
});

const memberCertificateRoutes = require('./routes/memberCertificateRoutes');
const learningCertificateRoutes = require('./routes/learningCertificateRoutes');
const volunteerAdminRoutes = require('./routes/volunteerAdminRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const profileApplicationRoutes = require('./routes/profileApplicationRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const portalParticipationRoutes = require('./routes/portalParticipationRoutes');
const userPortalRoutes = require('./routes/userPortalRoutes');
const userDocumentRoutes = require('./routes/userDocumentRoutes');
const interestRoutes = require('./routes/interestRoutes');
const contactRoutes = require('./routes/contactRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const donorRoutes = require('./routes/donorRoutes');
const roleDocumentRoutes = require('./routes/roleDocumentRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const digitalOfficeRoutes = require('./routes/digitalOfficeRoutes');
const financeRoutes = require('./routes/financeRoutes');
const auditRoutes = require('./routes/auditRoutes');
const imsRoutes = require('./routes/imsRoutes');
const socialRoutes = require('./routes/socialRoutes');
const quizRoutes = require('./routes/quizRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const accountRoutes = require('./routes/accountRoutes');
const { adminAuditTrail } = require('./middleware/adminAuditTrail');
// Register SSF-IMS models so sequelize.sync creates their tables.
require('./models/ims');
// Register Social Publisher models (separate file, same sync pass).
require('./models/social');
// Register the audit trail model so sequelize.sync creates its table.
require('./models/AuditLog');
// Register the ID issuance ledger so sequelize.sync creates its table.
require('./models/IdIssuance');

// Watchdog (registered BEFORE the routes so it runs on every request): any
// request that reaches the app proves Render is awake, so kick the publisher
// then too. This is what makes the GitHub keep-alive loop (or any visitor)
// immediately publish a due post instead of waiting for the next 5-minute tick.
// Throttled to at most once a minute; never fires for the publisher's own cron
// call, so there is no feedback loop. socialTick is defined further down but
// only ever runs after the event loop has moved on, by which time it exists.
let lastSocialKick = 0;
app.use((req, _res, next) => {
    const now = Date.now();
    if (now - lastSocialKick > 60000 && !/\/api\/social\//.test(req.path)) {
        lastSocialKick = now;
        socialTick();
    }
    next();
});

// Every state-changing /api/admin request is recorded in the audit trail.
// Mounted first so it wraps ALL admin routes, including the ones registered by
// memberCertificateRoutes below.
app.use('/api', adminAuditTrail());
app.use('/api', memberCertificateRoutes);
app.use('/api', learningCertificateRoutes);
app.use('/api', volunteerAdminRoutes);
app.use('/api', adminUserRoutes);
// Hardened multipart submission routes must run before the legacy handlers.
app.use('/api', submissionRoutes);
app.use('/api', profileApplicationRoutes);
app.use('/api', volunteerRoutes);
// Logged-in portal participation routes (volunteer/membership applications).
app.use('/api', portalParticipationRoutes);
app.use('/api', userPortalRoutes);
app.use('/api', userDocumentRoutes);
app.use('/api', interestRoutes);
app.use('/api', contactRoutes);
app.use('/api', internshipRoutes);
app.use('/api', donorRoutes);
// Reusable IDs/certificates/letters for roles that do not have a dedicated document flow yet.
app.use('/api', roleDocumentRoutes);
// Account password recovery.
app.use('/api', passwordResetRoutes);
app.use('/api', digitalOfficeRoutes);
app.use('/api', financeRoutes);
app.use('/api', auditRoutes);
app.use('/api', imsRoutes);
app.use('/api', socialRoutes);
// Awareness quiz + automatic certificate issuance.
app.use('/api', quizRoutes);
// Admin command-centre: KPIs, audit trail, exports.
app.use('/api', adminDashboardRoutes);
// Logged-in user self-service: own profile + password.
app.use('/api', accountRoutes);

// Last-resort error handler. Most routes already catch their own errors, but a
// synchronous throw (or an async throw before the route's try/catch) would
// otherwise return Express's default HTML error page. When the cause is the
// database being unreachable or over quota, answer with a clear 503 instead of
// a misleading "Server Error" — and never leak the raw driver message.
app.use((err, _req, res, _next) => {
    console.error('❌ Unhandled request error:', err && (err.message || err));
    if (res.headersSent) return;
    const { databaseUnavailableResponse } = require('./services/dbHealth');
    if (databaseUnavailableResponse(res, err)) return;
    res.status(err && err.status ? err.status : 500).json({ status: 'error', message: 'Something went wrong on our side. Please try again.' });
});

// `alter: true` re-introspects every foreign key on every boot. On a free-tier
// Postgres that can exceed the provider's statement/connection timeout and get
// killed mid-query (SQLSTATE 57P01 "terminating connection due to administrator
// command"), which used to crash the whole deploy. Startup therefore:
//   1. binds the port immediately,
//   2. creates any missing tables with a plain sync (no FK introspection),
//   3. runs idempotent seeds,
//   4. only runs the destructive alter pass when explicitly opted in.
// A sync failure is logged, never fatal, so a transient DB outage cannot take
// the web service down.
const SYNC_ALTER = String(process.env.DB_SYNC_ALTER || '').toLowerCase() === 'true';

async function runSeeds() {
    // Governance foundation: bylaws rules, roles, the organisation record and
    // the current Managing Committee. Without this a fresh database has no
    // organisation identity or committee for the rest of the registers to
    // attach to (idempotent and self-healing).
    try {
        const { seedGovernance } = require('./services/ims/seed');
        const g = await seedGovernance();
        if (g.rules || g.roles || g.org || g.committeeMembers) {
            console.log(`✅ Governance: ${g.rules} rule(s), ${g.roles} role(s), org ${g.org ? 'created' : 'existing'}, ${g.committeeMembers} committee member(s)`);
        }
    } catch (e) {
        console.error('⚠️ Governance seed skipped:', e.message);
    }
    // Fresh install: seed the default Cost Centre master so the finance
    // classification dimension is never empty on first load (idempotent).
    try {
        const { models } = require('./models/ims');
        if (await models.ImsCostCentre.count() === 0) {
            const { seedCostCentres } = require('./services/ims/costCentreSeed');
            const seeded = await seedCostCentres();
            console.log(`✅ Seeded ${seeded.created} default cost centres`);
        }
    } catch (e) {
        console.error('⚠️ Cost centre seed skipped:', e.message);
    }
    // Fresh install / upgrade: seed any missing Organisation Profile
    // section (idempotent — existing, user-edited sections are untouched).
    try {
        const { seedOrgProfile } = require('./services/ims/orgProfileSeed');
        const seeded = await seedOrgProfile();
        if (seeded.created) console.log(`✅ Seeded ${seeded.created} organisation profile sections`);
    } catch (e) {
        console.error('⚠️ Organisation profile seed skipped:', e.message);
    }
    // Institutional Policy & Procedure Manual (one master policy record) and the
    // Managing Committee History register. Additive and idempotent — an approved
    // policy is never overwritten.
    try {
        const { seedPolicy } = require('./services/ims/policySeed');
        const p = await seedPolicy();
        if (p.created || p.updated) console.log(`✅ Policy manual: ${p.created ? 'created' : 'updated'}`);
    } catch (e) {
        console.error('⚠️ Policy seed skipped:', e.message);
    }
    try {
        const { seedOfficeHistory } = require('./services/ims/officeHistorySeed');
        const oh = await seedOfficeHistory();
        if (oh.officeHistory) console.log(`✅ Office history: ${oh.officeHistory} record(s)`);
    } catch (e) {
        console.error('⚠️ Office history seed skipped:', e.message);
    }
    // Finance foundation: chart of accounts, current financial year, default
    // cash/bank accounts and cost centres. Without this a fresh database has no
    // accounts for the registers to post against (idempotent).
    try {
        const { financeSeed } = require('./services/ims/financeSeed');
        const f = await financeSeed();
        if (f.accounts || f.financialYear || f.cashAccounts || f.bankAccounts) {
            console.log(`✅ Finance foundation: ${f.accounts} account(s), FY ${f.financialYear || 'existing'}, ${f.cashAccounts} cash + ${f.bankAccounts} bank account(s)`);
        }
    } catch (e) {
        console.error('⚠️ Finance foundation seed skipped:', e.message);
    }
    // Member Register — authoritative, from data/membersRegister.js. Keeps the
    // People master and the Contacts directory in step on every boot.
    try {
        const { seedMembers } = require('./services/ims/seed');
        const m = await seedMembers();
        if (m.members) console.log(`✅ Seeded ${m.members} member(s) from the member register`);
    } catch (e) {
        console.error('⚠️ Member register seed skipped:', e.message);
    }
    // Meetings & Minutes register — from data/meetingsRegister.js (the scanned
    // baithak register). Additive and idempotent; runs once the People master
    // exists so attendance can be linked to real persons.
    try {
        const { seedMeetings } = require('./services/ims/meetingsSeed');
        const mt = await seedMeetings();
        if (mt.meetings || mt.attendees) {
            console.log(`✅ Meetings register: ${mt.meetings} meeting(s), ${mt.attendees} attendance row(s), ${mt.resolutions} resolution(s)`);
        }
    } catch (e) {
        console.error('⚠️ Meetings register seed skipped:', e.message);
    }
    // An earlier approval issued a register number but left the row still
    // carrying the website-account marker, which hid that member's ID card in
    // the portal. Repair those rows once per boot; idempotent.
    try {
        const Member = require('./models/Member');
        const identity = require('./services/identityService');
        const fixed = await identity.reconcileRegisterMembers(Member);
        if (fixed.promoted) console.log(`✅ Repaired ${fixed.promoted} member record(s) that held an ID but no role`);
    } catch (e) {
        console.error('⚠️ Member record repair skipped:', e.message);
    }
    // Volunteer & Leadership register — from the Google-Form responses.
    // Guarded by an empty-register check so the import runs once, then stays
    // idempotent (re-running never duplicates a person or a volunteer).
    try {
        const { models } = require('./models/ims');
        if (await models.ImsVolunteer.count() === 0) {
            const { seedVolunteers } = require('./services/ims/volunteerSeed');
            const v = await seedVolunteers({ imsRole: 'system' });
            console.log(`✅ Seeded ${v.volunteersCreated} volunteer(s) from the leadership form`);
        }
    } catch (e) {
        console.error('⚠️ Volunteer seed skipped:', e.message);
    }
    // Annual Progress Reports 2013-14 → 2025-26 — the year-wise reporting record,
    // from data/annualReports.js. Additive and idempotent, so it runs on every
    // boot and keeps the report register, its programmes, projects, activities
    // and public documents in step with the source documents.
    try {
        const { seedAnnualReports } = require('./services/ims/annualReportSeed');
        const ar = await seedAnnualReports();
        if (ar.programmes || ar.projects || ar.documents || ar.activities) {
            console.log(`✅ Annual reports: ${ar.years} year(s) — ${ar.programmes} programme(s), ${ar.financialYears} financial year(s), ${ar.projects} project(s), ${ar.documents} document(s), ${ar.activities} activity(ies) created`);
        }
    } catch (e) {
        console.error('⚠️ Annual reports seed skipped:', e.message);
    }
    // FY 2025-26 workbook registers — Sector Registers (as activities), Annual
    // Compliance and the Sahyog in-kind support. Additive and idempotent, so it
    // runs on every boot and keeps the three registers in step with the workbook.
    try {
        const { seedFinancialYearRegisters } = require('./services/ims/fyRegistersSeed');
        const fr = await seedFinancialYearRegisters();
        if (fr.sectorActivities || fr.compliance || fr.sahyog) {
            console.log(`✅ FY 2025-26 registers: ${fr.sectorActivities} sector activity(ies), ${fr.compliance} compliance row(s), ${fr.sahyog} sahyog row(s) created`);
        }
    } catch (e) {
        console.error('⚠️ FY 2025-26 registers seed skipped:', e.message);
    }
    // Derive the Notification & Action Centre alerts from real source records.
    // Idempotent (stable eventKey) and additive: it never edits or clears tasks.
    try {
        const { syncNotifications, deliverNotifications } = require('./services/ims/notifications');
        const n = await syncNotifications();
        if (n.totalCreated) console.log(`✅ Notification sync created ${n.totalCreated} alert(s) (${JSON.stringify(n.created)})`);
        // Send any alert not yet sent (email / WhatsApp / SMS; no-op unless a
        // provider for that channel is configured).
        const d = await deliverNotifications();
        if (d.configured && (d.sent || d.failed)) console.log(`📣 Action Centre sent ${d.sent} alert(s) ${JSON.stringify(d.byChannel || {})}, ${d.failed} failed`);
    } catch (e) {
        console.error('⚠️ Notification sync skipped:', e.message);
    }
    // Official Financial Records workbook (data/officialRegisters.json) — the
    // canonical donation/expense transactions plus the CA-signed audit years.
    // Idempotent (keyed by sourceRecordId), so a brand-new database populates
    // its finance registers on first boot without any admin action.
    try {
        const { seedOfficialWorkbook } = require('./services/ims/workbookSeed');
        const wb = await seedOfficialWorkbook({ actor: 'system' });
        if (wb.created || wb.auditYearsCreated) {
            console.log(`✅ Official workbook: ${wb.created} finance transaction(s), ${wb.auditYearsCreated} audited year(s)`);
        }
    } catch (e) {
        console.error('⚠️ Official workbook seed skipped:', e.message);
    }
    // Legacy Digital Office finance masters still shown by the Digital Office
    // screens: Chart of Accounts and the Financial Year Master (idempotent).
    try {
        const { seedLegacyOffice } = require('./services/ims/legacyOfficeSeed');
        const lo = await seedLegacyOffice({ actor: 'system' });
        if (lo.chartOfAccounts || lo.fyMaster) {
            console.log(`✅ Legacy office masters: ${lo.chartOfAccounts} account head(s), ${lo.fyMaster} financial year(s)`);
        }
    } catch (e) {
        console.error('⚠️ Legacy office masters seed skipped:', e.message);
    }
    // Multicultural festival & observance calendar. Seeds only MISSING keys, so
    // an admin's edits, approvals or exclusions are never overwritten.
    try {
        const { seedSocialEvents } = require('./services/social/calendarSeed');
        const seeded = await seedSocialEvents();
        if (seeded.created) console.log(`✅ Seeded ${seeded.created} calendar entr(ies) for the social awareness calendar`);
    } catch (e) {
        console.error('⚠️ Social calendar seed skipped:', e.message);
    }
}

// Copy the entire legacy SSF Digital Office dataset into the IMS masters.
// ADDITIVE ONLY and idempotent (each imported row is stamped in ImsRelation),
// so this is safe to run on every boot and skips anything already migrated.
async function runLegacyMigration() {
    if (String(process.env.IMS_AUTO_MIGRATE || 'true').toLowerCase() === 'false') return;
    try {
        const { migrateLegacy } = require('./services/ims/migrateLegacy');
        const stats = await migrateLegacy({ dryRun: false });
        const created = Object.entries(stats.created).map(([k, v]) => `${k}:${v}`).join(', ') || 'none';
        console.log(`✅ Legacy data migrated into IMS — created ${created}; skipped ${stats.skipped}; unmapped ${stats.unmapped.length}`);
        if (stats.unmapped.length) console.log('⚠️ Unmapped legacy modules:', stats.unmapped.slice(0, 20).join(', '));
        if (stats.errors && stats.errors.length) console.log('⚠️ Legacy sources skipped:', stats.errors.join(' | '));
    } catch (e) {
        console.error('⚠️ Legacy migration skipped:', e.message);
    }
}

let dbSynced = false;

async function syncDatabase(attempts = 3) {
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            await sequelize.sync();
            console.log('✅ PostgreSQL Database Synced');
            await ensureColumns();
            await runSeeds();
            await runLegacyMigration();
            if (SYNC_ALTER) {
                try {
                    await sequelize.sync({ alter: true });
                    console.log('✅ Schema altered');
                } catch (e) {
                    console.error('⚠️ Schema alter skipped:', e.message);
                }
            }
            dbSynced = true;
            return true;
        } catch (err) {
            console.error(`⚠️ Database sync attempt ${attempt}/${attempts} failed:`, err.message || err);
            if (attempt < attempts) await new Promise(r => setTimeout(r, 5000));
        }
    }
    return false;
}

// If the database is unreachable at boot (e.g. a stale DB_URL or a database
// that is still waking up), keep retrying in the background so the service
// heals on its own once the database becomes reachable — no redeploy needed.
async function syncWithRecovery() {
    if (await syncDatabase()) return;
    console.error('❌ Database unavailable at startup — API is serving without sync; retrying every 60s until it recovers.');
    const timer = setInterval(async () => {
        if (dbSynced) return clearInterval(timer);
        if (await syncDatabase(1)) {
            console.log('✅ Database recovered');
            clearInterval(timer);
        }
    }, 60000);
    if (timer.unref) timer.unref();
}

// Bind the port first so the platform sees a healthy service even if the
// database is slow or down.
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
syncWithRecovery();

// In-process safety net: while this instance is awake, publish any due post
// within a few minutes. The free GitHub Actions cron is best-effort and can
// skip hours, so this guarantees the morning/evening posts go out as soon as
// the backend is serving. Idempotent (drafts flip to published once).
let socialTickRunning = false;
async function socialTick() {
    if (socialTickRunning) return;
    socialTickRunning = true;
    try {
        const { planDue, runPending } = require('./services/social/publisher');
        const created = await planDue({});
        if (created.length) console.log(`✅ Social publisher planned ${created.length} post(s) for today`);
        const out = await runPending({ source: 'internal-timer' });
        if (out.published.length) console.log(`✅ Social publisher published ${out.published.length} due post(s)`);
        await socialMissedAlert();
    } catch (e) {
        console.error('⚠️ Social publisher tick skipped:', e.message);
    } finally {
        socialTickRunning = false;
    }
}

// If the day's post time has long passed and the post is still an unpublished
// draft, something is genuinely broken — tell the admins on Telegram so it never
// goes unnoticed for days. At most one alert per day.
async function socialMissedAlert() {
    try {
        const { getConfig, dailyTime } = require('./services/social/publisher');
        const { SocialPost, SocialChannel } = require('./models/social');
        const tz = (await getConfig('timezone', process.env.SOCIAL_TZ || 'Asia/Kolkata')) || 'Asia/Kolkata';
        const time = await dailyTime();
        const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', hour12: false }).formatToParts(new Date());
        const p = {}; for (const { type, value } of parts) p[type] = value;
        const postDate = `${p.year}-${p.month}-${p.day}`;
        const hhmm = `${p.hour}:${p.minute}`;
        const [sh, sm] = String(time).split(':').map(Number);
        const lateBy = (Number(p.hour) * 60 + Number(p.minute)) - (sh * 60 + (sm || 0));
        if (lateBy <= 45) return;
        // Only the single daily awareness post is "missed" — course chapters
        // are scheduled across the day and would otherwise alert before their
        // own slot time.
        const row = await SocialPost.findOne({ where: { postDate, status: 'draft', kind: { [Op.ne]: 'course' } } });
        if (!row) return;
        const ch = await SocialChannel.findOne({ where: { platform: 'telegram', enabled: true } });
        const creds = (ch && ch.credentials) || {};
        const token = creds.botToken || creds.token;
        const chatId = creds.chatId;
        if (!token || !chatId) return; // no alert channel configured — nothing to do
        const key = `missed-${postDate}`;
        if (await getConfig(key, null)) return; // already alerted
        const msg = `⚠️ SSF Publisher: today's post for ${postDate} is still NOT published (scheduled ${time}, now ${hhmm} ${tz}). Please check the Social Publisher.`;
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: msg }),
        }).catch(() => {});
        const { setConfig } = require('./services/social/publisher');
        await setConfig(key, new Date().toISOString());
    } catch (e) { /* alerting must never break publishing */ }
}

// One catch-up shortly after boot (in case we woke after a slot time)…
setTimeout(socialTick, 15000);
// …then keep checking every 5 minutes for as long as the instance is awake.
const socialTimer = setInterval(socialTick, 5 * 60 * 1000);
if (socialTimer.unref) socialTimer.unref();

