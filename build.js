const fs = require("fs");
const childProcess = require("child_process");

const mode = process.argv.includes("dev") ? "development" : "production";
const configs = ["webpack.client.config.js", "webpack.server.config.js"];
const dist = __dirname + "/dist/";

(async () => {

    fs.rmdirSync(dist, { recursive: true });

    for (const config of configs) {

        const child = childProcess.exec(`webpack --mode ${mode} --config ${config}`);
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);

        await new Promise(resolve => {
            child.on("close", resolve);
        });
    }

    if(mode === "production") {
        fs.readdir(dist, (err, files) => {
            if(err) throw err;

            for(const file of files) {
                if(file.endsWith(".map")) {
                    fs.rmSync(dist + file);
                }
            }
        })
    }
})();
