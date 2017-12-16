"use strict";

const program = require('commander');
const child_process = require('child_process');
const trace = require('./lib/trace');

program
    .version('1.0.0')
    .usage('[options] <path>')
    .option('-v, --verify <path>', '验证json文件格式是否正确')
    .option('-e, --edit <path>', '编辑json文件，若文件不存在则在指定路径下新建')
    .option('-d, --delete <path>', '删除json文件');

program.parse(process.argv);

if (program.verify) {
    trace(`验证文件：${program.verify}`);
    require('./lib/verify')(program.verify);
} else if (program.edit) {
    trace(`编辑文件: ${program.edit}`);
} else if (program.delete) {
    trace(`删除文件: ${program.delete}`);
} else {
    program.outputHelp();
}
