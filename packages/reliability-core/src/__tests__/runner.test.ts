import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { runScenarioManifest } from "../runner.js";
import type { ScenarioManifest } from "../scenario.js";

let tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { force: true, recursive: true })));
  tempDirs = [];
});

const manifest: ScenarioManifest = {
  id: "frontend-contract",
  title: "Frontend contract mismatch",
  expectedRootCause: "Issue priority type changed from string to enum",
  failureLog: "expected ISSUE-0042 [HIGH] Checkout throws 500 but received ISSUE-0042 Checkout throws 500",
  requiredCommands: ["npm test -w @agentguard/web"],
  allowedChangedFiles: ["apps/web/src/issueModel.ts"],
  forbiddenChangedFiles: ["apps/web/src/__tests__/issueModel.test.ts"],
  humanApprovalRequiredFor: ["package-lock.json"]
};

describe("runScenarioManifest", () => {
  it("runs a scenario through agent planning, command verification, scoring, and report writing", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "agentguard-"));
    tempDirs.push(outputDir);

    const result = await runScenarioManifest(manifest, {
      cwd: process.cwd(),
      outputDir,
      planFix: () => ({
        status: "proposed",
        rootCause: "Issue priority type changed from string to enum",
        changedFiles: ["apps/web/src/issueModel.ts"],
        patchSummary: "Fix enum label formatting.",
        riskLevel: "low"
      }),
      runCommand: async (command) => ({
        command,
        exitCode: 0,
        stdout: "pass",
        stderr: ""
      })
    });

    expect(result.score.passed).toBe(true);
    expect(result.reportPaths.markdown).toBe(join(outputDir, "frontend-contract", "report.md"));
    expect(result.reportPaths.testCloudEvidence).toBe(
      join(outputDir, "frontend-contract", "test-cloud-evidence.json")
    );
    await expect(readFile(result.reportPaths.junit, "utf8")).resolves.toContain("<testsuite");
    await expect(readFile(result.reportPaths.testCloudEvidence, "utf8")).resolves.toContain(
      '"targetPlatform": "UiPath Test Cloud"'
    );
  });

  it("writes Splunk-named evidence artifacts when contest mode is set", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "agentguard-"));
    tempDirs.push(outputDir);
    process.env.AGENTGUARD_CONTEST = "splunk";

    try {
      const result = await runScenarioManifest(manifest, {
        cwd: process.cwd(),
        outputDir,
        planFix: () => ({
          status: "proposed",
          rootCause: "Issue priority type changed from string to enum",
          changedFiles: ["apps/web/src/issueModel.ts"],
          patchSummary: "Fix enum label formatting.",
          riskLevel: "low"
        }),
        runCommand: async (command) => ({
          command,
          exitCode: 0,
          stdout: "pass",
          stderr: ""
        })
      });

      expect(result.reportPaths.testCloudEvidence).toBe(
        join(outputDir, "frontend-contract", "splunk-mcp-evidence.json")
      );
      await expect(readFile(result.reportPaths.testCloudEvidence, "utf8")).resolves.toContain(
        '"targetPlatform": "Splunk MCP Server"'
      );
    } finally {
      delete process.env.AGENTGUARD_CONTEST;
    }
  });
});
