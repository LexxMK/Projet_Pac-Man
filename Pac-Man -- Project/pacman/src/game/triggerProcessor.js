// collisions.js

import {
  player,
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

// ======================================
// CHERRY SPAWNING
// ======================================


function spawnCherry(gameData, currentMap) {
  const validPositions = [];

  for (let r = 0; r < currentMap.length; r++) {
    for (let c = 0; c < currentMap[r].length; c++) {
      const tile = currentMap[r][c];

      // Only walkable tiles
      if (tile !== 0 && tile !== 4) continue;

      // Avoid the ghost safe zone
      if (c >= 7 && c <= 11 && r >= 4 && r <= 7) {
        continue;
      }

      // Avoid power pellets
      const hasPowerPellet = gameData.powerPellets.some(
        pellet => pellet.x === c && pellet.y === r
      );

      if (hasPowerPellet) continue;

      // Avoid ghosts
      const ghostNearby = ghosts.some(
        ghost => Math.hypot(ghost.x - c, ghost.y - r) < 3
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

  // Remove a normal pellet underneath the cherry
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

      // Only walkable tiles
      if (tile !== 0 && tile !== 4) continue;

      // Avoid ghost starting area
      if (c >= 7 && c <= 11 && r >= 4 && r <= 7) continue;

      // Avoid cherry
      if (
        gameData.cherry.visible &&
        gameData.cherry.x === c &&
        gameData.cherry.y === r
      ) continue;

      // Avoid power pellets
      if (gameData.powerPellets.some(
        p => p.x === c && p.y === r
      )) continue;

      // Avoid player
      if (Math.hypot(player.x - c, player.y - r) < 3) continue;

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

      if (tile === 0) {
        gameData.items.push({ x: c, y: r });
      } else if (tile === 2) {
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
    isPlayerInSafeZone,
  } = callbacks;

  // 1. NORMAL PELLETS
  gameData.items = gameData.items.filter((item) => {
    if (Math.hypot(player.x - item.x, player.y - item.y) < 0.4) {
      gameData.score += 10;
      updateUI(gameData);
      return false;
    }

    return true;
  });

  // 2. POWER PELLETS
  gameData.powerPellets = gameData.powerPellets.filter((pellet) => {
    if (Math.hypot(player.x - pellet.x, player.y - pellet.y) < 0.4) {
      gameData.score += 50;
      setFrightenedTimer(350);
      updateUI(gameData);
      return false;
    }

    return true;
  });

  // 3. CHERRY
  if (gameData.cherry && gameData.cherry.visible) {
    if (
      Math.hypot(player.x - gameData.cherry.x, player.y - gameData.cherry.y) <
      0.4
    ) {
      gameData.score += 100;
      gameData.cherry.visible = false;
      updateUI(gameData);
    }
  }

  // 4. SPEED BOOST
  if (gameData.speedBoost && gameData.speedBoost.visible) {
    if (
      Math.hypot(
        player.x - gameData.speedBoost.x,
        player.y - gameData.speedBoost.y
      ) < 0.4
    ) {
      activateSpeedBoost();
      gameData.speedBoost.visible = false;
    }
  }


  // 5. LEVEL COMPLETION
  if (gameData.items.length === 0) {
    const nextIndex = currentLevelIndex + 1;

    if (nextIndex < maps.length) {
      // Switch level
      switchLevel(nextIndex);

      // Update map
      gameData.map = maps[nextIndex];

      // Reset player and ghosts
      resetSprites();
      resetPlayerPosition();

      // Create collectibles for new level
      initializeLevelCollectibles(gameData, gameData.map);

      // Spawn cherry after initializing collectibles
      spawnCherry(gameData, gameData.map);

      updateUI(gameData);

      showOverlay(
        `LEVEL ${getCurrentLevel()}!`,
        "Get ready for the next maze!",
        "CONTINUE",
      );

      gameData.gameState = "PAUSED";
    } else {
      // All levels completed
      gameData.gameState = "VICTORY";

      showOverlay(
        "VICTORY!",
        `You cleared all levels! Final Score: ${gameData.score}`,
        "PLAY AGAIN",
      );
    }

    return;
  }

  // 6. GHOST COLLISIONS
  if (!isPlayerInSafeZone()) {
    ghosts.forEach((ghost) => {
      if (Math.hypot(player.x - ghost.x, player.y - ghost.y) < 0.5) {
        if (getFrightenedTimer() > 0) {
          // Eat frightened ghost
          gameData.score += 200;

          ghost.x = ghost.homeX;
          ghost.y = ghost.homeY;
          ghost.dx = 0;
          ghost.dy = 0;

          updateUI(gameData);
        } else {
          // Lose a life
          gameData.lives--;
          updateUI(gameData);

          if (gameData.lives <= 0) {
            gameData.gameState = "GAMEOVER";

            showOverlay(
              "GAME OVER",
              `The ghosts caught you! Final Score: ${gameData.score}`,
              "TRY AGAIN",
            );
          } else {
            resetPlayerPosition();

            // Respawn cherry after losing a life
            spawnCherry(gameData, gameData.map);
            initializeSpeedBoost(gameData);

          }
        }
      }
    });
  }
}
