# SANS Fixture Case 001

This fixture is a small, deterministic incident-response dataset for the AgentGuard FIND EVIL runner.

It is not a real victim image. It is a safe local evidence bundle designed to prove the control loop:

- timeline correlation
- registry persistence validation
- authentication-log accuracy checks
- agent self-correction
- artifact-level claim traceability

On a SANS SIFT Workstation, the same runner contract can be mapped to real `fls`, `mactime`, `rip.pl`, `grep`, `awk`, `tshark`, and MCP-mediated tool calls.
