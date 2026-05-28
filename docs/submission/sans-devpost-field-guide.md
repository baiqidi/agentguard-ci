# SANS FIND EVIL Devpost Field Guide

Use this guide when filling the FIND EVIL submission form.

## Project

Project name:

```text
AgentGuard IR
```

Tagline:

```text
Stop autonomous IR agents from overstating evidence, losing traceability, or containing systems without approval.
```

Repository:

```text
https://github.com/baiqidi/agentguard-ci/tree/codex/sans-find-evil
```

Dedicated repository to use only after deploy-key write access is fixed:

```text
https://github.com/baiqidi/agentguard-ci-sans-ir
```

## Story

Paste the story from:

```text
docs/submission/sans-find-evil-submission-copy.md
```

## Built With

Use these tags:

```text
TypeScript, React, Vite, Node.js, Vitest, SANS SIFT, Protocol SIFT, incident response, AI agents, cybersecurity
```

## Demo Video

Required recording checklist:

- Show a real terminal running `npm run sans:check`.
- Include English audio narration.
- Keep the video under 5 minutes.
- Show the self-correction event and the accuracy report.
- Show the public repository and architecture diagram or SANS dashboard evidence surface.

Prepared assets:

```text
agentguard-runs/sans-demo-video/shot-list.json
agentguard-runs/sans-demo-video/voiceover-en.txt
agentguard-runs/sans-demo-video/voiceover-review-en.md
agentguard-runs/sans-demo-video/submission-checklist.md
```

Optional helper commands:

```bash
npm run video:prep:sans
npm run video:audio:prep:sans
npm run video:audio:sans
npm run video:record:sans
npm run video:check:sans
```

## Judge Evidence

Mention that judges can run:

```bash
npm install
npm run sans:check
```

Expected evidence:

```text
agentguard-runs/sans-find-evil/agent-execution-log.jsonl
agentguard-runs/sans-find-evil/accuracy-report.json
agentguard-runs/sans-find-evil/evidence-dataset.md
agentguard-runs/sans-find-evil/investigative-narrative.md
agentguard-runs/sans-agent-adapters/agent-adapter-suite-summary.json
```

## Honesty Note

Default local runs use the safe fixture bundle and clearly report `fixture-local` mode when SIFT binaries are unavailable. On a SANS SIFT Workstation, the same command contract maps to real SIFT tools and Protocol SIFT-style tool calls.
