import Human from "src/client/game/mp/Human";
import Humanoid from "src/client/models/Humanoid";
import Interpolator from "src/common/math/Interpolator";
import MathUtils from "src/common/math/MathUtils";

class Animator {

    private readonly human: Human;
    private readonly model: Humanoid;
    private readonly interpolator: Interpolator;
    private swingTime: number;

    public constructor(human: Human, model: Humanoid) {
        this.human = human;
        this.model = model;
        this.interpolator = new Interpolator({ walk: 0, swingSpeed: 0, bodyYaw: 0 });
        this.swingTime = 0;
    }

    public update(delta: number): void {

        const speed = MathUtils.dist2(this.human.velocity.x, this.human.velocity.z, 0, 0);
        const walking = this.human.velocity.y >= -10 && speed > 10e-3;

        this.interpolator.update(delta);
        this.interpolator.animate("swingSpeed", speed / 3.0, 0.1);
        if (walking) {
            this.interpolator.animate("walk", 1, 0.2);
            const angleOffset = -MathUtils.wrapRadians(this.human.position.yaw + Math.atan2(this.human.velocity.x, this.human.velocity.z) + Math.PI);
            this.interpolator.animate("bodyYaw", this.human.position.yaw + MathUtils.clamp(angleOffset, -Math.PI / 4, Math.PI / 4), 0.1);
        } else {
            this.interpolator.animate("walk", 0, 0.2);
            this.interpolator.animate("bodyYaw", MathUtils.clamp(this.model.bodyYaw, this.human.position.yaw - Math.PI / 4, this.human.position.yaw + Math.PI / 4), 0.01);
        }

        const walk = this.interpolator.getValue("walk");
        const swingSpeed = this.interpolator.getValue("swingSpeed");
        this.model.bodyYaw = this.interpolator.getValue("bodyYaw");

        this.model.swing = Math.sin(this.swingTime) * (Math.PI / 4) * MathUtils.clamp(swingSpeed, 0, 2) * walk;
        this.swingTime += delta * swingSpeed * walk * 10;
    }
}

export default Animator;