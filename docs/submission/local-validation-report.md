# Local Validation Report

Date: 2026-05-25

Branch at preparation time: `codex/no-labs-submission-pack`

Public repository: `https://github.com/baiqidi/agentguard-ci`

## Validation Commands

Run these commands from the repository root:

```bash
npm install
npm test
npm run build
npm run agentguard:suite
npm run agentguard:agent-suite
npm run submission:check
```

## Latest Known Local Results

| Check | Expected result |
| --- | --- |
| Unit and model tests | 83 tests pass |
| Build | All workspaces build |
| Code-repair reliability suite | 24 scenarios execute |
| Code-repair gate summary | 7 auto-promote, 17 review/block, 73% gate pass rate |
| Risk summary | 106/131 risk points stopped, 5 critical findings |
| Enterprise adapter suite | 12 live-local scenarios execute |
| Enterprise adapter gate summary | 12 review/block findings, 39/60 gates pass, 65% gate pass rate |
| Public framework checks | 8 contract-verified checks, 0 hosted credential claims |
| Submission readiness | 28 checks pass for required repository, docs, license, scripts, and evidence files |

## Generated Evidence Paths

| Evidence | Path |
| --- | --- |
| Code-repair Markdown summary | `agentguard-runs/suite-summary.md` |
| Code-repair JSON summary | `agentguard-runs/suite-summary.json` |
| Enterprise adapter Markdown summary | `agentguard-runs/agent-adapters/agent-adapter-suite-summary.md` |
| Enterprise adapter JSON summary | `agentguard-runs/agent-adapters/agent-adapter-suite-summary.json` |
| Test Cloud import map | `uipath/test-cloud-import.csv` |
| Test Cloud case matrix | `uipath/test-cloud-matrix.md` |
| Studio Web runbook | `uipath/studio-web-runbook.md` |

## Browser Demo Check

The web dashboard can be run with:

```bash
npm run dev -w @agentguard/web
```

The rendered dashboard should show:

- 13 validated agent profiles.
- 12 live-local enterprise adapters.
- 12 live-local scenarios.
- Operator runbook command `npm run agentguard:agent-suite`.
- English/Chinese language switching.
- No browser console warning or error during the smoke check.

A local screen-recording preview can be generated from the running dashboard with Playwright or any screen recorder, then uploaded publicly for Devpost. The production shot list is in `docs/submission/demo-video-production-plan.md`.

## GitHub Actions Check

The repository workflow `.github/workflows/agentguard-evidence.yml` runs:

1. `npm ci`
2. `npm test`
3. `npm run build`
4. `npm run agentguard:suite`
5. `npm run agentguard:agent-suite`
6. Upload of `agentguard-runs/`

After this submission pack, the workflow should also run `npm run submission:check` after both evidence suites.
