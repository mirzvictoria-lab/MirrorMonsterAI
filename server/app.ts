import express from "express";
import path from "path";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Resolve root directory for serving frontend
const __dirname = path.resolve();

// =============================
// SERVE FRONTEND (React build)
// =============================

// Serve static files from the client/dist folder
app.use(express.static(path.join(__dirname, "../client/dist")));


// =============================
// API ROUTES
// =============================

// Example route — keep your real routes here
app.get("/api/hello", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Add ALL your existing API routes below this line
// (Do NOT remove, replace, or move your real API code)
// ----------------------------------------------------
// For example:
// app.post("/api/chat", yourChatHandler);
// app.get("/api/sentiment", yourSentimentHandler);
// etc.
// ----------------------------------------------------


// =============================
// REACT ROUTING FALLBACK
// =============================
// This allows React Router to work on Render.
// Any route NOT starting with /api will load index.html.

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});


// =============================
// SERVER START
// =============================

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
