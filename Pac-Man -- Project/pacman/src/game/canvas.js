
import { map } from "../ressources/map.js";
import { drawGame } from "./renderer.js";

import {
    ORIENTATION_RESIZE_DELAY,
} from "../constants/constant.js";

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export let tileSize = 20;

// ======================================
// CANVAS RESIZING
// ======================================

export function resizeCanvas() {
    const container = canvas.parentElement;

    canvas.width = container.clientWidth;

    tileSize = canvas.width / map[0].length;
    canvas.height = tileSize * map.length;

    container.style.height = `${canvas.height}px`;
}

// ======================================
// CANVAS EVENTS
// ======================================

export function setupCanvasEvents() {
    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("orientationchange", () => {
        setTimeout(resizeCanvas, ORIENTATION_RESIZE_DELAY);
    });
}

// ======================================
// DRAW GAME
// ======================================

export function renderCanvas(gameData) {
    drawGame(ctx, tileSize, gameData);
}