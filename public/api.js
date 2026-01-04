async function getStats() {
  return fetch("/api/stats").then((r) => r.json());
}

async function markCorrect(testId, questionKey) {
  return fetch("/api/correct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ testId, questionKey }),
  });
}

async function markError(testId) {
  return fetch("/api/error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ testId }),
  });
}

async function resetTest(testId) {
  return fetch("/api/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ testId }),
  });
}
