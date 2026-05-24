import { describe, expect, it } from "vitest";
import {
  buildConsoleSummary,
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
      totalScenarios: 4,
      passedScenarios: 2,
      governanceFindings: 2,
      totalPassedGates: 17,
      totalGates: 20,
      passRateLabel: "85%"
    });
  });

  it("maps scenario status and review action into stable tones", () => {
    expect(evidenceTone(judgeScenarioEvidence[0])).toBe("success");
    expect(evidenceTone(judgeScenarioEvidence[2])).toBe("warning");
    expect(evidenceTone(judgeScenarioEvidence[3])).toBe("danger");
  });

  it("summarizes the product release decision for judge review", () => {
    expect(buildReleaseDecisionSummary(judgeScenarioEvidence)).toEqual({
      autoPromotions: 2,
      reviewRequired: 2,
      hardBlocks: 1,
      decisionLabel: "2 can promote, 2 need review",
      thresholdLabel: "Promote only when all 5 reliability gates pass",
      executiveSummary:
        "AgentGuard separates green CI from safe repair by checking root cause, diff scope, test integrity, and approval readiness."
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
