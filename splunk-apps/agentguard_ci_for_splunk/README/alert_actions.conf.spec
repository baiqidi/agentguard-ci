[agentguard_review_gate]
* label = Friendly name shown in Splunk Web.
* payload_format = json so the custom action receives structured alert payloads.
* alert.execute.cmd = Python entry point shipped with the app.
* param.review_owner = Named review queue owner inside AgentGuard CI.
* param.risk_label = Human-readable risk bucket for the downstream report.
* param.required_evidence = Comma-delimited proof that must exist before the action can be promoted.
* param.output_path = Target file written by the custom action when the review envelope is generated.
