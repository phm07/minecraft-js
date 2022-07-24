import { mat4 } from "gl-matrix";
import IGui from "client/game/gui/IGui";
import Shader from "client/gl/Shader";
import guiFragmentShader from "client/shaders/gui.fs";
import guiVertexShader from "client/shaders/gui.vs";

class GuiManager {

    private gui?: IGui;
    public readonly projectionMatrix: mat4;
    public readonly shader: Shader;
    public readonly samplerUniform: WebGLUniformLocation | null;

    public constructor() {
        this.projectionMatrix = mat4.create();
        this.shader = new Shader(guiVertexShader, guiFragmentShader);
        this.samplerUniform = this.shader.getUniformLocation("uTexture");
    }

    public setGui<T extends IGui, U>(constructor: (new (manager: GuiManager, options: U) => T) | null, options: U): void {
        this.gui?.delete();
        if (constructor) {
            this.gui = new constructor(this, options);
            this.gui.onWindowResize();
        }
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
        this.shader.delete();
    }

    public onWindowResize(): void {
        mat4.ortho(this.projectionMatrix, 0, GL.canvas.width, 0, GL.canvas.height, -1, 1);
        this.gui?.onWindowResize();
    }
}

export default GuiManager;