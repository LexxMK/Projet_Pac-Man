
import { player, player2, ghosts, frightenedTimer } from "./sprites.js";
import { gameData } from "../game/gameState.js";

import {
    PLAYER_COLOR,
    PLAYER_2_COLOR,
    PLAYER_RADIUS_MULTIPLIER,
    PLAYER_MOUTH_ANIMATION_INTERVAL,
    PLAYER_MOUTH_OPEN_ANGLE,
    PLAYER_MOUTH_CLOSED_ANGLE,
    BOW_COLOR,
    BOW_X_OFFSET,
    BOW_Y_OFFSET,
    BOW_SIZE_MULTIPLIER,
    BOW_CENTER_RADIUS_MULTIPLIER,
    BOW_OUTER_POINT_MULTIPLIER,
    FRIGHTENED_GHOST_COLOR,
    FRIGHTENED_FLASH_COLOR,
    FRIGHTENED_PUPIL_COLOR,
    NORMAL_PUPIL_COLOR,
    FRIGHTENED_FLASH_THRESHOLD,
    FRIGHTENED_FLASH_INTERVAL,
    GHOST_RADIUS_MULTIPLIER,
    GHOST_VERTICAL_OFFSET,
    GHOST_EYE_OFFSET_X,
    GHOST_EYE_OFFSET_Y,
    GHOST_EYE_RADIUS_MULTIPLIER,
    GHOST_PUPIL_RADIUS_MULTIPLIER,
    GHOST_PUPIL_DIRECTION_MULTIPLIER
} from "../constants/constant.js";

let mouthAnimationTimer = 0;

// ======================================
// DRAW PAC-MAN
// ======================================

function drawPacMan(ctx, targetPlayer, tileSize, color, isMsPacMan = false) {
    const pX = (targetPlayer.x + 0.5) * tileSize;
    const pY = (targetPlayer.y + 0.5) * tileSize;
    const pRadius = tileSize * PLAYER_RADIUS_MULTIPLIER;

    let angleOffset = 0;

    if (targetPlayer.dx === 1) angleOffset = 0;
    if (targetPlayer.dx === -1) angleOffset = Math.PI;
    if (targetPlayer.dy === 1) angleOffset = Math.PI / 2;
    if (targetPlayer.dy === -1) angleOffset = Math.PI * 1.5;

    const mouthOpen =
        Math.floor(mouthAnimationTimer / PLAYER_MOUTH_ANIMATION_INTERVAL) % 2 === 0 &&
        (targetPlayer.dx !== 0 || targetPlayer.dy !== 0)
            ? PLAYER_MOUTH_OPEN_ANGLE
            : PLAYER_MOUTH_CLOSED_ANGLE;

    // Body
    ctx.fillStyle = color;
    ctx.beginPath();

    ctx.arc(
        pX,
        pY,
        pRadius,
        angleOffset + mouthOpen,
        angleOffset + Math.PI * 2 - mouthOpen
    );

    ctx.lineTo(pX, pY);
    ctx.fill();

    // Ms. Pac-Man bow
    if (isMsPacMan) {
        const bowX = pX + pRadius * BOW_X_OFFSET;
        const bowY = pY - pRadius * BOW_Y_OFFSET;
        const bowSize = tileSize * BOW_SIZE_MULTIPLIER;

        ctx.fillStyle = BOW_COLOR;

        // Left loop
        ctx.beginPath();
        ctx.moveTo(bowX, bowY);
        ctx.lineTo(bowX - bowSize, bowY - bowSize);
        ctx.lineTo(bowX - bowSize * BOW_OUTER_POINT_MULTIPLIER, bowY);
        ctx.lineTo(bowX - bowSize, bowY + bowSize);
        ctx.closePath();
        ctx.fill();

        // Right loop
        ctx.beginPath();
        ctx.moveTo(bowX, bowY);
        ctx.lineTo(bowX + bowSize, bowY - bowSize);
        ctx.lineTo(bowX + bowSize * BOW_OUTER_POINT_MULTIPLIER, bowY);
        ctx.lineTo(bowX + bowSize, bowY + bowSize);
        ctx.closePath();
        ctx.fill();

        // Center
        ctx.beginPath();
        ctx.arc(
            bowX,
            bowY,
            bowSize * BOW_CENTER_RADIUS_MULTIPLIER,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
}

// ======================================
// DRAW GHOSTS
// ======================================

function drawGhosts(ctx, tileSize) {
    ghosts.forEach((ghost) => {
        const gX = (ghost.x + 0.5) * tileSize;
        const gY = (ghost.y + 0.5) * tileSize;
        const gRadius = tileSize * GHOST_RADIUS_MULTIPLIER;

        let renderColor = ghost.color;

        if (frightenedTimer > 0) {
            if (
                frightenedTimer < FRIGHTENED_FLASH_THRESHOLD &&
                Math.floor(frightenedTimer / FRIGHTENED_FLASH_INTERVAL) % 2 === 0
            ) {
                renderColor = FRIGHTENED_FLASH_COLOR;
            } else {
                renderColor = FRIGHTENED_GHOST_COLOR;
            }
        }

        ctx.fillStyle = renderColor;
        ctx.beginPath();

        ctx.arc(
            gX,
            gY - GHOST_VERTICAL_OFFSET,
            gRadius,
            Math.PI,
            0,
            false
        );

        ctx.lineTo(gX + gRadius, gY + gRadius);
        ctx.lineTo(gX + gRadius * 0.5, gY + gRadius * 0.7);
        ctx.lineTo(gX, gY + gRadius);
        ctx.lineTo(gX - gRadius * 0.5, gY + gRadius * 0.7);
        ctx.lineTo(gX - gRadius, gY + gRadius);

        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.fillStyle = FRIGHTENED_FLASH_COLOR;
        ctx.beginPath();

        ctx.arc(
            gX - GHOST_EYE_OFFSET_X,
            gY + GHOST_EYE_OFFSET_Y,
            gRadius * GHOST_EYE_RADIUS_MULTIPLIER,
            0,
            Math.PI * 2
        );

        ctx.arc(
            gX + GHOST_EYE_OFFSET_X,
            gY + GHOST_EYE_OFFSET_Y,
            gRadius * GHOST_EYE_RADIUS_MULTIPLIER,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Pupils
        ctx.fillStyle = frightenedTimer > 0
            ? FRIGHTENED_PUPIL_COLOR
            : NORMAL_PUPIL_COLOR;

        const eyeOffsetX = (ghost.dx || 0) * GHOST_PUPIL_DIRECTION_MULTIPLIER;
        const eyeOffsetY = (ghost.dy || 0) * GHOST_PUPIL_DIRECTION_MULTIPLIER;

        ctx.beginPath();

        ctx.arc(
            gX - GHOST_EYE_OFFSET_X + eyeOffsetX,
            gY + GHOST_EYE_OFFSET_Y + eyeOffsetY,
            gRadius * GHOST_PUPIL_RADIUS_MULTIPLIER,
            0,
            Math.PI * 2
        );

        ctx.arc(
            gX + GHOST_EYE_OFFSET_X + eyeOffsetX,
            gY + GHOST_EYE_OFFSET_Y + eyeOffsetY,
            gRadius * GHOST_PUPIL_RADIUS_MULTIPLIER,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}

// ======================================
// DRAW ALL SPRITES
// ======================================

export function drawSprites(ctx, tileSize) {
    mouthAnimationTimer++;

    // Player 1 - Pac-Man
    drawPacMan(ctx, player, tileSize, PLAYER_COLOR);

    // Player 2 - Ms. Pac-Man (Co-op only)
    if (gameData.gameMode === "COOP") {
        drawPacMan(ctx, player2, tileSize, PLAYER_2_COLOR, true);
    }

    // Ghosts
    drawGhosts(ctx, tileSize);
}