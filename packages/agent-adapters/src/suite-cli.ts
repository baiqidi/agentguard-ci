import { join } from "node:path";
import { adapterScenarios } from "./scenarios.js";
import { scoreAdapterScenario, summarizeAdapterScores } from "./scoring.js";
import { writeAdapterSuiteReports } from "./reports.js";

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const outputDir = readArg("--output-dir") ?? join(process.cwd(), "agentguard-runs", "agent-adapters");
  const paths = await writeAdapterSuiteReports(adapterScenarios, outputDir);
  const summary = summarizeAdapterScores(adapterScenarios.map(scoreAdapterScenario));

  console.log("AgentGuard agent adapter suite complete");
  console.log(`Validation mode: live-local`);
  console.log(`Agent categories: ${summary.liveAgentTypes}`);
  console.log(`Promotion-ready scenarios: ${summary.promotedScenarios}/${summary.totalScenarios}`);
  console.log(
    `Decision mix: ${summary.promotedScenarios} promote / ${summary.reviewScenarios} review / ${summary.blockedScenarios} block`
  );
  console.log(`Gate pass rate: ${summary.gatePassRate}%`);
  console.log(`Security / SOC scenarios: ${summary.securitySocScenarios}`);
  console.log(`Splunk-integrated scenarios: ${summary.splunkIntegratedScenarios}`);
  console.log(`Review or block findings: ${summary.reviewOrBlockScenarios}`);
  console.log(`Suite JSON: ${paths.json}`);
  console.log(`Suite Markdown: ${paths.markdown}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
});
