const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'ngo_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'password',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false, // Set to console.log to see SQL queries
    }
);

// Test the connection
sequelize.authenticate()
    .then(() => console.log('✅ PostgreSQL Connected Successfully'))
    .catch(err => console.error('❌ PostgreSQL Connection Error:', err));

module.exports = sequelize;
