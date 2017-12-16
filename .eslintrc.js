module.exports = {
    "extends": "airbnb-base",
	"env": {
		"browser": false,
		"node": true,
		"mocha": false,
		'commonjs': true,
		'es6': true
	},
	"rules":{
        // 缩进风格
		"indent": [2, 4],
        // 方法的()可换行
        "function-paren-newline": ["error", "never"],
        // 行参值的属性可变更，引用不可变更
        "no-param-reassign": ["error", { "props": false }],
        // 连续赋值与多行赋值
        "no-multi-assign": "off",
        // 禁用语法
        // "no-restricted-syntax": ["error", "FunctionExpression", "WithStatement", "BinaryExpression[operator='in']"],
        "no-restricted-syntax": ["error", "WithStatement", "BinaryExpression[operator='in']"],
        // new语句后的构造函数可不必大写字母开头，因message中的协议文件均为非大写开头协议
        "new-cap": ["error", { "newIsCap": false }],
        // 换行符限定
        "linebreak-style": ["off", "unix"],
        // 解构，只对object使用，array解构可读性较差
        "prefer-destructuring": ["error", {"object": true, "array": false}],
        // 先定义后使用，对函数暂不使用
        "no-use-before-define": ["error", { "functions": false, "classes": true }],
        // 外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
        "no-shadow": ["error", {"allow": ["err", "reply"] }],
        // 不检查switch语法是否有default-case
        "default-case": "off",
        // 禁止混合使用不同的操作符
        "no-mixed-operators": ["error", {"groups": [["&", "|", "^", "~", "<<", ">>", ">>>"], ["&&", "||"]]}]
	}
};