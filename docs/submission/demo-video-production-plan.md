# Demo Video Production Plan

Target length: 4 minutes 30 seconds. Devpost requires the final video to be publicly visible on YouTube, Vimeo, or Youku and under five minutes.

## Video Title

AgentGuard CI: 企业智能体上线前可靠性评测与治理平台

## Recording Setup

- Browser: Edge or Chrome at 1440x1080.
- Local app: `npm run dev -w @agentguard/web`.
- Current Tencent preparation runbook: `docs/submission/tencent-demo-video-runbook.md`.
- Preparation command, not recording: `npm run video:prep:tencent`.
- Voiceover command, audio only: `npm run video:audio:tencent`.
- Future recording command, only when ready: `npm run video:record:tencent`.
- Terminal: repository root.
- Evidence files open in editor:
  - `agentguard-runs/suite-summary.md`
  - `agentguard-runs/agent-adapters/agent-adapter-suite-summary.md`
  - `docs/hackathons/tencent-ai-agent-pack.md`
  - `docs/submission/local-validation-report.md`
  - `agentguard-runs/tencent-submission/AgentGuard-CI-Tencent-Whitepaper.docx`

## Shot List

| Time | Screen | Narration goal |
| --- | --- | --- |
| 0:00-0:25 | 中文 Dashboard 开场 | AI 智能体上线前需要可靠性评测和治理闸门。 |
| 0:25-0:55 | 13 类 Agent 覆盖与风险雷达 | Show 14 live-local enterprise scenarios across 12 categories plus command-backed code repair. |
| 0:55-1:25 | 腾讯云赛事适配与操作 Runbook | Show the Chinese Tencent positioning and the exact commands judges can run. |
| 1:25-2:05 | Terminal proof | Replay verified local evidence: 24 code scenarios and 12 enterprise scenarios. |
| 2:05-2:40 | 证据报告与审批结论 | Show blocked risk points, critical findings, review/block decisions, and artifacts. |
| 2:40-3:15 | 中国企业场景示例 | Show customer support, finance, HR, document, RPA, security, CRM, knowledge, workflow, and multi-agent risks. |
| 3:15-3:50 | Failure Mode Radar / Scenario Workbench | Show risk vectors, severity, owner routing, and prioritized review queue. |
| 3:50-4:15 | 提交材料与公开仓库 | Show public GitHub, Chinese whitepaper, PPT, ZIP package, and local validation report. |
| 4:15-4:35 | Dashboard close | Close with the thesis: AgentGuard changes agent testing from "did it finish?" to "is it safe enough to approve?" |

## Required On-Screen Proof

- Public GitHub URL: `https://github.com/baiqidi/agentguard-ci`
- `npm run submission:check` passing.
- `agentguard-runs/suite-summary.md`.
- `agentguard-runs/agent-adapters/agent-adapter-suite-summary.md`.
- `docs/hackathons/tencent-ai-agent-pack.md`.
- `agentguard-runs/tencent-submission/AgentGuard-CI-Tencent-Roadshow.pptx`.
- `agentguard-runs/tencent-submission/AgentGuard-CI-Tencent-Whitepaper.docx`.
- Dashboard showing 13 validated profiles and 14 live-local scenarios across 12 live-local adapters.

## Final Upload Checklist

- Video is less than five minutes.
- Video is 3-5 minutes for the Tencent Cloud submission.
- No copyrighted music.
- No private tokens, email inboxes, or credentials are visible.
- The final MP4 includes the local Chinese voiceover or a live spoken narration.
- Tencent Cloud submission fields contain the GitHub URL, available demo URL if any, ZIP, whitepaper, and deck.
