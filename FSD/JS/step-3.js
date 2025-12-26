const $ = id => document.getElementById(id);

/* ---------- LOAD TEMPLATE ---------- */
fetch("../templates/template-academic-yellow/template.html")
  .then(res => res.text())
  .then(html => {
    $("resumePreview").innerHTML = html;
    loadHeader();
    loadExperience();
    loadEducation();
  });

/* ---------- STEP-1 HEADER ---------- */
function loadHeader() {
  const d = JSON.parse(localStorage.getItem("step1") || "{}");

  setText("previewName", d.name);
  setText("previewTitle", d.title);
  setText("previewEmail", d.email);
  setText("previewPhone", d.phone);
  setText("previewLocation", d.location);
  setText("previewSummary", d.summary);

  fillList("pLanguages", d.languages || "English\nHindi");
  fillList("pCerts", d.certs || "Google Data Analytics\nAdvanced Excel");
}

/* ---------- STEP-2 EXPERIENCE ---------- */
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
      <ul>${exp.description.split("\n").map(l => `<li>${l}</li>`).join("")}</ul>
    `;
    box.appendChild(div);
  });

  section.style.display = "block";
}

/* ---------- STEP-3 EDUCATION ---------- */
function loadEducation() {
  const d = JSON.parse(localStorage.getItem("education") || "{}");

  $("school").value = d.school || "";
  $("eduLocation").value = d.location || "";
  $("degree").value = d.degree || "";
  $("field").value = d.field || "";
  $("gradMonth").value = d.month || "";
  $("currentStudy").checked = d.current || false;
  $("eduDetails").value = (d.details || []).join("\n");

  renderEducation(d);
}

/* ---------- LIVE SAVE ---------- */
document.querySelectorAll("input, textarea").forEach(el => {
  el.addEventListener("input", saveAndRender);
});

function saveAndRender() {
  const data = {
    school: $("school").value,
    location: $("eduLocation").value,
    degree: $("degree").value,
    field: $("field").value,
    month: $("gradMonth").value,
    current: $("currentStudy").checked,
    details: $("eduDetails").value.split("\n").filter(Boolean)
  };

  localStorage.setItem("education", JSON.stringify(data));
  renderEducation(data);
}

/* ---------- RENDER EDUCATION ---------- */
function renderEducation(d) {
  const section = document.querySelector(".main-section h3")
    ?.closest(".main-section");

  if (!section) return;

  const dateText = d.current
    ? `Expected ${formatMonth(d.month)}`
    : formatMonth(d.month);

  section.innerHTML = `
    <h3>EDUCATION</h3>
    <p><strong>${d.degree} in ${d.field}</strong></p>
    <p>${d.school} | ${d.location}</p>
    <p><em>${dateText}</em></p>
    ${d.details?.length ? `<ul>${d.details.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}
  `;
}

/* ---------- HELPERS ---------- */
function setText(id, val) {
  const el = $(id);
  if (el && val) el.textContent = val;
}

function fillList(id, text) {
  const ul = $(id);
  if (!ul || !text) return;
  ul.innerHTML = text.split("\n").map(l => `<li>${l}</li>`).join("");
}

function formatMonth(v) {
  if (!v) return "";
  const d = new Date(v);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function goToStep4() {
  window.location.href = "step-4.html";
}
