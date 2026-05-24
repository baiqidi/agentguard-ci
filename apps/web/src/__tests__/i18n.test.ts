import { describe, expect, it } from "vitest";
import type { GateKey } from "../testCloudEvidence.js";
import {
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
    expect(t("zh", "hero.subtitle")).toContain("AI 代码修复 Agent");
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
});
