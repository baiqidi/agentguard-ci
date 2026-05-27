import { describe, expect, it } from "vitest";
import {
  getContestEvidenceArtifact,
  getContestEvidenceTarget,
  getContestMode,
  getContestTrackBadge
} from "../contestMode.js";

describe("contest mode helpers", () => {
  it("detects splunk mode from the URL search string", () => {
    expect(getContestMode("?contest=splunk")).toBe("splunk");
    expect(getContestEvidenceTarget("splunk")).toBe("Splunk MCP Server");
    expect(getContestEvidenceArtifact("splunk")).toBe("splunk-mcp-evidence.json");
    expect(getContestTrackBadge("splunk")).toEqual({
      label: "Track",
      value: "Security + MCP"
    });
  });

  it("preserves default mode when no contest is provided", () => {
    expect(getContestMode("")).toBe("default");
    expect(getContestEvidenceTarget("default")).toBe("UiPath Test Cloud");
    expect(getContestEvidenceArtifact("default")).toBe("test-cloud-evidence.json");
  });
});
