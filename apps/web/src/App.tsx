import { useMemo, useState } from "react";
import { formatIssueLabel, priorityTone, summarizeIssue, type IssueSummary } from "./issueModel.js";
import {
  buildConsoleSummary,
  evidenceTone,
  formatGateLabel,
  judgeScenarioEvidence,
  type EvidenceTone,
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
  const selectedScenario =
    judgeScenarioEvidence.find((scenario) => scenario.id === selectedScenarioId) ?? judgeScenarioEvidence[0];

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>AgentGuard CI</h1>
          <p>UiPath Test Cloud console for AI agent reliability evidence.</p>
        </div>
        <div className="topbar-actions" aria-label="Submission status">
          <span>Track 3</span>
          <strong>Test Cloud</strong>
        </div>
      </header>

      <section className="summary-grid" aria-label="Portfolio summary">
        <Metric label="Scenarios" value={`${summary.passedScenarios}/${summary.totalScenarios}`} detail="safe promotions" />
        <Metric label="Gate Pass Rate" value={summary.passRateLabel} detail={`${summary.totalPassedGates}/${summary.totalGates} gates`} />
        <Metric label="Findings" value={String(summary.governanceFindings)} detail="routed to review" />
        <Metric label="Evidence" value="4" detail="Test Cloud packets" />
      </section>

      <section className="console-grid">
        <section className="scenario-panel" aria-label="Reliability scenario matrix">
          <div className="panel-heading">
            <div>
              <h2>Reliability Matrix</h2>
              <p>Four governed cases mapped to UiPath Test Cloud.</p>
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
    </main>
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
  const evidencePreview = {
    sourceSystem: "AgentGuard CI",
    targetPlatform: "UiPath Test Cloud",
    scenarioId: scenario.id,
    status: scenario.status,
    score: scenario.score,
    recommendedAction: scenario.recommendedAction,
    attachments: ["report.json", "report.md", "junit.xml"]
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
