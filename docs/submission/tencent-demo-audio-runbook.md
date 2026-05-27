# Tencent Demo Audio Runbook

This prepares Chinese narration for the Tencent Cloud Hackathon usage video. It creates narration assets only and does not start screen recording.

## Tooling

- Primary natural TTS: `edge-tts` using `zh-CN-XiaoxiaoNeural` at `+8%` rate.
- Offline fallback TTS: Piper, an open-source local speech synthesis engine.
- Piper voice model: `zh_CN-huayan-medium` from Piper voices.
- Local tool path: `tools/piper/`.
- Generated assets path: `agentguard-runs/tencent-demo-video/`.

## Commands

Prepare the Tencent shot list and narration source:

```bash
npm run video:prep:tencent
```

Prepare text-only audio assets:

```bash
npm run video:audio:prep:tencent
```

Generate the natural Chinese WAV narration for the final competition video:

```bash
npm run video:audio:tencent
```

Generate the fully local Piper fallback:

```bash
npm run video:audio:piper:tencent
```

## Outputs

- `agentguard-runs/tencent-demo-video/voiceover-zh.txt` - pure spoken narration only; no scene labels.
- `agentguard-runs/tencent-demo-video/voiceover-review-zh.md` - human review copy with timing and scene labels.
- `agentguard-runs/tencent-demo-video/voiceover-segments.json`
- `agentguard-runs/tencent-demo-video/audio-manifest.json`
- `agentguard-runs/tencent-demo-video/AgentGuard-CI-Tencent-Voiceover-zh.wav`
- `agentguard-runs/tencent-demo-video/AgentGuard-CI-Tencent-Voiceover-natural-zh.mp3`
- `agentguard-runs/tencent-demo-video/AgentGuard-CI-Tencent-Voiceover-natural-zh.vtt`
- `agentguard-runs/tencent-demo-video/AgentGuard-CI-Tencent-Voiceover-piper-zh.wav`

## Recording Policy

Do not run `npm run video:record:tencent` until the final video recording is explicitly started. The audio file can be mixed into the final MP4 after recording the screen.

## Quality Checks

- The narration must describe the Tencent Cloud AI agent competition angle, not only the UiPath Test Cloud angle.
- The natural version should be preferred for the submitted MP4 because it sounds less mechanical.
- Piper remains the reproducible offline fallback if online neural TTS is unavailable.
- The audio must be under 5 minutes after final video editing.
- No personal account pages, emails, SSH keys, tokens, or Tencent account credentials should appear in the recorded screen.
