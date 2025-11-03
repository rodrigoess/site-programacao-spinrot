// boxes.js

// Define brainrot items with rarity pools
const items = {
  rare: [
    "Skibidi Toilet",
    "Ohio",
    "Rizz",
    "Sigma Male",
    "Fanum Tax",
    "Mewing",
    "Looksmaxxing",
    "Edge",
    "Bet",
    "Sus",
  ],
  epic: [
    "Giga Chad",
    "Based",
    "Cringe",
    "Yeet",
    "Vibe Check",
    "Aura",
    "Grindset",
    "Hustle Culture",
    "Woke",
    "Flex",
  ],
  legendary: [
    "Skibidi Rizzler",
    "Ohio Sigma",
    "Fanum Mewtwo",
    "Giga Ohio",
    "Based Skibidi",
    "Cringe Lord",
    "Yeet Master",
    "Aura King",
    "Grindset Emperor",
    "Woke Overlord",
  ],
  mythical: [
    "Skibidi Ohio Rizzler",
    "Giga Fanum Mewing Sigma",
    "Based Cringe Yeet Aura",
    "Grindset Woke Flex Emperor",
    "Mewtwo Skibidi Lord",
    "Ohio Sigma Rizz Master",
    "Fanum Mewing Giga Chad",
    "Cringe Yeet Vibe King",
    "Aura Grindset Woke Overlord",
    "Flex Skibidi Ohio Emperor",
  ],
  secret: [
    "Ultimate Skibidi Ohio Rizzler Sigma",
    "Giga Fanum Mewing Based Cringe Yeet Aura Grindset Woke Flex Emperor",
    "Mewtwo Skibidi Lord Ohio Sigma Rizz Master Fanum Mewing Giga Chad",
    "Cringe Yeet Vibe King Aura Grindset Woke Overlord Flex Skibidi Ohio Emperor",
    "The One True Brainrot: Skibidi Ohio Rizzler Sigma Fanum Mewing Based Cringe Yeet Aura Grindset Woke Flex Emperor Mewtwo Skibidi Lord",
  ],
};

// Get modal elements
const modal = document.getElementById("result-modal");
const closeBtn = document.querySelector(".close");
const itemResult = document.getElementById("item-result");

// Function to get random item from a pool
function getRandomItem(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

// Function to open box
function openBox(boxType) {
  const boxElement = document.getElementById(`${boxType}-box`);
  boxElement.classList.add("spinning");

  // Simulate opening time
  setTimeout(() => {
    boxElement.classList.remove("spinning");
    const item = getRandomItem(items[boxType]);
    itemResult.textContent = item;
    modal.style.display = "block";

    // Add won item to inventory
    addToInventory(item, boxType);
  }, 2000);
}

// Add event listeners to boxes
document
  .getElementById("rare-box")
  .addEventListener(
    "click",
    () => (window.location.href = "roulette.html?type=rare")
  );
document
  .getElementById("epic-box")
  .addEventListener(
    "click",
    () => (window.location.href = "roulette.html?type=epic")
  );
document
  .getElementById("legendary-box")
  .addEventListener(
    "click",
    () => (window.location.href = "roulette.html?type=legendary")
  );
document
  .getElementById("mythical-box")
  .addEventListener(
    "click",
    () => (window.location.href = "roulette.html?type=mythical")
  );
document
  .getElementById("secret-box")
  .addEventListener(
    "click",
    () => (window.location.href = "roulette.html?type=secret")
  );

// Close modal when clicking close button
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
