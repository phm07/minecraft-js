import ESLintWebpackPlugin from "eslint-webpack-plugin";
import path from "path";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import nodeExternals from "webpack-node-externals";

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
    plugins: [
        new ESLintWebpackPlugin({ extensions: ["ts"], fix: true })
    ],
    externalsPresets: {
        node: true,
    },
    externals: [nodeExternals({
        allowlist: "@spissvinkel/simplex-noise"
    })],
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