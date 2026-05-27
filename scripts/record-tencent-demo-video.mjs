import ffmpeg from "@ffmpeg-installer/ffmpeg";
import { chromium } from "playwright";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { copyFile, readdir, rename, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const outDir = join(root, "agentguard-runs", "tencent-demo-video");
const appUrl = process.env.AGENTGUARD_DEMO_URL ?? "http://localhost:5190/?lang=zh&contest=tencent";
const webmPath = join(outDir, "AgentGuard-CI-Tencent-Demo.webm");
const mp4Path = join(outDir, "AgentGuard-CI-Tencent-Demo.mp4");
const voiceoverPath = join(outDir, "AgentGuard-CI-Tencent-Voiceover-zh.wav");
const audioManifestPath = join(outDir, "audio-manifest.json");
const shotListPath = join(outDir, "shot-list.json");

if (process.argv.includes("--help")) {
  console.log([
    "Usage: npm run video:record:tencent",
    "",
    "Before running:",
    "1. Run npm run video:prep:tencent",
    "2. Run npm run video:audio:tencent",
    "3. Run npm run dev -w @agentguard/web -- --host localhost --port 5190",
    "4. Make sure http://localhost:5190/?lang=zh is reachable",
    "",
    "This command records a browser walkthrough, mixes the prepared Chinese voiceover when present, and converts WebM to MP4.",
    `Output: ${mp4Path}`
  ].join("\n"));
  process.exit(0);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function durationFromRange(range) {
  const [start, end] = range.split("-");
  return parseTimestamp(end) - parseTimestamp(start);
}

function parseTimestamp(value) {
  const [minutes, seconds] = value.split(":").map(Number);
  return minutes * 60 + seconds;
}

function loadSceneDurations(shotList) {
  if (existsSync(audioManifestPath)) {
    const manifest = readJson(audioManifestPath);
    if (typeof manifest.durationSeconds === "number" && manifest.durationSeconds > 0) {
      const weights = shotList.map((shot) => Math.max(shot.narration.length, 40));
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      return weights.map((weight) => Math.max(10, (manifest.durationSeconds * weight) / totalWeight));
    }
  }

  return shotList.map((shot) => Math.max(10, durationFromRange(shot.time)));
}

function wait(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

const scenePlan = [
  {
    name: "opening dashboard",
    steps: [{ selector: ".decision-hero", share: 1 }]
  },
  {
    name: "agent coverage and risk map",
    steps: [
      { selector: ".agent-platform-panel", share: 0.52 },
      { selector: ".risk-radar-panel", share: 0.48 }
    ]
  },
  {
    name: "runbook and gate method",
    steps: [
      { selector: ".operator-runbook-panel", share: 0.54 },
      { selector: ".universal-gate-panel", share: 0.46 }
    ]
  },
  {
    name: "ecosystem integration and real scenarios",
    steps: [
      { selector: ".agent-platform-panel", share: 0.38 },
      { selector: ".scenario-workbench-panel", share: 0.62 }
    ]
  },
  {
    name: "evidence and approval conclusion",
    steps: [
      { selector: ".console-grid", share: 0.5 },
      { selector: ".assurance-panel", share: 0.5 }
    ]
  },
  {
    name: "enterprise scenario examples",
    steps: [
      { selector: ".agent-platform-panel", share: 0.36 },
      { selector: ".scenario-workbench-panel", share: 0.64 }
    ]
  },
  {
    name: "live-local proof and review queue",
    steps: [
      { selector: ".scenario-workbench-panel", share: 0.5 },
      { selector: ".evidence-chain-panel", share: 0.5 }
    ]
  },
  {
    name: "competitive advantage",
    steps: [
      { selector: ".moat-panel", share: 0.55 },
      { selector: ".evidence-chain-panel", share: 0.45 }
    ]
  },
  {
    name: "closing",
    steps: [
      { selector: ".research-panel", share: 0.48 },
      { selector: ".decision-hero", share: 0.52 }
    ]
  }
];

function run(command, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise();
      } else {
        reject(new Error(`${command} exited with ${code}`));
      }
    });
  });
}

async function newestWebm(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  const candidates = await Promise.all(
    files
      .filter((file) => file.isFile() && file.name.endsWith(".webm"))
      .map(async (file) => {
        const path = join(dir, file.name);
        const info = await stat(path);
        return { path, mtimeMs: info.mtimeMs };
      })
  );
  if (candidates.length === 0) {
    throw new Error("No Playwright WebM file was generated.");
  }
  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return candidates[0].path;
}

async function renameWithRetry(source, target) {
  if (source === target) {
    return;
  }

  let lastError;
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      await rm(target, { force: true });
      await rename(source, target);
      return;
    } catch (error) {
      lastError = error;
      if (!["EBUSY", "EPERM", "EACCES"].includes(error?.code)) {
        throw error;
      }
      await wait(500 * attempt);
    }
  }

  throw lastError;
}

async function ensureAppPage(page) {
  if (!page.url().startsWith(appUrl.split("?")[0])) {
    await page.goto(appUrl, { waitUntil: "networkidle" });
    await wait(900);
  }
}

async function prepareRecordingPage(page) {
  await page.addStyleTag({
    content: `
      html {
        scroll-behavior: smooth;
      }

      [data-agentguard-demo-focus="true"] {
        outline: 3px solid rgba(0, 98, 255, 0.42);
        outline-offset: 8px;
        box-shadow: 0 22px 64px rgba(0, 71, 171, 0.16);
        transition: outline-color 180ms ease, box-shadow 180ms ease;
      }
    `
  });
}

async function focusSceneStep(page, selector, durationMs) {
  const found = await page.locator(selector).first().count();
  if (found === 0) {
    await wait(durationMs);
    return;
  }

  await page.evaluate((targetSelector) => {
    document.querySelectorAll("[data-agentguard-demo-focus]").forEach((element) => {
      element.removeAttribute("data-agentguard-demo-focus");
    });

    const target = document.querySelector(targetSelector);
    if (!target) {
      return;
    }

    target.setAttribute("data-agentguard-demo-focus", "true");
    target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  }, selector);

  await wait(Math.min(1200, Math.max(600, Math.floor(durationMs * 0.12))));
  await wait(Math.max(600, durationMs - 1200));
}

async function playScene(page, sceneIndex, durationMs) {
  await ensureAppPage(page);
  const plan = scenePlan[sceneIndex] ?? scenePlan[0];
  const totalShare = plan.steps.reduce((sum, step) => sum + step.share, 0);

  for (const step of plan.steps) {
    const stepDurationMs = Math.max(4500, Math.floor((durationMs * step.share) / totalShare));
    await focusSceneStep(page, step.selector, stepDurationMs);
  }
}

async function main() {
  if (!existsSync(join(outDir, "asset-manifest.json"))) {
    throw new Error("Run npm run video:prep:tencent before recording.");
  }
  if (!existsSync(shotListPath)) {
    throw new Error("Missing shot list. Run npm run video:prep:tencent before recording.");
  }

  mkdirSync(outDir, { recursive: true });
  const shotList = readJson(shotListPath);
  const sceneDurations = loadSceneDurations(shotList);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: "zh-CN",
    viewport: { width: 1440, height: 1080 },
    recordVideo: {
      dir: outDir,
      size: { width: 1440, height: 1080 }
    }
  });
  const page = await context.newPage();

  await page.goto(appUrl, { waitUntil: "networkidle" });
  await prepareRecordingPage(page);
  await wait(1500);

  for (let index = 0; index < shotList.length; index += 1) {
    const sceneDurationMs = sceneDurations[index] * 1000;
    await playScene(page, index, sceneDurationMs);
  }

  await browser.close();
  await wait(2000);

  const generatedWebm = await newestWebm(outDir);
  await renameWithRetry(generatedWebm, webmPath);

  const ffmpegArgs = ["-y", "-i", webmPath];
  if (existsSync(voiceoverPath)) {
    ffmpegArgs.push("-i", voiceoverPath, "-map", "0:v:0", "-map", "1:a:0");
  }
  ffmpegArgs.push(
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    "-shortest",
    "-movflags",
    "+faststart",
    mp4Path
  );

  await run(ffmpeg.path, ffmpegArgs);

  await copyFile(join(outDir, "asset-manifest.json"), join(outDir, "AgentGuard-CI-Tencent-Demo.manifest.json"));
  console.log(`Recorded MP4: ${mp4Path}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
