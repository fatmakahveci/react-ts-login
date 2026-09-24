import { getMigrations } from 'better-auth/db/migration';
import { getAuth } from '../src/lib/server/auth';
import { getDatabase } from '../src/lib/server/database';

async function main() {
  const database = getDatabase();
  const lock = await database.connect();
  try {
    await lock.query('SELECT pg_advisory_lock(740293)');
    const migration = await getMigrations(getAuth().options);
    await migration.runMigrations();
    await database.query(`CREATE TABLE IF NOT EXISTS tasks (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      title varchar(200) NOT NULL,
      completed boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    ); CREATE INDEX IF NOT EXISTS tasks_user_created_idx ON tasks (user_id, created_at DESC);`);
    console.log('Database migrations completed.');
  } finally {
    await lock.query('SELECT pg_advisory_unlock(740293)');
    lock.release();
    await database.end();
  }
}
main().catch(error => { console.error('Migration failed:', error instanceof Error ? error.name : 'UnknownError'); process.exit(1); });
