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
const publicDemoVideo = "https://youtu.be/RQFx5FuB3nY";

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
    "?contest=developerweek",
    publicDemoVideo
  ]);
}

const publicVideoDocs = [
  "docs/hackathons/developerweek-new-york-pack.md",
  "docs/submission/developerweek-new-york-submission-copy.md",
  "docs/submission/developerweek-new-york-judge-readiness.md"
];

for (const file of publicVideoDocs) {
  if (existsSync(join(root, file))) {
    requireSignals(`public-video:${file}`, read(join(root, file)), [publicDemoVideo]);
  }
}

if (existsSync(join(root, "package.json"))) {
  const scripts = JSON.parse(read(join(root, "package.json"))).scripts ?? {};
  const missing = ["developerweek:prepare", "developerweek:check"].filter((scriptName) => !scripts[scriptName]);

  if (missing.length === 0) {
    pass("package:developerweek-scripts");
  } else {
    fail("package:developerweek-scripts", `Missing script(s): ${missing.join(", ")}`);
  }

  const missingVideo = [
    "video:prep:developerweek",
    "video:audio:prep:developerweek",
    "video:audio:developerweek",
    "video:record:developerweek",
    "video:check:developerweek"
  ].filter((scriptName) => !scripts[scriptName]);

  if (scripts["developerweek:prepare"]?.includes("video:prep:developerweek") && missingVideo.length === 0) {
    pass("package:developerweek-video-scripts");
  } else {
    fail(
      "package:developerweek-video-scripts",
      `DeveloperWeek video prep/audio/record/check scripts must be exposed and developerweek:prepare must regenerate video assets. Missing: ${
        missingVideo.join(", ") || "none"
      }`
    );
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

const videoDir = join(root, "agentguard-runs", "developerweek-demo-video");
const videoAssetFiles = [
  "shot-list.json",
  "voiceover-en.txt",
  "submission-checklist.md",
  "asset-manifest.json"
];
const missingVideoAssetFiles = videoAssetFiles.filter((file) => !existsSync(join(videoDir, file)));

if (missingVideoAssetFiles.length === 0) {
  const shotList = JSON.parse(read(join(videoDir, "shot-list.json")));
  const manifest = JSON.parse(read(join(videoDir, "asset-manifest.json")));
  const totalSeconds = shotList.reduce((sum, shot) => {
    const [start, end] = shot.time.split("-");
    const toSeconds = (value) => {
      const [minutes, seconds] = value.split(":").map(Number);
      return minutes * 60 + seconds;
    };
    return sum + toSeconds(end) - toSeconds(start);
  }, 0);
  const hasTerminalScene = shotList.some((shot) => shot.url === "terminal:npm run developerweek:check");
  const hasOnlyDeveloperWeekRoutes = shotList.every(
    (shot) =>
      shot.url === "terminal:npm run developerweek:check" ||
      (shot.url.includes("?contest=developerweek") && shot.url.includes("present=1"))
  );

  if (
    shotList.length === 6 &&
    totalSeconds === 117 &&
    hasTerminalScene &&
    hasOnlyDeveloperWeekRoutes &&
    manifest.publicDemoVideo === publicDemoVideo &&
    manifest.verifiedEvidence?.totalScenarios === 17 &&
    manifest.verifiedEvidence?.liveAgentTypes === 13
  ) {
    pass("video-prep:developerweek-assets", "6 scenes / 117s / terminal plus DeveloperWeek product routes");
  } else {
    fail(
      "video-prep:developerweek-assets",
      `Expected 6 scenes, 117 seconds, terminal proof, DeveloperWeek product routes, and manifest metrics. Scenes: ${shotList.length}; seconds: ${totalSeconds}; terminal: ${hasTerminalScene}; routes: ${hasOnlyDeveloperWeekRoutes}.`
    );
  }

  const voiceover = read(join(videoDir, "voiceover-en.txt"));
  const requiredPhrases = [
    "AI-agent release gate",
    "17 enterprise agent scenarios across 13 categories",
    "promote, review, or block",
    "machine-readable evidence"
  ];
  const forbiddenTokens = ["terminal:", "Screen note", "C:\\Users", "file://", "SANS", "Splunk"];
  const missingPhrases = requiredPhrases.filter((phrase) => !voiceover.includes(phrase));
  const redFlags = forbiddenTokens.filter((token) => voiceover.includes(token));

  if (missingPhrases.length === 0 && redFlags.length === 0) {
    pass("video-prep:developerweek-narration");
  } else {
    fail(
      "video-prep:developerweek-narration",
      `Missing phrase(s): ${missingPhrases.join(", ") || "none"}. Red flags: ${redFlags.join(", ") || "none"}.`
    );
  }
} else {
  fail("video-prep:developerweek-assets", `Missing video prep file(s): ${missingVideoAssetFiles.join(", ")}`);
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
