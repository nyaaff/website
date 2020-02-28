module.exports = {
    './efforts.ejs': {
        efforts: require('./data/positions').sort(((a, b) => a.title.localeCompare(b.title)))
    }
};
