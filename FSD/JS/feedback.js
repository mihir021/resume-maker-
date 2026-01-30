document.getElementById("feedbackForm").addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("fbName").value.trim();
  const email = document.getElementById("fbEmail").value.trim();
  const rating = document.getElementById("rating").value;
  const message = document.getElementById("fbMessage").value.trim();

  if (!name || !email || !rating || !message) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, rating, message })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Failed to submit feedback");
      return;
    }

    alert("Thank you for your feedback!");
    e.target.reset();

  } catch (err) {
    console.error(err);
    alert("Server unavailable");
  }
});