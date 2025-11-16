// inventory.js - Inventory management functionality

// Initialize inventory on page load
document.addEventListener("DOMContentLoaded", () => {
  // Check URL parameters for initial filter
  const urlParams = new URLSearchParams(window.location.search);
  const initialFilter =
    urlParams.get("favorites") === "true" ? "favorites" : "all";
  displayInventory(initialFilter);

  // If favorites, set active button
  if (initialFilter === "favorites") {
    document
      .querySelectorAll(".filter-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelector('.filter-btn[data-filter="favorites"]')
      .classList.add("active");
  }

  // Add event listeners for filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const filter = e.target.getAttribute("data-filter");
      displayInventory(filter);

      // Update active button
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
    });
  });

  // Add event listener for show favorites button
  const showFavoritesBtn = document.getElementById("show-favorites-btn");
  if (showFavoritesBtn) {
    showFavoritesBtn.addEventListener("click", () => {
      displayInventory("favorites");
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      document
        .querySelector('.filter-btn[data-filter="favorites"]')
        .classList.add("active");
    });
  }
});

// Display inventory items
function displayInventory(filter = "all") {
  const inventoryList = document.getElementById("inventory-list");
  const emptyInventory = document.getElementById("empty-inventory");
  const inventory = getInventory();

  if (!inventoryList) return;

  // Clear existing content
  inventoryList.innerHTML = "";

  let filteredInventory = inventory;
  if (filter === "favorites") {
    filteredInventory = inventory.filter((item) =>
      isFavorite(item.item, item.rarity)
    );
  }

  if (filteredInventory.length === 0) {
    emptyInventory.style.display = "block";
    return;
  }

  emptyInventory.style.display = "none";

  // Group items by name and rarity, count quantities
  const groupedItems = {};
  filteredInventory.forEach((item) => {
    const key = `${item.item}-${item.rarity}`;
    if (!groupedItems[key]) {
      groupedItems[key] = {
        item: item.item,
        rarity: item.rarity,
        count: 0,
        dates: [],
      };
    }
    groupedItems[key].count++;
    groupedItems[key].dates.push(item.date);
  });

  // Display items grouped by rarity
  const rarityOrder = ["rare", "epic", "legendary", "mythical", "secret"];
  rarityOrder.forEach((rarity) => {
    const rarityItems = Object.values(groupedItems).filter(
      (item) => item.rarity === rarity
    );
    if (rarityItems.length > 0) {
      const raritySection = document.createElement("div");
      raritySection.className = `rarity-section ${rarity}`;
      raritySection.innerHTML = `<h4>${
        rarity.charAt(0).toUpperCase() + rarity.slice(1)
      } Rots</h4>`;

      const itemsGrid = document.createElement("div");
      itemsGrid.className = "inventory-grid";

      rarityItems.forEach((itemData) => {
        const itemCard = document.createElement("div");
        itemCard.className = "inventory-item-card";

        const imageSrc = itemImages[itemData.item]
          ? `../img/${itemImages[itemData.item]}`
          : `https://via.placeholder.com/100x100?text=${encodeURIComponent(
              itemData.item
            )}`;
        const isFav = isFavorite(itemData.item, itemData.rarity);
        itemCard.innerHTML = `
          <img src="${imageSrc}" alt="${itemData.item}" />
          <div class="item-info">
            <h5>${itemData.item}</h5>
            <p class="rarity-label ${rarity}">${
          rarity.charAt(0).toUpperCase() + rarity.slice(1)
        }</p>
            <p class="item-quantity">Quantidade: ${itemData.count}</p>
          </div>
          <div class="item-actions">
            <button class="btn btn-outline-danger like-btn ${
              isFav ? "liked" : ""
            }" data-item="${itemData.item}" data-rarity="${itemData.rarity}">
              <i class="ri-heart-${isFav ? "fill" : "line"}"></i>
            </button>
          </div>
        `;

        // Add click event to like button
        const likeBtn = itemCard.querySelector(".like-btn");
        likeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const itemName = e.target
            .closest(".like-btn")
            .getAttribute("data-item");
          const rarity = e.target
            .closest(".like-btn")
            .getAttribute("data-rarity");
          if (isFavorite(itemName, rarity)) {
            removeFromFavorites(itemName, rarity);
            e.target.closest(".like-btn").classList.remove("liked");
            e.target.querySelector("i").className = "ri-heart-line";
          } else {
            addToFavorites(itemName, rarity);
            e.target.closest(".like-btn").classList.add("liked");
            e.target.querySelector("i").className = "ri-heart-fill";
          }
        });

        itemsGrid.appendChild(itemCard);
      });

      raritySection.appendChild(itemsGrid);
      inventoryList.appendChild(raritySection);
    }
  });
}
