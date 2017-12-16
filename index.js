"use strict";

const fs = require('fs');
const program = require('commander');
const inquirer = require('inquirer');

if (process.argv.length === 2) {
    process.argv.push('-h');
}

program.version('1.0.0')
    .usage('<path> 编辑json文件')
    .action(edit);

// 编辑json文件，若不存在，则新建一个json文件
// program.command('edit <path>')
//     .description('编辑json文件')
//     .action(edit);

// 验证
program.command('verify <path>')
    .description('验证json文件格式是否有效')
    .action(verify);

function verify(path) {
    console.log(`verify: ${path}`);
}
function edit(path) {
    onsole.log(`edit: ${path}`);
}

program.parse(process.argv);