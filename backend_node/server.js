require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ WARNING: EMAIL_USER or EMAIL_PASS missing in .env. Automated emails will not work.');
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (_req, res) => res.send('SSF NGO Backend is Running with PostgreSQL!'));

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
// Register SSF-IMS models so sequelize.sync creates their tables.
require('./models/ims');

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
}

let dbSynced = false;

async function syncDatabase(attempts = 3) {
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            await sequelize.sync();
            console.log('✅ PostgreSQL Database Synced');
            await runSeeds();
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
