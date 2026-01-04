const testId = new URLSearchParams(location.search).get("test");
const test = data[0][testId - 1];

const orderedKeys = Object.keys(test.otazky); // poradie z JSONu
let pointer = 0;
let unanswered = [];
let locked = false;
let stats = null;

async function loadStats() {
  const all = await getStats();
  stats = all[testId] || { correct: 0, errors: 0, correctQuestions: [] };

  // unanswered = všetky otázky mínus correctQuestions
  unanswered = orderedKeys.filter((k) => !stats.correctQuestions.includes(k));
}

function updateHeader() {
  document.getElementById(
    "headerLeft"
  ).innerHTML = `<p>Test č. ${testId} | <span style="color: #a9fbc4">${stats.correct} / 40 </span>| <span style="color: #ff9090">${stats.errors}</span></p>`;
}

function renderImage(src) {
  const img = document.getElementById("questionImage");
  if (src) {
    img.src = src;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }
}

function getNextKey() {
  while (pointer < orderedKeys.length) {
    const k = orderedKeys[pointer++];
    if (unanswered.includes(k)) return k;
  }
  return null;
}

async function nextQuestion() {
  locked = false;

  if (stats.correctQuestions.length === 40) {
    document.getElementById("question").textContent =
      "Všetky otázky sú zvládnuté ✓";
    document.getElementById("answers").innerHTML = "";
    document.getElementById("questionImage").style.display = "none";
    updateHeader();
    return;
  }

  const key = getNextKey();
  if (!key) {
    // prejdeme znova od začiatku (pre prípad chýb)
    pointer = 0;
    return nextQuestion();
  }

  const q = test.otazky[key][0];
  const answers = test.odpovede[key];

  document.getElementById("question").textContent = q.text;
  renderImage(q.obrazok);

  const a = document.getElementById("answers");
  a.innerHTML = "";

  answers.forEach((ans, i) => {
    const d = document.createElement("div");
    d.className = "answer";
    d.textContent = ans.odpoved;

    d.onmousedown = async () => {
      if (locked) return;
      locked = true;

      const all = document.querySelectorAll(".answer");
      all[q.platna - 1].classList.add("correct");

      if (i === q.platna - 1) {
        d.classList.add("correct");
        unanswered = unanswered.filter((k) => k !== key);
        stats = await markCorrect(testId, key).then((r) => r.json());
      } else {
        d.classList.add("wrong");
        stats = await markError(testId).then((r) => r.json());
      }

      updateHeader();
    };

    d.onmouseup = () => {
      if (locked) setTimeout(nextQuestion, 250);
    };

    a.appendChild(d);
  });
}

document.getElementById("resetBtn").onclick = async () => {
  await resetTest(testId);
  location.reload();
};

(async () => {
  await loadStats();
  updateHeader();
  nextQuestion();
})();
