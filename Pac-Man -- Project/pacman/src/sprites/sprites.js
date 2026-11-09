
import { isWall, map } from '../ressources/map.js';
import { GhostRegistry, GhostState } from '../constants/gameEnums.js';

// ======================================
// PLAYER
// ======================================

export const player = {
    x: 9,
    y: 5,
    dx: 0,
    dy: 0,
    nextDx: 0,
    nextDy: 0,
    speed: 0.1,
    baseSpeed: 0.1
};

// ======================================
// SPEED BOOST
// ======================================

export let speedBoostTimer = 0;

export function activateSpeedBoost() {
    speedBoostTimer = 180;
    player.speed = player.baseSpeed * 1.3;
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
        decisionLocked: false
    },
    {
        ...GhostRegistry.PINKY,
        x: GhostRegistry.PINKY.homeX,
        y: GhostRegistry.PINKY.homeY,
        dx: 0,
        dy: 0,
        state: GhostState.NORMAL,
        decisionLocked: false
    },
    {
        ...GhostRegistry.INKY,
        x: GhostRegistry.INKY.homeX,
        y: GhostRegistry.INKY.homeY,
        dx: 0,
        dy: 0,
        state: GhostState.NORMAL,
        decisionLocked: false
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

    player.x = 9;
    player.y = 5;

    player.dx = 0;
    player.dy = 0;

    player.nextDx = 0;
    player.nextDy = 0;

    player.speed = player.baseSpeed;
    speedBoostTimer = 0;

    ghosts.forEach(ghost => {
        ghost.x = ghost.homeX;
        ghost.y = ghost.homeY;

        ghost.dx = 0;
        ghost.dy = 0;

        ghost.state = GhostState.NORMAL;
        ghost.decisionLocked = false;
    });

    frightenedTimer = 0;
}

// ======================================
// UPDATE PLAYER
// ======================================

export function updatePlayer() {

    // Speed boost countdown
    if (speedBoostTimer > 0) {
        speedBoostTimer--;

        if (speedBoostTimer === 0) {
            player.speed = player.baseSpeed;
        }
    }

    const px = Math.round(player.x);
    const py = Math.round(player.y);

    // Change direction near tile centers
    if (
        Math.abs(player.x - px) <= player.speed &&
        Math.abs(player.y - py) <= player.speed
    ) {

        if (!isWall(px + player.nextDx, py + player.nextDy)) {
            player.dx = player.nextDx;
            player.dy = player.nextDy;
        }

        if (isWall(px + player.dx, py + player.dy)) {
            player.dx = 0;
            player.dy = 0;
        }
    }

    // Apply movement
    player.x += player.dx * player.speed;
    player.y += player.dy * player.speed;

    // Player tunnel wrapping
    if (player.x < 0) {
        player.x = map[0].length - 1;
    }

    if (player.x >= map[0].length) {
        player.x = 0;
    }
}
