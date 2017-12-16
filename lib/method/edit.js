"use strict";

const readline = require('readline');
const trace = require('../util/trace');
const fs = require('fs');
const command = require('./edit_command');

/**
 * @param {readline.Interface} rl
 * @param {string} line
 */
function online(rl, line) {
    const param = rl.param;
    const { source, target, path, commands } = param;
    // 查看是否是特殊命令
    const isDone = commands.some((command) => command.handle(line));
    if (!isDone) {
        // 编辑
        trace(`赋值操作 => ${line}`);
        rl.prompt();
    }
}

module.exports = (obj, path) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `${path} > `,
    });

    rl.param = {
        source: obj,
        target: JSON.parse(JSON.stringify(obj)),
        path,
    };
    const commands = rl.param.commands = command.define(rl);
    rl.param.helpStr = `
    特殊命令使用说明: 
        ${commands.map((item, i) => `${i + 1}. ${item.desc}`).join('\n\t')}
        
    赋值方法说明：
        1. 普通赋值: key = value
        2. 拷贝某键的值: key1 == key2
        3. 多个键赋值: key1, key2 = value1[, value2]，右值数量必须为1个或与左值数量相同
    
    key的表示及使用方法说明：
        1. 对多个键同时进行操作时，需使用','来分隔，如
            - 删除多个键：-d k1, k2, k3
            - 对多个键赋值(左右值数量相同)：k1, k2, k3 = v1, v2, v3
            - 对多个键赋值(右值数量为1)：k1, k2, k3 = value
            - 对多个键赋值(拷贝k3的值)：k1, k2 == k3
        2. 使用'.'表示父子级关系，如：k1.k2 = 123
        3. 以上两种表示方法可以结合使用，如：k1, k2.k3 == k3.k4, k5.k6.k7
    
    value类型表示方法示例
        'abc'：表示值为字符串abc
        []：表示值为数组
        {}: 表示值为Object对象
        123: 表示值为数字123
        true|false: 表示bool值
        null: 表示null值
        不支持undefined、NaN
    `;

    rl.on('line', online.bind(null, rl)).on('close', () => {
        trace('bye!');
        process.exit(0);
    });

    rl.prompt();
};