interface IScene {

    delete(): void;
    onWindowResize(): void;
    update(delta: number): void;
    render(): void;
}

export default IScene;