import { Point2D } from "math/point";
import { Mathh } from "math/math";

export function getIntersection(
    a1: Point2D,
    a2: Point2D,
    b1: Point2D,
    b2: Point2D
): { point: Point2D; offset: number } | null {
    const tTop = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    const uTop = (b1.y - a1.y) * (a1.x - a2.x) - (b1.x - a1.x) * (a1.y - a2.y);
    const bottom =
        (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                point: new Point2D(
                    Mathh.lerp(a1.x, a2.x, t),
                    Mathh.lerp(a1.y, a2.y, t)
                ),
                offset: t,
            };
        }
    }

    return null;
}

export function polysIntersect(a: Point2D[], b: Point2D[]): boolean {
    for (let i = 0; i < a.length; ++i) {
        for (let j = 0; j < b.length; ++j) {
            if (
                getIntersection(
                    a[i],
                    a[(i + 1) % a.length],
                    b[j],
                    b[(j + 1) % b.length]
                )
            ) {
                return true;
            }
        }
    }
    return false;
}
