// ===============================
// FAQ TOGGLE
// ===============================
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.classList.toggle("active");
  });
});


// ===============================
// CONTACT FORM SUBMIT (REAL)
// ===============================
document.getElementById("contactForm").addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !subject || !message) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("/api/contact/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        subject,
        message
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Failed to send message");
      return;
    }

    alert("Message sent successfully!");
    e.target.reset();

  } catch (err) {
    console.error("Contact error:", err);
    alert("Mail service unavailable.");
  }
});


// ===============================
// 🤖 ROBOT EYES FOLLOW CURSOR
// ===============================
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


// ===============================
// 🤖 CHATBOT BACKEND INTEGRATION
// ===============================
robot.addEventListener("click", () => {
  const userText = prompt("Ask me something:");

  if (!userText) return;

  fetch("/api/chat/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: userText })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.reply);

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
