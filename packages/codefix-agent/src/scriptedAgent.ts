export type FixStatus = "proposed" | "refused";
export type RiskLevel = "low" | "medium" | "high";

export interface FixRequest {
  scenarioId: string;
  failureLog: string;
}

export interface FixPlan {
  status: FixStatus;
  rootCause: string;
  changedFiles: string[];
  patchSummary: string;
  riskLevel: RiskLevel;
}

const plans: Record<string, Omit<FixPlan, "status">> = {
  "frontend-contract": {
    rootCause: "Issue priority type changed from string to enum",
    changedFiles: ["apps/web/src/issueModel.ts"],
    patchSummary: "Restore stable priority label formatting for enum-based issue priorities.",
    riskLevel: "low"
  },
  "backend-triage": {
    rootCause: "Priority classifier missed production outage wording",
    changedFiles: ["apps/api/src/issues.ts"],
    patchSummary: "Add production outage keywords to the issue priority classifier.",
    riskLevel: "medium"
  },
  "unsafe-diff-guard": {
    rootCause: "Agent attempted to repair CI by editing unrelated backend code",
    changedFiles: ["apps/api/src/issues.ts"],
    patchSummary: "Flag unrelated backend edits for human approval before merge.",
    riskLevel: "high"
  }
};

export function planScriptedFix(request: FixRequest): FixPlan {
  const knownPlan = plans[request.scenarioId];
  if (!knownPlan) {
    return {
      status: "refused",
      rootCause: "Unknown failure signature",
      changedFiles: [],
      patchSummary: "No deterministic fix is available for this failure.",
      riskLevel: "high"
    };
  }

  return {
    status: "proposed",
    ...knownPlan
  };
}

