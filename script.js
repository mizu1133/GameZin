let mins = 0; let autoMiners = 0; let prestigeLevel = 0; let lastActive = Date.now();
let btcAddress = "bc1qexample"; let conversionRate = 0.00001 / 10000;

function updateUI() {
    document.getElementById("mins").innerText = mins.toFixed(2) + " Mins";
    document.getElementById("rate").innerText = "Passive Income: " + (autoMiners * 0.1).toFixed(2) + " Mins/sec";
    localStorage.setItem("save", JSON.stringify({ mins, autoMiners, prestigeLevel, lastActive: Date.now() }));
}
function mine() { mins += 1; updateUI(); }
function buyAutoMiner() {
    let cost = 10 + autoMiners * 5;
    if (mins >= cost) { mins -= cost; autoMiners++; updateUI(); }
    else { alert("Not enough Mins"); }
}
function prestige() {
    if (mins >= 10000) {
        mins = 0; autoMiners = 0; prestigeLevel++;
        alert("Prestiged! Bonus: +" + (prestigeLevel * 5) + "% offline efficiency");
        updateUI();
    } else { alert("Need 10,000 Mins to prestige."); }
}
function exportBTC() {
    if (mins >= 10000) {
        let btcAmount = 10000 * conversionRate;
        let content = `Send ${btcAmount.toFixed(8)} BTC to:\n${btcAddress}`;
        let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob); link.download = "btc_payout.txt"; link.click();
        mins -= 10000; updateUI();
    } else { alert("Need 10,000 Mins to export payout."); }
}
function openSettings() {
    document.getElementById("btcAddress").value = btcAddress;
    document.getElementById("conversionRate").value = conversionRate;
    document.getElementById("settings").style.display = "block";
}
function saveSettings() {
    btcAddress = document.getElementById("btcAddress").value;
    conversionRate = parseFloat(document.getElementById("conversionRate").value);
    localStorage.setItem("settings", JSON.stringify({ btcAddress, conversionRate }));
    closeSettings();
}
function closeSettings() {
    document.getElementById("settings").style.display = "none";
}
function passiveMine() {
    mins += autoMiners * 0.1; updateUI();
}
function load() {
    let save = JSON.parse(localStorage.getItem("save"));
    if (save) {
        mins = save.mins; autoMiners = save.autoMiners; prestigeLevel = save.prestigeLevel;
        let offlineTime = (Date.now() - save.lastActive) / 1000;
        let offlineMins = autoMiners * 0.1 * offlineTime * 511 * (1 + 0.05 * prestigeLevel);
        mins += offlineMins;
    }
    let settings = JSON.parse(localStorage.getItem("settings"));
    if (settings) { btcAddress = settings.btcAddress; conversionRate = settings.conversionRate; }
    updateUI(); setInterval(passiveMine, 1000);
}
window.onload = load;


function convertZinToSatoshi(zin) {
    const conversionRate = 1000;
    return zin / conversionRate;
}

function convertZinToBTC(zin) {
    const satoshis = convertZinToSatoshi(zin);
    return satoshis * 0.00000001;
}
