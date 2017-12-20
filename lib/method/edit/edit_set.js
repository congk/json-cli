const trace = require('../../util/trace');
const print = require('../../util/print');

// todo 赋值操作
module.exports.setProperty = (target, line) => {
    trace('setProperty ====> ');
    const keys = line.replace(/(\s*=.*)|(^\s*)/g, '').split(/\s+/);
    const valueSource = line.replace(/(\s*\w+(\.\w+)*(\s+\w+(\.\w)*)*\s*=\s*)|(\s*$)/g, '');

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
    const error = keys.filter(key => !setHandle(target, key, value));
    print(target);
    trace(`赋值失败的key：${JSON.stringify(error)}`);
};

function setHandle(target, key, value) {
    // todo 如果key是组合键，如a.b，则需先确定target.a是否存在，若不存在不能赋值
    // todo 如果target是数组，则key必须是数字
    // todo 如果target是Object，则key
    // const keys = key.split('.');
    // 如果是引用类型值，需要深复制，避免json序列化时的重复引用错误
    target[key] = value instanceof Object ? JSON.parse(JSON.stringify(value)) : value;;
    return false;
}

// todo 拷贝值
module.exports.cpProperty = (target, line) => {
    trace('cpProperty ===> ');
    trace(`target => ${JSON.stringify(target)}`);
    trace(`line => ${line}`);
};
