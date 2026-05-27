import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "docs/hackathons/targets.json",
  "docs/hackathons/multi-hackathon-strategy.md",
  "docs/hackathons/splunk-agentic-ops-pack.md",
  "docs/hackathons/sans-find-evil-pack.md",
  "docs/hackathons/tencent-ai-agent-pack.md",
  "docs/hackathons/devnetwork-ai-ml-pack.md",
  "docs/hackathons/hack-nation-global-ai-pack.md",
  "docs/hackathons/google-rapid-agent-pack.md",
  "docs/superpowers/specs/2026-05-26-multi-hackathon-pack-design.md",
  "docs/superpowers/plans/2026-05-26-multi-hackathon-pack.md"
];

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

for (const file of requiredFiles) {
  if (existsSync(join(root, file))) {
    pass(`file:${file}`);
  } else {
    fail(`file:${file}`, "Required hackathon pack file is missing.");
  }
}

if (existsSync(join(root, "docs/hackathons/targets.json"))) {
  const targets = JSON.parse(read("docs/hackathons/targets.json"));
  const ids = new Set(targets.map((target) => target.id));
  const requiredIds = [
    "uipath-agenthack",
    "splunk-agentic-ops",
    "sans-find-evil",
    "tencent-cloud-ai-agent",
    "hack-nation-global-ai",
    "devnetwork-ai-ml-2026",
    "google-cloud-rapid-agent"
  ];

  for (const id of requiredIds) {
    if (ids.has(id)) {
      pass(`target:${id}`);
    } else {
      fail(`target:${id}`, "Target is missing from docs/hackathons/targets.json.");
    }
  }

  const activeTargets = targets.filter((target) =>
    ["primary", "active-alternate", "opportunistic"].includes(target.tier)
  );
  if (activeTargets.length >= 6) {
    pass("targets:active-count", `${activeTargets.length} active or opportunistic targets`);
  } else {
    fail("targets:active-count", "Expected at least six active or opportunistic targets.");
  }

  const google = targets.find((target) => target.id === "google-cloud-rapid-agent");
  if (
    google?.status === "not-current-prize-target" &&
    google?.eligibility.includes("china-resident")
  ) {
    pass("eligibility:google-china-warning");
  } else {
    fail(
      "eligibility:google-china-warning",
      "Google Cloud Rapid Agent must stay marked as not eligible for a China-resident solo submission."
    );
  }

  const splunk = targets.find((target) => target.id === "splunk-agentic-ops");
  if (
    splunk?.status === "active" &&
    splunk?.sourceUrls?.includes("https://splunk.devpost.com/rules") &&
    splunk?.requiredDelta.includes("architecture")
  ) {
    pass("target:splunk-ready");
  } else {
    fail(
      "target:splunk-ready",
      "Splunk target must stay active and include the official rules URL plus architecture delta."
    );
  }

  const emptyFields = targets.flatMap((target) =>
    Object.entries(target)
      .filter(([, value]) => value === "" || value === null || value === undefined)
      .map(([key]) => `${target.id}.${key}`)
  );
  if (emptyFields.length === 0) {
    pass("targets:no-empty-fields");
  } else {
    fail("targets:no-empty-fields", `Empty fields: ${emptyFields.join(", ")}`);
  }
}

const strategy = existsSync(join(root, "docs/hackathons/multi-hackathon-strategy.md"))
  ? read("docs/hackathons/multi-hackathon-strategy.md")
  : "";

if (strategy.includes("Google Cloud Rapid Agent") && strategy.includes("Study-only")) {
  pass("strategy:google-study-only");
} else {
  fail("strategy:google-study-only", "Strategy must explicitly downgrade Google to study-only.");
}

if (strategy.includes("UiPath AgentHack") && strategy.includes("Splunk Agentic Ops Hackathon")) {
  pass("strategy:primary-and-splunk");
} else {
  fail("strategy:primary-and-splunk", "Strategy must preserve UiPath and prioritize the Splunk alternate.");
}

if (strategy.includes("腾讯云黑客松")) {
  pass("strategy:tencent-path");
} else {
  fail("strategy:tencent-path", "Strategy must preserve the Tencent path.");
}

const googlePack = existsSync(join(root, "docs/hackathons/google-rapid-agent-pack.md"))
  ? read("docs/hackathons/google-rapid-agent-pack.md")
  : "";
if (googlePack.includes("Eligibility Warning") && googlePack.includes("China")) {
  pass("google-pack:eligibility-warning");
} else {
  fail("google-pack:eligibility-warning", "Google pack needs a visible China eligibility warning.");
}

const splunkPack = existsSync(join(root, "docs/hackathons/splunk-agentic-ops-pack.md"))
  ? read("docs/hackathons/splunk-agentic-ops-pack.md")
  : "";
if (splunkPack.includes("Splunk MCP Server") && splunkPack.includes("Security")) {
  pass("splunk-pack:mcp-and-track");
} else {
  fail("splunk-pack:mcp-and-track", "Splunk pack must mention Splunk MCP Server and the Security track.");
}

const failures = checks.filter((check) => check.status === "FAIL");
for (const check of checks) {
  const suffix = check.detail ? ` - ${check.detail}` : "";
  console.log(`${check.status} ${check.name}${suffix}`);
}

if (failures.length > 0) {
  console.error(`\nHackathon pack failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log(`\nHackathon pack passed: ${checks.length} checks.`);
