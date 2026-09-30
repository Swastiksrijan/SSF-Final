const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DB_URL) {
    // Production (Render, Heroku, etc.)
    sequelize = new Sequelize(process.env.DB_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Necessary for many cloud providers
            }
        }
    });
} else {
    // Local Development
    sequelize = new Sequelize(
        process.env.DB_NAME || 'ngo_db',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASS || 'password',
        {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'postgres',
            logging: false,
        }
    );
}

// Test the connection
sequelize.authenticate()
    .then(() => console.log('✅ PostgreSQL Connected Successfully'))
    .catch(err => console.error('❌ PostgreSQL Connection Error:', err));

module.exports = sequelize;
