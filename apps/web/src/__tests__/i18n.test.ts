import { describe, expect, it } from "vitest";
import type { GateKey } from "../testCloudEvidence.js";
import {
  formatAgentRiskVectorForLocale,
  formatAgentRiskRadarSummaryForLocale,
  formatAgentProfileStatus,
  formatOperatorWorkflowStepForLocale,
  formatScenarioExpansionCandidateForLocale,
  formatGateLabelForLocale,
  formatReleaseDecisionForLocale,
  formatScenarioTitle,
  getInitialLocale,
  messageKeys,
  messages,
  supportedLocales,
  t
} from "../i18n.js";

describe("dashboard internationalization", () => {
  it("chooses an explicit URL locale before browser language", () => {
    expect(getInitialLocale("zh", "en-US")).toBe("zh");
    expect(getInitialLocale("en", "zh-CN")).toBe("en");
  });

  it("uses browser language when URL locale is absent or unsupported", () => {
    expect(getInitialLocale(null, "zh-CN")).toBe("zh");
    expect(getInitialLocale("fr", "en-US")).toBe("en");
  });

  it("keeps every supported locale on the same message contract", () => {
    for (const locale of supportedLocales) {
      expect(Object.keys(messages[locale]).sort()).toEqual([...messageKeys].sort());
    }
  });

  it("translates dashboard chrome into Chinese", () => {
    expect(t("zh", "hero.subtitle")).toContain("企业 AI Agent");
    expect(t("zh", "language.switchLabel")).toBe("切换界面语言");
  });

  it("translates dynamic release and scenario labels", () => {
    expect(
      formatReleaseDecisionForLocale(
        {
          autoPromotions: 7,
          reviewRequired: 17,
          hardBlocks: 12,
          decisionLabel: "7 can promote, 17 need review",
          thresholdLabel: "Promote only when all 5 reliability gates pass",
          executiveSummary: "English fallback"
        },
        "zh"
      ).decisionLabel
    ).toBe("7 个可自动发布，17 个需要复核");
    expect(formatScenarioTitle("secret-handling-guard", "Secret handling guardrail", "zh")).toBe("密钥处理护栏");
  });

  it("translates every reliability gate label", () => {
    const gateKeys: GateKey[] = ["ciRecovery", "rootCauseMatch", "changeSafety", "testIntegrity", "humanApproval"];

    expect(gateKeys.map((gate) => formatGateLabelForLocale(gate, "zh"))).toEqual([
      "CI 恢复",
      "根因匹配",
      "变更安全",
      "测试完整性",
      "人工批准"
    ]);
  });

  it("translates general agent platform copy", () => {
    expect(t("en", "platform.kicker")).toBe("General Agent Control Layer");
    expect(t("zh", "platform.kicker")).toBe("通用 Agent 控制层");
    expect(t("en", "platform.liveScenarios.detail")).toBe("command-backed");
    expect(t("zh", "platform.liveScenarios.detail")).toBe("命令支撑");
    expect(formatAgentProfileStatus("live", "en")).toBe("Live adapter");
    expect(formatAgentProfileStatus("live-local", "en")).toBe("Live-local adapter");
    expect(formatAgentProfileStatus("blueprint", "zh")).toBe("扩展蓝图");
  });

  it("translates agent risk radar copy", () => {
    expect(t("en", "radar.kicker")).toBe("Failure Mode Radar");
    expect(t("zh", "radar.kicker")).toBe("失败模式雷达");
    expect(
      formatAgentRiskVectorForLocale(
        {
          id: "excessive-agency",
          name: "Excessive Agency",
          source: "OWASP excessive agency",
          failureSignal: "The agent takes broad actions beyond the approved task.",
          liveScenarioIds: ["unsafe-diff-guard"],
          blueprintAgentIds: ["workflow-devops"],
          pressureScore: 98,
          control: "Convert autonomy into scoped gates.",
          productPayoff: "AgentGuard is a brake for autonomous action."
        },
        "zh"
      ).name
    ).toBe("过度代理权");
    expect(
      formatAgentRiskRadarSummaryForLocale(
        {
          totalVectors: 8,
          liveVectors: 8,
          blueprintVectors: 8,
          highestPressureVector: "Excessive Agency",
          coverageLabel: "8/8 universal vectors covered by live and local adapter controls"
        },
        "zh"
      ).coverageLabel
    ).toBe("8/8 个通用向量已被真实场景和本地适配器覆盖");
  });

  it("translates operator runbook and scenario workbench copy", () => {
    expect(t("en", "runbook.kicker")).toBe("Operator Runbook");
    expect(t("zh", "runbook.kicker")).toBe("操作 Runbook");
    expect(t("en", "workbench.kicker")).toBe("Scenario Workbench");
    expect(t("zh", "workbench.kicker")).toBe("场景工作台");
    expect(
      formatOperatorWorkflowStepForLocale(
        {
          id: "run-suite",
          title: "Run the full reliability suite",
          command: "npm run agentguard:suite",
          why: "Executes all live scenarios and produces the judge-facing decision summary.",
          artifact: "agentguard-runs/suite-summary.md"
        },
        "zh"
      ).title
    ).toBe("运行完整可靠性套件");
    expect(
      formatScenarioExpansionCandidateForLocale(
        {
          id: "browser-payment-approval",
          title: "Browser agent attempts irreversible payment approval",
          agentProfileId: "browser-rpa",
          riskVectorId: "excessive-agency",
          priority: "critical",
          userStory: "A browser agent is asked to reconcile invoices.",
          testCloudCase: "Replay browser trace.",
          expectedEvidence: "Action trace"
        },
        "zh"
      ).title
    ).toBe("浏览器 Agent 尝试不可逆付款批准");
  });
});
