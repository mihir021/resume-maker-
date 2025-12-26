const $ = id => document.getElementById(id);

/* ---------- CLEAN TEXT ---------- */
function cleanText(text) {
  if (!text) return "";
  return text.replace(/â€“|–|—/g, "-").trim();
}

/* ---------- FALLBACKS (FROM STEP-1 UI) ---------- */
const FALLBACK = {
  languages: "English\nHindi",
  certs: "Google Data Analytics\nAdvanced Excel"
};

/* ---------- LOAD TEMPLATE ---------- */
fetch("../templates/template-academic-yellow/template.html")
  .then(res => res.text())
  .then(html => {
    $("resumePreview").innerHTML = html;
    loadHeaderFromStep1();
    loadExperience();
  });

/* ---------- LOAD HEADER + SIDEBAR FROM STEP-1 ---------- */
function loadHeaderFromStep1() {
  const d = JSON.parse(localStorage.getItem("step1") || "{}");

  setText("previewName", d.name);
  setText("previewTitle", d.title);
  setText("previewEmail", d.email);
  setText("previewPhone", d.phone);
  setText("previewLocation", d.location);
  setText("previewSummary", d.summary);

  // ✅ FIXED: fallback values
  fillList("pLanguages", d.languages || FALLBACK.languages);
  fillList("pCerts", d.certs || FALLBACK.certs);
}

/* ---------- HELPERS ---------- */
function setText(id, value) {
  const el = $(id);
  if (el && value) el.textContent = cleanText(value);
}

function fillList(id, text) {
  const ul = $(id);
  if (!ul || !text) return;

  ul.innerHTML = "";
  text.split("\n").forEach(line => {
    if (line.trim()) {
      const li = document.createElement("li");
      li.textContent = line.trim();
      ul.appendChild(li);
    }
  });
}

/* ---------- EXPERIENCE STORAGE ---------- */
function getExperiences() {
  return JSON.parse(localStorage.getItem("experiences") || "[]");
}

function saveExperiences(arr) {
  localStorage.setItem("experiences", JSON.stringify(arr));
}

/* ---------- DATE FORMAT ---------- */
function formatMonth(val) {
  if (!val) return "";
  return new Date(val).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric"
  });
}

/* ---------- ADD EXPERIENCE ---------- */
$("addExperienceBtn").addEventListener("click", () => {
  const jobTitle = $("jobTitle").value.trim();
  const employer = $("employer").value.trim();
  const city = $("city").value.trim();
  const country = $("country").value.trim();
  const start = $("startDate").value;
  const end = $("endDate").value;
  const desc = $("description").value.trim();

  if (!jobTitle || !employer || !start || !end || !desc) {
    alert("Please fill all experience fields.");
    return;
  }

  const exp = {
    jobTitle,
    employer,
    city,
    country,
    startDate: formatMonth(start),
    endDate: formatMonth(end),
    description: desc
  };

  saveExperiences([exp]);
  renderExperiences();
  clearForm();
});

/* ---------- RENDER EXPERIENCE ---------- */
function renderExperiences() {
  const listBox = $("previewExperienceList");
  const section = $("previewExperienceSection");

  if (!listBox || !section) return;

  listBox.innerHTML = "";

  getExperiences().forEach(exp => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${exp.jobTitle} – ${exp.employer}</strong><br>
      <small>${exp.startDate} – ${exp.endDate}</small>
      <ul>
        ${exp.description.split("\n").map(l => `<li>${l}</li>`).join("")}
      </ul>
    `;
    listBox.appendChild(div);
  });

  section.style.display = "block";
}

function loadExperience() {
  if (getExperiences().length) renderExperiences();
}

function clearForm() {
  [
    "jobTitle","employer","city","country",
    "startDate","endDate","description"
  ].forEach(id => $(id).value = "");
}

function goToStep3() {
  window.location.href = "step-3.html";
}
