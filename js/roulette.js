// roulette.js

// Define brainrot items with rarity pools (same as boxes.js)
const items = {
  rare: [
    "Tralalero Tralala",
    "Bombardiro Crocodilo",
    "Tung Tung Tung Sahur",
    "Lirilì Larilà",
    "Ballerina Cappuccina",
    "Cappuccino Assassino",
    "Brr Brr Patapim",
    "Boneca Ambalabu",
    "Trippi Troppi",
    "Chimpanzini Bananini",
  ],
  epic: [
    "Bombombini Gusini",
    "Frigo Camelo",
    "La Vaca Saturno Saturnita",
    "Girafa Celestre",
    "Bobrito Bandito",
    "Frulli Frulla",
    "Orangutini Ananasini",
    "Il Cacto Hipopotamo",
    "Blueberrinni Octopussini",
    "Rhino Toasterino",
  ],
  legendary: [
    "Zibra Zubra Zibralini",
    "Graipussi Medussi",
    "Tigrrullini Watermellini",
    "Tracotucotulu Delapeladustuz",
    "Chimpanzini Capuchini",
    "Gorillo Watermellondrillo",
    "Burbaloni Luliloli",
    "Bobrini Cocosini",
    "Cocofanto Elefanto",
    "Bananita Dolfinita",
  ],
};

// Get URL parameters
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  const boxType = getQueryParam("type") || "rare";
  document.getElementById("box-type").textContent =
    boxType.charAt(0).toUpperCase() + boxType.slice(1);

  populateWheel(boxType);
  populateBrainrots();
  populateRarities();

  // Spin button event
  document
    .getElementById("spin-button")
    .addEventListener("click", () => spinWheel(boxType));

  // Open another button event
  document.getElementById("open-another").addEventListener("click", () => {
    window.location.href = "boxes.html";
  });
});

// Populate the wheel with items
function populateWheel(boxType) {
  const wheel = document.getElementById("wheel");
  const pool = items[boxType];

  // Add multiple copies for smooth sliding effect
  const extendedPool = [...pool, ...pool, ...pool, ...pool, ...pool, ...pool]; // Repeat items 6 times

  extendedPool.forEach((item, index) => {
    const segment = document.createElement("div");
    segment.className = "wheel-segment";
    segment.textContent = item;
    wheel.appendChild(segment);
  });
}

// Get random color for wheel segments
function getRandomColor() {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Spin the wheel
function spinWheel(boxType) {
  const wheel = document.getElementById("wheel");
  const pool = items[boxType];
  const randomIndex = Math.floor(Math.random() * pool.length);
  const itemWidth = 200; // Match the CSS flex width
  const containerWidth = document.querySelector(".roulette-wheel").offsetWidth;
  const pointerOffset = containerWidth / 2;

  // Reset wheel to initial position before spinning
  wheel.style.transform = "translateX(0px)";

  // Add multiple full spins to ensure forward movement
  const spins = 5;
  const fullSpinDistance = spins * pool.length * itemWidth;

  // Calculate the position to slide to center the winning item under the pointer
  const slideDistance = randomIndex * itemWidth - pointerOffset + itemWidth / 2;

  // Total distance: full spins + slide to item
  const totalDistance = fullSpinDistance + slideDistance;

  wheel.style.transform = `translateX(-${totalDistance}px)`;

  setTimeout(() => {
    alert(`You won: ${pool[randomIndex]}`);
  }, 5000);
}

// Populate brainrots list
function populateBrainrots() {
  const brainrotsList = document.getElementById("brainrots-list");
  const allItems = Object.values(items).flat();

  allItems.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "brainrot-item";

    // Create image element with placeholder
    const img = document.createElement("img");
    img.src = `https://via.placeholder.com/100x100?text=${encodeURIComponent(
      item
    )}`;
    img.alt = item;
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.marginBottom = "0.5rem";

    // Add text below image
    const text = document.createElement("div");
    text.textContent = item;

    itemDiv.appendChild(img);
    itemDiv.appendChild(text);
    brainrotsList.appendChild(itemDiv);
  });
}

// Populate rarities list
function populateRarities() {
  const raritiesList = document.getElementById("rarities-list");
  const rarities = Object.keys(items);

  rarities.forEach((rarity) => {
    const rarityDiv = document.createElement("div");
    rarityDiv.className = `rarity-item ${rarity}`;
    rarityDiv.innerHTML = `<strong>${
      rarity.charAt(0).toUpperCase() + rarity.slice(1)
    }</strong><br>Items: ${items[rarity].length}`;
    raritiesList.appendChild(rarityDiv);
  });
}
