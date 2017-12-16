"use strict";

const program = require('commander');
const methods = ['verify', 'format', 'uglify', 'edit', 'make'];
const trace = require('./lib/util/trace');
const fs = require('fs');

program
    .version('1.0.0')
    .usage('[options] <path>')
    .option('-v, --verify <path>', '验证json文件格式是否正确')
    .option('-m --make <path>', '生成json文件')
    .option('-t, --type [rootType]', '指定生成json文件的根节点类型，可用类型包括\'obj\'或\'arr\'', 'obj')
    .option('-e, --edit <path>', '编辑json文件')
    .option('-f, --format <path>', '格式化json文件并保存')
    .option('-u, --uglify <path>', '压缩json文件并保存');


program.parse(process.argv);

const done = methods.some((method) => {
    const path = program[method];
    if (!path) {
        return false;
    }
    const exits = fs.existsSync(path);
    const isMake = method === 'make';

    if (!exits && !isMake) {
        trace(`No such file on the path: ${path}`);
    } else if (exits && isMake) {
        trace(`File exists on the path: ${path}`);
    } else if (isMake) {
        trace(`make file type: ${program.type}`);
    } else {
        try {
            require(`./lib/method/${method}`)(JSON.parse(fs.readFileSync(path, 'utf8')), path);
        } catch (err) {
            trace(err);
        }
    }
    return true;
});
if (!done) {
    program.outputHelp();
}