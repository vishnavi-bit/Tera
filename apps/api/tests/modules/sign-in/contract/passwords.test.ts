/// <reference types="jest" />
import { generatePassword, hashPassword, verifyPassword } from '../../../../src/auth/passwords';

describe('password hashing', () => {
  it('verifies the right password and refuses a wrong one', async () => {
    const hash = await hashPassword('correct-horse-battery');
    expect(await verifyPassword('correct-horse-battery', hash)).toBe(true);
    expect(await verifyPassword('correct-horse-batterY', hash)).toBe(false);
  });

  it('stores a salted hash, never the password itself', async () => {
    const a = await hashPassword('same-password');
    const b = await hashPassword('same-password');
    expect(a).not.toContain('same-password');
    expect(a).not.toBe(b);                                  // different salt each time
  });

  it('treats a malformed stored value as no match', async () => {
    expect(await verifyPassword('x', 'not-a-hash')).toBe(false);
    expect(await verifyPassword('x', 'scrypt$16384$8$1$AAAA$AAAA')).toBe(false);
  });

  it('generates a long random password each time', () => {
    const p = generatePassword();
    expect(p.length).toBeGreaterThanOrEqual(24);
    expect(generatePassword()).not.toBe(p);
  });
});
