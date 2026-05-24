import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { AdapterGateResult, AdapterScenario, AdapterScore } from "./types.js";
import { scoreAdapterScenario, summarizeAdapterScores } from "./scoring.js";
import { publicAgentInstallChecks, summarizePublicAgentInstallChecks } from "./integrations.js";

export interface AdapterReportPaths {
  json: string;
  markdown: string;
  junit: string;
  testCloudEvidence: string;
}

export interface AdapterSuiteReportPaths {
  json: string;
  markdown: string;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function gateEntries(score: AdapterScore): Array<[string, AdapterGateResult]> {
  return Object.entries(score.gates);
}

export function renderAdapterJsonReport(scenario: AdapterScenario, score: AdapterScore): string {
  return JSON.stringify(
    {
      scenario,
      score
    },
    null,
    2
  );
}

export function renderAdapterMarkdownReport(scenario: AdapterScenario, score: AdapterScore): string {
  const status = score.passed ? "PASS" : "FAIL";
  const rows = gateEntries(score)
    .map(([name, gate]) => {
      const gateStatus = gate.passed ? "PASS" : "FAIL";
      return `| ${name} | ${gateStatus} | ${gate.reason ?? ""} |`;
    })
    .join("\n");

  return [
    "# AgentGuard Agent Adapter Report",
    "",
    `Scenario: \`${scenario.id}\``,
    `Title: ${scenario.title}`,
    `Agent type: \`${scenario.agentType}\``,
    `Validation mode: **live-local**`,
    `Status: **${status}**`,
    `Score: ${score.totalPassed}/${score.totalGates}`,
    "",
    "## Goal",
    scenario.userGoal,
    "",
    "## Expected Outcome",
    scenario.expectedOutcome,
    "",
    "| Gate | Status | Reason |",
    "| --- | --- | --- |",
    rows,
    ""
  ].join("\n");
}

export function renderAdapterJUnitReport(score: AdapterScore): string {
  const failures = gateEntries(score).filter(([, gate]) => !gate.passed).length;
  const testCases = gateEntries(score)
    .map(([name, gate]) => {
      if (gate.passed) {
        return `  <testcase name="${escapeXml(name)}" />`;
      }
      const reason = escapeXml(gate.reason ?? "Gate failed");
      return `  <testcase name="${escapeXml(name)}">\n    <failure message="${reason}" />\n  </testcase>`;
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<testsuite name="AgentGuard Agent Adapters" tests="${score.totalGates}" failures="${failures}">`,
    testCases,
    "</testsuite>",
    ""
  ].join("\n");
}

export function renderAdapterTestCloudEvidence(scenario: AdapterScenario, score: AdapterScore): string {
  const gates = gateEntries(score).map(([name, gate]) => ({
    name,
    status: gate.passed ? "passed" : "failed",
    ...(gate.reason ? { reason: gate.reason } : {})
  }));

  return JSON.stringify(
    {
      sourceSystem: "AgentGuard Agent Adapters",
      targetPlatform: "UiPath Test Cloud",
      scenarioId: scenario.id,
      agentType: scenario.agentType,
      riskVectorId: scenario.riskVectorId,
      validationMode: "live-local",
      status: score.passed ? "passed" : "failed",
      score: {
        passedGates: score.totalPassed,
        totalGates: score.totalGates
      },
      method: {
        version: "agentguard-agent-adapters-v1",
        strategy: "universal-agent-reliability-gates",
        installContract: "Adapter consumes deterministic agent tool traces and blocks unsafe promotion before external execution",
        promotionRule: "All five universal gates must pass before the agent can mutate external state"
      },
      recommendedAction: score.passed
        ? "Ready for guarded execution"
        : "Route to human review before external execution",
      gates,
      attachments: ["report.json", "report.md", "junit.xml", "test-cloud-evidence.json"]
    },
    null,
    2
  );
}

export async function writeAdapterScenarioReports(
  scenario: AdapterScenario,
  score: AdapterScore,
  outputDir: string
): Promise<AdapterReportPaths> {
  const scenarioDir = join(outputDir, scenario.id);
  await mkdir(scenarioDir, { recursive: true });

  const paths: AdapterReportPaths = {
    json: join(scenarioDir, "report.json"),
    markdown: join(scenarioDir, "report.md"),
    junit: join(scenarioDir, "junit.xml"),
    testCloudEvidence: join(scenarioDir, "test-cloud-evidence.json")
  };

  await Promise.all([
    writeFile(paths.json, renderAdapterJsonReport(scenario, score)),
    writeFile(paths.markdown, renderAdapterMarkdownReport(scenario, score)),
    writeFile(paths.junit, renderAdapterJUnitReport(score)),
    writeFile(paths.testCloudEvidence, renderAdapterTestCloudEvidence(scenario, score))
  ]);

  return paths;
}

export function renderAdapterSuiteJson(scenarios: AdapterScenario[]): string {
  const scores = scenarios.map(scoreAdapterScenario);

  return JSON.stringify(
    {
      summary: summarizeAdapterScores(scores),
      publicAgentInstallSummary: summarizePublicAgentInstallChecks(publicAgentInstallChecks),
      publicAgentInstallChecks,
      scenarios: scenarios.map((scenario, index) => ({
        scenarioId: scenario.id,
        title: scenario.title,
        agentType: scenario.agentType,
        validationMode: "live-local",
        status: scores[index].passed ? "passed" : "failed",
        score: {
          passedGates: scores[index].totalPassed,
          totalGates: scores[index].totalGates
        },
        gates: scores[index].gates
      }))
    },
    null,
    2
  );
}

export function renderAdapterSuiteMarkdown(scenarios: AdapterScenario[]): string {
  const scores = scenarios.map(scoreAdapterScenario);
  const summary = summarizeAdapterScores(scores);
  const installSummary = summarizePublicAgentInstallChecks(publicAgentInstallChecks);
  const rows = scenarios
    .map((scenario, index) => {
      const score = scores[index];
      const status = score.passed ? "PASS" : "FAIL";
      return `| ${scenario.agentType} | ${status} | ${score.totalPassed}/${score.totalGates} | ${scenario.id} |`;
    })
    .join("\n");

  return [
    "# AgentGuard Agent Adapter Suite",
    "",
    `Validation mode: **live-local**`,
    `Agent categories: **${summary.liveAgentTypes}**`,
    `Scenario pass rate: **${summary.passedScenarios}/${summary.totalScenarios}**`,
    `Gate pass rate: **${summary.gatePassRate}%**`,
    `Review or block findings: **${summary.reviewOrBlockScenarios}**`,
    `Public framework checks: **${installSummary.coverageLabel}**`,
    "",
    "| Agent Type | Status | Gates | Scenario |",
    "| --- | --- | --- | --- |",
    rows,
    ""
  ].join("\n");
}

export async function writeAdapterSuiteReports(
  scenarios: AdapterScenario[],
  outputDir: string
): Promise<AdapterSuiteReportPaths> {
  await mkdir(outputDir, { recursive: true });
  const paths = {
    json: join(outputDir, "agent-adapter-suite-summary.json"),
    markdown: join(outputDir, "agent-adapter-suite-summary.md")
  };

  await Promise.all([
    writeFile(paths.json, renderAdapterSuiteJson(scenarios)),
    writeFile(paths.markdown, renderAdapterSuiteMarkdown(scenarios))
  ]);

  const scores = scenarios.map(scoreAdapterScenario);
  await Promise.all(scenarios.map((scenario, index) => writeAdapterScenarioReports(scenario, scores[index], outputDir)));

  return paths;
}
