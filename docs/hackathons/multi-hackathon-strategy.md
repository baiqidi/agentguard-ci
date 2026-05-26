# Multi-Hackathon Strategy

Date: 2026-05-26

AgentGuard CI should be treated as one product with several submission wrappers, not as several separate projects. The product thesis stays stable:

> AgentGuard CI is a reliability firewall for AI agents. It tests whether autonomous actions are safe enough to approve before they mutate systems, leak data, skip review, or ship broken changes.

## Priority Order

| Priority | Contest | Status | Why |
| --- | --- | --- | --- |
| 1 | UiPath AgentHack | Primary | Built directly for Test Cloud governance. Keep pushing until Labs URL arrives. |
| 2 | 腾讯云黑客松 AI 智能体争霸赛 | Active alternate | China-friendly, long runway, strong enterprise-agent story. |
| 3 | SANS Find Evil | Active alternate | Strong technical fit for SOC/incident-response agent governance. |
| 4 | Hack-Nation Global AI | Active alternate | Good startup/infrastructure framing with more time. |
| 5 | DevNetwork AI + ML | Opportunistic | Very tight deadline; submit only by reusing existing assets. |
| 6 | Google Cloud Rapid Agent | Study-only | Public rules exclude China-resident solo submissions, so it is not a current prize target. |

## Recommended Execution

1. **Do not pause UiPath.** Keep the Labs URL watch open, finish video/deck, and submit once links are ready.
2. **Prepare Tencent next.** It has the best long-run China-accessible path and benefits from the existing Chinese dashboard copy.
3. **Prepare SANS security variant.** Add SOC-specific language and optionally two deeper SOC scenarios.
4. **Use Hack-Nation for venture story.** Package AgentGuard as agent governance infrastructure.
5. **Submit DevNetwork only if no new build is needed.** The deadline is too close for substantial changes.
6. **Do not pursue Google Cloud Rapid Agent as a prize target unless eligibility changes.** Use it for learning and competitive analysis only.

## Reusable Assets

| Asset | Reuse |
| --- | --- |
| Public GitHub | All contests |
| MIT License | All contests |
| README setup path | All contests |
| `npm run agentguard:suite` | Technical evidence for all contests |
| `npm run agentguard:agent-suite` | Enterprise-agent coverage evidence |
| `npm run submission:check` | UiPath/Devpost readiness |
| `npm run hackathons:check` | Multi-contest readiness |
| Dashboard | Video and demo for all contests |
| Test Cloud matrix | UiPath primary; can be reframed as governance matrix elsewhere |
| Scenario backlog | Proof of roadmap depth |

## Strategy Confidence Loop

I do not have 100% confidence in any hackathon plan until eligibility and submission requirements are checked against official sources. Current risk review:

- **Eligibility risk:** Google Cloud Rapid Agent is not safe for a China-resident solo submission.
- **Deadline risk:** DevNetwork is too close for product changes.
- **Platform risk:** UiPath still needs Labs URL.
- **Evidence risk:** SANS/Tencent/Hack-Nation need contest-specific video narration even if the code remains the same.

Mitigation:

- Treat Google as study-only.
- Keep UiPath as primary but no-Labs-ready.
- Build SANS/Tencent/Hack-Nation packs from the existing evidence.
- Add `npm run hackathons:check` so the repository itself catches missing pack files.

With those corrections, the strategy is strong enough to execute without wasting major effort on disqualified or low-fit contests.
