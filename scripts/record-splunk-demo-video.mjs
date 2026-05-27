import ffmpeg from "@ffmpeg-installer/ffmpeg";
import { chromium } from "playwright";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { copyFile, readdir, rename, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const outDir = join(root, "agentguard-runs", "splunk-demo-video");
const webmPath = join(outDir, "AgentGuard-CI-Splunk-Demo.webm");
const mp4Path = join(outDir, "AgentGuard-CI-Splunk-Demo.mp4");
const voiceoverPath = join(outDir, "AgentGuard-CI-Splunk-Voiceover-en.wav");
const shotListPath = join(outDir, "shot-list.json");

if (process.argv.includes("--help")) {
  console.log(
    [
      "Usage: npm run video:record:splunk",
      "",
      "Before running:",
      "1. Run npm run video:prep:splunk",
      "2. Run npm run dev -w @agentguard/web -- --host localhost --port 5190",
      "3. Make sure http://localhost:5190/?contest=splunk&lang=en&present=1 is reachable",
      "",
      "This command records only the product UI presentation routes and converts WebM to MP4.",
      `Output: ${mp4Path}`
    ].join("\n")
  );
  process.exit(0);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function parseTimestamp(value) {
  const [minutes, seconds] = value.split(":").map(Number);
  return minutes * 60 + seconds;
}

function durationFromRange(range) {
  const [start, end] = range.split("-");
  return parseTimestamp(end) - parseTimestamp(start);
}

function wait(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

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
        scroll-margin-top: 28px;
        transition: outline-color 180ms ease, box-shadow 180ms ease;
      }
    `
  });
}

async function focusTarget(page, selector, durationMs) {
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
    target.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }, selector);

  await wait(Math.min(1000, Math.max(500, Math.floor(durationMs * 0.12))));
  await wait(Math.max(700, durationMs - 1000));
}

async function main() {
  if (!existsSync(shotListPath)) {
    throw new Error("Run npm run video:prep:splunk before recording.");
  }

  mkdirSync(outDir, { recursive: true });
  const shotList = readJson(shotListPath);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: "en-US",
    viewport: { width: 1440, height: 1080 },
    recordVideo: {
      dir: outDir,
      size: { width: 1440, height: 1080 }
    }
  });
  const page = await context.newPage();

  for (const [index, shot] of shotList.entries()) {
    await page.goto(shot.url, { waitUntil: "networkidle" });
    if (index === 0) {
      await prepareRecordingPage(page);
    }

    await wait(700);
    await focusTarget(page, shot.focus, durationFromRange(shot.time) * 1000);
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
  await copyFile(join(outDir, "asset-manifest.json"), join(outDir, "AgentGuard-CI-Splunk-Demo.manifest.json"));
  console.log(`Recorded MP4: ${mp4Path}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
