"use strict";

const fs = require('fs');

module.exports = (obj, path) => {
    fs.writeFileSync(path, JSON.stringify(obj, null, "\t"), 'utf8');
};
