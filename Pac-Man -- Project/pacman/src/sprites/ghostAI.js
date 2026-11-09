
import { isGhostWall, map } from '../ressources/map.js';

import {
    player,
    ghosts,
    frightenedTimer,
    setFrightenedTimer
} from './sprites.js';

import { GhostType } from '../constants/gameEnums.js';

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
// VALID NEIGHBORS
// ======================================

function getNeighbors(x, y) {
    const width = map[0].length;

    return directions
        .map(direction => {
            let nx = x + direction.dx;
            let ny = y + direction.dy;

            // Tunnel wrapping for pathfinding
            if (ny === 7 && nx < 0) {
                nx = width - 1;
            }

            if (ny === 7 && nx >= width) {
                nx = 0;
            }

            return {
                x: nx,
                y: ny,
                dx: direction.dx,
                dy: direction.dy
            };
        })
        .filter(next => !isGhostWall(next.x, next.y));
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

    let bestMove = null;
    let bestDistance = Infinity;

    while (queue.length > 0) {
        const current = queue.shift();

        const distance = Math.hypot(
            current.x - goalX,
            current.y - goalY
        );

        if (distance < bestDistance) {
            bestDistance = distance;
            bestMove = current.firstMove;
        }

        if (current.x === goalX && current.y === goalY) {
            return current.firstMove;
        }

        const neighbors = getNeighbors(
            current.x,
            current.y
        );

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
// SELECT GHOST MOVE
// ======================================

function selectGhostMove(ghost, legalMoves) {
    if (legalMoves.length === 0) {
        return null;
    }

    // Frightened ghosts move randomly
    if (frightenedTimer > 0) {
        return legalMoves[
            Math.floor(Math.random() * legalMoves.length)
        ];
    }

    // Pinky wanders
    if (ghost.type === GhostType.WANDER) {
        const forwardMoves = legalMoves.filter(move =>
            move.dx === ghost.dx &&
            move.dy === ghost.dy
        );

        if (
            forwardMoves.length > 0 &&
            Math.random() < 0.75
        ) {
            return forwardMoves[0];
        }

        // Avoid reversing when possible
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

    // Chase Pac-Man
    let targetX = player.x;
    let targetY = player.y;

    // Ambush behavior
    if (ghost.type === GhostType.AMBUSH) {
        targetX += player.dx * 2;
        targetY += player.dy * 2;
    }

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

    // Frightened timer
    if (frightenedTimer > 0) {
        setFrightenedTimer(frightenedTimer - 1);
    }

    ghosts.forEach(ghost => {

        const mapWidth = map[0].length;

        const gx = Math.round(ghost.x);
        const gy = Math.round(ghost.y);

        // ======================================
        // 1. MOVEMENT SPEED
        // ======================================

        // Normal speed everywhere, including tunnels
        const currentSpeed = frightenedTimer > 0
            ? ghost.speed * 0.6
            : ghost.speed;

        // ======================================
        // 2. TILE CENTER DETECTION
        // ======================================

        const distanceFromCenter = Math.hypot(
            ghost.x - gx,
            ghost.y - gy
        );

        if (distanceFromCenter > 0.1) {
            ghost.decisionLocked = false;
        }

        const aligned = distanceFromCenter < 0.05;

        // ======================================
        // 3. CHOOSE NEW DIRECTION
        // ======================================

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

        // ======================================
        // 4. APPLY MOVEMENT
        // ======================================

        ghost.x += ghost.dx * currentSpeed;
        ghost.y += ghost.dy * currentSpeed;

        // ======================================
        // 5. TUNNEL TELEPORTATION
        // ======================================

        if (Math.round(ghost.y) === 7) {

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
    