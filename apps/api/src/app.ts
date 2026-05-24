import cors from "cors";
import express from "express";
import type { IssueStatus, IssueStore } from "./issues.js";

export function createApp(store: IssueStore) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({ ok: true });
  });

  app.get("/issues", (_request, response) => {
    response.json({ issues: store.list() });
  });

  app.post("/issues", (request, response) => {
    try {
      const issue = store.create(request.body);
      response.status(201).json({ issue });
    } catch (error) {
      response.status(400).json({ error: error instanceof Error ? error.message : "Invalid issue" });
    }
  });

  app.patch("/issues/:id/status", (request, response) => {
    try {
      const issue = store.updateStatus(request.params.id, request.body.status as IssueStatus);
      response.json({ issue });
    } catch (error) {
      response.status(400).json({ error: error instanceof Error ? error.message : "Invalid transition" });
    }
  });

  return app;
}

