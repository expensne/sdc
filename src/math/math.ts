import { Gaussian } from "ts-gaussian";

export class Mathh {
    static readonly INFINITY: number = 10000000;
    static readonly INFINITY_NEG: number = -Mathh.INFINITY;
    static readonly EPSILON: number = 1e-6;

    static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    static randPMOne(): number {
        return Math.random() * 2 - 1;
    }

    static sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    static clamp(x: number, min: number, max: number): number {
        return Math.min(Math.max(x, min), max);
    }

    static normal(mean: number = 0, scale: number = 1): number {
        return new Gaussian(mean, scale ** 2).ppf(Math.random());
    }

    static randomTrue(probability: number = 0.5): boolean {
        return Math.random() < probability;
    }

    static linspace(start: number, stop: number, count: number): number[] {
        const result: number[] = [];
        for (let i = 0; i <= count; ++i) {
            result.push(Mathh.lerp(start, stop, i / count));
        }
        return result;
    }

    static arrExp(arr: number[]): number[] {
        return arr.map((x) => Math.exp(x ** 2));
    }

    static min<T>(comp: (arg0: T) => number, ...objects: T[]): T {
        return [...objects].sort((a: T, b: T) => comp(a) - comp(b))[0];
    }
}
