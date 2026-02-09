/* ================== SHORTCUT ================== */
const $ = id => document.getElementById(id);

/* ================== TEMPLATE MAP ================== */
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
  },
  blueCorporate: {
    css: "../templates/template-blue-corporate/style.css",
    html: "../templates/template-blue-corporate/template.html"
  },
  softGreenMinimal: {
    css: "../templates/template-soft-green-minimal/style.css",
    html: "../templates/template-soft-green-minimal/template.html"
  },
  darkElegant: {
    css: "../templates/template-dark-elegant/style.css",
    html: "../templates/template-dark-elegant/template.html"
  },
  timelineResume: {
    css: "../templates/template-timeline-resume/style.css",
    html: "../templates/template-timeline-resume/template.html"
  },
  boldRedAccent: {
    css: "../templates/template-Bold-red-Accent/style.css",
    html: "../templates/template-Bold-red-Accent/template.html"
  },
  cardBased: {
    css: "../templates/template-card-based/style.css",
    html: "../templates/template-card-based/template.html"
  },
  glassmorphism: {
    css: "../templates/template-glassmorphism/style.css",
    html: "../templates/template-glassmorphism/template.html"
  },
  infographic: {
    css: "../templates/template-infographic/style.css",
    html: "../templates/template-infographic/template.html"
  },
  ultraMinimal: {
    css: "../templates/template-ultra-minimal-black&white/style.css",
    html: "../templates/template-ultra-minimal-black&white/template.html"
  },
  boxShadow: {
    css: "../templates/template-box-shadow/style.css",
    html: "../templates/template-box-shadow/template.html"
  },
  classicSerif: {
    css: "../templates/template-classic-serif/style.css",
    html: "../templates/template-classic-serif/template.html"
  },
  freshGradient: {
    css: "../templates/template-fresh-gradient/style.css",
    html: "../templates/template-fresh-gradient/template.html"
  },
  splitHeaderModern: {
    css: "../templates/template-split-header-modern/style.css",
    html: "../templates/template-split-header-modern/template.html"
  },
  techLook: {
    css: "../templates/template-tech-look/style.css",
    html: "../templates/template-tech-look/template.html"
  },
  ultraClean: {
    css: "../templates/template-ultra-clean/style.css",
    html: "../templates/template-ultra-clean/template.html"
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
    restoreEducation();
  });

/* ================== LOAD HEADER (STEP-1) ================== */
function loadHeader() {
  const d = JSON.parse(localStorage.getItem("step1") || "{}");

  setText("previewName", d.name);
  setText("previewTitle", d.title);
  setText("previewEmail", d.email);
  setText("previewPhone", d.phone);
  setText("previewLocation", d.location);
  setText("previewSummary", d.summary);

  fillList("pLanguages", d.languages);
  fillList("pCerts", d.certs);
}

/* ================== EXPERIENCE (STEP-2 DATA) ================== */
function loadExperience() {
  const list = JSON.parse(localStorage.getItem("experiences") || "[]");

  const section = $("previewExperienceSection");
  const box = $("previewExperienceList");

  if (!section || !box || !list.length) {
    section && section.classList.add("hide-section");
    return;
  }

  box.innerHTML = "";

  list.forEach(exp => {
    const div = document.createElement("div");
    div.className = "exp-item";
    div.innerHTML = `
      <strong>${exp.jobTitle} – ${exp.employer}</strong><br>
      <small>
        ${exp.city || ""}${exp.country ? ", " + exp.country : ""}
        | ${exp.startDate} – ${exp.endDate}
      </small>
      <ul>
        ${(exp.description || "")
          .split("\n")
          .filter(Boolean)
          .map(l => `<li>${l}</li>`)
          .join("")}
      </ul>
    `;
    box.appendChild(div);
  });

  section.classList.remove("hide-section");
}

/* ================== EDUCATION (STEP-3) ================== */

/* LIVE SAVE */
[
  "school",
  "eduLocation",
  "degree",
  "field",
  "gradMonth",
  "currentStudy",
  "eduDetails"
].forEach(id => {
  const el = $(id);
  if (!el) return;
  el.addEventListener("input", saveEducation);
  el.addEventListener("change", saveEducation);
});

/* SAVE EDUCATION */
function saveEducation() {
  const data = {
    school: $("school")?.value.trim() || "",
    location: $("eduLocation")?.value.trim() || "",
    degree: $("degree")?.value.trim() || "",
    field: $("field")?.value.trim() || "",
    month: $("gradMonth")?.value || "",
    current: $("currentStudy")?.checked || false,
    details: ($("eduDetails")?.value || "")
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean)
  };

  localStorage.setItem("step2", JSON.stringify(data));
  renderEducation(data);
}

/* RESTORE EDUCATION */
function restoreEducation() {
  const raw = localStorage.getItem("step2");
  if (!raw) return;

  let d;
  try {
    d = JSON.parse(raw);
  } catch {
    console.error("Invalid step2 data");
    return;
  }

  if ($("school")) $("school").value = d.school || "";
  if ($("eduLocation")) $("eduLocation").value = d.location || "";
  if ($("degree")) $("degree").value = d.degree || "";
  if ($("field")) $("field").value = d.field || "";
  if ($("gradMonth")) $("gradMonth").value = d.month || "";
  if ($("currentStudy")) $("currentStudy").checked = d.current || false;
  if ($("eduDetails")) $("eduDetails").value = (d.details || []).join("\n");

  renderEducation(d);
}

/* RENDER EDUCATION TO PREVIEW */
function renderEducation(d) {
  const section = $("educationSection");
  if (!section || !d.school) return;

  const dateText = d.current
    ? `Expected ${formatMonth(d.month)}`
    : formatMonth(d.month);

  section.innerHTML = `
    <h3>EDUCATION</h3>
    <ul>
      <li>
        <strong>${d.degree} in ${d.field}</strong><br>
        ${d.school} | ${d.location}<br>
        <em>${dateText}</em>
        ${
          d.details && d.details.length
            ? `<ul>${d.details.map(x => `<li>${x}</li>`).join("")}</ul>`
            : ""
        }
      </li>
    </ul>
  `;
}

/* ================== HELPERS ================== */
function setText(id, val) {
  const el = $(id);
  if (el) el.textContent = val || "";
}

function fillList(id, text) {
  const ul = $(id);
  if (!ul || !text) return;
  ul.innerHTML = text
    .split("\n")
    .filter(Boolean)
    .map(l => `<li>${l}</li>`)
    .join("");
}

function formatMonth(v) {
  if (!v) return "";
  return new Date(v).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric"
  });
}

/* ================== NAV ================== */
function goToStep4() {
  saveEducation();
  window.location.href = "step-4.html";
}
function saveExperiences(list) {
  localStorage.setItem("experiences", JSON.stringify(list));
  loadExperience(); // 🔥 refresh preview
}
