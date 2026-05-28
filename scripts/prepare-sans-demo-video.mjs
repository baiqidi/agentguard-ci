import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outputDir = join(process.cwd(), "agentguard-runs", "sans-demo-video");
await mkdir(outputDir, { recursive: true });

const shotList = [
  {
    time: "0:00-0:35",
    url: "http://localhost:5173/?contest=sans&lang=en&present=1&page=overview",
    narration:
      "AgentGuard IR is a reliability gate for autonomous incident-response agents. It asks a simple question before action: can this finding be traced to evidence, and is the next step safe?"
  },
  {
    time: "0:35-1:20",
    url: "terminal:npm run sans:prepare",
    narration:
      "The demo runs against a local SIFT-compatible evidence bundle. The execution log records tool calls, timestamps, token usage, and one self-correction."
  },
  {
    time: "1:20-2:05",
    url: "agentguard-runs/sans-find-evil/accuracy-report.json",
    narration:
      "The accuracy report separates confirmed findings, rejected claims, and inferred leads. Unsupported compromise claims are corrected instead of silently promoted."
  },
  {
    time: "2:05-2:55",
    url: "http://localhost:5173/?contest=sans&lang=en&present=1&page=scenarios",
    narration:
      "The SANS scenarios cover disk persistence, authentication-log accuracy, and containment approval. Safe evidence-backed work can proceed; unsafe mutation is blocked."
  },
  {
    time: "2:55-3:45",
    url: "http://localhost:5173/?contest=sans&lang=en&present=1&page=evidence&filter=danger",
    narration:
      "Every claim points back to a file, offset, log entry, or flow id. Judges can replay the reasoning path instead of trusting a polished summary."
  },
  {
    time: "3:45-4:30",
    url: "https://github.com/baiqidi/agentguard-ci-sans-ir",
    narration:
      "The public repository includes setup instructions, MIT licensing, local evidence fixtures, architecture, logs, accuracy reporting, and submission copy."
  }
];

const voiceover = shotList.map((shot) => shot.narration).join("\n\n");
const manifest = {
  targetLength: "under 5 minutes",
  requiredByRules: [
    "live terminal execution",
    "audio narration",
    "self-correction sequence",
    "real evidence",
    "accuracy report",
    "architecture diagram"
  ],
  assets: [
    "agentguard-runs/sans-find-evil/agent-execution-log.jsonl",
    "agentguard-runs/sans-find-evil/accuracy-report.json",
    "agentguard-runs/sans-find-evil/evidence-dataset.md",
    "agentguard-runs/sans-find-evil/investigative-narrative.md"
  ]
};

await Promise.all([
  writeFile(join(outputDir, "shot-list.json"), JSON.stringify(shotList, null, 2)),
  writeFile(join(outputDir, "voiceover-en.txt"), voiceover),
  writeFile(join(outputDir, "asset-manifest.json"), JSON.stringify(manifest, null, 2))
]);

console.log("SANS demo video prep complete");
console.log(`Shot list: ${join(outputDir, "shot-list.json")}`);
