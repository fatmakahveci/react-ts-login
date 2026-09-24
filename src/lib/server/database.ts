import { Pool } from 'pg';

let pool: Pool | undefined;
export function getDatabase() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 10, connectionTimeoutMillis: 5000 });
  return pool;
}
