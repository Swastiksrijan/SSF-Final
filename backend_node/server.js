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

sequelize.sync({ alter: true })
    .then(async () => {
        console.log('✅ PostgreSQL Database Synced');
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
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error('❌ Database Sync Error:', err);
        process.exit(1);
    });
