import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function setup() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '5432', 10);
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || '1234';
  const targetDb = process.env.DB_NAME || 'tripforge_db';

  console.log(`📡 Connecting to PostgreSQL at ${host}:${port} as ${user}...`);

  const client = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres',
    connectionTimeoutMillis: 4000
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL server.');

    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [targetDb]);
    if (res.rows.length === 0) {
      console.log(`⏳ Creating database "${targetDb}"...`);
      await client.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`✅ Database "${targetDb}" created successfully.`);
    } else {
      console.log(`ℹ️ Database "${targetDb}" already exists.`);
    }
  } catch (err: any) {
    console.error('❌ PostgreSQL setup notice:', err.message);
  } finally {
    await client.end().catch(() => {});
  }
}

setup().catch(console.error);
