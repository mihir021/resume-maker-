/* ================== OBSERVER ================== */
const sections = document.querySelectorAll('.fade-section');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.15 });

sections.forEach(sec => observer.observe(sec));

/* ================== TEMPLATES ================== */
const TEMPLATES = {
  academicYellow: {
    css: "../templates/template-academic-yellow/style.css",
    html: "../templates/template-academic-yellow/template.html"
  },
  professionalBlue: {
    css: "../templates/template-clean-profile/style.css",
    html: "../templates/template-clean-profile/template.html"
  },
  minimalElegant: {
    css: "../templates/template-modern-clean/style.css",
    html: "../templates/template-modern-clean/template.html"
  }
};

/* ================== LOAD RESUMES ================== */
fetch("/api/resumes", { credentials: "include" })
  .then(res => res.json())
  .then(resumes => {
    const container = document.getElementById("resumeList");

    if (!resumes.length) {
      container.innerHTML = "<p>No resume created</p>";
      return;
    }

    container.innerHTML = resumes.map(r => `
      <div class="resume-card fade-card" onclick="openResumePreview('${r._id}')">
        <h3>${r.title}</h3>
        <p>Template: ${r.template}</p>
        <p>Created: ${new Date(r.created_at).toLocaleDateString()}</p>
      </div>
    `).join("");

    container.querySelectorAll('.fade-card')
      .forEach(card => observer.observe(card));
  });

/* ================= PREVIEW CONTROLS ================= */
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("resumePreviewOverlay");
  const closeBtn = document.getElementById("closePreview");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      overlay.classList.add("hidden");
      document.body.style.overflow = "auto";
    });
  }
});

/* ================= OPEN PREVIEW ================= */
function openResumePreview(resumeId) {
  fetch(`/api/resumes/${resumeId}`, { credentials: "include" })
    .then(res => res.json())
    .then(resume => {
      const overlay = document.getElementById("resumePreviewOverlay");
      overlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";

      loadFinalTemplate(resume);
    });
}

function closeResumePreview() {
  document.getElementById("resumePreviewOverlay")
    .classList.add("hidden");
}

/* ================== LOAD TEMPLATE ================== */
function loadFinalTemplate(resume) {
  const tpl = TEMPLATES[resume.template];
  if (!tpl) return;

  const old = document.getElementById("final-template-style");
  if (old) old.remove();

  const link = document.createElement("link");
  link.id = "final-template-style";
  link.rel = "stylesheet";
  link.href = tpl.css;
  document.head.appendChild(link);

  fetch(tpl.html)
    .then(res => res.text())
    .then(html => {
      document.getElementById("finalResumePreview").innerHTML = html;
      injectFinalData(resume.data);
    });
}


/* ================== INJECT ALL STEPS ================== */
function injectFinalData(data) {
  if (!data) return;

  /* STEP 1 */
  setText("previewName", data.step1?.name);
  setText("previewTitle", data.step1?.title);
  setText("previewSummary", data.step1?.summary);
  fillList("pLanguages", data.step1?.languages);
  fillList("pCerts", data.step1?.certs);

  /* STEP 2 – EDUCATION */
  if (data.step2) {
    const edu = document.querySelector("#educationSection");
    if (edu) {
      edu.innerHTML = `
        <h3>EDUCATION</h3>
        <p><strong>${data.step2.degree} in ${data.step2.field}</strong></p>
        <p>${data.step2.school}, ${data.step2.location}</p>
        <p>${data.step2.current ? "Expected " : ""}${formatMonth(data.step2.month)}</p>
      `;
    }
  }

  /* STEP 3 – EXPERIENCE */
  if (Array.isArray(data.step3)) {
    const box = document.getElementById("previewExperienceList");
    if (box) {
      box.innerHTML = data.step3.map(exp => `
        <div>
          <strong>${exp.jobTitle} – ${exp.employer}</strong>
          <div>${exp.startDate} – ${exp.endDate}</div>
          <ul>${exp.description.split("\n").map(d => `<li>${d}</li>`).join("")}</ul>
        </div>
      `).join("");
    }
  }

  /* STEP 4 – SKILLS */
  if (Array.isArray(data.step4)) {
    const section = document.querySelector("#skillsSection");
    if (section) {
      const half = Math.ceil(data.step4.length / 2);
      section.innerHTML = `
        <h3>SKILLS</h3>
        <div class="skills-grid">
          <ul>${data.step4.slice(0, half).map(s => `<li>${s}</li>`).join("")}</ul>
          <ul>${data.step4.slice(half).map(s => `<li>${s}</li>`).join("")}</ul>
        </div>
      `;
    }
  }
}

/* ================== HELPERS ================== */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
}

function fillList(id, text) {
  const ul = document.getElementById(id);
  if (!ul || !text) return;
  ul.innerHTML = text.split("\n").map(l => `<li>${l}</li>`).join("");
}

function formatMonth(v) {
  if (!v) return "";
  return new Date(v).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric"
  });
}

/* ================== DOWNLOAD ================== */
function downloadResumePDF() {
  const element = document.getElementById("finalResumePreview");

  html2pdf()
    .set({
      margin: 5,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      }
    })
    .from(element)
    .save();
}


