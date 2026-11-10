export const scoreDisplay = document.getElementById("score-display");
export const livesDisplay = document.getElementById("lives-display");
export const itemsDisplay = document.getElementById("items-display");

const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayDesc = document.getElementById("overlay-desc");

export const actionBtn = document.getElementById("action-btn");
export const soloBtn = document.getElementById("solo-btn");
export const coopBtn = document.getElementById("coop-btn");

const modeButtons = document.getElementById("mode-buttons");

// ======================================
// UPDATE UI
// ======================================

export function updateUI(data) {
    scoreDisplay.textContent = data.score;
    livesDisplay.textContent = data.lives;

    const collectedCount =
        data.TOTAL_ITEMS - data.items.length;

    itemsDisplay.textContent =
        `${collectedCount}/${data.TOTAL_ITEMS}`;
}

// ======================================
// MODE SELECTION
// ======================================

export function showModeSelection() {
    overlayTitle.textContent = "MINI PAC-MAN";
    overlayDesc.textContent =
        "Choose your game mode. In Co-op, two players work together!";

    modeButtons.classList.remove("hidden");
    actionBtn.classList.add("hidden");

    overlay.classList.remove("hidden");
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
}

// ======================================
// OVERLAY
// ======================================

export function showOverlay(title, desc, btnText) {
    overlayTitle.textContent = title;
    overlayDesc.textContent = desc;
    actionBtn.textContent = btnText;

    modeButtons.classList.add("hidden");
    actionBtn.classList.remove("hidden");

    overlay.classList.remove("hidden");
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
}

export function hideOverlay() {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
}