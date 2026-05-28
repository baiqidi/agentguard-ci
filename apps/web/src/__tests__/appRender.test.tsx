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
});
