// FSD/JS/navbar-loader.js
// FSD/JS/navbar-loader.js
fetch("/navbar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("navbar-container").innerHTML = html;

        // ===== ACTIVE NAV LINK LOGIC =====
        const currentPage = window.location.pathname.split("/").pop();

        document.querySelectorAll(".nav-link").forEach(link => {
            const linkPage = link.getAttribute("href");

            // Only activate for these 3 pages
            if (
                (currentPage === "dashboard.html" && linkPage === "dashboard.html") ||
                (currentPage === "documents.html" && linkPage === "documents.html") ||
                (currentPage === "contact.html" && linkPage === "contact.html")
            ) {
                link.classList.add("active");
            }
        });
    })
    .catch(err => console.error("Navbar load failed", err));
