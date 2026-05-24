import { describe, expect, it } from "vitest";
import { planScriptedFix } from "../scriptedAgent.js";

describe("planScriptedFix", () => {
  it("maps frontend contract failures to a safe model-layer patch", () => {
    const plan = planScriptedFix({
      scenarioId: "frontend-contract",
      failureLog: "expected ISSUE-0042 [HIGH] Checkout throws 500 but received ISSUE-0042 Checkout throws 500"
    });

    expect(plan).toMatchObject({
      status: "proposed",
      rootCause: "Issue priority type changed from string to enum",
      changedFiles: ["apps/web/src/issueModel.ts"],
      riskLevel: "low"
    });
  });

  it("maps backend triage failures to the priority classifier", () => {
    const plan = planScriptedFix({
      scenarioId: "backend-triage",
      failureLog: "expected priority high for production login outage but received medium"
    });

    expect(plan.status).toBe("proposed");
    expect(plan.changedFiles).toEqual(["apps/api/src/issues.ts"]);
    expect(plan.patchSummary).toContain("production outage");
  });

  it("refuses unknown failures instead of guessing", () => {
    const plan = planScriptedFix({
      scenarioId: "unknown",
      failureLog: "database connection reset by peer"
    });

    expect(plan).toEqual({
      status: "refused",
      rootCause: "Unknown failure signature",
      changedFiles: [],
      patchSummary: "No deterministic fix is available for this failure.",
      riskLevel: "high"
    });
  });
});

