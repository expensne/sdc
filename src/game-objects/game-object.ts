import { Point2D } from "../math/point";

export interface GameObject {
    update(collisionPolys: Point2D[][]): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
