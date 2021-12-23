import Player from "./Player";

class PlayerController {

    public static readonly SPEED = 3.0;
    public static readonly SENSITIVITY = 0.0025;

    private readonly player: Player;
    private pressed: { [index: string]: number };
    private captureMouse: boolean;

    public constructor(player: Player) {

        this.player = player;
        this.pressed = {};
        this.captureMouse = false;

        window.addEventListener("keydown", e => this.key(e, 1));
        window.addEventListener("keyup", e => this.key(e, 0));
        window.addEventListener("mousemove", e => this.mousemove(e));
        GL.canvas.addEventListener("click", () => GL.canvas.requestPointerLock());
        document.addEventListener("pointerlockchange", () => this.pointerLockChange());
    }

    private pointerLockChange(): void {
        this.captureMouse = document.pointerLockElement === GL.canvas;
        if (!this.captureMouse) {
            this.pressed = {};
        }
    }

    private mousemove(e: MouseEvent): void {
        if (!this.captureMouse) return;
        this.player.position.yaw += e.movementX * PlayerController.SENSITIVITY;
        this.player.position.pitch += e.movementY * PlayerController.SENSITIVITY;
        this.player.position.pitch = Math.min(Math.PI * 0.45, Math.max(Math.PI * -0.45, this.player.position.pitch));
    }

    private key(e: KeyboardEvent, down: number): void {
        if (!this.captureMouse) return;
        this.pressed[e.code] = down;
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