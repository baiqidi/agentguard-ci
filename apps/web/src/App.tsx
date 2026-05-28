import { useEffect, useMemo, useState } from "react";
import { getPageNavigation, parseAppPage, type AppPage } from "./appNavigation.js";
import { useRef } from "react";
import { priorityTone, type IssueSummary } from "./issueModel.js";
import {
  buildScenarioFocusSummary,
  countScenariosByTone,
  filterScenariosByTone,
  getScenarioTargetIssues,
  parseScenarioToneFilter,
  type ScenarioToneFilter
} from "./evidenceReviewModel.js";
import {
  agentProfiles,
  agentRiskVectors,
  buildScenarioAnalysis,
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
  operatorWorkflowSteps,
  realEvidenceChain,
  researchBackedProtocol,
  scenarioExpansionCandidates,
  scenarioRiskProfiles,
  summarizeAgentCoverage,
  summarizeAgentRiskRadar,
  summarizeFailureAtlas,
  summarizeScenarioWorkbench,
  summarizeResearchProtocol,
  universalReliabilityGates,
  type AgentCoverageSummary,
  type AgentProfile,
  type AgentRiskRadarSummary,
  type AgentRiskVector,
  type CompetitiveAdvantageCard,
  type EvidenceTone,
  type FailureModeDomain,
  type OperatorWorkflowStep,
  type OwnerReviewQueueItem,
  type RealEvidenceStep,
  type ResearchProtocolPrinciple,
  type RiskAssuranceSummary,
  type ScenarioAnalysisItem,
  type ScenarioEvidence,
  type ScenarioExpansionCandidate,
  type ScenarioWorkbenchSummary,
  type UniversalReliabilityGate
} from "./testCloudEvidence.js";
import {
  formatAdvantageCardForLocale,
  formatAgentProfileForLocale,
  formatAgentRiskVectorForLocale,
  formatAgentRiskRadarSummaryForLocale,
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
  formatOperatorWorkflowStepForLocale,
  formatOwner,
  formatReleaseDecisionForLocale,
  formatResearchCardForLocale,
  formatResearchHeadline,
  formatRiskAssuranceForLocale,
  formatScenarioAnalysisItemForLocale,
  formatScenarioAction,
  formatScenarioExpansionCandidateForLocale,
  formatScenarioExpansionPriority,
  formatScenarioTitle,
  formatShortText,
  formatToneLabel,
  formatUniversalGateForLocale,
  getInitialLocale,
  supportedLocales,
  t,
  type Locale
} from "./i18n.js";
import {
  getContestEvidenceArtifact,
  getContestEvidenceTarget,
  getContestMode,
  getContestTrackBadge
} from "./contestMode.js";
import { BaselineReadinessPanel, JudgingCriteriaPanel } from "./CompetitionPanels.js";
import { parseSplunkDeliveryId, type SplunkDeliveryId } from "./splunkDeliveryModel.js";
import { SplunkCompanionAppSection, SplunkContestSection } from "./SplunkPanels.js";
import { SansIrScenarioSection, SansReplaySection } from "./SansPanels.js";
import { summarizeSplunkContestSurface } from "./splunkContestData.js";
import { parseSplunkScenarioId, type SplunkScenarioId } from "./splunkMissionModel.js";
import "./App.css";

function readInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  return getInitialLocale(new URLSearchParams(window.location.search).get("lang"), window.navigator.language);
}

function readInitialPage(): AppPage {
  if (typeof window === "undefined") {
    return "overview";
  }

  return parseAppPage(new URLSearchParams(window.location.search).get("page"));
}

function readInitialPresentationMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const value = new URLSearchParams(window.location.search).get("present");
  return value === "1" || value === "true";
}

function readInitialScenarioId(): string {
  if (typeof window === "undefined") {
    return judgeScenarioEvidence[0].id;
  }

  const urlScenario = new URLSearchParams(window.location.search).get("scenario");
  return judgeScenarioEvidence.some((scenario) => scenario.id === urlScenario) ? urlScenario! : judgeScenarioEvidence[0].id;
}

function readInitialScenarioFilter(): ScenarioToneFilter {
  if (typeof window === "undefined") {
    return "all";
  }

  return parseScenarioToneFilter(new URLSearchParams(window.location.search).get("filter"));
}

function readInitialSplunkScenarioId(): SplunkScenarioId {
  if (typeof window === "undefined") {
    return parseSplunkScenarioId(null);
  }

  return parseSplunkScenarioId(new URLSearchParams(window.location.search).get("soc"));
}

function readInitialSplunkDeliveryId(): SplunkDeliveryId {
  if (typeof window === "undefined") {
    return parseSplunkDeliveryId(null);
  }

  return parseSplunkDeliveryId(new URLSearchParams(window.location.search).get("delivery"));
}

export function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(readInitialScenarioId);
  const [scenarioFilter, setScenarioFilter] = useState<ScenarioToneFilter>(readInitialScenarioFilter);
  const [selectedSplunkScenarioId, setSelectedSplunkScenarioId] = useState<SplunkScenarioId>(readInitialSplunkScenarioId);
  const [selectedSplunkDeliveryId, setSelectedSplunkDeliveryId] = useState<SplunkDeliveryId>(readInitialSplunkDeliveryId);
  const [locale, setLocale] = useState<Locale>(readInitialLocale);
  const [activePage, setActivePage] = useState<AppPage>(readInitialPage);
  const contestMode = getContestMode();
  const presentationMode = useMemo(() => readInitialPresentationMode(), []);
  const hideProductNav = presentationMode && contestMode === "splunk";
  const compactPresentationChrome = hideProductNav && activePage !== "overview";
  const contestTrackBadge = getContestTrackBadge(contestMode);
  const pageNavigation = useMemo(() => getPageNavigation(locale, contestMode), [contestMode, locale]);
  const summary = useMemo(() => buildConsoleSummary(judgeScenarioEvidence), []);
  const agentCoverageSummary = useMemo(() => summarizeAgentCoverage(agentProfiles), []);
  const riskRadarSummary = useMemo(() => summarizeAgentRiskRadar(agentRiskVectors), []);
  const scenarioAnalysis = useMemo(
    () => buildScenarioAnalysis(judgeScenarioEvidence, scenarioRiskProfiles, agentRiskVectors),
    []
  );
  const scenarioWorkbenchSummary = useMemo(
    () => summarizeScenarioWorkbench(scenarioAnalysis, scenarioExpansionCandidates),
    [scenarioAnalysis]
  );
  const releaseDecision = useMemo(() => buildReleaseDecisionSummary(judgeScenarioEvidence), []);
  const optimizationSummary = useMemo(() => buildOptimizationSummary(judgeScenarioEvidence), []);
  const protocolSummary = useMemo(() => summarizeResearchProtocol(researchBackedProtocol), []);
  const atlasSummary = useMemo(() => summarizeFailureAtlas(failureModeTaxonomy), []);
  const riskAssurance = useMemo(() => buildRiskAssuranceSummary(judgeScenarioEvidence, scenarioRiskProfiles), []);
  const ownerQueue = useMemo(() => buildOwnerReviewQueue(judgeScenarioEvidence, scenarioRiskProfiles), []);
  const scenarioToneCounts = useMemo(() => countScenariosByTone(judgeScenarioEvidence), []);
  const filteredScenarios = useMemo(
    () => filterScenariosByTone(judgeScenarioEvidence, scenarioFilter),
    [scenarioFilter]
  );
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
  const activePageItem = pageNavigation.find((item) => item.id === activePage) ?? pageNavigation[0];
  const selectedScenario =
    filteredScenarios.find((scenario) => scenario.id === selectedScenarioId) ??
    filteredScenarios[0] ??
    judgeScenarioEvidence[0];
  const selectedScenarioFocus = useMemo(() => buildScenarioFocusSummary(selectedScenario), [selectedScenario]);
  const selectedScenarioTargetIssues = useMemo(
    () => getScenarioTargetIssues(selectedScenario.id),
    [selectedScenario.id]
  );

  useEffect(() => {
    if (selectedScenario.id !== selectedScenarioId) {
      setSelectedScenarioId(selectedScenario.id);
    }
  }, [selectedScenario.id, selectedScenarioId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    if (activePage === "evidence") {
      url.searchParams.set("scenario", selectedScenario.id);
      url.searchParams.set("filter", scenarioFilter);
    } else {
      url.searchParams.delete("scenario");
      url.searchParams.delete("filter");
    }

    if (activePage === "scenarios") {
      url.searchParams.set("soc", selectedSplunkScenarioId);
    } else {
      url.searchParams.delete("soc");
    }

    if (activePage === "companion") {
      url.searchParams.set("delivery", selectedSplunkDeliveryId);
    } else {
      url.searchParams.delete("delivery");
    }

    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [activePage, scenarioFilter, selectedScenario.id, selectedSplunkDeliveryId, selectedSplunkScenarioId]);

  function handleLocaleChange(nextLocale: Locale) {
    setLocale(nextLocale);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", nextLocale);
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }

  function handlePageChange(nextPage: AppPage) {
    setActivePage(nextPage);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("page", nextPage);
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function launchJudgePreset(preset: JudgePresetId) {
    if (preset === "overview-to-scenarios") {
      setSelectedSplunkScenarioId("security-soc-alert-suppression");
      handlePageChange("scenarios");
      return;
    }

    if (preset === "overview-to-evidence") {
      setScenarioFilter("danger");
      setSelectedScenarioId("unsafe-diff-guard");
      handlePageChange("evidence");
      return;
    }

    setSelectedSplunkDeliveryId("review-gate-action");
    handlePageChange("companion");
  }

  function handleJudgeFlowSelect(page: AppPage) {
    if (page === "overview") {
      handlePageChange("overview");
      return;
    }

    if (page === "scenarios") {
      launchJudgePreset("overview-to-scenarios");
      return;
    }

    if (page === "companion") {
      launchJudgePreset("overview-to-companion");
      return;
    }

    launchJudgePreset("overview-to-evidence");
  }

  const pageContent =
    activePage === "overview" ? (
      <OverviewPage
        agentCoverageSummary={agentCoverageSummary}
        contestMode={contestMode}
        locale={locale}
        onLaunchPreset={launchJudgePreset}
        onPageChange={handlePageChange}
        protocolSummary={protocolSummary}
        releaseDecision={releaseDecision}
        localizedReleaseDecision={localizedReleaseDecision}
        summary={summary}
      />
    ) : activePage === "scenarios" ? (
      <ScenariosPage
        agentCoverageSummary={agentCoverageSummary}
        contestMode={contestMode}
        locale={locale}
        riskRadarSummary={riskRadarSummary}
        scenarioAnalysis={scenarioAnalysis}
        selectedSplunkScenarioId={selectedSplunkScenarioId}
        scenarioWorkbenchSummary={scenarioWorkbenchSummary}
        setSelectedSplunkScenarioId={setSelectedSplunkScenarioId}
      />
    ) : activePage === "companion" ? (
      <CompanionPage
        contestMode={contestMode}
        locale={locale}
        selectedSplunkDeliveryId={selectedSplunkDeliveryId}
        setSelectedSplunkDeliveryId={setSelectedSplunkDeliveryId}
      />
    ) : (
      <EvidencePage
        atlasCoverageLabel={atlasCoverageLabel}
        filteredScenarios={filteredScenarios}
        onScenarioFilterChange={setScenarioFilter}
        onScenarioSelect={setSelectedScenarioId}
        locale={locale}
        optimizationSummary={optimizationSummary}
        ownerQueue={ownerQueue}
        protocolSummary={localizedProtocolHeadline}
        riskAssurance={localizedRiskAssurance}
        scenarioFilter={scenarioFilter}
        scenarioToneCounts={scenarioToneCounts}
        selectedScenario={selectedScenario}
        selectedScenarioFocus={selectedScenarioFocus}
        targetIssues={selectedScenarioTargetIssues}
        summary={summary}
      />
    );

  return (
    <main className={`app-shell ${presentationMode ? "is-presentation" : ""} page-${activePage}`}>
      <header className={`topbar ${compactPresentationChrome ? "is-compact" : ""}`}>
        <div className="hero-copy">
          <h1>AgentGuard CI</h1>
          {compactPresentationChrome ? (
            <div className="hero-meta" aria-label={t(locale, "topbar.status")}>
              <span>{activePageItem.label}</span>
              <span>{contestTrackBadge.value ?? t(locale, "track.value")}</span>
            </div>
          ) : (
            <p>{t(locale, "hero.subtitle")}</p>
          )}
        </div>
        {compactPresentationChrome ? null : (
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
              <span>{contestTrackBadge.label ?? t(locale, "track.label")}</span>
              <strong>{contestTrackBadge.value ?? t(locale, "track.value")}</strong>
            </div>
          </div>
        )}
      </header>
      {hideProductNav ? null : (
        <ProductPageNav
          activePage={activePage}
          activePageItem={activePageItem}
          items={pageNavigation}
          locale={locale}
          onChange={handlePageChange}
        />
      )}
      {contestMode === "splunk" ? (
        <JudgeFlowRail activePage={activePage} locale={locale} onSelectPage={handleJudgeFlowSelect} />
      ) : null}
      {pageContent}
    </main>
  );
}

function ProductPageNav({
  activePage,
  activePageItem,
  items,
  locale,
  onChange
}: {
  activePage: AppPage;
  activePageItem: ReturnType<typeof getPageNavigation>[number];
  items: ReturnType<typeof getPageNavigation>;
  locale: Locale;
  onChange: (page: AppPage) => void;
}) {
  const shellCopy =
    locale === "zh"
      ? {
          eyebrow: "评审地图",
          title: "四个页面，各讲一件重要的事。",
          detail: activePageItem.description
        }
      : {
          eyebrow: "Judge map",
          title: "Four pages. One decision per page.",
          detail: activePageItem.description
        };

  return (
    <section className="page-nav-shell" aria-label="Product navigation">
      <div className="page-nav-copy">
        <span>{shellCopy.eyebrow}</span>
        <strong>{shellCopy.title}</strong>
        <p>{shellCopy.detail}</p>
      </div>
      <div className="page-nav-tabs" role="tablist" aria-label="Page sections">
        {items.map((item) => (
          <button
            aria-selected={item.id === activePage}
            className={item.id === activePage ? "is-active" : ""}
            key={item.id}
            onClick={() => onChange(item.id)}
            role="tab"
            type="button"
          >
            <small>{item.eyebrow}</small>
            <strong>{item.label}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}

function OverviewPage({
  agentCoverageSummary,
  contestMode,
  locale,
  onLaunchPreset,
  onPageChange,
  protocolSummary,
  localizedReleaseDecision,
  releaseDecision,
  summary
}: {
  agentCoverageSummary: AgentCoverageSummary;
  contestMode: ReturnType<typeof getContestMode>;
  locale: Locale;
  onLaunchPreset: (preset: JudgePresetId) => void;
  onPageChange: (page: AppPage) => void;
  protocolSummary: ReturnType<typeof summarizeResearchProtocol>;
  localizedReleaseDecision: ReturnType<typeof formatReleaseDecisionForLocale>;
  releaseDecision: ReturnType<typeof buildReleaseDecisionSummary>;
  summary: ReturnType<typeof buildConsoleSummary>;
}) {
  return (
    <>
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

      <OverviewProofPanel
        agentCoverageSummary={agentCoverageSummary}
        contestMode={contestMode}
        locale={locale}
        onLaunchPreset={onLaunchPreset}
        releaseDecision={releaseDecision}
        summary={summary}
      />

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
      <JudgingCriteriaPanel contestMode={contestMode} locale={locale} onNavigate={onPageChange} />
      <BaselineReadinessPanel contestMode={contestMode} locale={locale} />

      <MoatPanel locale={locale} />
    </>
  );
}

type JudgePresetId = "overview-to-scenarios" | "overview-to-evidence" | "overview-to-companion";

function OverviewProofPanel({
  agentCoverageSummary,
  contestMode,
  locale,
  onLaunchPreset,
  releaseDecision,
  summary
}: {
  agentCoverageSummary: AgentCoverageSummary;
  contestMode: ReturnType<typeof getContestMode>;
  locale: Locale;
  onLaunchPreset: (preset: JudgePresetId) => void;
  releaseDecision: ReturnType<typeof buildReleaseDecisionSummary>;
  summary: ReturnType<typeof buildConsoleSummary>;
}) {
  if (contestMode === "sans") {
    const copy =
      locale === "zh"
        ? {
            kicker: "FIND EVIL 证据",
            title: "先证明 Agent 会纠错，再让它响应事件。",
            body: "SANS 的重点不是漂亮聊天，而是自主事件响应是否能在真实证据前保持诚实。AgentGuard IR 把每次工具调用、纠错、准确性判断和处置审批都变成可检查材料。",
            suiteLabel: "SIFT 场景",
            suiteValue: "3 条 IR 路线",
            suiteDetail: "磁盘持久化 · 认证日志 · 网络处置",
            coverageLabel: "自我纠错",
            coverageValue: "1 条明确纠错链",
            coverageDetail: "错误假设被降级，证据充分的结论被保留",
            deliveryLabel: "可复现材料",
            deliveryValue: "4 个本地 artifact",
            deliveryDetail: "执行日志 · 准确性报告 · 数据集说明 · 调查叙事",
            verifyLabel: "评委能验证什么",
            verifyTitle: "每个 finding 都能追到 artifact locator。",
            verifyBody: "不是让评委相信旁白，而是让评委打开文件、offset、日志行或 flow id 自己复核。",
            verifyFoot: "agent-execution-log.jsonl · accuracy-report.json · sift-ir-evidence.json",
            wedgeLabel: "为什么它适合 SANS",
            wedgeTitle: "它不是另一个 IR chatbot，而是 IR agent 上线前的安全审计门。",
            wedgeBody: "自动响应越快，越需要证据完整性、准确性边界和人工审批关口。",
            blockedAction: "打开证据",
            routeAction: "打开 SIFT 场景",
            deliveryAction: "打开本地运行"
          }
        : {
            kicker: "FIND EVIL proof",
            title: "Prove the agent can correct itself before it responds.",
            body: "SANS is not asking for a prettier chatbot. The question is whether autonomous incident response stays honest in front of evidence. AgentGuard IR turns tool calls, corrections, accuracy checks, and approval gates into reviewable artifacts.",
            suiteLabel: "SIFT scenarios",
            suiteValue: "3 IR routes",
            suiteDetail: "disk persistence · auth logs · containment",
            coverageLabel: "Self-correction",
            coverageValue: "1 explicit correction chain",
            coverageDetail: "unsupported claims are downgraded; evidence-backed findings remain",
            deliveryLabel: "Replayable assets",
            deliveryValue: "4 local artifacts",
            deliveryDetail: "execution log · accuracy report · dataset docs · narrative",
            verifyLabel: "What judges can verify",
            verifyTitle: "Every finding traces back to an artifact locator.",
            verifyBody: "Judges do not have to trust the narration. They can inspect the file, offset, log line, or flow id behind each claim.",
            verifyFoot: "agent-execution-log.jsonl · accuracy-report.json · sift-ir-evidence.json",
            wedgeLabel: "Why this fits SANS",
            wedgeTitle: "This is not another IR chatbot. It is the audit gate before an IR agent acts.",
            wedgeBody: "The faster response becomes, the more evidence integrity, accuracy boundaries, and approval gates matter.",
            blockedAction: "Open evidence",
            routeAction: "Open SIFT scenarios",
            deliveryAction: "Open local run"
          };

    return (
      <section className="proof-signal-panel" aria-label={copy.kicker}>
        <div className="proof-signal-grid">
          <article className="proof-signal-lead">
            <span>{copy.kicker}</span>
            <h2>{copy.title}</h2>
            <p>{copy.body}</p>
            <div className="proof-signal-list">
              <article className="proof-signal-item">
                <small>{copy.suiteLabel}</small>
                <strong>{copy.suiteValue}</strong>
                <p>{copy.suiteDetail}</p>
              </article>
              <article className="proof-signal-item">
                <small>{copy.coverageLabel}</small>
                <strong>{copy.coverageValue}</strong>
                <p>{copy.coverageDetail}</p>
              </article>
              <article className="proof-signal-item">
                <small>{copy.deliveryLabel}</small>
                <strong>{copy.deliveryValue}</strong>
                <p>{copy.deliveryDetail}</p>
              </article>
            </div>
            <div className="proof-action-row">
              <button onClick={() => onLaunchPreset("overview-to-evidence")} type="button">
                <small>{copy.verifyLabel}</small>
                <strong>{copy.blockedAction}</strong>
              </button>
              <button onClick={() => onLaunchPreset("overview-to-scenarios")} type="button">
                <small>{copy.coverageLabel}</small>
                <strong>{copy.routeAction}</strong>
              </button>
              <button onClick={() => onLaunchPreset("overview-to-companion")} type="button">
                <small>{copy.deliveryLabel}</small>
                <strong>{copy.deliveryAction}</strong>
              </button>
            </div>
          </article>
          <div className="proof-signal-side">
            <article className="proof-signal-card">
              <span>{copy.verifyLabel}</span>
              <strong>{copy.verifyTitle}</strong>
              <p>{copy.verifyBody}</p>
              <small>{copy.verifyFoot}</small>
            </article>
            <article className="proof-signal-card is-accent">
              <span>{copy.wedgeLabel}</span>
              <strong>{copy.wedgeTitle}</strong>
              <p>{copy.wedgeBody}</p>
            </article>
          </div>
        </div>
      </section>
    );
  }

  if (contestMode !== "splunk") {
    return null;
  }

  const splunkSurfaceSummary = summarizeSplunkContestSurface();
  const copy =
    locale === "zh"
      ? {
          kicker: "首屏证据",
          title: "先给评委三份真凭实据，再讲故事。",
          body: "在评委往下点之前，先把三件已经落地的东西摆出来：命令驱动的结果、Splunk 场景覆盖，以及可安装的交付面。",
          suiteLabel: "命令驱动主套件",
          suiteValue: `${releaseDecision.autoPromotions} 自动放行，${releaseDecision.reviewRequired} 进入复核，其中 ${releaseDecision.hardBlocks} 个强阻断`,
          suiteDetail: `${summary.totalScenarios} 个仓库场景 · ${summary.totalPassedGates}/${summary.totalGates} 个 gate 已通过`,
          coverageLabel: "Live-local 覆盖广度",
          coverageValue: `${agentCoverageSummary.liveScenarioCount} 个 live-local 场景`,
          coverageDetail: `${splunkSurfaceSummary.socScenarios} 条 Splunk SOC 路线 · 9 条复核路线 · 5 个强制阻断`,
          deliveryLabel: "可安装交付面",
          deliveryValue: `${splunkSurfaceSummary.deploymentArtifacts} 个 Splunk 工件`,
          deliveryDetail: `${splunkSurfaceSummary.mcpTools} 个工具契约 · 安装包 tgz · clean-install report`,
          verifyLabel: "评委能验证什么",
          verifyTitle: "每个关键结论，都能落到命令、工件或深链页面上。",
          verifyBody: "这不是靠一段讲解去说服人，而是让每一次点击都落在已经存在的证据面上。",
          verifyFoot: "suite-summary.json · agent-adapter-suite-summary.json · review envelope",
          wedgeLabel: "为什么它不一样",
          wedgeTitle: "我们不是再做一个 copilot，而是在决定 copilot 什么时候配得上线。",
          wedgeBody: "这会把项目从“助手更聪明”拉到“自动化更可治理”的层级上。",
          blockedAction: "打开阻断案例",
          routeAction: "打开 SOC 路线",
          deliveryAction: "打开交付面"
        }
      : {
          kicker: "first look",
          title: "Three pieces of proof before the pitch.",
          body: "Before a judge clicks deeper, the landing view should already show command-backed results, Splunk-specific workflow coverage, and installable delivery.",
          suiteLabel: "Command-backed suite",
          suiteValue: `${releaseDecision.autoPromotions} auto-promote, ${releaseDecision.reviewRequired} review, ${releaseDecision.hardBlocks} hard-blocked reviews`,
          suiteDetail: `${summary.totalScenarios} repository scenarios · ${summary.totalPassedGates}/${summary.totalGates} gate passes`,
          coverageLabel: "Live-local breadth",
          coverageValue: `${agentCoverageSummary.liveScenarioCount} live-local scenarios`,
          coverageDetail: `${splunkSurfaceSummary.socScenarios} Splunk SOC routes · 9 review routes · 5 hard blocks`,
          deliveryLabel: "Installable delivery",
          deliveryValue: `${splunkSurfaceSummary.deploymentArtifacts} Splunk assets`,
          deliveryDetail: `${splunkSurfaceSummary.mcpTools} tool contracts · packaged tgz · clean-install report`,
          verifyLabel: "What judges can verify",
          verifyTitle: "Every important claim lands on a command, artifact, or deep-linked view.",
          verifyBody: "The story never floats away from evidence. Each click lands on a proof surface that already exists in the repo.",
          verifyFoot: "suite-summary.json · agent-adapter-suite-summary.json · review envelope",
          wedgeLabel: "Why it feels different",
          wedgeTitle: "We are not building another copilot. We are deciding when the copilot is safe enough to act.",
          wedgeBody: "That moves the project from assistant polish into deployment governance.",
          blockedAction: "Open blocked case",
          routeAction: "Open SOC route",
          deliveryAction: "Open delivery surface"
        };

  return (
    <section className="proof-signal-panel" aria-label={copy.kicker}>
      <div className="proof-signal-grid">
        <article className="proof-signal-lead">
          <span>{copy.kicker}</span>
          <h2>{copy.title}</h2>
          <p>{copy.body}</p>
          <div className="proof-signal-list">
            <article className="proof-signal-item">
              <small>{copy.suiteLabel}</small>
              <strong>{copy.suiteValue}</strong>
              <p>{copy.suiteDetail}</p>
            </article>
            <article className="proof-signal-item">
              <small>{copy.coverageLabel}</small>
              <strong>{copy.coverageValue}</strong>
              <p>{copy.coverageDetail}</p>
            </article>
            <article className="proof-signal-item">
              <small>{copy.deliveryLabel}</small>
              <strong>{copy.deliveryValue}</strong>
              <p>{copy.deliveryDetail}</p>
            </article>
          </div>
          <div className="proof-action-row">
            <button onClick={() => onLaunchPreset("overview-to-evidence")} type="button">
              <small>{copy.verifyLabel}</small>
              <strong>{copy.blockedAction}</strong>
            </button>
            <button onClick={() => onLaunchPreset("overview-to-scenarios")} type="button">
              <small>{copy.coverageLabel}</small>
              <strong>{copy.routeAction}</strong>
            </button>
            <button onClick={() => onLaunchPreset("overview-to-companion")} type="button">
              <small>{copy.deliveryLabel}</small>
              <strong>{copy.deliveryAction}</strong>
            </button>
          </div>
        </article>
        <div className="proof-signal-side">
          <article className="proof-signal-card">
            <span>{copy.verifyLabel}</span>
            <strong>{copy.verifyTitle}</strong>
            <p>{copy.verifyBody}</p>
            <small>{copy.verifyFoot}</small>
          </article>
          <article className="proof-signal-card is-accent">
            <span>{copy.wedgeLabel}</span>
            <strong>{copy.wedgeTitle}</strong>
            <p>{copy.wedgeBody}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function JudgeFlowRail({
  activePage,
  locale,
  onSelectPage
}: {
  activePage: AppPage;
  locale: Locale;
  onSelectPage: (page: AppPage) => void;
}) {
  const copy =
    locale === "zh"
      ? {
          kicker: "评审路线",
          title: "按这四步看，最快理解产品为什么值得高分。",
          overview: {
            label: "总览",
            body: "先抓住价值主张、核心指标和发布决策。"
          },
          scenarios: {
            label: "场景路线",
            body: "进入最强的安全处置链，看工具、证据和审批关口如何联动。"
          },
          evidence: {
            label: "证据与治理",
            body: "直接跳到被拦下的高风险案例，看为什么系统不让它上线。"
          },
          companion: {
            label: "配套应用",
            body: "看 companion app、alert action 和可安装的 Splunk 资产。"
          }
        }
      : {
          kicker: "judge route",
          title: "Follow these four steps to understand the product at judge speed.",
          overview: {
            label: "Overview",
            body: "Start with the value proposition, the core metrics, and the release decision."
          },
          scenarios: {
            label: "SOC scenarios",
            body: "Open the strongest security workflow and watch tools, evidence, and approvals move together."
          },
          evidence: {
            label: "Evidence",
            body: "Go directly to a stopped high-risk case and see why the system refused promotion."
          },
          companion: {
            label: "Companion app",
            body: "Open the companion app, alert action, and installable Splunk assets immediately."
          }
        };

  const steps = [
    { id: "overview" as AppPage, index: "01", ...copy.overview },
    { id: "scenarios" as AppPage, index: "02", ...copy.scenarios },
    { id: "companion" as AppPage, index: "03", ...copy.companion },
    { id: "evidence" as AppPage, index: "04", ...copy.evidence }
  ];
  const activeStep = steps.find((step) => step.id === activePage) ?? steps[0];
  const activeStepRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeStepRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activePage]);

  return (
    <section className="judge-flow-rail" aria-label={copy.kicker}>
      <div className="judge-route-copy">
        <span>{copy.kicker}</span>
        <h2>{copy.title}</h2>
        <p>{activeStep.body}</p>
      </div>
      <div className="judge-route-grid" role="tablist" aria-label={copy.kicker}>
        {steps.map((step) => (
          <button
            aria-selected={activePage === step.id}
            className={`judge-route-card ${activePage === step.id ? "is-active" : ""}`}
            key={step.id}
            onClick={() => onSelectPage(step.id)}
            ref={activePage === step.id ? activeStepRef : null}
            role="tab"
            type="button"
          >
            <small>{step.index}</small>
            <strong>{step.label}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}

function ScenariosPage({
  agentCoverageSummary,
  contestMode,
  locale,
  riskRadarSummary,
  scenarioAnalysis,
  selectedSplunkScenarioId,
  scenarioWorkbenchSummary,
  setSelectedSplunkScenarioId
}: {
  agentCoverageSummary: AgentCoverageSummary;
  contestMode: ReturnType<typeof getContestMode>;
  locale: Locale;
  riskRadarSummary: AgentRiskRadarSummary;
  scenarioAnalysis: ScenarioAnalysisItem[];
  selectedSplunkScenarioId: SplunkScenarioId;
  scenarioWorkbenchSummary: ScenarioWorkbenchSummary;
  setSelectedSplunkScenarioId: (id: SplunkScenarioId) => void;
}) {
  return (
    <>
      {contestMode === "splunk" ? (
        <SplunkContestSection
          locale={locale}
          selectedScenarioId={selectedSplunkScenarioId}
          onSelectScenario={setSelectedSplunkScenarioId}
        />
      ) : null}
      {contestMode === "sans" ? <SansIrScenarioSection locale={locale} /> : null}
      <AgentCoveragePanel coverageSummary={agentCoverageSummary} locale={locale} />
      <RiskRadarPanel locale={locale} riskRadarSummary={riskRadarSummary} />
      <ScenarioWorkbenchPanel
        locale={locale}
        scenarioAnalysis={scenarioAnalysis}
        workbenchSummary={scenarioWorkbenchSummary}
      />
    </>
  );
}

function CompanionPage({
  contestMode,
  locale,
  selectedSplunkDeliveryId,
  setSelectedSplunkDeliveryId
}: {
  contestMode: ReturnType<typeof getContestMode>;
  locale: Locale;
  selectedSplunkDeliveryId: SplunkDeliveryId;
  setSelectedSplunkDeliveryId: (id: SplunkDeliveryId) => void;
}) {
  return (
    <>
      {contestMode === "splunk" ? (
        <SplunkCompanionAppSection
          locale={locale}
          selectedDeliveryId={selectedSplunkDeliveryId}
          onSelectDelivery={setSelectedSplunkDeliveryId}
        />
      ) : null}
      {contestMode === "sans" ? <SansReplaySection locale={locale} /> : null}
      <OperatorRunbookPanel contestMode={contestMode} locale={locale} />
      <section className="trace-band" aria-label={t(locale, "trace.aria")}>
        <TraceStep index="01" title={t(locale, "trace.1.title")} detail={t(locale, "trace.1.detail")} />
        <TraceStep index="02" title={t(locale, "trace.2.title")} detail={t(locale, "trace.2.detail")} />
        <TraceStep index="03" title={t(locale, "trace.3.title")} detail={t(locale, "trace.3.detail")} />
        <TraceStep index="04" title={t(locale, "trace.4.title")} detail={t(locale, "trace.4.detail")} />
      </section>
      <EvidenceChainPanel locale={locale} />
    </>
  );
}

function EvidencePage({
  atlasCoverageLabel,
  filteredScenarios,
  locale,
  onScenarioFilterChange,
  onScenarioSelect,
  optimizationSummary,
  ownerQueue,
  protocolSummary,
  riskAssurance,
  scenarioFilter,
  scenarioToneCounts,
  selectedScenario,
  selectedScenarioFocus,
  targetIssues,
  summary
}: {
  atlasCoverageLabel: string;
  filteredScenarios: ScenarioEvidence[];
  locale: Locale;
  onScenarioFilterChange: (filter: ScenarioToneFilter) => void;
  onScenarioSelect: (id: string) => void;
  optimizationSummary: ReturnType<typeof buildOptimizationSummary>;
  ownerQueue: OwnerReviewQueueItem[];
  protocolSummary: string;
  riskAssurance: RiskAssuranceSummary;
  scenarioFilter: ScenarioToneFilter;
  scenarioToneCounts: ReturnType<typeof countScenariosByTone>;
  selectedScenario: ScenarioEvidence;
  selectedScenarioFocus: ReturnType<typeof buildScenarioFocusSummary>;
  targetIssues: IssueSummary[];
  summary: ReturnType<typeof buildConsoleSummary>;
}) {
  const selectedIndex = filteredScenarios.findIndex((scenario) => scenario.id === selectedScenario.id);

  function stepScenario(direction: "previous" | "next") {
    if (!filteredScenarios.length) {
      return;
    }

    const fallbackIndex = selectedIndex >= 0 ? selectedIndex : 0;
    const nextIndex =
      direction === "previous"
        ? Math.max(0, fallbackIndex - 1)
        : Math.min(filteredScenarios.length - 1, fallbackIndex + 1);

    onScenarioSelect(filteredScenarios[nextIndex].id);
  }

  return (
    <>
      <EvidenceReviewDesk
        activeFilter={scenarioFilter}
        counts={scenarioToneCounts}
        filteredCount={filteredScenarios.length}
        locale={locale}
        onFilterChange={onScenarioFilterChange}
        onNext={() => stepScenario("next")}
        onPrevious={() => stepScenario("previous")}
        selectedIndex={selectedIndex}
        selectedScenario={selectedScenario}
        selectedScenarioFocus={selectedScenarioFocus}
        totalVisible={filteredScenarios.length}
      />
      <RiskAssurancePanel locale={locale} ownerQueue={ownerQueue} riskAssurance={riskAssurance} />

      <section className="console-grid">
        <section className="scenario-panel" aria-label={t(locale, "matrix.aria")}>
          <div className="panel-heading">
            <div>
              <h2>{t(locale, "matrix.title")}</h2>
              <p>
                {filteredScenarios.length}/{summary.totalScenarios} {t(locale, "matrix.description")}
              </p>
            </div>
          </div>
          <div className="scenario-list">
            {filteredScenarios.map((scenario) => (
              <ScenarioRow
                key={scenario.id}
                locale={locale}
                scenario={scenario}
                selected={scenario.id === selectedScenario.id}
                onSelect={() => onScenarioSelect(scenario.id)}
              />
            ))}
          </div>
        </section>

        <EvidencePanel locale={locale} scenario={selectedScenario} />
      </section>

      <section className="details-grid">
        <GatePanel locale={locale} scenario={selectedScenario} />
        <IssueTargetPanel issues={targetIssues} locale={locale} />
      </section>

      <OptimizationPanel locale={locale} selectedScenario={selectedScenario} optimizationSummary={optimizationSummary} />
      <UniversalGatePanel locale={locale} />
      <FailureAtlasPanel coverageLabel={atlasCoverageLabel} locale={locale} />
      <ResearchPanel locale={locale} protocolSummary={protocolSummary} />
    </>
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

const sansOperatorWorkflowSteps: Record<Locale, OperatorWorkflowStep[]> = {
  en: [
    {
      id: "sans-install",
      title: "Install and verify the workspace",
      command: "npm install; npm test",
      artifact: "Vitest output",
      why: "Proves the local environment can run the product before collecting incident-response evidence."
    },
    {
      id: "sans-run-check",
      title: "Run the SANS evidence gate",
      command: "npm run sans:check",
      artifact: "agentguard-runs/sans-find-evil/",
      why: "Builds the workspaces, replays the SIFT-compatible case, runs adapter scenarios, and verifies the submission packet."
    },
    {
      id: "sans-review-log",
      title: "Inspect the self-correction log",
      command: "Get-Content agentguard-runs/sans-find-evil/agent-execution-log.jsonl",
      artifact: "agent-execution-log.jsonl",
      why: "Shows the exact tool calls, token usage, and unsupported claim that was corrected before the final narrative."
    },
    {
      id: "sans-review-accuracy",
      title: "Review confirmed, rejected, and inferred findings",
      command: "Get-Content agentguard-runs/sans-find-evil/accuracy-report.json",
      artifact: "accuracy-report.json",
      why: "Lets judges trace each conclusion to an artifact locator instead of trusting a generic summary."
    },
    {
      id: "sans-video",
      title: "Prepare the under-five-minute demo",
      command: "npm run video:prep:sans",
      artifact: "agentguard-runs/sans-demo-video/",
      why: "Creates the shot list, narration, and submission checklist for a video that includes terminal execution and audio."
    }
  ],
  zh: [
    {
      id: "sans-install",
      title: "安装并验证工作区",
      command: "npm install; npm test",
      artifact: "Vitest 输出",
      why: "先证明本地环境可以运行产品，再收集事件响应证据。"
    },
    {
      id: "sans-run-check",
      title: "运行 SANS 证据门禁",
      command: "npm run sans:check",
      artifact: "agentguard-runs/sans-find-evil/",
      why: "构建工作区、重放 SIFT 兼容案例、运行适配器场景，并验证提交包。"
    },
    {
      id: "sans-review-log",
      title: "检查自我纠错日志",
      command: "Get-Content agentguard-runs/sans-find-evil/agent-execution-log.jsonl",
      artifact: "agent-execution-log.jsonl",
      why: "展示具体工具调用、token 用量，以及最终叙事前被纠正的弱证据结论。"
    },
    {
      id: "sans-review-accuracy",
      title: "复查 confirmed、rejected 和 inferred 结论",
      command: "Get-Content agentguard-runs/sans-find-evil/accuracy-report.json",
      artifact: "accuracy-report.json",
      why: "让评委把每个结论追溯到 artifact locator，而不是只相信摘要。"
    },
    {
      id: "sans-video",
      title: "准备五分钟以内演示视频",
      command: "npm run video:prep:sans",
      artifact: "agentguard-runs/sans-demo-video/",
      why: "生成镜头表、旁白和提交清单，确保视频包含终端运行和音频讲解。"
    }
  ]
};

function OperatorRunbookPanel({
  contestMode,
  locale
}: {
  contestMode: ReturnType<typeof getContestMode>;
  locale: Locale;
}) {
  const isSans = contestMode === "sans";
  const copy =
    isSans && locale === "zh"
      ? {
          aria: "SANS 证据复现 Runbook",
          kicker: "SANS REPLAY RUNBOOK",
          title: "从克隆仓库到可审计 IR 证据，只需五步。",
          body: "评委可以运行同一条 SIFT 兼容证据链，查看自我纠错、准确性报告和提交视频素材，而不用相信截图。"
        }
      : isSans
        ? {
            aria: "SANS evidence replay runbook",
            kicker: "SANS REPLAY RUNBOOK",
            title: "Five steps from clone to auditable IR evidence.",
            body:
              "A judge can run the same SIFT-compatible evidence chain, inspect self-correction, review accuracy, and prepare the demo package without trusting screenshots."
          }
        : {
            aria: t(locale, "runbook.aria"),
            kicker: t(locale, "runbook.kicker"),
            title: t(locale, "runbook.title"),
            body: t(locale, "runbook.body")
          };
  const steps = isSans ? sansOperatorWorkflowSteps[locale] : operatorWorkflowSteps;

  return (
    <section className="operator-runbook-panel" aria-label={copy.aria}>
      <div className="operator-runbook-copy">
        <span>{copy.kicker}</span>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <div className="operator-step-grid">
        {steps.map((step, index) => (
          <OperatorStepCard index={index + 1} key={step.id} locale={locale} step={step} />
        ))}
      </div>
    </section>
  );
}

function OperatorStepCard({ index, locale, step }: { index: number; locale: Locale; step: OperatorWorkflowStep }) {
  const localizedStep = formatOperatorWorkflowStepForLocale(step, locale);

  return (
    <article className="operator-step-card">
      <div className="operator-step-index">{String(index).padStart(2, "0")}</div>
      <h3>{localizedStep.title}</h3>
      <dl>
        <div>
          <dt>{t(locale, "runbook.command")}</dt>
          <dd>
            <code>{localizedStep.command}</code>
          </dd>
        </div>
        <div>
          <dt>{t(locale, "runbook.artifact")}</dt>
          <dd>{localizedStep.artifact}</dd>
        </div>
        <div>
          <dt>{t(locale, "runbook.why")}</dt>
          <dd>{localizedStep.why}</dd>
        </div>
      </dl>
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
          value={String(coverageSummary.localValidatedProfiles)}
          detail={t(locale, "platform.blueprints.detail")}
        />
        <Metric
          label={t(locale, "platform.liveScenarios")}
          value={String(coverageSummary.liveScenarioCount)}
          detail={t(locale, "platform.liveScenarios.detail")}
        />
        <Metric
          label={t(locale, "platform.blueprintScenarios")}
          value={String(coverageSummary.localScenarioCount)}
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

function RiskRadarPanel({
  locale,
  riskRadarSummary
}: {
  locale: Locale;
  riskRadarSummary: AgentRiskRadarSummary;
}) {
  const localizedSummary = formatAgentRiskRadarSummaryForLocale(riskRadarSummary, locale);
  const highestPressureVector =
    agentRiskVectors.find((vector) => vector.name === riskRadarSummary.highestPressureVector) ?? agentRiskVectors[0];
  const localizedHighestPressure =
    localizedSummary.highestPressureVector === riskRadarSummary.highestPressureVector
      ? formatAgentRiskVectorForLocale(highestPressureVector, locale).name
      : localizedSummary.highestPressureVector;

  return (
    <section className="risk-radar-panel" aria-label={t(locale, "radar.aria")}>
      <div className="risk-radar-lead">
        <span>{t(locale, "radar.kicker")}</span>
        <h2>{t(locale, "radar.title")}</h2>
        <p>{t(locale, "radar.body")}</p>
      </div>
      <div className="risk-radar-metrics">
        <Metric
          label={t(locale, "radar.totalVectors")}
          value={String(localizedSummary.totalVectors)}
          detail={localizedSummary.coverageLabel}
        />
        <Metric
          label={t(locale, "radar.liveVectors")}
          value={`${localizedSummary.liveVectors}/${localizedSummary.totalVectors}`}
          detail={t(locale, "platform.liveScenarios.detail")}
        />
        <Metric
          label={t(locale, "radar.blueprintVectors")}
          value={`${localizedSummary.blueprintVectors}/${localizedSummary.totalVectors}`}
          detail={t(locale, "platform.blueprintScenarios.detail")}
        />
        <Metric
          label={t(locale, "radar.highestPressure")}
          value={localizedHighestPressure}
          detail={t(locale, "radar.control")}
        />
      </div>
      <div className="risk-vector-grid">
        {agentRiskVectors.map((vector) => (
          <RiskVectorCard key={vector.id} locale={locale} vector={vector} />
        ))}
      </div>
    </section>
  );
}

function RiskVectorCard({ locale, vector }: { locale: Locale; vector: AgentRiskVector }) {
  const localizedVector = formatAgentRiskVectorForLocale(vector, locale);

  return (
    <article className="risk-vector-card">
      <div className="risk-vector-score">
        <span>{vector.pressureScore}</span>
        <div aria-hidden="true">
          <i style={{ width: `${vector.pressureScore}%` }} />
        </div>
      </div>
      <h3>{localizedVector.name}</h3>
      <p>{localizedVector.failureSignal}</p>
      <dl>
        <div>
          <dt>{t(locale, "radar.source")}</dt>
          <dd>{localizedVector.source}</dd>
        </div>
        <div>
          <dt>{t(locale, "radar.control")}</dt>
          <dd>{localizedVector.control}</dd>
        </div>
        <div>
          <dt>{t(locale, "radar.payoff")}</dt>
          <dd>{localizedVector.productPayoff}</dd>
        </div>
      </dl>
    </article>
  );
}

function ScenarioWorkbenchPanel({
  locale,
  scenarioAnalysis,
  workbenchSummary
}: {
  locale: Locale;
  scenarioAnalysis: ScenarioAnalysisItem[];
  workbenchSummary: ScenarioWorkbenchSummary;
}) {
  const topLiveScenarios = scenarioAnalysis.slice(0, 6);
  const topExpansionCandidates = scenarioExpansionCandidates.slice(0, 6);

  return (
    <section className="scenario-workbench-panel" aria-label={t(locale, "workbench.aria")}>
      <div className="scenario-workbench-copy">
        <span>{t(locale, "workbench.kicker")}</span>
        <h2>{t(locale, "workbench.title")}</h2>
        <p>{t(locale, "workbench.body")}</p>
      </div>
      <div className="scenario-workbench-metrics">
        <Metric
          label={t(locale, "workbench.liveScenarios")}
          value={String(workbenchSummary.liveScenarioCount)}
          detail={workbenchSummary.firstRunCommand}
        />
        <Metric
          label={t(locale, "workbench.criticalLive")}
          value={String(workbenchSummary.criticalLiveScenarios)}
          detail={workbenchSummary.topLiveScenarioId}
        />
        <Metric
          label={t(locale, "workbench.expansionCandidates")}
          value={String(workbenchSummary.expansionCandidateCount)}
          detail={t(locale, "workbench.expansionBacklog")}
        />
        <Metric
          label={t(locale, "workbench.criticalCandidates")}
          value={String(workbenchSummary.criticalExpansionCandidates)}
          detail={workbenchSummary.topExpansionCandidateId}
        />
      </div>
      <div className="scenario-workbench-columns">
        <div className="scenario-workbench-column">
          <div className="scenario-workbench-heading">
            <span>{t(locale, "workbench.livePriority")}</span>
            <strong>{workbenchSummary.topLiveScenarioId}</strong>
          </div>
          <div className="scenario-analysis-list">
            {topLiveScenarios.map((item) => (
              <ScenarioAnalysisCard item={item} key={item.scenarioId} locale={locale} />
            ))}
          </div>
        </div>
        <div className="scenario-workbench-column">
          <div className="scenario-workbench-heading">
            <span>{t(locale, "workbench.expansionBacklog")}</span>
            <strong>{workbenchSummary.topExpansionCandidateId}</strong>
          </div>
          <div className="scenario-analysis-list">
            {topExpansionCandidates.map((candidate) => (
              <ScenarioExpansionCard candidate={candidate} key={candidate.id} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScenarioAnalysisCard({ item, locale }: { item: ScenarioAnalysisItem; locale: Locale }) {
  const localizedItem = formatScenarioAnalysisItemForLocale(item, locale);

  return (
    <article className={`scenario-analysis-card is-${item.severity}`}>
      <div className="scenario-analysis-topline">
        <span>{item.riskPoints}</span>
        <strong>{localizedItem.title}</strong>
      </div>
      <dl>
        <div>
          <dt>{t(locale, "workbench.owner")}</dt>
          <dd>{localizedItem.owner}</dd>
        </div>
        <div>
          <dt>{t(locale, "workbench.vector")}</dt>
          <dd>{localizedItem.riskVectorName}</dd>
        </div>
        <div>
          <dt>{t(locale, "workbench.action")}</dt>
          <dd>{localizedItem.recommendedAction}</dd>
        </div>
        <div>
          <dt>{t(locale, "runbook.command")}</dt>
          <dd>
            <code>{localizedItem.command}</code>
          </dd>
        </div>
      </dl>
    </article>
  );
}

function ScenarioExpansionCard({ candidate, locale }: { candidate: ScenarioExpansionCandidate; locale: Locale }) {
  const localizedCandidate = formatScenarioExpansionCandidateForLocale(candidate, locale);
  const vector = agentRiskVectors.find((item) => item.id === candidate.riskVectorId) ?? agentRiskVectors[0];
  const profile = agentProfiles.find((item) => item.id === candidate.agentProfileId) ?? agentProfiles[0];
  const localizedVector = formatAgentRiskVectorForLocale(vector, locale);
  const localizedProfile = formatAgentProfileForLocale(profile, locale);

  return (
    <article className={`scenario-expansion-card is-${candidate.priority}`}>
      <div className="scenario-expansion-topline">
        <span>{formatScenarioExpansionPriority(candidate.priority, locale)}</span>
        <strong>{localizedCandidate.title}</strong>
      </div>
      <p>{localizedCandidate.userStory}</p>
      <dl>
        <div>
          <dt>{t(locale, "workbench.agentProfile")}</dt>
          <dd>{localizedProfile.name}</dd>
        </div>
        <div>
          <dt>{t(locale, "workbench.vector")}</dt>
          <dd>{localizedVector.name}</dd>
        </div>
        <div>
          <dt>{t(locale, "workbench.case")}</dt>
          <dd>{localizedCandidate.testCloudCase}</dd>
        </div>
        <div>
          <dt>{t(locale, "workbench.expectedEvidence")}</dt>
          <dd>{localizedCandidate.expectedEvidence}</dd>
        </div>
      </dl>
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
    <button
      aria-pressed={selected}
      className={`scenario-row ${selected ? "is-selected" : ""}`}
      type="button"
      onClick={onSelect}
    >
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

function EvidenceReviewDesk({
  activeFilter,
  counts,
  filteredCount,
  locale,
  onFilterChange,
  onNext,
  onPrevious,
  selectedIndex,
  selectedScenario,
  selectedScenarioFocus,
  totalVisible
}: {
  activeFilter: ScenarioToneFilter;
  counts: ReturnType<typeof countScenariosByTone>;
  filteredCount: number;
  locale: Locale;
  onFilterChange: (filter: ScenarioToneFilter) => void;
  onNext: () => void;
  onPrevious: () => void;
  selectedIndex: number;
  selectedScenario: ScenarioEvidence;
  selectedScenarioFocus: ReturnType<typeof buildScenarioFocusSummary>;
  totalVisible: number;
}) {
  const tone = evidenceTone(selectedScenario);
  const copy =
    locale === "zh"
      ? {
          kicker: "评审台",
          title: "先选一个案例，再看为什么放行、复核，或拦截。",
          body: "把 24 条场景压成一条清晰的决策路径：哪位负责人接手，哪条控制触发，哪份证据足够支撑结论。",
          all: "全部",
          success: "放行",
          warning: "复核",
          danger: "拦截",
          visible: "当前可见",
          selected: "当前案例",
          previous: "上一条",
          next: "下一条",
          owner: "负责人",
          control: "控制措施",
          evidence: "证据标准",
          blockedGates: "失败闸门"
        }
      : {
          kicker: "Review Desk",
          title: "Choose a scenario first, then inspect exactly why it ships, routes, or stops.",
          body: "Compress 24 scenarios into one clear decision path: who owns the risk, which control fired, and what evidence is strong enough to justify the outcome.",
          all: "All",
          success: "Ready",
          warning: "Review",
          danger: "Blocked",
          visible: "Visible now",
          selected: "Selected case",
          previous: "Previous",
          next: "Next",
          owner: "Owner",
          control: "Control",
          evidence: "Evidence standard",
          blockedGates: "Failed gates"
        };

  const filters: Array<{ id: ScenarioToneFilter; label: string; count: number }> = [
    { id: "all", label: copy.all, count: counts.all },
    { id: "success", label: copy.success, count: counts.success },
    { id: "warning", label: copy.warning, count: counts.warning },
    { id: "danger", label: copy.danger, count: counts.danger }
  ];
  const activeFilterRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeFilterRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeFilter]);

  return (
    <section className="review-desk-panel" aria-label={copy.kicker}>
      <div className="review-desk-copy">
        <span>{copy.kicker}</span>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <div className="review-desk-toolbar">
        <div className="review-chip-row" role="tablist" aria-label={copy.kicker}>
          {filters.map((filter) => (
            <button
              aria-selected={activeFilter === filter.id}
              className={activeFilter === filter.id ? "is-active" : ""}
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              ref={activeFilter === filter.id ? activeFilterRef : null}
              role="tab"
              type="button"
            >
              <small>{filter.label}</small>
              <strong>{filter.count}</strong>
            </button>
          ))}
        </div>
        <div className="review-stepper">
          <div className="review-stepper-meta">
            <span>{copy.visible}</span>
            <strong>{`${filteredCount} / ${counts.all}`}</strong>
          </div>
          <div className="review-stepper-controls">
            <button disabled={selectedIndex <= 0} onClick={onPrevious} type="button">
              {copy.previous}
            </button>
            <button disabled={selectedIndex >= totalVisible - 1} onClick={onNext} type="button">
              {copy.next}
            </button>
          </div>
        </div>
      </div>
      <div className="review-focus-grid">
        <article className={`review-focus-lead is-${tone}`}>
          <span>{copy.selected}</span>
          <h3>{formatScenarioTitle(selectedScenario.id, selectedScenario.title, locale)}</h3>
          <p>{formatScenarioAction(selectedScenario.recommendedAction, locale)}</p>
          <div className="review-focus-meta">
            <strong>{selectedScenario.testCaseId}</strong>
            <b>{selectedScenarioFocus.domain}</b>
          </div>
        </article>
        <article className="review-focus-card">
          <span>{copy.owner}</span>
          <strong>{formatOwner(selectedScenarioFocus.owner, locale)}</strong>
          <p>{selectedScenarioFocus.riskPoints} pts</p>
        </article>
        <article className="review-focus-card">
          <span>{copy.control}</span>
          <strong>{formatShortText(selectedScenarioFocus.control, locale)}</strong>
        </article>
        <article className="review-focus-card">
          <span>{copy.evidence}</span>
          <strong>{formatShortText(selectedScenarioFocus.evidenceStandard, locale)}</strong>
        </article>
        <article className="review-focus-card">
          <span>{copy.blockedGates}</span>
          <strong>{selectedScenarioFocus.blockedGates}</strong>
          <p>{formatToneLabel(tone, locale)}</p>
        </article>
      </div>
    </section>
  );
}

function EvidencePanel({ locale, scenario }: { locale: Locale; scenario: ScenarioEvidence }) {
  const tone = evidenceTone(scenario);
  const riskProfile = findScenarioRiskProfile(scenario.id);
  const contestMode = getContestMode();
  const evidencePreview = {
    sourceSystem: "AgentGuard CI",
    targetPlatform: getContestEvidenceTarget(contestMode),
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
    attachments: ["report.json", "report.md", "junit.xml", getContestEvidenceArtifact(contestMode)]
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

function IssueTargetPanel({ issues, locale }: { issues: IssueSummary[]; locale: Locale }) {
  return (
    <section className="target-panel" aria-label={t(locale, "target.aria")}>
      <div className="panel-heading">
        <div>
          <h2>{t(locale, "target.title")}</h2>
          <p>{t(locale, "target.description")}</p>
        </div>
      </div>
      <div className="issue-list">
        {issues.map((issue) => (
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
        <code>{localizedStep.artifact}</code>
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
