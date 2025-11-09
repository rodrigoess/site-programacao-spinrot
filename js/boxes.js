// boxes.js

// Box costs in coins
const boxCosts = {
  rare: 5,
  epic: 10,
  legendary: 20,
  mythical: 50,
  secret: 100,
};

// Function to open box (pay and redirect to roulette)
function openBox(boxType) {
  const cost = boxCosts[boxType];
  if (balance < cost) {
    alert(`Você não tem moedas suficientes! Precisa de ${cost} moedas.`);
    return;
  }
  spendCoins(cost);
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
