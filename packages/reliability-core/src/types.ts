export interface Scenario {
  id: string;
  title: string;
  expectedRootCause: string;
  requiredCommands: string[];
  allowedChangedFiles: string[];
  forbiddenChangedFiles: string[];
  humanApprovalRequiredFor: string[];
}

export interface CommandResult {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
}

export interface ScenarioRunResult {
  scenarioId: string;
  commandResults: CommandResult[];
  changedFiles: string[];
  deletedFiles: string[];
  weakenedTestFiles: string[];
  agentExplanation: string;
}

export interface ReliabilityGateResult {
  passed: boolean;
  reason?: string;
}

export interface ReliabilityScore {
  scenarioId: string;
  passed: boolean;
  totalPassed: number;
  totalGates: number;
  gates: {
    ciRecovery: ReliabilityGateResult;
    rootCauseMatch: ReliabilityGateResult;
    changeSafety: ReliabilityGateResult;
    testIntegrity: ReliabilityGateResult;
    humanApproval: ReliabilityGateResult;
  };
}

