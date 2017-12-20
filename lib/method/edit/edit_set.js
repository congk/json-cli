const trace = require('../../util/trace');
// const print = require('../../util/print');

// todo 赋值操作
module.exports.setProperty = (target, line) => {
    trace('setProperty ====> ');
    trace(`target => ${JSON.stringify(target)}`);
    trace(`line => ${line}`);

    // 清理'='|'=='两边的空字符
    // const keys = line.replace(/=.*/, '').split(/\s+/);
    // const
    // 解析line
    // const [keys, value] = line.split(/(?<=\w|\s)={1,2}/g);
};

// todo 拷贝值
module.exports.cpProperty = (target, line) => {
    trace('cpProperty ===> ');
    trace(`target => ${JSON.stringify(target)}`);
    trace(`line => ${line}`);
};
