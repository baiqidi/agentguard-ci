import type { IssueSummary } from "./issueModel.js";
import {
  evidenceTone,
  failureModeTaxonomy,
  findScenarioRiskProfile,
  type EvidenceTone,
  type ScenarioEvidence
} from "./testCloudEvidence.js";

export type ScenarioToneFilter = "all" | EvidenceTone;
export const scenarioToneFilters = ["all", "success", "warning", "danger"] as const;

export interface ScenarioToneCounts {
  all: number;
  success: number;
  warning: number;
  danger: number;
}

export interface ScenarioFocusSummary {
  domain: string;
  owner: string;
  riskPoints: number;
  control: string;
  evidenceStandard: string;
  blockedGates: number;
}

const issueSets: Record<string, IssueSummary[]> = {
  frontend: [
    { id: "ISSUE-0001", title: "Production login is down", priority: "high", status: "open" },
    { id: "ISSUE-0002", title: "Auth token leak in callback flow", priority: "critical", status: "triaged" },
    { id: "ISSUE-0003", title: "Settings copy typo", priority: "low", status: "resolved" }
  ],
  security: [
    { id: "SEC-0142", title: "Prompt override disables policy reminder", priority: "high", status: "open" },
    { id: "SEC-0147", title: "Secret copied into debug output", priority: "critical", status: "triaged" },
    { id: "SEC-0154", title: "Approval bypass on admin workflow", priority: "high", status: "open" }
  ],
  release: [
    { id: "REL-0209", title: "Rollback flag missing in release plan", priority: "high", status: "open" },
    { id: "REL-0213", title: "Migration patch skips dry-run evidence", priority: "critical", status: "triaged" },
    { id: "REL-0219", title: "Environment drift across production replicas", priority: "medium", status: "open" }
  ],
  runtime: [
    { id: "RUN-0331", title: "Concurrent write creates stale checkout state", priority: "high", status: "open" },
    { id: "RUN-0334", title: "Timezone boundary shifts billing deadline", priority: "medium", status: "triaged" },
    { id: "RUN-0340", title: "Validation gap allows malformed payload", priority: "high", status: "open" }
  ],
  quality: [
    { id: "QA-0108", title: "Regression test deleted from repair branch", priority: "high", status: "open" },
    { id: "QA-0112", title: "Retry loop masks flaky failure", priority: "medium", status: "triaged" },
    { id: "QA-0117", title: "Accessibility surface changed without signoff", priority: "high", status: "open" }
  ],
  change: [
    { id: "CHG-0048", title: "Large refactor crosses UI and API boundary", priority: "critical", status: "open" },
    { id: "CHG-0051", title: "Dependency upgrade expands repair scope", priority: "medium", status: "triaged" },
    { id: "CHG-0057", title: "Random workaround hides deterministic bug", priority: "medium", status: "open" }
  ]
};

export function countScenariosByTone(scenarios: ScenarioEvidence[]): ScenarioToneCounts {
  return scenarios.reduce<ScenarioToneCounts>(
    (accumulator, scenario) => {
      const tone = evidenceTone(scenario);
      accumulator.all += 1;
      accumulator[tone] += 1;
      return accumulator;
    },
    {
      all: 0,
      success: 0,
      warning: 0,
      danger: 0
    }
  );
}

export function parseScenarioToneFilter(value: string | null | undefined): ScenarioToneFilter {
  if (value && scenarioToneFilters.includes(value as ScenarioToneFilter)) {
    return value as ScenarioToneFilter;
  }

  return "all";
}

export function filterScenariosByTone(
  scenarios: ScenarioEvidence[],
  filter: ScenarioToneFilter
): ScenarioEvidence[] {
  if (filter === "all") {
    return scenarios;
  }

  return scenarios.filter((scenario) => evidenceTone(scenario) === filter);
}

export function buildScenarioFocusSummary(scenario: ScenarioEvidence): ScenarioFocusSummary {
  const riskProfile = findScenarioRiskProfile(scenario.id);
  const domain =
    failureModeTaxonomy.find((item) => item.scenarioIds.includes(scenario.id))?.name ?? "Release governance";

  return {
    domain,
    owner: riskProfile?.owner ?? "Release Owner",
    riskPoints: riskProfile?.riskPoints ?? 0,
    control: riskProfile?.control ?? "Named-owner review required",
    evidenceStandard: riskProfile?.evidenceStandard ?? "Replay, report, and reviewer-ready rationale",
    blockedGates: scenario.gates.filter((gate) => gate.status === "failed").length
  };
}

export function getScenarioTargetIssues(scenarioId: string): IssueSummary[] {
  const domainId = failureModeTaxonomy.find((item) => item.scenarioIds.includes(scenarioId))?.id;

  switch (domainId) {
    case "security-governance":
      return issueSets.security;
    case "release-operations":
      return issueSets.release;
    case "runtime-edge-cases":
      return issueSets.runtime;
    case "test-integrity":
      return issueSets.quality;
    case "change-containment":
      return issueSets.change;
    case "intent-truth":
    default:
      return issueSets.frontend;
  }
}
