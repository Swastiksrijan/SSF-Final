const sequelize = require('./config/database');

async function checkSchema() {
    try {
        const [results, metadata] = await sequelize.query("SELECT * FROM \"Volunteers\" LIMIT 1");
        console.log('📊 First Record Keys:', Object.keys(results[0] || {}));
        const [columns] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Volunteers'");
        console.log('📊 Full Schema:');
        columns.forEach(c => console.log(`${c.column_name}: ${c.data_type}`));
        process.exit(0);
    } catch (error) {
        console.error('❌ Error checking schema:', error);
        process.exit(1);
    }
}

checkSchema();
