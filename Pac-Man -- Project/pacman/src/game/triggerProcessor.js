
 // ======================================
 // IMPORTS
 // ======================================

import {
    player,
    player2,
    ghosts,
    getFrightenedTimer,
    setFrightenedTimer,
    resetSprites,
    activateSpeedBoost,
} from "../sprites/sprites.js";

import {
    maps,
    currentLevelIndex,
    switchLevel,
    getCurrentLevel,
} from "../ressources/map.js";

import {
    COLLECTION_DISTANCE_SQUARED,
    SAFE_ZONE_TILES,
    BONUS_SPAWN_EXCLUSION_ZONE,
    GHOST_NEARBY_DISTANCE_SQUARED,
    PLAYER_NEARBY_DISTANCE_SQUARED,
    POINTS_NORMAL_PELLET,
    POINTS_POWER_PELLET,
    POINTS_CHERRY,
    POINTS_GHOST,
    FRIGHTENED_DURATION
} from "../constants/constant.js";

import { TileType } from "../constants/gameEnums.js";

import { showLevelIntro } from "./ui.js";

// ======================================
// DISTANCE CHECK
// ======================================

function isCollected(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;

    return (
        dx * dx + dy * dy <
        COLLECTION_DISTANCE_SQUARED
    );
}

// ======================================
// ACTIVE PLAYERS
// ======================================

function getActivePlayers(gameData) {
    if (gameData.gameMode === "COOP") {
        return [player, player2];
    }

    return [player];
}

// ======================================
// SAFE ZONE
// ======================================

function isInSafeZone(targetPlayer) {
    return SAFE_ZONE_TILES.some(tile =>
        Math.round(targetPlayer.x) === tile.x &&
        Math.round(targetPlayer.y) === tile.y
    );
}

// ======================================
// BONUS SPAWN EXCLUSION ZONE
// ======================================

function isInBonusExclusionZone(x, y) {
    return (
        x >= BONUS_SPAWN_EXCLUSION_ZONE.minX &&
        x <= BONUS_SPAWN_EXCLUSION_ZONE.maxX &&
        y >= BONUS_SPAWN_EXCLUSION_ZONE.minY &&
        y <= BONUS_SPAWN_EXCLUSION_ZONE.maxY
    );
}

// ======================================
// CHERRY SPAWNING
// ======================================

function spawnCherry(gameData, currentMap) {
    const validPositions = [];

    for (let r = 0; r < currentMap.length; r++) {
        for (let c = 0; c < currentMap[r].length; c++) {
            const tile = currentMap[r][c];

            if (
                tile !== TileType.EMPTY &&
                tile !== TileType.GHOST_WALL
            ) continue;

            if (isInBonusExclusionZone(c, r)) {
                continue;
            }

            const hasPowerPellet = gameData.powerPellets.some(
                pellet => pellet.x === c && pellet.y === r
            );

            if (hasPowerPellet) continue;

            const ghostNearby = ghosts.some(
                ghost =>
                    isCollected(ghost.x, ghost.y, c, r) ||
                    (ghost.x - c) ** 2 + (ghost.y - r) ** 2 <
                    GHOST_NEARBY_DISTANCE_SQUARED
            );

            if (ghostNearby) continue;

            validPositions.push({ x: c, y: r });
        }
    }

    if (validPositions.length === 0) {
        gameData.cherry.visible = false;
        return;
    }

    const position =
        validPositions[Math.floor(Math.random() * validPositions.length)];

    gameData.cherry.x = position.x;
    gameData.cherry.y = position.y;
    gameData.cherry.visible = true;

    gameData.items = gameData.items.filter(
        item => item.x !== position.x || item.y !== position.y
    );
}

export function initializeCherry(gameData) {
    spawnCherry(gameData, gameData.map);
    initializeSpeedBoost(gameData);
}

// ======================================
// SPEED BOOST SPAWNING
// ======================================

function spawnSpeedBoost(gameData, currentMap) {
    const validPositions = [];

    for (let r = 0; r < currentMap.length; r++) {
        for (let c = 0; c < currentMap[r].length; c++) {
            const tile = currentMap[r][c];

            if (
                tile !== TileType.EMPTY &&
                tile !== TileType.GHOST_WALL
            ) continue;

            if (isInBonusExclusionZone(c, r)) continue;

            if (
                gameData.cherry.visible &&
                gameData.cherry.x === c &&
                gameData.cherry.y === r
            ) continue;

            if (gameData.powerPellets.some(
                p => p.x === c && p.y === r
            )) continue;

            const playerDx = player.x - c;
            const playerDy = player.y - r;

            if (
                playerDx * playerDx + playerDy * playerDy <
                PLAYER_NEARBY_DISTANCE_SQUARED
            ) {
                continue;
            }

            validPositions.push({ x: c, y: r });
        }
    }

    if (validPositions.length === 0) {
        gameData.speedBoost.visible = false;
        return;
    }

    const position =
        validPositions[Math.floor(Math.random() * validPositions.length)];

    gameData.speedBoost.x = position.x;
    gameData.speedBoost.y = position.y;
    gameData.speedBoost.visible = true;
}

export function initializeSpeedBoost(gameData) {
    spawnSpeedBoost(gameData, gameData.map);
}

// ======================================
// INITIALIZE LEVEL COLLECTIBLES
// ======================================

function initializeLevelCollectibles(gameData, currentMap) {
    gameData.items = [];
    gameData.powerPellets = [];

    for (let r = 0; r < currentMap.length; r++) {
        for (let c = 0; c < currentMap[r].length; c++) {
            const tile = currentMap[r][c];

            if (tile === TileType.EMPTY) {
                gameData.items.push({ x: c, y: r });
            } else if (tile === TileType.POWER_PELLET) {
                gameData.powerPellets.push({ x: c, y: r });
            }
        }
    }

    gameData.TOTAL_ITEMS = gameData.items.length;
}

// ======================================
// GAME COLLISIONS AND TRIGGERS
// ======================================

export function processGameTriggers(gameData, callbacks) {
    const {
        updateUI,
        showOverlay,
        resetPlayerPosition,
    } = callbacks;

    const activePlayers = getActivePlayers(gameData);

    let collectiblesChanged = false;

    // ======================================
    // 1. NORMAL PELLETS
    // ======================================

    for (let i = gameData.items.length - 1; i >= 0; i--) {
        const item = gameData.items[i];

        const collected = activePlayers.some(targetPlayer =>
            isCollected(targetPlayer.x, targetPlayer.y, item.x, item.y)
        );

        if (collected) {
            gameData.score += POINTS_NORMAL_PELLET;
            gameData.items.splice(i, 1);
            collectiblesChanged = true;
        }
    }

    // ======================================
    // 2. POWER PELLETS
    // ======================================

    for (let i = gameData.powerPellets.length - 1; i >= 0; i--) {
        const pellet = gameData.powerPellets[i];

        const collected = activePlayers.some(targetPlayer =>
            isCollected(targetPlayer.x, targetPlayer.y, pellet.x, pellet.y)
        );

        if (collected) {
            gameData.score += POINTS_POWER_PELLET;
            setFrightenedTimer(FRIGHTENED_DURATION);

            gameData.powerPellets.splice(i, 1);
            collectiblesChanged = true;
        }
    }

    // ======================================
    // 3. CHERRY
    // ======================================

    if (gameData.cherry?.visible) {
        const collected = activePlayers.some(targetPlayer =>
            isCollected(
                targetPlayer.x,
                targetPlayer.y,
                gameData.cherry.x,
                gameData.cherry.y
            )
        );

        if (collected) {
            gameData.score += POINTS_CHERRY;
            gameData.cherry.visible = false;
            collectiblesChanged = true;
        }
    }

    // ======================================
    // 4. SPEED BOOST
    // ======================================

    if (gameData.speedBoost?.visible) {
        const collected = activePlayers.some(targetPlayer =>
            isCollected(
                targetPlayer.x,
                targetPlayer.y,
                gameData.speedBoost.x,
                gameData.speedBoost.y
            )
        );

        if (collected) {
            activateSpeedBoost();
            gameData.speedBoost.visible = false;
        }
    }

    if (collectiblesChanged) {
        updateUI(gameData);
    }

    // ======================================
    // 5. LEVEL COMPLETION
    // ======================================

    if (gameData.items.length === 0) {
        const nextIndex = currentLevelIndex + 1;

        if (nextIndex < maps.length) {
            switchLevel(nextIndex);

            gameData.map = maps[nextIndex];

            resetSprites();
            resetPlayerPosition();

            initializeLevelCollectibles(gameData, gameData.map);

            spawnCherry(gameData, gameData.map);

            updateUI(gameData);

            gameData.gameState = "PAUSED";

            showLevelIntro(getCurrentLevel());

        } else {
            gameData.gameState = "VICTORY";

            showOverlay(
                "VICTORY!",
                `You cleared all levels! Final Score: ${gameData.score}`,
                "PLAY AGAIN",
            );
        }

        return;
    }

    // ======================================
    // 6. GHOST COLLISIONS
    // ======================================

    let lifeLost = false;
    let ghostEaten = false;

    for (const targetPlayer of activePlayers) {

        // Each player has their own safe-zone protection.
        if (isInSafeZone(targetPlayer)) {
            continue;
        }

        for (const ghost of ghosts) {

            if (!isCollected(
                targetPlayer.x,
                targetPlayer.y,
                ghost.x,
                ghost.y
            )) {
                continue;
            }

            if (getFrightenedTimer() > 0) {
                // Eat frightened ghost
                gameData.score += POINTS_GHOST;

                ghost.x = ghost.homeX;
                ghost.y = ghost.homeY;
                ghost.dx = 0;
                ghost.dy = 0;
                ghost.decisionLocked = false;

                ghostEaten = true;

            } else {
                // Lose only one life per collision event
                gameData.lives--;
                lifeLost = true;

                if (gameData.lives <= 0) {
                    gameData.gameState = "GAMEOVER";

                    showOverlay(
                        "GAME OVER",
                        `The ghosts caught you! Final Score: ${gameData.score}`,
                        "TRY AGAIN",
                    );
                } else {
                    resetPlayerPosition();

                    spawnCherry(gameData, gameData.map);
                    initializeSpeedBoost(gameData);
                }

                break;
            }
        }

        if (lifeLost) {
            break;
        }
    }

    if (ghostEaten || lifeLost) {
        updateUI(gameData);
    }
}
