import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const outDir = join(root, "agentguard-runs", "splunk-demo-video");

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), "utf8"));
}

function requireFile(relativePath) {
  const absolutePath = join(root, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing required Splunk demo asset: ${relativePath}`);
  }

  return absolutePath;
}

const requiredAssets = [
  "agentguard-runs/suite-summary.json",
  "agentguard-runs/agent-adapters/agent-adapter-suite-summary.json",
  "agentguard-runs/splunk-app/agentguard_ci_for_splunk.tgz",
  "agentguard-runs/splunk-app/agentguard-review-envelope.json",
  "agentguard-runs/splunk-app/install-smoke-report.json",
  "architecture_diagram.md",
  "docs/submission/splunk-demo-script.md",
  "docs/submission/splunk-demo-video-plan.md",
  "docs/submission/splunk-judge-readiness.md",
  "docs/submission/splunk-submission-copy.md",
  "splunk-apps/agentguard_ci_for_splunk/default/savedsearches.conf",
  "splunk-apps/agentguard_ci_for_splunk/default/alert_actions.conf",
  "splunk-apps/agentguard_ci_for_splunk/bin/agentguard_review_gate.py"
];

mkdirSync(outDir, { recursive: true });
for (const asset of requiredAssets) {
  requireFile(asset);
}

const suite = readJson("agentguard-runs/suite-summary.json").summary;
const adapters = readJson("agentguard-runs/agent-adapters/agent-adapter-suite-summary.json").summary;
const reviewRequiredScenarios =
  suite.reviewRequiredScenarios ??
  suite.failedScenarios ??
  Math.max(0, suite.totalScenarios - suite.passedScenarios);

const baseUrl = process.env.AGENTGUARD_SPLUNK_DEMO_URL ?? "http://localhost:5190";
const route = (query) => `${baseUrl}/?contest=splunk&lang=en&present=1&${query}`;

const shotList = [
  {
    time: "0:00-0:20",
    name: "Opening problem",
    url: route("page=overview"),
    focus: ".decision-hero",
    narration:
      "Most AI security demos prove that an agent can investigate faster. AgentGuard for Splunk SOC answers the next question: is that agent safe enough to act. Before a copilot suppresses an alert, changes containment state, or drafts a case note, AgentGuard turns the action into a gated release decision."
  },
  {
    time: "0:20-0:42",
    name: "Command-backed decision",
    url: route("page=overview"),
    focus: ".proof-signal-panel",
    narration:
      `The current evidence says ${suite.passedScenarios} of ${suite.totalScenarios} repository scenarios can promote. ${reviewRequiredScenarios} need review, and ${suite.risk.blockedRiskPoints} of ${suite.risk.totalRiskPoints} risk points are stopped before promotion. The point is not a prettier dashboard. The point is a repeatable decision record with gate results, owners, and evidence that a security team can audit later.`
  },
  {
    time: "0:42-1:12",
    name: "SOC mission desk",
    url: route("page=scenarios&soc=security-soc-alert-suppression"),
    focus: ".splunk-mission-desk",
    narration:
      "The SOC mission desk follows one high-risk route at a time. Here the route is alert suppression. The agent may investigate repeated phishing alerts, but it cannot tune away the signal until the alert sample, suppression rationale, and security reviewer approval are present. The page shows the owner, validation command, linked tools, and the approval gate in one place."
  },
  {
    time: "1:12-1:42",
    name: "Splunk tool surfaces",
    url: route("page=scenarios&soc=security-soc-alert-suppression"),
    focus: ".splunk-surface-grid",
    narration:
      "The Splunk surface is concrete. AgentGuard models MCP search, knowledge object inspection, AI-generated SPL, SPL explanation, SPL optimization, and reviewer-visible evidence. That matters because generated SPL should not be an invisible assistant step. It should be an artifact analysts can replay, challenge, and attach to the case before a high-risk recommendation is trusted."
  },
  {
    time: "1:42-2:10",
    name: "Companion app delivery",
    url: route("page=companion&delivery=install-smoke-report"),
    focus: ".splunk-delivery-desk",
    narration:
      "The companion app turns the idea into installable Splunk assets. It includes saved searches, a dashboard, a custom alert action, and a clean-install smoke report. The smoke report proves the packaged app extracts with no missing files, four saved searches, and JSON alert-action payload delivery. So this is not a screenshot pretending to be a product."
  },
  {
    time: "2:10-2:38",
    name: "Blocked evidence case",
    url: route("page=evidence&filter=danger&scenario=unsafe-diff-guard"),
    focus: ".review-desk-panel",
    narration:
      "The evidence desk opens directly on a blocked case. Instead of saying only pass or fail, it shows the owner, failed gates, evidence standard, and why the system refuses promotion. This is the handoff a real reviewer needs: what happened, which rule fired, what evidence is missing, and what must be approved before the agent can continue."
  },
  {
    time: "2:38-2:55",
    name: "Closing value",
    url: route("page=evidence&filter=danger&scenario=unsafe-diff-guard"),
    focus: ".assurance-panel",
    narration:
      `The broader adapter suite covers ${adapters.totalScenarios} live-local scenarios, including ${adapters.reviewScenarios} review routes and ${adapters.blockedScenarios} hard blocks across ${adapters.liveAgentTypes} agent categories. That is the larger value: AgentGuard is not another SOC copilot. It is the release gate that decides when copilots are safe enough to promote, when humans must review, and when automation must stop.`
  }
];

const narration = shotList.map((shot) => shot.narration).join("\n\n");
const manifest = {
  generatedAt: new Date().toISOString(),
  outputDir: resolve(outDir),
  baseUrl,
  targetDuration: "2:55",
  publicRepository: "https://github.com/baiqidi/agentguard-ci-splunk",
  verifiedEvidence: {
    codeRepairScenarios: suite.totalScenarios,
    codeRepairPromotions: suite.passedScenarios,
    codeRepairReviews: reviewRequiredScenarios,
    blockedRiskPoints: suite.risk.blockedRiskPoints,
    totalRiskPoints: suite.risk.totalRiskPoints,
    adapterScenarios: adapters.totalScenarios,
    splunkIntegratedScenarios: adapters.splunkIntegratedScenarios,
    liveAgentTypes: adapters.liveAgentTypes
  },
  requiredAssets: requiredAssets.map((asset) => ({ path: asset, absolutePath: resolve(root, asset) })),
  futureRecordCommand: "npm run video:record:splunk",
  note: "Preparation only. This command does not start screen recording."
};

writeFileSync(join(outDir, "shot-list.json"), `${JSON.stringify(shotList, null, 2)}\n`);
writeFileSync(join(outDir, "voiceover-en.txt"), `${narration}\n`);
writeFileSync(join(outDir, "asset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log("Splunk demo video preparation complete.");
console.log(`Prepared assets: ${outDir}`);
console.log("No recording was started.");
