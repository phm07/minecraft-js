import http from "http";
import * as express from "express";
import { Server } from "socket.io";
import { webpack } from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";

import configFunction from "@root/webpack.client.config";
import GameServer from "server/GameServer";

const app = express.default();
const httpServer = http.createServer(app);

const config = configFunction(null, { mode: "development" });
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output?.publicPath
}));

global.io = new Server(httpServer);
global.server = new GameServer();

const port = process.env.PORT ?? 80;
httpServer.listen(port, () => {
    console.log(`Development Server started on port ${port}`);
});