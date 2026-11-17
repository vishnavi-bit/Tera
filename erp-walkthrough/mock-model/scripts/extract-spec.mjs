// Also copies the result to mock-app/mock-data/spec/screens.json.
// Usage (from erp-walkthrough/mock-model): node scripts/extract-spec.mjs
// Reads docs/screen_details.md (the source of truth) and writes data/spec/screens.json.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../../../docs/screen_details.md', import.meta.url));
const targets = [
  fileURLToPath(new URL('../data/spec/screens.json', import.meta.url)),
  fileURLToPath(new URL('../../mock-app/mock-data/spec/screens.json', import.meta.url))
];

const lines = (await readFile(source, 'utf8')).split('\n');
const screens = [];
let app = '';
let section = '';
let current = null;

const after = (block, label) => {
  const m = block.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*([^\\n]*)`));
  return m ? m[1].trim() : '';
};

function finish() {
  if (!current) return;
  const block = current.lines.join('\n');
  const head = block.match(/\*\*Priority:\*\*\s*(\S+)\s*·\s*\*\*Status:\*\*\s*([^\n]+)/);
  const meta = block.match(/\*\*Path:\*\*\s*(.*?)\s*·\s*\*\*Type:\*\*\s*(.*?)\s*·\s*\*\*Mode:\*\*\s*(.*?)(?:\s*·\s*\*\*Roles:\*\*\s*(.*))?$/m);
  const fields = block.split(/\*\*Fields:\*\*/)[1]?.split(/\*\*Business logic \/ rules:\*\*/)[0]?.trim() ?? '';
  const rules = (block.split(/\*\*Business logic \/ rules:\*\*/)[1] ?? '')
    .split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());
  screens.push({
    code: current.code,
    name: current.name,
    app,
    section,
    priority: head?.[1] ?? '',
    status: head?.[2]?.trim() ?? '',
    path: (meta?.[1] ?? '').replace(/`/g, ''),
    type: meta?.[2] ?? '',
    mode: meta?.[3] ?? '',
    roles: (meta?.[4] ?? '').replace(/`/g, ''),
    buttons: after(block, 'Buttons / Actions'),
    fields,
    rules
  });
  current = null;
}

for (const line of lines) {
  let m;
  if ((m = line.match(/^## (.+)/))) { finish(); app = m[1].trim(); section = ''; continue; }
  if ((m = line.match(/^### (.+)/))) { finish(); section = m[1].trim(); continue; }
  if ((m = line.match(/^#### \[([A-Z]\d+)\]\s*(.+)/))) { finish(); current = { code: m[1], name: m[2].trim(), lines: [] }; continue; }
  current?.lines.push(line);
}
finish();

// The OEM section repeats some dealer screens; keep the first occurrence of each code.
const seen = new Set();
const unique = screens.filter((s) => !seen.has(s.code) && seen.add(s.code));
for (const target of targets) {
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(unique, null, 2) + '\n');
}
console.log(`${unique.length} screens written (${screens.length - unique.length} duplicates dropped)`);
