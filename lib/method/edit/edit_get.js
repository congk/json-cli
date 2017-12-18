

const trace = require('../../util/trace');
const print = require('../../util/print');

function getProperty(target, key) {
    if (target instanceof Array) {
        if (/^[0-9]+$/.test(key)) {
            const index = parseInt(key, 10);
            if (index >= target.length) {
                trace(`索引范围超出: ${index}`);
            } else {
                print(target[index]);
            }
        } else if (/^([0-9]+)(\.[0-9]+)*/.test(key)) {
            const indexes = key.split('.');
            getProperty(target[indexes.shift()], indexes.join('.'));
        } else {
            trace(`目标为数组，key值因为数字: ${key}`);
        }
    } else if (target instanceof Object) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            print(target[key]);
        } else if (/^[0-9a-zA-Z_]+(\.[0-9a-zA-Z_]+)+$/g.test(key)) {
            const keys = key.split('.');
            getProperty(target[keys.shift()], keys.join('.'));
        } else {
            trace(`目标值不存在: ${key}`);
        }
    } else {
        trace(`目标为值类型值: ${target}，key: ${key}`);
    }
}

// 取值操作
module.exports = getProperty;
