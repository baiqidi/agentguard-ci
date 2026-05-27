# Splunk Demo Video Plan

## Goal

Record a Splunk-specific demo under 3 minutes that feels like a security product review, not a generic dashboard walkthrough.

## Runtime Budget

| Segment | Duration | Focus |
| --- | --- | --- |
| Problem statement | 0:00-0:20 | Unsafe AI-agent actions in a SOC |
| Product positioning | 0:20-0:40 | AgentGuard as the trust layer for Splunk SOC agents |
| Overview + judge route | 0:40-1:00 | 7/24 safe promotions, 17 routed to review, 106/131 risk points blocked |
| SOC mission desk | 1:00-1:35 | Route selection, linked Splunk tools, owner, command, approval gate |
| Companion app handoff | 1:35-2:00 | Saved searches, alert action, packaged app evidence |
| Evidence deep link | 2:00-2:35 | Blocked scenario, clean-install report, gate failures, named-owner review |
| Close | 2:35-2:55 | Why this is differentiated and submission-ready |

## Required Visuals

1. `http://localhost:5190/?contest=splunk&lang=en&page=overview&present=1`
2. `http://localhost:5190/?contest=splunk&lang=en&page=scenarios&soc=security-soc-alert-suppression&present=1`
3. `http://localhost:5190/?contest=splunk&lang=en&page=companion&delivery=install-smoke-report&present=1`
4. `http://localhost:5190/?contest=splunk&lang=en&page=evidence&filter=danger&scenario=unsafe-diff-guard&present=1`
5. `agentguard-runs/suite-summary.md`
6. `agentguard-runs/agent-adapters/agent-adapter-suite-summary.md`
7. `agentguard-runs/splunk-app/agentguard-review-envelope.json`
8. `agentguard-runs/splunk-app/install-smoke-report.json`
9. `architecture_diagram.md`

## Reproducible Recording Prep

Prepare the shot list and English narration source without recording:

```bash
npm run video:prep:splunk
```

The Splunk companion app proof should be regenerated before the shot list:

```bash
npm run splunk:app:check
```

The preparation output lives in `agentguard-runs/splunk-demo-video/`:

- `shot-list.json`
- `voiceover-en.txt`
- `asset-manifest.json`

Prepare the review file and scene-aligned English audio:

```bash
npm run video:audio:prep:splunk
npm run video:audio:splunk
```

The audio script uses Microsoft Edge neural TTS through `edge-tts`, synthesizes each scene separately, pads each segment to the shot-list duration, and writes `AgentGuard-CI-Splunk-Voiceover-en.wav` so the recorder can mux audio without narration drift.

Record only after the local web app is running at `http://localhost:5190`:

```bash
npm run video:record:splunk
```

The recorder only navigates product presentation URLs. It should not open local Markdown, terminal proof sheets, private account pages, or form pages.

Verify the exported MP4 before upload:

```bash
npm run video:check:splunk
```

This gate checks the MP4 duration, audio stream, minimum resolution, seven-scene product route list, scene-aligned audio manifest, and clean judge-facing narration text. Keep it separate from `npm run splunk:check`; video recording needs a running local web app, while the submission packet check should remain clone-friendly.

## Narration Rules

- Speak to judges, not to internal developers.
- Do not say "in the Splunk hackathon scene" or similar meta phrasing.
- Do not mention features that are not present in the repo.
- Keep the language product-focused and concrete.
- Every metric mentioned in the voiceover must match the current local evidence.
- When a route is named in the narration, the deep-linked page should already be on that route before speaking about it.
- Audio must be generated from `shot-list.json`, not from the human review Markdown, so scene labels are never spoken.

## Minimum Truth Standard

- Code-repair summary must match `agentguard-runs/suite-summary.json`.
- Agent-adapter summary must match `agentguard-runs/agent-adapters/agent-adapter-suite-summary.json`.
- Splunk install smoke report must show `missingFiles: []`, `savedSearchCount >= 4`, and `payloadFormat: "json"`.
- If the suite changes, update this plan and the narration before recording.
