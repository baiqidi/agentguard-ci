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
      "Every finding traces back to a file, offset, log line, or flow id. Judges can replay the reasoning path instead of trusting a polished summary."
  },
  {
    time: "3:45-4:30",
    url: "https://github.com/baiqidi/agentguard-ci-sans-ir",
    narration:
      "The public repository includes setup instructions, MIT licensing, local evidence fixtures, architecture, logs, accuracy reporting, and submission copy."
  }
];

const voiceover = shotList.map((shot) => shot.narration).join("\n\n");
const voiceoverZh = [
  "注意：不要朗读屏幕备注，不要读文件名列表，旁白只讲评委需要理解的产品价值。",
  "",
  "AgentGuard IR 是自主事件响应智能体的可靠性门禁。它在智能体真正执行高风险动作之前，先检查证据是否可追溯、结论是否准确、动作是否需要审批。",
  "",
  "演示会先运行本地 SIFT 兼容证据包。执行日志会记录工具调用、时间戳、token 用量，以及一次明确的自我纠错。",
  "",
  "准确性报告会把结论分成 confirmed、rejected 和 inferred。没有证据支撑的入侵结论会被纠正，不会被包装成确定事实。",
  "",
  "SANS 场景覆盖磁盘持久化、认证日志准确性和终端隔离审批。证据充分的分析可以推进；没有审批的处置会被阻断。",
  "",
  "每个 finding 都能追溯到文件、offset、日志行或 flow id。评委可以复核证据链，而不是只听一个漂亮总结。",
  "",
  "最后展示公开仓库。仓库里包含运行命令、MIT 许可证、fixture 数据、架构图、准确性报告和提交文案。"
].join("\n");
const submissionChecklist = [
  "# SANS FIND EVIL Submission Checklist",
  "",
  "- [ ] Devpost project name: AgentGuard IR",
  "- [ ] GitHub repository: https://github.com/baiqidi/agentguard-ci-sans-ir",
  "- [ ] Backup branch while deploy key is pending: https://github.com/baiqidi/agentguard-ci/tree/codex/sans-find-evil",
  "- [ ] YouTube link: paste final public or unlisted video URL",
  "- [ ] Demo video length: keep under 5 minutes",
  "- [ ] Video must show terminal execution of `npm run sans:check`",
  "- [ ] Video must show `agent-execution-log.jsonl` self-correction",
  "- [ ] Video must show `accuracy-report.json` confirmed/rejected/inferred findings",
  "- [ ] Video must show `architecture_diagram_sans.md` or the SANS dashboard",
  "- [ ] Devpost story: use `docs/submission/sans-find-evil-submission-copy.md`",
  "- [ ] Architecture: attach or link `architecture_diagram_sans.md`",
  "- [ ] Dataset docs: link `agentguard-runs/sans-find-evil/evidence-dataset.md`",
  "- [ ] Accuracy report: link `agentguard-runs/sans-find-evil/accuracy-report.json`",
  "- [ ] Keep claims honest: default local run is fixture-local unless SIFT binaries are available"
].join("\n");
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
  writeFile(join(outputDir, "voiceover-zh.txt"), voiceoverZh),
  writeFile(join(outputDir, "submission-checklist.md"), submissionChecklist),
  writeFile(join(outputDir, "asset-manifest.json"), JSON.stringify(manifest, null, 2))
]);

console.log("SANS demo video prep complete");
console.log(`Shot list: ${join(outputDir, "shot-list.json")}`);
