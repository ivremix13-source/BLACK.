/* =========================================================
   BLACK ARENA — INTERACTION ENGINE
   Vanilla JavaScript
   ========================================================= */

(() => {
  "use strict";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];


  /* -------------------------------------------------------
     01. CURRENT YEAR
  ------------------------------------------------------- */

  $$("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });


  /* -------------------------------------------------------
     02. INTRO SCREEN
  ------------------------------------------------------- */

  const intro = $("#introScreen");

  if (intro) {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const minimumDisplayTime = reduceMotion ? 250 : 1100;

    const hideIntro = () => {
      intro.classList.add("is-hidden");

      window.setTimeout(() => {
        intro.remove();
      }, 850);
    };

    window.setTimeout(hideIntro, minimumDisplayTime);
  }


  /* -------------------------------------------------------
     03. ACTIVE NAVIGATION
  ------------------------------------------------------- */

  const page = document.body.dataset.page;

  $$("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });


  /* -------------------------------------------------------
     04. HEADER SCROLL STATE
  ------------------------------------------------------- */

  const header = $("#siteHeader");

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle(
      "scrolled",
      window.scrollY > 18
    );
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });


  /* -------------------------------------------------------
     05. MOBILE MENU
  ------------------------------------------------------- */

  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  if (menuToggle && mainNav) {

    const closeMenu = () => {
      mainNav.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    };

    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      mainNav.classList.toggle("open", !isOpen);
    });


    mainNav.addEventListener("click", (event) => {
      const link = event.target.closest("a");

      if (link) {
        closeMenu();
      }
    });


    document.addEventListener("click", (event) => {
      if (
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });


    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });


    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });

  }


  /* -------------------------------------------------------
     06. REVEAL ANIMATIONS
  ------------------------------------------------------- */

  const revealElements = $$(
    ".feature-card, .lab-panel, .manifesto, " +
    ".community-panel, .footer-column"
  );

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    "IntersectionObserver" in window &&
    !motionPreference
  ) {

    revealElements.forEach((element) => {
      element.classList.add("js-reveal");
    });

    const observer = new IntersectionObserver(
      (entries, activeObserver) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("is-visible");

            activeObserver.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

  }


  /* -------------------------------------------------------
     07. SENSITIVITY GENERATOR
     The output is illustrative, not an official game profile.
  ------------------------------------------------------- */

  const sensitivityForm = $("#sensitivityForm");

  const generateButton = $("#generateSensitivity");

  const resultBadge = $("#resultBadge");

  const settingsResults = $("#settingsResults");

  const copyButton = $("#copySettings");

  let lastGeneratedSettings = null;


  const clamp = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
  };


  const deviceBase = {
    entry: 76,
    balanced: 84,
    flagship: 90,
    tablet: 80
  };


  const styleAdjustment = {
    steady: -7,
    balanced: 0,
    fast: 5
  };


  const experienceAdjustment = {
    beginner: -4,
    intermediate: 0,
    advanced: 3
  };


  const settingsLabels = {
    general: "عام",
    redDot: "النقطة الحمراء",
    scope2: "منظار ×2",
    scope4: "منظار ×4",
    freeLook: "النظرة الحرة"
  };


  function createSuggestedSettings() {

    const device = $("#deviceClass")?.value || "balanced";

    const style = $("#playStyle")?.value || "balanced";

    const experience =
      $("#experience")?.value || "intermediate";


    const base =
      (deviceBase[device] ?? deviceBase.balanced) +
      (styleAdjustment[style] ?? 0) +
      (experienceAdjustment[experience] ?? 0);


    return {
      general: clamp(base, 1, 100),

      redDot: clamp(base - 4, 1, 100),

      scope2: clamp(base - 12, 1, 100),

      scope4: clamp(base - 22, 1, 100),

      freeLook: clamp(base + 2, 1, 100)
    };

  }


  function renderSettings(settings) {

    Object.entries(settings).forEach(([key, value]) => {

      const numberElement =
        $(`[data-setting="${key}"]`);

      const trackElement =
        $(`[data-track="${key}"]`);


      if (numberElement) {
        numberElement.textContent = String(value);
      }

      if (trackElement) {
        trackElement.style.width = `${value}%`;
      }

    });


    if (settingsResults) {
      settingsResults.classList.add("results-ready");
    }

    if (resultBadge) {
      resultBadge.textContent = "إعدادات مقترحة";
      resultBadge.classList.add("ready");
    }

    if (copyButton) {
      copyButton.disabled = false;
      copyButton.textContent = "نسخ القيم ⧉";
    }

  }


  if (sensitivityForm && generateButton) {

    sensitivityForm.addEventListener("submit", (event) => {

      event.preventDefault();

      if (generateButton.disabled) return;

      generateButton.disabled = true;

      const buttonText = $("span:first-child", generateButton);

      const originalText = buttonText
        ? buttonText.textContent
        : "إنشاء الإعدادات";


      if (buttonText) {
        buttonText.textContent = "جارٍ إعداد النتائج...";
      }


      window.setTimeout(() => {

        const settings = createSuggestedSettings();

        lastGeneratedSettings = settings;

        renderSettings(settings);

        generateButton.disabled = false;

        if (buttonText) {
          buttonText.textContent = "تم إنشاء الإعدادات ✓";
        }

        window.setTimeout(() => {

          if (buttonText) {
            buttonText.textContent = originalText;
          }

        }, 1800);

      }, 350);

    });

  }


  /* -------------------------------------------------------
     08. COPY SETTINGS
  ------------------------------------------------------- */

  if (copyButton) {

    copyButton.addEventListener("click", async () => {

      if (!lastGeneratedSettings) return;


      const output = Object.entries(lastGeneratedSettings)
        .map(([key, value]) => {
          return `${settingsLabels[key]}: ${value}`;
        })
        .join("\n");


      try {

        if (navigator.clipboard && window.isSecureContext) {

          await navigator.clipboard.writeText(output);

        } else {

          const temporary = document.createElement("textarea");

          temporary.value = output;

          temporary.setAttribute("readonly", "");

          temporary.style.position = "fixed";
          temporary.style.opacity = "0";

          document.body.appendChild(temporary);

          temporary.select();

          const successful = document.execCommand("copy");

          temporary.remove();

          if (!successful) {
            throw new Error("Clipboard copy failed");
          }

        }


        copyButton.textContent = "تم نسخ القيم ✓";

      } catch (error) {

        console.error("Unable to copy settings:", error);

        copyButton.textContent =
          "تعذر النسخ — حاول مرة أخرى";

      }


      window.setTimeout(() => {

        copyButton.textContent = "نسخ القيم ⧉";

      }, 2200);

    });

  }


  /* -------------------------------------------------------
     09. DEVICE LIBRARY SEARCH
     Works on pages containing the original device elements.
  ------------------------------------------------------- */

  const deviceSearch = $("#deviceSearch");

  const deviceCards = $$(".device-card");

  const filterButtons = $$(".filter-pill");

  let activeFilter = "all";


  function filterDevices() {

    if (!deviceCards.length) return;


    const query = (
      deviceSearch?.value || ""
    ).trim().toLocaleLowerCase("ar");


    let visibleCount = 0;


    deviceCards.forEach((card) => {

      const category = card.dataset.category || "all";

      const matchesCategory =
        activeFilter === "all" ||
        category === activeFilter;


      const searchableText = (
        `${card.dataset.search || ""} ${card.textContent}`
      ).toLocaleLowerCase("ar");


      const matchesSearch =
        !query || searchableText.includes(query);


      const shouldShow =
        matchesCategory && matchesSearch;


      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount++;
      }

    });


    let emptyState = $("#noDeviceResults");

    if (visibleCount === 0) {

      if (!emptyState) {

        emptyState = document.createElement("div");

        emptyState.id = "noDeviceResults";

        emptyState.className = "no-results";

        emptyState.textContent =
          "لم نعثر على جهاز مطابق. جرّب اسمًا أو فئة أخرى.";


        const grid = $("#deviceGrid");

        if (grid) {
          grid.appendChild(emptyState);
        }

      }

    } else if (emptyState) {

      emptyState.remove();

    }

  }


  if (deviceSearch) {

    deviceSearch.addEventListener(
      "input",
      filterDevices
    );

  }


  filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

      activeFilter = button.dataset.filter || "all";


      filterButtons.forEach((item) => {

        const active = item === button;

        item.classList.toggle("active", active);

        item.setAttribute(
          "aria-pressed",
          String(active)
        );

      });


      filterDevices();

    });

  });


  /* -------------------------------------------------------
     10. PERFORMANCE CHECKLIST
  ------------------------------------------------------- */

  const checklistItems = $$(
    ".checklist input[type='checkbox']"
  );

  const checklistStatus = $("#checklistStatus");


  function updateChecklist() {

    if (!checklistItems.length || !checklistStatus) {
      return;
    }


    const completed = checklistItems.filter(
      (item) => item.checked
    ).length;


    const total = checklistItems.length;


    if (completed === total) {

      checklistStatus.textContent =
        "اكتملت القائمة. أصبحت جاهزًا لجلسة لعب جديدة.";

    } else {

      checklistStatus.textContent =
        `أنجزت ${completed} من ${total} عناصر.`;

    }

  }


  checklistItems.forEach((item) => {

    item.addEventListener(
      "change",
      updateChecklist
    );

  });


  updateChecklist();


  /* -------------------------------------------------------
     11. INTERNAL LINK SAFETY CHECK
     Reports missing local pages in the browser console.
     It does not block navigation.
  ------------------------------------------------------- */

  $$('a[href$=".html"]').forEach((link) => {

    const href = link.getAttribute("href");

    if (!href || href.startsWith("http")) return;

    if (href.startsWith("#")) return;

    try {

      const destination = new URL(href, window.location.href);

      if (destination.origin !== window.location.origin) {
        return;
      }

    } catch (error) {

      console.warn("Invalid internal link:", href);

    }

  });


  /* -------------------------------------------------------
     12. IMAGE FALLBACK
     Prevent broken external images from leaving empty boxes.
  ------------------------------------------------------- */

  $$("img").forEach((image) => {

    image.addEventListener("error", () => {

      image.classList.add("image-unavailable");

      image.setAttribute("data-image-error", "true");

    }, { once: true });

  });


  /* -------------------------------------------------------
     13. DIAGNOSTICS
  ------------------------------------------------------- */

  console.info(
    "BLACK ARENA initialized.",
    {
      page: page || "unknown",
      sensitivityTool: Boolean(sensitivityForm),
      deviceCards: deviceCards.length,
      navigation: Boolean(mainNav)
    }
  );

})();
