import Humanoid from "../models/humanoid";

class Human {

    constructor(id, shader, texture, position) {
        this.id = id;
        this.position = position;
        this.model = new Humanoid(shader, texture, position);
    }

    setPosition(position) {
        this.model.position = position;
    }

    delete() {
        this.model.delete();
    }

    render() {
        this.model.render();
    }

    update(delta) {
        this.model.update(delta);
    }
}

export default Human;