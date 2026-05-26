# Multi-Hackathon Pack Design

## Goal

Create a reusable submission pack that lets AgentGuard CI target multiple hackathons without fragmenting the product. The pack should rank contests by eligibility, fit, deadline pressure, and adaptation cost, then provide ready-to-use positioning for each realistic target.

## Design Summary

AgentGuard remains one product: an agent reliability firewall that tests whether autonomous actions are safe enough to approve. Each hackathon wrapper changes the story and demo emphasis, not the core architecture.

The pack uses three tiers:

- **Primary:** UiPath AgentHack remains the main submission because the product was built for Test Cloud governance.
- **Active alternates:** SANS Find Evil, Tencent Cloud AI Agent, Hack-Nation Global AI, and DevNetwork AI + ML are viable targets with different pitch angles.
- **Disqualified or caution:** Google Cloud Rapid Agent is useful for learning, but the public rules exclude residents of China, so it should not be treated as a prize target unless eligibility changes or a qualified teammate leads the submission.

## Files

- `docs/hackathons/targets.json`: machine-readable contest metadata, scores, URLs, and strategy.
- `docs/hackathons/multi-hackathon-strategy.md`: human-facing portfolio strategy and priority order.
- `docs/hackathons/google-rapid-agent-pack.md`: cautionary Google Cloud version with eligibility warning.
- `docs/hackathons/sans-find-evil-pack.md`: incident response positioning.
- `docs/hackathons/tencent-ai-agent-pack.md`: Chinese enterprise AI agent governance positioning.
- `docs/hackathons/devnetwork-ai-ml-pack.md`: fast-track generic AI/ML submission positioning.
- `docs/hackathons/hack-nation-global-ai-pack.md`: startup/venture positioning.
- `scripts/verify-hackathon-pack.mjs`: validates that the pack exists, contains eligibility notes, and has no empty submission fields.
- `package.json`: adds `hackathons:check`.

## Strategy

The pack should not pretend every listed contest is equally good. Each target gets:

- Eligibility status.
- Deadline and urgency.
- Fit score.
- Required adaptation.
- Submission angle.
- Reuse plan from current evidence.
- Gaps before submission.

## Risk Controls

- Do not recommend a contest as a prize target if its rules exclude the user.
- Do not claim hosted integrations that have not been installed.
- Keep the no-Labs UiPath path intact until the Labs URL arrives.
- Use official source URLs wherever possible.
- Keep each wrapper concise enough to paste into a submission form or convert into a README variant.

## Self-Review

- No placeholder fields remain.
- Google Cloud Rapid Agent is not listed as a viable China-resident prize target.
- Each active target has a concrete AgentGuard adaptation angle.
- The pack is verified by a script and included in the repository workflow only if the check is stable.
