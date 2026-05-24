import { describe, expect, it } from "vitest";
import {
  buildConsoleSummary,
  evidenceTone,
  formatGateLabel,
  judgeScenarioEvidence
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

  it("formats gate keys for dashboard labels", () => {
    expect(formatGateLabel("ciRecovery")).toBe("CI Recovery");
    expect(formatGateLabel("rootCauseMatch")).toBe("Root Cause Match");
    expect(formatGateLabel("humanApproval")).toBe("Human Approval");
  });
});
