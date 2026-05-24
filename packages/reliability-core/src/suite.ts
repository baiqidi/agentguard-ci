import type { ReliabilityScore } from "./types.js";
import { summarizeRiskAssurance, type RiskAssuranceSummary } from "./risk.js";

export interface SuiteSummary {
  totalScenarios: number;
  passedScenarios: number;
  failedScenarios: number;
  totalPassedGates: number;
  totalGates: number;
  gatePassRate: number;
  risk: RiskAssuranceSummary;
}

export function summarizeSuiteScores(scores: ReliabilityScore[]): SuiteSummary {
  const totalScenarios = scores.length;
  const passedScenarios = scores.filter((score) => score.passed).length;
  const totalPassedGates = scores.reduce((sum, score) => sum + score.totalPassed, 0);
  const totalGates = scores.reduce((sum, score) => sum + score.totalGates, 0);
  const gatePassRate = totalGates === 0 ? 0 : Math.round((totalPassedGates / totalGates) * 100);

  return {
    totalScenarios,
    passedScenarios,
    failedScenarios: totalScenarios - passedScenarios,
    totalPassedGates,
    totalGates,
    gatePassRate,
    risk: summarizeRiskAssurance(scores)
  };
}

export function renderSuiteJson(scores: ReliabilityScore[]): string {
  return JSON.stringify(
    {
      summary: summarizeSuiteScores(scores),
      scenarios: scores.map((score) => ({
        scenarioId: score.scenarioId,
        status: score.passed ? "passed" : "failed",
        score: {
          passedGates: score.totalPassed,
          totalGates: score.totalGates
        },
        gates: score.gates
      }))
    },
    null,
    2
  );
}

export function renderSuiteMarkdown(scores: ReliabilityScore[]): string {
  const summary = summarizeSuiteScores(scores);
  const rows = scores
    .map((score) => {
      const status = score.passed ? "PASS" : "FAIL";
      return `| ${score.scenarioId} | ${status} | ${score.totalPassed}/${score.totalGates} |`;
    })
    .join("\n");

  return [
    "# AgentGuard Suite Summary",
    "",
    `Scenario pass rate: **${summary.passedScenarios}/${summary.totalScenarios}**`,
    `Gate pass rate: **${summary.gatePassRate}%**`,
    `Governance findings: **${summary.failedScenarios}**`,
    `Blocked risk: **${summary.risk.blockedRiskPoints}/${summary.risk.totalRiskPoints} points**`,
    `Top review owner: **${summary.risk.topReviewOwner}**`,
    "",
    "| Scenario | Status | Gates |",
    "| --- | --- | --- |",
    rows,
    ""
  ].join("\n");
}
