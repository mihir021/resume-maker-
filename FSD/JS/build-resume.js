const $ = id => document.getElementById(id);

/* ---------- LOAD TEMPLATE ---------- */
fetch("../templates/template-academic-yellow/template.html")
  .then(res => res.text())
  .then(html => {
    $("resumePreview").innerHTML = html;

    loadHeader();
    loadSidebar();
    loadExperience();
    loadEducation();
    loadSkills();
  });

/* ---------- STEP 1 : HEADER ---------- */
function loadHeader() {
  const d = JSON.parse(localStorage.getItem("step1") || "{}");
  setText("previewName", d.name || "Rathod Mihir");
  setText("previewTitle", d.title || "Java Developer");
  setText("previewSummary", d.summary || "");
}

/* ---------- STEP 1 : SIDEBAR ---------- */
function loadSidebar() {
  const d = JSON.parse(localStorage.getItem("step1") || "{}");
  setText("previewPhone", d.phone || "");
  setText("previewEmail", d.email || "");
  setText("previewLocation", d.location || "");
  fillList("pCerts", d.certs || "");
  fillList("pLanguages", d.languages || "");
}

/* ---------- STEP 2 : EXPERIENCE ---------- */
function loadExperience() {
  const list = JSON.parse(localStorage.getItem("experiences") || []);
  const section = $("previewExperienceSection");
  const box = $("previewExperienceList");

  if (!section || !box || !list.length) {
    section && (section.style.display = "none");
    return;
  }

  box.innerHTML = "";
  list.forEach(exp => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${exp.jobTitle} – ${exp.employer}</strong><br>
      <small>${exp.startDate} – ${exp.endDate}</small>
      <ul>
        ${exp.description.split("\n").map(l => `<li>${l}</li>`).join("")}
      </ul>
    `;
    box.appendChild(div);
  });

  section.style.display = "block";
}

/* ---------- STEP 3 : EDUCATION ---------- */
function loadEducation() {
  const d = JSON.parse(localStorage.getItem("education") || {});
  const eduSection = [...document.querySelectorAll(".main-section")]
    .find(s => s.querySelector("h3")?.textContent.includes("EDUCATION"));

  if (!eduSection) return;

  const dateText = d.current
    ? `Expected ${formatMonth(d.month)}`
    : formatMonth(d.month);

  eduSection.innerHTML = `
    <h3>EDUCATION</h3>
    <p><strong>${d.degree} in ${d.field}</strong></p>
    <p>${d.school} | ${d.location}</p>
    <p><em>${dateText}</em></p>
  `;
}

/* ---------- STEP 4 : SKILLS ---------- */
function loadSkills() {
  const list = JSON.parse(localStorage.getItem("skills") || []);
  const section = [...document.querySelectorAll(".main-section")]
    .find(s => s.querySelector("h3")?.textContent.includes("SKILLS"));

  if (!section || !list.length) return;

  const half = Math.ceil(list.length / 2);
  section.innerHTML = `
    <h3>SKILLS</h3>
    <div class="skills-grid">
      <ul>${list.slice(0, half).map(s => `<li>${s}</li>`).join("")}</ul>
      <ul>${list.slice(half).map(s => `<li>${s}</li>`).join("")}</ul>
    </div>
  `;
}

/* ---------- DOWNLOAD ---------- */
function downloadPDF() {
  const oldTitle = document.title;
  document.title = "Resume";
  window.print();
  setTimeout(() => document.title = oldTitle, 500);
}

/* ---------- HELPERS ---------- */
function setText(id, val) {
  const el = $(id);
  if (el) el.textContent = val;
}

function fillList(id, text) {
  const ul = $(id);
  if (!ul) return;
  ul.innerHTML = "";
  text.split("\n").forEach(line => {
    if (line.trim()) {
      const li = document.createElement("li");
      li.textContent = line.trim();
      ul.appendChild(li);
    }
  });
}

function formatMonth(val) {
  if (!val) return "";
  const d = new Date(val);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
