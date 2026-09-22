import fs from 'fs';
import path from 'path';
import { pool, query } from '../config/database';

export async function runMigrations(): Promise<boolean> {
  console.log('🚀 Running PostgreSQL & PostGIS Schema Migrations...');
  const client = await pool.connect();

  try {
    // 1. Ensure migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const appliedRes = await client.query('SELECT version FROM schema_migrations');
    const appliedSet = new Set(appliedRes.rows.map(r => r.version));

    const candidateDirs = [
      __dirname,
      path.join(process.cwd(), 'server', 'src', 'migrations'),
      path.join(process.cwd(), 'src', 'migrations'),
      path.join(__dirname, '..', '..', 'server', 'src', 'migrations')
    ];
    const migrationsDir = candidateDirs.find(d => fs.existsSync(d) && fs.readdirSync(d).some(f => f.endsWith('.sql'))) || __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`  ✓ Migration ${file} (already applied)`);
        continue;
      }

      console.log(`  ⏳ Applying migration ${file}...`);
      const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sqlContent);
        await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`  ✅ Migration ${file} applied successfully.`);
      } catch (err: any) {
        await client.query('ROLLBACK');
        console.error(`  ❌ Error applying migration ${file}:`, err.message);
        throw err;
      }
    }

    console.log('🎉 All migrations applied successfully!\n');
    return true;
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    return false;
  } finally {
    client.release();
  }
}

// Allow direct CLI execution: tsx server/src/migrations/migrate.ts
if (require.main === module) {
  runMigrations()
    .then((success) => process.exit(success ? 0 : 1))
    .catch(() => process.exit(1));
}
