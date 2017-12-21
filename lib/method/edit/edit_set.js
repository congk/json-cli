const trace = require('../../util/trace');
const print = require('../../util/print');
const getProperty = require('./edit_get');

// 赋值操作
module.exports.setProperty = (target, line) => {
    // trace('setProperty ====> ');
    const keys = line.replace(/(\s*=.*)|(^\s*)/g, '').split(/\s+/);
    const valueSource = line.replace(/(\s*\w+(\.\w+)*(\s+\w+(\.\w)*)*\s*=\s*)|(\s*$)/g, '');

    let value = null;
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
    }
    handle(target, keys, value);
};

function handle(target, keys, value) {
    const error = keys.filter(key => !setHandle(target, key, value));
    print(target);
    if (error.length) {
        trace(`>>> error：${JSON.stringify(error)}`);
    }
}

/**
 * 赋值操作，成功返回true，失败返回false
 * @param target
 * @param key
 * @param value
 * @return {boolean}
 */
function setHandle(target, key, value) {
    // 如果是引用类型值，需要深复制，避免json序列化时的重复引用错误
    const tempValue = value instanceof Object ? JSON.parse(JSON.stringify(value)) : value;
    // todo 如果key是组合键，如a.b.c，则需先确定target.a.b存在且非值类型数据
    const keys = key.split('.');
    if (keys.length === 1) {
        target[key] = tempValue;
        return result(key);
    }
    const { err, value: tempTarget } = getProperty(target, keys.slice(0, -1).join('.'));
    if (err || !(tempTarget instanceof Object)) {
        return result(key, false);
    }
    tempTarget[keys.pop()] = tempValue;
    return result(key);
}

function result(key, isDone = true) {
    trace(`setHandle ====> key: ${key}, ${isDone ? 'done!' : 'error!'}`);
    return isDone;
}

// 拷贝值
module.exports.cpProperty = (target, line) => {
    const keys = line.replace(/(\s*==.*$)|(^\s*)/g, '').split(/\s+/);
    const pointer = line.replace(/(\s*$)|(^.*==\s*)/g, '');
    // 查找pointer指向的值
    const { err, value } = getProperty(target, pointer);
    if (err) {
        trace(err);
        return;
    }
    handle(target, keys, value);
};
