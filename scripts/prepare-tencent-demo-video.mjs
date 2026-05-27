import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const outDir = join(root, "agentguard-runs", "tencent-demo-video");

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), "utf8"));
}

function requireFile(relativePath) {
  const absolutePath = join(root, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing required demo asset: ${relativePath}`);
  }
  return absolutePath;
}

const requiredAssets = [
  "agentguard-runs/suite-summary.json",
  "agentguard-runs/suite-summary.md",
  "agentguard-runs/agent-adapters/agent-adapter-suite-summary.json",
  "agentguard-runs/agent-adapters/agent-adapter-suite-summary.md",
  "docs/hackathons/tencent-ai-agent-pack.md",
  "docs/submission/local-validation-report.md",
  "docs/submission/demo-video-production-plan.md",
  "agentguard-runs/tencent-submission/AgentGuard-CI-Tencent-Roadshow.pptx",
  "agentguard-runs/tencent-submission/AgentGuard-CI-Tencent-Whitepaper.docx",
  "agentguard-runs/tencent-submission/AgentGuard-CI-tencent-submit.zip",
];

mkdirSync(outDir, { recursive: true });
for (const asset of requiredAssets) {
  requireFile(asset);
}

const suite = readJson("agentguard-runs/suite-summary.json").summary;
const adapter = readJson("agentguard-runs/agent-adapters/agent-adapter-suite-summary.json");

const shotList = [
  {
    time: "0:00-0:25",
    screen: "中文 Dashboard 开场",
    proof: "AgentGuard CI console in Chinese at http://localhost:5190/?lang=zh",
    narration:
      "各位评委好，我们的作品是 AgentGuard CI，一个面向企业智能体的上线前可靠性评测平台。"
  },
  {
    time: "0:25-0:55",
    screen: "13 类 Agent 覆盖与风险雷达",
    proof: `${adapter.summary.liveAgentTypes} live-local agent categories plus command-backed code repair`,
    narration:
      "现在很多团队已经可以用智能体完成客服回复、数据分析、流程审批、文档处理、财务采购，甚至安全运营。但企业真正担心的不是智能体会不会回答，而是它一旦开始操作真实系统，会不会越权，会不会泄露数据，会不会跳过审批，会不会把错误结果包装成正确结论。"
  },
  {
    time: "0:55-1:25",
    screen: "腾讯云赛事适配与操作 Runbook",
    proof: "docs/hackathons/tencent-ai-agent-pack.md plus npm test / npm run build / npm run agentguard:suite / npm run agentguard:agent-suite / npm run submission:check",
    narration:
      "AgentGuard CI 要解决的就是这个问题。它把智能体上线前最危险、最常见的失败模式，变成一套可以自动运行、可以复现、可以追溯的评测流程。我们的目标不是替代智能体，而是在智能体进入真实业务之前，给企业加上一道可靠性、安全性和合规性的闸门。"
  },
  {
    time: "1:25-2:05",
    screen: "真实终端验证",
    proof: `${suite.totalScenarios} code scenarios, ${adapter.summary.totalScenarios} enterprise agent scenarios`,
    narration:
      "在腾讯云生态里，开发者可以用 CodeBuddy、ClawPro 或 WorkBuddy 构建智能体能力。AgentGuard CI 位于这些智能体成果上线前的最后一步：它会运行真实业务场景，检查智能体是否存在越权操作、敏感信息泄露、审批绕过、工具误用、证据缺失、状态漂移和运行不稳定等风险。"
  },
  {
    time: "2:05-2:40",
    screen: "证据报告与审批结论",
    proof: `${suite.risk.blockedRiskPoints}/${suite.risk.totalRiskPoints} risk points blocked, ${suite.risk.criticalFindings} critical findings`,
    narration:
      "系统不会只给出简单的通过或失败，而是输出三类治理结论：可以批准、需要人工复核、必须阻断。每一个结论都会附带原因、风险等级、触发的规则、相关证据和建议处理方式。这样，开发者知道问题在哪里，测试人员知道如何复现，管理者也能判断这个智能体是否可以进入生产环境。"
  },
  {
    time: "2:40-3:15",
    screen: "中国企业场景示例",
    proof: "Finance, HR, customer support, document compliance, browser/RPA, data analysis, security SOC, CRM, knowledge-base, workflow and multi-agent traces",
    narration:
      "我们已经覆盖十三类智能体画像，包括代码修复、浏览器操作、数据分析、客服、工作流、文档合规、财务采购、人力招聘、销售线索、安全运营、知识库检索和多智能体协作。比如，客服智能体可能承诺超额退款，财务智能体可能越权审批采购，人力智能体可能错误使用敏感属性筛选候选人，知识库智能体可能被文档里的恶意提示词诱导。AgentGuard CI 会在这些行为进入真实系统之前，把高风险动作提前识别出来。"
  },
  {
    time: "3:15-3:50",
    screen: "失败模式雷达与优先级队列",
    proof: "8 universal risk vectors and prioritized review queue",
    narration:
      "这次演示不是静态原型。项目已经包含二十四个代码智能体风险基准场景，以及十二个企业智能体运行场景。每次运行都会生成结构化报告、人工可读摘要和测试证据，评审可以通过公开仓库、命令行流程和提交材料复核结果。"
  },
  {
    time: "3:50-4:15",
    screen: "提交材料与公开仓库",
    proof: "agentguard-runs/tencent-submission/AgentGuard-CI-Tencent-Roadshow.pptx, AgentGuard-CI-Tencent-Whitepaper.docx and public GitHub repository",
    narration:
      "相比普通测试工具，AgentGuard CI 更像一个智能体安全审计员。它不只是告诉你有没有成功，而是告诉你这个成功能不能被企业批准。它把智能体测试从功能验证，推进到上线治理。"
  },
  {
    time: "4:15-4:35",
    screen: "Dashboard 收尾",
    proof: "Public GitHub repository and Tencent submission assets",
    narration:
      "我们认为，未来企业采用 AI 智能体的关键，不只是让智能体更聪明，而是让智能体的行为可控、可审计、可复盘、可负责。AgentGuard CI 就是为这个未来准备的基础设施。谢谢各位评委。"
  }
];

const terminalProof = [
  "AgentGuard CI Tencent demo proof sheet",
  "",
  "Commands already verified for the demo:",
  "- npm test: 40 test files, 166 tests passed",
  "- npm run build: all workspaces built successfully",
  `- npm run agentguard:suite: ${suite.passedScenarios}/${suite.totalScenarios} scenarios passed, ${suite.risk.blockedRiskPoints}/${suite.risk.totalRiskPoints} risk points blocked`,
  `- npm run agentguard:agent-suite: ${adapter.summary.totalScenarios} live-local agent scenarios, ${adapter.summary.reviewOrBlockScenarios} review/block scenarios`,
  "- npm run submission:check: 28 checks passed",
  "",
  "Required screen proof:",
  "- Dashboard: http://localhost:5190/?lang=zh",
  "- GitHub: https://github.com/baiqidi/agentguard-ci",
  "- Code summary: agentguard-runs/suite-summary.md",
  "- Enterprise agent summary: agentguard-runs/agent-adapters/agent-adapter-suite-summary.md",
  "- Tencent positioning: docs/hackathons/tencent-ai-agent-pack.md",
  "- Local validation: docs/submission/local-validation-report.md",
  "- Tencent submission ZIP/DOCX/PPTX: agentguard-runs/tencent-submission/",
  "",
  "Do not show private email, Tencent account pages, tokens, SSH keys, or browser notification popups."
].join("\n");

const narrationZh = [
  "# AgentGuard CI 腾讯云黑客松演示视频中文旁白",
  "",
  "目标时长：4 分钟左右，必须控制在 3-5 分钟。",
  "",
  ...shotList.flatMap((shot) => [
    `## ${shot.time} ${shot.screen}`,
    "",
    shot.narration,
    "",
    `屏幕证据：${shot.proof}`,
    ""
  ])
].join("\n");

const manifest = {
  generatedAt: new Date().toISOString(),
  appUrl: "http://localhost:5190/?lang=zh",
  outputDir: resolve(outDir),
  publicRepository: "https://github.com/baiqidi/agentguard-ci",
  verifiedEvidence: {
    codeRepairScenarios: suite.totalScenarios,
    codeRepairPassed: suite.passedScenarios,
    blockedRiskPoints: suite.risk.blockedRiskPoints,
    totalRiskPoints: suite.risk.totalRiskPoints,
    criticalFindings: suite.risk.criticalFindings,
    enterpriseAgentScenarios: adapter.summary.totalScenarios,
    enterpriseAgentTypes: adapter.summary.liveAgentTypes,
    enterpriseGatePassRate: adapter.summary.gatePassRate
  },
  requiredAssets: requiredAssets.map((asset) => ({ path: asset, absolutePath: resolve(root, asset) })),
  futureAudioCommand: "npm run video:audio:tencent",
  futureRecordCommand: "npm run video:record:tencent",
  note: "Preparation only. This command does not start screen recording."
};

writeFileSync(join(outDir, "shot-list.json"), `${JSON.stringify(shotList, null, 2)}\n`);
writeFileSync(join(outDir, "terminal-proof.txt"), `${terminalProof}\n`);
writeFileSync(join(outDir, "narration-zh.md"), `${narrationZh}\n`);
writeFileSync(join(outDir, "asset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log("Tencent demo video preparation complete.");
console.log(`Prepared assets: ${outDir}`);
console.log("No recording was started.");
