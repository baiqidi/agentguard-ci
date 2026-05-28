import type { ContestMode } from "./contestMode.js";
import type { Locale } from "./i18n.js";
import type { AppPage } from "./appNavigation.js";

interface ScoreCard {
  id: string;
  label: string;
  title: string;
  body: string;
  proof: string;
  page: AppPage;
}

interface ReadinessItem {
  id: string;
  label: string;
  detail: string;
}

export function getJudgingCards(locale: Locale, contestMode: ContestMode): ScoreCard[] {
  if (contestMode === "sans") {
    if (locale === "zh") {
      return [
        {
          id: "autonomy",
          label: "Autonomous Execution",
          title: "不只让 Agent 跑得快，还要让它在证据不足时自己改口。",
          body: "SANS 评委会看自我纠错。这里把错误假设、纠正动作和最终结论都写进执行日志。",
          proof: "See agent-execution-log.jsonl and accuracy-report.json.",
          page: "companion"
        },
        {
          id: "accuracy",
          label: "IR Accuracy",
          title: "每个结论都落到文件、offset、日志行或 flow id。",
          body: "确认、驳回和推断会分开标注，避免把可疑现象讲成已经入侵。",
          proof: "See the SIFT evidence packet and artifact findings.",
          page: "evidence"
        },
        {
          id: "depth",
          label: "Breadth and Depth",
          title: "覆盖磁盘、认证日志和网络处置三条 IR 路线。",
          body: "不是单个 toy prompt，而是把取证、日志分析、处置审批串成可复现流程。",
          proof: "See the SIFT Scenarios page.",
          page: "scenarios"
        },
        {
          id: "audit",
          label: "Audit Trail",
          title: "视频和仓库都能回放同一条证据链。",
          body: "终端日志、准确性报告、数据集说明和调查叙事来自同一次本地运行。",
          proof: "Run npm run sans:check.",
          page: "companion"
        }
      ];
    }

    return [
      {
        id: "autonomy",
        label: "Autonomous execution",
        title: "The agent does not only run fast. It corrects itself when evidence is weak.",
        body: "FIND EVIL judges look for self-correction. AgentGuard records the flawed assumption, the correction, and the final evidence-backed claim.",
        proof: "See agent-execution-log.jsonl and accuracy-report.json.",
        page: "companion"
      },
      {
        id: "accuracy",
        label: "IR accuracy",
        title: "Every finding maps to a file, offset, log line, or flow id.",
        body: "Confirmed findings, rejected claims, and inferred leads are separated so the agent cannot turn suspicion into fake certainty.",
        proof: "See the SIFT evidence packet and artifact findings.",
        page: "evidence"
      },
      {
        id: "depth",
        label: "Breadth and depth",
        title: "Three IR routes: disk persistence, auth-log accuracy, and containment approval.",
        body: "This is not a single toy prompt. It connects forensic artifacts, log analysis, and response governance into one replayable workflow.",
        proof: "See the SIFT Scenarios page.",
        page: "scenarios"
      },
      {
        id: "audit",
        label: "Audit trail quality",
        title: "The demo video and repository replay the same evidence chain.",
        body: "Terminal logs, accuracy reporting, dataset documentation, and the investigative narrative are all generated from one local run.",
        proof: "Run npm run sans:check.",
        page: "companion"
      }
    ];
  }

  if (contestMode === "splunk") {
    if (locale === "zh") {
      return [
        {
          id: "implementation",
          label: "技术实现",
          title: "这不只是概念图，companion app、告警动作和验证链都已经能交付。",
          body: "我们已经把 Splunk companion app、saved searches、告警动作和验证脚本收束成一条可安装、可检查、可复现的产品面。",
          proof: "看“配套应用”页面和 splunk:check 验证链。",
          page: "companion"
        },
        {
          id: "design",
          label: "设计",
          title: "四个页面，各讲一件重要的事，评委不需要在长页面里自己找重点。",
          body: "总览讲价值和分数点，场景讲真实风险，交付讲可安装资产，证据讲为什么该放行或该拦下。",
          proof: "按页面导航走完整条 judge route。",
          page: "overview"
        },
        {
          id: "impact",
          label: "潜在影响",
          title: "它真正对准了 Security track：检测更快、调查更稳、自动化更可控。",
          body: "它不是另一个会回答问题的 agent，而是把高风险动作变成可追责、可审批、可复核的安全运营流程。",
          proof: "看“场景路线”页面里的三条高风险闭环。",
          page: "scenarios"
        },
        {
          id: "idea",
          label: "创意质量",
          title: "卖点不是“更聪明”，而是“更值得上线”。",
          body: "很多项目在增强 agent，本项目把重点放在证明 agent 什么时候值得执行、什么时候必须停下。",
          proof: "看“证据与治理”页面里的证据包、复核队列和失败模式地图。",
          page: "evidence"
        }
      ];
    }

    return [
      {
        id: "implementation",
        label: "Technological implementation",
        title: "This is not only a concept. The companion app, alert action, and validation chain all ship.",
        body: "We already package the Splunk companion app, saved searches, alert action, and verification scripts as one installable, inspectable product surface.",
        proof: "See the Companion App page and the splunk:check validation chain.",
        page: "companion"
      },
      {
        id: "design",
        label: "Design",
        title: "Four pages, one clear story per page, so judges do not have to hunt through a giant scroll.",
        body: "Overview frames the value, Scenarios frames the risk, Companion frames delivery, and Evidence frames the release decision.",
        proof: "Follow the page navigation as the judge route.",
        page: "overview"
      },
      {
        id: "impact",
        label: "Potential impact",
        title: "It is tightly aligned to the Security track: faster detection, cleaner investigation, safer automation.",
        body: "This is not another agent that answers questions. It turns high-risk actions into accountable, approval-aware security workflows.",
        proof: "See the three high-risk loops on the SOC Scenarios page.",
        page: "scenarios"
      },
      {
        id: "idea",
        label: "Quality of the idea",
        title: "The core idea is not smarter agents. It is agents that are safe enough to deploy.",
        body: "Most projects try to improve the agent. This one proves when the agent deserves execution, promotion, review, or a hard stop.",
        proof: "See the Evidence page for the evidence packet, review queue, and failure atlas.",
        page: "evidence"
      }
    ];
  }

  if (locale === "zh") {
    return [
      {
        id: "implementation",
        label: "技术实现",
        title: "真实执行、真实验证、真实证据。",
        body: "这套产品通过命令、报告和机器可读工件来证明结果，而不是只展示概念。",
        proof: "看“证据与治理”页面。",
        page: "evidence"
      }
    ];
  }

  return [
    {
      id: "implementation",
      label: "Technological implementation",
      title: "Real execution, real validation, real evidence.",
      body: "The product proves itself through commands, reports, and machine-readable artifacts rather than a concept-only demo.",
      proof: "See the Evidence page.",
      page: "evidence"
    }
  ];
}

export function getReadinessItems(locale: Locale, contestMode: ContestMode): ReadinessItem[] {
  if (contestMode === "sans") {
    if (locale === "zh") {
      return [
        {
          id: "platform",
          label: "SIFT / Protocol SIFT 方向",
          detail: "仓库提供 SIFT-compatible runner、fixture 数据和迁移到 SIFT 工具的命令契约。"
        },
        {
          id: "self-correction",
          label: "自我纠错",
          detail: "执行日志明确记录错误假设、纠正动作和纠正后的证据链。"
        },
        {
          id: "accuracy",
          label: "准确性报告",
          detail: "准确性报告区分 confirmed、rejected 和 inferred findings。"
        },
        {
          id: "replay",
          label: "可复现提交材料",
          detail: "README、架构图、数据集说明、日志和本地校验命令都已准备。"
        }
      ];
    }

    return [
      {
        id: "platform",
        label: "SIFT / Protocol SIFT direction",
        detail: "The repo ships a SIFT-compatible runner, fixture evidence, and a command contract for SIFT tooling."
      },
      {
        id: "self-correction",
        label: "Self-correction sequence",
        detail: "The execution log records the weak assumption, the correction, and the evidence-backed replacement claim."
      },
      {
        id: "accuracy",
        label: "Accuracy report",
        detail: "The report separates confirmed, rejected, and inferred findings with artifact locators."
      },
      {
        id: "replay",
        label: "Replayable submission assets",
        detail: "README, architecture, dataset docs, logs, and local verification commands are prepared for judges."
      }
    ];
  }

  if (contestMode === "splunk") {
    if (locale === "zh") {
      return [
        {
          id: "fit",
          label: "符合 Security track",
          detail: "产品直接面向威胁检测、调查提效和安全自动化治理。"
        },
        {
          id: "capabilities",
          label: "使用 Splunk 当前 AI 能力",
          detail: "覆盖 Splunk MCP Server 和 AI Assistant 的工具命名空间与能力面。"
        },
        {
          id: "runtime",
          label: "可安装且可稳定运行",
          detail: "本地 companion app 打包、告警动作验证、构建和提交流水线都已通过。"
        },
        {
          id: "updates",
          label: "显著更新可说明",
          detail: "submission period 内新增了 SOC 路线、Splunk 打包链、Companion App 和多页面前端。"
        }
      ];
    }

    return [
      {
        id: "fit",
        label: "Security-track fit",
        detail: "Directly aimed at threat detection, faster investigation, and governed security automation."
      },
      {
        id: "capabilities",
        label: "Uses current Splunk AI capabilities",
        detail: "Covers the Splunk MCP Server and AI Assistant tool namespaces and product surfaces."
      },
      {
        id: "runtime",
        label: "Installable and consistently runnable",
        detail: "The local companion app package, alert action validation, build, and submission workflows all pass."
      },
      {
        id: "updates",
        label: "Significant updates are documentable",
        detail: "The submission-period work now includes SOC routes, the Splunk packaging path, the companion app, and the multi-page frontend."
      }
    ];
  }

  if (locale === "zh") {
    return [
      {
        id: "fit",
        label: "主题匹配",
        detail: "产品围绕 AI agent 的真实上线治理问题构建。"
      }
    ];
  }

  return [{ id: "fit", label: "Theme fit", detail: "The product is built around real-world AI agent governance." }];
}

export function JudgingCriteriaPanel({
  contestMode,
  locale,
  onNavigate
}: {
  contestMode: ContestMode;
  locale: Locale;
  onNavigate: (page: AppPage) => void;
}) {
  const cards = getJudgingCards(locale, contestMode);

  return (
    <section className="judge-criteria-panel" aria-label="Judging criteria">
      <div className="judge-panel-copy">
        <span>{locale === "zh" ? "评委视角" : "Judge lens"}</span>
        <h2>
          {locale === "zh"
            ? "不是泛泛展示功能，而是逐项回应评委会怎么打分。"
            : "Not a generic feature tour. A direct answer to how judges score."}
        </h2>
        <p>
          {locale === "zh"
            ? "四项评分标准是等权重的，所以首屏必须先把技术实现、设计、潜在影响和创意质量讲清楚。"
            : "The four criteria are equally weighted, so the landing view needs to establish implementation, design, impact, and idea quality immediately."}
        </p>
      </div>
      <div className="judge-criteria-grid">
        {cards.map((card) => (
          <button className="judge-card" key={card.id} onClick={() => onNavigate(card.page)} type="button">
            <span>{card.label}</span>
            <strong>{card.title}</strong>
            <p>{card.body}</p>
            <small>{card.proof}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export function BaselineReadinessPanel({
  contestMode,
  locale
}: {
  contestMode: ContestMode;
  locale: Locale;
}) {
  const items = getReadinessItems(locale, contestMode);

  return (
    <section className="baseline-panel" aria-label="Stage one readiness">
      <div className="judge-panel-copy">
        <span>{locale === "zh" ? "基础门槛" : "Stage one"}</span>
        <h2>
          {locale === "zh"
            ? "先过基础门槛，再谈创意。"
            : "First pass the baseline. Then compete on originality."}
        </h2>
        <p>
          {locale === "zh"
            ? "很多项目在第一轮就因为要求没打满、功能跑不起来或更新说明不清楚而出局。这里把最容易被筛掉的点直接明牌。"
            : "A surprising number of projects fail the basics: requirements, installability, or clear evidence of what changed. This panel puts those screening risks on the table."}
        </p>
      </div>
      <div className="baseline-grid">
        {items.map((item) => (
          <article className="baseline-card" key={item.id}>
            <b>{locale === "zh" ? "已就绪" : "Ready"}</b>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
