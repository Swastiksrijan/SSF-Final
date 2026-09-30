const sequelize = require('./config/database');

async function checkSchema() {
    try {
        const [results, metadata] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Volunteers'");
        console.log('📊 Table Schema:');
        console.table(results);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error checking schema:', error);
        process.exit(1);
    }
}

checkSchema();
