import { Road } from "./game-objects/road";
import { Config } from "./config";
import { generateCars, generateTraffic } from "./generators";
import { UI } from "./util/html";
import { CarPopulation } from "./evolution/population";
import { Car } from "./game-objects/car";

class Game {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    public carPopulation: CarPopulation = undefined!;

    private road: Road = undefined!;
    private traffic: Car[] = undefined!;
    private cars: Car[] = undefined!;

    private msPerUpdate: number = 0;
    private previous: number = 0;
    private lag: number = 0;
    private fps: number = 0;

    private interruped: boolean = false;

    constructor() {
        const { canvas, ctx } = UI.setupCanvas(window.innerHeight, Config.ROAD_WIDTH);
        UI.setupButton("saveButton", () => this.carPopulation.saveToStorage());
        UI.setupButton("discardButton", () => this.carPopulation.clearStore());

        this.canvas = canvas;
        this.ctx = ctx;

        this.restart();
    }

    restart() {
        this.road = new Road(this.canvas.width / 2, this.canvas.width * 0.95, 5);
        this.traffic = generateTraffic(Config.NUM_TRAFFIC_CARS, this.road);
        this.carPopulation = new CarPopulation(generateCars(Config.AI_NUM_CARS, this.road));
        this.cars = this.carPopulation.cars;
    }

    startLoop() {
        this.msPerUpdate = 1000 / Config.UPDATES_PER_SECOND;
        this.previous = performance.now();
        this.lag = 0;
        this.fps = 0;

        this.interruped = false;

        this.update();
        requestAnimationFrame(this.loop.bind(this));
    }

    stopLoop() {
        this.interruped = true;
    }

    private loop() {
        let current = performance.now();
        let elapsed = current - this.previous;

        this.previous = current;
        this.lag += elapsed;

        this.processInput();
        while (this.lag >= this.msPerUpdate) {
            this.update();
            this.aiUpdate();
            this.lag -= this.msPerUpdate;
        }
        this.render();

        this.fps = Math.round((1 / elapsed) * 1000);

        if (this.interruped) {
            return;
        }
        requestAnimationFrame(this.loop.bind(this));
    }

    private processInput() {
        // No input
    }

    private update() {
        this.traffic.forEach((trafficCar) => trafficCar.update([]));

        const collisionPolygons = [
            ...this.road.borders,
            ...this.traffic.map((trafficCar) => trafficCar.polygon),
        ];
        this.cars.forEach((car) => car.update(collisionPolygons));
    }

    private aiUpdate() {
        this.carPopulation.evaluate();
    }

    private render() {
        let canvas = this.canvas;
        let ctx = this.ctx;

        canvas.height = window.innerHeight;

        // First car that is not damaged
        let tmp = this.cars.find((car) => !car.damaged);
        let topCar = tmp ? tmp : this.cars[0];

        ctx.save();
        ctx.translate(0, -topCar.y + canvas.height * 0.66);

        this.traffic.forEach((car) => car.draw(ctx));
        this.road.draw(ctx);

        let numCars = this.cars.length;

        ctx.globalAlpha = Config.AI_CAR_ALPHA;
        // Draw backwards so that the first car is on top
        for (let i = numCars - 1; i >= 0; i--) {
            this.cars[i].draw(ctx);
        }
        ctx.globalAlpha = 1;

        ctx.restore();

        // Draw fps
        ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("fps: " + this.fps, 20, 20);

        // Draw cars alive
        ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        let numDamagedCars = this.cars.filter((car) => car.damaged).length;
        let carsAlive = numCars - numDamagedCars;
        ctx.fillText("cars alive: " + carsAlive + "/" + numCars, 20, 40);
    }
}

const game = new Game();

async function startNewGame() {
    while (true) {
        game.restart();
        game.carPopulation.loadAndEvolve(Config.AI_MUTATION_PROBABILITY, Config.AI_MUTATION_RATE);

        console.log("Generation: " + game.carPopulation.generation);

        game.startLoop();
        await new Promise((resolve) =>
            setTimeout(resolve, Config.AI_ROUND_DURATION_IN_SECONDS * 1000)
        );

        game.stopLoop();
        await new Promise((resolve) => setTimeout(resolve, 500));
        game.carPopulation.saveToStorage();

        await new Promise((resolve) => setTimeout(resolve, 500));
    }
}

startNewGame();
