import Interpolator from "../../common/Interpolator";
import Util from "../../common/Util";
import Human from "./Human";

class AnimationManager {

    private readonly human: Human;
    private readonly interpolator: Interpolator;
    private walking: boolean;
    private swingTime: number;

    public constructor(human: Human) {
        this.human = human;
        this.interpolator = new Interpolator({ walk: 0, swingSpeed: 0 });
        this.walking = false;
        this.swingTime = 0;
    }

    public update(delta: number): void {

        this.interpolator.update(delta);

        const speed = Util.dist(this.human.velocity.x, this.human.velocity.z, 0, 0);
        this.interpolator.animate("swingSpeed", speed/3.0, 0.1);

        const walk = this.interpolator.getValue("walk");
        const swingSpeed = this.interpolator.getValue("swingSpeed");

        this.human.model.swing = Math.sin(this.swingTime)*(Math.PI/4)*Util.clamp(swingSpeed, 0, 2)*walk;

        this.swingTime += delta * swingSpeed * walk * 10;
    }

    public setWalking(walking: boolean): void {
        if (this.walking === walking) return;
        this.walking = walking;
        if (walking) {
            this.interpolator.animate("walk", 1, 0.2);
        } else {
            this.interpolator.animate("walk", 0, 0.2);
        }
    }
}

export default AnimationManager;