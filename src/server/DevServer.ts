import { Express } from "express";
import { webpack } from "webpack";
import * as webpackDevMiddleware from "webpack-dev-middleware";

import configFunction from "../../webpack.client.config";

class DevServer {

    public static use(app: Express): void {

        const config = configFunction(null, { mode: "development" });
        const compiler = webpack(config);

        app.use(webpackDevMiddleware(compiler, {
            publicPath: config.output?.publicPath
        }));
    }
}

export default DevServer;