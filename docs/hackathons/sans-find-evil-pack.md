# SANS Find Evil Submission Pack

## Working Title

AgentGuard IR: Reliability Gate for Autonomous Incident Response Agents

## Tagline

Let AI incident-response agents investigate fast without letting them destroy evidence, over-contain systems, or act without approval.

## Submission Angle

SANS Find Evil is about autonomous incident response. AgentGuard CI can be reframed as the safety and evidence layer around those agents. The product does not need to be the incident-response agent itself; it can be the reliability gate that decides whether an IR agent's proposed triage, containment, and reporting actions are safe enough to execute.

## Adapted Description

Security teams want AI agents that can triage alerts, correlate logs, hunt for threats, and draft incident reports. The risky part is autonomy: an agent might delete evidence, block the wrong asset, disclose sensitive logs, hallucinate a root cause, or suppress an alert without a human reviewer.

AgentGuard IR tests those failure modes before the agent is trusted. It runs deterministic incident-response traces, scores the agent across goal fidelity, tool boundary, evidence integrity, state safety, and human approval, then produces Markdown, JSON, JUnit, and evidence packets for review.

The current AgentGuard suite already includes a Security/SOC adapter that blocks unsafe enforcement actions without incident approval. The SANS version should emphasize evidence preservation, analyst review, and high-risk containment gates.

## Demo Emphasis

- Show the Security/SOC adapter scenario.
- Show how state-changing actions are blocked before external mutation.
- Show generated evidence summaries and human-review recommendation.
- Explain how two additional SANS scenarios would be added:
  - `soc-evidence-preservation`: agent must preserve logs before summarizing or closing an incident.
  - `soc-containment-approval`: agent may recommend containment but cannot execute blocklists without named approval.

## Build Delta

Implemented for the SANS path:

- Five incident-response scenarios:
  - `sift-disk-persistence-self-correction`
  - `sift-auth-log-accuracy-validation`
  - `sift-containment-approval`
  - `sift-windows-event-log-lateral-movement`
  - `sift-memory-process-tree-review`
- SANS contest mode with `targetPlatform: "SANS SIFT Workstation + Protocol SIFT MCP"`.
- SANS evidence artifact name: `sift-ir-evidence.json`.
- Local SIFT-compatible runner: `scripts/run-sans-sift-ir-demo.mjs`.
- Safe fixture evidence bundle: `sans-fixtures/case-001/`.
- Readiness check: `npm run sans:check`.
- Dashboard wrapper: `http://localhost:5173/?contest=sans`.

## Judging Strength

- High technical credibility.
- Clear safety need.
- Good differentiation from "just build an IR chatbot."

## Gaps Before Submission

- Record the required public demo video with live terminal execution and audio narration.
- If Protocol SIFT Slack access or full SIFT case data becomes available, rerun the same command contract against those assets.
- Register on Devpost and paste the final repository, video, architecture, dataset, logs, and accuracy-report links.

## Source

https://www.sans.org/blog/sans-launches-first-hackathon-autonomous-incident-response
