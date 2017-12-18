

const fs = require('fs');

const command = module.exports;
const trace = require('../../util/trace');

function parse(rl, method) {
    const { param } = rl;
    const { source, target, path } = param;
    return method(source, target, path);
}

function saveFile(path, target) {
    fs.writeFileSync(path, JSON.stringify(target, null, '  '), 'utf8');
}

function define(desc, handle) {
    return { desc, handle };
}
const handles = [
    define('放弃修改并退出: -q', rl => (line) => {
        if (line.replace(/\s+/g, '') === '-q') {
            rl.close();
            return true;
        }
        return false;
    }),
    define('保存修改: -s', rl => parse(rl, (source, target, path) => (line) => {
        if (line.replace(/\s+/g, '') === '-s') {
            saveFile(path, target);
            rl.param.source = target;
            rl.param.target = target instanceof Array ? [] : {};
            rl.prompt();
            return true;
        }
        return false;
    })),
    define('保存修改并退出: -wq', rl => parse(rl, (source, target, path) => (line) => {
        if (line.replace(/\s+/g, '') === '-wq') {
            saveFile(path, target);
            rl.close();
            return true;
        }
        return false;
    })),
    define('删除指定键: -d key，删除多个键时以空格分隔', rl => parse(rl, (source, target) => (line) => {
        const reg = /^(\s*-d\s+)/;
        if (reg.test(line)) {
            // 清理'.'附近的所有空字符
            // 以空字符对参数进行分割找出所有key
            const keys = line.replace(reg, '').replace(/\s*\.+\s*/g, '.').split(/\s+/);
            keys.forEach(key => deleteKey(target, key));
            trace('done');
            rl.prompt();
            return true;
        }
        return false;
    })),
    define('清空json文件，只保留root节点: -flush', rl => parse(rl, (source, target) => (line) => {
        if (line.replace(/\s+/g, '') === '-flush') {
            rl.param.target = target instanceof Array ? [] : {};
            rl.prompt();
            return true;
        }
        return false;
    })),
    define('恢复到文件打开时的状态: -clear', rl => parse(rl, (source => (line) => {
        if (line.replace(/\s+/g, '') === '-clear') {
            rl.param.target = JSON.parse(JSON.stringify(source));
            rl.prompt();
            return true;
        }
        return false;
    }))),
    define('查看帮助说明: -h', rl => (line) => {
        if (line.replace(/\s+/g, '') === '-h') {
            trace(rl.param.helpStr);
            rl.prompt();
            return true;
        }
        return false;
    }),
];

command.define = rl => handles.map(item => Object.assign(item, { handle: item.handle(rl) }));

function deleteKey(target, key) {
    trace(`delete key => ${key}`);
    if (target instanceof Array) {
        if (/^[0-9]+$/.test(key)) {
            // 删除数组元素
            const index = parseInt(key, 10);
            if (index >= target.length) {
                trace(`目标索引 ${index} 超出了目标数组长度！`);
            } else {
                // 删除元素
                target.splice(index, 1);
            }
        } else if (/^[0-9]+(\.[0-9]+)*$/.test(key)) {
            // 删除多维数组元素
            const indexes = key.split('.');
            deleteKey(target[indexes.shift()], indexes.join('.'));
        } else {
            trace(`目标值是数组，索引值需是数字: ${key}`);
        }
    } else if (target instanceof Object) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            delete target[key];
        } else if (/^.+\..+$/.test(key)) {
            const keys = key.split('.');
            const subTarget = target[keys.shift()];
            deleteKey(subTarget, keys.join('.'));
        } else {
            trace(`未找到键: ${key}`);
        }
    } else {
        trace(`目标是值类型 => target: ${target}, key: ${key}`);
    }
}
