// Fade-in animation
const sections = document.querySelectorAll('.fade-section');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.15 });

sections.forEach(section => observer.observe(section));

// Fetch logged-in user
fetch("http://127.0.0.1:5000/api/me", {
  credentials: "include"
})
.then(res => {
  if (!res.ok) throw new Error("Not logged in");
  return res.json();
})
.then(data => {
  document.getElementById("username").textContent = data.name;
  document.getElementById("firstName").textContent = data.name.split(" ")[0];
})
.catch(() => {
  window.location.href = "loginPage.html";
});

function logoutUser() {
  fetch("http://127.0.0.1:5000/logout", {
    method: "POST",
    credentials: "include"
  }).then(() => {
    window.location.href = "loginPage.html";
  });
}
