import { describe, expect, it } from "vitest";
import { publicAgentInstallChecks, summarizePublicAgentInstallChecks } from "../integrations.js";

describe("public agent framework install checks", () => {
  it("documents no-key install contracts for real public agent frameworks", () => {
    expect(publicAgentInstallChecks.map((check) => check.id)).toEqual([
      "playwright-browser-agent",
      "langchain-hitl-agent",
      "crewai-flow-agent",
      "autogen-human-proxy-agent",
      "microsoft-graph-mail-calendar-agent",
      "slack-bolt-support-agent",
      "salesforce-agentforce-crm-agent",
      "n8n-workflow-agent"
    ]);
    expect(publicAgentInstallChecks.every((check) => check.validationMode === "contract-verified")).toBe(true);
    expect(publicAgentInstallChecks[0].validatedScenarios).toContain("browser-payment-approval");
    expect(publicAgentInstallChecks[1].validatedEffect).toContain("review");
  });

  it("summarizes framework coverage without claiming hosted credentials", () => {
    expect(summarizePublicAgentInstallChecks(publicAgentInstallChecks)).toEqual({
      frameworks: 8,
      scenarioLinks: 13,
      hostedCredentialClaims: 0,
      coverageLabel: "8 public frameworks contract-verified across 13 scenario links"
    });
  });
});
