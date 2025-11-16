// market.js - Market functionality

// Define brainrot items with rarity pools
const marketItems = {
  rare: [
    "Brr Brr Patapim",
    "Cappuccino Assassino",
    "Ballerina Cappuccina",
    "Blueberrinni Octopussini",
    "Apollino Cappuccino",
    "Canyelloni Dragoni",
    "Capybarelli Bananalelli",
    "Carloooooo",
  ],
  epic: [
    "Trippi Troppi",
    "Frigo Camelo",
    "La Vaca Saturno Saturnita",
    "Girafa Celestre",
    "Bobrito Bandito",
  ],
  legendary: ["Lirilì Larilà", "Chimpanzini Bananini", "Bombombini Gusini"],
  mythical: ["Tung Tung Tung Sahur", "Boneca Ambalabu"],
  secret: ["Tralalero Tralala", "Bombardiro Crocodilo"],
};

// Market prices based on rarity
const marketPrices = {
  rare: 200,
  epic: 400,
  legendary: 600,
  mythical: 800,
  secret: 1000,
};

// Market listings (simulated - in a real app, this would come from a server)
let marketListings = JSON.parse(localStorage.getItem("spinrot_market")) || [];

// Initialize market on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeMarketListings();
  displayMarketListings();
  displaySellInventory();
  updateBalanceDisplay();
  updateCartBadge();
});

// Initialize market with all brainrots for sale
function initializeMarketListings() {
  // Clear existing listings
  marketListings = [];

  // Add all items to market
  Object.keys(marketItems).forEach((rarity) => {
    marketItems[rarity].forEach((item) => {
      marketListings.push({
        item: { item: item, rarity: rarity },
        price: marketPrices[rarity],
        seller: "Sistema",
      });
    });
  });

  // Save to localStorage
  saveMarketListings();
}

// Display market listings
function displayMarketListings() {
  const marketList = document.getElementById("market-list");
  const emptyMarket = document.getElementById("empty-market");

  if (!marketList) return;

  // Clear existing content
  marketList.innerHTML = "";

  if (marketListings.length === 0) {
    emptyMarket.style.display = "block";
    return;
  }

  emptyMarket.style.display = "none";

  marketListings.forEach((listing, index) => {
    const listingCard = document.createElement("div");
    listingCard.className = "market-item-card";

    const imageSrc = itemImages[listing.item.item]
      ? `../img/${itemImages[listing.item.item]}`
      : `https://via.placeholder.com/100x100?text=${encodeURIComponent(
          listing.item.item
        )}`;
    const isFav = isFavorite(listing.item.item, listing.item.rarity);
    listingCard.innerHTML = `
      <img src="${imageSrc}" alt="${listing.item.item}" />
      <div class="item-info">
        <h5>${listing.item.item}</h5>
        <p class="rarity-label ${listing.item.rarity}">${
      listing.item.rarity.charAt(0).toUpperCase() + listing.item.rarity.slice(1)
    }</p>
        <p class="item-price"><i class="ri-coin-fill"></i> ${
          listing.price
        } Moedas</p>
      </div>
      <div class="item-actions">
        <button class="btn btn-outline-danger like-btn ${
          isFav ? "liked" : ""
        }" data-item="${listing.item.item}" data-rarity="${
      listing.item.rarity
    }">
          <i class="ri-heart-${isFav ? "fill" : "line"}"></i>
        </button>
        <button class="btn btn-success buy-btn" data-index="${index}">Adicionar ao Carrinho</button>
      </div>
    `;

    // Add click event to like button
    const likeBtn = listingCard.querySelector(".like-btn");
    likeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const item = e.target.closest(".like-btn").getAttribute("data-item");
      const rarity = e.target.closest(".like-btn").getAttribute("data-rarity");
      if (isFavorite(item, rarity)) {
        removeFromFavorites(item, rarity);
        e.target.closest(".like-btn").classList.remove("liked");
        e.target.querySelector("i").className = "ri-heart-line";
      } else {
        addToFavorites(item, rarity);
        e.target.closest(".like-btn").classList.add("liked");
        e.target.querySelector("i").className = "ri-heart-fill";
      }
      // Refresh the display to show updated favorites
      displayMarketListings();
    });

    // Add click event to buy button
    const buyBtn = listingCard.querySelector(".buy-btn");
    buyBtn.addEventListener("click", () =>
      addToCart(listing.item.item, listing.item.rarity, listing.price)
    );

    marketList.appendChild(listingCard);
  });
}

// Display inventory items for selling
function displaySellInventory() {
  const sellInventory = document.getElementById("sell-inventory");
  const emptySellInventory = document.getElementById("empty-sell-inventory");
  const inventory = getInventory();

  if (!sellInventory) return;

  // Clear existing content
  sellInventory.innerHTML = "";

  if (inventory.length === 0) {
    emptySellInventory.style.display = "block";
    return;
  }

  emptySellInventory.style.display = "none";

  // Group items by rarity
  const groupedItems = {};
  inventory.forEach((item) => {
    if (!groupedItems[item.rarity]) {
      groupedItems[item.rarity] = [];
    }
    groupedItems[item.rarity].push(item);
  });

  // Display items grouped by rarity
  const rarityOrder = ["rare", "epic", "legendary"];
  rarityOrder.forEach((rarity) => {
    if (groupedItems[rarity]) {
      const raritySection = document.createElement("div");
      raritySection.className = `rarity-section ${rarity}`;
      raritySection.innerHTML = `<h4>${
        rarity.charAt(0).toUpperCase() + rarity.slice(1)
      } Rots</h4>`;

      const itemsGrid = document.createElement("div");
      itemsGrid.className = "sell-items-grid";

      groupedItems[rarity].forEach((item, index) => {
        const itemCard = document.createElement("div");
        itemCard.className = "sell-item-card";
        itemCard.setAttribute("data-index", inventory.indexOf(item));

        const date = new Date(item.date).toLocaleDateString("pt-PT");
        const suggestedPrice = getSuggestedPrice(item.rarity);
        const imageSrc = itemImages[item.item]
          ? `../img/${itemImages[item.item]}`
          : `https://via.placeholder.com/100x100?text=${encodeURIComponent(
              item.item
            )}`;
        itemCard.innerHTML = `
          <img src="${imageSrc}" alt="${item.item}" />
          <div class="item-info">
            <h5>${item.item}</h5>
            <p class="rarity-label ${rarity}">${
          rarity.charAt(0).toUpperCase() + rarity.slice(1)
        }</p>
            <p class="item-date">Ganho em: ${date}</p>
            <p class="suggested-price">Preço sugerido: ${suggestedPrice} moedas</p>
          </div>
          <button class="btn btn-sm btn-outline-primary sell-item-btn" data-index="${inventory.indexOf(
            item
          )}">Vender</button>
        `;

        // Add click event to sell button
        const sellBtn = itemCard.querySelector(".sell-item-btn");
        sellBtn.addEventListener("click", () =>
          showSellModal(item, inventory.indexOf(item))
        );

        itemsGrid.appendChild(itemCard);
      });

      raritySection.appendChild(itemsGrid);
      sellInventory.appendChild(raritySection);
    }
  });
}

// Get suggested price based on rarity (higher than box/roulette prices)
function getSuggestedPrice(rarity) {
  const prices = {
    rare: 20, // Higher than box price (box rare costs ~5-10)
    epic: 40, // Higher than roulette epic
    legendary: 70, // Higher than roulette legendary
    mythical: 150, // Much higher for rare items
    secret: 300, // Very high for secret items
  };
  return prices[rarity] || 10;
}

// Show purchase modal
function showPurchaseModal(listing, index) {
  document.getElementById(
    "purchase-details"
  ).textContent = `Comprar "${listing.item.item}" por ${listing.price} moedas?`;
  document.getElementById("purchase-modal").style.display = "block";

  // Set up confirm button
  const confirmBtn = document.getElementById("confirm-purchase");
  confirmBtn.onclick = () => {
    if (spendCoins(listing.price)) {
      // Add item to inventory
      addToInventory(listing.item.item, listing.item.rarity);
      // Don't remove from market - keep all items available for purchase
      showNotification("Compra realizada com sucesso!");
    } else {
      showNotification("Moedas insuficientes!", "error");
    }
    document.getElementById("purchase-modal").style.display = "none";
  };

  // Set up cancel button
  document.getElementById("cancel-purchase").onclick = () => {
    document.getElementById("purchase-modal").style.display = "none";
  };
}

// Show sell modal
function showSellModal(item, index) {
  document.getElementById(
    "sell-item-details"
  ).textContent = `Vender "${item.item}" (${item.rarity})`;
  document.getElementById("sell-price").value = getSuggestedPrice(item.rarity);
  document.getElementById("sell-modal").style.display = "block";

  // Set up confirm button
  const confirmBtn = document.getElementById("confirm-sell");
  confirmBtn.onclick = () => {
    const price = parseInt(document.getElementById("sell-price").value);
    if (price > 0) {
      // Add to market listings
      marketListings.push({ item, price, seller: "Você" });
      saveMarketListings();
      // Remove from inventory
      removeFromInventory(index);
      displaySellInventory();
      displayMarketListings();
      showNotification("Item colocado à venda!");
    } else {
      showNotification("Preço inválido!", "error");
    }
    document.getElementById("sell-modal").style.display = "none";
  };

  // Set up cancel button
  document.getElementById("cancel-sell").onclick = () => {
    document.getElementById("sell-modal").style.display = "none";
  };
}

// Save market listings to localStorage
function saveMarketListings() {
  localStorage.setItem("spinrot_market", JSON.stringify(marketListings));
}

// Remove item from inventory by index
function removeFromInventory(index) {
  inventory.splice(index, 1);
  localStorage.setItem("spinrot_inventory", JSON.stringify(inventory));
}

// Modal close functionality
document.addEventListener("DOMContentLoaded", () => {
  // Purchase modal
  const purchaseModal = document.getElementById("purchase-modal");
  const purchaseCloseBtn = purchaseModal
    ? purchaseModal.querySelector(".close")
    : null;

  if (purchaseCloseBtn) {
    purchaseCloseBtn.addEventListener("click", () => {
      purchaseModal.style.display = "none";
    });
  }

  // Sell modal
  const sellModal = document.getElementById("sell-modal");
  const sellCloseBtn = sellModal ? sellModal.querySelector(".close") : null;

  if (sellCloseBtn) {
    sellCloseBtn.addEventListener("click", () => {
      sellModal.style.display = "none";
    });
  }

  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === purchaseModal) {
      purchaseModal.style.display = "none";
    }
    if (event.target === sellModal) {
      sellModal.style.display = "none";
    }
    if (event.target === document.getElementById("cart-modal")) {
      document.getElementById("cart-modal").style.display = "none";
    }
  });
});

// Cart functions
function getCart() {
  return JSON.parse(localStorage.getItem("spinrot_cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("spinrot_cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartBadge = document.getElementById("cart-badge");
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? "inline" : "none";
  }
}

function addToCart(item, rarity, price) {
  const cart = getCart();
  const existingItem = cart.find(
    (cartItem) => cartItem.item === item && cartItem.rarity === rarity
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ item, rarity, price, quantity: 1 });
  }

  saveCart(cart);
  updateCartBadge();
  showNotification(`Adicionou "${item}" (${rarity}) ao carrinho!`, "success");
}

function updateCartQuantity(item, rarity, newQuantity) {
  const cart = getCart();
  const cartItem = cart.find(
    (cartItem) => cartItem.item === item && cartItem.rarity === rarity
  );

  if (cartItem) {
    if (newQuantity <= 0) {
      removeFromCart(item, rarity);
    } else {
      cartItem.quantity = newQuantity;
      saveCart(cart);
      showCartModal();
      updateCartBadge();
    }
  }
}

function removeFromCart(item, rarity) {
  const cart = getCart();
  const updatedCart = cart.filter(
    (cartItem) => !(cartItem.item === item && cartItem.rarity === rarity)
  );
  saveCart(updatedCart);
  updateCartBadge();
  showCartModal();
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function clearCart() {
  localStorage.removeItem("spinrot_cart");
  updateCartBadge();
}

// Show cart modal
function showCartModal() {
  const modal = document.getElementById("cart-modal");
  const cartItems = document.getElementById("cart-items");
  const emptyCart = document.getElementById("empty-cart");
  const cartTotal = document.getElementById("cart-total");
  const cart = getCart();

  if (cart.length === 0) {
    cartItems.innerHTML = "";
    emptyCart.style.display = "block";
    cartTotal.textContent = "0";
  } else {
    emptyCart.style.display = "none";
    cartItems.innerHTML = cart
      .map(
        (item, index) => `
          <div class="cart-item">
            <img src="../img/${itemImages[item.item]}" alt="${item.item}" />
            <div class="item-info">
              <h5>${item.item}</h5>
              <p class="item-price">${item.price} moedas cada</p>
            </div>
            <div class="quantity-controls">
              <button onclick="updateCartQuantity('${item.item}', '${
          item.rarity
        }', ${item.quantity - 1})">-</button>
              <span class="quantity">${item.quantity}</span>
              <button onclick="updateCartQuantity('${item.item}', '${
          item.rarity
        }', ${item.quantity + 1})">+</button>
              <button class="remove-btn" onclick="removeFromCart('${
                item.item
              }', '${item.rarity}')">Remover</button>
            </div>
          </div>
        `
      )
      .join("");
    cartTotal.textContent = getCartTotal();
  }

  modal.style.display = "block";

  // Handle checkout
  document.getElementById("checkout-btn").onclick = () => {
    checkoutCart();
  };

  // Handle clear cart
  document.getElementById("clear-cart-btn").onclick = () => {
    clearCart();
    modal.style.display = "none";
    showNotification("Carrinho limpo!", "success");
  };
}

// Checkout cart
function checkoutCart() {
  const cart = getCart();
  const total = getCartTotal();
  const balance = parseInt(localStorage.getItem("spinrot_balance")) || 0;

  if (balance < total) {
    showNotification("Saldo insuficiente para finalizar a compra!", "error");
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
  document.getElementById("cart-modal").style.display = "none";

  showNotification(`Compra finalizada! Gastaste ${total} moedas.`, "success");
}

// Show favorites function
function showFavorites() {
  const marketList = document.getElementById("market-list");
  const emptyMarket = document.getElementById("empty-market");

  if (!marketList) return;

  // Clear existing content
  marketList.innerHTML = "";

  // Filter listings to show only favorites
  const favoriteListings = marketListings.filter((listing) =>
    isFavorite(listing.item.item, listing.item.rarity)
  );

  if (favoriteListings.length === 0) {
    emptyMarket.style.display = "block";
    emptyMarket.innerHTML = "<p>Não tens itens favoritos no mercado.</p>";
    return;
  }

  emptyMarket.style.display = "none";

  favoriteListings.forEach((listing, index) => {
    const listingCard = document.createElement("div");
    listingCard.className = "market-item-card";

    const imageSrc = itemImages[listing.item.item]
      ? `../img/${itemImages[listing.item.item]}`
      : `https://via.placeholder.com/100x100?text=${encodeURIComponent(
          listing.item.item
        )}`;
    const isFav = isFavorite(listing.item.item, listing.item.rarity);
    listingCard.innerHTML = `
      <img src="${imageSrc}" alt="${listing.item.item}" />
      <div class="item-info">
        <h5>${listing.item.item}</h5>
        <p class="rarity-label ${listing.item.rarity}">${
      listing.item.rarity.charAt(0).toUpperCase() + listing.item.rarity.slice(1)
    }</p>
        <p class="item-price"><i class="ri-coin-fill"></i> ${
          listing.price
        } Moedas</p>
      </div>
      <div class="item-actions">
        <button class="btn btn-outline-danger like-btn ${
          isFav ? "liked" : ""
        }" data-item="${listing.item.item}" data-rarity="${
      listing.item.rarity
    }">
          <i class="ri-heart-${isFav ? "fill" : "line"}"></i>
        </button>
        <button class="btn btn-success buy-btn" data-index="${index}">Adicionar ao Carrinho</button>
      </div>
    `;

    // Add click event to like button
    const likeBtn = listingCard.querySelector(".like-btn");
    likeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const item = e.target.closest(".like-btn").getAttribute("data-item");
      const rarity = e.target.closest(".like-btn").getAttribute("data-rarity");
      if (isFavorite(item, rarity)) {
        removeFromFavorites(item, rarity);
        e.target.closest(".like-btn").classList.remove("liked");
        e.target.querySelector("i").className = "ri-heart-line";
      } else {
        addToFavorites(item, rarity);
        e.target.closest(".like-btn").classList.add("liked");
        e.target.querySelector("i").className = "ri-heart-fill";
      }
      // Refresh the favorites view
      showFavorites();
    });

    // Add click event to buy button
    const buyBtn = listingCard.querySelector(".buy-btn");
    buyBtn.addEventListener("click", () =>
      addToCart(listing.item.item, listing.item.rarity, listing.price)
    );

    marketList.appendChild(listingCard);
  });
}

// Notification function
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  const notificationContent = document.querySelector(".notification-content");

  notificationMessage.textContent = message;

  if (type === "error") {
    notificationContent.style.backgroundColor = "#f44336";
    notificationContent.style.borderColor = "#d32f2f";
  } else {
    notificationContent.style.backgroundColor = "#4CAF50";
    notificationContent.style.borderColor = "#45a049";
  }

  notification.style.display = "block";

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}
