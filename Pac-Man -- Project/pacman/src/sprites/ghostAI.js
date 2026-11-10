
import {
    isGhostWall,
    map,
    currentLevelIndex
} from '../ressources/map.js';

import {
    player,
    player2,
    ghosts,
    frightenedTimer,
    setFrightenedTimer
} from './sprites.js';

import { gameData } from '../game/gameState.js';
import { GhostType } from '../constants/gameEnums.js';

import {
    CLYDE_AMBUSH_DISTANCE,
    CLYDE_CHASE_DISTANCE,
    CLYDE_AMBUSH_LOOKAHEAD,
    PINKY_FORWARD_CHANCE,
    INKY_LOOKAHEAD,
    FRIGHTENED_SPEED_MULTIPLIER,
    GHOST_LEVEL_SPEED_MULTIPLIERS,
    GHOST_ALIGNMENT_THRESHOLD,
    GHOST_MOVEMENT_THRESHOLD,
    SAFE_ZONE_TILES,
    TUNNEL_ROW
} from '../constants/constant.js';

// ======================================
// DIRECTIONS
// ======================================

const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 }
];

// ======================================
// SAFE ZONE
// ======================================

function isPlayerInSafeZone(targetPlayer) {
    const x = Math.round(targetPlayer.x);
    const y = Math.round(targetPlayer.y);

    return SAFE_ZONE_TILES.some(
        tile => tile.x === x && tile.y === y
    );
}

// ======================================
// VALID NEIGHBORS
// ======================================

function getNeighbors(x, y) {
    const width = map[0].length;
    const neighbors = [];

    for (const direction of directions) {
        let nx = x + direction.dx;
        let ny = y + direction.dy;

        if (ny === TUNNEL_ROW && nx < 0) {
            nx = width - 1;
        }

        if (ny === TUNNEL_ROW && nx >= width) {
            nx = 0;
        }

        if (!isGhostWall(nx, ny)) {
            neighbors.push({
                x: nx,
                y: ny,
                dx: direction.dx,
                dy: direction.dy
            });
        }
    }

    return neighbors;
}

// ======================================
// PATHFINDING
// ======================================

function findPathMove(ghost, targetX, targetY) {
    const startX = Math.round(ghost.x);
    const startY = Math.round(ghost.y);

    const goalX = Math.round(targetX);
    const goalY = Math.round(targetY);

    const queue = [{
        x: startX,
        y: startY,
        firstMove: null
    }];

    const visited = new Set();
    visited.add(`${startX},${startY}`);

    let head = 0;
    let bestMove = null;
    let bestDistance = Infinity;

    while (head < queue.length) {
        const current = queue[head++];

        const dx = current.x - goalX;
        const dy = current.y - goalY;
        const distance = dx * dx + dy * dy;

        if (distance < bestDistance) {
            bestDistance = distance;
            bestMove = current.firstMove;
        }

        if (current.x === goalX && current.y === goalY) {
            return current.firstMove;
        }

        const neighbors = getNeighbors(current.x, current.y);

        for (const next of neighbors) {
            const key = `${next.x},${next.y}`;

            if (visited.has(key)) {
                continue;
            }

            visited.add(key);

            queue.push({
                x: next.x,
                y: next.y,
                firstMove: current.firstMove || {
                    dx: next.dx,
                    dy: next.dy
                }
            });
        }
    }

    return bestMove;
}

// ======================================
// DISTANCE BETWEEN GHOST AND PLAYER
// ======================================

function getDistanceSquared(ghost, targetPlayer) {
    let dx = Math.abs(
        Math.round(ghost.x) - Math.round(targetPlayer.x)
    );

    const dy = Math.abs(
        Math.round(ghost.y) - Math.round(targetPlayer.y)
    );

    if (
        Math.round(ghost.y) === TUNNEL_ROW &&
        Math.round(targetPlayer.y) === TUNNEL_ROW
    ) {
        dx = Math.min(dx, map[0].length - dx);
    }

    return dx * dx + dy * dy;
}

// ======================================
// SELECT TARGET PLAYER
// ======================================

function getTargetPlayer(ghost) {
    const activePlayers = gameData.gameMode === "COOP"
        ? [player, player2]
        : [player];

    const availablePlayers = activePlayers.filter(
        targetPlayer => !isPlayerInSafeZone(targetPlayer)
    );

    if (availablePlayers.length === 0) {
        return null;
    }

    let closestPlayer = availablePlayers[0];
    let shortestDistance = Infinity;

    for (const targetPlayer of availablePlayers) {
        const distance = getDistanceSquared(
            ghost,
            targetPlayer
        );

        if (distance < shortestDistance) {
            shortestDistance = distance;
            closestPlayer = targetPlayer;
        }
    }

    return closestPlayer;
}

// ======================================
// SELECT GHOST MOVE
// ======================================

function selectGhostMove(ghost, legalMoves) {
    if (legalMoves.length === 0) {
        return null;
    }

    // Frightened ghosts move randomly.
    if (frightenedTimer > 0) {
        return legalMoves[
            Math.floor(Math.random() * legalMoves.length)
        ];
    }

    // Pinky wanders.
    if (ghost.type === GhostType.WANDER) {
        const forwardMoves = legalMoves.filter(move =>
            move.dx === ghost.dx &&
            move.dy === ghost.dy
        );

        if (
            forwardMoves.length > 0 &&
            Math.random() < PINKY_FORWARD_CHANCE
        ) {
            return forwardMoves[0];
        }

        const otherMoves = legalMoves.filter(move =>
            !(move.dx === -ghost.dx &&
              move.dy === -ghost.dy)
        );

        const choices = otherMoves.length > 0
            ? otherMoves
            : legalMoves;

        return choices[
            Math.floor(Math.random() * choices.length)
        ];
    }

    const targetPlayer = getTargetPlayer(ghost);

    if (!targetPlayer) {
        return legalMoves[
            Math.floor(Math.random() * legalMoves.length)
        ];
    }

    let targetX = targetPlayer.x;
    let targetY = targetPlayer.y;

    // ======================================
    // CLYDE - CHASE AND AMBUSH
    // ======================================

    if (ghost.type === GhostType.CLYDE) {
        const distanceSquared = getDistanceSquared(
            ghost,
            targetPlayer
        );

        const ambushDistanceSquared =
            CLYDE_AMBUSH_DISTANCE * CLYDE_AMBUSH_DISTANCE;

        const chaseDistanceSquared =
            CLYDE_CHASE_DISTANCE * CLYDE_CHASE_DISTANCE;

        if (distanceSquared < ambushDistanceSquared) {
            ghost.isRetreating = true;
        } else if (distanceSquared > chaseDistanceSquared) {
            ghost.isRetreating = false;
        }

        if (ghost.isRetreating) {
            targetX += targetPlayer.dx * CLYDE_AMBUSH_LOOKAHEAD;
            targetY += targetPlayer.dy * CLYDE_AMBUSH_LOOKAHEAD;
        }
    }

    // ======================================
    // INKY - AMBUSH
    // ======================================

    if (ghost.type === GhostType.AMBUSH) {
        targetX += targetPlayer.dx * INKY_LOOKAHEAD;
        targetY += targetPlayer.dy * INKY_LOOKAHEAD;
    }

    // ======================================
    // CHOOSE PATH
    // ======================================

    const pathMove = findPathMove(
        ghost,
        targetX,
        targetY
    );

    if (
        pathMove &&
        legalMoves.some(move =>
            move.dx === pathMove.dx &&
            move.dy === pathMove.dy
        )
    ) {
        return pathMove;
    }

    return legalMoves[
        Math.floor(Math.random() * legalMoves.length)
    ];
}

// ======================================
// UPDATE GHOSTS
// ======================================

export function updateGhosts() {

    if (frightenedTimer > 0) {
        setFrightenedTimer(frightenedTimer - 1);
    }

    const mapWidth = map[0].length;

    // Get the speed multiplier for the current level.
    const levelSpeedMultiplier =
        GHOST_LEVEL_SPEED_MULTIPLIERS[currentLevelIndex] ??
        GHOST_LEVEL_SPEED_MULTIPLIERS[
            GHOST_LEVEL_SPEED_MULTIPLIERS.length - 1
        ];

    ghosts.forEach(ghost => {

        const gx = Math.round(ghost.x);
        const gy = Math.round(ghost.y);

        // Apply level speed and frightened slowdown.
        const currentSpeed = ghost.speed *
            levelSpeedMultiplier *
            (frightenedTimer > 0
                ? FRIGHTENED_SPEED_MULTIPLIER
                : 1);

        const offsetX = ghost.x - gx;
        const offsetY = ghost.y - gy;

        const distanceSquared =
            offsetX * offsetX + offsetY * offsetY;

        if (distanceSquared > GHOST_MOVEMENT_THRESHOLD) {
            ghost.decisionLocked = false;
        }

        const aligned =
            distanceSquared < GHOST_ALIGNMENT_THRESHOLD;

        if (aligned && !ghost.decisionLocked) {

            ghost.x = gx;
            ghost.y = gy;

            const legalMoves = getNeighbors(gx, gy);

            const chosenMove = selectGhostMove(
                ghost,
                legalMoves
            );

            if (chosenMove) {
                ghost.dx = chosenMove.dx;
                ghost.dy = chosenMove.dy;
            } else {
                ghost.dx = 0;
                ghost.dy = 0;
            }

            ghost.decisionLocked = true;
        }

        ghost.x += ghost.dx * currentSpeed;
        ghost.y += ghost.dy * currentSpeed;

        // TUNNEL TELEPORTATION

        if (Math.round(ghost.y) === TUNNEL_ROW) {

            if (ghost.x < 0) {
                ghost.x = mapWidth - 1;
                ghost.decisionLocked = false;
            }

            if (ghost.x >= mapWidth) {
                ghost.x = 0;
                ghost.decisionLocked = false;
            }
        }
    });
}