import { createApp } from "./app.js";
import { createIssueStore } from "./issues.js";

const port = Number(process.env.PORT ?? 4300);
const app = createApp(createIssueStore());

app.listen(port, () => {
  console.log(`AgentGuard Issue Tracker API listening on http://localhost:${port}`);
});

