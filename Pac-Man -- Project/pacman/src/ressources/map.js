
const level1 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,2,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,4,4,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,4,4,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,3,1,1,3,1,1,1,0,1,1,1,1],
    [0,0,0,0,0,1,3,3,3,3,3,3,3,3,1,0,0,0,0,0],
    [1,1,1,1,0,1,3,1,1,3,3,1,1,3,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
    [1,2,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const level2 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,0,2,1],
    [1,0,1,1,0,1,0,1,0,0,0,0,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,1,4,4,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,4,4,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,3,3,3,0,0,3,3,3,1,0,1,1,1,1],
    [0,0,0,0,0,1,3,1,1,0,0,1,1,3,1,0,0,0,0,0],
    [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,0,0,0,1,1,1,0,1,1,0,1],
    [1,2,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

export const maps = [level1, level2];

export let currentLevelIndex = 0;
export let map = maps[currentLevelIndex];

export function switchLevel(index) {
    if (index >= 0 && index < maps.length) {
        currentLevelIndex = index;
        map = maps[currentLevelIndex];
        return true;
    }

    return false;
}

export function getCurrentLevel() {
    return currentLevelIndex + 1;
}

// ======================================
// PAC-MAN COLLISION
// ======================================

export function isWall(x, y) {
    const gridX = Math.round(x);
    const gridY = Math.round(y);

    // Horizontal tunnel
    if (
        gridY === 7 &&
        (gridX < 0 || gridX >= map[0].length)
    ) {
        return false;
    }

    if (
        gridX < 0 ||
        gridX >= map[0].length ||
        gridY < 0 ||
        gridY >= map.length
    ) {
        return true;
    }

    return map[gridY][gridX] === 1;
}

// ======================================
// GHOST COLLISION
// ======================================

export function isGhostWall(x, y) {
    const gridX = Math.round(x);
    const gridY = Math.round(y);

    // Horizontal tunnel
    if (
        gridY === 7 &&
        (gridX < 0 || gridX >= map[0].length)
    ) {
        return false;
    }

    // Map boundaries
    if (
        gridX < 0 ||
        gridX >= map[0].length ||
        gridY < 0 ||
        gridY >= map.length
    ) {
        return true;
    }

    // Pac-Man's four-tile safe zone
    if (
        (gridX === 9 || gridX === 10) &&
        (gridY === 4 || gridY === 5)
    ) {
        return true;
    }

    return map[gridY][gridX] === 1;
}
