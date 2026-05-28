import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const outDir = join(root, "agentguard-runs", "sans-demo-video");

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), "utf8"));
}

function requireFile(relativePath) {
  const absolutePath = join(root, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing required SANS demo asset: ${relativePath}`);
  }

  return absolutePath;
}

const requiredAssets = [
  "agentguard-runs/sans-find-evil/agent-execution-log.jsonl",
  "agentguard-runs/sans-find-evil/accuracy-report.json",
  "agentguard-runs/sans-find-evil/evidence-dataset.md",
  "agentguard-runs/sans-find-evil/investigative-narrative.md",
  "agentguard-runs/sans-agent-adapters/agent-adapter-suite-summary.json",
  "architecture_diagram_sans.md",
  "docs/submission/sans-find-evil-judge-readiness.md",
  "docs/submission/sans-find-evil-submission-copy.md",
  "sans-fixtures/case-001/README.md",
  "sans-fixtures/case-001/auth.log",
  "sans-fixtures/case-001/memory-process-tree.json",
  "sans-fixtures/case-001/pcap-flow-index.json",
  "sans-fixtures/case-001/registry-run-key.txt",
  "sans-fixtures/case-001/timeline.body",
  "sans-fixtures/case-001/windows-security-events.jsonl"
];

mkdirSync(outDir, { recursive: true });
for (const asset of requiredAssets) {
  requireFile(asset);
}

const report = readJson("agentguard-runs/sans-find-evil/accuracy-report.json");
const adapters = readJson("agentguard-runs/sans-agent-adapters/agent-adapter-suite-summary.json").summary;
const confirmed = report.summary?.confirmed ?? 0;
const rejected = report.summary?.rejected ?? 0;
const inferred = report.summary?.inferred ?? 0;
const selfCorrections = report.summary?.selfCorrections ?? 0;
const findingCount = report.summary?.totalFindings ?? report.findings?.length ?? 0;

const baseUrl = process.env.AGENTGUARD_SANS_DEMO_URL ?? "http://localhost:5173";
const route = (query) => `${baseUrl}/?contest=sans&lang=en&present=1&${query}`;
const primaryRepository = "https://github.com/baiqidi/agentguard-ci/tree/codex/sans-find-evil";
const dedicatedRepository = "https://github.com/baiqidi/agentguard-ci-sans-ir";

const shotList = [
  {
    time: "0:00-0:21",
    name: "Opening risk",
    url: route("page=overview"),
    focus: ".decision-hero",
    narration:
      "AgentGuard IR is a reliability gate for autonomous incident-response agents. In incident response, speed is not enough. A fast agent can still overstate a finding, lose traceability, or isolate the wrong host. This product asks a stricter question before action: does the claim trace to evidence, and is the next step safe enough to continue."
  },
  {
    time: "0:21-0:45",
    name: "Live terminal run",
    url: "terminal:npm run sans:check",
    focus: "terminal",
    narration:
      "The demo should show the terminal running npm run sans check. That one command builds the workspaces, replays a SIFT-compatible evidence bundle, runs the incident-response adapter suite, prepares the demo assets, and validates the submission packet. The important part is that this is not a static screenshot. It is a repeatable command path that produces logs, reports, and judge-readable artifacts from the same local case data."
  },
  {
    time: "0:45-1:09",
    name: "Self-correction evidence",
    url: route("page=companion"),
    focus: ".splunk-companion-panel",
    narration:
      `The run produces structured execution logs with timestamps, tool calls, token usage, and ${selfCorrections} visible self-correction. The agent first sees a possible persistence signal, but the evidence is not strong enough. Instead of hiding that mistake in a polished answer, AgentGuard records the correction, downgrades the unsupported PowerShell claim, and promotes only the Run key finding that has a registry artifact, offset, and hash.`
  },
  {
    time: "1:09-1:35",
    name: "Accuracy report",
    url: route("page=companion"),
    focus: ".splunk-deployment-grid",
    narration:
      `The accuracy report contains ${findingCount} findings: ${confirmed} confirmed, ${rejected} rejected, and ${inferred} inferred. The key distinction is that not every suspicious signal becomes a confirmed compromise. A password-spraying burst is confirmed from auth log lines, but successful compromise is rejected when no accepted login exists from the attacker source. Every conclusion points to a file, offset, log line, or flow identifier, so judges can trace the reasoning path.`
  },
  {
    time: "1:35-2:04",
    name: "IR scenario coverage",
    url: route("page=scenarios"),
    focus: ".splunk-contest-panel",
    narration:
      "The FIND EVIL routes now cover five realistic DFIR checkpoints: disk persistence, authentication-log accuracy, containment approval, Windows Event Log lateral movement, and memory process tree triage. The agent can promote artifact-backed conclusions, reject overclaims, and keep ambiguous memory signals review-gated. Evidence-backed analysis can continue, but unsafe mutation, weak claims, and unapproved containment are routed to review or blocked."
  },
  {
    time: "2:04-2:31",
    name: "Audit trail and constraints",
    url: route("page=scenarios"),
    focus: ".splunk-scenario-grid",
    narration:
      "The guardrails are enforced as a scoring and evidence contract, not just a prompt instruction. AgentGuard checks goal fidelity, tool boundaries, evidence integrity, state safety, and human approval before an autonomous IR action can proceed. That matters because response automation is allowed to touch real systems. If the agent cannot explain the evidence, cannot preserve state, or cannot show named approval for a high-risk action, the safest answer is not to act yet."
  },
  {
    time: "2:31-3:00",
    name: "Repository and local setup",
    url: route("page=companion"),
    focus: ".splunk-deployment-grid",
    narration:
      `The public repository includes MIT licensing, setup instructions, safe replay fixtures, architecture, logs, accuracy reporting, and Devpost copy. The broader adapter suite now covers ${adapters.totalScenarios} local agent scenarios across ${adapters.liveAgentTypes} agent categories, so the SANS version is not a one-off demo. It is the incident-response package of a general reliability firewall for enterprise agents. Judges can clone the branch, run the same command, and inspect the same evidence.`
  }
];

const voiceover = shotList.map((shot) => shot.narration).join("\n\n");
const voiceoverZh = [
  "注意：这份中文稿只给录制者参考。评委版视频建议使用英文旁白。",
  "",
  "AgentGuard IR 是给自主事件响应智能体使用的可靠性门禁。它在智能体升级结论或改变系统状态之前，先检查结论是否能追溯到证据，以及下一步动作是否安全。",
  "",
  "演示视频要展示终端运行 npm run sans check。这个命令会构建项目、重放 SIFT 兼容证据包、运行 SANS 场景、准备视频素材，并验证提交包。",
  "",
  "运行结果会生成结构化执行日志，包括时间戳、工具调用、token 用量和清晰的自我纠错。智能体会把证据不足的持久化结论降级，而不是把错误包装成确定事实。",
  "",
  "准确性报告会区分 confirmed、rejected 和 inferred。每个结论都能指向文件、offset、日志行或 flow id，方便评委复查推理路径。",
  "",
  "FIND EVIL 场景覆盖磁盘持久化、认证日志准确性和终端隔离审批。证据充分的分析可以继续；危险动作、弱证据结论和未审批处置会被送审或阻断。",
  "",
  "这些边界不是简单提示词，而是评分和证据契约。AgentGuard 会检查目标一致性、工具边界、证据完整性、状态安全和人工审批。",
  "",
  "公开仓库包含 MIT 许可证、安装说明、安全 fixture、架构图、执行日志、准确性报告和 Devpost 文案。"
].join("\n");

const submissionChecklist = [
  "# SANS FIND EVIL Submission Checklist",
  "",
  "- [ ] Devpost project name: AgentGuard IR",
  `- [ ] Code repository: ${primaryRepository}`,
  `- [ ] Dedicated repository, once deploy-key write access is fixed: ${dedicatedRepository}`,
  "- [ ] YouTube/Vimeo/Youku link: paste final public or unlisted video URL",
  "- [ ] Demo video length: under 5 minutes",
  "- [ ] Demo video shows live terminal execution of `npm run sans:check`",
  "- [ ] Demo video includes English audio narration",
  "- [ ] Demo video shows self-correction in `agent-execution-log.jsonl` or the SANS dashboard replay panel",
  "- [ ] Demo video shows `accuracy-report.json` confirmed/rejected/inferred findings",
  "- [ ] Demo video shows `architecture_diagram_sans.md` or the SANS dashboard architecture/evidence surfaces",
  "- [ ] Devpost story: use `docs/submission/sans-find-evil-submission-copy.md`",
  "- [ ] Architecture: attach or link `architecture_diagram_sans.md`",
  "- [ ] Dataset docs: link `agentguard-runs/sans-find-evil/evidence-dataset.md`",
  "- [ ] Accuracy report: link `agentguard-runs/sans-find-evil/accuracy-report.json`",
  "- [ ] Execution logs: link `agentguard-runs/sans-find-evil/agent-execution-log.jsonl`",
  "- [ ] Judge summary: link or reference `agentguard-runs/sans-find-evil/judge-evidence-summary.md`",
  "- [ ] Evidence breadth: mention Windows Event Log lateral movement and memory process tree triage",
  "- [ ] Keep claims honest: default local run is fixture-local unless SIFT binaries are available"
].join("\n");

const manifest = {
  generatedAt: new Date().toISOString(),
  outputDir: resolve(outDir),
  baseUrl,
  targetDuration: "3:00",
  primaryRepository,
  dedicatedRepository,
  verifiedEvidence: {
    executionMode: report.executionMode,
    findings: findingCount,
    confirmed,
    rejected,
    inferred,
    selfCorrections,
    adapterScenarios: adapters.totalScenarios,
    liveAgentTypes: adapters.liveAgentTypes,
    securityScenarios: adapters.securityScenarios
  },
  requiredByRules: [
    "live terminal execution",
    "audio narration",
    "self-correction sequence",
    "real evidence",
    "accuracy report",
    "architecture diagram"
  ],
  requiredAssets: requiredAssets.map((asset) => ({ path: asset, absolutePath: resolve(root, asset) })),
  futureRecordCommand: "npm run video:record:sans",
  futureAudioCommand: "npm run video:audio:sans",
  note: "Preparation only. This command does not start screen recording."
};

writeFileSync(join(outDir, "shot-list.json"), `${JSON.stringify(shotList, null, 2)}\n`);
writeFileSync(join(outDir, "voiceover-en.txt"), `${voiceover}\n`);
writeFileSync(join(outDir, "voiceover-zh.txt"), `${voiceoverZh}\n`);
writeFileSync(join(outDir, "submission-checklist.md"), `${submissionChecklist}\n`);
writeFileSync(join(outDir, "asset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log("SANS demo video preparation complete.");
console.log(`Prepared assets: ${outDir}`);
console.log("No recording was started.");
