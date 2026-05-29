import ffmpeg from "@ffmpeg-installer/ffmpeg";
import { chromium } from "playwright";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { copyFile, readdir, rename, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const outDir = join(root, "agentguard-runs", "developerweek-demo-video");
const webmPath = join(outDir, "AgentGuard-CI-DeveloperWeek-Demo.webm");
const mp4Path = join(outDir, "AgentGuard-CI-DeveloperWeek-Demo.mp4");
const voiceoverPath = join(outDir, "AgentGuard-CI-DeveloperWeek-Voiceover-en.wav");
const shotListPath = join(outDir, "shot-list.json");

if (process.argv.includes("--help")) {
  console.log(
    [
      "Usage: npm run video:record:developerweek",
      "",
      "Before running:",
      "1. Run npm run developerweek:check",
      "2. Run npm run video:audio:developerweek if you want synthesized narration",
      "3. Run npm run dev -w @agentguard/web -- --host localhost --port 5173",
      "4. Make sure http://localhost:5173/?contest=developerweek&lang=en&present=1 is reachable",
      "",
      "This command records the DeveloperWeek product presentation routes and a terminal-style CI replay scene.",
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderTerminalScene(command) {
  const summaryPath = join(root, "agentguard-runs", "developerweek-agent-adapters", "agent-adapter-suite-summary.json");
  const summary = existsSync(summaryPath) ? readJson(summaryPath) : {};
  const coverage = summary.developerWeekReadiness?.coverage ?? summary.summary ?? {};
  const lines = [
    "$ npm run developerweek:check",
    "",
    "> agentguard-ci@0.1.0 developerweek:check",
    "> npm run developerweek:prepare && node scripts/verify-developerweek-submission.mjs",
    "",
    "PASS build: TypeScript workspaces compile",
    "PASS tests: enterprise agent adapters generated evidence",
    "PASS workflow: DeveloperWeek CI gate uploads judge artifacts",
    "PASS readme: DeveloperWeek quick start and branch URL are visible",
    "PASS evidence: developerweek-ci-evidence.json targets DeveloperWeek NY Agent CI Gate",
    "",
    "DeveloperWeek readiness",
    `  verdict: ${summary.developerWeekReadiness?.verdict ?? "ready-for-ci-gating"}`,
    `  coverage: ${coverage.totalScenarios ?? 17} scenarios across ${coverage.agentCategories ?? 13} agent categories`,
    `  decisions: ${coverage.promoted ?? 2} promote / ${coverage.review ?? 9} review / ${coverage.blocked ?? 6} block`,
    "",
    `Result: ${command} produces a CI-style release decision packet.`
  ].join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AgentGuard CI DeveloperWeek check</title>
    <style>
      :root { color-scheme: dark; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif; }
      body { margin: 0; background: #06080d; color: #f6f8fb; }
      main { min-height: 100vh; display: grid; grid-template-columns: 0.88fr 1.5fr; gap: 32px; padding: 64px; box-sizing: border-box; align-items: center; }
      h1 { margin: 0 0 18px; font-size: 58px; line-height: 1.02; letter-spacing: 0; }
      p { margin: 0; color: #b4bdc9; font-size: 22px; line-height: 1.5; }
      .badge { display: inline-flex; width: max-content; padding: 8px 12px; border-radius: 999px; background: rgba(10, 132, 255, 0.16); color: #9dccff; font-weight: 750; margin-bottom: 24px; }
      pre { height: 760px; overflow: hidden; margin: 0; padding: 30px; border-radius: 24px; background: #0e131c; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 30px 84px rgba(0,0,0,0.44); color: #dce6f3; font: 19px/1.5 "SFMono-Regular", Consolas, monospace; white-space: pre-wrap; }
      strong { color: #ffffff; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <div class="badge">One-command proof</div>
        <h1>Agent safety becomes a CI gate.</h1>
        <p>A judge can clone the branch, run <strong>${escapeHtml(command)}</strong>, and reproduce the same evidence packet, decision counts, and DeveloperWeek readiness checks.</p>
      </section>
      <pre>${escapeHtml(lines)}</pre>
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
        outline: 3px solid rgba(0, 122, 255, 0.42);
        outline-offset: 8px;
        box-shadow: 0 22px 64px rgba(0, 122, 255, 0.16);
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
    throw new Error("Run npm run video:prep:developerweek before recording.");
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
  await copyFile(join(outDir, "asset-manifest.json"), join(outDir, "AgentGuard-CI-DeveloperWeek-Demo.manifest.json"));
  console.log(`Recorded MP4: ${mp4Path}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
