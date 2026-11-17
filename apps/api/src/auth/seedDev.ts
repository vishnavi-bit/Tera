// Development seed: one tenant and one OEM admin for local sign-in. Only the password hash is stored; the plain password is
// returned to the caller once (scripts/seed-dev.js prints it and does not keep it).
import { Db } from '../db/client';
import { migrate } from '../db/migrate';
import { AUTH_MIGRATION, createAccountService, normaliseEmail } from './accounts';
import { generatePassword, hashPassword } from './passwords';

export const DEV_TENANT_NAME = 'TERA EV Development';
export const DEV_ADMIN_EMAIL = 'admin@tera.local';
export const DEV_ADMIN_NAME = 'Development OEM admin';
// super-admin: vendor administration (docs/source/screen_details.md). procurement-manager: purchase orders (same source).
export const DEV_ADMIN_ROLES = ['super-admin', 'procurement-manager'];

export interface SeededAdmin { tenantName: string; email: string; password: string }

export async function seedDevelopmentAdmin(db: Db, options: { reset?: boolean; password?: string } = {}): Promise<SeededAdmin> {
  await migrate(db, [AUTH_MIGRATION]);
  const accounts = createAccountService(db);
  const email = normaliseEmail(DEV_ADMIN_EMAIL);
  const password = options.password ?? generatePassword();
  const passwordHash = await hashPassword(password);

  const existing = await accounts.findUserByEmail(email);
  if (existing) {
    if (!options.reset) throw new Error(`${email} already exists; run with --reset to set a new password`);
    await accounts.updateCredentials(existing.id, passwordHash, DEV_ADMIN_ROLES);
    return { tenantName: DEV_TENANT_NAME, email, password };
  }
  const tenant = (await accounts.findTenantByName(DEV_TENANT_NAME)) ?? (await accounts.createTenant(DEV_TENANT_NAME));
  await accounts.createUser({ tenantId: tenant.id, email, name: DEV_ADMIN_NAME, passwordHash, roles: DEV_ADMIN_ROLES });
  return { tenantName: DEV_TENANT_NAME, email, password };
}
