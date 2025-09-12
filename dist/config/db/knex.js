import knex from 'knex';
import config from '../../../knexfile.js';
import * as dotenv from 'dotenv';
dotenv.config();
const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);
db.raw('SELECT 1')
    .then(() => {
    console.log(`✅ Database connected successfully (${environment} environment)`);
})
    .catch((err) => {
    console.error('❌ Failed to connect to database:', err);
});
export default db;
