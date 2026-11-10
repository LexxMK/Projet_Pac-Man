
import { ghosts } from "../sprites/sprites.js";
import { isGhostWall } from "../ressources/map.js";

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
} from "./ui.js";

import { TARGET_FPS } from "../constants/constant.js";

// ======================================
// GAME SETTINGS
// ======================================

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

    gameData.gameState = "PLAYING";

    hideOverlay();

    lastTime = performance.now();
    accumulator = 0;

    animationFrameId = requestAnimationFrame(gameLoop);
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
        gameData.gameState = "START";
        showModeSelection();
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
// DEBUGGING
// ======================================

window.ghostsDebug = ghosts;
window.mapDebug = isGhostWall;

// ======================================
// START APPLICATION
// ======================================

window.addEventListener("load", initializeApplication);
