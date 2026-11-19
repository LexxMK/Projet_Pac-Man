
import { map, currentLevelIndex } from "../ressources/map.js";
import { drawSprites } from "../sprites/spriteDrawer.js";

import {
    MAZE_BORDER_WIDTH,
    PELLET_RADIUS_MULTIPLIER,
    POWER_PELLET_RADIUS_MULTIPLIER,
    POWER_PELLET_BLINK_INTERVAL,
    SPEED_BOOST_COLOR,
    SPEED_BOOST_BORDER_COLOR,
    SPEED_BOOST_BORDER_WIDTH,
    SPEED_BOOST_BOLT_POINTS
} from "../constants/constant.js";

// ======================================
// LEVEL VISUAL THEMES
// ======================================

const LEVEL_THEMES = [
    {
        name: "CLASSIC",
        background: "#020617",
        wall: "#1e3a8a",
        wallBorder: "#60a5fa",
        wallGlow: "#3b82f6",
        wallGlowStrength: 8,
        ghostWall: "#064e3b",
        ghostWallBorder: "#34d399",
        ghostWallGlow: "#10b981",
        pellet: "#fde047",
        powerPellet: "#fb7185",
        powerPelletGlow: "#f43f5e"
    },

    {
        name: "NEON",
        background: "#0c0520",
        wall: "#581c87",
        wallBorder: "#c084fc",
        wallGlow: "#a855f7",
        wallGlowStrength: 12,
        ghostWall: "#312e81",
        ghostWallBorder: "#818cf8",
        ghostWallGlow: "#6366f1",
        pellet: "#f5d0fe",
        powerPellet: "#e879f9",
        powerPelletGlow: "#d946ef"
    },

    {
        name: "THE GAUNTLET",
        background: "#190606",
        wall: "#7f1d1d",
        wallBorder: "#fb7185",
        wallGlow: "#ef4444",
        wallGlowStrength: 15,
        ghostWall: "#7c2d12",
        ghostWallBorder: "#fdba74",
        ghostWallGlow: "#f97316",
        pellet: "#fde68a",
        powerPellet: "#f97316",
        powerPelletGlow: "#ea580c"
    }
];

// ======================================
// MAZE CACHE
// ======================================

let mazeCanvas = null;
let cachedMap = null;
let cachedTileSize = null;
let cachedThemeIndex = null;
let previousThemeIndex = null;

function createMazeCache(ctx, tileSize, currentMap, theme) {

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    mazeCanvas = document.createElement("canvas");

    mazeCanvas.width = width;
    mazeCanvas.height = height;

    const mazeCtx = mazeCanvas.getContext("2d");

    for (let r = 0; r < currentMap.length; r++) {
        for (let c = 0; c < currentMap[r].length; c++) {

            const tile = currentMap[r][c];

            const x = c * tileSize;
            const y = r * tileSize;

            // ======================================
            // NORMAL WALLS
            // ======================================

            if (tile === 1) {

                mazeCtx.shadowColor = theme.wallGlow;
                mazeCtx.shadowBlur = theme.wallGlowStrength;
                mazeCtx.fillStyle = theme.wall;

                mazeCtx.fillRect(
                    x,
                    y,
                    tileSize,
                    tileSize
                );

                mazeCtx.strokeStyle = theme.wallBorder;
                mazeCtx.lineWidth = MAZE_BORDER_WIDTH;

                mazeCtx.strokeRect(
                    x,
                    y,
                    tileSize,
                    tileSize
                );
            }

            // ======================================
            // GHOST HOUSE WALLS
            // ======================================

            else if (tile === 4) {

                mazeCtx.shadowColor = theme.ghostWallGlow;
                mazeCtx.shadowBlur = 6;
                mazeCtx.fillStyle = theme.ghostWall;

                mazeCtx.fillRect(
                    x,
                    y,
                    tileSize,
                    tileSize
                );

                mazeCtx.strokeStyle = theme.ghostWallBorder;
                mazeCtx.lineWidth = MAZE_BORDER_WIDTH;

                mazeCtx.strokeRect(
                    x,
                    y,
                    tileSize,
                    tileSize
                );
            }
        }
    }

    // Reset cache drawing effects
    mazeCtx.shadowBlur = 0;
    mazeCtx.shadowColor = "transparent";

    cachedMap = currentMap;
    cachedTileSize = tileSize;
    cachedThemeIndex = currentLevelIndex;
}

// ======================================
// GET CURRENT LEVEL THEME
// ======================================

function getCurrentTheme() {
    return LEVEL_THEMES[currentLevelIndex] || LEVEL_THEMES[0];
}

// ======================================
// DRAW BACKGROUND
// ======================================

function drawBackground(ctx, theme) {

    ctx.fillStyle = theme.background;

    ctx.fillRect(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
    );
}

// ======================================
// DRAW NORMAL PELLETS
// ======================================

function drawPellets(ctx, tileSize, gameData, theme) {

    ctx.save();

    ctx.fillStyle = theme.pellet;
    ctx.shadowColor = theme.pellet;
    ctx.shadowBlur = 4;

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

    ctx.restore();
}

// ======================================
// DRAW POWER PELLETS
// ======================================

function drawPowerPellets(ctx, tileSize, gameData, theme) {

    if (
        Math.floor(Date.now() / POWER_PELLET_BLINK_INTERVAL) % 2 !== 0
    ) return;

    const pulse = Math.sin(Date.now() / 250) * 0.06;

    ctx.save();

    ctx.fillStyle = theme.powerPellet;
    ctx.shadowColor = theme.powerPelletGlow;
    ctx.shadowBlur = 12;

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
            tileSize * (
                POWER_PELLET_RADIUS_MULTIPLIER + pulse
            ),
            0,
            Math.PI * 2
        );

        ctx.fill();
    });

    ctx.restore();
}

// ======================================
// DRAW CHERRY
// ======================================

function drawCherry(ctx, tileSize, gameData) {

    if (
        !gameData.cherry ||
        !gameData.cherry.visible ||
        !gameData.cherry.image ||
        !gameData.cherry.image.complete ||
        gameData.cherry.image.naturalWidth === 0
    ) return;

    ctx.save();

    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 10;

    ctx.drawImage(
        gameData.cherry.image,
        gameData.cherry.x * tileSize,
        gameData.cherry.y * tileSize,
        tileSize,
        tileSize
    );

    ctx.restore();
}

// ======================================
// DRAW SPEED BOOST
// ======================================

function drawSpeedBoost(ctx, tileSize, gameData) {

    if (!gameData.speedBoost?.visible) return;

    const x = gameData.speedBoost.x * tileSize;
    const y = gameData.speedBoost.y * tileSize;

    ctx.save();

    ctx.fillStyle = SPEED_BOOST_COLOR;
    ctx.strokeStyle = SPEED_BOOST_BORDER_COLOR;
    ctx.lineWidth = SPEED_BOOST_BORDER_WIDTH;

    ctx.shadowColor = SPEED_BOOST_COLOR;
    ctx.shadowBlur = 12;

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

    ctx.restore();
}

// ======================================
// DRAW GAME
// ======================================

export function drawGame(ctx, tileSize, gameData) {

    const currentMap = gameData.map || map;
    const theme = getCurrentTheme();

    // ======================================
    // 1. DRAW BACKGROUND
    // ======================================

    drawBackground(ctx, theme);

    // ======================================
    // 2. RESET CACHE WHEN LEVEL CHANGES
    // ======================================

    if (previousThemeIndex !== currentLevelIndex) {
        mazeCanvas = null;
        previousThemeIndex = currentLevelIndex;
    }

    // ======================================
    // 3. UPDATE MAZE CACHE IF NECESSARY
    // ======================================

    if (
        !mazeCanvas ||
        cachedMap !== currentMap ||
        cachedTileSize !== tileSize ||
        cachedThemeIndex !== currentLevelIndex ||
        mazeCanvas.width !== ctx.canvas.width ||
        mazeCanvas.height !== ctx.canvas.height
    ) {

        createMazeCache(
            ctx,
            tileSize,
            currentMap,
            theme
        );
    }

    // ======================================
    // 4. DRAW MAZE
    // ======================================

    ctx.drawImage(mazeCanvas, 0, 0);

    // ======================================
    // 5. DRAW NORMAL PELLETS
    // ======================================

    drawPellets(ctx, tileSize, gameData, theme);

    // ======================================
    // 6. DRAW POWER PELLETS
    // ======================================

    drawPowerPellets(ctx, tileSize, gameData, theme);

    // ======================================
    // 7. DRAW CHERRY
    // ======================================

    drawCherry(ctx, tileSize, gameData);

    // ======================================
    // 8. DRAW SPEED BOOST
    // ======================================

    drawSpeedBoost(ctx, tileSize, gameData);

    // ======================================
    // 9. DRAW PLAYERS AND GHOSTS
    // ======================================

    drawSprites(ctx, tileSize);
}
