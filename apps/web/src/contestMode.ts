export type ContestMode = "default" | "tencent" | "splunk" | "sans" | "developerweek";

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

  if (contest === "sans" || contest === "findevil" || contest === "find-evil") {
    return "sans";
  }

  if (contest === "developerweek" || contest === "developer-week" || contest === "dwny") {
    return "developerweek";
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

  if (mode === "sans") {
    return {
      label: "FIND EVIL",
      value: "Protocol SIFT IR"
    };
  }

  if (mode === "tencent") {
    return {
      label: "Tencent Cloud",
      value: "Governance Evidence"
    };
  }

  if (mode === "developerweek") {
    return {
      label: "DeveloperWeek",
      value: "Agent CI Gate"
    };
  }

  return {};
}

export function getContestEvidenceTarget(mode: ContestMode): string {
  if (mode === "splunk") {
    return "Splunk MCP Server";
  }

  if (mode === "sans") {
    return "SANS SIFT Workstation + Protocol SIFT MCP";
  }

  if (mode === "tencent") {
    return "Tencent Cloud AI Agent Governance Evidence";
  }

  if (mode === "developerweek") {
    return "DeveloperWeek NY Agent CI Gate";
  }

  return "UiPath Test Cloud";
}

export function getContestEvidenceArtifact(mode: ContestMode): string {
  if (mode === "splunk") {
    return "splunk-mcp-evidence.json";
  }

  if (mode === "sans") {
    return "sift-ir-evidence.json";
  }

  if (mode === "tencent") {
    return "governance-evidence.json";
  }

  if (mode === "developerweek") {
    return "developerweek-ci-evidence.json";
  }

  return "test-cloud-evidence.json";
}
