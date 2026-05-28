import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const checks = [];

function readArg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
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
  if (existsSync(path)) {
    const size = statSync(path).size;
    if (size > 0) {
      pass(`file:${name}`, `${size} bytes`);
    } else {
      fail(`file:${name}`, "File exists but is empty.");
    }
  } else {
    fail(`file:${name}`, "Required file is missing.");
  }
}

const outputDir = resolve(readArg("--output-dir", join(root, "agentguard-runs", "sans-find-evil")));
const skipDocs = hasFlag("--skip-docs");

const runtimeFiles = [
  "agent-execution-log.jsonl",
  "accuracy-report.json",
  "sift-readiness.json",
  "evidence-dataset.md",
  "investigative-narrative.md"
];

for (const file of runtimeFiles) {
  requireFile(join(outputDir, file), file);
}

if (existsSync(join(outputDir, "agent-execution-log.jsonl"))) {
  const log = read(join(outputDir, "agent-execution-log.jsonl"));
  const requiredLogSignals = [
    '"event":"sift_preflight"',
    '"tool":"fls"',
    '"tool":"rip.pl"',
    '"tool":"grep"',
    '"event":"self_correction"',
    "tokenUsage"
  ];
  const missing = requiredLogSignals.filter((signal) => !log.includes(signal));

  if (missing.length === 0) {
    pass("runtime:execution-log", "terminal-style tool calls and self-correction present");
  } else {
    fail("runtime:execution-log", `Missing log signal(s): ${missing.join(", ")}`);
  }
}

if (existsSync(join(outputDir, "accuracy-report.json"))) {
  const report = JSON.parse(read(join(outputDir, "accuracy-report.json")));
  const findings = report.findings ?? [];
  const hasConfirmed = findings.some((finding) => finding.status === "confirmed" && finding.locator && finding.artifact);
  const hasRejected = findings.some((finding) => finding.status === "rejected" && finding.locator && finding.artifact);
  const hasInferred = findings.some((finding) => finding.status === "inferred" && finding.locator && finding.artifact);

  if (report.summary?.selfCorrections >= 1 && hasConfirmed && hasRejected && hasInferred) {
    pass("accuracy:traceability", `${findings.length} findings with confirmed/rejected/inferred statuses`);
  } else {
    fail(
      "accuracy:traceability",
      "Accuracy report must include self-correction plus confirmed, rejected, and inferred artifact-located findings."
    );
  }
}

if (existsSync(join(outputDir, "sift-readiness.json"))) {
  const readiness = JSON.parse(read(join(outputDir, "sift-readiness.json")));
  const toolNames = (readiness.toolMatrix ?? []).map((tool) => tool.name);
  const requiredTools = ["fls", "mactime", "rip.pl", "tshark"];
  const missingToolRows = requiredTools.filter((tool) => !toolNames.includes(tool));
  const hasInstallCommand = readiness.protocolSift?.installCommand?.includes("protocol-sift/main/install.sh");

  if (
    readiness.architecturalPattern === "Direct Agent Extension" &&
    readiness.protocol === "Protocol SIFT MCP" &&
    readiness.fixtureFallback === true &&
    readiness.readiness?.canRunFixture === true &&
    hasInstallCommand &&
    missingToolRows.length === 0
  ) {
    pass("readiness:sift-preflight", `${readiness.executionMode} with ${toolNames.length} tool rows`);
  } else {
    fail(
      "readiness:sift-preflight",
      `Missing SIFT readiness signal(s): ${[
        readiness.architecturalPattern === "Direct Agent Extension" ? "" : "Direct Agent Extension",
        readiness.protocol === "Protocol SIFT MCP" ? "" : "Protocol SIFT MCP",
        readiness.fixtureFallback === true ? "" : "fixtureFallback",
        readiness.readiness?.canRunFixture === true ? "" : "canRunFixture",
        hasInstallCommand ? "" : "install command",
        ...missingToolRows
      ]
        .filter(Boolean)
        .join(", ")}`
    );
  }
}

if (existsSync(join(outputDir, "evidence-dataset.md"))) {
  const dataset = read(join(outputDir, "evidence-dataset.md"));
  const requiredDatasetSignals = [
    "timeline.body",
    "registry-run-key.txt",
    "auth.log",
    "pcap-flow-index.json",
    "Execution mode",
    "Protocol SIFT install command",
    "sift-readiness.json"
  ];
  const missing = requiredDatasetSignals.filter((signal) => !dataset.includes(signal));

  if (missing.length === 0) {
    pass("dataset:documentation", "fixture evidence sources are documented");
  } else {
    fail("dataset:documentation", `Missing dataset signal(s): ${missing.join(", ")}`);
  }
}

if (!skipDocs) {
  const requiredDocs = [
    "README.md",
    "LICENSE",
    "architecture_diagram_sans.md",
    "docs/hackathons/sans-find-evil-pack.md",
    "docs/submission/sans-devpost-field-guide.md",
    "docs/submission/sans-find-evil-submission-copy.md",
    "docs/submission/sans-find-evil-judge-readiness.md",
    "sans-fixtures/case-001/README.md",
    "sans-fixtures/case-001/auth.log",
    "scripts/prepare-sans-demo-audio.mjs",
    "scripts/record-sans-demo-video.mjs",
    "scripts/verify-sans-demo-video.mjs",
    ".github/workflows/sans-find-evil.yml"
  ];

  for (const file of requiredDocs) {
    requireFile(join(root, file), file);
  }

  if (existsSync(join(root, "README.md"))) {
    const readme = read(join(root, "README.md"));
    const requiredReadmeSignals = ["FIND EVIL", "SANS SIFT", "?contest=sans", "npm run sans:check"];
    const missing = requiredReadmeSignals.filter((signal) => !readme.includes(signal));

    if (missing.length === 0) {
      pass("readme:sans-instructions");
    } else {
      fail("readme:sans-instructions", `Missing README signal(s): ${missing.join(", ")}`);
    }
  }

  if (existsSync(join(root, "package.json"))) {
    const scripts = JSON.parse(read(join(root, "package.json"))).scripts ?? {};

    const requiredScripts = [
      "sans:prepare",
      "sans:check",
      "video:prep:sans",
      "video:audio:prep:sans",
      "video:audio:sans",
      "video:record:sans",
      "video:check:sans"
    ];
    const missingScripts = requiredScripts.filter((scriptName) => !scripts[scriptName]);

    if (missingScripts.length === 0) {
      pass("package:sans-scripts", `${requiredScripts.length} SANS commands`);
    } else {
      fail("package:sans-scripts", `package.json is missing SANS script(s): ${missingScripts.join(", ")}`);
    }
  }

  if (existsSync(join(root, "architecture_diagram_sans.md"))) {
    const architecture = read(join(root, "architecture_diagram_sans.md"));
    const requiredArchitectureSignals = ["SANS SIFT Workstation", "Protocol SIFT", "MCP", "Evidence sources"];
    const missing = requiredArchitectureSignals.filter((signal) => !architecture.includes(signal));

    if (missing.length === 0) {
      pass("architecture:sans-flow");
    } else {
      fail("architecture:sans-flow", `Missing architecture signal(s): ${missing.join(", ")}`);
    }
  }

  if (existsSync(join(root, ".github/workflows/sans-find-evil.yml"))) {
    const workflow = read(join(root, ".github/workflows/sans-find-evil.yml"));
    const requiredWorkflowSignals = [
      "actions/checkout@v4",
      "actions/setup-node@v4",
      "node-version: 24",
      "npm ci",
      "npm run build",
      "Run SANS local fixture runner",
      "Run SANS adapter suite",
      "npm run video:prep:sans",
      "node scripts/verify-sans-find-evil-submission.mjs",
      "actions/upload-artifact@v4",
      "sans-find-evil-evidence"
    ];
    const missing = requiredWorkflowSignals.filter((signal) => !workflow.includes(signal));

    if (missing.length === 0) {
      pass("workflow:sans-find-evil", "CI runs sans:check and uploads judge evidence");
    } else {
      fail("workflow:sans-find-evil", `Missing workflow signal(s): ${missing.join(", ")}`);
    }
  }
}

const failures = checks.filter((check) => check.status === "FAIL");
for (const check of checks) {
  const suffix = check.detail ? ` - ${check.detail}` : "";
  console.log(`${check.status} ${check.name}${suffix}`);
}

if (failures.length > 0) {
  console.error(`\nSANS FIND EVIL submission check failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log(`\nSANS FIND EVIL submission check passed: ${checks.length} checks.`);
