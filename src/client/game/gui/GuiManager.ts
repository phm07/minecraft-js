import { mat4 } from "gl-matrix";

import Shader from "../../gl/Shader";
import guiFragmentShader from "../../shaders/gui.fs";
import guiVertexShader from "../../shaders/gui.vs";
import IGui from "./IGui";

class GuiManager {

    declare public static GUI_SHADER: Shader;
    declare public static GUI_SAMPLER_UNIFORM: WebGLUniformLocation | null;

    private gui: IGui | null;
    public readonly projectionMatrix: mat4;

    public constructor() {
        this.gui = null;
        this.projectionMatrix = mat4.create();
    }

    public static init(): void {
        if (!GuiManager.GUI_SHADER) {
            GuiManager.GUI_SHADER = new Shader(guiVertexShader, guiFragmentShader);
            GuiManager.GUI_SAMPLER_UNIFORM = GuiManager.GUI_SHADER.getUniformLocation("uTexture");
        }
    }

    public setGui(gui: IGui | null): void {
        this.gui?.delete();
        this.gui = gui;
        this.gui?.onWindowResize();
    }

    public render(): void {
        GL.clear(GL.DEPTH_BUFFER_BIT);
        this.gui?.render();
    }

    public update(delta: number): void {
        this.gui?.update(delta);
    }

    public delete(): void {
        this.gui?.delete();
    }

    public onWindowResize(): void {
        mat4.ortho(this.projectionMatrix, 0, GL.canvas.width, 0, GL.canvas.height, -1, 1);
        this.gui?.onWindowResize();
    }
}

export default GuiManager;