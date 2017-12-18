# json-cli json文件编辑及验证工具

# install
```bash
git clone <this rep> <path>
cd path
yarn install
npm i -g ./
```

# usage
```bash
json [-h]
```
```
  Usage: json [options] <path>

  json编辑工具


  Options:

    -V, --version          output the version number
    -v, --verify <path>    验证json文件格式是否正确
    -e, --edit <path>      编辑|创建json文件
    -f, --format <path>    格式化json文件并保存
    -u, --uglify <path>    压缩json文件并保存
    -t, --type [rootType]  指定生成json文件的根节点类型，可用类型包括'obj'或'arr' (default: obj)
    -h, --help             output usage information

```

# edit
```bash
test/test.json > -h
```
```bash
    特殊命令使用说明: 
        1. 放弃修改并退出: -q
        2. 保存修改: -s
        3. 保存修改并退出: -wq
        4. 删除指定键: -d key，删除多个键时以空格分隔
        5. 清空json文件，只保留root节点: -flush
        6. 恢复到文件打开时的状态: -clear
        7. 查看帮助说明: -h
        
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
```