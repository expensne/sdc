import { Gaussian } from "ts-gaussian";

export const INFINITY: number = 10000000;
export const INFINITY_NEG: number = -INFINITY;

export const EPS : number = 1e-6;

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export function randPMOne(): number {
    return Math.random() * 2 - 1;
}

export function sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
}

export function clamp(x: number, min: number, max: number): number {
    return Math.min(Math.max(x, min), max);
}

export function normal(mean: number = 0, scale: number = 1): number {
    return new Gaussian(mean, scale ** 2).ppf(Math.random());
}

export function randomTrue(probability: number = 0.5): boolean {
    return Math.random() < probability;
}

export function linspace(start: number, stop: number, count: number): number[] {
    const result: number[] = [];
    for (let i = 0; i <= count; ++i) {
        result.push(lerp(start, stop, i / count));
    }
    return result;
}

export function arrExp(arr: number[]): number[] {
    return arr.map((x) => Math.exp(x**2));
}
