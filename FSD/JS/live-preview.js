const firstName = document.getElementById("firstName");
const lastName  = document.getElementById("lastName");
const email     = document.getElementById("email");
const phone     = document.getElementById("phone");
const summary   = document.getElementById("summary");
const skills    = document.getElementById("skills");

function safe(v, d) {
    return v && v.trim() !== "" ? v : d;
}

function updatePreview() {

    document.getElementById("previewName").textContent =
        safe(firstName.value, "John") + " " + safe(lastName.value, "Doe");

    document.getElementById("previewEmail").textContent =
        safe(email.value, "john@example.com");

    document.getElementById("previewPhone").textContent =
        safe(phone.value, "+91 9876543210");

    document.getElementById("previewSummary").textContent =
        safe(summary.value,
            "Passionate developer focused on clean UI and UX."
        );

    const ul = document.getElementById("previewSkills");
    ul.innerHTML = "";

    if (skills.value.trim()) {
        skills.value
            .split(/[\n,]/)     // ✅ comma OR new line
            .map(s => s.trim())
            .filter(Boolean)
            .forEach(skill => {
                const li = document.createElement("li");
                li.textContent = skill;
                ul.appendChild(li);
            });
    }
}

[firstName, lastName, email, phone, summary, skills]
    .forEach(i => i.addEventListener("input", updatePreview));
