import * as mathh from "math/math";
import { Point2D } from "math/point";
import { GameObject } from "game-objects/game-object";

export class Road implements GameObject {
    private left: number;
    private right: number;
    private top: number;
    private bottom: number;

    public borders: Point2D[][];

    constructor(x: number, width: number, private laneCount: number = 3) {
        this.left = x - width / 2;
        this.right = x + width / 2;
        this.top = mathh.INFINITY_NEG;
        this.bottom = mathh.INFINITY;

        const topLeft = new Point2D(this.left, this.top);
        const bottomLeft = new Point2D(this.left, this.bottom);
        const topRight = new Point2D(this.right, this.top);
        const bottomRight = new Point2D(this.right, this.bottom);

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight],
        ];
    }

    update(): void {}

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for (let i = 1; i < this.laneCount; ++i) {
            const x = mathh.lerp(this.left, this.right, i / this.laneCount);

            ctx.setLineDash([10, 10]);

            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        for (let i = 0; i < this.borders.length; i++) {
            const border = this.borders[i];

            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        }
    }

    getLaneCenter(laneIndex: number): number {
        laneIndex = Math.max(0, Math.min(this.laneCount - 1, laneIndex));
        const laneWidth = (this.right - this.left) / this.laneCount;
        return this.left + laneWidth * laneIndex + laneWidth / 2;
    }
}
