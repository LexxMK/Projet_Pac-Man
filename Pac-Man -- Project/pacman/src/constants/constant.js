// ======================================
// PLAYER SETTINGS
// ======================================

export const PLAYER_1_START = { x: 9, y: 5 };
export const PLAYER_2_START = { x: 10, y: 5 };

export const PLAYER_BASE_SPEED = 0.1;

// ======================================
// ABILITIES
// ======================================

export const SPEED_BOOST_DURATION = 180;
export const SPEED_BOOST_MULTIPLIER = 1.3;

// ======================================
// GAME SETTINGS
// ======================================

export const STARTING_LIVES = 3;
export const FRIGHTENED_DURATION = 350;

// ======================================
// SCORING
// ======================================

export const POINTS_NORMAL_PELLET = 10;
export const POINTS_POWER_PELLET = 50;
export const POINTS_CHERRY = 100;
export const POINTS_GHOST = 200;

// ======================================
// COLLISION SETTINGS
// ======================================

export const COLLECTION_DISTANCE_SQUARED = 0.16;
export const GHOST_NEARBY_DISTANCE_SQUARED = 9;
export const PLAYER_NEARBY_DISTANCE_SQUARED = 9;

// ======================================
// GHOST AI SETTINGS
// ======================================

export const CLYDE_AMBUSH_DISTANCE = 8;
export const CLYDE_CHASE_DISTANCE = 10;
export const CLYDE_AMBUSH_LOOKAHEAD = 2;

export const PINKY_FORWARD_CHANCE = 0.75;
export const INKY_LOOKAHEAD = 2;

export const FRIGHTENED_SPEED_MULTIPLIER = 0.6;

// Ghost speed increases with each level.
export const GHOST_LEVEL_SPEED_MULTIPLIERS = [
    1.0,
    1.05,
    1.09
];

// ======================================
// MOVEMENT SETTINGS
// ======================================

export const CENTER_EPSILON = 0.000001;
export const MAX_MOVEMENT_ITERATIONS = 10;
export const GHOST_ALIGNMENT_THRESHOLD = 0.0025;
export const GHOST_MOVEMENT_THRESHOLD = 0.01;

// ======================================
// MAP SETTINGS
// ======================================

export const TUNNEL_ROW = 7;

export const SAFE_ZONE_TILES = [
    { x: 9, y: 5 },
    { x: 10, y: 5 },
    { x: 9, y: 6 },
    { x: 10, y: 6 }
];

export const GHOST_HOUSE_SAFE_TILES = [
    { x: 9, y: 4 },
    { x: 10, y: 4 },
    { x: 9, y: 5 },
    { x: 10, y: 5 }
];

// ======================================
// BONUS SPAWNING SETTINGS
// ======================================

export const BONUS_SPAWN_EXCLUSION_ZONE = {
    minX: 7,
    maxX: 11,
    minY: 4,
    maxY: 7
};

// ======================================
// GAME LOOP SETTINGS
// ======================================

export const TARGET_FPS = 60;

// ======================================
// CANVAS SETTINGS
// ======================================

export const ORIENTATION_RESIZE_DELAY = 200;

// ======================================
// RENDERING SETTINGS
// ======================================

// MAZE COLORS

export const MAZE_WALL_COLOR = "#1e3a8a";
export const MAZE_WALL_BORDER_COLOR = "#3b82f6";

export const GHOST_WALL_COLOR = "#065f46";
export const GHOST_WALL_BORDER_COLOR = "#34d399";

export const MAZE_BORDER_WIDTH = 1;

// PELLET SETTINGS

export const PELLET_COLOR = "#fde047";
export const PELLET_RADIUS_MULTIPLIER = 0.18;

export const POWER_PELLET_COLOR = "#f43f5e";
export const POWER_PELLET_RADIUS_MULTIPLIER = 0.35;
export const POWER_PELLET_BLINK_INTERVAL = 200;

// SPEED BOOST VISUAL SETTINGS

export const SPEED_BOOST_COLOR = "#facc15";
export const SPEED_BOOST_BORDER_COLOR = "#ffffff";
export const SPEED_BOOST_BORDER_WIDTH = 1.5;

export const SPEED_BOOST_BOLT_POINTS = [
    { x: 0.58, y: 0.08 },
    { x: 0.25, y: 0.55 },
    { x: 0.48, y: 0.55 },
    { x: 0.35, y: 0.92 },
    { x: 0.78, y: 0.38 },
    { x: 0.54, y: 0.38 }
];

// ======================================
// SPRITE SETTINGS
// ======================================

// PLAYER COLORS

export const PLAYER_COLOR = "#eab308";
export const PLAYER_2_COLOR = "#ec4899";

// PLAYER SIZE AND ANIMATION

export const PLAYER_RADIUS_MULTIPLIER = 0.42;
export const PLAYER_MOUTH_ANIMATION_INTERVAL = 6;
export const PLAYER_MOUTH_OPEN_ANGLE = 0.35;
export const PLAYER_MOUTH_CLOSED_ANGLE = 0.05;

// MS. PAC-MAN BOW

export const BOW_COLOR = "#ef4444";
export const BOW_X_OFFSET = 0.45;
export const BOW_Y_OFFSET = 0.85;
export const BOW_SIZE_MULTIPLIER = 0.13;
export const BOW_CENTER_RADIUS_MULTIPLIER = 0.4;
export const BOW_OUTER_POINT_MULTIPLIER = 1.5;

// GHOST COLORS

export const FRIGHTENED_GHOST_COLOR = "#3b82f6";
export const FRIGHTENED_FLASH_COLOR = "#ffffff";
export const FRIGHTENED_PUPIL_COLOR = "#ef4444";
export const NORMAL_PUPIL_COLOR = "#1e3a8a";

// GHOST ANIMATION

export const FRIGHTENED_FLASH_THRESHOLD = 100;
export const FRIGHTENED_FLASH_INTERVAL = 10;

// GHOST SIZE AND POSITION

export const GHOST_RADIUS_MULTIPLIER = 0.42;
export const GHOST_VERTICAL_OFFSET = 2;

export const GHOST_EYE_OFFSET_X = 3;
export const GHOST_EYE_OFFSET_Y = -3;
export const GHOST_EYE_RADIUS_MULTIPLIER = 0.3;
export const GHOST_PUPIL_RADIUS_MULTIPLIER = 0.12;

export const GHOST_PUPIL_DIRECTION_MULTIPLIER = 1.5;

// ======================================
// GHOST REGISTRY SETTINGS
// ======================================

export const GHOST_REGISTRY_SETTINGS = {
    BLINKY: {
        name: 'Blinky',
        color: '#ef4444',
        type: 'CHASE',
        homeX: 18,
        homeY: 1,
        speed: 0.08
    },

    PINKY: {
        name: 'Pinky',
        color: '#ec4899',
        type: 'WANDER',
        homeX: 1,
        homeY: 11,
        speed: 0.07
    },

    INKY: {
        name: 'Inky',
        color: '#06b6d4',
        type: 'AMBUSH',
        homeX: 18,
        homeY: 11,
        speed: 0.075
    },

    CLYDE: {
        name: 'Clyde',
        color: '#f97316',
        type: 'CLYDE',
        homeX: 1,
        homeY: 1,
        speed: 0.075
    }
};