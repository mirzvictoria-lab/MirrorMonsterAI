import fs from "node:fs";
import { type Server } from "node:http";
import path from "node:path";

import express, { type Express } from "express";

import runApp from "./app";

export async function serveStatic(app: Express, server: Server) {
  // Correct path to the built client
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Serve static assets
  app.use(express.static(distPath));

  // Must use app.get("*") instead of app.get("/*")
  // Express resolves "*" correctly and avoids "headersSent" issues
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

(async () => {
  await runApp(serveStatic);
})();
