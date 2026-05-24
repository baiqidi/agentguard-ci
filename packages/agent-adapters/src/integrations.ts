export interface PublicAgentInstallCheck {
  id: string;
  framework: string;
  agentSurface: string;
  installPoint: string;
  evidenceCaptured: string[];
  validatedScenarios: string[];
  validatedEffect: string;
  validationMode: "contract-verified";
  hostedCredentialClaim: boolean;
  sourceUrl: string;
}

export interface PublicAgentInstallSummary {
  frameworks: number;
  scenarioLinks: number;
  hostedCredentialClaims: number;
  coverageLabel: string;
}

export const publicAgentInstallChecks: PublicAgentInstallCheck[] = [
  {
    id: "playwright-browser-agent",
    framework: "Playwright",
    agentSurface: "browser automation action trace",
    installPoint: "wrap page actions before irreversible clicks or form submissions",
    evidenceCaptured: ["browser action trace", "approval-state", "DOM or screenshot artifact"],
    validatedScenarios: ["browser-payment-approval"],
    validatedEffect: "Irreversible browser payment approval is blocked before external state changes.",
    validationMode: "contract-verified",
    hostedCredentialClaim: false,
    sourceUrl: "https://playwright.dev/docs/next/trace-viewer-intro"
  },
  {
    id: "langchain-hitl-agent",
    framework: "LangChain",
    agentSurface: "agent tool-call middleware",
    installPoint: "evaluate proposed tool calls before execution and turn unsafe calls into interrupts",
    evidenceCaptured: ["tool call", "interrupt decision", "review action"],
    validatedScenarios: ["data-pii-query-leak", "workflow-production-deploy"],
    validatedEffect: "Sensitive or state-changing tool calls route to review before execution.",
    validationMode: "contract-verified",
    hostedCredentialClaim: false,
    sourceUrl: "https://docs.langchain.com/oss/python/langchain/human-in-the-loop"
  },
  {
    id: "crewai-flow-agent",
    framework: "CrewAI",
    agentSurface: "crew task, flow, and guardrail callback",
    installPoint: "score task outputs and flow transitions before a crew mutates external systems",
    evidenceCaptured: ["task output", "flow state", "guardrail finding"],
    validatedScenarios: ["support-refund-escalation", "workflow-production-deploy"],
    validatedEffect: "Support and workflow agents produce reviewable guardrail findings instead of silent side effects.",
    validationMode: "contract-verified",
    hostedCredentialClaim: false,
    sourceUrl: "https://docs.crewai.com/"
  },
  {
    id: "autogen-human-proxy-agent",
    framework: "AutoGen",
    agentSurface: "human proxy approval loop",
    installPoint: "require a human proxy decision for high-risk approve or execute actions",
    evidenceCaptured: ["assistant proposal", "user proxy event", "approval text"],
    validatedScenarios: ["support-refund-escalation"],
    validatedEffect: "High-risk actions wait for explicit human approval before the agent can continue.",
    validationMode: "contract-verified",
    hostedCredentialClaim: false,
    sourceUrl: "https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/human-in-the-loop.html"
  }
];

export function summarizePublicAgentInstallChecks(
  checks: PublicAgentInstallCheck[]
): PublicAgentInstallSummary {
  const frameworks = new Set(checks.map((check) => check.framework)).size;
  const scenarioLinks = checks.reduce((sum, check) => sum + check.validatedScenarios.length, 0);
  const hostedCredentialClaims = checks.filter((check) => check.hostedCredentialClaim).length;

  return {
    frameworks,
    scenarioLinks,
    hostedCredentialClaims,
    coverageLabel: `${frameworks} public frameworks contract-verified across ${scenarioLinks} scenario links`
  };
}
