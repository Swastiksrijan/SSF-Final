const Volunteer = require('./models/Volunteer');
const sequelize = require('./config/database');

async function check() {
    try {
        const volunteers = await Volunteer.findAll({ limit: 5, order: [['createdAt', 'DESC']] });
        console.log('📝 Recent Volunteers:');
        volunteers.forEach(v => {
            console.log(`- ${v.fullName} (${v.email}) | Status: ${v.status} | Created: ${v.createdAt}`);
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
