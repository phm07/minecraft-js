import PlayerPosition from "../../common/PlayerPosition";
import Vec3 from "../../common/Vec3";
import Model from "../gl/Model";
import Shader from "../gl/Shader";
import Texture from "../gl/Texture";
import ShadedTexturedCuboid from "./ShadedTexturedCuboid";

type Side = { left: number, right: number, top: number, bottom: number };
type UV = { front: Side, back: Side, top: Side, bottom: Side, right: Side, left: Side };

class Humanoid {
    
    public position: PlayerPosition;
    public bodyYaw: number;
    private readonly armSwing: number;
    private readonly legSwing: number;
    private readonly texture: Texture;
    private readonly shader: Shader;
    private readonly torso: Model;
    private readonly rightLeg: Model;
    private readonly leftLeg: Model;
    private readonly rightArm: Model;
    private readonly leftArm: Model;
    private readonly head: Model;

    public constructor(shader: Shader, texture: Texture, position: PlayerPosition) {

        this.position = position;
        this.bodyYaw = 0;
        this.armSwing = 0;
        this.legSwing = 0;

        this.texture = texture;
        this.shader = shader;

        this.torso = new Model(this.shader,
            new ShadedTexturedCuboid(Humanoid.map(16/64, 16/64, 8, 12, 4)),
            new Vec3(), new Vec3(), new Vec3(8/16, 12/16, 4/16), new Vec3(0.5, 0, 0.5));

        this.rightLeg = new Model(this.shader,
            new ShadedTexturedCuboid(Humanoid.map(0/64, 16/64, 4, 12, 4)),
            new Vec3(), new Vec3(), new Vec3(4/16, 12/16, 4/16), new Vec3(1, 1, 0.5));

        this.leftLeg = new Model(this.shader,
            new ShadedTexturedCuboid(Humanoid.map(16/64, 48/64, 4, 12, 4)),
            new Vec3(), new Vec3(), new Vec3(4/16, 12/16, 4/16), new Vec3(0, 1, 0.5));

        this.rightArm = new Model(this.shader,
            new ShadedTexturedCuboid(Humanoid.map(40/64, 16/64, 4, 12, 4)),
            new Vec3(), new Vec3(), new Vec3(4/16, 12/16, 4/16), new Vec3(2, 12/16, 0.5));

        this.leftArm = new Model(this.shader,
            new ShadedTexturedCuboid(Humanoid.map(32/64, 48/64, 4, 12, 4)),
            new Vec3(), new Vec3(), new Vec3(4/16, 12/16, 4/16), new Vec3(-1, 12/16, 0.5));

        this.head = new Model(this.shader,
            new ShadedTexturedCuboid(Humanoid.map(0/64, 0/64, 8, 8, 8)),
            new Vec3(), new Vec3(), new Vec3(8/16, 8/16, 8/16), new Vec3(0.5, 0, 0.5));

        this.update();
    }

    private static map(x: number, y: number, w: number, h: number, d: number): number[][] {
        const i = 0.005; // inset
        return Humanoid.mapUvs({
            front: {
                left: x+d/64+i,
                right: x+(d+w)/64-i,
                top: y+d/64+i,
                bottom: y+(d+h)/64-i
            },
            back: {
                left: x+(2*d+w)/64+i,
                right: x+(2*(d+w))/64-i,
                top: y+d/64+i,
                bottom: y+(d+h)/64-i
            },
            top: {
                left: x+d/64+i,
                right: x+(d+w)/64-i,
                top: y+i,
                bottom: y+d/64-i
            },
            bottom: {
                left: x+(d+w)/64+i,
                right: x+(d+2*w)/64-i,
                top: y+i,
                bottom: y+d/64-i
            },
            left: {
                left: x+i,
                right: x+d/64-i,
                top: y+d/64+i,
                bottom: y+(d+h)/64-i
            },
            right: {
                left: x+(d+w)/64+i,
                right: x+(2*d+w)/64-i,
                top: y+d/64+i,
                bottom: y+(d+h)/64-i
            }
        });
    }

    private static mapUvs({ front, back, top, bottom, right, left }: UV): number[][] {
        return [
            [front.left, front.bottom, 0.9],
            [front.right, front.bottom, 0.9],
            [front.right, front.top, 0.9],
            [front.left, front.top, 0.9],

            [back.right, back.bottom, 0.9],
            [back.right, back.top, 0.9],
            [back.left, back.top, 0.9],
            [back.left, back.bottom, 0.9],

            [top.left, top.top, 1.0],
            [top.left, top.bottom, 1.0],
            [top.right, top.bottom, 1.0],
            [top.right, top.top, 1.0],

            [bottom.left, bottom.top, 0.7],
            [bottom.right, bottom.top, 0.7],
            [bottom.right, bottom.bottom, 0.7],
            [bottom.left, bottom.bottom, 0.7],

            [right.right, right.bottom, 0.8],
            [right.right, right.top, 0.8],
            [right.left, right.top, 0.8],
            [right.left, right.bottom, 0.8],

            [left.left, left.bottom, 0.8],
            [left.right, left.bottom, 0.8],
            [left.right, left.top, 0.8],
            [left.left, left.top, 0.8]
        ];
    }

    public delete(): void {
        this.texture.delete();
        this.shader.delete();
        this.torso.delete();
    }

    public update(): void {

        this.torso.position = new Vec3(this.position.x-8/16, this.position.y+12/16, this.position.z-8/16);
        this.torso.rotation = new Vec3(0, this.bodyYaw+Math.PI, 0);
        this.torso.update();

        this.rightLeg.position = new Vec3(this.position.x-16/16, this.position.y-4/16, this.position.z-8/16);
        this.rightLeg.rotation = new Vec3(-this.legSwing, this.bodyYaw+Math.PI, 0);
        this.rightLeg.update();

        this.leftLeg.position = new Vec3(this.position.x, this.position.y-4/16, this.position.z-8/16);
        this.leftLeg.rotation = new Vec3(this.legSwing, this.bodyYaw+Math.PI, 0);
        this.leftLeg.update();

        this.rightArm.position = new Vec3(this.position.x-32/16, this.position.y+9/16, this.position.z-8/16);
        this.rightArm.rotation = new Vec3(this.armSwing, this.bodyYaw+Math.PI, 0);
        this.rightArm.update();

        this.leftArm.position = new Vec3(this.position.x+16/16, this.position.y+9/16, this.position.z-8/16);
        this.leftArm.rotation = new Vec3(-this.armSwing, this.bodyYaw+Math.PI, 0);
        this.leftArm.update();

        this.head.position = new Vec3(this.position.x-8/16, this.position.y+24/16, this.position.z-8/16);
        this.head.rotation = new Vec3(this.position.pitch, this.position.yaw+Math.PI, 0);
        this.head.update();
    }

    public render(): void {

        this.shader.bind();
        GL.activeTexture(GL.TEXTURE0);
        this.texture.bind();

        this.torso.render();
        this.leftLeg.render();
        this.rightLeg.render();
        this.rightArm.render();
        this.leftArm.render();
        this.head.render();
    }
}

export default Humanoid;