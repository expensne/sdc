import { ControlType, Controls } from "./controls";
import { SimpleDenseNN } from "../nn/simple-dense-nn";
import { Point2D } from "../math/point";
import { Sensor } from "./sensor";
import { Geom } from "../math/geom";
import { GameObject } from "./game-object";
import { NeuralNetwork } from "../nn/neural-network";

export interface CarOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    controls: Controls;
    acceleration?: number;
    friction?: number;
    maxSpeed?: number;
    normalColor?: string;
    damagedColor?: string;
}

export class Car implements GameObject {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public angle: number = 0;
    public polygon: Point2D[] = [];
    public damaged: boolean;
    public normalColor: string;
    public damagedColor: string;
    public drawSensor: boolean;
    public drawStroke: boolean;

    public ai: NeuralNetwork | null = null;

    private speed: number = 0;
    private maxSpeed: number;
    private acceleration: number;
    private friction: number;
    private controls: Controls;
    private sensor: Sensor | null = null;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        controls: Controls,
        acceleration: number = 0.1,
        friction: number = 0.05,
        maxSpeed: number = 3,
        normalColor: string = "black",
        damagedColor: string = "white",
        drawSensor: boolean = false,
        drawStroke: boolean = false
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.controls = controls;
        this.acceleration = acceleration;
        this.friction = friction;
        this.maxSpeed = maxSpeed;

        this.damaged = false;
        this.normalColor = normalColor;
        this.damagedColor = damagedColor;
        this.drawSensor = drawSensor;
        this.drawStroke = drawStroke;

        switch (controls.controlType) {
            case ControlType.PLAYER:
                this.sensor = new Sensor(this);
                break;
            case ControlType.AI:
                this.sensor = new Sensor(this);
                this.ai = new SimpleDenseNN([this.sensor.rayCount + 2, 18, 4]);
                this.ai.randomize();
                break;
            case ControlType.BOT:
                break;
        }
    }

    static fromOptions(options: CarOptions): Car {
        return new Car(
            options.x,
            options.y,
            options.width,
            options.height,
            options.controls,
            options.acceleration,
            options.friction,
            options.maxSpeed,
            options.normalColor,
            options.damagedColor
        );
    }

    update(collisionPolygons: Point2D[][] = []) {
        this.controls.update();
        if (!this.damaged) {
            this.move();
            this.polygon = this.createPolygon();
            this.damaged = this.assessDamage(collisionPolygons);
        }
        if (this.sensor) {
            this.sensor.update(collisionPolygons);

            if (this.ai) {
                const inputs = this.sensor.readings.map((reading) =>
                    reading == null ? 0 : 1 - reading.offset
                );
                inputs.push(this.speed);
                inputs.push(this.angle);

                const outputs = this.ai.predict(inputs);

                if (this.controls.controlType === ControlType.AI) {
                    this.controls.keyMap["ArrowUp"] = Boolean(outputs[0]);
                    this.controls.keyMap["ArrowDown"] = Boolean(outputs[1]);
                    this.controls.keyMap["ArrowLeft"] = Boolean(outputs[2]);
                    this.controls.keyMap["ArrowRight"] = Boolean(outputs[3]);
                }
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.damaged && this.sensor && this.drawSensor) {
            this.sensor.draw(ctx);
        }

        ctx.fillStyle = this.normalColor;

        if (this.damaged) {
            ctx.fillStyle = this.damagedColor;
        }

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; ++i) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        ctx.closePath();

        if (!this.damaged && this.drawStroke) {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    private move() {
        let dx = 0;
        let dy = 0;

        if (this.controls.left) {
            dx -= 1;
        }
        if (this.controls.right) {
            dx += 1;
        }
        if (this.controls.up) {
            dy -= 1;
        }
        if (this.controls.down) {
            dy += 1;
        }

        this.speed += -dy * this.acceleration;

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed < -this.maxSpeed / 4) {
            this.speed = -this.maxSpeed / 4;
        }

        if (this.speed > 0) {
            this.speed = Math.max(this.speed - this.friction, 0);
        }
        if (this.speed < 0) {
            this.speed = Math.min(this.speed + this.friction, 0);
        }

        if (0 < Math.abs(this.speed)) {
            //const stiffness = Math.abs(this.speed) / this.maxSpeed;
            this.angle += dx * 0.075; // * Math.max(stiffness, 0.75);
        }

        this.x += Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    private createPolygon(): Point2D[] {
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.height, this.width);

        const polygon = [
            new Point2D(
                this.x + rad * Math.cos(this.angle - alpha),
                this.y + rad * Math.sin(this.angle - alpha)
            ),
            new Point2D(
                this.x + rad * Math.cos(this.angle + alpha),
                this.y + rad * Math.sin(this.angle + alpha)
            ),
            new Point2D(
                this.x + rad * Math.cos(this.angle + Math.PI - alpha),
                this.y + rad * Math.sin(this.angle + Math.PI - alpha)
            ),
            new Point2D(
                this.x + rad * Math.cos(this.angle + Math.PI + alpha),
                this.y + rad * Math.sin(this.angle + Math.PI + alpha)
            ),
        ];
        return polygon;
    }

    private assessDamage(collisionPolygons: Point2D[][]): boolean {
        if (collisionPolygons.length === 0) return false;

        for (const otherPolygon of collisionPolygons) {
            if (Geom.polysIntersect(this.polygon, otherPolygon)) {
                return true;
            }
        }
        return false;
    }
}
