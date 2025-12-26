// Fade-in on scroll
const sections = document.querySelectorAll('.fade-section');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.15 });

sections.forEach(section => observer.observe(section));

// Dynamic username (frontend demo)
const userName = "Yashrajsinh"; // later from backend
document.getElementById("userName").innerText = userName;
