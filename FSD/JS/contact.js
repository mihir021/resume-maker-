// FAQ toggle (smooth, no lag)
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.classList.toggle("active");
  });
});

// Back to top button
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    toTop.style.display = "block";
    toTop.style.opacity = "1";
  } else {
    toTop.style.opacity = "0";
    toTop.style.display = "none";
  }
});

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Form submit
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Message sent successfully!");
  e.target.reset();
});
