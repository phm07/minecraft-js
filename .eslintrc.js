module.exports = {
    extends: [
        "eslint:recommended"
    ],
    env: {
        browser: true,
        node: true,
        es6: true
    },
    globals: {
        GL: true,
        game: true,
        io: true,
        server: true
    },
    parser: "babel-eslint"
};