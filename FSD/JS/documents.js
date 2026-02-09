/* ================== OBSERVER ================== */
const sections = document.querySelectorAll(".fade-section");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.15 });

sections.forEach(sec => observer.observe(sec));

/* ================== TEMPLATES ================== */
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
        <div class="rank-badge">
          ${r.rank === 1 ? "🏆" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : "🔹"}
          Rank ${r.rank}
        </div>
        <h3>${r.title}</h3>
        <p>Score: <strong>${r.score} / 100</strong></p>
        <p>Template: ${r.template}</p>
      </div>
    `).join("");

    container.querySelectorAll(".fade-card")
      .forEach(card => observer.observe(card));
  });

/* ================= OPEN PREVIEW ================= */
function openResumePreview(resumeId) {
  fetch(`/api/resumes/${resumeId}`, { credentials: "include" })
    .then(res => res.json())
    .then(resume => {
      const overlay = document.getElementById("resumePreviewOverlay");
      overlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";

      document
        .querySelector(".resume-score-btn")
        ?.setAttribute("data-id", resumeId);

      loadFinalTemplate(resume);
    });
}

function closeResumePreview() {
  document.getElementById("resumePreviewOverlay")
    .classList.add("hidden");
}

/* ================= LOAD TEMPLATE ================= */
function loadFinalTemplate(resume) {
  const tpl = TEMPLATES[resume.template];
  if (!tpl) return;

  document.getElementById("final-template-style")?.remove();

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

/* ================= INJECT ALL DATA ================= */
function injectFinalData(data) {
  if (!data) return;

  /* STEP 1 – HEADER + CONTACT */
  setText("previewName", data.step1?.name);
  setText("previewTitle", data.step1?.title);
  setText("previewSummary", data.step1?.summary);
  setText("previewEmail", data.step1?.email);
  setText("previewPhone", data.step1?.phone);
  setText("previewLocation", data.step1?.location);

  fillList("pLanguages", data.step1?.languages);
  fillList("pCerts", data.step1?.certs);

  /* STEP 2 – EDUCATION */
  if (data.step2) {
    const edu = document.getElementById("educationSection");
    if (edu && data.step2.degree) {
      const dateText = data.step2.current
        ? "Expected " + formatMonth(data.step2.month)
        : formatMonth(data.step2.month);

      edu.innerHTML = `
        <h3>EDUCATION</h3>
        <ul>
          <li>
            <strong>${data.step2.degree} in ${data.step2.field}</strong><br>
            ${data.step2.school} | ${data.step2.location}<br>
            <em>${dateText}</em>
          </li>
        </ul>
      `;
    }
  }

  /* STEP 3 – EXPERIENCE (FIXED) */
  if (Array.isArray(data.step3) && data.step3.length) {
    const section = document.getElementById("previewExperienceSection");
    const box = document.getElementById("previewExperienceList");

    if (section && box) {
      box.innerHTML = data.step3.map(exp => `
        <div class="exp-item">
          <strong>${exp.jobTitle} – ${exp.employer}</strong><br>
          <small>
            ${exp.city || ""}${exp.country ? ", " + exp.country : ""}
            | ${exp.startDate} – ${exp.endDate}
          </small>
          <ul>
            ${(exp.description || "")
              .split("\n")
              .filter(Boolean)
              .map(d => `<li>${d}</li>`)
              .join("")}
          </ul>
        </div>
      `).join("");

      section.classList.remove("hide-section");
    }
  }

  /* STEP 4 – SKILLS (FIXED FOR ALL TEMPLATES) */
    if (Array.isArray(data.step4) && data.step4.length) {
      const ul = document.getElementById("previewSkills");
      const section = ul?.closest("section");

      if (ul) {
        ul.innerHTML = "";

        data.step4.forEach(skill => {
          const li = document.createElement("li");
          li.textContent = skill;
          ul.appendChild(li);
        });

        section?.classList.remove("hide-section");
      }
    }

}

/* ================= HELPERS ================= */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "";
}

function fillList(id, text) {
  const ul = document.getElementById(id);
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
function loadSkills() {
  const skills = JSON.parse(localStorage.getItem("skills") || "[]");

  const ul = document.getElementById("previewSkills");
  const section = ul?.closest("section");

  if (!ul || !skills.length) {
    section?.classList.add("hide-section");
    return;
  }

  ul.innerHTML = "";
  skills.forEach(skill => {
    const li = document.createElement("li");
    li.textContent = skill;
    ul.appendChild(li);
  });

  // ✅ IMPORTANT
  section.classList.remove("hide-section");
}

/* ================= DOWNLOAD PDF (STABLE) ================= */
function downloadResumePDF() {
  const element = document.getElementById("finalResumePreview");

  setTimeout(() => {
    html2pdf()
      .set({
        margin: 5,
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .from(element)
      .save();
  }, 300);
}
/* ================= RESUME SCORE BUTTON ================= */
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".resume-score-btn");
  if (!btn) return;

  const resumeId = btn.dataset.id;
  if (!resumeId) return;

  const res = await fetch(`/api/resumes/score/${resumeId}`);
  const data = await res.json();

  document.getElementById("finalScore").innerText =
    `${data.score} / 100`;

  const list = document.getElementById("scoreList");
  list.innerHTML = "";

  for (let key in data.breakdown) {
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between">
        <span>${key}</span>
        <strong>${data.breakdown[key]}</strong>
      </li>
    `;
  }

  new bootstrap.Modal(
    document.getElementById("resumeScoreModal")
  ).show();
});
/* ================= CLOSE PREVIEW BUTTON ================= */
document.addEventListener("click", (e) => {
  if (e.target.closest("#closePreview")) {
    const overlay = document.getElementById("resumePreviewOverlay");
    if (overlay) {
      overlay.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  }
});
