import { splunkDeploymentCards, type SplunkDeploymentCard } from "./splunkContestData.js";

export const splunkDeliveryIds = splunkDeploymentCards.map((card) => card.id) as Array<SplunkDeploymentCard["id"]>;
export type SplunkDeliveryId = (typeof splunkDeliveryIds)[number];

interface SplunkDeliveryDetail {
  path: { en: string; zh: string };
  proof: { en: string; zh: string };
  reviewPayoff: { en: string; zh: string };
  command: string;
}

const deliveryDetails: Record<SplunkDeliveryId, SplunkDeliveryDetail> = {
  "companion-app": {
    path: {
      en: "splunk-apps/agentguard_ci_for_splunk + agentguard-runs/splunk-app/agentguard_ci_for_splunk.tgz",
      zh: "splunk-apps/agentguard_ci_for_splunk 与 agentguard-runs/splunk-app/agentguard_ci_for_splunk.tgz"
    },
    proof: {
      en: "Packaged app artifact exists and installs as a concrete Splunk surface.",
      zh: "打包产物已生成，说明这不是概念页，而是真正可交付的 Splunk 应用表面。"
    },
    reviewPayoff: {
      en: "Judges can see a real app package instead of screenshots pretending to be a product.",
      zh: "评委看到的是可安装应用，而不是把截图当产品。"
    },
    command: "npm run splunk:app:check"
  },
  "review-gate-action": {
    path: {
      en: "splunk-apps/agentguard_ci_for_splunk/bin/agentguard_review_gate.py",
      zh: "splunk-apps/agentguard_ci_for_splunk/bin/agentguard_review_gate.py"
    },
    proof: {
      en: "Fixture payload becomes a review envelope JSON with owner routing and missing-evidence flags.",
      zh: "fixture 告警负载会被转换成带负责人路由和缺失证据标记的 review envelope JSON。"
    },
    reviewPayoff: {
      en: "This proves the alert action is operational, not decorative.",
      zh: "这证明告警动作是真能跑的，不是摆设。"
    },
    command: "npm run splunk:check"
  },
  "saved-searches": {
    path: {
      en: "savedsearches.conf + agentguard_overview.xml + SOC demo lookup",
      zh: "savedsearches.conf + agentguard_overview.xml + SOC demo lookup"
    },
    proof: {
      en: "Saved searches, queue views, and evidence coverage can be reviewed as Splunk-native assets.",
      zh: "保存搜索、队列视图和证据覆盖度都以 Splunk 原生资产形式存在。"
    },
    reviewPayoff: {
      en: "The delivery story becomes a SOC workflow, not a generic governance slide.",
      zh: "交付故事变成了 SOC 工作流，而不是一张泛泛的治理 PPT。"
    },
    command: "npm run splunk:app:check"
  },
  "install-smoke-report": {
    path: {
      en: "agentguard-runs/splunk-app/install-smoke-report.json",
      zh: "agentguard-runs/splunk-app/install-smoke-report.json"
    },
    proof: {
      en: "Clean extraction shows no missing Splunk app files, four saved searches, JSON payload delivery, and no packaged macOS artifacts.",
      zh: "Clean extraction shows no missing Splunk app files, four saved searches, JSON payload delivery, and no packaged macOS artifacts."
    },
    reviewPayoff: {
      en: "This gives judges a fast installability proof without requiring a full Splunk Cloud login.",
      zh: "This gives judges a fast installability proof without requiring a full Splunk Cloud login."
    },
    command: "npm run splunk:app:check"
  },
  "ci-validation": {
    path: {
      en: ".github/workflows/splunk-companion-app.yml + official Splunk validation chain",
      zh: ".github/workflows/splunk-companion-app.yml 与官方 Splunk 校验链"
    },
    proof: {
      en: "Packaging Toolkit, workflow checks, and companion-app validation all pass before demo time.",
      zh: "Packaging Toolkit、workflow 检查和 companion app 校验都会先通过，再去录 demo。"
    },
    reviewPayoff: {
      en: "Signals production discipline: package, inspect, verify, then present.",
      zh: "传达的是生产纪律：先打包、先检查、先验证，再展示。"
    },
    command: "npm run splunk:check"
  }
};

export interface SplunkDeliveryMission {
  asset: SplunkDeploymentCard;
  path: { en: string; zh: string };
  proof: { en: string; zh: string };
  reviewPayoff: { en: string; zh: string };
  command: string;
}

export function parseSplunkDeliveryId(value: string | null | undefined): SplunkDeliveryId {
  if (value && splunkDeliveryIds.includes(value as SplunkDeliveryId)) {
    return value as SplunkDeliveryId;
  }

  return splunkDeliveryIds[0];
}

export function getSplunkDeliveryMission(id: SplunkDeliveryId): SplunkDeliveryMission {
  const asset = splunkDeploymentCards.find((card) => card.id === id) ?? splunkDeploymentCards[0];
  const detail = deliveryDetails[asset.id as SplunkDeliveryId];

  return {
    asset,
    path: detail.path,
    proof: detail.proof,
    reviewPayoff: detail.reviewPayoff,
    command: detail.command
  };
}
