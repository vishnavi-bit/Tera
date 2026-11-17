// Read-only inventory of the database the API would use (Turso when TURSO_DATABASE_URL is set, otherwise the local file).
// Lists the tables, the row counts of the app's tables and the migrations already applied. It never writes and never prints
// the auth token. Run from apps/api:  node scripts/db-inspect.js
const fs = require('fs');
const path = require('path');
const { build } = require('./build');

const APP_TABLES = ['schema_migrations', 'tenants', 'users', 'vendors', 'vendor_purchase_orders', 'vendor_purchase_order_lines', 'po_number_sequences', 'purchase_orders', 'settings'];

async function main() {
  const compiled = build();
  if (!compiled.ok) { process.stderr.write(compiled.output); return 1; }
  if (fs.existsSync('.env')) process.loadEnvFile('.env');
  const { createDb, resolveDatabaseConfig } = require(path.join(__dirname, '..', 'dist', 'db', 'client.js'));

  const config = resolveDatabaseConfig();
  const where = config.target === 'turso'
    ? `Turso cloud database at ${new URL(config.url).host}`
    : config.target === 'local-file' ? 'local file apps/api/data/app.db' : `database ${config.url.slice(0, 40)}`;
  console.log(`Target: ${where}`);

  const db = createDb();
  try {
    const tables = (await db.execute("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")).rows.map((r) => String(r.name));
    console.log(`Tables (${tables.length}): ${tables.length ? tables.join(', ') : 'none'}`);
    for (const t of APP_TABLES) {
      if (!tables.includes(t)) { console.log(`  ${t}: not present`); continue; }
      const n = (await db.execute(`SELECT COUNT(*) AS n FROM ${t}`)).rows[0].n;
      console.log(`  ${t}: ${n} row(s)`);
    }
    if (tables.includes('schema_migrations')) {
      const applied = (await db.execute('SELECT id FROM schema_migrations ORDER BY id')).rows.map((r) => String(r.id));
      console.log(`Migrations applied: ${applied.length ? applied.join(', ') : 'none'}`);
    } else {
      console.log('Migrations applied: none (no schema_migrations table yet)');
    }
    return 0;
  } catch (err) {
    console.error(`Inventory failed: ${err.message}`);
    return 1;
  } finally {
    db.close();
  }
}

main().then((code) => { process.exitCode = code; });
