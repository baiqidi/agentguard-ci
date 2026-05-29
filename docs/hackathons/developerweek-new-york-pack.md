# DeveloperWeek New York 2026 Hackathon Pack

## Contest Snapshot

- Event: DeveloperWeek New York 2026 Hackathon
- Format: online plus in-person
- Online build window: May 25 to June 10, 2026
- Submission deadline: June 10, 2026 at 10:00 AM EDT
- Eligibility: 18+; participants from any country are allowed; teams of 1 to 5
- Public tags: DevOps, Enterprise, Machine Learning/AI
- Round 1 judging: progress, concept, and feasibility

Sources:

- https://dwny-2026-hackathon.devpost.com/
- https://dwny-2026-hackathon.devpost.com/rules
- https://www.developerweek.com/newyork/hackathon/

## Recommended Submission Positioning

**Project name:** AgentGuard CI

**Tagline:** A reliability firewall that turns AI-agent behavior into a CI gate before agents touch production workflows.

DeveloperWeek is broader than the security-only competitions. The winning story should not sound like a niche SOC tool. It should sound like a venture-ready developer product for teams shipping AI agents into real business processes.

The strongest angle:

> Teams are moving from copilots to autonomous agents. AgentGuard CI gives those teams a repeatable way to test whether an agent should be promoted, reviewed, or blocked before it changes code, records, data, tickets, alerts, or workflows.

## Why This Fits DeveloperWeek

- **Progress:** the repository builds, runs tests, executes a command-backed code-repair suite, and executes a live-local enterprise agent adapter suite.
- **Concept:** agent reliability is a real developer and enterprise adoption blocker. AgentGuard maps agent behavior to promote / review / block decisions.
- **Feasibility:** the product can evolve into a CI plugin, GitHub App, hosted SaaS dashboard, or enterprise governance layer for agent rollouts.

## Demo Flow

Use the DeveloperWeek-specific public video as proof of a running product and frame it as the broad enterprise-agent edition of the platform:

1. Open with the general dashboard and risk radar.
2. Show `npm run build`, `npm test`, and `npm run agentguard:agent-suite`.
3. Show the enterprise adapter summary: 17 scenarios across 13 agent categories.
4. Show three decision types: promote, review, block.
5. Mention the SANS/Splunk variants only as evidence that the core control layer can be packaged for different real-world domains.

## Submission Links

- GitHub branch: https://github.com/baiqidi/agentguard-ci/tree/codex/developerweek-ny
- Current public demo video: https://youtu.be/RQFx5FuB3nY
- Primary evidence summary: `agentguard-runs/agent-adapters/agent-adapter-suite-summary.md`
- Product README: `README.md`
- Submission copy: `docs/submission/developerweek-new-york-submission-copy.md`

## Near-Term Build Delta

Required before final submission:

- DeveloperWeek-specific Devpost story and additional-info answers.
- Confirm the Devpost project page embeds the DeveloperWeek demo video URL.
- Optional but high-value: post a Devpost update that calls out the final video, 17 scenarios, and one-command proof.

Not required before registration:

- New core agent runtime.
- Hosted deployment.
- Sponsor-specific integration, unless we choose Tower or Nimble as an extra prize attempt.

## Prize Strategy

Primary target: Overall Winner.

Secondary target if time allows: Tower Pipeline Challenge if we can add a lightweight data-to-agent reliability scenario that validates whether an AI data agent preserves lineage and approval boundaries before producing an operational recommendation.

Avoid overfitting to sponsor challenges until the base DeveloperWeek submission is registered and visible.
