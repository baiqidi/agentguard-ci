# Tencent Demo Video Runbook

This runbook prepares the 3-5 minute Tencent Cloud Hackathon usage video without recording it immediately.

## Current Rule

Do not record yet. First make sure the evidence, frontend, script, and upload plan are ready.

## Prepared Evidence

- `npm test`: 42 test files, 180 tests passed.
- `npm run build`: all workspaces built successfully.
- `npm run agentguard:suite`: 24 code-repair scenarios, 106/131 risk points blocked.
- `npm run agentguard:agent-suite`: 14 live-local enterprise agent scenarios.
- `npm run submission:check`: 28 submission readiness checks passed.

## Local App

Use the current workspace, not the old D-drive copy:

```bash
npm run dev -w @agentguard/web -- --host localhost --port 5190
```

Recording URL:

```text
http://localhost:5190/?lang=zh
```

## Preparation Command

This creates the shot list, Chinese narration, proof sheet, and asset manifest. It does not record.

```bash
npm run video:prep:tencent
```

Prepared files are written to:

```text
agentguard-runs/tencent-demo-video/
```

## Voiceover Preparation

The default Chinese narration is generated with a natural neural voice through `edge-tts` (`zh-CN-XiaoxiaoNeural`). Piper remains available as a fully local open-source fallback. Both paths produce audio only; neither records the screen.

Prepare text-only voiceover assets:

```bash
npm run video:audio:prep:tencent
```

Generate the local WAV narration:

```bash
npm run video:audio:tencent
```

Generate the offline Piper fallback if the online voice is unavailable:

```bash
npm run video:audio:piper:tencent
```

Expected audio output:

```text
agentguard-runs/tencent-demo-video/AgentGuard-CI-Tencent-Voiceover-zh.wav
```

## Future Recording Command

Run this only when we are ready to produce the final MP4:

```bash
npm run video:record:tencent
```

If `AgentGuard-CI-Tencent-Voiceover-zh.wav` exists, the recording script automatically mixes it into the final MP4 and distributes screen timing from the prepared shot list.

Expected output:

```text
agentguard-runs/tencent-demo-video/AgentGuard-CI-Tencent-Demo.mp4
```

## Upload Checklist

- Duration: 3-5 minutes.
- Format: MP4.
- No email inboxes, account keys, tokens, SSH keys, console credentials, or personal messages visible.
- Show the product UI, Tencent positioning, real command evidence, suite summaries, enterprise-agent scenario coverage, submission assets, and GitHub URL.
- If no hosted Demo URL is available, state that local and GitHub evidence are the review path.
- Voiceover can be mixed into the final MP4 after recording; the current prep command only creates the WAV narration.
