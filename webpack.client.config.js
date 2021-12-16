const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    devtool: "source-map",
    entry: {
        index: "./src/client/app.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Game"
        })
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "client.bundle.js"
    },
    target: "web",
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
                loader: "babel-loader",
            },
            {
                test: /\.(s[ac]ss)$/i,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(png)$/i,
                use: ["url-loader"]
            },
            {
                test: /\.(fs)|(vs)|(obj)$/i,
                use: ["raw-loader"]
            },
        ]
    }
}