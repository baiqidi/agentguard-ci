import { describe, expect, it } from "vitest";
import {
  buildConsoleSummary,
  buildOptimizationSummary,
  buildReleaseDecisionSummary,
  evidenceTone,
  formatGateLabel,
  judgeScenarioEvidence,
  researchBackedProtocol,
  summarizeResearchProtocol
} from "../testCloudEvidence.js";

describe("test cloud evidence view model", () => {
  it("summarizes the scenario portfolio for judge review", () => {
    expect(buildConsoleSummary(judgeScenarioEvidence)).toEqual({
      totalScenarios: 12,
      passedScenarios: 4,
      governanceFindings: 8,
      totalPassedGates: 46,
      totalGates: 60,
      passRateLabel: "77%"
    });
  });

  it("maps scenario status and review action into stable tones", () => {
    expect(evidenceTone(judgeScenarioEvidence[0])).toBe("success");
    expect(evidenceTone(judgeScenarioEvidence[2])).toBe("warning");
    expect(evidenceTone(judgeScenarioEvidence[3])).toBe("danger");
    expect(judgeScenarioEvidence.map((scenario) => scenario.id)).toEqual([
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
      "concurrency-race"
    ]);
  });

  it("summarizes the product release decision for judge review", () => {
    expect(buildReleaseDecisionSummary(judgeScenarioEvidence)).toEqual({
      autoPromotions: 4,
      reviewRequired: 8,
      hardBlocks: 5,
      decisionLabel: "4 can promote, 8 need review",
      thresholdLabel: "Promote only when all 5 reliability gates pass",
      executiveSummary:
        "AgentGuard separates green CI from safe repair by checking root cause, diff scope, test integrity, and approval readiness."
    });
  });

  it("summarizes performance optimization from targeted scenario selection", () => {
    expect(buildOptimizationSummary(judgeScenarioEvidence)).toEqual({
      targetedMinutes: 59,
      baselineMinutes: 195,
      savedMinutes: 136,
      savedPercentLabel: "70%",
      highestRiskArea: "Test stability",
      recommendation: "Run targeted agent-reliability scenarios first, then expand only blocked paths to full regression."
    });
  });

  it("formats gate keys for dashboard labels", () => {
    expect(formatGateLabel("ciRecovery")).toBe("CI Recovery");
    expect(formatGateLabel("rootCauseMatch")).toBe("Root Cause Match");
    expect(formatGateLabel("humanApproval")).toBe("Human Approval");
  });

  it("summarizes research-backed protocol coverage", () => {
    expect(summarizeResearchProtocol(researchBackedProtocol)).toEqual({
      principleCount: 5,
      paperCount: 5,
      uipathControlCount: 3,
      headline: "5 principles from 5 agent-evaluation papers + 3 UiPath controls"
    });
  });
});
