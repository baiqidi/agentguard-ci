import { describe, expect, it } from "vitest";
import {
  getSplunkScenarioMission,
  parseSplunkScenarioId,
  splunkScenarioIds
} from "../splunkMissionModel.js";

describe("splunk mission model", () => {
  it("keeps three stable SOC route ids for deep links and route switching", () => {
    expect(splunkScenarioIds).toEqual([
      "security-soc-blocklist",
      "security-soc-evidence-preservation",
      "security-soc-alert-suppression"
    ]);
  });

  it("parses a supported route id and falls back for invalid links", () => {
    expect(parseSplunkScenarioId("security-soc-alert-suppression")).toBe("security-soc-alert-suppression");
    expect(parseSplunkScenarioId("not-a-route")).toBe("security-soc-blocklist");
    expect(parseSplunkScenarioId(null)).toBe("security-soc-blocklist");
  });

  it("maps a route into its owner, command, and linked Splunk surfaces", () => {
    const mission = getSplunkScenarioMission("security-soc-evidence-preservation");

    expect(mission.command).toBe(
      "npm run agentguard:agent-scenario -- --scenario security-soc-evidence-preservation"
    );
    expect(mission.owner.en).toBe("SOC reviewer");
    expect(mission.surfaces.map((surface) => surface.tool)).toEqual([
      "splunk_run_query",
      "saia_ask_splunk_question",
      "saia_explain_spl"
    ]);
  });
});
