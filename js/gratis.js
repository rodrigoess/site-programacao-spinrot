// gratis.js - Free gifts functionality

// Timer variables
let timerInterval;
let timeLeft = 10; // 10 seconds

// Format time as MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

// Start the timer
function startTimer() {
  const timerElement = document.getElementById("timer");
  const openGiftBtn = document.getElementById("open-gift-btn");
  const timerDisplay = document.getElementById("timer-display");

  if (timerElement && openGiftBtn && timerDisplay) {
    timerDisplay.style.display = "block";
    openGiftBtn.disabled = true;
    openGiftBtn.textContent = "Aguarde...";

    timerInterval = setInterval(() => {
      timeLeft--;
      timerElement.textContent = formatTime(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerDisplay.style.display = "none";
        openGiftBtn.disabled = false;
        openGiftBtn.textContent = "Abrir Presente";
        timeLeft = 10; // Reset timer
      }
    }, 1000);
  }
}

// Open gift and give random coins
function openGift() {
  const rewardDisplay = document.getElementById("reward-display");
  const rewardAmount = document.getElementById("reward-amount");
  const giftBox = document.getElementById("gift-box");

  if (rewardDisplay && rewardAmount && giftBox) {
    // Random coins between 500 and 1000 (always more than 500)
    const coins = Math.floor(Math.random() * 501) + 500;
    balance += coins;
    saveBalance();
    updateBalanceDisplay();

    // Save last gift time
    localStorage.setItem("last_gift_time", Date.now().toString());

    // Show reward
    rewardAmount.textContent = coins;
    rewardDisplay.style.display = "block";
    giftBox.style.animation = "shake 0.5s ease-in-out";

    // Hide reward after 3 seconds and start timer
    setTimeout(() => {
      rewardDisplay.style.display = "none";
      giftBox.style.animation = "";
      startTimer();
    }, 3000);
  }
}

// Open boxes (requires 5 coins)
function openBoxes() {
  if (balance >= 5) {
    spendCoins(5);
    // Redirect to boxes page
    window.location.href = "boxes.html";
  } else {
    alert("Você precisa de 5 moedas para abrir caixas!");
  }
}

// Spin roulette (requires 10 coins)
function spinRoulette() {
  if (balance >= 10) {
    spendCoins(10);
    // Redirect to roulette page
    window.location.href = "roulette.html";
  } else {
    alert("Você precisa de 10 moedas para girar a roleta!");
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  updateBalanceDisplay();

  // Check if timer was running from previous session
  const lastGiftTime = localStorage.getItem("last_gift_time");
  if (lastGiftTime) {
    const now = Date.now();
    const timeDiff = Math.floor((now - parseInt(lastGiftTime)) / 1000);
    if (timeDiff < 10) {
      timeLeft = 10 - timeDiff;
      startTimer();
    }
  }

  // Update button states
  const openBoxesBtn = document.getElementById("open-boxes-btn");
  const spinRouletteBtn = document.getElementById("spin-roulette-btn");

  if (openBoxesBtn) {
    openBoxesBtn.disabled = balance < 5;
  }
  if (spinRouletteBtn) {
    spinRouletteBtn.disabled = balance < 10;
  }
});
