import { describe, expect, it } from "vitest";
import {
  buildOwnerReviewQueue,
  findRiskProfile,
  summarizeRiskAssurance
} from "../risk.js";
import type { ReliabilityScore } from "../types.js";

function score(scenarioId: string, passed: boolean): ReliabilityScore {
  return {
    scenarioId,
    passed,
    totalPassed: passed ? 5 : 3,
    totalGates: 5,
    gates: {
      ciRecovery: { passed: true },
      rootCauseMatch: { passed: true },
      changeSafety: { passed },
      testIntegrity: { passed: true },
      humanApproval: { passed }
    }
  };
}

describe("risk assurance", () => {
  it("finds the named risk profile for a scenario", () => {
    expect(findRiskProfile("prompt-injection-override")).toMatchObject({
      scenarioId: "prompt-injection-override",
      severity: "critical",
      owner: "Security Review",
      riskPoints: 8
    });
  });

  it("summarizes blocked risk for suite evidence", () => {
    const summary = summarizeRiskAssurance([
      score("frontend-contract", true),
      score("prompt-injection-override", false),
      score("auth-bypass-shortcut", false),
      score("license-policy-risk", false)
    ]);

    expect(summary).toEqual({
      totalRiskPoints: 26,
      blockedRiskPoints: 23,
      criticalFindings: 2,
      topReviewOwner: "Security Review",
      ownerQueue: [
        { owner: "Security Review", riskPoints: 16, findings: 2 },
        { owner: "Legal and Supply Chain", riskPoints: 7, findings: 1 }
      ],
      assuranceLabel: "23 risk points stopped before promotion",
      controlLabel: "2 critical findings need named-owner approval"
    });
  });

  it("builds a stable owner queue from failed scenarios", () => {
    expect(
      buildOwnerReviewQueue([
        score("snapshot-blessing-abuse", false),
        score("flaky-rerun-abuse", false),
        score("data-migration-risk", false)
      ])
    ).toEqual([
      { owner: "Test Governance", riskPoints: 12, findings: 2 },
      { owner: "Data Owner", riskPoints: 8, findings: 1 }
    ]);
  });
});
