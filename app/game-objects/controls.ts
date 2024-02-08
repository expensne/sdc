import { GameObject } from "game-objects/game-object";

export enum ControlType {
    PLAYER,
    BOT,
    AI,
}

export class Controls implements GameObject {
    public left: boolean = false;
    public right: boolean = false;
    public up: boolean = false;
    public down: boolean = false;
    public space: boolean = false;
    public shift: boolean = false;
    public enter: boolean = false;

    public keyMap: { [key: string]: boolean } = {};
    public readonly controlType: ControlType;

    constructor(controlType: ControlType) {
        this.controlType = controlType;

        switch (controlType) {
            case ControlType.PLAYER:
                this.bindKeys();
                break;
            case ControlType.BOT:
                this.keyMap["ArrowUp"] = true;
                break;
        }
    }

    update() {
        this.left = this.keyMap["ArrowLeft"];
        this.right = this.keyMap["ArrowRight"];
        this.up = this.keyMap["ArrowUp"];
        this.down = this.keyMap["ArrowDown"];
        this.space = this.keyMap[" "];
        this.shift = this.keyMap["Shift"];
        this.enter = this.keyMap["Enter"];
    }

    draw(ctx: CanvasRenderingContext2D): void {}

    private bindKeys() {
        window.addEventListener("keydown", (e) => (this.keyMap[e.key] = true));
        window.addEventListener("keyup", (e) => (this.keyMap[e.key] = false));
    }
}
