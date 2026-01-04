(async () => {
  const stats = await getStats();
  const el = document.getElementById("tests");

  data[0].forEach((t, i) => {
    const s = stats[i + 1];
    let text = "Nezačatý";
    let cls = "";

    if (s) {
      if (s.correct === 40) {
        text = "Pripravený";
        cls = "ready";
      } else if (s.errors > 0) {
        text = `Počet chýb: ${s.errors}`;
        cls = "errors";
      } else {
        text = "In progress";
        cls = "progress";
      }
    }

    const d = document.createElement("div");
    d.className = `test ${cls}`;
    d.textContent = `Test ${t.cislo}\n${text}`;
    d.onclick = () => (location.href = `/test.html?test=${i + 1}`);
    el.appendChild(d);
  });
})();
