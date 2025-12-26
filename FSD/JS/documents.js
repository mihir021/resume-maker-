// Fade-in section
const sections = document.querySelectorAll('.fade-section');
const cards = document.querySelectorAll('.fade-card');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.15 });

sections.forEach(sec => observer.observe(sec));
cards.forEach(card => observer.observe(card));
