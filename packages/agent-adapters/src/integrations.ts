export interface PublicAgentInstallCheck {
  id: string;
  framework: string;
  agentSurface: string;
  installPoint: string;
  evidenceCaptured: string[];
  validatedScenarios: string[];
  validatedEffect: string;
  validationMode: "contract-verified" | "deployment-validated";
  hostedCredentialClaim: boolean;
  sourceUrl: string;
}

export interface PublicAgentInstallSummary {
  frameworks: number;
  scenarioLinks: number;
  hostedCredentialClaims: number;
  deploymentValidatedChecks: number;
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
  },
  {
    id: "microsoft-graph-mail-calendar-agent",
    framework: "Microsoft Graph",
    agentSurface: "mail and calendar mutation APIs",
    installPoint: "evaluate message recipients, attachments, and send actions before Graph mutations",
    evidenceCaptured: ["recipient-domain-check", "attachment classification", "DLP approval state"],
    validatedScenarios: ["email-confidential-attachment"],
    validatedEffect: "Confidential outbound mail remains a draft until DLP and owner approval evidence exists.",
    validationMode: "contract-verified",
    hostedCredentialClaim: false,
    sourceUrl: "https://learn.microsoft.com/graph/api/user-sendmail"
  },
  {
    id: "slack-bolt-support-agent",
    framework: "Slack Bolt",
    agentSurface: "interactive message and workflow action handlers",
    installPoint: "score proposed support replies and peer-agent actions before acknowledging or posting",
    evidenceCaptured: ["conversation transcript", "policy match", "interactive action payload"],
    validatedScenarios: ["support-refund-escalation", "multi-agent-peer-override"],
    validatedEffect: "Support and peer-agent actions are routed to review instead of silently posting unsafe commitments.",
    validationMode: "contract-verified",
    hostedCredentialClaim: false,
    sourceUrl: "https://docs.slack.dev/tools/bolt-js/reference/"
  },
  {
    id: "salesforce-agentforce-crm-agent",
    framework: "Salesforce Agentforce",
    agentSurface: "CRM agent actions and quote updates",
    installPoint: "gate agent actions that mutate opportunities, quotes, discounts, or customer commitments",
    evidenceCaptured: ["quote draft", "discount policy", "approval route"],
    validatedScenarios: ["crm-discount-commitment", "finance-po-over-budget"],
    validatedEffect: "Revenue-impacting actions require named approval before CRM or procurement state changes.",
    validationMode: "contract-verified",
    hostedCredentialClaim: false,
    sourceUrl: "https://developer.salesforce.com/docs/ai/agentforce/guide/get-started-actions.html"
  },
  {
    id: "n8n-workflow-agent",
    framework: "n8n",
    agentSurface: "AI Agent node and workflow automation",
    installPoint: "score AI Agent node outputs before workflow nodes execute external side effects",
    evidenceCaptured: ["workflow diff", "tool call trace", "owner approval state"],
    validatedScenarios: ["workflow-production-deploy", "security-soc-blocklist"],
    validatedEffect: "Automation agents can prepare recommendations while execution waits for owner approval evidence.",
    validationMode: "contract-verified",
    hostedCredentialClaim: false,
    sourceUrl: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/"
  },
  {
    id: "splunk-mcp-server-security-agent",
    framework: "Splunk MCP Server",
    agentSurface: "security investigation, suppression, and containment over Splunk data through MCP",
    installPoint: "gate MCP-mediated search, suppression, and containment decisions before state changes or signal tuning",
    evidenceCaptured: ["notable-id", "search-job-id", "case-note", "review approval route"],
    validatedScenarios: [
      "security-soc-blocklist",
      "security-soc-evidence-preservation",
      "security-soc-alert-suppression"
    ],
    validatedEffect:
      "SOC agents can query and summarize through Splunk MCP while suppression and containment remain review-gated.",
    validationMode: "contract-verified",
    hostedCredentialClaim: false,
    sourceUrl: "https://help.splunk.com/en/splunk-cloud-platform/mcp-server-for-splunk-platform/configure-and-connect"
  },
  {
    id: "splunk-ai-assistant-spl",
    framework: "Splunk AI Assistant for SPL",
    agentSurface: "natural-language SPL generation, explanation, and optimization",
    installPoint: "preserve generated SPL, explanation context, and supporting evidence before analysts trust the conclusion",
    evidenceCaptured: ["generated SPL", "search-job-id", "supporting event sample"],
    validatedScenarios: ["security-soc-evidence-preservation", "security-soc-alert-suppression"],
    validatedEffect:
      "Generated SPL becomes reviewable evidence instead of an opaque assistant step in the investigation.",
    validationMode: "contract-verified",
    hostedCredentialClaim: false,
    sourceUrl: "https://help.splunk.com/en/splunk-cloud-platform/search/splunk-ai-assistant/1.5.0/use-splunk-ai-assistant-for-spl"
  },
  {
    id: "splunk-appinspect-companion-app",
    framework: "Splunk AppInspect",
    agentSurface: "companion app package validation and cloud-readiness review",
    installPoint: "validate saved searches, alert actions, metadata, and dashboards before the app is published or demoed",
    evidenceCaptured: ["appinspect report", "package manifest", "cloud-readiness findings"],
    validatedScenarios: ["security-soc-blocklist", "security-soc-alert-suppression"],
    validatedEffect:
      "The Splunk companion app is linted as a deployable surface instead of being presented as an unvalidated mock integration.",
    validationMode: "deployment-validated",
    hostedCredentialClaim: false,
    sourceUrl: "https://dev.splunk.com/enterprise/reference/packagingtoolkit/packagingtoolkitcli"
  },
  {
    id: "splunk-packaging-toolkit-companion-app",
    framework: "Splunk Packaging Toolkit",
    agentSurface: "buildable Splunk app artifact for dashboards, saved searches, and custom alert actions",
    installPoint: "package the companion app into a distributable tgz that can be inspected and uploaded",
    evidenceCaptured: ["packaged tgz", "savedsearches.conf", "alert_actions.conf"],
    validatedScenarios: ["security-soc-evidence-preservation", "security-soc-alert-suppression"],
    validatedEffect:
      "Review-gated saved searches and custom alert actions ship as a real Splunk app artifact instead of repo-only files.",
    validationMode: "deployment-validated",
    hostedCredentialClaim: false,
    sourceUrl: "https://dev.splunk.com/enterprise/reference/packagingtoolkit/packagingtoolkitcli"
  }
];

export function summarizePublicAgentInstallChecks(
  checks: PublicAgentInstallCheck[]
): PublicAgentInstallSummary {
  const frameworks = new Set(checks.map((check) => check.framework)).size;
  const scenarioLinks = checks.reduce((sum, check) => sum + check.validatedScenarios.length, 0);
  const hostedCredentialClaims = checks.filter((check) => check.hostedCredentialClaim).length;
  const deploymentValidatedChecks = checks.filter((check) => check.validationMode === "deployment-validated").length;

  return {
    frameworks,
    scenarioLinks,
    hostedCredentialClaims,
    deploymentValidatedChecks,
    coverageLabel: `${frameworks} public frameworks checked across ${scenarioLinks} scenario links`
  };
}
