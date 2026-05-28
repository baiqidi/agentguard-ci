import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { force: true, recursive: true })));
  tempDirs.length = 0;
});

describe("SANS FIND EVIL local runner", () => {
  it("creates terminal-style execution logs, an accuracy report, and judge-readable evidence docs", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "agentguard-sans-"));
    tempDirs.push(outputDir);

    const result = spawnSync("node", ["scripts/run-sans-sift-ir-demo.mjs", "--output-dir", outputDir], {
      cwd: process.cwd(),
      encoding: "utf8"
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("AgentGuard SANS FIND EVIL run complete");

    const log = await readFile(join(outputDir, "agent-execution-log.jsonl"), "utf8");
    const report = JSON.parse(await readFile(join(outputDir, "accuracy-report.json"), "utf8"));
    const dataset = await readFile(join(outputDir, "evidence-dataset.md"), "utf8");
    const narrative = await readFile(join(outputDir, "investigative-narrative.md"), "utf8");

    expect(log).toContain('"tool":"fls"');
    expect(log).toContain('"event":"self_correction"');
    expect(report.summary.selfCorrections).toBe(1);
    expect(report.findings[0]).toMatchObject({
      status: "confirmed",
      artifact: "registry-run-key.txt",
      locator: "NTUSER.DAT:Software\\Microsoft\\Windows\\CurrentVersion\\Run@0x1f4a"
    });
    expect(dataset).toContain("sans-fixtures/case-001/auth.log");
    expect(narrative).toContain("Confirmed password spraying");
    expect(narrative).toContain("Unsupported compromise claim corrected");

    const verify = spawnSync(
      "node",
      ["scripts/verify-sans-find-evil-submission.mjs", "--output-dir", outputDir, "--skip-docs"],
      {
        cwd: process.cwd(),
        encoding: "utf8"
      }
    );

    expect(verify.status).toBe(0);
    expect(verify.stdout).toContain("SANS FIND EVIL submission check passed");
  });
});
