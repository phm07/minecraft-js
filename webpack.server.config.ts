const ESLintWebpackPlugin = require("eslint-webpack-plugin");
import * as nodeExternals from "webpack-node-externals";
import * as path from "path";
import * as TerserPlugin from "terser-webpack-plugin";
import * as webpack from "webpack";

export default (env: any, argv: {mode: string}): webpack.Configuration => ({

    mode: argv.mode === "development" ? "development" : "production",
    devtool: argv.mode === "development" ? "eval-source-map" : false,
    entry: "./src/server/App.ts",
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
    plugins: [
        new ESLintWebpackPlugin({ extensions: ["ts"] })
    ],
    externals: [nodeExternals()],
    externalsPresets: {
        node: true,
    },
    resolve: {
        extensions: [".ts", ".js"]
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