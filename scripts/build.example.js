const fs = require("fs");
const path = require("path");
const sass = require("node-sass");
const packageImporter = require('node-sass-package-importer');

function renderSass(basedir) {
    fs.readdir(basedir, (err, files) => {
        if (err) throw err;

        files.forEach((f) => {
            const filePath = path.join(basedir, f);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) renderSass(filePath);

            if (stat.isFile() && filePath.match(/\.scss$/)) {
                const outFile = filePath.replace(/\.scss$/, ".css");

                sass.render({
                    file: filePath,
                    outputStyle: "expanded",
                    outFile: outFile,
                    indentWidth: 4,
                    sourceMapEmbed: true,
                    importer: packageImporter()
                }, (err, result) => {
                    if (err) throw err;
                    fs.writeFile(outFile, result.css);
                });
            }
        });
    });
}

const targets = [
    "example"
];

targets.forEach((t) => {
    renderSass(t);
});