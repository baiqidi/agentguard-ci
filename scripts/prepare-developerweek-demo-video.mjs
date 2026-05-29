import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const outDir = join(root, "agentguard-runs", "developerweek-demo-video");
const adapterDir = join(root, "agentguard-runs", "developerweek-agent-adapters");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function requireFile(path, label = path) {
  if (!existsSync(path)) {
    throw new Error(`Missing required DeveloperWeek demo asset: ${label}`);
  }

  return path;
}

const requiredAssets = [
  "README.md",
  ".github/workflows/developerweek-ci-gate.yml",
  "docs/hackathons/developerweek-new-york-pack.md",
  "docs/submission/developerweek-new-york-submission-copy.md",
  "docs/submission/developerweek-new-york-judge-readiness.md",
  "agentguard-runs/developerweek-agent-adapters/agent-adapter-suite-summary.md",
  "agentguard-runs/developerweek-agent-adapters/agent-adapter-suite-summary.json",
  "agentguard-runs/developerweek-agent-adapters/browser-payment-approval/developerweek-ci-evidence.json"
];

mkdirSync(outDir, { recursive: true });
for (const asset of requiredAssets) {
  requireFile(join(root, asset), asset);
}

const summary = readJson(join(adapterDir, "agent-adapter-suite-summary.json"));
const coverage = summary.developerWeekReadiness?.coverage ?? summary.summary;
const readiness = summary.developerWeekReadiness;
const evidence = readJson(join(adapterDir, "browser-payment-approval", "developerweek-ci-evidence.json"));

const totalScenarios = coverage.totalScenarios ?? summary.summary.totalScenarios;
const liveAgentTypes = coverage.agentCategories ?? summary.summary.liveAgentTypes;
const promoted = coverage.promoted ?? summary.summary.promotedScenarios;
const review = coverage.review ?? summary.summary.reviewScenarios;
const blocked = coverage.blocked ?? summary.summary.blockedScenarios;
const riskPrevented = readiness?.riskPreventedLabel ?? `${review + blocked} unsafe or under-evidenced agent actions stopped before promotion`;

const baseUrl = process.env.AGENTGUARD_DEVELOPERWEEK_DEMO_URL ?? "http://localhost:5173";
const route = (query) => `${baseUrl}/?contest=developerweek&lang=en&present=1&${query}`;
const repository = "https://github.com/baiqidi/agentguard-ci/tree/codex/developerweek-ny";

const shotList = [
  {
    time: "0:00-0:18",
    name: "Opening product",
    url: route("page=overview"),
    focus: ".decision-hero",
    narration:
      "AgentGuard CI is an AI-agent release gate. Developer teams are moving from copilots to agents that click buttons, change records, write code, and trigger workflows. AgentGuard answers the release question before those actions touch production: should this agent promote, review, or block."
  },
  {
    time: "0:18-0:39",
    name: "One-command CI proof",
    url: "terminal:npm run developerweek:check",
    focus: "terminal",
    narration:
      "The product is not a slide-only idea. A judge can run npm run developerweek check. That command builds the monorepo, runs the DeveloperWeek adapter suite, regenerates the evidence packet, and verifies the README, GitHub branch, workflow, and submission copy. It behaves like a CI gate: deterministic checks in, release evidence out."
  },
  {
    time: "0:39-1:02",
    name: "Enterprise coverage",
    url: route("page=scenarios"),
    focus: ".baseline-panel",
    narration:
      `The evidence suite covers ${totalScenarios} enterprise agent scenarios across ${liveAgentTypes} categories: browser automation, data analysis, support, workflows, documents, email, finance, HR, CRM, SOC, knowledge retrieval, incident response, and multi-agent coordination. That breadth is the DeveloperWeek story: this is a general developer tool, not a single vertical demo.`
  },
  {
    time: "1:02-1:21",
    name: "Decision contract",
    url: route("page=evidence&filter=review&scenario=browser-payment-approval"),
    focus: ".review-desk-panel",
    narration:
      `Every scenario lands on one of three outcomes. ${promoted} actions can promote, ${review} need human review, and ${blocked} are blocked. The important detail is the reason, not just the label: failed gates explain missing approval, unsafe state changes, weak evidence, or tool-boundary violations before the agent can mutate an external system.`
  },
  {
    time: "1:21-1:37",
    name: "Machine-readable evidence",
    url: route("page=evidence&filter=review&scenario=browser-payment-approval"),
    focus: ".evidence-panel",
    narration:
      `AgentGuard writes machine-readable evidence, including ${evidence.attachments?.includes("developerweek-ci-evidence.json") ? "developerweek CI evidence" : "the DeveloperWeek evidence packet"}. That means a team can attach the packet to a pull request, CI run, release review, or audit trail. The dashboard is for humans, but the contract is structured enough for automation.`
  },
  {
    time: "1:37-1:57",
    name: "Commercial path",
    url: route("page=companion"),
    focus: ".operator-runbook-panel",
    narration:
      `${riskPrevented}. The path from prototype to product is direct: GitHub App, CI plugin, hosted dashboard, or enterprise governance layer. The core promise is simple and valuable: before an AI agent acts, AgentGuard makes the risk visible, reviewable, and enforceable.`
  }
];

const voiceover = shotList.map((shot) => shot.narration).join("\n\n");

const checklist = [
  "# DeveloperWeek Demo Video Checklist",
  "",
  "- [ ] YouTube link: paste the final public or unlisted DeveloperWeek demo URL.",
  `- [ ] GitHub branch: ${repository}`,
  "- [ ] Demo video length: 90 to 180 seconds.",
  "- [ ] Demo opens on the broad AgentGuard CI dashboard, not a SANS or Splunk vertical.",
  "- [ ] Demo shows the one-command proof: `npm run developerweek:check`.",
  `- [ ] Demo states ${totalScenarios} enterprise agent scenarios across ${liveAgentTypes} categories.`,
  "- [ ] Demo explains promote, review, or block decisions.",
  "- [ ] Demo shows machine-readable DeveloperWeek evidence.",
  "- [ ] Demo does not show private browser tabs, Devpost edit screens, local file paths, or script notes."
].join("\n");

const manifest = {
  generatedAt: new Date().toISOString(),
  outputDir: resolve(outDir),
  baseUrl,
  targetDuration: "1:57",
  publicRepository: repository,
  verifiedEvidence: {
    verdict: readiness?.verdict ?? "ready-for-ci-gating",
    totalScenarios,
    liveAgentTypes,
    promoted,
    review,
    blocked,
    gatePassRate: coverage.gatePassRate ?? summary.summary.gatePassRate,
    evidenceTarget: evidence.targetPlatform
  },
  requiredAssets: requiredAssets.map((asset) => ({ path: asset, absolutePath: resolve(root, asset) })),
  futureAudioCommand: "npm run video:audio:developerweek",
  futureRecordCommand: "npm run video:record:developerweek",
  futureCheckCommand: "npm run video:check:developerweek",
  note: "Preparation only. This command does not start audio synthesis or screen recording."
};

writeFileSync(join(outDir, "shot-list.json"), `${JSON.stringify(shotList, null, 2)}\n`);
writeFileSync(join(outDir, "voiceover-en.txt"), `${voiceover}\n`);
writeFileSync(join(outDir, "submission-checklist.md"), `${checklist}\n`);
writeFileSync(join(outDir, "asset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log("DeveloperWeek demo video preparation complete.");
console.log(`Prepared assets: ${outDir}`);
console.log("No recording was started.");
