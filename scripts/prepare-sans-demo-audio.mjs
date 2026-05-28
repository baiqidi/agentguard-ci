import ffmpeg from "@ffmpeg-installer/ffmpeg";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";

const root = process.cwd();
const outDir = join(root, "agentguard-runs", "sans-demo-video");
const segmentDir = join(outDir, "audio-segments");
const shotListPath = join(outDir, "shot-list.json");
const voiceoverTextPath = join(outDir, "voiceover-en.txt");
const reviewPath = join(outDir, "voiceover-review-en.md");
const manifestPath = join(outDir, "audio-manifest.json");
const reviewManifestPath = join(outDir, "audio-review-manifest.json");
const canonicalWavPath = join(outDir, "AgentGuard-IR-SANS-Voiceover-en.wav");
const prepareOnly = process.argv.includes("--prepare-only");

const edgeVoice = process.env.AGENTGUARD_SANS_EDGE_VOICE ?? "en-US-EmmaMultilingualNeural";
const edgeRate = process.env.AGENTGUARD_SANS_EDGE_RATE ?? "+16%";
const edgePitch = process.env.AGENTGUARD_SANS_EDGE_PITCH ?? "+0Hz";

function requireFile(path, label) {
  if (!existsSync(path)) {
    throw new Error(`Missing ${label}: ${path}`);
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 20,
    ...options
  });

  if (result.status !== 0) {
    throw new Error(`${command} failed with exit code ${result.status}\n${result.stderr || result.stdout}`);
  }

  return result;
}

function parseTimestamp(value) {
  const [minutes, seconds] = value.split(":").map(Number);
  return minutes * 60 + seconds;
}

function durationFromRange(range) {
  const [start, end] = range.split("-");
  return parseTimestamp(end) - parseTimestamp(start);
}

function readWavDurationSeconds(path) {
  const buffer = readFileSync(path);
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error(`Not a WAV file: ${path}`);
  }

  let offset = 12;
  let byteRate = 0;
  let dataBytes = 0;

  while (offset + 8 <= buffer.length) {
    const chunkId = buffer.toString("ascii", offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const chunkStart = offset + 8;

    if (chunkId === "fmt ") {
      byteRate = buffer.readUInt32LE(chunkStart + 8);
    }

    if (chunkId === "data") {
      dataBytes = chunkSize;
      break;
    }

    offset = chunkStart + chunkSize + (chunkSize % 2);
  }

  if (!byteRate || !dataBytes) {
    throw new Error(`Unable to calculate WAV duration: ${path}`);
  }

  return dataBytes / byteRate;
}

function assertCleanNarration(text) {
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
  const leakedToken = forbiddenTokens.find((token) => text.includes(token));
  if (leakedToken) {
    throw new Error(`Voiceover script contains non-spoken or unsafe marker: ${leakedToken}`);
  }
}

function safeConcatPath(path) {
  return path.replaceAll("\\", "/").replaceAll("'", "'\\''");
}

function writeReviewFile(shotList) {
  const lines = [
    "# AgentGuard IR SANS Demo Voiceover Review",
    "",
    "This file is for human review. The TTS engine reads only the per-scene plain-text segments generated from `shot-list.json`.",
    "",
    ...shotList.flatMap((shot, index) => [
      `## Scene ${String(index + 1).padStart(2, "0")} ${shot.time} - ${shot.name}`,
      "",
      shot.narration,
      ""
    ])
  ];

  writeFileSync(reviewPath, `${lines.join("\n")}\n`);
}

function synthesizeSegment(shot, index) {
  const id = `scene-${String(index + 1).padStart(2, "0")}`;
  const targetSeconds = durationFromRange(shot.time);
  const textPath = join(segmentDir, `${id}.txt`);
  const mp3Path = join(segmentDir, `${id}.mp3`);
  const rawWavPath = join(segmentDir, `${id}.raw.wav`);
  const fittedWavPath = join(segmentDir, `${id}.fit.wav`);
  const finalWavPath = join(segmentDir, `${id}.wav`);

  writeFileSync(textPath, `${shot.narration}\n`);

  run("py", [
    "-m",
    "edge_tts",
    "--file",
    textPath,
    "--voice",
    edgeVoice,
    "--rate",
    edgeRate,
    "--pitch",
    edgePitch,
    "--write-media",
    mp3Path
  ]);

  run(ffmpeg.path, ["-y", "-i", mp3Path, "-ar", "44100", "-ac", "2", rawWavPath]);

  let workingWavPath = rawWavPath;
  let spokenSeconds = readWavDurationSeconds(rawWavPath);
  if (spokenSeconds > targetSeconds - 0.5) {
    const tempo = Math.min(1.75, Math.max(1.02, spokenSeconds / Math.max(1, targetSeconds - 0.9)));
    run(ffmpeg.path, [
      "-y",
      "-i",
      rawWavPath,
      "-filter:a",
      `atempo=${tempo.toFixed(3)}`,
      "-ar",
      "44100",
      "-ac",
      "2",
      fittedWavPath
    ]);
    workingWavPath = fittedWavPath;
    spokenSeconds = readWavDurationSeconds(fittedWavPath);
  }

  const padSeconds = Math.max(0, targetSeconds - spokenSeconds);
  if (padSeconds > 0.1) {
    run(ffmpeg.path, [
      "-y",
      "-i",
      workingWavPath,
      "-f",
      "lavfi",
      "-t",
      padSeconds.toFixed(3),
      "-i",
      "anullsrc=channel_layout=stereo:sample_rate=44100",
      "-filter_complex",
      "[0:a][1:a]concat=n=2:v=0:a=1",
      "-ar",
      "44100",
      "-ac",
      "2",
      finalWavPath
    ]);
  } else {
    copyFileSync(workingWavPath, finalWavPath);
  }

  return {
    id,
    time: shot.time,
    name: shot.name,
    targetSeconds,
    spokenSeconds: Math.round(spokenSeconds * 10) / 10,
    paddedSeconds: Math.round(Math.max(0, targetSeconds - spokenSeconds) * 10) / 10,
    text: resolve(textPath),
    audio: resolve(finalWavPath)
  };
}

function concatSegments(segments) {
  const listPath = join(segmentDir, "concat.txt");
  writeFileSync(listPath, `${segments.map((segment) => `file '${safeConcatPath(segment.audio)}'`).join("\n")}\n`);
  run(ffmpeg.path, ["-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", canonicalWavPath]);
}

mkdirSync(outDir, { recursive: true });
mkdirSync(segmentDir, { recursive: true });
requireFile(shotListPath, "SANS shot list. Run npm run video:prep:sans first");

const shotList = readJson(shotListPath);
const narration = shotList.map((shot) => shot.narration).join("\n\n");
assertCleanNarration(narration);
writeFileSync(voiceoverTextPath, `${narration}\n`);
writeReviewFile(shotList);

const manifest = {
  generatedAt: new Date().toISOString(),
  prepareOnly,
  engine: "edge-tts",
  voice: edgeVoice,
  rate: edgeRate,
  pitch: edgePitch,
  voiceoverText: resolve(voiceoverTextPath),
  voiceoverReview: resolve(reviewPath),
  outputWav: resolve(canonicalWavPath),
  targetDurationSeconds: shotList.reduce((sum, shot) => sum + durationFromRange(shot.time), 0),
  note: "Scene-aligned audio. This command does not start screen recording."
};

if (prepareOnly) {
  writeFileSync(reviewManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log("SANS demo voiceover text prepared.");
  console.log(`Voiceover review: ${reviewPath}`);
  console.log(`Review manifest: ${reviewManifestPath}`);
  console.log("No audio synthesis or screen recording was started.");
  process.exit(0);
}

const segments = shotList.map(synthesizeSegment);
concatSegments(segments);
const durationSeconds = readWavDurationSeconds(canonicalWavPath);

writeFileSync(
  manifestPath,
  `${JSON.stringify(
    {
      ...manifest,
      status: "audio-generated",
      durationSeconds: Math.round(durationSeconds * 10) / 10,
      segments
    },
    null,
    2
  )}\n`
);

console.log("SANS demo voiceover audio generated.");
console.log(`Voice: ${edgeVoice}`);
console.log(`Selected WAV: ${canonicalWavPath}`);
console.log(`Duration: ${Math.round(durationSeconds * 10) / 10}s`);
console.log("No screen recording was started.");
