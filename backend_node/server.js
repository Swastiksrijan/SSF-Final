require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database'); // Import Sequelize config

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to Database
sequelize.sync() // This creates tables if they don't exist
    .then(() => console.log('✅ PostgreSQL Database Synced'))
    .catch(err => console.error('❌ Database Sync Error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('SSF NGO Backend is Running with PostgreSQL!');
});

// Import Routes
const volunteerRoutes = require('./routes/volunteerRoutes');
app.use('/api', volunteerRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
