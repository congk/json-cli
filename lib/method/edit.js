"use strict";

const readline = require('readline');
const trace = require('../util/trace');
const fs = require('fs');

module.exports = (obj, path) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `${path} > `,
    });

    rl.prompt();

    rl.on('line', online.bind(null, rl, obj, path)).on('close', () => {
        trace('bye!');
        process.exit(0);
    });
};

/**
 * @param {readline.Interface} rl
 * @param {Object|Array} source
 * @param {string} path
 * @param {string} line
 */
function online(rl, source, path, line) {
    if (line === 'save') { // 保存文件
        fs.writeFileSync(path, JSON.stringify(source, null, '  '), 'utf8');
        rl.close();
    } else if (line.substr(0, 4) === 'del ') {
        // 删除键值
        trace(`删除键值: ${line.replace('/del\s+/', '')}`);
    } else {
        // 赋值
        trace(`content => ${line}`);
    }
    rl.prompt();
}