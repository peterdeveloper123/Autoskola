const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const STATS_FILE = path.join(__dirname, "stats.json");

app.use(express.json());
app.use(express.static("public"));

function loadStats() {
  if (!fs.existsSync(STATS_FILE)) {
    fs.writeFileSync(STATS_FILE, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(STATS_FILE, "utf8"));
}

function saveStats(stats) {
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

app.get("/api/stats", (req, res) => {
  res.json(loadStats());
});

app.post("/api/correct", (req, res) => {
  const { testId, questionKey } = req.body;
  const stats = loadStats();

  if (!stats[testId]) {
    stats[testId] = { correct: 0, errors: 0, correctQuestions: [] };
  }

  if (!stats[testId].correctQuestions.includes(questionKey)) {
    stats[testId].correctQuestions.push(questionKey);
    stats[testId].correct++;
  }

  saveStats(stats);
  res.json(stats[testId]);
});

app.post("/api/error", (req, res) => {
  const { testId } = req.body;
  const stats = loadStats();

  if (!stats[testId]) {
    stats[testId] = { correct: 0, errors: 0, correctQuestions: [] };
  }

  stats[testId].errors++;
  saveStats(stats);
  res.json(stats[testId]);
});

app.post("/api/reset", (req, res) => {
  const { testId } = req.body;
  const stats = loadStats();
  delete stats[testId];
  saveStats(stats);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Server beží na http://localhost:${PORT}`));
