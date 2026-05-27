import ffmpeg from "@ffmpeg-installer/ffmpeg";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";

const root = process.cwd();
const outDir = join(root, "agentguard-runs", "tencent-demo-video");
const shotListPath = join(outDir, "shot-list.json");
const voiceoverTextPath = join(outDir, "voiceover-zh.txt");
const voiceoverReviewPath = join(outDir, "voiceover-review-zh.md");
const voiceoverSegmentsPath = join(outDir, "voiceover-segments.json");
const audioManifestPath = join(outDir, "audio-manifest.json");
const canonicalWavPath = join(outDir, "AgentGuard-CI-Tencent-Voiceover-zh.wav");
const edgeMp3Path = join(outDir, "AgentGuard-CI-Tencent-Voiceover-natural-zh.mp3");
const edgeSubtitlePath = join(outDir, "AgentGuard-CI-Tencent-Voiceover-natural-zh.vtt");
const piperWavPath = join(outDir, "AgentGuard-CI-Tencent-Voiceover-piper-zh.wav");
const prepareOnly = process.argv.includes("--prepare-only");
const engineArg = process.argv.find((arg) => arg.startsWith("--engine="));
const engine = engineArg?.split("=")[1] ?? "edge";

const piperExePath = join(root, "tools", "piper", "runtime", "piper", "piper.exe");
const piperModelPath = join(root, "tools", "piper", "voices", "zh_CN-huayan-medium", "zh_CN-huayan-medium.onnx");
const piperConfigPath = `${piperModelPath}.json`;

const edgeVoice = process.env.AGENTGUARD_EDGE_VOICE ?? "zh-CN-XiaoxiaoNeural";
const edgeRate = process.env.AGENTGUARD_EDGE_RATE ?? "+8%";
const edgePitch = process.env.AGENTGUARD_EDGE_PITCH ?? "+0Hz";

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

function normalizeForVoice(text) {
  return text
    .replaceAll("AI Agent", "AI 智能体")
    .replaceAll("approve", "批准")
    .replaceAll("review", "复核")
    .replaceAll("block", "阻断")
    .replaceAll("JSON", "结构化数据")
    .replaceAll("Markdown", "Markdown")
    .replaceAll("JUnit XML", "JUnit 测试结果")
    .replaceAll("GitHub", "GitHub");
}

function assertCleanSpokenScript(text) {
  const forbiddenTokens = ["【", "】", "屏幕证据", "演示旁白", "##"];
  const leakedToken = forbiddenTokens.find((token) => text.includes(token));
  if (leakedToken) {
    throw new Error(`Voiceover script contains non-spoken marker: ${leakedToken}`);
  }
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

function writeVoiceoverSource() {
  mkdirSync(outDir, { recursive: true });
  requireFile(shotListPath, "shot list. Run npm run video:prep:tencent first");

  const shotList = readJson(shotListPath);
  const voiceoverSegments = shotList.map((shot, index) => ({
    id: `scene-${String(index + 1).padStart(2, "0")}`,
    time: shot.time,
    screen: shot.screen,
    text: normalizeForVoice(shot.narration)
  }));

  const voiceoverText = voiceoverSegments.map((segment) => segment.text).join("\n\n");
  assertCleanSpokenScript(voiceoverText);

  const reviewText = [
    "# AgentGuard CI 腾讯云黑客松旁白校对稿",
    "",
    "这个文件给人看，用来核对分镜。TTS 只读取 `voiceover-zh.txt`，不会读取本文件的标题、时间和场景标签。",
    "",
    ...voiceoverSegments.flatMap((segment) => [
      `## ${segment.time} ${segment.screen}`,
      "",
      segment.text,
      ""
    ])
  ].join("\n");

  writeFileSync(voiceoverSegmentsPath, `${JSON.stringify(voiceoverSegments, null, 2)}\n`);
  writeFileSync(voiceoverTextPath, `${voiceoverText}\n`);
  writeFileSync(voiceoverReviewPath, `${reviewText}\n`);
}

function baseManifest() {
  return {
    generatedAt: new Date().toISOString(),
    prepareOnly,
    engine,
    voiceoverText: resolve(voiceoverTextPath),
    voiceoverReview: resolve(voiceoverReviewPath),
    voiceoverSegments: resolve(voiceoverSegmentsPath),
    selectedAudio: resolve(canonicalWavPath),
    outputWav: resolve(canonicalWavPath),
    naturalAudioMp3: resolve(edgeMp3Path),
    piperAudioWav: resolve(piperWavPath),
    note: "Audio preparation only. This script does not start screen recording."
  };
}

function synthesizeWithEdge() {
  run("py", [
    "-m",
    "edge_tts",
    "--file",
    voiceoverTextPath,
    "--voice",
    edgeVoice,
    "--rate",
    edgeRate,
    "--pitch",
    edgePitch,
    "--write-media",
    edgeMp3Path,
    "--write-subtitles",
    edgeSubtitlePath
  ]);

  run(ffmpeg.path, [
    "-y",
    "-i",
    edgeMp3Path,
    "-ar",
    "44100",
    "-ac",
    "2",
    canonicalWavPath
  ]);

  return {
    engine: "edge-tts",
    voice: edgeVoice,
    rate: edgeRate,
    pitch: edgePitch,
    source: "https://github.com/rany2/edge-tts",
    serviceNote: "Uses Microsoft Edge online neural text-to-speech service; natural voice option for the final competition video.",
    sourceMedia: resolve(edgeMp3Path),
    subtitles: resolve(edgeSubtitlePath)
  };
}

function synthesizeWithPiper() {
  requireFile(piperExePath, "Piper executable");
  requireFile(piperModelPath, "Piper Chinese model");
  requireFile(piperConfigPath, "Piper Chinese model config");

  run(
    piperExePath,
    [
      "--model",
      piperModelPath,
      "--config",
      piperConfigPath,
      "--output_file",
      piperWavPath,
      "--sentence_silence",
      "0.55",
      "--length_scale",
      "1.08",
      "--noise_scale",
      "0.5",
      "--noise_w",
      "0.7",
      "--quiet"
    ],
    {
      input: readFileSync(voiceoverTextPath, "utf8"),
      cwd: join(root, "tools", "piper", "runtime", "piper")
    }
  );

  copyFileSync(piperWavPath, canonicalWavPath);

  return {
    engine: "piper",
    source: "https://github.com/rhasspy/piper",
    voiceModel: "https://huggingface.co/rhasspy/piper-voices/tree/v1.0.0/zh/zh_CN/huayan/medium",
    serviceNote: "Fully local and open-source fallback voice. More reproducible, but less natural in Chinese."
  };
}

writeVoiceoverSource();

const manifest = baseManifest();

if (prepareOnly) {
  manifest.status = "prepared-text-only";
  writeFileSync(audioManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log("Tencent demo voiceover text prepared.");
  console.log(`Voiceover text: ${voiceoverTextPath}`);
  console.log("No audio synthesis or screen recording was started.");
  process.exit(0);
}

let synthesis;
if (engine === "edge") {
  synthesis = synthesizeWithEdge();
} else if (engine === "piper") {
  synthesis = synthesizeWithPiper();
} else {
  throw new Error(`Unknown audio engine: ${engine}. Use --engine=edge or --engine=piper.`);
}

const durationSeconds = readWavDurationSeconds(canonicalWavPath);
manifest.status = "audio-generated";
manifest.synthesis = synthesis;
manifest.durationSeconds = Math.round(durationSeconds * 10) / 10;
manifest.durationWindow = "Target video is 3-5 minutes; final edit can trim pauses or keep silent screen sections.";
writeFileSync(audioManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log("Tencent demo voiceover audio generated.");
console.log(`Engine: ${synthesis.engine}`);
console.log(`Selected WAV: ${canonicalWavPath}`);
console.log(`Duration: ${manifest.durationSeconds}s`);
console.log("No screen recording was started.");
