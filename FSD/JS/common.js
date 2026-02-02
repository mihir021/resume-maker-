function goBack() {
  fetch("/api/resumes/navigation/back", {
    method: "POST"
  })
    .then(res => res.json())
    .then(data => {
      if (data.current === "preview") {
        window.location.href = "/preview.html";
      } else {
        window.location.href = "/documents.html";
      }
    });
}
