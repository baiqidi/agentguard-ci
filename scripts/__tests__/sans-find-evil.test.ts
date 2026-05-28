import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
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
    const judgeSummary = await readFile(join(outputDir, "judge-evidence-summary.md"), "utf8");
    const readiness = JSON.parse(await readFile(join(outputDir, "sift-readiness.json"), "utf8"));

    expect(log).toContain('"event":"sift_preflight"');
    expect(log).toContain('"tool":"fls"');
    expect(log).toContain('"tool":"wevtutil"');
    expect(log).toContain('"tool":"vol.py"');
    expect(log).toContain('"event":"self_correction"');
    expect(report.summary.selfCorrections).toBe(1);
    expect(report.summary.totalFindings).toBeGreaterThanOrEqual(6);
    expect(report.summary.realisticDfirScenarios).toEqual([
      "disk persistence",
      "authentication spraying",
      "network containment",
      "windows event log lateral movement",
      "memory process tree triage"
    ]);
    expect(report.siftReadiness).toMatchObject({
      readinessArtifact: "sift-readiness.json",
      architecturalPattern: "Direct Agent Extension"
    });
    expect(report.findings[0]).toMatchObject({
      status: "confirmed",
      artifact: "registry-run-key.txt",
      locator: "NTUSER.DAT:Software\\Microsoft\\Windows\\CurrentVersion\\Run@0x1f4a"
    });
    expect(readiness).toMatchObject({
      architecturalPattern: "Direct Agent Extension",
      protocol: "Protocol SIFT MCP",
      fixtureFallback: true
    });
    expect(readiness.protocolSift.installCommand).toContain("protocol-sift/main/install.sh");
    expect(readiness.toolMatrix.map((tool: { name: string }) => tool.name)).toEqual([
      "fls",
      "mactime",
      "rip.pl",
      "tshark",
      "wevtutil",
      "vol.py"
    ]);
    expect(dataset).toContain("sans-fixtures/case-001/auth.log");
    expect(dataset).toContain("windows-security-events.jsonl");
    expect(dataset).toContain("memory-process-tree.json");
    expect(dataset).toContain("Protocol SIFT install command");
    expect(dataset).toContain("sift-readiness.json");
    expect(judgeSummary).toContain("Five realistic DFIR checkpoints");
    expect(judgeSummary).toContain("Windows Event Log lateral movement");
    expect(judgeSummary).toContain("Memory process tree triage");
    expect(narrative).toContain("Confirmed password spraying");
    expect(narrative).toContain("Unsupported compromise claim corrected");
    expect(narrative).toContain("Confirmed lateral movement");
    expect(narrative).toContain("Memory process tree remains review-gated");

    const verify = spawnSync(
      "node",
      ["scripts/verify-sans-find-evil-submission.mjs", "--output-dir", outputDir, "--skip-docs"],
      {
        cwd: process.cwd(),
        encoding: "utf8"
      }
    );

    expect(verify.status).toBe(0);
    expect(verify.stdout).toContain("PASS readiness:sift-preflight");
    expect(verify.stdout).toContain("PASS dataset:dfir-breadth");
    expect(verify.stdout).toContain("PASS judge-summary:readable-packet");
    expect(verify.stdout).toContain("SANS FIND EVIL submission check passed");
  });

  it("includes a public CI workflow that runs the SANS readiness gate", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "agentguard-sans-"));
    tempDirs.push(outputDir);

    const run = spawnSync("node", ["scripts/run-sans-sift-ir-demo.mjs", "--output-dir", outputDir], {
      cwd: process.cwd(),
      encoding: "utf8"
    });
    expect(run.status).toBe(0);

    const verify = spawnSync("node", ["scripts/verify-sans-find-evil-submission.mjs", "--output-dir", outputDir], {
      cwd: process.cwd(),
      encoding: "utf8"
    });

    expect(verify.status).toBe(0);
    expect(verify.stdout).toContain("PASS workflow:sans-find-evil");
  });

  it("prepares video narration and a submission checklist without leaking script notes", async () => {
    const result = spawnSync("node", ["scripts/prepare-sans-demo-video.mjs"], {
      cwd: process.cwd(),
      encoding: "utf8"
    });

    expect(result.status).toBe(0);

    const outputDir = join(process.cwd(), "agentguard-runs", "sans-demo-video");
    const shotList = JSON.parse(await readFile(join(outputDir, "shot-list.json"), "utf8"));
    const voiceover = await readFile(join(outputDir, "voiceover-en.txt"), "utf8");
    const chineseGuide = await readFile(join(outputDir, "voiceover-zh.txt"), "utf8");
    const checklist = await readFile(join(outputDir, "submission-checklist.md"), "utf8");
    const manifest = JSON.parse(await readFile(join(outputDir, "asset-manifest.json"), "utf8"));

    expect(shotList).toHaveLength(7);
    expect(shotList.some((shot: { url: string }) => shot.url === "terminal:npm run sans:check")).toBe(true);
    expect(shotList.every((shot: { narration: string }) => !shot.narration.includes("Screen note"))).toBe(true);
    expect(voiceover).toContain("Every conclusion points to a file, offset, log line, or flow identifier");
    expect(voiceover).not.toContain("terminal:");
    expect(chineseGuide).toContain("这份中文稿只给录制者参考");
    expect(checklist).toContain("YouTube/Vimeo/Youku link");
    expect(checklist).toContain("Code repository: https://github.com/baiqidi/agentguard-ci/tree/codex/sans-find-evil");
    expect(checklist).not.toContain("file://");
    expect(manifest.verifiedEvidence.findings).toBeGreaterThanOrEqual(4);
    expect(existsSync(join(outputDir, "asset-manifest.json"))).toBe(true);
  });

  it("prepares SANS voiceover review assets without synthesizing audio", async () => {
    const prep = spawnSync("node", ["scripts/prepare-sans-demo-video.mjs"], {
      cwd: process.cwd(),
      encoding: "utf8"
    });
    expect(prep.status).toBe(0);

    const result = spawnSync("node", ["scripts/prepare-sans-demo-audio.mjs", "--prepare-only"], {
      cwd: process.cwd(),
      encoding: "utf8"
    });

    expect(result.status).toBe(0);

    const outputDir = join(process.cwd(), "agentguard-runs", "sans-demo-video");
    const manifest = JSON.parse(await readFile(join(outputDir, "audio-review-manifest.json"), "utf8"));
    const review = await readFile(join(outputDir, "voiceover-review-en.md"), "utf8");

    expect(manifest.prepareOnly).toBe(true);
    expect(manifest.targetDurationSeconds).toBe(180);
    expect(review).toContain("Scene 02 0:21-0:45 - Live terminal run");
    expect(review).not.toContain("terminal:");
  });
});
