export interface ContestEvidenceConfig {
  targetPlatform: string;
  evidenceArtifact: string;
  evidenceLabel: string;
}

export function getContestEvidenceConfig(): ContestEvidenceConfig {
  const contest = process.env.AGENTGUARD_CONTEST?.toLowerCase();

  if (contest === "splunk") {
    return {
      targetPlatform: "Splunk MCP Server",
      evidenceArtifact: "splunk-mcp-evidence.json",
      evidenceLabel: "Splunk MCP evidence"
    };
  }

  if (contest === "tencent") {
    return {
      targetPlatform: "Tencent Cloud AI Agent Governance Evidence",
      evidenceArtifact: "governance-evidence.json",
      evidenceLabel: "Governance evidence"
    };
  }

  return {
    targetPlatform: "UiPath Test Cloud",
    evidenceArtifact: "test-cloud-evidence.json",
    evidenceLabel: "Test Cloud evidence"
  };
}
