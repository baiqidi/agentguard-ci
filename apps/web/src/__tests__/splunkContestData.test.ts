import { describe, expect, it } from "vitest";
import {
  getSplunkContestCopy,
  splunkDeploymentCards,
  splunkScenarioCards,
  splunkSurfaceCards,
  summarizeSplunkContestSurface
} from "../splunkContestData.js";

describe("splunk contest data", () => {
  it("defines six official Splunk tool surfaces, five delivery assets, and three SOC spotlight scenarios", () => {
    expect(splunkSurfaceCards.map((card) => card.tool)).toEqual([
      "splunk_run_query",
      "splunk_get_knowledge_objects",
      "saia_ask_splunk_question",
      "saia_generate_spl",
      "saia_explain_spl",
      "saia_optimize_spl"
    ]);
    expect(splunkDeploymentCards).toHaveLength(5);
    expect(splunkScenarioCards.map((card) => card.id)).toEqual([
      "security-soc-blocklist",
      "security-soc-evidence-preservation",
      "security-soc-alert-suppression"
    ]);
  });

  it("summarizes the Splunk contest surface for metric cards", () => {
    expect(summarizeSplunkContestSurface()).toEqual({
      socScenarios: 3,
      mcpTools: 6,
      approvalGatedScenarios: 2,
      deploymentArtifacts: 5,
      splunkSurfaces: 4
    });
  });

  it("keeps localized contest copy aligned across English and Chinese", () => {
    expect(getSplunkContestCopy("en").title).toContain("Splunk");
    expect(getSplunkContestCopy("zh").kicker).toBe("Splunk Security Surface");
  });
});
