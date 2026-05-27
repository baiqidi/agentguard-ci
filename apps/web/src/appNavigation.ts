import type { ContestMode } from "./contestMode.js";
import type { Locale } from "./i18n.js";

export const appPages = ["overview", "scenarios", "companion", "evidence"] as const;

export type AppPage = (typeof appPages)[number];

export interface PageNavigationItem {
  id: AppPage;
  label: string;
  eyebrow: string;
  description: string;
}

export function parseAppPage(page: string | null | undefined): AppPage {
  if (page && appPages.includes(page as AppPage)) {
    return page as AppPage;
  }

  return "overview";
}

export function getPageNavigation(locale: Locale, contestMode: ContestMode): PageNavigationItem[] {
  if (contestMode === "splunk") {
    if (locale === "zh") {
      return [
        {
          id: "overview",
          label: "总览",
          eyebrow: "从这里看",
          description: "先看价值主张、关键指标，以及为什么这件事值得评委继续往下看。"
        },
        {
          id: "scenarios",
          label: "场景路线",
          eyebrow: "SOC 路线",
          description: "看三条真实高风险路线、已覆盖的 Agent 类型，以及最重要的失败模式。"
        },
        {
          id: "companion",
          label: "配套应用",
          eyebrow: "交付",
          description: "看 companion app、saved searches、告警动作和可交付的 Splunk 资产。"
        },
        {
          id: "evidence",
          label: "证据与治理",
          eyebrow: "评审",
          description: "看证据包、风险归因、复核队列，以及为什么这次动作该放行或该拦下。"
        }
      ];
    }

    return [
      {
        id: "overview",
        label: "Overview",
        eyebrow: "Start here",
        description: "Lead with the value proposition, the core metrics, and why this product deserves attention."
      },
      {
        id: "scenarios",
        label: "SOC Scenarios",
        eyebrow: "SOC paths",
        description: "Show the three high-risk routes, covered agent types, and the most important failure modes."
      },
      {
        id: "companion",
        label: "Companion App",
        eyebrow: "Delivery",
        description: "Show the companion app, saved searches, alert actions, and Splunk-ready delivery assets."
      },
      {
        id: "evidence",
        label: "Evidence",
        eyebrow: "Review",
        description: "Show the evidence packet, risk routing, review queue, and why a change should ship or stop."
      }
    ];
  }

  if (locale === "zh") {
    return [
      {
        id: "overview",
        label: "总览",
        eyebrow: "从这里看",
        description: "先看价值主张、关键指标，以及系统到底在保护什么。"
      },
      {
        id: "scenarios",
        label: "场景",
        eyebrow: "覆盖",
        description: "看已覆盖的 Agent 类型、风险雷达和优先级最高的测试路线。"
      },
      {
        id: "companion",
        label: "运行与交付",
        eyebrow: "运行",
        description: "看运行手册、证据链，以及一线评委如何快速复现。"
      },
      {
        id: "evidence",
        label: "证据与治理",
        eyebrow: "评审",
        description: "看证据包、复核队列、失败模式地图和研究支撑。"
      }
    ];
  }

  return [
    {
      id: "overview",
      label: "Overview",
      eyebrow: "Start here",
      description: "Lead with the value proposition, the key metrics, and what this product actually protects."
    },
    {
      id: "scenarios",
      label: "Scenarios",
      eyebrow: "Coverage",
      description: "Show the covered agent classes, the risk radar, and the highest-priority test routes."
    },
    {
      id: "companion",
      label: "Operations",
      eyebrow: "Operations",
      description: "Show the operator runbook, the evidence chain, and how judges can reproduce the workflow."
    },
    {
      id: "evidence",
      label: "Evidence",
      eyebrow: "Review",
      description: "Show the evidence packet, review queue, failure atlas, and research backing."
    }
  ];
}
