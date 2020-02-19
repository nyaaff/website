const express = require('express');
const path = require('path');

const app = express();
const port = 3000;


const Generator = require('ejs2static');

const gen = new Generator({
    sourceDir: './src',
    outputDir: './dist',
    copyAll: true,
    data: require('./getData')
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src'));
app.use(express.static(path.join(__dirname, 'src')));

app.get('*', function (req, res, next) {
    if (!req.path.match(/\.html$/)) {
        return next();
    }
    const filePath = path.resolve(path.join(__dirname, 'src', req.path.replace(/\.html$/, '.ejs')));
    const data = gen.getData(filePath);
    const view = filePath.replace(gen.sourceDir, '').replace(/\.ejs$/, '').substring(1);
    res.render(view, data)
});

app.listen(port, () => console.log(`Dev app listening on port ${port}!`));
