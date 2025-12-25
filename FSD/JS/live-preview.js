fetch("../templates/template-clean-profile/template.html")
    .then(res => {
        if (!res.ok) throw new Error("Template not found");
        return res.text();
    })
    .then(html => {
        document.getElementById("resumeContainer").innerHTML = html;
        init();
        updatePreview();
    })
    .catch(err => console.error(err));

function init() {
    window.firstName = document.getElementById("firstName");
    window.lastName  = document.getElementById("lastName");
    window.email     = document.getElementById("email");
    window.phone     = document.getElementById("phone");
    window.summary   = document.getElementById("summary");
    window.skills    = document.getElementById("skills");

    [firstName, lastName, email, phone, summary, skills]
        .forEach(el => el.addEventListener("input", updatePreview));
}

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
            "Passionate developer focused on building clean and user-friendly interfaces."
        );

    const ul = document.getElementById("previewSkills");
    ul.innerHTML = "";

    if (skills.value.trim()) {
        skills.value
            .split(/,|\n/)
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .forEach(skill => {
                const li = document.createElement("li");
                li.textContent = skill;
                ul.appendChild(li);
            });
    }
}
