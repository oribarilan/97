# justfile — local task runner for 97
#
# Run `just` (no args) to list available recipes.
# CI uses npm scripts directly so it doesn't need `just` installed; the
# recipes here are thin wrappers that mirror the npm scripts in package.json.

# Default recipe: list all available recipes when `just` is run with no args.
default:
    @just --list

# Run the smoke test (loads plugin, parses manifests, asserts invariants).
test:
    @npm run smoke

# Structural lint of skills/ (frontmatter, sections, line budgets, principles).
lint:
    @npm run lint

# Check formatting without mutating files (Prettier on JS/JSON/YAML).
format-check:
    @npm run format:check

# Format JS/JSON/YAML in-place with Prettier.
format:
    @npm run format

# Run every check that gates a green build: lint + format-check + test.
# This is what CI runs via `npm test`.
check: lint format-check test

# Remove generated/ignored artifacts (node_modules, prettier cache).
clean:
    @rm -rf node_modules .prettiercache
