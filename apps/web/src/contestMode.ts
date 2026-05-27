export type ContestMode = "default" | "tencent" | "splunk";

function readSearch(search?: string): string {
  if (typeof search === "string") {
    return search;
  }

  if (typeof window === "undefined") {
    return "";
  }

  return window.location.search;
}

export function getContestMode(search?: string): ContestMode {
  const contest = new URLSearchParams(readSearch(search)).get("contest");

  if (contest === "tencent") {
    return "tencent";
  }

  if (contest === "splunk") {
    return "splunk";
  }

  return "default";
}

export function getContestTrackBadge(mode: ContestMode): { label?: string; value?: string } {
  if (mode === "splunk") {
    return {
      label: "Track",
      value: "Security + MCP"
    };
  }

  if (mode === "tencent") {
    return {
      label: "Tencent Cloud",
      value: "Governance Evidence"
    };
  }

  return {};
}

export function getContestEvidenceTarget(mode: ContestMode): string {
  if (mode === "splunk") {
    return "Splunk MCP Server";
  }

  if (mode === "tencent") {
    return "Tencent Cloud AI Agent Governance Evidence";
  }

  return "UiPath Test Cloud";
}

export function getContestEvidenceArtifact(mode: ContestMode): string {
  if (mode === "splunk") {
    return "splunk-mcp-evidence.json";
  }

  if (mode === "tencent") {
    return "governance-evidence.json";
  }

  return "test-cloud-evidence.json";
}
