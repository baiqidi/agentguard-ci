# SANS Fixture Case 001

This fixture is a small, deterministic incident-response dataset for the AgentGuard FIND EVIL runner.

It is not a real victim image. It is a safe local evidence bundle designed to prove the control loop:

- timeline correlation
- registry persistence validation
- authentication-log accuracy checks
- Windows Event Log lateral movement checks
- memory process tree triage
- agent self-correction
- artifact-level claim traceability

On a SANS SIFT Workstation, the same runner contract can be mapped to real `fls`, `mactime`, `rip.pl`, `grep`, `awk`, `tshark`, `wevtutil`, `vol.py`, and MCP-mediated tool calls.

The local case intentionally covers five DFIR checkpoints: disk persistence, authentication spraying, network containment, Windows Event Log lateral movement, and memory process tree triage.
