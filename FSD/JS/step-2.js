/* ================== SHORTCUT ================== */
const $ = id => document.getElementById(id);

/* ================== TEMPLATE CONFIG ================== */
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

/* ================== LOAD TEMPLATE CSS (ONCE) ================== */
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
    renderExperiences();
  });

/* ================== LOAD HEADER FROM STEP-1 ================== */
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

/* ================== EXPERIENCE STORAGE ================== */
function getExperiences() {
  return JSON.parse(localStorage.getItem("experiences") || "[]");
}

function saveExperiences(arr) {
  localStorage.setItem("experiences", JSON.stringify(arr));
}

/* ================== DATE FORMAT ================== */
function formatMonth(val) {
  if (!val) return "";
  const d = new Date(val);
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric"
  });
}

/* ================== ADD EXPERIENCE ================== */
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

  const list = getExperiences();
  list.unshift(exp); // most recent first
  saveExperiences(list);

  renderExperiences();
  clearForm();
});

/* ================== RENDER EXPERIENCE PREVIEW ================== */
function renderExperiences() {
  const list = getExperiences();
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

/* ================== CLEAR FORM ================== */
function clearForm() {
  [
    "jobTitle",
    "employer",
    "city",
    "country",
    "startDate",
    "endDate",
    "description"
  ].forEach(id => $(id).value = "");
}

/* ================== HELPERS ================== */
function setText(id, val) {
  const el = $(id);
  if (el && val) el.textContent = val;
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

/* ================== NAVIGATION ================== */
function goToStep3() {
  window.location.href = "step-3.html";
}
