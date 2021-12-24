import express from "express";
import http from "http";
import { Server } from "socket.io";
import { webpack } from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";

import configFunction from "../../webpack.client.config";
import GameServer from "./GameServer";

const app = express();
const httpServer = http.createServer(app);

const config = configFunction(null, { mode: "development" });
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output?.publicPath
}));

app.use(express.static(__dirname));

global.io = new Server(httpServer);
global.server = new GameServer();

const port = process.env.PORT ?? 80;
httpServer.listen(port, () => {
    console.log(`Development Server started on port ${port}`);
});