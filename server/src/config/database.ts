import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const isRemotePostgres = Boolean(
  process.env.DATABASE_URL &&
  (process.env.DATABASE_URL.includes('neon.tech') ||
   process.env.DATABASE_URL.includes('render.com') ||
   process.env.DATABASE_URL.includes('sslmode=require') ||
   process.env.NODE_ENV === 'production')
);

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: isRemotePostgres ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 10
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'tripforge_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };

export const pool = new Pool(poolConfig);

let isDbConnected = false;

pool.on('connect', () => {
  isDbConnected = true;
});

pool.on('error', (err) => {
  console.error('⚠️ Unexpected PostgreSQL client error:', err.message);
  isDbConnected = false;
});

/**
 * Execute a parameterized query against PostgreSQL
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.DEBUG_SQL === 'true') {
      console.log(`[SQL] ${text.substring(0, 100)}... (${duration}ms, ${res.rowCount} rows)`);
    }
    return res;
  } catch (error: any) {
    console.error(`[SQL Error] ${error.message}\nQuery: ${text}\nParams:`, params);
    throw error;
  }
}

/**
 * Test PostgreSQL and PostGIS connectivity
 */
export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  postgis: boolean;
  version?: string;
  error?: string;
}> {
  try {
    const res = await pool.query('SELECT version()');
    const version = res.rows[0]?.version;
    
    let postgis = false;
    try {
      const gisRes = await pool.query('SELECT PostGIS_Full_Version()');
      postgis = !!gisRes.rows[0];
    } catch {
      postgis = false;
    }

    isDbConnected = true;
    return { connected: true, postgis, version };
  } catch (err: any) {
    isDbConnected = false;
    return { connected: false, postgis: false, error: err.message };
  }
}

/**
 * Gracefully terminate database pool
 */
export async function closePool(): Promise<void> {
  await pool.end();
}
