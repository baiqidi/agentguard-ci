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
      "n8n-workflow-agent",
      "splunk-mcp-server-security-agent",
      "splunk-ai-assistant-spl",
      "splunk-appinspect-companion-app",
      "splunk-packaging-toolkit-companion-app"
    ]);
    expect(publicAgentInstallChecks.filter((check) => check.validationMode === "deployment-validated")).toHaveLength(2);
    expect(publicAgentInstallChecks[0].validatedScenarios).toContain("browser-payment-approval");
    expect(publicAgentInstallChecks[1].validatedEffect).toContain("review");
    expect(publicAgentInstallChecks[8].validatedScenarios).toContain("security-soc-blocklist");
  });

  it("summarizes framework coverage without claiming hosted credentials", () => {
    expect(summarizePublicAgentInstallChecks(publicAgentInstallChecks)).toEqual({
      frameworks: 12,
      scenarioLinks: 22,
      hostedCredentialClaims: 0,
      deploymentValidatedChecks: 2,
      coverageLabel: "12 public frameworks checked across 22 scenario links"
    });
  });
});
