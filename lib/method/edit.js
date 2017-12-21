const readline = require('readline');
const trace = require('../util/trace');
const print = require('../util/print');
const command = require('./edit/edit_command');
const getProperty = require('./edit/edit_get');
const { setProperty, cpProperty } = require('./edit/edit_set');

module.exports = (obj, path) => {
    print(obj);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `${path} > `,
    });

    rl.param = {
        source: obj,
        target: JSON.parse(JSON.stringify(obj)),
        path,
    };
    const commands = rl.param.commands = command.define(rl);
    rl.param.helpStr = `
    特殊命令使用说明: 
        ${commands.map((item, i) => `${i + 1}. ${item.desc}`).join('\n\t')}
        
    关于key的表示方法说明：
        1. 对多个键同时进行操作时，需使用空格来分隔，如删除多个键：-d k1 k2 k3
        2. 使用'.'表示父子级关系，如：k1.k2 = 123
        3. 以上两种表示方法可以结合使用，如：k1 k2.k3 == k3.k4
        4. '.'前后所连接的空格会被清空
        5. key的可用字符包括[a-zA-Z0-9_];
    
    value类型表示方法示例
        'abc'：表示值为字符串abc
        []：表示值为数组
        {}: 表示值为Object对象
        123: 表示值为数字123
        true|false: 表示bool值
        null: 表示null值
        不支持undefined、NaN
        
    若要查看键上的值，直接输入对应的键即可，如：key，不支持多键同时取值
    
    赋值方法说明('='为赋值，'=='为拷贝值)：
        1. 普通赋值: key = value
        2. 多个键赋相同值: key1 key2 = value
        3. 拷贝某键的值: key1 == key2
        4. 多个键拷贝值：key1 key2 == key3
        5. 赋值操作时，右值可为多个键，左值必须只能是一个
        6. 左值不能有单引号或双引号
    
    `;

    rl.on('line', (line) => {
        // 查看是否是特殊命令
        const isCommand = rl.param.commands.some(cmd => cmd.handle(line));
        if (isCommand) {
            return;
        }
        // 赋值操作
        let reg = /^\s*\w+(\.\w+)*(\s+\w+(\.\w+)*)*\s*=\s*((null)|(true)|(false)|(-?\s*\d\.?\d*)|('.*')|(\{\})|(\[\]))+\s*$/;
        if (reg.test(line)) {
            setProperty(rl.param.target, line);
            rl.prompt();
            return;
        }
        // 拷贝值
        reg = /^\s*\w+(\.\w+)*(\s+\w+(\.\w+)*)*\s*==\s*\w+(\.\w+)*\s*$/;
        if (reg.test(line)) {
            cpProperty(rl.param.target, line);
            rl.prompt();
            return;
        }
        // 尝试取值
        const key = line.replace(/\s+/g, '');
        if (/^\s*\w+(\.\w+)*\s*$/.test(key)) {
            const { err, value } = getProperty(rl.param.target, key);
            if (err) {
                trace(err);
            } else {
                print(value);
            }
        } else {
            trace(`输入无法解析: ${line}`);
        }
        rl.prompt();
    }).on('close', () => {
        trace('bye!');
        process.exit(0);
    });

    rl.prompt();
};
