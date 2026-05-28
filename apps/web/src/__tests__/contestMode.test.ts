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

  it("detects SANS FIND EVIL mode from the URL search string", () => {
    expect(getContestMode("?contest=sans")).toBe("sans");
    expect(getContestEvidenceTarget("sans")).toBe("SANS SIFT Workstation + Protocol SIFT MCP");
    expect(getContestEvidenceArtifact("sans")).toBe("sift-ir-evidence.json");
    expect(getContestTrackBadge("sans")).toEqual({
      label: "FIND EVIL",
      value: "Protocol SIFT IR"
    });
  });

  it("preserves default mode when no contest is provided", () => {
    expect(getContestMode("")).toBe("default");
    expect(getContestEvidenceTarget("default")).toBe("UiPath Test Cloud");
    expect(getContestEvidenceArtifact("default")).toBe("test-cloud-evidence.json");
  });
});
