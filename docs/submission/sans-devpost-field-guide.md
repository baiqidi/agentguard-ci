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

Video URL:

```text
https://youtu.be/CTRoxgFSGlg
```

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

## Ready-To-Paste Fields

Video link:

```text
https://youtu.be/CTRoxgFSGlg
```

Try it out:

```text
Repository: https://github.com/baiqidi/agentguard-ci/tree/codex/sans-find-evil

Local verification:
npm install
npm run sans:check
npm run dev -w @agentguard/web

Dashboard:
http://localhost:5173/?contest=sans

Optional full SIFT path:
1. Download and boot the SANS SIFT Workstation OVA.
2. Install Protocol SIFT with:
   curl -fsSL https://raw.githubusercontent.com/teamdfir/protocol-sift/main/install.sh | bash
3. Run the same AgentGuard command contract against SIFT-backed evidence/tool calls.
```

Additional judge note:

```text
The public branch is the current submission repository. Judges can run `npm install` and `npm run sans:check` to regenerate the evidence bundle, including the terminal-style agent log, accuracy report, evidence dataset, investigative narrative, and adapter-suite summary. The demo uses a safe fixture bundle by default and clearly records `fixture-local` mode when SANS SIFT binaries are unavailable; the same command contract maps to SANS SIFT and Protocol SIFT-style tool calls in a full SIFT environment.
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
