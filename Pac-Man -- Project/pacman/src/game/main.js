
import { ghosts } from "../sprites/sprites.js";
import {
    isGhostWall,
    map,
    switchLevel,
} from "../ressources/map.js";

import { gameData } from "./gameState.js";

import {
    initGame,
    updateGame,
} from "./game.js";

import {
    resizeCanvas,
    setupCanvasEvents,
    renderCanvas,
} from "./canvas.js";

import { setupControls } from "./controls.js";

import {
    actionBtn,
    soloBtn,
    coopBtn,
    hideOverlay,
    showModeSelection,
    showLevelIntro,
} from "./ui.js";

import { TARGET_FPS } from "../constants/constant.js";

let animationFrameId = null;
const timeStep = 1000 / TARGET_FPS;
let lastTime = 0;
let accumulator = 0;

// ======================================
// GAME LOOP
// ======================================

function gameLoop(timestamp) {
    if (gameData.gameState !== "PLAYING") return;

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += deltaTime;

    while (accumulator >= timeStep) {
        updateGame();
        accumulator -= timeStep;
    }

    renderCanvas(gameData);

    if (gameData.gameState === "PLAYING") {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// ======================================
// START GAME
// ======================================

function startGame(mode) {
    cancelAnimationFrame(animationFrameId);

    initGame(mode);

    gameData.gameState = "PAUSED";

    renderCanvas(gameData);
    showLevelIntro(1);
}

// ======================================
// RESUME GAME
// ======================================

function resumeGame() {
    gameData.gameState = "PLAYING";

    hideOverlay();

    lastTime = performance.now();
    accumulator = 0;

    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(gameLoop);
}

// ======================================
// RETURN TO MODE SELECTION
// ======================================

function returnToModeSelection() {
    cancelAnimationFrame(animationFrameId);

    // Reset the selected level
    switchLevel(0);

    // Reset the map displayed on the canvas
    gameData.map = map;

    // Clear the previously selected game mode
    gameData.gameMode = null;

    // Reset the game state
    gameData.gameState = "START";

    // Redraw the first map
    renderCanvas(gameData);

    // Display the mode selection screen
    showModeSelection();
}

// ======================================
// ACTION BUTTON
// ======================================

function handleActionButton() {
    if (gameData.gameState === "PAUSED") {
        resumeGame();
        return;
    }

    if (
        gameData.gameState === "VICTORY" ||
        gameData.gameState === "GAMEOVER"
    ) {
        returnToModeSelection();
    }
}

// ======================================
// INITIALIZE APPLICATION
// ======================================

function initializeApplication() {
    resizeCanvas();
    setupCanvasEvents();
    setupControls();

    renderCanvas(gameData);

    soloBtn.addEventListener("click", () => {
        startGame("SOLO");
    });

    coopBtn.addEventListener("click", () => {
        startGame("COOP");
    });

    actionBtn.addEventListener("click", handleActionButton);

    showModeSelection();
}

// ======================================
// DEBUG REFERENCES
// ======================================

window.ghostsDebug = ghosts;
window.mapDebug = isGhostWall;

// ======================================
// START APPLICATION
// ======================================

window.addEventListener("load", initializeApplication);