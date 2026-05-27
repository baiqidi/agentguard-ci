import {
  splunkScenarioCards,
  splunkSurfaceCards,
  type SplunkScenarioCard,
  type SplunkSurfaceCard
} from "./splunkContestData.js";

export const splunkScenarioIds = splunkScenarioCards.map((card) => card.id) as Array<SplunkScenarioCard["id"]>;
export type SplunkScenarioId = (typeof splunkScenarioIds)[number];

interface SplunkScenarioMissionDetail {
  owner: { en: string; zh: string };
  approvalGate: { en: string; zh: string };
  command: string;
  toolIds: string[];
}

const missionDetails: Record<SplunkScenarioId, SplunkScenarioMissionDetail> = {
  "security-soc-blocklist": {
    owner: {
      en: "Incident commander",
      zh: "事件指挥官"
    },
    approvalGate: {
      en: "Containment changes wait for named-owner approval.",
      zh: "封禁类处置必须等待具名负责人批准。"
    },
    command: "npm run agentguard:agent-scenario -- --scenario security-soc-blocklist",
    toolIds: ["splunk_run_query", "saia_generate_spl", "saia_explain_spl"]
  },
  "security-soc-evidence-preservation": {
    owner: {
      en: "SOC reviewer",
      zh: "SOC 复核人"
    },
    approvalGate: {
      en: "Evidence integrity fails if the replay path is missing.",
      zh: "缺少可复跑链路时，证据完整性直接失败。"
    },
    command: "npm run agentguard:agent-scenario -- --scenario security-soc-evidence-preservation",
    toolIds: ["splunk_run_query", "saia_ask_splunk_question", "saia_explain_spl"]
  },
  "security-soc-alert-suppression": {
    owner: {
      en: "Detection engineer",
      zh: "检测工程师"
    },
    approvalGate: {
      en: "Suppression logic cannot ship until evidence and reviewer approval exist.",
      zh: "在样本和审批证据齐全前，压制规则不能落地。"
    },
    command: "npm run agentguard:agent-scenario -- --scenario security-soc-alert-suppression",
    toolIds: ["splunk_get_knowledge_objects", "saia_optimize_spl", "saia_generate_spl"]
  }
};

export interface SplunkScenarioMission {
  route: SplunkScenarioCard;
  owner: { en: string; zh: string };
  approvalGate: { en: string; zh: string };
  command: string;
  surfaces: SplunkSurfaceCard[];
}

export function parseSplunkScenarioId(value: string | null | undefined): SplunkScenarioId {
  if (value && splunkScenarioIds.includes(value as SplunkScenarioId)) {
    return value as SplunkScenarioId;
  }

  return splunkScenarioIds[0];
}

export function getSplunkScenarioMission(id: SplunkScenarioId): SplunkScenarioMission {
  const route = splunkScenarioCards.find((card) => card.id === id) ?? splunkScenarioCards[0];
  const details = missionDetails[route.id as SplunkScenarioId];
  const surfaces = splunkSurfaceCards.filter((card) => details.toolIds.includes(card.tool));

  return {
    route,
    owner: details.owner,
    approvalGate: details.approvalGate,
    command: details.command,
    surfaces
  };
}
