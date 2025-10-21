// script.js
const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

if (container && registerBtn && loginBtn) {
  // Botão "Sign Up" — ativa o modo de registo
  registerBtn.addEventListener("click", () => {
    container.classList.add("active");
  });

  // Botão "Sign In" — volta para o login
  loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
  });
}

// Translations object
const translations = {
  pt: {
    gratis: "Grátis",
    roletas: "Roletas",
    caixas: "Caixas",
    trocas: "Trocas",
    mercado: "Mercado",
    inventario: "Inventário",
    iniciarSessao: "Iniciar Sessão",
    idioma: "Idioma",
    modo: "Modo",
    moeda: "Moeda",
    portugues: "Português",
    espanhol: "Español",
    english: "English",
    escuro: "Escuro",
    claro: "Claro",
  },
  es: {
    gratis: "Gratis",
    roletas: "Ruletas",
    caixas: "Cajas",
    trocas: "Intercambios",
    mercado: "Mercado",
    inventario: "Inventario",
    iniciarSessao: "Iniciar Sesión",
    idioma: "Idioma",
    modo: "Modo",
    moeda: "Moneda",
    portugues: "Portugués",
    espanhol: "Español",
    english: "Inglés",
    escuro: "Oscuro",
    claro: "Claro",
  },
  en: {
    gratis: "Free",
    roletas: "Roulettes",
    caixas: "Boxes",
    trocas: "Trades",
    mercado: "Market",
    inventario: "Inventory",
    iniciarSessao: "Sign In",
    idioma: "Language",
    modo: "Mode",
    moeda: "Currency",
    portugues: "Portuguese",
    espanhol: "Spanish",
    english: "English",
    escuro: "Dark",
    claro: "Light",
  },
};

// Function to update UI text based on language
function updateLanguage(lang) {
  const t = translations[lang];
  const navSpans = document.querySelectorAll('nav a[href="#"] span');
  if (navSpans.length >= 6) {
    navSpans[0].textContent = t.gratis;
    navSpans[1].textContent = t.roletas;
    navSpans[2].textContent = t.caixas;
    navSpans[3].textContent = t.trocas;
    navSpans[4].textContent = t.mercado;
    navSpans[5].textContent = t.inventario;
  }
  const btnSpan = document.querySelector(".btn span");
  if (btnSpan) btnSpan.textContent = t.iniciarSessao;
  const settingsSections = document.querySelectorAll(".settings-section h6");
  if (settingsSections.length >= 3) {
    settingsSections[0].textContent = t.idioma;
    settingsSections[1].textContent = t.modo;
    settingsSections[2].textContent = t.moeda;
  }
}

// Function to toggle settings panel
function toggleSettingsPanel() {
  const settingsPanel = document.getElementById("settingsPanel");
  if (settingsPanel) {
    settingsPanel.classList.toggle("active");
  }
}

// Settings functionality
document.addEventListener("DOMContentLoaded", () => {
  // Load saved preferences
  const savedLang = localStorage.getItem("language") || "pt";
  const savedMode = localStorage.getItem("theme") || "dark";
  const savedCurrency = localStorage.getItem("currency") || "EUR";

  // Apply saved theme
  if (savedMode === "light") {
    document.body.classList.add("light-mode");
  }

  // Update language on load
  updateLanguage(savedLang);

  // Initialize current selections
  const currentLang = document.getElementById("current-lang");
  const currentMode = document.getElementById("current-mode");
  const currentCurrency = document.getElementById("current-currency");

  const langMap = { pt: "Português", es: "Español", en: "English" };
  const modeMap = { dark: "Escuro", light: "Claro" };
  const currencyMap = { EUR: "EUR", USD: "USD", GBP: "GBP" };

  if (currentLang) currentLang.textContent = langMap[savedLang];
  if (currentMode) currentMode.textContent = modeMap[savedMode];
  if (currentCurrency) currentCurrency.textContent = currencyMap[savedCurrency];

  // Close panel when clicking outside
  document.addEventListener("click", (e) => {
    const settingsBtn = document.getElementById("settingsBtn");
    const settingsPanel = document.getElementById("settingsPanel");
    const dropdowns = document.querySelectorAll(".dropdown-options");
    if (
      settingsBtn &&
      settingsPanel &&
      !settingsBtn.contains(e.target) &&
      !settingsPanel.contains(e.target)
    ) {
      settingsPanel.classList.remove("active");
      dropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
    }
  });

  // Dropdown toggle functionality
  document.querySelectorAll(".current-selection").forEach((selection) => {
    selection.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = selection.nextElementSibling;
      const allDropdowns = document.querySelectorAll(".dropdown-options");
      allDropdowns.forEach((d) => {
        if (d !== dropdown) d.classList.remove("active");
      });
      if (dropdown) dropdown.classList.toggle("active");
    });
  });

  // Language options
  document.querySelectorAll("#lang-options .option").forEach((option) => {
    option.addEventListener("click", (e) => {
      const lang = e.target.getAttribute("data-lang");
      localStorage.setItem("language", lang);
      if (currentLang) currentLang.textContent = langMap[lang];
      const langOptions = document.getElementById("lang-options");
      if (langOptions) langOptions.classList.remove("active");
      updateLanguage(lang);
    });
  });

  // Mode options
  document.querySelectorAll("#mode-options .option").forEach((option) => {
    option.addEventListener("click", (e) => {
      const mode = e.target.getAttribute("data-mode");
      if (mode === "light") {
        document.body.classList.add("light-mode");
      } else {
        document.body.classList.remove("light-mode");
      }
      localStorage.setItem("theme", mode);
      if (currentMode) currentMode.textContent = modeMap[mode];
      const modeOptions = document.getElementById("mode-options");
      if (modeOptions) modeOptions.classList.remove("active");
    });
  });

  // Currency options
  document.querySelectorAll("#currency-options .option").forEach((option) => {
    option.addEventListener("click", (e) => {
      const currency = e.target.getAttribute("data-currency");
      localStorage.setItem("currency", currency);
      if (currentCurrency) currentCurrency.textContent = currencyMap[currency];
      const currencyOptions = document.getElementById("currency-options");
      if (currencyOptions) currencyOptions.classList.remove("active");
    });
  });
});
