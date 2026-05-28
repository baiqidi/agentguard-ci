import { describe, expect, it } from "vitest";

import {
  getSansIrCopy,
  sansArtifactCards,
  sansReadinessCards,
  sansScenarioCards,
  summarizeSansIrSurface
} from "../sansIrData.js";

describe("SANS FIND EVIL IR data", () => {
  it("models the expanded SIFT incident-response routes", () => {
    expect(sansScenarioCards.map((card) => card.id)).toEqual([
      "sift-disk-persistence-self-correction",
      "sift-auth-log-accuracy-validation",
      "sift-containment-approval",
      "sift-windows-event-log-lateral-movement",
      "sift-memory-process-tree-review"
    ]);
    expect(sansScenarioCards[0].evidence.en).toContain("NTUSER.DAT");
    expect(sansScenarioCards[1].correction.en).toContain("password spraying");
    expect(sansScenarioCards[2].unsafeAction.en).toContain("isolate endpoint");
    expect(sansScenarioCards[3].evidence.en).toContain("4624");
    expect(sansScenarioCards[4].correction.en).toContain("review-gated");
  });

  it("summarizes judge-facing SANS evidence surfaces", () => {
    expect(summarizeSansIrSurface()).toEqual({
      irRoutes: 5,
      localArtifacts: 6,
      readinessCards: 3,
      selfCorrections: 1,
      accuracyStatuses: 3,
      replayCommands: 2
    });
    expect(sansArtifactCards.map((card) => card.id)).toEqual([
      "execution-log",
      "sift-readiness",
      "accuracy-report",
      "dataset-doc",
      "investigative-narrative",
      "judge-evidence-summary"
    ]);
    expect(sansReadinessCards.map((card) => card.id)).toEqual([
      "fixture-local",
      "sift-live",
      "protocol-sift-install"
    ]);
    expect(sansReadinessCards[1].proof.en).toContain("SANS SIFT Workstation");
    expect(sansReadinessCards[2].command).toContain("protocol-sift/main/install.sh");
  });

  it("keeps the SANS hero copy specific to FIND EVIL", () => {
    expect(getSansIrCopy("en").title).toContain("Protocol SIFT");
    expect(getSansIrCopy("zh").body).toContain("自我纠错");
  });
});
