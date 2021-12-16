import "./styles/app.scss"
import Game from "./game";

window.onload = () => {

    const canvas = document.createElement("canvas");
    canvas.appendChild(document.createTextNode("Please enable JavaScript for this app to work"));

    document.body.appendChild(canvas);

    window.GL = canvas.getContext("webgl2", {antialias: true});
    if(!GL) {
        alert("No WebGL2 support");
        return;
    }

    window.game = new Game();

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.onWindowResize();
    }
    window.addEventListener("resize", () => {
        resize();
    });
    resize();

    let last = window.performance.now();
    const loop = () => {
        const now = window.performance.now();
        const delta = (now - last) / 1000;
        last = now;
        game.update(delta);
        game.render();
        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
}