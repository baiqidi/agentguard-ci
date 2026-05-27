import ffmpeg from "@ffmpeg-installer/ffmpeg";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
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

  const shotList = Array.from({ length: 7 }, (_, index) => ({
    time: `0:${(index * 0.2).toFixed(1)}-0:${((index + 1) * 0.2).toFixed(1)}`,
    name: `Scene ${index + 1}`,
    url: `http://localhost:5190/?contest=splunk&lang=en&page=scene-${index + 1}&present=1`,
    focus: ".app-shell",
    narration: `Scene ${index + 1} explains a Splunk review gate with concrete evidence.`
  }));

  await writeFile(join(outputDir, "shot-list.json"), `${JSON.stringify(shotList, null, 2)}\n`);
  await writeFile(join(outputDir, "voiceover-en.txt"), `${shotList.map((shot) => shot.narration).join("\n\n")}\n`);
  await writeFile(
    join(outputDir, "audio-manifest.json"),
    `${JSON.stringify(
      {
        status: "audio-generated",
        targetDurationSeconds: 1.4,
        durationSeconds: 1.4,
        segments: shotList.map((shot, index) => ({
          id: `scene-${String(index + 1).padStart(2, "0")}`,
          time: shot.time,
          name: shot.name,
          targetSeconds: 0.2,
          spokenSeconds: 0.1,
          paddedSeconds: 0.1,
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

  const mp4Path = join(outputDir, "AgentGuard-CI-Splunk-Demo.mp4");
  const ffmpegResult = spawnSync(
    ffmpeg.path,
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      "testsrc=size=320x240:rate=5",
      "-f",
      "lavfi",
      "-i",
      "anullsrc=channel_layout=stereo:sample_rate=44100",
      "-t",
      "1.4",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-shortest",
      mp4Path
    ],
    { encoding: "utf8" }
  );
  expect(ffmpegResult.status).toBe(0);

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
        AGENTGUARD_SPLUNK_VIDEO_DIR: outputDir,
        AGENTGUARD_SPLUNK_VIDEO_MIN_SECONDS: "1",
        AGENTGUARD_SPLUNK_VIDEO_MAX_SECONDS: "2",
        AGENTGUARD_SPLUNK_VIDEO_MIN_WIDTH: "300",
        AGENTGUARD_SPLUNK_VIDEO_MIN_HEIGHT: "200",
        AGENTGUARD_SPLUNK_VIDEO_MIN_BYTES: "1000"
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
