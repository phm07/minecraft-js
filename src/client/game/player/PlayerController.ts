import Player from "src/client/game/player/Player";

class PlayerController {

    public static readonly SPEED = 3.0;
    public static readonly SENSITIVITY = 0.0025;

    private readonly player: Player;
    private readonly removeListeners: () => void;
    private pressed: Record<string, number | undefined>;
    private captureMouse: boolean;

    public constructor(player: Player) {

        this.player = player;
        this.pressed = {};
        this.captureMouse = false;

        const onWindowKeyDown = (e: KeyboardEvent): void => this.key(e, 1);
        const onWindowKeyUp = (e: KeyboardEvent): void => this.key(e, 0);
        const onKeyPress = (e: KeyboardEvent): void => this.keyPress(e);
        const onWindowMouseMove = (e: MouseEvent): void => this.mouseMove(e);
        const onWindowMouseDown = (e: MouseEvent): void => this.mouseDown(e);
        const onCanvasClick = (): void => GL.canvas.requestPointerLock();
        const onDocumentPointerLockChange = (): void => this.pointerLockChange();

        window.addEventListener("keydown", onWindowKeyDown);
        window.addEventListener("keyup", onWindowKeyUp);
        window.addEventListener("keypress", onKeyPress);
        window.addEventListener("mousemove", onWindowMouseMove);
        window.addEventListener("mousedown", onWindowMouseDown);
        GL.canvas.addEventListener("click", onCanvasClick);
        document.addEventListener("pointerlockchange", onDocumentPointerLockChange);

        this.removeListeners = (): void => {
            window.removeEventListener("keydown", onWindowKeyDown);
            window.removeEventListener("keyup", onWindowKeyUp);
            window.removeEventListener("keypress", onKeyPress);
            window.removeEventListener("mousemove", onWindowMouseMove);
            window.removeEventListener("mousedown", onWindowMouseDown);
            GL.canvas.removeEventListener("click", onCanvasClick);
            document.addEventListener("pointerlockchange", onDocumentPointerLockChange);
        };
    }

    public delete(): void {
        this.removeListeners();
        document.exitPointerLock();
    }

    private mouseDown(e: MouseEvent): void {
        if (e.button === 0) {
            this.player.breakBlock();
        } else if (e.button === 2) {
            this.player.placeBlock();
        }
    }

    private pointerLockChange(): void {
        this.captureMouse = document.pointerLockElement === GL.canvas;
        if (!this.captureMouse) {
            this.pressed = {};
        }
    }

    private mouseMove(e: MouseEvent): void {
        if (!this.captureMouse) return;
        this.player.position.yaw += e.movementX * PlayerController.SENSITIVITY;
        this.player.position.pitch += e.movementY * PlayerController.SENSITIVITY;
        this.player.position.pitch = Math.min(Math.PI / 2, Math.max(-Math.PI / 2, this.player.position.pitch));
    }

    private key(e: KeyboardEvent, down: number): void {
        if (!this.captureMouse) return;
        this.pressed[e.code] = down;
    }

    private keyPress(e: KeyboardEvent): void {
        if (e.code === "KeyV") {
            this.player.viewMode = (this.player.viewMode + 1) % 3;
        }
    }

    private isPressed(key: string): number {
        return this.pressed[key] ?? 0;
    }

    public update(): void {

        let dx = 0, dz = 0;
        dx += this.isPressed("KeyD") * Math.cos(this.player.position.yaw);
        dz += this.isPressed("KeyD") * Math.sin(this.player.position.yaw);
        dx -= this.isPressed("KeyA") * Math.cos(this.player.position.yaw);
        dz -= this.isPressed("KeyA") * Math.sin(this.player.position.yaw);
        dz += this.isPressed("KeyS") * Math.cos(this.player.position.yaw);
        dx -= this.isPressed("KeyS") * Math.sin(this.player.position.yaw);
        dz -= this.isPressed("KeyW") * Math.cos(this.player.position.yaw);
        dx += this.isPressed("KeyW") * Math.sin(this.player.position.yaw);

        if (dx !== 0 || dz !== 0) {
            const angle = Math.atan2(dz, dx);
            this.player.velocity.x = Math.cos(angle) * PlayerController.SPEED;
            this.player.velocity.z = Math.sin(angle) * PlayerController.SPEED;
        }

        if (this.isPressed("Space") && this.player.onGround) {
            this.player.onGround = false;
            this.player.velocity.y = 8.0;
        }
    }
}

export default PlayerController;