/* BLACK ARENA — lightweight front-end interactions.
   Static HTML/CSS/JS only: no accounts, database, or secret keys are used. */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Mark the active navigation item using the page id on <body>.
  const page = document.body.dataset.page;
  $$("[data-nav]").forEach(link => {
    if (link.dataset.nav === page) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Mobile navigation.
  const menuToggle = $(".menu-toggle");
  const nav = $(".main-nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "×" : "☰";
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
        menuToggle.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 780 && nav.classList.contains("open")) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      }
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      }
    });
  }

  // Current year in the footer.
  $$("[data-year]").forEach(node => node.textContent = String(new Date().getFullYear()));

  // Progressive reveal for sections/cards. The page remains readable if JS is unavailable.
  const revealTargets = $$(".feature-card, .info-card, .device-card, .guide-card, .tool-panel, .showcase, .community-band");
  if ("IntersectionObserver" in window) {
    revealTargets.forEach(el => el.classList.add("reveal"));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealTargets.forEach(el => observer.observe(el));
  }

  // Sensitivity suggestion builder: illustrative values only, never presented as guaranteed.
  const generateButton = $("#generateSensitivity");
  if (generateButton) {
    const values = {
      general: $("[data-setting='general']"),
      redDot: $("[data-setting='redDot']"),
      scope2: $("[data-setting='scope2']"),
      scope4: $("[data-setting='scope4']"),
      freeLook: $("[data-setting='freeLook']")
    };
    const tracks = $$(".setting-results .setting-track i, #settingsResults .setting-track i");
    const baseByDevice = { entry: 78, balanced: 88, flagship: 94, tablet: 82 };
    const styleAdjust = { balanced: 0, fast: 5, steady: -6 };
    const experienceAdjust = { beginner: -5, intermediate: 0, advanced: 3 };
    generateButton.addEventListener("click", () => {
      if (generateButton.disabled) return;
      const device = $("#deviceClass")?.value || "balanced";
      const style = $("#playStyle")?.value || "balanced";
      const experience = $("#experience")?.value || "beginner";
      const base = baseByDevice[device] + styleAdjust[style] + experienceAdjust[experience];
      const result = {
        general: clamp(base, 1, 100),
        redDot: clamp(base - 4, 1, 100),
        scope2: clamp(base - 12, 1, 100),
        scope4: clamp(base - 22, 1, 100),
        freeLook: clamp(base + 2, 1, 100)
      };
      Object.entries(result).forEach(([key, value]) => {
        if (values[key]) values[key].textContent = value;
      });
      tracks.forEach((track, index) => {
        const key = Object.keys(result)[index];
        if (key) {
          track.style.width = `${result[key]}%`;
          track.setAttribute("aria-hidden", "true");
        }
      });
      const results = $("#settingsResults");
      if (results) {
        results.classList.add("results-ready");
        results.setAttribute("aria-label", "الإعدادات المقترحة جاهزة");
      }
      generateButton.innerHTML = "تم إنشاء نقطة البداية <span aria-hidden=\"true\">✓</span>";
      generateButton.disabled = true;
      window.setTimeout(() => {
        generateButton.innerHTML = "إنشاء إعدادات مقترحة <span aria-hidden=\"true\">↗</span>";
        generateButton.disabled = false;
      }, 1400);
    });
  }

  // Device search + category filter.
  const deviceSearch = $("#deviceSearch");
  const deviceCards = $$(".device-card");
  const filterButtons = $$(".filter-pill");
  let activeFilter = "all";
  function filterDevices() {
    if (!deviceCards.length) return;
    const query = (deviceSearch?.value || "").trim().toLocaleLowerCase("ar");
    let visible = 0;
    deviceCards.forEach(card => {
      const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const searchable = `${card.dataset.search || ""} ${card.textContent}`.toLocaleLowerCase("ar");
      const matchesQuery = !query || searchable.includes(query);
      const show = matchesCategory && matchesQuery;
      card.hidden = !show;
      if (show) visible++;
    });
    let empty = $("#noDeviceResults");
    if (!visible) {
      if (!empty) {
        empty = document.createElement("div");
        empty.id = "noDeviceResults";
        empty.className = "no-results";
        empty.setAttribute("role", "status");
        empty.textContent = "لم نعثر على نتيجة مطابقة. جرّب كلمة أخرى.";
        $("#deviceGrid")?.appendChild(empty);
      }
    } else if (empty) empty.remove();
  }
  deviceSearch?.addEventListener("input", filterDevices);
  filterButtons.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    filterDevices();
  }));

  // Performance checklist progress.
  const checklist = $$(".checklist input[type='checkbox']");
  const checklistStatus = $("#checklistStatus");
  function updateChecklist() {
    if (!checklist.length || !checklistStatus) return;
    const done = checklist.filter(item => item.checked).length;
    checklistStatus.textContent = done === checklist.length
      ? "اكتملت القائمة — نتمنى لك جلسة مريحة!"
      : `أنجزت ${done} من ${checklist.length} عناصر.`;
  }
  checklist.forEach(item => item.addEventListener("change", updateChecklist));
  updateChecklist();

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
})();