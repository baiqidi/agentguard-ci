import { describe, expect, it } from "vitest";

import { getPageNavigation } from "../appNavigation.js";
import { getJudgingCards, getReadinessItems } from "../CompetitionPanels.js";
import {
  getSplunkCompanionCopy,
  getSplunkContestCopy,
  getSplunkPanelLabels,
  splunkDeploymentCards,
  splunkScenarioCards
} from "../splunkContestData.js";

describe("Chinese navigation copy", () => {
  it("keeps the Splunk page map readable and intentional", () => {
    const items = getPageNavigation("zh", "splunk");

    expect(items).toHaveLength(4);
    expect(items.map((item) => item.label)).toEqual(["总览", "场景路线", "配套应用", "证据与治理"]);
    expect(items[0].eyebrow).toBe("从这里看");
    expect(items[0].description).toContain("价值主张");
    expect(items[1].eyebrow).toBe("SOC 路线");
    expect(items[3].description).toContain("放行或该拦下");
  });
});

describe("Chinese judging copy", () => {
  it("preserves the four Splunk judging angles", () => {
    const cards = getJudgingCards("zh", "splunk");

    expect(cards).toHaveLength(4);
    expect(cards.map((card) => card.label)).toEqual(["技术实现", "设计", "潜在影响", "创意质量"]);
    expect(cards[0].title).toContain("companion app");
    expect(cards[1].body).toContain("总览讲价值和分数点");
    expect(cards[2].proof).toContain("场景路线");
    expect(cards[3].title).toContain("更值得上线");
  });

  it("keeps the baseline readiness checklist localized", () => {
    const items = getReadinessItems("zh", "splunk");

    expect(items).toHaveLength(4);
    expect(items.map((item) => item.label)).toEqual([
      "符合 Security track",
      "使用 Splunk 当前 AI 能力",
      "可安装且可稳定运行",
      "显著更新可说明"
    ]);
    expect(items[0].detail).toContain("威胁检测");
    expect(items[1].detail).toContain("MCP Server");
    expect(items[2].detail).toContain("提交流水线");
    expect(items[3].detail).toContain("Companion App");
  });
});

describe("Chinese Splunk contest copy", () => {
  it("keeps the contest hero and companion copy readable", () => {
    const contestCopy = getSplunkContestCopy("zh");
    const companionCopy = getSplunkCompanionCopy("zh");
    const labels = getSplunkPanelLabels("zh");

    expect(contestCopy.title).toContain("三条 SOC 高风险路线");
    expect(contestCopy.body).toContain("MCP 查询");
    expect(companionCopy.title).toContain("saved searches");
    expect(companionCopy.body).toContain("CI 校验链");
    expect(labels.routes).toBe("SOC 路线");
    expect(labels.requiredEvidence).toBe("必需证据");
  });

  it("keeps the scenario and delivery cards localized", () => {
    expect(splunkScenarioCards[0].title.zh).toContain("更新封禁前");
    expect(splunkScenarioCards[1].outcome.zh).toContain("证据完整性失败");
    expect(splunkDeploymentCards[0].title.zh).toContain("安装包");
    expect(splunkDeploymentCards[2].why.zh).toContain("SOC 工作流");
  });
});
