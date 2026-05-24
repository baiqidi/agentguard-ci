import { join } from "node:path";
import { loadScenarioManifest } from "./scenario.js";
import { runScenarioManifest } from "./runner.js";

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const scenarioId = readArg("--scenario");
  if (!scenarioId) {
    console.error("Usage: npm run agentguard:scenario -- --scenario <scenario-id>");
    process.exitCode = 2;
    return;
  }

  const cwd = process.cwd();
  const scenariosDir = readArg("--scenarios-dir") ?? join(cwd, "scenarios");
  const outputDir = readArg("--output-dir") ?? join(cwd, "agentguard-runs");
  const manifest = await loadScenarioManifest(scenarioId, scenariosDir);
  const result = await runScenarioManifest(manifest, { cwd, outputDir });

  console.log(`AgentGuard scenario: ${scenarioId}`);
  console.log(`Score: ${result.score.totalPassed}/${result.score.totalGates}`);
  console.log(`Passed: ${String(result.score.passed)}`);
  console.log(`Markdown report: ${result.reportPaths.markdown}`);
  console.log(`JUnit report: ${result.reportPaths.junit}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
});

