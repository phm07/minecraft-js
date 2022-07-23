import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import backgroundImg from "src/client/assets/background.png";
import GuiManager from "src/client/game/gui/GuiManager";
import IGui from "src/client/game/gui/IGui";
import LoginBox from "src/client/game/gui/jsx/LoginBox";
import Model2D from "src/client/gl/Model2D";
import Texture from "src/client/gl/Texture";
import TexturedQuad2D from "src/client/models/TexturedQuad2D";
import Vec2 from "src/common/math/Vec2";

class HomeGui implements IGui {

    private readonly manager: GuiManager;
    private readonly error: string;
    private readonly backgroundTexture: Texture;
    private readonly background: Model2D;
    private readonly loginBox: HTMLDivElement;
    private readonly reactDomRoot: Root;

    public constructor(manager: GuiManager, { error }: { error: string }) {

        this.manager = manager;
        this.error = error;
        this.backgroundTexture = new Texture(backgroundImg, GL.REPEAT);
        this.background = new Model2D(manager.shader, new TexturedQuad2D(0, 20, 0, 20));

        this.loginBox = document.createElement("div");
        document.body.appendChild(this.loginBox);

        this.reactDomRoot = createRoot(this.loginBox);
        this.reactDomRoot.render(createElement(LoginBox));
    }

    public delete(): void {
        this.reactDomRoot.unmount();
        document.body.removeChild(this.loginBox);
        this.backgroundTexture.delete();
        this.background.delete();
    }

    public render(): void {

        GL.enable(GL.BLEND);

        this.manager.shader.bind();
        GL.uniform1i(this.manager.samplerUniform, 0);
        GL.activeTexture(GL.TEXTURE0);

        this.backgroundTexture.bind();
        this.background.render();

        GL.disable(GL.BLEND);
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