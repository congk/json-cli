"use strict";

const readline = require('readline');
const trace = require('../util/trace');
const fs = require('fs');

// todo 编辑
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
 * @param {string} content
 */
function online(rl, source, path, content) {
    if (content === 'save') { // 保存文件
        fs.writeFileSync(path, JSON.stringify(source, null, '  '), 'utf8');
        rl.close();
    } else if (content.substr(0, 4) === 'del ') {
        // 删除键值
        trace(`删除键值: ${content.replace('/del\s+/', '')}`);
    } else {
        // 赋值
        trace(`content => ${content}`);
    }
    rl.prompt();
}