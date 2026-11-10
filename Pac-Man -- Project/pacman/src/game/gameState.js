
import { map } from "../ressources/map.js";
import { STARTING_LIVES } from "../constants/constant.js";

// ======================================
// CHERRY IMAGE
// ======================================

const cherryImage = new Image();
cherryImage.src = "../PM_Cherry.png";

// ======================================
// GAME DATA
// ======================================

export const gameData = {
    score: 0,
    lives: STARTING_LIVES,
    gameState: "START",
    gameMode: "SOLO",

    items: [],
    powerPellets: [],
    TOTAL_ITEMS: 0,

    map: map,

    cherry: {
        x: 0,
        y: 0,
        visible: false,
        image: cherryImage,
    },

    speedBoost: {
        x: 0,
        y: 0,
        visible: false,
    },
};