"use strict";

// عناصر الموقع
const intro = document.getElementById("intro");
const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");
const toast = document.getElementById("toast");

let previousPage = "home";
let toastTimer;

// سنة حقوق النشر
document.getElementById("year").textContent = new Date().getFullYear();

// شاشة البداية
window.addEventListener("load", () => {
    setTimeout(() => {
        intro.classList.add("hide");
    }, 1700);
});

// القائمة في الهاتف
menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
});

// إغلاق القائمة بعد اختيار رابط
navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    });
});

// فتح صفحة داخل الموقع
function openPage(pageId) {
    const current = document.querySelector(".page.active-page");

    if (current && current.id !== pageId) {
        previousPage = current.id;
    }

    document.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active-page");
    });

    const target = document.getElementById(pageId);

    if (!target) {
        showToast("تعذر فتح الصفحة المطلوبة.");
        return;
    }

    target.classList.add("active-page");

    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// الرجوع إلى الصفحة السابقة
function goBack() {
    const current = document.querySelector(".page.active-page");

    if (current && current.id !== "home" && previousPage !== current.id) {
        const targetId = previousPage;
        showHome();

        if (targetId !== "home" && document.getElementById(targetId)) {
            previousPage = "home";
        }

        return;
    }

    showHome();
}

// العودة إلى الرئيسية
function showHome() {
    document.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active-page");
    });

    document.getElementById("home").classList.add("active-page");

    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");

    previousPage = "home";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// النزول إلى بطاقات الخدمات
function scrollToFeatures() {
    const features = document.getElementById("features");

    if (document.getElementById("home").classList.contains("active-page")) {
        features.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } else {
        showHome();

        setTimeout(() => {
            features.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 150);
    }
}

// قيم الحساسية المقترحة
const sensitivityProfiles = {
    balanced: {
        high: [190, 185, 175, 160, 135, 110],
        medium: [175, 170, 160, 145, 120, 100],
        low: [155, 150, 140, 125, 105, 85]
    },

    powerful: {
        high: [195, 190, 180, 165, 140, 115],
        medium: [180, 175, 165, 150, 125, 105],
        low: [160, 155, 145, 130, 110, 90]
    },

    s23: {
        high: [195, 190, 180, 165, 140, 115],
        medium: [180, 175, 165, 150, 125, 105],
        low: [160, 155, 145, 130, 110, 90]
    },

    iphone: {
        high: [190, 185, 175, 160, 135, 110],
        medium: [175, 170, 160, 145, 120, 100],
        low: [155, 150, 140, 125, 105, 85]
    },

    other: {
        high: [185, 180, 170, 155, 130, 105],
        medium: [170, 165, 155, 140, 115, 95],
        low: [150, 145, 135, 120, 100, 80]
    }
};

const sensitivityNames = [
    "عام",
    "النقطة الحمراء",
    "منظار 2x",
    "منظار 4x",
    "منظار القناصة",
    "النظرة الحرة"
];

// إنشاء الحساسية
function generateSensitivity() {
    const device = document.getElementById("device").value;
    const playStyle = document.getElementById("playStyle").value;
    const level = document.getElementById("sensitivityLevel").value;

    const baseValues = [...sensitivityProfiles[device][level]];

    // تعديل تجريبي بسيط حسب أسلوب اللعب
    let adjustment = 0;

    if (playStyle === "headshot") adjustment = 5;
    if (playStyle === "rush") adjustment = 8;
    if (playStyle === "long") adjustment = -8;

    const values = baseValues.map((value, index) => {
        if (index === 5) {
            return Math.max(0, Math.min(200, value + Math.round(adjustment / 2)));
        }

        return Math.max(0, Math.min(200, value + adjustment));
    });

    const result = document.getElementById("sensitivityResult");
    const container = document.getElementById("sensitivityValues");

    container.replaceChildren();

    values.forEach((value, index) => {
        const row = document.createElement("div");
        row.className = "sensitivity-row";

        const label = document.createElement("div");
        label.className = "row-label";

        const name = document.createElement("span");
        name.textContent = sensitivityNames[index];

        const number = document.createElement("strong");
        number.textContent = String(value);

        label.append(name, number);

        const track = document.createElement("div");
        track.className = "progress-track";

        const fill = document.createElement("div");
        fill.className = "progress-fill";
        fill.style.width = `${(value / 200) * 100}%`;

        track.appendChild(fill);
        row.append(label, track);
        container.appendChild(row);
    });

    result.classList.remove("hidden");

    result.dataset.copyText = sensitivityNames
        .map((name, index) => `${name}: ${values[index]}`)
        .join("\n");

    result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

// نسخ إعدادات الحساسية
async function copySensitivity() {
    const result = document.getElementById("sensitivityResult");

    if (result.classList.contains("hidden") || !result.dataset.copyText) {
        showToast("أنشئ الإعدادات أولاً.");
        return;
    }

    await copyText(result.dataset.copyText, "تم نسخ إعدادات الحساسية.");
}

// نسخ كود HUD
async function copyHUD() {
    const code = document.getElementById("hudCode").textContent;

    const success = await copyText(code, "تم نسخ كود HUD.");

    if (success) {
        const buttonText = document.getElementById("copyHudText");
        buttonText.textContent = "تم النسخ ✓";

        setTimeout(() => {
            buttonText.textContent = "نسخ كود HUD";
        }, 1800);
    }
}

// وظيفة نسخ النصوص
async function copyText(text, successMessage) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const temporary = document.createElement("textarea");
            temporary.value = text;
            temporary.setAttribute("readonly", "");
            temporary.style.position = "fixed";
            temporary.style.opacity = "0";

            document.body.appendChild(temporary);
            temporary.select();

            const copied = document.execCommand("copy");
            temporary.remove();

            if (!copied) {
                throw new Error("Copy failed");
            }
        }

        showToast(successMessage);
        return true;
    } catch (error) {
        showToast("تعذر النسخ تلقائياً. اضغط مطولاً على النص لنسخه.");
        return false;
    }
}

// إشعار مؤقت
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

// دعم زر الرجوع في المتصفح
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (navigation.classList.contains("open")) {
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
        } else {
            showHome();
        }
    }
});