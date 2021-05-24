const express = require('express');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const app = express();
const port = 3000;

const getData = require('./getData');

const dataPromise = getData();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src'));
app.use(express.static(path.join(__dirname, 'src')));

app.get('*', async (req, res, next) => {
    let reqPath = req.path;
    if (reqPath === '/') {
        reqPath = '/index.html';
    }
    if (!reqPath.match(/\.html$/)) {
        next();
        return;
    }
    const fileName = reqPath.replace(/\.html$/, '.ejs');
    const filePath = path.resolve(path.join(__dirname, 'src', fileName));
    const html = ejs.render(
        fs.readFileSync(filePath).toString(),
        (await dataPromise)[fileName.substring(1)],
        { views: [path.join(__dirname, 'src')] }
    );
    res.end(html);
});

app.listen(port, () => console.log(`Dev app listening on port ${port}!`));
