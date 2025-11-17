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

// Update cart badge
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("spinrot_cart")) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartBadge = document.getElementById("cart-badge");
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? "inline-flex" : "none";
  }
}

// Show cart modal
function showCartModal() {
  const modal = document.getElementById("cart-modal");
  const cartItems = document.getElementById("cart-items");
  const emptyCart = document.getElementById("empty-cart");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const cart = JSON.parse(localStorage.getItem("spinrot_cart")) || [];

  if (!modal) {
    alert("Modal do carrinho não encontrado. Esta funcionalidade só está disponível na página do mercado.");
    return;
  }

  if (cart.length === 0) {
    if (cartItems) cartItems.innerHTML = "";
    if (emptyCart) emptyCart.style.display = "block";
    if (cartTotal) cartTotal.textContent = "0";
    if (checkoutBtn) checkoutBtn.style.display = "none";
  } else {
    if (emptyCart) emptyCart.style.display = "none";
    if (checkoutBtn) checkoutBtn.style.display = "block";
    if (cartItems) {
      cartItems.innerHTML = cart
        .map(
          (item) => `
          <div class="cart-item">
            <img src="../img/${itemImages[item.item] || 'logo.png'}" alt="${item.item}" />
            <div class="item-info">
              <h5>${item.item}</h5>
              <p class="item-price">${item.price} moedas cada</p>
            </div>
            <div class="quantity-controls">
              <button onclick="updateCartQuantity('${item.item}', '${item.rarity}', ${item.quantity - 1})">-</button>
              <span class="quantity">${item.quantity}</span>
              <button onclick="updateCartQuantity('${item.item}', '${item.rarity}', ${item.quantity + 1})">+</button>
              <button class="remove-btn" onclick="removeFromCart('${item.item}', '${item.rarity}')">Remover</button>
            </div>
          </div>
        `
        )
        .join("");
    }
    if (cartTotal) {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      cartTotal.textContent = total;
    }
  }

  modal.style.display = "block";
}

// Adicionar item ao carrinho
function addToCart(item, rarity, price) {
  cart = JSON.parse(localStorage.getItem("spinrot_cart")) || [];
  const existingItem = cart.find(
    (cartItem) => cartItem.item === item && cartItem.rarity === rarity
  );
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ item, rarity, price, quantity: 1 });
  }
  saveCart();
  updateCartBadge();
  if (typeof showNotification === 'function') {
    showNotification(`Adicionou ${item} (${rarity}) ao carrinho!`, "success");
  } else {
    alert(`Adicionou ${item} (${rarity}) ao carrinho!`);
  }
}

// Remover item do carrinho
function removeFromCart(item, rarity) {
  cart = JSON.parse(localStorage.getItem("spinrot_cart")) || [];
  cart = cart.filter(
    (cartItem) => !(cartItem.item === item && cartItem.rarity === rarity)
  );
  saveCart();
  updateCartBadge();
  showCartModal();
}

// Atualizar quantidade de item no carrinho
function updateCartQuantity(item, rarity, quantity) {
  cart = JSON.parse(localStorage.getItem("spinrot_cart")) || [];
  const cartItem = cart.find(
    (cartItem) => cartItem.item === item && cartItem.rarity === rarity
  );
  if (cartItem) {
    if (quantity <= 0) {
      removeFromCart(item, rarity);
    } else {
      cartItem.quantity = quantity;
      saveCart();
      updateCartBadge();
      showCartModal();
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
  updateCartBadge();
}

// Salvar carrinho no localStorage
function saveCart() {
  localStorage.setItem("spinrot_cart", JSON.stringify(cart));
  updateCartBadge();
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
    espanhol: "Espanhol",
    ingles: "Inglês",
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
    rouletteTitle: "Roulette - ",
    spinCostText: "Rodar a roleta custa 100 moedas.",
    spinButton: "Girar",
    openAnother: "Abrir Outra",
    rarities: "Raridades",
    dropChances: "Probabilidades de Queda (Modo Todos)",
    rare: "Raro",
    epic: "Épico",
    legendary: "Lendário",
    mythical: "Mítico",
    secret: "Secreto",
    caixas: "Caixas",
    rareBox: "Rare (10)",
    rareBoxDesc: "Abra para obter itens raros!",
    epicBox: "Epic (50)",
    epicBoxDesc: "Abra para obter itens épicos!",
    legendaryBox: "Legendary (200)",
    legendaryBoxDesc: "Abra para obter itens lendários!",
    mythicalBox: "Mythical (500)",
    mythicalBoxDesc: "Abra para obter itens míticos!",
    secretBox: "Secret (1000)",
    secretBoxDesc: "Abra para obter itens secretos!",
    youWon: "Ganhaste:",
    // Novas traduções para trades
    inventario: "Inventário",
    proposeTrade: "Propor Troca",
    selectItemsToTrade:
      "Seleciona itens do teu inventário para propor uma troca.",
    proposeTradeBtn: "Propor Troca",
    tradeProposal: "Proposta de Troca",
    accept: "Aceitar",
    reject: "Rejeitar",
    noItemsToTrade: "Não tens itens para trocar.",
    playToGetItems: "Joga nas roletas ou abre caixas para ganhar itens!",
    // Novas traduções para market
    brainrotsForSale: "Brainrots à Venda",
    noItemsForSale: "Não há itens à venda no momento.",
    sellYourRots: "Vende os Teus Rots",
    selectItemsToSell:
      "Seleciona itens do teu inventário para vender no mercado.",
    noItemsToSell: "Não tens itens para vender.",
    confirmPurchase: "Confirmar Compra",
    confirm: "Confirmar",
    cancel: "Cancelar",
    setSellPrice: "Definir Preço de Venda",
    price: "Preço (Moedas):",
    putForSale: "Colocar à Venda",
    yourCart: "O Teu Carrinho de Compras",
    cartEmpty: "O carrinho está vazio.",
    total: "Total:",
    checkout: "Finalizar Compra",
    clearCart: "Limpar Carrinho",
    // Novas traduções para inventory
    yourRots: "Os Teus Rots",
    all: "Todos",
    favorites: "Favoritos",
    showFavorites: "Mostrar Favoritos",
    noRotsYet: "Ainda não tens nenhum rot no inventário.",
    playToGetRots: "Joga nas roletas ou abre caixas para ganhar rots!",
    // Novas traduções para gratis
    dailyGift: "Presente Diário",
    nextGiftIn: "Próximo presente em:",
    openGift: "Abrir Presente",
    congratulations: "Parabéns! Ganhaste:",
    useCoins: "Usar Moedas",
    useCoinsDesc: "Usa as tuas moedas para abrir caixas ou girar roletas!",
    openBoxes: "Abrir Caixas (5 Moedas)",
    spinRoulette: "Girar Roleta (10 Moedas)",
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
    rouletteTitle: "Ruleta - ",
    spinCostText: "Girar la ruleta cuesta 100 monedas.",
    spinButton: "Girar",
    openAnother: "Abrir Otra",
    rarities: "Rarezas",
    dropChances: "Probabilidades de Caída (Modo Todos)",
    rare: "Raro",
    epic: "Épico",
    legendary: "Legendario",
    mythical: "Mítico",
    secret: "Secreto",
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
    rouletteTitle: "Roulette - ",
    spinCostText: "Spinning the roulette costs 100 coins.",
    spinButton: "Spin",
    openAnother: "Open Another",
    rarities: "Rarities",
    dropChances: "Drop Chances (All Mode)",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
    mythical: "Mythical",
    secret: "Secret",
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

// Função para obter o modo atual (padrão: 'dark')
function getCurrentMode() {
  return localStorage.getItem("spinrot_mode") || "dark";
}

// Função para definir o modo
function setCurrentMode(mode) {
  localStorage.setItem("spinrot_mode", mode);
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

// Função para aplicar o modo (dark/light)
function applyMode() {
  const mode = getCurrentMode();
  const body = document.body;
  if (mode === "light") {
    body.classList.add("light-mode");
  } else {
    body.classList.remove("light-mode");
  }
}

// Função para atualizar a exibição do idioma atual
function updateLanguageDisplay() {
  const currentLangElement = document.getElementById("current-lang");
  if (currentLangElement) {
    const lang = getCurrentLanguage();
    const langNames = {
      pt: "Português",
      es: "Español",
      en: "English",
    };
    currentLangElement.textContent = langNames[lang] || "Português";
  }
}

// Função para atualizar a exibição do modo atual
function updateModeDisplay() {
  const currentModeElement = document.getElementById("current-mode");
  if (currentModeElement) {
    const mode = getCurrentMode();
    const modeNames = {
      dark: "Escuro",
      light: "Claro",
    };
    currentModeElement.textContent = modeNames[mode] || "Escuro";
  }
}

// Função para alternar dropdowns
function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.toggle("active");
  }
}

// Event listeners para configurações
document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  applyMode();
  updateUserDisplay();
  updateBalanceDisplay();
  updateLanguageDisplay();
  updateModeDisplay();
  updateCartBadge();

  // Setup cart modal close button
  const cartModal = document.getElementById("cart-modal");
  if (cartModal) {
    const cartCloseBtn = cartModal.querySelector(".close");
    if (cartCloseBtn) {
      cartCloseBtn.addEventListener("click", () => {
        cartModal.style.display = "none";
      });
    }

    // Setup checkout button
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn && !checkoutBtn.hasAttribute('onclick')) {
      checkoutBtn.addEventListener("click", () => {
        checkoutCart();
      });
    }

    // Setup clear cart button
    const clearCartBtn = document.getElementById("clear-cart-btn");
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => {
        clearCart();
        cartModal.style.display = "none";
        if (typeof showNotification === 'function') {
          showNotification("Carrinho limpo!", "success");
        } else {
          alert("Carrinho limpo!");
        }
      });
    }

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === cartModal) {
        cartModal.style.display = "none";
      }
    });
  }

  // Checkout cart function
  window.checkoutCart = function() {
    const cart = JSON.parse(localStorage.getItem("spinrot_cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const balance = parseInt(localStorage.getItem("spinrot_balance")) || 0;

    if (cart.length === 0) {
      alert("O carrinho está vazio!");
      return;
    }

    if (balance < total) {
      alert("Saldo insuficiente para finalizar a compra!");
      return;
    }

    // Deduct balance
    spendCoins(total);

    // Add items to inventory
    cart.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToInventory(item.item, item.rarity);
      }
    });

    // Clear cart
    clearCart();

    // Close modal
    const modal = document.getElementById("cart-modal");
    if (modal) modal.style.display = "none";

    alert(`Compra finalizada! Gastaste ${total} moedas.`);
  };

  // Event listeners para dropdowns
  const currentLang = document.getElementById("current-lang");
  const currentMode = document.getElementById("current-mode");

  if (currentLang) {
    currentLang.addEventListener("click", () => {
      toggleDropdown("lang-options");
    });
  }

  if (currentMode) {
    currentMode.addEventListener("click", () => {
      toggleDropdown("mode-options");
    });
  }

  // Event listeners para opções de idioma
  const langOptions = document.querySelectorAll("#lang-options .option");
  langOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const lang = option.getAttribute("data-lang");
      setCurrentLanguage(lang);
      applyTranslations();
      updateLanguageDisplay();
      toggleDropdown("lang-options");
    });
  });

  // Event listeners para opções de modo
  const modeOptions = document.querySelectorAll("#mode-options .option");
  modeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const mode = option.getAttribute("data-mode");
      setCurrentMode(mode);
      applyMode();
      updateModeDisplay();
      toggleDropdown("mode-options");
    });
  });
});
