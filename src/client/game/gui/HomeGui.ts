import backgroundImg from "src/client/assets/background.png";
import logoImg from "src/client/assets/logo.png";
import GuiManager from "src/client/game/gui/GuiManager";
import IGui from "src/client/game/gui/IGui";
import Model2D from "src/client/gl/Model2D";
import Texture from "src/client/gl/Texture";
import TexturedQuad2D from "src/client/models/TexturedQuad2D";
import HomeScene from "src/client/scene/HomeScene";
import Vec2 from "src/common/math/Vec2";

class HomeGui implements IGui {

    private readonly manager: GuiManager;
    private readonly error: string;
    private readonly backgroundTexture: Texture;
    private readonly background: Model2D;
    private readonly logoTexture: Texture;
    private readonly logo: Model2D;
    private readonly loginBox: HTMLDivElement;

    public constructor(manager: GuiManager, { error }: { error: string }) {

        this.manager = manager;
        this.error = error;
        this.backgroundTexture = new Texture(backgroundImg, GL.REPEAT);
        this.background = new Model2D(manager.shader, new TexturedQuad2D(0, 20, 0, 20));
        this.logoTexture = new Texture(logoImg);
        this.logo = new Model2D(manager.shader, new TexturedQuad2D(0, 1, 0, 1));

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
        document.body.removeChild(this.loginBox);
        this.backgroundTexture.delete();
        this.background.delete();
        this.logoTexture.delete();
        this.logo.delete();
    }

    public render(): void {

        GL.enable(GL.BLEND);

        this.manager.shader.bind();
        GL.uniform1i(this.manager.samplerUniform, 0);
        GL.activeTexture(GL.TEXTURE0);

        this.backgroundTexture.bind();
        this.background.render();

        this.logoTexture.bind();

        this.logo.render();
        GL.disable(GL.BLEND);
    }

    public onWindowResize(): void {
        this.background.position = new Vec2(0, 0);
        this.background.scale = new Vec2(Math.max(GL.canvas.width, GL.canvas.height));
        this.background.update();

        this.logo.scale = new Vec2(GL.canvas.width / 4, GL.canvas.width / 4 * 78 / 466);
        this.logo.position = new Vec2(GL.canvas.width / 2 - this.logo.scale.x / 2, GL.canvas.height * 3 / 4 - this.logo.scale.y / 2);
        this.logo.update();
    }

    public update(): void {
        // do nothing
    }
}

export default HomeGui;