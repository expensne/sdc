import { Car } from "game-objects/car";
import * as cfg from "./config";
import { ControlType, Controls } from "game-objects/controls";
import { Road } from "game-objects/road";
import * as mathh from "math/math";

export function generateCars(numCars: number, road: Road): Car[] {
    return Array.from({ length: numCars }, () => {
        return new Car(
            road.getLaneCenter(2),
            100,
            cfg.CAR_WIDTH,
            cfg.CAR_HEIGHT,
            new Controls(ControlType.AI),
            0.1, // acceleration
            0.05, // friction
            5 // maxSpeed
        );
    });
}

export function generateTraffic(numCars: number, road: Road): Car[] {
    let randomLane;
    let randomY;
    let randomSpeed; // [0;2.5]
    let randomAcceleration; // [0;1]

    return Array.from({ length: numCars }, () => {
        randomLane = Math.round(mathh.normal(2, 1.5));
        randomLane = mathh.clamp(randomLane, 0, 4);

        randomY = Math.floor(-150 - (Math.random() * 6000));
        randomSpeed = Math.max(0.1, mathh.normal(1.25, 0.5));
        randomAcceleration = Math.max(0.1, mathh.normal(0.5, 0.2));

        return Car.fromOptions({
            x: road.getLaneCenter(randomLane),
            y: randomY,
            width: cfg.CAR_WIDTH,
            height: cfg.CAR_HEIGHT,
            controls: new Controls(ControlType.BOT),
            maxSpeed: randomSpeed,
            acceleration: randomAcceleration,
            friction: 0.05,
        });
    });
}
