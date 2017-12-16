"use strict";

const fs = require('fs');
const command = module.exports;
const trace = require('../util/trace');

function parse(rl, method) {
    const { param } = rl;
    const { source, target, path } = param;
    return method(source, target, path);
}

function saveFile(path, target) {
    fs.writeFileSync(path, JSON.stringify(target, null, '  '), 'utf8');
}

function define(desc, handle) {
    return { desc, handle };
}
const handles = [
    define('放弃修改并退出: -q', (rl) => (line) => {
        if (line.replace(/\s+/g, '') === '-q') {
            rl.close();
            return true;
        }
    }),
    define('保存修改: -s', (rl) => parse(rl, (source, target, path) => (line) => {
        if (line.replace(/\s+/g, '') === '-s') {
            saveFile(path, target);
            rl.param.source = target;
            rl.param.target = target instanceof Array ? [] : {};
            rl.prompt();
            return true;
        }
    })),
    define('保存修改并退出: -wq', (rl) => parse(rl, (source, target, path) => (line) => {
        if (line.replace(/\s+/g, '') === '-wq') {
            saveFile(path, target);
            rl.close();
            return true;
        }
    })),
    // todo 删除指定键
    define('删除指定键: -d key', (rl) => parse(rl, (source, target, path) => (line) => {
        if (line.match(/^(-d\s+)/g)) {
            return true;
        }
    })),
    define('清空json文件，只保留root节点: -flush', (rl) => parse(rl, (source, target, path) => (line) => {
        if (line.replace(/\s+/g, '') === '-flush') {
            rl.param.target = target instanceof Array ? [] : {};
            rl.prompt();
            return true;
        }
    })),
    define('恢复到文件打开时的状态: -clear', (rl) => parse(rl, (source, target, path) => (line) => {
        if (line.replace(/\s+/g, '') === '-clear') {
            rl.param.target = JSON.parse(JSON.stringify(source));
            rl.prompt();
            return true;
        }
    })),
    define('查看帮助说明: -h', (rl) => parse(rl, (source, target, path) => (line) => {
        if (line.replace(/\s+/g, '') === '-h') {
            trace(rl.param.helpStr);
            rl.prompt();
            return true;
        }
    })),
];

command.define = rl => handles.map(item => Object.assign(item, { handle: item.handle(rl) }));
