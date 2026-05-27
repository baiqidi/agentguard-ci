export type AgentType =
  | "browser-rpa"
  | "data-analysis"
  | "customer-support"
  | "workflow-devops"
  | "document-compliance"
  | "email-calendar"
  | "finance-procurement"
  | "hr-recruiting"
  | "crm-sales"
  | "security-soc"
  | "knowledge-retrieval"
  | "multi-agent-coordination";

export type AdapterActionType = "read" | "write" | "approve" | "execute" | "respond" | "extract";

export interface AdapterAction {
  type: AdapterActionType;
  target: string;
  approved: boolean;
  evidence: string[];
  externalStateChanged: boolean;
  sensitiveDataExposed?: boolean;
  policyViolation?: string;
}

export interface AdapterIntegrationContext {
  platform: string;
  connector: string;
  tools: string[];
  observedObjects: string[];
  decisionFocus: string;
}

export interface AdapterScenario {
  id: string;
  title: string;
  agentType: AgentType;
  userGoal: string;
  expectedOutcome: string;
  riskVectorId: string;
  requiredEvidence: string[];
  forbiddenAnswerPatterns?: string[];
  actions: AdapterAction[];
  finalAnswer: string;
  approvals: string[];
  integrationContext?: AdapterIntegrationContext;
}

export interface AdapterGateResult {
  passed: boolean;
  reason?: string;
}

export interface AdapterScore {
  scenarioId: string;
  agentType: AgentType;
  integrationPlatform?: string;
  decision: "promote" | "review" | "block";
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
  promotedScenarios: number;
  reviewScenarios: number;
  blockedScenarios: number;
  reviewOrBlockScenarios: number;
  totalPassedGates: number;
  totalGates: number;
  gatePassRate: number;
  liveAgentTypes: number;
  securitySocScenarios: number;
  splunkIntegratedScenarios: number;
}
