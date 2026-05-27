import { copyFile, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { force: true, recursive: true })));
  tempDirs.length = 0;
});

async function createFixture() {
  const outputDir = await mkdtemp(join(tmpdir(), "agentguard-splunk-video-"));
  tempDirs.push(outputDir);
  await mkdir(outputDir, { recursive: true });

  const shotList = [
    ["0:00-0:20", "Opening problem"],
    ["0:20-0:42", "Command-backed decision"],
    ["0:42-1:12", "SOC mission desk"],
    ["1:12-1:42", "Splunk tool surfaces"],
    ["1:42-2:10", "Companion app delivery"],
    ["2:10-2:38", "Blocked evidence case"],
    ["2:38-2:55", "Closing value"]
  ].map(([time, name], index) => ({
    time,
    name,
    url: `http://localhost:5190/?contest=splunk&lang=en&page=scene-${index + 1}&present=1`,
    focus: ".app-shell",
    narration: `Scene ${index + 1} explains AgentGuard for Splunk SOC as a review gate for AI security agents, with concrete evidence, owner routing, and a clear promote, review, or block decision for judges.`
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
          targetSeconds: 20,
          spokenSeconds: 18,
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
    join(outputDir, "AgentGuard-CI-Splunk-Demo.manifest.json"),
    `${JSON.stringify({ generatedAt: "2026-05-27T00:00:00.000Z", scenes: 7 }, null, 2)}\n`
  );

  await copyFile(
    "docs/submission/AgentGuard-CI-Splunk-Demo.mp4",
    join(outputDir, "AgentGuard-CI-Splunk-Demo.mp4")
  );

  return outputDir;
}

describe("Splunk demo video verifier", () => {
  it("accepts a generated MP4 only when duration, audio, shot list, and narration are submission-safe", async () => {
    const outputDir = await createFixture();
    const result = spawnSync("node", ["scripts/verify-splunk-demo-video.mjs"], {
      cwd: process.cwd(),
      encoding: "utf8",
      env: {
        ...process.env,
        AGENTGUARD_SPLUNK_VIDEO_DIR: outputDir
      }
    });

    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("PASS video:duration");
    expect(result.stdout).toContain("PASS video:streams");
    expect(result.stdout).toContain("PASS video:resolution");
    expect(result.stdout).toContain("PASS video:shot-sync");
    expect(result.stdout).toContain("PASS narration:clean");
    expect(result.stdout).toContain("Splunk demo video check passed");
  });
});
