import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import type { CourseItem } from "../app/data/coursesData";

export type Account = {
  id: string; email: string; name: string;
  status: "pending" | "approved" | "suspended";
  courses: string[]; createdAt: string; googleId?: string; passwordHash?: string;
};
type Session = { tokenHash: string; accountId: string; expires: number; admin?: boolean };
type Store = { accounts: Account[]; sessions: Session[]; courses?: CourseItem[] };
const directory = process.env.NMAI_AUTH_DATA_DIR || path.join(process.cwd(), ".local-data");
const filename = path.join(directory, "auth.json");

let database: ReturnType<typeof postgres> | undefined;
// The database row lock serializes updates across Vercel instances, including deletions.
export async function transaction<T>(operation: (store: Store) => T): Promise<T> {
  const url = process.env.DATABASE_URL;
  if (url) {
    database ??= postgres(url, { max: 3, idle_timeout: 20, connect_timeout: 15, prepare: false, ssl: { rejectUnauthorized: true } });
    const wrapped = await database.begin(async sql => {
      const rows = await sql`SELECT data FROM nmai_portal_store WHERE id = 'primary' FOR UPDATE`;
      if (!rows.length) throw new Error("Portal database has not been initialized.");
      const store = rows[0].data as Store;
      const before = JSON.stringify(store);
      store.sessions = store.sessions.filter(s => s.expires > Date.now());
      const result = operation(store);
      const after = JSON.stringify(store);
      if (after !== before) await sql`UPDATE nmai_portal_store SET data = ${sql.json(JSON.parse(after))} WHERE id = 'primary'`;
      return { result };
    });
    return wrapped.result;
  }
  if (process.env.VERCEL) throw new Error("DATABASE_URL is required on Vercel.");
  // Local development keeps using the existing local data file.
  mkdirSync(directory, { recursive: true });
  const store: Store = existsSync(filename)
    ? JSON.parse(readFileSync(filename, "utf8")) : { accounts: [], sessions: [] };
  store.sessions = store.sessions.filter(s => s.expires > Date.now());
  const result = operation(store);
  const temporary = filename + ".tmp";
  writeFileSync(temporary, JSON.stringify(store, null, 2), { mode: 0o600 });
  renameSync(temporary, filename);
  return result;
}

export function hashToken(value: string) { return createHash("sha256").update(value).digest("hex"); }
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + scryptSync(password, salt, 64).toString("hex");
}
export function verifyPassword(password: string, stored?: string) {
  const [salt, hash] = (stored || "missing:00").split(":");
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function safeEqual(a: string, b: string) {
  return timingSafeEqual(Buffer.from(hashToken(a)), Buffer.from(hashToken(b)));
}
export async function createSession(accountId: string, admin = false) {
  const token = randomBytes(32).toString("hex");
  await transaction(store => store.sessions.push({ tokenHash: hashToken(token), accountId, admin, expires: Date.now() + 8 * 3600_000 }));
  return token;
}
export async function getSession(token?: string, admin = false): Promise<Account | true | null> {
  if (!token) return null;
  return transaction(store => {
    const session = store.sessions.find(s => s.tokenHash === hashToken(token) && !!s.admin === admin);
    if (!session) return null;
    if (admin) return true;
    return store.accounts.find(a => a.id === session.accountId && a.status !== "suspended") || null;
  });
}
export function publicAccount(account: Account) {
  return { id: account.id, email: account.email, name: account.name, status: account.status, courses: account.courses, createdAt: account.createdAt };
}

export function applyGoogleIdentity(accounts: Account[], identity: { sub: string; email: string; name?: string }, intent: "signup" | "signin") {
  const email = identity.email.trim().toLowerCase();
  const existing = accounts.find(a => a.googleId === identity.sub || a.email === email);
  if (existing?.googleId && existing.googleId !== identity.sub) throw new Error("Identity mismatch");
  if (intent === "signup") {
    if (existing) return { result: "exists" as const, account: existing };
    const account: Account = { id: randomUUID(), email, name: identity.name || email.split("@")[0], status: "pending", courses: [], createdAt: new Date().toISOString(), googleId: identity.sub };
    accounts.unshift(account);
    return { result: "created" as const, account };
  }
  if (!existing) return { result: "missing" as const, account: null };
  // Google has verified ownership; an unverified email signup password must not survive linking.
  if (!existing.googleId) delete existing.passwordHash;
  existing.googleId = identity.sub;
  return { result: "login" as const, account: existing };
}
