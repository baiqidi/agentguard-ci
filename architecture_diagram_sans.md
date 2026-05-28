# AgentGuard IR SANS FIND EVIL Architecture Diagram

This root-level architecture diagram is the SANS FIND EVIL view of AgentGuard IR.

```mermaid
flowchart LR
    subgraph Evidence["Evidence sources"]
        Disk["Disk image / bodyfile timeline"]
        Registry["Registry hive export"]
        Auth["Authentication logs"]
        Pcap["Network capture / flow index"]
        WinEvent["Windows Security Events"]
        Memory["Memory process tree"]
    end

    subgraph SIFT["SANS SIFT Workstation"]
        Tools["fls, mactime, rip.pl, grep, awk, tshark, wevtutil, vol.py"]
        MCP["Protocol SIFT MCP tool envelope"]
        Agent["Claude Code / agentic IR runner"]
    end

    subgraph Guard["AgentGuard IR"]
        Gate["Reliability gates\nself-correction + evidence integrity + approval"]
        Accuracy["Accuracy report\nconfirmed / rejected / inferred"]
        Logs["Agent execution logs\ntimestamps + tool calls + token usage"]
        Narrative["Investigative narrative\nanalyst-readable"]
        Review["Human approval queue\npromote / review / block"]
    end

    Repo["Public GitHub repository\nMIT license + setup + fixtures"]
    Judge["FIND EVIL judges"]

    Disk --> Tools
    Registry --> Tools
    Auth --> Tools
    Pcap --> Tools
    WinEvent --> Tools
    Memory --> Tools
    Tools --> MCP
    MCP --> Agent
    Agent --> Gate
    Gate --> Accuracy
    Gate --> Logs
    Gate --> Narrative
    Gate --> Review
    Accuracy --> Repo
    Logs --> Repo
    Narrative --> Repo
    Review --> Repo
    Repo --> Judge
```

## How It Works

1. Evidence sources enter a SIFT-compatible analysis path: disk timeline, registry export, authentication log, network flow index, Windows Security Events, and memory process tree.
2. The agentic runner uses a Protocol SIFT-style tool envelope so every tool call can be logged and replayed.
3. AgentGuard checks whether the agent corrected weak claims, preserved artifact locators, separated confirmed facts from inference, and avoided unsafe containment.
4. The output pipeline writes `agent-execution-log.jsonl`, `accuracy-report.json`, `evidence-dataset.md`, `investigative-narrative.md`, `judge-evidence-summary.md`, and SANS-mode `sift-ir-evidence.json` packets.
5. Judges can run `npm run sans:check` to regenerate and validate the evidence bundle locally.

## FIND EVIL Fit

- **Autonomous execution:** tool-call log plus self-correction event.
- **IR accuracy:** confirmed, rejected, and inferred findings with exact artifact locators.
- **Breadth and depth:** disk persistence, authentication-log accuracy, containment approval, Windows Event Log lateral movement, and memory process tree review routes.
- **Audit trail quality:** timestamped execution log with token usage and replayable evidence paths.
- **Usability:** public MIT repository, safe fixtures, and one-command verification.
