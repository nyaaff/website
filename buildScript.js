const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const data = require('./getData');

const srcPath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'docs');

function buildDir(dir) {
    const filesNDirs = fs.readdirSync(dir, { withFileTypes: true });
    filesNDirs.forEach((fileOrDir) => {
        if (fileOrDir.isDirectory()) {
            if (fileOrDir.name === 'public' || fileOrDir.name === 'partials') {
                return;
            }
            buildDir(path.join(dir, fileOrDir.name));
            return;
        }
        if (fileOrDir.name.match(/\.ejs$/)) {
            const from = path.join(dir, fileOrDir.name);
            const to = path.join(
                path
                    .join(dir, fileOrDir.name.replace(/\.ejs$/, '.html'))
                    .replace(srcPath, buildPath)
            );
            const html = ejs.render(
                fs.readFileSync(from).toString(),
                data[fileOrDir.name],
                { views: [srcPath] }
            );
            fs.mkdirSync(to.replace(path.basename(to), ''), {
                recursive: true,
            });
            fs.writeFileSync(to, html);
            console.log('Wrote %s to %s', from, to);
        }
    });
}

buildDir(srcPath);
console.log('Done!');
