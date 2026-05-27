# Splunk Agentic Ops Submission Copy

## Project Name

AgentGuard for Splunk SOC

## Track

Security

## Bonus Prize

Best Use of Splunk MCP Server

## One-Line Summary

AgentGuard for Splunk SOC tests whether an AI security agent is safe enough to investigate, summarize, or automate before it can mutate real systems.

## What It Does

AI agents can help security teams triage alerts, summarize incidents, and recommend next steps, but they can also take unsafe action while looking productive. They may skip evidence collection, overreach their tool permissions, suppress the wrong alert, or move too quickly without approval.

AgentGuard for Splunk SOC is a reliability control layer that evaluates those risks before an agent is trusted in production. It runs repeatable scenarios, scores the agent across five reliability gates, and produces evidence that tells a team whether the agent is ready for guarded execution, needs human review, or should be blocked.

The project includes:

- 24 command-backed reliability scenarios for the live adapter.
- 14 live-local enterprise scenarios across 12 agent categories, including 3 dedicated security/SOC routes and a 9 review / 5 hard-block decision mix.
- A dashboard for judge review and scenario inspection.
- A Splunk companion app with saved searches, a review-gate alert action, and a demo dashboard.
- Machine-readable and human-readable evidence artifacts, including a Splunk-specific evidence packet.

## How Splunk Is Used

This submission is tailored for Splunk's Security track and Best Use of Splunk MCP Server. The architecture models Splunk alerts, logs, and case context flowing through Splunk MCP Server and Splunk AI capabilities into AgentGuard's scoring and review pipeline. It also packages a companion Splunk app so the review queue, evidence coverage, and alert-action handoff exist as a real Splunk surface instead of a mock.

The root `architecture_diagram.md` shows:

- how the application interacts with Splunk,
- how AI models and agents are integrated, and
- how data flows between Splunk, AgentGuard, and the human review layer.

## Why It Matters

Many AI security demos focus on making agents more capable. This project focuses on making them more trustworthy. In a real SOC, the question is not only whether an agent can answer, but whether it can act safely, preserve evidence, and respect approval boundaries.

AgentGuard gives teams a repeatable way to verify that before an agent is promoted into a live workflow.

## Demo Notes

Public demo video:

https://github.com/baiqidi/agentguard-ci/raw/main/docs/submission/AgentGuard-CI-Splunk-Demo.mp4

The demo video is designed to stay under 3 minutes and show:

1. the problem,
2. the product running,
3. how AI is used,
4. the value of the review-or-block decision, and
5. the Splunk-specific evidence output and companion-app handoff.
