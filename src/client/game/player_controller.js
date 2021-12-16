const speed = 5.0;
const sensitivity = 0.0025;

class PlayerController {

    constructor(player) {
        this.player = player;
        this.pressed = {};
        this.captureMouse = false;

        window.onkeydown = e => this.#key(e, 1);
        window.onkeyup = e => this.#key(e, 0);
        window.onmousemove = this.#mousemove.bind(this);
        GL.canvas.onclick = GL.canvas.requestPointerLock;
        GL.canvas.addEventListener("pointerlockchange", console.log);
        document.onpointerlockchange = this.#pointerLockChange.bind(this);
    }

    #pointerLockChange() {
        this.captureMouse = document.pointerLockElement === GL.canvas;
        if(!this.captureMouse) {
            this.pressed = {};
        }
    }

    #mousemove(e) {
        if(!this.captureMouse) return;
        this.player.position.yaw += e.movementX * sensitivity;
        this.player.position.pitch += e.movementY * sensitivity;
        this.player.position.pitch = Math.min(Math.PI * 0.45, Math.max(Math.PI * -0.45, this.player.position.pitch));
    }

    #key(e, down) {
        if(!this.captureMouse) return;
        this.pressed[e.code] = down;
    }

    #isPressed(key) {
        return this.pressed[key] ?? 0;
    }

    update() {

        this.player.velocity.x = 0;
        this.player.velocity.z = 0;
        this.player.velocity.x += this.#isPressed("KeyD") * Math.cos(this.player.position.yaw) * speed;
        this.player.velocity.z += this.#isPressed("KeyD") * Math.sin(this.player.position.yaw) * speed;
        this.player.velocity.x -= this.#isPressed("KeyA") * Math.cos(this.player.position.yaw) * speed;
        this.player.velocity.z -= this.#isPressed("KeyA") * Math.sin(this.player.position.yaw) * speed;
        this.player.velocity.z += this.#isPressed("KeyS") * Math.cos(this.player.position.yaw) * speed;
        this.player.velocity.x -= this.#isPressed("KeyS") * Math.sin(this.player.position.yaw) * speed;
        this.player.velocity.z -= this.#isPressed("KeyW") * Math.cos(this.player.position.yaw) * speed;
        this.player.velocity.x += this.#isPressed("KeyW") * Math.sin(this.player.position.yaw) * speed;
        
        if(this.#isPressed("Space") && this.player.onGround) {
            this.player.onGround = false;
            this.player.velocity.y = 8.0;
        }
    }
}

export default PlayerController;