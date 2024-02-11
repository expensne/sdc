import { Car } from "./car";
import { Point2D } from "../math/point";
import * as geom from "../math/geom";
import { Mathh } from "../math/math";
import { GameObject } from "./game-object";

export class Sensor implements GameObject {
    public readonly rayCount: number;
    public readings: ({ point: Point2D; offset: number } | null)[] = [];

    private readonly car: Car;
    private readonly rayLength: number;
    private readonly  fov: number;
    private rays: Point2D[][] = [];

    constructor(car: Car, rayCount = 11, rayLength = 300, fov = Math.PI / 1.25) {
        this.car = car;
        this.rayCount = rayCount;
        this.rayLength = rayLength;
        this.fov = fov;
    }

    update(collisionPolys: Point2D[][]) {
        if (collisionPolys.length === 0) return;

        this.castRays();
        this.readings = [];
        this.rays.forEach((ray) => {
            const reading = this.getReading(ray, collisionPolys);
            this.readings.push(reading);
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 1;

        for (let i = 0; i < this.rayCount; ++i) {
            const ray = this.rays[i];

            let rayBegin = ray[0];
            let rayEnd = ray[1];

            const reading = this.readings[i];

            if (reading) {
                rayEnd = reading.point;
            }

            ctx.strokeStyle = "yellow";

            ctx.beginPath();
            ctx.moveTo(rayBegin.x, rayBegin.y);
            ctx.lineTo(rayEnd.x, rayEnd.y);
            ctx.stroke();
        }
    }

    private castRays(): void {
        this.rays = [];

        for (let i = 0; i < this.rayCount; ++i) {
            let rayAngle;
            if (this.rayCount === 1) {
                rayAngle = 0;
            } else {
                rayAngle = Mathh.lerp(-this.fov / 2, this.fov / 2, i / (this.rayCount - 1));
            }

            rayAngle += this.car.angle;

            const start = new Point2D(this.car.x, this.car.y);
            const end = new Point2D(
                this.car.x + Math.sin(rayAngle) * this.rayLength,
                this.car.y - Math.cos(rayAngle) * this.rayLength
            );

            this.rays.push([start, end]);
        }
    }

    private getReading(
        ray: Point2D[],
        collisionPolygons: Point2D[][]
    ): { point: Point2D; offset: number } | null {
        let intersections = [];

        for (const polygon of collisionPolygons) {
            // It's a line
            if (polygon.length == 2) {
                const intersection = geom.getIntersection(ray[0], ray[1], polygon[0], polygon[1]);
                if (intersection) {
                    intersections.push(intersection);
                }
            }
            // It's a polygon
            else {
                for (let i = 0; i < polygon.length; ++i) {
                    const intersection = geom.getIntersection(
                        ray[0],
                        ray[1],
                        polygon[i],
                        polygon[(i + 1) % polygon.length]
                    );
                    if (intersection) {
                        intersections.push(intersection);
                    }
                }
            }
        }

        if (intersections.length === 0) {
            return null;
        } else {
            // Return the closest intersection
            const offsets = intersections.map((intersection) => {
                return intersection.offset;
            });
            const minOffset = Math.min(...offsets);
            return intersections.find((e) => e.offset === minOffset)!;
        }
    }
}
