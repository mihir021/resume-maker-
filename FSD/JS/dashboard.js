// =======================================
// FADE-IN ANIMATION (UNCHANGED)
// =======================================
const sections = document.querySelectorAll(".fade-section");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);

sections.forEach(section => observer.observe(section));


// =======================================
// AUTH CHECK – FETCH LOGGED-IN USER
// =======================================
async function loadUser() {
  try {
    const response = await fetch("/api/users/me", {
      method: "GET",
      credentials: "include" // 🔥 REQUIRED FOR SESSION
    });

    if (!response.ok) {
      throw new Error("User not authenticated");
    }

    const data = await response.json();

    if (!data.user || !data.user.name) {
      throw new Error("Invalid session data");
    }

    // Update UI with user data
    const usernameEl = document.getElementById("username");
    const firstNameEl = document.getElementById("firstName");

    if (usernameEl) {
      usernameEl.textContent = data.user.name;
    }

    if (firstNameEl) {
      firstNameEl.textContent = data.user.name.split(" ")[0];
    }

  } catch (error) {
    console.warn("Auth failed:", error.message);
    window.location.href = "loginPage.html";
  }
}

// Run auth check on page load
loadUser();


// =======================================
// LOGOUT
// =======================================
function logoutUser() {
  fetch("/logout", {
    method: "GET",
    credentials: "include"
  })
  .finally(() => {
    window.location.href = "loginPage.html";
  });
}
