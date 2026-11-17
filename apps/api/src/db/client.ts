// SQLite / libSQL (Turso) client. One call creates the client; `asExecutor` adapts it to the `execute(sql, args)` shape the
// tenant-scoped data access of the multi-tenant module expects.
//
// Which database is used (first match wins):
//   1. an explicit url passed to createDb (tests use ':memory:');
//   2. TURSO_DATABASE_URL (libsql://...) with TURSO_AUTH_TOKEN: the Turso cloud database;
//   3. DATABASE_URL with DATABASE_AUTH_TOKEN (optional);
//   4. the local file file:./data/app.db.
// The token is only ever passed to the client. It is never logged or put in an error message.
import fs from 'fs';
import path from 'path';
import { createClient, Client } from '@libsql/client';

export type Db = Client;
export interface DbOptions { url?: string; authToken?: string }

export const DEFAULT_DATABASE_URL = 'file:./data/app.db';

export interface DatabaseConfig { url: string; authToken?: string; target: 'turso' | 'env' | 'local-file' | 'memory' }

export function resolveDatabaseConfig(options: DbOptions = {}, env: NodeJS.ProcessEnv = process.env): DatabaseConfig {
  if (options.url !== undefined) {
    const url = options.url.trim();
    return { url, authToken: options.authToken, target: url.startsWith('file::memory:') || url === ':memory:' ? 'memory' : 'env' };
  }
  const tursoUrl = (env.TURSO_DATABASE_URL ?? '').trim();
  if (tursoUrl !== '') {
    if (!tursoUrl.startsWith('libsql://')) throw new Error('TURSO_DATABASE_URL must start with libsql://');
    const token = (options.authToken ?? env.TURSO_AUTH_TOKEN ?? '').trim();
    if (token === '') throw new Error('TURSO_AUTH_TOKEN is required when TURSO_DATABASE_URL is set');
    return { url: tursoUrl, authToken: token, target: 'turso' };
  }
  const url = (env.DATABASE_URL ?? DEFAULT_DATABASE_URL).trim();
  return {
    url,
    authToken: options.authToken ?? env.DATABASE_AUTH_TOKEN,
    target: url === DEFAULT_DATABASE_URL ? 'local-file' : 'env'
  };
}

export function createDb(options: DbOptions = {}): Db {
  const config = resolveDatabaseConfig(options);
  const url = config.url;
  if (!/^(file:|libsql:|https?:|wss?:|:memory:)/.test(url)) throw new Error(`unsupported database URL "${url.slice(0, 40)}": use file:..., libsql://... or :memory:`);
  if (url.startsWith('file:') && !url.startsWith('file::memory:')) {
    const file = url.slice('file:'.length).split('?')[0];
    if (file) fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  }
  return createClient({ url, authToken: config.authToken });
}

export interface Executor { execute(sql: string, args: unknown[]): Promise<{ rows: Record<string, unknown>[]; rowsAffected: number }> }
export function asExecutor(db: Db): Executor {
  return {
    async execute(sql, args) {
      const r = await db.execute({ sql, args: args as any });
      return { rows: r.rows.map((row) => ({ ...row })) as Record<string, unknown>[], rowsAffected: r.rowsAffected };
    }
  };
}
