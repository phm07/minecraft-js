import Vec2 from "../../../common/Vec2";
import background from "../../assets/background.png";
import Model2D from "../../gl/Model2D";
import Texture from "../../gl/Texture";
import TexturedQuad2D from "../../models/TexturedQuad2D";
import HomeScene from "../../scene/HomeScene";
import GuiManager from "./GuiManager";
import IGui from "./IGui";

class HomeGui implements IGui {

    private readonly error: string;
    private readonly backgroundTexture: Texture;
    private readonly background: Model2D;
    private readonly loginBox: HTMLDivElement;

    public constructor(error: string) {

        this.error = error;
        this.backgroundTexture = new Texture(background, GL.REPEAT);

        this.background = new Model2D(GuiManager.GUI_SHADER, new TexturedQuad2D(0, 20, 0, 20));

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
                await (game.scene as HomeScene).startGame(nameField.value);
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
        this.background.delete();
    }

    public render(): void {

        GuiManager.GUI_SHADER.bind();
        GL.uniform1i(GuiManager.GUI_SAMPLER_UNIFORM, 0);
        GL.activeTexture(GL.TEXTURE0);

        this.backgroundTexture.bind();
        this.background.render();
    }

    public onWindowResize(): void {
        this.background.position = new Vec2(0, 0);
        this.background.scale = new Vec2(Math.max(GL.canvas.width, GL.canvas.height));
        this.background.update();
    }

    public update(): void {
        // do nothing
    }
}

export default HomeGui;