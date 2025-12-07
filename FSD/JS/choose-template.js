let templates = [
    {
        img: "../IMG/template1.png",
        name: "Minimal Elegant",
        desc: "A minimal, polished layout with a soft visual tone."
    },
    {
        img: "../IMG/template2.png",
        name: "Professional Blue",
        desc: "A corporate-friendly design perfect for all industries."
    },
    {
        img: "../IMG/template3.png",
        name: "Classic Resume",
        desc: "A structured layout ideal for ATS screening."
    }
];

let i = 0;

const mainCard = document.querySelector(".main img");
const back1Card = document.querySelector(".back1 img");
const back2Card = document.querySelector(".back2 img");

const nameBox = document.getElementById("tempName");
const descBox = document.getElementById("tempDesc");

function animateTransition(direction) {
    const mainDiv = document.querySelector(".main");

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

function updateCards() {
    mainCard.src = templates[i].img;
    back1Card.src = templates[(i + 1) % templates.length].img;
    back2Card.src = templates[(i + 2) % templates.length].img;

    nameBox.textContent = templates[i].name;
    descBox.textContent = templates[i].desc;
}

document.getElementById("nextBtn").onclick = () => {
    i = (i + 1) % templates.length;
    animateTransition("next");
};

document.getElementById("prevBtn").onclick = () => {
    i = (i - 1 + templates.length) % templates.length;
    animateTransition("prev");
};

/* AUTO ROTATE */
setInterval(() => {
    i = (i + 1) % templates.length;
    animateTransition("next");
}, 6000);

updateCards();
