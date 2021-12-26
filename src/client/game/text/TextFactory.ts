import Vec3 from "../../../common/Vec3";
import Shader from "../../gl/Shader";
import textFragmentShader from "../../shaders/text.fs";
import textVertexShader from "../../shaders/text.vs";
import textBackgroundFragmentShader from "../../shaders/text_background.fs";
import textBackgroundVertexShader from "../../shaders/text_background.vs";
import Font from "./Font";
import Text from "./Text";

class TextFactory {

    public readonly font: Font;
    public readonly textShader: Shader;
    public readonly textSamplerUniform: WebGLUniformLocation | null;
    public readonly textCenterUniform: WebGLUniformLocation | null;
    public readonly textSizeUniform: WebGLUniformLocation | null;
    public readonly backgroundShader: Shader;
    public readonly backgroundCenterUniform: WebGLUniformLocation | null;

    public constructor(font: Font) {
        this.font = font;
        this.textShader = new Shader(textVertexShader, textFragmentShader);
        this.textSamplerUniform = this.textShader.getUniformLocation("uTexture");
        this.textCenterUniform = this.textShader.getUniformLocation("uCenter");
        this.textSizeUniform = this.textShader.getUniformLocation("uSize");
        this.backgroundShader = new Shader(textBackgroundVertexShader, textBackgroundFragmentShader);
        this.backgroundCenterUniform = this.backgroundShader.getUniformLocation("uCenter");
    }

    public delete(): void {
        this.textShader.delete();
        this.backgroundShader.delete();
    }

    public createText(content: string, size: number, position: Vec3): Text {
        return new Text(this, content, size, position);
    }
}

export default TextFactory;