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
  const navSpans = document.querySelectorAll('.nav-link[href="#"] span');
  navSpans[0].textContent = t.gratis;
  navSpans[1].textContent = t.roletas;
  navSpans[2].textContent = t.caixas;
  navSpans[3].textContent = t.trocas;
  navSpans[4].textContent = t.mercado;
  navSpans[5].textContent = t.inventario;
  document.querySelector(".btn-warning span").textContent = t.iniciarSessao;
  document.querySelector(".settings-section:nth-child(1) h6 span").textContent =
    t.idioma;
  document.querySelector(".settings-section:nth-child(2) h6 span").textContent =
    t.modo;
  document.querySelector(".settings-section:nth-child(3) h6 span").textContent =
    t.moeda;
}

// Function to toggle settings panel
function toggleSettingsPanel() {
  const settingsPanel = document.getElementById("settingsPanel");
  settingsPanel.classList.toggle("active");
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

  currentLang.textContent = langMap[savedLang];
  currentMode.textContent = modeMap[savedMode];
  currentCurrency.textContent = currencyMap[savedCurrency];

  // Close panel when clicking outside
  document.addEventListener("click", (e) => {
    const settingsBtn = document.getElementById("settingsBtn");
    const settingsPanel = document.getElementById("settingsPanel");
    const dropdowns = document.querySelectorAll(".dropdown-options");
    if (!settingsBtn.contains(e.target) && !settingsPanel.contains(e.target)) {
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
      dropdown.classList.toggle("active");
    });
  });

  // Language options
  document.querySelectorAll("#lang-options .option").forEach((option) => {
    option.addEventListener("click", (e) => {
      const lang = e.target.getAttribute("data-lang");
      localStorage.setItem("language", lang);
      currentLang.textContent = langMap[lang];
      document.getElementById("lang-options").classList.remove("active");
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
      currentMode.textContent = modeMap[mode];
      document.getElementById("mode-options").classList.remove("active");
    });
  });

  // Currency options
  document.querySelectorAll("#currency-options .option").forEach((option) => {
    option.addEventListener("click", (e) => {
      const currency = e.target.getAttribute("data-currency");
      localStorage.setItem("currency", currency);
      currentCurrency.textContent = currencyMap[currency];
      document.getElementById("currency-options").classList.remove("active");
    });
  });
});
