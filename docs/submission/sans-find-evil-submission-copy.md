# SANS FIND EVIL Devpost Copy

## Project Name

AgentGuard IR

## Tagline

Stop autonomous IR agents from overstating evidence, losing traceability, or containing systems without approval.

## Inspiration

Autonomous incident response only helps defenders if it stays honest under pressure. A fast agent that deletes evidence, overclaims compromise, or isolates the wrong endpoint can make an incident worse. AgentGuard IR was built around one question: before an IR agent is allowed to act, can we prove that its findings are traceable, corrected, and safe?

## What It Does

AgentGuard IR is a reliability gate for Protocol SIFT-style incident-response agents. It runs SIFT-compatible investigation scenarios and scores the agent across five gates:

- goal fidelity
- tool boundary
- evidence integrity
- state safety
- human approval

For FIND EVIL, the product focuses on three IR routes:

- disk persistence investigation with self-correction
- authentication-log accuracy validation
- containment approval before endpoint isolation

The output is not a marketing summary. The runner generates a terminal-style execution log, an accuracy report, evidence dataset documentation, and an investigative narrative. Each finding is labeled as confirmed, rejected, or inferred and points to a file, offset, log entry, or flow id.

## How I Built It

The core is TypeScript with Vitest, a React/Vite dashboard, and Node.js evidence runners. The SANS edition adds:

- `scripts/run-sans-sift-ir-demo.mjs` for local SIFT-compatible evidence replay
- `sans-fixtures/case-001/` as a safe deterministic evidence bundle
- SANS-mode evidence packets using `targetPlatform: "SANS SIFT Workstation + Protocol SIFT MCP"`
- a dashboard mode at `?contest=sans`
- an architecture diagram and judge readiness checklist

The local runner is honest about environment. If SIFT binaries are not installed, it records `fixture-local` mode and still preserves the same command and artifact locator contract. On a SANS SIFT Workstation, the same flow can map to real `fls`, `mactime`, `rip.pl`, `grep`, `awk`, `tshark`, and Protocol SIFT MCP calls.

## Challenges I Ran Into

The hard part was not creating another agent. The hard part was proving that the agent should be trusted. I had to separate confirmed facts from inference, preserve exact evidence locators, and make self-correction visible instead of hiding it in the final answer.

Another challenge was keeping the submission truthful. The local demo must work without requiring judges to provision private credentials, but it also needs a credible path to SIFT. The fixture runner solves this by generating real local artifacts while documenting how the command contract maps to SIFT tools.

## Accomplishments That I Am Proud Of

- Three FIND EVIL-specific incident-response scenarios.
- A visible self-correction sequence.
- Artifact-level accuracy validation with confirmed, rejected, and inferred findings.
- A one-command local verification path: `npm run sans:check`.
- A SANS-specific dashboard mode and architecture diagram.
- Public MIT-licensed repository with safe replay fixtures.

## What I Learned

Autonomous response is not just an intelligence problem. It is an evidence discipline problem. If an agent cannot show what produced a finding, cannot correct weak claims, or cannot wait for approval before state-changing action, it is not ready for real incident response.

## What's Next

The next step is to run the same contract against full SANS SIFT case data and Protocol SIFT MCP endpoints, expand the fixture library to disk images, memory captures, and packet captures, and compare multiple agentic frameworks under the same reliability gates.

## Built With

TypeScript, React, Vite, Node.js, Vitest, Protocol SIFT-style tool envelope, SANS SIFT-compatible command contract.

## Try It Out

```bash
npm install
npm run sans:check
npm run dev -w @agentguard/web
```

Open:

```text
http://localhost:5173/?contest=sans
```
