import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "README.md",
  "LICENSE",
  "package.json",
  ".github/workflows/agentguard-evidence.yml",
  "docs/submission/devpost-submission-copy.md",
  "docs/submission/no-labs-submission-status.md",
  "docs/submission/local-validation-report.md",
  "docs/submission/demo-script.md",
  "docs/submission/demo-video-production-plan.md",
  "docs/submission/deck-outline.md",
  "docs/submission/AgentGuard-CI-deck.pptx",
  "docs/submission/live-agent-adapter-validation.md",
  ".github/workflows/splunk-companion-app.yml",
  "splunk-apps/agentguard_ci_for_splunk/default/app.conf",
  "splunk-apps/agentguard_ci_for_splunk/default/savedsearches.conf",
  "splunk-apps/agentguard_ci_for_splunk/default/alert_actions.conf",
  "uipath/test-cloud-matrix.md",
  "uipath/test-cloud-import.csv",
  "uipath/studio-web-runbook.md",
  "agentguard-runs/suite-summary.json",
  "agentguard-runs/suite-summary.md",
  "agentguard-runs/agent-adapters/agent-adapter-suite-summary.json",
  "agentguard-runs/agent-adapters/agent-adapter-suite-summary.md",
];

const requiredPackageScripts = [
  "test",
  "build",
  "agentguard:suite",
  "agentguard:agent-suite",
  "submission:check",
];

const checks = [];

function pass(name, detail = "") {
  checks.push({ name, status: "PASS", detail });
}

function fail(name, detail) {
  checks.push({ name, status: "FAIL", detail });
}

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

for (const file of requiredFiles) {
  if (existsSync(join(root, file))) {
    pass(`file:${file}`);
  } else {
    fail(`file:${file}`, "Required submission asset is missing.");
  }
}

const packageJson = readJson("package.json");
for (const script of requiredPackageScripts) {
  if (packageJson.scripts?.[script]) {
    pass(`script:${script}`, packageJson.scripts[script]);
  } else {
    fail(`script:${script}`, "Required package script is missing.");
  }
}

const readme = readFileSync(join(root, "README.md"), "utf8");
if (readme.includes("https://github.com/baiqidi/agentguard-ci")) {
  pass("readme:public-github-url");
} else {
  fail("readme:public-github-url", "README should expose the public GitHub URL for judges.");
}

const license = readFileSync(join(root, "LICENSE"), "utf8");
if (license.includes("MIT License")) {
  pass("license:mit");
} else {
  fail("license:mit", "Devpost requires MIT or Apache 2.0 visibility.");
}

if (existsSync(join(root, ".github/workflows/agentguard-evidence.yml"))) {
  const workflow = readFileSync(join(root, ".github/workflows/agentguard-evidence.yml"), "utf8");
  if (
    workflow.includes("actions/checkout@v4") &&
    workflow.includes("actions/setup-node@v4") &&
    workflow.includes("actions/upload-artifact@v4") &&
    workflow.includes("npm run submission:check")
  ) {
    pass("workflow:agentguard-evidence-stable");
  } else {
    fail("workflow:agentguard-evidence-stable", "Evidence workflow must use stable actions and run submission:check.");
  }
}

if (existsSync(join(root, "agentguard-runs/suite-summary.json"))) {
  const suiteSummary = readJson("agentguard-runs/suite-summary.json").summary;
  if (suiteSummary.totalScenarios === 24 && suiteSummary.risk?.criticalFindings === 5) {
    pass(
      "evidence:code-repair-suite",
      `${suiteSummary.totalScenarios} scenarios, ${suiteSummary.risk.blockedRiskPoints}/${suiteSummary.risk.totalRiskPoints} risk points blocked`,
    );
  } else {
    fail("evidence:code-repair-suite", "Unexpected code-repair suite summary values.");
  }
}

if (existsSync(join(root, "agentguard-runs/agent-adapters/agent-adapter-suite-summary.json"))) {
  const adapterSummary = readJson("agentguard-runs/agent-adapters/agent-adapter-suite-summary.json");
  if (
    adapterSummary.summary.totalScenarios === 14 &&
    adapterSummary.summary.liveAgentTypes === 12 &&
    adapterSummary.summary.splunkIntegratedScenarios === 3 &&
    adapterSummary.summary.reviewScenarios === 9 &&
    adapterSummary.summary.blockedScenarios === 5 &&
    adapterSummary.publicAgentInstallSummary.frameworks === 12 &&
    adapterSummary.publicAgentInstallSummary.deploymentValidatedChecks === 2
  ) {
    pass(
      "evidence:agent-adapter-suite",
      `${adapterSummary.summary.totalScenarios} live-local scenarios, ${adapterSummary.summary.reviewScenarios} review routes, ${adapterSummary.summary.blockedScenarios} hard blocks, ${adapterSummary.summary.splunkIntegratedScenarios} Splunk scenarios, ${adapterSummary.publicAgentInstallSummary.frameworks} public framework checks, ${adapterSummary.publicAgentInstallSummary.deploymentValidatedChecks} deployment-validated surfaces`,
    );
  } else {
    fail("evidence:agent-adapter-suite", "Unexpected agent adapter suite summary values.");
  }
}

const failures = checks.filter((check) => check.status === "FAIL");
for (const check of checks) {
  const suffix = check.detail ? ` - ${check.detail}` : "";
  console.log(`${check.status} ${check.name}${suffix}`);
}

if (failures.length > 0) {
  console.error(`\nSubmission readiness failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log(`\nSubmission readiness passed: ${checks.length} checks.`);
