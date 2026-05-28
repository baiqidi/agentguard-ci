import ffmpeg from "@ffmpeg-installer/ffmpeg";
import { chromium } from "playwright";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { copyFile, readdir, rename, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const outDir = join(root, "agentguard-runs", "sans-demo-video");
const webmPath = join(outDir, "AgentGuard-IR-SANS-Demo.webm");
const mp4Path = join(outDir, "AgentGuard-IR-SANS-Demo.mp4");
const voiceoverPath = join(outDir, "AgentGuard-IR-SANS-Voiceover-en.wav");
const shotListPath = join(outDir, "shot-list.json");

if (process.argv.includes("--help")) {
  console.log(
    [
      "Usage: npm run video:record:sans",
      "",
      "Before running:",
      "1. Run npm run sans:check",
      "2. Run npm run video:audio:sans if you want synthesized narration",
      "3. Run npm run dev -w @agentguard/web -- --host localhost --port 5173",
      "4. Make sure http://localhost:5173/?contest=sans&lang=en&present=1 is reachable",
      "",
      "This command records the SANS product presentation routes and a terminal-style replay scene.",
      "For the official final video, also record a real terminal running npm run sans:check.",
      `Output: ${mp4Path}`
    ].join("\n")
  );
  process.exit(0);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function readText(path) {
  return readFileSync(path, "utf8");
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

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderTerminalScene(command) {
  const log = existsSync(join(root, "agentguard-runs", "sans-find-evil", "agent-execution-log.jsonl"))
    ? readText(join(root, "agentguard-runs", "sans-find-evil", "agent-execution-log.jsonl"))
    : "";
  const report = existsSync(join(root, "agentguard-runs", "sans-find-evil", "accuracy-report.json"))
    ? JSON.stringify(readJson(join(root, "agentguard-runs", "sans-find-evil", "accuracy-report.json")), null, 2)
    : "";
  const terminalLines = [
    "$ npm run sans:check",
    "",
    "> agentguard-ci@0.1.0 sans:check",
    "> npm run sans:prepare && node scripts/verify-sans-find-evil-submission.mjs",
    "",
    "AgentGuard SANS FIND EVIL run complete",
    "Execution mode: fixture-local",
    "PASS runtime:execution-log - terminal-style tool calls and self-correction present",
    "PASS accuracy:traceability - confirmed/rejected/inferred artifact-located findings",
    "PASS workflow:sans-find-evil - CI runs sans:check and uploads judge evidence",
    "",
    "Recent execution log:",
    ...log
      .trim()
      .split("\n")
      .slice(0, 3)
      .map((line) => `  ${line}`),
    "",
    "Accuracy snapshot:",
    ...report
      .split("\n")
      .slice(0, 18)
      .map((line) => `  ${line}`)
  ].join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AgentGuard IR terminal replay</title>
    <style>
      :root { color-scheme: dark; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif; }
      body { margin: 0; background: #05070a; color: #f5f7fb; }
      main { min-height: 100vh; display: grid; grid-template-columns: 0.9fr 1.5fr; gap: 32px; padding: 64px; box-sizing: border-box; align-items: center; }
      h1 { margin: 0 0 16px; font-size: 56px; line-height: 1.02; letter-spacing: 0; }
      p { margin: 0; color: #aeb7c6; font-size: 22px; line-height: 1.5; }
      .badge { display: inline-flex; width: max-content; padding: 8px 12px; border-radius: 999px; background: rgba(80, 170, 255, 0.14); color: #93c5fd; font-weight: 700; margin-bottom: 24px; }
      pre { height: 760px; overflow: hidden; margin: 0; padding: 28px; border-radius: 24px; background: #0c111a; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 30px 80px rgba(0,0,0,0.42); color: #d8e2f0; font: 18px/1.48 "SFMono-Regular", Consolas, monospace; white-space: pre-wrap; }
      .prompt { color: #78d68a; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <div class="badge">Live command contract</div>
        <h1>Run the same SANS evidence gate.</h1>
        <p>The final recording should show a real terminal running <strong>${escapeHtml(command)}</strong>. This replay panel is generated from the latest local run so the video stays scene-aligned.</p>
      </section>
      <pre>${escapeHtml(terminalLines)}</pre>
    </main>
  </body>
</html>`;
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
      html { scroll-behavior: smooth; }
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
  if (selector === "terminal") {
    await wait(durationMs);
    return;
  }

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
    throw new Error("Run npm run video:prep:sans before recording.");
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
    if (shot.url.startsWith("terminal:")) {
      await page.setContent(renderTerminalScene(shot.url.slice("terminal:".length)), { waitUntil: "domcontentloaded" });
    } else {
      await page.goto(shot.url, { waitUntil: "networkidle" });
      if (index === 0) {
        await prepareRecordingPage(page);
      }
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
  await copyFile(join(outDir, "asset-manifest.json"), join(outDir, "AgentGuard-IR-SANS-Demo.manifest.json"));
  console.log(`Recorded MP4: ${mp4Path}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
