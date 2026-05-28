import { describe, expect, it } from "vitest";
import { getPageNavigation, parseAppPage } from "../appNavigation.js";

describe("app navigation", () => {
  it("falls back to overview when the page parameter is unknown", () => {
    expect(parseAppPage(null)).toBe("overview");
    expect(parseAppPage("unknown")).toBe("overview");
    expect(parseAppPage("scenarios")).toBe("scenarios");
  });

  it("returns Splunk-specific information architecture", () => {
    expect(getPageNavigation("en", "splunk").map((item) => item.label)).toEqual([
      "Overview",
      "SOC Scenarios",
      "Companion App",
      "Evidence"
    ]);
    expect(getPageNavigation("zh", "splunk")[2].description).toContain("companion app");
  });

  it("returns SANS-specific information architecture", () => {
    expect(getPageNavigation("en", "sans").map((item) => item.label)).toEqual([
      "IR Overview",
      "SIFT Scenarios",
      "Run Locally",
      "Evidence"
    ]);
    expect(getPageNavigation("en", "sans")[1].description).toContain("self-correction");
  });
});
