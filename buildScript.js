const Generator = require('ejs2static');

const gen = new Generator({
    sourceDir: './src',
    outputDir: './dist',
    copyAll: true,
    data: require('./getData')
});

gen.generate().then(_ => console.log("Done!"));
