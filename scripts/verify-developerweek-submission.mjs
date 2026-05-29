import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const checks = [];

function readArg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function pass(name, detail = "") {
  checks.push({ status: "PASS", name, detail });
}

function fail(name, detail) {
  checks.push({ status: "FAIL", name, detail });
}

function read(path) {
  return readFileSync(path, "utf8");
}

function requireFile(path, name = path) {
  if (!existsSync(path)) {
    fail(`file:${name}`, "Required file is missing.");
    return;
  }

  const size = statSync(path).size;
  if (size > 0) {
    pass(`file:${name}`, `${size} bytes`);
  } else {
    fail(`file:${name}`, "File exists but is empty.");
  }
}

function requireSignals(label, content, signals) {
  const missing = signals.filter((signal) => !content.includes(signal));

  if (missing.length === 0) {
    pass(label);
  } else {
    fail(label, `Missing signal(s): ${missing.join(", ")}`);
  }
}

const outputDir = resolve(readArg("--output-dir", join(root, "agentguard-runs", "developerweek-agent-adapters")));

const requiredDocs = [
  "README.md",
  ".github/workflows/developerweek-ci-gate.yml",
  "docs/hackathons/developerweek-new-york-pack.md",
  "docs/submission/developerweek-new-york-submission-copy.md",
  "docs/submission/developerweek-new-york-judge-readiness.md"
];

for (const file of requiredDocs) {
  requireFile(join(root, file), file);
}

requireFile(join(outputDir, "agent-adapter-suite-summary.md"), "agent-adapter-suite-summary.md");
requireFile(join(outputDir, "agent-adapter-suite-summary.json"), "agent-adapter-suite-summary.json");
requireFile(
  join(outputDir, "browser-payment-approval", "developerweek-ci-evidence.json"),
  "browser-payment-approval/developerweek-ci-evidence.json"
);

if (existsSync(join(root, "README.md"))) {
  const readme = read(join(root, "README.md"));
  requireSignals("readme:developerweek", readme, [
    "DeveloperWeek New York 2026 Judge Quick Start",
    "npm run developerweek:check",
    "codex/developerweek-ny",
    "?contest=developerweek"
  ]);
}

if (existsSync(join(root, "package.json"))) {
  const scripts = JSON.parse(read(join(root, "package.json"))).scripts ?? {};
  const missing = ["developerweek:prepare", "developerweek:check"].filter((scriptName) => !scripts[scriptName]);

  if (missing.length === 0) {
    pass("package:developerweek-scripts");
  } else {
    fail("package:developerweek-scripts", `Missing script(s): ${missing.join(", ")}`);
  }
}

if (existsSync(join(root, ".github/workflows/developerweek-ci-gate.yml"))) {
  const workflow = read(join(root, ".github/workflows/developerweek-ci-gate.yml"));
  requireSignals("workflow:developerweek-ci-gate", workflow, [
    "actions/checkout@v4",
    "actions/setup-node@v4",
    "node-version: 24",
    "npm ci",
    "npm run developerweek:check",
    "actions/upload-artifact@v4",
    "developerweek-agentguard-evidence"
  ]);
}

if (existsSync(join(outputDir, "agent-adapter-suite-summary.md"))) {
  const summary = read(join(outputDir, "agent-adapter-suite-summary.md"));
  requireSignals("summary:developerweek-readiness", summary, [
    "## DeveloperWeek CI Readiness",
    "Verdict: **READY FOR CI GATING**",
    "Command: `npm run developerweek:check`",
    "17 scenarios across 13 agent categories",
    "2 promote / 9 review / 6 block"
  ]);
}

if (existsSync(join(outputDir, "agent-adapter-suite-summary.json"))) {
  const summary = JSON.parse(read(join(outputDir, "agent-adapter-suite-summary.json")));

  if (
    summary.developerWeekReadiness?.verdict === "ready-for-ci-gating" &&
    summary.developerWeekReadiness?.coverage?.totalScenarios === 17 &&
    summary.developerWeekReadiness?.coverage?.agentCategories === 13
  ) {
    pass("json:developerweek-readiness");
  } else {
    fail("json:developerweek-readiness", "DeveloperWeek readiness verdict or coverage is missing.");
  }
}

if (existsSync(join(outputDir, "browser-payment-approval", "developerweek-ci-evidence.json"))) {
  const evidence = JSON.parse(read(join(outputDir, "browser-payment-approval", "developerweek-ci-evidence.json")));

  if (
    evidence.targetPlatform === "DeveloperWeek NY Agent CI Gate" &&
    evidence.method?.promotionRule?.includes("All five universal gates") &&
    evidence.attachments?.includes("developerweek-ci-evidence.json")
  ) {
    pass("evidence:developerweek-target");
  } else {
    fail("evidence:developerweek-target", "DeveloperWeek evidence target or promotion rule is missing.");
  }
}

const failures = checks.filter((check) => check.status === "FAIL");
for (const check of checks) {
  const suffix = check.detail ? ` - ${check.detail}` : "";
  console.log(`${check.status} ${check.name}${suffix}`);
}

if (failures.length > 0) {
  console.error(`\nDeveloperWeek submission check failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log(`\nDeveloperWeek submission check passed: ${checks.length} checks.`);
