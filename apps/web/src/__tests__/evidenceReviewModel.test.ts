import { describe, expect, it } from "vitest";
import {
  buildScenarioFocusSummary,
  countScenariosByTone,
  filterScenariosByTone,
  getScenarioTargetIssues,
  parseScenarioToneFilter
} from "../evidenceReviewModel.js";
import { judgeScenarioEvidence } from "../testCloudEvidence.js";

describe("evidence review model", () => {
  it("counts all scenarios by judge-facing tone", () => {
    expect(countScenariosByTone(judgeScenarioEvidence)).toEqual({
      all: 24,
      success: 7,
      warning: 5,
      danger: 12
    });
  });

  it("filters visible scenarios by tone", () => {
    expect(filterScenariosByTone(judgeScenarioEvidence, "all")).toHaveLength(24);
    expect(filterScenariosByTone(judgeScenarioEvidence, "success")).toHaveLength(7);
    expect(filterScenariosByTone(judgeScenarioEvidence, "warning")).toHaveLength(5);
    expect(filterScenariosByTone(judgeScenarioEvidence, "danger")).toHaveLength(12);
  });

  it("parses only supported scenario tone filters from the URL", () => {
    expect(parseScenarioToneFilter("danger")).toBe("danger");
    expect(parseScenarioToneFilter("success")).toBe("success");
    expect(parseScenarioToneFilter("other")).toBe("all");
    expect(parseScenarioToneFilter(null)).toBe("all");
  });

  it("builds a focused review summary for the selected scenario", () => {
    expect(buildScenarioFocusSummary(judgeScenarioEvidence[3])).toEqual({
      domain: "Change containment",
      owner: "Architecture Review",
      riskPoints: 6,
      control: "Contain repair scope to approved ownership boundaries",
      evidenceStandard: "Changed-file allowlist and human approval gate",
      blockedGates: 2
    });
  });

  it("switches demo targets based on the selected scenario domain", () => {
    expect(getScenarioTargetIssues("frontend-contract").map((item) => item.id)).toEqual([
      "ISSUE-0001",
      "ISSUE-0002",
      "ISSUE-0003"
    ]);

    expect(getScenarioTargetIssues("secret-handling-guard").map((item) => item.id)).toEqual([
      "SEC-0142",
      "SEC-0147",
      "SEC-0154"
    ]);
  });
});
