// script.js - Global balance and utility functions

// Global balance management
let balance = parseInt(localStorage.getItem("spinrot_balance")) || 0;

// Inventory management
let inventory = JSON.parse(localStorage.getItem("spinrot_inventory")) || [];

// Update balance display (works on any page with balance-display element)
function updateBalanceDisplay() {
  const balanceElements = document.querySelectorAll(".balance-display span");
  balanceElements.forEach((element) => {
    element.textContent = balance;
  });
}

// Save balance to localStorage
function saveBalance() {
  localStorage.setItem("spinrot_balance", balance.toString());
}

// Add coins to balance
function addCoins(amount) {
  balance += amount;
  saveBalance();
  updateBalanceDisplay();
}

// Spend coins from balance
function spendCoins(amount) {
  if (balance >= amount) {
    balance -= amount;
    saveBalance();
    updateBalanceDisplay();
    return true;
  }
  return false;
}

// Add item to inventory
function addToInventory(item, rarity) {
  inventory.push({ item, rarity, date: new Date().toISOString() });
  localStorage.setItem("spinrot_inventory", JSON.stringify(inventory));
}

// Get inventory
function getInventory() {
  return inventory;
}

// Login/Register functionality
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
    iniciarSessao: "Inicie Sessão",
    idioma: "Idioma",
    modo: "Modo",
    moeda: "Moeda",
    portugues: "Português",
    espanhol: "Español",
    english: "English",
    escuro: "Escuro",
    claro: "Claro",
    bemVindo: "Bem-vindo ao SpinRot - Ganha Rots Incríveis!",
    exploraOpcoes: "Explora as nossas opções e ganha itens únicos!",
    roletasDesc: "Gira a roda e ganha rots raros e épicos!",
    caixasDesc: "Abre caixas e descubre itens lendários!",
    gratisDesc: "Joga gratuitamente e ganha sem gastar nada!",
    trocasDesc: "Troque seus rots com outros jogadores!",
    mercadoDesc: "Compre e venda rots no mercado!",
    inventarioDesc: "Gere os teus rots coletados",
    jogarAgora: "Jogar Agora",
    abrirCaixas: "Abrir Caixas",
    jogarGratis: "Jogar Grátis",
    trocarAgora: "Trocar Agora",
    visitarMercado: "Visitar Mercado",
    verInventario: "Ver Inventário",
    spinrot: "SpinRot",
    ganheItens:
      "Ganhe itens incríveis e divirta-se com nossas roletas e caixas!",
    linksRapidos: "Links Rápidos",
    redesSociais: "Redes Sociais",
    contato: "Contato",
    email: "Email: suporte@spinrot.com",
    telefone: "Telefone: +351 123 456 789",
    direitosReservados: "&copy; 2025 SpinRot. Todos os direitos reservados.",
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
    bemVindo: "¡Bienvenido a SpinRot - Gana Rots Increíbles!",
    exploraOpcoes: "¡Explora nuestras opciones y gana artículos únicos!",
    roletasDesc: "¡Gira la rueda y gana rots raros y épicos!",
    caixasDesc: "¡Abre cajas y descubre artículos legendarios!",
    gratisDesc: "¡Juega gratis y gana sin gastar nada!",
    trocasDesc: "¡Intercambia tus rots con otros jugadores!",
    mercadoDesc: "¡Compra y vende rots en el mercado!",
    inventarioDesc: "Gestiona tus rots recolectados",
    jogarAgora: "Jugar Ahora",
    abrirCaixas: "Abrir Cajas",
    jogarGratis: "Jugar Gratis",
    trocarAgora: "Intercambiar Ahora",
    visitarMercado: "Visitar Mercado",
    verInventario: "Ver Inventario",
    spinrot: "SpinRot",
    ganheItens:
      "¡Gana artículos increíbles y diviértete con nuestras ruletas y cajas!",
    linksRapidos: "Enlaces Rápidos",
    redesSociais: "Redes Sociales",
    contato: "Contacto",
    email: "Email: soporte@spinrot.com",
    telefone: "Teléfono: +351 123 456 789",
    direitosReservados: "&copy; 2025 SpinRot. Todos los derechos reservados.",
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
    bemVindo: "Welcome to SpinRot - Win Amazing Rots!",
    exploraOpcoes: "Explore our options and win unique items!",
    roletasDesc: "Spin the wheel and win rare and epic rots!",
    caixasDesc: "Open boxes and discover legendary items!",
    gratisDesc: "Play for free and win without spending anything!",
    trocasDesc: "Trade your rots with other players!",
    mercadoDesc: "Buy and sell rots in the market!",
    inventarioDesc: "Manage your collected rots",
    jogarAgora: "Play Now",
    abrirCaixas: "Open Boxes",
    jogarGratis: "Play Free",
    trocarAgora: "Trade Now",
    visitarMercado: "Visit Market",
    verInventario: "View Inventory",
    spinrot: "SpinRot",
    ganheItens: "Win amazing items and have fun with our roulettes and boxes!",
    linksRapidos: "Quick Links",
    redesSociais: "Social Media",
    contato: "Contact",
    email: "Email: support@spinrot.com",
    telefone: "Phone: +351 123 456 789",
    direitosReservados: "&copy; 2025 SpinRot. All rights reserved.",
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

  // Update hero section
  const heroH1 = document.querySelector(".hero-section h1");
  if (heroH1) heroH1.textContent = t.bemVindo;
  const heroP = document.querySelector(".hero-section p");
  if (heroP) heroP.textContent = t.exploraOpcoes;

  // Update promo cards
  const promoCards = document.querySelectorAll(".promo-card");
  if (promoCards.length >= 6) {
    promoCards[0].querySelector("p").textContent = t.roletasDesc;
    promoCards[0].querySelector(".promo-btn").textContent = t.jogarAgora;
    promoCards[1].querySelector("p").textContent = t.caixasDesc;
    promoCards[1].querySelector(".promo-btn").textContent = t.abrirCaixas;
    promoCards[2].querySelector("p").textContent = t.gratisDesc;
    promoCards[2].querySelector(".promo-btn").textContent = t.jogarGratis;
    promoCards[3].querySelector("p").textContent = t.trocasDesc;
    promoCards[3].querySelector(".promo-btn").textContent = t.trocarAgora;
    promoCards[4].querySelector("p").textContent = t.mercadoDesc;
    promoCards[4].querySelector(".promo-btn").textContent = t.visitarMercado;
    promoCards[5].querySelector("p").textContent = t.inventarioDesc;
    promoCards[5].querySelector(".promo-btn").textContent = t.verInventario;
  }

  // Update footer
  const footerH4s = document.querySelectorAll(".footer-section h4");
  if (footerH4s.length >= 4) {
    footerH4s[0].textContent = t.spinrot;
    footerH4s[1].textContent = t.linksRapidos;
    footerH4s[2].textContent = t.redesSociais;
    footerH4s[3].textContent = t.contato;
  }
  const footerP = document.querySelector(".footer-section p");
  if (footerP) footerP.textContent = t.ganheItens;
  const footerLinks = document.querySelectorAll(".footer-section ul li a");
  if (footerLinks.length >= 6) {
    footerLinks[0].textContent = t.roletas;
    footerLinks[1].textContent = t.caixas;
    footerLinks[2].textContent = t.gratis;
    footerLinks[3].textContent = t.trocas;
    footerLinks[4].textContent = t.mercado;
    footerLinks[5].textContent = t.inventario;
  }
  const footerContact = document.querySelectorAll(".footer-section p");
  if (footerContact.length >= 3) {
    footerContact[1].textContent = t.email;
    footerContact[2].textContent = t.telefone;
  }
  const footerBottom = document.querySelector(".footer-bottom p");
  if (footerBottom) footerBottom.innerHTML = t.direitosReservados;
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
