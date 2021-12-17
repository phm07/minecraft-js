const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = (env, argv) => ({
    mode: argv.mode,
    devtool: argv.mode === "development" ? "eval-source-map" : false,
    entry: "./src/server/app.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "server.bundle.js",
        publicPath: "/"
    },
    target: "node",
    node: {
        __dirname: false,
        __filename: false
    },
    optimization: {
        minimize: argv.mode === "production",
        minimizer: [new TerserPlugin()]
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    emitWarning: true,
                    failOnError: false,
                    failOnWarning: false
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.html$/,
                use: ["html-loader"]
            }
        ]
    }
});