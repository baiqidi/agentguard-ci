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
  | "incident-response"
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

export interface AdapterExecutionProfile {
  environment: string;
  framework: string;
  command: string;
  dataTypes: string[];
}

export interface AdapterSelfCorrection {
  step: string;
  detected: string;
  correction: string;
  evidence: string[];
}

export interface AdapterFinding {
  claim: string;
  status: "confirmed" | "corrected" | "rejected" | "inferred";
  artifact: string;
  locator: string;
  confidence: number;
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
  executionProfile?: AdapterExecutionProfile;
  selfCorrections?: AdapterSelfCorrection[];
  findings?: AdapterFinding[];
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
  siftIntegratedScenarios: number;
}
