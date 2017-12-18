

module.exports = (...args) => {
    args.forEach(arg => process.stdout.write(`${arg}\n`));
};
