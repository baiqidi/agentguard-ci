# Splunk Significant Updates During Submission Period

Splunk's rules require existing projects to be significantly updated after the submission period begins on **May 18, 2026 at 9:00 AM PDT**.

Use the following note in the submission form or README variant:

## Significant Updates Since May 18, 2026

This project builds on the existing AgentGuard CI core, but the Splunk submission adds substantial new work during the Splunk Agentic Ops Hackathon submission period:

1. **Contest-aware product mode**
   - Added `contest=splunk` support in the web dashboard.
   - Added Splunk-specific track labeling, platform naming, and evidence artifact naming.

2. **Splunk evidence adaptation**
   - Added contest-aware reporting so the product emits `splunk-mcp-evidence.json`.
   - Updated evidence payloads to identify `Splunk MCP Server` as the target platform.
   - Expanded the live-local suite to 14 enterprise scenarios, including 3 dedicated Splunk-style SOC routes.

3. **Hackathon-specific architecture and repository packaging**
   - Added root `architecture_diagram.md` describing Splunk interaction, AI integration, and service-to-service data flow.
   - Added Splunk-specific submission copy, positioning, validation checks, and a real Splunk companion app package.

4. **Submission-readiness verification**
   - Added a Splunk-specific repository verifier to catch missing submission assets before final submission.
   - Added a companion-app verifier that packages Splunk assets, executes the custom alert action locally, and checks the resulting review envelope.

5. **Security-track framing**
   - Repositioned the product around SOC and agentic security operations, not only code-repair reliability.
   - Added Splunk MCP and Splunk AI Assistant tool surfaces to the public framework contract checks.
   - Added Splunk AppInspect and Splunk Packaging Toolkit as deployment-validated surfaces in CI.

## Why These Updates Are Significant

These changes are not cosmetic renaming. They alter the repository structure, evidence outputs, review flow, and submission assets so the project can be judged as a Splunk-specific security solution with a clear MCP-centered architecture.

## Supporting Files

- `architecture_diagram.md`
- `docs/hackathons/splunk-agentic-ops-pack.md`
- `docs/submission/splunk-submission-copy.md`
- `scripts/verify-splunk-submission.mjs`
- `scripts/verify-splunk-companion-app.mjs`
- `splunk-apps/agentguard_ci_for_splunk/`
