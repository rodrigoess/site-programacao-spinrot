// script.js - Funções globais de saldo e utilitários

// Gestão global de saldo
let balance = Math.max(
  parseInt(localStorage.getItem("spinrot_balance")) || 0,
  parseInt(localStorage.getItem("coins")) || 0
);
// Sempre definir spinrot_balance para o saldo atual e remover chave antiga
localStorage.setItem("spinrot_balance", balance.toString());
if (localStorage.getItem("coins")) {
  localStorage.removeItem("coins");
}

// Gestão de inventário
let inventory = JSON.parse(localStorage.getItem("spinrot_inventory")) || [];

// Gestão de favoritos
let favorites = JSON.parse(localStorage.getItem("spinrot_favorites")) || [];

// Gestão de histórico de transações removida

// Gestão de carrinho de compras
let cart = JSON.parse(localStorage.getItem("spinrot_cart")) || [];

// Adicionar item ao carrinho
function addToCart(item, rarity, price) {
  const existingItem = cart.find(
    (cartItem) => cartItem.item === item && cartItem.rarity === rarity
  );
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ item, rarity, price, quantity: 1 });
  }
  saveCart();
  alert(`Adicionou ${item} (${rarity}) ao carrinho!`);
}

// Remover item do carrinho
function removeFromCart(item, rarity) {
  cart = cart.filter(
    (cartItem) => !(cartItem.item === item && cartItem.rarity === rarity)
  );
  saveCart();
}

// Atualizar quantidade de item no carrinho
function updateCartQuantity(item, rarity, quantity) {
  const cartItem = cart.find(
    (cartItem) => cartItem.item === item && cartItem.rarity === rarity
  );
  if (cartItem) {
    cartItem.quantity = quantity;
    if (cartItem.quantity <= 0) {
      removeFromCart(item, rarity);
    } else {
      saveCart();
    }
  }
}

// Obter total do carrinho
function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Obter itens do carrinho
function getCart() {
  return cart;
}

// Limpar carrinho
function clearCart() {
  cart = [];
  saveCart();
}

// Salvar carrinho no localStorage
function saveCart() {
  localStorage.setItem("spinrot_cart", JSON.stringify(cart));
}

// Atualizar exibição de saldo (funciona em qualquer página com elemento balance-display)
function updateBalanceDisplay() {
  const balanceElements = document.querySelectorAll(".balance-display span");
  balanceElements.forEach((element) => {
    element.textContent = balance;
  });
  // Também atualizar exibição de moedas
  const coinAmount = document.getElementById("coin-amount");
  if (coinAmount) {
    coinAmount.textContent = balance;
  }
}

// Atualizar exibição de moedas (alias para updateBalanceDisplay)
function updateCoinDisplay() {
  updateBalanceDisplay();
}

// Salvar saldo no localStorage
function saveBalance() {
  localStorage.setItem("spinrot_balance", balance.toString());
}

// Adicionar moedas ao saldo
function addCoins(amount, description = "Ganho") {
  balance += amount;
  saveBalance();
  updateBalanceDisplay();
}

// Gastar moedas do saldo
function spendCoins(amount, description = "Compra") {
  if (balance >= amount) {
    balance -= amount;
    saveBalance();
    updateBalanceDisplay();
    return true;
  }
  return false;
}

// Adicionar item ao inventário
function addToInventory(item, rarity) {
  inventory.push({ item, rarity, date: new Date().toISOString() });
  localStorage.setItem("spinrot_inventory", JSON.stringify(inventory));
}

// Obter inventário
function getInventory() {
  return inventory;
}

// Adicionar item aos favoritos
function addToFavorites(item, rarity) {
  if (!favorites.some((fav) => fav.item === item && fav.rarity === rarity)) {
    favorites.push({ item, rarity, date: new Date().toISOString() });
    localStorage.setItem("spinrot_favorites", JSON.stringify(favorites));
  }
}

// Remover item dos favoritos
function removeFromFavorites(item, rarity) {
  favorites = favorites.filter(
    (fav) => !(fav.item === item && fav.rarity === rarity)
  );
  localStorage.setItem("spinrot_favorites", JSON.stringify(favorites));
}

// Verificar se item está nos favoritos
function isFavorite(item, rarity) {
  return favorites.some((fav) => fav.item === item && fav.rarity === rarity);
}

// Obter favoritos
function getFavorites() {
  return favorites;
}

// Funções de histórico de transações removidas

// Funcionalidade de login/registo
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

// Funções de autenticação
function registerUser(name, email, password) {
  const users = JSON.parse(localStorage.getItem("spinrot_users")) || [];
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    alert("Email já registado!");
    return false;
  }
  users.push({ name, email, password });
  localStorage.setItem("spinrot_users", JSON.stringify(users));
  localStorage.setItem("spinrot_logged_in", JSON.stringify({ name, email }));
  return true;
}

function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem("spinrot_users")) || [];
  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    localStorage.setItem(
      "spinrot_logged_in",
      JSON.stringify({ name: user.name, email: user.email })
    );
    return true;
  }
  return false;
}

function logoutUser() {
  localStorage.removeItem("spinrot_logged_in");
  window.location.href = "login.html";
}

function isLoggedIn() {
  return localStorage.getItem("spinrot_logged_in") !== null;
}

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("spinrot_logged_in"));
}

// Atualizar exibição do usuário logado
function updateUserDisplay() {
  const loginSection = document.getElementById("login-section");
  const userSection = document.getElementById("user-section");
  const userNameElement = document.getElementById("user-name");

  if (loginSection && userSection && userNameElement) {
    let userName = null;

    // Check custom login
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
      userName = loggedInUser.name;
    }

    // Check Google login if not found
    if (!userName) {
      const isGoogleLoggedIn = localStorage.getItem("is_logged_in") === "true";
      if (isGoogleLoggedIn) {
        userName = localStorage.getItem("user_name");
      }
    }

    if (userName) {
      loginSection.style.display = "none";
      userSection.style.display = "flex";
      userNameElement.textContent = userName;
    } else {
      loginSection.style.display = "block";
      userSection.style.display = "none";
    }
  }
}

// Manipuladores de formulário
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const signinForm = document.getElementById("signin-form");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("signup-name").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      if (registerUser(name, email, password)) {
        alert("Conta criada com sucesso!");
        updateUserDisplay();
        window.location.href = "index.html";
      }
    });
  }

  if (signinForm) {
    signinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("signin-email").value;
      const password = document.getElementById("signin-password").value;

      if (loginUser(email, password)) {
        alert("Login bem-sucedido!");
        updateUserDisplay();
        window.location.href = "index.html";
      } else {
        alert("Email ou palavra-passe incorretos!");
      }
    });
  }
});

// Mapear itens para os seus ficheiros de imagem (partilhado em todas as páginas)
const itemImages = {
  "Brr Brr Patapim": "Brr Brr Patapim.jpg",
  "Cappuccino Assassino": "Cappuccino Assassino.png",
  "Ballerina Cappuccina": "Ballerina Cappuccina.jfif",
  "Blueberrinni Octopussini": "Blueberrinni Octopussini.jfif",
  "Apollino Cappuccino": "Apollino Cappuccino.jpg",
  "Canyelloni Dragoni": "Canyelloni Dragoni.jpg",
  "Capybarelli Bananalelli": "Capybarelli Bananalelli.jfif",
  Carloooooo: "Carloooooo.jpg",
  "Trippi Troppi": "Trippi Troppi.png",
  "Frigo Camelo": "Frigo Camelo.webp",
  "La Vaca Saturno Saturnita": "La Vaca Saturno Saturnita.jpeg",
  "Girafa Celestre": "Girafa Celestre.jfif",
  "Bobrito Bandito": "Bobrito Bandito.jfif",
  "Lirilì Larilà": "Lirilì Larilà.jfif",
  "Chimpanzini Bananini": "Chimpanzini Bananini.jfif",
  "Bombombini Gusini": "Bombombini Gusini.jfif",
  "Tung Tung Tung Sahur": "Tung Tung Tung Sahur.jfif",
  "Boneca Ambalabu": "Boneca Ambalabu.webp",
  "Tralalero Tralala": "Tralalero Tralala.jfif",
  "Bombardiro Crocodilo": "Bombardiro Crocodilo.jpg",
  "Brainrot Azul": "Blueberrinni Octopussini.jfif", // Mapeamento placeholder
  "Brainrot Verde": "Girafa Celestre.jfif", // Mapeamento placeholder
  "Brainrot Dourado": "Lirilì Larilà.jfif", // Mapeamento placeholder
};

// Objeto de traduções
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
    preco: "Preço",
    moedas: "moedas",
    girar: "Girar",
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
    exploraOpcoes: "¡Explora nuestras opciones y gana items únicos!",
    roletasDesc: "¡Gira la rueda y gana rots raros y épicos!",
    caixasDesc: "¡Abre cajas y descubre items legendarios!",
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
      "¡Gana items increíbles y diviértete con nuestras ruletas y cajas!",
    linksRapidos: "Enlaces Rápidos",
    redesSociais: "Redes Sociales",
    contato: "Contacto",
    email: "Email: soporte@spinrot.com",
    telefone: "Teléfono: +351 123 456 789",
    direitosReservados: "&copy; 2025 SpinRot. Todos los derechos reservados.",
    preco: "Precio",
    moedas: "monedas",
    girar: "Girar",
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
    redesSociais: "Social Networks",
    contato: "Contact",
    email: "Email: support@spinrot.com",
    telefone: "Phone: +351 123 456 789",
    direitosReservados: "&copy; 2025 SpinRot. All rights reserved.",
    preco: "Price",
    moedas: "coins",
    girar: "Spin",
  },
};

// Função para obter o idioma atual (padrão: 'pt')
function getCurrentLanguage() {
  return localStorage.getItem("spinrot_language") || "pt";
}

// Função para definir o idioma
function setCurrentLanguage(lang) {
  localStorage.setItem("spinrot_language", lang);
}

// Função de tradução
function t(key) {
  const lang = getCurrentLanguage();
  return translations[lang] && translations[lang][key]
    ? translations[lang][key]
    : key;
}

// Aplicar traduções aos elementos com data-i18n
function applyTranslations() {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
}

// Função para alternar o painel de configurações
function toggleSettingsPanel() {
  const panel = document.getElementById("settingsPanel");
  if (panel) {
    panel.classList.toggle("active");
  }
}

// Aplicar traduções no carregamento da página
document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  updateUserDisplay();
  updateBalanceDisplay();
});
