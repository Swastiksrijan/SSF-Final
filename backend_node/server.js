require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database'); // Import Sequelize config

const app = express();
const PORT = process.env.PORT || 5000;

// Check for required environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ WARNING: EMAIL_USER or EMAIL_PASS missing in .env. Automated emails will not work.');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Route
app.get('/', (req, res) => {
    res.send('SSF NGO Backend is Running with PostgreSQL!');
});

// Import Routes
const volunteerRoutes = require('./routes/volunteerRoutes');
app.use('/api', volunteerRoutes);

// Connect to Database & Start Server
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
