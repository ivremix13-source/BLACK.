/* ==================================================
   BLACK ARENA — MAIN JAVASCRIPT
   Free Fire Gaming & Device Explorer
   ================================================== */

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

/* =========================
   1. NOTIFICATIONS
========================= */

const toast = (message) => {
  const el = $("#toast");

  if (!el) return;

  el.textContent = message;
  el.classList.add("show");

  clearTimeout(window.__toastTimer);

  window.__toastTimer = setTimeout(() => {
    el.classList.remove("show");
  }, 2800);
};

/* =========================
   2. LOADING SCREEN
========================= */

window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = $("#loader");

    if (loader) {
      loader.classList.add("done");
    }
  }, 1250);
});

/* =========================
   3. PAGE NAVIGATION
========================= */

const pages = {
  home: "الرئيسية",
  sensitivity: "مختبر الحساسية",
  devices: "مكتبة الأجهزة",
  finder: "اختر هاتفك",
  performance: "تحسين الأداء"
};

function navigate(page) {
  if (!pages[page]) return;

  $$(".page").forEach((element) => {
    element.classList.toggle(
      "active",
      element.id === `page-${page}`
    );
  });

  $$(".nav-item").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.page === page
    );
  });

  const title = $("#crumbTitle");

  if (title) {
    title.textContent = pages[page];
  }

  const sidebar = $("#sidebar");

  if (sidebar) {
    sidebar.classList.remove("open");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (page === "devices") {
    renderDevices();
  }
}

$$("[data-page]").forEach((element) => {
  element.addEventListener("click", () => {
    navigate(element.dataset.page);
  });
});

/* =========================
   4. MOBILE MENU
========================= */

const mobileMenu = $("#mobileMenu");

if (mobileMenu) {
  mobileMenu.addEventListener("click", () => {
    $("#sidebar")?.classList.toggle("open");
  });
}

/* =========================
   5. SITE INFORMATION
========================= */

const themeHint = $("#themeHint");

if (themeHint) {
  themeHint.addEventListener("click", () => {
    toast(
      "BLACK ARENA — منصة إعدادات وأجهزة للاعبي Free Fire."
    );
  });
}

/* =========================
   6. QUICK SENSITIVITY
========================= */

let quickStyle = "balanced";

$$(".quick-option").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".quick-option").forEach((item) => {
      item.classList.remove("selected");
    });

    button.classList.add("selected");

    quickStyle = button.dataset.style;

    const styleSelect = $("#sensStyle");

    if (styleSelect) {
      styleSelect.value = quickStyle;
    }
  });
});

const quickGenerate = $("#quickGenerate");

if (quickGenerate) {
  quickGenerate.addEventListener("click", () => {
    $("#sensStyle").value = quickStyle;

    navigate("sensitivity");

    generateSensitivity();
  });
}

/* =========================
   7. SENSITIVITY PROFILES
========================= */

let grip = "two";

$$$("#sensGrip button");

$$('#sensGrip button').forEach((button) => {
  button.addEventListener("click", () => {
    $$("#sensGrip button").forEach((item) => {
      item.classList.remove("selected");
    });

    button.classList.add("selected");

    grip = button.dataset.grip;
  });
});

/*
  Values are starting suggestions.
  They are not official or guaranteed settings.
*/

const baseProfiles = {
  balanced: [165, 155, 145, 130, 85, 150],

  rush: [185, 178, 165, 150, 95, 165],

  precision: [145, 135, 125, 110, 72, 135],

  sniper: [130, 120, 110, 95, 60, 125]
};

const styleNames = {
  balanced: "متوازن",
  rush: "هجومي",
  precision: "دقيق",
  sniper: "قنص"
};

/* =========================
   8. GENERATE SENSITIVITY
========================= */

function generateSensitivity() {
  const styleSelect = $("#sensStyle");
  const deviceSelect = $("#sensDevice");
  const experienceSlider = $("#sensExperience");

  if (!styleSelect || !deviceSelect || !experienceSlider) {
    return;
  }

  const style = styleSelect.value;

  const device = deviceSelect.value;

  const experience = Number(experienceSlider.value);

  let values = [
    ...(baseProfiles[style] || baseProfiles.balanced)
  ];

  const deviceOffset = {
    balanced: 0,
    low: 5,
    high: -4,
    tablet: -12
  }[device] || 0;

  const experienceOffset = (3 - experience) * 3;

  values = values.map((value, index) => {
    let adjusted =
      value +
      deviceOffset +
      experienceOffset;

    if (grip === "four") {
      adjusted += 3;
    } else if (grip === "three") {
      adjusted += 1;
    }

    if (index === 4 && experience > 3) {
      adjusted -= (experience - 3) * 2;
    }

    return Math.max(
      20,
      Math.min(200, adjusted)
    );
  });

  $$(".sens-row input").forEach((input, index) => {
    input.value = values[index];

    input.dispatchEvent(
      new Event("input")
    );
  });

  const resultTitle = $("#resultTitle");

  if (resultTitle) {
    resultTitle.textContent =
      `ملف ${styleNames[style] || "متوازن"}`;
  }

  const deviceNames = {
    low: "اقتصادي",
    high: "قوي للألعاب",
    tablet: "لوحي",
    balanced: "متوسط أو غير محدد"
  };

  const resultDesc = $("#resultDesc");

  if (resultDesc) {
    resultDesc.textContent =
      `بداية مقترحة لجهاز ${
        deviceNames[device] || deviceNames.balanced
      } — عدّل القيم بعد التجربة.`;
  }

  const resultState = $("#resultState");

  if (resultState) {
    resultState.textContent = "تم إنشاء الإعداد";
  }

  const feedback = $("#sensFeedback");

  if (feedback) {
    feedback.textContent =
      "تم إنشاء قيم بداية قابلة للتعديل. اختبرها في التدريب.";
  }

  toast(
    "تم إنشاء إعدادات البداية. يمكنك تعديل أي قيمة يدوياً."
  );
}

/* =========================
   9. SENSITIVITY SLIDERS
========================= */

$$(".sens-row input").forEach((input) => {
  input.addEventListener("input", () => {
    const output = input.nextElementSibling;

    if (output) {
      output.value = input.value;
    }
  });
});

const generateButton = $("#generateSens");

if (generateButton) {
  generateButton.addEventListener(
    "click",
    generateSensitivity
  );
}

/* =========================
   10. RESET SENSITIVITY
========================= */

const resetButton = $("#resetSens");

if (resetButton) {
  resetButton.addEventListener("click", () => {
    const style = $("#sensStyle")?.value || "balanced";

    const values =
      baseProfiles[style] || baseProfiles.balanced;

    $$(".sens-row input").forEach((input, index) => {
      input.value = values[index];

      input.dispatchEvent(
        new Event("input")
      );
    });

    const state = $("#resultState");

    if (state) {
      state.textContent = "تمت إعادة الضبط";
    }

    toast("أُعيدت القيم إلى الملف الأساسي.");
  });
}

/* =========================
   11. SAVE SENSITIVITY
========================= */

const saveButton = $("#saveSens");

if (saveButton) {
  saveButton.addEventListener("click", () => {
    const saved = {
      style: $("#sensStyle")?.value || "balanced",

      device: $("#sensDevice")?.value || "balanced",

      grip: grip,

      values: $$(".sens-row input").map((input) =>
        Number(input.value)
      ),

      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(
        "blackArenaSensitivity",
        JSON.stringify(saved)
      );

      toast(
        "تم حفظ إعداداتك على هذا الجهاز والمتصفح."
      );

    } catch (error) {
      toast(
        "تعذر الحفظ في المتصفح الحالي."
      );
    }
  });
}

/* =========================
   12. COPY SENSITIVITY
========================= */

const copyButton = $("#copySens");

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const values = $$(".sens-row").map((row) => {
      const label = $("div span", row);
      const input = $("input", row);

      return `${label?.textContent || "الإعداد"}: ${input?.value || 0}`;
    }).join("\n");

    const text =
      `BLACK ARENA — إعدادات البداية\n${values}`;

    try {
      await navigator.clipboard.writeText(text);

      toast("تم نسخ القيم.");

    } catch (error) {
      const feedback = $("#sensFeedback");

      if (feedback) {
        feedback.textContent = values;
      }

      toast(
        "تعذر النسخ التلقائي؛ ظهرت القيم أسفل الإعدادات."
      );
    }
  });
}

/* =========================
   13. LOAD SAVED SETTINGS
========================= */

try {
  const saved = JSON.parse(
    localStorage.getItem("blackArenaSensitivity") || "null"
  );

  if (saved && Array.isArray(saved.values)) {
    saved.values.forEach((value, index) => {
      const input = $$(".sens-row input")[index];

      if (input) {
        input.value = value;

        input.dispatchEvent(
          new Event("input")
        );
      }
    });
  }

} catch (error) {
  console.warn(
    "Could not load saved sensitivity settings."
  );
}

/* =========================
   14. DEVICE DATABASE
========================= */

/*
  This is a starter dataset, not a live database.
  Prices are illustrative estimates in USD.
  Specifications may differ by region and model variant.
*/

const devices = [

  {
    name: "Samsung Galaxy A55 5G",
    brand: "Samsung",
    category: "mid",
    price: 350,
    chip: "Exynos 1480",
    ram: "8 GB",
    screen: "120Hz AMOLED",
    battery: "5000 mAh",
    weight: 213,
    camera: "50 MP",
    gaming: 7,
    light: 4,
    cameraScore: 8,
    batteryScore: 8,
    tag: "متوازن"
  },

  {
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    category: "flagship",
    price: 700,
    chip: "Exynos 2400 / Snapdragon 8 Gen 3*",
    ram: "8 GB",
    screen: "120Hz AMOLED",
    battery: "4000 mAh",
    weight: 167,
    camera: "50 MP",
    gaming: 9,
    light: 9,
    cameraScore: 9,
    batteryScore: 7,
    tag: "قوي وصغير"
  },

  {
    name: "Xiaomi Redmi Note 13 Pro 5G",
    brand: "Xiaomi",
    category: "mid",
    price: 280,
    chip: "Snapdragon 7s Gen 2",
    ram: "8 GB",
    screen: "120Hz AMOLED",
    battery: "5100 mAh",
    weight: 187,
    camera: "200 MP",
    gaming: 7,
    light: 7,
    cameraScore: 8,
    batteryScore: 8,
    tag: "قيمة جيدة"
  },

  {
    name: "Xiaomi POCO X6 Pro",
    brand: "Xiaomi",
    category: "mid",
    price: 320,
    chip: "Dimensity 8300-Ultra",
    ram: "8–12 GB",
    screen: "120Hz AMOLED",
    battery: "5000 mAh",
    weight: 186,
    camera: "64 MP",
    gaming: 9,
    light: 7,
    cameraScore: 7,
    batteryScore: 8,
    tag: "أداء ألعاب"
  },

  {
    name: "Xiaomi POCO F6",
    brand: "Xiaomi",
    category: "mid",
    price: 390,
    chip: "Snapdragon 8s Gen 3",
    ram: "8–12 GB",
    screen: "120Hz AMOLED",
    battery: "5000 mAh",
    weight: 179,
    camera: "50 MP",
    gaming: 9,
    light: 8,
    cameraScore: 7,
    batteryScore: 8,
    tag: "قوي للألعاب"
  },

  {
    name: "Apple iPhone 15",
    brand: "Apple",
    category: "flagship",
    price: 650,
    chip: "A16 Bionic",
    ram: "6 GB",
    screen: "60Hz OLED",
    battery: "مواصفات تختلف حسب القياس",
    weight: 171,
    camera: "48 MP",
    gaming: 8,
    light: 9,
    cameraScore: 9,
    batteryScore: 7,
    tag: "مضغوط"
  },

  {
    name: "Apple iPhone 15 Pro",
    brand: "Apple",
    category: "flagship",
    price: 850,
    chip: "A17 Pro",
    ram: "8 GB",
    screen: "120Hz OLED",
    battery: "مواصفات تختلف حسب القياس",
    weight: 187,
    camera: "48 MP",
    gaming: 9,
    light: 7,
    cameraScore: 9,
    batteryScore: 7,
    tag: "أداء رائد"
  },

  {
    name: "Google Pixel 8a",
    brand: "Google",
    category: "mid",
    price: 400,
    chip: "Google Tensor G3",
    ram: "8 GB",
    screen: "120Hz OLED",
    battery: "4492 mAh",
    weight: 188,
    camera: "64 MP",
    gaming: 6,
    light: 7,
    cameraScore: 9,
    batteryScore: 7,
    tag: "كاميرا"
  },

  {
    name: "OnePlus 12R",
    brand: "OnePlus",
    category: "mid",
    price: 500,
    chip: "Snapdragon 8 Gen 2",
    ram: "8–16 GB",
    screen: "120Hz AMOLED",
    battery: "5500 mAh",
    weight: 207,
    camera: "50 MP",
    gaming: 9,
    light: 5,
    cameraScore: 7,
    batteryScore: 9,
    tag: "بطارية وأداء"
  },

  {
    name: "Infinix GT 20 Pro",
    brand: "Infinix",
    category: "mid",
    price: 300,
    chip: "Dimensity 8200 Ultimate",
    ram: "8–12 GB",
    screen: "144Hz AMOLED",
    battery: "5000 mAh",
    weight: 194,
    camera: "108 MP",
    gaming: 8,
    light: 6,
    cameraScore: 7,
    batteryScore: 8,
    tag: "تصميم ألعاب"
  },

  {
    name: "TECNO POVA 6 Pro",
    brand: "TECNO",
    category: "budget",
    price: 220,
    chip: "Dimensity 6080",
    ram: "8–12 GB",
    screen: "120Hz AMOLED",
    battery: "6000 mAh",
    weight: 198,
    camera: "108 MP",
    gaming: 6,
    light: 6,
    cameraScore: 6,
    batteryScore: 9,
    tag: "بطارية كبيرة"
  },

  {
    name: "Samsung Galaxy A15 5G",
    brand: "Samsung",
    category: "budget",
    price: 180,
    chip: "Dimensity 6100+",
    ram: "4–8 GB",
    screen: "90Hz AMOLED",
    battery: "5000 mAh",
    weight: 200,
    camera: "50 MP",
    gaming: 5,
    light: 5,
    cameraScore: 6,
    batteryScore: 8,
    tag: "استخدام يومي"
  },

  {
    name: "Motorola Edge 50 Neo",
    brand: "Motorola",
    category: "mid",
    price: 400,
    chip: "Dimensity 7300",
    ram: "8–12 GB",
    screen: "120Hz pOLED",
    battery: "4310 mAh",
    weight: 171,
    camera: "50 MP",
    gaming: 7,
    light: 9,
    cameraScore: 8,
    batteryScore: 7,
    tag: "خفيف"
  },

  {
    name: "ASUS ROG Phone 8",
    brand: "ASUS",
    category: "flagship",
    price: 950,
    chip: "Snapdragon 8 Gen 3",
    ram: "12–16 GB",
    screen: "165Hz AMOLED",
    battery: "5500 mAh",
    weight: 225,
    camera: "50 MP",
    gaming: 10,
    light: 3,
    cameraScore: 7,
    batteryScore: 9,
    tag: "ألعاب احترافي"
  },

  {
    name: "Redmi 13C",
    brand: "Xiaomi",
    category: "budget",
    price: 120,
    chip: "Helio G85",
    ram: "4–8 GB",
    screen: "90Hz LCD",
    battery: "5000 mAh",
    weight: 192,
    camera: "50 MP",
    gaming: 4,
    light: 6,
    cameraScore: 5,
    batteryScore: 8,
    tag: "اقتصادي"
  },

  {
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "flagship",
    price: 1050,
    chip: "Snapdragon 8 Gen 3 for Galaxy",
    ram: "12 GB",
    screen: "120Hz AMOLED",
    battery: "5000 mAh",
    weight: 232,
    camera: "200 MP",
    gaming: 10,
    light: 2,
    cameraScore: 10,
    batteryScore: 9,
    tag: "رائد شامل"
  }

];

/* =========================
   15. DEVICE PRICE FORMAT
========================= */

const money = (number) =>
  "$" + Number(number).toLocaleString("en-US");

/* =========================
   16. DEVICE CARD
========================= */

function deviceCard(device) {
  return `
    <article class="device-card">

      <div class="device-card-top">
        <span class="device-brand">
          ${device.brand.toUpperCase()}
        </span>

        <span class="device-tag">
          ${device.tag}
        </span>
      </div>

      <div class="device-symbol">▯</div>

      <h3>${device.name}</h3>

      <p class="device-sub">
        ${device.chip}
      </p>

      <div class="spec-grid">

        <div class="spec">
          <small>الشاشة</small>
          <b>${device.screen}</b>
        </div>

        <div class="spec">
          <small>الذاكرة</small>
          <b>${device.ram}</b>
        </div>

        <div class="spec">
          <small>البطارية</small>
          <b>${device.battery}</b>
        </div>

        <div class="spec">
          <small>الوزن</small>
          <b>${device.weight} g</b>
        </div>

      </div>

      <div class="device-tags">
        <span class="device-tag">
          ${device.camera}
        </span>

        <span class="device-tag">
          ${money(device.price)} تقريباً
        </span>
      </div>

      <div class="device-card-actions">

        <button data-details="${device.name}">
          عرض ملخص
        </button>

        <button data-recommend="${device.name}">
          قارن الخيارات
        </button>

      </div>

    </article>
  `;
}

/* =========================
   17. DEVICE SEARCH
========================= */

function renderDevices() {
  const searchInput = $("#deviceSearch");
  const brandSelect = $("#brandFilter");
  const priceSelect = $("#priceFilter");
  const grid = $("#deviceGrid");
  const count = $("#deviceCount");
  const empty = $("#deviceEmpty");

  if (!searchInput || !brandSelect || !priceSelect || !grid) {
    return;
  }

  const query = searchInput.value
    .toLowerCase()
    .trim();

  const brand = brandSelect.value;

  const price = priceSelect.value;

  const filtered = devices.filter((device) => {
    const searchable =
      `${device.name} ${device.brand} ${device.chip}`
        .toLowerCase();

    const matchesSearch =
      !query || searchable.includes(query);

    const matchesBrand =
      brand === "all" || device.brand === brand;

    const matchesPrice =
      price === "all" || device.category === price;

    return (
      matchesSearch &&
      matchesBrand &&
      matchesPrice
    );
  });

  grid.innerHTML = filtered
    .map(deviceCard)
    .join("");

  if (count) {
    count.textContent =
      `${filtered.length} جهاز في القائمة`;
  }

  if (empty) {
    empty.hidden = filtered.length > 0;
  }

  /* Device details */

  $$("[data-details]").forEach((button) => {
    button.addEventListener("click", () => {
      const device = devices.find(
        (item) => item.name === button.dataset.details
      );

      if (!device) return;

      toast(
        `${device.name} — ${device.chip}، ` +
        `${device.ram} RAM، شاشة ${device.screen}. ` +
        "قد تختلف المواصفات حسب النسخة والمنطقة."
      );
    });
  });

  /* Send device to recommendation page */

  $$("[data-recommend]").forEach((button) => {
    button.addEventListener("click", () => {
      const device = devices.find(
        (item) => item.name === button.dataset.recommend
      );

      if (!device) return;

      const budget = $("#budgetRange");

      if (budget) {
        budget.value = Math.max(
          100,
          Math.min(1500, device.price)
        );

        $("#budgetValue").textContent =
          money(budget.value);
      }

      const gamingPriority =
        $('input[name="priority"][value="gaming"]');

      if (gamingPriority) {
        gamingPriority.checked = true;
      }

      navigate("finder");

      showRecommendations();
    });
  });
}

/* =========================
   18. DEVICE BRAND FILTER
========================= */

const brands = [
  ...new Set(devices.map((device) => device.brand))
].sort();

const brandFilter = $("#brandFilter");

if (brandFilter) {
  brands.forEach((brand) => {
    brandFilter.insertAdjacentHTML(
      "beforeend",
      `<option value="${brand}">${brand}</option>`
    );
  });
}

/* =========================
   19. DEVICE FILTER EVENTS
========================= */

const deviceSearch = $("#deviceSearch");
const priceFilter = $("#priceFilter");

if (deviceSearch) {
  deviceSearch.addEventListener(
    "input",
    renderDevices
  );
}

if (brandFilter) {
  brandFilter.addEventListener(
    "change",
    renderDevices
  );
}

if (priceFilter) {
  priceFilter.addEventListener(
    "change",
    renderDevices
  );
}

/* Initial device rendering */

renderDevices();

/* =========================
   20. SMART DEVICE FINDER
========================= */

const budgetRange = $("#budgetRange");

if (budgetRange) {
  budgetRange.addEventListener("input", () => {
    const budgetValue = $("#budgetValue");

    if (budgetValue) {
      budgetValue.textContent =
        money(budgetRange.value);
    }
  });
}

/* =========================
   21. DEVICE RECOMMENDATIONS
========================= */

function showRecommendations() {
  const budgetInput = $("#budgetRange");

  const priorityInput =
    $('input[name="priority"]:checked');

  const recommendations = $("#recommendations");

  if (!budgetInput || !recommendations) {
    return;
  }

  const budget = Number(budgetInput.value);

  const priority = priorityInput
    ? priorityInput.value
    : "gaming";

  let candidates = devices.filter((device) => {
    return device.price <= budget * 1.22;
  });

  if (!candidates.length) {
    candidates = [...devices]
      .sort((a, b) => {
        return (
          Math.abs(a.price - budget) -
          Math.abs(b.price - budget)
        );
      })
      .slice(0, 4);
  }

  function score(device) {
    let preference = device.gaming;

    if (priority === "light") {
      preference = device.light;
    }

    if (priority === "camera") {
      preference = device.cameraScore;
    }

    if (priority === "battery") {
      preference = device.batteryScore;
    }

    const affordability = Math.max(
      0,
      100 -
      Math.abs(device.price - budget) /
      Math.max(100, budget) * 45
    );

    return Math.round(
      preference * 8 +
      affordability * 0.2
    );
  }

  candidates.sort((a, b) => {
    return score(b) - score(a);
  });

  const picks = candidates.slice(0, 4);

  recommendations.innerHTML = picks.map((device) => `
    <div class="recommendation-item">

      <div class="rec-device">▯</div>

      <div class="rec-info">

        <h4>${device.name}</h4>

        <p>
          ${device.chip} ·
          ${device.screen} ·
          ${device.weight} g
        </p>

        <div class="rec-tags">

          <span>
            ${money(device.price)} تقريباً
          </span>

          <span>
            ${device.tag}
          </span>

          <span>
            ${device.ram} RAM
          </span>

        </div>

      </div>

      <div class="rec-score">
        ${score(device)}
        <small>ملاءمة تقريبية</small>
      </div>

    </div>
  `).join("");
}

/* =========================
   22. FIND DEVICES BUTTON
========================= */

const findDevicesButton = $("#findDevices");

if (findDevicesButton) {
  findDevicesButton.addEventListener("click", () => {
    showRecommendations();

    toast(
      "تم ترتيب الخيارات حسب ميزانيتك وأولويتك."
    );
  });
}

/* =========================
   23. PERFORMANCE CHECKLIST
========================= */

$$('#performanceChecklist input').forEach((input) => {
  input.addEventListener("change", () => {
    const done =
      $$('#performanceChecklist input:checked').length;

    const progress = $("#taskProgress");

    if (progress) {
      progress.textContent =
        `${done} / 6 مكتملة`;
    }

    try {
      localStorage.setItem(
        "blackArenaTasks",
        JSON.stringify(
          $$('#performanceChecklist input').map(
            (item) => item.checked
          )
        )
      );
    } catch (error) {
      console.warn(
        "Could not save checklist progress."
      );
    }
  });
});

/* =========================
   24. LOAD CHECKLIST
========================= */

try {
  const tasks = JSON.parse(
    localStorage.getItem("blackArenaTasks") || "[]"
  );

  $$('#performanceChecklist input').forEach(
    (input, index) => {
      input.checked = !!tasks[index];
    }
  );

  const done =
    $$('#performanceChecklist input:checked').length;

  const progress = $("#taskProgress");

  if (progress) {
    progress.textContent =
      `${done} / 6 مكتملة`;
  }

} catch (error) {
  console.warn(
    "Could not load checklist progress."
  );
}

/* =========================
   END OF BLACK ARENA JS
========================= */
