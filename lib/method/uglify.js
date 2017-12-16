"use strict";

const fs = require('fs');
const trace = require('../util/trace');

module.exports = (obj, path) => {
    fs.writeFileSync(path, JSON.stringify(obj), 'utf8');
    trace('success!');
};