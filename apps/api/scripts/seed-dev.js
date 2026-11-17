// Development sign-in seed: creates the tenant "TERA EV Development" and the OEM admin admin@tera.local, then prints a one-time
// password. Only its scrypt hash is stored. Run from apps/api:
//   node scripts/seed-dev.js            (fails if the admin already exists)
//   node scripts/seed-dev.js --reset    (sets a new password for the existing admin)
const fs = require('fs');
const path = require('path');
const { build } = require('./build');

async function main() {
  const reset = process.argv.includes('--reset');
  const compiled = build();                                              // the same compile as the production build
  if (!compiled.ok) { process.stderr.write(compiled.output); return 1; }
  if (fs.existsSync('.env')) process.loadEnvFile('.env');                // same DATABASE_URL as the server
  const { createDb } = require(path.join(__dirname, '..', 'dist', 'db', 'client.js'));
  const { seedDevelopmentAdmin } = require(path.join(__dirname, '..', 'dist', 'auth', 'seedDev.js'));
  const db = createDb();
  try {
    const seeded = await seedDevelopmentAdmin(db, { reset });
    console.log(`Tenant: ${seeded.tenantName}`);
    console.log(`Admin:  ${seeded.email}`);
    console.log(`Password (shown once, not stored): ${seeded.password}`);
    return 0;
  } catch (err) {
    console.error(err.message);
    return 1;
  } finally {
    db.close();
  }
}

main().then((code) => { process.exitCode = code; });
