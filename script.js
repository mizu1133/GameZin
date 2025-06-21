
let zinCount = 0;
let zinPerSec = 1;
let upgradeCost = 100;
let btcVault = 0;

function mineZin() {
  zinCount += zinPerSec;
  updateGameDisplay();
}

function upgradeZin() {
  if (zinCount >= upgradeCost) {
    zinCount -= upgradeCost;
    zinPerSec += 1;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    updateGameDisplay();
  }
}

function updateGameDisplay() {
  document.getElementById("zinCount").innerText = zinCount;
  document.getElementById("zinPerSec").innerText = zinPerSec;
  document.getElementById("upgradeCost").innerText = upgradeCost;
  document.getElementById("zinBalance").innerText = zinCount;
  document.getElementById("btcVault").innerText = btcVault.toFixed(8);
}

function convertZinToVault() {
  const zinToSat = 1000;
  const sats = zinCount / zinToSat;
  const btc = sats / 100_000_000;
  btcVault += btc;
  zinCount = 0;
  updateGameDisplay();
}

function generatePayoutQR(btcAmount, walletAddress) {
  const payoutData = `bitcoin:${walletAddress}?amount=${btcAmount}`;
  const qrCanvas = document.getElementById("btcQR");

  new QRious({
    element: qrCanvas,
    value: payoutData,
    size: 256
  });

  document.getElementById("btcAmountDisplay").innerText =
    `Send ${btcAmount.toFixed(8)} BTC to: ${walletAddress}`;
}

document.addEventListener("DOMContentLoaded", function () {
  // Restore last saved state if available
  if (localStorage.getItem("zinCount")) zinCount = parseInt(localStorage.getItem("zinCount"));
  if (localStorage.getItem("zinPerSec")) zinPerSec = parseInt(localStorage.getItem("zinPerSec"));
  if (localStorage.getItem("btcVault")) btcVault = parseFloat(localStorage.getItem("btcVault"));

  // Offline reward logic
  let lastActiveTime = localStorage.getItem("lastActiveTime");
  if (lastActiveTime) {
    const secondsAway = Math.floor((Date.now() - parseInt(lastActiveTime)) / 1000);
    const offlineGain = zinPerSec * 511 * secondsAway;
    zinCount += offlineGain;
    alert(`You earned ${offlineGain.toLocaleString()} Zin while offline!`);
  }

  updateGameDisplay();

  setInterval(() => {
    zinCount += zinPerSec;
    updateGameDisplay();
  }, 1000);

  // Save lastActiveTime every 10 seconds (failsafe)
  setInterval(() => {
    localStorage.setItem("lastActiveTime", Date.now());
    localStorage.setItem("zinCount", zinCount);
    localStorage.setItem("zinPerSec", zinPerSec);
    localStorage.setItem("btcVault", btcVault);
  }, 10000);

  // QR payout
  const payoutBtn = document.getElementById("generatePayoutQR");
  if (payoutBtn) {
    payoutBtn.addEventListener("click", () => {
      const address = document.getElementById("btcAddress").value;
      if (btcVault > 0 && address) {
        generatePayoutQR(btcVault, address);
      }
    });
  }
});

window.addEventListener("beforeunload", () => {
  localStorage.setItem("lastActiveTime", Date.now());
  localStorage.setItem("zinCount", zinCount);
  localStorage.setItem("zinPerSec", zinPerSec);
  localStorage.setItem("btcVault", btcVault);
});
