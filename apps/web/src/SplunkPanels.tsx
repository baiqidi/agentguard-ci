import type { Locale } from "./i18n.js";
import { getSplunkDeliveryMission, splunkDeliveryIds, type SplunkDeliveryId } from "./splunkDeliveryModel.js";
import { getSplunkScenarioMission, splunkScenarioIds, type SplunkScenarioId } from "./splunkMissionModel.js";
import {
  getSplunkCompanionCopy,
  getSplunkContestCopy,
  getSplunkPanelLabels,
  splunkDeploymentCards,
  splunkScenarioCards,
  splunkSurfaceCards,
  summarizeSplunkContestSurface
} from "./splunkContestData.js";

function ContestMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

export function SplunkContestSection({
  locale,
  onSelectScenario,
  selectedScenarioId
}: {
  locale: Locale;
  onSelectScenario: (id: SplunkScenarioId) => void;
  selectedScenarioId: SplunkScenarioId;
}) {
  const copy = getSplunkContestCopy(locale);
  const labels = getSplunkPanelLabels(locale);
  const summary = summarizeSplunkContestSurface();
  const mission = getSplunkScenarioMission(selectedScenarioId);
  const missionCopy =
    locale === "zh"
      ? {
          desk: "SOC 路线评审台",
          title: "选一条高风险处置路线，再看哪组 Splunk 工具和证据会被点亮。",
          body: "这让评委不只是看到三张故事卡，而是能沿着一条真实的安全处置链，理解 AgentGuard 在哪里允许建议、在哪里要求审批、又在哪里直接拦截。",
          owner: "责任人",
          command: "验证命令",
          approval: "审批关口",
          linkedTools: "关联工具面"
        }
      : {
          desk: "SOC mission desk",
          title: "Pick a high-risk route first, then see which Splunk tools and evidence light up.",
          body: "This turns three story cards into a real operating path. Judges can follow one security workflow at a time and see where AgentGuard allows recommendations, where it requires approval, and where it blocks outright.",
          owner: "Owner",
          command: "Validation command",
          approval: "Approval gate",
          linkedTools: "Linked tool surfaces"
        };

  return (
    <section className="splunk-contest-panel" aria-label={copy.kicker}>
      <div className="splunk-contest-copy">
        <span>{copy.kicker}</span>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <div className="splunk-contest-metrics">
        <ContestMetric label={labels.routes} value={String(summary.socScenarios)} detail={labels.routesDetail} />
        <ContestMetric label={labels.tools} value={String(summary.mcpTools)} detail={labels.toolsDetail} />
        <ContestMetric
          label={labels.approvals}
          value={String(summary.approvalGatedScenarios)}
          detail={labels.approvalsDetail}
        />
        <ContestMetric label={labels.surfaces} value={String(summary.splunkSurfaces)} detail={labels.surfacesDetail} />
      </div>
      <div className="splunk-mission-desk">
        <div className="splunk-mission-copy">
          <span>{missionCopy.desk}</span>
          <h3>{missionCopy.title}</h3>
          <p>{missionCopy.body}</p>
        </div>
        <div className="splunk-route-tabs" role="tablist" aria-label={missionCopy.desk}>
          {splunkScenarioIds.map((id) => {
            const route = splunkScenarioCards.find((card) => card.id === id) ?? splunkScenarioCards[0];

            return (
              <button
                aria-selected={selectedScenarioId === id}
                className={selectedScenarioId === id ? "is-active" : ""}
                key={id}
                onClick={() => onSelectScenario(id)}
                role="tab"
                type="button"
              >
                <small>{missionCopy.linkedTools}</small>
                <strong>{route.title[locale]}</strong>
              </button>
            );
          })}
        </div>
        <div className="splunk-mission-grid">
          <article className="splunk-mission-lead">
            <span>{missionCopy.desk}</span>
            <h3>{mission.route.title[locale]}</h3>
            <p>{mission.route.outcome[locale]}</p>
            <dl>
              <div>
                <dt>{labels.trigger}</dt>
                <dd>{mission.route.trigger[locale]}</dd>
              </div>
              <div>
                <dt>{labels.unsafeAction}</dt>
                <dd>{mission.route.unsafeAction[locale]}</dd>
              </div>
              <div>
                <dt>{labels.requiredEvidence}</dt>
                <dd>{mission.route.evidence[locale]}</dd>
              </div>
            </dl>
          </article>
          <article className="splunk-mission-card">
            <span>{missionCopy.owner}</span>
            <strong>{mission.owner[locale]}</strong>
          </article>
          <article className="splunk-mission-card">
            <span>{missionCopy.command}</span>
            <code>{mission.command}</code>
          </article>
          <article className="splunk-mission-card">
            <span>{missionCopy.approval}</span>
            <strong>{mission.approvalGate[locale]}</strong>
          </article>
        </div>
      </div>
      <div className="splunk-surface-grid">
        {splunkSurfaceCards.map((card) => {
          const isLinked = mission.surfaces.some((surface) => surface.id === card.id);

          return (
            <article className={`splunk-surface-card ${isLinked ? "is-linked" : ""}`} key={card.id}>
              <div className="splunk-surface-topline">
                <strong>{card.surface[locale]}</strong>
                <span>{card.tool}</span>
              </div>
              <p>{card.summary[locale]}</p>
              <dl>
                <div>
                  <dt>{labels.evidence}</dt>
                  <dd>{card.evidence[locale]}</dd>
                </div>
                <div>
                  <dt>{labels.guardrail}</dt>
                  <dd>{card.guardrail[locale]}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
      <div className="splunk-scenario-grid">
        {splunkScenarioCards.map((card) => (
          <button
            aria-pressed={selectedScenarioId === card.id}
            className={`splunk-scenario-card ${selectedScenarioId === card.id ? "is-active" : ""}`}
            key={card.id}
            onClick={() => onSelectScenario(card.id as SplunkScenarioId)}
            type="button"
          >
            <h3>{card.title[locale]}</h3>
            <dl>
              <div>
                <dt>{labels.trigger}</dt>
                <dd>{card.trigger[locale]}</dd>
              </div>
              <div>
                <dt>{labels.unsafeAction}</dt>
                <dd>{card.unsafeAction[locale]}</dd>
              </div>
              <div>
                <dt>{labels.requiredEvidence}</dt>
                <dd>{card.evidence[locale]}</dd>
              </div>
            </dl>
            <b>{card.outcome[locale]}</b>
          </button>
        ))}
      </div>
    </section>
  );
}

export function SplunkCompanionAppSection({
  locale,
  onSelectDelivery,
  selectedDeliveryId
}: {
  locale: Locale;
  onSelectDelivery: (id: SplunkDeliveryId) => void;
  selectedDeliveryId: SplunkDeliveryId;
}) {
  const copy = getSplunkCompanionCopy(locale);
  const labels = getSplunkPanelLabels(locale);
  const summary = summarizeSplunkContestSurface();
  const deliveryMission = getSplunkDeliveryMission(selectedDeliveryId);
  const deliveryCopy =
    locale === "zh"
      ? {
          desk: "交付评审台",
          title: "选一个可交付资产，再看它的安装、验证和评审价值。",
          body: "这里的重点不是列文件名，而是让评委理解：这套 Splunk 交付面真的可以被安装、被验证、被复审。",
          path: "资产路径",
          proof: "验证事实",
          payoff: "评审价值",
          command: "校验命令"
        }
      : {
          desk: "delivery desk",
          title: "Pick one delivery asset first, then inspect its install path, validation proof, and judging value.",
          body: "The point here is not to list files. It is to show judges that the Splunk delivery surface can actually be installed, verified, and reviewed.",
          path: "Asset path",
          proof: "Validation proof",
          payoff: "Judging payoff",
          command: "Validation command"
        };

  return (
    <section className="splunk-companion-panel" aria-label={copy.kicker}>
      <div className="splunk-companion-copy">
        <span>{copy.kicker}</span>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <div className="splunk-companion-metrics">
        <ContestMetric
          label={locale === "zh" ? "交付工件" : "delivery assets"}
          value={String(summary.deploymentArtifacts)}
          detail={locale === "zh" ? "应用、动作、仪表盘、安装报告、CI" : "app, action, dashboard, smoke, CI"}
        />
        <ContestMetric
          label={locale === "zh" ? "工具覆盖" : "tool coverage"}
          value={String(summary.mcpTools)}
          detail={locale === "zh" ? "官方 Splunk tool 契约" : "official Splunk tool contracts"}
        />
        <ContestMetric
          label={locale === "zh" ? "风险路线" : "risk routes"}
          value={String(summary.socScenarios)}
          detail={locale === "zh" ? "SOC 高风险闭环" : "SOC high-risk loops"}
        />
      </div>
      <div className="splunk-delivery-desk">
        <div className="splunk-mission-copy">
          <span>{deliveryCopy.desk}</span>
          <h3>{deliveryCopy.title}</h3>
          <p>{deliveryCopy.body}</p>
        </div>
        <div className="splunk-route-tabs" role="tablist" aria-label={deliveryCopy.desk}>
          {splunkDeliveryIds.map((id) => {
            const card = splunkDeploymentCards.find((item) => item.id === id) ?? splunkDeploymentCards[0];

            return (
              <button
                aria-selected={selectedDeliveryId === id}
                className={selectedDeliveryId === id ? "is-active" : ""}
                key={id}
                onClick={() => onSelectDelivery(id)}
                role="tab"
                type="button"
              >
                <small>{deliveryCopy.command}</small>
                <strong>{card.title[locale]}</strong>
              </button>
            );
          })}
        </div>
        <div className="splunk-mission-grid splunk-delivery-grid">
          <article className="splunk-mission-lead">
            <span>{deliveryCopy.desk}</span>
            <h3>{deliveryMission.asset.title[locale]}</h3>
            <p>{deliveryMission.asset.why[locale]}</p>
          </article>
          <article className="splunk-mission-card">
            <span>{deliveryCopy.path}</span>
            <strong>{deliveryMission.path[locale]}</strong>
          </article>
          <article className="splunk-mission-card">
            <span>{deliveryCopy.proof}</span>
            <strong>{deliveryMission.proof[locale]}</strong>
          </article>
          <article className="splunk-mission-card">
            <span>{deliveryCopy.command}</span>
            <code>{deliveryMission.command}</code>
          </article>
          <article className="splunk-mission-card splunk-delivery-payoff">
            <span>{deliveryCopy.payoff}</span>
            <strong>{deliveryMission.reviewPayoff[locale]}</strong>
          </article>
        </div>
      </div>
      <div className="splunk-deployment-grid">
        {splunkDeploymentCards.map((card) => (
          <button
            aria-pressed={selectedDeliveryId === card.id}
            className={`splunk-deployment-card ${selectedDeliveryId === card.id ? "is-active" : ""}`}
            key={card.id}
            onClick={() => onSelectDelivery(card.id as SplunkDeliveryId)}
            type="button"
          >
            <h3>{card.title[locale]}</h3>
            <dl>
              <div>
                <dt>{labels.artifact}</dt>
                <dd>{card.artifact[locale]}</dd>
              </div>
              <div>
                <dt>{labels.whyItMatters}</dt>
                <dd>{card.why[locale]}</dd>
              </div>
            </dl>
          </button>
        ))}
      </div>
    </section>
  );
}
