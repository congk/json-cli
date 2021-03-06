

const fs = require('fs');
const program = require('commander');
const trace = require('./lib/util/trace');
const verify = require('./lib/method/verify');
const format = require('./lib/method/format');
const uglify = require('./lib/method/uglify');
const edit = require('./lib/method/edit');

const methods = ['verify', 'format', 'uglify', 'edit'];
const handles = [verify, format, uglify, edit];

program
    .version('1.0.0')
    .usage('[options] <path>')
    .description('json编辑工具')
    .option('-v, --verify <path>', '验证json文件格式是否正确')
    .option('-e, --edit <path>', '编辑|创建json文件')
    .option('-f, --format <path>', '格式化json文件并保存')
    .option('-u, --uglify <path>', '压缩json文件并保存')
    .option('-t, --type [rootType]', '指定生成json文件的根节点类型，可用类型包括\'obj\'或\'arr\'', 'obj')
    .parse(process.argv);

const done = methods.some((method, index) => {
    const path = program[method];
    if (!path) {
        return false;
    }
    const exits = fs.existsSync(path);
    const isEdit = method === 'edit';

    if (!exits && !isEdit) {
        trace(`No such file on the path: ${path}`);
    } else {
        let content = null;
        if (exits) {
            content = JSON.parse(fs.readFileSync(path, 'utf8'));
        } else {
            content = program.type === 'obj' ? {} : [];
        }
        try {
            handles[index](content, path);
        } catch (err) {
            trace(err);
        }
    }
    return true;
});
if (!done) {
    program.outputHelp();
}
