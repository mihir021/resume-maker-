// ================================
// FADE-IN ANIMATION (UNCHANGED)
// ================================
const sections = document.querySelectorAll(".fade-section");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);

sections.forEach(section => observer.observe(section));


// ================================
// FETCH LOGGED-IN USER (FIXED)
// ================================
fetch("http://127.0.0.1:5000/api/users/me", {
  method: "GET",
  credentials: "include"
})
  .then(res => {
    if (!res.ok) throw new Error("Not logged in");
    return res.json();
  })
  .then(data => {
    if (!data.user || !data.user.name) {
      throw new Error("Invalid session");
    }

    // Set username in navbar / dashboard
    const usernameEl = document.getElementById("username");
    const firstNameEl = document.getElementById("firstName");

    if (usernameEl) {
      usernameEl.textContent = data.user.name;
    }

    if (firstNameEl) {
      firstNameEl.textContent = data.user.name.split(" ")[0];
    }
  })
  .catch(() => {
    // Session invalid → go to login
    window.location.href = "loginPage.html";
  });


// ================================
// LOGOUT (FIXED)
// ================================
function logoutUser() {
  fetch("http://127.0.0.1:5000/logout", {
    method: "GET",
    credentials: "include"
  }).then(() => {
    window.location.href = "loginPage.html";
  });
}
