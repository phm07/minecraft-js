import Humanoid from "../models/Humanoid";
import PlayerPosition from "../../common/PlayerPosition";
import Shader from "../gl/Shader";
import Texture from "../gl/Texture";

class Human {

    public readonly id: number;
    private readonly position: PlayerPosition;
    private readonly model: Humanoid;

    public constructor(id: number, shader: Shader, texture: Texture, position: PlayerPosition) {
        this.id = id;
        this.position = position;
        this.model = new Humanoid(shader, texture, position);
    }

    public setPosition(position: PlayerPosition): void {
        this.model.position = position;
    }

    public delete(): void {
        this.model.delete();
    }

    public render(): void {
        this.model.render();
    }

    public update(): void {
        this.model.update();
    }
}

export default Human;