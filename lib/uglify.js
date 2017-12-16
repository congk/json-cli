"use strict";

const fs = require('fs');
const trace = require('./trace');

module.exports = (obj, path) => {
    fs.writeFileSync(path, JSON.stringify(obj), 'utf8');
    trace('success');
};