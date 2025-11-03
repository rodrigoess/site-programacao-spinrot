// inventory.js - Inventory management functionality

// Initialize inventory on page load
document.addEventListener('DOMContentLoaded', () => {
  displayInventory();
});

// Display inventory items
function displayInventory() {
  const inventoryList = document.getElementById('inventory-list');
  const emptyInventory = document.getElementById('empty-inventory');
  const inventory = getInventory();

  if (!inventoryList) return;

  // Clear existing content
  inventoryList.innerHTML = '';

  if (inventory.length === 0) {
    emptyInventory.style.display = 'block';
    return;
  }

  emptyInventory.style.display = 'none';

  // Group items by rarity
  const groupedItems = {};
  inventory.forEach(item => {
    if (!groupedItems[item.rarity]) {
      groupedItems[item.rarity] = [];
    }
    groupedItems[item.rarity].push(item);
  });

  // Display items grouped by rarity
  const rarityOrder = ['rare', 'epic', 'legendary'];
  rarityOrder.forEach(rarity => {
    if (groupedItems[rarity]) {
      const raritySection = document.createElement('div');
      raritySection.className = `rarity-section ${rarity}`;
      raritySection.innerHTML = `<h4>${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Rots</h4>`;

      const itemsGrid = document.createElement('div');
      itemsGrid.className = 'inventory-grid';

      groupedItems[rarity].forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'inventory-item-card';

        const date = new Date(item.date).toLocaleDateString('pt-PT');
        itemCard.innerHTML = `
          <img src="https://via.placeholder.com/100x100?text=${encodeURIComponent(item.item)}" alt="${item.item}" />
          <div class="item-info">
            <h5>${item.item}</h5>
            <p class="rarity-label ${rarity}">${rarity.charAt(0).toUpperCase() + rarity.slice(1)}</p>
            <p class="item-date">Ganho em: ${date}</p>
          </div>
        `;

        itemsGrid.appendChild(itemCard);
      });

      raritySection.appendChild(itemsGrid);
      inventoryList.appendChild(raritySection);
    }
  });
}
