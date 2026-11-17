/// <reference types="jest" />
// Live check against the Turso database in .env. Runs only when RUN_TURSO_TESTS=1 is set, so normal test runs never touch
// the cloud database. It reads the URL and token from the environment and does not print them.
import { createDb } from '../../../../src/db/client';
import { migrate } from '../../../../src/db/migrate';
import { AUTH_MIGRATION } from '../../../../src/auth/accounts';
import { PROCUREMENT_MIGRATIONS } from '../../../../src/procurement/migrations';

const live = process.env.RUN_TURSO_TESTS === '1';

(live ? describe : describe.skip)('Turso connection (live)', () => {
  it('connects, applies the app migrations (idempotent), and queries the tenant, user and vendor tables', async () => {
    const db = createDb();
    try {
      expect((await db.execute('SELECT 1 AS ok')).rows[0].ok).toBe(1);
      await migrate(db, [AUTH_MIGRATION, ...PROCUREMENT_MIGRATIONS]);
      for (const table of ['tenants', 'users', 'vendors', 'vendor_purchase_orders', 'vendor_purchase_order_lines']) {
        const r = await db.execute(`SELECT COUNT(*) AS n FROM ${table}`);
        expect(typeof r.rows[0].n === 'number' || typeof r.rows[0].n === 'bigint').toBe(true);
      }
    } finally {
      db.close();
    }
  });
});
