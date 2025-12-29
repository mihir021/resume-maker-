/* ===============================
   CONFIG (SAFE LOCAL SETUP)
================================ */

// Change this ONLY when deploying
const API_BASE = "http://127.0.0.1:5000";

/* ===============================
   FAQ TOGGLE
================================ */

document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.classList.toggle("active");
  });
});

/* ===============================
   CONTACT FORM (UI ONLY)
================================ */

document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Message sent successfully!");
  e.target.reset();
});

/* ===============================
   🤖 ROBOT EYES FOLLOW CURSOR
================================ */

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
   🤖 CHATBOT BACKEND INTEGRATION
================================ */

robot.addEventListener("click", async () => {
  const userText = prompt("Ask me something about this website:");

  if (!userText || !userText.trim()) return;

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userText })
    });

    // 🔒 Rate limit handling
    if (res.status === 429) {
      alert("Too many requests. Please wait a moment.");
      return;
    }

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    alert(data.reply || "No response from bot.");

    // 🔁 Handle intent-based navigation
    if (data.intent === "SCROLL_FAQ") {
      document
        .getElementById("faq")
        ?.scrollIntoView({ behavior: "smooth" });
    }

  } catch (err) {
    console.error("Chatbot error:", err);
    alert("Chat service unavailable. Please try again later.");
  }
});
