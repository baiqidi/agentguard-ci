import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { force: true, recursive: true })));
  tempDirs.length = 0;
});

describe("DeveloperWeek demo video assets", () => {
  it("prepares judge-facing DeveloperWeek narration, route list, and checklist without leaking internal notes", async () => {
    const result = spawnSync("node", ["scripts/prepare-developerweek-demo-video.mjs"], {
      cwd: process.cwd(),
      encoding: "utf8"
    });

    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);

    const outputDir = join(process.cwd(), "agentguard-runs", "developerweek-demo-video");
    const shotList = JSON.parse(await readFile(join(outputDir, "shot-list.json"), "utf8"));
    const voiceover = await readFile(join(outputDir, "voiceover-en.txt"), "utf8");
    const checklist = await readFile(join(outputDir, "submission-checklist.md"), "utf8");
    const manifest = JSON.parse(await readFile(join(outputDir, "asset-manifest.json"), "utf8"));

    expect(shotList).toHaveLength(6);
    expect(shotList.some((shot: { url: string }) => shot.url === "terminal:npm run developerweek:check")).toBe(true);
    expect(
      shotList.every(
        (shot: { url: string }) =>
          shot.url === "terminal:npm run developerweek:check" ||
          (shot.url.includes("?contest=developerweek") && shot.url.includes("present=1"))
      )
    ).toBe(true);
    expect(voiceover).toContain("AI-agent release gate");
    expect(voiceover).toContain("17 enterprise agent scenarios across 13 categories");
    expect(voiceover).toContain("promote, review, or block");
    expect(voiceover).not.toContain("terminal:");
    expect(voiceover).not.toContain("Screen note");
    expect(voiceover).not.toContain("SANS");
    expect(voiceover).not.toContain("Splunk");
    expect(checklist).toContain("YouTube link");
    expect(checklist).toContain("https://github.com/baiqidi/agentguard-ci/tree/codex/developerweek-ny");
    expect(manifest.verifiedEvidence.totalScenarios).toBe(17);
    expect(manifest.verifiedEvidence.liveAgentTypes).toBe(13);
    expect(manifest.futureRecordCommand).toBe("npm run video:record:developerweek");
  });

  it("prepares review-only voiceover assets without synthesizing audio", async () => {
    const prep = spawnSync("node", ["scripts/prepare-developerweek-demo-video.mjs"], {
      cwd: process.cwd(),
      encoding: "utf8"
    });
    expect(prep.status).toBe(0);

    const result = spawnSync("node", ["scripts/prepare-developerweek-demo-audio.mjs", "--prepare-only"], {
      cwd: process.cwd(),
      encoding: "utf8"
    });

    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);

    const outputDir = join(process.cwd(), "agentguard-runs", "developerweek-demo-video");
    const manifest = JSON.parse(await readFile(join(outputDir, "audio-review-manifest.json"), "utf8"));
    const review = await readFile(join(outputDir, "voiceover-review-en.md"), "utf8");

    expect(manifest.prepareOnly).toBe(true);
    expect(manifest.targetDurationSeconds).toBe(117);
    expect(review).toContain("Scene 02 0:18-0:39 - One-command CI proof");
    expect(review).not.toContain("terminal:");
    expect(review).not.toContain("Screen note");
  });

  it("makes the main DeveloperWeek readiness gate validate the demo video asset pipeline", () => {
    const prep = spawnSync("node", ["scripts/prepare-developerweek-demo-video.mjs"], {
      cwd: process.cwd(),
      encoding: "utf8"
    });
    expect(prep.status).toBe(0);

    const result = spawnSync("node", ["scripts/verify-developerweek-submission.mjs"], {
      cwd: process.cwd(),
      encoding: "utf8"
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("PASS package:developerweek-video-scripts");
    expect(result.stdout).toContain("PASS video-prep:developerweek-assets");
    expect(result.stdout).toContain("PASS video-prep:developerweek-narration");
  });
});

async function createVerifierFixture() {
  const outputDir = await mkdtemp(join(tmpdir(), "agentguard-developerweek-video-"));
  tempDirs.push(outputDir);
  await mkdir(outputDir, { recursive: true });

  const shotList = [
    ["0:00-0:24", "Opening product"],
    ["0:24-0:48", "CI proof"],
    ["0:48-1:12", "Enterprise coverage"],
    ["1:12-1:36", "Decision contract"],
    ["1:36-2:08", "Evidence packet"],
    ["2:08-2:55", "Commercial path"]
  ].map(([time, name], index) => ({
    time,
    name,
    url:
      index === 1
        ? "terminal:npm run developerweek:check"
        : `http://localhost:5173/?contest=developerweek&lang=en&page=scene-${index + 1}&present=1`,
    focus: ".app-shell",
    narration:
      `Scene ${index + 1} explains AgentGuard CI as a DeveloperWeek AI-agent release gate with 17 enterprise agent scenarios across 13 categories, machine-readable evidence, and a clear promote, review, or block decision for judges.`
  }));

  await writeFile(join(outputDir, "shot-list.json"), `${JSON.stringify(shotList, null, 2)}\n`);
  await writeFile(join(outputDir, "voiceover-en.txt"), `${shotList.map((shot) => shot.narration).join("\n\n")}\n`);
  await writeFile(
    join(outputDir, "audio-manifest.json"),
    `${JSON.stringify(
      {
        status: "audio-generated",
        targetDurationSeconds: 175,
        durationSeconds: 175,
        segments: shotList.map((shot, index) => ({
          id: `scene-${String(index + 1).padStart(2, "0")}`,
          time: shot.time,
          name: shot.name,
          targetSeconds: 24,
          spokenSeconds: 22,
          paddedSeconds: 2,
          text: join(outputDir, `scene-${index + 1}.txt`),
          audio: join(outputDir, `scene-${index + 1}.wav`)
        }))
      },
      null,
      2
    )}\n`
  );
  await writeFile(
    join(outputDir, "asset-manifest.json"),
    `${JSON.stringify({ generatedAt: "2026-05-29T00:00:00.000Z", targetDuration: "2:55" }, null, 2)}\n`
  );
  await writeFile(
    join(outputDir, "AgentGuard-CI-DeveloperWeek-Demo.manifest.json"),
    `${JSON.stringify({ generatedAt: "2026-05-29T00:00:00.000Z", scenes: 6 }, null, 2)}\n`
  );
  await copyFile(
    "docs/submission/AgentGuard-CI-Splunk-Demo.mp4",
    join(outputDir, "AgentGuard-CI-DeveloperWeek-Demo.mp4")
  );

  return outputDir;
}

describe("DeveloperWeek demo video verifier", () => {
  it("accepts a generated MP4 only when duration, audio, route list, and narration are submission-safe", async () => {
    const outputDir = await createVerifierFixture();
    const result = spawnSync("node", ["scripts/verify-developerweek-demo-video.mjs"], {
      cwd: process.cwd(),
      encoding: "utf8",
      env: {
        ...process.env,
        AGENTGUARD_DEVELOPERWEEK_VIDEO_DIR: outputDir,
        AGENTGUARD_DEVELOPERWEEK_AUDIO_MAX_DETECTED_SILENCE_SECONDS: "12"
      }
    });

    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("PASS video:duration");
    expect(result.stdout).toContain("PASS video:streams");
    expect(result.stdout).toContain("PASS video:resolution");
    expect(result.stdout).toContain("PASS video:shot-sync");
    expect(result.stdout).toContain("PASS narration:clean");
    expect(result.stdout).toContain("DeveloperWeek demo video check passed");
  });
});
