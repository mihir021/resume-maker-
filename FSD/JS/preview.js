function openResumeScore(id) {
  fetch("/api/resumes/navigation/open", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ view: "score" })
  });

  window.location.href = `/resume-score.html?id=${id}`;
}
