import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { transaction, createSession, getSession } from '../lib/auth-store.ts';

process.loadEnvFile('.env.production.local');
assert.ok(process.env.DATABASE_URL, 'Database configuration required');
const prefix = `db-test-${randomUUID()}`;
try {
  await Promise.all(Array.from({ length: 8 }, (_, index) => transaction(store => {
    store.accounts.push({ id: `${prefix}-${index}`, email: `${prefix}-${index}@example.com`, name: 'Temporary database test', status: 'pending', courses: [], createdAt: new Date().toISOString() });
  })));
  assert.equal(await transaction(store => store.accounts.filter(a => a.id.startsWith(prefix)).length), 8, 'Concurrent writes must all survive');
  const token = await createSession(`${prefix}-0`);
  assert.equal((await getSession(token)).id, `${prefix}-0`);
  await transaction(store => {
    store.accounts = store.accounts.filter(a => a.id !== `${prefix}-0`);
    store.sessions = store.sessions.filter(s => s.accountId !== `${prefix}-0`);
  });
  assert.equal(await getSession(token), null, 'Deletion revokes the stored session');
  await assert.rejects(transaction(store => {
    store.accounts = [];
    throw new Error('Rollback test');
  }));
  assert.equal(await transaction(store => store.accounts.filter(a => a.id.startsWith(prefix)).length), 7, 'Failed transactions must roll back');
  console.log('PASS: concurrent durable writes, session persistence, deletion and rollback');
} finally {
  await transaction(store => {
    store.accounts = store.accounts.filter(a => !a.id.startsWith(prefix));
    store.sessions = store.sessions.filter(s => !s.accountId.startsWith(prefix));
  });
}
