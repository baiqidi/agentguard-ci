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
    expect(items[3].description).toContain("该放行或该拦下");
  });
});

describe("Chinese judging copy", () => {
  it("preserves the four Splunk judging angles", () => {
    const cards = getJudgingCards("zh", "splunk");

    expect(cards).toHaveLength(4);
    expect(cards[0].title).toContain("companion app");
    expect(cards[2].proof).toContain("场景");
    expect(cards[3].title.length).toBeGreaterThan(0);
  });

  it("keeps the baseline readiness checklist localized", () => {
    const items = getReadinessItems("zh", "splunk");

    expect(items).toHaveLength(4);
    expect(items[0].label).toContain("Security track");
    expect(items[1].detail).toContain("MCP Server");
    expect(items[3].detail).toContain("Companion App");
  });
});

describe("DeveloperWeek judging copy", () => {
  it("maps the DeveloperWeek first-round judging criteria to product evidence", () => {
    const cards = getJudgingCards("en", "developerweek");

    expect(cards).toHaveLength(4);
    expect(cards.map((card) => card.label)).toEqual(["Progress", "Concept", "Feasibility", "Enterprise relevance"]);
    expect(cards[0].proof).toContain("developerweek:check");
    expect(cards[1].title).toContain("reliability firewall");
  });

  it("keeps DeveloperWeek readiness focused on installability and evidence", () => {
    const items = getReadinessItems("en", "developerweek");

    expect(items).toHaveLength(4);
    expect(items[0].label).toContain("One-command proof");
    expect(items[1].detail).toContain("17 enterprise agent scenarios");
    expect(items[3].detail).toContain("codex/developerweek-ny");
  });
});

describe("Chinese Splunk contest copy", () => {
  it("keeps the contest hero and companion copy readable", () => {
    const contestCopy = getSplunkContestCopy("zh");
    const companionCopy = getSplunkCompanionCopy("zh");
    const labels = getSplunkPanelLabels("zh");

    expect(contestCopy.body).toContain("MCP");
    expect(companionCopy.title).toContain("saved searches");
    expect(companionCopy.body).toContain("CI");
    expect(labels.routes).toContain("SOC");
    expect(labels.requiredEvidence.length).toBeGreaterThan(0);
  });

  it("keeps the scenario and delivery cards localized", () => {
    expect(splunkScenarioCards[0].title.zh.length).toBeGreaterThan(0);
    expect(splunkScenarioCards[1].outcome.zh.length).toBeGreaterThan(0);
    expect(splunkDeploymentCards[0].title.zh.length).toBeGreaterThan(0);
    expect(splunkDeploymentCards[2].why.zh).toContain("SOC");
  });
});
