import express from "express";
import http from "http";
import { Server } from "socket.io";
import GameServer from "./game_server";

const app = express();
const server = http.createServer(app);

if(process.env.NODE_ENV === "development") {
    const webpack = require("webpack");
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const configFunction = require("../../webpack.client.config");

    const config = configFunction(null, { mode: "development" });
    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }));
}

app.use(express.static(__dirname));

global.io = new Server(server);
global.server = new GameServer();

const port = process.env.PORT ?? 80;
server.listen(port, () => {
    console.log((process.env.NODE_ENV === "development" ? "Development " : "") + "Server started on port " + port);
});