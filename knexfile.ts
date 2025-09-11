
import dotenv from "dotenv";
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });

export default {
  [env]: {
    client: process.env.DB_CLIENT || 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      directory: './src/config/db/migrations',
      tableName: 'knex_migrations',
      extension: 'js',
      // stub: path.join(__dirname, 'migration.stub.js'), this is use to create a migration template
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};