/* ================== SHORTCUT ================== */
const $ = id => document.getElementById(id);

const TEMPLATES = {
  academicYellow: {
    css: "../templates/template-academic-yellow/style.css",
    html: "../templates/template-academic-yellow/template.html"
  },
  professionalBlue: { // template 2
    css: "../templates/template-clean-profile/style.css",
    html: "../templates/template-clean-profile/template.html"
  },
  minimalElegant: { // template 3
    css: "../templates/template-modern-clean/style.css",
    html: "../templates/template-modern-clean/template.html"
  }
};


/* ================== SELECTED TEMPLATE ================== */
const selectedTemplate =
  localStorage.getItem("selectedTemplate") || "academicYellow";

/* ================== LOAD TEMPLATE CSS ================== */
(function loadTemplateCSS() {
  if (document.getElementById("template-style")) return;

  const link = document.createElement("link");
  link.id = "template-style";
  link.rel = "stylesheet";
  link.href = TEMPLATES[selectedTemplate].css;
  document.head.appendChild(link);
})();

/* ================== LOAD TEMPLATE HTML ================== */
fetch(TEMPLATES[selectedTemplate].html)
  .then(res => res.text())
  .then(html => {
    $("resumePreview").innerHTML = html;
    loadHeader();
    loadExperience();
    loadEducation();
    loadSkills();
  });

/* ================== HEADER ================== */
function loadHeader() {
  const d = JSON.parse(localStorage.getItem("step1") || "{}");

  setText("previewName", d.name || "Rathod Mihir");
  setText("previewTitle", d.title || "Java Developer");
  setText("previewSummary", d.summary);

  fillList("pLanguages", d.languages || "English\nHindi");
  fillList("pCerts", d.certs || "Google Data Analytics\nAdvanced Excel");
}

/* ================== EXPERIENCE ================== */
function loadExperience() {
  const list = JSON.parse(localStorage.getItem("experiences") || "[]");
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
      <ul>${exp.description.split("\n").map(l => `<li>${l}</li>`).join("")}</ul>
    `;
    box.appendChild(div);
  });

  section.style.display = "block";
}

/* ================== EDUCATION ================== */
function loadEducation() {
  const d = JSON.parse(localStorage.getItem("education") || {});
  const section = [...document.querySelectorAll(".main-section")]
    .find(s => s.querySelector("h3")?.textContent.toUpperCase().includes("EDUCATION"));

  if (!section) return;

  const dateText = d.current
    ? `Expected ${formatMonth(d.month)}`
    : formatMonth(d.month);

  section.innerHTML = `
    <h3>EDUCATION</h3>
    <p><strong>${d.degree} in ${d.field}</strong></p>
    <p>${d.school} | ${d.location}</p>
    <p><em>${dateText}</em></p>
  `;
}

/* ================== SKILLS ================== */
function loadSkills() {
  const skills = JSON.parse(localStorage.getItem("skills") || []);
  $("skillsEditor").value = skills.join("\n");
  renderSkills(skills);
}

/* SKILL BUTTONS */
document.querySelectorAll("[data-skill]").forEach(btn => {
  btn.addEventListener("click", () => {
    const list = getSkills();
    if (!list.includes(btn.dataset.skill)) {
      list.push(btn.dataset.skill);
      saveSkills(list);
    }
  });
});

/* LIVE TEXTAREA */
$("skillsEditor").addEventListener("input", () => {
  saveSkills(getSkills());
});

/* STORAGE */
function getSkills() {
  return $("skillsEditor").value
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);
}

function saveSkills(list) {
  localStorage.setItem("skills", JSON.stringify(list));
  renderSkills(list);
}

/* RENDER SKILLS */
function renderSkills(list) {
  const section = [...document.querySelectorAll(".main-section")]
    .find(s => s.querySelector("h3")?.textContent.toUpperCase().includes("SKILLS"));

  if (!section) return;

  const half = Math.ceil(list.length / 2);

  section.innerHTML = `
    <h3>SKILLS</h3>
    <div class="skills-grid">
      <ul>${list.slice(0, half).map(s => `<li>${s}</li>`).join("")}</ul>
      <ul>${list.slice(half).map(s => `<li>${s}</li>`).join("")}</ul>
    </div>
  `;
}

/* ================== HELPERS ================== */
function setText(id, val) {
  const el = $(id);
  if (el) el.textContent = val;
}

function fillList(id, text) {
  const ul = $(id);
  if (!ul || !text) return;
  ul.innerHTML = text.split("\n").map(l => `<li>${l}</li>`).join("");
}

function formatMonth(v) {
  if (!v) return "";
  return new Date(v).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/* ================== FINISH ================== */
function goToStep5() {
  window.location.href = "build-resume.html";
}
