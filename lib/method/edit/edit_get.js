/**
 * @param target
 * @param key
 * @return {{err: *, value: *}}
 */
function getProperty(target, key) {
    if (!(target instanceof Object)) {
        return result(`目标为值类型数据 ${target}，其不存在键 ${key}`);
    }
    if (Object.prototype.hasOwnProperty.call(target, key)) {
        return result(null, target[key]);
    }
    const keys = key.split('.');
    if (keys.length === 1) {
        return result(`目标值不存在，key: ${key}`);
    }
    const first = keys.shift();
    if (!Object.prototype.hasOwnProperty.call(target, first)) {
        return result(`目标值不存在, key: ${first}`);
    }
    return getProperty(target[first], keys.join('.'));
}

/**
 * @param err
 * @param value
 * @return {{err: *, value: *}}
 */
function result(err, value = null) {
    return { err: err ? `error ==> ${err}` : err, value };
}

// 取值操作
module.exports = getProperty;
