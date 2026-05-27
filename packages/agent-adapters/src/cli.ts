import { join } from "node:path";
import { getContestEvidenceConfig } from "./contest.js";
import { findAdapterScenario } from "./scenarios.js";
import { scoreAdapterScenario } from "./scoring.js";
import { writeAdapterScenarioReports } from "./reports.js";

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const scenarioId = readArg("--scenario");
  if (!scenarioId) {
    console.error("Usage: npm run agentguard:agent-scenario -- --scenario <scenario-id>");
    process.exitCode = 2;
    return;
  }

  const scenario = findAdapterScenario(scenarioId);
  if (!scenario) {
    console.error(`Unknown agent adapter scenario: ${scenarioId}`);
    process.exitCode = 2;
    return;
  }

  const outputDir = readArg("--output-dir") ?? join(process.cwd(), "agentguard-runs", "agent-adapters");
  const score = scoreAdapterScenario(scenario);
  const paths = await writeAdapterScenarioReports(scenario, score, outputDir);
  const contestConfig = getContestEvidenceConfig();

  console.log(`AgentGuard agent scenario: ${scenario.id}`);
  console.log(`Agent type: ${scenario.agentType}`);
  console.log(`Validation mode: live-local`);
  console.log(`Score: ${score.totalPassed}/${score.totalGates}`);
  console.log(`Passed: ${String(score.passed)}`);
  console.log(`Markdown report: ${paths.markdown}`);
  console.log(`${contestConfig.evidenceLabel}: ${paths.testCloudEvidence}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
});
