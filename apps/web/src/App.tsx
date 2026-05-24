import { formatIssueLabel, priorityTone, summarizeIssue, type IssueSummary } from "./issueModel.js";

const sampleIssues: IssueSummary[] = [
  {
    id: "ISSUE-0001",
    title: "Production login is down",
    priority: "high",
    status: "open"
  },
  {
    id: "ISSUE-0002",
    title: "Auth token leak in callback flow",
    priority: "critical",
    status: "triaged"
  },
  {
    id: "ISSUE-0003",
    title: "Settings copy typo",
    priority: "low",
    status: "resolved"
  }
];

export function App() {
  return (
    <main style={styles.shell}>
      <section style={styles.header}>
        <p style={styles.kicker}>AgentGuard CI demo target</p>
        <h1 style={styles.title}>Issue Tracker</h1>
        <p style={styles.subtitle}>
          A small full-stack app with realistic CI failure surfaces for testing code-fixing agent reliability.
        </p>
      </section>
      <section style={styles.grid} aria-label="Issue list">
        {sampleIssues.map((issue) => (
          <article key={issue.id} style={{ ...styles.card, borderColor: toneColor(priorityTone(issue.priority)) }}>
            <div style={styles.cardHeader}>
              <strong>{formatIssueLabel(issue)}</strong>
              <span style={{ ...styles.badge, background: toneColor(priorityTone(issue.priority)) }}>
                {issue.status}
              </span>
            </div>
            <p style={styles.summary}>{summarizeIssue(issue)}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function toneColor(tone: ReturnType<typeof priorityTone>): string {
  const colors = {
    quiet: "#6b7280",
    neutral: "#2563eb",
    warning: "#d97706",
    danger: "#dc2626"
  };
  return colors[tone];
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    margin: "0 auto",
    maxWidth: 960,
    padding: "48px 24px",
    color: "#172033"
  },
  header: {
    marginBottom: 32
  },
  kicker: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0,
    margin: "0 0 8px"
  },
  title: {
    fontSize: 44,
    letterSpacing: 0,
    lineHeight: 1.05,
    margin: 0
  },
  subtitle: {
    color: "#4b5563",
    fontSize: 17,
    lineHeight: 1.55,
    maxWidth: 680
  },
  grid: {
    display: "grid",
    gap: 16
  },
  card: {
    border: "1px solid",
    borderRadius: 8,
    padding: 18,
    background: "#ffffff",
    boxShadow: "0 10px 28px rgba(23, 32, 51, 0.08)"
  },
  cardHeader: {
    alignItems: "center",
    display: "flex",
    gap: 12,
    justifyContent: "space-between"
  },
  badge: {
    borderRadius: 999,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 700,
    padding: "5px 9px",
    textTransform: "uppercase"
  },
  summary: {
    color: "#4b5563",
    marginBottom: 0
  }
};

