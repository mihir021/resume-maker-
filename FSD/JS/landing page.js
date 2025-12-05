// TEMPLATE ANIMATION
let templates = [
  "../IMG/template1.png",
  "../IMG/template2.png",
  "../IMG/template3.png",
  "../IMG/template4.png"
];

let index = 0;
const preview = document.getElementById("resumePreview");

setInterval(() => {
  preview.style.opacity = 0;

  setTimeout(() => {
    index = (index + 1) % templates.length;
    preview.src = templates[index];
    preview.style.opacity = 1;
  }, 500);

}, 3000);

// BACK TO TOP
const backBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  backBtn.style.display = window.scrollY > 250 ? "flex" : "none";
});

backBtn.onclick = () =>
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
