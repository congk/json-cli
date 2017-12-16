"use strict";

const program = require('commander');
const methods = ['verify', 'format', 'uglify', 'edit'];
const trace = require('./lib/util/trace');
const fs = require('fs');

program
    .version('1.0.0')
    .usage('[options] <path>')
    .option('-v, --verify <path>', '验证json文件格式是否正确')
    .option('-e, --edit <path>', '编辑json文件，若文件不存在则在指定路径下新建')
    .option('-f, --format <path>', '格式化json文件并保存')
    .option('-u, --uglify <path>', '压缩json文件并保存');

program.parse(process.argv);

const done = methods.some((method) => {
    const path = program[method];
    if (!path) {
        return false;
    }
    const exits = fs.existsSync(path);
    if (!exits && method !== 'edit') {
        trace(`No such file on the path: ${path}`);
        return true;
    }
    let content = exits ? fs.readFileSync(path, 'utf8') : "{}";
    try {
        content = JSON.parse(content);
        require(`./lib/method/${method}`)(content, path);
        trace('success');
    } catch (err) {
        trace(err);
    }
    return true;
});

if (!done) {
    program.outputHelp();
}
