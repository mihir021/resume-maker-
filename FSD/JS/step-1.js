const $ = id => document.getElementById(id);

/* 🔹 Default Preview Data */
const DEFAULTS = {
  name: "Rathod Mihir",
  title: "Java Developer",
  email: "mihir@email.com",
  phone: "+91 9876543210",
  location: "Ahmedabad, India",
  summary:
    "Motivated software developer with strong fundamentals in Java and problem-solving skills.",
  languages: "English\nHindi",
  certs: "Google Data Analytics\nAdvanced Excel"
};

/* 🔹 Load template CSS once */
(function loadTemplateCSS() {
  if (document.getElementById("template-style")) return;

  const link = document.createElement("link");
  link.id = "template-style";
  link.rel = "stylesheet";
  link.href = "../templates/template-academic-yellow/style.css";
  document.head.appendChild(link);
})();

/* 🔹 Load template HTML */
fetch("../templates/template-academic-yellow/template.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("resumePreview").innerHTML = html;
    restoreData();
  });

/* 🔹 Save form data */
function saveData() {
  localStorage.setItem(
    "step1",
    JSON.stringify({
      name: $("name").value,
      title: $("title").value,
      email: $("email").value,
      phone: $("phone").value,
      location: $("location").value,
      summary: $("summary").value,
      languages: $("languages").value,
      certs: $("certs").value
    })
  );
}

/* 🔹 Restore data */
function restoreData() {
  const d = JSON.parse(localStorage.getItem("step1") || "{}");

  Object.keys(DEFAULTS).forEach(key => {
    if ($(key)) {
      $(key).value = d[key] || "";
    }
  });

  updatePreview();
}

/* 🔹 Update Preview (WITH FALLBACK) */
function updatePreview() {
  const d = JSON.parse(localStorage.getItem("step1") || "{}");

  setText("previewName", d.name || DEFAULTS.name);
  setText("previewTitle", d.title || DEFAULTS.title);
  setText("previewEmail", d.email || DEFAULTS.email);
  setText("previewPhone", d.phone || DEFAULTS.phone);
  setText("previewLocation", d.location || DEFAULTS.location);
  setText("previewSummary", d.summary || DEFAULTS.summary);

  fillList("pLanguages", d.languages || DEFAULTS.languages);
  fillList("pCerts", d.certs || DEFAULTS.certs);
}

/* 🔹 Helpers */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function fillList(id, text) {
  const ul = document.getElementById(id);
  if (!ul) return;

  ul.innerHTML = "";

  text.split("\n").forEach(line => {
    if (line.trim()) {
      const li = document.createElement("li");
      li.textContent = line.trim();
      ul.appendChild(li);
    }
  });
}

/* 🔹 Live typing */
document.querySelectorAll("input, textarea").forEach(el => {
  el.addEventListener("input", () => {
    saveData();
    updatePreview();
  });
});

/* 🔹 Next button */
document.getElementById("nextBtn").onclick = () => {
  saveData();
  window.location.href = "step-2.html";
};
