export function setupCanvas(
    height: number,
    width: number,
    id: string = "canvas"
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    return { canvas, ctx };
}

export function setupButton(
    id: string,
    onclick: () => void
): HTMLButtonElement {
    const button = document.getElementById(id) as HTMLButtonElement;
    button.onclick = onclick;
    return button;
}
