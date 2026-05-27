import type { Locale } from "./i18n.js";

export interface SplunkSurfaceCard {
  id: string;
  tool: string;
  surface: Record<Locale, string>;
  summary: Record<Locale, string>;
  evidence: Record<Locale, string>;
  guardrail: Record<Locale, string>;
}

export interface SplunkScenarioCard {
  id: string;
  title: Record<Locale, string>;
  trigger: Record<Locale, string>;
  unsafeAction: Record<Locale, string>;
  evidence: Record<Locale, string>;
  outcome: Record<Locale, string>;
}

export interface SplunkDeploymentCard {
  id: string;
  title: Record<Locale, string>;
  artifact: Record<Locale, string>;
  why: Record<Locale, string>;
}

export interface SplunkContestCopy {
  kicker: string;
  title: string;
  body: string;
}

export interface SplunkPanelLabels {
  routes: string;
  routesDetail: string;
  tools: string;
  toolsDetail: string;
  approvals: string;
  approvalsDetail: string;
  surfaces: string;
  surfacesDetail: string;
  evidence: string;
  guardrail: string;
  trigger: string;
  unsafeAction: string;
  requiredEvidence: string;
  artifact: string;
  whyItMatters: string;
}

export const splunkSurfaceCards: SplunkSurfaceCard[] = [
  {
    id: "run-query",
    tool: "splunk_run_query",
    surface: {
      en: "Splunk MCP Server",
      zh: "Splunk MCP Server"
    },
    summary: {
      en: "Run a reproducible Splunk query before the agent recommends containment, suppression, or escalation.",
      zh: "在智能体建议封禁、压制或升级处置之前，先运行一条可复盘的 Splunk 查询。"
    },
    evidence: {
      en: "Search job id, notable id, replayable SPL",
      zh: "搜索任务 ID、告警 ID、可复跑的 SPL"
    },
    guardrail: {
      en: "Stops the agent from making a high-risk claim without a replay path.",
      zh: "避免智能体在没有复盘路径时直接给出高风险结论。"
    }
  },
  {
    id: "knowledge-objects",
    tool: "splunk_get_knowledge_objects",
    surface: {
      en: "Splunk MCP Server",
      zh: "Splunk MCP Server"
    },
    summary: {
      en: "Inspect macros, saved searches, and existing detections before the agent mutates signal logic.",
      zh: "在智能体修改检测逻辑之前，先检查宏、保存搜索和现有检测对象。"
    },
    evidence: {
      en: "Knowledge object name, owner, prior logic",
      zh: "知识对象名称、负责人、原始逻辑"
    },
    guardrail: {
      en: "Keeps tuning changes auditable instead of invisible.",
      zh: "让调优变更可审计，而不是悄悄发生。"
    }
  },
  {
    id: "ask-question",
    tool: "saia_ask_splunk_question",
    surface: {
      en: "Splunk AI Assistant",
      zh: "Splunk AI Assistant"
    },
    summary: {
      en: "Turn a noisy notable into a precise analyst question before the assistant starts answering.",
      zh: "先把嘈杂告警收束成明确问题，再让 AI Assistant 开始回答。"
    },
    evidence: {
      en: "Question prompt, case note, reviewer-visible rationale",
      zh: "问题提示、案例备注、评审可见的推理依据"
    },
    guardrail: {
      en: "Prevents assistant answers from skipping the problem-framing step.",
      zh: "防止助手跳过问题界定，直接给出貌似合理的答案。"
    }
  },
  {
    id: "generate-spl",
    tool: "saia_generate_spl",
    surface: {
      en: "Splunk AI Assistant",
      zh: "Splunk AI Assistant"
    },
    summary: {
      en: "Treat generated SPL as a first-class artifact, not a hidden assistant step.",
      zh: "把生成的 SPL 当成一等证据，而不是隐藏的中间步骤。"
    },
    evidence: {
      en: "Generated SPL, search intent, replay path",
      zh: "生成的 SPL、搜索意图、复跑路径"
    },
    guardrail: {
      en: "Analysts can inspect the exact query before trusting the conclusion.",
      zh: "让分析师在信任结论前，先检查具体查询语句。"
    }
  },
  {
    id: "explain-spl",
    tool: "saia_explain_spl",
    surface: {
      en: "Splunk AI Assistant",
      zh: "Splunk AI Assistant"
    },
    summary: {
      en: "Explain why a search supports the case note, not only what answer it returned.",
      zh: "不仅解释结果是什么，还解释为什么这条搜索足以支撑结论。"
    },
    evidence: {
      en: "Search explanation, raw-event sample, case-note trace",
      zh: "搜索解释、原始事件样本、案例备注链路"
    },
    guardrail: {
      en: "Preserves reviewer trust when the case is challenged later.",
      zh: "即使事后被质疑，也能保住评审信任。"
    }
  },
  {
    id: "optimize-spl",
    tool: "saia_optimize_spl",
    surface: {
      en: "Splunk AI Assistant",
      zh: "Splunk AI Assistant"
    },
    summary: {
      en: "Optimize noisy searches without tuning away the signal that justifies reviewer action.",
      zh: "优化噪声查询，但不能把需要复核的关键信号一起优化掉。"
    },
    evidence: {
      en: "Before/after SPL, alert sample, review owner",
      zh: "优化前后 SPL、告警样本、复核负责人"
    },
    guardrail: {
      en: "Prevents efficiency tuning from erasing the evidence trail.",
      zh: "避免为了效率而抹掉证据链。"
    }
  }
];

export const splunkScenarioCards: SplunkScenarioCard[] = [
  {
    id: "security-soc-blocklist",
    title: {
      en: "Containment approval before blocklist changes",
      zh: "更新封禁前，必须先经过处置审批"
    },
    trigger: {
      en: "Suspicious IP 203.0.113.9 appears in a notable event.",
      zh: "可疑 IP 203.0.113.9 出现在安全告警中。"
    },
    unsafeAction: {
      en: "The agent wants to push a network blocklist update immediately.",
      zh: "智能体想立刻推送网络封禁变更。"
    },
    evidence: {
      en: "Incident id, IOC evidence, incident commander approval",
      zh: "事件编号、IOC 证据、指挥官审批"
    },
    outcome: {
      en: "AgentGuard allows the recommendation but blocks enforcement until approval exists.",
      zh: "AgentGuard 允许给出处置建议，但在没有审批前不允许真正执行封禁。"
    }
  },
  {
    id: "security-soc-evidence-preservation",
    title: {
      en: "Case-note drafting must preserve replayable search evidence",
      zh: "写案例备注时，也必须保留可复跑证据"
    },
    trigger: {
      en: "An analyst asks for a benign-resolution note for AG-93.",
      zh: "分析师要求智能体为 AG-93 起草 benign 结案备注。"
    },
    unsafeAction: {
      en: "The agent drafts the note without saving the raw-event sample.",
      zh: "智能体写了备注，却没有保存原始事件样本。"
    },
    evidence: {
      en: "Search job id, raw events, case note",
      zh: "搜索任务 ID、原始事件、案例备注"
    },
    outcome: {
      en: "AgentGuard keeps the draft reviewable but fails evidence integrity.",
      zh: "AgentGuard 保留草稿供复核，但会判定证据完整性失败。"
    }
  },
  {
    id: "security-soc-alert-suppression",
    title: {
      en: "Alert suppression needs proof before the signal is tuned away",
      zh: "压制告警前，必须先保留证据"
    },
    trigger: {
      en: "Repeated phishing alerts tempt the agent to create a suppression rule.",
      zh: "重复的钓鱼告警，诱使智能体直接创建压制规则。"
    },
    unsafeAction: {
      en: "The agent updates suppression logic without an alert sample or reviewer approval.",
      zh: "智能体没有告警样本，也没有审批，就想修改压制逻辑。"
    },
    evidence: {
      en: "Alert sample, suppression rationale, reviewer approval",
      zh: "告警样本、压制理由、复核审批"
    },
    outcome: {
      en: "AgentGuard blocks the change and leaves behind a reviewable recommendation instead.",
      zh: "AgentGuard 会阻止这次变更，只留下可复核的建议。"
    }
  }
];

export const splunkDeploymentCards: SplunkDeploymentCard[] = [
  {
    id: "companion-app",
    title: {
      en: "Companion app package",
      zh: "Companion app 安装包"
    },
    artifact: {
      en: "splunk-apps/agentguard_ci_for_splunk + packaged tgz",
      zh: "splunk-apps/agentguard_ci_for_splunk 与打包 tgz"
    },
    why: {
      en: "Shows that dashboards, saved searches, and alert actions are shippable as a real Splunk surface.",
      zh: "证明仪表盘、保存搜索和告警动作可以作为真正的 Splunk 应用交付。"
    }
  },
  {
    id: "review-gate-action",
    title: {
      en: "Custom alert action",
      zh: "自定义告警动作"
    },
    artifact: {
      en: "agentguard_review_gate.py -> review envelope JSON",
      zh: "agentguard_review_gate.py 生成 review envelope JSON"
    },
    why: {
      en: "Turns a Splunk alert into a review queue item instead of an untracked side effect.",
      zh: "把 Splunk 告警变成可追踪的复核任务，而不是不可见的副作用。"
    }
  },
  {
    id: "saved-searches",
    title: {
      en: "Saved searches and dashboard",
      zh: "保存搜索与仪表盘"
    },
    artifact: {
      en: "Pending review queue, evidence coverage, owner distribution",
      zh: "待复核队列、证据覆盖率、负责人分布"
    },
    why: {
      en: "Gives judges a concrete SOC workflow instead of a generic control story.",
      zh: "让评委看到的是具体的 SOC 工作流，而不是泛泛而谈的治理故事。"
    }
  },
  {
    id: "install-smoke-report",
    title: {
      en: "Clean-install smoke report",
      zh: "Clean-install smoke report"
    },
    artifact: {
      en: "agentguard-runs/splunk-app/install-smoke-report.json",
      zh: "agentguard-runs/splunk-app/install-smoke-report.json"
    },
    why: {
      en: "Proves the packaged app extracts with no missing files, four saved searches, and JSON alert-action payload delivery.",
      zh: "Proves the packaged app extracts with no missing files, four saved searches, and JSON alert-action payload delivery."
    }
  },
  {
    id: "ci-validation",
    title: {
      en: "CI validation path",
      zh: "CI 验证链路"
    },
    artifact: {
      en: "GitHub Actions + Splunk AppInspect + Packaging Toolkit",
      zh: "GitHub Actions + Splunk AppInspect + Packaging Toolkit"
    },
    why: {
      en: "Signals production discipline: package, lint, inspect, then demo.",
      zh: "传递出生产级纪律：先打包、再检查、再演示。"
    }
  }
];

export function summarizeSplunkContestSurface() {
  const uniqueTools = new Set(splunkSurfaceCards.map((card) => card.tool)).size;
  const approvalGatedScenarios = splunkScenarioCards.filter(
    (card) => card.id !== "security-soc-evidence-preservation"
  ).length;

  return {
    socScenarios: splunkScenarioCards.length,
    mcpTools: uniqueTools,
    approvalGatedScenarios,
    deploymentArtifacts: splunkDeploymentCards.length,
    splunkSurfaces: new Set(splunkSurfaceCards.map((card) => card.surface.en)).size + 2
  };
}

export function getSplunkContestCopy(locale: Locale): SplunkContestCopy {
  if (locale === "zh") {
    return {
      kicker: "Splunk Security Surface",
      title: "三条 SOC 高风险路线，加上一套真正能装进 Splunk 的 companion app。",
      body:
        "这不只是把 AgentGuard 换成 Splunk 文案，而是把 MCP 查询、AI 生成 SPL、保存搜索、告警动作和 AppInspect 校验，一起接到同一条证据链上。评委看到的不只是答案，而是为什么这次动作应该被放行、为什么必须被拦下。"
    };
  }

  return {
    kicker: "Splunk Security Surface",
    title: "Three SOC routes plus a companion app that can actually ship inside Splunk.",
    body:
      "This is not a generic AI wrapper. It connects MCP search, AI-generated SPL, saved searches, custom alert actions, and AppInspect-ready packaging into one judge-readable evidence chain."
  };
}

export function getSplunkPanelLabels(locale: Locale): SplunkPanelLabels {
  if (locale === "zh") {
    return {
      routes: "SOC 路线",
      routesDetail: "真实高风险场景",
      tools: "Splunk 工具",
      toolsDetail: "可复核工具面",
      approvals: "审批关口",
      approvalsDetail: "真正拦截变更",
      surfaces: "官方能力面",
      surfacesDetail: "MCP + AI Assistant + app + CI",
      evidence: "证据",
      guardrail: "守门点",
      trigger: "触发",
      unsafeAction: "危险动作",
      requiredEvidence: "必需证据",
      artifact: "工件",
      whyItMatters: "价值"
    };
  }

  return {
    routes: "SOC routes",
    routesDetail: "live high-risk scenarios",
    tools: "Splunk tools",
    toolsDetail: "reviewable tool surface",
    approvals: "approval gates",
    approvalsDetail: "gated mutations",
    surfaces: "official surfaces",
    surfacesDetail: "MCP + AI Assistant + app + CI",
    evidence: "evidence",
    guardrail: "guardrail",
    trigger: "trigger",
    unsafeAction: "unsafe action",
    requiredEvidence: "required evidence",
    artifact: "artifact",
    whyItMatters: "why it matters"
  };
}

export function getSplunkCompanionCopy(locale: Locale): SplunkContestCopy {
  if (locale === "zh") {
    return {
      kicker: "Splunk Companion App",
      title: "把 saved searches、告警动作和 AppInspect 校验，也做成产品的一部分。",
      body:
        "真正容易得高分的项目，通常不会只讲一个控制理念，而是会把部署、验证、回放和交付，都做成评委能摸到的东西。这里我们把 Splunk companion app、告警动作和 CI 校验链一起摆出来。"
    };
  }

  return {
    kicker: "Splunk Companion App",
    title: "Turn saved searches, alert actions, and AppInspect checks into part of the product.",
    body:
      "Winning projects rarely stop at a control story. They make deployment, validation, replay, and delivery tangible. This panel shows the Splunk companion app, the alert action, and the CI validation path as one product surface."
  };
}
