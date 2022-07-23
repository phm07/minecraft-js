import TextFactory from "client/game/text/TextFactory";
import Camera from "client/gl/Camera";
import Model from "client/gl/Model";
import Quad2D from "client/models/Quad2D";
import TexturedQuad2D from "client/models/TexturedQuad2D";
import Vec2 from "common/math/Vec2";
import Vec3 from "common/math/Vec3";

class Text {

    private readonly factory: TextFactory;
    private readonly content: string;
    private readonly size: number;
    private readonly models: Model[];
    private readonly background: Model | null;
    private readonly dimensions: Vec2;

    public position: Vec3;

    public constructor(factory: TextFactory, content: string, size: number, position: Vec3) {

        this.factory = factory;
        this.content = content;
        this.size = size;
        this.position = position;
        this.dimensions = new Vec2(1);
        this.background = new Model(factory.backgroundShader, new Quad2D(-0.475, 0.2, 1, 1));
        this.models = [];
        this.generate();
    }

    public delete(): void {
        this.background?.delete();
        this.models.forEach((model) => model.delete());
    }

    public update(): void {

        this.models.forEach((model) => model.update());
        this.background?.update();
    }

    public render(camera: Camera): void {

        this.factory.backgroundShader.bind();
        GL.uniform3fv(this.factory.backgroundCenterUniform, [this.position.x, this.position.y, this.position.z]);
        this.background?.render(camera);

        this.factory.textShader.bind();
        GL.uniform1f(this.factory.textSizeUniform, this.size);
        GL.uniform1i(this.factory.textSamplerUniform, 0);
        GL.uniform3fv(this.factory.textCenterUniform, [this.position.x, this.position.y, this.position.z]);

        GL.activeTexture(GL.TEXTURE0);
        this.factory.font.texture?.bind();
        this.models.forEach((model) => model.render(camera));
    }

    private generate(): void {

        const fontData = this.factory.font.fontData;

        this.dimensions.x = Array.from(this.content).map((char) => fontData[char]?.width ?? 0).reduce((a, b) => a + b) / this.factory.font.glyphHeight;
        if (this.background) {
            this.background.scale = new Vec3((this.dimensions.x + 0.1) * this.size, (this.dimensions.y - 0.1) * this.size, 0);
        }

        let offX = this.dimensions.x * -0.5;
        for (const char of this.content) {
            const charInfo = fontData[char];
            if (!charInfo) continue;
            const { width, height, uvs: { left, right, top, bottom } } = charInfo;
            const mesh = new TexturedQuad2D(left, right, top, bottom);
            this.models.push(new Model(this.factory.textShader, mesh, new Vec3(offX, 0, 0), new Vec3(), new Vec3(width / height, 1)));
            offX += width / height;
        }
    }
}

export default Text;