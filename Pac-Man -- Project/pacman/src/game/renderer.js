
import { map } from "../ressources/map.js";
import { drawSprites } from "../sprites/spriteDrawer.js";

import {
    MAZE_WALL_COLOR,
    MAZE_WALL_BORDER_COLOR,
    GHOST_WALL_COLOR,
    GHOST_WALL_BORDER_COLOR,
    MAZE_BORDER_WIDTH,
    PELLET_COLOR,
    PELLET_RADIUS_MULTIPLIER,
    POWER_PELLET_COLOR,
    POWER_PELLET_RADIUS_MULTIPLIER,
    POWER_PELLET_BLINK_INTERVAL,
    SPEED_BOOST_COLOR,
    SPEED_BOOST_BORDER_COLOR,
    SPEED_BOOST_BORDER_WIDTH,
    SPEED_BOOST_BOLT_POINTS
} from "../constants/constant.js";

// ======================================
// MAZE CACHE
// ======================================

let mazeCanvas = null;
let cachedMap = null;
let cachedTileSize = null;

function createMazeCache(ctx, tileSize, currentMap) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    mazeCanvas = document.createElement("canvas");
    mazeCanvas.width = width;
    mazeCanvas.height = height;

    const mazeCtx = mazeCanvas.getContext("2d");

    for (let r = 0; r < currentMap.length; r++) {
        for (let c = 0; c < currentMap[r].length; c++) {
            if (currentMap[r][c] === 1) {
                mazeCtx.fillStyle = MAZE_WALL_COLOR;

                mazeCtx.fillRect(
                    c * tileSize,
                    r * tileSize,
                    tileSize,
                    tileSize
                );

                mazeCtx.strokeStyle = MAZE_WALL_BORDER_COLOR;
                mazeCtx.lineWidth = MAZE_BORDER_WIDTH;

                mazeCtx.strokeRect(
                    c * tileSize,
                    r * tileSize,
                    tileSize,
                    tileSize
                );

            } else if (currentMap[r][c] === 4) {
                mazeCtx.fillStyle = GHOST_WALL_COLOR;

                mazeCtx.fillRect(
                    c * tileSize,
                    r * tileSize,
                    tileSize,
                    tileSize
                );

                mazeCtx.strokeStyle = GHOST_WALL_BORDER_COLOR;
                mazeCtx.lineWidth = MAZE_BORDER_WIDTH;

                mazeCtx.strokeRect(
                    c * tileSize,
                    r * tileSize,
                    tileSize,
                    tileSize
                );
            }
        }
    }

    cachedMap = currentMap;
    cachedTileSize = tileSize;
}

// ======================================
// DRAW GAME
// ======================================

export function drawGame(ctx, tileSize, gameData) {
    const currentMap = gameData.map || map;

    ctx.clearRect(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
    );

    // Rebuild the maze only when necessary
    if (
        !mazeCanvas ||
        cachedMap !== currentMap ||
        cachedTileSize !== tileSize ||
        mazeCanvas.width !== ctx.canvas.width ||
        mazeCanvas.height !== ctx.canvas.height
    ) {
        createMazeCache(ctx, tileSize, currentMap);
    }

    // 1. DRAW CACHED MAZE

    ctx.drawImage(mazeCanvas, 0, 0);

    // 2. DRAW NORMAL PELLETS

    ctx.fillStyle = PELLET_COLOR;

    gameData.items.forEach(item => {
        if (
            gameData.cherry?.visible &&
            item.x === gameData.cherry.x &&
            item.y === gameData.cherry.y
        ) return;

        ctx.beginPath();

        ctx.arc(
            (item.x + 0.5) * tileSize,
            (item.y + 0.5) * tileSize,
            tileSize * PELLET_RADIUS_MULTIPLIER,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });

    // 3. DRAW POWER PELLETS

    if (
        Math.floor(Date.now() / POWER_PELLET_BLINK_INTERVAL) % 2 === 0
    ) {
        ctx.fillStyle = POWER_PELLET_COLOR;

        gameData.powerPellets.forEach(pellet => {
            if (
                gameData.cherry?.visible &&
                pellet.x === gameData.cherry.x &&
                pellet.y === gameData.cherry.y
            ) return;

            ctx.beginPath();

            ctx.arc(
                (pellet.x + 0.5) * tileSize,
                (pellet.y + 0.5) * tileSize,
                tileSize * POWER_PELLET_RADIUS_MULTIPLIER,
                0,
                Math.PI * 2
            );

            ctx.fill();
        });
    }

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

    if (gameData.speedBoost?.visible) {
        const x = gameData.speedBoost.x * tileSize;
        const y = gameData.speedBoost.y * tileSize;

        ctx.fillStyle = SPEED_BOOST_COLOR;
        ctx.strokeStyle = SPEED_BOOST_BORDER_COLOR;
        ctx.lineWidth = SPEED_BOOST_BORDER_WIDTH;

        ctx.beginPath();

        SPEED_BOOST_BOLT_POINTS.forEach((point, index) => {
            const pointX = x + tileSize * point.x;
            const pointY = y + tileSize * point.y;

            if (index === 0) {
                ctx.moveTo(pointX, pointY);
            } else {
                ctx.lineTo(pointX, pointY);
            }
        });

        ctx.closePath();

        ctx.fill();
        ctx.stroke();
    }

    // 6. DRAW PLAYER AND GHOSTS

    drawSprites(ctx, tileSize);
}
