import { describe, expect, it } from "vitest";
import {
  getSplunkDeliveryMission,
  parseSplunkDeliveryId,
  splunkDeliveryIds
} from "../splunkDeliveryModel.js";

describe("splunk delivery model", () => {
  it("keeps five stable delivery ids for companion deep links", () => {
    expect(splunkDeliveryIds).toEqual([
      "companion-app",
      "review-gate-action",
      "saved-searches",
      "install-smoke-report",
      "ci-validation"
    ]);
  });

  it("parses supported delivery ids and falls back for invalid links", () => {
    expect(parseSplunkDeliveryId("review-gate-action")).toBe("review-gate-action");
    expect(parseSplunkDeliveryId("not-a-delivery-asset")).toBe("companion-app");
    expect(parseSplunkDeliveryId(null)).toBe("companion-app");
  });

  it("maps delivery assets into review proof and validation commands", () => {
    const mission = getSplunkDeliveryMission("review-gate-action");

    expect(mission.command).toBe("npm run splunk:check");
    expect(mission.asset.title.en).toBe("Custom alert action");
    expect(mission.path.en).toContain("agentguard_review_gate.py");
    expect(mission.reviewPayoff.en).toContain("operational");
  });
});
