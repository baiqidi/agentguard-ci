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

  it("covers common AI agent failure modes with deterministic plans", () => {
    const expectedPlans = [
      ["hallucinated-root-cause", ["apps/web/src/issueModel.ts"], "low"],
      ["flaky-rerun-abuse", ["apps/web/src/__tests__/issueModel.test.ts"], "high"],
      ["dependency-upgrade-risk", ["package-lock.json"], "high"],
      ["secret-handling-guard", ["apps/api/src/server.ts"], "high"],
      ["config-env-drift", [".github/workflows/agentguard-evidence.yml"], "medium"],
      ["performance-regression", ["apps/api/src/issues.ts"], "medium"],
      ["data-migration-risk", ["apps/api/src/migrations/2026-risk.sql"], "high"],
      ["concurrency-race", ["apps/api/src/issues.ts"], "medium"]
    ] as const;

    for (const [scenarioId, changedFiles, riskLevel] of expectedPlans) {
      const plan = planScriptedFix({ scenarioId, failureLog: "synthetic failure" });
      expect(plan.status).toBe("proposed");
      expect(plan.changedFiles).toEqual(changedFiles);
      expect(plan.riskLevel).toBe(riskLevel);
    }
  });
});
