const express = require('express');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const app = express();
const port = 3000;

const data = require('./getData');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src'));
app.use(express.static(path.join(__dirname, 'src')));

app.get('*', (req, res, next) => {
    if (!req.path.match(/\.html$/)) {
        next();
        return;
    }
    const fileName = req.path.replace(/\.html$/, '.ejs');
    const filePath = path.resolve(path.join(__dirname, 'src', fileName));
    const html = ejs.render(
        fs.readFileSync(filePath).toString(),
        data[fileName.substring(1)],
        { views: [path.join(__dirname, 'src')] }
    );
    res.end(html);
});

app.listen(port, () => console.log(`Dev app listening on port ${port}!`));
