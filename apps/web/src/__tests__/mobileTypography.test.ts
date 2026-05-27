import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../App.css", import.meta.url), "utf8");

describe("mobile typography", () => {
  it("keeps the top hero subtitle from breaking English words letter by letter", () => {
    const mobileCss = css.slice(css.indexOf("@media (max-width: 560px)"));

    expect(mobileCss).toMatch(/\.topbar p,[^{}]*\{[^}]*word-break:\s*normal/s);
    expect(mobileCss).not.toMatch(/\.topbar p,[\s\S]*word-break:\s*break-all/);
  });
});
