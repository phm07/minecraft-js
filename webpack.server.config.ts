import path from "path";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import nodeExternals from "webpack-node-externals";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";

export default (env: any, argv: {mode: string}): webpack.Configuration => ({

    mode: argv.mode === "development" ? "development" : "production",
    devtool: argv.mode === "development" ? "eval-source-map" : false,
    entry: argv.mode === "development" ? "./src/server/DevApp.ts" : "./src/server/App.ts",
    target: "node",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "server.bundle.js",
        publicPath: "/"
    },
    node: {
        __dirname: false,
        __filename: false
    },
    optimization: {
        minimize: argv.mode === "production",
        minimizer: [new TerserPlugin()]
    },
    externalsPresets: {
        node: true,
    },
    externals: [nodeExternals({
        allowlist: "@spissvinkel/simplex-noise"
    })],
    resolve: {
        extensions: [".ts", ".js"],
        plugins: [new TsconfigPathsPlugin()]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ["ts-loader"]
            },
            {
                test: /\.html$/,
                use: ["html-loader"]
            }
        ]
    }
});