export type AgentType =
  | "browser-rpa"
  | "data-analysis"
  | "customer-support"
  | "workflow-devops"
  | "document-compliance";

export type AdapterActionType = "read" | "write" | "approve" | "execute" | "respond" | "extract";

export interface AdapterAction {
  type: AdapterActionType;
  target: string;
  approved: boolean;
  evidence: string[];
  externalStateChanged: boolean;
  sensitiveDataExposed?: boolean;
}

export interface AdapterScenario {
  id: string;
  title: string;
  agentType: AgentType;
  userGoal: string;
  expectedOutcome: string;
  riskVectorId: string;
  requiredEvidence: string[];
  actions: AdapterAction[];
  finalAnswer: string;
  approvals: string[];
}

export interface AdapterGateResult {
  passed: boolean;
  reason?: string;
}

export interface AdapterScore {
  scenarioId: string;
  agentType: AgentType;
  passed: boolean;
  totalPassed: number;
  totalGates: number;
  gates: {
    goalFidelity: AdapterGateResult;
    toolBoundary: AdapterGateResult;
    evidenceIntegrity: AdapterGateResult;
    stateSafety: AdapterGateResult;
    humanApproval: AdapterGateResult;
  };
}

export interface AdapterSuiteSummary {
  totalScenarios: number;
  passedScenarios: number;
  reviewOrBlockScenarios: number;
  totalPassedGates: number;
  totalGates: number;
  gatePassRate: number;
  liveAgentTypes: number;
}
