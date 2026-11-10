import { isWall, map } from '../ressources/map.js';
import { GhostRegistry, GhostState } from '../constants/gameEnums.js';

import {
    PLAYER_1_START,
    PLAYER_2_START,
    PLAYER_BASE_SPEED,
    SPEED_BOOST_DURATION,
    SPEED_BOOST_MULTIPLIER,
    CENTER_EPSILON,
    MAX_MOVEMENT_ITERATIONS,
    TUNNEL_ROW
} from '../constants/constant.js';

// ======================================
// PLAYER 1 - PAC-MAN
// ======================================

export const player = {
    x: PLAYER_1_START.x,
    y: PLAYER_1_START.y,
    dx: 0,
    dy: 0,
    nextDx: 0,
    nextDy: 0,
    speed: PLAYER_BASE_SPEED,
    baseSpeed: PLAYER_BASE_SPEED
};

// ======================================
// PLAYER 2
// ======================================

export const player2 = {
    x: PLAYER_2_START.x,
    y: PLAYER_2_START.y,
    dx: 0,
    dy: 0,
    nextDx: 0,
    nextDy: 0,
    speed: PLAYER_BASE_SPEED,
    baseSpeed: PLAYER_BASE_SPEED
};

// ======================================
// SPEED BOOST
// ======================================

export let speedBoostTimer = 0;

export function activateSpeedBoost() {
    speedBoostTimer = SPEED_BOOST_DURATION;

    player.speed = player.baseSpeed * SPEED_BOOST_MULTIPLIER;
    player2.speed = player2.baseSpeed * SPEED_BOOST_MULTIPLIER;
}

// ======================================
// GHOSTS
// ======================================

export const ghosts = [
    {
        ...GhostRegistry.BLINKY,
        x: GhostRegistry.BLINKY.homeX,
        y: GhostRegistry.BLINKY.homeY,
        dx: 0,
        dy: 0,
        state: GhostState.NORMAL,
        decisionLocked: false,
        isRetreating: false
    },
    {
        ...GhostRegistry.PINKY,
        x: GhostRegistry.PINKY.homeX,
        y: GhostRegistry.PINKY.homeY,
        dx: 0,
        dy: 0,
        state: GhostState.NORMAL,
        decisionLocked: false,
        isRetreating: false
    },
    {
        ...GhostRegistry.INKY,
        x: GhostRegistry.INKY.homeX,
        y: GhostRegistry.INKY.homeY,
        dx: 0,
        dy: 0,
        state: GhostState.NORMAL,
        decisionLocked: false,
        isRetreating: false
    },
    {
        ...GhostRegistry.CLYDE,
        x: GhostRegistry.CLYDE.homeX,
        y: GhostRegistry.CLYDE.homeY,
        dx: 0,
        dy: 0,
        state: GhostState.NORMAL,
        decisionLocked: false,
        isRetreating: false
    }
];

// ======================================
// FRIGHTENED MODE
// ======================================

export let frightenedTimer = 0;

export function setFrightenedTimer(val) {
    frightenedTimer = val;
}

export function getFrightenedTimer() {
    return frightenedTimer;
}

// ======================================
// RESET SPRITES
// ======================================

export function resetSprites() {
    player.x = PLAYER_1_START.x;
    player.y = PLAYER_1_START.y;
    player.dx = 0;
    player.dy = 0;
    player.nextDx = 0;
    player.nextDy = 0;
    player.speed = player.baseSpeed;

    player2.x = PLAYER_2_START.x;
    player2.y = PLAYER_2_START.y;
    player2.dx = 0;
    player2.dy = 0;
    player2.nextDx = 0;
    player2.nextDy = 0;
    player2.speed = player2.baseSpeed;

    speedBoostTimer = 0;

    ghosts.forEach(ghost => {
        ghost.x = ghost.homeX;
        ghost.y = ghost.homeY;
        ghost.dx = 0;
        ghost.dy = 0;
        ghost.state = GhostState.NORMAL;
        ghost.decisionLocked = false;
        ghost.isRetreating = false;
    });

    frightenedTimer = 0;
}

// ======================================
// MOVEMENT HELPERS
// ======================================

function snapToCenter(targetPlayer) {
    targetPlayer.x = Math.round(targetPlayer.x);
    targetPlayer.y = Math.round(targetPlayer.y);
}

function isAtCenter(targetPlayer) {
    return (
        Math.abs(targetPlayer.x - Math.round(targetPlayer.x)) < CENTER_EPSILON &&
        Math.abs(targetPlayer.y - Math.round(targetPlayer.y)) < CENTER_EPSILON
    );
}

function canMove(targetPlayer, dx, dy) {
    const gridX = Math.round(targetPlayer.x);
    const gridY = Math.round(targetPlayer.y);

    return !isWall(gridX + dx, gridY + dy);
}

function tryRequestedDirection(targetPlayer) {
    if (targetPlayer.nextDx === 0 && targetPlayer.nextDy === 0) return;

    if (canMove(targetPlayer, targetPlayer.nextDx, targetPlayer.nextDy)) {
        targetPlayer.dx = targetPlayer.nextDx;
        targetPlayer.dy = targetPlayer.nextDy;
    }
}

function wrapTunnel(targetPlayer) {
    if (Math.round(targetPlayer.y) !== TUNNEL_ROW) return;

    const mapWidth = map[0].length;

    if (targetPlayer.x < 0) targetPlayer.x += mapWidth;
    if (targetPlayer.x >= mapWidth) targetPlayer.x -= mapWidth;
}

function distanceToNextCenter(targetPlayer) {
    if (targetPlayer.dx > 0) {
        return Math.floor(targetPlayer.x) + 1 - targetPlayer.x;
    }

    if (targetPlayer.dx < 0) {
        return targetPlayer.x - (Math.ceil(targetPlayer.x) - 1);
    }

    if (targetPlayer.dy > 0) {
        return Math.floor(targetPlayer.y) + 1 - targetPlayer.y;
    }

    if (targetPlayer.dy < 0) {
        return targetPlayer.y - (Math.ceil(targetPlayer.y) - 1);
    }

    return 0;
}

// ======================================
// UPDATE PLAYER
// ======================================

export function updatePlayer(targetPlayer = player) {
    if (targetPlayer === player && speedBoostTimer > 0) {
        speedBoostTimer--;

        if (speedBoostTimer === 0) {
            player.speed = player.baseSpeed;
            player2.speed = player2.baseSpeed;
        }
    }

    let remainingDistance = targetPlayer.speed;
    let iterations = 0;

    while (
        remainingDistance > CENTER_EPSILON &&
        iterations < MAX_MOVEMENT_ITERATIONS
    ) {
        iterations++;

        wrapTunnel(targetPlayer);

        if (isAtCenter(targetPlayer)) {
            snapToCenter(targetPlayer);
            tryRequestedDirection(targetPlayer);

            if (
                (targetPlayer.dx !== 0 || targetPlayer.dy !== 0) &&
                !canMove(targetPlayer, targetPlayer.dx, targetPlayer.dy)
            ) {
                targetPlayer.dx = 0;
                targetPlayer.dy = 0;
            }
        }

        if (targetPlayer.dx === 0 && targetPlayer.dy === 0) break;

        const distance = distanceToNextCenter(targetPlayer);

        if (distance <= CENTER_EPSILON) break;

        const step = Math.min(remainingDistance, distance);

        targetPlayer.x += targetPlayer.dx * step;
        targetPlayer.y += targetPlayer.dy * step;

        remainingDistance -= step;

        wrapTunnel(targetPlayer);

        if (isAtCenter(targetPlayer)) {
            snapToCenter(targetPlayer);
        }
    }
}