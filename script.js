document.addEventListener("DOMContentLoaded", () => {

// عرض السنة الحالية تلقائيًا
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// إنشاء الجزيئات الذهبية المتحركة
const particlesContainer = document.getElementById("particles");

if (particlesContainer) {
    const particleCount = window.innerWidth < 600 ? 14 : 26;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("span");

        particle.className = "particle";

        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDuration =
            (7 + Math.random() * 10) + "s";

        particle.style.animationDelay =
            (Math.random() * 10) + "s";

        const size = 2 + Math.random() * 2;

        particle.style.width = size + "px";
        particle.style.height = size + "px";

        particlesContainer.appendChild(particle);
    }
}

});
