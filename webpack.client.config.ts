import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";

export default (env: any, argv: {mode: string}): webpack.Configuration => ({

    mode: argv.mode === "development" ? "development" : "production",
    devtool: argv.mode === "development" ? "eval-source-map" : false,
    entry: "./src/client/App.ts",
    target: "web",
    plugins: [
        new HtmlWebpackPlugin({
            title: "Game"
        })
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "client.bundle.js",
        publicPath: "/",
        clean: true
    },
    optimization: {
        minimize: argv.mode === "production",
        minimizer: [new TerserPlugin()]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: "ts-loader"
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