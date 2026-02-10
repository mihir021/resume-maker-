// FSD/JS/navbar-loader.js
fetch("/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar-container").innerHTML = html;
    setActiveNav();
    loadNavbarUser(); // 👈 important
  });

function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}

async function loadNavbarUser() {
  try {
    const res = await fetch("/api/users/me", { credentials: "include" });
    if (!res.ok) return;

    const data = await res.json();

    const usernameEl = document.getElementById("username");

    if (usernameEl && data.user) {
      const name = data.user.name || "User";
      const id = data.user.id || "";
      usernameEl.textContent = `${name} ${id}`;
    }

  } catch (err) {
    console.error("Navbar user fetch failed", err);
  }
}
