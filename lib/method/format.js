

const fs = require('fs');
const trace = require('../util/trace');

module.exports = (obj, path) => {
    fs.writeFileSync(path, JSON.stringify(obj, null, '  '), 'utf8');
    trace('success!');
};
