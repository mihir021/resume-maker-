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
      <div class="resume-card fade-card" data-id="${r._id}"
           onclick="openResumePreview('${r._id}')">

        <!-- ❌ DELETE BUTTON -->
        <button class="delete-resume-btn"
                onclick="deleteResume(event, '${r._id}')">
          ✕
        </button>

        <div class="rank-badge">
          ${r.rank === 1 ? "🏆" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : "🔹"}
          Rank ${r.rank}
        </div>

        <h3>${r.title}</h3>
        <p>Score: <strong>${r.score} / 100</strong></p>
        <p>Template: ${r.template || "professionalBlue"}</p>
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

      // 🔥 REMOVE TEMPLATE CSS
      const old = document.getElementById("final-template-style");
      if (old) old.remove();

      // clear preview
      document.getElementById("finalResumePreview").innerHTML = "";
    });
  }
});

/* ================= OPEN PREVIEW ================= */
function openResumePreview(resumeId) {
  fetch(`/api/resumes/${resumeId}`, { credentials: "include" })
    .then(res => res.json())
    .then(resume => {
        console.log("RESUME FROM API:", resume); // 🔥 ADD THIS
      const overlay = document.getElementById("resumePreviewOverlay");
      overlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";

      // 🔥 THIS IS THE FIX
      document
        .querySelector(".resume-score-btn")
        .setAttribute("data-id", resumeId);

      loadFinalTemplate(resume);
    });
}


function closeResumePreview() {
  document.getElementById("resumePreviewOverlay")
    .classList.add("hidden");
}

/* ================== LOAD TEMPLATE ================== */
function loadFinalTemplate(resume) {
    console.log("TEMPLATE KEY:", resume.template);
  const templateKey = resume.template || "professionalBlue";
  const tpl = TEMPLATES[templateKey];
    console.log("TEMPLATE OBJECT:", tpl);
  if (!tpl) {
    alert("Template not found. Using default template.");
    return;
  }


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

document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("resume-score-btn")) return;

  const resumeId = e.target.dataset.id;
  console.log("Resume ID:", resumeId); // 🔥 debug

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

fetch("/api/resumes/skills/frequency")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("topSkills");
    if (!container) return;

    container.innerHTML = "";

    const entries = Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6); // show top 6 skills

    if (entries.length === 0) {
      container.innerHTML = "<p class='text-muted'>No skills data available</p>";
      return;
    }

    const maxCount = entries[0][1];

    entries.forEach(([skill, count]) => {
      const percent = Math.round((count / maxCount) * 100);

      container.innerHTML += `
        <div class="skill-row">
          <span class="skill-name">${skill}</span>

          <div class="skill-bar">
            <div class="skill-bar-fill" style="width:${percent}%"></div>
          </div>

          <span class="skill-count">${count}</span>
        </div>
      `;
    });
  });

async function deleteResume(event, resumeId) {
  event.stopPropagation(); // 🔥 prevents opening preview

  if (!confirm("Delete this resume permanently?")) return;

  try {
    const res = await fetch(`/api/resumes/${resumeId}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to delete resume");
      return;
    }

    // ✅ remove card from UI
    document
      .querySelector(`.resume-card[data-id="${resumeId}"]`)
      ?.remove();

  } catch (err) {
    console.error(err);
    alert("Server error while deleting resume");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const aiBtn = document.getElementById("aiCreateBtn");
  const aiModal = document.getElementById("aiResumeModal");

  if (!aiBtn || !aiModal) {
    console.error("AI button or modal not found");
    return;
  }

  aiBtn.addEventListener("click", async () => {
    const res = await fetch("/api/profile/status", { credentials: "include" });
    const status = await res.json();

    document.getElementById("skillsField")?.classList.toggle("d-none", status.skills);
    document.getElementById("projectsField")?.classList.toggle("d-none", status.projects);

    new bootstrap.Modal(aiModal).show();
  });
});


async function submitAIResume() {
  const role = document.getElementById("aiTitle").value.trim();
  const jd = document.getElementById("aiJD").value.trim();
  const exp = document.getElementById("aiExperience").value;
  let experience = [];

    if (document.getElementById("aiExperience").value === "experienced") {
      document.querySelectorAll(".experience-block").forEach(block => {
      const jobTitle = block.querySelector(".exp-title").value.trim();
      if (!jobTitle) return;

      experience.push({
        jobTitle,
        employer: block.querySelector(".exp-employer").value,
        city: block.querySelector(".exp-city").value,
        country: block.querySelector(".exp-country").value,
        startMonth: block.querySelector(".exp-start").value,
        endMonth: block.querySelector(".exp-end").value,
        description: block.querySelector(".exp-desc").value
      });
    });
    }


  if (!role) {
    alert("Please enter a role");
    return;
  }

  try {
    const res = await fetch("/ai/create-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
          role,
          job_description: jd,
          experience_level: exp,

          personal: {
              name: document.getElementById("aiName").value || "",
              title: document.getElementById("aiTitle").value || "",
              email: document.getElementById("aiEmail").value || "",
              phone: document.getElementById("aiPhone").value || "",
              location: document.getElementById("aiLocation").value || "",
              summary: document.getElementById("aiSummary").value,

              languages: document
                .getElementById("aiLanguages")
                ?.value.split("\n")
                .filter(Boolean) || [],

              certificates: document
                .getElementById("aiCertificates")
                ?.value.split("\n")
                .filter(Boolean) || []
            },

          education: {
            institution: document.getElementById("aiSchool").value,
            degree: document.getElementById("aiDegree").value,
            field: document.getElementById("aiField").value,
            year: document.getElementById("aiGradYear").value
          },

          experience: experience,

          skills: document
            .getElementById("aiSkills")
            .value
            .split("\n")
            .filter(Boolean)
        })


    });

    const raw = await res.text();
    console.log("AI RAW RESPONSE:", raw);

    if (!res.ok) {
      throw new Error(raw);
    }

    const data = JSON.parse(raw);

    bootstrap.Modal.getInstance(
      document.getElementById("aiResumeModal")
    ).hide();

    openResumePreview(data.resumeId);

  }catch (e) {
      console.error("AI ERROR:", e);
      alert("AI resume creation failed:\n" + e.message);
    }

}

function injectFinalData(data) {
  console.log("FINAL PREVIEW DATA:", data);

  if (!data.step1 || !data.step2) {
    console.error("Invalid STEP resume data", data);
    return;
  }

  // ===== STEP 1 =====
  setText("previewName", data.step1.name);
  setText("previewTitle", data.step1.title);
  setText("previewEmail", data.step1.email);
  setText("previewPhone", data.step1.phone);
  setText("previewLocation", data.step1.location);
  const summaryEl = document.getElementById("previewSummary");

    if (summaryEl) {
      summaryEl.innerHTML = highlightKeywords(
        data.step1.summary,
        data.step4   // skills = ATS keywords
      );
    }
    const langList = document.getElementById("pLanguages");
    if (langList && data.step1.languages?.length) {
      langList.innerHTML = data.step1.languages
        .map(l => `<li>${l}</li>`)
        .join("");
    } else if (langList) {
      langList.parentElement.style.display = "none";
    }

    const certList = document.getElementById("pCerts");
    if (certList && data.step1.certificates?.length) {
      certList.innerHTML = data.step1.certificates
        .map(c => `<li>${c}</li>`)
        .join("");
    } else if (certList) {
      certList.parentElement.style.display = "none";
    }



      // ===== STEP 2 : EDUCATION (formatted, template-safe) =====
    const degreeEl = document.getElementById("previewDegree");
    const fieldEl = document.getElementById("previewField");
    const instEl = document.getElementById("previewEduInstitute");
    const yearEl = document.getElementById("previewGraduation");

    if (data.step2) {
      const degree = data.step2.degree || "";
      const field = data.step2.field || "";
      const inst = data.step2.institution || "";
      const year = data.step2.year || "";

      // Degree + Field → single line
      if (degreeEl) {
        degreeEl.textContent = field
          ? `${degree} in ${field}`: degree;
      }

      // Hide standalone field line (prevents "IT" alone)
      if (fieldEl) {
        fieldEl.style.display = "none";
      }

      // Institution
      if (instEl) {
        instEl.textContent = inst;
      }

      // Year (clean)
      if (yearEl) {
        yearEl.textContent = year;
      }
    }


  // ===== STEP 3 =====
  if (data.step3 && data.step3.length > 0) {
      document.getElementById("previewExperienceSection").style.display = "block";

      document.getElementById("previewExperienceList").innerHTML =
        data.step3.map(exp => `
          <div class="mb-3">
            <strong>${exp.jobTitle}</strong> – ${exp.employer}<br>
            <small>${exp.city}, ${exp.country}</small><br>
            <small>${exp.startMonth} – ${exp.endMonth}</small>
            <p>${exp.description}</p>
          </div>
        `).join("");
    }else {
      document.getElementById("previewExperienceSection").style.display = "none";
    }


  // ===== STEP 4 =====
  const skillsBox = document.getElementById("previewSkills");
  if (skillsBox) {
    skillsBox.innerHTML = (data.step4 || [])
      .map(skill => `<li>${skill}</li>`)
      .join("");
  }
}

function highlightKeywords(text, keywords) {
  if (!text || !Array.isArray(keywords)) return text;

  const escaped = keywords.map(k =>
    k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  return text.replace(regex, `<span class="ats-highlight">$1</span>`);
}

const expSelect = document.getElementById("aiExperience");
if (expSelect) {
  expSelect.addEventListener("change", e => {
    const section = document.getElementById("aiExperienceSection");
    section.classList.toggle("d-none", e.target.value !== "experienced");
  });
}


function addExperienceField() {
  const tpl = document.getElementById("experienceTemplate");
  const clone = tpl.content.cloneNode(true);
  document.getElementById("experienceContainer").appendChild(clone);
}
