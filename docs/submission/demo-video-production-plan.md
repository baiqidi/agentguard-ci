# Demo Video Production Plan

Target length: 4 minutes 30 seconds. Devpost requires the final video to be publicly visible on YouTube, Vimeo, or Youku and under five minutes.

## Video Title

AgentGuard CI: Testing AI Agents Before They Can Cause Enterprise Risk

## Recording Setup

- Browser: Edge or Chrome at 1440x1080.
- Local app: `npm run dev -w @agentguard/web`.
- Terminal: repository root.
- Evidence files open in editor:
  - `agentguard-runs/suite-summary.md`
  - `agentguard-runs/agent-adapters/agent-adapter-suite-summary.md`
  - `uipath/test-cloud-matrix.md`
  - `docs/submission/no-labs-submission-status.md`

## Shot List

| Time | Screen | Narration goal |
| --- | --- | --- |
| 0:00-0:25 | Dashboard hero | AI agents can succeed while still creating unsafe business risk. AgentGuard CI tests whether action is safe enough to approve. |
| 0:25-0:55 | General Agent Control Layer | Show 13 profiles: one command-backed code-repair adapter and 12 live-local enterprise adapters. |
| 0:55-1:25 | Operator Runbook | Show the exact commands a judge can run: tests, build, reliability suite, agent suite, submission check. |
| 1:25-2:05 | Terminal | Run or replay `npm run agentguard:suite` and `npm run agentguard:agent-suite`. Mention 24 code scenarios and 12 enterprise scenarios. |
| 2:05-2:40 | Suite summaries | Show blocked risk points, critical findings, gate pass rate, and review/block decisions. |
| 2:40-3:15 | Test Cloud matrix | Explain how the cases map to UiPath Test Cloud and how artifacts become review evidence. |
| 3:15-3:50 | Failure Mode Radar / Scenario Workbench | Show coverage of instruction attack, excessive agency, tool misuse, data leakage, evidence loss, state drift, approval bypass, and runtime fragility. |
| 3:50-4:15 | No-Labs status note | Explain that Labs access is pending, but the project is reviewable through public GitHub, local commands, GitHub Actions, and evidence artifacts. |
| 4:15-4:30 | Dashboard close | Close with the thesis: AgentGuard changes agent testing from "did it finish?" to "is it safe enough to approve?" |

## Required On-Screen Proof

- Public GitHub URL: `https://github.com/baiqidi/agentguard-ci`
- `npm run submission:check` passing.
- `agentguard-runs/suite-summary.md`.
- `agentguard-runs/agent-adapters/agent-adapter-suite-summary.md`.
- `uipath/test-cloud-matrix.md`.
- Dashboard showing 13 validated profiles and 12 live-local adapters.
- No-Labs note with the pending Labs URL statement.

## Final Upload Checklist

- Video is less than five minutes.
- Video is public or unlisted-but-accessible by link.
- No copyrighted music.
- No private tokens, email inboxes, or credentials are visible.
- Devpost video field contains the public video URL.
- Devpost description mentions that Labs URL is pending until access arrives.
