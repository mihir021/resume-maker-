// FAQ toggle
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.classList.toggle("active");
  });
});

// Form submit
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Message sent successfully!");
  e.target.reset();
});

/* 🤖 ROBOT EYES FOLLOW CURSOR */
const robot = document.getElementById("robotAssistant");
const pupils = document.querySelectorAll(".pupil");

document.addEventListener("mousemove", e => {
  const rect = robot.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
  const x = Math.cos(angle) * 5;
  const y = Math.sin(angle) * 5;

  pupils.forEach(pupil => {
    pupil.style.transform = `translate(${x}px, ${y}px)`;
  });
});

/* ===============================
   CHATBOT BACKEND INTEGRATION
================================ */

// TEMP chat popup (basic – will enhance later)
robot.addEventListener("click", () => {
  const userText = prompt("Ask me something:");

  if (!userText) return;

  fetch("http://localhost:5000/api/chat/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: userText })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.reply);

      // Handle navigation intent
      if (data.intent === "SCROLL_FAQ") {
        document
          .getElementById("faq")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    })
    .catch(err => {
      console.error("Chatbot error:", err);
      alert("Chat service unavailable.");
    });
});
