document.addEventListener("DOMContentLoaded", function () {
    
    /* -----------------------------------------------------------
     * 1. TEMPLATE PREVIEW SLIDER
     * ----------------------------------------------------------- */
    const templates = [
        "../IMG/template1.png",
        "../IMG/template2.png",
        "../IMG/template3.png",
        "../IMG/template4.png"
    ];

    let index = 0;
    const preview = document.getElementById("resumePreview");

    // Change image every 3 seconds with fade effect
    setInterval(() => {
        if (preview) {
            // Fade out
            preview.style.opacity = "0";
            preview.style.transition = "opacity 0.5s ease";

            setTimeout(() => {
                // Change source
                index = (index + 1) % templates.length;
                preview.src = templates[index];
                
                // Fade in
                preview.style.opacity = "1";
            }, 500); 
        }
    }, 3000);

    /* -----------------------------------------------------------
     * 2. BACK TO TOP BUTTON
     * ----------------------------------------------------------- */
    const backBtn = document.getElementById("backToTop");

    if (backBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 250) {
                backBtn.style.display = "flex";
            } else {
                backBtn.style.display = "none";
            }
        });

        backBtn.onclick = () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };
    }
});