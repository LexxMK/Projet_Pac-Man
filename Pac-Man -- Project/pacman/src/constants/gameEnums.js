
// ======================================
// TILE TYPES
// ======================================

export const TileType = Object.freeze({
    EMPTY: 0,
    WALL: 1,
    POWER_PELLET: 2,
    GHOST_HOUSE: 3,
    GHOST_WALL: 4
});

// ======================================
// GHOST STATES
// ======================================

export const GhostState = Object.freeze({
    NORMAL: 'NORMAL',
    FRIGHTENED: 'FRIGHTENED',
    EATEN: 'EATEN'
});

// ======================================
// GHOST TYPES
// ======================================

export const GhostType = Object.freeze({
    CHASE: 'CHASE',
    WANDER: 'WANDER',
    AMBUSH: 'AMBUSH',
    CLYDE: 'CLYDE'
});

// ======================================
// DIRECTIONS
// ======================================

export const Direction = Object.freeze({
    UP: { dx: 0, dy: -1 },
    DOWN: { dx: 0, dy: 1 },
    LEFT: { dx: -1, dy: 0 },
    RIGHT: { dx: 1, dy: 0 },
    NONE: { dx: 0, dy: 0 }
});

// ======================================
// GHOST REGISTRY
// ======================================

import {
    GHOST_REGISTRY_SETTINGS
} from './constant.js';

export const GhostRegistry = Object.freeze(
    Object.fromEntries(
        Object.entries(GHOST_REGISTRY_SETTINGS).map(([key, ghost]) => [
            key,
            Object.freeze({
                ...ghost,
                type: GhostType[ghost.type]
            })
        ])
    )
);