import "../styles/home_scene.scss";

import background from "../assets/background.png";
import Shader from "../gl/Shader";
import Texture from "../gl/Texture";
import TexturedQuad2D from "../models/TexturedQuad2D";
import guiFragmentShader from "../shaders/gui.fs";
import guiVertexShader from "../shaders/gui.vs";
import IScene from "./IScene";

class HomeScene implements IScene {

    private readonly error: string | null;
    private readonly backgroundTexture: Texture;
    private readonly shader: Shader;
    private backgroundQuad: TexturedQuad2D | null = null;
    private loginBox: HTMLDivElement | null = null;
    private readonly textureUniform: WebGLUniformLocation | null;

    public constructor(error: string | null) {

        this.error = error;
        this.backgroundTexture = new Texture(background, GL.REPEAT);
        this.shader = new Shader(guiVertexShader, guiFragmentShader);
        this.textureUniform = this.shader.getUniformLocation("uTexture");

        this.setupDom();
        this.onWindowResize();
    }

    private setupDom(): void {

        this.loginBox = document.createElement("div");
        this.loginBox.className = "loginBox";

        const title = document.createElement("h1");
        title.appendChild(document.createTextNode("Login"));
        this.loginBox.appendChild(title);

        const errBox = document.createElement("div");
        errBox.className = "error";
        if (this.error) errBox.innerHTML = "Error: " + this.error;
        this.loginBox.appendChild(errBox);

        const nameLabel = document.createElement("p");
        nameLabel.appendChild(document.createTextNode("Name:"));
        this.loginBox.appendChild(nameLabel);

        const nameField = document.createElement("input");
        nameField.type = "text";
        nameField.spellcheck = false;
        nameField.onkeydown = (e): void => {
            if (e.code === "Enter") {
                playButton.click();
            }
        };
        this.loginBox.appendChild(nameField);

        const playButton = document.createElement("button");
        playButton.appendChild(document.createTextNode("Play"));
        this.loginBox.appendChild(playButton);

        document.body.appendChild(this.loginBox);

        playButton.onclick = async (): Promise<void> => {
            playButton.disabled = true;
            nameField.disabled = true;
            try {
                await game.client.login(nameField.value);
            } catch (err) {
                if (typeof err === "string") {
                    errBox.innerHTML = `Error: ${err}`;
                }
            }
            playButton.disabled = false;
            nameField.disabled = false;
        };
    }

    public delete(): void {
        if (this.loginBox) document.body.removeChild(this.loginBox);
        this.backgroundTexture.delete();
        this.shader.delete();
    }

    public render(): void {

        this.shader.bind();
        GL.uniform1i(this.textureUniform, 0);
        GL.activeTexture(GL.TEXTURE0);

        this.backgroundTexture.bind();
        this.backgroundQuad?.bind();

        GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_INT, 0);
    }

    public onWindowResize(): void {

        if (this.backgroundQuad) {
            this.backgroundQuad.unbind();
            this.backgroundQuad.delete();
        }

        this.backgroundQuad = new TexturedQuad2D(-1, -1, 2, 2, [0, 0, GL.canvas.width/64, 0, 0, GL.canvas.height/64, GL.canvas.width/64, GL.canvas.height/64]);
    }

    public update(): void {
        // do nothing
    }
}

export default HomeScene;