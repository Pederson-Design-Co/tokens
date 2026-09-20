// The docs half of the gate: reads every machinery doc as a claim and the folder as the truth.
// Seven rules, listed in STATUS.md 2c. Any finding exits 1. Plain Node (which runs .ts files
// directly since Node 23), no dependencies.
//
// Output, one finding per block, same shape as the ed2go check.js:
//   KIND
//     File:     path:line
//     Found:    what the doc says
//     Expected: what the folder says
//     Owner:    the doc that owns the rule

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type Finding = { kind: string; file: string; line: number; found: string; expected: string; owner: string };
type Doc = [path: string, text: string];
type IdPrefix = 'S' | 'P' | 'Q';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LAW = resolve(ROOT, '..', '_Playbook');
const MACHINERY = ['CLAUDE.md', 'RULES.md', 'STATUS.md', 'BACKLOG.md'];
const FORBIDDEN = ['README.md', 'PRINCIPLES.md', 'WORKFLOW.md', 'AGENTS.md'];
const SKIP_DIRS = new Set(['node_modules', 'resources', '.git', '.expo', 'dist']);
const FILE_EXT = /\.(md|mjs|cjs|js|ts|tsx|json|ya?ml)$/;

// The law lives beside this repo. A bare clone (a CI runner, a fresh machine) may not have it;
// then the checks that depend on it are skipped and counted, never silently passed.
const LAW_PRESENT = existsSync(LAW);
const LAW_REFERENCE = /(^|\/)_Playbook\/|^(PRINCIPLES|WORKFLOW)\.md$|^setup\//;

const findings: Finding[] = [];
const counts = { docs: 0, references: 0, ids: 0, citations: 0, skipped: 0 };

function finding(kind: string, file: string, line: number, found: string, expected: string, owner: string): void {
  findings.push({ kind, file, line, found, expected, owner });
}

function read(path: string): string {
  return readFileSync(path, 'utf8');
}

function lineOf(text: string, index: number): number {
  return text.slice(0, index).split('\n').length;
}

function relRoot(path: string): string {
  return path.startsWith(ROOT) ? path.slice(ROOT.length + 1) : path;
}

function isPrefix(c: string): c is IdPrefix {
  return c === 'S' || c === 'P' || c === 'Q';
}

// Case-sensitive existence: macOS says yes to `Status.md` for `STATUS.md`; git and Linux do not.
function resolvesExactly(base: string, rel: string): boolean {
  let dir = base;
  for (const segment of rel.split('/')) {
    if (segment === '' || segment === '.') continue;
    if (segment === '..') {
      dir = dirname(dir);
      continue;
    }
    if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
    if (!readdirSync(dir).includes(segment)) return false;
    dir = join(dir, segment);
  }
  return existsSync(dir);
}

// The docs this checker reads: the four machinery files, plus docs/*.md once that folder exists.
function docsToCheck(): string[] {
  const docs = MACHINERY.map((name) => join(ROOT, name)).filter(existsSync);
  const docsDir = join(ROOT, 'docs');
  if (existsSync(docsDir)) {
    for (const name of readdirSync(docsDir)) {
      if (name.endsWith('.md')) docs.push(join(docsDir, name));
    }
  }
  return docs;
}

// Rule 1: DEAD REFERENCE. Every backticked or linked path with a file extension must exist.
function deadReferences(path: string, text: string): void {
  const bases = [ROOT, dirname(path), LAW, resolve(ROOT, '..')];
  const patterns = [/`([^`\n]+)`/g, /\]\(([^)\s]+)\)/g];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const raw = match[1] ?? '';
      const candidate = raw.trim().replace(/#.*$/, '').replace(/:\d+(-\d+)?$/, '');
      if (!FILE_EXT.test(candidate)) continue;
      if (/^(https?:|~|\/)/.test(candidate)) continue;
      if (/[{}<>*\s]/.test(candidate)) continue;
      if (!LAW_PRESENT && LAW_REFERENCE.test(candidate)) {
        counts.skipped += 1;
        continue;
      }
      counts.references += 1;
      if (bases.some((base) => resolvesExactly(base, candidate))) continue;
      finding(
        'DEAD REFERENCE',
        relRoot(path),
        lineOf(text, match.index),
        candidate,
        'a file that exists, spelled exactly as on disk',
        'CLAUDE.md, the map of where things go',
      );
    }
  }
}

// Rule 2: BACKLOG ID. Table rows and item blocks agree; every ID mentioned anywhere is defined.
function backlogIds(docs: Doc[]): void {
  const own = join(ROOT, 'BACKLOG.md');
  const law = join(LAW, 'BACKLOG.md');
  const defined: Record<IdPrefix, Set<string>> = { S: new Set(), Q: new Set(), P: new Set() };
  const rows: Record<IdPrefix, Map<string, number>> = { S: new Map(), Q: new Map(), P: new Map() };

  function collect(text: string, prefixes: IdPrefix[]): void {
    for (const match of text.matchAll(/\*\*([SPQ]-\d+):/g)) {
      const id = match[1] ?? '';
      const prefix = id[0] ?? '';
      if (isPrefix(prefix) && prefixes.includes(prefix)) defined[prefix].add(id);
    }
    for (const match of text.matchAll(/^\|\s*([SP]-\d+)\s*\|/gm)) {
      const id = match[1] ?? '';
      const prefix = id[0] ?? '';
      if (isPrefix(prefix) && prefixes.includes(prefix)) rows[prefix].set(id, lineOf(text, match.index));
    }
  }
  if (existsSync(own)) collect(read(own), ['S', 'Q']);
  if (existsSync(law)) collect(read(law), ['P']);

  for (const prefix of ['S', 'P'] as const) {
    const file = prefix === 'S' ? own : law;
    if (!existsSync(file)) continue;
    const text = read(file);
    for (const [id, line] of rows[prefix]) {
      counts.ids += 1;
      if (!defined[prefix].has(id)) {
        finding('BACKLOG ID', relRoot(file), line, `${id} in the table`, `a **${id}:** block below it`, 'BACKLOG.md');
      }
    }
    for (const id of defined[prefix]) {
      if (!rows[prefix].has(id)) {
        const at = text.indexOf(`**${id}:`);
        finding('BACKLOG ID', relRoot(file), lineOf(text, at), `${id} block`, `a table row for ${id}`, 'BACKLOG.md');
      }
    }
  }

  for (const [path, text] of docs) {
    for (const match of text.matchAll(/\b([SPQ]-\d+)\b/g)) {
      const id = match[1] ?? '';
      const prefix = id[0] ?? '';
      if (!isPrefix(prefix) || defined[prefix].has(id)) continue;
      if (prefix === 'P' && !LAW_PRESENT) {
        counts.skipped += 1;
        continue;
      }
      const home = prefix === 'P' ? '_Playbook/BACKLOG.md' : 'BACKLOG.md';
      finding('BACKLOG ID', relRoot(path), lineOf(text, match.index), id, `a **${id}:** definition in ${home}`, 'BACKLOG.md');
    }
  }
}

// Rule 3: CITATION. §N and rule N point at headings that exist.
function citations(path: string, text: string): void {
  const headings: Record<'RULES' | 'WORKFLOW' | 'PRINCIPLES', string> = {
    RULES: existsSync(join(ROOT, 'RULES.md')) ? read(join(ROOT, 'RULES.md')) : '',
    WORKFLOW: existsSync(join(LAW, 'WORKFLOW.md')) ? read(join(LAW, 'WORKFLOW.md')) : '',
    PRINCIPLES: existsSync(join(LAW, 'PRINCIPLES.md')) ? read(join(LAW, 'PRINCIPLES.md')) : '',
  };
  for (const match of text.matchAll(/(RULES|WORKFLOW)\.md`?\s*§\s*(\d+)/g)) {
    const doc = match[1] === 'RULES' ? 'RULES' : 'WORKFLOW';
    const n = match[2] ?? '';
    if (doc === 'WORKFLOW' && !LAW_PRESENT) {
      counts.skipped += 1;
      continue;
    }
    counts.citations += 1;
    if (!new RegExp(`^## ${n}\\.`, 'm').test(headings[doc])) {
      finding('CITATION', relRoot(path), lineOf(text, match.index), `${doc}.md §${n}`, `a "## ${n}." heading in ${doc}.md`, `${doc}.md`);
    }
  }
  for (const match of text.matchAll(/PRINCIPLES\.md`?\s*rule\s+(\d+)/g)) {
    if (!LAW_PRESENT) {
      counts.skipped += 1;
      continue;
    }
    counts.citations += 1;
    const n = match[1] ?? '';
    if (!new RegExp(`^\\*\\*${n}\\.`, 'm').test(headings.PRINCIPLES)) {
      finding('CITATION', relRoot(path), lineOf(text, match.index), `PRINCIPLES.md rule ${n}`, `a "**${n}." rule in PRINCIPLES.md`, 'PRINCIPLES.md');
    }
  }
}

// Rule 4: TEMPLATE MARKER. Nothing copied from a template is left unfilled.
function templateMarkers(path: string, text: string): void {
  for (const match of text.matchAll(/\{\{/g)) {
    finding('TEMPLATE MARKER', relRoot(path), lineOf(text, match.index), '{{', 'real content', 'setup/CHECKLIST.md');
  }
}

// Rule 5: PHASE LIST. STATUS.md's current phase has checkbox lines, and none inside a code fence.
function phaseList(path: string, text: string): void {
  const start = text.search(/^## Current phase/m);
  if (start < 0) {
    finding('PHASE LIST', relRoot(path), 1, 'no "## Current phase" section', 'a current-phase section with its subphase checklist', 'WORKFLOW.md §1');
    return;
  }
  const rest = text.slice(start + 1);
  const next = rest.search(/^## /m);
  const section = next < 0 ? rest : rest.slice(0, next);
  const boxes = [...section.matchAll(/^- \[[ x~]\]/gm)];
  if (boxes.length === 0) {
    finding('PHASE LIST', relRoot(path), lineOf(text, start), 'no subphase checkbox lines', 'at least one "- [ ]" / "- [x]" line', 'WORKFLOW.md §1');
  }
  let fenced = false;
  section.split('\n').forEach((line, i) => {
    if (line.startsWith('```')) fenced = !fenced;
    else if (fenced && /^- \[[ x~]\]/.test(line)) {
      finding('PHASE LIST', relRoot(path), lineOf(text, start) + i, 'a checklist inside a code fence', 'a markdown task list, never fenced', 'WORKFLOW.md §2');
    }
  });
}

// Rule 6: MACHINERY. The four files exist; the forbidden names do not.
function machinery(): void {
  for (const name of MACHINERY) {
    if (!existsSync(join(ROOT, name))) {
      finding('MACHINERY', name, 1, 'missing', `${name} at the repo root`, 'setup/PATTERNS.md');
    }
  }
  function walk(dir: string): void {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name));
      } else if (FORBIDDEN.includes(entry.name)) {
        finding('MACHINERY', relRoot(join(dir, entry.name)), 1, entry.name, 'no file by this name in a project (setup/CHECKLIST.md)', 'setup/CHECKLIST.md');
      }
    }
  }
  walk(ROOT);
}

// Run.
const docs: Doc[] = docsToCheck().map((path) => [path, read(path)]);
counts.docs = docs.length;
for (const [path, text] of docs) {
  deadReferences(path, text);
  citations(path, text);
  templateMarkers(path, text);
  if (basename(path) === 'STATUS.md') phaseList(path, text);
}
backlogIds(docs);
machinery();

// Rule 7: CANARY. A check that examined nothing is not a pass.
if (counts.references === 0) {
  finding('CANARY', 'scripts/check-docs.ts', 1, '0 references examined', 'the docs to contain paths to check; the reference pattern may have stopped matching', 'scripts/check-docs.ts');
}

for (const f of findings) {
  console.log(`\n${f.kind}\n  File:     ${f.file}:${f.line}\n  Found:    ${f.found}\n  Expected: ${f.expected}\n  Owner:    ${f.owner}`);
}
const lawNote = LAW_PRESENT ? '' : ` Law folder absent (${LAW}): ${counts.skipped} law reference(s) and citation(s) not checked.`;
console.log(
  `\ncheck: ${findings.length} finding(s) in ${counts.docs} documents, ${counts.references} references, ${counts.ids} backlog rows, ${counts.citations} citations.${lawNote}`,
);
process.exit(findings.length ? 1 : 0);
