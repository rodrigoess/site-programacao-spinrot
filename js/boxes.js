// boxes.js

// Box costs in coins
const boxCosts = {
  rare: 10,
  epic: 50,
  legendary: 200,
  mythical: 500,
  secret: 1000,
};

// Function to open box (redirect to roulette, coins deducted on spin)
function openBox(boxType) {
  window.location.href = `roulette.html?type=${boxType}`;
}

// Add event listeners to boxes
document
  .getElementById("rare-box")
  .addEventListener("click", () => openBox("rare"));
document
  .getElementById("epic-box")
  .addEventListener("click", () => openBox("epic"));
document
  .getElementById("legendary-box")
  .addEventListener("click", () => openBox("legendary"));
document
  .getElementById("mythical-box")
  .addEventListener("click", () => openBox("mythical"));
document
  .getElementById("secret-box")
  .addEventListener("click", () => openBox("secret"));

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  updateBalanceDisplay();
});
