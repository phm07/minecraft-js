import ShadedTexturedCuboid from "../models/shaded_textured_cuboid";
import human from "../assets/human2.png";
import vertexShader from "../shaders/human.vs";
import fragmentShader from "../shaders/human.fs";
import Shader from "../gl/shader";
import Model from "../gl/model";
import Texture from "../gl/texture";

class Human {

    constructor(position) {
        this.position = position;
        this.texture = new Texture(human);
        this.shader = new Shader(vertexShader, fragmentShader);

        this.torso = new Model(this.shader, new ShadedTexturedCuboid([
            // front
            [20/64, 32/64, 0.9],
            [28/64, 32/64, 0.9],
            [28/64, 20/64, 0.9],
            [20/64, 20/64, 0.9],
            // back
            [40/64, 32/64, 0.9],
            [40/64, 20/64, 0.9],
            [32/64, 20/64, 0.9],
            [32/64, 32/64, 0.9],
            // top
            [28/64, 20/64, 1],
            [28/64, 16/64, 1],
            [20/64, 16/64, 1],
            [20/64, 20/64, 1],
            // bottom
            [28/64, 20/64, 0.7],
            [36/64, 20/64, 0.7],
            [36/64, 16/64, 0.7],
            [28/64, 16/64, 0.7],
            // right
            [20/64, 32/64, 0.8],
            [20/64, 20/64, 0.8],
            [16/64, 20/64, 0.8],
            [16/64, 32/64, 0.8],
            // left
            [28/64, 32/64, 0.8],
            [32/64, 32/64, 0.8],
            [32/64, 20/64, 0.8],
            [28/64, 20/64, 0.8],
        ]), undefined, undefined, [8/16, 12/16, 4/16]);

        this.rightLeg = new Model(this.shader, new ShadedTexturedCuboid([
            // front
            [4/64, 32/64, 0.9],
            [8/64, 32/64, 0.9],
            [8/64, 20/64, 0.9],
            [4/64, 20/64, 0.9],
            // back
            [16/64, 32/64, 0.9],
            [16/64, 20/64, 0.9],
            [12/64, 20/64, 0.9],
            [12/64, 32/64, 0.9],
            // top
            [8/64, 20/64, 1.0],
            [8/64, 16/64, 1.0],
            [4/64, 16/64, 1.0],
            [4/64, 20/64, 1.0],
            // bottom
            [8/64, 20/64, 0.7],
            [12/64, 20/64, 0.7],
            [12/64, 16/64, 0.7],
            [8/64, 16/64, 0.7],
            // right
            [12/64, 32/64, 0.8],
            [12/64, 20/64, 0.8],
            [8/64, 20/64, 0.8],
            [8/64, 32/64, 0.8],
            // left
            [0/64, 32/64, 0.8],
            [4/64, 32/64, 0.8],
            [4/64, 20/64, 0.8],
            [0/64, 20/64, 0.8],
        ]), undefined, undefined, [4/16, 12/16, 4/16]);

        this.leftLeg = new Model(this.shader, new ShadedTexturedCuboid([
            // front
            [8/64, 32/64, 0.9],
            [4/64, 32/64, 0.9],
            [4/64, 20/64, 0.9],
            [8/64, 20/64, 0.9],
            // back
            [12/64, 32/64, 0.9],
            [12/64, 20/64, 0.9],
            [16/64, 20/64, 0.9],
            [16/64, 32/64, 0.9],
            // top
            [8/64, 20/64, 1.0],
            [8/64, 16/64, 1.0],
            [4/64, 16/64, 1.0],
            [4/64, 20/64, 1.0],
            // bottom
            [8/64, 20/64, 0.7],
            [12/64, 20/64, 0.7],
            [12/64, 16/64, 0.7],
            [8/64, 16/64, 0.7],
            // right
            [0/64, 32/64, 0.8],
            [0/64, 20/64, 0.8],
            [4/64, 20/64, 0.8],
            [4/64, 32/64, 0.8],
            // left
            [12/64, 32/64, 0.8],
            [8/64, 32/64, 0.8],
            [8/64, 20/64, 0.8],
            [12/64, 20/64, 0.8],
        ]), undefined, undefined, [4/16, 12/16, 4/16]);

        this.rightArm = new Model(this.shader, new ShadedTexturedCuboid([
            // front
            [44/64, 32/64, 0.9],
            [48/64, 32/64, 0.9],
            [48/64, 20/64, 0.9],
            [44/64, 20/64, 0.9],
            // back
            [56/64, 32/64, 0.9],
            [56/64, 20/64, 0.9],
            [52/64, 20/64, 0.9],
            [52/64, 32/64, 0.9],
            // top
            [48/64, 20/64, 1.0],
            [48/64, 16/64, 1.0],
            [44/64, 16/64, 1.0],
            [44/64, 20/64, 1.0],
            // bottom
            [48/64, 20/64, 0.7],
            [52/64, 20/64, 0.7],
            [52/64, 16/64, 0.7],
            [48/64, 16/64, 0.7],
            // right
            [52/64, 32/64, 0.8],
            [52/64, 20/64, 0.8],
            [48/64, 20/64, 0.8],
            [48/64, 32/64, 0.8],
            // left
            [40/64, 32/64, 0.8],
            [44/64, 32/64, 0.8],
            [44/64, 20/64, 0.8],
            [40/64, 20/64, 0.8],
        ]), undefined, undefined, [4/16, 12/16, 4/16]);

        this.leftArm = new Model(this.shader, new ShadedTexturedCuboid([
            // front
            [48/64, 32/64, 0.9],
            [44/64, 32/64, 0.9],
            [44/64, 20/64, 0.9],
            [48/64, 20/64, 0.9],
            // back
            [52/64, 32/64, 0.9],
            [52/64, 20/64, 0.9],
            [56/64, 20/64, 0.9],
            [56/64, 32/64, 0.9],
            // top
            [48/64, 20/64, 1.0],
            [48/64, 16/64, 1.0],
            [44/64, 16/64, 1.0],
            [44/64, 20/64, 1.0],
            // bottom
            [48/64, 20/64, 0.7],
            [52/64, 20/64, 0.7],
            [52/64, 16/64, 0.7],
            [48/64, 16/64, 0.7],
            // left
            [44/64, 32/64, 0.8],
            [44/64, 20/64, 0.8],
            [40/64, 20/64, 0.8],
            [40/64, 32/64, 0.8],
            // right
            [48/64, 20/64, 0.8],
            [52/64, 20/64, 0.8],
            [52/64, 32/64, 0.8],
            [48/64, 32/64, 0.8],
        ]), undefined, undefined, [4/16, 12/16, 4/16]);

        this.head = new Model(this.shader, new ShadedTexturedCuboid([
            // front
            [8/64, 16/64, 0.9],
            [16/64, 16/64, 0.9],
            [16/64, 8/64, 0.9],
            [8/64, 8/64, 0.9],
            // back
            [32/64, 16/64, 0.9],
            [32/64, 8/64, 0.9],
            [24/64, 8/64, 0.9],
            [24/64, 16/64, 0.9],
            // top
            [16/64, 8/64, 1.0],
            [16/64, 0/64, 1.0],
            [8/64, 0/64, 1.0],
            [8/64, 8/64, 1.0],
            // bottom
            [16/64, 8/64, 0.7],
            [24/64, 8/64, 0.7],
            [24/64, 0/64, 0.7],
            [16/64, 0/64, 0.7],
            // right
            [0/64, 16/64, 0.8],
            [0/64, 8/64, 0.8],
            [8/64, 8/64, 0.8],
            [8/64, 16/64, 0.8],
            // left
            [24/64, 16/64, 0.8],
            [16/64, 16/64, 0.8],
            [16/64, 8/64, 0.8],
            [24/64, 8/64, 0.8],
        ]), undefined, undefined, [8/16, 8/16, 8/16]);

        this.update(0);
    }

    delete() {
        this.texture.delete();
        this.shader.delete();
        this.torso.delete();
    }

    update() {

        this.torso.position = [this.position.x-4/16, this.position.y+12/16, this.position.z-2/16];
        this.torso.update();
        this.rightLeg.position = [this.position.x-4/16, this.position.y, this.position.z-2/16];
        this.rightLeg.update();
        this.leftLeg.position = [this.position.x, this.position.y, this.position.z-2/16];
        this.leftLeg.update();
        this.rightArm.position = [this.position.x-8/16, this.position.y+12/16, this.position.z-2/16];
        this.rightArm.update();
        this.leftArm.position = [this.position.x+4/16, this.position.y+12/16, this.position.z-2/16];
        this.leftArm.update();
        this.head.position = [this.position.x-4/16, this.position.y+24/16, this.position.z-4/16];
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

export default Human;