import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const checks = [];

function pass(name, detail = "") {
  checks.push({ status: "PASS", name, detail });
}

function fail(name, detail) {
  checks.push({ status: "FAIL", name, detail });
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const requiredFiles = [
  "README.md",
  "LICENSE",
  "architecture_diagram.md",
  "docs/hackathons/splunk-agentic-ops-pack.md",
  "docs/submission/splunk-submission-copy.md",
  "docs/submission/splunk-significant-updates.md",
  "docs/submission/splunk-judge-readiness.md",
  "docs/submission/splunk-demo-script.md",
  "docs/submission/splunk-demo-video-plan.md",
  "docs/submission/AgentGuard-CI-Splunk-Demo.mp4",
  ".github/workflows/splunk-companion-app.yml",
  "splunk-apps/agentguard_ci_for_splunk/default/app.conf",
  "splunk-apps/agentguard_ci_for_splunk/default/savedsearches.conf",
  "splunk-apps/agentguard_ci_for_splunk/default/alert_actions.conf",
  "scripts/prepare-splunk-demo-video.mjs",
  "scripts/record-splunk-demo-video.mjs",
  "agentguard-runs/splunk-demo-video/shot-list.json",
  "agentguard-runs/splunk-demo-video/asset-manifest.json",
  "agentguard-runs/splunk-demo-video/voiceover-en.txt",
  "agentguard-runs/splunk-app/install-smoke-report.json",
  "agentguard-runs/suite-summary.json",
  "agentguard-runs/agent-adapters/agent-adapter-suite-summary.json"
];

for (const file of requiredFiles) {
  if (existsSync(join(root, file))) {
    pass(`file:${file}`);
  } else {
    fail(`file:${file}`, "Required Splunk submission artifact is missing.");
  }
}

if (existsSync(join(root, "README.md"))) {
  const readme = read("README.md");
  if (readme.includes("Splunk") && readme.includes("?contest=splunk")) {
    pass("readme:splunk-wrapper");
  } else {
    fail("readme:splunk-wrapper", "README must mention Splunk mode and ?contest=splunk.");
  }
}

if (existsSync(join(root, "package.json"))) {
  const packageJson = JSON.parse(read("package.json"));
  const scripts = packageJson.scripts ?? {};
  if (
    scripts["video:prep:splunk"] &&
    scripts["video:audio:prep:splunk"] &&
    scripts["video:audio:splunk"] &&
    scripts["video:record:splunk"] &&
    scripts["video:check:splunk"] &&
    scripts["splunk:prepare"]?.includes("agentguard:suite") &&
    scripts["splunk:check"]?.includes("verify-splunk-submission")
  ) {
    pass("package:splunk-video-scripts");
  } else {
    fail(
      "package:splunk-video-scripts",
      "package.json must expose Splunk video/audio/check scripts plus self-generating splunk:prepare and splunk:check gates."
    );
  }
}

if (existsSync(join(root, "architecture_diagram.md"))) {
  const architecture = read("architecture_diagram.md");
  if (architecture.includes("Splunk MCP Server") && architecture.includes("flowchart")) {
    pass("architecture:splunk-mcp-flow");
  } else {
    fail("architecture:splunk-mcp-flow", "architecture_diagram.md must show a Splunk MCP flow.");
  }
}

if (existsSync(join(root, "docs/submission/splunk-submission-copy.md"))) {
  const submissionCopy = read("docs/submission/splunk-submission-copy.md");
  if (
    submissionCopy.includes("Splunk MCP Server") &&
    submissionCopy.includes("3 minutes") &&
    submissionCopy.includes("Security") &&
    submissionCopy.includes("Best Use of Splunk MCP Server")
  ) {
    pass("submission-copy:mcp-and-video");
  } else {
    fail(
      "submission-copy:mcp-and-video",
      "Splunk submission copy must mention Security, Best Use of Splunk MCP Server, and the 3-minute demo limit."
    );
  }
}

if (existsSync(join(root, "docs/submission/splunk-judge-readiness.md"))) {
  const readiness = read("docs/submission/splunk-judge-readiness.md");
  const requiredReadinessSignals = [
    "Technological Implementation",
    "Design",
    "Potential Impact",
    "Quality of the Idea",
    "architecture_diagram.md",
    "install-smoke-report.json",
    "under three minutes",
    "May 18, 2026",
    "npm run splunk:check"
  ];
  const missingSignals = requiredReadinessSignals.filter((signal) => !readiness.includes(signal));

  if (missingSignals.length === 0) {
    pass("judge-readiness:rules-map");
  } else {
    fail("judge-readiness:rules-map", `Missing readiness signal(s): ${missingSignals.join(", ")}`);
  }
}

if (existsSync(join(root, "docs/submission/splunk-demo-video-plan.md"))) {
  const videoPlan = read("docs/submission/splunk-demo-video-plan.md");
  const publicVideoUrl =
    "https://github.com/baiqidi/agentguard-ci/raw/main/docs/submission/AgentGuard-CI-Splunk-Demo.mp4";
  const requiredRoutes = [
    "page=overview&present=1",
    "page=scenarios&soc=security-soc-alert-suppression&present=1",
    "page=companion&delivery=install-smoke-report&present=1",
    "page=evidence&filter=danger&scenario=unsafe-diff-guard&present=1"
  ];
  const missingRoutes = requiredRoutes.filter((route) => !videoPlan.includes(route));

  if (
    videoPlan.includes("under 3 minutes") &&
    videoPlan.includes("2:35-2:55") &&
    videoPlan.includes("install-smoke-report.json") &&
    videoPlan.includes(publicVideoUrl) &&
    missingRoutes.length === 0
  ) {
    pass("video-plan:three-minute-route");
  } else {
    fail(
      "video-plan:three-minute-route",
      `Video plan must stay under 3 minutes and include all presentation deep links. Missing: ${
        missingRoutes.join(", ") || "none"
      }`
    );
  }
}

if (existsSync(join(root, "docs/submission/AgentGuard-CI-Splunk-Demo.mp4"))) {
  const videoBytes = statSync(join(root, "docs/submission/AgentGuard-CI-Splunk-Demo.mp4")).size;
  if (videoBytes > 1_000_000) {
    pass("public-video:committed-mp4", `${videoBytes} bytes`);
  } else {
    fail("public-video:committed-mp4", `Committed demo video is unexpectedly small: ${videoBytes} bytes.`);
  }
}

if (existsSync(join(root, "agentguard-runs/splunk-demo-video/shot-list.json"))) {
  const shotList = JSON.parse(read("agentguard-runs/splunk-demo-video/shot-list.json"));
  const totalSeconds = shotList.reduce((sum, shot) => {
    const [start, end] = shot.time.split("-");
    const toSeconds = (value) => {
      const [minutes, seconds] = value.split(":").map(Number);
      return minutes * 60 + seconds;
    };

    return sum + (toSeconds(end) - toSeconds(start));
  }, 0);
  const onlyProductRoutes = shotList.every((shot) => shot.url.includes("?contest=splunk") && !shot.url.includes("file:"));

  if (shotList.length === 7 && totalSeconds <= 180 && onlyProductRoutes) {
    pass("video-prep:shot-list", `${shotList.length} scenes / ${totalSeconds}s / product routes only`);
  } else {
    fail(
      "video-prep:shot-list",
      "Prepared Splunk shot list must contain 7 product-route scenes and stay under 180 seconds."
    );
  }
}

if (
  existsSync(join(root, "agentguard-runs/splunk-demo-video/voiceover-en.txt")) &&
  existsSync(join(root, "agentguard-runs/splunk-demo-video/asset-manifest.json")) &&
  existsSync(join(root, "agentguard-runs/suite-summary.json")) &&
  existsSync(join(root, "agentguard-runs/agent-adapters/agent-adapter-suite-summary.json"))
) {
  const voiceover = read("agentguard-runs/splunk-demo-video/voiceover-en.txt");
  const manifest = JSON.parse(read("agentguard-runs/splunk-demo-video/asset-manifest.json"));
  const suite = JSON.parse(read("agentguard-runs/suite-summary.json")).summary;
  const reviewRequiredScenarios =
    suite.reviewRequiredScenarios ??
    suite.failedScenarios ??
    Math.max(0, suite.totalScenarios - suite.passedScenarios);
  const generatedText = `${voiceover}\n${JSON.stringify(manifest)}`;
  const redFlags = ["undefined", "NaN", "file://", "[object Object]"].filter((flag) => generatedText.includes(flag));
  const requiredPhrases = [
    `${suite.passedScenarios} of ${suite.totalScenarios}`,
    `${reviewRequiredScenarios} need review`,
    `${suite.risk.blockedRiskPoints} of ${suite.risk.totalRiskPoints}`
  ];
  const missingPhrases = requiredPhrases.filter((phrase) => !voiceover.includes(phrase));
  const manifestReviewCount = manifest.verifiedEvidence?.codeRepairReviews;
  const adapters = JSON.parse(read("agentguard-runs/agent-adapters/agent-adapter-suite-summary.json")).summary;
  const adapterDecisionPhrase = `${adapters.reviewScenarios} review routes and ${adapters.blockedScenarios} hard blocks`;

  if (
    redFlags.length === 0 &&
    missingPhrases.length === 0 &&
    voiceover.includes(adapterDecisionPhrase) &&
    manifestReviewCount === reviewRequiredScenarios
  ) {
    pass("video-prep:narration-and-manifest", "voiceover and manifest metrics are concrete");
  } else {
    fail(
      "video-prep:narration-and-manifest",
      `Generated video assets contain issue(s). Red flags: ${redFlags.join(", ") || "none"}. Missing phrases: ${
        missingPhrases.join(", ") || "none"
      }. Adapter decision phrase present: ${voiceover.includes(adapterDecisionPhrase)}. Manifest reviews: ${manifestReviewCount}.`
    );
  }
}

if (existsSync(join(root, "docs/submission/splunk-significant-updates.md"))) {
  const updates = read("docs/submission/splunk-significant-updates.md");
  if (updates.includes("May 18, 2026") && updates.includes("significantly updated")) {
    pass("significant-updates:submission-period");
  } else {
    fail(
      "significant-updates:submission-period",
      "Significant updates note must explain post-May-18 work for the Splunk submission."
    );
  }
}

if (existsSync(join(root, ".github/workflows/splunk-companion-app.yml"))) {
  const workflow = read(".github/workflows/splunk-companion-app.yml");
  if (
    workflow.includes("actions/checkout@v4") &&
    workflow.includes("actions/setup-node@v4") &&
    workflow.includes("actions/setup-python@v5") &&
    workflow.includes("actions/upload-artifact@v4") &&
    workflow.includes('python-version: "3.9"') &&
    workflow.includes("splunk-appinspect") &&
    workflow.includes("splunk-packaging-toolkit") &&
    workflow.includes("--output-dir agentguard-runs/splunk-official") &&
    !workflow.includes("--output-directory") &&
    workflow.includes("agentguard-runs/splunk-official/*.tar.gz")
  ) {
    pass("workflow:splunk-companion-app");
  } else {
    fail(
      "workflow:splunk-companion-app",
      "Splunk companion workflow must use stable GitHub Actions, pin Python 3.9 for Splunk Packaging Toolkit 1.0.1, install Splunk tools, package with SLIM --output-dir, and AppInspect the official .tar.gz output."
    );
  }
}

if (existsSync(join(root, "agentguard-runs/splunk-app/install-smoke-report.json"))) {
  const installReport = JSON.parse(read("agentguard-runs/splunk-app/install-smoke-report.json"));
  if (
    installReport.appId === "agentguard_ci_for_splunk" &&
    installReport.missingFiles?.length === 0 &&
    installReport.savedSearchCount >= 4 &&
    installReport.alertActionCommand === "agentguard_review_gate.py" &&
    installReport.payloadFormat === "json"
  ) {
    pass("splunk-install:smoke-report", "Clean package extraction and app structure verified");
  } else {
    fail("splunk-install:smoke-report", "Install smoke report must prove app id, files, searches, and alert action.");
  }
}

if (existsSync(join(root, "agentguard-runs/suite-summary.json"))) {
  const suite = JSON.parse(read("agentguard-runs/suite-summary.json"));
  if (suite.summary?.totalScenarios === 24 && suite.summary?.totalGates === 120) {
    pass("suite-summary:live-coverage", "24 command-backed scenarios / 120 gates");
  } else {
    fail("suite-summary:live-coverage", "Expected 24 command-backed scenarios and 120 gates.");
  }
}

if (existsSync(join(root, "agentguard-runs/agent-adapters/agent-adapter-suite-summary.json"))) {
  const adapters = JSON.parse(read("agentguard-runs/agent-adapters/agent-adapter-suite-summary.json"));
  if (
    adapters.summary?.totalScenarios >= 17 &&
    adapters.summary?.liveAgentTypes >= 13 &&
    adapters.summary?.splunkIntegratedScenarios === 3 &&
    adapters.summary?.reviewScenarios === 9 &&
    adapters.summary?.blockedScenarios >= 6 &&
    adapters.publicAgentInstallSummary?.frameworks === 12
  ) {
    pass(
      "adapter-summary:breadth",
      `${adapters.summary.totalScenarios} live-local scenarios / ${adapters.summary.reviewScenarios} review routes / ${adapters.summary.blockedScenarios} hard blocks / ${adapters.summary.liveAgentTypes} agent types / 3 Splunk-integrated scenarios / 12 public framework checks`
    );
  } else {
    fail(
      "adapter-summary:breadth",
      "Expected at least 17 live-local scenarios, 9 review routes, at least 6 hard blocks, at least 13 agent types, 3 Splunk-integrated scenarios, and 12 framework checks."
    );
  }
}

const failures = checks.filter((check) => check.status === "FAIL");
for (const check of checks) {
  const suffix = check.detail ? ` - ${check.detail}` : "";
  console.log(`${check.status} ${check.name}${suffix}`);
}

if (failures.length > 0) {
  console.error(`\nSplunk submission check failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log(`\nSplunk submission check passed: ${checks.length} checks.`);
