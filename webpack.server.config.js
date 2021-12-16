const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: {
        server: "./src/server/app.js"
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "server.bundle.js"
    },
    target: "node",
    node: {
        __dirname: false,
        __filename: false
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
};