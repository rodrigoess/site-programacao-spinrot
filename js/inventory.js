// inventory.js - Inventory management functionality

// Initialize inventory on page load
document.addEventListener("DOMContentLoaded", () => {
  displayInventory();
});

// Display inventory items
function displayInventory() {
  const inventoryList = document.getElementById("inventory-list");
  const emptyInventory = document.getElementById("empty-inventory");
  const inventory = getInventory();

  if (!inventoryList) return;

  // Clear existing content
  inventoryList.innerHTML = "";

  if (inventory.length === 0) {
    emptyInventory.style.display = "block";
    return;
  }

  emptyInventory.style.display = "none";

  // Group items by name and rarity, count quantities
  const groupedItems = {};
  inventory.forEach((item) => {
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
        itemCard.innerHTML = `
          <img src="${imageSrc}" alt="${itemData.item}" />
          <div class="item-info">
            <h5>${itemData.item}</h5>
            <p class="rarity-label ${rarity}">${
          rarity.charAt(0).toUpperCase() + rarity.slice(1)
        }</p>
            <p class="item-quantity">Quantidade: ${itemData.count}</p>
          </div>
        `;

        itemsGrid.appendChild(itemCard);
      });

      raritySection.appendChild(itemsGrid);
      inventoryList.appendChild(raritySection);
    }
  });
}
