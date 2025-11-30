
import * as dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });

export default {
  development: {
    client: process.env.DB_CLIENT || 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'secure_watch_db',
    },
    migrations: {
      directory: './src/config/db/migrations',
      tableName: 'knex_migrations',
      extension: 'js',
      stub: path.join(__dirname, 'migration.stub.js'),
    },
    seeds: {
      directory: './db/seeds',
    },
  },

  production: {
    client: process.env.DB_CLIENT || 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/config/db/migrations',
      tableName: 'knex_migrations',
    },
    pool: { min: 0, max: 10 },
  },
};
