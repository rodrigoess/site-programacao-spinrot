// roulette.js

// Define brainrot items with rarity pools (same as boxes.js)
const items = {
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

// Roulette costs in coins
const rouletteCosts = {
  rare: 10,
  epic: 50,
  legendary: 200,
  mythical: 500,
  secret: 1000,
  all: 100,
};

// Get URL parameters
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  const boxType = getQueryParam("type") || "all";
  document.getElementById("box-type").textContent =
    boxType === "all"
      ? "All Brainrots"
      : boxType.charAt(0).toUpperCase() + boxType.slice(1);

  populateSlot();
  populateRarities();
  updateBalanceDisplay();
  updateSpinCost();

  // Spin button event
  document
    .getElementById("spin-button")
    .addEventListener("click", () => spinSlot());

  // Open another button event
  document.getElementById("open-another").addEventListener("click", () => {
    window.location.href = "boxes.html";
  });
});

// Update spin cost display
function updateSpinCost() {
  const boxType = getQueryParam("type") || "all";
  const cost = rouletteCosts[boxType];
  document.getElementById("spin-cost").textContent = cost;
}

// Populate the slot with items
function populateSlot() {
  const slotTrack = document.getElementById("slot-track");
  const boxType = getQueryParam("type") || "all";

  // Filter items based on boxType
  let selectedItems;
  if (boxType === "all") {
    selectedItems = [
      ...items.rare,
      ...items.epic,
      ...items.legendary,
      ...items.mythical,
      ...items.secret,
    ];
  } else {
    selectedItems = items[boxType] || [];
  }

  // Duplicate items multiple times for smooth scrolling
  const duplicatedItems = [];
  for (let i = 0; i < 20; i++) {
    duplicatedItems.push(...selectedItems);
  }

  duplicatedItems.forEach((item) => {
    const slotItem = document.createElement("div");
    slotItem.className = "slot-item";

    // Create image element
    const img = document.createElement("img");
    img.src = `../img/${itemImages[item]}`;
    img.alt = item;
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "5px";

    // Add text below image
    const text = document.createElement("div");
    text.textContent = item;
    text.style.fontSize = "0.8rem";
    text.style.marginTop = "0.5rem";
    text.style.color = "white";
    text.style.textShadow = "1px 1px 2px rgba(0,0,0,0.8)";

    slotItem.appendChild(img);
    slotItem.appendChild(text);
    slotItem.title = item;

    // Determine rarity and set color
    let rarity = "rare";
    if (items.epic.includes(item)) rarity = "epic";
    else if (items.legendary.includes(item)) rarity = "legendary";
    else if (items.mythical.includes(item)) rarity = "mythical";
    else if (items.secret.includes(item)) rarity = "secret";
    slotItem.style.backgroundColor = getRarityColor(rarity);

    slotTrack.appendChild(slotItem);
  });
}

// Get color based on rarity
function getRarityColor(rarity) {
  const colors = {
    rare: "#808080", // Gray
    epic: "#800080", // Purple
    legendary: "#FFA500", // Orange
    mythical: "#FF0000", // Red
    secret: "#000000", // Black
  };
  return colors[rarity] || "#808080";
}

// Get rarity from item name
function getRarityFromItem(item) {
  if (items.rare.includes(item)) return "rare";
  if (items.epic.includes(item)) return "epic";
  if (items.legendary.includes(item)) return "legendary";
  if (items.mythical.includes(item)) return "mythical";
  if (items.secret.includes(item)) return "secret";
  return "rare"; // default
}

// Spin the slot
function spinSlot() {
  const slotTrack = document.getElementById("slot-track");
  const spinButton = document.getElementById("spin-button");
  const boxType = getQueryParam("type") || "all";

  // Check if player has enough coins
  const cost = rouletteCosts[boxType];
  if (balance < cost) {
    alert(`Você não tem moedas suficientes! Precisa de ${cost} moedas.`);
    return;
  }
  spendCoins(cost);

  // Reset position to start for consistent spins
  gsap.set(slotTrack, { x: 0 });

  // Filter items based on boxType
  let selectedItems;
  if (boxType === "all") {
    selectedItems = [
      ...items.rare,
      ...items.epic,
      ...items.legendary,
      ...items.mythical,
      ...items.secret,
    ];
  } else {
    selectedItems = items[boxType] || [];
  }

  // Define rarity chances for "all" mode
  const rarityChances = {
    rare: 40,
    epic: 30,
    legendary: 20,
    mythical: 8,
    secret: 2,
  };

  // Apply rarity chances for "all" mode, skipping empty pools
  let winningItem;
  if (boxType === "all") {
    const rand = Math.random() * 100;
    let cumulative = 0;
    for (const [rarity, chance] of Object.entries(rarityChances)) {
      cumulative += chance;
      if (rand < cumulative && items[rarity].length > 0) {
        winningItem =
          items[rarity][Math.floor(Math.random() * items[rarity].length)];
        break;
      }
    }
  } else {
    winningItem =
      selectedItems[Math.floor(Math.random() * selectedItems.length)];
  }

  const numItems = selectedItems.length;
  const itemWidth = 150; // Width of each slot item
  const randomIndex = selectedItems.indexOf(winningItem);

  // Calculate the distance to scroll to center the winning item
  // The pointer is at center, so we need to scroll so that the winning item is at the center
  const containerWidth = document.querySelector(".slot-machine").offsetWidth;
  const centerOffset = containerWidth / 2 - itemWidth / 2;

  // Calculate spin distance to always move left (negative direction)
  // Spin multiple full cycles plus the exact position to center the winning item
  const fullCycles = 5; // Number of full cycles to spin
  const spinDistance =
    (randomIndex + numItems * fullCycles) * itemWidth - centerOffset;
  const targetPosition = -spinDistance;

  // Disable button during spin
  spinButton.disabled = true;
  spinButton.textContent = "Spinning...";

  // Use GSAP to animate the scroll
  gsap.to(slotTrack, {
    x: targetPosition,
    duration: 3,
    ease: "power2.out",
    onComplete: () => {
      spinButton.disabled = false;
      spinButton.textContent = "Spin";
      alert(`You won: ${winningItem}`);
      addToInventory(winningItem, getRarityFromItem(winningItem));
    },
  });
}

// Populate rarities list
function populateRarities() {
  const raritiesList = document.getElementById("rarities-list");
  const rarities = Object.keys(items);

  rarities.forEach((rarity) => {
    const rarityDiv = document.createElement("div");
    rarityDiv.className = `rarity-item ${rarity}`;
    const title = document.createElement("strong");
    title.textContent = rarity.charAt(0).toUpperCase() + rarity.slice(1);
    rarityDiv.appendChild(title);

    const count = document.createElement("div");
    count.textContent = `Items: ${items[rarity].length}`;
    rarityDiv.appendChild(count);

    const list = document.createElement("ul");
    items[rarity].forEach((item) => {
      const li = document.createElement("li");

      const img = document.createElement("img");
      img.src = `../img/${itemImages[item]}`;
      img.alt = item;

      const text = document.createElement("div");
      text.textContent = item;

      li.appendChild(img);
      li.appendChild(text);
      list.appendChild(li);
    });
    rarityDiv.appendChild(list);
    raritiesList.appendChild(rarityDiv);
  });
}
