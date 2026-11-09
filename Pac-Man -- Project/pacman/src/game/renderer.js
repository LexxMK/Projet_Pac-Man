
// renderer.js

import { map } from "../ressources/map.js";
import { drawSprites } from "../sprites/spriteDrawer.js";

export function drawGame(ctx, tileSize, gameData) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const currentMap = gameData.map || map;

  // 1. DRAW MAZE WALLS
  for (let r = 0; r < currentMap.length; r++) {
    for (let c = 0; c < currentMap[r].length; c++) {
      if (currentMap[r][c] === 1) {
        ctx.fillStyle = "#1e3a8a";
        ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);

        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 1;
        ctx.strokeRect(c * tileSize, r * tileSize, tileSize, tileSize);

      } else if (currentMap[r][c] === 4) {
        ctx.fillStyle = "#065f46";
        ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);

        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 1;
        ctx.strokeRect(c * tileSize, r * tileSize, tileSize, tileSize);
      }
    }
  }

  // 2. DRAW NORMAL PELLETS
  gameData.items.forEach(item => {
    if (
      gameData.cherry?.visible &&
      item.x === gameData.cherry.x &&
      item.y === gameData.cherry.y
    ) return;

    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.arc(
      (item.x + 0.5) * tileSize,
      (item.y + 0.5) * tileSize,
      tileSize * 0.18,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  // 3. DRAW POWER PELLETS
  gameData.powerPellets.forEach(pellet => {
    if (
      gameData.cherry?.visible &&
      pellet.x === gameData.cherry.x &&
      pellet.y === gameData.cherry.y
    ) return;

    if (Math.floor(Date.now() / 200) % 2 === 0) {
      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.arc(
        (pellet.x + 0.5) * tileSize,
        (pellet.y + 0.5) * tileSize,
        tileSize * 0.35,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  });

  // 4. DRAW CHERRY
  if (
    gameData.cherry &&
    gameData.cherry.visible &&
    gameData.cherry.image &&
    gameData.cherry.image.complete &&
    gameData.cherry.image.naturalWidth > 0
  ) {
    ctx.drawImage(
      gameData.cherry.image,
      gameData.cherry.x * tileSize,
      gameData.cherry.y * tileSize,
      tileSize,
      tileSize
    );
  }

  // 5. DRAW SPEED BOOST
if (gameData.speedBoost && gameData.speedBoost.visible) {
  const x = gameData.speedBoost.x * tileSize;
  const y = gameData.speedBoost.y * tileSize;

  ctx.fillStyle = "#facc15";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(x + tileSize * 0.58, y + tileSize * 0.08);
  ctx.lineTo(x + tileSize * 0.25, y + tileSize * 0.55);
  ctx.lineTo(x + tileSize * 0.48, y + tileSize * 0.55);
  ctx.lineTo(x + tileSize * 0.35, y + tileSize * 0.92);
  ctx.lineTo(x + tileSize * 0.78, y + tileSize * 0.38);
  ctx.lineTo(x + tileSize * 0.54, y + tileSize * 0.38);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();
}

  // 6. DRAW PLAYER AND GHOSTS
  drawSprites(ctx, tileSize);
}
