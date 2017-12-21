
const Path = require('path');
const fs = require('fs');

const command = module.exports;
const trace = require('../../util/trace');
const print = require('../../util/print');
const getProperty = require('./edit_get');

function parse(rl, callback) {
    const { param } = rl;
    const { source, target, path } = param;
    callback(source, target, path);
}

function saveFile(path, target) {
    let tempPath = '';
    const paths = path.split(/\/+/);
    // 逐级检查目录
    for (let i = 0; i < paths.length - 1; i += 1) {
        tempPath = Path.join(tempPath, paths[i]);
        if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath);
        }
    }
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
    define('保存修改: -s', rl => (line) => {
        if (line.replace(/\s+/g, '') === '-s') {
            parse(rl, (source, target, path) => {
                saveFile(path, target);
                rl.param.source = target;
                rl.param.target = target instanceof Array ? [] : {};
                rl.prompt();
            });
            return true;
        }
        return false;
    }),
    define('保存修改并退出: -wq', rl => (line) => {
        if (line.replace(/\s+/g, '') === '-wq') {
            parse(rl, (source, target, path) => {
                saveFile(path, target);
                rl.close();
            });
            return true;
        }
        return false;
    }),
    define('删除指定键: -d key，删除多个键时以空格分隔', rl => (line) => {
        if (/^\s*-d\s+\w+(\.\w+)*(\s+\w+(\.\w+)*)*\s*$/.test(line)) {
            parse(rl, (source, target) => {
                // 以空字符对参数进行分割找出所有key
                const keys = line.replace(/(^\s*-d\s+)|(\s*$)/g, '').split(/\s+/);
                const error = keys.filter(key => !deleteKey(target, key));
                print(target);
                if (error.length) {
                    trace(`>>> error: ${JSON.stringify(error)}`);
                }
                rl.prompt();
            });
            return true;
        }
        return false;
    }),
    define('清空json文件，只保留root节点: -flush', rl => (line) => {
        if (line.replace(/\s+/g, '') === '-flush') {
            parse(rl, (source, target) => {
                rl.param.target = target instanceof Array ? [] : {};
                print(target);
                rl.prompt();
            });
            return true;
        }
        return false;
    }),
    define('恢复到文件打开时的状态: -clear', rl => (line) => {
        if (line.replace(/\s+/g, '') === '-clear') {
            parse(rl, (source) => {
                rl.param.target = JSON.parse(JSON.stringify(source));
                print(rl.param.target);
                rl.prompt();
            });
            return true;
        }
        return false;
    }),
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

/**
 * @param target
 * @param key
 * @return {boolean}
 */
function deleteKey(target, key) {
    if (!(target instanceof Object)) {
        return false;
    }
    const keys = key.split('.');
    if (keys.length > 1) {
        const { err, value } = getProperty(target, keys.slice(0, -1).join('.'));
        if (err) {
            return false;
        }
        return deleteKey(value, keys.pop());
    }
    return delete target[key];
}
