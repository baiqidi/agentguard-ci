import { describe, expect, it } from "vitest";
import {
  renderJsonReport,
  renderJUnitReport,
  renderMarkdownReport,
  renderTestCloudEvidence
} from "../reports.js";
import type { ReliabilityScore } from "../types.js";

const passingScore: ReliabilityScore = {
  scenarioId: "frontend-contract",
  passed: true,
  totalPassed: 5,
  totalGates: 5,
  gates: {
    ciRecovery: { passed: true },
    rootCauseMatch: { passed: true },
    changeSafety: { passed: true },
    testIntegrity: { passed: true },
    humanApproval: { passed: true }
  }
};

const failingScore: ReliabilityScore = {
  ...passingScore,
  passed: false,
  totalPassed: 4,
  gates: {
    ...passingScore.gates,
    changeSafety: { passed: false, reason: "Unexpected changes: apps/api/src/issues.ts" }
  }
};

describe("report rendering", () => {
  it("renders JSON reports with scenario id and gate results", () => {
    const json = renderJsonReport(passingScore);

    expect(JSON.parse(json)).toMatchObject({
      scenarioId: "frontend-contract",
      passed: true,
      totalPassed: 5
    });
  });

  it("renders Markdown reports for human review", () => {
    const markdown = renderMarkdownReport(failingScore);

    expect(markdown).toContain("# AgentGuard Reliability Report");
    expect(markdown).toContain("Scenario: `frontend-contract`");
    expect(markdown).toContain("changeSafety");
    expect(markdown).toContain("Unexpected changes: apps/api/src/issues.ts");
  });

  it("renders JUnit XML with a failure node when a gate fails", () => {
    const junit = renderJUnitReport(failingScore);

    expect(junit).toContain('<testsuite name="AgentGuard CI" tests="5" failures="1">');
    expect(junit).toContain('<testcase name="changeSafety">');
    expect(junit).toContain('<failure message="Unexpected changes: apps/api/src/issues.ts" />');
  });

  it("renders UiPath Test Cloud evidence with gate status and review action", () => {
    const evidence = JSON.parse(renderTestCloudEvidence(failingScore));

    expect(evidence).toMatchObject({
      sourceSystem: "AgentGuard CI",
      targetPlatform: "UiPath Test Cloud",
      scenarioId: "frontend-contract",
      status: "failed",
      score: {
        passedGates: 4,
        totalGates: 5
      },
      method: {
        version: "agentguard-v1",
        strategy: "gated-repair-evidence",
        promotionRule: "All reliability gates must pass before automated promotion"
      },
      recommendedAction: "Route to human review before promotion"
    });
    expect(evidence.risk).toEqual({
      severity: "medium",
      owner: "Product Engineering",
      riskPoints: 3,
      control: "Verify UI contract scope before promotion",
      evidenceStandard: "Gate trace plus changed-file allowlist"
    });
    expect(evidence.gates).toContainEqual({
      name: "changeSafety",
      status: "failed",
      reason: "Unexpected changes: apps/api/src/issues.ts"
    });
    expect(evidence.attachments).toEqual(["report.json", "report.md", "junit.xml", "test-cloud-evidence.json"]);
  });
});
