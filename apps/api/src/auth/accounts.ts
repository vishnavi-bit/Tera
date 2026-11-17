// Accounts for sign-in: the tenant and user tables (REQ-369, first slice: one OEM admin for development; full user management
// comes later). Login looks up users by email before any tenant is known, so this module reads the users table directly; every
// other tenant table still goes through the tenant-scoped data path.
import crypto from 'crypto';
import { Db, asExecutor } from '../db/client';

export const AUTH_MIGRATION = {
  id: '005-auth',
  sql: `CREATE TABLE tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL
  );
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants (id),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    roles TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    created_at TEXT NOT NULL
  );
  CREATE INDEX users_tenant ON users (tenant_id)`
};

export interface UserAccount { id: string; tenantId: string; email: string; name: string; passwordHash: string; roles: string[]; active: boolean }

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toAccount(row: Record<string, unknown>): UserAccount {
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id),
    email: String(row.email),
    name: String(row.name),
    passwordHash: String(row.password_hash),
    roles: JSON.parse(String(row.roles)) as string[],
    active: Number(row.active) === 1
  };
}

export function createAccountService(db: Db, now: () => Date = () => new Date()) {
  const exec = asExecutor(db);
  return {
    async findUserByEmail(email: string): Promise<UserAccount | null> {
      const r = await exec.execute('SELECT * FROM users WHERE email = ?', [normaliseEmail(email)]);
      return r.rows.length === 0 ? null : toAccount(r.rows[0]);
    },
    async findTenantByName(name: string): Promise<{ id: string; name: string } | null> {
      const r = await exec.execute('SELECT id, name FROM tenants WHERE name = ?', [name]);
      return r.rows.length === 0 ? null : { id: String(r.rows[0].id), name: String(r.rows[0].name) };
    },
    async createTenant(name: string): Promise<{ id: string; name: string }> {
      const id = crypto.randomUUID();
      await exec.execute('INSERT INTO tenants (id, name, created_at) VALUES (?, ?, ?)', [id, name, now().toISOString()]);
      return { id, name };
    },
    async createUser(input: { tenantId: string; email: string; name: string; passwordHash: string; roles: string[] }): Promise<string> {
      const id = crypto.randomUUID();
      await exec.execute(
        'INSERT INTO users (id, tenant_id, email, name, password_hash, roles, active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)',
        [id, input.tenantId, normaliseEmail(input.email), input.name, input.passwordHash, JSON.stringify(input.roles), now().toISOString()]
      );
      return id;
    },
    async updateCredentials(userId: string, passwordHash: string, roles: string[]): Promise<void> {
      await exec.execute('UPDATE users SET password_hash = ?, roles = ?, active = 1 WHERE id = ?', [passwordHash, JSON.stringify(roles), userId]);
    }
  };
}
