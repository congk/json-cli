const trace = require('../../util/trace');
const print = require('../../util/print');

// todo 赋值操作
module.exports.setProperty = (target, line) => {
    trace('setProperty ====> ');
    const keys = line.replace(/\s*=.*/, '').replace(/(^\s*)|(\s*$)/g, '').split(/\s+/);
    const valueSource = line.replace(/\s*\w+(\.\w+)*(\s+\w+(\.\w)*)*\s*=\s*/, '').replace(/(^\s*)|(\s*$)/g, '');

    let value;
    if (valueSource === '{}') {
        value = {};
    } else if (valueSource === '[]') {
        value = [];
    } else if (valueSource === 'null') {
        value = null;
    } else if (valueSource === 'true') {
        value = true;
    } else if (valueSource === 'false') {
        value = false;
    } else if (/^'.*'$/.test(valueSource)) {
        value = valueSource.replace(/(^')|('$)/g, '');
    } else if (/-?\d+\.?\d*/.test(valueSource)) {
        value = parseFloat(valueSource);
    } else {
        trace(`未知的值: ${valueSource}`);
        return;
    }

    keys.forEach((key) => {
        // todo 如果key是组合键，如a.b，则需先确定target.a是否存在，若不存在不能赋值
        // todo 如果target是数组，则key必须是数字
        // todo 如果target是Object，则key
        target[key] = value;
    });
    print(target);
};


// todo 拷贝值
module.exports.cpProperty = (target, line) => {
    trace('cpProperty ===> ');
    trace(`target => ${JSON.stringify(target)}`);
    trace(`line => ${line}`);
};
