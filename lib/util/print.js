"use strict";

const trace = require('./trace');

module.exports = (...args) => {
    trace(...args.map(arg => arg instanceof Object ? JSON.stringify(arg, null, '  ') : arg));
};
