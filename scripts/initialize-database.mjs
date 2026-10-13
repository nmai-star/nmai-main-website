import { readFileSync } from 'node:fs';
import postgres from 'postgres';

// Explicit one-time migration. Existing production data is never overwritten.
process.loadEnvFile('.env.production.local');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const source = JSON.parse(readFileSync('.local-data/auth.json', 'utf8'));
if (!Array.isArray(source.accounts) || !Array.isArray(source.courses)) throw new Error('Invalid source data');
const data = { accounts: source.accounts, courses: source.courses, sessions: [] };
const sql = postgres(process.env.DATABASE_URL, { max: 1, ssl: { rejectUnauthorized: true }, prepare: false });
try {
  await sql`CREATE TABLE IF NOT EXISTS nmai_portal_store (id text PRIMARY KEY, data jsonb NOT NULL)`;
  const inserted = await sql`INSERT INTO nmai_portal_store (id, data) VALUES ('primary', ${sql.json(data)}) ON CONFLICT (id) DO NOTHING RETURNING id`;
  const [row] = await sql`SELECT jsonb_array_length(data->'accounts') AS accounts, jsonb_array_length(data->'courses') AS courses FROM nmai_portal_store WHERE id = 'primary'`;
  console.log({ initialized: inserted.length === 1, ...row });
} finally { await sql.end(); }
