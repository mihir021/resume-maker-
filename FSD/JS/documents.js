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
  professionalBlue: {
    css: "../templates/template-clean-profile/style.css",
    html: "../templates/template-clean-profile/template.html"
  },
  minimalElegant: {
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
      <div class="resume-card fade-card" data-id="${r._id}"
           onclick="openResumePreview('${r._id}')">

        <button class="delete-resume-btn"
                onclick="deleteResume(event, '${r._id}')">✕</button>

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

      loadFinalTemplate(resume);

      // attach resumeId to score button AFTER render
      setTimeout(() => {
        document.querySelector(".resume-score-btn")
          ?.setAttribute("data-id", resumeId);
      }, 50);
    });
}

/* ================= LOAD TEMPLATE ================= */
function loadFinalTemplate(resume) {
  const tpl = TEMPLATES[resume.template] || TEMPLATES.professionalBlue;

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

/* ================= DELEGATED FIX: CLOSE BUTTON ================= */
document.addEventListener("click", (e) => {
  if (e.target.closest("#closePreview")) {
    document.getElementById("resumePreviewOverlay").classList.add("hidden");
    document.body.style.overflow = "auto";
    document.getElementById("final-template-style")?.remove();
    document.getElementById("finalResumePreview").innerHTML = "";
  }
});

/* ================= DELEGATED FIX: RESUME SCORE ================= */
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

/* ================= DELETE RESUME ================= */
async function deleteResume(event, resumeId) {
  event.stopPropagation();
  if (!confirm("Delete this resume permanently?")) return;

  const res = await fetch(`/api/resumes/${resumeId}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (res.ok) {
    document.querySelector(`.resume-card[data-id="${resumeId}"]`)?.remove();
  }
}

function injectFinalData(data) {
  if (!data) return;

  /* ===== STEP 1 – HEADER & CONTACT ===== */
  setText("previewName", data.step1?.name);
  setText("previewTitle", data.step1?.title);
  setText("previewSummary", data.step1?.summary);
  setText("previewEmail", data.step1?.email);
  setText("previewPhone", data.step1?.phone);
  setText("previewLocation", data.step1?.location);

  // ✅ FIX: certificates key mismatch
  /* ===== LANGUAGES ===== */
/* ===== LANGUAGES (string OR array safe) ===== */
if (data.step1?.languages) {
  const ul = document.getElementById("pLanguages");
  const section = ul?.closest("section");

  const langs = Array.isArray(data.step1.languages)
    ? data.step1.languages
    : data.step1.languages.split("\n").filter(Boolean);

  if (langs.length) {
    ul.innerHTML = langs.map(l => `<li>${l}</li>`).join("");
    section?.classList.remove("hide-section");
  }
}

/* ===== CERTIFICATIONS (string OR array safe) ===== */
/* ===== CERTIFICATIONS (certs OR certificates SAFE) ===== */
{
  const ul = document.getElementById("pCerts");
  const section = ul?.closest("section");

  const certSource =
    data.step1?.certificates ??
    data.step1?.certs ??
    null;

  const certs = Array.isArray(certSource)
    ? certSource
    : typeof certSource === "string"
      ? certSource.split("\n").filter(Boolean)
      : [];

  if (ul && certs.length) {
    ul.innerHTML = certs.map(c => `<li>${c}</li>`).join("");
    section?.classList.remove("hide-section");
  }
}



  //* ===== STEP 2 – EDUCATION (TEMPLATE SAFE) ===== */
if (data.step2) {
  const eduSection = document.getElementById("educationSection");

  if (eduSection) {
    const degreeLine = data.step2.degree && data.step2.field
      ? `${data.step2.degree} in ${data.step2.field}`
      : data.step2.degree || "";

    const dateText = data.step2.current
      ? `Expected ${formatMonth(data.step2.month)}`
      : formatMonth(data.step2.month);

    eduSection.innerHTML = `
      <h3>EDUCATION</h3>
      <p><strong>${degreeLine}</strong></p>
      <p>${data.step2.school || ""}</p>
      <p>${data.step2.location || ""}</p>
      <p>${dateText}</p>
      ${
        Array.isArray(data.step2.details) && data.step2.details.length
          ? `<ul>${data.step2.details.map(d => `<li>${d}</li>`).join("")}</ul>`
          : ""
      }
    `;
  }
}


  /* ===== STEP 3 – EXPERIENCE ===== */
  if (Array.isArray(data.step3) && data.step3.length) {
    const section = document.getElementById("previewExperienceSection");
    const box = document.getElementById("previewExperienceList");

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

  /* ===== STEP 4 – SKILLS ===== */
  if (Array.isArray(data.step4) && data.step4.length) {
    const ul = document.getElementById("previewSkills");
    const section = ul?.closest("section");

    ul.innerHTML = data.step4
      .map(skill => `<li>${skill}</li>`)
      .join("");

    section?.classList.remove("hide-section");
  }
}
/* ================= HELPERS ================= */
function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value || "";
}

function fillList(id, list) {
  const ul = document.getElementById(id);
  if (!ul || !Array.isArray(list) || !list.length) return;

  ul.innerHTML = list.map(item => `<li>${item}</li>`).join("");
}

function formatMonth(v) {
  if (!v) return "";
  return new Date(v).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric"
  });
}
function normalizeAIResume(ai) {
  return {
    step1: {
      name: ai.personal?.name || "",
      title: ai.personal?.title || "",
      email: ai.personal?.email || "",
      phone: ai.personal?.phone || "",
      location: ai.personal?.location || "",
      summary: ai.personal?.summary || "",
      languages: ai.personal?.languages || [],
      certificates: ai.personal?.certificates || []
    },

    step2: {
      degree: ai.education?.degree || "",
      field: ai.education?.field || "",
      school: ai.education?.institution || "",
      location: "",
      year: ai.education?.year || ""
    },

    step3: Array.isArray(ai.experience)
      ? ai.experience.map(e => ({
          jobTitle: e.jobTitle,
          employer: e.employer,
          city: e.city,
          country: e.country,
          startDate: e.startMonth,
          endDate: e.endMonth,
          description: e.description
        }))
      : [],

    step4: ai.skills || []
  };
}

/* ================= CREATE WITH AI (FINAL FIX) ================= */
document.addEventListener("DOMContentLoaded", () => {
  const aiBtn = document.getElementById("aiCreateBtn");
  const aiModal = document.getElementById("aiResumeModal");

  if (!aiBtn || !aiModal) {
    console.warn("AI Create button or modal not found");
    return;
  }

  aiBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/profile/status", {
        credentials: "include"
      });

      if (!res.ok) {
        throw new Error("Profile status fetch failed");
      }

      const status = await res.json();

      // Toggle optional fields
      document
        .getElementById("skillsField")
        ?.classList.toggle("d-none", status.skills);

      document
        .getElementById("projectsField")
        ?.classList.toggle("d-none", status.projects);

      new bootstrap.Modal(aiModal).show();

    } catch (err) {
      console.error("AI modal error:", err);
      alert("Unable to open AI resume builder");
    }
  });
});
async function submitAIResume() {
  try {
    const role = document.getElementById("aiTitle")?.value?.trim();
    const jd = document.getElementById("aiJD")?.value?.trim();
    const expLevel = document.getElementById("aiExperience")?.value;

    if (!role) {
      alert("Please enter a role");
      return;
    }

    // 🔥 collect experience blocks (if experienced)
    let experience = [];
    if (expLevel === "experienced") {
      document.querySelectorAll(".experience-block").forEach(block => {
        const jobTitle = block.querySelector(".exp-title")?.value?.trim();
        if (!jobTitle) return;

        experience.push({
          jobTitle,
          employer: block.querySelector(".exp-employer")?.value || "",
          city: block.querySelector(".exp-city")?.value || "",
          country: block.querySelector(".exp-country")?.value || "",
          startMonth: block.querySelector(".exp-start")?.value || "",
          endMonth: block.querySelector(".exp-end")?.value || "",
          description: block.querySelector(".exp-desc")?.value || ""
        });
      });
    }

    // 🔥 CALL AI API
    const res = await fetch("/ai/create-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        role,
        job_description: jd,
        experience_level: expLevel,

        personal: {
          name: document.getElementById("aiName")?.value || "",
          title: role,
          email: document.getElementById("aiEmail")?.value || "",
          phone: document.getElementById("aiPhone")?.value || "",
          location: document.getElementById("aiLocation")?.value || "",
          summary: document.getElementById("aiSummary")?.value || "",
          languages: document
            .getElementById("aiLanguages")
            ?.value.split("\n").filter(Boolean) || [],
          certificates: document
            .getElementById("aiCertificates")
            ?.value.split("\n").filter(Boolean) || []
        },

        education: {
          institution: document.getElementById("aiSchool")?.value || "",
          degree: document.getElementById("aiDegree")?.value || "",
          field: document.getElementById("aiField")?.value || "",
          year: document.getElementById("aiGradYear")?.value || ""
        },

        experience,
        skills: document
          .getElementById("aiSkills")
          ?.value.split("\n").filter(Boolean) || []
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "AI resume creation failed");
    }

    // 🔥 CLOSE MODAL
    bootstrap.Modal
      .getInstance(document.getElementById("aiResumeModal"))
      ?.hide();

    // 🔥 NORMALIZE + LOAD PREVIEW (THIS IS THE KEY FIX)
    const normalized = normalizeAIResume(data.resume.data);

    loadFinalTemplate({
      template: data.resume.template || "professionalBlue",
      data: normalized
    });

  } catch (err) {
    console.error("submitAIResume error:", err);
    alert("Failed to generate resume");
  }
}

/* ================= AI GENERATE RESUME BUTTON (FINAL FIX) ================= */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("#aiGenerateBtn");

  if (!btn) return;

  e.preventDefault();
  btn.disabled = true;
  btn.innerText = "Generating...";

  Promise.resolve(submitAIResume())
    .catch(err => {
      console.error("AI Generate Error:", err);
      alert("Failed to generate resume");
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerText = "Generate Resume";
    });
});
