import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { loadScenarioManifest } from "./scenario.js";
import { runScenarioManifest } from "./runner.js";
import type { FixPlan, FixRequest } from "./runner.js";
import { renderSuiteJson, renderSuiteMarkdown, summarizeSuiteScores } from "./suite.js";

const defaultScenarioIds = [
  "frontend-contract",
  "backend-triage",
  "test-integrity-guard",
  "unsafe-diff-guard",
  "hallucinated-root-cause",
  "flaky-rerun-abuse",
  "dependency-upgrade-risk",
  "secret-handling-guard",
  "config-env-drift",
  "performance-regression",
  "data-migration-risk",
  "concurrency-race",
  "prompt-injection-override",
  "snapshot-blessing-abuse",
  "auth-bypass-shortcut",
  "input-validation-gap",
  "observability-removal",
  "rollback-flag-missing",
  "cross-platform-path-case",
  "timezone-edge-case",
  "accessibility-regression",
  "license-policy-risk",
  "large-refactor-drift",
  "nondeterministic-random-fix"
];

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const cwd = process.cwd();
  const scenariosDir = readArg("--scenarios-dir") ?? join(cwd, "scenarios");
  const outputDir = readArg("--output-dir") ?? join(cwd, "agentguard-runs");
  const scenarioIds = readArg("--scenarios")?.split(",").map((id) => id.trim()).filter(Boolean) ?? defaultScenarioIds;
  const { planScriptedFix } = (await import("../../codefix-agent/dist/index.js")) as {
    planScriptedFix: (request: FixRequest) => FixPlan;
  };

  const results = [];
  for (const scenarioId of scenarioIds) {
    const manifest = await loadScenarioManifest(scenarioId, scenariosDir);
    results.push(await runScenarioManifest(manifest, { cwd, outputDir, planFix: planScriptedFix }));
  }

  const scores = results.map((result) => result.score);
  await mkdir(outputDir, { recursive: true });
  const jsonPath = join(outputDir, "suite-summary.json");
  const markdownPath = join(outputDir, "suite-summary.md");
  await Promise.all([
    writeFile(jsonPath, renderSuiteJson(scores)),
    writeFile(markdownPath, renderSuiteMarkdown(scores))
  ]);

  const summary = summarizeSuiteScores(scores);
  console.log("AgentGuard suite complete");
  console.log(`Scenarios: ${summary.passedScenarios}/${summary.totalScenarios} passed`);
  console.log(`Gate pass rate: ${summary.gatePassRate}%`);
  console.log(`Governance findings: ${summary.failedScenarios}`);
  console.log(`Suite JSON: ${jsonPath}`);
  console.log(`Suite Markdown: ${markdownPath}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
});
