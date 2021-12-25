import Vec2 from "../../../common/Vec2";
import Vec3 from "../../../common/Vec3";
import Model from "../../gl/Model";
import Shader from "../../gl/Shader";
import Quad2D from "../../models/Quad2D";
import TexturedQuad2D from "../../models/TexturedQuad2D";
import textFragmentShader from "../../shaders/text.fs";
import textVertexShader from "../../shaders/text.vs";
import textBackgroundFragmentShader from "../../shaders/text_background.fs";
import textBackgroundVertexShader from "../../shaders/text_background.vs";
import Font from "./Font";

class Text {

    declare private static TEXT_SHADER: Shader;
    declare private static TEXT_SAMPLER_UNIFORM: WebGLUniformLocation | null;
    declare private static TEXT_CENTER_UNIFORM: WebGLUniformLocation | null;
    declare private static TEXT_SIZE_UNIFORM: WebGLUniformLocation | null;
    declare private static BACKGROUND_SHADER: Shader;
    declare private static BACKGROUND_CENTER_UNIFORM: WebGLUniformLocation | null;

    private readonly content: string;
    private readonly font: Font;
    private readonly size: number;
    private readonly models: Model[];
    private readonly background: Model | null;
    private readonly dimensions: Vec2;

    public position: Vec3;

    public constructor(content: string, font: Font, size: number, position: Vec3) {

        this.content = content;
        this.font = font;
        this.size = size;
        this.position = position;
        this.dimensions = new Vec2(1);
        this.background = new Model(Text.BACKGROUND_SHADER, null, new Quad2D(-0.475, 0.2, 1, 1));

        this.models = [];

        void this.generate();
    }

    public static init(): void {
        if (!Text.TEXT_SHADER) {
            Text.TEXT_SHADER = new Shader(textVertexShader, textFragmentShader);
            Text.TEXT_SAMPLER_UNIFORM = Text.TEXT_SHADER.getUniformLocation("uTexture");
            Text.TEXT_CENTER_UNIFORM = Text.TEXT_SHADER.getUniformLocation("uCenter");
            Text.TEXT_SIZE_UNIFORM = Text.TEXT_SHADER.getUniformLocation("uSize");
        }
        if (!Text.BACKGROUND_SHADER) {
            Text.BACKGROUND_SHADER = new Shader(textBackgroundVertexShader, textBackgroundFragmentShader);
            Text.BACKGROUND_CENTER_UNIFORM = Text.BACKGROUND_SHADER.getUniformLocation("uCenter");
        }
    }

    public update(): void {

        this.models?.forEach(model => model.update());
        this.background?.update();

    }

    public render(): void {

        Text.BACKGROUND_SHADER.bind();
        GL.uniform3fv(Text.BACKGROUND_CENTER_UNIFORM, [this.position.x, this.position.y, this.position.z]);
        this.background?.render();

        Text.TEXT_SHADER.bind();
        GL.uniform1f(Text.TEXT_SIZE_UNIFORM, this.size);
        GL.uniform1i(Text.TEXT_SAMPLER_UNIFORM, 0);
        GL.uniform3fv(Text.TEXT_CENTER_UNIFORM, [this.position.x, this.position.y, this.position.z]);

        GL.activeTexture(GL.TEXTURE0);
        this.font.texture?.bind();
        this.models?.forEach(model => model.render());
    }

    private async generate(): Promise<void> {

        const fontData = await this.font.getFontData();

        this.dimensions.x = [...this.content].map(char => fontData[char]?.width ?? 0).reduce((a, b) => a + b) / this.font.glyphHeight;
        if (this.background) {
            this.background.scale = new Vec3((this.dimensions.x + 0.1) * this.size, (this.dimensions.y - 0.1) * this.size, 0);
        }

        let offX = this.dimensions.x * -0.5;
        for (const char of this.content) {
            const charInfo = fontData[char];
            if (!charInfo) continue;
            const { width, height, uvs: { left, right, top, bottom } } = charInfo;
            const mesh = new TexturedQuad2D(left, right, top, bottom);
            this.models.push(new Model(Text.TEXT_SHADER, null, mesh, new Vec3(offX, 0, 0), new Vec3(), new Vec3(width / height, 1)));
            offX += width / height;
        }
    }
}

export default Text;