import { useMemo, useState } from "react";
import { formatIssueLabel, priorityTone, summarizeIssue, type IssueSummary } from "./issueModel.js";
import {
  buildConsoleSummary,
  buildOptimizationSummary,
  buildOwnerReviewQueue,
  buildRiskAssuranceSummary,
  buildReleaseDecisionSummary,
  competitiveAdvantageCards,
  evidenceTone,
  failureModeTaxonomy,
  findScenarioRiskProfile,
  formatGateLabel,
  judgeScenarioEvidence,
  realEvidenceChain,
  researchBackedProtocol,
  scenarioRiskProfiles,
  summarizeFailureAtlas,
  summarizeResearchProtocol,
  type CompetitiveAdvantageCard,
  type EvidenceTone,
  type FailureModeDomain,
  type OwnerReviewQueueItem,
  type RealEvidenceStep,
  type ResearchProtocolPrinciple,
  type RiskAssuranceSummary,
  type ScenarioEvidence
} from "./testCloudEvidence.js";
import "./App.css";

const sampleIssues: IssueSummary[] = [
  {
    id: "ISSUE-0001",
    title: "Production login is down",
    priority: "high",
    status: "open"
  },
  {
    id: "ISSUE-0002",
    title: "Auth token leak in callback flow",
    priority: "critical",
    status: "triaged"
  },
  {
    id: "ISSUE-0003",
    title: "Settings copy typo",
    priority: "low",
    status: "resolved"
  }
];

const toneLabels: Record<EvidenceTone, string> = {
  success: "Ready",
  warning: "Review",
  danger: "Blocked"
};

export function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(judgeScenarioEvidence[0].id);
  const summary = useMemo(() => buildConsoleSummary(judgeScenarioEvidence), []);
  const releaseDecision = useMemo(() => buildReleaseDecisionSummary(judgeScenarioEvidence), []);
  const optimizationSummary = useMemo(() => buildOptimizationSummary(judgeScenarioEvidence), []);
  const protocolSummary = useMemo(() => summarizeResearchProtocol(researchBackedProtocol), []);
  const atlasSummary = useMemo(() => summarizeFailureAtlas(failureModeTaxonomy), []);
  const riskAssurance = useMemo(() => buildRiskAssuranceSummary(judgeScenarioEvidence, scenarioRiskProfiles), []);
  const ownerQueue = useMemo(() => buildOwnerReviewQueue(judgeScenarioEvidence, scenarioRiskProfiles), []);
  const selectedScenario =
    judgeScenarioEvidence.find((scenario) => scenario.id === selectedScenarioId) ?? judgeScenarioEvidence[0];

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="hero-copy">
          <h1>AgentGuard CI</h1>
          <p>
            Agent reliability firewall for proving whether AI code-fixing agents deserve promotion, review,
            or a hard block.
          </p>
        </div>
        <div className="topbar-actions" aria-label="Submission status">
          <span>Track 3</span>
          <strong>Test Cloud</strong>
        </div>
      </header>

      <section className="decision-hero" aria-label="Release decision summary">
        <div className="decision-copy">
          <span>Release Decision</span>
          <h2>{releaseDecision.decisionLabel}</h2>
          <p>{releaseDecision.executiveSummary}</p>
        </div>
        <div className="decision-metrics">
          <DecisionMetric label="Auto-promote" value={releaseDecision.autoPromotions} tone="safe" />
          <DecisionMetric label="Needs review" value={releaseDecision.reviewRequired} tone="watch" />
          <DecisionMetric label="Hard block" value={releaseDecision.hardBlocks} tone="stop" />
        </div>
        <p className="decision-threshold">{releaseDecision.thresholdLabel}</p>
      </section>

      <RiskAssurancePanel ownerQueue={ownerQueue} riskAssurance={riskAssurance} />

      <section className="trace-band" aria-label="AgentGuard reliability flow">
        <TraceStep index="01" title="Replay failure" detail="Realistic repository scenario" />
        <TraceStep index="02" title="Observe agent" detail="Commands, patch, explanation" />
        <TraceStep index="03" title="Score gates" detail="CI, root cause, diff, tests, approval" />
        <TraceStep index="04" title="Attach evidence" detail="JUnit, Markdown, JSON, Test Cloud packet" />
      </section>

      <section className="summary-grid" aria-label="Portfolio summary">
        <Metric label="Scenarios" value={`${summary.passedScenarios}/${summary.totalScenarios}`} detail="safe promotions" />
        <Metric label="Gate Pass Rate" value={summary.passRateLabel} detail={`${summary.totalPassedGates}/${summary.totalGates} gates`} />
        <Metric label="Findings" value={String(summary.governanceFindings)} detail="routed to review" />
        <Metric label="Protocol" value={String(protocolSummary.principleCount)} detail="research principles" />
      </section>

      <MoatPanel />

      <FailureAtlasPanel atlasSummary={atlasSummary} />

      <section className="console-grid">
        <section className="scenario-panel" aria-label="Reliability scenario matrix">
          <div className="panel-heading">
            <div>
              <h2>Reliability Matrix</h2>
              <p>{summary.totalScenarios} governed cases mapped to UiPath Test Cloud.</p>
            </div>
          </div>
          <div className="scenario-list">
            {judgeScenarioEvidence.map((scenario) => (
              <ScenarioRow
                key={scenario.id}
                scenario={scenario}
                selected={scenario.id === selectedScenario.id}
                onSelect={() => setSelectedScenarioId(scenario.id)}
              />
            ))}
          </div>
        </section>

        <EvidencePanel scenario={selectedScenario} />
      </section>

      <section className="details-grid">
        <GatePanel scenario={selectedScenario} />
        <IssueTargetPanel />
      </section>

      <OptimizationPanel selectedScenario={selectedScenario} optimizationSummary={optimizationSummary} />

      <EvidenceChainPanel />

      <ResearchPanel protocolSummary={protocolSummary.headline} />
    </main>
  );
}

function DecisionMetric({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: "safe" | "watch" | "stop";
}) {
  return (
    <article className={`decision-metric decision-${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function TraceStep({ index, title, detail }: { index: string; title: string; detail: string }) {
  return (
    <article className="trace-step">
      <span>{index}</span>
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
    </article>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function ScenarioRow({
  scenario,
  selected,
  onSelect
}: {
  scenario: ScenarioEvidence;
  selected: boolean;
  onSelect: () => void;
}) {
  const tone = evidenceTone(scenario);

  return (
    <button className={`scenario-row ${selected ? "is-selected" : ""}`} type="button" onClick={onSelect}>
      <span className={`status-rail tone-${tone}`} aria-hidden="true" />
      <span className="scenario-copy">
        <strong>{scenario.title}</strong>
        <span>{scenario.testCaseId}</span>
      </span>
      <span className="scenario-score">{`${scenario.score.passedGates}/${scenario.score.totalGates}`}</span>
      <span className={`scenario-state tone-${tone}`}>{toneLabels[tone]}</span>
    </button>
  );
}

function EvidencePanel({ scenario }: { scenario: ScenarioEvidence }) {
  const tone = evidenceTone(scenario);
  const riskProfile = findScenarioRiskProfile(scenario.id);
  const evidencePreview = {
    sourceSystem: "AgentGuard CI",
    targetPlatform: "UiPath Test Cloud",
    scenarioId: scenario.id,
    status: scenario.status,
    score: scenario.score,
    recommendedAction: scenario.recommendedAction,
    risk: riskProfile
      ? {
          severity: riskProfile.severity,
          owner: riskProfile.owner,
          riskPoints: riskProfile.riskPoints,
          control: riskProfile.control
        }
      : undefined,
    attachments: ["report.json", "report.md", "junit.xml", "test-cloud-evidence.json"]
  };

  return (
    <section className="evidence-panel" aria-label="Selected scenario evidence">
      <div className="panel-heading">
        <div>
          <h2>Evidence Packet</h2>
          <p>{scenario.id}</p>
        </div>
        <span className={`evidence-badge tone-${tone}`}>{toneLabels[tone]}</span>
      </div>
      <div className="evidence-command">
        <span>Run command</span>
        <code>{scenario.command}</code>
      </div>
      <pre>{JSON.stringify(evidencePreview, null, 2)}</pre>
    </section>
  );
}

function RiskAssurancePanel({
  ownerQueue,
  riskAssurance
}: {
  ownerQueue: OwnerReviewQueueItem[];
  riskAssurance: RiskAssuranceSummary;
}) {
  return (
    <section className="assurance-panel" aria-label="Risk assurance case">
      <div className="assurance-claim">
        <span>Assurance Case</span>
        <h2>{riskAssurance.assuranceLabel}</h2>
        <p>
          Risk is scored with named owners, controls, and evidence standards so every failed agent repair has a
          next reviewer, not just a red badge.
        </p>
      </div>
      <div className="owner-queue-card">
        <div className="owner-queue-heading">
          <span>Review queue</span>
          <strong>Named owners by blocked risk</strong>
        </div>
        <div className="owner-queue">
          {ownerQueue.slice(0, 4).map((item) => (
            <OwnerQueueItem item={item} key={item.owner} />
          ))}
        </div>
      </div>
      <div className="assurance-metrics">
        <AssuranceMetric label="Total risk library" value={`${riskAssurance.totalRiskPoints} pts`} />
        <AssuranceMetric label="Critical findings" value={String(riskAssurance.criticalFindings)} />
        <AssuranceMetric label="Top review owner" value={riskAssurance.topReviewOwner} />
      </div>
      <p className="assurance-control">{riskAssurance.controlLabel}</p>
    </section>
  );
}

function AssuranceMetric({ label, value }: { label: string; value: string }) {
  return (
    <article className="assurance-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function OwnerQueueItem({ item }: { item: OwnerReviewQueueItem }) {
  return (
    <article className="owner-queue-item">
      <div>
        <strong>{item.owner}</strong>
        <span>{item.findings} findings</span>
      </div>
      <b>{item.riskPoints}</b>
    </article>
  );
}

function GatePanel({ scenario }: { scenario: ScenarioEvidence }) {
  return (
    <section className="gate-panel" aria-label="Reliability gates">
      <div className="panel-heading">
        <div>
          <h2>Gate Detail</h2>
          <p>{scenario.recommendedAction}</p>
        </div>
      </div>
      <div className="gate-list">
        {scenario.gates.map((gate) => (
          <article className={`gate-item is-${gate.status}`} key={gate.name}>
            <div>
              <strong>{formatGateLabel(gate.name)}</strong>
              <p>{gate.reason ?? "No reviewer action required"}</p>
            </div>
            <span>{gate.status}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function IssueTargetPanel() {
  return (
    <section className="target-panel" aria-label="Demo target issue tracker">
      <div className="panel-heading">
        <div>
          <h2>Demo Target</h2>
          <p>Issue Tracker failure surface used by the agent.</p>
        </div>
      </div>
      <div className="issue-list">
        {sampleIssues.map((issue) => (
          <article className="issue-row" key={issue.id}>
            <span className={`priority-dot issue-${priorityTone(issue.priority)}`} aria-hidden="true" />
            <div>
              <strong>{formatIssueLabel(issue)}</strong>
              <p>{summarizeIssue(issue)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function OptimizationPanel({
  selectedScenario,
  optimizationSummary
}: {
  selectedScenario: ScenarioEvidence;
  optimizationSummary: ReturnType<typeof buildOptimizationSummary>;
}) {
  return (
    <section className="optimization-panel" aria-label="Test selection and performance optimization">
      <div className="optimization-copy">
        <span>Optimization Engine</span>
        <h2>{optimizationSummary.savedPercentLabel} faster evidence loop</h2>
        <p>{optimizationSummary.recommendation}</p>
      </div>
      <div className="optimization-meter" aria-label="Targeted versus full regression time">
        <div className="meter-track">
          <span
            style={{
              width: `${Math.round((optimizationSummary.targetedMinutes / optimizationSummary.baselineMinutes) * 100)}%`
            }}
          />
        </div>
        <div className="meter-labels">
          <strong>{optimizationSummary.targetedMinutes}m targeted</strong>
          <span>{optimizationSummary.baselineMinutes}m full regression</span>
        </div>
      </div>
      <div className="optimization-grid">
        <MethodCard label="Selection signal" value={selectedScenario.optimization.selectionSignal} />
        <MethodCard label="Failure class" value={selectedScenario.optimization.failureClass} />
        <MethodCard label="Highest risk area" value={optimizationSummary.highestRiskArea} />
      </div>
    </section>
  );
}

function MethodCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="method-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function MoatPanel() {
  return (
    <section className="moat-panel" aria-label="Competitive advantage">
      <div className="moat-lead">
        <span>Reliability Moat</span>
        <h2>Not test visibility. Agent promotion control.</h2>
        <p>
          Existing tools help teams see tests and save CI time. AgentGuard decides whether an autonomous
          repair can be trusted after it crosses real engineering, security, and release boundaries.
        </p>
      </div>
      <div className="moat-grid">
        {competitiveAdvantageCards.map((card, index) => (
          <AdvantageCard card={card} index={index + 1} key={card.referenceCategory} />
        ))}
      </div>
    </section>
  );
}

function AdvantageCard({ card, index }: { card: CompetitiveAdvantageCard; index: number }) {
  return (
    <article className="advantage-card">
      <span>{`0${index}`}</span>
      <h3>{card.referenceCategory}</h3>
      <p>{card.incumbentPattern}</p>
      <strong>{card.agentGuardAdvantage}</strong>
      <small>{card.proofPoint}</small>
    </article>
  );
}

function FailureAtlasPanel({ atlasSummary }: { atlasSummary: ReturnType<typeof summarizeFailureAtlas> }) {
  return (
    <section className="atlas-panel" aria-label="Agent failure mode atlas">
      <div className="atlas-header">
        <div>
          <span>Failure Atlas</span>
          <h2>{atlasSummary.coverageLabel}</h2>
        </div>
        <p>
          Built from software engineering benchmarks, AI risk management, SRE practice, high-reliability
          operations, and classic adversarial thinking: verify the agent's intent before trusting the patch.
        </p>
      </div>
      <div className="atlas-grid">
        {failureModeTaxonomy.map((domain) => (
          <AtlasDomain domain={domain} key={domain.id} />
        ))}
      </div>
    </section>
  );
}

function AtlasDomain({ domain }: { domain: FailureModeDomain }) {
  return (
    <article className="atlas-domain">
      <div>
        <span>{domain.scenarioIds.length} modes</span>
        <h3>{domain.name}</h3>
        <p>{domain.principle}</p>
      </div>
      <small>{domain.inspiredBy}</small>
    </article>
  );
}

function EvidenceChainPanel() {
  return (
    <section className="evidence-chain-panel" aria-label="Real test evidence chain">
      <div className="evidence-chain-copy">
        <span>Real Evidence</span>
        <h2>Every claim is backed by commands, reports, and importable Test Cloud rows.</h2>
      </div>
      <div className="evidence-chain">
        {realEvidenceChain.map((step, index) => (
          <EvidenceStep index={index + 1} step={step} key={step.artifact} />
        ))}
      </div>
    </section>
  );
}

function EvidenceStep({ index, step }: { index: number; step: RealEvidenceStep }) {
  return (
    <article className="chain-step">
      <span>{String(index).padStart(2, "0")}</span>
      <div>
        <strong>{step.stage}</strong>
        <code>{step.artifact}</code>
        <p>{step.proof}</p>
      </div>
    </article>
  );
}

function ResearchPanel({ protocolSummary }: { protocolSummary: string }) {
  return (
    <section className="research-panel" aria-label="Research backed protocol">
      <div className="research-intro">
        <h2>Research-Backed Protocol</h2>
        <p>{protocolSummary}</p>
      </div>
      <div className="research-grid">
        {researchBackedProtocol
          .filter((principle) => principle.featuredPrinciple)
          .map((principle) => (
            <ResearchCard key={principle.id} principle={principle} />
          ))}
      </div>
    </section>
  );
}

function ResearchCard({ principle }: { principle: ResearchProtocolPrinciple }) {
  return (
    <article className="research-card">
      <span>{principle.source}</span>
      <strong>{principle.title}</strong>
      <p>{principle.productTranslation}</p>
    </article>
  );
}
