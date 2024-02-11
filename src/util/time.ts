export function timeNow(): number {
    return new Date().getTime();
}

export function timeElapsed(since: number): number {
    return new Date().getTime() - since;
}
