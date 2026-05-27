# Multi-Hackathon Strategy

Date: 2026-05-27

AgentGuard CI should be treated as one product with several submission wrappers, not as several separate projects. The product thesis stays stable:

> AgentGuard CI is a reliability firewall for AI agents. It tests whether autonomous actions are safe enough to approve before they mutate systems, leak data, skip review, or ship broken changes.

## Priority Order

| Priority | Contest | Status | Why |
| --- | --- | --- | --- |
| 1 | UiPath AgentHack | Primary | Built directly for Test Cloud governance. Keep pushing until Labs URL arrives. |
| 2 | Splunk Agentic Ops Hackathon | Active alternate | Highest near-term fit for a real prize run because the Security track and Splunk MCP Server bonus align with AgentGuard's evidence-first control layer. |
| 3 | 腾讯云黑客松 AI 智能体争霸赛 | Active alternate | China-friendly, long runway, strong enterprise-agent story. |
| 4 | SANS Find Evil | Active alternate | Strong technical fit for SOC and incident-response agent governance. |
| 5 | Hack-Nation Global AI | Active alternate | Good startup and infrastructure framing with more time. |
| 6 | DevNetwork AI + ML | Opportunistic | Very tight deadline; submit only by reusing existing assets. |
| 7 | Google Cloud Rapid Agent | Study-only | Public rules exclude China-resident solo submissions, so it is not a current prize target. |

## Recommended Execution

1. **Do not pause UiPath.** Keep the Labs URL watch open, finish video and deck, and submit once links are ready.
2. **Build the Splunk variant now.** Splunk requires a public repo, open-source license, root `architecture_diagram.md`, a demo under 3 minutes, and a note on significant updates after the submission period start.
3. **Prepare Tencent in parallel as the China-native path.** It has the best long-run China-accessible runway and benefits from the existing Chinese dashboard copy.
4. **Prepare SANS after Splunk.** Reuse the SOC framing and add incident-response-specific scenarios if time allows.
5. **Use Hack-Nation for venture story.** Package AgentGuard as agent governance infrastructure.
6. **Submit DevNetwork only if no new build is needed.** The deadline is too close for substantial changes.
7. **Do not pursue Google Cloud Rapid Agent as a prize target unless eligibility changes.** Use it for learning and competitive analysis only.

## Reusable Assets

| Asset | Reuse |
| --- | --- |
| Public GitHub | All contests |
| MIT License | All contests |
| README setup path | All contests |
| `npm run agentguard:suite` | Technical evidence for all contests |
| `npm run agentguard:agent-suite` | Enterprise-agent coverage evidence |
| `npm run submission:check` | UiPath readiness |
| `npm run hackathons:check` | Multi-contest readiness |
| `npm run splunk:check` | Splunk repository readiness |
| Dashboard | Video and demo for all contests |
| Scenario backlog | Proof of roadmap depth |

## Strategy Confidence Loop

I do not have 100% confidence in any hackathon plan until eligibility and submission requirements are checked against official sources. Current risk review:

- **Eligibility risk:** Google Cloud Rapid Agent is not safe for a China-resident solo submission.
- **Integration risk:** Splunk requires visible repository-level adaptation, not a renamed UiPath demo.
- **Deadline risk:** DevNetwork is too close for product changes.
- **Platform risk:** UiPath still needs Labs URL.
- **Evidence risk:** SANS, Tencent, and Hack-Nation need contest-specific demo narration even if the code remains the same.

Mitigation:

- Treat Google as study-only.
- Add a Splunk-specific architecture diagram, evidence artifact, submission copy, and readiness check.
- Keep UiPath as primary but no-Labs-ready.
- Build Tencent, SANS, and Hack-Nation packs from the existing evidence.
- Use repository-level checks so missing contest files are caught before submission.

With those corrections, the strategy is strong enough to execute without wasting major effort on disqualified or low-fit contests.
