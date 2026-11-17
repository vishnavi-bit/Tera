/// <reference types="jest" />
import express from 'express';
import { AddressInfo } from 'net';
import { createAccountService } from '../../../../src/auth/accounts';
import { createAuthenticate } from '../../../../src/auth/authMiddleware';
import { createLoginRoutes, LOGIN_PATH } from '../../../../src/auth/loginRoutes';
import { createLoginLimiter } from '../../../../src/auth/loginRateLimit';
import { DEV_ADMIN_EMAIL, DEV_TENANT_NAME, seedDevelopmentAdmin } from '../../../../src/auth/seedDev';
import { hashPassword } from '../../../../src/auth/passwords';
import { createApp } from '../../../../src/http/app';
import { createDb, Db } from '../../../../src/db/client';
import { createTenantMiddleware } from '../../../../src/tenancy/tenantContext';
import { poRoutes } from '../../../../src/procurement/poRoutes';
import { vendorRoutes } from '../../../../src/procurement/vendorRoutes';

const SECRET = 'a-test-secret-that-is-long-enough-123456';
const PASSWORD = 'correct-horse-battery';
const PO = { vendorId: 'VEN-1', unitId: 'UNIT-1', lines: [{ partId: 'P1', quantity: 2, rate: 10 }] };
const VENDOR = { name: 'Acme Castings' };

// The real app assembly: authentication, then the tenant check (public only for sign-in), then the routes.
function appFor(db: Db, limiter = createLoginLimiter(), now?: () => Date) {
  return createApp({
    providers: [{ id: 'db', register: (app: any) => app.set('db', db) }],
    middleware: [
      { id: 'jwt-auth', handler: createAuthenticate({ secret: SECRET }) },
      { id: 'multi-tenant', handler: createTenantMiddleware() }
    ],
    routes: [createLoginRoutes({ secret: SECRET, limiter, now }), poRoutes, vendorRoutes]
  } as any);
}

async function withServer<T>(app: express.Express, fn: (base: string) => Promise<T>): Promise<T> {
  const server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  try {
    return await fn(`http://127.0.0.1:${(server.address() as AddressInfo).port}`);
  } finally {
    await new Promise((r) => server.close(r));
  }
}

const post = (base: string, path: string, body: unknown, headers: Record<string, string> = {}) =>
  fetch(`${base}${path}`, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });

async function seeded() {
  const db = createDb({ url: ':memory:' });
  await seedDevelopmentAdmin(db, { password: PASSWORD });
  return db;
}

async function addUser(db: Db, email: string, password: string, roles: string[]) {
  const tenant = await createAccountService(db).findTenantByName(DEV_TENANT_NAME);
  await createAccountService(db).createUser({ tenantId: tenant!.id, email, name: email, passwordHash: await hashPassword(password), roles });
}

async function tokenFor(base: string, email: string, password: string): Promise<string> {
  return (await (await post(base, LOGIN_PATH, { email, password })).json()).token;
}

describe('sign-in', () => {
  it('a correct password returns a token for the development admin, with its tenant and roles', async () => {
    const db = await seeded();
    await withServer(appFor(db), async (base) => {
      const res = await post(base, LOGIN_PATH, { email: DEV_ADMIN_EMAIL, password: PASSWORD });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.tokenType).toBe('Bearer');
      expect(body.expiresInSeconds).toBe(8 * 3600);
      expect(body.user).toMatchObject({ email: DEV_ADMIN_EMAIL, roles: ['super-admin', 'procurement-manager'] });
      expect(body.user.id).toBeTruthy();
      expect(body.token.split('.')).toHaveLength(3);
    });
  });

  it('the email is case-insensitive and surrounding spaces are ignored', async () => {
    const db = await seeded();
    await withServer(appFor(db), async (base) => {
      const res = await post(base, LOGIN_PATH, { email: '  ADMIN@Tera.LOCAL ', password: PASSWORD });
      expect(res.status).toBe(200);
    });
  });

  it('a wrong password is refused with 401, and an unknown email gets the same answer', async () => {
    const db = await seeded();
    await withServer(appFor(db), async (base) => {
      const wrong = await post(base, LOGIN_PATH, { email: DEV_ADMIN_EMAIL, password: 'not-the-password' });
      const unknown = await post(base, LOGIN_PATH, { email: 'nobody@tera.local', password: PASSWORD });
      expect(wrong.status).toBe(401);
      expect(unknown.status).toBe(401);
      expect(await wrong.json()).toEqual({ error: 'invalid-credentials' });
      expect(await unknown.json()).toEqual({ error: 'invalid-credentials' });
    });
  });

  it('a deactivated user cannot sign in even with the right password', async () => {
    const db = await seeded();
    await db.execute("UPDATE users SET active = 0 WHERE email = 'admin@tera.local'");
    await withServer(appFor(db), async (base) => {
      expect((await post(base, LOGIN_PATH, { email: DEV_ADMIN_EMAIL, password: PASSWORD })).status).toBe(401);
    });
  });

  it('missing fields answer 400', async () => {
    const db = await seeded();
    await withServer(appFor(db), async (base) => {
      expect((await post(base, LOGIN_PATH, { email: DEV_ADMIN_EMAIL })).status).toBe(400);
      expect((await post(base, LOGIN_PATH, { email: '', password: PASSWORD })).status).toBe(400);
    });
  });

  it('only the hash is stored, never the password', async () => {
    const db = await seeded();
    const row = await db.execute("SELECT password_hash FROM users WHERE email = 'admin@tera.local'");
    expect(String(row.rows[0].password_hash)).toMatch(/^scrypt\$/);
    expect(String(row.rows[0].password_hash)).not.toContain(PASSWORD);
  });
});

describe('protected access', () => {
  it('vendor create and list need a token: without one the tenant check refuses; with one they work', async () => {
    const db = await seeded();
    await withServer(appFor(db), async (base) => {
      expect((await fetch(`${base}/api/procurement/vendors`)).status).toBe(401);
      expect((await post(base, '/api/procurement/vendors', VENDOR)).status).toBe(401);

      const auth = { authorization: `Bearer ${await tokenFor(base, DEV_ADMIN_EMAIL, PASSWORD)}` };
      expect((await post(base, '/api/procurement/vendors', VENDOR, auth)).status).toBe(201);
      expect((await fetch(`${base}/api/procurement/vendors`, { headers: auth })).status).toBe(200);
    });
  });

  it('a procurement manager cannot create a vendor (403) but can raise a PO (201)', async () => {
    const db = await seeded();
    await addUser(db, 'buyer@tera.local', 'buyer-password-1', ['procurement-manager']);
    await withServer(appFor(db), async (base) => {
      const auth = { authorization: `Bearer ${await tokenFor(base, 'buyer@tera.local', 'buyer-password-1')}` };
      expect((await post(base, '/api/procurement/vendors', VENDOR, auth)).status).toBe(403);
      const po = await post(base, '/api/procurement/vendor-purchase-orders', PO, auth);
      expect(po.status).toBe(201);
      expect((await po.json()).createdBy).toBeTruthy();
    });
  });

  it('a super-admin without procurement-manager cannot raise a PO (403)', async () => {
    const db = await seeded();
    await addUser(db, 'admin2@tera.local', 'admin-password-2', ['super-admin']);
    await withServer(appFor(db), async (base) => {
      const auth = { authorization: `Bearer ${await tokenFor(base, 'admin2@tera.local', 'admin-password-2')}` };
      expect((await post(base, '/api/procurement/vendor-purchase-orders', PO, auth)).status).toBe(403);
    });
  });

  it('a forged or tampered token is refused', async () => {
    const db = await seeded();
    await withServer(appFor(db), async (base) => {
      const res = await post(base, '/api/procurement/vendors', VENDOR, { authorization: 'Bearer abc.def.ghi' });
      expect(res.status).toBe(401);
    });
  });
});

describe('failed-login limit', () => {
  it('after 5 failures for an email, even the right password is refused with 429 until the window passes', async () => {
    const db = await seeded();
    let clock = Date.parse('2026-11-17T10:00:00Z');
    const limiter = createLoginLimiter({ now: () => clock });
    await withServer(appFor(db, limiter, () => new Date(clock)), async (base) => {
      for (let i = 0; i < 5; i++) {
        expect((await post(base, LOGIN_PATH, { email: DEV_ADMIN_EMAIL, password: 'wrong' })).status).toBe(401);
      }
      const locked = await post(base, LOGIN_PATH, { email: DEV_ADMIN_EMAIL, password: PASSWORD });
      expect(locked.status).toBe(429);
      expect(await locked.json()).toMatchObject({ error: 'too-many-attempts' });
      expect(Number(locked.headers.get('retry-after'))).toBeGreaterThan(0);

      clock += 15 * 60 * 1000 + 1000;                       // the window has passed
      expect((await post(base, LOGIN_PATH, { email: DEV_ADMIN_EMAIL, password: PASSWORD })).status).toBe(200);
    });
  });

  it('the limit is per email: another account is not locked by these failures', async () => {
    const db = await seeded();
    await addUser(db, 'other@tera.local', 'other-password-3', []);
    const limiter = createLoginLimiter();
    await withServer(appFor(db, limiter), async (base) => {
      for (let i = 0; i < 5; i++) await post(base, LOGIN_PATH, { email: DEV_ADMIN_EMAIL, password: 'wrong' });
      expect((await post(base, LOGIN_PATH, { email: 'other@tera.local', password: 'other-password-3' })).status).toBe(200);
    });
  });

  it('a successful login clears the count', async () => {
    const db = await seeded();
    const limiter = createLoginLimiter();
    await withServer(appFor(db, limiter), async (base) => {
      for (let i = 0; i < 4; i++) await post(base, LOGIN_PATH, { email: DEV_ADMIN_EMAIL, password: 'wrong' });
      expect((await post(base, LOGIN_PATH, { email: DEV_ADMIN_EMAIL, password: PASSWORD })).status).toBe(200);
      for (let i = 0; i < 4; i++) await post(base, LOGIN_PATH, { email: DEV_ADMIN_EMAIL, password: 'wrong' });
      expect((await post(base, LOGIN_PATH, { email: DEV_ADMIN_EMAIL, password: PASSWORD })).status).toBe(200);
    });
  });
});
