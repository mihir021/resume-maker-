/* ===================================================== */
/* ================= TEMPLATE DATA ===================== */
/* ===================================================== */

const templates = [
  {
    key: "academicYellow",
    img: "../IMG/template1.png",
    name: "Professional",
    desc: "A clean professional layout suitable for all roles."
  },
  {
    key: "professionalBlue",
    img: "../IMG/template2.png",
    name: "Modern",
    desc: "A modern design with strong visual hierarchy."
  },
  {
    key: "minimalElegant",
    img: "../IMG/template3.png",
    name: "Creative",
    desc: "A creative layout for designers and innovators."
  }
];

let i = 0;

/* ===================================================== */
/* ================= DOM ELEMENTS ====================== */
/* ===================================================== */

const mainCard = document.querySelector(".main img");
const back1Card = document.querySelector(".back1 img");
const back2Card = document.querySelector(".back2 img");

const nameBox = document.getElementById("tempName");
const descBox = document.getElementById("tempDesc");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

/* ===================================================== */
/* ================= SAFETY CHECK ====================== */
/* ===================================================== */

const carouselReady =
  mainCard && back1Card && back2Card && nameBox && descBox;

/* ===================================================== */
/* ================= UPDATE CARDS ====================== */
/* ===================================================== */

function updateCards() {
  if (!carouselReady) return;

  mainCard.src = templates[i].img;
  back1Card.src = templates[(i + 1) % templates.length].img;
  back2Card.src = templates[(i + 2) % templates.length].img;

  nameBox.textContent = templates[i].name;
  descBox.textContent = templates[i].desc;
}

/* ===================================================== */
/* ================= ANIMATION ========================= */
/* ===================================================== */

function animateTransition(direction) {
  if (!carouselReady) return;

  const mainDiv = document.querySelector(".main");
  if (!mainDiv) return;

  if (direction === "next") {
    mainDiv.classList.add("slide-out-left");
  } else {
    mainDiv.classList.add("slide-in-right");
  }

  setTimeout(() => {
    updateCards();

    mainDiv.classList.remove("slide-out-left", "slide-in-right");
    mainDiv.classList.add("active");

    setTimeout(() => {
      mainDiv.classList.remove("active");
    }, 400);
  }, 300);
}

/* ===================================================== */
/* ================= NAV BUTTONS ======================= */
/* ===================================================== */

if (nextBtn && prevBtn && carouselReady) {
  nextBtn.onclick = () => {
    i = (i + 1) % templates.length;
    animateTransition("next");
  };

  prevBtn.onclick = () => {
    i = (i - 1 + templates.length) % templates.length;
    animateTransition("prev");
  };
}

/* ===================================================== */
/* ================= AUTO ROTATE ======================= */
/* ===================================================== */

if (carouselReady) {
  setInterval(() => {
    i = (i + 1) % templates.length;
    animateTransition("next");
  }, 6000);
}

/* ===================================================== */
/* ================= INITIAL LOAD ====================== */
/* ===================================================== */

updateCards();

/* ===================================================== */
/* ========== TEMPLATE SELECTION (IMPORTANT) ============ */
/* ===================================================== */

document.querySelectorAll(".use-btn").forEach((btn, index) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedTemplate = templates[index].key;

    console.log("Template selected:", selectedTemplate);

    // Save selected template
    localStorage.setItem("selectedTemplate", selectedTemplate);

    // Optional: clear previous resume data
    localStorage.removeItem("step1");
    localStorage.removeItem("experiences");
    localStorage.removeItem("education");
    localStorage.removeItem("skills");

    // Go to Step-1
    window.location.href = "step-1.html";
  });
});
