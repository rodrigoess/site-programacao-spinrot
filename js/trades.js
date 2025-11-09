// trades.js - Trade functionality

// Initialize trades on page load
document.addEventListener("DOMContentLoaded", () => {
  displayTradeInventory();
});

// Display inventory items for trading
function displayTradeInventory() {
  const tradeInventory = document.getElementById("trade-inventory");
  const emptyTradeInventory = document.getElementById("empty-trade-inventory");
  const inventory = getInventory();

  if (!tradeInventory) return;

  // Clear existing content
  tradeInventory.innerHTML = "";

  if (inventory.length === 0) {
    emptyTradeInventory.style.display = "block";
    return;
  }

  emptyTradeInventory.style.display = "none";

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
      itemsGrid.className = "trade-items-grid";

      groupedItems[rarity].forEach((item, index) => {
        const itemCard = document.createElement("div");
        itemCard.className = "trade-item-card";
        itemCard.setAttribute("data-index", inventory.indexOf(item));

        const date = new Date(item.date).toLocaleDateString("pt-PT");
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
          </div>
          <button class="btn btn-sm btn-outline-primary select-trade-btn">Selecionar</button>
        `;

        // Add click event to select button
        const selectBtn = itemCard.querySelector(".select-trade-btn");
        selectBtn.addEventListener("click", () =>
          selectItemForTrade(item, inventory.indexOf(item))
        );

        itemsGrid.appendChild(itemCard);
      });

      raritySection.appendChild(itemsGrid);
      tradeInventory.appendChild(raritySection);
    }
  });

  // Add available brainrots for trade (simulated - in a real app, this would come from other players)
  const availableTradesSection = document.createElement("div");
  availableTradesSection.className = "rarity-section available-trades";
  availableTradesSection.innerHTML = `<h4>Brainrots Disponíveis para Troca</h4>`;

  const availableItemsGrid = document.createElement("div");
  availableItemsGrid.className = "trade-items-grid";

  // Simulate some available items for trade (same rarity as user's items)
  const availableItems = [
    { item: "Brainrot Azul", rarity: "rare", date: new Date().toISOString() },
    { item: "Brainrot Verde", rarity: "epic", date: new Date().toISOString() },
    {
      item: "Brainrot Dourado",
      rarity: "legendary",
      date: new Date().toISOString(),
    },
  ];

  availableItems.forEach((item, index) => {
    const itemCard = document.createElement("div");
    itemCard.className = "trade-item-card available-trade-card";
    itemCard.innerHTML = `
      <img src="https://via.placeholder.com/100x100?text=${encodeURIComponent(
        item.item
      )}" alt="${item.item}" />
      <div class="item-info">
        <h5>${item.item}</h5>
        <p class="rarity-label ${item.rarity}">${
      item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)
    }</p>
        <p class="item-owner">De: Jogador ${index + 1}</p>
      </div>
      <button class="btn btn-sm btn-success propose-trade-btn" data-index="${index}">Propor Troca</button>
    `;

    // Add click event to propose trade button
    const proposeBtn = itemCard.querySelector(".propose-trade-btn");
    proposeBtn.addEventListener("click", () =>
      proposeTradeWithItem(item, index)
    );

    availableItemsGrid.appendChild(itemCard);
  });

  availableTradesSection.appendChild(availableItemsGrid);
  tradeInventory.appendChild(availableTradesSection);
}

// Selected items for trade
let selectedItems = [];

// Select item for trade
function selectItemForTrade(item, index) {
  if (selectedItems.some((selected) => selected.index === index)) {
    // Deselect item
    selectedItems = selectedItems.filter(
      (selected) => selected.index !== index
    );
  } else {
    // Select item
    selectedItems.push({ ...item, index });
  }

  updateSelectedItemsDisplay();
  updateProposeTradeButton();
}

// Update display of selected items
function updateSelectedItemsDisplay() {
  const selectedItemsDiv = document.getElementById("selected-items");
  selectedItemsDiv.innerHTML = "";

  if (selectedItems.length === 0) {
    selectedItemsDiv.innerHTML = "<p>Nenhum item selecionado.</p>";
    return;
  }

  selectedItems.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "selected-item";
    itemDiv.innerHTML = `
      <span>${item.item} (${item.rarity})</span>
      <button class="btn btn-sm btn-outline-danger remove-item-btn" data-index="${item.index}">Remover</button>
    `;

    const removeBtn = itemDiv.querySelector(".remove-item-btn");
    removeBtn.addEventListener("click", () => {
      selectedItems = selectedItems.filter(
        (selected) => selected.index !== item.index
      );
      updateSelectedItemsDisplay();
      updateProposeTradeButton();
    });

    selectedItemsDiv.appendChild(itemDiv);
  });
}

// Update propose trade button state
function updateProposeTradeButton() {
  const proposeBtn = document.getElementById("propose-trade");
  proposeBtn.disabled = selectedItems.length === 0;
}

// Propose trade with available item
function proposeTradeWithItem(availableItem, availableIndex) {
  if (selectedItems.length > 0) {
    const tradeDetails = `Você está oferecendo: ${selectedItems
      .map((item) => item.item)
      .join(", ")} por ${availableItem.item}`;
    document.getElementById("trade-details").textContent = tradeDetails;
    document.getElementById("trade-modal").style.display = "block";

    // Store the available item for the trade
    document
      .getElementById("trade-modal")
      .setAttribute("data-available-item", JSON.stringify(availableItem));
  } else {
    alert(
      "Selecione pelo menos um item do seu inventário para propor a troca!"
    );
  }
}

// Propose trade (for now, just show a modal - in a real app, this would send to another player)
document.addEventListener("DOMContentLoaded", () => {
  const proposeBtn = document.getElementById("propose-trade");
  if (proposeBtn) {
    proposeBtn.addEventListener("click", () => {
      if (selectedItems.length > 0) {
        const tradeDetails = selectedItems.map((item) => item.item).join(", ");
        document.getElementById(
          "trade-details"
        ).textContent = `Você está oferecendo: ${tradeDetails}`;
        document.getElementById("trade-modal").style.display = "block";
      }
    });
  }
});

// Trade modal functionality
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("trade-modal");
  const closeBtn = modal ? modal.querySelector(".close") : null;
  const acceptBtn = document.getElementById("accept-trade");
  const rejectBtn = document.getElementById("reject-trade");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      // In a real app, this would complete the trade
      const availableItemData = modal.getAttribute("data-available-item");
      if (availableItemData) {
        const availableItem = JSON.parse(availableItemData);
        // Add the traded item to inventory
        addToInventory(availableItem.item, availableItem.rarity);
        alert(`Troca aceita! Você recebeu: ${availableItem.item}`);
      } else {
        alert("Troca aceita! (Funcionalidade simulada)");
      }
      modal.style.display = "none";
      // Remove traded items from inventory
      selectedItems.forEach((item) => {
        removeFromInventory(item.index);
      });
      selectedItems = [];
      updateSelectedItemsDisplay();
      updateProposeTradeButton();
      displayTradeInventory();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

// Remove item from inventory by index
function removeFromInventory(index) {
  inventory.splice(index, 1);
  localStorage.setItem("spinrot_inventory", JSON.stringify(inventory));
}
