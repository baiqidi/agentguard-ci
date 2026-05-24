import { useMemo, useState } from "react";
import { priorityTone, type IssueSummary } from "./issueModel.js";
import {
  agentProfiles,
  buildConsoleSummary,
  buildOptimizationSummary,
  buildOwnerReviewQueue,
  buildRiskAssuranceSummary,
  buildReleaseDecisionSummary,
  competitiveAdvantageCards,
  evidenceTone,
  failureModeTaxonomy,
  findScenarioRiskProfile,
  judgeScenarioEvidence,
  realEvidenceChain,
  researchBackedProtocol,
  scenarioRiskProfiles,
  summarizeAgentCoverage,
  summarizeFailureAtlas,
  summarizeResearchProtocol,
  universalReliabilityGates,
  type AgentCoverageSummary,
  type AgentProfile,
  type CompetitiveAdvantageCard,
  type EvidenceTone,
  type FailureModeDomain,
  type OwnerReviewQueueItem,
  type RealEvidenceStep,
  type ResearchProtocolPrinciple,
  type RiskAssuranceSummary,
  type ScenarioEvidence,
  type UniversalReliabilityGate
} from "./testCloudEvidence.js";
import {
  formatAdvantageCardForLocale,
  formatAgentProfileForLocale,
  formatAgentProfileStatus,
  formatDomainForLocale,
  formatEvidenceStepForLocale,
  formatFailureAtlasLabel,
  formatGateLabelForLocale,
  formatGateReason,
  formatGateStatus,
  formatIssueLabelParts,
  formatIssueSummaryParts,
  formatOptimizationRecommendation,
  formatOwner,
  formatReleaseDecisionForLocale,
  formatResearchCardForLocale,
  formatResearchHeadline,
  formatRiskAssuranceForLocale,
  formatScenarioAction,
  formatScenarioTitle,
  formatShortText,
  formatToneLabel,
  formatUniversalGateForLocale,
  getInitialLocale,
  supportedLocales,
  t,
  type Locale
} from "./i18n.js";
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

function readInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  return getInitialLocale(new URLSearchParams(window.location.search).get("lang"), window.navigator.language);
}

export function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(judgeScenarioEvidence[0].id);
  const [locale, setLocale] = useState<Locale>(readInitialLocale);
  const summary = useMemo(() => buildConsoleSummary(judgeScenarioEvidence), []);
  const agentCoverageSummary = useMemo(() => summarizeAgentCoverage(agentProfiles), []);
  const releaseDecision = useMemo(() => buildReleaseDecisionSummary(judgeScenarioEvidence), []);
  const optimizationSummary = useMemo(() => buildOptimizationSummary(judgeScenarioEvidence), []);
  const protocolSummary = useMemo(() => summarizeResearchProtocol(researchBackedProtocol), []);
  const atlasSummary = useMemo(() => summarizeFailureAtlas(failureModeTaxonomy), []);
  const riskAssurance = useMemo(() => buildRiskAssuranceSummary(judgeScenarioEvidence, scenarioRiskProfiles), []);
  const ownerQueue = useMemo(() => buildOwnerReviewQueue(judgeScenarioEvidence, scenarioRiskProfiles), []);
  const localizedReleaseDecision = formatReleaseDecisionForLocale(releaseDecision, locale);
  const localizedRiskAssurance = formatRiskAssuranceForLocale(riskAssurance, locale);
  const localizedProtocolHeadline = formatResearchHeadline(
    protocolSummary.principleCount,
    protocolSummary.paperCount,
    protocolSummary.uipathControlCount,
    protocolSummary.headline,
    locale
  );
  const atlasCoverageLabel = formatFailureAtlasLabel(
    atlasSummary.totalFailureModes,
    atlasSummary.totalDomains,
    locale
  );
  const selectedScenario =
    judgeScenarioEvidence.find((scenario) => scenario.id === selectedScenarioId) ?? judgeScenarioEvidence[0];

  function handleLocaleChange(nextLocale: Locale) {
    setLocale(nextLocale);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", nextLocale);
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="hero-copy">
          <h1>AgentGuard CI</h1>
          <p>{t(locale, "hero.subtitle")}</p>
        </div>
        <div className="topbar-actions" aria-label={t(locale, "topbar.status")}>
          <div className="language-switch" aria-label={t(locale, "language.switchLabel")} role="group">
            {supportedLocales.map((item) => (
              <button
                aria-pressed={locale === item}
                className={locale === item ? "is-active" : ""}
                key={item}
                onClick={() => handleLocaleChange(item)}
                type="button"
              >
                {t(locale, item === "en" ? "language.en" : "language.zh")}
              </button>
            ))}
          </div>
          <div className="track-badge">
            <span>{t(locale, "track.label")}</span>
            <strong>{t(locale, "track.value")}</strong>
          </div>
        </div>
      </header>

      <section className="decision-hero" aria-label={t(locale, "release.aria")}>
        <div className="decision-copy">
          <span>{t(locale, "release.kicker")}</span>
          <h2>{localizedReleaseDecision.decisionLabel}</h2>
          <p>{localizedReleaseDecision.executiveSummary}</p>
        </div>
        <div className="decision-metrics">
          <DecisionMetric label={t(locale, "metric.autoPromote")} value={releaseDecision.autoPromotions} tone="safe" />
          <DecisionMetric label={t(locale, "metric.needsReview")} value={releaseDecision.reviewRequired} tone="watch" />
          <DecisionMetric label={t(locale, "metric.hardBlock")} value={releaseDecision.hardBlocks} tone="stop" />
        </div>
        <p className="decision-threshold">{localizedReleaseDecision.thresholdLabel}</p>
      </section>

      <AgentCoveragePanel coverageSummary={agentCoverageSummary} locale={locale} />

      <UniversalGatePanel locale={locale} />

      <RiskAssurancePanel locale={locale} ownerQueue={ownerQueue} riskAssurance={localizedRiskAssurance} />

      <section className="trace-band" aria-label={t(locale, "trace.aria")}>
        <TraceStep index="01" title={t(locale, "trace.1.title")} detail={t(locale, "trace.1.detail")} />
        <TraceStep index="02" title={t(locale, "trace.2.title")} detail={t(locale, "trace.2.detail")} />
        <TraceStep index="03" title={t(locale, "trace.3.title")} detail={t(locale, "trace.3.detail")} />
        <TraceStep index="04" title={t(locale, "trace.4.title")} detail={t(locale, "trace.4.detail")} />
      </section>

      <section className="summary-grid" aria-label={t(locale, "summary.aria")}>
        <Metric
          label={t(locale, "summary.scenarios")}
          value={`${summary.passedScenarios}/${summary.totalScenarios}`}
          detail={t(locale, "summary.safePromotions")}
        />
        <Metric
          label={t(locale, "summary.gatePassRate")}
          value={summary.passRateLabel}
          detail={`${summary.totalPassedGates}/${summary.totalGates} gates`}
        />
        <Metric
          label={t(locale, "summary.findings")}
          value={String(summary.governanceFindings)}
          detail={t(locale, "summary.routedReview")}
        />
        <Metric
          label={t(locale, "summary.protocol")}
          value={String(protocolSummary.principleCount)}
          detail={t(locale, "summary.researchPrinciples")}
        />
      </section>

      <MoatPanel locale={locale} />

      <FailureAtlasPanel coverageLabel={atlasCoverageLabel} locale={locale} />

      <section className="console-grid">
        <section className="scenario-panel" aria-label={t(locale, "matrix.aria")}>
          <div className="panel-heading">
            <div>
              <h2>{t(locale, "matrix.title")}</h2>
              <p>
                {summary.totalScenarios} {t(locale, "matrix.description")}
              </p>
            </div>
          </div>
          <div className="scenario-list">
            {judgeScenarioEvidence.map((scenario) => (
              <ScenarioRow
                key={scenario.id}
                locale={locale}
                scenario={scenario}
                selected={scenario.id === selectedScenario.id}
                onSelect={() => setSelectedScenarioId(scenario.id)}
              />
            ))}
          </div>
        </section>

        <EvidencePanel locale={locale} scenario={selectedScenario} />
      </section>

      <section className="details-grid">
        <GatePanel locale={locale} scenario={selectedScenario} />
        <IssueTargetPanel locale={locale} />
      </section>

      <OptimizationPanel locale={locale} selectedScenario={selectedScenario} optimizationSummary={optimizationSummary} />

      <EvidenceChainPanel locale={locale} />

      <ResearchPanel locale={locale} protocolSummary={localizedProtocolHeadline} />
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

function AgentCoveragePanel({
  coverageSummary,
  locale
}: {
  coverageSummary: AgentCoverageSummary;
  locale: Locale;
}) {
  return (
    <section className="agent-platform-panel" aria-label={t(locale, "platform.aria")}>
      <div className="platform-lead">
        <span>{t(locale, "platform.kicker")}</span>
        <h2>{t(locale, "platform.title")}</h2>
        <p>{t(locale, "platform.body")}</p>
      </div>
      <div className="platform-metrics">
        <Metric
          label={t(locale, "platform.liveAdapters")}
          value={String(coverageSummary.liveProfiles)}
          detail={t(locale, "platform.liveAdapters.detail")}
        />
        <Metric
          label={t(locale, "platform.blueprints")}
          value={String(coverageSummary.blueprintProfiles)}
          detail={t(locale, "platform.blueprints.detail")}
        />
        <Metric
          label={t(locale, "platform.liveScenarios")}
          value={String(coverageSummary.liveScenarioCount)}
          detail={t(locale, "platform.liveScenarios.detail")}
        />
        <Metric
          label={t(locale, "platform.blueprintScenarios")}
          value={String(coverageSummary.blueprintScenarioCount)}
          detail={t(locale, "platform.blueprintScenarios.detail")}
        />
      </div>
      <div className="agent-profile-grid">
        {agentProfiles.map((profile) => (
          <AgentProfileCard key={profile.id} locale={locale} profile={profile} />
        ))}
      </div>
    </section>
  );
}

function AgentProfileCard({ locale, profile }: { locale: Locale; profile: AgentProfile }) {
  const localizedProfile = formatAgentProfileForLocale(profile, locale);

  return (
    <article className={`agent-profile-card is-${profile.status}`}>
      <div className="agent-profile-heading">
        <span>{formatAgentProfileStatus(profile.status, locale)}</span>
        <strong>{profile.scenarioCount}</strong>
      </div>
      <h3>{localizedProfile.name}</h3>
      <p>{localizedProfile.primaryRisk}</p>
      <small>{localizedProfile.testCloudFit}</small>
      <b>{localizedProfile.proof}</b>
    </article>
  );
}

function UniversalGatePanel({ locale }: { locale: Locale }) {
  return (
    <section className="universal-gate-panel" aria-label={t(locale, "universal.aria")}>
      <div className="universal-gate-copy">
        <span>{t(locale, "universal.kicker")}</span>
        <h2>{t(locale, "universal.title")}</h2>
        <p>{t(locale, "universal.body")}</p>
      </div>
      <div className="universal-gate-grid">
        {universalReliabilityGates.map((gate) => (
          <UniversalGateCard gate={gate} key={gate.id} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function UniversalGateCard({ gate, locale }: { gate: UniversalReliabilityGate; locale: Locale }) {
  const localizedGate = formatUniversalGateForLocale(gate, locale);

  return (
    <article className="universal-gate-card">
      <span>{gate.appliesTo.length}</span>
      <h3>{localizedGate.name}</h3>
      <p>{localizedGate.question}</p>
    </article>
  );
}

function ScenarioRow({
  locale,
  scenario,
  selected,
  onSelect
}: {
  locale: Locale;
  scenario: ScenarioEvidence;
  selected: boolean;
  onSelect: () => void;
}) {
  const tone = evidenceTone(scenario);

  return (
    <button className={`scenario-row ${selected ? "is-selected" : ""}`} type="button" onClick={onSelect}>
      <span className={`status-rail tone-${tone}`} aria-hidden="true" />
      <span className="scenario-copy">
        <strong>{formatScenarioTitle(scenario.id, scenario.title, locale)}</strong>
        <span>{scenario.testCaseId}</span>
      </span>
      <span className="scenario-score">{`${scenario.score.passedGates}/${scenario.score.totalGates}`}</span>
      <span className={`scenario-state tone-${tone}`}>{formatToneLabel(tone, locale)}</span>
    </button>
  );
}

function EvidencePanel({ locale, scenario }: { locale: Locale; scenario: ScenarioEvidence }) {
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
    <section className="evidence-panel" aria-label={t(locale, "evidence.aria")}>
      <div className="panel-heading">
        <div>
          <h2>{t(locale, "evidence.title")}</h2>
          <p>{scenario.id}</p>
        </div>
        <span className={`evidence-badge tone-${tone}`}>{formatToneLabel(tone, locale)}</span>
      </div>
      <div className="evidence-command">
        <span>{t(locale, "evidence.command")}</span>
        <code>{scenario.command}</code>
      </div>
      <p className="evidence-note">{t(locale, "evidence.machineReadable")}</p>
      <pre>{JSON.stringify(evidencePreview, null, 2)}</pre>
    </section>
  );
}

function RiskAssurancePanel({
  locale,
  ownerQueue,
  riskAssurance
}: {
  locale: Locale;
  ownerQueue: OwnerReviewQueueItem[];
  riskAssurance: RiskAssuranceSummary;
}) {
  return (
    <section className="assurance-panel" aria-label={t(locale, "assurance.aria")}>
      <div className="assurance-claim">
        <span>{t(locale, "assurance.kicker")}</span>
        <h2>{riskAssurance.assuranceLabel}</h2>
        <p>{t(locale, "assurance.body")}</p>
      </div>
      <div className="owner-queue-card">
        <div className="owner-queue-heading">
          <span>{t(locale, "assurance.reviewQueue")}</span>
          <strong>{t(locale, "assurance.reviewQueueDetail")}</strong>
        </div>
        <div className="owner-queue">
          {ownerQueue.slice(0, 4).map((item) => (
            <OwnerQueueItem item={item} key={item.owner} locale={locale} />
          ))}
        </div>
      </div>
      <div className="assurance-metrics">
        <AssuranceMetric
          label={t(locale, "assurance.totalRiskLibrary")}
          value={`${riskAssurance.totalRiskPoints} ${t(locale, "unit.points")}`}
        />
        <AssuranceMetric label={t(locale, "assurance.criticalFindings")} value={String(riskAssurance.criticalFindings)} />
        <AssuranceMetric label={t(locale, "assurance.topReviewOwner")} value={riskAssurance.topReviewOwner} />
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

function OwnerQueueItem({ item, locale }: { item: OwnerReviewQueueItem; locale: Locale }) {
  return (
    <article className="owner-queue-item">
      <div>
        <strong>{formatOwner(item.owner, locale)}</strong>
        <span>
          {item.findings} {t(locale, "unit.findings")}
        </span>
      </div>
      <b>{item.riskPoints}</b>
    </article>
  );
}

function GatePanel({ locale, scenario }: { locale: Locale; scenario: ScenarioEvidence }) {
  return (
    <section className="gate-panel" aria-label={t(locale, "gate.aria")}>
      <div className="panel-heading">
        <div>
          <h2>{t(locale, "gate.title")}</h2>
          <p>{formatScenarioAction(scenario.recommendedAction, locale)}</p>
        </div>
      </div>
      <div className="gate-list">
        {scenario.gates.map((gate) => (
          <article className={`gate-item is-${gate.status}`} key={gate.name}>
            <div>
              <strong>{formatGateLabelForLocale(gate.name, locale)}</strong>
              <p>{formatGateReason(gate.reason, locale) ?? t(locale, "gate.noAction")}</p>
            </div>
            <span>{formatGateStatus(gate.status, locale)}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function IssueTargetPanel({ locale }: { locale: Locale }) {
  return (
    <section className="target-panel" aria-label={t(locale, "target.aria")}>
      <div className="panel-heading">
        <div>
          <h2>{t(locale, "target.title")}</h2>
          <p>{t(locale, "target.description")}</p>
        </div>
      </div>
      <div className="issue-list">
        {sampleIssues.map((issue) => (
          <article className="issue-row" key={issue.id}>
            <span className={`priority-dot issue-${priorityTone(issue.priority)}`} aria-hidden="true" />
            <div>
              <strong>{formatIssueLabelParts(issue, locale)}</strong>
              <p>{formatIssueSummaryParts(issue, locale)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function OptimizationPanel({
  locale,
  selectedScenario,
  optimizationSummary
}: {
  locale: Locale;
  selectedScenario: ScenarioEvidence;
  optimizationSummary: ReturnType<typeof buildOptimizationSummary>;
}) {
  return (
    <section className="optimization-panel" aria-label={t(locale, "optimization.aria")}>
      <div className="optimization-copy">
        <span>{t(locale, "optimization.kicker")}</span>
        <h2>
          {optimizationSummary.savedPercentLabel} {t(locale, "optimization.titleSuffix")}
        </h2>
        <p>{formatOptimizationRecommendation(optimizationSummary.recommendation, locale)}</p>
      </div>
      <div className="optimization-meter" aria-label={t(locale, "optimization.meterAria")}>
        <div className="meter-track">
          <span
            style={{
              width: `${Math.round((optimizationSummary.targetedMinutes / optimizationSummary.baselineMinutes) * 100)}%`
            }}
          />
        </div>
        <div className="meter-labels">
          <strong>
            {optimizationSummary.targetedMinutes}m {t(locale, "optimization.targeted")}
          </strong>
          <span>
            {optimizationSummary.baselineMinutes}m {t(locale, "optimization.fullRegression")}
          </span>
        </div>
      </div>
      <div className="optimization-grid">
        <MethodCard
          label={t(locale, "optimization.selectionSignal")}
          value={formatShortText(selectedScenario.optimization.selectionSignal, locale)}
        />
        <MethodCard
          label={t(locale, "optimization.failureClass")}
          value={formatShortText(selectedScenario.optimization.failureClass, locale)}
        />
        <MethodCard
          label={t(locale, "optimization.highestRiskArea")}
          value={formatShortText(optimizationSummary.highestRiskArea, locale)}
        />
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

function MoatPanel({ locale }: { locale: Locale }) {
  return (
    <section className="moat-panel" aria-label={t(locale, "moat.aria")}>
      <div className="moat-lead">
        <span>{t(locale, "moat.kicker")}</span>
        <h2>{t(locale, "moat.title")}</h2>
        <p>{t(locale, "moat.body")}</p>
      </div>
      <div className="moat-grid">
        {competitiveAdvantageCards.map((card, index) => (
          <AdvantageCard card={card} index={index + 1} key={card.referenceCategory} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function AdvantageCard({ card, index, locale }: { card: CompetitiveAdvantageCard; index: number; locale: Locale }) {
  const localizedCard = formatAdvantageCardForLocale(card, locale);

  return (
    <article className="advantage-card">
      <span>{`0${index}`}</span>
      <h3>{localizedCard.referenceCategory}</h3>
      <p>{localizedCard.incumbentPattern}</p>
      <strong>{localizedCard.agentGuardAdvantage}</strong>
      <small>{localizedCard.proofPoint}</small>
    </article>
  );
}

function FailureAtlasPanel({ coverageLabel, locale }: { coverageLabel: string; locale: Locale }) {
  return (
    <section className="atlas-panel" aria-label={t(locale, "atlas.aria")}>
      <div className="atlas-header">
        <div>
          <span>{t(locale, "atlas.kicker")}</span>
          <h2>{coverageLabel}</h2>
        </div>
        <p>{t(locale, "atlas.body")}</p>
      </div>
      <div className="atlas-grid">
        {failureModeTaxonomy.map((domain) => (
          <AtlasDomain domain={domain} key={domain.id} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function AtlasDomain({ domain, locale }: { domain: FailureModeDomain; locale: Locale }) {
  const localizedDomain = formatDomainForLocale(domain, locale);

  return (
    <article className="atlas-domain">
      <div>
        <span>
          {domain.scenarioIds.length} {t(locale, "atlas.modes")}
        </span>
        <h3>{localizedDomain.name}</h3>
        <p>{localizedDomain.principle}</p>
      </div>
      <small>{localizedDomain.inspiredBy}</small>
    </article>
  );
}

function EvidenceChainPanel({ locale }: { locale: Locale }) {
  return (
    <section className="evidence-chain-panel" aria-label={t(locale, "chain.aria")}>
      <div className="evidence-chain-copy">
        <span>{t(locale, "chain.kicker")}</span>
        <h2>{t(locale, "chain.title")}</h2>
      </div>
      <div className="evidence-chain">
        {realEvidenceChain.map((step, index) => (
          <EvidenceStep index={index + 1} step={step} key={step.artifact} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function EvidenceStep({ index, step, locale }: { index: number; step: RealEvidenceStep; locale: Locale }) {
  const localizedStep = formatEvidenceStepForLocale(step, locale);

  return (
    <article className="chain-step">
      <span>{String(index).padStart(2, "0")}</span>
      <div>
        <strong>{localizedStep.stage}</strong>
        <code>{step.artifact}</code>
        <p>{localizedStep.proof}</p>
      </div>
    </article>
  );
}

function ResearchPanel({ locale, protocolSummary }: { locale: Locale; protocolSummary: string }) {
  return (
    <section className="research-panel" aria-label={t(locale, "research.aria")}>
      <div className="research-intro">
        <h2>{t(locale, "research.title")}</h2>
        <p>{protocolSummary}</p>
      </div>
      <div className="research-grid">
        {researchBackedProtocol
          .filter((principle) => principle.featuredPrinciple)
          .map((principle) => (
            <ResearchCard key={principle.id} locale={locale} principle={principle} />
          ))}
      </div>
    </section>
  );
}

function ResearchCard({ locale, principle }: { locale: Locale; principle: ResearchProtocolPrinciple }) {
  const localizedPrinciple = formatResearchCardForLocale(principle, locale);

  return (
    <article className="research-card">
      <span>{principle.source}</span>
      <strong>{localizedPrinciple.title}</strong>
      <p>{localizedPrinciple.productTranslation}</p>
    </article>
  );
}
