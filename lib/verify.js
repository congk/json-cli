"use strict";

const fs = require('fs');
const trace = require('./trace');

// 验证json文件
module.exports = (path) => {
    let ret = null;
    try {
        ret = fs.readFileSync(path, 'utf8');
        JSON.parse(ret);
    } catch (err) {
        trace(err.stack);
    }
};