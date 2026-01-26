const sequelize = require('./config/database');
const Volunteer = require('./models/Volunteer');

async function test() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');
        const count = await Volunteer.count();
        console.log('✅ Volunteers count:', count);
        process.exit(0);
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
}

test();
