import TexturedQuad2D from "../models/textured_quad_2d";
import Texture from "../gl/texture";
import background from "../assets/background.png"
import "../styles/home_scene.scss"
import Shader from "../gl/shader";
import guiVertexShader from "../shaders/gui.vs";
import guiFragmentShader from "../shaders/gui.fs";

class HomeScene {

    constructor(error) {

        this.error = error;
        this.backgroundTexture = new Texture(background, GL.REPEAT);
        this.shader = new Shader(guiVertexShader, guiFragmentShader);
        this.textureUniform = this.shader.getUniform("uTexture", "1i");

        this.#setupDom();
    }

    #setupDom() {

        this.loginBox = document.createElement("div");
        this.loginBox.className = "loginBox";

        const title = document.createElement("h1");
        title.appendChild(document.createTextNode("Login"));
        this.loginBox.appendChild(title);

        const errBox = document.createElement("div");
        errBox.className = "error";
        if(this.error) errBox.innerHTML = "Error: " + this.error;
        this.loginBox.appendChild(errBox);

        const nameLabel = document.createElement("p");
        nameLabel.appendChild(document.createTextNode("Name:"));
        this.loginBox.appendChild(nameLabel);

        const nameField = document.createElement("input");
        nameField.type = "text";
        nameField.spellcheck = false;
        nameField.onkeypress = e => {
            if(e.code === "Enter") {
                playButton.click();
            }
        }
        this.loginBox.appendChild(nameField);

        const playButton = document.createElement("button");
        playButton.appendChild(document.createTextNode("Play"));
        this.loginBox.appendChild(playButton);

        document.body.appendChild(this.loginBox);

        playButton.onclick = async () => {
            playButton.disabled = true;
            nameField.disabled = true;
            try {
                await game.client.login(nameField.value);
            } catch (err) {
                errBox.innerHTML = "Error: " + err;
            }
            playButton.disabled = false;
            nameField.disabled = false;
        }
    }

    delete() {
        document.body.removeChild(this.loginBox);
        this.backgroundTexture.delete();
        this.shader.delete();
    }

    update() {
    }

    render() {

        this.shader.bind();
        this.textureUniform.set(0);
        GL.activeTexture(GL.TEXTURE0);

        this.backgroundTexture.bind();
        this.backgroundQuad.bind();

        GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_INT, 0);
    }

    onWindowResize() {

        if(this.backgroundQuad) {
            this.backgroundQuad.unbind();
            this.backgroundQuad.delete();
        }

        this.backgroundQuad = new TexturedQuad2D(-1, -1, 2, 2, [0, 0, GL.canvas.width/64, 0, 0, GL.canvas.height/64, GL.canvas.width/64, GL.canvas.height/64]);
    }
}

export default HomeScene;