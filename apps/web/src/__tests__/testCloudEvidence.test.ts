import { describe, expect, it } from "vitest";
import {
  agentProfiles,
  agentRiskVectors,
  buildScenarioAnalysis,
  buildConsoleSummary,
  buildOptimizationSummary,
  buildOwnerReviewQueue,
  buildRiskAssuranceSummary,
  buildReleaseDecisionSummary,
  competitiveAdvantageCards,
  evidenceTone,
  failureModeTaxonomy,
  formatGateLabel,
  judgeScenarioEvidence,
  realEvidenceChain,
  operatorWorkflowSteps,
  researchBackedProtocol,
  scenarioRiskProfiles,
  scenarioExpansionCandidates,
  summarizeAgentCoverage,
  summarizeAgentRiskRadar,
  summarizeFailureAtlas,
  summarizeScenarioWorkbench,
  summarizeResearchProtocol,
  universalReliabilityGates
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

  it("summarizes risk assurance for executive review", () => {
    expect(buildRiskAssuranceSummary(judgeScenarioEvidence, scenarioRiskProfiles)).toEqual({
      totalRiskPoints: 131,
      blockedRiskPoints: 106,
      criticalFindings: 5,
      topReviewOwner: "Security Review",
      assuranceLabel: "106 risk points stopped before promotion",
      controlLabel: "5 critical findings need named-owner approval"
    });
  });

  it("builds a review queue ordered by blocked risk", () => {
    expect(buildOwnerReviewQueue(judgeScenarioEvidence, scenarioRiskProfiles).slice(0, 4)).toEqual([
      { owner: "Security Review", riskPoints: 24, findings: 3 },
      { owner: "Test Governance", riskPoints: 17, findings: 3 },
      { owner: "Release Owner", riskPoints: 16, findings: 3 },
      { owner: "Architecture Review", riskPoints: 14, findings: 2 }
    ]);
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

  it("frames AgentGuard as a general agent reliability platform with truthful live coverage", () => {
    expect(agentProfiles.map((profile) => profile.id)).toEqual([
      "code-repair",
      "browser-rpa",
      "data-analysis",
      "customer-support",
      "workflow-devops",
      "document-compliance",
      "email-calendar",
      "finance-procurement",
      "hr-recruiting",
      "crm-sales",
      "security-soc",
      "knowledge-retrieval",
      "multi-agent-coordination"
    ]);
    expect(summarizeAgentCoverage(agentProfiles)).toEqual({
      totalProfiles: 13,
      liveProfiles: 1,
      localValidatedProfiles: 12,
      blueprintProfiles: 0,
      liveScenarioCount: 24,
      localScenarioCount: 12,
      blueprintScenarioCount: 0,
      coverageLabel: "1 live adapter + 12 live-local adapters"
    });
  });

  it("defines universal reliability gates that apply beyond code repair", () => {
    expect(universalReliabilityGates.map((gate) => gate.id)).toEqual([
      "goal-fidelity",
      "tool-boundary",
      "evidence-integrity",
      "state-safety",
      "human-approval"
    ]);
    expect(universalReliabilityGates[1].appliesTo).toContain("browser-rpa");
    expect(universalReliabilityGates[1].appliesTo).toContain("security-soc");
    expect(universalReliabilityGates[2].appliesTo).toContain("data-analysis");
    expect(universalReliabilityGates[2].appliesTo).toContain("knowledge-retrieval");
  });

  it("summarizes universal agent failure mode radar coverage", () => {
    expect(agentRiskVectors.map((vector) => vector.id)).toEqual([
      "instruction-attack",
      "excessive-agency",
      "tool-misuse",
      "data-leakage",
      "evidence-loss",
      "state-drift",
      "approval-bypass",
      "runtime-fragility"
    ]);
    expect(summarizeAgentRiskRadar(agentRiskVectors)).toEqual({
      totalVectors: 8,
      liveVectors: 8,
      blueprintVectors: 8,
      highestPressureVector: "Excessive Agency",
      coverageLabel: "8/8 universal vectors covered by live and local adapter controls"
    });
  });

  it("defines an operator workflow for first-time users", () => {
    expect(operatorWorkflowSteps.map((step) => step.id)).toEqual([
      "install",
      "run-suite",
      "run-agent-suite",
      "review-evidence",
      "import-test-cloud"
    ]);
    expect(operatorWorkflowSteps[1]).toMatchObject({
      command: "npm run agentguard:suite",
      artifact: "agentguard-runs/suite-summary.md"
    });
    expect(operatorWorkflowSteps[2]).toMatchObject({
      command: "npm run agentguard:agent-suite",
      artifact: "agentguard-runs/agent-adapters/agent-adapter-suite-summary.md"
    });
  });

  it("prioritizes live scenario analysis by risk, pressure, and reviewer action", () => {
    const analysis = buildScenarioAnalysis(judgeScenarioEvidence, scenarioRiskProfiles, agentRiskVectors);

    expect(analysis).toHaveLength(24);
    expect(analysis[0]).toMatchObject({
      scenarioId: "auth-bypass-shortcut",
      owner: "Security Review",
      riskVectorId: "excessive-agency",
      riskPoints: 8,
      command: "npm run agentguard:scenario -- --scenario auth-bypass-shortcut"
    });
    expect(analysis.slice(0, 4).map((item) => item.scenarioId)).toEqual([
      "auth-bypass-shortcut",
      "large-refactor-drift",
      "secret-handling-guard",
      "data-migration-risk"
    ]);
  });

  it("summarizes expansion scenarios for non-code agent coverage", () => {
    const analysis = buildScenarioAnalysis(judgeScenarioEvidence, scenarioRiskProfiles, agentRiskVectors);

    expect(scenarioExpansionCandidates).toHaveLength(13);
    expect(scenarioExpansionCandidates.map((candidate) => candidate.agentProfileId)).toEqual([
      "browser-rpa",
      "data-analysis",
      "customer-support",
      "workflow-devops",
      "document-compliance",
      "multi-agent-coordination",
      "workflow-devops",
      "email-calendar",
      "finance-procurement",
      "hr-recruiting",
      "crm-sales",
      "security-soc",
      "document-compliance"
    ]);
    expect(summarizeScenarioWorkbench(analysis, scenarioExpansionCandidates)).toEqual({
      liveScenarioCount: 24,
      criticalLiveScenarios: 5,
      expansionCandidateCount: 13,
      criticalExpansionCandidates: 5,
      firstRunCommand: "npm run agentguard:suite",
      topLiveScenarioId: "auth-bypass-shortcut",
      topExpansionCandidateId: "finance-duplicate-payment-release"
    });
  });
});
