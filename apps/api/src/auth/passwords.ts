// Password hashing with Node's built-in scrypt (no extra dependency). Only the hash is ever stored; the salt and the cost
// parameters travel inside the stored string, so the cost can be raised later without breaking existing accounts.
import crypto from 'crypto';

const N = 16384, R = 8, P = 1, KEYLEN = 64, SALT_BYTES = 16;
const PREFIX = 'scrypt';

function derive(password: string, salt: Buffer, n: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    crypto.scrypt(password, salt, KEYLEN, { N: n, r, p, maxmem: 64 * 1024 * 1024 }, (err, key) => (err ? reject(err) : resolve(key))));
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(SALT_BYTES);
  const key = await derive(password, salt, N, R, P);
  return [PREFIX, N, R, P, salt.toString('base64'), key.toString('base64')].join('$');
}

// True only for a matching password against a well-formed stored hash. Malformed input is simply "no match".
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = String(stored).split('$');
  if (parts.length !== 6 || parts[0] !== PREFIX) return false;
  const n = Number(parts[1]), r = Number(parts[2]), p = Number(parts[3]);
  if (![n, r, p].every((v) => Number.isInteger(v) && v > 0)) return false;
  const salt = Buffer.from(parts[4], 'base64');
  const expected = Buffer.from(parts[5], 'base64');
  if (salt.length === 0 || expected.length !== KEYLEN) return false;
  const actual = await derive(password, salt, n, r, p);
  return crypto.timingSafeEqual(actual, expected);
}

// A hash of a random value, checked on login when the email is unknown, so an unknown account takes as long as a known one.
let dummy: Promise<string> | undefined;
export function burnPasswordCheck(password: string): Promise<boolean> {
  dummy ??= hashPassword(crypto.randomBytes(16).toString('hex'));
  return dummy.then((h) => verifyPassword(password, h)).then(() => false);
}

export function generatePassword(): string {
  return crypto.randomBytes(18).toString('base64url');                  // 24 characters from a CSPRNG
}
