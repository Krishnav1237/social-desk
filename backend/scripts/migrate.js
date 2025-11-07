const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Run database migrations
 */
async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log('🚀 Starting database migrations...\n');

    // Create migrations tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Get all migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    console.log(`Found ${migrationFiles.length} migration files\n`);

    // Get executed migrations
    const result = await client.query('SELECT migration_name FROM schema_migrations');
    const executedMigrations = new Set(result.rows.map((r) => r.migration_name));

    // Run pending migrations
    for (const file of migrationFiles) {
      if (executedMigrations.has(file)) {
        console.log(`⏭️  Skipping ${file} (already executed)`);
        continue;
      }

      console.log(`▶️  Running ${file}...`);

      const migrationSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(migrationSQL);
        await client.query('INSERT INTO schema_migrations (migration_name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`✅ Successfully executed ${file}\n`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ Error executing ${file}:`, err.message);
        throw err;
      }
    }

    console.log('\n✨ All migrations completed successfully!\n');
  } catch (err) {
    console.error('\n❌ Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
