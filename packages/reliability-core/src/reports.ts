import type { ReliabilityGateResult, ReliabilityScore } from "./types.js";
import { getContestEvidenceConfig } from "./contest.js";
import { findRiskProfile } from "./risk.js";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function gateEntries(score: ReliabilityScore): Array<[string, ReliabilityGateResult]> {
  return Object.entries(score.gates);
}

export function renderJsonReport(score: ReliabilityScore): string {
  return JSON.stringify(score, null, 2);
}

export function renderMarkdownReport(score: ReliabilityScore): string {
  const status = score.passed ? "PASS" : "FAIL";
  const rows = gateEntries(score)
    .map(([name, gate]) => {
      const gateStatus = gate.passed ? "PASS" : "FAIL";
      return `| ${name} | ${gateStatus} | ${gate.reason ?? ""} |`;
    })
    .join("\n");

  return [
    "# AgentGuard Reliability Report",
    "",
    `Scenario: \`${score.scenarioId}\``,
    `Status: **${status}**`,
    `Score: ${score.totalPassed}/${score.totalGates}`,
    "",
    "| Gate | Status | Reason |",
    "| --- | --- | --- |",
    rows,
    ""
  ].join("\n");
}

export function renderJUnitReport(score: ReliabilityScore): string {
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
    `<testsuite name="AgentGuard CI" tests="${score.totalGates}" failures="${failures}">`,
    testCases,
    "</testsuite>",
    ""
  ].join("\n");
}

export function renderTestCloudEvidence(score: ReliabilityScore): string {
  const contestConfig = getContestEvidenceConfig();
  const gates = gateEntries(score).map(([name, gate]) => ({
    name,
    status: gate.passed ? "passed" : "failed",
    ...(gate.reason ? { reason: gate.reason } : {})
  }));
  const riskProfile = findRiskProfile(score.scenarioId);

  return JSON.stringify(
    {
      sourceSystem: "AgentGuard CI",
      targetPlatform: contestConfig.targetPlatform,
      scenarioId: score.scenarioId,
      status: score.passed ? "passed" : "failed",
      score: {
        passedGates: score.totalPassed,
        totalGates: score.totalGates
      },
      method: {
        version: "agentguard-v1",
        strategy: "gated-repair-evidence",
        promotionRule: "All reliability gates must pass before automated promotion"
      },
      recommendedAction: score.passed
        ? "Ready for automated promotion"
        : "Route to human review before promotion",
      ...(riskProfile
        ? {
            risk: {
              severity: riskProfile.severity,
              owner: riskProfile.owner,
              riskPoints: riskProfile.riskPoints,
              control: riskProfile.control,
              evidenceStandard: riskProfile.evidenceStandard
            }
          }
        : {}),
      gates,
      attachments: ["report.json", "report.md", "junit.xml", contestConfig.evidenceArtifact]
    },
    null,
    2
  );
}
