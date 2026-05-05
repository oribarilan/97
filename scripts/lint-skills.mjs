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
 *   - if principles.md exists, contains every `<source>/<principle>` ID
 *     listed in SKILL_RULES.principles for that skill (see CITATION-SCHEME.md)
 *
 * Exits 1 on any failure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const skillsDir = path.join(root, 'skills');

// Per-skill budgets (lines) and required principle IDs.
// ID format: `<source-key>/<principle-key>` — see CITATION-SCHEME.md.
//
// Budget philosophy (`decide-lint-budget-policy`, v0.3):
// Caps are tight by design. The gold-standard skill,
// `error-and-correctness-traps`, fits ~7 trap domains with concrete
// examples in ~130 lines. Existing content skills sit comfortably
// below 250. The cap is a forcing function for editorial density,
// not a budget to spend. New skills should match
// `error-and-correctness-traps` density first; if the work genuinely
// can't fit, bump that one skill's cap with a documented reason —
// don't blanket-loosen.
const SKILL_RULES = {
  'using-97': { maxLines: 100, sections: ['Overview', 'Red Flags'], principles: [] },
  'before-you-refactor': {
    maxLines: 200,
    sections: ['Overview', 'When to invoke', 'Red Flags'],
    principles: [
      '97/6',
      '97/8',
      '97/24',
      '97/31',
      '97/74',
      'Fowler/LongMethod',
      'Fowler/FeatureEnvy',
      'Fowler/ShotgunSurgery',
      'Fowler/DataClumps',
    ],
  },
  'writing-clean-code': {
    maxLines: 250,
    sections: ['Overview', 'When to invoke', 'Red Flags'],
    principles: ['97/13', '97/15', '97/17', '97/30', '97/75', '97/76', '97/91', '97/94'],
  },
  'testing-discipline': {
    maxLines: 250,
    sections: ['Overview', 'When to invoke', 'Red Flags'],
    principles: ['97/25', '97/60', '97/80', '97/81', '97/82', '97/83', '97/92', '97/95'],
  },
  'api-and-interface-design': {
    maxLines: 250,
    sections: ['Overview', 'When to invoke', 'Red Flags'],
    principles: ['97/7', '97/19', '97/32', '97/35', '97/55', '97/59', '97/65', '97/66', '97/84'],
  },
  'pre-commit-self-review': {
    maxLines: 250,
    sections: ['Overview', 'When to invoke', 'Red Flags'],
    principles: ['97/1', '97/9', '97/14', '97/16', '97/42', '97/47', '97/58', '97/69', '97/90'],
  },
  'error-and-correctness-traps': {
    maxLines: 250,
    sections: ['Overview', 'When to invoke', 'Red Flags'],
    principles: ['97/21', '97/26', '97/29', '97/33', '97/41', '97/46', '97/57', '97/73', '97/89'],
  },
  'build-deploy-and-tooling': {
    maxLines: 250,
    sections: ['Overview', 'When to invoke', 'Red Flags'],
    principles: [
      '97/4',
      '97/10',
      '97/20',
      '97/38',
      '97/40',
      '97/61',
      '97/63',
      '97/68',
      '97/78',
      '97/79',
      '97/88',
      '12F/III',
      '12F/V',
      '12F/VI',
      '12F/XI',
      'CD/PipelineAsCode',
    ],
  },
  'domain-modeling': {
    maxLines: 200,
    sections: ['Overview', 'When to invoke', 'Red Flags'],
    principles: [
      '97/2',
      '97/11',
      '97/12',
      '97/23',
      '97/48',
      'Wlaschin/InvalidStatesUnrepresentable',
      'Wlaschin/SmartConstructors',
      'Wlaschin/TypesForEffects',
      'Fowler/PrimitiveObsession',
    ],
  },
  'working-with-users-and-team': {
    maxLines: 250,
    sections: ['Overview', 'When to invoke', 'Red Flags'],
    principles: ['97/3', '97/36', '97/50', '97/77', '97/97'],
  },
  'security-and-trust-boundaries': {
    maxLines: 250,
    sections: ['Overview', 'When to invoke', 'Red Flags'],
    // Per CITATION-SCHEME.md ID-uniqueness rule, 97/26 and 97/29 are owned
    // canonically by error-and-correctness-traps. This skill cross-references
    // them in SKILL.md but does not own them.
    principles: [],
  },
};

const errors = [];
const fail = (skill, msg) => errors.push(`  [${skill}] ${msg}`);

function parseFrontmatter(content) {
  // Tolerate CRLF: Git on Windows checks out .md files with CRLF unless
  // .gitattributes pins eol=lf. Defense in depth — match either.
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0)
      fm[line.slice(0, i).trim()] = line
        .slice(i + 1)
        .trim()
        .replace(/^["']|["']$/g, '');
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
  if (!parsed) {
    fail(skillName, `frontmatter does not parse`);
    return;
  }
  const { frontmatter: fm, body } = parsed;

  if (!fm.name) fail(skillName, `frontmatter missing 'name'`);
  if (fm.name && fm.name !== skillName)
    fail(skillName, `frontmatter name="${fm.name}" does not match dir name`);
  if (!fm.description) fail(skillName, `frontmatter missing 'description'`);
  if (fm.description && !/^use when/i.test(fm.description))
    fail(skillName, `description must start with "Use when"`);

  for (const section of rules.sections) {
    if (!hasSection(body, section)) fail(skillName, `missing required section: ${section}`);
  }

  if (rules.sections.includes('Red Flags') && !hasTableAfter(body, 'Red Flags')) {
    fail(skillName, `'Red Flags' heading present but no markdown table follows it`);
  }

  const lines = raw.split(/\r?\n/).length;
  if (lines > rules.maxLines)
    fail(skillName, `line count ${lines} exceeds budget ${rules.maxLines}`);

  if (rules.principles.length > 0) {
    const principlesFile = path.join(skillsDir, skillName, 'principles.md');
    if (fs.existsSync(principlesFile)) {
      const text = fs.readFileSync(principlesFile, 'utf8');
      const found = new Set();
      for (const m of text.matchAll(/^##\s+([A-Za-z0-9]+\/[A-Za-z0-9]+)\b/gm)) found.add(m[1]);
      const missing = rules.principles.filter((id) => !found.has(id));
      if (missing.length)
        fail(skillName, `principles.md missing principle IDs: ${missing.join(', ')}`);
    }
  }
}

function main() {
  if (!fs.existsSync(skillsDir)) {
    console.error(`no skills/ directory at ${skillsDir}`);
    process.exit(1);
  }
  const skills = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

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
