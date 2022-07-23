import Camera from "src/client/gl/Camera";
import Model from "src/client/gl/Model";
import Shader from "src/client/gl/Shader";
import ShadedTexturedCuboid from "src/client/models/ShadedTexturedCuboid";
import Vec3 from "src/common/math/Vec3";
import Position from "src/common/world/Position";

type Side = { left: number, right: number, top: number, bottom: number };
type UV = { front: Side, back: Side, top: Side, bottom: Side, right: Side, left: Side };

class Humanoid {

    public position: Position;
    public bodyYaw: number;
    public swing: number;
    private readonly shader: Shader;
    private readonly torso: Model;
    private readonly rightLeg: Model;
    private readonly leftLeg: Model;
    private readonly rightArm: Model;
    private readonly leftArm: Model;
    private readonly head: Model;

    public constructor(position: Position, shader: Shader) {

        this.position = position;
        this.shader = shader;
        this.bodyYaw = 0;
        this.swing = 0;

        this.torso = new Model(this.shader,
            new ShadedTexturedCuboid(Humanoid.map(16 / 64, 16 / 64, 8, 12, 4)),
            new Vec3(), new Vec3(), new Vec3(8 / 16, 12 / 16, 4 / 16), new Vec3(0.5, 0, 0.5));

        this.rightLeg = new Model(this.shader,
            new ShadedTexturedCuboid(Humanoid.map(0 / 64, 16 / 64, 4, 12, 4)),
            new Vec3(), new Vec3(), new Vec3(4 / 16, 12 / 16, 4 / 16), new Vec3(1, 1, 0.5));

        this.leftLeg = new Model(this.shader,
            new ShadedTexturedCuboid(Humanoid.map(16 / 64, 48 / 64, 4, 12, 4)),
            new Vec3(), new Vec3(), new Vec3(4 / 16, 12 / 16, 4 / 16), new Vec3(0, 1, 0.5));

        this.rightArm = new Model(this.shader,
            new ShadedTexturedCuboid(Humanoid.map(40 / 64, 16 / 64, 4, 12, 4)),
            new Vec3(), new Vec3(), new Vec3(4 / 16, 12 / 16, 4 / 16), new Vec3(2, 12 / 16, 0.5));

        this.leftArm = new Model(this.shader,
            new ShadedTexturedCuboid(Humanoid.map(32 / 64, 48 / 64, 4, 12, 4)),
            new Vec3(), new Vec3(), new Vec3(4 / 16, 12 / 16, 4 / 16), new Vec3(-1, 12 / 16, 0.5));

        this.head = new Model(this.shader,
            new ShadedTexturedCuboid(Humanoid.map(0 / 64, 0 / 64, 8, 8, 8)),
            new Vec3(), new Vec3(), new Vec3(8 / 16, 8 / 16, 8 / 16), new Vec3(0.5, 0, 0.5));

        this.update();
    }

    public static map(x: number, y: number, w: number, h: number, d: number): number[][] {
        return Humanoid.mapUvs({
            front: {
                left: x + d / 64,
                right: x + (d + w) / 64,
                top: y + d / 64,
                bottom: y + (d + h) / 64
            },
            back: {
                left: x + (2 * d + w) / 64,
                right: x + 2 * (d + w) / 64,
                top: y + d / 64,
                bottom: y + (d + h) / 64
            },
            top: {
                left: x + d / 64,
                right: x + (d + w) / 64,
                top: y,
                bottom: y + d / 64
            },
            bottom: {
                left: x + (d + w) / 64,
                right: x + (d + 2 * w) / 64,
                top: y,
                bottom: y + d / 64
            },
            left: {
                left: x,
                right: x + d / 64,
                top: y + d / 64,
                bottom: y + (d + h) / 64
            },
            right: {
                left: x + (d + w) / 64,
                right: x + (2 * d + w) / 64,
                top: y + d / 64,
                bottom: y + (d + h) / 64
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
        this.torso.delete();
        this.rightLeg.delete();
        this.leftLeg.delete();
        this.rightArm.delete();
        this.leftArm.delete();
        this.head.delete();
    }

    public update(): void {

        this.torso.position = new Vec3(this.position.x - 8 / 16, this.position.y + 12 / 16, this.position.z - 8 / 16);
        this.torso.rotation = new Vec3(0, -this.bodyYaw + Math.PI, 0);
        this.torso.update();

        this.rightLeg.position = new Vec3(this.position.x - 16 / 16, this.position.y - 4 / 16, this.position.z - 8 / 16);
        this.rightLeg.rotation = new Vec3(-this.swing, -this.bodyYaw + Math.PI, 0);
        this.rightLeg.update();

        this.leftLeg.position = new Vec3(this.position.x, this.position.y - 4 / 16, this.position.z - 8 / 16);
        this.leftLeg.rotation = new Vec3(this.swing, -this.bodyYaw + Math.PI, 0);
        this.leftLeg.update();

        this.rightArm.position = new Vec3(this.position.x - 32 / 16, this.position.y + 9 / 16, this.position.z - 8 / 16);
        this.rightArm.rotation = new Vec3(this.swing, -this.bodyYaw + Math.PI, 0);
        this.rightArm.update();

        this.leftArm.position = new Vec3(this.position.x + 16 / 16, this.position.y + 9 / 16, this.position.z - 8 / 16);
        this.leftArm.rotation = new Vec3(-this.swing, -this.bodyYaw + Math.PI, 0);
        this.leftArm.update();

        this.head.position = new Vec3(this.position.x - 8 / 16, this.position.y + 24 / 16, this.position.z - 8 / 16);
        this.head.rotation = new Vec3(this.position.pitch, -this.position.yaw + Math.PI, 0);
        this.head.update();
    }

    public render(camera: Camera): void {
        this.torso.render(camera);
        this.leftLeg.render(camera);
        this.rightLeg.render(camera);
        this.rightArm.render(camera);
        this.leftArm.render(camera);
        this.head.render(camera);
    }
}

export default Humanoid;