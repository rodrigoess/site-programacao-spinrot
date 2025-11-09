// market.js - Market functionality

// Market listings (simulated - in a real app, this would come from a server)
let marketListings = JSON.parse(localStorage.getItem("spinrot_market")) || [];

// Initialize market on page load
document.addEventListener("DOMContentLoaded", () => {
  displayMarketListings();
  displaySellInventory();
  updateBalanceDisplay();
});

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

    listingCard.innerHTML = `
      <img src="https://via.placeholder.com/100x100?text=${encodeURIComponent(
        listing.item.item
      )}" alt="${listing.item.item}" />
      <div class="item-info">
        <h5>${listing.item.item}</h5>
        <p class="rarity-label ${listing.item.rarity}">${
      listing.item.rarity.charAt(0).toUpperCase() + listing.item.rarity.slice(1)
    }</p>
        <p class="item-price"><i class="ri-coin-fill"></i> ${
          listing.price
        } Moedas</p>
      </div>
      <button class="btn btn-success buy-btn" data-index="${index}">Comprar</button>
    `;

    // Add click event to buy button
    const buyBtn = listingCard.querySelector(".buy-btn");
    buyBtn.addEventListener("click", () => showPurchaseModal(listing, index));

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
        itemCard.innerHTML = `
          <img src="https://via.placeholder.com/100x100?text=${encodeURIComponent(
            item.item
          )}" alt="${item.item}" />
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
      // Remove from market
      marketListings.splice(index, 1);
      saveMarketListings();
      displayMarketListings();
      alert("Compra realizada com sucesso!");
    } else {
      alert("Moedas insuficientes!");
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
      alert("Item colocado à venda!");
    } else {
      alert("Preço inválido!");
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
  });
});
