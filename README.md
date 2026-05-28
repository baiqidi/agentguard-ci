# AgentGuard CI

AgentGuard CI is an agent reliability firewall for testing whether enterprise AI agents are safe enough to run, promote, or route to human review. The command-backed live adapter focuses on code-repair agents: it uses a mixed frontend/backend Issue Tracker as a CI failure playground, then scores whether an agent repaired the failure safely. The broader product is a general AgentGuard control layer for RPA/browser, data, support, workflow, document, email, finance, HR, CRM, SOC, knowledge, and multi-agent systems, now backed by executable live-local adapter scenarios.

The repository now supports multiple contest wrappers on top of the same product core:

- **UiPath**: Test Cloud governance and evidence import workflow.
- **Tencent Cloud**: Chinese enterprise AI governance packaging.
- **Splunk**: Security-track packaging for agentic SOC workflows with Splunk MCP evidence.
- **SANS FIND EVIL**: Protocol SIFT / SIFT Workstation incident-response packaging with self-correction and artifact-level accuracy evidence.

Public repository: https://github.com/baiqidi/agentguard-ci

License: MIT, covering the original AgentGuard CI solution code in this repository.

## Current Contest Wrappers

- UiPath Track 3: code-repair reliability plus Test Cloud evidence.
- Tencent Cloud AI contest: Chinese enterprise governance story and localized dashboard.
- Splunk Agentic Ops: Security track plus Best Use of Splunk MCP Server.
- SANS FIND EVIL: autonomous incident-response reliability gate for Protocol SIFT workflows.

Open the web console in different modes:

- Default: `http://localhost:5173/`
- Tencent wrapper: `http://localhost:5173/?contest=tencent`
- Splunk wrapper: `http://localhost:5173/?contest=splunk`
- SANS FIND EVIL wrapper: `http://localhost:5173/?contest=sans`

## Project Description

AgentGuard CI addresses a reliability gap in AI-assisted work: an agent can appear successful while still taking unsafe action. The prototype treats AI agent behavior as a test target. Its first live adapter replays 24 controlled CI failure scenarios, lets a code-fixing agent repair them, then scores the repair for root cause quality, test preservation, diff safety, CI health, and human approval readiness.

The result is a repeatable evidence loop for teams that want to adopt agents without trusting a one-off demo.

The 24-scenario failure atlas covers safe localized repairs, test manipulation, prompt injection, snapshot laundering, unsafe diffs, hallucinated root causes, dependency and license risk, secret-handling risk, authentication bypass, observability removal, rollback governance, release configuration drift, performance regressions, data migration risk, platform edge cases, timezone bugs, and concurrency races.

The latest assurance layer adds severity, owner, control, and evidence-standard metadata to each scenario. A full suite run currently stops **106/131 risk points** before promotion, including **5 critical findings** that require named-owner approval.

The newest risk radar lifts the story above the code-repair adapter. It maps live and live-local controls across **8 universal agent failure vectors**: instruction attack, excessive agency, tool misuse, data leakage, evidence loss, state drift, approval bypass, and runtime fragility. The taxonomy is inspired by NIST AI RMF governance, OWASP GenAI/LLM security categories, MITRE ATLAS-style adversarial thinking, OpenTelemetry GenAI/agent observability, and production reliability practice.

## General Agent Platform

AgentGuard now separates the **execution surface** from the **control contract**:

- Command-backed adapter: code-repair agent reliability with 24 scenarios.
- Live-local adapters: browser/RPA, data-analysis, customer-support, workflow/DevOps, document/compliance, email/calendar, finance/procurement, HR/recruiting, CRM/sales, security/SOC, knowledge retrieval, and multi-agent coordination, with a current 9 review / 5 hard-block decision mix.
- Universal reliability gates: goal fidelity, tool boundary, evidence integrity, state safety, and human approval.
- Failure mode radar: 8 universal vectors that show which risks are covered by command-backed and live-local scenarios.
- Operator workbench: a five-step runbook plus a scenario priority queue that tells a first-time user what to run, what evidence to inspect, and which high-risk scenarios deserve attention first.

This is intentionally truthful for a hackathon demo: the code-repair suite runs real repository commands, while the non-code adapters run deterministic local traces and produce contest-aware evidence packets. Hosted third-party agent installation is not claimed unless credentials are provided.

## Fastest User Path

1. Install and verify the workspace: `npm install; npm test`.
2. Run the full reliability suite: `npm run agentguard:suite`.
3. Run the non-code agent adapter suite: `npm run agentguard:agent-suite`.
4. Review the blocked-risk summaries: `agentguard-runs/suite-summary.md` and `agentguard-runs/agent-adapters/agent-adapter-suite-summary.md`.
5. Attach evidence through the Test Cloud mapping: `uipath/test-cloud-import.csv`.

The dashboard mirrors this same path in the Operator Runbook panel so a judge or teammate can use the product without reverse-engineering the repository.

## Splunk Agentic Ops Edition

The Splunk wrapper positions AgentGuard as a security control layer around agentic SOC workflows:

- The dashboard can run in Splunk mode with `?contest=splunk`.
- Evidence payloads switch to `targetPlatform: "Splunk MCP Server"`.
- The evidence artifact name becomes `splunk-mcp-evidence.json`.
- The root repository includes [`architecture_diagram.md`](./architecture_diagram.md), which satisfies Splunk's architecture-diagram requirement.

## SANS FIND EVIL Edition

The SANS wrapper positions AgentGuard as the audit and reliability gate before an autonomous incident-response agent mutates evidence, overstates findings, or contains a system without approval:

- The dashboard can run in SANS mode with `?contest=sans`.
- Evidence payloads switch to `targetPlatform: "SANS SIFT Workstation + Protocol SIFT MCP"`.
- The evidence artifact name becomes `sift-ir-evidence.json`.
- The local runner writes terminal-style execution logs, an accuracy report, dataset documentation, an investigative narrative, a judge evidence summary, and a SIFT readiness preflight that records whether the run is fixture-local, SIFT-compatible local, or SIFT-live:

```bash
npm run sans:check
```

The local fixture path is intentionally honest. On a workstation without SIFT binaries, the runner records `fixture-local` mode while preserving the same artifact locator and command contract. On a SANS SIFT Workstation, the same flow can be mapped to real `fls`, `mactime`, `rip.pl`, `grep`, `awk`, `tshark`, `wevtutil`, `vol.py`, and MCP-mediated Protocol SIFT calls.

The current FIND EVIL pack covers five realistic DFIR checkpoints: disk persistence, authentication spraying, network containment, Windows Event Log lateral movement, and memory process tree triage.

SANS-specific artifacts:

- `architecture_diagram_sans.md`: agent, SIFT tools, MCP, evidence sources, and output pipeline.
- `sans-fixtures/case-001/`: safe local evidence bundle for replay.
- `agentguard-runs/sans-find-evil/sift-readiness.json`: required SIFT tools, Protocol SIFT install path, execution mode, and starter-case-data override.
- `agentguard-runs/sans-find-evil/agent-execution-log.jsonl`: timestamped tool execution and self-correction log.
- `agentguard-runs/sans-find-evil/accuracy-report.json`: confirmed, rejected, and inferred findings with artifact locators.
- `agentguard-runs/sans-find-evil/evidence-dataset.md`: documents the safe fixture bundle, including Windows Security Event and memory process tree sources.
- `agentguard-runs/sans-find-evil/judge-evidence-summary.md`: one-page replay and judging packet for Devpost reviewers.
- `agentguard-runs/sans-demo-video/shot-list.json`: under-five-minute FIND EVIL demo storyboard with a required terminal scene.
- `docs/submission/sans-find-evil-submission-copy.md`: ready-to-paste Devpost story.
- `docs/submission/sans-find-evil-judge-readiness.md`: mapping to FIND EVIL judging criteria.

SANS video prep commands:

```bash
npm run video:prep:sans
npm run video:audio:prep:sans
npm run video:audio:sans
npm run video:record:sans
npm run video:check:sans
```

The official final recording should still show a real terminal running `npm run sans:check`; the automated recorder includes a terminal-style replay scene to keep the product walkthrough scene-aligned.

## Product Thesis

Most test intelligence tools answer "which tests failed?" or "which tests should we run?" AgentGuard answers the higher-stakes agent question: "is this autonomous action safe enough to approve?"

- CloudBees/Launchable-style predictive selection runs fewer relevant tests; AgentGuard adds agent behavior gates.
- BrowserStack-style test observability explains test health; AgentGuard turns that evidence into promote/review/block decisions.
- Datadog-style CI optimization reduces pipeline cost; AgentGuard optimizes the evidence loop around autonomous-agent risk.
- Tricentis-style risk-based testing prioritizes release risk; AgentGuard specializes the risk taxonomy for AI-agent failure modes.
- SRE and AI-risk-management practice turn incidents into accountable controls; AgentGuard converts unsafe agent behavior into owner queues and risk points.

## UiPath Components

- UiPath Test Cloud: target governance layer for importing and running AgentGuard scenarios as test cases.
- UiPath Test Manager-style evidence model: AgentGuard emits JUnit XML, Markdown, and JSON reports that can be attached to scenario executions.
- UiPath Studio Web / Orchestrator runbook: `uipath/studio-web-runbook.md` describes how the scenario runner can be orchestrated as a governed workflow.
- UiPath Labs environment: expected hosted environment for the final hackathon submission once access is provisioned.

## Agent Type

This solution demonstrates a coded-agent reliability workflow as the first live adapter. The prototype includes a scripted TypeScript code-fixing agent adapter in `packages/codefix-agent`, and the Test Cloud layer governs the behavior of that agent through repeatable reliability scenarios. It does not depend on low-code agents in the current prototype, but the same gate contract can extend to low-code, RPA, data, support, workflow, document, or hybrid agents.

## Setup Instructions

Prerequisites:

- Node.js 20+
- npm 10+

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Build all packages:

```bash
npm run build
```

Run the Judge Demo Console locally:

```bash
npm run dev -w @agentguard/web
```

Run reliability scenarios:

```bash
npm run agentguard:suite
```

Run live-local non-code adapter scenarios:

```bash
npm run agentguard:agent-suite
```

Or run individual scenarios:

```bash
npm run agentguard:scenario -- --scenario frontend-contract
npm run agentguard:scenario -- --scenario backend-triage
npm run agentguard:scenario -- --scenario test-integrity-guard
npm run agentguard:scenario -- --scenario unsafe-diff-guard
npm run agentguard:scenario -- --scenario hallucinated-root-cause
npm run agentguard:scenario -- --scenario flaky-rerun-abuse
npm run agentguard:scenario -- --scenario dependency-upgrade-risk
npm run agentguard:scenario -- --scenario secret-handling-guard
npm run agentguard:scenario -- --scenario config-env-drift
npm run agentguard:scenario -- --scenario performance-regression
npm run agentguard:scenario -- --scenario data-migration-risk
npm run agentguard:scenario -- --scenario concurrency-race
npm run agentguard:scenario -- --scenario prompt-injection-override
npm run agentguard:scenario -- --scenario snapshot-blessing-abuse
npm run agentguard:scenario -- --scenario auth-bypass-shortcut
npm run agentguard:scenario -- --scenario input-validation-gap
npm run agentguard:scenario -- --scenario observability-removal
npm run agentguard:scenario -- --scenario rollback-flag-missing
npm run agentguard:scenario -- --scenario cross-platform-path-case
npm run agentguard:scenario -- --scenario timezone-edge-case
npm run agentguard:scenario -- --scenario accessibility-regression
npm run agentguard:scenario -- --scenario license-policy-risk
npm run agentguard:scenario -- --scenario large-refactor-drift
npm run agentguard:scenario -- --scenario nondeterministic-random-fix
```

Scenario reports are written to `agentguard-runs/<scenario-id>/`.
Non-code adapter reports are written to `agentguard-runs/agent-adapters/<scenario-id>/`.

## Planned Commands

```bash
npm install
npm test
npm run build
npm run agentguard:scenario -- --scenario frontend-contract
```

## Current Demo Commands

Build the agent adapter and reliability CLI:

```bash
npm run build -w @agentguard/codefix-agent
npm run build -w @agentguard/agent-adapters
npm run build -w @agentguard/reliability-core
```

Run reliability scenarios:

```bash
npm run agentguard:suite
npm run agentguard:agent-suite
```

Reports are written to `agentguard-runs/<scenario-id>/`.
Each run includes:

- `report.json`: machine-readable AgentGuard score.
- `report.md`: human reviewer summary.
- `junit.xml`: CI/Test Cloud-compatible pass/fail evidence.
- `test-cloud-evidence.json` by default, or a contest-specific evidence packet such as `splunk-mcp-evidence.json`.
- `suite-summary.json` and `suite-summary.md`: one-command overview for judges and CI artifacts.
- Risk assurance summary: total risk points, blocked risk points, critical findings, and owner review queue.
- Failure mode radar summary: universal vectors, live coverage, live-local coverage, and the highest-pressure vector.
- Scenario workbench summary: highest-priority live scenarios, executable live-local adapter scenarios, and the remaining expansion candidates for browser/RPA, data, support, workflow, document, email, finance, HR, CRM, SOC, knowledge, and multi-agent cases.
- Public framework install summary: contract-verified checks for Playwright, LangChain, CrewAI, AutoGen, Microsoft Graph, Slack Bolt, Salesforce Agentforce, and n8n without claiming hosted credentials.

## Continuous Evidence

The public repository includes a GitHub Actions workflow, `.github/workflows/agentguard-evidence.yml`, that runs on pushes, pull requests, and manual dispatch. It installs dependencies, runs all tests, builds the workspaces, executes `npm run agentguard:suite`, and uploads `agentguard-runs/` as the `agentguard-evidence` artifact.

This makes the submission reviewable from GitHub even before UiPath Labs access arrives: judges can inspect the same JSON, Markdown, JUnit, and Test Cloud evidence packets produced by the local demo.

## Research Backing

The design rationale is summarized in `docs/research/agentguard-research-brief.md`. It translates UiPath Test Cloud/Test Manager documentation, agent-evaluation research, NIST AI risk management, OWASP GenAI/LLM security risks, OpenTelemetry GenAI/agent observability, SRE practice, and high-reliability operations into AgentGuard's product principles: realistic repository-level scenarios, interactive execution evidence, traceable artifacts, structured feedback, and human review for high-risk actions.

## UiPath Submission Assets

- `uipath/test-cloud-matrix.md`: Test Cloud case mapping.
- `uipath/studio-web-runbook.md`: orchestration runbook.
- `uipath/test-cloud-import.csv`: import-friendly case list.
- `docs/submission/devpost-submission-copy.md`: ready-to-paste Devpost copy.
- `docs/submission/no-labs-submission-status.md`: honest review path while UiPath Labs access is pending.
- `docs/submission/local-validation-report.md`: local validation checklist and latest expected evidence.
- `docs/submission/demo-script.md`: five-minute demo script.
- `docs/submission/demo-video-production-plan.md`: shot list and upload checklist for the required public demo video.
- `docs/submission/deck-outline.md`: presentation outline.
- `docs/submission/scenario-expansion-backlog.md`: scenario backlog for the next non-code agent adapters.

Run the submission readiness gate after generating evidence:

```bash
npm run submission:check
```

Multi-hackathon packaging lives in `docs/hackathons/`. It ranks realistic alternate contests, records the Google Cloud eligibility warning for China-resident solo submissions, and gives contest-specific submission angles. Validate it with:

```bash
npm run hackathons:check
```

The Splunk-specific repository readiness check is self-generating: it builds the workspaces, runs the command-backed suite, runs the live-local agent suite, validates the Splunk app, prepares video assets, and then checks the submission packet.

```bash
npm run splunk:check
```

To regenerate the evidence without the final assertion pass:

```bash
npm run splunk:prepare
```

The Splunk companion app validation can also be run on its own:

```bash
npm run splunk:app:check
```

That command packages the companion app, executes the custom alert-action fixture, extracts the packaged `.tgz` into a clean install directory, and writes `agentguard-runs/splunk-app/install-smoke-report.json`.

Official Splunk Packaging Toolkit and AppInspect validation is pinned to Python 3.9 in `.github/workflows/splunk-companion-app.yml`. Splunk Packaging Toolkit 1.0.1 still imports legacy Python APIs such as `collections.Mapping` and `imp`, so newer local Python runtimes such as 3.14 are not used for the official SLIM packaging step.

Prepare the Splunk demo video assets without recording:

```bash
npm run video:prep:splunk
```

Prepare scene-aligned English voiceover audio without recording:

```bash
npm run video:audio:prep:splunk
npm run video:audio:splunk
```

Record the final Splunk walkthrough only after the local app is running on port `5190` and the submission copy is final:

```bash
npm run video:record:splunk
```

Verify the recorded MP4 before upload:

```bash
npm run video:check:splunk
```

The video check validates the generated MP4 duration, audio stream, resolution, seven-scene product route list, scene-aligned narration audio, and judge-facing narration text. It is separate from `npm run splunk:check` because recording requires the local web app to be running.

Public Splunk demo video URL for submission forms:

```text
https://github.com/baiqidi/agentguard-ci/raw/main/docs/submission/AgentGuard-CI-Splunk-Demo.mp4
```

Splunk-specific submission assets live in:

- `docs/submission/splunk-submission-copy.md`
- `docs/submission/splunk-significant-updates.md`
- `docs/submission/splunk-judge-readiness.md`
- `docs/submission/splunk-demo-script.md`
- `docs/submission/splunk-demo-video-plan.md`
- `docs/submission/AgentGuard-CI-Splunk-Demo.mp4`
- `agentguard-runs/splunk-app/install-smoke-report.json`
- `splunk-apps/agentguard_ci_for_splunk/`
- `.github/workflows/splunk-companion-app.yml`

## Project Layout

- `apps/api`: Express Issue Tracker API
- `apps/web`: React Judge Demo Console and Issue Tracker target UI
- `packages/reliability-core`: Agent reliability scoring and reporting
- `packages/codefix-agent`: Demo code-fixing agent adapter
- `packages/agent-adapters`: Browser, data, support, workflow, document, email, finance, HR, CRM, SOC, knowledge, and multi-agent live-local adapter traces
- `scenarios`: CI failure scenario manifests
- `uipath`: Test Cloud mapping and runbook
- `docs/submission`: demo script and deck outline
