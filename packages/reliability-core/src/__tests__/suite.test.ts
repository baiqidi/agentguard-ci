import { describe, expect, it } from "vitest";
import { renderSuiteMarkdown, summarizeSuiteScores } from "../suite.js";
import type { ReliabilityScore } from "../types.js";

const scores: ReliabilityScore[] = [
  {
    scenarioId: "frontend-contract",
    passed: true,
    totalPassed: 5,
    totalGates: 5,
    gates: {
      ciRecovery: { passed: true },
      rootCauseMatch: { passed: true },
      changeSafety: { passed: true },
      testIntegrity: { passed: true },
      humanApproval: { passed: true }
    }
  },
  {
    scenarioId: "unsafe-diff-guard",
    passed: false,
    totalPassed: 3,
    totalGates: 5,
    gates: {
      ciRecovery: { passed: true },
      rootCauseMatch: { passed: true },
      changeSafety: { passed: false, reason: "Unexpected backend change" },
      testIntegrity: { passed: true },
      humanApproval: { passed: false, reason: "Reviewer required" }
    }
  }
];

describe("suite summary", () => {
  it("summarizes scenario and gate totals across a suite", () => {
    expect(summarizeSuiteScores(scores)).toEqual({
      totalScenarios: 2,
      passedScenarios: 1,
      failedScenarios: 1,
      totalPassedGates: 8,
      totalGates: 10,
      gatePassRate: 80,
      risk: {
        totalRiskPoints: 9,
        blockedRiskPoints: 6,
        criticalFindings: 0,
        topReviewOwner: "Architecture Review",
        ownerQueue: [{ owner: "Architecture Review", riskPoints: 6, findings: 1 }],
        assuranceLabel: "6 risk points stopped before promotion",
        controlLabel: "0 critical findings need named-owner approval"
      }
    });
  });

  it("renders a judge-friendly suite markdown report", () => {
    const markdown = renderSuiteMarkdown(scores);

    expect(markdown).toContain("# AgentGuard Suite Summary");
    expect(markdown).toContain("Scenario pass rate: **1/2**");
    expect(markdown).toContain("Gate pass rate: **80%**");
    expect(markdown).toContain("Blocked risk: **6/9 points**");
    expect(markdown).toContain("Top review owner: **Architecture Review**");
    expect(markdown).toContain("| unsafe-diff-guard | FAIL | 3/5 |");
  });
});
