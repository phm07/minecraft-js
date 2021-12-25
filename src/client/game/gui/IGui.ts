interface IGui {

    render(): void;
    update(delta: number): void;
    onWindowResize(): void;
    delete(): void;
}

export default IGui;