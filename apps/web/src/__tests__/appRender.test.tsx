import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";

import { App } from "../App";

describe("App render", () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    if (originalWindow === undefined) {
      // @ts-expect-error restoring test global
      delete globalThis.window;
      return;
    }

    Object.defineProperty(globalThis, "window", {
      value: originalWindow,
      configurable: true,
      writable: true
    });
  });

  it("renders without throwing", () => {
    expect(() => renderToString(<App />)).not.toThrow();
  });

  for (const href of [
    "http://127.0.0.1:5190/?contest=splunk&lang=en&present=1&page=overview",
    "http://127.0.0.1:5190/?contest=splunk&lang=en&present=1&page=scenarios&soc=security-soc-alert-suppression",
    "http://127.0.0.1:5190/?contest=splunk&lang=en&present=1&page=companion&delivery=review-gate-action",
    "http://127.0.0.1:5190/?contest=splunk&lang=en&present=1&page=evidence&scenario=unsafe-diff-guard&filter=danger",
    "http://127.0.0.1:5190/?contest=sans&lang=en&present=1&page=overview",
    "http://127.0.0.1:5190/?contest=sans&lang=en&present=1&page=scenarios",
    "http://127.0.0.1:5190/?contest=sans&lang=en&present=1&page=companion",
    "http://127.0.0.1:5190/?contest=sans&lang=en&present=1&page=evidence&scenario=sift-containment-approval&filter=danger"
  ]) {
    it(`renders without throwing in presentation mode for ${new URL(href).searchParams.get("page")}`, () => {
      Object.defineProperty(globalThis, "window", {
        value: {
          location: new URL(href),
          history: { replaceState: () => undefined },
          navigator: { language: "en-US" },
          scrollTo: () => undefined
        },
        configurable: true,
        writable: true
      });

      expect(() => renderToString(<App />)).not.toThrow();
    });
  }

  it("uses SANS-specific replay copy instead of Test Cloud copy on the SANS companion page", () => {
    Object.defineProperty(globalThis, "window", {
      value: {
        location: new URL("http://127.0.0.1:5190/?contest=sans&lang=en&present=1&page=companion"),
        history: { replaceState: () => undefined },
        navigator: { language: "en-US" },
        scrollTo: () => undefined
      },
      configurable: true,
      writable: true
    });

    const html = renderToString(<App />);
    expect(html).toContain("Five steps from clone to auditable IR evidence.");
    expect(html).toContain("npm run sans:check");
    expect(html).not.toContain("Five steps from clone to Test Cloud evidence.");
  });

  it("renders DeveloperWeek-specific proof copy on the overview page", () => {
    Object.defineProperty(globalThis, "window", {
      value: {
        location: new URL("http://127.0.0.1:5190/?contest=developerweek&lang=en&present=1&page=overview"),
        history: { replaceState: () => undefined },
        navigator: { language: "en-US" },
        scrollTo: () => undefined
      },
      configurable: true,
      writable: true
    });

    const html = renderToString(<App />);
    expect(html).toContain("AI-agent release gate");
    expect(html).toContain("17 enterprise agent scenarios");
    expect(html).toContain("npm run developerweek:check");
    expect(html).not.toContain("Splunk companion app");
    expect(html).not.toContain("SIFT-compatible case");
  });

  it("uses DeveloperWeek scenario-count copy on the scenarios page", () => {
    Object.defineProperty(globalThis, "window", {
      value: {
        location: new URL("http://127.0.0.1:5190/?contest=developerweek&lang=en&present=1&page=scenarios"),
        history: { replaceState: () => undefined },
        navigator: { language: "en-US" },
        scrollTo: () => undefined
      },
      configurable: true,
      writable: true
    });

    const html = renderToString(<App />);
    expect(html).toContain("17 enterprise agent scenarios across 13 categories");
    expect(html).toContain("Review/block findings");
    expect(html).not.toContain("14 live-local traces");
  });

  it("removes UiPath/Test Cloud copy from DeveloperWeek operation and evidence pages", () => {
    for (const href of [
      "http://127.0.0.1:5190/?contest=developerweek&lang=en&present=1&page=companion",
      "http://127.0.0.1:5190/?contest=developerweek&lang=en&present=1&page=evidence&filter=danger&scenario=unsafe-diff-guard"
    ]) {
      Object.defineProperty(globalThis, "window", {
        value: {
          location: new URL(href),
          history: { replaceState: () => undefined },
          navigator: { language: "en-US" },
          scrollTo: () => undefined
        },
        configurable: true,
        writable: true
      });

      const html = renderToString(<App />);
      expect(html).toContain("DeveloperWeek");
      expect(html).not.toContain("UiPath");
      expect(html).not.toContain("Test Cloud");
      expect(html).toContain("developerweek-ci-evidence.json");
    }
  });
});
