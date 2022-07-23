import Font from "client/game/text/Font";
import Text from "client/game/text/Text";
import Shader from "client/gl/Shader";
import textFragmentShader from "client/shaders/text.fs";
import textVertexShader from "client/shaders/text.vs";
import textBackgroundFragmentShader from "client/shaders/text_background.fs";
import textBackgroundVertexShader from "client/shaders/text_background.vs";
import Vec3 from "common/math/Vec3";

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