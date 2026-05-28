import ffmpeg from "@ffmpeg-installer/ffmpeg";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const outDir = process.env.AGENTGUARD_SANS_VIDEO_DIR ?? join(root, "agentguard-runs", "sans-demo-video");
const minSeconds = Number(process.env.AGENTGUARD_SANS_VIDEO_MIN_SECONDS ?? 180);
const maxSeconds = Number(process.env.AGENTGUARD_SANS_VIDEO_MAX_SECONDS ?? 300);
const minWidth = Number(process.env.AGENTGUARD_SANS_VIDEO_MIN_WIDTH ?? 1280);
const minHeight = Number(process.env.AGENTGUARD_SANS_VIDEO_MIN_HEIGHT ?? 720);
const minBytes = Number(process.env.AGENTGUARD_SANS_VIDEO_MIN_BYTES ?? 10_000);
const syncToleranceSeconds = Number(process.env.AGENTGUARD_SANS_VIDEO_SYNC_TOLERANCE_SECONDS ?? 6);
const maxSegmentPaddingSeconds = Number(process.env.AGENTGUARD_SANS_AUDIO_MAX_SEGMENT_PADDING_SECONDS ?? 3);
const maxDetectedSilenceSeconds = Number(process.env.AGENTGUARD_SANS_AUDIO_MAX_DETECTED_SILENCE_SECONDS ?? 3.5);
let inspectedVideoDurationSeconds = null;

const paths = {
  mp4: join(outDir, "AgentGuard-IR-SANS-Demo.mp4"),
  shotList: join(outDir, "shot-list.json"),
  voiceover: join(outDir, "voiceover-en.txt"),
  audioManifest: join(outDir, "audio-manifest.json"),
  assetManifest: join(outDir, "asset-manifest.json"),
  demoManifest: join(outDir, "AgentGuard-IR-SANS-Demo.manifest.json")
};

const checks = [];

function pass(name, detail = "") {
  checks.push({ status: "PASS", name, detail });
}

function fail(name, detail) {
  checks.push({ status: "FAIL", name, detail });
}

function read(path) {
  return readFileSync(path, "utf8");
}

function readJson(path) {
  return JSON.parse(read(path));
}

function parseTimestamp(value) {
  const [minutes, seconds] = value.split(":").map(Number);
  return minutes * 60 + seconds;
}

function shotDurationSeconds(time) {
  const [start, end] = time.split("-");
  return parseTimestamp(end) - parseTimestamp(start);
}

function inspectVideo(path) {
  const result = spawnSync(ffmpeg.path, ["-hide_banner", "-i", path], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10
  });
  return `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
}

function parseDurationSeconds(output) {
  const match = output.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!match) {
    return null;
  }

  const [, hours, minutes, seconds] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

function parseResolution(output) {
  const videoLine = output
    .split("\n")
    .find((line) => /Stream #.*Video:/.test(line) && /, \d+x\d+/.test(line));
  const match = videoLine?.match(/,\s*(\d+)x(\d+)[,\s]/);
  if (!match) {
    return null;
  }

  return { width: Number(match[1]), height: Number(match[2]) };
}

function detectSilences(path) {
  const result = spawnSync(
    ffmpeg.path,
    ["-hide_banner", "-i", path, "-af", "silencedetect=noise=-45dB:d=0.7", "-f", "null", "-"],
    {
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 10
    }
  );
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  return [...output.matchAll(/silence_duration:\s*(\d+(?:\.\d+)?)/g)].map((match) => Number(match[1]));
}

function checkRequiredFiles() {
  for (const [label, path] of Object.entries(paths)) {
    if (existsSync(path)) {
      pass(`file:${label}`);
    } else {
      fail(`file:${label}`, `Missing ${path}`);
    }
  }
}

function checkVideo() {
  if (!existsSync(paths.mp4)) {
    return;
  }

  const bytes = statSync(paths.mp4).size;
  if (bytes >= minBytes) {
    pass("video:size", `${bytes} bytes`);
  } else {
    fail("video:size", `Expected at least ${minBytes} bytes, got ${bytes}.`);
  }

  const probe = inspectVideo(paths.mp4);
  const durationSeconds = parseDurationSeconds(probe);
  const hasVideo = /Stream #.*Video:/.test(probe);
  const hasAudio = /Stream #.*Audio:/.test(probe);
  const resolution = parseResolution(probe);

  if (durationSeconds !== null && durationSeconds >= minSeconds && durationSeconds <= maxSeconds) {
    inspectedVideoDurationSeconds = durationSeconds;
    pass("video:duration", `${durationSeconds.toFixed(1)}s`);
  } else {
    fail(
      "video:duration",
      `Expected ${minSeconds}-${maxSeconds}s, got ${durationSeconds === null ? "unknown" : `${durationSeconds.toFixed(1)}s`}.`
    );
  }

  if (hasVideo && hasAudio) {
    pass("video:streams", "video and audio streams detected");
  } else {
    fail("video:streams", `Video stream: ${hasVideo}; audio stream: ${hasAudio}.`);
  }

  if (resolution && resolution.width >= minWidth && resolution.height >= minHeight) {
    pass("video:resolution", `${resolution.width}x${resolution.height}`);
  } else {
    fail(
      "video:resolution",
      `Expected at least ${minWidth}x${minHeight}, got ${
        resolution ? `${resolution.width}x${resolution.height}` : "unknown"
      }.`
    );
  }
}

function checkShotListAndAudio() {
  if (!existsSync(paths.shotList) || !existsSync(paths.audioManifest)) {
    return;
  }

  const shotList = readJson(paths.shotList);
  const audioManifest = readJson(paths.audioManifest);
  const totalSeconds = shotList.reduce((sum, shot) => sum + shotDurationSeconds(shot.time), 0);
  const hasTerminalScene = shotList.some((shot) => shot.url === "terminal:npm run sans:check");
  const hasOnlyAllowedRoutes = shotList.every(
    (shot) =>
      shot.url === "terminal:npm run sans:check" ||
      (shot.url.includes("?contest=sans") &&
        shot.url.includes("present=1") &&
        !shot.url.includes("file:") &&
        !shot.url.includes("devpost") &&
        !shot.url.includes("submit"))
  );

  if (shotList.length === 7 && totalSeconds <= maxSeconds && hasTerminalScene && hasOnlyAllowedRoutes) {
    pass("shot-list:routes", `${shotList.length} scenes / ${totalSeconds}s / terminal plus SANS product routes`);
  } else {
    fail(
      "shot-list:routes",
      `Expected 7 SANS scenes under ${maxSeconds}s with one terminal scene. Scenes: ${shotList.length}; seconds: ${totalSeconds}; terminal: ${hasTerminalScene}; allowed routes: ${hasOnlyAllowedRoutes}.`
    );
  }

  if (
    inspectedVideoDurationSeconds !== null &&
    Math.abs(inspectedVideoDurationSeconds - totalSeconds) <= syncToleranceSeconds
  ) {
    pass(
      "video:shot-sync",
      `MP4 ${inspectedVideoDurationSeconds.toFixed(1)}s within ${syncToleranceSeconds}s of shot-list ${totalSeconds}s`
    );
  } else {
    fail(
      "video:shot-sync",
      `Expected MP4 duration to stay within ${syncToleranceSeconds}s of shot-list duration ${totalSeconds}s; got ${
        inspectedVideoDurationSeconds === null ? "unknown" : `${inspectedVideoDurationSeconds.toFixed(1)}s`
      }.`
    );
  }

  const audioDuration = Number(audioManifest.durationSeconds);
  const segmentCount = Array.isArray(audioManifest.segments) ? audioManifest.segments.length : 0;
  const maxPadding = Array.isArray(audioManifest.segments)
    ? Math.max(...audioManifest.segments.map((segment) => Number(segment.paddedSeconds ?? 0)))
    : Number.POSITIVE_INFINITY;
  if (
    audioManifest.status === "audio-generated" &&
    segmentCount === shotList.length &&
    Number.isFinite(audioDuration) &&
    Math.abs(audioDuration - totalSeconds) <= 1.5 &&
    maxPadding <= maxSegmentPaddingSeconds
  ) {
    pass("audio:scene-aligned", `${segmentCount} segments / ${audioDuration}s / max padding ${maxPadding}s`);
  } else {
    fail(
      "audio:scene-aligned",
      `Expected generated audio with ${shotList.length} segments, duration near ${totalSeconds}s, and no padding over ${maxSegmentPaddingSeconds}s. Status: ${audioManifest.status}; segments: ${segmentCount}; duration: ${audioManifest.durationSeconds}; max padding: ${maxPadding}.`
    );
  }
}

function checkAudioSilence() {
  if (!existsSync(paths.mp4)) {
    return;
  }

  const silences = detectSilences(paths.mp4);
  const maxSilence = silences.length > 0 ? Math.max(...silences) : 0;

  if (maxSilence <= maxDetectedSilenceSeconds) {
    pass("audio:silence-budget", `${silences.length} detected pauses / max ${maxSilence.toFixed(1)}s`);
  } else {
    fail(
      "audio:silence-budget",
      `Expected no detected silence over ${maxDetectedSilenceSeconds}s; longest was ${maxSilence.toFixed(1)}s.`
    );
  }
}

function checkNarration() {
  if (!existsSync(paths.voiceover) || !existsSync(paths.shotList)) {
    return;
  }

  const voiceover = read(paths.voiceover);
  const shotList = readJson(paths.shotList);
  const generatedSpeech = `${voiceover}\n${shotList.map((shot) => shot.narration).join("\n")}`;
  const forbiddenTokens = [
    "undefined",
    "NaN",
    "file://",
    "[object Object]",
    "##",
    "Screen narration",
    "Screen note",
    "terminal:",
    "C:\\Users",
    "scripts/",
    "in the hackathon scene"
  ];
  const redFlags = forbiddenTokens.filter((token) => generatedSpeech.includes(token));

  if (redFlags.length === 0 && voiceover.trim().length > 500) {
    pass("narration:clean", "no internal markers or local paths found");
  } else {
    fail(
      "narration:clean",
      `Narration must be judge-facing and free of internal markers. Red flags: ${redFlags.join(", ") || "none"}; length: ${
        voiceover.trim().length
      }.`
    );
  }
}

checkRequiredFiles();
checkVideo();
checkShotListAndAudio();
checkAudioSilence();
checkNarration();

for (const check of checks) {
  const suffix = check.detail ? ` - ${check.detail}` : "";
  console.log(`${check.status} ${check.name}${suffix}`);
}

const failures = checks.filter((check) => check.status === "FAIL");
if (failures.length > 0) {
  console.error(`\nSANS demo video check failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log(`\nSANS demo video check passed: ${checks.length} checks.`);
