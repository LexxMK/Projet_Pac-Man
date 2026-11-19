
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
// LEVEL INTRODUCTIONS
// ======================================

const LEVEL_INTROS = {
    1: {
        name: "THE CLASSIC",
        description:
            "Welcome to the maze! Collect every pellet, avoid the ghosts, and prove your skills!",
        color: "#60a5fa",
        button: "READY?"
    },

    2: {
        name: "NEON NIGHTMARE",
        description:
            "The lights are brighter and the ghosts are faster. Danger is around every corner. Stay sharp!",
        color: "#c084fc",
        button: "READY?"
    },

    3: {
        name: "THE GAUNTLET",
        description:
            "This is your final test. Only the bravest players will conquer The Gauntlet!",
        color: "#fb7185",
        button: "READY?"
    }
};

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

    overlayTitle.style.color = "";
    overlayTitle.style.textShadow = "";

    modeButtons.classList.remove("hidden");
    actionBtn.classList.add("hidden");

    overlay.classList.remove("hidden");
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
}

// ======================================
// LEVEL INTRODUCTION
// ======================================

export function showLevelIntro(level) {
    const intro = LEVEL_INTROS[level];

    if (!intro) return;

    overlayTitle.textContent = `LEVEL ${level} - ${intro.name}`;
    overlayDesc.textContent = intro.description;

    overlayTitle.style.color = intro.color;
    overlayTitle.style.textShadow =
        `0 0 10px ${intro.color}, 0 0 25px ${intro.color}`;

    actionBtn.textContent = intro.button;

    modeButtons.classList.add("hidden");
    actionBtn.classList.remove("hidden");

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

    overlayTitle.style.color = "";
    overlayTitle.style.textShadow = "";

    modeButtons.classList.add("hidden");
    actionBtn.classList.remove("hidden");

    overlay.classList.remove("hidden");
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
}

// ======================================
// HIDE OVERLAY
// ======================================

export function hideOverlay() {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
}