/** @jest-environment jsdom */
import { apiFetch } from '../../../../src/api/apiFetch';
import { clearSession, saveSession, useAuth } from '../../../../src/state/authStore';

const user = { id: 'u1', name: 'Admin', email: 'admin@tera.local', roles: ['super-admin'] };

describe('shared API fetch helper', () => {
  beforeEach(() => {
    clearSession();
    sessionStorage.clear();
  });

  it('adds the bearer token to every call when signed in', async () => {
    saveSession({ token: 'tok-123', user });
    (global as any).fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200 } as Response));
    await apiFetch('/api/procurement/vendors', { headers: { 'content-type': 'application/json' } });
    const [, init] = (global as any).fetch.mock.calls[0];
    expect(init.headers.authorization).toBe('Bearer tok-123');
    expect(init.headers['content-type']).toBe('application/json');
  });

  it('sends no authorization header when signed out, and never sends a tenant', async () => {
    (global as any).fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200 } as Response));
    await apiFetch('/api/procurement/vendors');
    const [, init] = (global as any).fetch.mock.calls[0];
    expect(init.headers.authorization).toBeUndefined();
    expect(JSON.stringify(init.headers)).not.toMatch(/tenant/i);
  });

  it('a 401 on a call that carried a token ends the session', async () => {
    saveSession({ token: 'expired', user });
    (global as any).fetch = jest.fn(() => Promise.resolve({ ok: false, status: 401 } as Response));
    const res = await apiFetch('/api/procurement/vendors');
    expect(res.status).toBe(401);
    expect(useAuth.getState().session).toBeNull();
    expect(sessionStorage.getItem('tera.session')).toBeNull();
  });
});
