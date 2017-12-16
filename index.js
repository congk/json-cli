"use strict";

const fs = require('fs');
const program = require('commander');
const inquirer = require('inquirer');

program
    .version('1.0.0')
    .usage('[options] <path>')
    .option('-v, --verify <path>', '验证json文件格式是否正确')
    .option('-e, --edit <path>', '编辑json文件，若文件不存在则在指定路径下新建')
    .option('-d, --delete <path>', '删除json文件');

program.parse(process.argv);

if (program.verify) {
    console.log(`验证文件：${program.verify}`);
} else if (program.edit) {
    console.log(`编辑文件: ${program.edit}`);
} else if (program.delete) {
    console.log(`删除文件: ${program.delete}`);
} else {
    program.outputHelp();
}
