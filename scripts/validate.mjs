#!/usr/bin/env node
/**
 * Validates this repository. No dependencies; run by `.github/workflows/validate.yml` on every push
 * and pull request, and by the monorepo's own tests against the committed tree.
 *
 *   node scripts/validate.mjs [root]
 *
 * It checks that every skill has frontmatter with a `name` that matches its folder and a
 * `description` of at most 1024 characters, that a SKILL.md stays under 320 lines, that every
 * `references/<file>.md` a SKILL.md names exists and that no reference file is left unnamed, that
 * the four plugin manifests agree on name and version, and that no file contains an em-dash.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), "..");
const EM_DASH = String.fromCharCode(0x2014);
const MAX_SKILL_LINES = 320;
const MAX_DESCRIPTION = 1024;
const errors = [];
const fail = (message) => errors.push(message);

const read = (path) => readFileSync(join(root, path), "utf8");
const list = (dir) => (existsSync(join(root, dir)) ? readdirSync(join(root, dir)) : []);
const isDir = (path) => existsSync(join(root, path)) && statSync(join(root, path)).isDirectory();

function frontmatter(path, text) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!match) {
    fail(`${path}: no frontmatter`);
    return {};
  }
  const fields = {};
  for (const line of match[1].split("\n")) {
    const pair = /^([a-z-]+):\s*(.*)$/.exec(line);
    if (!pair) {
      fail(`${path}: unreadable frontmatter line "${line}"`);
      continue;
    }
    fields[pair[1]] = pair[2].startsWith('"') ? JSON.parse(pair[2]) : pair[2];
  }
  return fields;
}

const skillNames = list("skills").filter((name) => isDir(`skills/${name}`));
if (skillNames.length === 0) fail("skills/: no skills");

for (const name of skillNames) {
  const path = `skills/${name}/SKILL.md`;
  if (!existsSync(join(root, path))) {
    fail(`${path}: missing`);
    continue;
  }
  const text = read(path);
  const fields = frontmatter(path, text);
  if (fields.name !== name) fail(`${path}: name "${fields.name}" must equal the folder "${name}"`);
  if (!fields.description) fail(`${path}: no description`);
  else if (fields.description.length > MAX_DESCRIPTION) {
    fail(
      `${path}: description is ${fields.description.length} characters (max ${MAX_DESCRIPTION})`,
    );
  }
  for (const key of Object.keys(fields)) {
    if (key !== "name" && key !== "description")
      fail(`${path}: unexpected frontmatter key "${key}"`);
  }
  const lines = text.split("\n").length;
  if (lines > MAX_SKILL_LINES) fail(`${path}: ${lines} lines (max ${MAX_SKILL_LINES})`);

  const named = new Set(text.match(/references\/[\w.-]+\.md/g) ?? []);
  for (const reference of named) {
    if (!existsSync(join(root, "skills", name, reference)))
      fail(`${path}: names ${reference}, which does not exist`);
  }
  for (const file of list(`skills/${name}/references`)) {
    if (!named.has(`references/${file}`))
      fail(`skills/${name}/references/${file}: not named in SKILL.md`);
  }
}

const MANIFESTS = [
  ".claude-plugin/plugin.json",
  ".codex-plugin/plugin.json",
  ".cursor-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
];
const versions = new Map();
const names = new Set();
for (const path of MANIFESTS) {
  if (!existsSync(join(root, path))) {
    fail(`${path}: missing`);
    continue;
  }
  let manifest;
  try {
    manifest = JSON.parse(read(path));
  } catch (error) {
    fail(`${path}: not valid JSON (${error.message})`);
    continue;
  }
  const entry = path.endsWith("marketplace.json") ? manifest.plugins?.[0] : manifest;
  if (!entry?.name || !entry?.version) {
    fail(`${path}: needs a name and a version`);
    continue;
  }
  if (!/^\d+\.\d+\.\d+$/.test(entry.version))
    fail(`${path}: version "${entry.version}" is not x.y.z`);
  versions.set(path, entry.version);
  names.add(entry.name);
  if (entry.skills && !isDir(entry.skills.replace(/^\.\//, "").replace(/\/$/, ""))) {
    fail(`${path}: skills path ${entry.skills} does not exist`);
  }
}
if (new Set(versions.values()).size > 1) {
  fail(`manifest versions differ: ${[...versions].map(([path, v]) => `${path} ${v}`).join(", ")}`);
}
if (names.size > 1) fail(`manifest plugin names differ: ${[...names].join(", ")}`);

function* files(dir) {
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    const path = dir === "." ? entry.name : `${dir}/${entry.name}`;
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    if (entry.isDirectory()) yield* files(path);
    else yield path;
  }
}
for (const path of files(".")) {
  if (read(path).includes(EM_DASH)) fail(`${relative(".", path)}: contains an em-dash`);
}

if (errors.length > 0) {
  console.error(`${errors.length} problem(s):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(`ok: ${skillNames.length} skills, ${MANIFESTS.length} manifests`);
