#!/usr/bin/env node
/**
 * lint-skills.mjs — structural lint for skills/* (zero deps, Node built-ins).
 *
 * Checks every skills/<name>/SKILL.md:
 *   - frontmatter parses, has `name` and `description`
 *   - `description` starts with "Use when"
 *   - skill dir name matches frontmatter `name`
 *   - body contains required sections (varies by skill — see SKILL_RULES)
 *   - body has a markdown table somewhere after `Red Flags` heading
 *   - line count <= per-skill budget
 *   - if principles.md exists, contains every #NN principle for that skill
 *
 * Exits 1 on any failure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const skillsDir = path.join(root, 'skills');

// Per-skill budgets (lines) and required principle numbers.
// Source of truth: .todo/US-97-mvp/main.md "Skill grouping" table.
const SKILL_RULES = {
  'using-97':                  { maxLines: 100, sections: ['Overview', 'Red Flags'], principles: [] },
  'before-you-refactor':       { maxLines: 200, sections: ['Overview', 'When to invoke', 'Red Flags'], principles: [6, 8, 24, 31, 74] },
  'writing-clean-code':        { maxLines: 250, sections: ['Overview', 'When to invoke', 'Red Flags'], principles: [5, 13, 15, 17, 30, 39, 62, 75, 76, 91, 93, 94] },
  'testing-discipline':        { maxLines: 250, sections: ['Overview', 'When to invoke', 'Red Flags'], principles: [25, 60, 80, 81, 82, 83, 92, 95] },
  'api-and-interface-design':  { maxLines: 250, sections: ['Overview', 'When to invoke', 'Red Flags'], principles: [7, 19, 32, 35, 55, 59, 65, 66, 84] },
  'pre-commit-self-review':    { maxLines: 250, sections: ['Overview', 'When to invoke', 'Red Flags'], principles: [1, 9, 14, 16, 42, 47, 58, 69, 90] },
  'error-and-correctness-traps':{ maxLines: 250, sections: ['Overview', 'When to invoke', 'Red Flags'], principles: [21, 26, 29, 33, 41, 46, 57, 73, 89] },
  'build-deploy-and-tooling':  { maxLines: 250, sections: ['Overview', 'When to invoke', 'Red Flags'], principles: [4, 10, 20, 38, 40, 61, 63, 68, 78, 79, 88] },
  'domain-modeling':           { maxLines: 200, sections: ['Overview', 'When to invoke', 'Red Flags'], principles: [2, 11, 12, 23, 48] },
  'working-with-users-and-team':{ maxLines: 250, sections: ['Overview', 'When to invoke', 'Red Flags'], principles: [3, 36, 50, 64, 77, 85, 86, 87, 96, 97] },
};

const errors = [];
const fail = (skill, msg) => errors.push(`  [${skill}] ${msg}`);

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return { frontmatter: fm, body: m[2] };
}

function hasSection(body, name) {
  const re = new RegExp(`^#{1,6}\\s+${name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'mi');
  return re.test(body);
}

function hasTableAfter(body, heading) {
  const re = new RegExp(`^#{1,6}\\s+${heading}[\\s\\S]*?\\n\\|.*\\|.*\\n\\|\\s*-`, 'mi');
  return re.test(body);
}

function lintSkill(skillName) {
  const rules = SKILL_RULES[skillName];
  if (!rules) {
    fail(skillName, `no lint rules defined (add to SKILL_RULES in scripts/lint-skills.mjs)`);
    return;
  }
  const skillFile = path.join(skillsDir, skillName, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    fail(skillName, `missing SKILL.md`);
    return;
  }
  const raw = fs.readFileSync(skillFile, 'utf8');
  const parsed = parseFrontmatter(raw);
  if (!parsed) { fail(skillName, `frontmatter does not parse`); return; }
  const { frontmatter: fm, body } = parsed;

  if (!fm.name) fail(skillName, `frontmatter missing 'name'`);
  if (fm.name && fm.name !== skillName) fail(skillName, `frontmatter name="${fm.name}" does not match dir name`);
  if (!fm.description) fail(skillName, `frontmatter missing 'description'`);
  if (fm.description && !/^use when/i.test(fm.description)) fail(skillName, `description must start with "Use when"`);

  for (const section of rules.sections) {
    if (!hasSection(body, section)) fail(skillName, `missing required section: ${section}`);
  }

  if (rules.sections.includes('Red Flags') && !hasTableAfter(body, 'Red Flags')) {
    fail(skillName, `'Red Flags' heading present but no markdown table follows it`);
  }

  const lines = raw.split('\n').length;
  if (lines > rules.maxLines) fail(skillName, `line count ${lines} exceeds budget ${rules.maxLines}`);

  if (rules.principles.length > 0) {
    const principlesFile = path.join(skillsDir, skillName, 'principles.md');
    if (fs.existsSync(principlesFile)) {
      const text = fs.readFileSync(principlesFile, 'utf8');
      const found = new Set();
      for (const m of text.matchAll(/#(\d+)\b/g)) found.add(Number(m[1]));
      const missing = rules.principles.filter(n => !found.has(n));
      if (missing.length) fail(skillName, `principles.md missing principle numbers: ${missing.map(n => '#'+n).join(', ')}`);
    }
  }
}

function main() {
  if (!fs.existsSync(skillsDir)) {
    console.error(`no skills/ directory at ${skillsDir}`);
    process.exit(1);
  }
  const skills = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(d => d.isDirectory()).map(d => d.name);

  if (skills.length === 0) {
    console.log('lint-skills: no skills present yet (empty bundle) — OK');
    return;
  }
  for (const s of skills) lintSkill(s);
  if (errors.length) {
    console.error(`lint-skills: ${errors.length} error(s):`);
    for (const e of errors) console.error(e);
    process.exit(1);
  }
  console.log(`lint-skills: ${skills.length} skill(s) OK`);
}

main();
