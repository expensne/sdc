import { Road } from "game-objects/road";
import * as cfg from "./config";
import { generateCars, generateTraffic } from "./generators";
import { setupButton, setupCanvas } from "util/html";
import { Car } from "game-objects/car";
import { getFromStorage, removeFromStorage, saveToStorage } from "util/storage";
import { timeNow } from "util/time";

// ---------------- Screen setup
const { canvas, ctx } = setupCanvas(window.innerHeight, cfg.ROAD_WIDTH);
setupButton("saveButton", () => saveToStorage(cfg.STORED_AI_KEY, bestCar.ai));
setupButton("discardButton", () => removeFromStorage(cfg.STORED_AI_KEY));

// ---------------- Object setup
const road = new Road(canvas.width / 2, canvas.width * 0.95, 5);
const cars = generateCars(cfg.AI_NUM_CARS, road);
const traffic = generateTraffic(cfg.NUM_TRAFFIC_CARS, road);

// ---------------- AI setup
let bestCar = cars[0];

const storedWeights = getFromStorage(cfg.STORED_AI_KEY);
if (storedWeights) {
    bestCar.ai?.setModel(storedWeights);

    for (let i = 1; i < cars.length; i++) {
        const currentAi = cars[i].ai;
        if (!currentAi) {
            continue;
        }
        
        currentAi.setModel(storedWeights);

        const percentage = i / cars.length;

        for (let j = 0; j < cfg.AI_MUTATION_GROUPS.length; j++) {
            if (percentage > cfg.AI_MUTATION_GROUPS[j].threshold) {
                let rate = cfg.AI_MUTATION_GROUPS[j].rate * cfg.AI_MUTATION_BASERATE;
                currentAi.mutate(rate);
                break;
            }
        }
    }
}

function min<T>(comp: (arg0: T) => number, ...objects: T[]): T {
    return [...objects].sort((a: T, b: T) => comp(a) - comp(b))[0];
}

function fitnessSpeed(startTime: number, currentTime: number, car: Car): number {
    const elapsed = currentTime - startTime;
    return car.y / elapsed;
}
const startTime = timeNow();

// ---------------- Loop

const MS_PER_UPDATE = 1000 / cfg.UPDATES_PER_SECOND;
let previous = performance.now();
let lag = 0;
let fps = 0;

update();
requestAnimationFrame(gameLoop);

function gameLoop() {
    let current = performance.now();
    let elapsed = current - previous;

    previous = current;
    lag += elapsed;

    processInput();
    while (lag >= MS_PER_UPDATE) {
        update();
        lag -= MS_PER_UPDATE;
    }
    render(canvas, ctx);

    fps = Math.round((1 / elapsed) * 1000);
    requestAnimationFrame(gameLoop);
}

function processInput() {
    // No input
}

function update() {
    traffic.forEach((trafficCar) => trafficCar.update([]));
    cars.forEach((car) =>
        car.update([...road.borders, ...traffic.map((trafficCar) => trafficCar.polygon)])
    );

    bestCar = min(fitnessSpeed.bind({}, startTime, timeNow()), ...cars);
}

function render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -bestCar.y + canvas.height * 0.66);

    road.draw(ctx);
    traffic.forEach((car) => car.draw(ctx, "black"));
    bestCar.draw(ctx, "blue", true);
    ctx.globalAlpha = cfg.AI_CAR_ALPHA;
    for(let i = 0; i < cars.length; i++) {
        if (cars[i] !== bestCar) {
            cars[i].draw(ctx, "blue", false);
        }
    }
    ctx.globalAlpha = 1;

    ctx.restore();

    // Draw number to the screen
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("fps: " + fps, 20, 20);
}
