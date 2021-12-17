const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => ({
    mode: argv.mode,
    devtool: argv.mode === "development" ? "eval-source-map" : false,
    entry: "./src/client/app.js",
    plugins: [
        new HtmlWebpackPlugin({
            title: "Game"
        })
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "client.bundle" + (argv.mode === "production" ? ".min" : "") + ".js",
        publicPath: "/",
        clean: true
    },
    optimization: {
        minimize: argv.mode === "production",
        minimizer: [new TerserPlugin()]
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
                loader: "babel-loader"
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
            }
        ]
    }
});