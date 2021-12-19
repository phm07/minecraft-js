import ShadedTexturedCuboid from "./shaded_textured_cuboid";
import Model from "../gl/model";

class Humanoid {

    constructor(shader, texture, position) {

        this.position = position;
        this.bodyYaw = 0;
        this.armSwing = 0;
        this.legSwing = 0;

        this.texture = texture;
        this.shader = shader;

        this.torso = new Model(this.shader,
            new ShadedTexturedCuboid(this.map(16/64, 16/64, 8, 12, 4)),
            undefined, undefined, [8/16, 12/16, 4/16], [0.5, 0, 0.5]);

        this.rightLeg = new Model(this.shader,
            new ShadedTexturedCuboid(this.map(0/64, 16/64, 4, 12, 4)),
            undefined, undefined, [4/16, 12/16, 4/16], [1, 1, 0.5]);

        this.leftLeg = new Model(this.shader,
            new ShadedTexturedCuboid(this.map(16/64, 48/64, 4, 12, 4)),
            undefined, undefined, [4/16, 12/16, 4/16], [0, 1, 0.5]);

        this.rightArm = new Model(this.shader,
            new ShadedTexturedCuboid(this.map(40/64, 16/64, 4, 12, 4)),
            undefined, undefined, [4/16, 12/16, 4/16], [2, 12/16, 0.5]);

        this.leftArm = new Model(this.shader,
            new ShadedTexturedCuboid(this.map(32/64, 48/64, 4, 12, 4)),
            undefined, undefined, [4/16, 12/16, 4/16], [-1, 12/16, 0.5]);

        this.head = new Model(this.shader,
            new ShadedTexturedCuboid(this.map(0/64, 0/64, 8, 8, 8)),
            undefined, undefined, [8/16, 8/16, 8/16], [0.5, 0, 0.5]);

        this.update(0);
    }

    map(x, y, w, h, d) {
        const i = 0.001; // inset
        return this.mapUvs({
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

    mapUvs({ front, back, top, bottom, right, left }) {
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
            [left.left, left.top, 0.8],
        ]
    }

    delete() {
        this.texture.delete();
        this.shader.delete();
        this.torso.delete();
    }

    update(delta) {

        this.torso.position = [this.position.x-8/16, this.position.y+12/16, this.position.z-8/16];
        this.torso.rotation = [0, this.bodyYaw, 0];
        this.torso.update();

        this.rightLeg.position = [this.position.x-16/16, this.position.y-4/16, this.position.z-8/16];
        this.rightLeg.rotation = [-this.legSwing, this.bodyYaw, 0];
        this.rightLeg.update();

        this.leftLeg.position = [this.position.x, this.position.y-4/16, this.position.z-8/16];
        this.leftLeg.rotation = [this.legSwing, this.bodyYaw, 0];
        this.leftLeg.update();

        this.rightArm.position = [this.position.x-32/16, this.position.y+9/16, this.position.z-8/16];
        this.rightArm.rotation = [this.armSwing, this.bodyYaw, 0];
        this.rightArm.update();

        this.leftArm.position = [this.position.x+16/16, this.position.y+9/16, this.position.z-8/16];
        this.leftArm.rotation = [-this.armSwing, this.bodyYaw, 0];
        this.leftArm.update();

        this.head.position = [this.position.x-8/16, this.position.y+24/16, this.position.z-8/16];
        this.head.rotation = [0, 0, 0];
        this.head.update();
    }

    render() {

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