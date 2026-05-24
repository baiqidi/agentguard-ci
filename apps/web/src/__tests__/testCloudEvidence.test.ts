import { describe, expect, it } from "vitest";
import {
  buildConsoleSummary,
  buildOptimizationSummary,
  buildReleaseDecisionSummary,
  competitiveAdvantageCards,
  evidenceTone,
  failureModeTaxonomy,
  formatGateLabel,
  judgeScenarioEvidence,
  realEvidenceChain,
  researchBackedProtocol,
  summarizeFailureAtlas,
  summarizeResearchProtocol
} from "../testCloudEvidence.js";

describe("test cloud evidence view model", () => {
  it("summarizes the scenario portfolio for judge review", () => {
    expect(buildConsoleSummary(judgeScenarioEvidence)).toEqual({
      totalScenarios: 24,
      passedScenarios: 7,
      governanceFindings: 17,
      totalPassedGates: 88,
      totalGates: 120,
      passRateLabel: "73%"
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
      "concurrency-race",
      "prompt-injection-override",
      "snapshot-blessing-abuse",
      "auth-bypass-shortcut",
      "input-validation-gap",
      "observability-removal",
      "rollback-flag-missing",
      "cross-platform-path-case",
      "timezone-edge-case",
      "accessibility-regression",
      "license-policy-risk",
      "large-refactor-drift",
      "nondeterministic-random-fix"
    ]);
  });

  it("summarizes the product release decision for judge review", () => {
    expect(buildReleaseDecisionSummary(judgeScenarioEvidence)).toEqual({
      autoPromotions: 7,
      reviewRequired: 17,
      hardBlocks: 12,
      decisionLabel: "7 can promote, 17 need review",
      thresholdLabel: "Promote only when all 5 reliability gates pass",
      executiveSummary:
        "AgentGuard separates green CI from safe repair by checking root cause, diff scope, test integrity, and approval readiness."
    });
  });

  it("summarizes performance optimization from targeted scenario selection", () => {
    expect(buildOptimizationSummary(judgeScenarioEvidence)).toEqual({
      targetedMinutes: 118,
      baselineMinutes: 391,
      savedMinutes: 273,
      savedPercentLabel: "70%",
      highestRiskArea: "Refactor drift",
      recommendation: "Run targeted agent-reliability scenarios first, then expand only blocked paths to full regression."
    });
  });

  it("frames advantages against adjacent test intelligence products", () => {
    expect(competitiveAdvantageCards).toHaveLength(4);
    expect(competitiveAdvantageCards.map((card) => card.referenceCategory)).toEqual([
      "Predictive test selection",
      "Test observability",
      "CI test optimization",
      "Risk-based testing"
    ]);
    expect(competitiveAdvantageCards[0].agentGuardAdvantage).toContain("agent behavior gates");
  });

  it("maps every scenario into a complete failure atlas", () => {
    expect(summarizeFailureAtlas(failureModeTaxonomy)).toEqual({
      totalDomains: 6,
      totalFailureModes: 24,
      coverageLabel: "24 failure modes across 6 reliability domains"
    });
    const atlasScenarioIds = failureModeTaxonomy.flatMap((domain) => domain.scenarioIds).sort();
    const evidenceScenarioIds = judgeScenarioEvidence.map((scenario) => scenario.id).sort();
    expect(atlasScenarioIds).toEqual(evidenceScenarioIds);
  });

  it("shows a real command-backed evidence chain", () => {
    expect(realEvidenceChain.map((step) => step.artifact)).toEqual([
      "npm test",
      "npm run build",
      "npm run agentguard:suite",
      "agentguard-runs/suite-summary.json",
      "uipath/test-cloud-import.csv"
    ]);
    expect(realEvidenceChain[2].proof).toContain("24 scenarios");
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
