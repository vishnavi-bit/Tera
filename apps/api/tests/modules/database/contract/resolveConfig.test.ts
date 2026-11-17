/// <reference types="jest" />
import { DEFAULT_DATABASE_URL, resolveDatabaseConfig } from '../../../../src/db/client';

const TOKEN = 'eyJhbGciOiJFZERTQSJ9.payload-for-test.signature-for-test';

describe('database target', () => {
  it('uses the local file when nothing is configured', () => {
    expect(resolveDatabaseConfig({}, {})).toEqual({ url: DEFAULT_DATABASE_URL, authToken: undefined, target: 'local-file' });
  });

  it('uses Turso when TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are set, and ignores DATABASE_URL', () => {
    const cfg = resolveDatabaseConfig({}, {
      TURSO_DATABASE_URL: 'libsql://tera.example.turso.io', TURSO_AUTH_TOKEN: TOKEN, DATABASE_URL: 'file:./other.db'
    });
    expect(cfg).toEqual({ url: 'libsql://tera.example.turso.io', authToken: TOKEN, target: 'turso' });
  });

  it('refuses a Turso URL without a token, and never puts the token in the message', () => {
    expect(() => resolveDatabaseConfig({}, { TURSO_DATABASE_URL: 'libsql://tera.example.turso.io' }))
      .toThrow('TURSO_AUTH_TOKEN is required');
  });

  it('refuses a URL that is not libsql://, and does not echo a token into the message', () => {
    let message = '';
    try {
      resolveDatabaseConfig({}, { TURSO_DATABASE_URL: 'https://tera.example.turso.io', TURSO_AUTH_TOKEN: TOKEN });
    } catch (e) {
      message = (e as Error).message;
    }
    expect(message).toMatch(/libsql:\/\//);
    expect(message).not.toContain(TOKEN);
  });

  it('an empty TURSO_DATABASE_URL counts as not set', () => {
    expect(resolveDatabaseConfig({}, { TURSO_DATABASE_URL: '  ' }).target).toBe('local-file');
  });

  it('an explicit url (tests) wins over the environment', () => {
    expect(resolveDatabaseConfig({ url: ':memory:' }, { TURSO_DATABASE_URL: 'libsql://x.turso.io', TURSO_AUTH_TOKEN: TOKEN }))
      .toMatchObject({ url: ':memory:', target: 'memory' });
  });

  it('DATABASE_URL is used when Turso is not configured', () => {
    expect(resolveDatabaseConfig({}, { DATABASE_URL: 'file:./custom.db', DATABASE_AUTH_TOKEN: 'x' }))
      .toEqual({ url: 'file:./custom.db', authToken: 'x', target: 'env' });
  });
});
