const trace = require('../../util/trace');
// const print = require('../../util/print');

// todo 赋值操作
module.exports = (target, key) => {
    trace(`赋值操作: ${key}`);
};
