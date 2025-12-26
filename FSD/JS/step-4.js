const $ = id => document.getElementById(id);

/* ---------- STEP-1 PLACEHOLDER FALLBACKS ---------- */
const FALLBACK = {
  name: "Rathod Mihir",
  title: "Java Developer",
  summary:
    "Motivated software developer with strong fundamentals in Java and problem-solving skills.",
  languages: "English\nHindi",
  certs: "Google Data Analytics\nAdvanced Excel"
};

/* ---------- LOAD TEMPLATE ---------- */
fetch("../templates/template-academic-yellow/template.html")
  .then(res => res.text())
  .then(html => {
    $("resumePreview").innerHTML = html;
    loadHeader();
    loadExperience();
    loadEducation();
    loadSkills();
  });

/* ---------- STEP 1 : HEADER ---------- */
function loadHeader() {
  const d = JSON.parse(localStorage.getItem("step1") || "{}");

  setText("previewName", d.name || FALLBACK.name);
  setText("previewTitle", d.title || FALLBACK.title);
  setText("previewSummary", d.summary || FALLBACK.summary);

  fillList("pLanguages", d.languages || FALLBACK.languages);
  fillList("pCerts", d.certs || FALLBACK.certs);
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
        ${exp.description
          .split("\n")
          .filter(Boolean)
          .map(l => `<li>${l}</li>`)
          .join("")}
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
    .find(s => s.querySelector("h3")?.textContent.toUpperCase().includes("EDUCATION"));

  if (!eduSection) return;

  const dateText = d.current
    ? `Expected ${formatMonth(d.month)}`
    : formatMonth(d.month);

  eduSection.innerHTML = `
    <h3>EDUCATION AND TRAINING</h3>
    <p><strong>${d.school || "XYZ University"} | ${d.location || "Ahmedabad, India"}</strong></p>
    <p>${d.degree || "B.Tech in Computer Science"}</p>
    <p><em>${dateText}</em></p>
  `;
}

/* ---------- STEP 4 : SKILLS ---------- */
function loadSkills() {
  const skills = JSON.parse(localStorage.getItem("skills") || []);
  $("skillsEditor").value = skills.join("\n");
  renderSkills(skills);
}

/* ---------- SKILL BUTTONS ---------- */
document.querySelectorAll("[data-skill]").forEach(btn => {
  btn.addEventListener("click", () => {
    const skill = btn.dataset.skill;
    const list = getSkills();

    if (!list.includes(skill)) {
      list.push(skill);
      $("skillsEditor").value = list.join("\n");
      saveSkills(list);
    }
  });
});

/* ---------- LIVE TEXTAREA ---------- */
$("skillsEditor").addEventListener("input", () => {
  saveSkills(getSkills());
});

/* ---------- STORAGE ---------- */
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

/* ---------- RENDER SKILLS ---------- */
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

/* ---------- HELPERS ---------- */
function setText(id, val) {
  const el = $(id);
  if (el) el.textContent = val;
}

function fillList(id, text) {
  const ul = $(id);
  if (!ul || !text) return;
  ul.innerHTML = text.split("\n").map(l => `<li>${l}</li>`).join("");
}

function formatMonth(val) {
  if (!val) return "";
  const d = new Date(val);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function finishResume() {
  alert("Resume completed successfully!");
}
function goToStep5() {
  window.location.href = "build-resume.html";
}