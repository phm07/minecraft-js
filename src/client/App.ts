import "./styles/app.scss";

import Game from "./Game";

window.onload = (): void => {

    const canvas = document.createElement("canvas");
    canvas.appendChild(document.createTextNode("Please enable JavaScript for this app to work"));

    document.body.appendChild(canvas);

    const webGL = canvas.getContext("webgl2", { antialias: true });
    if (!webGL) {
        alert("No WebGL2 support");
        return;
    } else {
        window.GL = webGL;
    }

    window.game = new Game();

    const resize = (): void => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.onWindowResize();
    };

    window.addEventListener("resize", (): void => {
        resize();
    });
    resize();

    let last = window.performance.now();
    const loop = (): void => {
        const now = window.performance.now();
        const delta = (now - last) / 1000;
        last = now;
        game.update(delta);
        game.render();
        window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
};