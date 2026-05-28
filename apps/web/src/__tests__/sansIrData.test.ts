import { describe, expect, it } from "vitest";

import {
  getSansIrCopy,
  sansArtifactCards,
  sansScenarioCards,
  summarizeSansIrSurface
} from "../sansIrData.js";

describe("SANS FIND EVIL IR data", () => {
  it("models the three core SIFT incident-response routes", () => {
    expect(sansScenarioCards.map((card) => card.id)).toEqual([
      "sift-disk-persistence-self-correction",
      "sift-auth-log-accuracy-validation",
      "sift-containment-approval"
    ]);
    expect(sansScenarioCards[0].evidence.en).toContain("NTUSER.DAT");
    expect(sansScenarioCards[1].correction.en).toContain("password spraying");
    expect(sansScenarioCards[2].unsafeAction.en).toContain("isolate endpoint");
  });

  it("summarizes judge-facing SANS evidence surfaces", () => {
    expect(summarizeSansIrSurface()).toEqual({
      irRoutes: 3,
      localArtifacts: 4,
      selfCorrections: 1,
      accuracyStatuses: 3,
      replayCommands: 2
    });
    expect(sansArtifactCards.map((card) => card.id)).toEqual([
      "execution-log",
      "accuracy-report",
      "dataset-doc",
      "investigative-narrative"
    ]);
  });

  it("keeps the SANS hero copy specific to FIND EVIL", () => {
    expect(getSansIrCopy("en").title).toContain("Protocol SIFT");
    expect(getSansIrCopy("zh").body).toContain("自我纠错");
  });
});
