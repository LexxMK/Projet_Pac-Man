
import { player, player2 } from "../sprites/sprites.js";

// ======================================
// SET PLAYER DIRECTION
// ======================================

function setDirection(targetPlayer, dx, dy) {
    targetPlayer.nextDx = dx;
    targetPlayer.nextDy = dy;
}

// ======================================
// KEYBOARD CONTROLS
// ======================================

function handleKeyDown(e) {
    switch (e.key.toLowerCase()) {

        // PLAYER 1 - WASD
        case "w":
            setDirection(player, 0, -1);
            break;

        case "s":
            setDirection(player, 0, 1);
            break;

        case "a":
            setDirection(player, -1, 0);
            break;

        case "d":
            setDirection(player, 1, 0);
            break;

        // PLAYER 2 - ARROW KEYS
        case "arrowup":
            setDirection(player2, 0, -1);
            break;

        case "arrowdown":
            setDirection(player2, 0, 1);
            break;

        case "arrowleft":
            setDirection(player2, -1, 0);
            break;

        case "arrowright":
            setDirection(player2, 1, 0);
            break;
    }
}

// ======================================
// MOBILE CONTROLS
// ======================================

function setupMobileControls() {
    document
        .getElementById("btn-up")
        .addEventListener("click", () => setDirection(player, 0, -1));

    document
        .getElementById("btn-down")
        .addEventListener("click", () => setDirection(player, 0, 1));

    document
        .getElementById("btn-left")
        .addEventListener("click", () => setDirection(player, -1, 0));

    document
        .getElementById("btn-right")
        .addEventListener("click", () => setDirection(player, 1, 0));
}

// ======================================
// INITIALIZE CONTROLS
// ======================================

export function setupControls() {
    window.addEventListener("keydown", handleKeyDown);

    setupMobileControls();
}
