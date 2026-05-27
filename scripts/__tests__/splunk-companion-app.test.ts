import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { force: true, recursive: true })));
  tempDirs.length = 0;
});

describe("Splunk companion app", () => {
  it("uses the official SLIM output-dir flag and AppInspects the SLIM package", async () => {
    const workflow = await readFile(".github/workflows/splunk-companion-app.yml", "utf8");

    expect(workflow).toContain('python-version: "3.9"');
    expect(workflow).not.toContain('python-version: "3.12"');
    expect(workflow).toContain("--output-dir agentguard-runs/splunk-official");
    expect(workflow).not.toContain("--output-directory");
    expect(workflow).toContain("agentguard-runs/splunk-official/*.tar.gz");
    expect(workflow).not.toContain("splunk-app/agentguard_ci_for_splunk.tgz --mode test");
  });

  it("converts a saved-search alert payload into an AgentGuard review envelope", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "agentguard-splunk-app-"));
    tempDirs.push(outputDir);

    const outputPath = join(outputDir, "review-envelope.json");
    const result = spawnSync(
      "python",
      [
        "splunk-apps/agentguard_ci_for_splunk/bin/agentguard_review_gate.py",
        "--payload-file",
        "tools/splunk/fixtures/alert_payload.json",
        "--output",
        outputPath
      ],
      {
        cwd: process.cwd(),
        encoding: "utf8"
      }
    );

    expect(result.status).toBe(0);
    const envelope = JSON.parse(await readFile(outputPath, "utf8"));

    expect(envelope.reviewOwner).toBe("Security Review");
    expect(envelope.reviewStatus).toBe("needs_review");
    expect(envelope.scenarioId).toBe("security-soc-alert-suppression");
    expect(envelope.missingEvidence).toContain("alert-sample");
    expect(envelope.source.surface).toBe("splunk-alert-action");
  });
});
