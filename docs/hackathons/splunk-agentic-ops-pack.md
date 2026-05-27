# Splunk Agentic Ops Submission Pack

## Working Title

AgentGuard for Splunk SOC

## Tagline

Stop unsafe AI-agent actions before they close the wrong alert, skip evidence, or mutate production systems without approval.

## Target Track

- Primary track: **Security**
- Bonus prize: **Best Use of Splunk MCP Server**

## Submission Angle

Splunk's hackathon is not asking for a generic AI demo. It asks for an AI-powered solution that uses Splunk capabilities to help teams monitor systems, secure environments, or build better developer workflows.

AgentGuard fits best as a **security control layer around agentic SOC workflows**:

> Splunk helps an AI agent see alerts, logs, and case context. AgentGuard decides whether the agent's proposed action is safe enough to execute, or whether it should be routed to a human reviewer first.

## Adapted Description

Security teams want AI agents that can triage detections, summarize incidents, correlate evidence, and recommend containment. The hard part is trust. An agent can look productive while still taking unsafe action: suppressing the wrong alert, skipping evidence collection, making broad changes, or closing a case without approval.

AgentGuard for Splunk turns that trust problem into a repeatable test workflow. It replays controlled agent scenarios, scores the agent across five universal reliability gates, and emits evidence packets that show whether the agent is safe to promote, should be reviewed, or must be blocked.

The current build combines:

- 24 command-backed reliability scenarios for the live code-repair adapter.
- 14 live-local enterprise scenarios across 12 agent categories, including 3 dedicated security/SOC routes.
- A Splunk companion app with saved searches, dashboards, and a custom alert action that writes AgentGuard review envelopes.
- Judge-readable Markdown, machine-readable JSON, JUnit, and Splunk-specific evidence artifacts.
- A dashboard that can be opened in Splunk contest mode with `?contest=splunk`.

## Demo Emphasis

- Start on the dashboard in Splunk contest mode.
- Show that the product is evaluating whether an agent can be trusted, not just whether it produced an answer.
- Walk one security/SOC scenario that ends in review or block.
- Show the evidence payload with `targetPlatform: "Splunk MCP Server"`.
- Show the companion-app alert action turning a Splunk alert into an AgentGuard review envelope.
- Close on the human review queue and explain why that matters in a real SOC.

## Required Build Delta

This target is strong only if the repo shows real Splunk adaptation, not a renamed UiPath demo. The minimum acceptable delta is:

- Splunk-specific README positioning.
- Root `architecture_diagram.md`.
- Splunk evidence artifact naming and target platform metadata.
- A real Splunk companion app package plus CI validation through AppInspect and Packaging Toolkit.
- Splunk submission copy and significant-updates note.
- A 3-minute-or-shorter Splunk-specific demo video.

## Strengths

- Tight fit with the Security track.
- Clear use for Splunk MCP Server.
- Clear use for Splunk AppInspect and Packaging Toolkit as production-readiness proof.
- Differentiates from "AI assistant for SOC" demos by focusing on approval, evidence, and guardrails.
- Reuses the existing evidence-rich product instead of inventing a shallow new prototype.

## Gaps Before Submission

- Add the companion-app artifacts to the demo and docs.
- Record a Splunk-specific video under 3 minutes.
- If possible, add one more SOC scenario that emphasizes analyst escalation or case closure.

## Source

- https://splunk.devpost.com/
- https://splunk.devpost.com/rules
- https://splunk.devpost.com/updates
