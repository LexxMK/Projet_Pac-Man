
import { map } from "../ressources/map.js";

import {
    player,
    player2,
    resetSprites,
    updatePlayer,
} from "../sprites/sprites.js";

import { updateGhosts } from "../sprites/ghostAI.js";

import {
    processGameTriggers,
    initializeCherry,
} from "./triggerProcessor.js";

import { gameData } from "./gameState.js";
import { updateUI, showOverlay } from "./ui.js";

import {
    PLAYER_1_START,
    PLAYER_2_START,
    STARTING_LIVES,
    SAFE_ZONE_TILES,
} from "../constants/constant.js";

// ======================================
// PLAYER POSITION
// ======================================

export function resetPlayerPosition() {
    // Player 1 - Pac-Man
    player.x = PLAYER_1_START.x;
    player.y = PLAYER_1_START.y;
    player.dx = 0;
    player.dy = 0;
    player.nextDx = 0;
    player.nextDy = 0;

    // Player 2 - Ms. Pac-Man
    player2.x = PLAYER_2_START.x;
    player2.y = PLAYER_2_START.y;
    player2.dx = 0;
    player2.dy = 0;
    player2.nextDx = 0;
    player2.nextDy = 0;
}

// ======================================
// SAFE ZONE
// ======================================

export function isPlayerInSafeZone() {
    return SAFE_ZONE_TILES.some(
        tile =>
            Math.round(player.x) === tile.x &&
            Math.round(player.y) === tile.y
    );
}

// ======================================
// INITIALIZE GAME
// ======================================

export function initGame(mode = "SOLO") {
    gameData.score = 0;
    gameData.lives = STARTING_LIVES;
    gameData.gameMode = mode;

    gameData.items = [];
    gameData.powerPellets = [];
    gameData.TOTAL_ITEMS = 0;

    resetSprites();
    resetPlayerPosition();

    gameData.map = map;
    gameData.cherry.visible = true;

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === 0) {
                gameData.items.push({ x: c, y: r });
            } else if (map[r][c] === 2) {
                gameData.powerPellets.push({ x: c, y: r });
            }
        }
    }

    gameData.TOTAL_ITEMS = gameData.items.length;

    initializeCherry(gameData);

    updateUI(gameData);
}

// ======================================
// UPDATE GAME
// ======================================

export function updateGame() {
    if (gameData.gameState !== "PLAYING") return;

    // Player 1 always moves
    updatePlayer(player);

    // Player 2 moves only in Co-op
    if (gameData.gameMode === "COOP") {
        updatePlayer(player2);
    }

    updateGhosts();

    processGameTriggers(gameData, {
        updateUI,
        showOverlay,
        resetPlayerPosition,
        isPlayerInSafeZone,
    });
}