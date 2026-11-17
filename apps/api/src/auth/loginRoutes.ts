// POST /api/auth/login: checks the email and password and returns a signed JWT. The tenant comes from the user's row, never from
// the request. Failures answer with one message whether the email is unknown or the password is wrong. After 5 failures for an
// email within 15 minutes, further attempts answer 429 until the window clears.
import { Request, Response, Router } from 'express';
import { Db } from '../db/client';
import { getDb } from '../db/provider';
import { migrate } from '../db/migrate';
import { AUTH_MIGRATION, createAccountService, normaliseEmail } from './accounts';
import { signToken } from './jwt';
import { createLoginLimiter } from './loginRateLimit';
import { burnPasswordCheck, verifyPassword } from './passwords';

export const LOGIN_PATH = '/api/auth/login';
export const SESSION_HOURS = 8;
const MAX_EMAIL = 254, MAX_PASSWORD = 200;

export interface LoginRouteOptions { secret?: string; now?: () => Date; limiter?: ReturnType<typeof createLoginLimiter> }

export function createLoginRoutes(options: LoginRouteOptions = {}) {
  const limiter = options.limiter ?? createLoginLimiter();
  const now = options.now ?? (() => new Date());
  const ready = new WeakMap<Db, Promise<void>>();

  function ensureSchema(db: Db): Promise<void> {
    let p = ready.get(db);
    if (!p) {
      p = migrate(db, [AUTH_MIGRATION]).then(() => undefined);
      ready.set(db, p);
      p.catch(() => ready.delete(db));
    }
    return p;
  }

  return {
    id: 'auth-login',
    mount(router: Router) {
      router.post(LOGIN_PATH, async (req: Request, res: Response) => {
        const body = req.body ?? {};
        if (typeof body.email !== 'string' || typeof body.password !== 'string' || body.email.trim() === '' || body.password === '') {
          res.status(400).json({ error: 'email and password are required' });
          return;
        }
        if (body.email.length > MAX_EMAIL || body.password.length > MAX_PASSWORD) {
          res.status(400).json({ error: 'email or password is too long' });
          return;
        }
        const key = normaliseEmail(body.email);
        const gate = limiter.check(key);
        if (gate.locked) {
          res.setHeader('retry-after', String(gate.retryAfterSeconds));
          res.status(429).json({ error: 'too-many-attempts', retryAfterSeconds: gate.retryAfterSeconds });
          return;
        }

        const db = getDb(req.app);
        await ensureSchema(db);
        const user = await createAccountService(db, now).findUserByEmail(key);
        const matched = user ? await verifyPassword(body.password, user.passwordHash) : await burnPasswordCheck(body.password);
        if (!user || !user.active || !matched) {
          limiter.fail(key);
          res.status(401).json({ error: 'invalid-credentials' });
          return;
        }

        limiter.reset(key);
        const token = await signToken(
          { userId: user.id, tenantId: user.tenantId, roles: user.roles },
          { secret: options.secret, expiresIn: `${SESSION_HOURS}h` }
        );
        res.json({
          token,
          tokenType: 'Bearer',
          expiresInSeconds: SESSION_HOURS * 3600,
          user: { id: user.id, name: user.name, email: user.email, roles: user.roles }
        });
      });
    }
  };
}

export const loginRoutes = createLoginRoutes();
