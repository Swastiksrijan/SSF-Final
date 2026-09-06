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

app.get('/', (req, res) => {
    res.send('SSF NGO Backend is Running with PostgreSQL!');
});

const memberCertificateRoutes = require('./routes/memberCertificateRoutes');
const volunteerAdminRoutes = require('./routes/volunteerAdminRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');

app.use('/api', memberCertificateRoutes);
// This route is mounted before the legacy volunteer routes so approved volunteers
// receive a permanent Volunteer ID and certificate ID without changing the
// existing public registration endpoint.
app.use('/api', volunteerAdminRoutes);
app.use('/api', volunteerRoutes);

sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ PostgreSQL Database Synced');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Database Sync Error:', err);
        process.exit(1);
    });
