# AgentGuard CI for Splunk

This companion app turns Splunk alert payloads, saved searches, and AI-generated SPL into AgentGuard review envelopes.

## Included assets

- `default/savedsearches.conf`: review queue reports and a scheduled suppression-gate alert.
- `default/alert_actions.conf`: custom alert action that writes an AgentGuard review envelope.
- `default/data/ui/views/agentguard_overview.xml`: dashboard for review queues and evidence coverage.
- `lookups/agentguard_ci_soc_demo.csv`: demo lookup so the dashboard renders immediately.
- `bin/agentguard_review_gate.py`: Python action that emits a structured JSON artifact.

## How it fits the product

1. Splunk MCP Server or AI Assistant generates investigation context.
2. Saved searches or notable-event flows invoke `agentguard_review_gate`.
3. The custom action writes a JSON envelope that AgentGuard CI can inspect, review, and archive.
4. High-risk changes stay blocked until named evidence and approval are present.
